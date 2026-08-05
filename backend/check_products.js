const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("Connected to DB");

    const product = await Product.findOne().lean();
    if (product) {
      console.log("Found product:", product.product_title);
      console.log("image field:", JSON.stringify(product.image));
      console.log("images field:", JSON.stringify(product.images));
      console.log("gallery field:", JSON.stringify(product.gallery));
    } else {
      console.log("No products found in DB");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
