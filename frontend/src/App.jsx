import React, { useContext } from 'react';
import { API_BASE_URL, getUploadsUrl } from './config';
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
import BlogDetailPage from './components/BlogDetailPage';
import AboutPage from './components/AboutPage';
import DeliveryPage from './components/DeliveryPage';
import UserDashboard from './components/UserDashboard';
import CheckoutPage from './components/CheckoutPage';
import AllCollectionsPage from './components/AllCollectionsPage';
import FranchisePage from './components/FranchisePage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import SellGoldPage from './components/SellGoldPage';
import BuyGoldPage from './components/BuyGoldPage';
import GoldMinePage from './components/GoldMinePage';
import LooseStonesPage from './components/LooseStonesPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { VideoCallProvider } from './context/VideoCallContext';
import { CurrencyProvider } from './context/CurrencyContext';
import AuthModal from './components/AuthModal';
import VideoCallModal from './components/VideoCallModal';
import AdminVideoPanel from './components/AdminVideoPanel';
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

const getKeywordsForView = (currentView, queryParams, categoryName) => {
  const cat = String(categoryName || '').toLowerCase().trim();
  const params = queryParams || {};
  const metal = params.metal || '';
  const stone = params.stone || '';
  const style = params.style || '';
  const occasion = params.occasion || '';
  const gender = params.gender || '';
  const tag = params.tag || '';
  const collection = params.collection || '';
  const tab = params.tab || '';

  if (currentView === 'rings' && (cat.includes('earring') || queryParams.category === 'earrings') && metal === 'gold') {
    return {
      url: "https://zoniraz.com/products?category=earrings&metal=gold",
      primary: "Buy women Earrrings online in india",
      secondary: ["earrings gold price in india","daily use earrings online","best gold earrings online"],
      lsi: ["diamond earrings for wife","gold earrings price in saudi arabia","white gold earrings australia","22k gold earrings online india","18k gold earrings dubai","earrings gold price in ksa","modern earrings for girls","trendy earrings for women India","gold earrings for bride price","daily wear earrings gold price","latest new model earrings","tops gold earrings new design","traditional indian earrings designs","women earring design new fashion"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && metal === 'gold') {
    return {
      url: "https://zoniraz.com/products?category=rings&metal=gold",
      primary: "Buy gold rings for women",
      secondary: ["rose gold engagement rings uk","women's gold fashion rings","gold price ring woman"],
      lsi: ["ladies gold anguthi","ladies gold ring diamond","ladies gold finger ring with price","white gold engagement rings australia","18k gold ring price in uae","22k gold rings for women","gold wedding rings uk","wedding ring designer online","gold earring price in uae","biggest gold ring dubai","gold ring price in saudi arabia","saudi arabia gold design ring","22k gold toe rings india","women gold rings online India"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && metal === 'gold' && occasion === 'engagement') {
    return {
      url: "https://zoniraz.com/products?category=rings&metal=gold&occasion=engagement",
      primary: "Buy Gold Engagement Ring for Women",
      secondary: ["14k gold ring engagement","14kt white gold engagement ring","gold engagement ring uk"],
      lsi: ["14kt gold engagement ring","expensive women's wedding rings","luxury rose gold necklace","buy gold engagement ring online","luxury diamond engagement rings","gold round diamond engagement ring","rose gold pendants uk","latest indian engagement ring designs","wedding ring uae"]
    };
  }
  if (currentView === 'rings' && (cat.includes('pendant') || queryParams.category === 'pendants') && metal === 'gold') {
    return {
      url: "https://zoniraz.com/products?category=pendants&metal=gold",
      primary: "Buy gold pendant necklace",
      secondary: ["18k gold pendant necklace","custom gold necklace pendant","14k gold chain"],
      lsi: ["14k white gold chain","name necklace for men","rose gold heart necklace uk","diamond pendant necklace australia","gold chain price in ksa","gold pendant online india","10k gold chain mens","14kt white gold chain","engraved gold bar necklace","mens long necklace","personalized jewelry gift","custom letter chain necklace","gold choker necklace australia","gold necklace price in saudi arabia","gold chain price in saudi arabia","men's 10 karat gold chain","chain white gold price in india","customised gold pendant india","gold chain 22k india","gold necklace uk","gold necklace ksa","gold necklace design in saudi arabia","saudi arabia gold necklace design","gold necklace australia"]
    };
  }
  if (currentView === 'rings' && (cat.includes('nose-pi') || queryParams.category === 'nose-pin') && metal === 'gold') {
    return {
      url: "https://zoniraz.com/products?category=nose-pin&metal=gold",
      primary: "Buy gold nose pin for women",
      secondary: ["small gold nose pin price","gold nose pin without stone","nose pin indian"],
      lsi: ["real gold nose pin price","solid gold nose pin","ladies nose pin gold","nose piercing in uk","gold latest nose pin","small nose pin gold price","nose pin design gold price","gold nose pin india","large nose studs uk","gold nose pin price in uae","10 – 100/Low","custom diamond name pendant"]
    };
  }
  if (currentView === 'rings' && (cat.includes('earring') || queryParams.category === 'earrings') && stone === 'diamond') {
    return {
      url: "https://zoniraz.com/products?category=earrings&stone=diamond",
      primary: "Buy Diamond Earrings",
      secondary: ["diamond earrings on sale","8 gram gold jhumka designs with price","diamond wedding earrings for bride"],
      lsi: ["latest diamond earrings designs","diamond stud earrings for women yellow gold","modern diamond earrings designs","drop &amp; linear diamond earrings for women","diamond earrings australia"]
    };
  }
  if (currentView === 'rings' && (cat.includes('pendant') || queryParams.category === 'pendants') && stone === 'diamond') {
    return {
      url: "https://zoniraz.com/products?category=pendants&stone=diamond",
      primary: "diamond pendant for women",
      secondary: ["small diamond initial necklace","10 gram gold jhumka designs with price","gold and diamond necklace women's"],
      lsi: ["custom diamond name necklace","diamond name plate necklace","diamond pendant earring set indian","indian bridal diamond necklace with price","diamond necklace australia","diamond initial necklace australia"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && stone === 'diamond') {
    return {
      url: "https://zoniraz.com/products?category=rings&stone=diamond",
      primary: "Buy Diamond Rings",
      secondary: ["3 to 4 grams gold earrings designs","large diamond hoop earrings yellow gold","lab grown diamond engagement rings"],
      lsi: ["best lab created diamond rings","affordable anniversary rings","diamond ring design for female in gold","diamond engagement rings uk","original diamond ring price in saudi arabia","bridal ring sets australia"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && stone === 'diamond') {
    return {
      url: "https://zoniraz.com/products?category=rings&stone=diamond",
      primary: "buy diamond nose pin online",
      secondary: ["diamond nose rings for sale","diamond big nose pin","diamond house nose pin"],
      lsi: ["best day to wear diamond nose pin","designer diamond nose pin","diamond nose piercing price","14k gold diamond nose ring","indian gold ear studs","small gold stud earrings india","cost of diamond nose ring in india"]
    };
  }
  if (currentView === 'rings' && (cat.includes('earring') || queryParams.category === 'earrings') && style === 'drops') {
    return {
      url: "https://zoniraz.com/products?category=earrings&style=drops",
      primary: "gold dangle earrings for women",
      secondary: ["gold chains for women","cross necklace for women","thin gold chain"],
      lsi: ["18k white gold drop earrings","rose gold dangle earrings wedding","large gold dangle earrings","small gold hoop earrings with dangle"]
    };
  }
  if (currentView === 'rings' && (cat.includes('earring') || queryParams.category === 'earrings') && style === 'studs') {
    return {
      url: "https://zoniraz.com/products?category=earrings&style=studs",
      primary: "gold stud earrings for women",
      secondary: ["yellow gold engagement rings","best lab created diamond engagement rings","14k white gold stud earrings"],
      lsi: ["white stone ear studs","ladies gold stud earrings","14 karat white gold stud earrings","18k white gold diamond stud earrings","indian gold earrings studs","gold stud earrings uk"]
    };
  }
  if (currentView === 'rings' && (cat.includes('earring') || queryParams.category === 'earrings') && style === 'hoops') {
    return {
      url: "https://zoniraz.com/products?category=earrings&style=hoops",
      primary: "gold hoop earrings for women",
      secondary: ["gold cartilage hoop","mini huggies","ladies gold hoop earrings"],
      lsi: ["womens gold hoop earrings small","mall thick gold hoops","small white gold huggie earrings","indian style gold hoop earrings","large gold hoop earrings uk"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && stone === 'diamond' && occasion === 'engagement') {
    return {
      url: "https://zoniraz.com/products?category=rings&stone=diamond&occasion=engagement",
      primary: "diamond engagement ring",
      secondary: ["yellow diamond engagement rings","custom diamond engagement rings","yellow diamond wedding ring"],
      lsi: ["online custom engagement rings","custom unique engagement rings","diamond engagement ring uk","bridal ring sets uk","price of diamond ring in usa","diamond engagement ring uae"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && gender === 'men') {
    return {
      url: "https://zoniraz.com/products?category=rings&gender=men",
      primary: "mens gold rings",
      secondary: ["mens 10k gold rings","mens gold rings for sale","18k white gold engagement ring"],
      lsi: ["ring gold price in india","latest gold ring design for male without stone","18 karat gold mens ring price","gents gold ring designs with price in india","mens gold rings uk","mens wedding rings uk gold"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && occasion === 'engagement') {
    return {
      url: "https://zoniraz.com/products?category=rings&occasion=engagement",
      primary: "diamond engagement ring",
      secondary: ["oval cut engagement rings","diamond anniversary","diamond wedding ring uk"],
      lsi: ["mens diamond wedding rings uk","wedding ring sets australia","diamond stores","engagement ring store","engagement ring shops"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && metal === 'gold' && occasion === 'engagement') {
    return {
      url: "https://zoniraz.com/products?category=rings&metal=gold&occasion=engagement",
      primary: "Buy Gold Engagement Rings Online",
      secondary: ["14k white gold engagement ring","14k rose gold engagement ring","gold engagement rings with names"],
      lsi: ["14k gold engagement ring","engagement couple rings gold with letters","engagement gold rings for couples with names","custom rose gold engagement rings","affordable engagement ring sets","engagement name rings gold"]
    };
  }
  if (currentView === 'rings' && (cat.includes('ring') || queryParams.category === 'rings') && tag === 'office-wear') {
    return {
      url: "https://zoniraz.com/products?tag=office-wear&category=rings",
      primary: "Daily wear finger ring design",
      secondary: ["daily use finger ring design","daily use gold finger ring","daily wear rings artificial"],
      lsi: ["daily wear unique simple gold ring design","daily wear rings for women","simple gold ring for daily use","lightweight gold finger rings","everyday wear gold ring designs","minimal gold ring designs for women","stylish daily wear rings for girls","affordable daily wear finger rings"]
    };
  }
  if (currentView === 'rings' && collection === 'bridal') {
    return {
      url: "https://zoniraz.com/products?collection=bridal",
      primary: "build engagement ring",
      secondary: ["engagement ring and wedding band set","custom made engagement rings","diamond bridal"],
      lsi: ["book jewellery appointment"]
    };
  }
  if (currentView === 'gold-mine') {
    return {
      url: "https://zoniraz.com/plans/gold-mine",
      primary: "gold saving scheme online",
      secondary: ["gold installment scheme","gold installment plan","grt flexi gold plan"],
      lsi: ["gold savings plan India","monthly gold investment scheme","digital gold saving scheme","systematic gold investment plan","flexible gold saving scheme","gold monthly installment scheme","jewelry gold saving plan","gold investment scheme online India","gold SIP plan India","easy gold savings plan"]
    };
  }
  if (currentView === 'sell-gold') {
    return {
      url: "https://zoniraz.com/exchange",
      primary: "old gold exchange",
      secondary: ["old gold calculator","old gold price calculator","old gold rate calculator"],
      lsi: ["old gold value calculator","gold exchange calculator","old gold valuation","gold exchange rate","gold rate today","gold purity calculator","gold price calculator 22k","gold exchange scheme","sell old gold","gold valuation calculator","jewellery buying consultation","jewellery sales enquiry","jewellery store customer care"]
    };
  }
  if (currentView === 'franchise') {
    return {
      url: "https://zoniraz.com/franchise",
      primary: "jewellery franchise",
      secondary: ["jewellery showroom franchise","jewellery brand franchise","gold jewellery franchise"],
      lsi: ["diamond jewellery franchise","luxury jewellery franchise","jewellery business franchise","jewellery store franchise","jewelry franchise india","jewellery dealership","jewellery retail franchise","jewellery franchise india"]
    };
  }
  if (currentView === 'contact') {
    return {
      url: "https://zoniraz.com/contact",
      primary: "contact jewellery store",
      secondary: ["jewellery enquiry","contact jewellery expert","jewellery contact number"],
      lsi: ["jewellery showroom near me","jewellery customer service","jewellery support team","jewellery appointment booking","gold jewellery consultation","diamond jewellery consultation","visit jewellery showroom","jewellery store location"]
    };
  }
  if (currentView === 'about') {
    return {
      url: "https://zoniraz.com/about",
      primary: "luxury jewellery brand",
      secondary: ["bis hallmarked jewellery","famous jewellery brands","luxury diamond jewelry"],
      lsi: ["jewellery shipping abroad","buy luxury jewellery online","certified diamond jewellery online","luxury diamond jewellery collection","trusted jewellery showroom","designer diamond jewellery","branded gold jewellery","luxury bridal jewellery","hallmarked jewellery online"]
    };
  }
  if (currentView === 'delivery' && tab === 'giftcards') {
    return {
      url: "https://zoniraz.com/gift-cards",
      primary: "jewellery e gift card",
      secondary: ["digital gift cards","personalized birthday cards","happy birthday wishes for friend"],
      lsi: ["purchase jewellery gift card"]
    };
  }
  if (currentView === 'delivery' && tab === 'international') {
    return {
      url: "https://zoniraz.com/help?tab=international",
      primary: "international jewellery shipping",
      secondary: ["International Shipping","worldwide jewellery delivery","international jewellery orders"],
      lsi: ["international jewellery delivery service","worldwide gold jewellery delivery","worldwide diamond jewellery shipping","jewellery shipping to USA UK UAE","secure overseas jewellery delivery"]
    };
  }
  if (currentView === 'delivery' && tab === 'delivery') {
    return {
      url: "https://zoniraz.com/help?tab=delivery",
      primary: "track order Delivery and Shopping",
      secondary: ["order number tracker","tracking"],
      lsi: []
    };
  }

  return {
    url: 'https://zoniraz.com/',
    primary: 'luxury jewellery brand',
    secondary: ['bis hallmarked jewellery', 'certified diamond jewellery online', 'famous jewellery brands'],
    lsi: ['designer diamond jewellery', 'branded gold jewellery', 'luxury bridal jewellery', 'trusted jewellery showroom']
  };
};

function AppContent() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);
  const [currentView, setCurrentView] = React.useState('home');
  const [wishlist, setWishlist] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zoniraj_wishlist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [cart, setCart] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zoniraj_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [helpCategory, setHelpCategory] = React.useState('delivery');
  const [selectedCategoryName, setSelectedCategoryName] = React.useState('Rings');
  const [termsTab, setTermsTab] = React.useState('terms');
  const [selectedBlogSlug, setSelectedBlogSlug] = React.useState(null);

  const [allProducts, setAllProducts] = React.useState([]);

  // Persist wishlist & cart to localStorage on every change
  React.useEffect(() => {
    localStorage.setItem('zoniraj_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  React.useEffect(() => {
    localStorage.setItem('zoniraj_cart', JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/admin/products`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/productBasePricing`).then(res => res.json()).catch(() => null)
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

            // Get gender (supporting database values: Femail, mail, kide, female, male, kids, women, men)
            let genderList = [];
            const rawGender = p.gender || p.productgender || p.product_gender || p.target_audience || (p.specs && p.specs.gender) || '';
            if (rawGender) {
              const gLower = String(rawGender).toLowerCase().trim();
              genderList.push(gLower);
              if (gLower.includes('femail') || gLower.includes('female') || gLower.includes('women') || gLower.includes('woman') || gLower.includes('fem')) {
                genderList.push('women', 'female', 'femail');
              }
              if ((gLower.includes('mail') || gLower.includes('male') || gLower.includes('men') || gLower.includes('man')) && !gLower.includes('femail') && !gLower.includes('female')) {
                genderList.push('men', 'male', 'mail');
              }
              if (gLower.includes('kide') || gLower.includes('kids') || gLower.includes('kid') || gLower.includes('child')) {
                genderList.push('kids', 'kide');
              }
            }
            if (p.tags && Array.isArray(p.tags)) {
              if (p.tags.includes('women') || p.tags.includes('femail') || p.tags.includes('female')) genderList.push('women', 'female', 'femail');
              if (p.tags.includes('men') || p.tags.includes('mail') || p.tags.includes('male')) genderList.push('men', 'male', 'mail');
              if (p.tags.includes('kids') || p.tags.includes('kide')) genderList.push('kids', 'kide');
            }
            const titleLower = String(p.product_title || p.name || '').toLowerCase();
            const pCatLower = String(p.product_category || p.category || '').toLowerCase();
            if (titleLower.includes('women') || titleLower.includes('femail') || titleLower.includes('female') || pCatLower.includes('women')) genderList.push('women', 'female', 'femail');
            if ((titleLower.includes("men's") || titleLower.includes('mens') || titleLower.includes('mail') || pCatLower.includes('men')) && !titleLower.includes('femail')) genderList.push('men', 'male', 'mail');
            if (titleLower.includes('kids') || titleLower.includes('kide') || titleLower.includes('child') || pCatLower.includes('kids')) genderList.push('kids', 'kide');

            // Default fallback for general jewellery without explicit gender
            if (genderList.length === 0) {
              genderList.push('women', 'female', 'femail');
            }

            const gender = [...new Set(genderList.map(s => s.toLowerCase()))].join(', ');
            // Get images array
            let images = [];
            if (p.gallery) {
              let parsed = p.gallery;
              if (typeof p.gallery === 'string') {
                try {
                  parsed = JSON.parse(p.gallery);
                } catch (e) {
                  parsed = p.gallery.split(',').map(s => s.trim());
                }
              }

              if (Array.isArray(parsed)) {
                images = parsed;
              } else if (typeof parsed === 'object' && parsed !== null) {
                // Prioritize Yellow Gold (key '2' or equivalent name) first
                const yellowKeys = ['2', 'yellow', 'yellow gold', 'yellow-gold'];
                const yellowGoldImages = [];
                yellowKeys.forEach(k => {
                  const val = parsed[k];
                  if (Array.isArray(val)) yellowGoldImages.push(...val);
                  else if (typeof val === 'string') yellowGoldImages.push(val);
                });

                // Get other metals
                const otherImages = [];
                Object.keys(parsed).forEach(key => {
                  if (!yellowKeys.includes(key)) {
                    const val = parsed[key];
                    if (Array.isArray(val)) otherImages.push(...val);
                    else if (typeof val === 'string') otherImages.push(val);
                  }
                });

                images = [...yellowGoldImages, ...otherImages];
              }
            } else if (p.images) {
              if (Array.isArray(p.images)) images = p.images;
              else if (typeof p.images === 'string') images = p.images.split(',').map(s => s.trim());
            }

            const size = p.size_id || (p.specs && p.specs.size) || 'Free Size';

            // Get material / stone / metal
            let matList = [];
            if (p.material) matList.push(p.material);
            if (p.product_type) matList.push(p.product_type);
            if (p.stoneType) matList.push(p.stoneType);
            if (p.defaultMetal) matList.push(p.defaultMetal);
            if (p.metal_type) matList.push(String(p.metal_type));
            if (p.specs) {
              if (p.specs.metal) matList.push(p.specs.metal);
              if (p.specs.stoneType) matList.push(p.specs.stoneType);
            }
            if (p.tags && Array.isArray(p.tags)) {
              if (p.tags.includes('diamond')) matList.push('diamond');
              if (p.tags.includes('gold')) matList.push('gold');
              if (p.tags.includes('platinum')) matList.push('platinum');
              if (p.tags.includes('gemstone') || p.tags.includes('gemstones')) matList.push('gemstone');
              if (p.tags.includes('rose gold') || p.tags.includes('rose-gold')) matList.push('rose gold');
              if (p.tags.includes('yellow gold') || p.tags.includes('yellow-gold')) matList.push('yellow gold');
              if (p.tags.includes('white gold') || p.tags.includes('white-gold')) matList.push('white gold');
            }

            // Numeric weight & specification indications
            if (Number(p.gold_weight) > 0) matList.push('gold');
            if (Number(p.diamond_weight) > 0 || Number(p.diamond_count) > 0 || p.diamond_quality) matList.push('diamond');
            if (Number(p.gemstone_weight) > 0 || Number(p.noof_gem) > 0 || p.color_stone || Number(p.gemstone_price) > 0) matList.push('gemstone');
            if (Number(p.solitaires_weight) > 0 || Number(p.solitaire_weight) > 0 || Number(p.solitaires_price) > 0 || p.solitaires_quality) matList.push('diamond');

            // Product name / title keyword inspection
            if (titleLower.includes('gold')) matList.push('gold');
            if (titleLower.includes('diamond')) matList.push('diamond');
            if (titleLower.includes('platinum')) matList.push('platinum');
            if (titleLower.includes('gemstone') || titleLower.includes('ruby') || titleLower.includes('emerald') || titleLower.includes('sapphire') || titleLower.includes('topaz') || titleLower.includes('pearl')) matList.push('gemstone');

            const material = [...new Set(matList.map(s => String(s).toLowerCase()))].join(', ');
            
            const weight = p.product_weight || p.gold_weight || p.baseWeight || 0;
            const fastDelivery = p.feature === '1';
            const latest = p.sessional === '1';
            const storePickup = p.topselling === '1';

            return {
              ...p,
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
              gender,
              diamond_weight: p.diamond_weight,
              noof_gem: p.noof_gem,
              diamond_count: p.diamond_count,
              width: p.width,
              height: p.height,
              gold_weight: p.gold_weight,
              gemstone_weight: p.gemstone_weight,
              gemstone_price: p.gemstone_price,
              making_charges: p.making_charges,
              solitaires_price: p.solitaires_price,
              solitaire_weight: p.solitaire_weight || p.solitaires_weight || 0,
              solitaires_weight: p.solitaires_weight || p.solitaire_weight || 0,
              solitaires_quality: p.solitaires_quality,
              solitaire_price_ij_si: p.solitaire_price_ij_si,
              solitaire_price_gh_vs: p.solitaire_price_gh_vs,
              solitaire_price_ef_vvs: p.solitaire_price_ef_vvs,
              solitaire_price_fg_si: p.solitaire_price_fg_si,
              solitaire_setting: p.solitaire_setting || p.solitaires_setting || 'Prong Setting',
              solitaires_setting: p.solitaires_setting || p.solitaire_setting || 'Prong Setting',
              product_code: p.product_code,
              gallery: p.gallery,
              product_slug: p.product_slug || p.slug || ''
            };
          });

          const mapImgUrl = (url, name) => {
            if (!url) return 'https://placehold.co/600x600?text=' + encodeURIComponent(name);
            return getUploadsUrl(url);
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
    if (currentView === 'product' && selectedProductId && allProducts.length > 0) {
      const found = allProducts.find(p => 
        String(p.product_slug || p.slug || '').toLowerCase() === String(selectedProductId).toLowerCase() ||
        String(p.id).toLowerCase() === String(selectedProductId).toLowerCase()
      );
      if (found && String(found.id) !== String(selectedProductId)) {
        setSelectedProductId(found.id);
      }
    }
  }, [allProducts, selectedProductId, currentView]);

  React.useEffect(() => {
    const handleNavigation = () => {
      // Support legacy hash landing by redirecting to clean paths
      if (window.location.hash) {
        const fullHash = window.location.hash.replace('#', '');
        const qIndex = fullHash.indexOf('?');
        const legacyHash = qIndex !== -1 ? fullHash.substring(0, qIndex) : fullHash;
        const hashSearch = qIndex !== -1 ? fullHash.substring(qIndex) : '';

        if (legacyHash && !legacyHash.startsWith('my-') && !legacyHash.includes('=')) {
          const cleanPath = (legacyHash.startsWith('/') ? legacyHash : '/' + legacyHash) + hashSearch;
          window.history.replaceState(null, '', cleanPath);
        }
      }

      const path = window.location.pathname.toLowerCase();
      const search = window.location.search;
      const searchParams = new URLSearchParams(search);

      // Reset active selections
      setSelectedProductId(null);

      if (path.startsWith('/product-') || path.startsWith('/product/')) {
        const slug = path.startsWith('/product-') ? path.replace('/product-', '') : path.replace('/product/', '');
        const catalog = allProducts.length > 0 ? allProducts : products;
        const found = catalog.find(p => 
          String(p.product_slug || p.slug || '').toLowerCase() === decodeURIComponent(slug).toLowerCase() || 
          String(p.id || '').toLowerCase() === decodeURIComponent(slug).toLowerCase()
        );
        if (found) {
          const correctSlug = found.product_slug || found.slug || found.id;
          const correctPath = `/product/${correctSlug}`;
          if (window.location.pathname !== correctPath) {
            window.history.replaceState(null, '', correctPath);
          }
          setSelectedProductId(found.id);
        } else {
          setSelectedProductId(slug);
        }
        setCurrentView('product');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/trending-now' || path === '/trending') {
        setSelectedCategoryName('Trending Now');
        setCurrentView('rings');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/collections' || path === '/all-collections') {
        setCurrentView('all-collections');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/wishlist') {
        setCurrentView('wishlist');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/cart') {
        setCurrentView('cart');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/profile') {
        setCurrentView('profile');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/checkout') {
        setCurrentView('checkout');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/contact') {
        setCurrentView('contact');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/blog' || path === '/blogs') {
        setCurrentView('blog');
        setSelectedBlogSlug(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '');
        setSelectedBlogSlug(slug);
        setCurrentView('blog');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/about') {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/franchise') {
        setCurrentView('franchise');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/sell-gold' || path === '/exchange') {
        setCurrentView('sell-gold');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/buy-gold') {
        setCurrentView('buy-gold');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/gold-mine' || path === '/plans/gold-mine') {
        setCurrentView('gold-mine');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/loose-stones' || path === '/buy-loose-stones' || path === '/loose-diamonds') {
        setCurrentView('loose-stones');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/delivery') {
        setHelpCategory('delivery');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/shipping' || path === '/international-shipping') {
        setHelpCategory('international');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/payment') {
        setHelpCategory('payment');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/returns') {
        setHelpCategory('returns');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/giftcards') {
        setHelpCategory('giftcards');
        setCurrentView('delivery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/terms') {
        setCurrentView('terms');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/privacy') {
        setCurrentView('privacy');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/admin-call') {
        setCurrentView('admin-call');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path !== '/' && path !== '/index.html') {
        // Match product categories
        const routeOnly = path.substring(1);
        const cleanPathSegment = routeOnly.replace(/[^a-z0-9]/g, '');
        const knownCategories = [
          "Rings", "Bracelets", "Brooches", "Chains", "Chain", "Bangles", "Anklets", 
          "Necklaces", "Pendants", "Pendant", "Mangalsutras", "Mangalsutra", "Nose Pins", "Nose pin", "Earrings", 
          "Gold Coins", "Solitaires", "Solitaire", "Coins", "Zodiac", "Men's Jewellery", "Women's Jewellery", "Kids Jewellery"
        ];
        let matchedCategory = knownCategories.find(cat => 
          cat.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanPathSegment
        );
        if (!matchedCategory) {
          // Check if clean segment (e.g. 'chain') is a singular version of category (e.g. 'chains')
          matchedCategory = knownCategories.find(cat => {
            const cleanCat = cat.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanCat.startsWith(cleanPathSegment) || cleanPathSegment.startsWith(cleanCat);
          });
        }
        if (matchedCategory) {
          setSelectedCategoryName(matchedCategory);
          setCurrentView('rings');
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          setCurrentView('home');
        }
      } else {
        // Home view, handle query parameters (e.g. ?category=rings)
        if (searchParams.has('category')) {
          const cat = searchParams.get('category');
          const knownCategories = [
            "Rings", "Bracelets", "Brooches", "Chains", "Bangles", "Anklets", 
            "Necklaces", "Pendants", "Mangalsutras", "Nose Pins", "Earrings", 
            "Gold Coins", "Solitaires", "Coins", "Men's Jewellery", "Women's Jewellery", "Kids Jewellery"
          ];
          const matched = knownCategories.find(k => k.toLowerCase() === cat.toLowerCase());
          if (matched) {
            setSelectedCategoryName(matched);
            setCurrentView('rings');
            return;
          }
        }
        setCurrentView('home');
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);

    // Global click interceptor for local SPA link transitions
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.origin === window.location.origin) {
        const targetAttr = link.getAttribute('target');
        if (targetAttr === '_blank') return;
        
        const path = link.pathname + link.search + link.hash;
        
        if (path.startsWith('/') && !path.startsWith('/api') && !link.hasAttribute('download')) {
          if (link.pathname === window.location.pathname && link.hash) {
            return; // let native hash scrolls happen normally
          }
          e.preventDefault();
          window.history.pushState(null, '', path);
          handleNavigation();
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const parseHashParams = () => {
    const params = {};
    const searchString = window.location.search || '';
    if (searchString) {
      const searchParams = new URLSearchParams(searchString);
      searchParams.forEach((value, key) => {
        params[key.toLowerCase()] = value.toLowerCase();
      });
    }
    
    const fullHash = (window.location.hash || '').replace('#', '');
    const queryIndex = fullHash.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = fullHash.substring(queryIndex + 1);
      const parts = queryString.split('&');
      parts.forEach(part => {
        const [k, v] = part.split('=');
        if (k && v) params[k.toLowerCase()] = decodeURIComponent(v).toLowerCase();
      });
    }
    return params;
  };

  React.useEffect(() => {
    const params = parseHashParams();
    const seoData = getKeywordsForView(currentView, params, selectedCategoryName);
    
    let title = '';
    let description = '';
    let canonical = seoData.url || 'https://zoniraz.com/';
    let ogImage = 'https://zoniraz.com/zoni1.png';
    let schemas = [];

    if (currentView === 'product' && selectedProduct) {
      title = `${selectedProduct.name} - Buy Certified Diamond & Gold Jewelry Online | Zoniraz Jewels`;
      description = `Buy ${selectedProduct.name} online at Zoniraz Jewels. Crafted in premium ${selectedProduct.material || 'metal'} with exquisite design. Lifetime maintenance and certificate of authenticity included.`;
      canonical = `https://zoniraz.com/product/${selectedProduct.product_slug || selectedProduct.slug || selectedProduct.id}`;
      if (selectedProduct.image) {
        ogImage = selectedProduct.image;
      }
      
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": selectedProduct.name,
        "image": selectedProduct.images || [selectedProduct.image],
        "description": selectedProduct.description || description,
        "sku": selectedProduct.product_code || selectedProduct.id,
        "offers": {
          "@type": "Offer",
          "url": canonical,
          "priceCurrency": "INR",
          "price": selectedProduct.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock"
        }
      });
      
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://zoniraz.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": selectedProduct.category || "Jewellery",
            "item": `https://zoniraz.com/${(selectedProduct.category || "Jewellery").toLowerCase().replace(/ /g, '-')}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": selectedProduct.name,
            "item": canonical
          }
        ]
      });
    } else {
      const primary = seoData.primary || 'luxury jewellery brand';
      const secondary1 = seoData.secondary[0] || 'certified diamond jewellery online';
      const secondary2 = seoData.secondary[1] || 'famous jewellery brands';
      const lsi1 = seoData.lsi[0] || 'designer diamond jewellery';

      title = `${primary.charAt(0).toUpperCase() + primary.slice(1)} | Zoniraz Jewels`;
      description = `Discover premium collections for ${primary}. We feature high-quality ${secondary1}, elegant ${secondary2}, and beautiful ${lsi1} at best prices. Visit us now!`;
      canonical = seoData.url || 'https://zoniraz.com/';
      
      // Home page schemas
      if (currentView === 'home') {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Zoniraz Jewels",
          "url": "https://zoniraz.com/",
          "logo": "https://zoniraz.com/zoni1.png",
          "description": "Zoniraz Jewels is a premium luxury jewellery brand specializing in fine gold, diamond, and designer jewellery collections.",
          "sameAs": [
            "https://www.facebook.com/zonirazjewels",
            "https://www.instagram.com/zonirazjewels"
          ]
        });
        schemas.push({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Zoniraz Jewels",
          "url": "https://zoniraz.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://zoniraz.com/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        });
      }

      // Contact Page schemas
      if (currentView === 'contact') {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Zoniraz Jewels",
          "image": "https://zoniraz.com/zoni1.png",
          "telephone": "+91 97848 36060",
          "email": "info@zoniraz.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Zoniraz Jewel House",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302001",
            "addressCountry": "IN"
          },
          "url": "https://zoniraz.com/contact"
        });
      }
      
      const pathSegments = [];
      pathSegments.push({ name: "Home", item: "https://zoniraz.com/" });
      if (currentView !== 'home') {
        const pageName = currentView.charAt(0).toUpperCase() + currentView.slice(1);
        pathSegments.push({ name: pageName, item: canonical });
        
        schemas.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": pathSegments.map((seg, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": seg.name,
            "item": seg.item
          }))
        });
      }
    }

    document.title = title;
    
    const updateMeta = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        if (selector.startsWith('meta')) {
          element = document.createElement('meta');
          const matchName = selector.match(/name="([^"]+)"/);
          const matchProperty = selector.match(/property="([^"]+)"/);
          if (matchName) element.setAttribute('name', matchName[1]);
          if (matchProperty) element.setAttribute('property', matchProperty[1]);
          document.head.appendChild(element);
        } else if (selector.startsWith('link')) {
          element = document.createElement('link');
          const matchRel = selector.match(/rel="([^"]+)"/);
          if (matchRel) element.setAttribute('rel', matchRel[1]);
          document.head.appendChild(element);
        }
      }
      if (element) {
        element.setAttribute(attribute, value);
      }
    };

    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('link[rel="canonical"]', 'href', canonical);
    
    let robotsValue = 'index, follow';
    if (['cart', 'checkout', 'wishlist', 'profile', 'admin-call'].includes(currentView)) {
      robotsValue = 'noindex, follow';
    }
    updateMeta('meta[name="robots"]', 'content', robotsValue);
    
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', canonical);
    updateMeta('meta[property="og:image"]', 'content', ogImage);
    
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', description);
    updateMeta('meta[name="twitter:url"]', 'content', canonical);
    updateMeta('meta[name="twitter:image"]', 'content', ogImage);

    let scriptTag = document.getElementById('seo-dynamic-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-dynamic-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemas, null, 2);

  }, [currentView, selectedProductId, selectedCategoryName]);

  const selectedProduct = (allProducts.length > 0 ? allProducts : products).find(p => String(p.id) === String(selectedProductId)) || null;

  return (
    <>
      <Header wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} allProducts={allProducts} />
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
        selectedBlogSlug 
          ? <BlogDetailPage slug={selectedBlogSlug} onBack={() => { setSelectedBlogSlug(null); window.history.pushState(null, '', '/blog'); }} />
          : <BlogPage />
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
      ) : currentView === 'sell-gold' ? (
        <SellGoldPage onBack={() => { window.location.hash = ''; }} />
      ) : currentView === 'buy-gold' ? (
        <BuyGoldPage onBack={() => { window.location.hash = ''; }} />
      ) : currentView === 'gold-mine' ? (
        <GoldMinePage />
      ) : currentView === 'loose-stones' ? (
        <LooseStonesPage />
      ) : currentView === 'admin-call' ? (
        <AdminVideoPanel />
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
      {/* Global Video Call Modal — renders on top of everything */}
      <VideoCallModal />

      {/* Floating WhatsApp and Call widgets */}
      <div className="floating-contact-widgets">
        <a 
          href="https://wa.me/919784836060" 
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
          href="tel:+919784836060" 
          className="floating-widget call-widget"
          data-tooltip="Call Us: +91 97848 36060"
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
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <VideoCallProvider>
            <AppContent />
          </VideoCallProvider>
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}
