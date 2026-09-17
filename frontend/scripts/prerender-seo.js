import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://zoniraz.com';

async function fetchProducts() {
  const endpoints = [
    'https://zonirazjewellery.onrender.com/api/admin/products',
    'http://localhost:55000/api/admin/products',
    'http://localhost:5000/api/admin/products'
  ];

  for (const ep of endpoints) {
    try {
      console.log(`[SEO Dictionary Generator] Fetching products from ${ep}...`);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(ep, { signal: ctrl.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const json = await res.json();
      const list = json?.data || json?.products || (Array.isArray(json) ? json : []);
      if (list.length > 0) {
        console.log(`[SEO Dictionary Generator] Fetched ${list.length} products from live API.`);
        return list;
      }
    } catch (e) {
      console.warn(`[SEO Dictionary Generator] Warning fetching ${ep}: ${e.message}`);
    }
  }

  // Backup fallbacks
  const backupPaths = [
    path.join(__dirname, '../../backend/backups/db_backup_2026-09-15T06-21-50-521Z/products.json'),
    path.join(__dirname, '../../tbl_products1.json')
  ];

  for (const bp of backupPaths) {
    if (fs.existsSync(bp)) {
      try {
        const raw = fs.readFileSync(bp, 'utf-8');
        const json = JSON.parse(raw);
        const list = Array.isArray(json) ? json : (json.data || []);
        if (list.length > 0) {
          console.log(`[SEO Dictionary Generator] Loaded ${list.length} products from fallback ${path.basename(bp)}.`);
          return list;
        }
      } catch (e) {
        console.warn(`[SEO Dictionary Generator] Backup load failed for ${bp}: ${e.message}`);
      }
    }
  }

  return [];
}

function computeProductMetadata(p) {
  const slug = p.product_slug || p.slug || String(p.product_id || p.id || p._id);
  const name = (p.name || p.product_title || p.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).trim();
  const category = (p.category || p.product_category || 'Fine Jewellery').trim();

  let title = '';
  if (name.toLowerCase().includes('zoniraz')) {
    title = name;
  } else if (name.includes('|')) {
    title = `${name} | ${category} in Alwar | Zoniraz`;
  } else {
    title = `${name} | ${category} in Alwar | Zoniraz`;
  }

  let description = '';
  if (p.description && p.description.trim().length > 0) {
    description = p.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 155);
  } else {
    description = `Buy ${name} online in Alwar at Zoniraz Jewels. Handcrafted in premium quality with exquisite design. Certificate of authenticity included.`;
  }

  const canonical = `${DOMAIN}/product/${slug}`;

  let image = 'https://res.cloudinary.com/fxokwlyu/image/upload/v1788498405/zoniraz_frontend/zoni1.png';
  if (p.image) {
    image = p.image;
  } else if (Array.isArray(p.images) && p.images.length > 0) {
    image = p.images[0];
  } else if (p.gallery) {
    try {
      const g = typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery;
      if (typeof g === 'object' && g !== null) {
        for (const k of Object.keys(g)) {
          if (Array.isArray(g[k]) && g[k].length > 0) {
            const rawImg = g[k][0];
            image = rawImg.startsWith('http') ? rawImg : `https://res.cloudinary.com/fxokwlyu/image/upload/${rawImg}`;
            break;
          }
        }
      }
    } catch (_) {}
  }

  return { slug, name, category, title, description, canonical, image };
}

async function main() {
  console.log(`\n==============================================`);
  console.log(`ZONIRAZ SEO METADATA DICTIONARY GENERATOR`);
  console.log(`==============================================\n`);

  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');

  // 1. Fetch products & build products_seo.json
  const products = await fetchProducts();
  const productsSeoMap = {};

  for (const p of products) {
    const meta = computeProductMetadata(p);
    if (!meta.slug) continue;

    productsSeoMap[meta.slug] = {
      title: meta.title,
      description: meta.description,
      canonical: meta.canonical,
      image: meta.image,
      category: meta.category,
      name: meta.name
    };
  }

  // 2. Save products_seo.json into both public/ and dist/
  const jsonContent = JSON.stringify(productsSeoMap, null, 2);
  fs.writeFileSync(path.join(publicDir, 'products_seo.json'), jsonContent, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'products_seo.json'), jsonContent, 'utf-8');
  }
  console.log(`[SEO Generator] Generated products_seo.json with ${Object.keys(productsSeoMap).length} verified entries.`);

  // 3. Clean up physical route subdirectories from dist/ to avoid Apache mod_dir 301 trailing slash redirects
  const subDirsToClean = [
    'product', 'rings', 'earrings', 'pendants', 'necklaces', 'bangles',
    'bracelets', 'mangalsutras', 'nose-pins', 'solitaires', 'gold-coins',
    'about', 'contact', 'zoniraz-alwar', 'franchise', 'sell-gold', 'buy-gold',
    'gold-mine', 'loose-stones', 'custom-name-pendant', 'all-collections',
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
