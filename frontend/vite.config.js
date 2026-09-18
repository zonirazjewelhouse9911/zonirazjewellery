import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function spa404Plugin() {
  const staticSlugs = new Set([
    '', 'about', 'contact', 'zoniraz-alwar', 'franchise', 'sell-gold',
    'buy-gold', 'gold-mine', 'loose-stones', 'custom-name-pendant',
    'all-collections', 'delivery', 'privacy', 'terms', 'cart',
    'checkout', 'wishlist', 'profile', 'admin-call', 'wallet',
    'rings', 'earrings', 'pendants', 'pendant', 'necklaces', 'bangles',
    'bracelets', 'mangalsutras', 'mangalsutra', 'nose-pins', 'nose-pin',
    'solitaires', 'solitaire', 'gold-coins', 'coins', 'chain', 'chains',
    'zodiac', 'brooches', 'anklets', 'mens-jewellery', 'womens-jewellery', 'kids-jewellery',
    'blog'
  ])

  const legacyRedirects = {
    'trending-now': '/rings',
    'trending': '/rings',
    'collections': '/all-collections',
    'exchange': '/sell-gold',
    'plans/gold-mine': '/gold-mine',
    'buy-loose-stones': '/loose-stones',
    'loose-diamonds': '/loose-stones',
    'custom-pendant': '/custom-name-pendant',
    'custom-pendant-prototype': '/custom-name-pendant',
    'shipping': '/delivery',
    'international-shipping': '/delivery',
    'payment': '/delivery',
    'returns': '/delivery',
    'giftcards': '/delivery',
    'blogs': '/blog'
  }

  const isKnownRoute = (urlPath) => {
    const clean = urlPath.split('?')[0].replace(/^\/+|\/+$/g, '')
    if (staticSlugs.has(clean)) return true
    if (clean.startsWith('blog/')) {
      const bSlug = clean.replace('blog/', '').trim()
      const sitemapPath = path.resolve(__dirname, 'public/sitemap-blogs.xml')
      if (fs.existsSync(sitemapPath)) {
        const content = fs.readFileSync(sitemapPath, 'utf-8')
        return content.includes(`/blog/${bSlug}</loc>`)
      }
      return Boolean(bSlug)
    }
    if (clean.startsWith('product/')) {
      const slug = clean.replace('product/', '').trim()
      return Boolean(slug)
    }
    return false
  }

  const handleMiddleware = (req, res, next) => {
    const rawUrl = req.url || ''
    const cleanPath = rawUrl.split('?')[0].replace(/^\/+|\/+$/g, '')

    // Allow assets, vite internals, api
    if (rawUrl.includes('.') || rawUrl.startsWith('/api') || rawUrl.startsWith('/@') || rawUrl.startsWith('/node_modules') || rawUrl.startsWith('/src')) {
      return next()
    }

    // Check legacy redirects
    if (legacyRedirects[cleanPath] || cleanPath.startsWith('profile/ten-plus-one-product')) {
      const dest = legacyRedirects[cleanPath] || '/gold-mine'
      res.statusCode = 301
      res.setHeader('Location', dest)
      return res.end()
    }

    // Check if route is valid
    if (!isKnownRoute(cleanPath)) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      const distIndex = path.resolve(__dirname, 'dist/index.html')
      const devIndex = path.resolve(__dirname, 'index.html')
      const fileToServe = fs.existsSync(distIndex) ? distIndex : devIndex
      if (fs.existsSync(fileToServe)) {
        return res.end(fs.readFileSync(fileToServe, 'utf-8'))
      }
    }
    next()
  }

  return {
    name: 'spa-404-middleware',
    configureServer(server) {
      server.middlewares.use(handleMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleMiddleware)
    },
    transformIndexHtml(html, ctx) {
      const rawUrl = ctx.originalUrl || ctx.path || ''
      const clean = rawUrl.split('?')[0].replace(/^\/+|\/+$/g, '')

      const categoryTitles = {
        rings: 'Luxury Rings | Gold & Diamond Rings Online in Alwar | Zoniraz',
        earrings: 'Diamond & Gold Earrings Online in Alwar | Zoniraz',
        pendants: 'Gold & Diamond Pendants Online in Alwar | Zoniraz',
        pendant: 'Gold & Diamond Pendants Online in Alwar | Zoniraz',
        necklaces: 'Gold & Diamond Necklaces Online in Alwar | Zoniraz',
        bangles: 'Gold & Diamond Bangles Online in Alwar | Zoniraz',
        bracelets: 'Designer Gold & Diamond Bracelets Online in Alwar | Zoniraz',
        mangalsutras: 'Modern Diamond & Gold Mangalsutras in Alwar | Zoniraz',
        mangalsutra: 'Modern Diamond & Gold Mangalsutras in Alwar | Zoniraz',
        'nose-pins': 'Gold & Diamond Nose Pins Online in Alwar | Zoniraz',
        'nose-pin': 'Gold & Diamond Nose Pins Online in Alwar | Zoniraz',
        solitaires: 'Certified Solitaire Diamond Jewellery in Alwar | Zoniraz',
        solitaire: 'Certified Solitaire Diamond Jewellery in Alwar | Zoniraz',
        'gold-coins': '24K 999 Purity Gold Coins in Alwar | Zoniraz',
        coins: '24K 999 Purity Gold Coins in Alwar | Zoniraz',
        chain: 'Gold & Diamond Chains Online in Alwar | Zoniraz',
        chains: 'Gold & Diamond Chains Online in Alwar | Zoniraz',
        zodiac: 'Zodiac Sign Gold & Diamond Jewellery in Alwar | Zoniraz',
        brooches: 'Designer Gold & Gemstone Brooches in Alwar | Zoniraz',
        anklets: 'Gold & Diamond Anklets Online in Alwar | Zoniraz',
        'mens-jewellery': "Men's Gold & Diamond Jewellery in Alwar | Zoniraz",
        'womens-jewellery': "Women's Luxury Jewellery Collection in Alwar | Zoniraz",
        'kids-jewellery': 'Kids Gold Jewellery & Nazariya in Alwar | Zoniraz'
      }

      const staticTitles = {
        about: 'About Zoniraz | Luxury Diamond & Gold Jewellery Heritage in Alwar',
        contact: 'Contact Zoniraz | Fine Jewellery Showroom in Alwar',
        'zoniraz-alwar': 'Zoniraz Jewellery Store in Alwar | Best Gold & Diamond Shop',
        franchise: 'Jewellery Franchise Opportunity | Partner with Zoniraz in Alwar',
        'sell-gold': 'Old Gold Exchange & Valuation in Alwar | Best Value at Zoniraz',
        'buy-gold': 'Buy 24K Digital & Physical Gold Online in Alwar | Zoniraz',
        'gold-mine': '10+1 Monthly Gold Savings Scheme in Alwar | Zoniraz Gold Mine',
        'loose-stones': 'Certified Loose Diamonds & Solitaires in Alwar | Zoniraz',
        'custom-name-pendant': 'Custom Name Pendant Maker in Gold & Diamond | Zoniraz',
        'all-collections': 'Explore Designer Jewellery Collections in Alwar | Zoniraz',
        delivery: 'Delivery, Shipping & Return Information | Zoniraz',
        blog: 'Jewellery Guides, Trends & Buying Advice Blog | Zoniraz',
        privacy: 'Privacy Policy | Zoniraz Jewels',
        terms: 'Terms and Conditions | Zoniraz Jewels'
      }

      let title = ''
      let desc = ''
      let canonical = `https://zoniraz.com/${clean}`

      if (clean.startsWith('product/')) {
        const slug = clean.replace('product/', '').trim()
        const seoFile = path.resolve(__dirname, 'public/products_seo.json')
        if (fs.existsSync(seoFile)) {
          try {
            const data = JSON.parse(fs.readFileSync(seoFile, 'utf-8'))
            if (data[slug]) {
              title = data[slug].title
              desc = data[slug].description
              canonical = data[slug].canonical
            }
          } catch (_) {}
        }
        if (!title) {
          const cleanTitle = decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          title = `${cleanTitle} | Fine Jewellery in Alwar | Zoniraz`
          desc = `Buy ${cleanTitle} online in Alwar at Zoniraz Jewels.`
        }
      } else if (clean.startsWith('blog/')) {
        const bSlug = clean.replace('blog/', '').trim()
        const cleanBlog = decodeURIComponent(bSlug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        title = `${cleanBlog} | Zoniraz Blog`
      } else if (categoryTitles[clean]) {
        title = categoryTitles[clean]
      } else if (staticTitles[clean]) {
        title = staticTitles[clean]
      }

      if (title) {
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
        html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
        html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`)
      }
      if (desc) {
        html = html.replace(/<meta\s+name=["']description["'][\s\S]*?content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${desc}" />`)
        html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:description" content="${desc}" />`)
        html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="twitter:description" content="${desc}" />`)
      }
      if (canonical) {
        html = html.replace(/<link\s+id=["']canonical-link["']\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, `<link id="canonical-link" rel="canonical" href="${canonical}" />`)
        html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`)
      }

      return html
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spa404Plugin()],
  define: {
    global: 'window',
  },
  server: {
    port: 5175,
    host: true
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
})
