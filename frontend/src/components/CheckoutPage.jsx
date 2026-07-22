import React, { useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import AuthModal from './AuthModal';
import { ChevronRight, MapPin, Truck, Eye, CreditCard } from 'lucide-react';

const stores = [
  { id: 1, name: "Alwar Kabir Colony Showroom", address: "Tilak Market, 7, Hanuman Burj, Kabir Colony, Alwar, Rajasthan 301001", phone: "97848 36080", timing: "10 AM - 8 PM" },
  { id: 2, name: "Jaipur Palace Showroom", address: "M.I. Road, Opposite Palace Hall, Jaipur, Rajasthan 302001", phone: "98290 12345", timing: "10:30 AM - 8:30 PM" }
];

export default function CheckoutPage() {
  const { user, token, sendOtp, verifyOtp } = useContext(AuthContext);
  const { cartList, clearCart, subtotal, gst, shipping, discount, grandTotal, coupon, applyCoupon, removeCoupon } = useContext(CartContext);

  const [step, setStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState('');

  // Step 2: Shipping details
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: '', mobile: '', flatNumber: '', streetAddress: '', landmark: '', area: '', city: '', state: '', pincode: ''
  });
  const [saveAddressToDb, setSaveAddressToDb] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalType, setAddressModalType] = useState('add'); // 'add' | 'edit'
  const [addressForm, setAddressForm] = useState({
    fullName: '', mobile: '', flatNumber: '', streetAddress: '', landmark: '', area: '', city: '', state: '', pincode: '', isDefault: false
  });

  const handleAddressModalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const method = addressModalType === 'add' ? 'POST' : 'PUT';
      const url = addressModalType === 'add' 
        ? `${API_BASE_URL}/api/addresses`
        : `${API_BASE_URL}/api/addresses/${addressForm.id}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });
      const data = await res.json();
      if (res.ok) {
        // Refetch addresses
        const listRes = await fetch(`${API_BASE_URL}/api/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();
        setAddresses(listData);
        setSelectedAddressId(data.id);
        setShowAddressModal(false);
      } else {
        setError(data.error || 'Failed to save address');
      }
    } catch (err) {
      setError(err.message || 'Error saving address');
    }
  };

  // Step 3: Delivery Options
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' | 'pickup'
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0].id);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('12:00 PM');

  // Step 4: Coupon Box
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Step 5: Payments
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'cod'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);

  // Load addresses on step 2 if logged in
  useEffect(() => {
    if (token && step === 2) {
      fetch(`${API_BASE_URL}/api/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        const def = data.find(a => a.isDefault);
        if (def) setSelectedAddressId(def.id);
        else if (data.length > 0) setSelectedAddressId(data[0].id);
      })
      .catch(console.error);
    }
  }, [step, token]);

  // Auth Modal handlers
  useEffect(() => {
    if (step === 1) {
      if (user) {
        setStep(2);
      } else {
        setShowAuthModal(true);
      }
    }
  }, [step, user]);

  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/userSide/available-coupons`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setAvailableCoupons(resData.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleApplyPromo = async (e, codeOverride) => {
    if (e) e.preventDefault();
    const codeToApply = codeOverride || couponCode;
    if (!codeToApply) return;
    setCouponError('');
    try {
      await applyCoupon(codeToApply);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid Coupon Code');
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If using existing address
    if (selectedAddressId) {
      setStep(3);
      return;
    }

    // Save new address if checked
    if (saveAddressToDb && token) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newAddressForm)
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses(prev => [...prev, data]);
          setSelectedAddressId(data.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setStep(3);
  };

  const handleOrderSubmission = async () => {
    setIsProcessingPayment(true);
    setError('');

    const store = stores.find(s => s.id === selectedStoreId);

    const payload = {
      items: cartList,
      deliveryMethod,
      shippingFee: shipping,
      gstAmount: gst,
      couponDiscount: discount,
      grandTotal,
      deliveryEstimate: deliveryMethod === 'delivery' ? '5-7 Business Days' : null,
      storeDetails: deliveryMethod === 'pickup' ? {
        name: store.name,
        address: store.address,
        pickupDate,
        pickupTime
      } : null
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedOrderDetails(data);
        clearCart();
        setStep(6);
      } else {
        setError(data.error || 'Failed to submit order');
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Skip step 1 if logged in
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setStep(2);
  };

  if (cartList.length === 0 && step !== 6) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#efe7e5', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2b221d' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#746380', fontSize: '14px', marginTop: '10px' }}>Add beautiful items to checkout.</p>
        <button onClick={() => window.location.hash = ''} style={btnStyle}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper" style={{ backgroundColor: '#efe7e5', minHeight: '100vh', padding: '40px 24px 80px 24px', fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Checkout Header Wizard Tracker */}
        <style>{`
          .checkout-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 16px;
            border-bottom: 1px solid #d4c5bd;
          }
          .checkout-wizard {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12.5px;
            font-weight: 600;
            color: #a39084;
          }
          .checkout-step {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .checkout-step.active {
            color: #2b221d;
          }
          .checkout-step-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1.5px solid currentColor;
            font-size: 10px;
            font-weight: 700;
          }
          .checkout-chevron {
            color: #d4c5bd;
          }
          @media (max-width: 768px) {
            .checkout-header-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }
            .checkout-wizard {
              width: 100%;
              overflow-x: auto;
              white-space: nowrap;
              padding-bottom: 8px;
              -webkit-overflow-scrolling: touch;
              gap: 10px;
            }
            .checkout-step {
              flex-shrink: 0;
            }
          }
        `}</style>

        {/* Checkout Header Wizard Tracker */}
        <div className="checkout-header-row">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '500', color: '#2b221d', margin: 0 }}>Secure Checkout</h1>
          {step < 6 && (
            <div className="checkout-wizard">
              <span className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
                <span className="checkout-step-num"><MapPin size={11} /></span> Shipping
              </span>
              <ChevronRight size={14} className="checkout-chevron" />
              
              <span className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
                <span className="checkout-step-num"><Truck size={11} /></span> Delivery
              </span>
              <ChevronRight size={14} className="checkout-chevron" />
              
              <span className={`checkout-step ${step >= 4 ? 'active' : ''}`}>
                <span className="checkout-step-num"><Eye size={11} /></span> Review
              </span>
              <ChevronRight size={14} className="checkout-chevron" />
              
              <span className={`checkout-step ${step >= 5 ? 'active' : ''}`}>
                <span className="checkout-step-num"><CreditCard size={11} /></span> Payment
              </span>
            </div>
          )}
        </div>

        <div className="checkout-main-grid" style={{ gap: '30px', alignItems: 'start', gridTemplateColumns: step === 6 ? '1fr' : undefined }}>
          
          {/* LEFT SECTION: MAIN STEPS */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #dbcfcb', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            
            {/* STEP 1: AUTHENTICATION MODAL */}
            {step === 1 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: '#746380', marginBottom: '20px' }}>Authentication is required to proceed with checkout.</p>
                <button onClick={() => setShowAuthModal(true)} style={btnStyle}>Log In or Register</button>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
              </div>
            )}

            {/* STEP 2: SHIPPING DETAILS */}
            {step === 2 && (
              <form onSubmit={handleShippingSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={stepTitleStyle}>Shipping Address</h2>
                  <button 
                    type="button" 
                    onClick={() => {
                      setAddressModalType('add');
                      setAddressForm({ fullName: '', mobile: '', flatNumber: '', streetAddress: '', landmark: '', area: '', city: '', state: '', pincode: '', isDefault: false });
                      setShowAddressModal(true);
                    }} 
                    style={addAddrBtnStyle}
                  >
                    + ADD NEW ADDRESS
                  </button>
                </div>
                
                {addresses.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                    {addresses.map(addr => (
                      <div 
                        key={addr.id} 
                        className="checkout-address-card"
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          border: '1px solid #dbcfcb', 
                          padding: '18px 24px', 
                          borderRadius: '16px', 
                          backgroundColor: selectedAddressId === addr.id ? '#faf7f5' : '#fff', 
                          boxShadow: selectedAddressId === addr.id ? '0 4px 12px rgba(0,0,0,0.02)' : 'none', 
                          cursor: 'pointer' 
                        }} 
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} style={{ accentColor: '#c5a880' }} />
                          <span style={{ fontSize: '14px', color: '#2b221d', lineHeight: '1.6' }}>
                            <strong>{addr.fullName}</strong> {addr.isDefault && <span style={{ fontSize: '9px', backgroundColor: '#2b221d', color: '#fff', padding: '2px 6px', borderRadius: '8px', marginLeft: '5px', fontWeight: '700' }}>DEFAULT</span>}<br />
                            {addr.flatNumber}, {addr.streetAddress}, {addr.area}<br />
                            {addr.city}, {addr.state} - {addr.pincode} (Ph: {addr.mobile})
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddressModalType('edit');
                            setAddressForm(addr);
                            setShowAddressModal(true);
                          }} 
                          style={addrEditBtnStyle}
                        >
                          ✏️ Change / Edit
                        </button>
                      </div>
                    ))}
                    
                    <label style={{ display: 'flex', gap: '12px', border: '1px solid #dbcfcb', padding: '16px', borderRadius: '12px', cursor: 'pointer', backgroundColor: selectedAddressId === null ? '#faf7f5' : '#fff' }}>
                      <input type="radio" name="address" checked={selectedAddressId === null} onChange={() => setSelectedAddressId(null)} style={{ accentColor: '#c5a880', marginTop: '3px' }} />
                      <span style={{ fontSize: '13.5px', color: '#2b221d', fontWeight: '600' }}>Use a new shipping address</span>
                    </label>
                  </div>
                )}

                {(selectedAddressId === null || addresses.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #dbcfcb', padding: '24px', borderRadius: '16px', backgroundColor: '#faf7f5', marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#2b221d', margin: '0 0 10px 0' }}>Enter New Address Details</h3>
                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" required value={newAddressForm.fullName} onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Mobile Number</label>
                        <input type="tel" required value={newAddressForm.mobile} onChange={(e) => setNewAddressForm({ ...newAddressForm, mobile: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Flat / House Number</label>
                        <input type="text" required value={newAddressForm.flatNumber} onChange={(e) => setNewAddressForm({ ...newAddressForm, flatNumber: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Street Address</label>
                        <input type="text" required value={newAddressForm.streetAddress} onChange={(e) => setNewAddressForm({ ...newAddressForm, streetAddress: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Area / Colony</label>
                        <input type="text" required value={newAddressForm.area} onChange={(e) => setNewAddressForm({ ...newAddressForm, area: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Landmark (Optional)</label>
                        <input type="text" value={newAddressForm.landmark} onChange={(e) => setNewAddressForm({ ...newAddressForm, landmark: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>City</label>
                        <input type="text" required value={newAddressForm.city} onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>State</label>
                        <input type="text" required value={newAddressForm.state} onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Pincode</label>
                        <input type="text" maxLength={6} required value={newAddressForm.pincode} onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <input type="checkbox" id="saveAddress" checked={saveAddressToDb} onChange={(e) => setSaveAddressToDb(e.target.checked)} style={{ accentColor: '#c5a880' }} />
                      <label htmlFor="saveAddress" style={{ fontSize: '13px', color: '#746380' }}>Save this address to profile for future</label>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  style={{ ...btnStyle, marginTop: '15px' }}
                >
                  CONTINUE TO DELIVERY
                </button>
              </form>
            )}

            {/* STEP 3: DELIVERY METHOD & OPTIONS */}
            {step === 3 && (
              <div>
                <h2 style={stepTitleStyle}>Delivery Method</h2>
                
                {/* Method Toggles */}
                <div className="flex-wrap-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                  <button onClick={() => setDeliveryMethod('delivery')} style={{ ...deliveryMethodTabStyle, ...(deliveryMethod === 'delivery' ? deliveryMethodActiveStyle : {}) }}>
                    🏠 Home Delivery
                  </button>
                  <button onClick={() => setDeliveryMethod('pickup')} style={{ ...deliveryMethodTabStyle, ...(deliveryMethod === 'pickup' ? deliveryMethodActiveStyle : {}) }}>
                    🏪 Store Pickup
                  </button>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div style={{ border: '1px solid #dbcfcb', padding: '24px', borderRadius: '16px', backgroundColor: '#faf7f5' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#2b221d', fontSize: '15px', fontWeight: '600' }}>Standard Home Delivery</h4>
                    <p style={{ margin: '0', fontSize: '13px', color: '#746380', lineHeight: '1.6' }}>
                      Your package will be delivered fully insured to your doorstep within <strong>5-7 business days</strong>.<br />
                      Delivery Charges: <strong>{shipping === 0 ? 'FREE' : `₹${shipping}`}</strong>
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>Select Pickup Store</label>
                      <select value={selectedStoreId} onChange={(e) => setSelectedStoreId(parseInt(e.target.value))} style={inputStyle}>
                        {stores.map(store => (
                          <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Show selected store address details */}
                    {(() => {
                      const store = stores.find(s => s.id === selectedStoreId);
                      return (
                        <div style={{ border: '1px solid #dbcfcb', padding: '20px', borderRadius: '16px', backgroundColor: '#faf7f5', fontSize: '13px', color: '#746380' }}>
                          <p style={{ margin: '0 0 8px 0' }}><strong>Address:</strong> {store.address}</p>
                          <p style={{ margin: '0 0 8px 0' }}><strong>Phone:</strong> {store.phone}</p>
                          <p style={{ margin: '0' }}><strong>Timings:</strong> {store.timing}</p>
                        </div>
                      );
                    })()}

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Pickup Date</label>
                        <input type="date" required value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Pickup Time Slot</label>
                        <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} style={inputStyle}>
                          <option value="11:00 AM">11:00 AM – 1:00 PM</option>
                          <option value="1:00 PM">1:00 PM – 3:00 PM</option>
                          <option value="3:00 PM">3:00 PM – 5:00 PM</option>
                          <option value="5:00 PM">5:00 PM – 7:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-wrap-row" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button onClick={() => setStep(4)} style={btnStyle}>CONTINUE TO REVIEW</button>
                  <button onClick={() => setStep(2)} style={{ ...btnStyle, backgroundColor: '#a39084' }}>BACK</button>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER REVIEW */}
            {step === 4 && (
              <div>
                <h2 style={stepTitleStyle}>Review Your Order</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                  {cartList.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '20px', paddingBottom: '16px', borderBottom: '1px solid #f2ebe8' }}>
                      <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #dbcfcb' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#2b221d', fontWeight: '600' }}>{item.name}</h4>
                        <p style={{ margin: '0', fontSize: '12.5px', color: '#8c7365' }}>Purity: {item.selectedPurity || '18KT'}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#2b221d', fontWeight: '600' }}>
                          {item.quantity} x ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping / Delivery Details Preview */}
                <div className="checkout-address-preview-block" style={{ border: '1px solid #dbcfcb', borderRadius: '16px', padding: '20px', backgroundColor: '#faf7f5', marginBottom: '30px', fontSize: '13.5px', lineHeight: '1.6' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#2b221d', borderBottom: '1px solid #d4c5bd', paddingBottom: '6px', fontWeight: '600' }}>
                    {deliveryMethod === 'pickup' ? '🏪 Store Pickup Details' : '🏠 Shipping Address'}
                  </h4>
                  {deliveryMethod === 'pickup' ? (
                    (() => {
                      const store = stores.find(s => s.id === selectedStoreId);
                      return (
                        <div>
                          <p style={{ margin: '0 0 4px 0', color: '#2b221d' }}><strong>Store:</strong> {store ? store.name : ''}</p>
                          <p style={{ margin: '0 0 4px 0', color: '#746380' }}><strong>Address:</strong> {store ? store.address : ''}</p>
                          <p style={{ margin: '0 0 4px 0', color: '#746380' }}><strong>Date:</strong> {pickupDate || 'Not selected'}</p>
                          <p style={{ margin: '0', color: '#746380' }}><strong>Time Slot:</strong> {pickupTime}</p>
                        </div>
                      );
                    })()
                  ) : (
                    (() => {
                      const addr = selectedAddressId 
                        ? addresses.find(a => a.id === selectedAddressId)
                        : newAddressForm;
                      if (!addr || (!addr.fullName && !addr.streetAddress)) {
                        return <p style={{ margin: '0', color: '#8c7365', fontStyle: 'italic' }}>No address selected</p>;
                      }
                      return (
                        <div>
                          <p style={{ margin: '0 0 4px 0', color: '#2b221d' }}><strong>{addr.fullName}</strong></p>
                          <p style={{ margin: '0 0 4px 0', color: '#746380' }}>{addr.flatNumber ? `${addr.flatNumber}, ` : ''}{addr.streetAddress}, {addr.area}</p>
                          <p style={{ margin: '0 0 4px 0', color: '#746380' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p style={{ margin: '0', color: '#746380' }}><strong>Phone:</strong> {addr.mobile || addr.phone}</p>
                        </div>
                      );
                    })()
                  )}
                </div>

                <div className="flex-wrap-row" style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => setStep(5)} style={btnStyle}>PROCEED TO PAYMENT</button>
                  <button onClick={() => setStep(3)} style={{ ...btnStyle, backgroundColor: '#a39084' }}>BACK</button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENTS ACCORDION */}
            {step === 5 && (
              <div>
                <h2 style={stepTitleStyle}>Choose Payment Option</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  <label style={paymentLabelStyle(paymentMethod === 'card')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ accentColor: '#c5a880' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>💳 Credit / Debit Card (Visa, MasterCard, Amex)</span>
                  </label>
                  <label style={paymentLabelStyle(paymentMethod === 'upi')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ accentColor: '#c5a880' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>📱 UPI Gateway (GPay, PhonePe, Paytm)</span>
                  </label>
                  <label style={paymentLabelStyle(paymentMethod === 'cod')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ accentColor: '#c5a880' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>💵 Cash on Delivery (COD)</span>
                  </label>
                </div>

                {error && <div style={{ color: '#ff4d4f', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}

                <div className="flex-wrap-row" style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={handleOrderSubmission} disabled={isProcessingPayment} style={btnStyle}>
                    {isProcessingPayment ? 'PROCESSING PAYMENT...' : 'PLACE ORDER'}
                  </button>
                  <button onClick={() => setStep(4)} style={{ ...btnStyle, backgroundColor: '#a39084' }}>BACK</button>
                </div>
              </div>
            )}

            {/* STEP 6: ORDER SUCCESS SCREEN */}
            {step === 6 && completedOrderDetails && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <span style={{ fontSize: '64px' }}>🎉</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#2b221d', margin: '20px 0 10px 0' }}>
                  Thank you! Your Order is Placed
                </h2>
                <p style={{ color: '#746380', fontSize: '14px', margin: '0 0 30px 0' }}>
                  Your Order ID is <strong>{completedOrderDetails.orderId}</strong>. A confirmation message and invoice details have been emailed.
                </p>

                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '14px', border: '1px solid #dbcfcb', borderRadius: '16px', padding: '24px', backgroundColor: '#faf7f5', textAlign: 'left', minWidth: '320px', marginBottom: '40px' }}>
                  <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #d4c5bd', paddingBottom: '8px', color: '#2b221d' }}>Order Summary</h4>
                  <div style={summaryRowStyle}>
                    <span>Payment Status</span>
                    <span style={{ color: 'green', fontWeight: '700' }}>SUCCESS</span>
                  </div>
                  {completedOrderDetails.deliveryMethod === 'pickup' ? (
                    <div style={summaryRowStyle}>
                      <span>Pickup Venue</span>
                      <span>{completedOrderDetails.storeName}</span>
                    </div>
                  ) : (
                    <div style={summaryRowStyle}>
                      <span>Estimated Delivery</span>
                      <span>{completedOrderDetails.deliveryEstimate}</span>
                    </div>
                  )}
                  <div style={{ ...summaryRowStyle, borderTop: '1px dashed #d4c5bd', paddingTop: '10px', fontSize: '14px', fontWeight: '700' }}>
                    <span>Grand Total</span>
                    <span>₹{parseFloat(completedOrderDetails.grandTotal).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <button onClick={() => window.location.hash = ''} style={btnStyle}>CONTINUE SHOPPING</button>
                  <button onClick={() => window.location.hash = 'profile'} style={{ ...btnStyle, backgroundColor: '#c5a880' }}>VIEW ORDER HISTORY</button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR: ORDER PRICING SUMMARY CARD (SKIP IF STEP 6) */}
          {step < 6 && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #dbcfcb', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#2b221d', margin: '0 0 18px 0', borderBottom: '1px solid #f2ebe8', paddingBottom: '12px' }}>
                Price Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#746380', borderBottom: '1px solid #f2ebe8', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST (3%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Charges</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green', fontWeight: '600' }}>
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Promo code form */}
              {coupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eaffea', border: '1px solid #ccffcc', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12.5px', color: '#2e7d32', fontWeight: '700' }}>🎁 {coupon.code} APPLIED</div>
                    <div style={{ fontSize: '11px', color: '#388e3c' }}>You saved ₹{discount.toLocaleString('en-IN')}!</div>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#ff4d4f', fontSize: '11px', cursor: 'pointer', fontWeight: '800' }}>REMOVE</button>
                </div>
              ) : (
                <div style={{ marginBottom: '20px' }}>
                  <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input type="text" placeholder="Promo/Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} style={{ ...inputStyle, padding: '8px 12px', flex: 1, fontSize: '12.5px' }} />
                    <button type="submit" style={{ ...btnStyle, padding: '8px 16px', borderRadius: '8px' }}>Apply</button>
                  </form>

                  {/* Admin Available Offers List */}
                  {availableCoupons.length > 0 && (
                    <div style={{ backgroundColor: '#faf6f3', border: '1px solid #eee3dc', borderRadius: '8px', padding: '10px', marginTop: '8px' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#5d463c', textTransform: 'uppercase', marginBottom: '6px' }}>Available Offers set by Admin:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {availableCoupons.map((item) => {
                          const offerText = item.discountType === 'percentage' ? `${item.discountValue}% OFF` : `₹${item.discountValue} OFF`;
                          const minValText = item.minCartValue ? ` (Min order ₹${item.minCartValue})` : '';

                          return (
                            <div key={item._id || item.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e0d6d0', padding: '5px 8px', borderRadius: '5px' }}>
                              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#de3581' }}>{item.code} <span style={{ fontSize: '10.5px', color: '#666', fontWeight: 'normal' }}>- {offerText}{minValText}</span></span>
                              <button onClick={() => handleApplyPromo(null, item.code)} style={{ background: '#de3581', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>APPLY</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {couponError && <p style={{ color: '#ff4d4f', fontSize: '11px', margin: '-10px 0 14px 0' }}>{couponError}</p>}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#2b221d', borderBottom: '1px solid #f2ebe8', paddingBottom: '16px', marginBottom: '16px' }}>
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Address Form Popup Modal */}
      {showAddressModal && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <button onClick={() => setShowAddressModal(false)} style={modalCloseBtnStyle}>✕</button>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#2b221d', marginBottom: '20px' }}>
              {addressModalType === 'add' ? 'Add Delivery Address' : 'Edit Delivery Address'}
            </h3>
            
            <form onSubmit={handleAddressModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" required value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Mobile Number</label>
                  <input type="tel" required value={addressForm.mobile} onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Flat / House Number</label>
                  <input type="text" required value={addressForm.flatNumber} onChange={(e) => setAddressForm({ ...addressForm, flatNumber: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Street Address</label>
                  <input type="text" required value={addressForm.streetAddress} onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Area / Colony</label>
                  <input type="text" required value={addressForm.area} onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Landmark (Optional)</label>
                  <input type="text" value={addressForm.landmark || ''} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>City</label>
                  <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>State</label>
                  <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={labelStyle}>Pincode</label>
                  <input type="text" maxLength={6} required value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <input type="checkbox" id="modalDefault" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} style={{ accentColor: '#c5a880' }} />
                <label htmlFor="modalDefault" style={{ fontSize: '13px', color: '#746380' }}>Set as default delivery address</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" style={btnStyle}>SAVE ADDRESS</button>
                <button type="button" onClick={() => setShowAddressModal(false)} style={{ ...btnStyle, backgroundColor: '#a39084' }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling details
const stepTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '20px',
  fontWeight: '500',
  color: '#2b221d',
  marginBottom: '20px'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  color: '#8c7365',
  letterSpacing: '1px'
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #d4c5bd',
  backgroundColor: '#faf7f5',
  fontSize: '14px',
  color: '#2b221d',
  outline: 'none'
};

const btnStyle = {
  backgroundColor: '#2b221d',
  color: '#ffffff',
  padding: '12px 30px',
  borderRadius: '30px',
  border: 'none',
  fontSize: '12.5px',
  fontWeight: '600',
  letterSpacing: '1.5px',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const deliveryMethodTabStyle = {
  flex: 1,
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid #d4c5bd',
  backgroundColor: '#fff',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: '600',
  fontSize: '13.5px',
  color: '#8c7365',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s'
};

const deliveryMethodActiveStyle = {
  backgroundColor: '#2b221d',
  color: '#fff',
  border: '1px solid #2b221d'
};

const paymentLabelStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  border: '1px solid #dbcfcb',
  padding: '16px',
  borderRadius: '12px',
  cursor: 'pointer',
  backgroundColor: active ? '#faf7f5' : '#fff'
});

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12.5px',
  color: '#746380'
};

const addAddrBtnStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #2b221d',
  color: '#2b221d',
  padding: '8px 18px',
  borderRadius: '30px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: "'Montserrat', sans-serif"
};

const addrEditBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '12px',
  fontWeight: '600',
  color: '#c5a880',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontFamily: "'Montserrat', sans-serif"
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(43, 34, 29, 0.5)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
};

const modalCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #dbcfcb',
  padding: '40px',
  width: '580px',
  maxWidth: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  position: 'relative',
  fontFamily: "'Montserrat', sans-serif"
};

const modalCloseBtnStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#8c7365'
};
