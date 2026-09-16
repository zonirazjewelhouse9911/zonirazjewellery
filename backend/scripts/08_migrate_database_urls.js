const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DRY_RUN_REPORT_FILE = path.join(__dirname, '../db-migration-dry-run-report.json');
const VERIFIED_MANIFEST_FILE = path.join(__dirname, '../verified-assets-manifest.json');
const MIGRATION_LOG_FILE = path.join(__dirname, '../db-migration-execution-log.json');

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

function deepReplaceUrls(obj, changeLog = []) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    if (obj.includes('cloudinary.com') || obj.includes('res.cloudinary.com')) {
      const newUrl = transformCloudinaryUrl(obj);
      if (newUrl !== obj) {
        changeLog.push({ old: obj, new: newUrl });
        return newUrl;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepReplaceUrls(item, changeLog));
  }

  if (typeof obj === 'object') {
    // If it's a BSON / Mongoose object or plain object
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = deepReplaceUrls(obj[key], changeLog);
    }
    return newObj;
  }

  return obj;
}

async function runDatabaseMigration() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 8: ATOMIC DATABASE URL MIGRATION');
  console.log('====================================================');

  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log('Connected to MongoDB database.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const executionLog = {
      started_at: new Date().toISOString(),
      collections: {},
      total_docs_checked: 0,
      total_docs_modified: 0,
      total_urls_replaced: 0
    };

    let totalChecked = 0;
    let totalModified = 0;
    let totalReplaced = 0;

    for (const col of collections) {
      const colName = col.name;
      const docs = await mongoose.connection.db.collection(colName).find({}).toArray();
      totalChecked += docs.length;

      let colDocsModified = 0;
      let colUrlsReplaced = 0;

      for (const doc of docs) {
        const changes = [];
        // Clone doc structure without _id for update payload
        const updatedDoc = deepReplaceUrls(doc, changes);

        if (changes.length > 0) {
          colDocsModified++;
          colUrlsReplaced += changes.length;

          // Preserve _id exactly
          const docId = doc._id;
          delete updatedDoc._id;

          await mongoose.connection.db.collection(colName).replaceOne(
            { _id: docId },
            updatedDoc
          );
        }
      }

      totalModified += colDocsModified;
      totalReplaced += colUrlsReplaced;

      executionLog.collections[colName] = {
        total_docs: docs.length,
        modified_docs: colDocsModified,
        urls_replaced: colUrlsReplaced
      };

      if (colDocsModified > 0) {
        console.log(`[Migrated] Collection '${colName}': updated ${colDocsModified}/${docs.length} docs (${colUrlsReplaced} URLs).`);
      }
    }

    executionLog.completed_at = new Date().toISOString();
    executionLog.total_docs_checked = totalChecked;
    executionLog.total_docs_modified = totalModified;
    executionLog.total_urls_replaced = totalReplaced;

    fs.writeFileSync(MIGRATION_LOG_FILE, JSON.stringify(executionLog, null, 2), 'utf-8');
    await mongoose.disconnect();

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('====================================================');
    console.log(`SUCCESS: Database media URL migration completed in ${durationSec}s`);
    console.log(`Total Documents Audited:  ${totalChecked}`);
    console.log(`Total Documents Updated:  ${totalModified}`);
    console.log(`Total URLs Transformed:   ${totalReplaced}`);
    console.log(`Migration Log:            ${MIGRATION_LOG_FILE}`);
    console.log('====================================================');
  } catch (error) {
    console.error('FAILED to complete database migration:', error);
    process.exit(1);
  }
}

// Ensure caller explicitly flags execution to prevent accidental invocation
if (process.argv.includes('--execute')) {
  runDatabaseMigration();
} else {
  console.log('SAFETY LOCK: Run with --execute flag to apply database updates.');
}
