const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const Product = require("./src/models/productModel");

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    
    // 1. Total Products Count
    const totalProducts = await Product.countDocuments({});
    const liveProducts = await Product.find({ status: "1" }).lean();
    
    // 2. Count slugs vs IDs
    let slugBasedCount = 0;
    let idBasedCount = 0;
    
    liveProducts.forEach(p => {
      const slug = p.product_slug || p.slug;
      if (slug && /^[a-z0-9-]+$/.test(slug)) {
        slugBasedCount++;
      } else {
        idBasedCount++;
      }
    });

    // 3. Scan sitemap.xml for any ID references
    const sitemapPath = path.join(__dirname, "../frontend/public/sitemap.xml");
    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
    
    const hasIdInSitemap = sitemapContent.includes("/product-") || /\/product\/[0-9a-fA-F]{24}/.test(sitemapContent);
    const totalSitemapUrls = (sitemapContent.match(/<loc>/g) || []).length;

    // 4. Scan source files for old routing references (outgoing links)
    const appJsxContent = fs.readFileSync(path.join(__dirname, "../frontend/src/App.jsx"), "utf8");
    const categoryPageContent = fs.readFileSync(path.join(__dirname, "../frontend/src/components/CategoryPage.jsx"), "utf8");
    const productDetailContent = fs.readFileSync(path.join(__dirname, "../frontend/src/components/ProductDetailPage.jsx"), "utf8");
    const headerContent = fs.readFileSync(path.join(__dirname, "../frontend/src/components/Header.jsx"), "utf8");

    // Outgoing link patterns: product-${ or /product- outside of route matching fallback checks
    const appJsxHasIdLink = appJsxContent.includes("canonical = `https://zoniraz.com/product-${") || appJsxContent.includes("`/product-${");
    const categoryPageHasIdLink = categoryPageContent.includes("`/product-${") || categoryPageContent.includes("'/product-'");
    const productDetailHasIdLink = productDetailContent.includes("`/product-${") || productDetailContent.includes("'/product-'");
    const headerHasIdLink = headerContent.includes("`product-${") || headerContent.includes("'product-'");

    console.log("VALIDATION_REPORT_START");
    console.log(JSON.stringify({
      totalProducts,
      liveProductsCount: liveProducts.length,
      slugBasedCount,
      idBasedCount,
      sitemap: {
        totalSitemapUrls,
        hasIdInSitemap,
        isValid: !hasIdInSitemap
      },
      codeScan: {
        appJsxHasIdLink,
        categoryPageHasIdLink,
        productDetailHasIdLink,
        headerHasIdLink,
        allClear: !appJsxHasIdLink && !categoryPageHasIdLink && !productDetailHasIdLink && !headerHasIdLink
      }
    }, null, 2));
    console.log("VALIDATION_REPORT_END");

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
