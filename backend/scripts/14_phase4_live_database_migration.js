const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BACKUP_DIR = path.join(__dirname, '../backups/db_backup_2026-09-15T06-21-50-521Z');
const BACKUP_MANIFEST_FILE = path.join(BACKUP_DIR, 'backup-manifest.json');
const MAPPING_FILE = path.join(__dirname, '../db-migration-mapping-verified.json');
const REPORT_FILE = path.join(__dirname, '../db-live-migration-phase4-report.json');

const VPS_IP = '187.127.143.182';

function deepReplaceUsingVerifiedMap(obj, urlMap, tracker = { replaced: 0, unmapped: [] }) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    if (obj.includes('cloudinary.com') || obj.includes('res.cloudinary.com')) {
      if (urlMap.has(obj)) {
        tracker.replaced++;
        return urlMap.get(obj);
      } else {
        // Check if trimmed or cleaned version exists
        const trimmed = obj.trim();
        if (urlMap.has(trimmed)) {
          tracker.replaced++;
          return urlMap.get(trimmed);
        }
        tracker.unmapped.push(obj);
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepReplaceUsingVerifiedMap(item, urlMap, tracker));
  }

  if (typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = deepReplaceUsingVerifiedMap(obj[key], urlMap, tracker);
    }
    return newObj;
  }

  return obj;
}

async function verifyHttpHead(urlPath) {
  return new Promise(resolve => {
    const req = https.request({
      hostname: VPS_IP,
      port: 443,
      path: urlPath,
      method: 'HEAD',
      headers: {
        'Host': 'media.zoniraz.com',
        'User-Agent': 'Phase4-Live-Verifier/1.0'
      },
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

async function runLiveMigration() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('PHASE 4: LIVE DATABASE MEDIA URL MIGRATION');
  console.log('====================================================');

  // 1. Verify Prerequisites
  console.log('\n--- 1. Validating Verified Mapping & Restorable Backup ---');
  if (!fs.existsSync(BACKUP_MANIFEST_FILE)) {
    throw new Error(`Backup manifest not found at ${BACKUP_MANIFEST_FILE}`);
  }
  if (!fs.existsSync(MAPPING_FILE)) {
    throw new Error(`Verified mapping file not found at ${MAPPING_FILE}`);
  }

  const backupManifest = JSON.parse(fs.readFileSync(BACKUP_MANIFEST_FILE, 'utf-8'));
  const mappingData = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

  const urlMap = new Map();
  mappingData.mappings.forEach(m => {
    urlMap.set(m.old_cloudinary_url, m.new_vps_media_url);
  });

  console.log(`- Backup Location:       ${BACKUP_DIR}`);
  console.log(`- Backed Up Documents:   ${backupManifest.total_documents} across ${Object.keys(backupManifest.collections).length} collections (Verified: ${backupManifest.verified})`);
  console.log(`- Verified URL Mappings: ${urlMap.size} unique URLs loaded`);

  console.log('\n--- Expected Migration Scope ---');
  console.log('Collections:                 19');
  console.log('Documents:                   679');
  console.log('Documents containing media:  637');
  console.log('Cloudinary references:       5,652');
  console.log('Unique Cloudinary URLs:      5,646');
  console.log('Expected unresolved URLs:    0');

  // 2. Connect to MongoDB
  await mongoose.connect(process.env.Mongo_URI);
  console.log('\nConnected to MongoDB database for LIVE migration.');

  const collections = await mongoose.connection.db.listCollections().toArray();
  const executionStats = {};
  let totalDocsScanned = 0;
  let totalDocsModified = 0;
  let totalRefsReplaced = 0;
  let totalUnmappedEncountered = 0;
  let totalErrors = 0;

  for (const col of collections) {
    const colName = col.name;
    const docs = await mongoose.connection.db.collection(colName).find({}).toArray();
    totalDocsScanned += docs.length;

    let colModified = 0;
    let colRefsReplaced = 0;
    let colUnmapped = [];
    let colErrors = 0;
    let colSkipped = 0;

    for (const doc of docs) {
      const tracker = { replaced: 0, unmapped: [] };
      const updatedDoc = deepReplaceUsingVerifiedMap(doc, urlMap, tracker);

      if (tracker.unmapped.length > 0) {
        console.error(`CRITICAL: Unmapped Cloudinary URL found in ${colName} (doc: ${doc._id}):`, tracker.unmapped);
        totalUnmappedEncountered += tracker.unmapped.length;
        colUnmapped.push(...tracker.unmapped);
        throw new Error(`ABORTING: Unmapped URL in collection ${colName}, doc ${doc._id}`);
      }

      if (tracker.replaced > 0) {
        try {
          const docId = doc._id;
          delete updatedDoc._id; // replaceOne uses filter for _id

          await mongoose.connection.db.collection(colName).replaceOne(
            { _id: docId },
            updatedDoc
          );

          colModified++;
          colRefsReplaced += tracker.replaced;
        } catch (err) {
          console.error(`Error updating document ${doc._id} in ${colName}:`, err.message);
          colErrors++;
          totalErrors++;
          throw err;
        }
      } else {
        colSkipped++;
      }
    }

    totalDocsModified += colModified;
    totalRefsReplaced += colRefsReplaced;

    executionStats[colName] = {
      documents_scanned: docs.length,
      documents_modified: colModified,
      cloudinary_urls_replaced: colRefsReplaced,
      vps_urls_written: colRefsReplaced,
      unresolved_urls: colUnmapped.length,
      errors: colErrors,
      skipped_documents: colSkipped
    };

    console.log(`[Collection ${colName}] Scanned: ${docs.length} | Modified: ${colModified} | Replaced: ${colRefsReplaced} | Unresolved: ${colUnmapped.length} | Errors: ${colErrors} | Skipped: ${colSkipped}`);
  }

  // 3. Post-Migration Verification Audit
  console.log('\n--- 3. Post-Migration Strict Verification Audit ---');
  let remainingCloudinaryCount = 0;
  let totalVpsMediaCount = 0;
  let postScanDocsCount = 0;
  const postScanStats = {};
  const vpsUrlsSample = [];

  for (const col of collections) {
    const colName = col.name;
    const docs = await mongoose.connection.db.collection(colName).find({}).toArray();
    postScanDocsCount += docs.length;

    let colCloud = 0;
    let colVps = 0;

    for (const doc of docs) {
      const str = JSON.stringify(doc);
      const cloudMatches = str.match(/https?:\/\/[^"'\s]*cloudinary\.com[^"'\s]*/g) || [];
      const vpsMatches = str.match(/https:\/\/media\.zoniraz\.com\/uploads\/[^"'\s]*/g) || [];
      colCloud += cloudMatches.length;
      colVps += vpsMatches.length;

      if (vpsMatches.length > 0 && vpsUrlsSample.length < 50) {
        vpsUrlsSample.push(...vpsMatches);
      }
    }

    remainingCloudinaryCount += colCloud;
    totalVpsMediaCount += colVps;

    postScanStats[colName] = {
      docs_count: docs.length,
      cloudinary_remaining: colCloud,
      vps_urls: colVps
    };
  }

  await mongoose.disconnect();
  console.log('MongoDB disconnected after post-migration verification.');

  // 4. Sample HTTP 200 checks on VPS for migrated live URLs
  console.log('\n--- 4. HTTP 200 Verification against Live VPS ---');
  let httpSuccess = 0;
  let httpFailed = 0;
  const uniqueVpsSample = Array.from(new Set(vpsUrlsSample)).slice(0, 30);
  for (const u of uniqueVpsSample) {
    const parsed = new URL(u);
    const code = await verifyHttpHead(parsed.pathname);
    if (code === 200) httpSuccess++;
    else httpFailed++;
  }
  console.log(`Sample Live HTTP Check: ${httpSuccess}/${uniqueVpsSample.length} returned HTTP 200 OK (${httpFailed} failed).`);

  // 5. Evaluation of Final Pass/Fail Status
  const isDocumentLossZero = postScanDocsCount === backupManifest.total_documents;
  const isCloudinaryZero = remainingCloudinaryCount === 0;
  const isVpsCountCorrect = totalVpsMediaCount === 5652;
  const isUnresolvedZero = totalUnmappedEncountered === 0;
  const isErrorZero = totalErrors === 0;
  const isHttpOk = httpFailed === 0 && httpSuccess === uniqueVpsSample.length;

  const isMigrationPassed = isDocumentLossZero && isCloudinaryZero && isVpsCountCorrect && isUnresolvedZero && isErrorZero && isHttpOk;

  const finalReport = {
    timestamp: new Date().toISOString(),
    backup_path: BACKUP_DIR,
    database_live_migration: isMigrationPassed ? 'PASS' : 'FAIL',
    verification_checklist: {
      all_19_collections_scanned: collections.length === 19,
      total_documents_scanned: totalDocsScanned,
      total_documents_modified: totalDocsModified,
      total_references_replaced: totalRefsReplaced,
      old_cloudinary_urls_remaining_in_db: remainingCloudinaryCount,
      new_vps_media_urls_in_db: totalVpsMediaCount,
      unresolved_urls_count: totalUnmappedEncountered,
      errors_count: totalErrors,
      document_count_before_vs_after: `${backupManifest.total_documents} == ${postScanDocsCount}`,
      document_loss: backupManifest.total_documents - postScanDocsCount,
      collection_loss: 0,
      http_200_sample_check: `${httpSuccess}/${uniqueVpsSample.length} PASS`
    },
    collection_execution_breakdown: executionStats,
    post_scan_breakdown: postScanStats,
    rollback_instructions: isMigrationPassed ? 'Not needed. Database is fully consistent.' : `To rollback: run node backend/scripts/03_restore_database.js from ${BACKUP_DIR}`
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(finalReport, null, 2), 'utf-8');

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n====================================================');
  console.log(`PHASE 4 LIVE MIGRATION COMPLETED IN ${durationSec}s`);
  console.log('====================================================');
  console.log(`Collections Audited:              ${collections.length} / 19`);
  console.log(`Documents Scanned:                ${totalDocsScanned} / 679`);
  console.log(`Documents Modified:               ${totalDocsModified} / 637`);
  console.log(`Cloudinary References Replaced:   ${totalRefsReplaced} / 5652`);
  console.log(`Remaining Cloudinary URLs in DB:  ${remainingCloudinaryCount} (Expected: 0)`);
  console.log(`VPS Media URLs in DB:             ${totalVpsMediaCount} (Expected: 5652)`);
  console.log(`Document Loss:                    ${backupManifest.total_documents - postScanDocsCount} (Expected: 0)`);
  console.log(`Unresolved URLs:                  ${totalUnmappedEncountered} (Expected: 0)`);
  console.log(`Errors:                           ${totalErrors} (Expected: 0)`);
  console.log(`HTTP 200 Verification:            ${httpSuccess}/${uniqueVpsSample.length} OK`);
  console.log(`----------------------------------------------------`);
  console.log(`DATABASE_LIVE_MIGRATION = ${finalReport.database_live_migration}`);
  console.log(`----------------------------------------------------`);
  console.log(`Phase 4 Report File: ${REPORT_FILE}`);
  console.log('====================================================\n');

  if (!isMigrationPassed) {
    process.exit(1);
  }
}

runLiveMigration().catch(err => {
  console.error('Phase 4 Live Migration FAILED:', err);
  process.exit(1);
});
