const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = require("./src/models/categoryModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("Connected to DB");

    const categories = await Category.find().lean();
    console.log("Categories in DB:");
    categories.forEach(c => {
      console.log(`- name: "${c.name}", id: "${c._id}"`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
