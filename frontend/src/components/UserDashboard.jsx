import React, { useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

export default function UserDashboard() {
  const { user, token, logout, updateProfile, deleteAccount } = useContext(AuthContext);
  const getTabFromLocation = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash.includes('wallet') || path.includes('wallet')) return 'wallet';
    if (hash.includes('order') || path.includes('order')) return 'orders';
    if (hash.includes('address') || path.includes('address')) return 'addresses';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState(getTabFromLocation);

  useEffect(() => {
    const syncTabFromUrl = () => {
      setActiveTab(getTabFromLocation());
    };

    syncTabFromUrl();
    window.addEventListener('hashchange', syncTabFromUrl);
    window.addEventListener('popstate', syncTabFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncTabFromUrl);
      window.removeEventListener('popstate', syncTabFromUrl);
    };
  }, []);

  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', mobile: '' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [selectedWalletKarat, setSelectedWalletKarat] = useState('24K');

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

  // Fetch Wallet
  const fetchWallet = async () => {
    const userEmail = user?.email;
    if (!userEmail) return;
    setLoadingWallet(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/goldmine/wallet?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success) {
        setWalletData(data.data);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (activeTab === 'addresses') fetchAddresses();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'wallet') fetchWallet();
    }
  }, [activeTab, user]);

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
        window.history.pushState(null, '', '/');
        window.dispatchEvent(new Event('popstate'));
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
          onClick={() => { window.history.pushState(null, '', '/'); window.dispatchEvent(new Event('popstate')); }} 
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
            <button onClick={() => { setActiveTab('profile'); window.location.hash = 'profile'; }} style={{ ...tabBtnStyle, ...(activeTab === 'profile' ? activeTabStyle : {}) }}>👤 My Profile</button>
            <button onClick={() => { setActiveTab('wallet'); window.location.hash = 'wallet'; }} style={{ ...tabBtnStyle, ...(activeTab === 'wallet' ? activeTabStyle : {}), backgroundColor: activeTab === 'wallet' ? '#2b221d' : '#fffdf7', color: activeTab === 'wallet' ? '#ffffff' : '#a37b34', fontWeight: '600' }}>✨ Gold Wallet</button>
            <button onClick={() => { setActiveTab('addresses'); window.location.hash = 'addresses'; }} style={{ ...tabBtnStyle, ...(activeTab === 'addresses' ? activeTabStyle : {}) }}>📍 Saved Addresses</button>
            <button onClick={() => { setActiveTab('orders'); window.location.hash = 'orders'; }} style={{ ...tabBtnStyle, ...(activeTab === 'orders' ? activeTabStyle : {}) }}>📦 Order History</button>
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

            {/* GOLD WALLET TAB */}
            {activeTab === 'wallet' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ ...panelTitleStyle, margin: 0 }}>My Gold Wallet Passbook</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#746380' }}>
                      Every EMI paid in your 10+1 Gold Mine scheme is stored as pure gold weight in your wallet.
                    </p>
                  </div>
                  <button onClick={fetchWallet} style={addAddrBtnStyle}>
                    🔄 Refresh Balance
                  </button>
                </div>

                {loadingWallet ? (
                  <p style={{ color: '#746380' }}>Loading your Gold Wallet details...</p>
                ) : (
                  <div>
                    {/* GOLD WALLET CARD */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1e2d42 0%, #2b221d 100%)',
                      borderRadius: '20px',
                      padding: '28px',
                      color: '#ffffff',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                      marginBottom: '30px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200, 163, 89, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c8a359' }}>
                            ZONIRAZ GOLD WALLET
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px', color: '#e2e8f0' }}>
                          Live 24K Gold Rate: <strong>₹{walletData?.currentLiveRate24k?.toLocaleString('en-IN') || 7200}/g</strong>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', alignItems: 'center' }}>
                        {/* Balance Column */}
                        <div>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#cbd5e0', marginBottom: '4px' }}>
                            Total Accumulated Gold ({selectedWalletKarat})
                          </div>
                          <div style={{ fontSize: '32px', fontWeight: '800', color: '#c8a359', fontFamily: "'Playfair Display', serif" }}>
                            {walletData?.karatWeights?.[selectedWalletKarat] || 0} <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '500' }}>grams</span>
                          </div>
                          
                          {/* Karat selector pills */}
                          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                            {['24K', '22K', '18K', '14K'].map(karat => (
                              <button
                                key={karat}
                                onClick={() => setSelectedWalletKarat(karat)}
                                style={{
                                  padding: '3px 9px',
                                  borderRadius: '12px',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  border: selectedWalletKarat === karat ? '1px solid #c8a359' : '1px solid rgba(255,255,255,0.2)',
                                  background: selectedWalletKarat === karat ? '#c8a359' : 'transparent',
                                  color: selectedWalletKarat === karat ? '#1e2d42' : '#ffffff',
                                  cursor: 'pointer'
                                }}
                              >
                                {karat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Current Market Value */}
                        <div>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#cbd5e0', marginBottom: '4px' }}>
                            Current Market Valuation
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
                            ₹{(walletData?.currentMarketValue || 0).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                            Based on live 24K bullion rate
                          </div>
                        </div>

                        {/* Total Deposited & Bonus */}
                        <div>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#cbd5e0', marginBottom: '4px' }}>
                            Cash Deposited & Bonus
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                            Saved: ₹{(walletData?.totalAmountSaved || 0).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ae6b4', marginTop: '2px' }}>
                            Zoniraz Bonus: +₹{(walletData?.totalBonusEarned || 0).toLocaleString('en-IN')} FREE
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WALLET TRANSACTIONS HISTORY TABLE */}
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#2b221d', marginBottom: '16px' }}>
                      Wallet Transaction Ledger ({walletData?.transactions?.length || 0})
                    </h3>

                    {(!walletData?.transactions || walletData.transactions.length === 0) ? (
                      <div style={{ border: '1px solid #dbcfcb', borderRadius: '16px', padding: '30px', textAlign: 'center', backgroundColor: '#faf7f5' }}>
                        <p style={{ color: '#746380', fontSize: '14px', margin: '0 0 12px 0' }}>
                          No gold credits recorded in your wallet yet. Start a 10+1 Gold Mine scheme to accumulate gold every month!
                        </p>
                        <button onClick={() => { window.history.pushState(null, '', '/gold-mine'); window.dispatchEvent(new Event('popstate')); }} style={saveBtnStyle}>
                          START 10+1 GOLD PLAN NOW
                        </button>
                      </div>
                    ) : (
                      <div style={{ border: '1px solid #dbcfcb', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#faf7f5', color: '#8c7365', borderBottom: '1px solid #dbcfcb', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '12px 16px' }}>Date</th>
                                <th style={{ padding: '12px 16px' }}>Transaction & Plan ID</th>
                                <th style={{ padding: '12px 16px' }}>Amount (₹)</th>
                                <th style={{ padding: '12px 16px' }}>24K Rate</th>
                                <th style={{ padding: '12px 16px' }}>Gold Grams</th>
                                <th style={{ padding: '12px 16px' }}>Status / Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {walletData.transactions.map((txn, idx) => (
                                <tr key={txn.transactionId || idx} style={{ borderBottom: '1px solid #f2ebe8', backgroundColor: txn.paidBy === 'ZONIRAZ_BONUS' ? '#f0fff4' : '#ffffff' }}>
                                  <td style={{ padding: '12px 16px', color: '#746380' }}>
                                    {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <strong style={{ color: '#2b221d', display: 'block', fontSize: '13px' }}>
                                      {txn.description || `EMI #${txn.installmentNumber}`}
                                    </strong>
                                    {txn.planId && (
                                      <span style={{ fontSize: '11px', color: '#8c7365' }}>Plan ID: {txn.planId}</span>
                                    )}
                                  </td>
                                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#2b221d' }}>
                                    ₹{txn.amount?.toLocaleString('en-IN')}
                                  </td>
                                  <td style={{ padding: '12px 16px', color: '#746380' }}>
                                    ₹{txn.goldRate24k}/g
                                  </td>
                                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#c8a359', fontSize: '13.5px' }}>
                                    +{txn.goldWeight24kGrams} g
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    {txn.paidBy === 'ZONIRAZ_BONUS' ? (
                                      <span style={{ color: '#22543d', backgroundColor: '#c6f6d5', padding: '3px 8px', borderRadius: '12px', fontSize: '10.5px', fontWeight: '700' }}>
                                        🎁 100% FREE BONUS
                                      </span>
                                    ) : (
                                      <span style={{ color: '#2f855a', backgroundColor: '#e6fffa', padding: '3px 8px', borderRadius: '12px', fontSize: '10.5px', fontWeight: '600' }}>
                                        ✓ EMI CREDITED
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Quick action card */}
                    <div style={{ marginTop: '24px', backgroundColor: '#faf7f5', padding: '20px', borderRadius: '16px', border: '1px solid #dbcfcb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#2b221d' }}>
                          Want to accumulate more gold or redeem?
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#746380' }}>
                          Your Gold Wallet balance can be redeemed towards BIS Hallmarked Gold & Diamond Jewellery purchases.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { window.history.pushState(null, '', '/gold-mine'); window.dispatchEvent(new Event('popstate')); }} style={saveBtnStyle}>
                          10+1 GOLD SCHEME
                        </button>
                        <button onClick={() => { window.history.pushState(null, '', '/'); window.dispatchEvent(new Event('popstate')); }} style={{ ...saveBtnStyle, backgroundColor: '#8c7365' }}>
                          BROWSE JEWELLERY
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
