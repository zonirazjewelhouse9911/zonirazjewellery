const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const Product = require("./src/models/productModel");
const Category = require("./src/models/categoryModel");

// Static routes list (primary pages)
const staticPages = [
  "",
  "about",
  "contact",
  "franchise",
  "sell-gold",
  "exchange",
  "buy-gold",
  "gold-mine",
  "plans/gold-mine",
  "delivery",
  "shipping",
  "international-shipping",
  "payment",
  "returns",
  "giftcards",
  "terms",
  "privacy",
  "collections",
  "all-collections",
  "wishlist",
  "cart",
  "profile",
  "checkout",
  "blog",
  "blogs"
];

// Slugs for categories (known categories mapping and dynamic DB categories)
const categorySlugs = [
  "rings",
  "earrings",
  "chain",
  "nose-pin",
  "bangles",
  "mangalsutra",
  "pendant",
  "solitaire",
  "zodiac",
  "bracelets",
  "brooches",
  "anklets",
  "necklaces",
  "gold-coins",
  "coins",
  "mens-jewellery",
  "womens-jewellery",
  "kids-jewellery"
];

// Blog slugs static array
const blogSlugs = [
  "timeless-gold-earring-styles-2026",
  "diamond-engagement-ring-complete-guide-2026",
  "ultimate-bridal-jewellery-guide",
  "gold-saving-scheme-smartest-investment",
  "old-gold-exchange-best-value",
  "gold-pendant-necklace-layering-guide"
];

async function run() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    
    // Get live product IDs and slugs
    const products = await Product.find({ status: "1" }).select("_id product_id product_slug slug").lean();
    
    // Get database categories
    const dbCategories = await Category.find().lean();
    
    // Format db categories
    dbCategories.forEach(cat => {
      const slug = cat.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      if (!categorySlugs.includes(slug)) {
        categorySlugs.push(slug);
      }
    });

    const sitemapUrls = [];
    const baseDomain = "https://zoniraz.com";

    // 1. Static Pages
    staticPages.forEach(p => {
      sitemapUrls.push({
        loc: `${baseDomain}/${p}`,
        changefreq: p === "" ? "daily" : "weekly",
        priority: p === "" ? "1.0" : "0.8"
      });
    });

    // 2. Categories Pages
    categorySlugs.forEach(c => {
      sitemapUrls.push({
        loc: `${baseDomain}/${c}`,
        changefreq: "daily",
        priority: "0.8"
      });
    });

    // 3. Blogs Pages
    blogSlugs.forEach(b => {
      sitemapUrls.push({
        loc: `${baseDomain}/blog/${b}`,
        changefreq: "weekly",
        priority: "0.7"
      });
    });

    // 4. Product Pages
    products.forEach(p => {
      const slug = p.product_slug || p.slug || p._id || p.product_id;
      sitemapUrls.push({
        loc: `${baseDomain}/product/${slug}`,
        changefreq: "daily",
        priority: "0.9"
      });
    });

    // Generate XML content
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemapUrls.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${url.loc}</loc>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    xml += `</urlset>\n`;

    const frontendSitemapPath = path.join(__dirname, "../frontend/public/sitemap.xml");
    try {
      fs.writeFileSync(frontendSitemapPath, xml);
      console.log(`Successfully generated sitemap.xml at frontend: ${frontendSitemapPath}`);
    } catch (e) {
      console.error("Failed to write to frontend sitemap path:", e.message);
    }

    const backendPublicDir = path.join(__dirname, "public");
    if (!fs.existsSync(backendPublicDir)) {
      fs.mkdirSync(backendPublicDir, { recursive: true });
    }
    const backendSitemapPath = path.join(backendPublicDir, "sitemap.xml");
    fs.writeFileSync(backendSitemapPath, xml);
    console.log(`Successfully generated sitemap.xml at backend: ${backendSitemapPath}`);
    console.log(`Total URLs generated: ${sitemapUrls.length}`);
    console.log(`JSON_REPORT_START`);
    console.log(JSON.stringify({
      status: "success",
      totalUrls: sitemapUrls.length,
      staticCount: staticPages.length,
      categoryCount: categorySlugs.length,
      blogCount: blogSlugs.length,
      productCount: products.length,
      urls: sitemapUrls.map(u => u.loc)
    }));
    console.log(`JSON_REPORT_END`);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
