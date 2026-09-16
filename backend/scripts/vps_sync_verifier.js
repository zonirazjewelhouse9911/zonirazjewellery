const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const MANIFEST_FILE = '/root/verified-assets-manifest.json';
const UPLOADS_DIR = '/var/www/zoniraz-media/uploads';
const REPORT_FILE = '/root/phase2-vps-sync-verification-report.json';

const CONCURRENCY = 35;

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

async function verifyHttpHead(urlPath, port = 443) {
  return new Promise(resolve => {
    const req = https.request({
      hostname: '127.0.0.1',
      port: port,
      path: urlPath,
      method: 'HEAD',
      headers: {
        'Host': 'media.zoniraz.com',
        'User-Agent': 'Zoniraz-VPS-Verifier/1.0'
      },
      rejectUnauthorized: false,
      timeout: 10000,
      servername: 'media.zoniraz.com'
    }, res => {
      resolve(res.statusCode);
    });

    req.on('error', () => resolve(0));
    req.on('timeout', () => {
      req.destroy();
      resolve(0);
    });
    req.end();
  });
}

async function main() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('VPS HIGH-SPEED MEDIA SYNC & SHA-256 VERIFICATION');
  console.log('====================================================');

  if (!fs.existsSync(MANIFEST_FILE)) {
    console.error(`Manifest file not found at ${MANIFEST_FILE}`);
    process.exit(1);
  }

  const manifestData = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
  const assets = manifestData.assets;
  console.log(`Loaded ${assets.length} assets from manifest.`);

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const verified = [];
  const failed = [];
  let skipped = 0;
  let copied = 0;
  let totalBytes = 0;
  let completed = 0;

  async function processAsset(asset) {
    const destPath = path.join(UPLOADS_DIR, asset.destination_relative_path);
    let success = false;
    let attempts = 0;

    while (!success && attempts < 3) {
      attempts++;
      try {
        let needsDownload = true;
        if (fs.existsSync(destPath)) {
          const stat = fs.statSync(destPath);
          if (stat.size === asset.destination_bytes) {
            const sha = await computeSha256(destPath);
            if (sha === asset.destination_sha256) {
              needsDownload = false;
              skipped++;
            }
          }
        }

        if (needsDownload) {
          await downloadFile(asset.source_url, destPath);
          const stat = fs.statSync(destPath);
          const sha = await computeSha256(destPath);

          if (sha !== asset.destination_sha256) {
            throw new Error(`SHA256 mismatch: expected ${asset.destination_sha256}, got ${sha}`);
          }
          copied++;
        }

        const stat = fs.statSync(destPath);
        totalBytes += stat.size;

        verified.push({
          public_id: asset.public_id,
          path: asset.destination_relative_path,
          bytes: stat.size,
          sha256: asset.destination_sha256,
          status: 'VERIFIED'
        });

        success = true;
      } catch (err) {
        if (attempts >= 3) {
          failed.push({
            public_id: asset.public_id,
            url: asset.source_url,
            error: err.message
          });
        } else {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    completed++;
    if (completed % 500 === 0 || completed === assets.length) {
      const pct = ((completed / assets.length) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Sync & Verify] ${completed}/${assets.length} (${pct}%) | Verified: ${verified.length}, Copied: ${copied}, Skipped: ${skipped}, Failed: ${failed.length} | Elapsed: ${elapsed}s`);
    }
  }

  let index = 0;
  async function worker() {
    while (index < assets.length) {
      const a = assets[index++];
      await processAsset(a);
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  // Set proper permissions
  console.log('\nSetting file permissions...');
  const { execSync } = require('child_process');
  execSync(`chown -R www-data:www-data /var/www/zoniraz-media/uploads && chmod -R 755 /var/www/zoniraz-media/uploads && find /var/www/zoniraz-media/uploads -type f -exec chmod 644 {} +`);

  // Step 2: HTTP 200 Verification for all 6,760 assets
  console.log('\n--- Running Complete HTTP 200 Verification on Nginx ---');
  let httpCompleted = 0;
  let http200Count = 0;
  let httpFailedCount = 0;
  const httpFailedList = [];
  const httpStartTime = Date.now();

  let httpIndex = 0;
  async function httpWorker() {
    while (httpIndex < assets.length) {
      const a = assets[httpIndex++];
      const urlPath = `/uploads/${a.destination_relative_path}`;
      const status = await verifyHttpHead(urlPath);
      if (status === 200) {
        http200Count++;
      } else {
        httpFailedCount++;
        httpFailedList.push({ path: urlPath, status });
      }

      httpCompleted++;
      if (httpCompleted % 500 === 0 || httpCompleted === assets.length) {
        const pct = ((httpCompleted / assets.length) * 100).toFixed(1);
        const elapsed = ((Date.now() - httpStartTime) / 1000).toFixed(1);
        console.log(`[HTTP 200 Audit] ${httpCompleted}/${assets.length} (${pct}%) | 200 OK: ${http200Count}, Failed: ${httpFailedCount} | ${elapsed}s`);
      }
    }
  }

  const httpWorkers = [];
  for (let i = 0; i < 30; i++) {
    httpWorkers.push(httpWorker());
  }
  await Promise.all(httpWorkers);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const finalReport = {
    completed_at: new Date().toISOString(),
    total_discovered: manifestData.total_discovered,
    total_staged: assets.length,
    total_assets_copied: copied,
    total_assets_skipped_already_verified: skipped,
    total_assets_verified: verified.length,
    failed_assets: failed.length,
    missing_assets: assets.length - verified.length,
    total_bytes_verified: totalBytes,
    destination_directory: UPLOADS_DIR,
    checksum_verification: verified.length === assets.length ? 'PASSED_100_PERCENT' : 'FAILED',
    http_verification: {
      total_checked: assets.length,
      http_200_count: http200Count,
      failed_count: httpFailedCount,
      failed_urls: httpFailedList,
      pass: http200Count === assets.length && httpFailedCount === 0
    },
    zero_data_loss_pass: verified.length === assets.length && failed.length === 0 && http200Count === assets.length
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(finalReport, null, 2), 'utf-8');

  console.log('\n====================================================');
  console.log(`PHASE 2 SUCCESS: COMPLETED IN ${durationSec}s`);
  console.log(`Total Assets Discovered:   ${finalReport.total_discovered}`);
  console.log(`Total Assets Copied:       ${finalReport.total_assets_copied}`);
  console.log(`Total Already Verified:    ${finalReport.total_assets_skipped_already_verified}`);
  console.log(`Total Assets Verified:     ${finalReport.total_assets_verified}`);
  console.log(`Failed Assets:             ${finalReport.failed_assets}`);
  console.log(`Missing Assets:            ${finalReport.missing_assets}`);
  console.log(`Total Bytes Verified:      ${(finalReport.total_bytes_verified / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Checksum Verification:     ${finalReport.checksum_verification}`);
  console.log(`HTTP 200 URLs Verified:    ${finalReport.http_verification.http_200_count} / ${assets.length}`);
  console.log(`Failed HTTP URLs:          ${finalReport.http_verification.failed_count}`);
  console.log(`Zero-Data-Loss Gate:       ${finalReport.zero_data_loss_pass ? 'PASSED (100.0%)' : 'FAILED'}`);
  console.log(`Report File on VPS:        ${REPORT_FILE}`);
  console.log('====================================================\n');

  if (!finalReport.zero_data_loss_pass) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Execution FAILED:', err);
  process.exit(1);
});
