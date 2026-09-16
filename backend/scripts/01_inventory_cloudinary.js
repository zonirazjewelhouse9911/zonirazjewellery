const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cloudinary = require('../src/config/cloudinary');

const OUTPUT_FILE = path.join(__dirname, '../cloudinary-migration-manifest.json');

async function fetchAllResources(resourceType = 'image') {
  console.log(`\n[Cloudinary Inventory] Fetching all '${resourceType}' resources...`);
  let allResources = [];
  let nextCursor = null;
  let page = 1;

  do {
    try {
      const options = {
        resource_type: resourceType,
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor
      };

      const result = await cloudinary.api.resources(options);
      const resources = result.resources || [];
      allResources.push(...resources);
      console.log(`Page ${page}: Retrieved ${resources.length} ${resourceType} items (Total so far: ${allResources.length})`);

      nextCursor = result.next_cursor;
      page++;

      if (result.rate_limit_remaining !== undefined) {
        console.log(`Cloudinary Admin API Rate Limit Remaining: ${result.rate_limit_remaining}/${result.rate_limit_allowed}`);
      }
    } catch (error) {
      console.error(`Error fetching page ${page} for ${resourceType}:`, error.message);
      throw error;
    }
  } while (nextCursor);

  return allResources;
}

async function runInventory() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 1: FULL CLOUDINARY ASSET INVENTORY');
  console.log('====================================================');

  try {
    const usage = await cloudinary.api.usage();
    console.log(`Account Usage - Plan: ${usage.plan}, Total Resources Reported: ${usage.resources}, Storage: ${(usage.storage.usage / (1024 * 1024)).toFixed(2)} MB`);

    const imageResources = await fetchAllResources('image');
    const videoResources = await fetchAllResources('video');
    const rawResources = await fetchAllResources('raw');

    const combined = [
      ...imageResources.map(r => ({ ...r, resource_type: 'image' })),
      ...videoResources.map(r => ({ ...r, resource_type: 'video' })),
      ...rawResources.map(r => ({ ...r, resource_type: 'raw' }))
    ];

    const manifest = {
      generated_at: new Date().toISOString(),
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      total_assets: combined.length,
      breakdown: {
        images: imageResources.length,
        videos: videoResources.length,
        raw: rawResources.length
      },
      total_bytes: combined.reduce((acc, r) => acc + (r.bytes || 0), 0),
      assets: combined.map(r => ({
        asset_id: r.asset_id,
        public_id: r.public_id,
        format: r.format,
        version: r.version,
        resource_type: r.resource_type,
        type: r.type,
        created_at: r.created_at,
        bytes: r.bytes,
        width: r.width || null,
        height: r.height || null,
        folder: r.folder || (r.public_id.includes('/') ? r.public_id.substring(0, r.public_id.lastIndexOf('/')) : ''),
        secure_url: r.secure_url,
        url: r.url
      }))
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('====================================================');
    console.log(`SUCCESS: Cloudinary inventory completed in ${durationSec}s`);
    console.log(`Manifest saved to: ${OUTPUT_FILE}`);
    console.log(`Total Assets Recorded: ${manifest.total_assets} (${(manifest.total_bytes / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`- Images: ${manifest.breakdown.images}`);
    console.log(`- Videos: ${manifest.breakdown.videos}`);
    console.log(`- Raw Assets: ${manifest.breakdown.raw}`);
    console.log('====================================================');
  } catch (error) {
    console.error('FAILED to complete Cloudinary inventory:', error);
    process.exit(1);
  }
}

runInventory();
