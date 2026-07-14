import React, { useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

export default function UserDashboard() {
  const { user, token, logout, updateProfile, deleteAccount } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'orders'
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', mobile: '' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address creation/edit state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '', mobile: '', flatNumber: '', streetAddress: '', landmark: '', area: '', city: '', state: '', pincode: '', isDefault: false
  });

  // Track order details state
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  // Fetch Addresses
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/userSide/user_address_manager`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const mapped = (data || []).map(addr => ({
          id: addr._id,
          fullName: addr.name || '',
          mobile: addr.mobile || '',
          flatNumber: addr.house_number || '',
          streetAddress: addr.street_name || '',
          landmark: addr.landmark || '',
          area: addr.type || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.zipcode || '',
          isDefault: addr.primary || false
        }));
        setAddresses(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === 'addresses') fetchAddresses();
      if (activeTab === 'orders') fetchOrders();
    }
  }, [activeTab, token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action is irreversible.")) {
      try {
        await deleteAccount();
        window.location.hash = '';
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingAddressId;
      const url = isEdit 
        ? `${API_BASE_URL}/api/userSide/user_address_manager_update?_id=${editingAddressId}` 
        : `${API_BASE_URL}/api/userSide/user_address_add`;

      const payload = {
        name: addressForm.fullName,
        mobile: addressForm.mobile,
        house_number: addressForm.flatNumber,
        street_name: addressForm.streetAddress,
        landmark: addressForm.landmark,
        type: addressForm.area,
        city: addressForm.city,
        state: addressForm.state,
        zipcode: addressForm.pincode,
        primary: addressForm.isDefault
      };

      const res = await fetch(url, {
        method: 'POST', // Both add and update routes use POST on backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm({ fullName: '', mobile: '', flatNumber: '', streetAddress: '', landmark: '', area: '', city: '', state: '', pincode: '', isDefault: false });
        fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({ ...addr });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Delete this address?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/userSide/user_address_manager_delete?_id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchAddresses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#efe7e5', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2b221d' }}>Please Login to view Dashboard</h2>
        <button 
          onClick={() => window.location.hash = ''} 
          style={{
            backgroundColor: '#2b221d', color: '#fff', padding: '12px 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', marginTop: '20px', fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Go To Home
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page-wrapper" style={{ backgroundColor: '#efe7e5', minHeight: '100vh', padding: '40px 24px 80px 24px', fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', color: '#8c7365', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px', marginTop: '15px' }}>
          <a href="#" style={{ color: '#8c7365', textDecoration: 'none' }}>Home</a> &gt; <span style={{ color: '#2b221d', fontWeight: '600' }}>My Account</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '500', color: '#2b221d', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid #d4c5bd' }}>
          Welcome, {user.firstName}!
        </h1>

        <div className="dashboard-main-grid" style={{ gap: '30px', alignItems: 'start', gridTemplateColumns: undefined }}>
          {/* SIDEBAR TABS */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #dbcfcb', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <button onClick={() => setActiveTab('profile')} style={{ ...tabBtnStyle, ...(activeTab === 'profile' ? activeTabStyle : {}) }}>👤 My Profile</button>
            <button onClick={() => setActiveTab('addresses')} style={{ ...tabBtnStyle, ...(activeTab === 'addresses' ? activeTabStyle : {}) }}>📍 Saved Addresses</button>
            <button onClick={() => setActiveTab('orders')} style={{ ...tabBtnStyle, ...(activeTab === 'orders' ? activeTabStyle : {}) }}>📦 Order History</button>
            <button onClick={logout} style={{ ...tabBtnStyle, color: '#ff4d4f' }}>🚪 Secure Logout</button>
            <button onClick={handleDeleteAccount} style={{ ...tabBtnStyle, color: '#8c7365', fontSize: '11px', borderTop: '1px solid #f2ebe8' }}>Delete Account</button>
          </div>

          {/* MAIN PANEL CONTENT */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #dbcfcb', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={panelTitleStyle}>My Profile Details</h2>
                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                  <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>First Name</label>
                      <input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>Last Name</label>
                      <input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} style={inputStyle} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} style={inputStyle} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>Mobile Number</label>
                    <input type="tel" value={profileForm.mobile} onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })} style={inputStyle} required />
                  </div>
                  <button type="submit" style={saveBtnStyle}>SAVE CHANGES</button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ ...panelTitleStyle, margin: 0 }}>Saved Delivery Addresses</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} style={addAddrBtnStyle}>+ ADD NEW ADDRESS</button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #f2ebe8', padding: '24px', borderRadius: '16px', marginBottom: '30px', backgroundColor: '#faf7f5' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#2b221d', margin: '0 0 10px 0' }}>
                      {editingAddressId ? 'Edit Address' : 'New Address Details'}
                    </h3>
                    
                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" required value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Mobile Number</label>
                        <input type="tel" required value={addressForm.mobile} onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Flat / House Number</label>
                        <input type="text" required value={addressForm.flatNumber} onChange={(e) => setAddressForm({ ...addressForm, flatNumber: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Street Address</label>
                        <input type="text" required value={addressForm.streetAddress} onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Area / Colony</label>
                        <input type="text" required value={addressForm.area} onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })} style={inputStyle} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={labelStyle}>Landmark (Optional)</label>
                        <input type="text" value={addressForm.landmark} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} style={inputStyle} />
                      </div>
                    </div>

                    <div className="form-flex-row" style={{ display: 'flex', gap: '15px' }}>
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
                      <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} style={{ accentColor: '#c5a880' }} />
                      <label htmlFor="isDefault" style={{ fontSize: '13px', color: '#746380' }}>Set as default delivery address</label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" style={saveBtnStyle}>{editingAddressId ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</button>
                      <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} style={{ ...saveBtnStyle, backgroundColor: '#a39084' }}>CANCEL</button>
                    </div>
                  </form>
                )}

                {loadingAddresses ? (
                  <p>Loading your addresses...</p>
                ) : addresses.length === 0 ? (
                  <p style={{ color: '#746380', fontSize: '14px' }}>No saved addresses found. Add one to speed up checkout!</p>
                ) : (
                  <div className="address-grid" style={{ gap: '20px', gridTemplateColumns: undefined }}>
                    {addresses.map(addr => (
                      <div key={addr.id} style={{ border: '1px solid #dbcfcb', borderRadius: '16px', padding: '20px', position: 'relative', backgroundColor: addr.isDefault ? '#faf7f5' : '#ffffff' }}>
                        {addr.isDefault && (
                          <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '10px', backgroundColor: '#2b221d', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontWeight: '600' }}>DEFAULT</span>
                        )}
                        <h4 style={{ margin: '0 0 6px 0', color: '#2b221d', fontSize: '15px', fontWeight: '600' }}>{addr.fullName}</h4>
                        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#746380', lineHeight: '1.6' }}>
                          {addr.flatNumber}, {addr.streetAddress}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.area}<br />
                          {addr.city}, {addr.state} - {addr.pincode}<br />
                          <strong>Phone:</strong> {addr.mobile}
                        </p>
                        <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #f2ebe8', paddingTop: '12px' }}>
                          <button onClick={() => handleEditAddressClick(addr)} style={addrActionBtnStyle}>✏️ Edit</button>
                          <button onClick={() => handleDeleteAddress(addr.id)} style={{ ...addrActionBtnStyle, color: '#ff4d4f' }}>🗑️ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDER HISTORY TAB */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={panelTitleStyle}>Your Order History</h2>

                {loadingOrders ? (
                  <p>Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <p style={{ color: '#746380', fontSize: '14px' }}>No orders found yet. Start shopping to create memories!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ border: '1px solid #dbcfcb', borderRadius: '16px', overflow: 'hidden' }}>
                        {/* Order Header Summary */}
                        <div style={{ backgroundColor: '#faf7f5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #dbcfcb', fontSize: '13px', color: '#746380' }}>
                          <div>
                            <span>ORDER ID: <strong>{order.orderId}</strong></span>
                            <span style={{ margin: '0 15px', color: '#d4c5bd' }}>|</span>
                            <span>DATE: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></span>
                          </div>
                          <div>
                            <span>TOTAL AMOUNT: <strong style={{ color: '#2b221d' }}>₹{parseFloat(order.grandTotal).toLocaleString('en-IN')}</strong></span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ padding: '24px' }}>
                          {order.OrderItems?.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f2ebe8' }}>
                              <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f2ebe8' }} />
                              <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#2b221d' }}>{item.name}</h4>
                                <p style={{ margin: '0', fontSize: '12px', color: '#8c7365' }}>
                                  Purity: {item.goldPurity} | Diamonds: {item.diamondDetails}
                                </p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#2b221d' }}>
                                  Qty: {item.quantity} x ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Delivery info & timeline tracker */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <div>
                              <span style={{ fontSize: '13.5px', color: '#746380' }}>
                                Method: <strong>{order.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</strong>
                              </span>
                              {order.deliveryMethod === 'pickup' && (
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8c7365' }}>
                                  Pickup: {order.storeName} ({order.pickupDate} @ {order.pickupTime})
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                              <button onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)} style={trackBtnStyle}>
                                {trackingOrderId === order.id ? 'Hide Timeline' : 'Track Order'}
                              </button>
                            </div>
                          </div>

                          {/* Tracking Timeline Details */}
                          {trackingOrderId === order.id && (
                            <div style={{ marginTop: '24px', borderTop: '1px dashed #d4c5bd', paddingTop: '20px' }}>
                              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#2b221d', marginBottom: '15px' }}>Delivery Status Tracker</h4>
                              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 10px' }}>
                                {/* Track Steps */}
                                <div style={trackStepStyle(true)}>
                                  <div style={trackDotStyle(true)}>✓</div>
                                  <div style={trackLabelStyle}>Confirmed</div>
                                </div>
                                <div style={trackStepStyle(true)}>
                                  <div style={trackDotStyle(true)}>✓</div>
                                  <div style={trackLabelStyle}>Packed</div>
                                </div>
                                <div style={trackStepStyle(false)}>
                                  <div style={trackDotStyle(false)}>3</div>
                                  <div style={trackLabelStyle}>Shipped</div>
                                </div>
                                <div style={trackStepStyle(false)}>
                                  <div style={trackDotStyle(false)}>4</div>
                                  <div style={trackLabelStyle}>Delivered</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Styling classes
const tabBtnStyle = {
  width: '100%',
  padding: '16px 24px',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid #f2ebe8',
  cursor: 'pointer',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '13.5px',
  fontWeight: '500',
  color: '#2b221d',
  transition: 'background-color 0.2s, color 0.2s'
};

const activeTabStyle = {
  backgroundColor: '#2b221d',
  color: '#ffffff'
};

const panelTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '22px',
  fontWeight: '500',
  color: '#2b221d',
  marginBottom: '24px'
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

const saveBtnStyle = {
  backgroundColor: '#2b221d',
  color: '#ffffff',
  padding: '12px 30px',
  borderRadius: '30px',
  border: 'none',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '1px',
  cursor: 'pointer'
};

const addAddrBtnStyle = {
  backgroundColor: 'none',
  border: '1px solid #2b221d',
  color: '#2b221d',
  padding: '8px 20px',
  borderRadius: '30px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer'
};

const addrActionBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '12.5px',
  fontWeight: '600',
  color: '#8c7365',
  cursor: 'pointer'
};

const trackBtnStyle = {
  backgroundColor: 'none',
  border: '1px solid #2b221d',
  color: '#2b221d',
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer'
};

// Tracking Step styles
const trackStepStyle = (active) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  opacity: active ? 1 : 0.4
});

const trackDotStyle = (active) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: active ? '#2b221d' : '#faf7f5',
  border: active ? 'none' : '1px solid #d4c5bd',
  color: active ? '#ffffff' : '#8c7365',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: '600',
  marginBottom: '8px'
});

const trackLabelStyle = {
  fontSize: '11.5px',
  fontWeight: '600',
  color: '#2b221d',
  textAlign: 'center'
};
