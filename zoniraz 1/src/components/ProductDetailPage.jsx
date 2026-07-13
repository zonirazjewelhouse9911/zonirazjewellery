import React, { useState, useEffect, useRef, useContext } from 'react';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';
import { 
  Star, 
  Sparkles, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Store, 
  ShieldCheck, 
  RotateCcw, 
  Repeat, 
  Shield, 
  Coins, 
  Gem, 
  Ruler, 
  Info, 
  Award, 
  Maximize2,
  X,
  Mic,
  PhoneOff,
  ChevronRight
} from 'lucide-react';
import ringVideo from '../assets/videos/zoniraz ring .mp4';

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
  const categoryName = (product?.product_category || product?.category || '').toLowerCase();
  const isRing = categoryName === 'rings' || categoryName === 'ring';
  const isBangleOrBracelet = categoryName === 'bangles' || categoryName === 'bangle' || categoryName === 'bracelets' || categoryName === 'bracelet';
  const showSizing = isRing || isBangleOrBracelet;

  const getProductSizes = () => {
    if (!product) return [];
    if (product.size_id) {
      return product.size_id.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (isRing) {
      return [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(String);
    }
    if (isBangleOrBracelet) {
      return ['2.2', '2.4', '2.6', '2.8', '2.10', '3.0'];
    }
    return [];
  };

  const activeSizes = getProductSizes();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    isBangleOrBracelet
      ? (product?.banglesize_id && product?.banglesize_id !== '0' ? product.banglesize_id : '2.4')
      : 12
  );
  const [selectedMetal, setSelectedMetal] = useState('14 KT Yellow');
  const [selectedDiamond, setSelectedDiamond] = useState('IJ-SI');
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'price'
  const [stickyVisible, setStickyVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [sizingVideoOpen, setSizingVideoOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const [pricingDetails, setPricingDetails] = useState({
    price: product?.price || 0,
    goldCost: Math.round((product?.price || 0) * 0.65),
    diamondCost: Math.round((product?.price || 0) * 0.25),
    gemstoneCost: 0,
    makingCharges: 0,
    gst: 0,
    subtotal: product?.price || 0,
    goldWeight: product?.gold_weight || 0
  });

  useEffect(() => {
    let active = true;
    const fetchBasePricing = async () => {
      try {
        const prodId = product?._id || product?.id;
        if (!prodId) return;

        const response = await fetch('http://localhost:55000/api/productBasePricing');
        const data = await response.json();
        if (data.success && active && Array.isArray(data.data)) {
          const matched = data.data.find(item => String(item._id) === String(prodId) || String(item.product_id) === String(prodId));
          if (matched) {
            const price = matched.base_price_withGST;
            const goldCost = matched.gold_price || 0;
            const diamondCost = matched.diamond_price || 0;
            
            const gemstoneCost = (product.gemstone_weight || 0) * 1500;
            const makingCharges = product.making_charges || 0;
            const subtotal = goldCost + diamondCost + gemstoneCost + makingCharges;
            const gst = price - subtotal;

            setPricingDetails({
              price: price,
              goldCost: goldCost,
              diamondCost: diamondCost,
              gemstoneCost: gemstoneCost,
              makingCharges: makingCharges,
              gst: Math.max(0, gst),
              subtotal: subtotal,
              goldWeight: product?.gold_weight || 0
            });
          }
        }
      } catch (err) {
        console.error('Failed to load base pricing:', err);
      }
    };
    if (product?._id || product?.id) {
      fetchBasePricing();
    }
    return () => {
      active = false;
    };
  }, [product?._id, product?.id]);

  useEffect(() => {
    let active = true;
    const defaultSize = isBangleOrBracelet
      ? (product?.banglesize_id && product?.banglesize_id !== '0' ? product.banglesize_id : '2.4')
      : 12;
    const isCustomized = selectedSize !== defaultSize || selectedMetal !== '14 KT Yellow' || selectedDiamond !== 'IJ-SI';

    if (!isCustomized) {
      if (product?._id || product?.id) {
        const prodId = product?._id || product?.id;
        fetch('http://localhost:55000/api/productBasePricing')
          .then(res => res.json())
          .then(data => {
            if (data.success && active && Array.isArray(data.data)) {
              const matched = data.data.find(item => String(item._id) === String(prodId) || String(item.product_id) === String(prodId));
              if (matched) {
                const price = matched.base_price_withGST;
                const goldCost = matched.gold_price || 0;
                const diamondCost = matched.diamond_price || 0;
                const gemstoneCost = (product.gemstone_weight || 0) * 1500;
                const makingCharges = product.making_charges || 0;
                const subtotal = goldCost + diamondCost + gemstoneCost + makingCharges;
                const gst = price - subtotal;

                setPricingDetails({
                  price: price,
                  goldCost: goldCost,
                  diamondCost: diamondCost,
                  gemstoneCost: gemstoneCost,
                  makingCharges: makingCharges,
                  gst: Math.max(0, gst),
                  subtotal: subtotal,
                  goldWeight: product?.gold_weight || 0
                });
              }
            }
          })
          .catch(err => console.error('Failed to restore base pricing:', err));
      }
      return;
    }

    const fetchCustomPricing = async () => {
      try {
        const prodId = product?._id || product?.id;
        if (!prodId) return;

        let metalKey = "14k";
        if (selectedMetal.includes("18")) metalKey = "18k";
        else if (selectedMetal.includes("9")) metalKey = "9k";
        else if (selectedMetal.includes("22")) metalKey = "22k";
        else if (selectedMetal.includes("24")) metalKey = "24k";

        let diamondKey = selectedDiamond;
        if (selectedDiamond === "EF-VS") diamondKey = "EF-VVS";

        const [priceRes, ratesRes] = await Promise.all([
          fetch('http://localhost:55000/api/productPricing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              product_id: prodId,
              size: selectedSize,
              metal: metalKey,
              diamond: diamondKey
            })
          }),
          fetch('http://localhost:55000/api/jewellery-pricing').catch(() => null)
        ]);

        const data = await priceRes.json();
        const ratesData = ratesRes ? await ratesRes.json().catch(() => null) : null;

        if (data.success && active) {
          const rates = (ratesData && ratesData.success) ? ratesData.data : { gold_rate_24k: 5200, gst_percent: 3 };
          const price = data.price || pricingDetails.price;

          // Compute gold rate based on karat
          let goldRate = rates.gold_rate_14k || 3033;
          if (metalKey === "18k") goldRate = rates.gold_rate_24k * 18 / 24;
          else if (metalKey === "9k") goldRate = rates.gold_rate_24k * 9 / 24;
          else if (metalKey === "22k") goldRate = rates.gold_rate_24k * 22 / 24;
          else if (metalKey === "24k") goldRate = rates.gold_rate_24k * 24 / 24;

          const goldCost = Math.round((data.gold_weight || 0) * goldRate);
          const diamondCost = Math.round((data.diamond_weight || 0) * (data.diamond_rate_used || rates.diamond_rate || 85000));
          const gemstoneCost = (product.gemstone_weight || 0) * (rates.gemstone_rate || 1500);
          const makingCharges = product.making_charges || 0;
          const solitaireCost = product.solitaires_price || 0;

          const subtotal = goldCost + diamondCost + gemstoneCost + makingCharges + solitaireCost;
          const gst = price - subtotal;

          setPricingDetails({
            price: price,
            goldCost: goldCost,
            diamondCost: diamondCost,
            gemstoneCost: gemstoneCost,
            makingCharges: makingCharges,
            gst: Math.max(0, gst),
            subtotal: subtotal,
            goldWeight: data.gold_weight || product?.gold_weight || 0
          });
        }
      } catch (err) {
        console.error('Failed to load custom pricing:', err);
      }
    };

    fetchCustomPricing();

    return () => {
      active = false;
    };
  }, [selectedSize, selectedMetal, selectedDiamond, product?._id, product?.id]);

  // Try at Home Modal
  const [tryHomeOpen, setTryHomeOpen] = useState(false);
  const [tryForm, setTryForm] = useState({ name: '', phone: '', date: '' });
  const [trySuccess, setTrySuccess] = useState(false);

  // Video Call Modal
  const [videoOpen, setVideoOpen] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [hoveredRelatedId, setHoveredRelatedId] = useState(null);
  const [relatedCardImageIndexes, setRelatedCardImageIndexes] = useState({});

  const nextRelatedCardImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setRelatedCardImageIndexes(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current + 1) % totalImages };
    });
  };

  const prevRelatedCardImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setRelatedCardImageIndexes(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current - 1 + totalImages) % totalImages };
    });
  };

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
  const currentPrice = pricingDetails.price;
  const discountPct = product.discount || 0;
  const originalPrice = discountPct > 0 ? Math.round(currentPrice / (1 - discountPct / 100)) : (product.originalPrice || currentPrice);
  const savings = originalPrice - currentPrice;
  const savingsPct = discountPct > 0 ? discountPct : (product.originalPrice > 0 ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
  const xPoints = Math.round(currentPrice * 0.03);
  const metalAccentMap = {
    '14 KT Yellow': '#d9a441',
    '14 KT Rose': '#bf7b6b',
    '18 KT Yellow': '#f0b84f',
    '18 KT White': '#d9e3e8',
    Platinum: '#8d97a2',
  };
  const currentMetalAccent = metalAccentMap[selectedMetal] || '#634d40';

  // All gallery images: product images only
  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];


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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .pdp-wrapper {
          background: #FAF8F6;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #2C2520;
          min-height: 100vh;
          letter-spacing: -0.01em;
        }

        /* Breadcrumb */
        .pdp-breadcrumb {
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 24px;
          font-size: 11px;
          color: #8C827A;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pdp-breadcrumb span { cursor: pointer; transition: color 0.2s; }
        .pdp-breadcrumb span:hover { color: #A98E73; }
        .pdp-breadcrumb .active { color: #2C2520; font-weight: 600; }

        /* Main grid layout */
        .pdp-main-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 80px;
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
          gap: 16px;
        }

        /* Vertical thumbnails */
        .pdp-thumbs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 80px;
          flex-shrink: 0;
        }
        .pdp-thumb {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          border: 1px solid #EAE5E0;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .pdp-thumb:hover {
          border-color: #A98E73;
          transform: translateY(-2px);
        }
        .pdp-thumb.active {
          border-color: #A98E73;
          border-width: 2px;
          box-shadow: 0 4px 12px rgba(169, 142, 115, 0.15);
        }
        .pdp-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 6px;
          transition: transform 0.3s;
        }
        .pdp-thumb:hover img {
          transform: scale(1.05);
        }

        /* Main image display */
        .pdp-main-img-wrap {
          flex-grow: 1;
          position: relative;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #EAE5E0;
          box-shadow: 0 10px 40px rgba(44, 37, 32, 0.03);
          transition: box-shadow 0.3s;
        }
        .pdp-main-img-wrap:hover {
          box-shadow: 0 15px 50px rgba(44, 37, 32, 0.06);
        }
        .pdp-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 30px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pdp-main-img-wrap:hover .pdp-main-img {
          transform: scale(1.03);
        }
        .pdp-popular-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(44, 37, 32, 0.9);
          backdrop-filter: blur(4px);
          color: #FAF8F6;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 30px;
          letter-spacing: 0.5px;
        }
        .pdp-main-zoom-icon {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: #FFFFFF;
          border: 1px solid #EAE5E0;
          color: #2C2520;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s;
        }
        .pdp-main-zoom-icon:hover {
          background: #2C2520;
          color: #FFFFFF;
          border-color: #2C2520;
          transform: scale(1.05);
        }

        /* RIGHT: Product Info Panel */
        .pdp-info-col {
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          padding-right: 8px;
        }
        .pdp-info-col::-webkit-scrollbar {
          width: 4px;
        }
        .pdp-info-col::-webkit-scrollbar-thumb {
          background: #EAE5E0;
          border-radius: 4px;
        }

        .pdp-popular-tag {
          color: #A98E73;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Rating Row */
        .pdp-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .pdp-rating-pill {
          background: #FFFFFF;
          border: 1px solid #EAE5E0;
          border-radius: 30px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #2C2520;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.01);
        }
        .pdp-star-icon { color: #A98E73; }

        /* Price */
        .pdp-price-row {
          margin-bottom: 6px;
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pdp-current-price {
          font-size: 32px;
          font-weight: 700;
          color: #2C2520;
        }
        .pdp-original-price {
          font-size: 20px;
          text-decoration: line-through;
          color: #8C827A;
          font-weight: 400;
        }
        .pdp-tax-note {
          font-size: 12px;
          color: #8C827A;
          margin-bottom: 16px;
        }
        .pdp-product-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 600;
          color: #2C2520;
          line-height: 1.3;
          margin-bottom: 12px;
        }
        .pdp-offer-tag {
          font-size: 13px;
          font-weight: 700;
          color: #A98E73;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }

        /* Customise Box */
        .pdp-customise-box {
          border: 1px solid #EAE5E0;
          border-radius: 12px;
          display: flex;
          margin-bottom: 16px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 4px 20px rgba(44, 37, 32, 0.02);
        }
        .pdp-custom-item {
          flex: 1;
          padding: 12px;
          border-right: 1px solid #EAE5E0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .pdp-custom-item:last-child {
          border-right: none;
        }
        .pdp-custom-label {
          font-size: 10px;
          font-weight: 600;
          color: #8C827A;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .pdp-custom-select {
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #2C2520;
          background: transparent;
          cursor: pointer;
          outline: none;
          width: 100%;
          padding: 2px 0;
        }
        .pdp-customise-btn {
          background: #2C2520;
          color: #FFFFFF;
          border: none;
          padding: 12px 20px;
          font-weight: 700;
          font-size: 11px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          min-width: 105px;
          transition: all 0.3s ease;
        }
        .pdp-customise-btn:hover {
          background: #A98E73;
        }
        .pdp-customise-btn.active {
          background: #A98E73;
        }
        .pdp-customise-card {
          margin-bottom: 20px;
          border: 1px solid #EAE5E0;
          border-radius: 14px;
          padding: 20px;
          background: #FFFFFF;
          box-shadow: 0 10px 30px rgba(44, 37, 32, 0.04);
        }
        .pdp-customise-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 16px;
        }
        .pdp-customise-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #2C2520;
        }
        .pdp-customise-card-subtitle {
          font-size: 12px;
          color: #8C827A;
          margin-top: 4px;
        }
        .pdp-customise-pill {
          background: #FAF8F6;
          border: 1px solid #EAE5E0;
          color: #8C827A;
          padding: 6px 12px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-customise-preview {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 16px;
          background: #FAF8F6;
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #EAE5E0;
        }
        .pdp-customise-preview-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #2C2520;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 30% 30%, #fff, #FAF8F6);
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .pdp-customise-preview-stone {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2C2520;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4);
        }
        .pdp-customise-summary {
          flex: 1;
          display: grid;
          gap: 10px;
        }
        .pdp-customise-summary > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #2C2520;
          border-bottom: 1px solid #EAE5E0;
          padding-bottom: 6px;
        }
        .pdp-customise-summary > div:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .pdp-customise-summary strong {
          color: #8C827A;
          font-weight: 500;
        }
        .pdp-customise-note {
          font-size: 11px;
          color: #8C827A;
          line-height: 1.5;
        }

        /* Ring size learn how */
        .pdp-ring-size-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #2C2520;
          margin-bottom: 20px;
          padding: 12px 16px;
          background: #FFFFFF;
          border-radius: 10px;
          border: 1px solid #EAE5E0;
        }
        .pdp-learn-how-link {
          color: #A98E73;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .pdp-learn-how-link:hover {
          color: #2C2520;
        }

        /* CTA Buttons Row */
        .pdp-cta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .pdp-add-to-bag-btn {
          flex-grow: 1;
          background: #2C2520;
          color: #FFFFFF;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(44, 37, 32, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pdp-add-to-bag-btn:hover {
          background: #A98E73;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(169, 142, 115, 0.3);
        }
        .pdp-add-to-bag-btn.success {
          background: #4B7955;
          box-shadow: 0 4px 15px rgba(75, 121, 85, 0.2);
        }
        .pdp-icon-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid #EAE5E0;
          background: #FFFFFF;
          color: #2C2520;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .pdp-icon-btn:hover {
          border-color: #2C2520;
          background: #FAF8F6;
          transform: scale(1.05);
        }
        .pdp-icon-btn.wishlisted {
          background: #FAF8F6;
          border-color: #A98E73;
          color: #A98E73;
        }

        /* Divider */
        .pdp-divider {
          height: 1px;
          background: #EAE5E0;
          margin: 24px 0;
        }

        /* Delivery Section */
        .pdp-section-title {
          font-size: 14px;
          font-weight: 700;
          color: #2C2520;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-pincode-row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .pdp-pincode-input {
          flex-grow: 1;
          padding: 12px 16px;
          border: 1px solid #EAE5E0;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          background: #FFFFFF;
          transition: border-color 0.3s;
        }
        .pdp-pincode-input:focus { border-color: #A98E73; }
        .pdp-locate-btn {
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #2C2520;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .pdp-locate-btn:hover {
          color: #A98E73;
        }
        .pdp-pincode-msg {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
          color: #4B7955;
        }
        .pdp-pincode-msg.error { color: #C85A5A; }

        /* Delivery date row */
        .pdp-delivery-info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #8C827A;
          margin-bottom: 16px;
        }

        /* Try at Home + Store Availability cards */
        .pdp-trial-store-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        .pdp-service-card {
          border: 1px solid #EAE5E0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #FFFFFF;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          transition: all 0.3s;
        }
        .pdp-service-card:hover {
          box-shadow: 0 8px 24px rgba(44,37,32,0.04);
          transform: translateY(-2px);
        }
        .pdp-service-icon { font-size: 20px; margin-bottom: 4px; }
        .pdp-service-title {
          font-size: 14px;
          font-weight: 700;
          color: #2C2520;
        }
        .pdp-service-sub {
          font-size: 12px;
          color: #8C827A;
          margin-bottom: 12px;
          flex-grow: 1;
        }
        .pdp-service-btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          border: none;
          transition: all 0.3s;
          letter-spacing: 0.5px;
        }
        .pdp-service-btn.orange-outline {
          border: 1px solid #2C2520;
          background: transparent;
          color: #2C2520;
        }
        .pdp-service-btn.orange-outline:hover {
          background: #2C2520;
          color: #FFFFFF;
        }

        /* Trust Icons Strip */
        .pdp-trust-strip {
          display: flex;
          justify-content: space-around;
          margin-bottom: 24px;
          border: 1px solid #EAE5E0;
          border-radius: 12px;
          padding: 16px 12px;
          background: #FFFFFF;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
        }
        .pdp-trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .pdp-trust-icon { font-size: 24px; }
        .pdp-trust-label {
          font-size: 10px;
          font-weight: 700;
          color: #2C2520;
          text-align: center;
          max-width: 70px;
          line-height: 1.3;
        }

        /* xCLusive points */
        .pdp-xclusive-banner {
          background: linear-gradient(135deg, #2C2520, #1F1A17);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(44, 37, 32, 0.15);
        }
        .pdp-xclusive-text {
          font-size: 13px;
          font-weight: 500;
          color: #FAF8F6;
          line-height: 1.5;
        }
        .pdp-xclusive-text strong { color: #A98E73; }
        .pdp-xclusive-coin { font-size: 32px; }

        /* Product Details Tabs */
        .pdp-details-tabs {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          background: #FAF8F6;
        }
        .pdp-tab-row {
          display: flex;
          border-bottom: 1px solid #EAE5E0;
          margin-bottom: 30px;
          gap: 16px;
        }
        .pdp-tab-btn {
          padding: 14px 28px;
          font-size: 13px;
          font-weight: 700;
          color: #8C827A;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.3s;
        }
        .pdp-tab-btn:hover {
          color: #2C2520;
        }
        .pdp-tab-btn.active {
          color: #2C2520;
        }
        .pdp-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #2C2520;
        }

        .pdp-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .pdp-detail-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #FFFFFF;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #EAE5E0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
        }
        .pdp-detail-group-title {
          font-size: 13px;
          font-weight: 700;
          color: #2C2520;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid #EAE5E0;
        }
        .pdp-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .pdp-detail-key { color: #8C827A; }
        .pdp-detail-val { font-weight: 600; color: #2C2520; }

        /* Certification logos */
        .pdp-cert-strip {
          display: flex;
          gap: 30px;
          align-items: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #EAE5E0;
        }
        .pdp-cert-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .pdp-cert-icon { font-size: 32px; }
        .pdp-cert-name {
          font-size: 11px;
          font-weight: 700;
          color: #2C2520;
          text-align: center;
        }
        .pdp-cert-sub {
          font-size: 10px;
          color: #8C827A;
          text-align: center;
        }

        /* Related Products */
        .pdp-related-section {
          background: #FFFFFF;
          padding: 60px 24px;
          border-top: 1px solid #EAE5E0;
        }
        .pdp-related-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .pdp-related-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #2C2520;
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .pdp-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .pdp-related-card {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #EAE5E0;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
        }
        .pdp-related-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(44, 37, 32, 0.08);
          border-color: #A98E73;
        }
        .pdp-related-img-wrapper {
          position: relative;
          overflow: hidden;
          height: 180px;
          background: #FAF8F6;
        }
        .pdp-related-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          padding: 0;
          transition: transform 0.3s;
        }
        .pdp-related-img-wrapper:hover .card-arrow-overlay {
          opacity: 1;
        }
        .card-arrow-overlay {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 3;
        }
        .card-slider-arrow {
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-weight: bold;
          font-size: 14px;
          color: #634d40;
          border: none;
          cursor: pointer;
        }
        .pdp-related-card:hover .pdp-related-img {
          transform: scale(1.02);
        }
        .pdp-related-info {
          padding: 16px;
        }
        .pdp-related-name {
          font-size: 13px;
          font-weight: 600;
          color: #2C2520;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pdp-related-prices {
          display: flex;
          gap: 8px;
          align-items: baseline;
        }
        .pdp-related-price {
          font-size: 14px;
          font-weight: 700;
          color: #2C2520;
        }
        .pdp-related-old-price {
          font-size: 11px;
          text-decoration: line-through;
          color: #8C827A;
        }

        /* Sticky bottom bar on scroll */
        .pdp-sticky-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-bottom: 1px solid #EAE5E0;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 9000;
          transform: translateY(-100%);
          transition: transform 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .pdp-sticky-bar.visible {
          transform: translateY(0);
        }
        .pdp-sticky-product-img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          border-radius: 6px;
          background: #FAF8F6;
          border: 1px solid #EAE5E0;
        }
        .pdp-sticky-name {
          font-size: 13px;
          font-weight: 600;
          color: #2C2520;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 250px;
        }
        .pdp-sticky-price {
          font-size: 15px;
          font-weight: 700;
          color: #2C2520;
        }
        .pdp-sticky-sep { flex-grow: 1; }
        .pdp-sticky-size-sel {
          border: 1px solid #EAE5E0;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #2C2520;
          outline: none;
          cursor: pointer;
          background: #FFFFFF;
        }
        .pdp-sticky-add-btn {
          background: #2C2520;
          color: #FFFFFF;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.3s;
        }
        .pdp-sticky-add-btn:hover { background: #A98E73; }

        /* Modal */
        .pdp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(44,37,32,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .pdp-modal-box {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 480px;
          position: relative;
          box-shadow: 0 20px 50px rgba(44, 37, 32, 0.15);
          animation: pdpModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pdp-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 20px;
          color: #8C827A;
          cursor: pointer;
          background: none;
          border: none;
          line-height: 1;
          transition: color 0.2s;
        }
        .pdp-modal-close:hover { color: #2C2520; }
        .pdp-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #2C2520;
          margin-bottom: 8px;
        }
        .pdp-modal-sub {
          font-size: 13px;
          color: #8C827A;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .pdp-modal-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #EAE5E0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          margin-bottom: 16px;
          box-sizing: border-box;
          background: #FAF8F6;
          transition: border-color 0.3s;
        }
        .pdp-modal-input:focus { border-color: #A98E73; }
        .pdp-modal-label {
          font-size: 11px;
          font-weight: 600;
          color: #2C2520;
          display: block;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-modal-submit {
          width: 100%;
          background: #2C2520;
          color: #FFFFFF;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(44,37,32,0.15);
          transition: all 0.3s;
        }
        .pdp-modal-submit:hover {
          background: #A98E73;
          box-shadow: 0 6px 18px rgba(169, 142, 115, 0.25);
        }
        .pdp-modal-success {
          text-align: center;
          padding: 30px 0;
          color: #4B7955;
          font-size: 15px;
          font-weight: 600;
        }

        /* Video call */
        .pdp-video-screen {
          background: #1F1A17;
          border-radius: 12px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        .pdp-video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pdp-spinner {
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #A98E73;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: pdpSpin 1s linear infinite;
        }
        .pdp-call-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .pdp-ctrl-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          color: #FFFFFF;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.2s;
        }
        .pdp-ctrl-btn:hover { transform: scale(1.05); }

        @keyframes pdpModalIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pdpSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1000px) {
          .pdp-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .pdp-info-col {
            position: static;
            max-height: none;
            overflow-y: visible;
            padding-right: 0;
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
          <div className="pdp-sticky-price">₹{currentPrice.toLocaleString('en-IN')}</div>
        </div>
        {showSizing && (
          <>
            <div className="pdp-sticky-sep" />
            <select
              className="pdp-sticky-size-sel"
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
            >
              {activeSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </>
        )}
        <button className="pdp-sticky-add-btn" onClick={handleAddToCart}>
          ADD TO BAG
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <span onClick={() => { window.location.hash = ''; }}>Home</span>
        <ChevronRight size={10} style={{ color: '#8C827A' }} />
        <span onClick={() => { window.location.hash = '#' + (product.category || 'rings').toLowerCase().replace(/ /g, '-'); }}>
          {product.category || 'Rings'}
        </span>
        {product.subcategory && (
          <>
            <ChevronRight size={10} style={{ color: '#8C827A' }} />
            <span onClick={() => { window.location.hash = '#' + (product.category || 'rings').toLowerCase().replace(/ /g, '-') + '?subcategory=' + product.subcategory.toLowerCase().replace(/ /g, '-'); }}>
              {product.subcategory}
            </span>
          </>
        )}
        <ChevronRight size={10} style={{ color: '#8C827A' }} />
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
            <div 
              className="pdp-main-img-wrap"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="pdp-main-img"
                style={{
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transition: isZoomed ? 'none' : 'transform 0.3s ease, transform-origin 0.3s ease',
                  cursor: 'zoom-in'
                }}
              />
              <div className="pdp-popular-badge">
                <Star size={11} style={{ display: 'inline', verticalAlign: '-1px', fill: 'currentColor', marginRight: '4px' }} />
                9k+ bought this
              </div>
              <div className="pdp-main-zoom-icon" title="Zoom image">
                <Maximize2 size={16} />
              </div>
            </div>
          </div>
          {/* Lifestyle mosaic removed since we only show backend images */}
        </div>

        {/* RIGHT: Product Info */}
        <div className="pdp-info-col">
          {/* Popular badge */}
          <div className="pdp-popular-tag">
            <Star size={12} style={{ display: 'inline', fill: 'currentColor', verticalAlign: 'middle', marginRight: '4px' }} />
            9k+ bought this
          </div>

          {/* Rating */}
          <div className="pdp-rating-row">
            <div className="pdp-rating-pill">
              <Star size={14} className="pdp-star-icon" style={{ fill: 'currentColor' }} />
              {rating} &nbsp;|&nbsp; {reviews.toLocaleString('en-IN')} Ratings
            </div>
          </div>

          {/* Price */}
          <div className="pdp-price-row">
            <span className="pdp-current-price">₹{currentPrice.toLocaleString('en-IN')}</span>
            {originalPrice > currentPrice && (
              <span className="pdp-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <div className="pdp-tax-note">(MRP Inclusive of all taxes)</div>

          <div className="pdp-product-name">{product.name}</div>
          <div className="pdp-offer-tag">
            <Sparkles size={14} style={{ display: 'inline', color: '#A98E73', verticalAlign: '-2px', marginRight: '4px' }} />
            Flat {savingsPct}% off on Making Charges
          </div>

          {/* Customise selectors */}
          <div className="pdp-customise-box">
            {showSizing && (
              <div className="pdp-custom-item">
                <span className="pdp-custom-label">Size</span>
                <select
                  className="pdp-custom-select"
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                >
                  {activeSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
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

          {/* Sizing guide */}
          {showSizing && (
            <div className="pdp-ring-size-row">
              <span>{isRing ? 'Not sure about your ring size?' : 'Not sure about your bangle size?'}</span>
              <span className="pdp-learn-how-link" onClick={() => setSizingVideoOpen(true)} style={{ cursor: 'pointer' }}>LEARN HOW ▶</span>
            </div>
          )}

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
              {isWishlisted ? <Heart size={20} style={{ fill: '#A98E73', color: '#A98E73' }} /> : <Heart size={20} />}
            </button>
            <button className="pdp-icon-btn" title="Share">
              <Share2 size={20} />
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
                <MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                Locate Me
              </button>
            </div>
          </form>

          {pincodeMsg && (
            <div className={`pdp-pincode-msg ${pincodeMsg.includes('❌') ? 'error' : ''}`}>
              {pincodeMsg}
            </div>
          )}

          <div className="pdp-delivery-info-row">
            <Calendar size={14} style={{ color: '#8C827A' }} />
            <span>Expected Delivery Date — Enter pincode to check</span>
          </div>

          {/* Service Cards */}
          <div className="pdp-trial-store-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="pdp-service-card">
              <div className="pdp-service-icon">
                <Store size={22} style={{ color: '#A98E73' }} />
              </div>
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
              <div className="pdp-trust-icon">
                <ShieldCheck size={26} style={{ color: '#A98E73' }} />
              </div>
              <div className="pdp-trust-label">100% Certified</div>
            </div>
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">
                <RotateCcw size={26} style={{ color: '#A98E73' }} />
              </div>
              <div className="pdp-trust-label">15 Day Money-Back</div>
            </div>
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">
                <Repeat size={26} style={{ color: '#A98E73' }} />
              </div>
              <div className="pdp-trust-label">Lifetime Exchange</div>
            </div>
            <div className="pdp-trust-item">
              <div className="pdp-trust-icon">
                <Shield size={26} style={{ color: '#A98E73' }} />
              </div>
              <div className="pdp-trust-label">One Year Warranty</div>
            </div>
          </div>

          {/* xCLusive Points */}
          <div className="pdp-xclusive-banner">
            <div className="pdp-xclusive-text">
              Earn <strong>{xPoints} xCLusive points</strong> with this order<br />
              <span style={{ fontSize: '10px', color: '#837890' }}>1 xCLusive point = ₹1</span>
            </div>
            <div className="pdp-xclusive-coin">
              <Coins size={28} style={{ color: '#A98E73' }} />
            </div>
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

        {activeTab === 'details' && (() => {
          const netWeight = pricingDetails.goldWeight || product.gold_weight || product.weight || 0;
          const grossWeight = netWeight + ((product.diamond_weight || 0) + (product.gemstone_weight || 0)) * 0.2;
          const displayKarat = selectedMetal.toLowerCase().includes("platinum") ? "Platinum" : (selectedMetal.toLowerCase().includes("silver") ? "Silver" : `${selectedMetal.split(' ')[0]} KT`);
          const displayColor = selectedMetal.toLowerCase().includes("platinum") ? "Platinum" : (selectedMetal.toLowerCase().includes("silver") ? "Silver" : (selectedMetal.includes('Yellow') ? 'Yellow' : selectedMetal.includes('Rose') ? 'Rose' : 'White'));
          
          return (
            <div className="pdp-details-grid">
              <div className="pdp-detail-group">
                <div className="pdp-detail-group-title">
                  <Sparkles size={14} style={{ color: '#A98E73', marginRight: '6px' }} /> Gold
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Karat</span>
                  <span className="pdp-detail-val">{displayKarat}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Colour</span>
                  <span className="pdp-detail-val">{displayColor}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Net Weight</span>
                  <span className="pdp-detail-val">{netWeight.toFixed(3)} g</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Gross Weight</span>
                  <span className="pdp-detail-val">{grossWeight.toFixed(3)} g</span>
                </div>
              </div>

              <div className="pdp-detail-group">
                <div className="pdp-detail-group-title">
                  <Gem size={14} style={{ color: '#A98E73', marginRight: '6px' }} /> Diamond
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Quality</span>
                  <span className="pdp-detail-val">{selectedDiamond}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Total Weight</span>
                  <span className="pdp-detail-val">{product.diamond_weight || 0} ct</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Setting</span>
                  <span className="pdp-detail-val">Hand Setting</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Number</span>
                  <span className="pdp-detail-val">{product.noof_gem || 0} Diamonds</span>
                </div>
              </div>

              <div className="pdp-detail-group">
                <div className="pdp-detail-group-title">
                  <Ruler size={14} style={{ color: '#A98E73', marginRight: '6px' }} /> Dimensions
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Ring Size</span>
                  <span className="pdp-detail-val">{selectedSize}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Width</span>
                  <span className="pdp-detail-val">{product.width ? `${product.width} mm` : 'N/A'}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Height</span>
                  <span className="pdp-detail-val">{product.height ? `${product.height} mm` : 'N/A'}</span>
                </div>
              </div>

              <div className="pdp-detail-group">
                <div className="pdp-detail-group-title">
                  <Info size={14} style={{ color: '#A98E73', marginRight: '6px' }} /> About
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">SKU</span>
                  <span className="pdp-detail-val">ZNR-{product.product_code || product._id || product.id}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Material</span>
                  <span className="pdp-detail-val">{product.material || product.product_type || 'Gold & Diamond'}</span>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Manufacturer</span>
                  <span className="pdp-detail-val">Zoniraz Pvt. Ltd.</span>
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'price' && (
          <div className="pdp-details-grid">
            <div className="pdp-detail-group">
              <div className="pdp-detail-group-title">Price Breakup</div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Gold Value</span>
                <span className="pdp-detail-val">₹{pricingDetails.goldCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Diamond Value</span>
                <span className="pdp-detail-val">₹{pricingDetails.diamondCost.toLocaleString('en-IN')}</span>
              </div>
              {pricingDetails.gemstoneCost > 0 && (
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">Gemstone Value</span>
                  <span className="pdp-detail-val">₹{pricingDetails.gemstoneCost.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pdp-detail-row">
                <span className="pdp-detail-key">Making Charges</span>
                <span className="pdp-detail-val">₹{pricingDetails.makingCharges.toLocaleString('en-IN')}</span>
              </div>
              {pricingDetails.gst > 0 && (
                <div className="pdp-detail-row">
                  <span className="pdp-detail-key">GST / Taxes</span>
                  <span className="pdp-detail-val">₹{pricingDetails.gst.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pdp-detail-row" style={{ borderTop: '1px solid #f0edf5', paddingTop: 10, marginTop: 4 }}>
                <span className="pdp-detail-key" style={{ fontWeight: 700, color: '#231535' }}>Total</span>
                <span className="pdp-detail-val" style={{ fontWeight: 700, color: '#5d463c' }}>₹{pricingDetails.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Certification Strip */}
        <div className="pdp-cert-strip">
          <div className="pdp-cert-item">
            <div className="pdp-cert-icon">
              <Award size={26} style={{ color: '#A98E73' }} />
            </div>
            <div className="pdp-cert-name">BIS*</div>
            <div className="pdp-cert-sub">Hallmarked Jewellery</div>
          </div>
          <div className="pdp-cert-item">
            <div className="pdp-cert-icon">
              <ShieldCheck size={26} style={{ color: '#A98E73' }} />
            </div>
            <div className="pdp-cert-name">100% certified by zoniraz</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="pdp-related-section">
        <div className="pdp-related-inner">
          <h2 className="pdp-related-title">You Might Also Like</h2>
          <div className="pdp-related-grid">
            {relatedProducts.map(p => {
              const activeImgIndex = relatedCardImageIndexes[p.id] || 0;
              return (
                <div
                  key={p.id}
                  className="pdp-related-card"
                  onClick={() => {
                    window.location.hash = `product-${p.id}`;
                  }}
                >
                  <div className="pdp-related-img-wrapper">
                    <img 
                      src={(p.images && p.images.length > 0) ? p.images[activeImgIndex] : p.image} 
                      alt={p.name} 
                      className="pdp-related-img" 
                    />
                    
                    {p.images && p.images.length > 1 && (
                      <div className="card-arrow-overlay" onClick={e => e.stopPropagation()}>
                        <button 
                          className="card-slider-arrow" 
                          onClick={(e) => prevRelatedCardImage(e, p.id, p.images.length)}
                          aria-label="Previous image"
                        >
                          ‹
                        </button>
                        <button 
                          className="card-slider-arrow" 
                          onClick={(e) => nextRelatedCardImage(e, p.id, p.images.length)}
                          aria-label="Next image"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="pdp-related-info">
                    <div className="pdp-related-name">{p.name}</div>
                    <div className="pdp-related-prices">
                      <span className="pdp-related-price">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
                      {Number(p.originalPrice || 0) > Number(p.price || 0) && (
                        <span className="pdp-related-old-price">₹{Number(p.originalPrice || 0).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Try at Home Modal */}
      {tryHomeOpen && (
        <div className="pdp-modal-overlay" onClick={() => setTryHomeOpen(false)}>
          <div className="pdp-modal-box" onClick={e => e.stopPropagation()}>
            <button className="pdp-modal-close" onClick={() => setTryHomeOpen(false)}>
              <X size={20} />
            </button>
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
            <button className="pdp-modal-close" onClick={() => setVideoOpen(false)}>
              <X size={20} />
            </button>
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
              <button className="pdp-ctrl-btn" style={{ background: '#5c4b6e', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => alert('Muted')}>
                <Mic size={18} />
              </button>
              <button className="pdp-ctrl-btn" style={{ background: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setVideoOpen(false)}>
                <PhoneOff size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sizing Video Modal */}
      {sizingVideoOpen && (
        <div className="pdp-modal-overlay" onClick={() => setSizingVideoOpen(false)}>
          <div 
            className="pdp-modal-box" 
            style={{ 
              width: '1470px', 
              maxWidth: '95vw', 
              height: '1000px', 
              maxHeight: '90vh', 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column',
              boxSizing: 'border-box'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <button className="pdp-modal-close" onClick={() => setSizingVideoOpen(false)}>✕</button>
            <h3 className="pdp-modal-title" style={{ marginBottom: 12 }}>How to Measure Your Size</h3>
            <div style={{ flex: 1, position: 'relative', width: '100%', borderRadius: 8, overflow: 'hidden', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                src={ringVideo}
                autoPlay
                loop
                playsInline
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
