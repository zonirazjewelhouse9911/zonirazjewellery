const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BACKUP_ROOT = path.join(__dirname, '../backups');

async function runDatabaseBackup() {
  const startTime = Date.now();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(BACKUP_ROOT, `db_backup_${timestamp}`);

  console.log('====================================================');
  console.log('STEP 4: FULL RESTORABLE DATABASE BACKUP');
  console.log('====================================================');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log('Connected to MongoDB database.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Backing up ${collections.length} collections into: ${backupDir}`);

    const manifest = {
      backup_timestamp: new Date().toISOString(),
      database_name: mongoose.connection.db.databaseName,
      collections: {},
      total_documents: 0,
      total_bytes: 0,
      verified: false
    };

    let grandTotalDocs = 0;
    let grandTotalBytes = 0;

    for (const col of collections) {
      const colName = col.name;
      const docs = await mongoose.connection.db.collection(colName).find({}).toArray();
      const filePath = path.join(backupDir, `${colName}.json`);

      const jsonContent = JSON.stringify(docs, null, 2);
      fs.writeFileSync(filePath, jsonContent, 'utf-8');

      const fileStats = fs.statSync(filePath);

      manifest.collections[colName] = {
        document_count: docs.length,
        file_size_bytes: fileStats.size,
        file_path: filePath
      };

      grandTotalDocs += docs.length;
      grandTotalBytes += fileStats.size;

      console.log(`[Backup] Collection '${colName}': ${docs.length} documents saved (${(fileStats.size / 1024).toFixed(1)} KB).`);
    }

    manifest.total_documents = grandTotalDocs;
    manifest.total_bytes = grandTotalBytes;

    // Verify backup integrity
    console.log('\nVerifying backup file integrity...');
    let allVerified = true;
    for (const colName of Object.keys(manifest.collections)) {
      const info = manifest.collections[colName];
      const readDocs = JSON.parse(fs.readFileSync(info.file_path, 'utf-8'));
      if (readDocs.length !== info.document_count) {
        console.error(`Verification FAILED for ${colName}: expected ${info.document_count}, read ${readDocs.length}`);
        allVerified = false;
      }
    }

    manifest.verified = allVerified;
    const manifestPath = path.join(backupDir, 'backup-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    await mongoose.disconnect();

    if (!allVerified) {
      throw new Error('Database backup verification failed!');
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('====================================================');
    console.log(`SUCCESS: Database backup completed & verified in ${durationSec}s`);
    console.log(`Backup directory: ${backupDir}`);
    console.log(`Total Collections: ${collections.length}`);
    console.log(`Total Documents: ${grandTotalDocs}`);
    console.log(`Total Backup Size: ${(grandTotalBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Backup Manifest: ${manifestPath}`);
    console.log('====================================================');
  } catch (error) {
    console.error('FAILED to complete database backup:', error);
    process.exit(1);
  }
}

runDatabaseBackup();
