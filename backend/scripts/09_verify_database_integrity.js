const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const VERIFIED_MANIFEST_FILE = path.join(__dirname, '../verified-assets-manifest.json');
const INTEGRITY_REPORT_FILE = path.join(__dirname, '../db-integrity-audit-report.json');

async function runIntegrityAudit() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 9: DATABASE INTEGRITY & 0-BROKEN-MEDIA AUDIT');
  console.log('====================================================');

  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log('Connected to MongoDB database.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const auditReport = {
      audited_at: new Date().toISOString(),
      collections: {},
      total_cloudinary_urls_remaining: 0,
      total_vps_media_urls_found: 0,
      broken_vps_urls: [],
      integrity_pass: false
    };

    let remainingCloudinaryCount = 0;
    let vpsMediaUrlCount = 0;

    let stagedAssetsMap = new Map();
    if (fs.existsSync(VERIFIED_MANIFEST_FILE)) {
      const manifest = JSON.parse(fs.readFileSync(VERIFIED_MANIFEST_FILE, 'utf-8'));
      manifest.assets.forEach(a => stagedAssetsMap.set(a.destination_url, a));
      console.log(`Loaded ${stagedAssetsMap.size} staged assets for target verification.`);
    }

    for (const col of collections) {
      const colName = col.name;
      const docs = await mongoose.connection.db.collection(colName).find({}).toArray();

      let colCloudinary = 0;
      let colVps = 0;

      for (const doc of docs) {
        const str = JSON.stringify(doc);
        const cloudMatches = str.match(/https?:\/\/[^"'\s]*cloudinary\.com[^"'\s]*/g) || [];
        const vpsMatches = str.match(/https:\/\/media\.zoniraz\.com\/uploads\/[^"'\s]*/g) || [];

        colCloudinary += cloudMatches.length;
        colVps += vpsMatches.length;

        if (stagedAssetsMap.size > 0) {
          vpsMatches.forEach(url => {
            const cleanUrl = url.replace(/[,;]+$/, '');
            if (!stagedAssetsMap.has(cleanUrl)) {
              auditReport.broken_vps_urls.push({
                collection: colName,
                doc_id: doc._id,
                url: cleanUrl
              });
            }
          });
        }
      }

      remainingCloudinaryCount += colCloudinary;
      vpsMediaUrlCount += colVps;

      auditReport.collections[colName] = {
        total_documents: docs.length,
        cloudinary_urls_remaining: colCloudinary,
        vps_media_urls: colVps
      };

      console.log(`[Audit] Collection '${colName}': ${docs.length} docs, Cloudinary URLs: ${colCloudinary}, VPS Media URLs: ${colVps}`);
    }

    auditReport.total_cloudinary_urls_remaining = remainingCloudinaryCount;
    auditReport.total_vps_media_urls_found = vpsMediaUrlCount;
    auditReport.integrity_pass = remainingCloudinaryCount === 0 && auditReport.broken_vps_urls.length === 0;

    fs.writeFileSync(INTEGRITY_REPORT_FILE, JSON.stringify(auditReport, null, 2), 'utf-8');
    await mongoose.disconnect();

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('====================================================');
    console.log(`COMPLETED Database Integrity Audit in ${durationSec}s`);
    console.log(`Cloudinary URLs Remaining: ${remainingCloudinaryCount} (Expected: 0)`);
    console.log(`VPS Media URLs Found:      ${vpsMediaUrlCount}`);
    console.log(`Broken / Unstaged URLs:    ${auditReport.broken_vps_urls.length} (Expected: 0)`);
    console.log(`Integrity Audit Pass:      ${auditReport.integrity_pass}`);
    console.log(`Audit Report:              ${INTEGRITY_REPORT_FILE}`);
    console.log('====================================================');
  } catch (error) {
    console.error('FAILED to run database integrity audit:', error);
    process.exit(1);
  }
}

runIntegrityAudit();
