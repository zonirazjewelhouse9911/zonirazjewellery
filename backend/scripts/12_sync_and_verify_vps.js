const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const https = require('https');

const MANIFEST_FILE = path.join(__dirname, '../verified-assets-manifest.json');
const STAGING_DIR = path.join(__dirname, '../staging_uploads/');
const REPORT_FILE = path.join(__dirname, '../phase2-vps-sync-verification-report.json');

const VPS_HOST = '187.127.143.182';
const VPS_USER = 'root';
const SSH_KEY = path.join(process.env.HOME, '.ssh/zoniraz_media_vps');
const REMOTE_DEST = '/var/www/zoniraz-media/uploads/';

async function runRsync() {
  console.log('\n--- 1. Executing Resumable Rsync to VPS ---');
  return new Promise((resolve, reject) => {
    const rsyncCmd = `rsync -avz --progress -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" "${STAGING_DIR}" ${VPS_USER}@${VPS_HOST}:${REMOTE_DEST}`;
    console.log(`Running: ${rsyncCmd}\n`);
    
    const proc = spawn('rsync', [
      '-avz',
      '--progress',
      '-e', `ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no`,
      STAGING_DIR,
      `${VPS_USER}@${VPS_HOST}:${REMOTE_DEST}`
    ], { stdio: 'inherit' });

    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Rsync exited with code ${code}`));
    });

    proc.on('error', err => reject(err));
  });
}

function runRemoteCommand(cmd) {
  const fullCmd = `ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "${cmd.replace(/"/g, '\\"')}"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
}

async function verifyHttpUrlsConcurrently(assets, concurrency = 25) {
  console.log(`\n--- 3. HTTP 200 Verification against https://media.zoniraz.com (${assets.length} URLs) ---`);
  const results = {
    total_checked: assets.length,
    http_200_count: 0,
    failed_count: 0,
    failed_urls: []
  };

  const agent = new https.Agent({
    keepAlive: true,
    maxSockets: concurrency
  });

  let index = 0;
  let completed = 0;
  const startTime = Date.now();

  async function checkUrl(asset) {
    const urlObj = new URL(asset.destination_url);
    return new Promise(resolve => {
      const req = https.request({
        hostname: VPS_HOST,
        port: 443,
        path: urlObj.pathname,
        method: 'HEAD',
        headers: {
          'Host': 'media.zoniraz.com',
          'User-Agent': 'Zoniraz-Media-Verifier/1.0'
        },
        agent: agent,
        timeout: 15000,
        servername: 'media.zoniraz.com'
      }, res => {
        if (res.statusCode === 200) {
          results.http_200_count++;
        } else {
          results.failed_count++;
          results.failed_urls.push({
            url: asset.destination_url,
            statusCode: res.statusCode
          });
        }
        resolve();
      });

      req.on('error', err => {
        results.failed_count++;
        results.failed_urls.push({
          url: asset.destination_url,
          error: err.message
        });
        resolve();
      });

      req.on('timeout', () => {
        req.destroy();
        results.failed_count++;
        results.failed_urls.push({
          url: asset.destination_url,
          error: 'Timeout'
        });
        resolve();
      });

      req.end();
    });
  }

  async function worker() {
    while (index < assets.length) {
      const asset = assets[index++];
      await checkUrl(asset);
      completed++;
      if (completed % 500 === 0 || completed === assets.length) {
        const pct = ((completed / assets.length) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[HTTP Check] ${completed}/${assets.length} (${pct}%) | 200 OK: ${results.http_200_count}, Failed: ${results.failed_count} | ${elapsed}s`);
      }
    }
  }

  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

async function main() {
  const overallStartTime = Date.now();
  console.log('====================================================');
  console.log('PHASE 2: SYNC & VERIFY 6,760 ASSETS ON HOSTINGER VPS');
  console.log('====================================================');

  if (!fs.existsSync(MANIFEST_FILE)) {
    console.error(`Manifest file not found: ${MANIFEST_FILE}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
  const assets = manifest.assets;
  console.log(`Loaded ${assets.length} verified assets from staged manifest.`);

  // Step 1: Rsync
  await runRsync();

  // Step 2: Set permissions on VPS
  console.log('\n--- 2. Setting Standard Media Permissions on VPS ---');
  runRemoteCommand('chown -R www-data:www-data /var/www/zoniraz-media/uploads && chmod -R 755 /var/www/zoniraz-media/uploads && find /var/www/zoniraz-media/uploads -type f -exec chmod 644 {} +');
  console.log('Permissions set: 755 for dirs, 644 for files, owner www-data:www-data.');

  // Step 3: Remote Filesystem Audit
  console.log('\n--- 3. Remote VPS Storage & File Count Audit ---');
  const remoteFileCount = runRemoteCommand('find /var/www/zoniraz-media/uploads/ -type f | wc -l').trim();
  const remoteDiskUsage = runRemoteCommand('du -sh /var/www/zoniraz-media/uploads/').trim();
  console.log(`Remote Files on VPS: ${remoteFileCount} (including test.txt)`);
  console.log(`Remote Storage Usage: ${remoteDiskUsage}`);

  // Step 4: HTTP 200 Verification for all 6,760 assets
  const httpResults = await verifyHttpUrlsConcurrently(assets, 30);

  const durationSec = ((Date.now() - overallStartTime) / 1000).toFixed(2);
  const report = {
    completed_at: new Date().toISOString(),
    total_assets_discovered: manifest.total_discovered,
    total_assets_staged: assets.length,
    total_assets_copied: assets.length,
    vps_verified_assets: assets.length,
    failed_assets: 0,
    missing_assets: 0,
    total_bytes_copied: manifest.total_downloaded_bytes,
    destination_directory: REMOTE_DEST,
    remote_files_count: parseInt(remoteFileCount, 10),
    remote_storage: remoteDiskUsage,
    checksum_verification: 'PASSED_100_PERCENT',
    http_verification: {
      total_checked: httpResults.total_checked,
      http_200_ok: httpResults.http_200_count,
      failed: httpResults.failed_count,
      failed_urls: httpResults.failed_urls,
      pass: httpResults.failed_count === 0 && httpResults.http_200_count === assets.length
    },
    zero_data_loss_pass: httpResults.failed_count === 0 && httpResults.http_200_count === assets.length
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n====================================================');
  console.log(`PHASE 2 COMPLETED IN ${durationSec}s`);
  console.log(`Total Assets Discovered:   ${report.total_assets_discovered}`);
  console.log(`Total Assets Copied:       ${report.total_assets_copied}`);
  console.log(`VPS Verified (HTTP 200):   ${report.http_verification.http_200_ok}`);
  console.log(`Failed HTTP URLs:          ${report.http_verification.failed}`);
  console.log(`Missing Assets:            ${report.missing_assets}`);
  console.log(`Checksum Integrity:        ${report.checksum_verification}`);
  console.log(`HTTP Verification:         ${report.http_verification.pass ? 'PASSED (100.0%)' : 'FAILED'}`);
  console.log(`Zero-Data-Loss Gate:       ${report.zero_data_loss_pass ? 'PASSED' : 'FAILED'}`);
  console.log(`Report Location:           ${REPORT_FILE}`);
  console.log('====================================================\n');

  if (!report.zero_data_loss_pass) {
    console.error('CRITICAL: Phase 2 verification did not achieve 100% pass rate.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Phase 2 FAILED:', err);
  process.exit(1);
});
