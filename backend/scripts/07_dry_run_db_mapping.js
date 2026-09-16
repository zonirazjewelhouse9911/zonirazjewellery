const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_INVENTORY_FILE = path.join(__dirname, '../database-media-inventory.json');
const VERIFIED_MANIFEST_FILE = path.join(__dirname, '../verified-assets-manifest.json');
const DRY_RUN_REPORT_FILE = path.join(__dirname, '../db-migration-dry-run-report.json');

function mapCloudinaryUrlToVps(cloudinaryUrl) {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') return cloudinaryUrl;

  // Cloudinary URL structure:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/[v<version>/]<public_id>.<format>
  // or with transformations:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/[transformations/][v<version>/]<public_id>.<format>
  
  // Extract path after /upload/
  const uploadIndex = cloudinaryUrl.indexOf('/upload/');
  if (uploadIndex === -1) return cloudinaryUrl;

  let afterUpload = cloudinaryUrl.substring(uploadIndex + 8);

  // Strip any leading transformations (e.g. f_auto,q_auto/, w_200,h_200,c_fill,q_auto,f_auto/)
  // Transformations don't start with v\d{6,} unless it's a version tag
  const parts = afterUpload.split('/');
  let pathSegments = [];
  let foundVersionOrPath = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^v\d+$/.test(part)) {
      // Version tag - skip it to get clean public_id and path
      foundVersionOrPath = true;
      pathSegments = parts.slice(i + 1);
      break;
    } else if (part.includes(',') || part.startsWith('w_') || part.startsWith('c_') || part.startsWith('f_') || part.startsWith('q_')) {
      // Transformation parameter - skip
      continue;
    } else {
      // It's the beginning of the public_id / folder path
      pathSegments = parts.slice(i);
      break;
    }
  }

  const cleanRelativePath = pathSegments.join('/');
  return `https://media.zoniraz.com/uploads/${cleanRelativePath}`;
}

async function runDryRunMapping() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 7: DRY-RUN DATABASE URL MIGRATION MAPPING');
  console.log('====================================================');

  if (!fs.existsSync(DB_INVENTORY_FILE)) {
    console.error(`Database inventory file not found: ${DB_INVENTORY_FILE}`);
    process.exit(1);
  }

  const dbInventory = JSON.parse(fs.readFileSync(DB_INVENTORY_FILE, 'utf-8'));
  const uniqueUrls = dbInventory.unique_cloudinary_urls;
  console.log(`Auditing ${uniqueUrls.length} unique Cloudinary URLs from database...`);

  let verifiedManifest = null;
  const verifiedMap = new Map();
  if (fs.existsSync(VERIFIED_MANIFEST_FILE)) {
    verifiedManifest = JSON.parse(fs.readFileSync(VERIFIED_MANIFEST_FILE, 'utf-8'));
    verifiedManifest.assets.forEach(a => {
      verifiedMap.set(a.destination_url, a);
      verifiedMap.set(a.destination_relative_path, a);
    });
    console.log(`Loaded ${verifiedMap.size / 2} verified assets for cross-referencing.`);
  } else {
    console.log('Verified assets manifest not yet available; dry-run mapping will perform structural resolution.');
  }

  const mappings = [];
  let unmappedCount = 0;

  for (const oldUrl of uniqueUrls) {
    const newUrl = mapCloudinaryUrlToVps(oldUrl);
    const relPath = newUrl.replace('https://media.zoniraz.com/uploads/', '');
    const isVerified = verifiedMap.has(newUrl) || verifiedMap.has(relPath);

    if (newUrl === oldUrl || !newUrl.startsWith('https://media.zoniraz.com/uploads/')) {
      unmappedCount++;
    }

    mappings.push({
      old_cloudinary_url: oldUrl,
      new_vps_media_url: newUrl,
      relative_path: relPath,
      exists_in_verified_manifest: isVerified
    });
  }

  const report = {
    generated_at: new Date().toISOString(),
    total_db_urls: uniqueUrls.length,
    successfully_mapped_count: mappings.length - unmappedCount,
    unmapped_count: unmappedCount,
    mappings_sample: mappings.slice(0, 10),
    all_mappings: mappings
  };

  fs.writeFileSync(DRY_RUN_REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('====================================================');
  console.log(`COMPLETED Dry Run Mapping in ${durationSec}s`);
  console.log(`Total URLs Processed:    ${uniqueUrls.length}`);
  console.log(`Successfully Mapped:    ${report.successfully_mapped_count}`);
  console.log(`Unmapped / Anomalies:   ${report.unmapped_count}`);
  console.log(`Dry Run Report:         ${DRY_RUN_REPORT_FILE}`);
  console.log('====================================================');
}

runDryRunMapping();
