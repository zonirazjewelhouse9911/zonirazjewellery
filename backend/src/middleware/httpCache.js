/**
 * HTTP Cache-Control Middleware
 * Directs browsers and CDN caches to store responses locally,
 * reducing repeated server requests to 0ms on back/forward and repeat navigations.
 */

function httpCache(maxAgeSeconds = 60, staleSeconds = 180) {
  return (req, res, next) => {
    // Only apply to safe GET requests
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleSeconds}`);
    }
    next();
  };
}

module.exports = httpCache;
