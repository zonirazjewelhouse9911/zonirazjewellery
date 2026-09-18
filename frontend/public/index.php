<?php
/**
 * index.php - Dynamic SEO Meta Injector for Zoniraz Single Page Application (SPA)
 * Ensures every page returns the correct title, OpenGraph, Canonical, and Meta Description
 * in raw HTML when "View Page Source" is opened or when crawled by search bots.
 */

$domain = 'https://zoniraz.com';
$requestUri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
$cleanUri = strtok($requestUri, '?');
$cleanPath = trim($cleanUri, '/');

// 1. Categories Metadata Map
$categories = [
    'rings' => [
        'title' => 'Luxury Rings | Gold & Diamond Rings Online in Alwar | Zoniraz',
        'description' => 'Shop handcrafted gold and diamond rings in Alwar at Zoniraz. Explore engagement rings, wedding bands, solitaire rings, and daily wear designs.',
        'canonical' => $domain . '/rings'
    ],
    'earrings' => [
        'title' => 'Diamond & Gold Earrings Online in Alwar | Zoniraz',
        'description' => 'Discover stunning gold and diamond earrings in Alwar at Zoniraz. Browse studs, hoops, jhumkis, and drops crafted for every occasion.',
        'canonical' => $domain . '/earrings'
    ],
    'pendants' => [
        'title' => 'Gold & Diamond Pendants Online in Alwar | Zoniraz',
        'description' => 'Explore designer gold and diamond pendants in Alwar at Zoniraz. From classic solitaires to custom name pendants, find your perfect piece.',
        'canonical' => $domain . '/pendants'
    ],
    'necklaces' => [
        'title' => 'Gold & Diamond Necklaces Online in Alwar | Zoniraz',
        'description' => 'Shop timeless gold, diamond, and bridal necklaces in Alwar at Zoniraz. Handcrafted luxury designs with certified gemstones and BIS hallmark.',
        'canonical' => $domain . '/necklaces'
    ],
    'bangles' => [
        'title' => 'Gold & Diamond Bangles Online in Alwar | Zoniraz',
        'description' => 'Buy elegant gold and diamond bangles in Alwar at Zoniraz. Browse traditional bridal kadas, lightweight daily wear bangles, and luxury cuffs.',
        'canonical' => $domain . '/bangles'
    ],
    'bracelets' => [
        'title' => 'Designer Gold & Diamond Bracelets Online in Alwar | Zoniraz',
        'description' => 'Discover fine diamond tennis bracelets, charm bracelets, and gold chain bracelets in Alwar at Zoniraz. Modern designs at transparent prices.',
        'canonical' => $domain . '/bracelets'
    ],
    'mangalsutras' => [
        'title' => 'Modern Diamond & Gold Mangalsutras in Alwar | Zoniraz',
        'description' => 'Explore contemporary and traditional diamond mangalsutras in Alwar at Zoniraz. Authentic black bead sacred designs crafted in 14K & 18K gold.',
        'canonical' => $domain . '/mangalsutras'
    ],
    'nose-pins' => [
        'title' => 'Gold & Diamond Nose Pins Online in Alwar | Zoniraz',
        'description' => 'Shop sparkling diamond nose pins and gold nose rings in Alwar at Zoniraz. Lightweight, comfortable, and certified fine jewellery designs.',
        'canonical' => $domain . '/nose-pins'
    ],
    'solitaires' => [
        'title' => 'Certified Solitaire Diamond Jewellery in Alwar | Zoniraz',
        'description' => 'Experience radiant certified solitaire diamonds in Alwar at Zoniraz. Handcrafted solitaire engagement rings, pendants, and stud earrings.',
        'canonical' => $domain . '/solitaires'
    ],
    'gold-coins' => [
        'title' => '24K 999 Purity Gold Coins in Alwar | Zoniraz',
        'description' => 'Buy 24K pure gold coins with tamper-proof certicard packaging in Alwar at Zoniraz. Ideal for auspicious gifting, Dhanteras, and gold investment.',
        'canonical' => $domain . '/gold-coins'
    ]
];

// 2. Static Pages Metadata Map
$staticPages = [
    'about' => [
        'title' => 'About Zoniraz | Luxury Diamond & Gold Jewellery Heritage in Alwar',
        'description' => 'Learn about Zoniraz Jewels, Alwar premier luxury jewellery destination. Discover our heritage of craftsmanship, certified diamonds, and hallmarked gold.',
        'canonical' => $domain . '/about'
    ],
    'contact' => [
        'title' => 'Contact Zoniraz | Fine Jewellery Showroom in Alwar',
        'description' => 'Get in touch with Zoniraz Jewel House in Alwar. Visit our showroom at Tilak Market or contact our jewellery experts for custom consultations.',
        'canonical' => $domain . '/contact'
    ],
    'zoniraz-alwar' => [
        'title' => 'Zoniraz Jewellery Store in Alwar | Best Gold & Diamond Shop',
        'description' => 'Visit the official Zoniraz Jewel House showroom in Alwar, Rajasthan. 100% BIS hallmarked gold, certified natural diamonds, and transparent old gold exchange.',
        'canonical' => $domain . '/zoniraz-alwar'
    ],
    'franchise' => [
        'title' => 'Jewellery Franchise Opportunity | Partner with Zoniraz in Alwar',
        'description' => 'Join Zoniraz as a retail jewellery franchise partner. Explore high-growth business opportunities in fine gold, diamond, and lifestyle jewellery.',
        'canonical' => $domain . '/franchise'
    ],
    'sell-gold' => [
        'title' => 'Old Gold Exchange & Valuation in Alwar | Best Value at Zoniraz',
        'description' => 'Exchange your old gold jewellery with 100% computerized karatmeter purity testing in Alwar at Zoniraz. Get instant fair market valuation.',
        'canonical' => $domain . '/sell-gold'
    ],
    'buy-gold' => [
        'title' => 'Buy 24K Digital & Physical Gold Online in Alwar | Zoniraz',
        'description' => 'Invest in 24K pure gold with Zoniraz. Start with digital gold savings or purchase hallmarked gold coins with secure insured delivery.',
        'canonical' => $domain . '/buy-gold'
    ],
    'gold-mine' => [
        'title' => '10+1 Monthly Gold Savings Scheme in Alwar | Zoniraz Gold Mine',
        'description' => 'Enroll in the Zoniraz 10+1 Gold Mine savings plan. Pay for 10 months and get a bonus contribution on the 11th month towards your jewellery purchase.',
        'canonical' => $domain . '/gold-mine'
    ],
    'loose-stones' => [
        'title' => 'Certified Loose Diamonds & Solitaires in Alwar | Zoniraz',
        'description' => 'Buy GIA and IGI certified natural loose diamonds and precious gemstones in Alwar. Custom design your dream ring or pendant with Zoniraz.',
        'canonical' => $domain . '/loose-stones'
    ],
    'custom-name-pendant' => [
        'title' => 'Custom Name Pendant Maker in Gold & Diamond | Zoniraz',
        'description' => 'Design personalized custom name pendants in real gold and diamonds at Zoniraz. Choose your font, metal color, and preview live before crafting.',
        'canonical' => $domain . '/custom-name-pendant'
    ],
    'all-collections' => [
        'title' => 'Explore Designer Jewellery Collections in Alwar | Zoniraz',
        'description' => 'Browse curated fine jewellery collections by Zoniraz. Discover bridal masterpieces, everyday minimalist styles, and heritage gold creations.',
        'canonical' => $domain . '/all-collections'
    ],
    'delivery' => [
        'title' => 'Delivery, Shipping & Return Information | Zoniraz',
        'description' => 'Learn about our 100% insured delivery, secure shipping options, 15-day return policy, and payment methods at Zoniraz.',
        'canonical' => $domain . '/delivery'
    ],
    'blog' => [
        'title' => 'Jewellery Guides, Trends & Buying Advice Blog | Zoniraz',
        'description' => 'Stay inspired with the latest jewellery trends, diamond buying guides, gold investment tips, and bridal fashion advice from Zoniraz.',
        'canonical' => $domain . '/blog'
    ],
    'privacy' => [
        'title' => 'Privacy Policy | Zoniraz Jewels',
        'description' => 'Read the privacy policy of Zoniraz Jewels. Learn how we safeguard your personal data, transactions, and browsing information.',
        'canonical' => $domain . '/privacy'
    ],
    'terms' => [
        'title' => 'Terms & Conditions | Zoniraz Jewels',
        'description' => 'Terms of service, purchasing policies, warranties, and conditions for shopping at Zoniraz Jewels.',
        'canonical' => $domain . '/terms'
    ],
    'cart' => [
        'title' => 'Shopping Bag | Zoniraz',
        'description' => 'Review your selected luxury jewellery pieces in your Zoniraz shopping bag.',
        'canonical' => $domain . '/cart'
    ],
    'checkout' => [
        'title' => 'Secure Checkout | Zoniraz',
        'description' => 'Complete your luxury jewellery order securely with Zoniraz.',
        'canonical' => $domain . '/checkout'
    ],
    'wishlist' => [
        'title' => 'My Wishlist | Zoniraz',
        'description' => 'View and manage your saved jewellery pieces at Zoniraz.',
        'canonical' => $domain . '/wishlist'
    ],
    'profile' => [
        'title' => 'My Account & Ledger | Zoniraz',
        'description' => 'Manage your Zoniraz profile, orders, addresses, and 10+1 Gold Mine wallet.',
        'canonical' => $domain . '/profile'
    ]
];

// Determine Page Metadata
$title = 'Best Diamond Jewellery in Alwar | Zoniraz';
$description = 'Zoniraz - Discover fine gold, diamond, and luxury jewellery online in Alwar. Browse handcrafted rings, necklaces, bangles, and bridal collections.';
$canonical = $domain . '/';
$image = 'https://res.cloudinary.com/fxokwlyu/image/upload/v1788498405/zoniraz_frontend/zoni1.png';

if ($cleanPath === '' || $cleanPath === 'index.html' || $cleanPath === 'index.php') {
    // Homepage
    $title = 'Best Diamond Jewellery in Alwar | Zoniraz';
    $canonical = $domain . '/';
} elseif (isset($categories[$cleanPath])) {
    // Category Page
    $title = $categories[$cleanPath]['title'];
    $description = $categories[$cleanPath]['description'];
    $canonical = $categories[$cleanPath]['canonical'];
} elseif (isset($staticPages[$cleanPath])) {
    // Static Page
    $title = $staticPages[$cleanPath]['title'];
    $description = $staticPages[$cleanPath]['description'];
    $canonical = $staticPages[$cleanPath]['canonical'];
} elseif (strpos($cleanPath, 'blog/') === 0) {
    // Single Blog Article
    $blogSlug = substr($cleanPath, 5);
    $cleanBlog = ucwords(str_replace('-', ' ', $blogSlug));
    $title = $cleanBlog . ' | Zoniraz Blog';
    $description = 'Read our latest fine jewellery insights, diamond buying guides, and styling tips on the Zoniraz blog.';
    $canonical = $domain . '/blog/' . $blogSlug;
} elseif (strpos($cleanPath, 'product/') === 0) {
    // Product Page
    $productSlug = substr($cleanPath, 8);
    $cleanProductSlug = trim($productSlug, '/');

    // Attempt to load from cached products_seo.json
    $seoFile = __DIR__ . '/products_seo.json';
    $found = false;

    if (file_exists($seoFile)) {
        $json = @json_decode(@file_get_contents($seoFile), true);
        if (is_array($json) && isset($json[$cleanProductSlug])) {
            $pData = $json[$cleanProductSlug];
            $title = $pData['title'];
            $description = $pData['description'];
            $canonical = $pData['canonical'];
            if (!empty($pData['image'])) {
                $image = $pData['image'];
            }
            $found = true;
        }
    }

    if (!$found) {
        // Human-friendly title derived from slug
        $slugTitle = ucwords(str_replace('-', ' ', $cleanProductSlug));
        $title = $slugTitle . ' | Fine Jewellery in Alwar | Zoniraz';
        $description = 'Buy ' . $slugTitle . ' online in Alwar at Zoniraz Jewels. Crafted in premium gold and certified diamonds. Certificate of authenticity included.';
        $canonical = $domain . '/product/' . $cleanProductSlug;
    }
}

// Read index.html
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    http_response_code(500);
    echo "index.html template not found.";
    exit;
}

$html = file_get_contents($indexPath);

// Helper function for safe HTML attribute insertion
function safeAttr($val) {
    return htmlspecialchars($val, ENT_QUOTES, 'UTF-8');
}

// Inject Dynamic Metadata into the HTML
$html = preg_replace('/<title>[\s\S]*?<\/title>/i', '<title>' . safeAttr($title) . '</title>', $html);
$html = preg_replace('/<meta\s+name=["\']description["\'][\s\S]*?content=["\'][\s\S]*?["\']\s*\/?>/i', '<meta name="description" content="' . safeAttr($description) . '" />', $html);
$html = preg_replace('/<link\s+id=["\']canonical-link["\']\s+rel=["\']canonical["\']\s+href=["\'][^"\']*["\']\s*\/?>/i', '<link id="canonical-link" rel="canonical" href="' . safeAttr($canonical) . '" />', $html);

// OpenGraph
$html = preg_replace('/<meta\s+property=["\']og:title["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '<meta property="og:title" content="' . safeAttr($title) . '" />', $html);
$html = preg_replace('/<meta\s+property=["\']og:description["\']\s+content=["\'][\s\S]*?["\']\s*\/?>/i', '<meta property="og:description" content="' . safeAttr($description) . '" />', $html);
$html = preg_replace('/<meta\s+property=["\']og:url["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '<meta property="og:url" content="' . safeAttr($canonical) . '" />', $html);
if (!empty($image)) {
    $html = preg_replace('/<meta\s+property=["\']og:image["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '<meta property="og:image" content="' . safeAttr($image) . '" />', $html);
}

// Twitter Card
$html = preg_replace('/<meta\s+name=["\']twitter:title["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '<meta name="twitter:title" content="' . safeAttr($title) . '" />', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:description["\']\s+content=["\'][\s\S]*?["\']\s*\/?>/i', '<meta name="twitter:description" content="' . safeAttr($description) . '" />', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:url["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '<meta name="twitter:url" content="' . safeAttr($canonical) . '" />', $html);
if (!empty($image)) {
    $html = preg_replace('/<meta\s+name=["\']twitter:image["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '<meta name="twitter:image" content="' . safeAttr($image) . '" />', $html);
}

// Send Response
header('Content-Type: text/html; charset=utf-8');
echo $html;
exit;
