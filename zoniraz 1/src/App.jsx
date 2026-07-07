import React, { useContext } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ShopByCollection from './components/ShopByCollection';
import FindPerfectMatch from './components/FindPerfectMatch';
import TrendingNow from './components/TrendingNow';
import ZonirazWorld from './components/ZonirazWorld';
import NewArrivals from './components/NewArrivals';
import CuratedForYou from './components/CuratedForYou';
import ZonirazAssurance from './components/ZonirazAssurance';
import GoldExchange from './components/GoldExchange';
import ExchangeProgram from './components/ExchangeProgram';
import ZonirazExperience from './components/ZonirazExperience';
import BottomRibbon from './components/BottomRibbon';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';
import ProductDetailPage from './components/ProductDetailPage';
import ContactPage from './components/ContactPage';
import BlogPage from './components/BlogPage';
import AboutPage from './components/AboutPage';
import DeliveryPage from './components/DeliveryPage';
import UserDashboard from './components/UserDashboard';
import CheckoutPage from './components/CheckoutPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AuthModal from './components/AuthModal';
import { products } from './data/products';

const hashToCategoryMap = {
  // Rings
  'rings': 'rings',
  'all-rings': 'rings',
  'couple-rings': 'rings',
  'engagement': 'rings',
  'dailywear': 'rings',
  'cocktail': 'rings',
  'promise-rings': 'rings',
  'bridal-collection': 'rings',
  'everyday-wear': 'rings',
  'office-wear': 'rings',
  'solitaire-dream': 'rings',
  'heritage-gold': 'rings',
  'bridal': 'rings',
  'everyday': 'rings',
  'office': 'rings',
  'solitaire': 'rings',
  'heritage': 'rings',
  'earrings': 'rings',
  'bracelets': 'rings',
  'solitaires': 'rings',
  'mangalsutras': 'rings',
  'necklaces': 'rings',
  'collections': 'rings',
  'pendants': 'rings',
  'nose-pins': 'rings',
  'mangalsutra': 'rings',
  'bangles': 'rings',
  'auspicious': 'rings',
  'gifting': 'rings',
  'origami': 'rings',
  'women': 'rings',
  'men': 'rings',
  'kids': 'rings'
};

function AppContent() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);
  const [currentView, setCurrentView] = React.useState('home');
  const [wishlist, setWishlist] = React.useState({});
  const [cart, setCart] = React.useState({});
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [helpCategory, setHelpCategory] = React.useState('delivery');
  const [selectedCategoryName, setSelectedCategoryName] = React.useState('Rings');

  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:55000/api/admin/products')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          const mapped = (resData.data || []).map(p => {
            const id = p._id || p.product_id;
            const name = p.product_title || p.name || 'Jewellery Item';
            const price = Number(p.price) || Number(p.basePrice) || 0;
            const discount = Number(p.discount) || 0;

            // Get category name
            const category = p.product_category || p.category || 'Rings';

            // Get subcategory (style / tag fallback)
            let subcategory = p.product_subcategory || p.productSubCategory || p.subcategory || '';
            if (!subcategory && p.specs && p.specs.style) {
              subcategory = p.specs.style;
            }
            if (!subcategory && p.tags && Array.isArray(p.tags)) {
              const excludedTags = ['rings', 'ring', 'earrings', 'earring', 'pendants', 'pendant', 'necklaces', 'necklace', 'bracelets', 'bracelet', 'bangles', 'bangle', 'women', 'men', 'kids', 'diamond', 'gold', 'silver', 'platinum'];
              const subTag = p.tags.find(t => !excludedTags.includes(t.toLowerCase()));
              if (subTag) subcategory = subTag;
            }

            // Get gender
            let genderList = [];
            if (p.gender) genderList.push(p.gender);
            if (p.specs && p.specs.gender) genderList.push(p.specs.gender);
            if (p.tags && Array.isArray(p.tags)) {
              if (p.tags.includes('women')) genderList.push('women');
              if (p.tags.includes('men')) genderList.push('men');
              if (p.tags.includes('kids')) genderList.push('kids');
            }
            const gender = [...new Set(genderList.map(s => s.toLowerCase()))].join(', ');

            // Get images array
            let images = [];
            if (p.gallery) {
              if (Array.isArray(p.gallery)) images = p.gallery;
              else if (typeof p.gallery === 'string') images = p.gallery.split(',').map(s => s.trim());
            } else if (p.images) {
              if (Array.isArray(p.images)) images = p.images;
              else if (typeof p.images === 'string') images = p.images.split(',').map(s => s.trim());
            }

            const size = p.size_id || (p.specs && p.specs.size) || 'Free Size';

            // Get material / stone / metal
            let matList = [];
            if (p.product_type) matList.push(p.product_type);
            if (p.stoneType) matList.push(p.stoneType);
            if (p.defaultMetal) matList.push(p.defaultMetal);
            if (p.specs) {
              if (p.specs.metal) matList.push(p.specs.metal);
              if (p.specs.stoneType) matList.push(p.specs.stoneType);
            }
            if (p.tags && Array.isArray(p.tags)) {
              if (p.tags.includes('diamond')) matList.push('diamond');
              if (p.tags.includes('gold')) matList.push('gold');
              if (p.tags.includes('platinum')) matList.push('platinum');
              if (p.tags.includes('rose gold') || p.tags.includes('rose-gold')) matList.push('rose gold');
              if (p.tags.includes('yellow gold') || p.tags.includes('yellow-gold')) matList.push('yellow gold');
              if (p.tags.includes('white gold') || p.tags.includes('white-gold')) matList.push('white gold');
            }
            const material = [...new Set(matList.map(s => s.toLowerCase()))].join(', ');
            
            const weight = p.product_weight || p.gold_weight || p.baseWeight || 0;
            const fastDelivery = p.feature === '1';
            const latest = p.sessional === '1';
            const storePickup = p.topselling === '1';

            return {
              id,
              productId: p.product_id || String(id),
              name,
              price,
              originalPrice: price + discount,
              images,
              size,
              material,
              category,
              weight,
              fastDelivery,
              latest,
              storePickup,
              tryAtHome: true,
              subcategory,
              gender
            };
          });

          const mapImgUrl = (url, name) => {
            if (!url) return 'https://placehold.co/600x600?text=' + encodeURIComponent(name);
            if (url.startsWith('http')) return url;
            return `http://localhost:55000/uploads/${url}`;
          };

          const fullyMapped = mapped.map(item => {
            const clientImages = item.images.map(url => mapImgUrl(url, item.name));
            if (clientImages.length === 0) {
              clientImages.push(mapImgUrl('', item.name));
            }
            return {
              ...item,
              image: clientImages[0],
              images: clientImages
            };
          });

          setAllProducts(fullyMapped);
        }
      })
      .catch(err => console.error('Error fetching all products:', err));
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '');
      const [hashPath] = fullHash.split('?');
      const hash = hashPath.toLowerCase();

      if (hash.startsWith('product-')) {
        const id = hash.replace('product-', '');
        setSelectedProductId(id);
        setCurrentView('product');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'wishlist') {
        setCurrentView('wishlist');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'cart') {
        setCurrentView('cart');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'profile') {
        setCurrentView('profile');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'checkout') {
        setCurrentView('checkout');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'contact') {
        setCurrentView('contact');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'blog' || hash === 'blogs') {
        setCurrentView('blog');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'about') {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'delivery' || hash === 'delivery-information') {
        setHelpCategory('delivery');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'shipping' || hash === 'international-shipping') {
        setHelpCategory('international');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'payment' || hash === 'payment-options') {
        setHelpCategory('payment');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'returns') {
        setHelpCategory('returns');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'giftcards') {
        setHelpCategory('giftcards');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash) {
        const cleanHash = hash.toLowerCase().replace(/[^a-z0-9]/g, '');
        const knownCategories = [
          "Rings", "Bracelets", "Brooches", "Chains", "Bangles", "Anklets", 
          "Necklaces", "Pendants", "Mangalsutras", "Nose Pins", "Earrings", 
          "Gold Coins", "Solitaires", "Coins", "Men's Jewellery", "Women's Jewellery", "Kids Jewellery"
        ];
        let matchedCategory = knownCategories.find(cat => 
          cat.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanHash
        );
        if (!matchedCategory) {
          matchedCategory = hash.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        setSelectedCategoryName(matchedCategory);
        setCurrentView('rings');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
        setSelectedProductId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectedProduct = (allProducts.length > 0 ? allProducts : products).find(p => String(p.id) === String(selectedProductId)) || null;

  return (
    <>
      <Header wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />
      {currentView === 'product' ? (
        <ProductDetailPage
          product={selectedProduct}
          products={allProducts}
          wishlist={wishlist}
          setWishlist={setWishlist}
          cart={cart}
          setCart={setCart}
          onBack={() => { window.history.back(); }}
        />
      ) : currentView === 'rings' ? (
        <CategoryPage category={selectedCategoryName} wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />
      ) : currentView === 'contact' ? (
        <ContactPage />
      ) : currentView === 'blog' ? (
        <BlogPage />
      ) : currentView === 'about' ? (
        <AboutPage />
      ) : currentView === 'delivery' ? (
        <DeliveryPage initialCategory={helpCategory} />
      ) : currentView === 'wishlist' ? (
        <WishlistPage products={allProducts} wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />
      ) : currentView === 'cart' ? (
        <CartPage products={allProducts} cart={cart} setCart={setCart} />
      ) : currentView === 'profile' ? (
        <UserDashboard />
      ) : currentView === 'checkout' ? (
        <CheckoutPage />
      ) : (
        <>
          <Hero />
          <ShopByCollection />
          <FindPerfectMatch />
          <TrendingNow />
          <ZonirazWorld />
          <NewArrivals />
          <CuratedForYou />
          <ZonirazAssurance />
          <GoldExchange />
          <ExchangeProgram />
          <ZonirazExperience />
          <BottomRibbon />
        </>
      )}
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
