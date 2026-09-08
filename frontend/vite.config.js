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
    'rings', 'earrings', 'pendants', 'necklaces', 'bangles',
    'bracelets', 'mangalsutras', 'nose-pins', 'solitaires', 'gold-coins',
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
      return false
    }
    if (clean.startsWith('product/')) {
      const slug = clean.replace('product/', '').trim()
      const sitemapPath = path.resolve(__dirname, 'public/sitemap-products.xml')
      if (fs.existsSync(sitemapPath)) {
        const content = fs.readFileSync(sitemapPath, 'utf-8')
        return content.includes(`/product/${slug}</loc>`)
      }
      return false
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
