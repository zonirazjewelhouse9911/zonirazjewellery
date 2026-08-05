const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    const products = await Product.find({ status: "1" }).select("_id product_title product_id").lean();
    fs.writeFileSync("products_list.json", JSON.stringify(products, null, 2));
    console.log("Successfully wrote " + products.length + " products to products_list.json");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
