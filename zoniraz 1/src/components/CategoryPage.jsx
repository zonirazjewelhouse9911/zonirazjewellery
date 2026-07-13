import React, { useState, useEffect, useContext } from 'react';
import { products as initialProducts } from '../data/products';
import { CartContext } from '../context/CartContext';

export default function CategoryPage({ category, wishlist = {}, setWishlist, cart = {}, setCart }) {
  const { addToCart } = useContext(CartContext);
  // Map category to product types in sidebar
  const categoryProductTypesMap = {
    "Rings": ['Rings', 'Band', 'Cluster', 'Floral'],
    "Earrings": ['Earrings', 'Studs', 'Hoops', 'Detachable'],
    "Bracelets & Bangles": ['Bracelet', 'Bangle', 'Charms'],
    "Solitaires": ['Solitaire', 'Ring', 'Set'],
    "Mangalsutras": ['Mangalsutra', 'Earrings', 'Combo'],
    "Necklaces & Pendants": ['Necklace', 'Pendant', 'Choker'],
    "Collections": ['Set', 'Pendant', 'Iconics']
  };

  const productTypes = categoryProductTypesMap[category] || [category];

  // Dynamic products from backend database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    setLoading(true);
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

          setProducts(fullyMapped);
        }
      })
      .catch(err => console.error('Error fetching categories products:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '');
      const [_, queryString] = fullHash.split('?');
      const params = {};
      if (queryString) {
        const parts = queryString.split('&');
        parts.forEach(part => {
          const [k, v] = part.split('=');
          if (k && v) params[k.toLowerCase()] = decodeURIComponent(v).toLowerCase();
        });
      }
      console.log('CategoryPage HashChange Params:', params);
      setQueryParams(params);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Filters State
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [discountOnly, setDiscountOnly] = useState(false);
  
  // Quick Filters (Capsules)
  const [activeCapsule, setActiveCapsule] = useState('All');
  
  // Sort State
  const [sortBy, setSortBy] = useState('Featured');

  // Interactive Card state
  const [cardImageIndexes, setCardImageIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  // Modals state
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedProductForDelivery, setSelectedProductForDelivery] = useState(null);
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const [tryHomeModalOpen, setTryHomeModalOpen] = useState(false);
  const [tryHomeProduct, setTryHomeProduct] = useState(null);
  const [tryHomeForm, setTryHomeForm] = useState({ name: '', phone: '', date: '' });
  const [tryHomeSuccess, setTryHomeSuccess] = useState(false);

  // Video call modal state
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callProduct, setCallProduct] = useState(null);
  const [callConnected, setCallConnected] = useState(false);

  // Accordion toggle states
  const [openAccordions, setOpenAccordions] = useState({
    size: window.innerWidth > 768,
    price: window.innerWidth > 768,
    discounts: window.innerWidth > 768,
    productType: window.innerWidth > 768,
    weight: window.innerWidth > 768,
    material: window.innerWidth > 768
  });

  // Reset filters on category change
  useEffect(() => {
    resetLocalFilters();
  }, [category]);

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Back to top scrolling
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter handlers
  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handlePriceChange = (range) => {
    setSelectedPrices(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const handleWeightChange = (weightRange) => {
    setSelectedWeights(prev => 
      prev.includes(weightRange) ? prev.filter(w => w !== weightRange) : [...prev, weightRange]
    );
  };

  const handleMaterialChange = (mat) => {
    setSelectedMaterials(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleProductTypeChange = (type) => {
    setSelectedProductTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const resetLocalFilters = () => {
    setSelectedSizes([]);
    setSelectedPrices([]);
    setSelectedWeights([]);
    setSelectedMaterials([]);
    setSelectedProductTypes([]);
    setDiscountOnly(false);
    setActiveCapsule('All');
  };

  const clearAllFilters = () => {
    resetLocalFilters();
    
    // Clear URL query parameters
    const categorySlug = category.toLowerCase().replace(/ /g, '-');
    window.location.hash = '#' + categorySlug;
  };

  // Toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Image Navigation on Card
  const nextCardImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setCardImageIndexes(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current + 1) % totalImages };
    });
  };

  const prevCardImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setCardImageIndexes(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current - 1 + totalImages) % totalImages };
    });
  };

  // Delivery checker submit
  const checkDelivery = (e) => {
    e.preventDefault();
    if (!deliveryPincode || deliveryPincode.length < 6) {
      setDeliveryMessage("Please enter a valid 6-digit pincode.");
      return;
    }
    const isFast = selectedProductForDelivery?.fastDelivery;
    if (isFast) {
      setDeliveryMessage(`Express Delivery available! Guaranteed delivery in 24-48 hours to ${deliveryPincode}.`);
    } else {
      setDeliveryMessage(`Standard Delivery available. Estimated delivery by 3-5 business days to ${deliveryPincode}.`);
    }
  };

  // Try at home submit
  const handleTryHomeSubmit = (e) => {
    e.preventDefault();
    if (!tryHomeForm.name || !tryHomeForm.phone || !tryHomeForm.date) {
      alert("Please fill in all details.");
      return;
    }
    setTryHomeSuccess(true);
    setTimeout(() => {
      setTryHomeModalOpen(false);
      setTryHomeSuccess(false);
      setTryHomeForm({ name: '', phone: '', date: '' });
    }, 2500);
  };

  // Connect video call simulation
  useEffect(() => {
    let timer;
    if (callModalOpen) {
      setCallConnected(false);
      timer = setTimeout(() => {
        setCallConnected(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [callModalOpen]);

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    // Filter by Category (case-insensitive, hyphen-insensitive, singular/plural safe)
    if (product.category && category) {
      const prodCatClean = String(product.category).toLowerCase().replace(/[^a-z0-9]/g, '');
      const pageCatClean = String(category).toLowerCase().replace(/[^a-z0-9]/g, '');
      let isMatch = (prodCatClean === pageCatClean);
      if (!isMatch) {
        if (prodCatClean.endsWith('s') && prodCatClean.slice(0, -1) === pageCatClean) isMatch = true;
        if (pageCatClean.endsWith('s') && pageCatClean.slice(0, -1) === prodCatClean) isMatch = true;
      }
      if (!isMatch) return false;
    } else {
      return false;
    }

    // Filter by URL subcategory query param
    const targetSubcategory = queryParams.subcategory || queryParams.style;
    if (targetSubcategory) {
      const sub = String(product.subcategory || '');
      if (!sub) return false;
      
      const subSlug = sub.toLowerCase().replace(/ /g, '-').trim();
      const targetSlug = String(targetSubcategory).trim();
      const isMatch = (subSlug === targetSlug || subSlug.includes(targetSlug) || targetSlug.includes(subSlug));
      console.log(`Subcategory Match Check: product=${product.name}, sub=${sub}, subSlug=${subSlug}, targetSlug=${targetSlug}, isMatch=${isMatch}`);
      if (!isMatch) {
        return false;
      }
    }

    // Filter by URL gender query param
    if (queryParams.gender) {
      const gen = String(product.gender || '');
      if (!gen.toLowerCase().includes(queryParams.gender)) return false;
    }

    // Filter by URL stone query param
    if (queryParams.stone) {
      const mat = String(product.material || '');
      if (!mat.toLowerCase().includes(queryParams.stone)) return false;
    }

    // Filter by URL metal query param
    if (queryParams.metal) {
      const mat = String(product.material || '').toLowerCase().replace(/-/g, ' ');
      const targetMetal = String(queryParams.metal).replace(/-/g, ' ');
      if (!mat.includes(targetMetal)) return false;
    }

    // Filter by URL price range query params
    if (queryParams.minprice) {
      if (product.price < Number(queryParams.minprice)) return false;
    }
    if (queryParams.maxprice) {
      if (product.price > Number(queryParams.maxprice)) return false;
    }

    // Size Filter
    if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) return false;

    // Price Filter (Sidebar checkboxes)
    if (selectedPrices.length > 0) {
      const priceMatches = selectedPrices.some(range => {
        if (range === 'under-5000') return product.price < 10000;
        if (range === '10001-15000') return product.price >= 10001 && product.price <= 15000;
        if (range === '15001-30000') return product.price >= 15001 && product.price <= 30000;
        if (range === 'over-30000') return product.price > 30000;
        return false;
      });
      if (!priceMatches) return false;
    }

    // Weight Filter
    if (selectedWeights.length > 0) {
      const weightMatches = selectedWeights.some(range => {
        if (range === '0-2g') return product.weight <= 2;
        if (range === '2-5g') return product.weight > 2 && product.weight <= 5;
        if (range === '5-10g') return product.weight > 5 && product.weight <= 10;
        if (range === '10-20g') return product.weight > 10;
        return false;
      });
      if (!weightMatches) return false;
    }

    // Material Filter
    if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) return false;
    
    // Product Type Filter (using Substring matching on product name)
    if (selectedProductTypes.length > 0) {
      const matchesType = selectedProductTypes.some(type => {
        const nameLower = product.name.toLowerCase();
        const typeLower = type.toLowerCase();
        if (nameLower.includes(typeLower)) return true;
        if (typeLower.endsWith('s') && nameLower.includes(typeLower.slice(0, -1))) return true;
        if (nameLower.includes(typeLower + 's')) return true;
        return false;
      });
      if (!matchesType) return false;
    }

    // Capsules
    if (activeCapsule === 'Fast Delivery' && !product.fastDelivery) return false;
    if (activeCapsule === 'Latest Designs' && !product.latest) return false;
    if (activeCapsule === 'Store Pickup' && !product.storePickup) return false;
    if (activeCapsule === 'Try at Home' && !product.tryAtHome) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Discounts: High to Low') {
      const aDisc = ((a.originalPrice - a.price) / a.originalPrice);
      const bDisc = ((b.originalPrice - b.price) / b.originalPrice);
      return bDisc - aDisc;
    }
    return a.id - b.id;
  });

  const totalActiveFilters = selectedSizes.length + selectedPrices.length + selectedWeights.length + selectedMaterials.length + selectedProductTypes.length + (discountOnly ? 1 : 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f3e6de', borderTop: '3px solid #634d40', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#8c7365', fontSize: '14px', fontWeight: '500' }}>Loading products...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="rings-page-wrapper">
      <style>{`
        .rings-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #634d40;
          min-height: 100vh;
          position: relative;
        }

        .rings-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 20px 24px;
        }

        /* Breadcrumb & Heading */
        .rings-breadcrumb {
          font-size: 11px;
          color: #837890;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          margin-top: 15px;
        }
        .rings-breadcrumb a {
          color: #837890;
          transition: color 0.2s;
        }
        .rings-breadcrumb a:hover {
          color: #634d40;
        }
        .rings-header-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid #d4c5bd;
          padding-bottom: 16px;
        }
        .rings-title {
          font-size: 26px;
          font-weight: 700;
          color: #634d40;
        }
        .rings-count {
          font-size: 16px;
          color: #8a6a58;
          font-weight: 400;
        }

        /* Quick Filter Capsules */
        .capsules-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .capsule-btn {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid #d4c5bd;
          font-size: 13px;
          font-weight: 500;
          color: #634d40;
          background: #fff;
          transition: all 0.2s ease-in-out;
        }
        .capsule-btn:hover {
          border-color: #634d40;
          background-color: #f7f0ee;
        }
        .capsule-btn.active {
          background-color: #f7f0ee;
          border-color: #634d40;
          color: #634d40;
          box-shadow: 0 2px 6px rgba(99,77,64,0.15);
        }

        /* Top Filter Action Row */
        .filters-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .filters-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .filters-label {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          text-transform: uppercase;
        }
        .filters-count-badge {
          background-color: #f7f0ee;
          color: #634d40;
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 700;
          margin-left: 6px;
        }
        .clear-all-btn {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          background: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .clear-all-btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        .active-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #f7f0ee;
          color: #634d40;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 14px;
          border: 1px solid #d4c5bd;
        }
        .badge-chip button {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 12px;
          color: #634d40;
          font-weight: 700;
          display: flex;
          align-items: center;
        }

        .sort-select-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sort-label {
          font-size: 13px;
          color: #8a6a58;
        }
        .sort-dropdown {
          padding: 8px 12px;
          border: 1px solid #d4c5bd;
          border-radius: 6px;
          color: #634d40;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          background: #fff;
        }
        .sort-dropdown:focus {
          border-color: #634d40;
        }

        /* Two-Column Grid Setup */
        .rings-layout {
          display: flex;
          gap: 28px;
        }
        .filters-sidebar {
          width: 250px;
          flex-shrink: 0;
          border-right: 1px solid #d4c5bd;
          padding-right: 20px;
          position: sticky;
          top: 175px;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        .filters-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .filters-sidebar::-webkit-scrollbar-thumb {
          background: #d4c5bd;
          border-radius: 2px;
        }
        .sidebar-filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #d4c5bd;
          margin-bottom: 12px;
        }
        .sidebar-active-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #d4c5bd;
        }
        .products-header-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
        }
        .filter-section {
          border-bottom: 1px solid #d4c5bd;
          padding: 16px 0;
        }
        .filter-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .filter-section-header h4 {
          font-size: 14px;
          font-weight: 700;
          color: #634d40;
          text-transform: uppercase;
          margin: 0;
        }
        .filter-arrow {
          font-size: 10px;
          transition: transform 0.2s;
        }
        .filter-arrow.collapsed {
          transform: rotate(-90deg);
        }
        .filter-options-content {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          cursor: pointer;
        }
        .checkbox-label input {
          accent-color: #634d40;
          cursor: pointer;
        }
        .checkbox-count {
          font-size: 11px;
          color: #8a6a58;
          margin-left:auto;
        }

        /* Product Cards Grid */
        .products-grid-container {
          flex-grow: 1;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .product-card {
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(99,77,64,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(99,77,64,0.12);
        }

        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #fff;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .wishlist-btn svg {
          width: 18px;
          height: 18px;
          stroke: #634d40;
          fill: none;
          transition: fill 0.2s, stroke 0.2s;
        }
        .wishlist-btn.active svg {
          fill: #634d40;
          stroke: #634d40;
        }

        .product-img-wrapper {
          position: relative;
          width: 100%;
          padding-top: 100%;
          background-color: #fdfdfd;
          overflow: hidden;
        }
        .product-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.3s ease;
          padding: 10px;
          z-index: 1;
        }
        .product-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .product-img-wrapper.video-playing .product-video {
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
        .product-img-wrapper:hover .card-arrow-overlay {
          opacity: 1;
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
        .try-icon-overlay {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #fff;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
        }
        .try-icon-overlay svg {
          width: 16px;
          height: 16px;
          stroke: #634d40;
        }

        .product-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }
        .current-price {
          font-size: 16px;
          font-weight: 700;
          color: #634d40;
        }
        .original-price {
          font-size: 13px;
          text-decoration: line-through;
          color: #b09585;
        }
        .discount-pct {
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
        }

        .check-delivery-link {
          font-size: 12px;
          color: #634d40;
          font-weight: 600;
          background: none;
          border: none;
          text-align: left;
          padding: 0;
          margin-bottom: 8px;
          cursor: pointer;
          display: inline-block;
          align-self: flex-start;
        }
        .check-delivery-link:hover {
          text-decoration: underline;
        }

        .product-title {
          font-size: 13px;
          color: #8a6a58;
          line-height: 1.4;
          margin-bottom: 12px;
          flex-grow: 1;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .try-home-btn {
          flex: 1;
          border: 1px solid #634d40;
          background-color: transparent;
          color: #634d40;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          transition: all 0.2s;
          text-transform: uppercase;
          cursor: pointer;
        }
        .try-home-btn:hover {
          background-color: #634d40;
          color: #fff;
        }
        
        .video-call-btn {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid #634d40;
          color: #634d40;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          background: transparent;
          cursor: pointer;
        }
        .video-call-btn:hover {
          background-color: #f7f0ee;
          border-color: #634d40;
        }
        .video-call-btn svg {
          width: 18px;
          height: 18px;
        }

        .floating-chat-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #634d40;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(99,77,64,0.3);
          cursor: pointer;
          z-index: 999;
          transition: transform 0.2s;
        }
        .floating-chat-btn:hover {
          transform: scale(1.08);
        }
        .floating-chat-btn svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }

        .floating-scroll-top {
          position: fixed;
          bottom: 95px;
          right: 30px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #fff;
          border: 1px solid #d4c5bd;
          color: #634d40;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          z-index: 999;
          transition: all 0.3s;
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }
        .floating-scroll-top.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(35, 21, 53, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.25s ease-out;
        }
        .modal-content {
          background-color: #fff;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 440px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          position: relative;
          animation: scaleUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 20px;
          color: #8a6a58;
          cursor: pointer;
          background: none;
          border: none;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 12px;
        }
        .delivery-form {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .modal-input {
          flex-grow: 1;
          padding: 10px 14px;
          border: 1px solid #d4c5bd;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
        }
        .modal-input:focus {
          border-color: #634d40;
        }
        .modal-submit-btn {
          background-color: #634d40;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .delivery-response {
          margin-top: 14px;
          font-size: 13px;
          color: #634d40;
          font-weight: 500;
          line-height: 1.5;
        }

        .try-home-form-group {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .try-home-form-group label {
          font-size: 12px;
          font-weight: 600;
          color: #634d40;
        }
        .try-home-form-btn {
          width: 100%;
          background-color: #634d40;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          margin-top: 14px;
          cursor: pointer;
        }
        .try-home-success-msg {
          text-align: center;
          color: #634d40;
          font-weight: 600;
          font-size: 15px;
          padding: 12px;
        }

        .video-call-screen {
          width: 100%;
          height: 240px;
          background-color: #1a0f26;
          border-radius: 8px;
          margin-top: 14px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .consultant-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .user-pip-video {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 60px;
          height: 80px;
          background-color: #634d40;
          border: 2px solid #fff;
          border-radius: 4px;
          z-index: 10;
          overflow: hidden;
        }
        .video-call-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 16px;
        }
        .circle-control-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          border: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .empty-results {
          text-align: center;
          padding: 60px 20px;
          border: 1px dashed #c4aa9f;
          border-radius: 10px;
          background: #f7f0ee;
        }
        .empty-results h3 {
          font-size: 18px;
          color: #634d40;
          margin-bottom: 8px;
        }
        .empty-results p {
          color: #8a6a58;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .rings-layout {
            flex-direction: column;
          }
          .filters-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #d4c5bd;
            padding-right: 0;
            padding-bottom: 20px;
            position: static;
            max-height: none;
            overflow-y: visible;
          }
        }
        @media (max-width: 600px) {
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
        }
      `}</style>

      <div className="rings-container">
        {/* Breadcrumbs */}
        <div className="rings-breadcrumb">
          <a href="#">Home</a> &gt; <a href={`#${category.toLowerCase().split(' ')[0]}`}>Jewellery</a> &gt; <span style={{ color: '#634d40', fontWeight: '600' }}>{category}</span>
        </div>

        {/* Title */}
        <div className="rings-header-row">
          <h1 className="rings-title">{category}</h1>
          <span className="rings-count">{sortedProducts.length} Designs</span>
        </div>

        {/* Capsules quick filters */}
        <div className="capsules-bar">
          {['All', 'Fast Delivery', 'Latest Designs', 'Store Pickup'].map((cap) => (
            <button
              key={cap}
              className={`capsule-btn ${activeCapsule === cap ? 'active' : ''}`}
              onClick={() => setActiveCapsule(cap)}
            >
              {cap}
            </button>
          ))}
        </div>

        {/* Outer Layout wrapper */}
        <div className="rings-layout">
          {/* Sidebar */}
          <aside className="filters-sidebar">
            {/* Filter Action Header */}
            <div className="sidebar-filters-header">
              <span className="filters-label">
                Filters
                {totalActiveFilters > 0 && <span className="filters-count-badge">{totalActiveFilters}</span>}
              </span>
              <button className="clear-all-btn" onClick={clearAllFilters}>CLEAR ALL</button>
            </div>

            {/* Badges Stack */}
            <div className="sidebar-active-badges">
              <span className="badge-chip">
                {category}
                <button disabled>✕</button>
              </span>
              {selectedSizes.map(size => (
                <span className="badge-chip" key={`sz-${size}`}>
                  Size: {size}
                  <button onClick={() => handleSizeChange(size)}>✕</button>
                </span>
              ))}
              {selectedPrices.map(price => (
                <span className="badge-chip" key={`pr-${price}`}>
                  Price: {price.replace('-', ' - ').replace('under-5000', 'Under 10K').replace('over-30000', 'Over 30K')}
                  <button onClick={() => handlePriceChange(price)}>✕</button>
                </span>
              ))}
              {selectedWeights.map(w => (
                <span className="badge-chip" key={`wt-${w}`}>
                  Weight: {w}
                  <button onClick={() => handleWeightChange(w)}>✕</button>
                </span>
              ))}
              {selectedMaterials.map(m => (
                <span className="badge-chip" key={`mat-${m}`}>
                  {m}
                  <button onClick={() => handleMaterialChange(m)}>✕</button>
                </span>
              ))}
              {selectedProductTypes.map(pt => (
                <span className="badge-chip" key={`pt-${pt}`}>
                  {pt}
                  <button onClick={() => handleProductTypeChange(pt)}>✕</button>
                </span>
              ))}
            </div>
            
            {/* Size Accordion */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleAccordion('size')}>
                <h4>Size</h4>
                <span className={`filter-arrow ${openAccordions.size ? '' : 'collapsed'}`}>▼</span>
              </div>
              {openAccordions.size && (
                <div className="filter-options-content">
                  {[5, 11, 12, 13].map(size => (
                    <label key={size} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                      />
                      <span>Size {size}</span>
                      <span className="checkbox-count">
                        ({products.filter(p => String(p.category).toLowerCase().replace(/[^a-z0-9]/g, '') === String(category).toLowerCase().replace(/[^a-z0-9]/g, '') && Number(p.size) === Number(size)).length})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Accordion */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleAccordion('price')}>
                <h4>Price</h4>
                <span className={`filter-arrow ${openAccordions.price ? '' : 'collapsed'}`}>▼</span>
              </div>
              {openAccordions.price && (
                <div className="filter-options-content">
                  {[
                    { label: "Under ₹10,000", value: "under-5000" },
                    { label: "₹10,001 - ₹15,000", value: "10001-15000" },
                    { label: "₹15,001 - ₹30,000", value: "15001-30000" },
                    { label: "Over ₹30,000", value: "over-30000" }
                  ].map(pItem => (
                    <label key={pItem.value} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedPrices.includes(pItem.value)}
                        onChange={() => handlePriceChange(pItem.value)}
                      />
                      <span>{pItem.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Product Type Accordion */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleAccordion('productType')}>
                <h4>Product Type</h4>
                <span className={`filter-arrow ${openAccordions.productType ? '' : 'collapsed'}`}>▼</span>
              </div>
              {openAccordions.productType && (
                <div className="filter-options-content">
                  {productTypes.map(type => (
                    <label key={type} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedProductTypes.includes(type)}
                        onChange={() => handleProductTypeChange(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Weight Accordion */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleAccordion('weight')}>
                <h4>Weight Ranges</h4>
                <span className={`filter-arrow ${openAccordions.weight ? '' : 'collapsed'}`}>▼</span>
              </div>
              {openAccordions.weight && (
                <div className="filter-options-content">
                  {[
                    { label: "0-2 g", value: "0-2g" },
                    { label: "2-5 g", value: "2-5g" },
                    { label: "5-10 g", value: "5-10g" },
                    { label: "10-20 g", value: "10-20g" }
                  ].map(wItem => (
                    <label key={wItem.value} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedWeights.includes(wItem.value)}
                        onChange={() => handleWeightChange(wItem.value)}
                      />
                      <span>{wItem.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Material Accordion */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleAccordion('material')}>
                <h4>Material</h4>
                <span className={`filter-arrow ${openAccordions.material ? '' : 'collapsed'}`}>▼</span>
              </div>
              {openAccordions.material && (
                <div className="filter-options-content">
                  {['Platinum', 'Gold', 'Diamond', 'Gemstone'].map(mat => (
                    <label key={mat} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedMaterials.includes(mat)}
                        onChange={() => handleMaterialChange(mat)}
                      />
                      <span>{mat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </aside>

          {/* Product Grid Area */}
          <main className="products-grid-container">
            {/* Sort Dropdown Header Row */}
            <div className="products-header-row">
              <div className="sort-select-wrapper">
                <span className="sort-label">Sort By:</span>
                <select 
                  className="sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Discounts: High to Low">Discounts: High to Low</option>
                </select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="empty-results">
                <h3>No designs match your criteria</h3>
                <p>Try clearing some filters or modifying selection to find your perfect match.</p>
                <button 
                  className="capsule-btn active" 
                  style={{ marginTop: '16px' }}
                  onClick={clearAllFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((product) => {
                  const activeImgIndex = cardImageIndexes[product.id] || 0;
                  const isWishlisted = wishlist[product.id] || false;
                  const isHovered = hoveredCard === product.id;
                  
                  return (
                    <article 
                      className="product-card" 
                      key={product.id}
                      onMouseEnter={() => setHoveredCard(product.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => { window.location.hash = `product-${product.id}`; }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Wishlist Icon */}
                      <button 
                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        aria-label="Add to wishlist"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>

                      {/* Image & Video container */}
                      <div className={`product-img-wrapper ${isHovered ? 'video-playing' : ''}`}>
                        {/* Static image */}
                        <img 
                          src={product.images[activeImgIndex]} 
                          alt={product.name} 
                          className="product-img"
                        />
                        
                        {/* Interactive rotation video on hover */}
                        {isHovered && product.video && (
                          <video 
                            src={product.video} 
                            className="product-video"
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                          />
                        )}

                        {/* Slide Arrows */}
                        <div className="card-arrow-overlay" onClick={e => e.stopPropagation()}>
                          <button 
                            className="card-slider-arrow" 
                            onClick={(e) => prevCardImage(e, product.id, product.images.length)}
                            aria-label="Previous image"
                          >
                            ‹
                          </button>
                          <button 
                            className="card-slider-arrow" 
                            onClick={(e) => nextCardImage(e, product.id, product.images.length)}
                            aria-label="Next image"
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="product-info">
                        <div className="price-row">
                          <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          {product.originalPrice > product.price && (
                            <span className="discount-pct">
                              ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                            </span>
                          )}
                        </div>

                        <button 
                          className="check-delivery-link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductForDelivery(product);
                            setDeliveryModalOpen(true);
                            setDeliveryMessage('');
                          }}
                        >
                          Check Delivery Date
                        </button>

                        <h3 className="product-title">{product.name}</h3>

                        {/* Card actions */}
                        <div className="card-actions" onClick={e => e.stopPropagation()}>
                          <button 
                            className="video-call-btn"
                            style={{ borderColor: '#634d40', color: '#634d40', width: '100%', borderRadius: '4px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
                             onClick={(e) => {
                               e.stopPropagation();
                               addToCart(product, 1);
                               alert("Added to Shopping Bag!");
                             }}
                            title="Add to Shopping Bag"
                            aria-label="Add to shopping bag"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>ADD TO BAG</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Buttons */}
      <button 
        className={`floating-scroll-top ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ▲
      </button>


      {/* Delivery Check Modal */}
      {deliveryModalOpen && (
        <div className="modal-overlay" onClick={() => setDeliveryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setDeliveryModalOpen(false)}>✕</button>
            <h3 className="modal-title">Check Delivery Options</h3>
            <p style={{ fontSize: '13px', color: '#746380' }}>
              Check fastest shipping & Try-At-Home details for <strong>{selectedProductForDelivery?.name}</strong>.
            </p>
            <form onSubmit={checkDelivery} className="delivery-form">
              <input 
                type="text" 
                maxLength={6} 
                className="modal-input" 
                placeholder="Enter 6-digit Pincode"
                value={deliveryPincode}
                onChange={(e) => setDeliveryPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="modal-submit-btn">Check</button>
            </form>
            {deliveryMessage && (
              <div className="delivery-response" style={{ color: deliveryMessage.includes('Express') ? '#2e7d32' : '#634d40' }}>
                {deliveryMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book Try at Home Modal */}
      {tryHomeModalOpen && (
        <div className="modal-overlay" onClick={() => setTryHomeModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setTryHomeModalOpen(false)}>✕</button>
            <h3 className="modal-title">Book Free Try at Home</h3>
            <p style={{ fontSize: '13px', color: '#746380', marginBottom: '16px' }}>
              Try <strong>{tryHomeProduct?.name}</strong> in the comfort of your house, free of cost!
            </p>

            {tryHomeSuccess ? (
              <div className="try-home-success-msg">
                🎉 Trial Booked Successfully! Our advisor will contact you shortly to confirm the slot.
              </div>
            ) : (
              <form onSubmit={handleTryHomeSubmit}>
                <div className="try-home-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    required 
                    value={tryHomeForm.name}
                    onChange={(e) => setTryHomeForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="try-home-form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className="modal-input" 
                    pattern="[0-9]{10}"
                    placeholder="10-digit number"
                    required 
                    value={tryHomeForm.phone}
                    onChange={(e) => setTryHomeForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>
                <div className="try-home-form-group">
                  <label>Preferred Date</label>
                  <input 
                    type="date" 
                    className="modal-input" 
                    required 
                    value={tryHomeForm.date}
                    onChange={(e) => setTryHomeForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <button type="submit" className="try-home-form-btn">Confirm Free Trial Slot</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Call Consultation Modal */}
      {callModalOpen && (
        <div className="modal-overlay" onClick={() => setCallModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCallModalOpen(false)}>✕</button>
            <h3 className="modal-title">Live Video Consultation</h3>
            <p style={{ fontSize: '13px', color: '#746380' }}>
              Connect live with our store representative to view <strong>{callProduct?.name}</strong>.
            </p>

            <div className="video-call-screen">
              {!callConnected ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid #de3581',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px auto'
                  }} />
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Connecting to Showroom...</p>
                </div>
              ) : (
                <>
                  <video 
                    src="https://player.vimeo.com/external/384761655.sd.mp4?s=d00e70fa45778845e2da8ef2a6d71b3e9508fe51&profile_id=164&oauth2_token_id=57447761"
                    className="consultant-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="user-pip-video">
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#6e4b85', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px' }}>
                      You
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'inline-block' }} />
                    Live - Showroom Delhi
                  </div>
                </>
              )}
            </div>

            <div className="video-call-controls">
              <button 
                className="circle-control-btn" 
                style={{ backgroundColor: '#5c4b6e' }}
                onClick={() => alert("Microphone muted")}
              >
                🎙️
              </button>
              <button 
                className="circle-control-btn" 
                style={{ backgroundColor: '#f44336' }}
                onClick={() => setCallModalOpen(false)}
              >
                🛑
              </button>
            </div>
            
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
