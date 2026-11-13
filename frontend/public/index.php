<?php
/**
 * index.php - Dynamic SEO Meta & Prerender Injector for Zoniraz Single Page Application (SPA)
 * Ensures every page returns the correct title, OpenGraph, Canonical, Meta Description,
 * Schema.org Product/Breadcrumb JSON-LD, and semantic HTML in raw HTTP responses
 * when crawled by search bots (Googlebot, Bingbot) or viewed in raw source.
 */

try {
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
    'pendant' => [
        'title' => 'Gold & Diamond Pendants Online in Alwar | Zoniraz',
        'description' => 'Explore designer gold and diamond pendants in Alwar at Zoniraz. From classic solitaires to custom name pendants, find your perfect piece.',
        'canonical' => $domain . '/pendant'
    ],
    'chain' => [
        'title' => 'Gold & Diamond Chains Online in Alwar | Zoniraz',
        'description' => 'Buy pure gold chains and diamond chains in Alwar at Zoniraz. Explore rope chains, box chains, Cuban link chains, and daily wear designs.',
        'canonical' => $domain . '/chain'
    ],
    'chains' => [
        'title' => 'Gold & Diamond Chains Online in Alwar | Zoniraz',
        'description' => 'Buy pure gold chains and diamond chains in Alwar at Zoniraz. Explore rope chains, box chains, Cuban link chains, and daily wear designs.',
        'canonical' => $domain . '/chains'
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
    'mangalsutra' => [
        'title' => 'Modern Diamond & Gold Mangalsutras in Alwar | Zoniraz',
        'description' => 'Explore contemporary and traditional diamond mangalsutras in Alwar at Zoniraz. Authentic black bead sacred designs crafted in 14K & 18K gold.',
        'canonical' => $domain . '/mangalsutra'
    ],
    'nose-pins' => [
        'title' => 'Gold & Diamond Nose Pins Online in Alwar | Zoniraz',
        'description' => 'Shop sparkling diamond nose pins and gold nose rings in Alwar at Zoniraz. Lightweight, comfortable, and certified fine jewellery designs.',
        'canonical' => $domain . '/nose-pins'
    ],
    'nose-pin' => [
        'title' => 'Gold & Diamond Nose Pins Online in Alwar | Zoniraz',
        'description' => 'Shop sparkling diamond nose pins and gold nose rings in Alwar at Zoniraz. Lightweight, comfortable, and certified fine jewellery designs.',
        'canonical' => $domain . '/nose-pin'
    ],
    'solitaires' => [
        'title' => 'Certified Solitaire Diamond Jewellery in Alwar | Zoniraz',
        'description' => 'Experience radiant certified solitaire diamonds in Alwar at Zoniraz. Handcrafted solitaire engagement rings, pendants, and stud earrings.',
        'canonical' => $domain . '/solitaires'
    ],
    'solitaire' => [
        'title' => 'Certified Solitaire Diamond Jewellery in Alwar | Zoniraz',
        'description' => 'Experience radiant certified solitaire diamonds in Alwar at Zoniraz. Handcrafted solitaire engagement rings, pendants, and stud earrings.',
        'canonical' => $domain . '/solitaire'
    ],
    'gold-coins' => [
        'title' => '24K 999 Purity Gold Coins in Alwar | Zoniraz',
        'description' => 'Buy 24K pure gold coins with tamper-proof certicard packaging in Alwar at Zoniraz. Ideal for auspicious gifting, Dhanteras, and gold investment.',
        'canonical' => $domain . '/gold-coins'
    ],
    'gold-coin' => [
        'title' => '24K 999 Purity Gold Coins in Alwar | Zoniraz',
        'description' => 'Buy 24K pure gold coins with tamper-proof certicard packaging in Alwar at Zoniraz. Ideal for auspicious gifting, Dhanteras, and gold investment.',
        'canonical' => $domain . '/gold-coins'
    ],
    'silver-coin' => [
        'title' => '999 Pure Silver Coins in Alwar | Zoniraz',
        'description' => 'Buy certified 999 pure fine silver coins in Alwar at Zoniraz. Ideal for auspicious gifting, Dhanteras, Diwali, and silver investment.',
        'canonical' => $domain . '/silver-coin'
    ],
    'silver-coins' => [
        'title' => '999 Pure Silver Coins in Alwar | Zoniraz',
        'description' => 'Buy certified 999 pure fine silver coins in Alwar at Zoniraz. Ideal for auspicious gifting, Dhanteras, Diwali, and silver investment.',
        'canonical' => $domain . '/silver-coin'
    ],
    'coins' => [
        'title' => '24K Gold & 999 Silver Coins in Alwar | Zoniraz',
        'description' => 'Buy 24K pure gold and 999 fine silver coins with tamper-proof certicard packaging in Alwar at Zoniraz.',
        'canonical' => $domain . '/coins'
    ],
    'coin' => [
        'title' => '24K Gold & 999 Silver Coins in Alwar | Zoniraz',
        'description' => 'Buy 24K pure gold and 999 fine silver coins with tamper-proof certicard packaging in Alwar at Zoniraz.',
        'canonical' => $domain . '/coins'
    ],
    'gold-tikka' => [
        'title' => 'Gold Tikka & Maang Tikka Jewellery in Alwar | Zoniraz',
        'description' => 'Explore exquisite gold tikka and bridal maang tikka collections at Zoniraz in Alwar.',
        'canonical' => $domain . '/gold-tikka'
    ],
    'nath' => [
        'title' => 'Bridal Gold & Diamond Nath in Alwar | Zoniraz',
        'description' => 'Discover traditional and royal Rajasthani bridal nath and nose rings at Zoniraz in Alwar.',
        'canonical' => $domain . '/nath'
    ],
    'zodiac' => [
        'title' => 'Zodiac Sign Gold & Diamond Jewellery in Alwar | Zoniraz',
        'description' => 'Discover personalized zodiac sign pendants and astrological jewellery in gold and diamonds at Zoniraz. Handcrafted for all 12 astrological signs.',
        'canonical' => $domain . '/zodiac'
    ],
    'brooches' => [
        'title' => 'Designer Gold & Gemstone Brooches in Alwar | Zoniraz',
        'description' => 'Shop exquisite handcrafted lapel pins and gold brooches in Alwar at Zoniraz. Elegant accents for formal occasions and celebrations.',
        'canonical' => $domain . '/brooches'
    ],
    'anklets' => [
        'title' => 'Gold & Diamond Anklets Online in Alwar | Zoniraz',
        'description' => 'Explore traditional and modern gold payals and diamond anklets in Alwar at Zoniraz. Elegant bridal and daily wear designs.',
        'canonical' => $domain . '/anklets'
    ],
    'mens-jewellery' => [
        'title' => "Men's Gold & Diamond Jewellery in Alwar | Zoniraz",
        'description' => 'Shop bold rings, kadas, chains, bracelets, and cufflinks for men at Zoniraz in Alwar. Certified gold and diamond craftsmanship.',
        'canonical' => $domain . '/mens-jewellery'
    ],
    'womens-jewellery' => [
        'title' => "Women's Luxury Jewellery Collection in Alwar | Zoniraz",
        'description' => 'Explore women\'s fine jewellery in Alwar at Zoniraz. Bestselling rings, necklaces, earrings, bangles, and bridal ornaments in 14K & 18K gold.',
        'canonical' => $domain . '/womens-jewellery'
    ],
    'kids-jewellery' => [
        'title' => 'Kids Gold Jewellery & Nazariya in Alwar | Zoniraz',
        'description' => 'Buy safe, lightweight gold jewellery for kids and babies at Zoniraz in Alwar. Handcrafted nazariya bangles, evil eye bracelets, and cute pendants.',
        'canonical' => $domain . '/kids-jewellery'
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
        'canonical' => $domain . '/explore-exchange'
    ],
    'explore-exchange' => [
        'title' => 'Old Gold Exchange & Valuation in Alwar | Best Value at Zoniraz',
        'description' => 'Exchange your old gold jewellery with 100% computerized karatmeter purity testing in Alwar at Zoniraz. Get instant fair market valuation.',
        'canonical' => $domain . '/explore-exchange'
    ],
    'old-gold-exchange' => [
        'title' => 'Old Gold Exchange & Valuation in Alwar | Best Value at Zoniraz',
        'description' => 'Exchange your old gold jewellery with 100% computerized karatmeter purity testing in Alwar at Zoniraz. Get instant fair market valuation.',
        'canonical' => $domain . '/explore-exchange'
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
    'faq' => [
        'title' => 'Frequently Asked Questions (FAQ) | Zoniraz Jewels',
        'description' => 'Find answers to frequently asked questions about Zoniraz jewellery collections, bridal jewellery in Alwar, international shipping, franchise opportunities, and customer support.',
        'canonical' => $domain . '/faq'
    ],
    'faqs' => [
        'title' => 'Frequently Asked Questions (FAQ) | Zoniraz Jewels',
        'description' => 'Find answers to frequently asked questions about Zoniraz jewellery collections, bridal jewellery in Alwar, international shipping, franchise opportunities, and customer support.',
        'canonical' => $domain . '/faq'
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
    ],
    'wallet' => [
        'title' => 'Digital Gold & Savings Wallet | Zoniraz',
        'description' => 'View your gold savings balance and manage your Zoniraz digital gold wallet.',
        'canonical' => $domain . '/wallet'
    ],
    'admin-call' => [
        'title' => 'Admin Video Consultation | Zoniraz',
        'description' => 'Live VIP video jewellery consultation with Zoniraz jewellery experts.',
        'canonical' => $domain . '/admin-call'
    ]
];

// Determine Page Metadata
$title = 'Best Diamond Jewellery in Alwar | Zoniraz';
$description = 'Zoniraz - Discover fine gold, diamond, and luxury jewellery online in Alwar. Browse handcrafted rings, necklaces, bangles, and bridal collections.';
$canonical = $domain . '/';
$image = 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png';
$isMatchedRoute = false;
$isProductRoute = false;
$isProductNotFound = false;
$matchedProduct = null;
$isBlogRoute = false;
$isBlogNotFound = false;
$matchedBlog = null;

if ($cleanPath === '' || $cleanPath === 'index.html' || $cleanPath === 'index.php') {
    // Homepage
    $title = 'Best Diamond Jewellery in Alwar | Zoniraz';
    $canonical = $domain . '/';
    $isMatchedRoute = true;
} elseif (isset($categories[$cleanPath])) {
    // Exact Matched Category Page
    $title = $categories[$cleanPath]['title'];
    $description = $categories[$cleanPath]['description'];
    $canonical = $categories[$cleanPath]['canonical'];
    $isMatchedRoute = true;
} elseif (isset($staticPages[$cleanPath])) {
    // Exact Matched Static Page
    $title = $staticPages[$cleanPath]['title'];
    $description = $staticPages[$cleanPath]['description'];
    $canonical = $staticPages[$cleanPath]['canonical'];
    $isMatchedRoute = true;
} elseif (strpos($cleanPath, 'blog/') === 0) {
    // Single Blog Article - Live Dynamic Backend Lookup + Local SEO Cache
    $blogSlug = substr($cleanPath, 5);
    $cleanBlogSlug = trim($blogSlug, '/');
    $isBlogRoute = true;
    $matchedBlog = null;

    // 1. Check cached blogs_seo.json if present
    $blogsSeoFile = __DIR__ . '/blogs_seo.json';
    $blogsSeoMap = null;
    if (file_exists($blogsSeoFile)) {
        $blogsSeoMap = @json_decode(@file_get_contents($blogsSeoFile), true);
        if (is_array($blogsSeoMap)) {
            if (isset($blogsSeoMap[$cleanBlogSlug])) {
                $matchedBlog = $blogsSeoMap[$cleanBlogSlug];
            } elseif (isset($blogsSeoMap[strtolower($cleanBlogSlug)])) {
                $matchedBlog = $blogsSeoMap[strtolower($cleanBlogSlug)];
            }
        }
    }

    // 2. Dynamic live API lookup if not found in local cache
    if (!$matchedBlog) {
        $backendBlogUrl = 'https://lightpink-locust-700517.hostingersite.com/api/blogs/' . urlencode($cleanBlogSlug);
        $resp = false;
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $backendBlogUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 3);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_USERAGENT, 'ZonirazBlogProxy/1.0');
            $data = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if ($httpCode === 200 && $data) {
                $resp = $data;
            }
        }
        if (!$resp) {
            $ctx = stream_context_create([
                'http' => [
                    'timeout' => 3.0,
                    'ignore_errors' => true
                ]
            ]);
            $resp = @file_get_contents($backendBlogUrl, false, $ctx);
        }

        if ($resp) {
            $apiJson = @json_decode($resp, true);
            if (!empty($apiJson['success']) && !empty($apiJson['data'])) {
                $matchedBlog = $apiJson['data'];

                // Automatically update local blogs_seo.json cache so future crawls are instant
                if (!is_array($blogsSeoMap)) {
                    $blogsSeoMap = [];
                }
                $blogsSeoMap[$cleanBlogSlug] = $matchedBlog;
                @file_put_contents($blogsSeoFile, json_encode($blogsSeoMap, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            }
        }
    }

    if ($matchedBlog) {
        $title = (!empty($matchedBlog['title']) ? $matchedBlog['title'] : ucwords(str_replace('-', ' ', $cleanBlogSlug))) . ' | Zoniraz Blog';
        if (!empty($matchedBlog['excerpt'])) {
            $description = mb_substr(trim(preg_replace('/\s+/', ' ', strip_tags($matchedBlog['excerpt']))), 0, 160);
        } else {
            $description = 'Read our latest fine jewellery insights, diamond buying guides, and styling tips on the Zoniraz blog.';
        }
        if (!empty($matchedBlog['image'])) {
            $image = $matchedBlog['image'];
        }
        $canonical = $domain . '/blog/' . $cleanBlogSlug;
        $isMatchedRoute = true;
    } else {
        // Genuine 404: The requested blog slug does not exist
        $isMatchedRoute = false;
        $isBlogNotFound = true;
        $title = 'Article Not Found (404) | Zoniraz';
        $description = 'The requested blog article is unavailable, has been deleted, or does not exist at Zoniraz.';
        $canonical = $domain . '/blog/' . $cleanBlogSlug;
    }
} elseif (strpos($cleanPath, 'product/') === 0) {
    // Product Page
    $productSlug = substr($cleanPath, 8);
    $cleanProductSlug = trim($productSlug, '/');

    // 1. Attempt to load from cached products_seo.json
    $seoFile = __DIR__ . '/products_seo.json';
    $found = false;
    $pData = null;

    if (file_exists($seoFile)) {
        $json = @json_decode(@file_get_contents($seoFile), true);
        if (is_array($json)) {
            if (isset($json[$cleanProductSlug])) {
                $pData = $json[$cleanProductSlug];
                $found = true;
            } elseif (isset($json[strtolower($cleanProductSlug)])) {
                $pData = $json[strtolower($cleanProductSlug)];
                $found = true;
            }
        }
    }

    // 2. Dynamic backend fallback lookup if not present in products_seo.json
    if (!$found) {
        $backendUrl = 'https://lightpink-locust-700517.hostingersite.com/api/products/' . urlencode($cleanProductSlug);
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 1.5,
                'ignore_errors' => true
            ]
        ]);
        $resp = @file_get_contents($backendUrl, false, $ctx);
        if ($resp) {
            $apiJson = @json_decode($resp, true);
            if (!empty($apiJson['success']) && !empty($apiJson['data'])) {
                $rawP = $apiJson['data'];
                $pName = trim(!empty($rawP['product_title']) ? $rawP['product_title'] : (!empty($rawP['name']) ? $rawP['name'] : ucwords(str_replace('-', ' ', $cleanProductSlug))));
                $pCat = trim(!empty($rawP['product_category']) ? $rawP['product_category'] : (!empty($rawP['category']) ? $rawP['category'] : 'Fine Jewellery'));
                $pPrice = (float)(!empty($rawP['price']) ? $rawP['price'] : (!empty($rawP['basePrice']) ? $rawP['basePrice'] : 0));
                $pData = [
                    'slug' => $cleanProductSlug,
                    'name' => $pName,
                    'category' => $pCat,
                    'subcategory' => !empty($rawP['product_subcategory']) ? $rawP['product_subcategory'] : '',
                    'title' => (stripos($pName, 'zoniraz') !== false) ? $pName : ($pName . ' | ' . $pCat . ' in Alwar | Zoniraz'),
                    'description' => !empty($rawP['description']) ? mb_substr(trim(preg_replace('/\s+/', ' ', strip_tags($rawP['description']))), 0, 155) : ("Buy " . $pName . " online in Alwar at Zoniraz Jewels. Handcrafted in premium quality with exquisite design. Certificate of authenticity included."),
                    'canonical' => $domain . '/product/' . $cleanProductSlug,
                    'image' => !empty($rawP['image']) ? $rawP['image'] : 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png',
                    'images' => !empty($rawP['images']) ? $rawP['images'] : (!empty($rawP['image']) ? [$rawP['image']] : []),
                    'price' => $pPrice,
                    'originalPrice' => $pPrice,
                    'sku' => !empty($rawP['product_code']) ? $rawP['product_code'] : (!empty($rawP['product_id']) ? $rawP['product_id'] : $cleanProductSlug),
                    'availability' => (isset($rawP['status']) && ($rawP['status'] === '0' || $rawP['status'] === 0)) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                    'status' => isset($rawP['status']) ? (string)$rawP['status'] : '1'
                ];
                $found = true;
            }
        }
    }

    if ($found && is_array($pData)) {
        $title = $pData['title'];
        $description = $pData['description'];
        $canonical = !empty($pData['canonical']) ? $pData['canonical'] : ($domain . '/product/' . $cleanProductSlug);
        if (!empty($pData['image'])) {
            $image = $pData['image'];
        }
        $isMatchedRoute = true;
        $isProductRoute = true;
        $matchedProduct = $pData;
    } else {
        // Genuine 404 for invalid/missing product
        $isMatchedRoute = false;
        $isProductNotFound = true;
        $title = 'Product Not Found (404) | Zoniraz';
        $description = 'The requested jewellery piece is unavailable, discontinued, or does not exist at Zoniraz Jewels.';
        $canonical = $domain . '/product/' . $cleanProductSlug;
    }
} elseif (preg_match('/^[a-z0-9-]+$/i', $cleanPath)) {
    // Dynamic Fallback for any other valid category/collection slug
    $categoryListPattern = '/^(rings|earrings|pendants|pendant|necklaces|bangles|bracelets|mangalsutras|mangalsutra|nose-pins|nose-pin|solitaires|solitaire|gold-coins|gold-coin|silver-coins|silver-coin|coins|coin|chain|chains|zodiac|brooches|anklets|gold-tikka|nath|mens-jewellery|womens-jewellery|kids-jewellery)$/i';
    if (preg_match($categoryListPattern, $cleanPath) || preg_match('/^[a-z0-9-]+-coin[s]?$/i', $cleanPath)) {
        $catName = ucwords(str_replace('-', ' ', $cleanPath));
        $title = $catName . ' in Alwar | Pure Coins & Fine Jewellery | Zoniraz';
        $description = 'Explore certified ' . strtolower($catName) . ' with tamper-proof certicard in Alwar at Zoniraz Jewels.';
        $canonical = $domain . '/' . $cleanPath;
        $isMatchedRoute = true;
    }
}

// Ensure proper HTTP response status code
if ($isMatchedRoute) {
    http_response_code(200);
} else {
    http_response_code(404);
    if (!$isProductNotFound && !$isBlogNotFound) {
        $title = 'Page Not Found (404) | Zoniraz';
        $description = 'The page you requested could not be found at Zoniraz Jewels.';
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

// 1. Inject Dynamic Metadata into the HTML
$html = preg_replace('/<title>[\s\S]*?<\/title>/i', '<title>' . safeAttr($title) . '</title>', $html);
$html = preg_replace('/<meta\s+name=["\']description["\'][\s\S]*?content=["\'][\s\S]*?["\']\s*\/?>/i', '<meta name="description" content="' . safeAttr($description) . '" />', $html);
$html = preg_replace('/<link\s+id=["\']canonical-link["\']\s+rel=["\']canonical["\']\s+href=["\'][^"\']*["\']\s*\/?>/i', '<link id="canonical-link" rel="canonical" href="' . safeAttr($canonical) . '" />', $html);

if (!$isMatchedRoute) {
    // Add noindex for 404 pages
    $html = preg_replace('/<meta\s+name=["\']robots["\'][\s\S]*?content=["\'][\s\S]*?["\']\s*\/?>/i', '<meta name="robots" content="noindex, follow" />', $html);
}

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

// 2. Build Structured Data (JSON-LD)
$schemas = [];

if ($isProductRoute && !empty($matchedProduct)) {
    $prodPrice = isset($matchedProduct['price']) ? (float)$matchedProduct['price'] : 0;
    $prodImages = !empty($matchedProduct['images']) && is_array($matchedProduct['images']) ? $matchedProduct['images'] : (!empty($matchedProduct['image']) ? [$matchedProduct['image']] : []);
    $prodSku = !empty($matchedProduct['sku']) ? (string)$matchedProduct['sku'] : $cleanProductSlug;
    $prodAvailability = !empty($matchedProduct['availability']) ? $matchedProduct['availability'] : 'https://schema.org/InStock';

    $schemas[] = [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $matchedProduct['name'],
        'image' => $prodImages,
        'description' => $matchedProduct['description'],
        'sku' => $prodSku,
        'brand' => [
            '@type' => 'Brand',
            'name' => 'Zoniraz'
        ],
        'offers' => [
            '@type' => 'Offer',
            'url' => $canonical,
            'priceCurrency' => 'INR',
            'price' => $prodPrice,
            'priceValidUntil' => '2027-12-31',
            'itemCondition' => 'https://schema.org/NewCondition',
            'availability' => $prodAvailability
        ]
    ];

    $catName = !empty($matchedProduct['category']) ? $matchedProduct['category'] : 'Jewellery';
    $catSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $catName));
    $catSlug = trim($catSlug, '-');

    $schemas[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Home',
                'item' => $domain . '/'
            ],
            [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => $catName,
                'item' => $domain . '/' . $catSlug
            ],
            [
                '@type' => 'ListItem',
                'position' => 3,
                'name' => $matchedProduct['name'],
                'item' => $canonical
            ]
        ]
    ];
} elseif ($isBlogRoute && !empty($matchedBlog)) {
    $blogTitle = !empty($matchedBlog['title']) ? $matchedBlog['title'] : ucwords(str_replace('-', ' ', $cleanBlogSlug));
    $blogImage = !empty($matchedBlog['image']) ? $matchedBlog['image'] : 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png';
    $blogDate = !empty($matchedBlog['createdAt']) ? date('c', strtotime($matchedBlog['createdAt'])) : date('c');
    $blogModified = !empty($matchedBlog['updatedAt']) ? date('c', strtotime($matchedBlog['updatedAt'])) : $blogDate;
    $blogAuthor = !empty($matchedBlog['author']) ? $matchedBlog['author'] : 'Zoniraz Editorial Team';
    $blogDesc = !empty($matchedBlog['excerpt']) ? trim(preg_replace('/\s+/', ' ', strip_tags($matchedBlog['excerpt']))) : $description;

    $schemas[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BlogPosting',
        'mainEntityOfPage' => [
            '@type' => 'WebPage',
            '@id' => $canonical
        ],
        'headline' => $blogTitle,
        'description' => $blogDesc,
        'image' => [$blogImage],
        'datePublished' => $blogDate,
        'dateModified' => $blogModified,
        'author' => [
            '@type' => 'Organization',
            'name' => $blogAuthor
        ],
        'publisher' => [
            '@type' => 'Organization',
            'name' => 'Zoniraz',
            'logo' => [
                '@type' => 'ImageObject',
                'url' => 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png'
            ]
        ]
    ];

    $schemas[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Home',
                'item' => $domain . '/'
            ],
            [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => 'Blog',
                'item' => $domain . '/blog'
            ],
            [
                '@type' => 'ListItem',
                'position' => 3,
                'name' => $blogTitle,
                'item' => $canonical
            ]
        ]
    ];
} elseif ($isMatchedRoute && $cleanPath !== '') {
    $schemas[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Home',
                'item' => $domain . '/'
            ],
            [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => $title,
                'item' => $canonical
            ]
        ]
    ];
}

// Inject JSON-LD into index.html
if (!empty($schemas)) {
    $jsonLdString = json_encode($schemas, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $jsonLdTag = '<script id="seo-dynamic-structured-data" type="application/ld+json">' . "\n" . $jsonLdString . "\n" . '  </script>';
    $html = preg_replace('/<script id=["\']seo-dynamic-structured-data["\'][\s\S]*?<\/script>/i', $jsonLdTag, $html);
}

// Inject Initial Embedded Product Data for 0ms Client Hydration
if ($isProductRoute && !empty($matchedProduct)) {
    $embeddedJson = json_encode($matchedProduct, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $embeddedTag = '<script id="zoniraz-initial-product" type="application/json">' . $embeddedJson . '</script>';
    $html = preg_replace('/<script id=["\']zoniraz-initial-product["\'][\s\S]*?<\/script>/i', $embeddedTag, $html);
}

// Inject Initial Embedded Blog Data for 0ms Client Hydration
if ($isBlogRoute && !empty($matchedBlog)) {
    $embeddedBlogJson = json_encode($matchedBlog, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $embeddedBlogTag = '<script id="zoniraz-initial-blog" type="application/json">' . $embeddedBlogJson . '</script>';
    $html = preg_replace('/<script id=["\']zoniraz-initial-blog["\'][\s\S]*?<\/script>/i', $embeddedBlogTag, $html);
}

// 3. Build Semantic Server-Prerendered HTML Container (Safeguard 1: placed outside #root)
$prerenderHtml = '';

if ($isProductRoute && !empty($matchedProduct)) {
    $formattedPrice = number_format((float)$matchedProduct['price'], 0, '.', ',');
    $catName = htmlspecialchars(!empty($matchedProduct['category']) ? $matchedProduct['category'] : 'Fine Jewellery', ENT_QUOTES, 'UTF-8');
    $catSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $catName));
    $prodName = htmlspecialchars($matchedProduct['name'], ENT_QUOTES, 'UTF-8');
    $prodDesc = htmlspecialchars($matchedProduct['description'], ENT_QUOTES, 'UTF-8');
    $prodImg = htmlspecialchars(!empty($matchedProduct['image']) ? $matchedProduct['image'] : 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png', ENT_QUOTES, 'UTF-8');
    $isAvailable = (!isset($matchedProduct['status']) || ($matchedProduct['status'] !== '0' && $matchedProduct['status'] !== 0));
    $stockText = $isAvailable ? 'In Stock (Ready to Ship / Made to Order)' : 'Temporarily Out of Stock';
    $stockColor = $isAvailable ? '#15803d' : '#b91c1c';

    $prerenderHtml = '<div id="zoniraz-seo-prerender" style="max-width:1200px;margin:0 auto;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">' .
      '<nav aria-label="Breadcrumb" style="font-size:13px;margin-bottom:20px;color:#78716c;">' .
        '<a href="' . $domain . '/" style="color:#634d40;text-decoration:none;">Home</a> &gt; ' .
        '<a href="' . $domain . '/' . $catSlug . '" style="color:#634d40;text-decoration:none;">' . $catName . '</a> &gt; ' .
        '<span>' . $prodName . '</span>' .
      '</nav>' .
      '<article style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:32px;align-items:start;">' .
        '<div style="background:#faf8f5;border-radius:12px;padding:16px;text-align:center;">' .
          '<img src="' . $prodImg . '" alt="' . $prodName . '" style="max-width:100%;height:auto;border-radius:8px;object-fit:contain;max-height:480px;" />' .
        '</div>' .
        '<div>' .
          '<span style="display:inline-block;padding:4px 10px;background:#f5f0eb;color:#634d40;border-radius:4px;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px;">' . $catName . '</span>' .
          '<h1 style="font-size:28px;font-weight:700;line-height:1.3;color:#1c1917;margin:0 0 16px 0;">' . $prodName . '</h1>' .
          '<div style="margin-bottom:20px;">' .
            '<span style="font-size:26px;font-weight:700;color:#634d40;">₹' . $formattedPrice . '</span>' .
            '<span style="display:block;font-size:13px;color:#78716c;margin-top:4px;">(Price inclusive of GST &amp; free insured delivery across India)</span>' .
          '</div>' .
          '<div style="margin-bottom:20px;display:inline-block;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;color:' . $stockColor . ';background:' . ($isAvailable ? '#f0fdf4' : '#fef2f2') . ';">' .
            '● ' . $stockText .
          '</div>' .
          '<div style="margin-bottom:24px;">' .
            '<h2 style="font-size:16px;font-weight:600;color:#292524;margin:0 0 8px 0;">Description</h2>' .
            '<p style="font-size:14px;line-height:1.6;color:#57534e;margin:0;">' . $prodDesc . '</p>' .
          '</div>' .
          '<div style="background:#fff;border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;">' .
            '<table style="width:100%;border-collapse:collapse;font-size:13px;text-align:left;">' .
              '<tbody>' .
                '<tr style="border-bottom:1px solid #f5f5f4;"><th style="padding:10px 14px;color:#78716c;font-weight:500;">Product Category</th><td style="padding:10px 14px;color:#1c1917;font-weight:600;">' . $catName . '</td></tr>' .
                '<tr style="border-bottom:1px solid #f5f5f4;"><th style="padding:10px 14px;color:#78716c;font-weight:500;">SKU / Code</th><td style="padding:10px 14px;color:#1c1917;font-weight:600;">' . htmlspecialchars(!empty($matchedProduct['sku']) ? $matchedProduct['sku'] : $cleanProductSlug, ENT_QUOTES, 'UTF-8') . '</td></tr>' .
                '<tr style="border-bottom:1px solid #f5f5f4;"><th style="padding:10px 14px;color:#78716c;font-weight:500;">Availability</th><td style="padding:10px 14px;color:#1c1917;font-weight:600;">' . ($isAvailable ? 'In Stock' : 'Out of Stock') . '</td></tr>' .
                '<tr><th style="padding:10px 14px;color:#78716c;font-weight:500;">Assurance</th><td style="padding:10px 14px;color:#1c1917;font-weight:600;">100% Certified Diamond &amp; Hallmarked Gold</td></tr>' .
              '</tbody>' .
            '</table>' .
          '</div>' .
        '</div>' .
      '</article>' .
    '</div>';
} elseif ($isBlogRoute && !empty($matchedBlog)) {
    $bTitle = htmlspecialchars(!empty($matchedBlog['title']) ? $matchedBlog['title'] : ucwords(str_replace('-', ' ', $cleanBlogSlug)), ENT_QUOTES, 'UTF-8');
    $bCat = htmlspecialchars(!empty($matchedBlog['category']) ? $matchedBlog['category'] : 'Gold & Diamond', ENT_QUOTES, 'UTF-8');
    $bDate = htmlspecialchars(!empty($matchedBlog['date']) ? $matchedBlog['date'] : 'Recent Article', ENT_QUOTES, 'UTF-8');
    $bReadTime = htmlspecialchars(!empty($matchedBlog['readTime']) ? $matchedBlog['readTime'] : '5 min read', ENT_QUOTES, 'UTF-8');
    $bAuthor = htmlspecialchars(!empty($matchedBlog['author']) ? $matchedBlog['author'] : 'Zoniraz Editorial Team', ENT_QUOTES, 'UTF-8');
    $bImg = htmlspecialchars(!empty($matchedBlog['image']) ? $matchedBlog['image'] : 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png', ENT_QUOTES, 'UTF-8');
    $bExcerpt = htmlspecialchars(!empty($matchedBlog['excerpt']) ? $matchedBlog['excerpt'] : '', ENT_QUOTES, 'UTF-8');

    $rawContent = !empty($matchedBlog['content']) ? $matchedBlog['content'] : '';
    $renderedBody = '';
    if (is_array($rawContent)) {
        foreach ($rawContent as $block) {
            $bType = isset($block['type']) ? $block['type'] : 'para';
            $bText = htmlspecialchars(isset($block['text']) ? $block['text'] : '', ENT_QUOTES, 'UTF-8');
            if ($bType === 'heading') {
                $renderedBody .= '<h2 style="font-size:22px;font-weight:700;color:#2a221b;margin:28px 0 12px 0;">' . $bText . '</h2>';
            } elseif ($bType === 'intro') {
                $renderedBody .= '<p style="font-size:16px;line-height:1.8;color:#443a32;font-style:italic;margin-bottom:20px;">' . $bText . '</p>';
            } elseif ($bType === 'tip') {
                $renderedBody .= '<div style="background:#faf5f0;border-left:4px solid #c5a880;padding:16px;border-radius:4px;margin:24px 0;"><strong style="color:#634d40;">Note:</strong> <span style="font-size:14px;color:#57534e;">' . $bText . '</span></div>';
            } else {
                $renderedBody .= '<p style="font-size:15px;line-height:1.75;color:#4a423a;margin-bottom:18px;">' . $bText . '</p>';
            }
        }
    } elseif (is_string($rawContent)) {
        $renderedBody = strip_tags($rawContent, '<p><h2><h3><h4><strong><em><b><i><ul><ol><li><a><br>');
    }

    $prerenderHtml = '<div id="zoniraz-seo-prerender" style="max-width:860px;margin:0 auto;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#2a221b;">' .
      '<nav aria-label="Breadcrumb" style="font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:24px;color:#78716c;">' .
        '<a href="' . $domain . '/" style="color:#634d40;text-decoration:none;">Home</a> &gt; ' .
        '<a href="' . $domain . '/blog" style="color:#634d40;text-decoration:none;">Blog</a> &gt; ' .
        '<span>' . $bTitle . '</span>' .
      '</nav>' .
      '<article>' .
        '<header style="margin-bottom:28px;">' .
          '<span style="display:inline-block;padding:5px 12px;background:#f5eee6;color:#634d40;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">' . $bCat . '</span>' .
          '<h1 style="font-size:32px;font-weight:700;line-height:1.3;color:#2a221b;margin:0 0 16px 0;">' . $bTitle . '</h1>' .
          '<div style="font-size:13px;color:#78716c;display:flex;gap:16px;align-items:center;">' .
            '<span>' . $bDate . '</span>' .
            '<span>•</span>' .
            '<span>' . $bReadTime . '</span>' .
            '<span>•</span>' .
            '<span>By ' . $bAuthor . '</span>' .
          '</div>' .
        '</header>' .
        (!empty($bImg) ? ('<div style="margin-bottom:32px;border-radius:16px;overflow:hidden;background:#faf8f5;text-align:center;"><img src="' . $bImg . '" alt="' . $bTitle . '" style="max-width:100%;height:auto;border-radius:12px;" /></div>') : '') .
        (!empty($bExcerpt) ? ('<div style="font-size:17px;line-height:1.7;color:#57534e;font-weight:500;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #e7e5e4;">' . $bExcerpt . '</div>') : '') .
        '<div style="font-size:15px;line-height:1.8;color:#332a24;">' . $renderedBody . '</div>' .
      '</article>' .
    '</div>';
} elseif (!empty($isBlogNotFound)) {
    $prerenderHtml = '<div id="zoniraz-seo-prerender" style="max-width:700px;margin:60px auto;padding:40px 24px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#1c1917;">' .
      '<h1 style="font-size:32px;font-weight:700;color:#634d40;margin-bottom:12px;">Article Not Found (404)</h1>' .
      '<p style="font-size:16px;line-height:1.6;color:#666;margin-bottom:24px;">The blog article you requested does not exist or may have been moved.</p>' .
      '<a href="' . $domain . '/blog" style="display:inline-block;padding:12px 28px;background:#634d40;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Explore All Blogs</a>' .
    '</div>';
} elseif (!empty($isProductNotFound)) {
    $prerenderHtml = '<div id="zoniraz-seo-prerender" style="max-width:700px;margin:60px auto;padding:40px 24px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#1c1917;">' .
      '<h1 style="font-size:32px;font-weight:700;color:#634d40;margin-bottom:12px;">Product Not Found (404)</h1>' .
      '<p style="font-size:16px;line-height:1.6;color:#666;margin-bottom:24px;">The jewellery piece you requested is unavailable, discontinued, or does not exist in the Zoniraz collection.</p>' .
      '<a href="' . $domain . '/" style="display:inline-block;padding:12px 28px;background:#634d40;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Return to Showcase</a>' .
    '</div>';
}

// Inject prerender HTML into index.html
if (!empty($prerenderHtml)) {
    $html = preg_replace('/<div id=["\']zoniraz-seo-prerender["\']>[\s\S]*?<\/div>/i', $prerenderHtml, $html);
}

// 4. Send Anti-Cache Headers to eliminate cross-product proxy/LiteSpeed HTML caching
header('Content-Type: text/html; charset=utf-8');
header('X-LiteSpeed-Cache-Control: no-cache');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Vary: Accept-Encoding');

echo $html;
exit;
} catch (\Throwable $e) {
    // Bulletproof fallback: Never show 500 Internal Server Error to customers
    $fallbackIndex = __DIR__ . '/index.html';
    if (file_exists($fallbackIndex)) {
        header('Content-Type: text/html; charset=utf-8');
        echo file_get_contents($fallbackIndex);
        exit;
    }
    http_response_code(200);
    echo '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Best Diamond Jewellery in Alwar | Zoniraz</title></head><body><div id="root"></div></body></html>';
    exit;
}
