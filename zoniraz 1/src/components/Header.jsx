import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import AuthModal from './AuthModal';
import { Coins, TrendingDown, RefreshCw, X, ArrowLeft } from 'lucide-react';
import messageBandsImg from '../assets/message-bands.png';
import postcardsBannerImg from '../assets/postcards-banner.png';
import switchEarringsImg from '../assets/switch-earrings.png';
import dancingHoopsImg from '../assets/dancing-hoops.png';
import stretchableBanglesImg from '../assets/stretchable-bangles.png';
import watchCharmsImg from '../assets/watch-charms.png';
import solitaireSetsImg from '../assets/solitaire-sets.png';
import gulnaaraImg from '../assets/gulnaara.png';
import mangalsutraEarringsImg from '../assets/mangalsutra-earrings.png';
import trendyMangalsutrasImg from '../assets/trendy-mangalsutras.webp';
import layeredNecklacesImg from '../assets/layered-necklaces.png';
import infinityNecklacesImg from '../assets/infinity-necklaces.png';
import silverEarringsImg from '../assets/silver-earrings.png';
import silverNecklacesImg from '../assets/silver-necklaces.png';
import silverBraceletsImg from '../assets/silver-bracelets.png';
import silverRingsImg from '../assets/silver-rings.png';
import giftCardsImg from '../assets/gift-cards.png';
import wearYourWinsImg from '../assets/wear-your-wins.png';
import caratlaneIconicsImg from '../assets/caratlane-iconics.png';
import customerFavouritesImg from '../assets/customer-favourites.png';
import nineKtImg from '../assets/nine-kt.png';
import mensPlatinumImg from '../assets/mens-platinum.png';
import anekaImg from '../assets/aneka.png';
import giftsForMomImg from '../assets/gifts-for-mom.png';
import { products } from '../data/products';

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
  
  if (cat.includes('pendant') || cat.includes('necklace')) {
    return [layeredNecklacesImg, infinityNecklacesImg];
  }
  if (cat.includes('ring')) {
    return [silverRingsImg, messageBandsImg];
  }
  if (cat.includes('earring')) {
    return [silverEarringsImg, switchEarringsImg];
  }
  if (cat.includes('solitaire')) {
    return [solitaireSetsImg, silverRingsImg];
  }
  if (cat.includes('chain')) {
    return [silverNecklacesImg, layeredNecklacesImg];
  }
  if (cat.includes('mangalsutra')) {
    return [trendyMangalsutrasImg, mangalsutraEarringsImg];
  }
  if (cat.includes('nose')) {
    return [solitaireSetsImg, switchEarringsImg];
  }
  if (cat.includes('bangle') || cat.includes('bracelet') || cat.includes('bangles')) {
    return [stretchableBanglesImg, silverBraceletsImg];
  }
  if (cat.includes('zodic') || cat.includes('zodiac')) {
    return [postcardsBannerImg, wearYourWinsImg];
  }
  
  // Fallbacks
  return [customerFavouritesImg, caratlaneIconicsImg];
}

export default function Header({ wishlist = {}, setWishlist, cart = {}, setCart }) {
  const { user, token, logout } = useContext(AuthContext);
  const { cartList } = useContext(CartContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login');
  const [pincode, setPincode] = useState('');
  const [tempPincode, setTempPincode] = useState('');
  const [goldModalOpen, setGoldModalOpen] = useState(false);
  const [goldActiveTab, setGoldActiveTab] = useState('menu'); // 'menu' | 'buy' | 'sell' | 'exchange'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [disabledDropdown, setDisabledDropdown] = useState(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(145);

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
    fetch('http://localhost:55000/api/userSide/GetNavbar')
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

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    setPincode(tempPincode);
  };

  return (
    <>
      <header ref={headerRef} className={`jaypore-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Top Bar matching Candere style */}
      <div className="header-top-bar desktop-only-util">
        <div className="top-bar-left">
          <a href="#digital-gold" className="top-bar-link" onClick={(e) => { e.preventDefault(); setGoldModalOpen(true); setGoldActiveTab('menu'); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="top-bar-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8M8 12h8"></path>
            </svg>
            BUY DIGITAL GOLD
          </a>
        </div>
      </div>

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
        <div className="header-left-search desktop-only-util">
          <div className="search-bar-capsule">
            <input type="text" placeholder="Search for Minimalist Jewellery..." />
            <button className="search-capsule-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Center: Brand Logo */}
        <div className="header-brand">
          <a href="#" className="brand-logo-text">
            <img src="/zoni.png" alt="Zoniraz Logo" className="header-brand-logo-img" />
          </a>
        </div>

        {/* Right Side: Pincode + Icon Actions */}
        <div className="header-right-actions">
          {/* Pincode Selector */}
          <div className="nav-item-container nav-pincode-wrapper desktop-only-util">
            <a href="#delivery-stores" className="utility-item nav-item-trigger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '16px', height: '16px', marginRight: '4px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{pincode ? pincode : 'PINCODE'}</span>
            </a>
            <div className="pincode-dropdown" style={{ right: '0', left: 'auto' }}>
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
                <button type="submit" className="pincode-submit-btn">
                  {pincode ? 'Change' : 'Apply'}
                </button>
              </form>
            </div>
          </div>

          <div className="icon-actions">

            {/* Profile Dropdown */}
            <div className="nav-item-container nav-profile-wrapper">
              <a
                href="#profile"
                className="action-link-icon nav-item-trigger"
                aria-label="Profile"
                onClick={(e) => {
                  if (!token && !user) {
                    e.preventDefault();
                    setShowAuthModal(true);
                  }
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>
              <div className="profile-dropdown" style={{ right: 0 }}>
                {token || user ? (
                  <>
                    <h4 style={{ textTransform: 'none' }}>Hello, {user ? user.firstName : 'Valued Customer'}!</h4>
                    <p className="profile-dropdown-subtitle">Manage profile, addresses & orders.</p>
                    <div className="profile-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a href="#profile" className="profile-signup-btn" style={{ textAlign: 'center' }}>My Dashboard</a>
                      <button
                        onClick={logout}
                        className="profile-login-btn"
                        style={{ border: '1px solid #d4c5bd', background: 'none', cursor: 'pointer', padding: '10px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#2b221d', display: 'block', width: '100%', borderRadius: '2px', textAlign: 'center' }}
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4>Your Account</h4>
                    <p className="profile-dropdown-subtitle">Access account & manage your orders.</p>
                    <div className="profile-actions-stack">
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="profile-signup-btn"
                        style={{ border: '1px solid #2b221d', background: 'none', color: '#2b221d', cursor: 'pointer', padding: '12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', width: '100%', borderRadius: '2px', display: 'block', textAlign: 'center' }}
                      >
                        Sign In / Register
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist */}
            <div className="nav-item-container nav-wishlist-wrapper">
              <a href="#wishlist" className="action-link-icon" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {Object.keys(wishlist).length > 0 && (
                  <span className="wishlist-badge">{Object.keys(wishlist).length}</span>
                )}
              </a>
            </div>

            {/* Cart */}
            <div className="nav-item-container nav-cart-wrapper">
              <a href="#cart" className="action-link-icon" aria-label="Shopping Bag">
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
      <div className="mobile-search-row">
        <div className="search-bar-inline">
          <button className="search-trigger" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input type="text" placeholder="Search for engagement rings" />
          <div className="search-actions-inline">
            <button className="search-action-btn camera-search" title="Search by Image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
            <button className="search-action-btn voice-search" title="Voice Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Category Links */}
      <div className="header-nav-row">
        <nav className="bottom-category-nav">
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

              // Extract unique subcategories
              const subcategories = [...new Set((cat.products || [])
                .map(p => p.productSubCategory)
                .filter(Boolean))];

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
                  <a href={`#${categorySlug}`} className="nav-item-trigger" onClick={() => handleCategoryTriggerClick(categorySlug)}>
                    {displayName}
                  </a>
                  <div className={`mega-dropdown ${disabledDropdown === categorySlug ? 'force-hide' : ''}`} style={{ top: `${headerHeight}px` }}>
                    <div className="mega-dropdown-inner">
                      {/* Column 1: Subcategories */}
                      <div className="mega-column">
                        <h4>Styles & Subcategories</h4>
                        <ul>
                          <li>
                            <a 
                              href={`#${categorySlug}`} 
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
                                  href={`#${categorySlug}?subcategory=${subSlug}`} 
                                  onClick={() => handleDropdownLinkClick(categorySlug)}
                                >
                                  {sub}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Column 2: Metal & Stone */}
                      <div className="mega-column">
                        <h4>By Metal & Stone</h4>
                        <ul className="metal-stone-list">
                          <li>
                            <span className="dot dot-diamond"></span>
                            <a 
                              href={`#${categorySlug}?stone=diamond`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              Diamond
                            </a>
                          </li>
                          <li>
                            <span className="dot dot-gold"></span>
                            <a 
                              href={`#${categorySlug}?metal=gold`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              Gold
                            </a>
                          </li>
                          <li>
                            <span className="dot dot-rose-gold"></span>
                            <a 
                              href={`#${categorySlug}?metal=rose-gold`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              Rose Gold
                            </a>
                          </li>
                          <li>
                            <span className="dot dot-yellow-gold"></span>
                            <a 
                              href={`#${categorySlug}?metal=yellow-gold`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              Yellow Gold
                            </a>
                          </li>
                          <li>
                            <span className="dot dot-white-gold"></span>
                            <a 
                              href={`#${categorySlug}?metal=white-gold`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              White Gold
                            </a>
                          </li>
                          <li>
                            <span className="dot dot-platinum"></span>
                            <a 
                              href={`#${categorySlug}?metal=platinum`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              Platinum
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Column 3: By Price */}
                      <div className="mega-column">
                        <h4>By Price</h4>
                        <ul>
                          <li>
                            <a 
                              href={`#${categorySlug}?maxPrice=10000`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              Under ₹ 10k
                            </a>
                          </li>
                          <li>
                            <a 
                              href={`#${categorySlug}?minPrice=10000&maxPrice=20000`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              ₹ 10k - ₹ 20k
                            </a>
                          </li>
                          <li>
                            <a 
                              href={`#${categorySlug}?minPrice=20000&maxPrice=30000`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              ₹ 20k - ₹ 30k
                            </a>
                          </li>
                          <li>
                            <a 
                              href={`#${categorySlug}?minPrice=30000&maxPrice=50000`} 
                              onClick={() => handleDropdownLinkClick(categorySlug)}
                            >
                              ₹ 30k - ₹ 50k
                            </a>
                          </li>
                          <li>
                            <a 
                              href={`#${categorySlug}?minPrice=50000`} 
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
                          <img src={banner1} alt="Featured Collection" />
                          <div className="banner-label">New Arrivals</div>
                        </div>
                        <div className="mega-banner-card">
                          <img src={banner2} alt="Special Edition" />
                          <div className="banner-label">Shop Bestsellers</div>
                        </div>
                      </div>

                      {/* Bottom Full-width Row: Demographic filters */}
                      <div className="mega-dropdown-footer" style={{ gridColumn: 'span 5', marginTop: '15px' }}>
                        <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          <a 
                            href={`#${categorySlug}?gender=women`} 
                            className="footer-pill-btn" 
                            style={{ paddingRight: '20px', borderRight: '1.5px solid #d4c5bd', textDecoration: 'none', color: '#8c7365' }} 
                            onClick={() => handleDropdownLinkClick(categorySlug)}
                          >
                            For Women
                          </a>
                          <a 
                            href={`#${categorySlug}?gender=men`} 
                            className="footer-pill-btn" 
                            style={{ paddingLeft: '20px', paddingRight: '20px', borderRight: '1.5px solid #d4c5bd', textDecoration: 'none', color: '#8c7365' }} 
                            onClick={() => handleDropdownLinkClick(categorySlug)}
                          >
                            For Men
                          </a>
                          <a 
                            href={`#${categorySlug}?gender=kids`} 
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
            <button className="gold-modal-close" onClick={() => setGoldModalOpen(false)}>
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
                    <button className="gold-action-btn" onClick={() => setGoldActiveTab('buy')}>Buy Gold</button>
                  </div>
                  <div className="gold-option-card">
                    <div className="gold-icon-wrapper">
                      <TrendingDown size={24} style={{ color: '#A98E73' }} />
                    </div>
                    <h4>Sell Gold</h4>
                    <p>Sell your stored gold balance instantly at real-time rates.</p>
                    <button className="gold-action-btn" onClick={() => setGoldActiveTab('sell')}>Sell Gold</button>
                  </div>
                  <div className="gold-option-card">
                    <div className="gold-icon-wrapper">
                      <RefreshCw size={24} style={{ color: '#A98E73' }} />
                    </div>
                    <h4>Exchange Old Gold</h4>
                    <p>Convert your physical old gold ornaments into pure digital gold credits.</p>
                    <button className="gold-action-btn" onClick={() => setGoldActiveTab('exchange')}>Exchange Gold</button>
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
                <h3>Sell Gold</h3>
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
              <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>
                ✕
              </button>

              <div className="drawer-quick-actions">
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
                { name: "Rings", desc: "Browse by Style, Metals & Stones", hash: "#rings", img: silverRingsImg },
                { name: "Earrings", desc: "Browse by Style, Price & More..", hash: "#earrings", img: dancingHoopsImg },
                { name: "Bracelets & Bangles", desc: "Browse by Style, Metal & Kids", hash: "#bracelets", img: stretchableBanglesImg },
                { name: "Solitaires", desc: "For Engagement, Anniversaries & Milestones", hash: "#solitaires", img: solitaireSetsImg },
                { name: "Mangalsutras", desc: "Browse by neckwear, bracelets & more", hash: "#mangalsutras", img: trendyMangalsutrasImg },
                { name: "Necklaces & Pendants", desc: "Browse by Style, Metal & Price", hash: "#necklaces", img: infinityNecklacesImg },
                { name: "Silver by Shaya", desc: "Sterling silver collection", hash: "#silver", img: silverEarringsImg },
                { name: "Gifting", desc: "For All Relationships & Occasions", hash: "#gifting", img: giftsForMomImg },
                { name: "Trending", desc: "Most loved designs", hash: "#trending", img: gulnaaraImg }
              ].map((category, idx) => (
                <a
                  key={idx}
                  href={category.hash}
                  className="drawer-category-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="drawer-item-left-content">
                    {category.img && <img src={category.img} alt={category.name} className="drawer-category-icon-img" />}
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
                <a href="#our-story" className="drawer-story-link" onClick={() => setMobileMenuOpen(false)}>
                  OUR STORY
                </a>
                <a href="#franchise" className="drawer-story-link" onClick={() => setMobileMenuOpen(false)}>
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
