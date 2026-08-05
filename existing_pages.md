# Zoniraz Jewellery - Existing Pages Directory

This document details all the existing pages, views, and routes present in both the customer-facing website (**Frontend**) and the management portal (**Admin Panel / adminSide**).

---

## 1. Customer Website (Frontend)
The frontend website is designed as a Single Page Application (SPA) with a custom router mapping paths to views.

| Route / Path | Target View | Associated Component | Description |
| :--- | :--- | :--- | :--- |
| `/` or `/index.html` | `'home'` | [Hero.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/Hero.jsx), [ShopByCollection.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/ShopByCollection.jsx), etc. | **Home Page**: Main landing page showcasing banners, collections, trending categories, customer reviews, etc. |
| `/product/:id` or `/product-:id` | `'product'` | [ProductDetailPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/ProductDetailPage.jsx) | **Product Detail Page**: Displays specifications, metal purity, pricing breakdown, try-at-home option, and add-to-cart controls. |
| `/trending-now` or `/trending` | `'rings'` (Catalog) | [CategoryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/CategoryPage.jsx) | Displays products under the **Trending Now** category. |
| `/collections` or `/all-collections` | `'all-collections'` | [AllCollectionsPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/AllCollectionsPage.jsx) | Displays all curated collections. |
| `/wishlist` | `'wishlist'` | [WishlistPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/WishlistPage.jsx) | **Wishlist**: Shows list of items saved/favorited by the user. |
| `/cart` | `'cart'` | [CartPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/CartPage.jsx) | **Cart Page**: Review added items, quantities, pricing breakdown, and proceed to checkout. |
| `/profile` | `'profile'` | [UserDashboard.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/UserDashboard.jsx) | **User Dashboard**: Customer profile details, orders, address details, and Gold Mine wallet. |
| `/checkout` | `'checkout'` | [CheckoutPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/CheckoutPage.jsx) | **Checkout Page**: Address selection, payment method choices, and final order placement. |
| `/contact` | `'contact'` | [ContactPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/ContactPage.jsx) | **Contact Us**: Address details, query forms, and maps. |
| `/blog` or `/blogs` | `'blog'` | [BlogPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/BlogPage.jsx) | **Blogs**: Overview of jewellery guides, fashion tips, and company updates. |
| `/blog/:slug` | `'blog'` | [BlogDetailPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/BlogDetailPage.jsx) | **Blog Detail**: Shows full article content based on the post slug. |
| `/about` | `'about'` | [AboutPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/AboutPage.jsx) | **About Us**: Information about the brand, quality assurances, and craftsmanship. |
| `/franchise` | `'franchise'` | [FranchisePage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/FranchisePage.jsx) | **Franchise Form**: Partnership details and inquiry submissions. |
| `/sell-gold` or `/exchange` | `'sell-gold'` | [SellGoldPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/SellGoldPage.jsx) | **Old Gold Exchange**: Interactive calculator and sell enquiry submission. |
| `/buy-gold` | `'buy-gold'` | [BuyGoldPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/BuyGoldPage.jsx) | **Buy Gold**: Gold rates, coin purchases, and schemes. |
| `/gold-mine` or `/plans/gold-mine` | `'gold-mine'` | [GoldMinePage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/GoldMinePage.jsx) | **10+1 Gold Savings Scheme**: Plan details, monthly installment calculator, and signup. |
| `/delivery` | `'delivery'` | [DeliveryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/DeliveryPage.jsx) | **Customer Help Center**: Delivery & order tracking details. |
| `/shipping` / `/international-shipping` | `'delivery'` | [DeliveryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/DeliveryPage.jsx) | **International Shipping**: Policies for worldwide delivery. |
| `/payment` | `'delivery'` | [DeliveryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/DeliveryPage.jsx) | **Payments**: Accepted modes of payment, security, etc. |
| `/returns` | `'delivery'` | [DeliveryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/DeliveryPage.jsx) | **Returns Policy**: Detail on exchanges, refunds, and return periods. |
| `/giftcards` | `'delivery'` | [DeliveryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/DeliveryPage.jsx) | **Gift Cards**: Details on e-gift cards and verification. |
| `/terms` | `'terms'` | [TermsPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/TermsPage.jsx) | **Terms and Conditions** of Zoniraz website usage. |
| `/privacy` | `'privacy'` | [PrivacyPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/PrivacyPage.jsx) | **Privacy Policy** document detailing user data protection. |
| `/admin-call` | `'admin-call'` | [AdminVideoPanel.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/AdminVideoPanel.jsx) | **Admin Video Panel**: Video call capability screen on client side. |
| `/Rings`, `/Earrings`, `/Necklaces`, `/Bracelets`, `/Brooches`, `/Chains`, `/Bangles`, `/Anklets`, `/Pendants`, `/Mangalsutras`, `/Nose Pins`, `/Gold Coins`, `/Solitaires`, `/Coins`, `/Zodiac`, `/Men's Jewellery`, `/Women's Jewellery`, `/Kids Jewellery` | `'rings'` (Catalog) | [CategoryPage.jsx](file:///c:/Users/Admin/Desktop/zoniraz%201/frontend/src/components/CategoryPage.jsx) | **Product Category Catalog**: Filtered view showing jewellery matching the selected category. |

---

## 2. Admin Portal (adminSide)
The Admin panel routes are loaded conditionally within [App.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/App.tsx) depending on the authenticated session (`adminToken`) and `activeMenu` selection.

| Menu ID (`activeMenu`) | Panel Page Component | Description |
| :--- | :--- | :--- |
| *(No Token)* | [AdminLogin.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/AdminLogin.tsx) | **Login Screen**: Required credentials for admin portal entry. |
| `'overview'` | [Dashboard.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Dashboard.tsx) | **Dashboard**: Statistics, recent orders, metrics overview, and quick links. |
| `'products'` | [ProductEditor.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/ProductEditor.tsx) | **Product Management**: List all jewellery pieces, search, delete, and add/edit specifications. |
| `'orders'` | [Orders.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Orders.tsx) | **Order Ledger**: View sales records, shipping updates, and invoice information. |
| `'goldmine'` | [GoldMineWallets.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/GoldMineWallets.tsx) | **10+1 Gold Savings Wallets**: Track active customer saving plans, payments, and maturation status. |
| `'categories'` | [Categories.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Categories.tsx) | **Category Editor**: Add, delete, and edit product categorization. |
| `'customers'` | [Customers.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Customers.tsx) | **Customer Database**: Detail ledger of registered users, status, and contact points. |
| `'collections'` | [Collections.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Collections.tsx) | **Collection Editor**: Group jewellery items into themed segments (e.g. Bridal, Everyday Wear). |
| `'coupons'` | [Coupons.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Coupons.tsx) | **Discounts/Coupons**: Setup discount parameters, codes, and validity. |
| `'banners'` | [Banners.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/Banners.tsx) | **Banner Config**: Upload, update, and manage homepage promotional slider banners. |
| `'exchange'` | [ExchangeInquiries.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/ExchangeInquiries.tsx) | **Exchange Leads**: Review customer entries for old gold exchange schemes. |
| `'sellgold'` | [SellGoldInquiries.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/SellGoldInquiries.tsx) | **Sell Gold Leads**: Review request details submitted for selling physical gold. |
| `'pricing'` | [PricingSettings.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/PricingSettings.tsx) | **Daily Price Controls**: Set baseline gold, silver, and gemstone rates that compute site-wide product pricing. |
| `'videocall'` | [VideoCallPanel.tsx](file:///c:/Users/Admin/Desktop/zoniraz%201/adminSide/src/pages/VideoCallPanel.tsx) | **Video Calls Desk**: Initiate or answer digital virtual appointments with customers. |
