import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://zoniraz.com';

const CATEGORY_SEO_METADATA = {
  rings: {
    canonicalSlug: 'rings',
    title: 'Luxury Rings | Gold & Diamond Rings Online in Alwar | Zoniraz',
    description: 'Shop handcrafted gold and diamond rings in Alwar at Zoniraz. Explore engagement rings, wedding bands, solitaire rings, and daily wear designs.'
  },
  earrings: {
    canonicalSlug: 'earrings',
    title: 'Diamond & Gold Earrings Online in Alwar | Zoniraz',
    description: 'Discover stunning gold and diamond earrings in Alwar at Zoniraz. Browse studs, hoops, jhumkis, and drops crafted for every occasion.'
  },
  pendants: {
    canonicalSlug: 'pendants',
    title: 'Gold & Diamond Pendants Online in Alwar | Zoniraz',
    description: 'Explore designer gold and diamond pendants in Alwar at Zoniraz. From classic solitaires to custom name pendants, find your perfect piece.'
  },
  necklaces: {
    canonicalSlug: 'necklaces',
    title: 'Gold & Diamond Necklaces Online in Alwar | Zoniraz',
    description: 'Shop timeless gold, diamond, and bridal necklaces in Alwar at Zoniraz. Handcrafted luxury designs with certified gemstones and BIS hallmark.'
  },
  bangles: {
    canonicalSlug: 'bangles',
    title: 'Gold & Diamond Bangles Online in Alwar | Zoniraz',
    description: 'Buy elegant gold and diamond bangles in Alwar at Zoniraz. Browse traditional bridal kadas, lightweight daily wear bangles, and luxury cuffs.'
  },
  bracelets: {
    canonicalSlug: 'bracelets',
    title: 'Designer Gold & Diamond Bracelets Online in Alwar | Zoniraz',
    description: 'Discover fine diamond tennis bracelets, charm bracelets, and gold chain bracelets in Alwar at Zoniraz. Modern designs at transparent prices.'
  },
  mangalsutras: {
    canonicalSlug: 'mangalsutras',
    title: 'Modern Diamond & Gold Mangalsutras in Alwar | Zoniraz',
    description: 'Explore contemporary and traditional diamond mangalsutras in Alwar at Zoniraz. Authentic black bead sacred designs crafted in 14K & 18K gold.'
  },
  'nose-pins': {
    canonicalSlug: 'nose-pins',
    title: 'Gold & Diamond Nose Pins Online in Alwar | Zoniraz',
    description: 'Shop sparkling diamond nose pins and gold nose rings in Alwar at Zoniraz. Lightweight, comfortable, and certified fine jewellery designs.'
  },
  solitaires: {
    canonicalSlug: 'solitaires',
    title: 'Certified Solitaire Diamond Jewellery in Alwar | Zoniraz',
    description: 'Experience radiant certified solitaire diamonds in Alwar at Zoniraz. Handcrafted solitaire engagement rings, pendants, and stud earrings.'
  },
  'gold-coins': {
    canonicalSlug: 'gold-coins',
    title: '24K 999 Purity Gold Coins in Alwar | Zoniraz',
    description: 'Buy 24K pure gold coins with tamper-proof certicard packaging in Alwar at Zoniraz. Ideal for auspicious gifting, Dhanteras, and gold investment.'
  }
};

const STATIC_PAGE_SEO = {
  about: {
    url: 'https://zoniraz.com/about',
    title: 'About Zoniraz | Luxury Diamond & Gold Jewellery Heritage in Alwar',
    description: 'Learn about Zoniraz Jewels, Alwar premier luxury jewellery destination. Discover our heritage of craftsmanship, certified diamonds, and hallmarked gold.'
  },
  contact: {
    url: 'https://zoniraz.com/contact',
    title: 'Contact Zoniraz | Fine Jewellery Showroom in Alwar',
    description: 'Get in touch with Zoniraz Jewel House in Alwar. Visit our showroom at Tilak Market or contact our jewellery experts for custom consultations.'
  },
  'zoniraz-alwar': {
    url: 'https://zoniraz.com/zoniraz-alwar',
    title: 'Zoniraz Jewellery Store in Alwar | Best Best Gold & Diamond Shop',
    description: 'Visit the official Zoniraz Jewel House showroom in Alwar, Rajasthan. 100% BIS hallmarked gold, certified natural diamonds, and transparent old gold exchange.'
  },
  franchise: {
    url: 'https://zoniraz.com/franchise',
    title: 'Jewellery Franchise Opportunity | Partner with Zoniraz in Alwar',
    description: 'Join Zoniraz as a retail jewellery franchise partner. Explore high-growth business opportunities in fine gold, diamond, and lifestyle jewellery.'
  },
  'sell-gold': {
    url: 'https://zoniraz.com/sell-gold',
    title: 'Old Gold Exchange & Valuation in Alwar | Best Value at Zoniraz',
    description: 'Exchange your old gold jewellery with 100% computerized karatmeter purity testing in Alwar at Zoniraz. Get instant fair market valuation.'
  },
  'buy-gold': {
    url: 'https://zoniraz.com/buy-gold',
    title: 'Buy 24K Digital & Physical Gold Online in Alwar | Zoniraz',
    description: 'Invest in 24K pure gold with Zoniraz. Start with digital gold savings or purchase hallmarked gold coins with secure insured delivery.'
  },
  'gold-mine': {
    url: 'https://zoniraz.com/gold-mine',
    title: '10+1 Monthly Gold Savings Scheme in Alwar | Zoniraz Gold Mine',
    description: 'Enroll in the Zoniraz 10+1 Gold Mine savings plan. Pay for 10 months and get a bonus contribution on the 11th month towards your jewellery purchase.'
  },
  'loose-stones': {
    url: 'https://zoniraz.com/loose-stones',
    title: 'Certified Loose Diamonds & Solitaires in Alwar | Zoniraz',
    description: 'Buy GIA and IGI certified natural loose diamonds and precious gemstones in Alwar. Custom design your dream ring or pendant with Zoniraz.'
  },
  'custom-name-pendant': {
    url: 'https://zoniraz.com/custom-name-pendant',
    title: 'Custom Name Pendant Maker in Gold & Diamond | Zoniraz',
    description: 'Design personalized custom name pendants in real gold and diamonds at Zoniraz. Choose your font, metal color, and preview live before crafting.'
  },
  'all-collections': {
    url: 'https://zoniraz.com/all-collections',
    title: 'Explore Designer Jewellery Collections in Alwar | Zoniraz',
    description: 'Browse curated fine jewellery collections by Zoniraz. Discover bridal masterpieces, everyday minimalist styles, and heritage gold creations.'
  },
  delivery: {
    url: 'https://zoniraz.com/delivery',
    title: 'Delivery, Shipping & Return Information | Zoniraz',
    description: 'Learn about our 100% insured delivery, secure shipping options, 15-day return policy, and payment methods at Zoniraz.'
  },
  blog: {
    url: 'https://zoniraz.com/blog',
    title: 'Jewellery Guides, Trends & Buying Advice Blog | Zoniraz',
    description: 'Stay inspired with the latest jewellery trends, diamond buying guides, gold investment tips, and bridal fashion advice from Zoniraz.'
  },
  privacy: {
    url: 'https://zoniraz.com/privacy',
    title: 'Privacy Policy | Zoniraz Jewels',
    description: 'Read the privacy policy of Zoniraz Jewels. Learn how we safeguard your personal data, transactions, and browsing information.'
  },
  terms: {
    url: 'https://zoniraz.com/terms',
    title: 'Terms and Conditions | Zoniraz Jewels',
    description: 'Read the terms and conditions for shopping online and visiting Zoniraz Jewel House.'
  },
  cart: {
    url: 'https://zoniraz.com/cart',
    title: 'Shopping Cart | Zoniraz',
    description: 'View your selected fine jewellery items in your Zoniraz shopping cart.'
  },
  checkout: {
    url: 'https://zoniraz.com/checkout',
    title: 'Secure Checkout | Zoniraz',
    description: 'Complete your purchase securely with 100% insured delivery at Zoniraz.'
  },
  wishlist: {
    url: 'https://zoniraz.com/wishlist',
    title: 'My Wishlist | Zoniraz',
    description: 'Your saved favorite gold and diamond jewellery designs at Zoniraz.'
  },
  profile: {
    url: 'https://zoniraz.com/profile',
    title: 'My Account & Orders | Zoniraz',
    description: 'Manage your profile, tracked orders, and addresses at Zoniraz.'
  },
  'admin-call': {
    url: 'https://zoniraz.com/admin-call',
    title: 'Live Video Jewellery Consultation | Zoniraz',
    description: 'Connect directly with our jewellery experts in Alwar via live video consultation.'
  },
  wallet: {
    url: 'https://zoniraz.com/wallet',
    title: 'My Wallet | Zoniraz',
    description: 'Manage your Zoniraz store credits and rewards.'
  }
};

const fallbackBlogSlugs = [
  { slug: 'timeless-gold-earring-styles-2026', title: 'Timeless Gold Earring Styles for 2026' },
  { slug: 'ultimate-bridal-jewellery-guide', title: 'The Ultimate Bridal Jewellery Guide' },
  { slug: 'gold-saving-scheme-smartest-investment', title: 'Gold Saving Scheme: The Smartest Investment' },
  { slug: 'old-gold-exchange-best-value', title: 'How to Get the Best Value for Old Gold Exchange' },
  { slug: 'gold-pendant-necklace-layering-guide', title: 'Gold Pendant & Necklace Layering Guide' },
  { slug: 'top-jewellers-in-alwar', title: 'Top Jewellers in Alwar: A Complete Guide' }
];

async function fetchProducts() {
  const endpoints = [
    'https://zonirazjewellery.onrender.com/api/admin/products',
    'http://localhost:55000/api/admin/products',
    'http://localhost:5000/api/admin/products'
  ];

  for (const ep of endpoints) {
    try {
      console.log(`[SEO Prerender] Fetching products from ${ep}...`);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(ep, { signal: ctrl.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const json = await res.json();
      const list = json?.data || json?.products || (Array.isArray(json) ? json : []);
      if (list.length > 0) {
        console.log(`[SEO Prerender] Fetched ${list.length} products from live API.`);
        return list;
      }
    } catch (e) {
      console.warn(`[SEO Prerender] Warning fetching ${ep}: ${e.message}`);
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
          console.log(`[SEO Prerender] Loaded ${list.length} products from fallback ${path.basename(bp)}.`);
          return list;
        }
      } catch (e) {
        console.warn(`[SEO Prerender] Backup load failed for ${bp}: ${e.message}`);
      }
    }
  }

  return [];
}

async function fetchBlogs() {
  const endpoints = [
    'https://zonirazjewellery.onrender.com/api/blogs',
    'http://localhost:55000/api/blogs'
  ];

  for (const ep of endpoints) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(ep, { signal: ctrl.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const json = await res.json();
      const list = json?.data || (Array.isArray(json) ? json : []);
      if (list.length > 0) return list;
    } catch (e) {
      // ignore
    }
  }
  return fallbackBlogSlugs;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

function injectMetadata(html, meta) {
  let res = html;

  // Replace Title
  res = res.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

  // Replace Description
  res = res.replace(/<meta\s+name=["']description["'][\s\S]*?content=["'][\s\S]*?["']\s*\/?>/i, 
    `<meta name="description" content="${escapeHtml(meta.description)}" />`);

  // Replace Canonical Link
  res = res.replace(/<link\s+id=["']canonical-link["']\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link id="canonical-link" rel="canonical" href="${meta.canonical}" />`);

  // Replace Open Graph tags
  res = res.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  res = res.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  res = res.replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${meta.canonical}" />`);
  if (meta.image) {
    res = res.replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image" content="${meta.image}" />`);
  }

  // Replace Twitter tags
  res = res.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  res = res.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);
  res = res.replace(/<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:url" content="${meta.canonical}" />`);
  if (meta.image) {
    res = res.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:image" content="${meta.image}" />`);
  }

  return res;
}

function writePageHtml(distDir, subPath, content) {
  const targetDir = path.join(distDir, subPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), content, 'utf-8');
}

async function main() {
  console.log(`\n==============================================`);
  console.log(`ZONIRAZ PRE-RENDER & SEO METADATA GENERATOR`);
  console.log(`==============================================\n`);

  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');
  const distIndexHtml = path.join(distDir, 'index.html');

  if (!fs.existsSync(distIndexHtml)) {
    console.error(`[SEO Prerender] Error: ${distIndexHtml} not found. Ensure "vite build" runs before prerender.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(distIndexHtml, 'utf-8');

  // 1. Pre-render Static Pages
  console.log(`[SEO Prerender] Generating static informational pages...`);
  let staticCount = 0;
  for (const [key, data] of Object.entries(STATIC_PAGE_SEO)) {
    const pageHtml = injectMetadata(baseHtml, {
      title: data.title,
      description: data.description,
      canonical: data.url,
      image: 'https://res.cloudinary.com/fxokwlyu/image/upload/v1788498405/zoniraz_frontend/zoni1.png'
    });
    writePageHtml(distDir, key, pageHtml);
    staticCount++;
  }
  console.log(`[SEO Prerender] Pre-rendered ${staticCount} static pages.`);

  // 2. Pre-render Category Pages
  console.log(`[SEO Prerender] Generating category pages...`);
  let categoryCount = 0;
  for (const [key, data] of Object.entries(CATEGORY_SEO_METADATA)) {
    const catHtml = injectMetadata(baseHtml, {
      title: data.title,
      description: data.description,
      canonical: `${DOMAIN}/${data.canonicalSlug}`,
      image: 'https://res.cloudinary.com/fxokwlyu/image/upload/v1788498405/zoniraz_frontend/zoni1.png'
    });
    writePageHtml(distDir, key, catHtml);
    categoryCount++;
  }
  console.log(`[SEO Prerender] Pre-rendered ${categoryCount} category pages.`);

  // 3. Pre-render Blogs
  console.log(`[SEO Prerender] Generating blog pages...`);
  const blogs = await fetchBlogs();
  let blogCount = 0;
  for (const b of blogs) {
    const slug = b.slug || b.id;
    if (!slug) continue;
    const title = b.title ? `${b.title} | Zoniraz Blog` : `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | Zoniraz Blog`;
    const desc = b.meta_description || b.excerpt || 'Read our latest fine jewellery insights, diamond buying guides, and styling tips on the Zoniraz blog.';
    const canonical = `${DOMAIN}/blog/${slug}`;

    const blogHtml = injectMetadata(baseHtml, {
      title,
      description: desc,
      canonical,
      image: b.featured_image || 'https://res.cloudinary.com/fxokwlyu/image/upload/v1788498405/zoniraz_frontend/zoni1.png'
    });
    writePageHtml(distDir, `blog/${slug}`, blogHtml);
    blogCount++;
  }
  console.log(`[SEO Prerender] Pre-rendered ${blogCount} blog pages.`);

  // 4. Pre-render Products & build products_seo.json
  console.log(`[SEO Prerender] Fetching product catalog...`);
  const products = await fetchProducts();
  const productsSeoMap = {};

  let productCount = 0;
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

    const productHtml = injectMetadata(baseHtml, meta);
    writePageHtml(distDir, `product/${meta.slug}`, productHtml);
    productCount++;
  }

  console.log(`[SEO Prerender] Pre-rendered ${productCount} product pages into dist/product/<slug>/index.html.`);

  // 5. Save products_seo.json into both public/ and dist/
  const jsonContent = JSON.stringify(productsSeoMap, null, 2);
  fs.writeFileSync(path.join(distDir, 'products_seo.json'), jsonContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'products_seo.json'), jsonContent, 'utf-8');
  console.log(`[SEO Prerender] Saved products_seo.json (${Object.keys(productsSeoMap).length} entries) to dist/ and public/.`);

  console.log(`\n==============================================`);
  console.log(`SEO PRERENDER COMPLETE: ALL HTML FILES READY`);
  console.log(`==============================================\n`);
}

main().catch(err => {
  console.error('[SEO Prerender] Fatal error:', err);
  process.exit(1);
});
