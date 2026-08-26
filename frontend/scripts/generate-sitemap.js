import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://zoniraz.com';
const API_ENDPOINTS = [
  'https://zonirazjewellery.onrender.com/api/admin/products',
  'http://localhost:55000/api/admin/products',
  'http://localhost:5000/api/admin/products'
];

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

// 1. Static Pages Definition
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'weekly' },
  { url: '/zoniraz-alwar', priority: '0.9', changefreq: 'weekly' },
  { url: '/contact', priority: '0.8', changefreq: 'weekly' },
  { url: '/franchise', priority: '0.8', changefreq: 'weekly' },
  { url: '/sell-gold', priority: '0.8', changefreq: 'weekly' },
  { url: '/buy-gold', priority: '0.8', changefreq: 'weekly' },
  { url: '/gold-mine', priority: '0.8', changefreq: 'weekly' },
  { url: '/loose-stones', priority: '0.8', changefreq: 'weekly' },
  { url: '/delivery', priority: '0.7', changefreq: 'weekly' },
  { url: '/all-collections', priority: '0.8', changefreq: 'weekly' }
];

// 2. Categories Definition
const categories = [
  'rings',
  'earrings',
  'pendants',
  'necklaces',
  'bangles',
  'bracelets',
  'mangalsutras',
  'nose-pins',
  'solitaires',
  'gold-coins'
].map(cat => ({
  url: `/${cat}`,
  priority: '0.8',
  changefreq: 'daily'
}));

// 3. Blogs Definition
const blogs = [
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  ...[
    'timeless-gold-earring-styles-2026',
    'ultimate-bridal-jewellery-guide',
    'gold-saving-scheme-smartest-investment',
    'old-gold-exchange-best-value',
    'gold-pendant-necklace-layering-guide',
    'top-jewellers-in-alwar'
  ].map(slug => ({
    url: `/blog/${slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }))
];

async function fetchAllProducts() {
  let products = [];
  let apiSuccess = false;
  let usedEndpoint = '';

  for (const endpoint of API_ENDPOINTS) {
    try {
      console.log(`[Sitemap Generator] Fetching product catalog from API: ${endpoint}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Sitemap Generator] Endpoint ${endpoint} status: ${response.status}`);
        continue;
      }

      const json = await response.json();
      let rawData = [];

      if (json && json.success && Array.isArray(json.data)) {
        rawData = json.data;
      } else if (Array.isArray(json)) {
        rawData = json;
      } else if (json && Array.isArray(json.products)) {
        rawData = json.products;
      }

      if (rawData.length > 0) {
        products = rawData;
        apiSuccess = true;
        usedEndpoint = endpoint;
        console.log(`[Sitemap Generator] Successfully fetched ${products.length} products from ${usedEndpoint}`);
        break;
      }
    } catch (err) {
      console.warn(`[Sitemap Generator] Warning fetching from ${endpoint}: ${err.message}`);
    }
  }

  if (!apiSuccess || products.length === 0) {
    console.error(`\n❌ ERROR: Product catalog could not be retrieved. Aborting sitemap generation.`);
    process.exit(1);
  }

  return products;
}

function writeUrlsetXml(filepath, items) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  items.forEach(item => {
    xml += `  <url>\n`;
    xml += `    <loc>${item.fullUrl}</loc>\n`;
    if (item.lastmod) {
      xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${item.changefreq || 'weekly'}</changefreq>\n`;
    xml += `    <priority>${item.priority || '0.7'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  fs.writeFileSync(filepath, xml, 'utf-8');
}

async function main() {
  console.log(`\n=======================================`);
  console.log(`ZONIRAZ SITEMAP INDEX & CHILD BUILD STEP`);
  console.log(`=======================================\n`);

  const publicDir = path.join(__dirname, '../public');
  const today = new Date().toISOString().split('T')[0];

  // A. Process Static Pages
  const staticItems = staticPages.map(p => ({
    fullUrl: `${DOMAIN}${p.url}`,
    lastmod: today,
    priority: p.priority,
    changefreq: p.changefreq
  }));
  const staticPath = path.join(publicDir, 'sitemap-static.xml');
  writeUrlsetXml(staticPath, staticItems);
  console.log(`[Sitemap Generator] Created sitemap-static.xml with ${staticItems.length} URLs`);

  // B. Process Categories
  const categoryItems = categories.map(p => ({
    fullUrl: `${DOMAIN}${p.url}`,
    lastmod: today,
    priority: p.priority,
    changefreq: p.changefreq
  }));
  const categoryPath = path.join(publicDir, 'sitemap-categories.xml');
  writeUrlsetXml(categoryPath, categoryItems);
  console.log(`[Sitemap Generator] Created sitemap-categories.xml with ${categoryItems.length} URLs`);

  // C. Process Blogs
  const blogItems = blogs.map(p => ({
    fullUrl: `${DOMAIN}${p.url}`,
    lastmod: today,
    priority: p.priority,
    changefreq: p.changefreq
  }));
  const blogPath = path.join(publicDir, 'sitemap-blogs.xml');
  writeUrlsetXml(blogPath, blogItems);
  console.log(`[Sitemap Generator] Created sitemap-blogs.xml with ${blogItems.length} URLs`);

  // D. Process Products from API
  const rawProducts = await fetchAllProducts();
  const eligibleProducts = rawProducts.filter(p => {
    if (p.deleted === true || p.deleted === '1') return false;
    if (p.status === '0' || p.status === 0 || p.status === 'disabled') return false;
    return true;
  });

  const productItemsMap = new Map();
  let duplicateSlugCount = 0;

  eligibleProducts.forEach(p => {
    const rawSlug = p.product_slug || p.slug || p.product_id || p._id;
    if (!rawSlug) return;
    const cleanSlug = String(rawSlug).trim();
    const fullUrl = `${DOMAIN}/product/${cleanSlug}`;

    if (productItemsMap.has(fullUrl)) {
      duplicateSlugCount++;
    } else {
      const lastmodDate = formatDate(p.modify_date || p.updatedAt || p.create_date || p.createdAt) || today;
      productItemsMap.set(fullUrl, {
        fullUrl,
        lastmod: lastmodDate,
        priority: '0.7',
        changefreq: 'weekly'
      });
    }
  });

  const productItems = Array.from(productItemsMap.values());
  const productPath = path.join(publicDir, 'sitemap-products.xml');
  writeUrlsetXml(productPath, productItems);
  console.log(`[Sitemap Generator] Created sitemap-products.xml with ${productItems.length} URLs (Duplicate Slugs Deduplicated: ${duplicateSlugCount})`);

  // E. Process Sitemap Index (sitemap.xml)
  const childSitemaps = [
    { loc: `${DOMAIN}/sitemap-static.xml`, lastmod: today },
    { loc: `${DOMAIN}/sitemap-categories.xml`, lastmod: today },
    { loc: `${DOMAIN}/sitemap-blogs.xml`, lastmod: today },
    { loc: `${DOMAIN}/sitemap-products.xml`, lastmod: today }
  ];

  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  childSitemaps.forEach(child => {
    indexXml += `  <sitemap>\n`;
    indexXml += `    <loc>${child.loc}</loc>\n`;
    indexXml += `    <lastmod>${child.lastmod}</lastmod>\n`;
    indexXml += `  </sitemap>\n`;
  });
  indexXml += `</sitemapindex>\n`;

  const indexPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(indexPath, indexXml, 'utf-8');
  console.log(`[Sitemap Generator] Created main Sitemap Index sitemap.xml linking ${childSitemaps.length} child sitemaps`);

  const totalUrls = staticItems.length + categoryItems.length + blogItems.length + productItems.length;

  console.log(`\n=======================================`);
  console.log(`SITEMAP ARCHITECTURE GENERATION COMPLETE`);
  console.log(`=======================================`);
  console.log(`Main Index Sitemap: ${DOMAIN}/sitemap.xml`);
  console.log(`Child Sitemaps Created:`);
  console.log(`  1. ${DOMAIN}/sitemap-static.xml      (${staticItems.length} URLs)`);
  console.log(`  2. ${DOMAIN}/sitemap-categories.xml  (${categoryItems.length} URLs)`);
  console.log(`  3. ${DOMAIN}/sitemap-blogs.xml       (${blogItems.length} URLs)`);
  console.log(`  4. ${DOMAIN}/sitemap-products.xml    (${productItems.length} URLs)`);
  console.log(`Total URLs Indexed Across Child Sitemaps: ${totalUrls}\n`);
}

main().catch(err => {
  console.error(`\n❌ Fatal Error generating sitemap index:`, err);
  process.exit(1);
});
