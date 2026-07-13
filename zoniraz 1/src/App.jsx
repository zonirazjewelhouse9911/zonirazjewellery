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
import TestimonialSection from './components/TestimonialSection';
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
import AllCollectionsPage from './components/AllCollectionsPage';
import FranchisePage from './components/FranchisePage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
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
  const [termsTab, setTermsTab] = React.useState('terms');

  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    Promise.all([
      fetch('http://localhost:55000/api/admin/products').then(res => res.json()),
      fetch('http://localhost:55000/api/productBasePricing').then(res => res.json()).catch(() => null)
    ])
      .then(([resData, pricingData]) => {
        if (resData.success) {
          const pricingMap = {};
          if (pricingData && pricingData.success && Array.isArray(pricingData.data)) {
            pricingData.data.forEach(item => {
              const idKey = item._id || item.product_id;
              if (idKey) {
                pricingMap[idKey] = item.base_price_withGST;
              }
            });
          }

          const mapped = (resData.data || []).map(p => {
            const id = p._id || p.product_id;
            const name = p.product_title || p.name || 'Jewellery Item';
            const price = pricingMap[p._id] || pricingMap[p.product_id] || Number(p.price) || Number(p.basePrice) || 0;
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
            if (p.gender) {
              const gLower = p.gender.toLowerCase();
              genderList.push(gLower);
              if (gLower === 'female' || gLower === 'women') {
                genderList.push('women', 'female');
              }
              if (gLower === 'male' || gLower === 'men') {
                genderList.push('men', 'male');
              }
            }
            if (p.specs && p.specs.gender) {
              const gLower = p.specs.gender.toLowerCase();
              genderList.push(gLower);
              if (gLower === 'female' || gLower === 'women') {
                genderList.push('women', 'female');
              }
              if (gLower === 'male' || gLower === 'men') {
                genderList.push('men', 'male');
              }
            }
            if (p.tags && Array.isArray(p.tags)) {
              if (p.tags.includes('women')) genderList.push('women', 'female');
              if (p.tags.includes('men')) genderList.push('men', 'male');
              if (p.tags.includes('kids')) genderList.push('kids');
            }
            const gender = [...new Set(genderList.map(s => s.toLowerCase()))].join(', ');
            // Get images array
            let images = [];
            if (p.gallery) {
              if (Array.isArray(p.gallery)) {
                images = p.gallery;
              } else if (typeof p.gallery === 'object' && p.gallery !== null) {
                Object.values(p.gallery).forEach(val => {
                  if (Array.isArray(val)) {
                    images.push(...val);
                  } else if (typeof val === 'string') {
                    images.push(val);
                  }
                });
              } else if (typeof p.gallery === 'string') {
                try {
                  const parsed = JSON.parse(p.gallery);
                  if (Array.isArray(parsed)) {
                    images = parsed;
                  } else if (typeof parsed === 'object' && parsed !== null) {
                    Object.values(parsed).forEach(val => {
                      if (Array.isArray(val)) {
                        images.push(...val);
                      } else if (typeof val === 'string') {
                        images.push(val);
                      }
                    });
                  }
                } catch (e) {
                  images = p.gallery.split(',').map(s => s.trim());
                }
              }
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
            if (url.startsWith('/')) return `http://localhost:55000${url}`;
            if (url.startsWith('uploads/')) return `http://localhost:55000/${url}`;
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
      } else if (hash === 'collections' || hash === 'all-collections') {
        setCurrentView('all-collections');
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
      } else if (hash === 'franchise' || hash === 'franchise-enquiry') {
        setCurrentView('franchise');
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
      } else if (hash === 'terms' || hash === 'terms-conditions') {
        setCurrentView('terms');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === 'privacy' || hash === 'privacy-policy') {
        setCurrentView('privacy');
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
          // Try prefix match for compound names like "necklaces-pendants" → "Necklaces"
          matchedCategory = knownCategories.find(cat =>
            cleanHash.startsWith(cat.toLowerCase().replace(/[^a-z0-9]/g, ''))
          );
        }
        if (!matchedCategory) {
          // Fallback: title-case the hash
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
      ) : currentView === 'franchise' ? (
        <FranchisePage />
      ) : currentView === 'delivery' ? (
        <DeliveryPage initialCategory={helpCategory} />
      ) : currentView === 'terms' ? (
        <TermsPage />
      ) : currentView === 'privacy' ? (
        <PrivacyPage />
      ) : currentView === 'wishlist' ? (
        <WishlistPage products={allProducts} wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />
      ) : currentView === 'cart' ? (
        <CartPage products={allProducts} cart={cart} setCart={setCart} />
      ) : currentView === 'profile' ? (
        <UserDashboard />
      ) : currentView === 'all-collections' ? (
        <AllCollectionsPage products={allProducts} />
      ) : currentView === 'checkout' ? (
        <CheckoutPage />
      ) : (
        <>
          <Hero />
          <ShopByCollection products={allProducts} />
          <FindPerfectMatch products={allProducts} />
          <TrendingNow />
          <ZonirazWorld />
          <NewArrivals />
          <CuratedForYou />
          <ZonirazAssurance />
          <GoldExchange />
          <ExchangeProgram />
          <ZonirazExperience />
          <TestimonialSection />
          <BottomRibbon />
        </>
      )}
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Floating WhatsApp and Call widgets */}
      <div className="floating-contact-widgets">
        <a 
          href="https://wa.me/919784836080" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="floating-widget whatsapp-widget"
          data-tooltip="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.419 9.86-9.86.001-2.636-1.02-5.115-2.876-6.973-1.857-1.859-4.335-2.88-6.97-2.882-5.437 0-9.863 4.42-9.866 9.861-.001 1.639.429 3.238 1.248 4.636L1.879 21.6l4.768-1.246zm11.758-5.326c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
          </svg>
        </a>
        <a 
          href="tel:+919784836080" 
          className="floating-widget call-widget"
          data-tooltip="Call Us: +91 97848 36080"
          aria-label="Call Us"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1z"/>
          </svg>
        </a>
      </div>
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
