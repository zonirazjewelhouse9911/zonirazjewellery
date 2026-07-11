import React, { useState, useEffect, useRef, useContext } from 'react';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';

// Lifestyle / model images from Unsplash (free to use)
const lifestyleImages = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b3?w=600&auto=format&fit=crop&q=80',
];

const sizeOptions = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const metalOptions = ['14 KT Yellow', '14 KT Rose', '18 KT Yellow', '18 KT White', 'Platinum'];
const diamondOptions = ['FG-SI', 'EF-VS', 'GH-SI', 'IJ-SI'];

export default function ProductDetailPage({ product, products: propProducts = [], wishlist = {}, setWishlist, cart = {}, setCart, onBack }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.size || 12);
  const [selectedMetal, setSelectedMetal] = useState('14 KT Yellow');
  const [selectedDiamond, setSelectedDiamond] = useState('FG-SI');
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'price'
  const [stickyVisible, setStickyVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Try at Home Modal
  const [tryHomeOpen, setTryHomeOpen] = useState(false);
  const [tryForm, setTryForm] = useState({ name: '', phone: '', date: '' });
  const [trySuccess, setTrySuccess] = useState(false);

  // Video Call Modal
  const [videoOpen, setVideoOpen] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // Rating & Reviews Mock
  const rating = 4.9;
  const reviews = 2132;

  const topRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleScroll = () => {
      setStickyVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (videoOpen) {
      setCallConnected(false);
      const t = setTimeout(() => setCallConnected(true), 2200);
      return () => clearTimeout(t);
    }
  }, [videoOpen]);

  if (!product) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={onBack} style={{ marginTop: 16, padding: '10px 20px', background: '#634d40', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist[product.id];
  const inCart = (cart[product.id] || 0) > 0;
  const savings = product.originalPrice - product.price;
  const savingsPct = product.originalPrice > 0 ? Math.round((savings / product.originalPrice) * 100) : 0;
  const xPoints = Math.round(product.price * 0.03);
  const metalAccentMap = {
    '14 KT Yellow': '#d9a441',
    '14 KT Rose': '#bf7b6b',
    '18 KT Yellow': '#f0b84f',
    '18 KT White': '#d9e3e8',
    Platinum: '#8d97a2',
  };
  const currentMetalAccent = metalAccentMap[selectedMetal] || '#634d40';

  // All gallery images: product images + lifestyle images
  const allImages = [...(product.images || [product.image]), ...lifestyleImages];

  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedMetal);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleWishlist = () => {
    setWishlist(prev => ({ ...prev, [product.id]: !prev[product.id] }));
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      const days = Math.floor(Math.random() * 3) + 2;
      const date = new Date();
      date.setDate(date.getDate() + days);
      const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      setPincodeMsg(`✅ Delivery by ${dateStr} | Free Shipping`);
    } else {
      setPincodeMsg('❌ Enter a valid 6-digit pincode');
    }
  };

  const handleTrySubmit = (e) => {
    e.preventDefault();
    setTrySuccess(true);
    setTimeout(() => {
      setTryHomeOpen(false);
      setTrySuccess(false);
      setTryForm({ name: '', phone: '', date: '' });
    }, 2500);
  };

  // Related products
  const relatedProducts = (propProducts && propProducts.length > 0 ? propProducts : products)
    .filter(p => String(p.id) !== String(product.id))
    .slice(0, 4);

  return (
    <div className="pdp-wrapper" ref={topRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .pdp-wrapper {
          background: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #634d40;
          min-height: 100vh;
        }

        /* Breadcrumb */
        .pdp-breadcrumb {
          max-width: 1280px;
          margin: 0 auto;
          padding: 12px 24px;
          font-size: 11px;
          color: #8a6a58;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pdp-breadcrumb span { cursor: pointer; }
        .pdp-breadcrumb span:hover { color: #634d40; }
        .pdp-breadcrumb .active { color: #634d40; font-weight: 600; }

        /* Main grid layout */
        .pdp-main-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 60px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 40px;
          align-items: start;
        }

        /* LEFT: Image section */
        .pdp-images-col {
          position: relative;
        }
        .pdp-images-layout {
          display: flex;
          gap: 12px;
        }

        /* Vertical thumbnails */
        .pdp-thumbs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 72px;
          flex-shrink: 0;
        }
        .pdp-thumb {
          width: 72px;
          height: 72px;
          border-radius: 6px;
          border: 2px solid transparent;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s;
          background: #f7f0ee;
        }
        .pdp-thumb.active {
          border-color: #634d40;
        }
        .pdp-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }

        /* Main image display */
        .pdp-main-img-wrap {
          flex-grow: 1;
          position: relative;
          background: #f7f0ee;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdp-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
        }
        .pdp-popular-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(255,243,224,0.95);
          color: #e65100;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid #ffe0b2;
        }
        .pdp-main-zoom-icon {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(255,255,255,0.85);
          border: 1px solid #dbcfcb;
          border-radius: 4px;
          padding: 5px 7px;
          font-size: 14px;
          cursor: pointer;
        }

        /* Lifestyle mosaic grid */
        .pdp-lifestyle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 12px;
        }
        .pdp-lifestyle-img {
          border-radius: 8px;
          width: 100%;
          height: 240px;
          object-fit: cover;
        }
        .pdp-lifestyle-img:first-child {
          grid-column: 1 / -1;
          height: 340px;
        }

        /* Show More */
        .pdp-show-more-btn {
          width: 100%;
          padding: 10px;
          border: 1px solid #d4c8e3;
          border-radius: 6px;
          background: #fff;
          color: #3b1954;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* RIGHT: Product Info Panel */
        .pdp-info-col {
          position: sticky;
          top: 175px;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        .pdp-info-col::-webkit-scrollbar {
          width: 4px;
        }
        .pdp-info-col::-webkit-scrollbar-thumb {
          background: #d4c5bd;
          border-radius: 2px;
        }

        .pdp-popular-tag {
          color: #634d40;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        /* Rating Row */
        .pdp-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .pdp-rating-pill {
          background: #f7f0ee;
          border: 1px solid #d4c5bd;
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 13px;
          font-weight: 600;
          color: #634d40;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pdp-star-icon { color: #634d40; }

        /* Price */
        .pdp-price-row {
          margin-bottom: 4px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pdp-current-price {
          font-size: 24px;
          font-weight: 800;
          color: #634d40;
        }
        .pdp-original-price {
          font-size: 16px;
          text-decoration: line-through;
          color: #b09585;
          font-weight: 400;
        }
        .pdp-tax-note {
          font-size: 11px;
          color: #b09585;
          margin-bottom: 10px;
        }
        .pdp-product-name {
          font-size: 16px;
          font-weight: 600;
          color: #634d40;
          margin-bottom: 8px;
        }
        .pdp-offer-tag {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 16px;
        }

        /* Customise Box */
        .pdp-customise-box {
          border: 1px solid #d7c4b9;
          border-radius: 12px;
          display: flex;
          gap: 0;
          margin-bottom: 10px;
          overflow: hidden;
          background: #fcf7f4;
        }
        .pdp-custom-item {
          flex: 1;
          padding: 10px;
          border-right: 1px solid #c4aa9f;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .pdp-custom-item:last-child {
          border-right: none;
        }
        .pdp-custom-label {
          font-size: 9px;
          font-weight: 600;
          color: #837890;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-custom-select {
          border: none;
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
          background: transparent;
          cursor: pointer;
          outline: none;
          text-align: center;
          width: 100%;
        }
        .pdp-customise-btn {
          background: #634d40;
          color: #fff;
          border: none;
          padding: 10px 16px;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 96px;
          transition: background 0.2s ease;
        }
        .pdp-customise-btn.active {
          background: #a7774d;
        }
        .pdp-customise-card {
          margin-bottom: 14px;
          border: 1px solid #ead7cc;
          border-radius: 14px;
          padding: 14px;
          background: linear-gradient(135deg, #fffaf7 0%, #f7ece6 100%);
          box-shadow: 0 10px 24px rgba(99, 77, 64, 0.08);
        }
        .pdp-customise-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }
        .pdp-customise-card-title {
          font-size: 14px;
          font-weight: 800;
          color: #634d40;
        }
        .pdp-customise-card-subtitle {
          font-size: 12px;
          color: #8a6a58;
          margin-top: 3px;
        }
        .pdp-customise-pill {
          background: #634d40;
          color: #fff;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-customise-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
        }
        .pdp-customise-preview-ring {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          border: 3px solid #634d40;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 30% 30%, #fff, #f7ebe4);
          flex-shrink: 0;
        }
        .pdp-customise-preview-stone {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #634d40;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.35);
        }
        .pdp-customise-summary {
          flex: 1;
          display: grid;
          gap: 8px;
        }
        .pdp-customise-summary > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #634d40;
          border-bottom: 1px dashed #e4d4ca;
          padding-bottom: 6px;
        }
        .pdp-customise-summary strong {
          color: #8a6a58;
          font-weight: 700;
        }
        .pdp-customise-note {
          font-size: 11px;
          color: #8a6a58;
          line-height: 1.5;
        }

        /* Ring size learn how */
        .pdp-ring-size-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #634d40;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: #f7f0ee;
          border-radius: 6px;
        }
        .pdp-learn-how-link {
          color: #634d40;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* CTA Buttons Row */
        .pdp-cta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .pdp-add-to-bag-btn {
          flex-grow: 1;
          background: #634d40;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 14px rgba(99,77,64,0.3);
          transition: all 0.2s;
        }
        .pdp-add-to-bag-btn:hover {
          background: #4a3830;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(99,77,64,0.4);
        }
        .pdp-add-to-bag-btn.success {
          background: #4a3830;
        }
        .pdp-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #d4c8e3;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
        }
        .pdp-icon-btn:hover {
          border-color: #634d40;
          background: #f7f0ee;
        }
        .pdp-icon-btn.wishlisted {
          background: #f7f0ee;
          border-color: #634d40;
          color: #634d40;
        }

        /* Divider */
        .pdp-divider {
          height: 1px;
          background: #f0edf5;
          margin: 16px 0;
        }

        /* Delivery Section */
        .pdp-section-title {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 12px;
        }
        .pdp-pincode-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .pdp-pincode-input {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #d4c8e3;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
        }
        .pdp-pincode-input:focus { border-color: #634d40; }
        .pdp-locate-btn {
          background: transparent;
          border: none;
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
          cursor: pointer;
          white-space: nowrap;
        }
        .pdp-pincode-msg {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #634d40;
        }
        .pdp-pincode-msg.error { color: #a05030; }

        /* Delivery date row */
        .pdp-delivery-info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #8a6a58;
          margin-bottom: 12px;
        }

        /* Try at Home + Store Availability cards */
        .pdp-trial-store-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 14px;
        }
        .pdp-service-card {
          border: 1px solid #c4aa9f;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #fff;
        }
        .pdp-service-icon { font-size: 18px; margin-bottom: 4px; }
        .pdp-service-title {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
        }
        .pdp-service-sub {
          font-size: 11px;
          color: #8a6a58;
          margin-bottom: 8px;
          flex-grow: 1;
        }
        .pdp-service-btn {
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          border: none;
          transition: all 0.2s;
        }
        .pdp-service-btn.green-outline {
          border: 1px solid #634d40;
          background: transparent;
          color: #634d40;
        }
        .pdp-service-btn.green-outline:hover {
          background: #634d40;
          color: #fff;
        }
        .pdp-service-btn.orange-outline {
          border: 1px solid #634d40;
          background: transparent;
          color: #634d40;
        }
        .pdp-service-btn.orange-outline:hover {
          background: #634d40;
          color: #fff;
        }

        /* Video Call Banner */
        .pdp-video-call-banner {
          border: 1px solid #c4aa9f;
          background: #f7f0ee;
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        .pdp-video-call-banner:hover {
          box-shadow: 0 4px 12px rgba(99,77,64,0.15);
        }
        .pdp-video-thumbnail {
          width: 64px;
          height: 52px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .pdp-video-call-info { flex-grow: 1; }
        .pdp-video-call-title {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 2px;
        }
        .pdp-video-call-sub {
          font-size: 11px;
          color: #8a6a58;
          line-height: 1.3;
        }
        .pdp-schedule-link {
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
          background: #fff;
          border: 1px solid #634d40;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* Trust Icons Strip */
        .pdp-trust-strip {
          display: flex;
          justify-content: space-around;
          margin-bottom: 16px;
          border: 1px solid #c4aa9f;
          border-radius: 8px;
          padding: 12px 8px;
          background: #f7f0ee;
        }
        .pdp-trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .pdp-trust-icon { font-size: 22px; }
        .pdp-trust-label {
          font-size: 9px;
          font-weight: 700;
          color: #8a6a58;
          text-align: center;
          max-width: 56px;
          line-height: 1.3;
        }

        /* xCLusive points */
        .pdp-xclusive-banner {
          background: linear-gradient(135deg, #f7f0ee, #efe7e5);
          border: 1px solid #c4aa9f;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .pdp-xclusive-text {
          font-size: 12px;
          font-weight: 600;
          color: #634d40;
          line-height: 1.4;
        }
        .pdp-xclusive-text strong { color: #634d40; }
        .pdp-xclusive-coin { font-size: 28px; }

        /* Product Details Tabs */
        .pdp-details-tabs {
          margin-top: 0;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding: 40px 24px 60px;
          background: #efe7e5;
        }
        .pdp-tab-row {
          display: flex;
          border-bottom: 2px solid #f0edf5;
          margin-bottom: 20px;
        }
        .pdp-tab-btn {
          padding: 12px 24px;
          font-size: 13px;
          font-weight: 700;
          color: #8a6a58;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-tab-btn.active {
          color: #634d40;
        }
        .pdp-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: #634d40;
          border-radius: 2px 2px 0 0;
        }

        .pdp-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .pdp-detail-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pdp-detail-group-title {
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e8ddd9;
        }
        .pdp-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .pdp-detail-key { color: #8a6a58; }
        .pdp-detail-val { font-weight: 600; color: #634d40; }

        /* Certification logos */
        .pdp-cert-strip {
          display: flex;
          gap: 24px;
          align-items: center;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #f0edf5;
        }
        .pdp-cert-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .pdp-cert-icon { font-size: 28px; }
        .pdp-cert-name {
          font-size: 10px;
          font-weight: 700;
          color: #634d40;
          text-align: center;
        }
        .pdp-cert-sub {
          font-size: 9px;
          color: #8a6a58;
          text-align: center;
        }

        /* Related Products */
        .pdp-related-section {
          background: #f7f0ee;
          padding: 40px 24px;
        }
        .pdp-related-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .pdp-related-title {
          font-size: 18px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .pdp-related-card {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pdp-related-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(99,77,64,0.15);
        }
        .pdp-related-img {
          width: 100%;
          height: 160px;
          object-fit: contain;
          background: #f7f0ee;
          padding: 12px;
        }
        .pdp-related-info {
          padding: 10px 12px;
        }
        .pdp-related-name {
          font-size: 12px;
          font-weight: 600;
          color: #634d40;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pdp-related-prices {
          display: flex;
          gap: 6px;
          align-items: baseline;
        }
        .pdp-related-price {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
        }
        .pdp-related-old-price {
          font-size: 10px;
          text-decoration: line-through;
          color: #b09585;
        }

        /* Sticky bottom bar on scroll */
        .pdp-sticky-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-bottom: 1px solid #d4c5bd;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 9000;
          transform: translateY(-100%);
          transition: transform 0.3s;
          box-shadow: 0 2px 8px rgba(99,77,64,0.1);
        }
        .pdp-sticky-bar.visible {
          transform: translateY(0);
        }
        .pdp-sticky-product-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 4px;
          background: #f7f0ee;
          border: 1px solid #d4c5bd;
        }
        .pdp-sticky-name {
          font-size: 12px;
          font-weight: 600;
          color: #634d40;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .pdp-sticky-price {
          font-size: 14px;
          font-weight: 700;
          color: #634d40;
        }
        .pdp-sticky-sep { flex-grow: 1; }
        .pdp-sticky-size-sel {
          border: 1px solid #d4c5bd;
          border-radius: 4px;
          padding: 5px 8px;
          font-size: 12px;
          font-weight: 600;
          color: #634d40;
          outline: none;
          cursor: pointer;
        }
        .pdp-sticky-add-btn {
          background: #634d40;
          color: #fff;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .pdp-sticky-add-btn:hover { background: #4a3830; }

        /* Modal */
        .pdp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(35,21,53,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .pdp-modal-box {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 480px;
          position: relative;
          animation: pdpModalIn 0.25s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .pdp-modal-close {
          position: absolute;
          top: 14px;
          right: 16px;
          font-size: 18px;
          color: #8a6a58;
          cursor: pointer;
          background: none;
          border: none;
          line-height: 1;
        }
        .pdp-modal-title {
          font-size: 17px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 6px;
        }
        .pdp-modal-sub {
          font-size: 13px;
          color: #8a6a58;
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .pdp-modal-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d4c8e3;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          margin-bottom: 12px;
          box-sizing: border-box;
        }
        .pdp-modal-input:focus { border-color: #634d40; }
        .pdp-modal-label {
          font-size: 11px;
          font-weight: 600;
          color: #634d40;
          display: block;
          margin-bottom: 4px;
        }
        .pdp-modal-submit {
          width: 100%;
          background: #634d40;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 4px;
        }
        .pdp-modal-success {
          text-align: center;
          padding: 20px 0;
          color: #634d40;
          font-size: 14px;
          font-weight: 600;
        }

        /* Video call */
        .pdp-video-screen {
          background: #1a0f26;
          border-radius: 8px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .pdp-video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pdp-spinner {
          border: 3px solid rgba(255,255,255,0.2);
          border-top-color: #de3581;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: pdpSpin 1s linear infinite;
        }
        .pdp-call-controls {
          display: flex;
          justify-content: center;
          gap: 14px;
        }
        .pdp-ctrl-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          color: #fff;
          font-size: 16px;
        }

        @keyframes pdpModalIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pdpSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1000px) {
          .pdp-main-grid {
            grid-template-columns: 1fr;
          }
          .pdp-info-col {
            position: static;
            max-height: none;
            overflow-y: visible;
          }
          .pdp-related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pdp-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Sticky top bar on scroll */}
      <div className={`pdp-sticky-bar ${stickyVisible ? 'visible' : ''}`}>
        <img src={product.image} alt="" className="pdp-sticky-product-img" />
        <div>
          <div className="pdp-sticky-name">{product.name}</div>
          <div className="pdp-sticky-price">₹{product.price.toLocaleString('en-IN')}</div>
        </div>
        <div className="pdp-sticky-sep" />
        <select
          className="pdp-sticky-size-sel"
          value={selectedSize}
          onChange={e => setSelectedSize(Number(e.target.value))}
        >
          {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="pdp-sticky-add-btn" onClick={handleAddToCart}>
          ADD TO BAG
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <span onClick={() => { window.location.hash = ''; }}>Home</span>
        <span>›</span>
        <span onClick={() => { window.location.hash = '#' + (product.category || 'rings').toLowerCase().replace(/ /g, '-'); }}>
          {product.category || 'Rings'}
        </span>
        {product.subcategory && (
          <>
            <span>›</span>
            <span onClick={() => { window.location.hash = '#' + (product.category || 'rings').toLowerCase().replace(/ /g, '-') + '?subcategory=' + product.subcategory.toLowerCase().replace(/ /g, '-'); }}>
              {product.subcategory}
            </span>
          </>
        )}
        <span>›</span>
        <span className="active">{product.name}</span>
      </div>

      {/* Main layout */}
      <div className="pdp-main-grid">

        {/* LEFT: Images */}
        <div className="pdp-images-col">
          <div className="pdp-images-layout">
            {/* Thumbnails column */}
            <div className="pdp-thumbs">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={`pdp-thumb ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div className="pdp-main-img-wrap">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="pdp-main-img"
              />
              <div className="pdp-popular-badge">★ 9k+ bought this</div>
              <div className="pdp-main-zoom-icon" title="Zoom image">⛶</div>
            </div>
          </div>

          {/* Lifestyle mosaic */}
          <div className="pdp-lifestyle-grid">
            {lifestyleImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Lifestyle ${i + 1}`}
                className="pdp-lifestyle-img"
                onClick={() => setSelectedImage(product.images.length + i)}
              />
            ))}
          </div>

          <button className="pdp-show-more-btn">
            <span>▼</span> SHOW MORE
          </button>
        </div>

        {/* RIGHT: Product Info */}
        <div className="pdp-info-col">
          {/* Popular badge */}
          <div className="pdp-popular-tag">
            <span>★</span> 9k+ bought this
          </div>

          {/* Rating */}
          <div className="pdp-rating-row">
            <div className="pdp-rating-pill">
              <span className="pdp-star-icon">★</span>
              {rating} &nbsp;|&nbsp; {reviews.toLocaleString('en-IN')} Ratings
            </div>
          </div>

          {/* Price */}
          <div className="pdp-price-row">
            <span className="pdp-current-price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="pdp-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="pdp-tax-note">(MRP Inclusive of all taxes)</div>

          <div className="pdp-product-name">{product.name}</div>
          <div className="pdp-offer-tag">✦ Flat {savingsPct}% off on Making Charges</div>

          {/* Customise selectors */}
          <div className="pdp-customise-box">
            <div className="pdp-custom-item">
              <span className="pdp-custom-label">Size</span>
              <select
                className="pdp-custom-select"
                value={selectedSize}
                onChange={e => setSelectedSize(Number(e.target.value))}
              >
                {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="pdp-custom-item">
              <span className="pdp-custom-label">Metal</span>
              <select
                className="pdp-custom-select"
                value={selectedMetal}
                onChange={e => setSelectedMetal(e.target.value)}
              >
                {metalOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="pdp-custom-item">
              <span className="pdp-custom-label">Diamond</span>
              <select
                className="pdp-custom-select"
                value={selectedDiamond}
                onChange={e => setSelectedDiamond(e.target.value)}
              >
                {diamondOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button
              className={`pdp-customise-btn ${isCustomizeOpen ? 'active' : ''}`}
              onClick={() => setIsCustomizeOpen(prev => !prev)}
            >
              {isCustomizeOpen ? 'CLOSE' : 'CUSTOMISE'}
            </button>
          </div>

          {isCustomizeOpen && (
            <div className="pdp-customise-card" role="region" aria-label="Customization preview">
              <div className="pdp-customise-card-header">
                <div>
                  <div className="pdp-customise-card-title">Your custom style</div>
                  <div className="pdp-customise-card-subtitle">A polished look crafted around your choices</div>
                </div>
                <div className="pdp-customise-pill">Preview</div>
              </div>

              <div className="pdp-customise-preview">
                <div className="pdp-customise-preview-ring" style={{ borderColor: currentMetalAccent }}>
                  <div className="pdp-customise-preview-stone" style={{ background: currentMetalAccent }} />
                </div>
                <div className="pdp-customise-summary">
                  <div><strong>Size</strong><span>{selectedSize}</span></div>
                  <div><strong>Metal</strong><span>{selectedMetal}</span></div>
                  <div><strong>Diamond</strong><span>{selectedDiamond}</span></div>
                </div>
              </div>

              <div className="pdp-customise-note">
                Your choices are ready to be reviewed before checkout. We’ll style this piece to match your preferred finish and sparkle.
              </div>
            </div>
          )}

          {/* Ring size guide */}
          <div className="pdp-ring-size-row">
            <span>Not sure about your ring size?</span>
            <span className="pdp-learn-how-link">LEARN HOW ▶</span>
          </div>

          {/* CTA Buttons */}
          <div className="pdp-cta-row">
            <button
              className={`pdp-add-to-bag-btn ${addedToCart ? 'success' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? '✓ Added to Bag!' : 'ADD TO BAG'}
            </button>
            <button
              className={`pdp-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={handleWishlist}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {isWishlisted ? '♥' : '♡'}
            </button>
            <button className="pdp-icon-btn" title="Share">
              ↗
            </button>
          </div>

          <div className="pdp-divider" />

          {/* Delivery, Stores & Trial */}
          <div className="pdp-section-title">Delivery, Stores &amp; Trial</div>

          <form onSubmit={handlePincodeCheck}>
            <div className="pdp-pincode-row">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter Pincode"
                className="pdp-pincode-input"
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeMsg(''); }}
              />
              <button type="submit" className="pdp-locate-btn">CHECK</button>
              <button type="button" className="pdp-locate-btn" onClick={() => {
                setPincode('110001');
                setPincodeMsg('✅ Delivery by Tomorrow | Free Shipping');
              }}>
                📍 Locate Me
              </button>
            </div>
          </form>

          {pincodeMsg && (
            <div className={`pdp-pincode-msg ${pincodeMsg.includes('❌') ? 'error' : ''}`}>
              {pincodeMsg}
            </div>
          )}

          <div className="pdp-delivery-info-row">
            <span>📅</span>
            <span>Expected Delivery Date — Enter pincode to check</span>
          </div>

          {/* Service Cards */}
          <div className="pdp-trial-store-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="pdp-service-card">
              <div className="pdp-service-icon">🏪</div>
              <div className="pdp-service-title">Store Availability</div>
              <div className="pdp-service-sub">Find designs in store</div>
              <button
                className="pdp-service-btn orange-outline"
                onClick={() => alert('Store locator — finding nearest stores...')}
              >
                FIND IN STORE
              </button>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="pdp-trust-strip">
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">✔️</div>
              <div className="pdp-trust-label">100% Certified</div>
            </div>
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">🔄</div>
              <div className="pdp-trust-label">15 Day Money-Back</div>
            </div>
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">🤝</div>
              <div className="pdp-trust-label">Lifetime Exchange</div>
            </div>
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">🛡️</div>
              <div className="pdp-trust-label">One Year Warranty</div>
            </div>
          </div>

          {/* xCLusive Points */}
          <div className="pdp-xclusive-banner">
            <div className="pdp-xclusive-text">
              Earn <strong>{xPoints} xCLusive points</strong> with this order<br />
              <span style={{ fontSize: '10px', color: '#837890' }}>1 xCLusive point = ₹1</span>
            </div>
            <div className="pdp-xclusive-coin">🪙</div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="pdp-details-tabs">
        <div className="pdp-tab-row">
          <button
            className={`pdp-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Product Details
          </button>
          <button
            className={`pdp-tab-btn ${activeTab === 'price' ? 'active' : ''}`}
            onClick={() => setActiveTab('price')}
          >
            Price Breakup
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="pdp-details-grid">
            <div className="pdp-detail-group">
              <div className="pdp-detail-group-title">
                <span>💛</span> Gold
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Karat</span>
                <span className="pdp-detail-val">{selectedMetal.split(' ')[0]} KT</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Colour</span>
                <span className="pdp-detail-val">{selectedMetal.includes('Yellow') ? 'Yellow' : selectedMetal.includes('Rose') ? 'Rose' : 'White'}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Net Weight</span>
                <span className="pdp-detail-val">{product.weight} g</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Gross Weight</span>
                <span className="pdp-detail-val">{(product.weight * 1.02).toFixed(2)} g</span>
              </div>
            </div>

            <div className="pdp-detail-group">
              <div className="pdp-detail-group-title">
                <span>💎</span> Diamond
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Quality</span>
                <span className="pdp-detail-val">{selectedDiamond}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Total Weight</span>
                <span className="pdp-detail-val">0.098 ct</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Setting</span>
                <span className="pdp-detail-val">Hand Setting</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Number</span>
                <span className="pdp-detail-val">19 Diamonds</span>
              </div>
            </div>

            <div className="pdp-detail-group">
              <div className="pdp-detail-group-title">
                <span>📐</span> Dimensions
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Ring Size</span>
                <span className="pdp-detail-val">{selectedSize}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Width</span>
                <span className="pdp-detail-val">6 mm</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Height</span>
                <span className="pdp-detail-val">5.6 mm</span>
              </div>
            </div>

            <div className="pdp-detail-group">
              <div className="pdp-detail-group-title">
                <span>ℹ️</span> About
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">SKU</span>
                <span className="pdp-detail-val">ZNR-{product.id.toString().padStart(5, '0')}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Material</span>
                <span className="pdp-detail-val">{product.material}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Manufacturer</span>
                <span className="pdp-detail-val">Zoniraz Pvt. Ltd.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'price' && (
          <div className="pdp-details-grid">
            <div className="pdp-detail-group">
              <div className="pdp-detail-group-title">Price Breakup</div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Gold Value</span>
                <span className="pdp-detail-val">₹{Math.round(product.price * 0.65).toLocaleString('en-IN')}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Diamond Value</span>
                <span className="pdp-detail-val">₹{Math.round(product.price * 0.25).toLocaleString('en-IN')}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Making Charges</span>
                <span className="pdp-detail-val" style={{ color: '#2e7d32' }}>FREE (Saved ₹{Math.round(product.price * 0.10).toLocaleString('en-IN')})</span>
              </div>
              <div className="pdp-detail-row" style={{ borderTop: '1px solid #f0edf5', paddingTop: 10, marginTop: 4 }}>
                <span className="pdp-detail-key" style={{ fontWeight: 700, color: '#231535' }}>Total</span>
                <span className="pdp-detail-val">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Certification Strip */}
        <div className="pdp-cert-strip">
          <div className="pdp-cert-item">
            <div className="pdp-cert-icon">🏅</div>
            <div className="pdp-cert-name">BIS*</div>
            <div className="pdp-cert-sub">Hallmarked Jewellery</div>
          </div>
          <div className="pdp-cert-item">
            <div className="pdp-cert-icon">🏢</div>
            <div className="pdp-cert-name">TATA Certified</div>
            <div className="pdp-cert-sub">Spirit of Trust</div>
          </div>
          <div className="pdp-cert-item">
            <div className="pdp-cert-icon">✅</div>
            <div className="pdp-cert-name">100% Certified</div>
            <div className="pdp-cert-sub">Quality Assured</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="pdp-related-section">
        <div className="pdp-related-inner">
          <h2 className="pdp-related-title">You Might Also Like</h2>
          <div className="pdp-related-grid">
            {relatedProducts.map(p => (
              <div
                key={p.id}
                className="pdp-related-card"
                onClick={() => {
                  window.location.hash = `product-${p.id}`;
                }}
              >
                <img src={p.image} alt={p.name} className="pdp-related-img" />
                <div className="pdp-related-info">
                  <div className="pdp-related-name">{p.name}</div>
                  <div className="pdp-related-prices">
                    <span className="pdp-related-price">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="pdp-related-old-price">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Try at Home Modal */}
      {tryHomeOpen && (
        <div className="pdp-modal-overlay" onClick={() => setTryHomeOpen(false)}>
          <div className="pdp-modal-box" onClick={e => e.stopPropagation()}>
            <button className="pdp-modal-close" onClick={() => setTryHomeOpen(false)}>✕</button>
            <h3 className="pdp-modal-title">Book Free Try at Home</h3>
            <p className="pdp-modal-sub">
              Try <strong>{product.name}</strong> in the comfort of your home — absolutely free!
            </p>
            {trySuccess ? (
              <div className="pdp-modal-success">
                🎉 Appointment Booked! Our executive will contact you shortly to confirm.
              </div>
            ) : (
              <form onSubmit={handleTrySubmit}>
                <label className="pdp-modal-label">Full Name</label>
                <input
                  type="text"
                  className="pdp-modal-input"
                  required
                  value={tryForm.name}
                  onChange={e => setTryForm(p => ({ ...p, name: e.target.value }))}
                />
                <label className="pdp-modal-label">Phone Number</label>
                <input
                  type="tel"
                  className="pdp-modal-input"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                  value={tryForm.phone}
                  onChange={e => setTryForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                />
                <label className="pdp-modal-label">Preferred Date</label>
                <input
                  type="date"
                  className="pdp-modal-input"
                  required
                  value={tryForm.date}
                  onChange={e => setTryForm(p => ({ ...p, date: e.target.value }))}
                />
                <button type="submit" className="pdp-modal-submit">Confirm Appointment</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {videoOpen && (
        <div className="pdp-modal-overlay" onClick={() => setVideoOpen(false)}>
          <div className="pdp-modal-box" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <button className="pdp-modal-close" onClick={() => setVideoOpen(false)}>✕</button>
            <h3 className="pdp-modal-title">Live Video Consultation</h3>
            <p className="pdp-modal-sub">Connect with our designer at the showroom to see this piece live!</p>
            <div className="pdp-video-screen">
              {!callConnected ? (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div className="pdp-spinner" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 13 }}>Connecting to showroom advisor...</p>
                </div>
              ) : (
                <video
                  className="pdp-video-feed"
                  src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba20ef413c2f925f2066fa2eb967&profile_id=139&oauth2_token_id=57447761"
                  autoPlay loop muted playsInline
                />
              )}
            </div>
            <div className="pdp-call-controls">
              <button className="pdp-ctrl-btn" style={{ background: '#5c4b6e' }} onClick={() => alert('Muted')}>🎙</button>
              <button className="pdp-ctrl-btn" style={{ background: '#f44336' }} onClick={() => setVideoOpen(false)}>🛑</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
