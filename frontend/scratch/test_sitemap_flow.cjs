const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load backend dotenv
require("dotenv").config({ path: path.join(__dirname, "../../backend/.env") });

const Product = require("../../backend/src/models/productModel");
const { generateSitemap } = require("../../backend/src/utils/sitemapGenerator");

async function testFlow() {
  console.log("Connecting to DB...");
  await mongoose.connect(process.env.Mongo_URI);
  console.log("Connected.");

  const tempSlug = "test-sitemap-product-999-" + Date.now();
  console.log("Creating test product with slug:", tempSlug);

  const testProduct = new Product({
    product_id: "TEST999",
    name: "Test Sitemap Product 999",
    product_slug: tempSlug,
    slug: tempSlug,
    status: "1", // published
    price: 9999,
    description: "Temporary product for sitemap testing",
    category: "rings",
    images: ["https://example.com/test.jpg"]
  });

  await testProduct.save();
  console.log("Test product saved to DB. Now running sitemap generator...");

  await generateSitemap();

  console.log("Checking generated sitemap files...");
  
  const frontendSitemapPath = path.join(__dirname, "../public/sitemap.xml");
  const backendSitemapPath = path.join(__dirname, "../../backend/public/sitemap.xml");

  const checkFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const url = `https://zoniraz.com/product/${tempSlug}`;
      const found = content.includes(url);
      console.log(`File: ${filePath} -> Contains new URL? ${found}`);
      return found;
    } else {
      console.log(`File does not exist: ${filePath}`);
      return false;
    }
  };

  const foundInFrontend = checkFile(frontendSitemapPath);
  const foundInBackend = checkFile(backendSitemapPath);

  console.log("Cleaning up test product from DB...");
  await Product.deleteOne({ _id: testProduct._id });
  console.log("Cleaned up.");

  await mongoose.disconnect();
  console.log("Disconnected from DB.");

  if (foundInFrontend && foundInBackend) {
    console.log("TEST PASSED: Product successfully generated in both sitemaps!");
  } else {
    console.log("TEST FAILED: Product missing from one or both sitemaps.");
  }
}

testFlow().catch(err => {
  console.error("Test failed with error:", err);
  mongoose.disconnect();
});
