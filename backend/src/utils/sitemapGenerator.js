const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Blog = require("../models/blogModel");

// Static routes list
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

// Slugs for categories
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

// Fallback blog slugs if DB query fails completely
const fallbackBlogSlugs = [
  "timeless-gold-earring-styles-2026",
  "ultimate-bridal-jewellery-guide",
  "gold-saving-scheme-smartest-investment",
  "old-gold-exchange-best-value",
  "gold-pendant-necklace-layering-guide"
];

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

async function generateSitemap() {
  try {
    const baseDomain = "https://zoniraz.com";
    const today = new Date().toISOString().split('T')[0];

    // 1. Get database published/active blogs
    let activeBlogs = [];
    try {
      const dbBlogs = await Blog.find({ isPublished: { $ne: false } }).select("slug updatedAt createdAt").lean();
      activeBlogs = (dbBlogs || []).filter(b => b.slug && b.slug.trim());
    } catch (blogErr) {
      console.error("[Sitemap] Could not fetch blogs from DB, using fallback:", blogErr.message);
      activeBlogs = fallbackBlogSlugs.map(slug => ({ slug }));
    }

    // 2. Get database products
    let products = [];
    try {
      products = await Product.find({ status: "1" }).select("_id product_id product_slug slug modify_date updatedAt create_date createdAt").lean();
    } catch (prodErr) {
      console.error("[Sitemap] Could not fetch products from DB:", prodErr.message);
    }

    // 3. Get database categories
    let dbCategories = [];
    try {
      dbCategories = await Category.find().lean();
    } catch (catErr) {
      console.error("[Sitemap] Could not fetch categories from DB:", catErr.message);
    }

    const activeCategorySlugs = [...categorySlugs];
    dbCategories.forEach(cat => {
      if (cat && cat.name) {
        const slug = cat.name.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        if (slug && !activeCategorySlugs.includes(slug)) {
          activeCategorySlugs.push(slug);
        }
      }
    });

    // ── Build sitemap-static.xml ──────────────────────────────────────────────
    let staticXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    staticXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    staticPages.forEach(p => {
      const pageUrl = p === "" ? `${baseDomain}` : `${baseDomain}/${p}`;
      staticXml += `  <url>\n`;
      staticXml += `    <loc>${pageUrl}</loc>\n`;
      staticXml += `    <lastmod>${today}</lastmod>\n`;
      staticXml += `    <changefreq>${p === "" ? "daily" : "weekly"}</changefreq>\n`;
      staticXml += `    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n`;
      staticXml += `  </url>\n`;
    });
    staticXml += `</urlset>\n`;

    // ── Build sitemap-categories.xml ──────────────────────────────────────────
    let categoryXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    categoryXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    activeCategorySlugs.forEach(c => {
      categoryXml += `  <url>\n`;
      categoryXml += `    <loc>${baseDomain}/${c}</loc>\n`;
      categoryXml += `    <lastmod>${today}</lastmod>\n`;
      categoryXml += `    <changefreq>daily</changefreq>\n`;
      categoryXml += `    <priority>0.8</priority>\n`;
      categoryXml += `  </url>\n`;
    });
    categoryXml += `</urlset>\n`;

    // ── Build sitemap-blogs.xml ───────────────────────────────────────────────
    let blogXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    blogXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    blogXml += `  <url>\n`;
    blogXml += `    <loc>${baseDomain}/blog</loc>\n`;
    blogXml += `    <lastmod>${today}</lastmod>\n`;
    blogXml += `    <changefreq>daily</changefreq>\n`;
    blogXml += `    <priority>0.8</priority>\n`;
    blogXml += `  </url>\n`;

    const uniqueBlogSlugs = new Set();
    activeBlogs.forEach(b => {
      const cleanSlug = b.slug.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      if (cleanSlug && !uniqueBlogSlugs.has(cleanSlug)) {
        uniqueBlogSlugs.add(cleanSlug);
        const lastmod = formatDate(b.updatedAt || b.createdAt) || today;
        blogXml += `  <url>\n`;
        blogXml += `    <loc>${baseDomain}/blog/${cleanSlug}</loc>\n`;
        blogXml += `    <lastmod>${lastmod}</lastmod>\n`;
        blogXml += `    <changefreq>monthly</changefreq>\n`;
        blogXml += `    <priority>0.7</priority>\n`;
        blogXml += `  </url>\n`;
      }
    });
    blogXml += `</urlset>\n`;

    // ── Build sitemap-products.xml ────────────────────────────────────────────
    let productXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    productXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const uniqueProductSlugs = new Set();
    products.forEach(p => {
      const rawSlug = p.product_slug || p.slug || p._id || p.product_id;
      if (rawSlug) {
        const cleanSlug = String(rawSlug).trim();
        if (!uniqueProductSlugs.has(cleanSlug)) {
          uniqueProductSlugs.add(cleanSlug);
          const lastmod = formatDate(p.modify_date || p.updatedAt || p.create_date || p.createdAt) || today;
          productXml += `  <url>\n`;
          productXml += `    <loc>${baseDomain}/product/${cleanSlug}</loc>\n`;
          productXml += `    <lastmod>${lastmod}</lastmod>\n`;
          productXml += `    <changefreq>daily</changefreq>\n`;
          productXml += `    <priority>0.9</priority>\n`;
          productXml += `  </url>\n`;
        }
      }
    });
    productXml += `</urlset>\n`;

    // ── Build main Sitemap Index (sitemap.xml) ────────────────────────────────
    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    indexXml += `  <sitemap>\n    <loc>${baseDomain}/sitemap-static.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
    indexXml += `  <sitemap>\n    <loc>${baseDomain}/sitemap-categories.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
    indexXml += `  <sitemap>\n    <loc>${baseDomain}/sitemap-blogs.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
    indexXml += `  <sitemap>\n    <loc>${baseDomain}/sitemap-products.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
    indexXml += `</sitemapindex>\n`;

    const fileMap = {
      "sitemap.xml": indexXml,
      "sitemap-blogs.xml": blogXml,
      "sitemap-products.xml": productXml,
      "sitemap-categories.xml": categoryXml,
      "sitemap-static.xml": staticXml
    };

    // Save to target directories
    const targetDirs = [
      path.join(__dirname, "../../../frontend/public"),
      path.join(__dirname, "../../../frontend/dist"),
      path.join(__dirname, "../../public")
    ];

    targetDirs.forEach(dirPath => {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        Object.entries(fileMap).forEach(([filename, content]) => {
          fs.writeFileSync(path.join(dirPath, filename), content, "utf-8");
        });
        console.log(`[Sitemap Generator] Successfully written sitemaps to: ${dirPath}`);
      } catch (e) {
        console.error(`[Sitemap Generator] Error writing to ${dirPath}:`, e.message);
      }
    });

    return fileMap;
  } catch (err) {
    console.error("[Sitemap Generator] Generation error:", err);
    throw err;
  }
}

module.exports = { generateSitemap };
