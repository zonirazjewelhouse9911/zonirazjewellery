const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkVps() {
  console.log('====================================================');
  console.log('STEP 5: VPS CONNECTIVITY & STORAGE AUDIT');
  console.log('====================================================');

  const vpsHost = process.env.VPS_HOST;
  const vpsUser = process.env.VPS_USER || 'root';
  const vpsKey = process.env.VPS_SSH_KEY_PATH;

  if (!vpsHost) {
    console.log('[INFO] VPS_HOST environment variable not set in .env.');
    console.log('Please provide VPS IP / Host, SSH User, and SSH Key to execute remote VPS setup.');
    return;
  }

  console.log(`Testing SSH connection to ${vpsUser}@${vpsHost}...`);
  try {
    const keyFlag = vpsKey ? `-i "${vpsKey}"` : '';
    const output = execSync(`ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ${keyFlag} ${vpsUser}@${vpsHost} "df -h / && uname -a && nginx -v 2>&1"`, { encoding: 'utf-8' });
    console.log('VPS SSH Output:\n', output);
  } catch (err) {
    console.error('VPS SSH Connection test failed:', err.message);
  }
}

checkVps();
