const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("Connected to DB");

    const products = await Product.find({});
    console.log(`Found ${products.length} products total.`);

    let updatedCount = 0;
    for (const p of products) {
      const title = p.product_title || p.name || "product";
      const expectedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // If the current product_slug or slug is not equal to expectedSlug, update it
      if (p.product_slug !== expectedSlug || p.slug !== expectedSlug) {
        p.product_slug = expectedSlug;
        p.slug = expectedSlug;
        await p.save();
        updatedCount++;
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} products.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
