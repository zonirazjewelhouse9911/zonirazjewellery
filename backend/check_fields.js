const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("Connected to DB");

    const p = await Product.findOne().lean();
    console.log("Product keys:", Object.keys(p));
    console.log("Price fields in product:");
    console.log("price:", p.price);
    console.log("basePrice:", p.basePrice);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
