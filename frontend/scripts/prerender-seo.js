import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://zoniraz.com';

function getMongoUri() {
  if (process.env.Mongo_URI) return process.env.Mongo_URI;
  const envPath = path.join(__dirname, '../../backend/.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^Mongo_URI=(.+)$/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch (_) {}
  }
  return null;
}

async function fetchFromMongo() {
  const uri = getMongoUri();
  if (!uri) return null;

  try {
    console.log('[SEO Generator] Attempting direct MongoDB Atlas connection...');
    const mongoosePath = path.join(__dirname, '../../backend/node_modules/mongoose/index.js');
    if (!fs.existsSync(mongoosePath)) return null;

    const mongoose = (await import(mongoosePath)).default;
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[SEO Generator] Connected to MongoDB Atlas successfully.');

    const products = await mongoose.connection.collection('products').find({}).toArray();
    console.log(`[SEO Generator] Retrieved ${products.length} products from live database.`);

    let coins = [];
    try {
      coins = await mongoose.connection.collection('coins').find({}).toArray();
      console.log(`[SEO Generator] Retrieved ${coins.length} coins from live database.`);
    } catch (_) {}

    await mongoose.disconnect();
    return [...products, ...coins];
  } catch (err) {
    console.warn(`[SEO Generator] Notice: MongoDB connection skipped/failed (${err.message}). Using fallback sources.`);
    return null;
  }
}

async function fetchFromApi() {
  const endpoints = [
    'https://lightpink-locust-700517.hostingersite.com/api/products',
    'https://lightpink-locust-700517.hostingersite.com/api/admin/products',
    'http://localhost:55000/api/products',
    'http://localhost:55000/api/admin/products',
    'http://localhost:5000/api/products'
  ];

  for (const ep of endpoints) {
    try {
      console.log(`[SEO Generator] Fetching products from ${ep}...`);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(ep, { signal: ctrl.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const json = await res.json();
      const list = json?.data || json?.products || (Array.isArray(json) ? json : []);
      if (list.length > 0) {
        console.log(`[SEO Generator] Fetched ${list.length} products from ${ep}.`);
        return list;
      }
    } catch (e) {
      console.warn(`[SEO Generator] Warning fetching ${ep}: ${e.message}`);
    }
  }
  return null;
}

function fetchFromBackups() {
  const backupFiles = [
    path.join(__dirname, '../../backend/backups/db_backup_2026-09-15T06-21-50-521Z/products.json'),
    path.join(__dirname, '../../tbl_products1.json')
  ];

  for (const bp of backupFiles) {
    if (fs.existsSync(bp)) {
      try {
        const raw = fs.readFileSync(bp, 'utf-8');
        const json = JSON.parse(raw);
        const list = Array.isArray(json) ? json : (json.data || []);
        if (list.length > 0) {
          console.log(`[SEO Generator] Loaded ${list.length} products from backup file: ${path.basename(bp)}`);
          return list;
        }
      } catch (e) {
        console.warn(`[SEO Generator] Backup load failed for ${bp}: ${e.message}`);
      }
    }
  }
  return [];
}

async function getAllProducts() {
  const mongoData = await fetchFromMongo();
  if (mongoData && mongoData.length > 0) return mongoData;

  const apiData = await fetchFromApi();
  if (apiData && apiData.length > 0) return apiData;

  return fetchFromBackups();
}

function extractImages(p) {
  const images = [];

  if (Array.isArray(p.images) && p.images.length > 0) {
    for (const img of p.images) {
      if (img && typeof img === 'string') {
        const full = img.startsWith('http') ? img : `https://media.zoniraz.com/uploads/${img.replace(/^\/+/, '')}`;
        if (!images.includes(full)) images.push(full);
      }
    }
  } else if (p.gallery) {
    try {
      const g = typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery;
      if (typeof g === 'object' && g !== null) {
        for (const k of Object.keys(g)) {
          if (Array.isArray(g[k])) {
            for (const img of g[k]) {
              if (img && typeof img === 'string') {
                const full = img.startsWith('http') ? img : `https://media.zoniraz.com/uploads/${img.replace(/^\/+/, '')}`;
                if (!images.includes(full)) images.push(full);
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  if (p.image && typeof p.image === 'string') {
    const full = p.image.startsWith('http') ? p.image : `https://media.zoniraz.com/uploads/${p.image.replace(/^\/+/, '')}`;
    if (!images.includes(full)) images.unshift(full);
  }

  if (images.length === 0) {
    images.push('https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png');
  }

  return images;
}

function computeProductMetadata(p) {
  const slug = (p.product_slug || p.slug || p.coin_slug || p.sku || String(p.product_id || p.id || p._id || '')).trim();
  if (!slug) return null;

  const name = (p.product_title || p.name || p.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).trim();
  const category = (p.product_category || p.category || (p.is_coin || p.coin_type ? 'Gold Coins' : 'Fine Jewellery')).trim();
  const subcategory = (p.product_subcategory || p.subcategory || '').trim();

  let title = '';
  if (name.toLowerCase().includes('zoniraz')) {
    title = name;
  } else {
    title = `${name} | ${category} in Alwar | Zoniraz`;
  }

  let description = '';
  if (p.description && p.description.trim().length > 0) {
    description = p.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 155);
  } else {
    description = `Buy ${name} online in Alwar at Zoniraz Jewels. Handcrafted in premium quality with exquisite design. Certificate of authenticity included.`;
  }

  const images = extractImages(p);
  const primaryImage = images[0] || 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png';
  const canonical = `${DOMAIN}/product/${slug}`;

  const price = Number(p.price || p.basePrice || p.selling_price || p.regular_price || 0);
  const discount = Number(p.discount || 0);
  const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : (Number(p.originalPrice || price) || price);
  const sku = String(p.product_code || p.sku || p.product_id || p._id || slug);

  // Status check: '1' or 1 is active, '0' or 0 is inactive
  const isAvailable = (p.status !== '0' && p.status !== 0 && p.stock !== 0);
  const availability = isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

  return {
    id: String(p._id || p.product_id || p.id || slug),
    product_id: String(p.product_id || p._id || p.id || slug),
    product_slug: slug,
    slug,
    name,
    category,
    subcategory,
    title,
    description,
    canonical,
    image: primaryImage,
    images,
    price,
    originalPrice,
    sku,
    availability,
    status: String(p.status ?? '1'),
    gold_weight: p.gold_weight || p.product_weight || 0,
    diamond_weight: p.diamond_weight || 0,
    metal_type: p.metal_type || (p.coin_type ? `${p.coin_type} Gold` : 'Gold')
  };
}

async function main() {
  console.log(`\n==============================================`);
  console.log(`ZONIRAZ SEO METADATA DICTIONARY GENERATOR`);
  console.log(`==============================================\n`);

  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');

  const products = await getAllProducts();
  const productsSeoMap = {};

  for (const p of products) {
    const meta = computeProductMetadata(p);
    if (!meta || !meta.slug) continue;

    // Index by primary slug
    productsSeoMap[meta.slug] = meta;

    // Also index lowercase slug if different
    const lowerSlug = meta.slug.toLowerCase();
    if (lowerSlug !== meta.slug) {
      productsSeoMap[lowerSlug] = meta;
    }

    // Also index by product_id or sku if different
    if (p.product_id && String(p.product_id) !== meta.slug) {
      productsSeoMap[String(p.product_id)] = meta;
    }
    if (p.product_code && String(p.product_code) !== meta.slug && String(p.product_code) !== '00000') {
      productsSeoMap[String(p.product_code)] = meta;
    }
  }

  const jsonContent = JSON.stringify(productsSeoMap, null, 2);
  fs.writeFileSync(path.join(publicDir, 'products_seo.json'), jsonContent, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'products_seo.json'), jsonContent, 'utf-8');
  }
  console.log(`[SEO Generator] Successfully generated products_seo.json with ${Object.keys(productsSeoMap).length} indexed entries.`);

  // Clean up physical route subdirectories to avoid Apache mod_dir 301 trailing slash redirects
  const subDirsToClean = [
    'product', 'rings', 'earrings', 'pendants', 'necklaces', 'bangles',
    'bracelets', 'mangalsutras', 'nose-pins', 'solitaires', 'gold-coins', 'silver-coin', 'silver-coins', 'coins',
    'about', 'contact', 'zoniraz-alwar', 'franchise', 'sell-gold', 'buy-gold',
    'gold-mine', 'loose-stones', 'all-collections',
    'delivery', 'privacy', 'terms', 'cart', 'checkout', 'wishlist', 'profile',
    'admin-call', 'wallet', 'blog'
  ];

  for (const sub of subDirsToClean) {
    const dirPath = path.join(distDir, sub);
    if (fs.existsSync(dirPath)) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
      } catch (e) {
        console.warn(`[SEO Generator] Notice: Could not remove directory ${sub}: ${e.message}`);
      }
    }
  }
  console.log(`[SEO Generator] Cleaned up physical route subdirectories to ensure clean canonical URLs.`);

  console.log(`\n==============================================`);
  console.log(`SEO DICTIONARY & ROUTER SYNCHRONIZATION COMPLETE`);
  console.log(`==============================================\n`);
}

main().catch(err => {
  console.error('[SEO Generator] Fatal error:', err);
  process.exit(1);
});
