const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const OUTPUT_FILE = path.join(__dirname, '../database-media-inventory.json');

function extractCloudinaryUrls(obj, currentPath = '', foundUrls = []) {
  if (obj === null || obj === undefined) return foundUrls;

  if (typeof obj === 'string') {
    if (obj.includes('cloudinary.com') || obj.includes('res.cloudinary.com')) {
      foundUrls.push({
        path: currentPath,
        url: obj
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      extractCloudinaryUrls(item, `${currentPath}[${index}]`, foundUrls);
    });
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      extractCloudinaryUrls(obj[key], newPath, foundUrls);
    });
  }
  return foundUrls;
}

async function runDatabaseInventory() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('STEP 2: FULL DATABASE MEDIA INVENTORY');
  console.log('====================================================');

  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log('Connected to MongoDB database.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

    const inventory = {
      generated_at: new Date().toISOString(),
      collections: {},
      total_cloudinary_references: 0,
      unique_cloudinary_urls: [],
      affected_documents_count: 0
    };

    const uniqueUrlSet = new Set();
    let totalReferences = 0;
    let totalAffectedDocs = 0;

    for (const col of collections) {
      const colName = col.name;
      const docs = await mongoose.connection.db.collection(colName).find({}).toArray();
      const colInventory = {
        total_documents: docs.length,
        documents_with_media: 0,
        media_references_count: 0,
        records: []
      };

      for (const doc of docs) {
        const docId = doc._id.toString();
        const found = extractCloudinaryUrls(doc);

        if (found.length > 0) {
          colInventory.documents_with_media++;
          colInventory.media_references_count += found.length;
          totalReferences += found.length;
          totalAffectedDocs++;

          found.forEach(f => uniqueUrlSet.add(f.url));

          colInventory.records.push({
            doc_id: docId,
            identifier: doc.product_id || doc.product_slug || doc.slug || doc.title || doc.name || docId,
            references: found
          });
        }
      }

      inventory.collections[colName] = colInventory;
      console.log(`Collection [${colName}]: ${colInventory.documents_with_media}/${colInventory.total_documents} docs contain ${colInventory.media_references_count} Cloudinary media references.`);
    }

    inventory.total_cloudinary_references = totalReferences;
    inventory.affected_documents_count = totalAffectedDocs;
    inventory.unique_cloudinary_urls = Array.from(uniqueUrlSet);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2), 'utf-8');
    await mongoose.disconnect();

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('====================================================');
    console.log(`SUCCESS: Database media inventory completed in ${durationSec}s`);
    console.log(`Inventory saved to: ${OUTPUT_FILE}`);
    console.log(`Total Cloudinary References in DB: ${totalReferences}`);
    console.log(`Unique Cloudinary URLs in DB: ${uniqueUrlSet.size}`);
    console.log(`Total Affected Documents: ${totalAffectedDocs}`);
    console.log('====================================================');
  } catch (error) {
    console.error('FAILED to complete database media inventory:', error);
    process.exit(1);
  }
}

runDatabaseInventory();
