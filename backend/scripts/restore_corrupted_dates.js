/**
 * Database Date Restoration Script
 * 
 * Restores corrupted Date fields (which were converted to empty objects `{}`)
 * using the verified backup in backend/backups/db_backup_2026-09-15T06-21-50-521Z/
 * and ObjectId timestamp fallbacks for any items added after the backup.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const BACKUP_DIR = path.join(__dirname, '../backups/db_backup_2026-09-15T06-21-50-521Z');

const COLLECTION_SCHEMAS = {
  products: {
    file: 'products.json',
    fields: ['create_date', 'modify_date']
  },
  orders: {
    file: 'orders.json',
    fields: ['createdAt', 'updatedAt']
  },
  wallets: {
    file: 'wallets.json',
    fields: ['createdAt', 'updatedAt']
  },
  users: {
    file: 'users.json',
    fields: ['createdAt', 'updatedAt', 'otpExpiry']
  },
  coupons: {
    file: 'coupons.json',
    fields: ['expirationDate', 'createdAt', 'updatedAt']
  },
  categories: {
    file: 'categories.json',
    fields: ['createdAt', 'updatedAt']
  },
  jewellerypricings: {
    file: 'jewellerypricings.json',
    fields: ['createdAt', 'updatedAt']
  },
  banners: {
    file: 'banners.json',
    fields: ['createdAt', 'updatedAt']
  },
  admins: {
    file: 'admins.json',
    fields: ['created_at', 'updated_at', 'otpExpiry']
  },
  loosestones: {
    file: 'loosestones.json',
    fields: ['createdAt', 'updatedAt']
  },
  blogs: {
    file: 'blogs.json',
    fields: ['date', 'createdAt', 'updatedAt']
  },
  goldmines: {
    file: 'goldmines.json',
    fields: ['startDate', 'maturityDate', 'createdAt', 'updatedAt']
  },
  blogaccesses: {
    file: 'blogaccesses.json',
    fields: ['createdAt', 'updatedAt']
  }
};

function isEmptyObject(val) {
  return (
    val !== null &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    !(val instanceof Date) &&
    !(val instanceof mongoose.Types.ObjectId) &&
    Object.keys(val).length === 0
  );
}

function parseDateValue(rawVal) {
  if (!rawVal) return null;
  const d = new Date(rawVal);
  return isNaN(d.getTime()) ? null : d;
}

async function restoreDates() {
  const startTime = Date.now();
  console.log('🚀 Starting Date Restoration against MongoDB...');

  if (!process.env.Mongo_URI) {
    throw new Error('Mongo_URI is not set in environment.');
  }

  await mongoose.connect(process.env.Mongo_URI);
  console.log(' Connected to MongoDB.');

  const summary = {};

  for (const [colName, config] of Object.entries(COLLECTION_SCHEMAS)) {
    const backupFilePath = path.join(BACKUP_DIR, config.file);
    let backupItems = [];
    if (fs.existsSync(backupFilePath)) {
      try {
        backupItems = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
      } catch (e) {
        console.warn(`⚠️ Could not parse backup for ${colName}:`, e.message);
      }
    }

    const backupMap = new Map();
    for (const item of backupItems) {
      if (item._id) {
        backupMap.set(String(item._id), item);
      }
    }

    const rawCol = mongoose.connection.db.collection(colName);
    const docs = await rawCol.find({}).toArray();

    const bulkOps = [];
    let restoredFromBackup = 0;
    let restoredFromFallback = 0;

    for (const doc of docs) {
      const docIdStr = String(doc._id);
      const backupDoc = backupMap.get(docIdStr);
      const updateFields = {};

      for (const field of config.fields) {
        const currentVal = doc[field];
        // If field is an empty object or invalid Date type
        if (isEmptyObject(currentVal)) {
          let resolvedDate = null;

          if (backupDoc && backupDoc[field]) {
            resolvedDate = parseDateValue(backupDoc[field]);
          }

          if (!resolvedDate) {
            // Smart fallback based on field purpose
            if (['create_date', 'createdAt', 'created_at'].includes(field)) {
              resolvedDate = doc._id instanceof mongoose.Types.ObjectId 
                ? doc._id.getTimestamp() 
                : new Date();
            } else if (['modify_date', 'updatedAt', 'updated_at'].includes(field)) {
              resolvedDate = new Date();
            } else if (['date'].includes(field)) {
              resolvedDate = doc._id instanceof mongoose.Types.ObjectId 
                ? doc._id.getTimestamp() 
                : new Date();
            } else {
              resolvedDate = null;
            }
            restoredFromFallback++;
          } else {
            restoredFromBackup++;
          }

          if (resolvedDate !== null) {
            updateFields[field] = resolvedDate;
          } else {
            // Nullify invalid date like empty otpExpiry
            updateFields[field] = null;
          }
        }
      }

      if (Object.keys(updateFields).length > 0) {
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: updateFields }
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      const result = await rawCol.bulkWrite(bulkOps, { ordered: false });
      summary[colName] = {
        totalDocs: docs.length,
        modified: result.modifiedCount,
        fromBackup: restoredFromBackup,
        fromFallback: restoredFromFallback
      };
      console.log(`✅ [${colName}] Repaired ${result.modifiedCount} / ${docs.length} documents (Backup: ${restoredFromBackup}, Fallback: ${restoredFromFallback})`);
    } else {
      summary[colName] = { totalDocs: docs.length, modified: 0 };
      console.log(`ℹ️ [${colName}] No corrupted date fields detected (total: ${docs.length}).`);
    }
  }

  console.log('\n📊 Restoration Complete! Summary:');
  console.table(summary);
  console.log(`⏱️ Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

restoreDates().catch(err => {
  console.error('❌ Date restoration failed:', err);
  process.exit(1);
});
