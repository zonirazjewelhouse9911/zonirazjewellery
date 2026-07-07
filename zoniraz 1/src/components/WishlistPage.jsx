import React, { useState, useEffect } from 'react';
import { products } from '../data/products';

export default function WishlistPage({ products: propProducts = [], wishlist = {}, setWishlist }) {
  // Modal states
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  const [tryHomeModalOpen, setTryHomeModalOpen] = useState(false);
  const [tryHomeForm, setTryHomeForm] = useState({ name: '', phone: '', date: '' });
  const [tryHomeSuccess, setTryHomeSuccess] = useState(false);

  // Delivery check modal state
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliveryProduct, setDeliveryProduct] = useState(null);

  // Get wishlisted products
  const wishlistedIds = Object.keys(wishlist).filter(id => wishlist[id]);
  const wishlistedProducts = (propProducts && propProducts.length > 0 ? propProducts : products)
    .filter(p => wishlistedIds.includes(p.id.toString()));

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

  const handleTryHomeSubmit = (e) => {
    e.preventDefault();
    setTryHomeSuccess(true);
    setTimeout(() => {
      setTryHomeModalOpen(false);
      setTryHomeSuccess(false);
      setTryHomeForm({ name: '', phone: '', date: '' });
    }, 2500);
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (!deliveryPincode || deliveryPincode.length < 6) {
      setDeliveryMessage("Please enter a valid 6-digit pincode.");
      return;
    }
    setDeliveryMessage(`Standard Shipping available. Delivery in 3-5 days to ${deliveryPincode}.`);
  };

  const removeItem = (id) => {
    setWishlist(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="wishlist-page-wrapper">
      <style>{`
        .wishlist-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #634d40;
          min-height: 80vh;
        }

        .wishlist-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 20px 24px;
        }

        /* Header Info & Actions */
        .wishlist-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid #f0edf5;
          padding-bottom: 16px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .wishlist-title-area {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wishlist-breadcrumb {
          font-size: 11px;
          color: #837890;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-top: 15px;
        }
        .wishlist-breadcrumb a {
          color: #837890;
        }
        .wishlist-title {
          font-size: 24px;
          font-weight: 700;
          color: #634d40;
          text-transform: uppercase;
        }

        /* Top Action Buttons */
        .wishlist-actions-top {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .action-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-transform: uppercase;
          border: none;
        }
        .action-top-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .btn-green {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        .btn-purple {
          background-color: #ede2f7;
          color: #8E24AA;
        }

        /* Grid */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }

        /* Card */
        .wishlist-card {
          background: #fff;
          border-radius: 10px;
          border: 1px solid #d4c5bd;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .wishlist-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(116, 99, 128, 0.1);
        }

        .remove-wish-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #e1d8ea;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          color: #746380;
          z-index: 10;
          transition: all 0.2s;
        }
        .remove-wish-btn:hover {
          background-color: #de3581;
          color: #fff;
          border-color: #de3581;
        }

        .wishlist-img-wrapper {
          position: relative;
          width: 100%;
          padding-top: 100%;
          background-color: #fdfdfd;
        }
        .wishlist-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
        }

        /* Popular tag overlay */
        .popular-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: rgba(255, 243, 224, 0.95);
          color: #e65100;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ffe0b2;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Details */
        .wishlist-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .wishlist-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }
        .wishlist-current-price {
          font-size: 16px;
          font-weight: 700;
          color: #634d40;
        }
        .wishlist-original-price {
          font-size: 13px;
          text-decoration: line-through;
          color: #a498b0;
        }
        .wishlist-discount {
          font-size: 12px;
          font-weight: 700;
          color: #de3581;
        }
        .wishlist-prod-title {
          font-size: 13px;
          color: #8a6a58;
          line-height: 1.4;
          margin-bottom: 12px;
          flex-grow: 1;
        }

        .wishlist-card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .wishlist-try-btn {
          flex: 1;
          border: 1px solid #de3581;
          background: transparent;
          color: #de3581;
          padding: 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
        }
        .wishlist-try-btn:hover {
          background-color: #de3581;
          color: #fff;
        }
        .wishlist-delivery-btn {
          border: 1px solid #8E24AA;
          background: transparent;
          color: #8E24AA;
          padding: 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
        }
        .wishlist-delivery-btn:hover {
          background-color: #ede2f7;
        }

        /* Empty state */
        .empty-wishlist-view {
          text-align: center;
          padding: 80px 20px;
          border: 1px dashed #c4aa9f;
          border-radius: 12px;
          background-color: #f7f0ee;
          margin-top: 20px;
        }
        .empty-wishlist-view h3 {
          font-size: 20px;
          color: #634d40;
          margin-bottom: 10px;
        }
        .empty-wishlist-view p {
          color: #8a6a58;
          font-size: 14px;
          margin-bottom: 20px;
        }

        /* Modals */
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
        }
        .modal-content {
          background-color: #fff;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 460px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          position: relative;
          animation: scaleUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 20px;
          color: #746380;
          cursor: pointer;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #3b1954;
          margin-bottom: 12px;
        }
        .modal-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d4c8e3;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          margin-bottom: 12px;
        }
        .modal-input:focus {
          border-color: #8E24AA;
        }
        .modal-btn {
          width: 100%;
          background-color: #8E24AA;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
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
          background-color: #3b1954;
          border: 2px solid #fff;
          border-radius: 4px;
          z-index: 10;
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

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="wishlist-container">
        {/* Breadcrumb & Title */}
        <div className="wishlist-header-row">
          <div className="wishlist-title-area">
            <div className="wishlist-breadcrumb">
              <a href="#">Home</a> &gt; <span style={{ color: '#8E24AA', fontWeight: '600' }}>Wishlist</span>
            </div>
            <h1 className="wishlist-title">Your Wishlist</h1>
          </div>
        </div>

        {/* Catalog list */}
        {wishlistedProducts.length === 0 ? (
          <div className="empty-wishlist-view">
            <h3>Your Wishlist is Empty</h3>
            <p>Add some gorgeous diamond & gold rings to your wishlist and start styling!</p>
            <a href="#rings" className="action-top-btn btn-purple" style={{ textDecoration: 'none' }}>
              Shop Rings
            </a>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistedProducts.map(product => (
              <div className="wishlist-card" key={product.id}>
                {/* Delete button */}
                <button 
                  className="remove-wish-btn" 
                  onClick={() => removeItem(product.id)}
                  title="Remove from wishlist"
                  aria-label="Remove item"
                >
                  ✕
                </button>

                {/* Product image */}
                <div className="wishlist-img-wrapper">
                  <img src={product.image} alt={product.name} className="wishlist-img" />
                  <div className="popular-tag">
                    <span>★</span> 9k+ bought this
                  </div>
                </div>

                {/* Info */}
                <div className="wishlist-info">
                  <div className="wishlist-price-row">
                    <span className="wishlist-current-price">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="wishlist-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="wishlist-discount">
                      ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                    </span>
                  </div>
                  <h3 className="wishlist-prod-title">{product.name}</h3>

                  <div className="wishlist-card-actions">
                    <button 
                      className="wishlist-try-btn" 
                      onClick={() => setTryHomeModalOpen(true)}
                    >
                      Try to Home
                    </button>
                    <button 
                      className="wishlist-delivery-btn"
                      onClick={() => {
                        setDeliveryProduct(product);
                        setDeliveryModalOpen(true);
                        setDeliveryMessage('');
                      }}
                    >
                      Check Delivery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Call Modal */}
      {callModalOpen && (
        <div className="modal-overlay" onClick={() => setCallModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setCallModalOpen(false)}>✕</button>
            <h3 className="modal-title">Live Video Consultation</h3>
            <p style={{ fontSize: '13px', color: '#746380' }}>
              Connect live with our designer showroom to see your wishlisted pieces.
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
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Calling showroom advisor...</p>
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
                    Live Delhi Showroom
                  </div>
                </>
              )}
            </div>

            <div className="video-call-controls">
              <button className="circle-control-btn" style={{ backgroundColor: '#5c4b6e' }} onClick={() => alert("Muted mic")}>🎙️</button>
              <button className="circle-control-btn" style={{ backgroundColor: '#f44336' }} onClick={() => setCallModalOpen(false)}>🛑</button>
            </div>
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
              Select a date to try your wishlisted rings at home for free!
            </p>

            {tryHomeSuccess ? (
              <div className="try-home-success-msg">
                🎉 Try at Home booked successfully! Our executive will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleTryHomeSubmit}>
                <div className="try-home-form-group" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#4f3a61' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    required 
                    value={tryHomeForm.name}
                    onChange={(e) => setTryHomeForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="try-home-form-group" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#4f3a61' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    className="modal-input" 
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    required 
                    value={tryHomeForm.phone}
                    onChange={(e) => setTryHomeForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>
                <div className="try-home-form-group" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#4f3a61' }}>Preferred Date</label>
                  <input 
                    type="date" 
                    className="modal-input" 
                    required 
                    value={tryHomeForm.date}
                    onChange={(e) => setTryHomeForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <button type="submit" className="modal-btn" style={{ backgroundColor: '#de3581' }}>Confirm Appointment</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Check Delivery Modal */}
      {deliveryModalOpen && (
        <div className="modal-overlay" onClick={() => setDeliveryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setDeliveryModalOpen(false)}>✕</button>
            <h3 className="modal-title">Check Delivery</h3>
            <p style={{ fontSize: '13px', color: '#746380', marginBottom: '16px' }}>
              Check delivery options for <strong>{deliveryProduct?.name}</strong>.
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
    </div>
  );
}
