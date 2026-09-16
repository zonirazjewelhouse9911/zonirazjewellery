const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const OUTPUT_FILE = path.join(__dirname, '../static-code-media-inventory.json');

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.cache',
  'backups',
  '.gemini',
  '.agents'
]);

function scanDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.ejs', '.md'].includes(ext)) {
        // Exclude the inventory/backup output json files themselves
        if (!entry.name.includes('-inventory.json') && !entry.name.includes('-manifest.json')) {
          fileList.push(fullPath);
        }
      }
    }
  }
  return fileList;
}

function runStaticCodeInventory() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 3: FULL STATIC-CODE MEDIA INVENTORY');
  console.log('====================================================');

  const files = scanDirectory(ROOT_DIR);
  console.log(`Scanned ${files.length} source code files.`);

  const occurrences = [];
  const uniqueUrls = new Set();

  for (const filePath of files) {
    const relPath = path.relative(ROOT_DIR, filePath);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, lineIdx) => {
        const matches = line.match(/https?:\/\/[^"'\s`<>)]*cloudinary\.com[^"'\s`<>)]*/g);
        if (matches) {
          matches.forEach(match => {
            const cleanUrl = match.replace(/[,;]+$/, '');
            uniqueUrls.add(cleanUrl);
            occurrences.push({
              file: relPath,
              line_number: lineIdx + 1,
              url: cleanUrl,
              line_preview: line.trim()
            });
          });
        }
      });
    } catch (err) {
      console.warn(`Could not read ${relPath}:`, err.message);
    }
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    total_occurrences: occurrences.length,
    unique_urls_count: uniqueUrls.size,
    unique_urls: Array.from(uniqueUrls),
    occurrences
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('====================================================');
  console.log(`SUCCESS: Static code media inventory completed in ${durationSec}s`);
  console.log(`Inventory saved to: ${OUTPUT_FILE}`);
  console.log(`Total Cloudinary URL Occurrences in Code: ${occurrences.length}`);
  console.log(`Unique Cloudinary URLs in Code: ${uniqueUrls.size}`);
  console.log('====================================================');
}

runStaticCodeInventory();
