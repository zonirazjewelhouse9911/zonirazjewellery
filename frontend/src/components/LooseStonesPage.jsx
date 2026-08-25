import React, { useState, useEffect, useContext } from 'react';
import { 
  Sparkles, 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  Award, 
  Check, 
  X, 
  ChevronRight, 
  Filter, 
  ArrowLeft,
  Gem,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { API_BASE_URL, getUploadsUrl } from '../config';
import './LooseStonesPage.css';

const SHAPES = [
  'All Shapes', 'Round', 'Princess', 'Emerald', 'Oval', 
  'Cushion', 'Pear', 'Radiant', 'Marquise', 'Heart'
];

const QUALITIES = [
  'All Qualities', 'VVS1', 'VVS2', 'EF-VVS', 'GH-VS', 'FG-SI', 'IJ-SI', 'VS1', 'VS2', 'IF'
];

export default function LooseStonesPage() {
  const { addToCart } = useContext(CartContext);
  const { formatPrice } = useCurrency();

  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedShape, setSelectedShape] = useState('All Shapes');
  const [selectedQuality, setSelectedQuality] = useState('All Qualities');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Quick View Modal State
  const [selectedStone, setSelectedStone] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToast, setAddedToast] = useState('');

  // Fetch loose stones from backend API
  const fetchStones = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/loose-stones`);
      const data = await res.json();
      if (data.success) {
        setStones(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load loose stones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStones();
  }, []);

  // Filter & Sort stones
  const filteredStones = stones.filter(stone => {
    const matchesTab = activeTab === 'all' || stone.stone_type === activeTab;
    const matchesShape = selectedShape === 'All Shapes' || stone.shape === selectedShape;
    const matchesQuality = selectedQuality === 'All Qualities' || stone.quality === selectedQuality;

    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      (stone.title || '').toLowerCase().includes(q) ||
      (stone.shape || '').toLowerCase().includes(q) ||
      (stone.quality || '').toLowerCase().includes(q) ||
      (stone.certificate_no || '').toLowerCase().includes(q) ||
      (stone.mine_name || '').toLowerCase().includes(q) ||
      (stone.country_of_origin || '').toLowerCase().includes(q);

    return matchesTab && matchesShape && matchesQuality && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'carat-high') return b.weight_carat - a.weight_carat;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Handle Add To Cart / Bag
  const handleAddToCart = (stone, e) => {
    if (e) e.stopPropagation();
    
    // Create compatible cart product object
    const cartProduct = {
      id: `stone_${stone._id}`,
      _id: stone._id,
      name: stone.title,
      product_title: stone.title,
      price: stone.price,
      originalPrice: stone.discount ? Math.round(stone.price * (1 + stone.discount / 100)) : stone.price,
      image: resolveStoneImage(stone),
      images: getStoneImageGallery(stone),
      is_loose_stone: true,
      stone_type: stone.stone_type,
      shape: stone.shape,
      weight_carat: stone.weight_carat,
      quality: stone.quality,
      color: stone.color,
      certificate_no: stone.certificate_no,
      mine_name: stone.mine_name,
      country_of_origin: stone.country_of_origin
    };

    addToCart(cartProduct, 1);
    showToast(`Added "${stone.title}" to your Shopping Bag!`);
  };

  // Immediate Buy Now handler
  const handleBuyNow = (stone, e) => {
    handleAddToCart(stone, e);
    window.location.href = '/cart';
  };

  const showToast = (msg) => {
    setAddedToast(msg);
    setTimeout(() => {
      setAddedToast('');
    }, 3500);
  };

  // Image Resolvers
  const resolveStoneImage = (stone) => {
    if (Array.isArray(stone.images) && stone.images.length > 0 && stone.images[0]) {
      return getUploadsUrl(stone.images[0]);
    }
    if (stone.image) {
      return getUploadsUrl(stone.image);
    }
    return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80';
  };

  const getStoneImageGallery = (stone) => {
    let list = [];
    if (Array.isArray(stone.images) && stone.images.length > 0) {
      list = stone.images.map(img => getUploadsUrl(img));
    } else if (stone.image) {
      list = [getUploadsUrl(stone.image)];
    }
    if (list.length === 0) {
      list.push('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80');
    }
    return list;
  };

  return (
    <div className="loose-stones-page-wrapper">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="stone-toast-notification">
          <CheckCircle2 size={18} />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="stone-hero-banner">
        <div className="stone-hero-content">
          <div className="stone-badge-pill">
            <Sparkles size={14} />
            <span>Direct Vault Sourcing</span>
          </div>
          <h1>Buy Certified Loose Diamonds, Solitaires & Gemstones</h1>
          <p>
            Explore our curated inventory of conflict-free loose diamonds, rare solitaires, and vibrant precious gemstones with GIA, IGI & SGL certification.
          </p>
          <div className="stone-trust-bar">
            <div className="trust-item">
              <Award size={18} />
              <span>100% Certified (GIA/IGI)</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={18} />
              <span>Lifetime Exchange</span>
            </div>
            <div className="trust-item">
              <Sparkles size={18} />
              <span>Direct Vault Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Controls Bar */}
      <section className="stone-filter-container">
        <div className="stone-filter-inner">
          
          {/* Stone Type Filter Tabs */}
          <div className="stone-category-tabs">
            {[
              { id: 'all', label: 'All Stones' },
              { id: 'solitaire', label: 'Solitaires' },
              { id: 'diamond', label: 'Diamonds' },
              { id: 'gemstone', label: 'Gemstones' },
              { id: 'color_stone', label: 'Color Stones' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`stone-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Select Filters */}
          <div className="stone-dropdown-filters">
            
            {/* Search Input */}
            <div className="stone-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search shape, carat, purity, cert no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Shape Filter */}
            <div className="stone-select-wrapper">
              <select value={selectedShape} onChange={e => setSelectedShape(e.target.value)}>
                {SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            {/* Quality Filter */}
            <div className="stone-select-wrapper">
              <select value={selectedQuality} onChange={e => setSelectedQuality(e.target.value)}>
                {QUALITIES.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="stone-select-wrapper">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="carat-high">Carat: High to Low</option>
              </select>
            </div>

          </div>

        </div>
      </section>

      {/* Main Grid Directory Listing */}
      <main className="stone-directory-section">
        <div className="stone-directory-header">
          <h2>
            Vault Loose Stones <span className="stone-count">({filteredStones.length})</span>
          </h2>
          <p>Hand-picked for exceptional clarity, brilliance, and precision cut.</p>
        </div>

        {loading ? (
          <div className="stone-loading-box">
            <div className="stone-spinner"></div>
            <span>Querying Vault Inventory...</span>
          </div>
        ) : filteredStones.length === 0 ? (
          <div className="stone-empty-box">
            <Gem size={48} className="empty-icon" />
            <h3>No Loose Stones Match Your Criteria</h3>
            <p>Try clearing filters or adjusting search terms to explore more vault inventory.</p>
            <button 
              onClick={() => {
                setActiveTab('all');
                setSelectedShape('All Shapes');
                setSelectedQuality('All Qualities');
                setSearchQuery('');
              }}
              className="reset-filters-btn"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="stone-grid">
            {filteredStones.map(stone => {
              const mainImg = resolveStoneImage(stone);
              return (
                <div 
                  key={stone._id} 
                  className="stone-card"
                  onClick={() => {
                    setSelectedStone(stone);
                    setActiveImageIndex(0);
                  }}
                >
                  
                  {/* Image & Badges */}
                  <div className="stone-card-media">
                    <img src={mainImg} alt={stone.title} loading="lazy" />
                    
                    <div className="stone-card-badges">
                      <span className="badge-category">{stone.stone_type.replace('_', ' ')}</span>
                      {stone.certificate_no && (
                        <span className="badge-cert">
                          <ShieldCheck size={12} />
                          <span>Certified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="stone-card-body">
                    <h3 className="stone-card-title">{stone.title}</h3>
                    
                    {/* Specs Pill List */}
                    <div className="stone-specs-grid">
                      <div className="spec-pill">
                        <span className="spec-label">Shape</span>
                        <span className="spec-val">{stone.shape}</span>
                      </div>
                      <div className="spec-pill">
                        <span className="spec-label">Carat</span>
                        <span className="spec-val">{stone.weight_carat} ct</span>
                      </div>
                      <div className="spec-pill">
                        <span className="spec-label">Quality</span>
                        <span className="spec-val">{stone.quality}</span>
                      </div>
                      <div className="spec-pill">
                        <span className="spec-label">Color</span>
                        <span className="spec-val">{stone.color}</span>
                      </div>
                    </div>

                    {/* Mine & Origin info */}
                    {(stone.mine_name || stone.country_of_origin) && (
                      <div className="stone-origin-text">
                        <Info size={13} />
                        <span>
                          {[stone.mine_name, stone.country_of_origin].filter(Boolean).join(' • ')}
                        </span>
                      </div>
                    )}

                    {/* Price & Action Row */}
                    <div className="stone-card-footer">
                      <div className="stone-price-box">
                        <span className="price-label">Price</span>
                        <span className="stone-price">{formatPrice(stone.price)}</span>
                      </div>

                      <div className="stone-action-group">
                        <button 
                          onClick={(e) => handleAddToCart(stone, e)} 
                          className="btn-add-bag"
                          title="Add to Shopping Bag"
                        >
                          <ShoppingBag size={15} />
                          <span>Add to Bag</span>
                        </button>
                        <button 
                          onClick={(e) => handleBuyNow(stone, e)} 
                          className="btn-buy-now"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick View / Detail Modal */}
      {selectedStone && (
        <div className="stone-modal-overlay" onClick={() => setSelectedStone(null)}>
          <div className="stone-modal-container" onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="stone-modal-close" onClick={() => setSelectedStone(null)}>
              <X size={20} />
            </button>

            <div className="stone-modal-grid">
              
              {/* Left Gallery */}
              <div className="stone-modal-gallery">
                <div className="stone-main-image-frame">
                  <img 
                    src={getStoneImageGallery(selectedStone)[activeImageIndex]} 
                    alt={selectedStone.title} 
                  />
                  {selectedStone.certificate_no && (
                    <div className="cert-watermark">
                      <ShieldCheck size={14} />
                      <span>{selectedStone.certificate_no} Verified</span>
                    </div>
                  )}
                </div>

                {getStoneImageGallery(selectedStone).length > 1 && (
                  <div className="stone-thumb-strip">
                    {getStoneImageGallery(selectedStone).map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                      >
                        <img src={url} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Details Info */}
              <div className="stone-modal-details">
                <div className="stone-modal-header">
                  <span className="stone-modal-cat">{selectedStone.stone_type.replace('_', ' ')}</span>
                  <h2>{selectedStone.title}</h2>
                  <div className="stone-modal-price">{formatPrice(selectedStone.price)}</div>
                </div>

                {/* Complete Specifications Table */}
                <div className="stone-specs-table-container">
                  <h4>Technical Specifications</h4>
                  <table className="stone-specs-table">
                    <tbody>
                      <tr>
                        <td>Shape</td>
                        <td><strong>{selectedStone.shape}</strong></td>
                      </tr>
                      <tr>
                        <td>Carat Weight</td>
                        <td><strong>{selectedStone.weight_carat} ct</strong></td>
                      </tr>
                      <tr>
                        <td>Purity / Quality</td>
                        <td><strong>{selectedStone.quality}</strong></td>
                      </tr>
                      <tr>
                        <td>Color Grade</td>
                        <td><strong>{selectedStone.color}</strong></td>
                      </tr>
                      <tr>
                        <td>Cut Grade</td>
                        <td><strong>{selectedStone.cut_grade || 'Excellent'}</strong></td>
                      </tr>
                      {selectedStone.certificate_no && (
                        <tr>
                          <td>Certificate No.</td>
                          <td><strong>{selectedStone.certificate_no}</strong></td>
                        </tr>
                      )}
                      {selectedStone.mine_name && (
                        <tr>
                          <td>Mine Name</td>
                          <td><strong>{selectedStone.mine_name}</strong></td>
                        </tr>
                      )}
                      {selectedStone.country_of_origin && (
                        <tr>
                          <td>Country of Origin</td>
                          <td><strong>{selectedStone.country_of_origin}</strong></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedStone.description && (
                  <div className="stone-description-box">
                    <h4>Description & Notes</h4>
                    <p>{selectedStone.description}</p>
                  </div>
                )}

                {/* Modal Action Buttons */}
                <div className="stone-modal-actions">
                  <button 
                    onClick={(e) => handleAddToCart(selectedStone, e)}
                    className="btn-modal-add"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </button>
                  <button 
                    onClick={(e) => handleBuyNow(selectedStone, e)}
                    className="btn-modal-buy"
                  >
                    Proceed to Buy
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
