<?php
/**
 * sitemap.php - Dynamic live sitemap bridge & cache for Zoniraz Fine Jewellery
 * Automatically fetches fresh sitemaps from the Render backend and caches them locally on Hostinger.
 */

// Allowed sitemap files for security
$allowedFiles = [
    'sitemap.xml' => true,
    'sitemap-blogs.xml' => true,
    'sitemap-products.xml' => true,
    'sitemap-categories.xml' => true,
    'sitemap-static.xml' => true,
];

$backendBase = 'https://zonirazjewellery.onrender.com';

// ── Refresh All Request (e.g. from backend webhook ping) ─────────────────────
if (isset($_GET['refresh_all']) || isset($_GET['sync'])) {
    header("Content-Type: application/json; charset=utf-8");
    $results = [];
    foreach (array_keys($allowedFiles) as $fileName) {
        $content = fetchFromBackend($backendBase . '/' . $fileName);
        if ($content && isValidXml($content)) {
            @file_put_contents(__DIR__ . '/' . $fileName, $content);
            $results[$fileName] = 'updated';
        } else {
            $results[$fileName] = 'failed';
        }
    }
    echo json_encode(['success' => true, 'timestamp' => date('c'), 'files' => $results]);
    exit;
}

// ── Single Sitemap Serving Request ──────────────────────────────────────────
$file = isset($_GET['file']) ? basename($_GET['file']) : 'sitemap.xml';
if (!isset($allowedFiles[$file])) {
    $file = 'sitemap.xml';
}

$localPath = __DIR__ . '/' . $file;
$forceRefresh = isset($_GET['refresh']) || (isset($_SERVER['HTTP_CACHE_CONTROL']) && strpos($_SERVER['HTTP_CACHE_CONTROL'], 'no-cache') !== false);
$cacheTtl = 300; // 5 minutes cache lifetime

$shouldFetch = $forceRefresh;
if (!$shouldFetch) {
    if (!file_exists($localPath) || (time() - filemtime($localPath)) > $cacheTtl) {
        $shouldFetch = true;
    }
}

if ($shouldFetch) {
    $remoteUrl = $backendBase . '/' . $file;
    $freshXml = fetchFromBackend($remoteUrl);

    if ($freshXml && isValidXml($freshXml)) {
        // Save fresh XML to disk on Hostinger so subsequent requests are fast
        @file_put_contents($localPath, $freshXml);
        sendXmlResponse($freshXml, 'live-backend');
        exit;
    }
}

// Fallback to locally cached XML file if present
if (file_exists($localPath)) {
    $cachedXml = @file_get_contents($localPath);
    if ($cachedXml && isValidXml($cachedXml)) {
        sendXmlResponse($cachedXml, 'local-cache');
        exit;
    }
}

// Final fallback: try fetching directly one more time
$emergencyXml = fetchFromBackend($backendBase . '/' . $file);
if ($emergencyXml && isValidXml($emergencyXml)) {
    sendXmlResponse($emergencyXml, 'emergency-backend');
    exit;
}

// Return minimal valid XML if backend unreachable and no cache exists
http_response_code(503);
header("Content-Type: application/xml; charset=utf-8");
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<error>Sitemap temporarily unavailable</error>";
exit;

// ── Helpers ──────────────────────────────────────────────────────────────────
function fetchFromBackend($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'ZonirazSitemapProxy/1.0');
        $data = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($data)) {
            return $data;
        }
    }

    // Stream context fallback
    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 6,
            'header' => "User-Agent: ZonirazSitemapProxy/1.0\r\n"
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    return @file_get_contents($url, false, $ctx);
}

function isValidXml($content) {
    if (empty($content) || !is_string($content)) return false;
    $trimmed = trim($content);
    return strpos($trimmed, '<?xml') === 0 && (strpos($trimmed, '<urlset') !== false || strpos($trimmed, '<sitemapindex') !== false);
}

function sendXmlResponse($content, $source) {
    header("Content-Type: application/xml; charset=utf-8");
    header("Cache-Control: public, max-age=300");
    header("X-Sitemap-Source: " . $source);
    echo $content;
}
