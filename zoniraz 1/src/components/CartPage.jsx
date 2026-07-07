import React, { useState, useContext } from 'react';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';

// Frequently bought together items (earrings, pendants, etc.)
const frequentlyBoughtItems = [
  {
    id: 101,
    name: "Lovely Blossom Stud Earrings",
    price: 21674,
    originalPrice: 26217,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=300&auto=format&fit=crop&q=60" // A beautiful stud earrings photo
  },
  {
    id: 102,
    name: "Aster Diamond Pendant",
    price: 18823,
    originalPrice: 23397,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=60" // A beautiful pendant photo
  },
  {
    id: 103,
    name: "Fresh Peppy Diamond Ring",
    price: 25965,
    originalPrice: 33085,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop&q=60"
  }
];

export default function CartPage({ products: propProducts = [], cart = {}, setCart }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');
  
  // Delivery Modal States
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryProduct, setDeliveryProduct] = useState(null);
  
  // Checkout Modal
  const [orderComplete, setOrderComplete] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('bag'); // 'bag' | 'trial'

  const { cartList, removeFromCart, updateQuantity, addToCart } = useContext(CartContext);

  // Cart item calculation
  const cartItemsCount = cartList.reduce((sum, item) => sum + item.quantity, 0);

  // Remove from cart
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // Update quantity
  const handleQtyChange = (id, newQty) => {
    updateQuantity(id, newQty);
  };

  // Add frequently bought item to cart
  const handleAddFBT = (item) => {
    addToCart(item, 1);
    alert(`${item.name} added to Shopping Bag!`);
  };

  // Apply Coupon
  const applyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'ZONIRAZ500' || couponCode.toUpperCase() === 'SAVE500') {
      setAppliedDiscount(500);
      setCouponMessage("🎉 Coupon applied! ₹500 off your order.");
    } else {
      setCouponMessage("❌ Invalid Coupon Code. Try ZONIRAZ500");
    }
  };

  // Check Pincode
  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeMessage(`✅ Shipping is available & free for Pincode: ${pincode}`);
    } else {
      setPincodeMessage("❌ Enter a valid 6-digit Pincode.");
    }
  };

  // Financial Calculations
  const cartItemIds = cartList.map(item => item.id.toString());
  let subtotal = 0;
  let savings = 0;

  cartItemIds.forEach(id => {
    // Find in products or FBT
    let item = (propProducts && propProducts.length > 0 ? propProducts : products).find(p => p.id.toString() === id);
    if (!item) {
      item = frequentlyBoughtItems.find(f => f.id.toString() === id);
    }
    if (item) {
      const cartItem = cartList.find(c => c.id.toString() === id);
      const qty = cartItem ? cartItem.quantity : 0;
      subtotal += item.originalPrice * qty;
      savings += (item.originalPrice - item.price) * qty;
    }
  });

  const totalCost = subtotal - savings - appliedDiscount;

  return (
    <div className="cart-page-wrapper">
      <style>{`
        .cart-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #634d40;
          min-height: 85vh;
          padding-bottom: 50px;
        }

        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        /* Tabs Selection Header */
        .cart-tabs-row {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .cart-tabs-pill {
          background: #e8ddd9;
          border-radius: 24px;
          padding: 4px;
          display: flex;
          gap: 4px;
        }
        .cart-tab-btn {
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .cart-tab-btn.active {
          background-color: #fff;
          color: #634d40;
          box-shadow: 0 2px 6px rgba(99,77,64,0.15);
        }
        .cart-tab-btn.inactive {
          background: transparent;
          color: #8a6a58;
        }

        /* Two Column Layout */
        .cart-layout {
          display: grid;
          grid-template-columns: 7fr 4fr;
          gap: 24px;
          align-items: start;
        }

        /* LEFT COLUMN */
        .cart-left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Video live banner */
        .live-consult-banner {
          background-color: #f7f0ee;
          border: 1px solid #d4c5bd;
          border-radius: 8px;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .live-banner-text {
          font-size: 13px;
          font-weight: 600;
          color: #634d40;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .live-banner-btn {
          background-color: #634d40;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 4px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
        }

        /* Cart Items Box */
        .cart-items-card {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          padding: 20px;
        }
        .cart-item-row {
          display: flex;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid #f0edf5;
          position: relative;
        }
        .cart-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .cart-item-row:first-child {
          padding-top: 0;
        }

        .cart-item-remove-btn {
          position: absolute;
          top: 0;
          right: 0;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #b2a8bd;
          transition: color 0.2s;
        }
        .cart-item-remove-btn:hover {
          color: #634d40;
        }

        .cart-item-img-wrap {
          width: 100px;
          height: 100px;
          border-radius: 6px;
          border: 1px solid #f0edf5;
          padding: 8px;
          background-color: #fff;
          position: relative;
        }
        .cart-item-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .cart-item-badge {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background-color: #f7f0ee;
          color: #634d40;
          font-size: 8px;
          font-weight: 700;
          padding: 2px 4px;
          border-radius: 2px;
          border: 1px solid #d4c5bd;
        }

        .cart-item-details {
          flex-grow: 1;
        }
        .cart-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #634d40;
          margin-bottom: 6px;
          max-width: 90%;
        }
        .cart-item-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;
        }
        .cart-item-price {
          font-size: 16px;
          font-weight: 700;
          color: #634d40;
        }
        .cart-item-old-price {
          font-size: 13px;
          text-decoration: line-through;
          color: #a498b0;
        }
        .cart-item-save {
          font-size: 12px;
          color: #634d40;
          font-weight: 700;
        }
        
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .qty-select-label {
          font-size: 12px;
          color: #8a6a58;
          font-weight: 500;
        }
        .qty-select {
          padding: 4px 8px;
          border: 1px solid #d4c5bd;
          border-radius: 4px;
          outline: none;
          font-size: 12px;
          font-weight: 600;
          color: #634d40;
          background: #fff;
          cursor: pointer;
        }

        .check-delivery-link {
          font-size: 12px;
          color: #634d40;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
        }

        /* Frequently bought together */
        .frequently-bought-card {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          padding: 20px;
        }
        .fbt-title {
          font-size: 15px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .fbt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }
        .fbt-item {
          border: 1px solid #f0edf5;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          background-color: #fff;
          position: relative;
        }
        .fbt-img {
          width: 100%;
          height: 100px;
          object-fit: contain;
          margin-bottom: 8px;
        }
        .fbt-name {
          font-size: 11px;
          font-weight: 600;
          color: #634d40;
          margin-bottom: 6px;
          line-height: 1.3;
          height: 32px;
          overflow: hidden;
        }
        .fbt-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }
        .fbt-price {
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
        }
        .fbt-old-price {
          font-size: 10px;
          text-decoration: line-through;
          color: #a498b0;
        }
        .fbt-add-btn {
          width: 100%;
          border: 1px solid #634d40;
          background: transparent;
          color: #634d40;
          font-size: 11px;
          font-weight: 700;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .fbt-add-btn:hover {
          background-color: #634d40;
          color: #fff;
        }

        /* RIGHT COLUMN */
        .cart-right-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Promo App banner */
        .promo-app-banner {
          background: linear-gradient(135deg, #f7f0ee 0%, #fff 100%);
          border: 1px solid #d4c5bd;
          border-radius: 8px;
          padding: 16px;
          position: relative;
        }
        .promo-title {
          font-size: 14px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 4px;
        }
        .promo-subtitle {
          font-size: 11px;
          color: #8a6a58;
          margin-bottom: 12px;
        }
        .promo-link {
          font-size: 12px;
          font-weight: 700;
          color: #634d40;
          text-decoration: none;
        }

        /* Coupon Section */
        .coupon-section-card {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          padding: 16px;
        }
        .coupon-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          cursor: pointer;
        }
        .coupon-title-row span:first-child {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .coupon-title-row span:last-child {
          font-size: 12px;
          color: #634d40;
          font-weight: 600;
        }
        .coupon-form {
          display: flex;
          gap: 8px;
        }
        .coupon-input {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #d4c8e3;
          border-radius: 4px;
          font-size: 13px;
          outline: none;
          text-transform: uppercase;
        }
        .coupon-input:focus {
          border-color: #634d40;
        }
        .coupon-btn {
          background-color: #634d40;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 700;
          cursor: pointer;
          font-size: 12px;
        }
        .coupon-msg {
          font-size: 12px;
          margin-top: 8px;
          font-weight: 600;
        }

        /* Pincode Section */
        .pincode-section-card {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          padding: 16px;
        }
        .pincode-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .pincode-title-row span:first-child {
          font-size: 13px;
          font-weight: 700;
          color: #634d40;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pincode-title-row span:last-child {
          font-size: 12px;
          color: #634d40;
          font-weight: 600;
          cursor: pointer;
        }
        .pincode-form {
          display: flex;
          gap: 8px;
        }

        /* Order Summary Card */
        .summary-card {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          padding: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #8a6a58;
          margin-bottom: 12px;
        }
        .summary-row.bold {
          font-weight: 700;
          color: #634d40;
          font-size: 15px;
          border-top: 1px solid #e8ddd9;
          padding-top: 14px;
          margin-top: 10px;
          margin-bottom: 0;
        }
        .place-order-btn {
          width: 100%;
          background-color: #634d40;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(99,77,64,0.25);
          transition: transform 0.2s, background-color 0.2s;
        }
        .place-order-btn:hover {
          background-color: #4a3830;
          transform: translateY(-1px);
        }

        /* Ribbon trust tags list */
        .trust-ribbon-card {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #d4c5bd;
          padding: 16px;
        }
        .trust-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          border-bottom: 1px solid #e8ddd9;
          padding-bottom: 14px;
          margin-bottom: 14px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          color: #634d40;
        }
        .trust-item-icon {
          font-size: 16px;
        }
        .payment-cards-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          opacity: 0.6;
          font-size: 18px;
        }

        /* EMPTY STATE PAGE DESIGN */
        .empty-cart-view {
          background-color: #fff;
          border-radius: 12px;
          border: 1px solid #d4c5bd;
          text-align: center;
          padding: 60px 20px;
        }
        .empty-illustration {
          width: 160px;
          height: 160px;
          margin: 0 auto 24px auto;
          position: relative;
        }
        .empty-illustration svg {
          width: 100%;
          height: 100%;
        }
        .empty-title {
          font-size: 22px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 8px;
        }
        .empty-subtitle {
          font-size: 13px;
          color: #8a6a58;
          margin-bottom: 30px;
        }
        .start-shopping-btn {
          background-color: #634d40;
          color: #fff;
          padding: 14px 48px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(99,77,64,0.25);
          display: inline-block;
          transition: transform 0.2s;
        }
        .start-shopping-btn:hover {
          transform: translateY(-2px);
        }

        /* Checkout Success Modal */
        .checkout-success-view {
          text-align: center;
          padding: 20px 10px;
        }
        .success-tick {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #f7f0ee;
          color: #634d40;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .success-title {
          font-size: 20px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 8px;
        }
        .success-desc {
          font-size: 13px;
          color: #8a6a58;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="cart-container">

        {cartItemsCount === 0 ? (
          /* EMPTY CART VIEW (Directly matching the illustration and text in the screenshot) */
          <div className="empty-cart-view">
            <div className="empty-illustration">
              {/* Delivery Person SVG vector carrying a box */}
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="50" cy="24" r="7" stroke="#3b1954" strokeWidth="2" />
                <path d="M50 31c-8 0-14 4-14 11v18h28V42c0-7-6-11-14-11z" fill="#ede2f7" stroke="#3b1954" strokeWidth="2" />
                <path d="M43 60v22m14-22v22" stroke="#3b1954" strokeWidth="2" />
                <rect x="34" y="44" width="32" height="15" rx="2" fill="#ffe0b2" stroke="#e65100" strokeWidth="1.5" />
                <line x1="50" y1="44" x2="50" y2="59" stroke="#e65100" strokeDasharray="2" />
                <path d="M28 42c0 0 6 3 8 0M72 42c0 0-6 3-8 0" stroke="#3b1954" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="empty-title">There is nothing here!</h2>
            <p className="empty-subtitle">Let's do some retail therapy.</p>
            <a href="#rings" className="start-shopping-btn">
              Start Shopping
            </a>
          </div>
        ) : (
          /* ACTIVE CART VIEW WITH PRODUCTS */
          <div className="cart-layout">
            
            {/* Left Column */}
            <div className="cart-left-col">
              
              {/* Items Card List */}
              <div className="cart-items-card">
                {cartList.map(product => {
                  const id = product.id;
                  const qty = product.quantity;
                  return (
                    <div className="cart-item-row" key={id}>
                      {/* Delete button */}
                      <button 
                        className="cart-item-remove-btn"
                        onClick={() => handleRemoveItem(product.id)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>

                      {/* Image Thumbnail */}
                      <div className="cart-item-img-wrap">
                        <img src={product.image} alt={product.name} className="cart-item-img" />
                        <span className="cart-item-badge">★ 1k+ bought this</span>
                      </div>

                      {/* Details */}
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{product.name}</h3>
                        <div className="cart-item-price-row">
                          <span className="cart-item-price">₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="cart-item-old-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          <span className="cart-item-save">
                            Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Action controllers */}
                        <div className="cart-item-actions">
                          <div>
                            <span className="qty-select-label">Quantity: </span>
                            <select 
                              className="qty-select"
                              value={qty}
                              onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value))}
                            >
                              {[1, 2, 3, 4, 5].map(q => (
                                <option key={q} value={q}>{q}</option>
                              ))}
                            </select>
                          </div>
                          <button 
                            className="check-delivery-link"
                            onClick={() => {
                              setDeliveryProduct(product);
                              setDeliveryModalOpen(true);
                              setDeliveryMessage('');
                            }}
                          >
                            Check Delivery Date
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Frequently Bought Together Panel */}
              <div className="frequently-bought-card">
                <h4 className="fbt-title">
                  <span>Frequently Bought Together</span>
                  <span style={{ fontSize: '12px', color: '#8E24AA', cursor: 'pointer' }}>▲</span>
                </h4>
                <div className="fbt-grid">
                  {frequentlyBoughtItems.map(item => (
                    <div className="fbt-item" key={item.id}>
                      <img src={item.image} alt={item.name} className="fbt-img" />
                      <h5 className="fbt-name">{item.name}</h5>
                      <div className="fbt-price-row">
                        <span className="fbt-price">₹{item.price.toLocaleString('en-IN')}</span>
                        <span className="fbt-old-price">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        className="fbt-add-btn"
                        onClick={() => handleAddFBT(item)}
                      >
                        + ADD
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="cart-right-col">
              
              {/* Promo app install banner */}
              <div className="promo-app-banner">
                <h4 className="promo-title">Get ₹500 off by completing your profile</h4>
                <p className="promo-subtitle">Just for you! Complete profile on the App.</p>
                <a href="#install" className="promo-link" onClick={(e) => { e.preventDefault(); alert("App profile features opened."); }}>
                  Install App &gt;
                </a>
              </div>

              {/* Apply Coupon code block */}
              <div className="coupon-section-card">
                <div className="coupon-title-row">
                  <span>🎟️ Apply Coupon</span>
                  <span>Coupon List</span>
                </div>
                <form onSubmit={applyCoupon} className="coupon-form">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code" 
                    className="coupon-input"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="coupon-btn">Apply</button>
                </form>
                {couponMessage && (
                  <div className="coupon-msg" style={{ color: couponMessage.includes('Invalid') ? '#f44336' : '#2e7d32' }}>
                    {couponMessage}
                  </div>
                )}
              </div>

              {/* Check Delivery pincode block */}
              <div className="pincode-section-card">
                <div className="pincode-title-row">
                  <span>📍 Check Delivery & Store Details</span>
                  <span>Enter Pincode</span>
                </div>
                <form onSubmit={handlePincodeSubmit} className="pincode-form">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode" 
                    className="coupon-input"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  />
                  <button type="submit" className="coupon-btn" style={{ backgroundColor: '#de3581' }}>Check</button>
                </form>
                {pincodeMessage && (
                  <div className="coupon-msg" style={{ color: pincodeMessage.includes('❌') ? '#f44336' : '#2e7d32' }}>
                    {pincodeMessage}
                  </div>
                )}
              </div>

              {/* Price Details Summary box */}
              <div className="summary-card">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row" style={{ color: '#2e7d32', fontWeight: '600' }}>
                  <span>You Saved</span>
                  <span>- ₹{savings.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="summary-row" style={{ color: '#2e7d32', fontWeight: '600' }}>
                    <span>Coupon Discount</span>
                    <span>- ₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping (Standard)</span>
                  <span style={{ color: '#2e7d32', fontWeight: '600' }}>Free</span>
                </div>
                <div className="summary-row bold">
                  <span>Total Cost</span>
                  <span>₹{totalCost.toLocaleString('en-IN')}</span>
                </div>

                <button 
                  className="place-order-btn"
                  onClick={() => {
                    window.location.hash = 'checkout';
                  }}
                >
                  Place Order
                </button>
              </div>

              {/* Bottom Trust Ribbon Card */}
              <div className="trust-ribbon-card">
                <div className="trust-list">
                  <div className="trust-item">
                    <span className="trust-item-icon">🔄</span>
                    <span>15 Day Exchange<br/><span style={{fontWeight:400,fontSize:'8px',color:'#746380'}}>On Online Orders</span></span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-item-icon">✔️</span>
                    <span>100% Certified</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-item-icon">🤝</span>
                    <span>Lifetime Exchange</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-item-icon">🛡️</span>
                    <span>One Year Warranty</span>
                  </div>
                </div>
                <div className="payment-cards-row">
                  <span>💳</span><span>🇺🇸</span><span>🇯🇵</span><span>🇪🇺</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Check Delivery Modal */}
      {deliveryModalOpen && (
        <div className="modal-overlay" onClick={() => setDeliveryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setDeliveryModalOpen(false)}>✕</button>
            <h3 className="modal-title">Check Delivery Options</h3>
            <p style={{ fontSize: '13px', color: '#746380', marginBottom: '16px' }}>
              Check delivery details for <strong>{deliveryProduct?.name}</strong>.
            </p>
            <form onSubmit={handleDeliverySubmit} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                maxLength={6} 
                className="modal-input" 
                style={{ marginBottom: 0 }}
                placeholder="Enter 6-digit Pincode"
                value={deliveryPincode}
                onChange={(e) => setDeliveryPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" className="modal-submit-btn" style={{ backgroundColor: '#8E24AA', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Check</button>
            </form>
            {deliveryMessage && (
              <div className="delivery-response" style={{ marginTop: '12px', fontSize: '13px', color: '#2e7d32', fontWeight: '600' }}>
                {deliveryMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Complete Checkout Modal */}
      {orderComplete && (
        <div className="modal-overlay" onClick={() => setOrderComplete(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setOrderComplete(false)}>✕</button>
            <div className="checkout-success-view">
              <div className="success-tick">✓</div>
              <h3 className="success-title">Order Placed Successfully!</h3>
              <p className="success-desc">
                Thank you for shopping at Zoniraz Jewels. Your order has been placed. We've sent details to your registered email & phone number.
              </p>
              <button className="modal-btn" onClick={() => setOrderComplete(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
