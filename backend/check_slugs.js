const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    const products = await Product.find({}).limit(5).lean();
    products.forEach(p => {
      console.log(`Title: "${p.product_title}"`);
      console.log(`  product_slug: "${p.product_slug}"`);
      console.log(`  slug: "${p.slug}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
