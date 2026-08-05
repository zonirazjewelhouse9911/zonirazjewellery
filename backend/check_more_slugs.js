const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    const products = await Product.find({ status: "1" }).select("product_title product_slug").lean();
    let friendly = 0;
    let nonFriendly = 0;
    products.forEach((p, idx) => {
      const isFriendly = /^[a-z0-9-]+$/.test(p.product_slug);
      if (isFriendly) {
        friendly++;
      } else {
        nonFriendly++;
        if (nonFriendly <= 10) {
          console.log(`Non-friendly: "${p.product_title}" -> "${p.product_slug}"`);
        }
      }
    });
    console.log(`Total: ${products.length}, Friendly: ${friendly}, Non-friendly: ${nonFriendly}`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
