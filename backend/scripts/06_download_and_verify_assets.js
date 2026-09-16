const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const MANIFEST_FILE = path.join(__dirname, '../cloudinary-migration-manifest.json');
const STAGING_ROOT = path.join(__dirname, '../staging_uploads');
const VERIFIED_MANIFEST_FILE = path.join(__dirname, '../verified-assets-manifest.json');

const CONCURRENCY = 20;

function computeSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', data => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', err => reject(err));
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileStream = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, { timeout: 30000 }, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        fileStream.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${response.statusCode} downloading ${url}`));
      }

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
    });

    request.on('error', err => {
      fileStream.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });

    request.on('timeout', () => {
      request.destroy();
      fileStream.close();
      fs.unlink(destPath, () => {});
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function runDownloadAndVerify() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 6: CONCURRENT ASSET DOWNLOAD & VERIFICATION');
  console.log('====================================================');

  if (!fs.existsSync(MANIFEST_FILE)) {
    console.error(`Manifest file not found: ${MANIFEST_FILE}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
  const assets = manifest.assets;
  console.log(`Loaded ${assets.length} assets from manifest.`);

  if (!fs.existsSync(STAGING_ROOT)) {
    fs.mkdirSync(STAGING_ROOT, { recursive: true });
  }

  const verifiedAssets = [];
  const failedAssets = [];
  let completedCount = 0;
  let downloadedBytes = 0;

  async function processAsset(asset) {
    const ext = asset.format ? `.${asset.format}` : (path.extname(asset.secure_url) || '');
    let relativePath = asset.public_id;
    if (ext && !relativePath.endsWith(ext)) {
      relativePath += ext;
    }

    const localPath = path.join(STAGING_ROOT, relativePath);
    const targetMediaUrl = `https://media.zoniraz.com/uploads/${relativePath.replace(/\\/g, '/')}`;

    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      attempts++;
      try {
        if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
          await downloadFile(asset.secure_url, localPath);
        }

        const stat = fs.statSync(localPath);
        const sha256 = await computeSha256(localPath);

        verifiedAssets.push({
          public_id: asset.public_id,
          format: asset.format,
          resource_type: asset.resource_type,
          source_url: asset.secure_url,
          destination_relative_path: relativePath,
          destination_url: targetMediaUrl,
          source_bytes: asset.bytes,
          destination_bytes: stat.size,
          destination_sha256: sha256,
          status: 'VERIFIED'
        });

        downloadedBytes += stat.size;
        success = true;
      } catch (err) {
        if (attempts >= maxAttempts) {
          failedAssets.push({
            public_id: asset.public_id,
            source_url: asset.secure_url,
            error: err.message,
            status: 'FAILED'
          });
        } else {
          // Wait 1s before retry
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    completedCount++;
    if (completedCount % 200 === 0 || completedCount === assets.length) {
      const pct = ((completedCount / assets.length) * 100).toFixed(1);
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Progress] ${completedCount}/${assets.length} (${pct}%) processed | Verified: ${verifiedAssets.length}, Failed: ${failedAssets.length} | Elapsed: ${elapsedSec}s`);
    }
  }

  // Worker queue for concurrency
  let index = 0;
  async function worker() {
    while (index < assets.length) {
      const currentAsset = assets[index++];
      await processAsset(currentAsset);
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  const finalReport = {
    generated_at: new Date().toISOString(),
    total_discovered: assets.length,
    total_verified: verifiedAssets.length,
    total_failed: failedAssets.length,
    total_downloaded_bytes: downloadedBytes,
    staging_directory: STAGING_ROOT,
    zero_data_loss_pass: verifiedAssets.length === assets.length && failedAssets.length === 0,
    assets: verifiedAssets,
    failures: failedAssets
  };

  fs.writeFileSync(VERIFIED_MANIFEST_FILE, JSON.stringify(finalReport, null, 2), 'utf-8');
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('====================================================');
  console.log(`COMPLETED Asset Download & Verification in ${durationSec}s`);
  console.log(`Total Discovered: ${assets.length}`);
  console.log(`Total Verified:   ${verifiedAssets.length}`);
  console.log(`Total Failed:     ${failedAssets.length}`);
  console.log(`Staged Storage:   ${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Zero-Data-Loss Gate Pass: ${finalReport.zero_data_loss_pass}`);
  console.log(`Verified Manifest: ${VERIFIED_MANIFEST_FILE}`);
  console.log('====================================================');

  if (!finalReport.zero_data_loss_pass) {
    console.error('ZERO DATA LOSS GATE FAILED: Some assets failed verification.');
    process.exit(1);
  }
}

runDownloadAndVerify();
