const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

// Static routes list (primary pages)
const staticPages = [
  "",
  "about",
  "zoniraz-alwar",
  "contact",
  "franchise",
  "sell-gold",
  "exchange",
  "buy-gold",
  "gold-mine",
  "plans/gold-mine",
  "loose-stones",
  "buy-loose-stones",
  "loose-diamonds",
  "trending-now",
  "trending",
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

const Blog = require("../models/blogModel");

// Blog slugs static array fallback
const fallbackBlogSlugs = [
  "timeless-gold-earring-styles-2026",
  "ultimate-bridal-jewellery-guide",
  "gold-saving-scheme-smartest-investment",
  "old-gold-exchange-best-value",
  "gold-pendant-necklace-layering-guide"
];

async function generateSitemap() {
  try {
    // Get live product IDs and slugs
    const products = await Product.find({ status: "1" }).select("_id product_id product_slug slug").lean();
    
    // Get database categories
    const dbCategories = await Category.find().lean();

    // Get database blogs (published or active)
    let activeBlogSlugs = [];
    try {
      const dbBlogs = await Blog.find({ isPublished: { $ne: false } }).select("slug").lean();
      const dbSlugs = (dbBlogs || []).map(b => b.slug).filter(Boolean);
      activeBlogSlugs = Array.from(new Set([...dbSlugs, ...fallbackBlogSlugs]));
    } catch (blogErr) {
      console.error("[Sitemap] Could not fetch blogs from DB, using fallback:", blogErr.message);
      activeBlogSlugs = [...fallbackBlogSlugs];
    }

    
    const activeCategorySlugs = [...categorySlugs];
    // Format db categories
    dbCategories.forEach(cat => {
      const slug = cat.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      if (!activeCategorySlugs.includes(slug)) {
        activeCategorySlugs.push(slug);
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
    activeCategorySlugs.forEach(c => {
      sitemapUrls.push({
        loc: `${baseDomain}/${c}`,
        changefreq: "daily",
        priority: "0.8"
      });
    });

    // 3. Blogs Pages
    activeBlogSlugs.forEach(b => {
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

    // Write to frontend/public for local build
    const frontendSitemapPath = path.join(__dirname, "../../../frontend/public/sitemap.xml");
    try {
      fs.writeFileSync(frontendSitemapPath, xml);
      console.log(`[Sitemap] Auto-generated sitemap.xml at frontend: ${frontendSitemapPath}`);
    } catch (e) {
      console.error("[Sitemap] Failed to write to frontend path:", e.message);
    }

    // Write to backend/public to serve dynamically
    const backendPublicDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(backendPublicDir)) {
      fs.mkdirSync(backendPublicDir, { recursive: true });
    }
    const backendSitemapPath = path.join(backendPublicDir, "sitemap.xml");
    fs.writeFileSync(backendSitemapPath, xml);
    console.log(`[Sitemap] Auto-generated sitemap.xml at backend: ${backendSitemapPath} (${sitemapUrls.length} links)`);
    
    return xml;
  } catch (err) {
    console.error("[Sitemap] Auto-generation failed:", err);
    throw err;
  }
}

module.exports = { generateSitemap };
