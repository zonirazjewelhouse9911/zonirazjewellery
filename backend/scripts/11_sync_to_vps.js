const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STAGING_DIR = path.join(__dirname, '../staging_uploads/');
const REMOTE_DEST = '/var/www/zoniraz-media/uploads/';

async function syncToVps() {
  console.log('====================================================');
  console.log('STEP 11: SYNC VERIFIED STAGED ASSETS TO VPS');
  console.log('====================================================');

  const vpsHost = process.env.VPS_HOST;
  const vpsUser = process.env.VPS_USER || 'root';
  const vpsKey = process.env.VPS_SSH_KEY_PATH;

  if (!vpsHost) {
    console.log('[INFO] VPS_HOST is not set. The 6,760 verified assets are staged locally at:');
    console.log(STAGING_DIR);
    console.log('\nTo deploy to VPS, run:');
    console.log(`rsync -avz --progress ${STAGING_DIR} ${vpsUser}@<VPS_HOST>:${REMOTE_DEST}`);
    console.log(`ssh ${vpsUser}@<VPS_HOST> "chown -R www-data:www-data /var/www/zoniraz-media && chmod -R 755 /var/www/zoniraz-media"`);
    return;
  }

  const sshOpt = vpsKey ? `-e "ssh -i ${vpsKey} -o StrictHostKeyChecking=no"` : '-e "ssh -o StrictHostKeyChecking=no"';

  console.log(`Creating remote target directory ${REMOTE_DEST} on ${vpsHost}...`);
  const keyFlag = vpsKey ? `-i "${vpsKey}"` : '';
  execSync(`ssh -o StrictHostKeyChecking=no ${keyFlag} ${vpsUser}@${vpsHost} "mkdir -p ${REMOTE_DEST}"`, { stdio: 'inherit' });

  console.log(`Syncing staged assets to ${vpsUser}@${vpsHost}:${REMOTE_DEST}...`);
  execSync(`rsync -avz --progress ${sshOpt} "${STAGING_DIR}" ${vpsUser}@${vpsHost}:${REMOTE_DEST}`, { stdio: 'inherit' });

  console.log('Setting permissions on VPS...');
  execSync(`ssh -o StrictHostKeyChecking=no ${keyFlag} ${vpsUser}@${vpsHost} "chown -R www-data:www-data /var/www/zoniraz-media && chmod -R 755 /var/www/zoniraz-media"`, { stdio: 'inherit' });

  console.log('====================================================');
  console.log('SUCCESS: Staged assets successfully synced to VPS!');
  console.log('====================================================');
}

syncToVps().catch(err => {
  console.error('Error during VPS sync:', err.message);
  process.exit(1);
});
