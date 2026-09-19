import React, { useState, useEffect, useContext, useMemo } from 'react';
import { API_BASE_URL, getUploadsUrl } from '../config';
import { cachedFetch } from '../utils/apiCache';
import { matchesSubcategoryOrCollection } from './CategoryPage';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const collectionBanner = "https://media.zoniraz.com/uploads/zoniraz_frontend/collection-banner-1.png";

// Curated Master Configuration of Subcategory Sections
const SUB_CATEGORIES_CONFIG = [
  {
    id: 'office',
    title: 'Office Wear Jewellery',
    label: 'ELEGANT WORKWEAR',
    category: 'Rings',
    href: '/rings?subcategory=office-wear',
    description: 'Chic, minimalistic, and sophisticated fine jewellery designed for boardroom and everyday professional elegance.'
  },
  {
    id: 'solitaire',
    title: 'Solitaire Dream',
    label: 'FINE JEWELLERY',
    category: 'Rings',
    href: '/rings?subcategory=solitaire',
    description: 'Certified solitaire rings and jewels featuring brilliant round and princess cuts that capture the light.'
  },
  {
    id: 'bridal',
    title: 'Bridal & Engagement Collection',
    label: 'ROYAL SIGNATURE',
    category: 'Rings',
    href: '/rings?subcategory=bridal',
    description: 'Breathtaking engagement rings and bridal masterpieces created to celebrate lifelong love and timeless vows.'
  },
  {
    id: 'everyday',
    title: 'Everyday Wear',
    label: 'LIFESTYLE ESSENTIALS',
    category: 'Rings',
    href: '/rings?subcategory=everyday',
    description: 'Effortless, durable, and comfortable everyday designs made to shine effortlessly with your daily outfits.'
  },
  {
    id: 'heritage',
    title: 'Heritage Gold & Classics',
    label: 'CLASSIC TIMELESS',
    category: 'Rings',
    href: '/rings?subcategory=heritage',
    description: 'Traditional craftsmanship celebrating royal Indian heritage, sacred symbols, and warm yellow gold.'
  },
  {
    id: 'band-rings',
    title: 'Band Rings',
    label: 'TIMELESS BANDS',
    category: 'Rings',
    href: '/rings?subcategory=band-rings',
    description: 'Sleek diamond bands and plain gold bands perfect for stacking or wearing as single understated statements.'
  },
  {
    id: 'stud-earrings',
    title: 'Stud Earrings',
    label: 'DAINTY LUXURY',
    category: 'Earrings',
    href: '/earrings?subcategory=stud-earrings',
    description: 'Sparkling diamond studs and cluster floral designs that frame your face with subtle luxury.'
  },
  {
    id: 'drop-earrings',
    title: 'Drop & Dangler Earrings',
    label: 'GRACEFUL SILHOUETTES',
    category: 'Earrings',
    href: '/earrings?subcategory=drop-earrings',
    description: 'Gracefully elongated drop and dangler silhouettes designed to shimmer with every movement.'
  },
  {
    id: 'love-heart',
    title: 'Love & Heart Collection',
    label: 'ROMANTIC EXPRESSIONS',
    category: 'Rings',
    href: '/rings?subcategory=love-heart',
    description: 'Sweet heart silhouettes, intertwined eternity rings, and romantic charms expressing pure affection.'
  },
  {
    id: 'religious',
    title: 'Religious & Spiritual Pendants',
    label: 'DIVINE BLESSINGS',
    category: 'Pendants',
    href: '/pendants?subcategory=religious',
    description: 'Sacred om, ganesha, and religious icons crafted in lustrous gold and brilliant diamond accents.'
  },
  {
    id: 'couple-bands',
    title: 'Couple Bands',
    label: 'ETERNAL BONDS',
    category: 'Rings',
    href: '/rings?subcategory=couple-bands',
    description: 'Harmonious matching designs created for couples to signify harmony, commitment, and union.'
  },
  {
    id: 'zodiac',
    title: 'Zodiac & Celestial Pendants',
    label: 'ASTROLOGICAL CHARMS',
    category: 'Pendants',
    href: '/pendants?subcategory=zodiac',
    description: 'Your star sign captured in radiant diamonds and gold—a personal talisman of strength and destiny.'
  },
  {
    id: 'cocktail',
    title: 'Cocktail Statement Rings',
    label: 'DRAMATIC STATEMENTS',
    category: 'Rings',
    href: '/rings?subcategory=cocktail',
    description: 'Bold, head-turning statement rings featuring dramatic clusters and elevated high-fashion designs.'
  },
  {
    id: 'danglers',
    title: 'Danglers',
    label: 'SHIMMERING EVENINGS',
    category: 'Earrings',
    href: '/earrings?subcategory=danglers',
    description: 'Intricate drop danglers crafted to elevate festive evenings and glamorous gatherings.'
  },
  {
    id: 'for-kids',
    title: 'Kids Jewellery',
    label: 'GENTLE & PLAYFUL',
    category: 'Earrings',
    href: '/earrings?subcategory=for-kids',
    description: 'Delicate, skin-safe lightweight jewellery crafted for younger ones with cheerful charm.'
  },
  {
    id: 'elegant-diamond',
    title: 'Diamond Nose Pins',
    label: 'TRADITIONAL CHARM',
    category: 'Nose Pins',
    href: '/nose-pin?subcategory=elegant-diamond',
    description: 'Classic floral, solitaire, and prong-set diamond nose pins capturing quintessential Indian beauty.'
  },
  {
    id: 'initial',
    title: 'Initial & Letter Pendants',
    label: 'PERSONALIZED LUXURY',
    category: 'Pendants',
    href: '/pendants?subcategory=initial',
    description: 'Custom alphabet letter pendants crafted in shimmering diamonds—an ideal personal gift.'
  },
  {
    id: 'jersey-number',
    title: 'Jersey Number Pendants',
    label: 'LUCKY NUMBERS',
    category: 'Pendants',
    href: '/pendants?subcategory=jersey-number',
    description: 'Your favorite jersey or lucky numbers highlighted with brilliant pave-set diamonds.'
  },
  {
    id: 'colour-stone',
    title: 'Colour Stone & Gemstones',
    label: 'VIBRANT HUES',
    category: 'Pendants',
    href: '/pendants?subcategory=colour-stone',
    description: 'Vibrant natural emeralds, rubies, and sapphires set beside shimmering diamonds.'
  }
];

export default function AllCollectionsPage({ products = [], wishlist = {}, setWishlist, cart = {}, setCart }) {
  const { addToCart } = useContext(CartContext) || {};
  const { requireAuth } = useContext(AuthContext) || {};
  const { formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}` } = useCurrency();

  const [activeTab, setActiveTab] = useState('all');
  const [catalogProducts, setCatalogProducts] = useState(products || []);
  const [loading, setLoading] = useState(!products || products.length === 0);

  // Sync external products or fetch if missing
  useEffect(() => {
    if (products && products.length > 0) {
      setCatalogProducts(products);
      setLoading(false);
      return;
    }

    cachedFetch(`${API_BASE_URL}/api/admin/products`)
      .then(res => {
        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(p => {
            const id = p._id || p.product_id;
            const name = p.product_title || p.name || 'Fine Jewellery';
            const price = Number(p.price) || Number(p.basePrice) || 0;
            const discount = Number(p.discount) || 0;
            let subcategory = p.product_subcategory || p.productSubCategory || p.subcategory || '';
            let image = p.images?.[0] || '';
            if (p.gallery) {
              try {
                const parsed = typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery;
                if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
                else if (typeof parsed === 'object' && parsed !== null) {
                  const firstKey = Object.keys(parsed)[0];
                  if (firstKey && parsed[firstKey]) {
                    image = Array.isArray(parsed[firstKey]) ? parsed[firstKey][0] : parsed[firstKey];
                  }
                }
              } catch (e) {}
            }
            if (image && !image.startsWith('http') && !image.startsWith('/images/')) {
              image = getUploadsUrl(image);
            }
            return {
              id,
              name,
              price,
              originalPrice: price + discount,
              image: image || 'https://placehold.co/400x400?text=Jewellery',
              category: p.product_category || p.category || 'Rings',
              subcategory,
              product_slug: p.product_slug || p.slug || id
            };
          });
          setCatalogProducts(mapped);
        }
      })
      .catch(err => console.error('Error loading collections catalog:', err))
      .finally(() => setLoading(false));
  }, [products]);

  // Build section models with matching products and counts
  const sections = useMemo(() => {
    if (!catalogProducts || catalogProducts.length === 0) return [];

    return SUB_CATEGORIES_CONFIG.map(config => {
      const matched = catalogProducts.filter(p => matchesSubcategoryOrCollection(p, config.id));
      return {
        ...config,
        count: matched.length,
        products: matched.slice(0, 4) // Show 4 products per subcategory section
      };
    }).filter(sec => sec.count > 0);
  }, [catalogProducts]);

  const toggleWishlist = (id) => {
    const apply = () => {
      if (setWishlist) {
        setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
      }
    };
    if (requireAuth) requireAuth(apply);
    else apply();
  };

  const handleNavigate = (href) => {
    window.history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleProductClick = (product) => {
    const slug = product.product_slug || product.slug || product.id;
    const currentKey = (window.location.pathname + window.location.search).toLowerCase();
    sessionStorage.setItem('scroll_pos_' + currentKey, String(window.scrollY));
    window.history.pushState(null, '', `/product/${slug}`);
    window.dispatchEvent(new CustomEvent('app-navigate', { detail: { isPopState: false } }));
  };

  const scrollToSection = (secId) => {
    setActiveTab(secId);
    if (secId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(`subcat-section-${secId}`);
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="collections-page-wrapper">
      {/* Clean Full-Width Responsive Hero Banner (Zero Overlapping Text) */}
      <div className="collections-page-hero-wrapper">
        <img 
          src={collectionBanner} 
          alt="Our Jewellery Collection - Luxury in Every Detail" 
          className="collections-hero-img"
          loading="eager"
        />
      </div>

      {/* Sticky Subcategory Jump Navigation Bar */}
      {sections.length > 0 && (
        <div className="collections-pills-bar-container">
          <div className="collections-pills-bar">
            <button
              className={`collection-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => scrollToSection('all')}
            >
              All Categories ({sections.reduce((acc, s) => acc + s.count, 0)})
            </button>
            {sections.map(sec => (
              <button
                key={sec.id}
                className={`collection-pill ${activeTab === sec.id ? 'active' : ''}`}
                onClick={() => scrollToSection(sec.id)}
              >
                {sec.title} ({sec.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="collections-main-content">
        {loading ? (
          <div className="collections-spinner-wrap">
            <div className="collections-spinner" />
            <p>Curating subcategories & designs...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="collections-empty-wrap">
            <p>No collection items available at this time.</p>
          </div>
        ) : (
          <div className="subcategories-sections-container">
            {sections.map((section) => (
              <section 
                key={section.id} 
                id={`subcat-section-${section.id}`} 
                className="subcat-section-block"
              >
                {/* Section Header with Title, Count & Arrow Button */}
                <div className="subcat-section-header">
                  <div className="subcat-header-left">
                    <span className="subcat-badge-label">{section.label}</span>
                    <div className="subcat-title-row">
                      <h2 className="subcat-title-text">{section.title}</h2>
                      <span className="subcat-count-pill">{section.count} Designs</span>
                    </div>
                    {section.description && (
                      <p className="subcat-desc-text">{section.description}</p>
                    )}
                  </div>

                  {/* Arrow Button to Open Full Subcategory Page */}
                  <div className="subcat-header-right">
                    <a
                      href={section.href}
                      className="subcat-arrow-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(section.href);
                      }}
                      title={`View all ${section.count} designs in ${section.title}`}
                    >
                      <span className="arrow-btn-text">View All ({section.count})</span>
                      <div className="arrow-circle-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>

                {/* 4 Products in a Row Grid (Desktop 4, Mobile 2x2) */}
                <div className="subcat-products-grid">
                  {section.products.map(product => {
                    const isWishlisted = !!wishlist[product.id];
                    return (
                      <article
                        key={product.id}
                        className="subcat-card-item"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="subcat-card-image-box">
                          <img
                            src={product.image || product.images?.[0] || 'https://placehold.co/400x400?text=Jewellery'}
                            alt={product.name}
                            className="subcat-card-image"
                            loading="lazy"
                            width="300"
                            height="300"
                          />
                          <button
                            type="button"
                            className={`subcat-card-wishlist ${isWishlisted ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            aria-label="Add to wishlist"
                          >
                            <svg viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                        </div>

                        <div className="subcat-card-content">
                          <div className="subcat-card-prices">
                            <span className="price-main">{formatPrice(product.price)}</span>
                            {product.originalPrice > product.price && (
                              <span className="price-strike">{formatPrice(product.originalPrice)}</span>
                            )}
                            {product.originalPrice > product.price && (
                              <span className="price-off">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </div>

                          <h3 className="subcat-product-name" title={product.name}>
                            {product.name}
                          </h3>

                          <div className="subcat-card-actions" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              className="subcat-add-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (addToCart) addToCart(product, 1);
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '13px', height: '13px' }}>
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                              </svg>
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Component Styles with Full Mobile & Desktop Responsiveness */}
      <style>{`
        .collections-page-wrapper {
          background-color: #efe7e5;
          min-height: 100vh;
          padding-bottom: 90px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* Responsive Hero Banner Image without Overlapping Text */
        .collections-page-hero-wrapper {
          width: 100%;
          max-height: 280px;
          position: relative;
          background: #2b221d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .collections-hero-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* Sticky Horizontal Subcategories Jump Bar */
        .collections-pills-bar-container {
          background: #ffffff;
          border-bottom: 1px solid rgba(99, 77, 64, 0.12);
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .collections-pills-bar {
          max-width: 1300px;
          margin: 0 auto;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .collections-pills-bar::-webkit-scrollbar {
          display: none;
        }

        .collection-pill {
          white-space: nowrap;
          background: #faf6f4;
          border: 1px solid #e7ded9;
          color: #634d40;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .collection-pill:hover,
        .collection-pill.active {
          background: #5d463c;
          border-color: #5d463c;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(93, 70, 60, 0.2);
        }

        /* Main Container */
        .collections-main-content {
          max-width: 1300px;
          margin: 0 auto;
          padding: 32px 24px 0;
        }

        .subcategories-sections-container {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .subcat-section-block {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 4px 20px rgba(99, 77, 64, 0.05);
          border: 1px solid rgba(99, 77, 64, 0.08);
          transition: box-shadow 0.2s ease;
        }

        .subcat-section-block:hover {
          box-shadow: 0 6px 24px rgba(99, 77, 64, 0.09);
        }

        /* Section Header */
        .subcat-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          gap: 16px;
        }

        .subcat-header-left {
          flex: 1;
          min-width: 0;
        }

        .subcat-badge-label {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #93735e;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .subcat-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .subcat-title-text {
          font-size: 24px;
          font-weight: 700;
          color: #2b221d;
          font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
          margin: 0;
        }

        .subcat-count-pill {
          background: #faf6f4;
          color: #7a5c4c;
          border: 1px solid #ebdcd5;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .subcat-desc-text {
          font-size: 13px;
          color: #7d6e66;
          margin: 6px 0 0 0;
          line-height: 1.45;
          max-width: 650px;
        }

        /* Arrow Button */
        .subcat-header-right {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .subcat-arrow-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #5d463c;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 7px 14px;
          border-radius: 30px;
          background: #faf6f4;
          border: 1px solid #ebdcd5;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .subcat-arrow-link:hover {
          background: #5d463c;
          color: #ffffff;
          border-color: #5d463c;
          box-shadow: 0 4px 14px rgba(93, 70, 60, 0.25);
          transform: translateY(-2px);
        }

        .arrow-circle-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5d463c;
          transition: all 0.25s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.08);
          flex-shrink: 0;
        }

        .subcat-arrow-link:hover .arrow-circle-btn {
          background: #ffffff;
          color: #5d463c;
          transform: translateX(3px);
        }

        .arrow-circle-btn svg {
          width: 15px;
          height: 15px;
        }

        /* 4 Products in a Row Grid (Desktop 4, Mobile 2x2) */
        .subcat-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        /* Product Card */
        .subcat-card-item {
          background: #ffffff;
          border: 1px solid #f0e8e4;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .subcat-card-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(99, 77, 64, 0.12);
          border-color: #dcc8bd;
        }

        .subcat-card-image-box {
          position: relative;
          width: 100%;
          padding-top: 100%;
          background: #faf7f5;
          overflow: hidden;
        }

        .subcat-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
          transition: transform 0.35s ease;
        }

        .subcat-card-item:hover .subcat-card-image {
          transform: scale(1.06);
        }

        .subcat-card-wishlist {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          z-index: 5;
          transition: transform 0.2s ease;
        }

        .subcat-card-wishlist:hover {
          transform: scale(1.12);
        }

        .subcat-card-wishlist svg {
          width: 15px;
          height: 15px;
          stroke: #634d40;
          fill: none;
          transition: all 0.2s ease;
        }

        .subcat-card-wishlist.active svg {
          fill: #c0392b;
          stroke: #c0392b;
        }

        .subcat-card-content {
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .subcat-card-prices {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .price-main {
          font-size: 14px;
          font-weight: 700;
          color: #2b221d;
        }

        .price-strike {
          font-size: 11px;
          color: #9c8a80;
          text-decoration: line-through;
        }

        .price-off {
          font-size: 10px;
          font-weight: 700;
          color: #27ae60;
        }

        .subcat-product-name {
          font-size: 12px;
          font-weight: 500;
          color: #4a3b32;
          line-height: 1.35;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 32px;
        }

        .subcat-card-actions {
          margin-top: auto;
        }

        .subcat-add-btn {
          width: 100%;
          background: #faf6f4;
          border: 1px solid #ebdcd5;
          color: #5d463c;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.2s ease;
        }

        .subcat-add-btn:hover {
          background: #5d463c;
          border-color: #5d463c;
          color: #ffffff;
        }

        .collections-spinner-wrap {
          text-align: center;
          padding: 80px 0;
          color: #634d40;
        }

        .collections-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #ebdcd5;
          border-top: 3px solid #5d463c;
          border-radius: 50%;
          animation: colSpin 0.9s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes colSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .collections-empty-wrap {
          text-align: center;
          padding: 60px 0;
          color: #7d6e66;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .collections-page-hero-wrapper,
          .collections-hero-img {
            height: 200px;
            max-height: 200px;
          }
          .subcat-products-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
          .subcat-title-text {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .collections-page-hero-wrapper,
          .collections-hero-img {
            height: 140px;
            max-height: 140px;
          }
          .collections-pills-bar {
            padding: 8px 14px;
            gap: 6px;
          }
          .collection-pill {
            font-size: 11px;
            padding: 5px 12px;
          }
          .collections-main-content {
            padding: 16px 12px 0;
          }
          .subcategories-sections-container {
            gap: 20px;
          }
          .subcat-section-block {
            padding: 16px 12px;
            border-radius: 12px;
          }
          .subcat-section-header {
            margin-bottom: 14px;
            gap: 10px;
          }
          .subcat-badge-label {
            font-size: 9px;
            margin-bottom: 2px;
          }
          .subcat-title-row {
            gap: 6px;
          }
          .subcat-title-text {
            font-size: 17px;
          }
          .subcat-count-pill {
            font-size: 10px;
            padding: 2px 7px;
          }
          .subcat-desc-text {
            display: none;
          }
          .subcat-arrow-link {
            font-size: 11px;
            padding: 5px 10px;
            gap: 6px;
          }
          .arrow-circle-btn {
            width: 24px;
            height: 24px;
          }
          .arrow-circle-btn svg {
            width: 13px;
            height: 13px;
          }
          .subcat-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .subcat-card-item {
            border-radius: 10px;
          }
          .subcat-card-content {
            padding: 10px 8px;
          }
          .price-main {
            font-size: 13px;
          }
          .price-strike {
            font-size: 10px;
          }
          .price-off {
            font-size: 9px;
          }
          .subcat-product-name {
            font-size: 11px;
            min-height: 28px;
            margin-bottom: 8px;
          }
          .subcat-add-btn {
            font-size: 9px;
            padding: 6px 6px;
            gap: 3px;
          }
        }
      `}</style>
    </div>
  );
}
