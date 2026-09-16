const fs = require('fs');
const path = require('path');

const STATIC_INVENTORY_FILE = path.join(__dirname, '../static-code-media-inventory.json');
const ROOT_DIR = path.resolve(__dirname, '../../');

function transformCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  let afterUpload = url.substring(uploadIndex + 8);
  const parts = afterUpload.split('/');
  let pathSegments = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^v\d+$/.test(part)) {
      pathSegments = parts.slice(i + 1);
      break;
    } else if (part.includes(',') || part.startsWith('w_') || part.startsWith('c_') || part.startsWith('f_') || part.startsWith('q_')) {
      continue;
    } else {
      pathSegments = parts.slice(i);
      break;
    }
  }

  const cleanRelativePath = pathSegments.join('/');
  return `https://media.zoniraz.com/uploads/${cleanRelativePath}`;
}

function runCodeMigration() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 10: STATIC CODE MEDIA URL MIGRATION');
  console.log('====================================================');

  if (!fs.existsSync(STATIC_INVENTORY_FILE)) {
    console.error(`Static inventory file not found: ${STATIC_INVENTORY_FILE}`);
    process.exit(1);
  }

  const staticInventory = JSON.parse(fs.readFileSync(STATIC_INVENTORY_FILE, 'utf-8'));
  const occurrences = staticInventory.occurrences;

  // Group by file
  const fileGroups = {};
  occurrences.forEach(occ => {
    // Only migrate actual project source files
    if (
      occ.file.startsWith('frontend/src') ||
      occ.file.startsWith('adminSide/src') ||
      occ.file.startsWith('backend/src/config/pendantAssetInventory.json')
    ) {
      if (!fileGroups[occ.file]) fileGroups[occ.file] = [];
      fileGroups[occ.file].push(occ.url);
    }
  });

  const modifiedFiles = [];
  let totalReplacements = 0;

  for (const relFile of Object.keys(fileGroups)) {
    const fullPath = path.join(ROOT_DIR, relFile);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf-8');
    let fileReplaced = 0;

    // Unique URLs in this file, sorted by length descending to prevent partial match collision
    const urls = Array.from(new Set(fileGroups[relFile])).sort((a, b) => b.length - a.length);

    for (const oldUrl of urls) {
      const newUrl = transformCloudinaryUrl(oldUrl);
      if (oldUrl !== newUrl && content.includes(oldUrl)) {
        // Replace all occurrences of oldUrl
        const regex = new RegExp(oldUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        content = content.replace(regex, newUrl);
        fileReplaced++;
        totalReplacements++;
      }
    }

    if (fileReplaced > 0) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      modifiedFiles.push({ file: relFile, replacements: fileReplaced });
      console.log(`[Code Migrated] ${relFile}: replaced ${fileReplaced} Cloudinary URLs.`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('====================================================');
  console.log(`COMPLETED Static Code Migration in ${durationSec}s`);
  console.log(`Files Modified:      ${modifiedFiles.length}`);
  console.log(`Total URLs Replaced: ${totalReplacements}`);
  console.log('====================================================');
}

runCodeMigration();
