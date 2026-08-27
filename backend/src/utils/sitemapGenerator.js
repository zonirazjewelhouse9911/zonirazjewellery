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
    const baseDomain = "https://zoniraz.com";
    const today = new Date().toISOString().split('T')[0];

    // Get live product IDs and slugs
    const products = await Product.find({ status: "1" }).select("_id product_id product_slug slug modify_date updatedAt create_date createdAt").lean();
    
    // Get database categories
    const dbCategories = await Category.find().lean();

    // Get database blogs (published or active)
    let activeBlogs = [];
    try {
      const dbBlogs = await Blog.find({ isPublished: { $ne: false } }).select("slug updatedAt createdAt").lean();
      if (dbBlogs && dbBlogs.length > 0) {
        activeBlogs = dbBlogs.filter(b => b.slug && b.slug.trim());
      } else {
        activeBlogs = fallbackBlogSlugs.map(slug => ({ slug }));
      }
    } catch (blogErr) {
      console.error("[Sitemap] Could not fetch blogs from DB, using fallback:", blogErr.message);
      activeBlogs = fallbackBlogSlugs.map(slug => ({ slug }));
    }

    const activeCategorySlugs = [...categorySlugs];
    // Format db categories
    dbCategories.forEach(cat => {
      const slug = cat.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (slug && !activeCategorySlugs.includes(slug)) {
        activeCategorySlugs.push(slug);
      }
    });

    // 1. Build sitemap-blogs.xml content
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
        const lastmod = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : today;
        blogXml += `  <url>\n`;
        blogXml += `    <loc>${baseDomain}/blog/${cleanSlug}</loc>\n`;
        blogXml += `    <lastmod>${lastmod}</lastmod>\n`;
        blogXml += `    <changefreq>monthly</changefreq>\n`;
        blogXml += `    <priority>0.7</priority>\n`;
        blogXml += `  </url>\n`;
      }
    });
    blogXml += `</urlset>\n`;

    // 2. Build full combined sitemap.xml URLs
    const sitemapUrls = [];

    // Static Pages
    staticPages.forEach(p => {
      sitemapUrls.push({
        loc: `${baseDomain}/${p}`,
        changefreq: p === "" ? "daily" : "weekly",
        priority: p === "" ? "1.0" : "0.8"
      });
    });

    // Categories Pages
    activeCategorySlugs.forEach(c => {
      sitemapUrls.push({
        loc: `${baseDomain}/${c}`,
        changefreq: "daily",
        priority: "0.8"
      });
    });

    // Blogs Pages
    uniqueBlogSlugs.forEach(b => {
      sitemapUrls.push({
        loc: `${baseDomain}/blog/${b}`,
        changefreq: "weekly",
        priority: "0.7"
      });
    });

    // Product Pages
    products.forEach(p => {
      const rawSlug = p.product_slug || p.slug || p._id || p.product_id;
      if (rawSlug) {
        const slug = String(rawSlug).trim();
        sitemapUrls.push({
          loc: `${baseDomain}/product/${slug}`,
          changefreq: "daily",
          priority: "0.9"
        });
      }
    });

    // Generate XML content for combined sitemap
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

    // Write sitemap-blogs.xml and sitemap.xml to frontend/public
    const frontendDir = path.join(__dirname, "../../../frontend/public");
    if (fs.existsSync(frontendDir)) {
      try {
        fs.writeFileSync(path.join(frontendDir, "sitemap-blogs.xml"), blogXml, "utf-8");
        fs.writeFileSync(path.join(frontendDir, "sitemap.xml"), xml, "utf-8");
        console.log(`[Sitemap] Auto-updated sitemap-blogs.xml and sitemap.xml at frontend: ${frontendDir}`);
      } catch (e) {
        console.error("[Sitemap] Failed to write to frontend path:", e.message);
      }
    }

    // Write sitemap-blogs.xml and sitemap.xml to backend/public
    const backendPublicDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(backendPublicDir)) {
      fs.mkdirSync(backendPublicDir, { recursive: true });
    }
    try {
      fs.writeFileSync(path.join(backendPublicDir, "sitemap-blogs.xml"), blogXml, "utf-8");
      fs.writeFileSync(path.join(backendPublicDir, "sitemap.xml"), xml, "utf-8");
      console.log(`[Sitemap] Auto-updated sitemap-blogs.xml and sitemap.xml at backend: ${backendPublicDir} (${uniqueBlogSlugs.size} blogs, ${sitemapUrls.length} total links)`);
    } catch (e) {
      console.error("[Sitemap] Failed to write to backend path:", e.message);
    }
    
    return xml;
  } catch (err) {
    console.error("[Sitemap] Auto-generation failed:", err);
    throw err;
  }
}

module.exports = { generateSitemap };
