import React, { useContext, useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import AuthModal from './AuthModal';
import { Coins, TrendingDown, RefreshCw, X, ArrowLeft, ChevronDown } from 'lucide-react';
const messageBandsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498478/zoniraz_frontend/message-bands.jpg";
const postcardsBannerImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498414/zoniraz_frontend/postcards-banner.jpg";
const switchEarringsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498461/zoniraz_frontend/switch-earrings.jpg";
const dancingHoopsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498439/zoniraz_frontend/dancing-hoops.jpg";
const stretchableBanglesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498436/zoniraz_frontend/stretchable-bangles.jpg";
const watchCharmsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498414/zoniraz_frontend/watch-charms.jpg";
const solitaireSetsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498425/zoniraz_frontend/solitaire-sets.jpg";
const gulnaaraImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498457/zoniraz_frontend/gulnaara.jpg";
const mangalsutraEarringsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498451/zoniraz_frontend/mangalsutra-earrings.jpg";
const trendyMangalsutrasImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498431/zoniraz_frontend/trendy-mangalsutras.webp";
const layeredNecklacesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498446/zoniraz_frontend/layered-necklaces.jpg";
const infinityNecklacesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498427/zoniraz_frontend/infinity-necklaces.jpg";
const silverEarringsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498421/zoniraz_frontend/silver-earrings.jpg";
const silverNecklacesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498477/zoniraz_frontend/silver-necklaces.jpg";
const silverBraceletsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498426/zoniraz_frontend/silver-bracelets.jpg";
const silverRingsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498422/zoniraz_frontend/silver-rings.jpg";
const giftCardsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498452/zoniraz_frontend/gift-cards.jpg";
const wearYourWinsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498479/zoniraz_frontend/wear-your-wins.jpg";
const caratlaneIconicsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498443/zoniraz_frontend/caratlane-iconics.jpg";
const customerFavouritesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498471/zoniraz_frontend/customer-favourites.jpg";
const nineKtImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498469/zoniraz_frontend/nine-kt.jpg";
const mensPlatinumImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498449/zoniraz_frontend/mens-platinum.jpg";
const anekaImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498434/zoniraz_frontend/aneka.jpg";
const giftsForMomImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498459/zoniraz_frontend/gifts-for-mom.jpg";
import { products } from '../data/products';

const goldNecklaceSilkImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498423/zoniraz_frontend/gold-necklace-silk.jpg";
const heartFusionRingImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498456/zoniraz_frontend/heart_fusion_ring.jpg";
const infinityDiamondRingImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498424/zoniraz_frontend/infinity_diamond_ring.jpg";
const goldEarringsBannerImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498412/zoniraz_frontend/gold-earrings-banner.jpg";
const goldZodiacBannerImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498454/zoniraz_frontend/gold-zodiac-banner.jpg";
const yellowGoldNosePinBannerImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498472/zoniraz_frontend/yellow-gold-nose-pin-banner.jpg";
const yellowGoldSolitaireBannerImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498481/zoniraz_frontend/yellow-gold-solitaire-banner.jpg";

const fallbackCategories = [
  { categoryName: 'Rings', products: [] },
  { categoryName: 'Earrings', products: [] },
  { categoryName: 'Bracelets & Bangles', products: [] },
  { categoryName: 'Solitaires', products: [] },
  { categoryName: 'Mangalsutras', products: [] },
  { categoryName: 'Necklaces & Pendants', products: [] },
  { categoryName: 'Silver', products: [] },
  { categoryName: 'Gifting', products: [] }
];

function getCategoryBanners(categoryName) {
  const cat = String(categoryName || '').toLowerCase();

  if (cat.includes('silver')) {
    return [silverEarringsImg, silverNecklacesImg];
  }
  if (cat.includes('pendant') || cat.includes('necklace')) {
    return [goldNecklaceSilkImg, infinityNecklacesImg];
  }
  if (cat.includes('earring')) {
    return [goldEarringsBannerImg, dancingHoopsImg];
  }
  if (cat.includes('ring')) {
    return [heartFusionRingImg, infinityDiamondRingImg];
  }
  if (cat.includes('solitaire')) {
    return [yellowGoldSolitaireBannerImg, yellowGoldSolitaireBannerImg];
  }
  if (cat.includes('chain')) {
    return [goldNecklaceSilkImg, layeredNecklacesImg];
  }
  if (cat.includes('mangalsutra')) {
    return [trendyMangalsutrasImg, mangalsutraEarringsImg];
  }
  if (cat.includes('nose')) {
    return [yellowGoldNosePinBannerImg, yellowGoldNosePinBannerImg];
  }
  if (cat.includes('bangle') || cat.includes('bracelet') || cat.includes('bangles')) {
    return [stretchableBanglesImg, watchCharmsImg];
  }
  if (cat.includes('zodic') || cat.includes('zodiac')) {
    return [goldZodiacBannerImg, wearYourWinsImg];
  }

  // Fallbacks
  return [customerFavouritesImg, caratlaneIconicsImg];
}

export default function Header({ wishlist = {}, setWishlist, cart = {}, setCart, allProducts = [] }) {
  const { user, token, logout } = useContext(AuthContext);
  const { cartList } = useContext(CartContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login');
  const [pincode, setPincode] = useState('');
  const [tempPincode, setTempPincode] = useState('');
  const [pincodeData, setPincodeData] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
  const pincodeWrapperRef = useRef(null);

  const { currency, setCurrency, currencies, activeCurrencyConfig, formatPrice } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideCurrency = (e) => {
      if (currencyWrapperRef.current && !currencyWrapperRef.current.contains(e.target)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideCurrency);
    return () => document.removeEventListener('mousedown', handleClickOutsideCurrency);
  }, []);

  // Debounced Product Search States & Refs
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Debounce Effect (300ms delay)
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Execute Search on Debounced Query
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      return;
    }

    const q = debouncedQuery.toLowerCase();
    const catalog = (allProducts && allProducts.length > 0) ? allProducts : products;

    const filtered = catalog.filter(p => {
      const name = String(p.name || p.product_title || p.title || '').toLowerCase();
      const category = String(p.category || p.product_category || '').toLowerCase();
      const subcategory = String(p.subcategory || p.product_subcategory || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : String(p.tags || '').toLowerCase();
      const sku = String(p.sku || p.product_id || p._id || '').toLowerCase();

      return name.includes(q) || category.includes(q) || subcategory.includes(q) || tags.includes(q) || sku.includes(q);
    });

    setSearchResults(filtered);
  }, [debouncedQuery, allProducts]);

  // Click outside & Escape key listeners to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = desktopSearchRef.current && desktopSearchRef.current.contains(e.target);
      const inMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      if (!inDesktop && !inMobile) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectSearchResult = (prod) => {
    const slug = prod.product_slug || prod.slug || prod.id || prod._id || prod.product_id;
    if (slug) {
      window.history.pushState(null, '', `/product/${slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const renderSearchResultsDropdown = () => {
    if (!isSearchOpen || !searchQuery.trim()) return null;

    return (
      <div
        className="header-search-dropdown-popup"
        style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          marginTop: '4px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          border: '1px solid #ebd8d4',
          zIndex: 10000,
          maxHeight: '380px',
          overflowY: 'auto',
          padding: '12px'
        }}
      >
        {isSearching ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#718096', fontSize: '12px' }}>
            <span>Searching products...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#C8A359', letterSpacing: '1px', marginBottom: '8px', padding: '0 4px', textTransform: 'uppercase' }}>
              Products Found ({searchResults.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {searchResults.slice(0, 8).map((prod) => {
                const prodId = prod.id || prod._id || prod.product_id;
                const prodName = prod.name || prod.product_title || 'Jewellery Item';
                const prodImg = prod.image || (prod.images && prod.images[0]) || 'https://placehold.co/100x100?text=Zoniraz';
                const prodPrice = Number(prod.price || prod.basePrice || 0);
                const prodCategory = prod.category || prod.product_category || 'Jewellery';

                return (
                  <div
                    key={prodId}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSearchResult(prod);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectSearchResult(prod);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: '#FAFCFE'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF5F4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAFCFE')}
                  >
                    <img
                      src={prodImg}
                      alt={prodName}
                      loading="lazy"
                      decoding="async"
                      width="44"
                      height="44"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A202C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prodName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>
                        {prodCategory}
                      </div>
                    </div>
                    {prodPrice > 0 && (
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#F05A47', flexShrink: 0 }}>
                        {formatPrice(prodPrice)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {searchResults.length > 8 && (
              <div style={{ textAlign: 'center', paddingTop: '10px', fontSize: '11px', color: '#718096' }}>
                + {searchResults.length - 8} more products match your search
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', color: '#718096', fontSize: '12px' }}>
            No products found for "<strong>{debouncedQuery}</strong>"
          </div>
        )}
      </div>
    );
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    const code = tempPincode.trim();
    if (!code || code.length < 6) {
      setPincodeError('Please enter a 6-digit PIN code');
      return;
    }

    setPincodeLoading(true);
    setPincodeError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/pincode/${code}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPincode(code);
        setPincodeData(data.data);
        setIsPincodeOpen(false);
      } else {
        setPincodeError(data.message || 'PIN code not found');
      }
    } catch (err) {
      console.error('Pincode fetch error:', err);
      setPincode(code);
      setIsPincodeOpen(false);
    } finally {
      setPincodeLoading(false);
    }
  };

  const [goldModalOpen, setGoldModalOpen] = useState(false);
  const [goldActiveTab, setGoldActiveTab] = useState('menu'); // 'menu' | 'buy' | 'sell' | 'exchange'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [disabledDropdown, setDisabledDropdown] = useState(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(145);

  // Close pincode dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pincodeWrapperRef.current && !pincodeWrapperRef.current.contains(event.target)) {
        setIsPincodeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Measure header height dynamically
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.getBoundingClientRect().height);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('scroll', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('scroll', updateHeight);
    };
  }, []);

  const handleDropdownLinkClick = (categorySlug) => {
    setDisabledDropdown(categorySlug);
    setTimeout(() => {
      setDisabledDropdown(null);
    }, 600);
  };

  const handleCategoryTriggerClick = (categorySlug) => {
    setDisabledDropdown(categorySlug);
    setTimeout(() => {
      setDisabledDropdown(null);
    }, 400);
  };

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);
    fetch(`${API_BASE_URL}/api/userSide/GetNavbar`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setCategories(resData.data);
        } else {
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('Error fetching navbar categories:', err);
        setCategories([]);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const bannerImages = [
    messageBandsImg,
    postcardsBannerImg,
    switchEarringsImg,
    dancingHoopsImg,
    stretchableBanglesImg,
    watchCharmsImg,
    solitaireSetsImg,
    gulnaaraImg,
    mangalsutraEarringsImg,
    trendyMangalsutrasImg,
    layeredNecklacesImg,
    infinityNecklacesImg,
    giftCardsImg,
    wearYourWinsImg
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <header ref={headerRef} className={`jaypore-header ${scrolled ? 'scrolled' : ''}`} style={{ position: 'relative' }}>

        {/* Main Row: Search on Left, Logo in Center, Actions on Right */}
        <div className="header-main-row">
          {/* Mobile Hamburger toggle */}
          <button
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mobile-menu-hamburger-icon">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Left Side: Desktop Search Capsule */}
          <div ref={desktopSearchRef} className="header-left-search desktop-only-util" style={{ position: 'relative' }}>
            <div className="search-bar-capsule">
              <input
                type="text"
                placeholder="Search for Minimalist Jewellery..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="search-capsule-btn"
                  aria-label="Clear Search"
                  onClick={() => {
                    setSearchQuery('');
                    setDebouncedQuery('');
                    setSearchResults([]);
                  }}
                >
                  <X size={14} />
                </button>
              ) : (
                <button className="search-capsule-btn" aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              )}
            </div>
            {renderSearchResultsDropdown()}
          </div>

          {/* Center: Brand Logo */}
          <div className="header-brand">
            <a href="/" className="brand-logo-text">
              <img src="https://res.cloudinary.com/fxokwlyu/image/upload/v1788498406/zoniraz_frontend/zoni.png" alt="Zoniraz Logo" className="header-brand-logo-img" decoding="async" width="180" height="60" />
            </a>
          </div>

          {/* Right Side: Pincode + Currency + Icon Actions */}
          <div className="header-right-actions">
            {/* Currency Selector */}
            <div ref={currencyWrapperRef} className="nav-item-container nav-currency-wrapper">
              <button
                className="utility-item nav-item-trigger currency-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCurrencyOpen(prev => !prev);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#634d40',
                  padding: '4px 6px',
                  borderRadius: '4px'
                }}
                title="Change Currency"
                aria-label="Change Currency"
              >
                <span style={{ fontSize: '14px' }}>{activeCurrencyConfig.flag}</span>
                <span>{currency}</span>
                <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: isCurrencyOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {isCurrencyOpen && (
                <div
                  className="currency-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 8px 24px rgba(99,77,64,0.18)',
                    borderRadius: '8px',
                    padding: '6px 0',
                    minWidth: '170px',
                    zIndex: 1100,
                    border: '1px solid #ebdccb'
                  }}
                >
                  <div style={{ padding: '6px 12px', fontSize: '10px', fontWeight: '700', color: '#8c7365', borderBottom: '1px solid #efe7e5', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                    Select Currency
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {currencies.map(c => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setIsCurrencyOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          textAlign: 'left',
                          background: currency === c.code ? '#faf5f2' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          fontSize: '12px',
                          color: currency === c.code ? '#634d40' : '#4a3b32',
                          fontWeight: currency === c.code ? '700' : '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f0eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currency === c.code ? '#faf5f2' : 'transparent'}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px' }}>{c.flag}</span>
                          <span>{c.code}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#8c7365', fontWeight: '600' }}>{c.symbol.trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pincode Selector */}
            <div ref={pincodeWrapperRef} className={`nav-item-container nav-pincode-wrapper desktop-only-util ${isPincodeOpen ? 'open' : ''}`}>
              <a
                href="#delivery-stores"
                className="utility-item nav-item-trigger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsPincodeOpen(prev => !prev);
                }}
                style={{ cursor: 'pointer' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '16px', height: '16px', marginRight: '4px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>
                  {pincode
                    ? (pincodeData?.areaName ? `${pincode} (${pincodeData.areaName})` : pincode)
                    : 'PINCODE'}
                </span>
              </a>
              <div className={`pincode-dropdown ${isPincodeOpen ? 'open' : ''}`} style={{ right: '0', left: 'auto' }}>
                <p className="pincode-dropdown-text">
                  Your PIN Code unlocks Fastest delivery date, Try-at-Home availability, Nearest store and In-store design!
                </p>
                <form onSubmit={handlePincodeSubmit} className="pincode-form">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={tempPincode}
                    onChange={(e) => setTempPincode(e.target.value)}
                    maxLength={6}
                    className="pincode-input"
                  />
                  <button type="submit" className="pincode-submit-btn" disabled={pincodeLoading}>
                    {pincodeLoading ? 'Checking...' : (pincode ? 'Change' : 'Apply')}
                  </button>
                </form>

                {pincodeError && (
                  <div style={{ color: '#d9534f', fontSize: '11px', marginTop: '6px' }}>
                    {pincodeError}
                  </div>
                )}

                {pincodeData && (
                  <div style={{
                    fontSize: '11px',
                    color: '#444',
                    backgroundColor: '#f9f6f0',
                    padding: '10px',
                    borderRadius: '6px',
                    marginTop: '8px',
                    border: '1px solid #ebdccb'
                  }}>
                    <div style={{ fontWeight: '700', color: '#231535', fontSize: '12px', marginBottom: '3px' }}>
                      📍 {pincodeData.areaName} ({pincodeData.pincode})
                    </div>
                    {pincodeData.district && (
                      <div style={{ color: '#555' }}>
                        <strong>District:</strong> {pincodeData.district}, {pincodeData.state}
                      </div>
                    )}
                    {pincodeData.lat !== null && pincodeData.lon !== null && (
                      <div style={{ color: '#777', marginTop: '4px', fontSize: '10px' }}>
                        🌐 <strong>Coords:</strong> Lat {pincodeData.lat?.toFixed(4)}, Lon {pincodeData.lon?.toFixed(4)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="icon-actions">

              {/* Profile Icon */}
              <div className="nav-item-container nav-profile-wrapper">
                <a
                  href="#profile"
                  className="action-link-icon nav-item-trigger"
                  aria-label="Profile"
                  title="My Profile"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user) {
                      setShowAuthModal(true);
                    } else {
                      window.history.pushState(null, '', '/profile');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </a>
              </div>

              {/* Gold Wallet Icon */}
              <div className="nav-item-container nav-wallet-wrapper">
                <a
                  href="#profile"
                  className="action-link-icon nav-item-trigger"
                  aria-label="Gold Wallet"
                  title="My Gold Wallet"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user) {
                      setShowAuthModal(true);
                    } else {
                      window.history.pushState(null, '', '/profile#wallet');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }
                  }}
                  style={{ cursor: 'pointer', color: '#c8a359' }}
                >
                  <Coins size={22} />
                </a>
              </div>

              {/* Wishlist */}
              <div className="nav-item-container nav-wishlist-wrapper">
                <a href="/wishlist" className="action-link-icon" aria-label="Wishlist">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {Object.values(wishlist).filter(Boolean).length > 0 && (
                    <span className="wishlist-badge">{Object.values(wishlist).filter(Boolean).length}</span>
                  )}
                </a>
              </div>

              {/* Cart */}
              <div className="nav-item-container nav-cart-wrapper">
                <a href="/cart" className="action-link-icon" aria-label="Shopping Bag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  {cartList.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                    <span className="cart-badge">{cartList.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Mobile Search Row (appears on second row on mobile viewport) */}
        <div ref={mobileSearchRef} className="mobile-search-row" style={{ position: 'relative' }}>
          <div className="search-bar-inline">
            <button className="search-trigger" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search for engagement rings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery ? (
              <button
                type="button"
                className="search-action-btn"
                title="Clear Search"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                  setSearchResults([]);
                }}
              >
                <X size={14} />
              </button>
            ) : (
              <div className="search-actions-inline">
                <button className="search-action-btn camera-search" title="Search by Image" aria-label="Search by Image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
                <button className="search-action-btn voice-search" title="Voice Search" aria-label="Voice Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
          {renderSearchResultsDropdown()}
        </div>

        {/* Bottom Tier: Category Links */}
        <div className="header-nav-row">
          <nav className="bottom-category-nav">
            <div className="nav-item-container">
              <a
                href="#gold-mine"
                className="nav-item-trigger gold-mine-nav-badge"
                onClick={(e) => {
                  e.preventDefault();
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    window.history.pushState(null, '', '/profile#wallet');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                  }
                }}
              >
                GOLD WALLET
              </a>
            </div>
            <div className="nav-item-container nav-gold-mine-link">
              <a
                href="/loose-stones"
                className="nav-item-trigger gold-mine-nav-badge"
                style={{ color: '#c5a880', fontWeight: '800' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', '/loose-stones');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                BUY STONES
              </a>
            </div>
            <div className="nav-item-container nav-gold-mine-link">
              <a
                href="/custom-name-pendant"
                className="nav-item-trigger gold-mine-nav-badge"
                style={{ color: '#b06000', fontWeight: '800' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, '', '/custom-name-pendant');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                ✨ CUSTOM PENDANT
              </a>
            </div>
            {categories
              .filter(cat => {
                const name = (cat.categoryName || '').toLowerCase().trim();
                return name !== "men's jewellery" &&
                  name !== "women's jewellery" &&
                  name !== "kids jewellery" &&
                  name !== "men" &&
                  name !== "women" &&
                  name !== "kids";
              })
              .map((cat, idx) => {
                const displayName = cat.categoryName || 'Collection';
                // Sanitize slug: strip special chars like & so #necklaces-pendants routes correctly
                const categorySlug = displayName.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .trim()
                  .replace(/\s+/g, '-');

                // Extract unique subcategories (case-insensitive deduplication)
                const subcategoriesMap = new Map();
                (cat.products || []).forEach(p => {
                  if (p.productSubCategory) {
                    const cleanSub = p.productSubCategory.trim();
                    const cleanSubLower = cleanSub.toLowerCase();
                    const catLower = displayName.toLowerCase();
                    if (cleanSub && cleanSubLower !== catLower && cleanSubLower !== `${catLower}s` && cleanSubLower !== `${catLower}es`) {
                      if (!subcategoriesMap.has(cleanSubLower)) {
                        subcategoriesMap.set(cleanSubLower, cleanSub);
                      }
                    }
                  }
                });
                const subcategories = Array.from(subcategoriesMap.values());

                // Extract unique genders
                const genders = [...new Set((cat.products || [])
                  .map(p => p.productgender)
                  .filter(Boolean))];

                // Pick two distinct banners matching the hovered category name
                const [banner1, banner2] = getCategoryBanners(displayName);

                return (
                  <div
                    key={idx}
                    className="nav-item-container"
                  >
                    <a href={`/${categorySlug}`} className="nav-item-trigger" onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', `/${categorySlug}`); window.dispatchEvent(new PopStateEvent('popstate')); }}>
                      {displayName}
                    </a>
                    <div className={`mega-dropdown ${disabledDropdown === categorySlug ? 'force-hide' : ''}`} style={{ top: `${headerHeight - 2}px` }}>
                      <div className="mega-dropdown-inner">
                        {/* Column 1: Subcategories */}
                        <div className="mega-column">
                          <h4>Styles & Subcategories</h4>
                          <ul>
                            <li>
                              <a
                                href={`/${categorySlug}`}
                                onClick={() => handleDropdownLinkClick(categorySlug)}
                              >
                                All {displayName}
                              </a>
                            </li>
                            {subcategories.map((sub, sIdx) => {
                              const subSlug = sub.toLowerCase().replace(/ /g, '-');
                              return (
                                <li key={sIdx}>
                                  <a
                                    href={`/${categorySlug}?subcategory=${subSlug}`}
                                    onClick={() => handleDropdownLinkClick(categorySlug)}
                                  >
                                    {sub}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>


                        {/* Column 3: By Price */}
                        <div className="mega-column mega-column-price">
                          <h4>By Price</h4>
                          <ul>
                            <li>
                              <a
                                href={`/${categorySlug}?maxPrice=10000`}
                                onClick={() => handleDropdownLinkClick(categorySlug)}
                              >
                                Under ₹ 10k
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/${categorySlug}?minPrice=10000&maxPrice=20000`}
                                onClick={() => handleDropdownLinkClick(categorySlug)}
                              >
                                ₹ 10k - ₹ 20k
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/${categorySlug}?minPrice=20000&maxPrice=30000`}
                                onClick={() => handleDropdownLinkClick(categorySlug)}
                              >
                                ₹ 20k - ₹ 30k
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/${categorySlug}?minPrice=30000&maxPrice=50000`}
                                onClick={() => handleDropdownLinkClick(categorySlug)}
                              >
                                ₹ 30k - ₹ 50k
                              </a>
                            </li>
                            <li>
                              <a
                                href={`/${categorySlug}?minPrice=50000`}
                                onClick={() => handleDropdownLinkClick(categorySlug)}
                              >
                                ₹ 50k & Above
                              </a>
                            </li>
                          </ul>
                        </div>

                        {/* Column 4: Banners */}
                        <div className="mega-banners">
                          <div className="mega-banner-card">
                            <img src={banner1} alt="Featured Collection" loading="lazy" decoding="async" width="300" height="150" />
                            <div className="banner-label">New Arrivals</div>
                          </div>
                        </div>

                        {/* Bottom Full-width Row: Demographic filters */}
                        <div className="mega-dropdown-footer" style={{ gridColumn: 'span 3', marginTop: '8px' }}>
                          <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            <a
                              href={`/${categorySlug}?gender=women`}
                              className="footer-pill-btn"
                              style={{ paddingRight: '20px', borderRight: '1.5px solid #d4c5bd', textDecoration: 'none', color: '#8c7365' }}
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              For Women
                            </a>
                            <a
                              href={`/${categorySlug}?gender=men`}
                              className="footer-pill-btn"
                              style={{ paddingLeft: '20px', paddingRight: '20px', borderRight: '1.5px solid #d4c5bd', textDecoration: 'none', color: '#8c7365' }}
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              For Men
                            </a>
                            <a
                              href={`/${categorySlug}?gender=kids`}
                              className="footer-pill-btn"
                              style={{ paddingLeft: '20px', textDecoration: 'none', color: '#8c7365' }}
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              For Kids
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </nav>
        </div>
      </header>

      {/* Digital Gold Modal */}
      {goldModalOpen && (
        <div className="gold-modal-overlay">
          <div className="gold-modal-container">
            <button className="gold-modal-close" onClick={() => setGoldModalOpen(false)} aria-label="Close modal">
              <X size={18} />
            </button>

            {goldActiveTab === 'menu' && (
              <div className="gold-menu-view">
                <h3>Zoniraz Digital Gold</h3>
                <p className="gold-subtitle">Invest, liquidate, or upgrade your gold securely in real-time.</p>
                <div className="gold-options-grid">
                  <div className="gold-option-card">
                    <div className="gold-icon-wrapper">
                      <Coins size={24} style={{ color: '#A98E73' }} />
                    </div>
                    <h4>Buy Gold</h4>
                    <p>Purchase 24KT pure gold starting from just ₹100.</p>
                    <button className="gold-action-btn" onClick={() => { setGoldModalOpen(false); window.location.hash = 'buy-gold'; }}>Buy Gold</button>
                  </div>
                  <div className="gold-option-card">
                    <div className="gold-icon-wrapper">
                      <TrendingDown size={24} style={{ color: '#A98E73' }} />
                    </div>
                    <h4>Sell Old Gold</h4>
                    <p>Sell your physical old gold ornaments at best market rates.</p>
                    <button className="gold-action-btn" onClick={() => { setGoldModalOpen(false); window.location.hash = 'sell-gold'; }}>Sell Old Gold</button>
                  </div>
                  <div className="gold-option-card">
                    <div className="gold-icon-wrapper">
                      <RefreshCw size={24} style={{ color: '#A98E73' }} />
                    </div>
                    <h4>Exchange Old Gold</h4>
                    <p>Convert your physical old gold ornaments into pure digital gold credits.</p>
                    <button className="gold-action-btn" onClick={() => setGoldActiveTab('exchange')}>Exchange Gold</button>
                  </div>
                  <div className="gold-option-card" style={{ borderColor: '#E5C158', background: '#fffef9' }}>
                    <div className="gold-icon-wrapper" style={{ background: '#fdfbf7' }}>
                      <Sparkles size={24} style={{ color: '#E5C158' }} />
                    </div>
                    <h4 style={{ color: '#231535' }}>10+1 Savings Plan</h4>
                    <p>Pay 10 installments and get 11th Month 100% FREE from Zoniraz.</p>
                    <button className="gold-action-btn" style={{ background: '#231535', color: '#fff' }} onClick={() => { setGoldModalOpen(false); window.location.hash = 'gold-mine'; }}>Explore 10+1 Plan</button>
                  </div>
                </div>
              </div>
            )}

            {goldActiveTab === 'buy' && (
              <div className="gold-tab-view">
                <button className="gold-back-btn" onClick={() => setGoldActiveTab('menu')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back
                </button>
                <h3>Buy Gold</h3>
                <p className="gold-rate-ticker">Live buying rate: <strong>₹7,345/gm</strong> (inclusive of GST)</p>
                <form className="gold-portal-form" onSubmit={(e) => { e.preventDefault(); alert('Gold purchased successfully!'); setGoldModalOpen(false); }}>
                  <div className="form-group">
                    <label>Amount in Rupees (₹)</label>
                    <input type="number" placeholder="Enter amount (e.g. 5000)" required min="100" />
                  </div>
                  <div className="form-group-or">or</div>
                  <div className="form-group">
                    <label>Weight in Grams (gm)</label>
                    <input type="number" step="0.0001" placeholder="Enter weight (e.g. 0.5)" />
                  </div>
                  <button type="submit" className="gold-submit-btn">Proceed to Buy</button>
                </form>
              </div>
            )}

            {goldActiveTab === 'sell' && (
              <div className="gold-tab-view">
                <button className="gold-back-btn" onClick={() => setGoldActiveTab('menu')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back
                </button>
                <h3>Sell Old Gold</h3>
                <p className="gold-rate-ticker">Live selling rate: <strong>₹7,120/gm</strong></p>
                <form className="gold-portal-form" onSubmit={(e) => { e.preventDefault(); alert('Gold sold successfully!'); setGoldModalOpen(false); }}>
                  <div className="form-group">
                    <label>Weight to Sell (gm)</label>
                    <input type="number" step="0.0001" placeholder="Enter weight in grams" required />
                  </div>
                  <button type="submit" className="gold-submit-btn">Proceed to Sell</button>
                </form>
              </div>
            )}

            {goldActiveTab === 'exchange' && (
              <div className="gold-tab-view">
                <button className="gold-back-btn" onClick={() => setGoldActiveTab('menu')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back
                </button>
                <h3>Exchange Old Gold</h3>
                <p className="gold-rate-ticker">Estimated exchange valuation rate: <strong>₹6,980/gm</strong></p>
                <form className="gold-portal-form" onSubmit={(e) => { e.preventDefault(); alert('Exchange query submitted! Visit nearest store.'); setGoldModalOpen(false); }}>
                  <div className="form-group">
                    <label>Ornaments Description</label>
                    <input type="text" placeholder="e.g. Old necklace, Gold chain" required />
                  </div>
                  <div className="form-group">
                    <label>Approximate Weight (gm)</label>
                    <input type="number" step="0.01" placeholder="Enter estimated weight" required />
                  </div>
                  <div className="form-group">
                    <label>Purity Standard</label>
                    <select required style={{ width: '100%', padding: '10px', border: '1.5px solid var(--color-border-light)', borderRadius: '2px', backgroundColor: 'white' }}>
                      <option value="22kt">22KT Gold (91.6% Pure)</option>
                      <option value="18kt">18KT Gold (75.0% Pure)</option>
                      <option value="14kt">14KT Gold (58.5% Pure)</option>
                    </select>
                  </div>
                  <button type="submit" className="gold-submit-btn">Request Exchange Value</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>

            {/* Header: Close Button & Quick Utilities */}
            <div className="drawer-header-row">
              <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                ✕
              </button>

              <div className="drawer-quick-actions">
                <a href="#profile" className="drawer-action-box" onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    window.history.pushState(null, '', '/profile#wallet');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                  }
                }}>
                  <span className="box-icon">💰</span>
                  <span className="box-label">Wallet</span>
                </a>

                <a href="#delivery-stores" className="drawer-action-box" onClick={() => setMobileMenuOpen(false)}>
                  <span className="box-icon">🏪</span>
                  <span className="box-label">Stores</span>
                </a>

                <a href="#digital-gold" className="drawer-action-box" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setGoldModalOpen(true); setGoldActiveTab('menu'); }}>
                  <span className="box-icon">🪙</span>
                  <span className="box-label">Gold</span>
                </a>

                <div className="drawer-action-box flag-box">
                  <span className="flag-icon">🇮🇳</span>
                  <span className="box-label">ENG</span>
                </div>
              </div>
            </div>

            {/* Middle: Category list with arrows */}
            <div className="drawer-categories-list">
              {[
                { name: "Gold Wallet (10+1 Scheme)", desc: "View accumulated 24K gold balance & passbook", hash: "/profile#wallet", img: null },
                { name: "Rings", desc: "Browse by Style, Metals & Stones", hash: "/rings", img: heartFusionRingImg },
                { name: "Earrings", desc: "Browse by Style, Price & More..", hash: "/earrings", img: goldEarringsBannerImg },
                { name: "Bracelets & Bangles", desc: "Browse by Style, Metal & Kids", hash: "/bracelets", img: stretchableBanglesImg },
                { name: "Solitaires", desc: "For Engagement, Anniversaries & Milestones", hash: "/solitaires", img: solitaireSetsImg },
                { name: "Mangalsutras", desc: "Browse by neckwear, bracelets & more", hash: "/mangalsutras", img: trendyMangalsutrasImg },
                { name: "Necklaces & Pendants", desc: "Browse by Style, Metal & Price", hash: "/necklaces", img: infinityNecklacesImg },
                { name: "Silver Collection", desc: "Sterling silver collection", hash: "/silver", img: silverEarringsImg },
                { name: "Gifting", desc: "For All Relationships & Occasions", hash: "/gifting", img: giftsForMomImg },
                { name: "Trending", desc: "Most loved designs", hash: "/trending", img: gulnaaraImg }
              ].map((category, idx) => (
                <a
                  key={idx}
                  href={category.hash}
                  className="drawer-category-item"
                  onClick={(e) => {
                    if (category.name.includes("Gold Wallet")) {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      if (!user) {
                        setShowAuthModal(true);
                      } else {
                        window.history.pushState(null, '', '/profile#wallet');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        window.dispatchEvent(new HashChangeEvent('hashchange'));
                      }
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <div className="drawer-item-left-content">
                    {category.img && <img src={category.img} alt={category.name} className="drawer-category-icon-img" loading="lazy" decoding="async" width="24" height="24" />}
                    <div className="category-meta">
                      <span className="category-name">{category.name}</span>
                      <span className="category-desc">{category.desc}</span>
                    </div>
                  </div>
                  <span className="category-arrow">›</span>
                </a>
              ))}

              {/* OUR STORY & Auth Buttons moved directly under Trending button */}
              <div className="drawer-inline-footer" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <a href="/about" className="drawer-story-link" onClick={() => setMobileMenuOpen(false)}>
                  OUR STORY
                </a>
                <a href="/franchise" className="drawer-story-link" onClick={() => setMobileMenuOpen(false)}>
                  FRANCHISE
                </a>
                <div className="drawer-auth-buttons">
                  {user ? (
                    <button
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                      className="drawer-btn login"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'block', width: '100%' }}
                    >
                      LOG OUT
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => { setMobileMenuOpen(false); setAuthModalInitialTab('login'); setShowAuthModal(true); }}
                        className="drawer-btn login"
                      >
                        LOGIN
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); setAuthModalInitialTab('signup'); setShowAuthModal(true); }}
                        className="drawer-btn signup"
                      >
                        SIGN UP
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab={authModalInitialTab}
      />
    </>
  );
}
