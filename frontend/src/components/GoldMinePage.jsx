import React, { useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Gift, CheckCircle, Calculator, Clock, ChevronRight, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Heart, Calendar, Award } from 'lucide-react';
import ringImg from '../assets/heart_fusion_ring.png';

export default function GoldMinePage() {
  const { user, token } = useContext(AuthContext);

  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [selectedKarat, setSelectedKarat] = useState('24K');
  const [liveRates, setLiveRates] = useState({ rate24k: 7200, rate22k: 6595, rate18k: 5400, rate14k: 4212 });
  const [loadingRate, setLoadingRate] = useState(false);

  // Form inputs for starting a plan
  const [userName, setUserName] = useState(user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '');
  const [userEmail, setUserEmail] = useState(user ? user.email || '' : '');
  const [userPhone, setUserPhone] = useState(user ? user.phone || '' : '');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // User plans & wallet
  const [myPlans, setMyPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [payingPlanId, setPayingPlanId] = useState(null);
  const [walletData, setWalletData] = useState(null);

  // Fetch live gold rate
  const fetchLiveRate = async () => {
    setLoadingRate(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/goldmine/live-rate`);
      const data = await res.json();
      if (data.success) {
        setLiveRates({
          rate24k: data.rate24k || 7200,
          rate22k: data.rate22k || 6595,
          rate18k: data.rate18k || 5400,
          rate14k: data.rate14k || 4212
        });
      }
    } catch (err) {
      console.error('Error fetching live rates:', err);
    } finally {
      setLoadingRate(false);
    }
  };

  // Fetch user plans
  const fetchMyPlans = async () => {
    const emailToFetch = userEmail || user?.email;
    if (!emailToFetch) return;
    setLoadingPlans(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/goldmine/my-plans?email=${encodeURIComponent(emailToFetch)}`);
      const data = await res.json();
      if (data.success) {
        setMyPlans(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Fetch user wallet
  const fetchUserWallet = async () => {
    const emailToFetch = userEmail || user?.email;
    if (!emailToFetch) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/goldmine/wallet?email=${encodeURIComponent(emailToFetch)}`);
      const data = await res.json();
      if (data.success) {
        setWalletData(data.data);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

  useEffect(() => {
    fetchLiveRate();
  }, []);

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
      setUserName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
      fetchMyPlans();
      fetchUserWallet();
    }
  }, [user]);

  // Calculations for live calculator
  const userPaysTotal = monthlyAmount * 10;
  const bonusAmount = monthlyAmount;
  const totalMaturityValue = monthlyAmount * 11;
  const estimated24kGrams = parseFloat((totalMaturityValue / liveRates.rate24k).toFixed(3));

  // Karat weight conversions
  const karatWeights = {
    '24K': estimated24kGrams,
    '22K': parseFloat((estimated24kGrams * (24 / 22)).toFixed(3)),
    '18K': parseFloat((estimated24kGrams * (24 / 18)).toFixed(3)),
    '14K': parseFloat((estimated24kGrams * (24 / 14)).toFixed(3))
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeStartPlan = async (razorpayParams = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/goldmine/start-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          userName,
          userPhone,
          monthlyAmount,
          userId: user?._id || user?.id,
          razorpayPaymentId: razorpayParams.razorpayPaymentId || null,
          razorpayOrderId: razorpayParams.razorpayOrderId || null,
          paymentMethod: razorpayParams.paymentMethod || 'Razorpay (UPI / Card / Netbanking)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: '🎉 ' + data.message });
        fetchMyPlans();
        fetchUserWallet();
        const activeSection = document.getElementById('my-active-plans-section');
        if (activeSection) {
          activeSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to start plan' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartPlan = async (e) => {
    e.preventDefault();
    if (!user || (!user.email && !userEmail)) {
      setMsg({ 
        type: 'error', 
        text: '🔒 Login Required: Please log in to your Zoniraz account to start a 10+1 Gold Mine Savings Plan.' 
      });
      return;
    }
    if (!userEmail) {
      setMsg({ type: 'error', text: 'Please enter your account email address to start your Gold Mine 10+1 plan.' });
      return;
    }
    if (monthlyAmount < 2) {
      setMsg({ type: 'error', text: 'Minimum monthly installment is ₹2.' });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: monthlyAmount,
          currency: 'INR',
          receipt: `gmp_reg_${Date.now()}`
        })
      });
      const orderData = await orderRes.json();
      const scriptLoaded = await loadRazorpayScript();

      if (orderData.success && scriptLoaded && window.Razorpay) {
        const activeRazorpayKey = (orderData.keyId && 
          !orderData.keyId.includes('YourKeyIdHere') && 
          !orderData.keyId.includes('placeholder') && 
          !orderData.keyId.includes('xxxx')) 
            ? orderData.keyId 
            : 'rzp_live_THER7MTHLStjLj';

        const isRealOrderId = orderData.razorpayOrderId && 
          !orderData.razorpayOrderId.startsWith('order_rzp_') && 
          !orderData.razorpayOrderId.startsWith('order_sim_');

        const options = {
          key: activeRazorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Zoniraz Jewellery House',
          description: `10+1 Gold Mine Plan Registration - 1st Month ₹${monthlyAmount.toLocaleString('en-IN')}`,
          image: '/zoni.png',
          prefill: {
            name: userName || '',
            email: userEmail,
            contact: userPhone || ''
          },
          theme: {
            color: '#5D463C'
          },
          handler: async function (response) {
            executeStartPlan({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              paymentMethod: 'Razorpay (UPI / Card / Netbanking)'
            });
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              setMsg({ type: 'error', text: 'Razorpay payment cancelled.' });
            }
          }
        };

        if (isRealOrderId) {
          options.order_id = orderData.razorpayOrderId;
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        executeStartPlan();
      }
    } catch (err) {
      console.warn('Razorpay start plan init notice:', err);
      executeStartPlan();
    }
  };

  const executePayInstallment = async (planId, razorpayParams = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/goldmine/pay-installment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId,
          userEmail: userEmail || user?.email,
          razorpayPaymentId: razorpayParams.razorpayPaymentId || null,
          razorpayOrderId: razorpayParams.razorpayOrderId || null,
          paymentMethod: razorpayParams.paymentMethod || 'Razorpay (UPI / Card / Netbanking)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: '💳 ' + data.message });
        fetchMyPlans();
        fetchUserWallet();
      } else {
        setMsg({ type: 'error', text: data.message || 'Payment failed' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server error while processing installment payment.' });
    } finally {
      setPayingPlanId(null);
    }
  };

  const handlePayNextInstallment = async (planId) => {
    setPayingPlanId(planId);
    setMsg(null);
    const targetPlan = myPlans.find(p => p.planId === planId);
    const amountToPay = targetPlan?.monthlyAmount || 5000;

    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          currency: 'INR',
          receipt: `gmp_emi_${Date.now()}`
        })
      });
      const orderData = await orderRes.json();
      const scriptLoaded = await loadRazorpayScript();

      if (orderData.success && scriptLoaded && window.Razorpay) {
        const activeRazorpayKey = (orderData.keyId && 
          !orderData.keyId.includes('YourKeyIdHere') && 
          !orderData.keyId.includes('placeholder') && 
          !orderData.keyId.includes('xxxx')) 
            ? orderData.keyId 
            : 'rzp_live_THER7MTHLStjLj';

        const isRealOrderId = orderData.razorpayOrderId && 
          !orderData.razorpayOrderId.startsWith('order_rzp_') && 
          !orderData.razorpayOrderId.startsWith('order_sim_');

        const options = {
          key: activeRazorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Zoniraz Jewellery House',
          description: `Gold Mine Plan ${planId} Installment - ₹${amountToPay.toLocaleString('en-IN')}`,
          image: '/zoni.png',
          prefill: {
            name: userName || '',
            email: userEmail,
            contact: userPhone || ''
          },
          theme: {
            color: '#5D463C'
          },
          handler: async function (response) {
            executePayInstallment(planId, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              paymentMethod: 'Razorpay (UPI / Card / Netbanking)'
            });
          },
          modal: {
            ondismiss: function () {
              setPayingPlanId(null);
              setMsg({ type: 'error', text: 'Razorpay payment cancelled.' });
            }
          }
        };

        if (isRealOrderId) {
          options.order_id = orderData.razorpayOrderId;
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        executePayInstallment(planId);
      }
    } catch (err) {
      console.warn('Razorpay installment notice:', err);
      executePayInstallment(planId);
    }
  };

  const scrollToActivePlans = () => {
    const el = document.getElementById('my-active-plans-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bluestone-goldmine-wrapper" style={{ background: '#FAF0EE', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

      {/* ─── HERO SECTION MATCHING BLUESTONE DESIGN ─── */}
      <section style={{ padding: '20px 20px 10px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '30px',
          padding: '10px 0'
        }}>

          {/* Left Column: High-Res Jewellery Image */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              width: '240px',
              height: '240px',
              background: 'radial-gradient(circle, rgba(200, 163, 89, 0.2) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              zIndex: 1
            }} />
            <img
              src={ringImg}
              alt="Zoniraz Gold Mine Jewellery"
              loading="lazy"
              decoding="async"
              width="220"
              height="220"
              style={{
                maxWidth: '70%',
                maxHeight: '220px',
                height: 'auto',
                position: 'relative',
                zIndex: 2,
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.12))',
                animation: 'float 4s ease-in-out infinite'
              }}
            />
          </div>

          {/* Right Column: Hero Typography */}
          <div style={{ textTransform: 'none' }}>
            {/* Gold Frame Box around "Gold Mine" */}
            <div style={{
              display: 'inline-block',
              border: '2px solid #C8A359',
              padding: '4px 22px',
              borderRadius: '2px',
              fontFamily: "'Playfair Display', serif",
              fontSize: '30px',
              fontWeight: '700',
              color: '#1E2D42',
              letterSpacing: '2px',
              marginBottom: '10px'
            }}>
              Gold Savings Plan India
            </div>

            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1E2D42',
              lineHeight: '1.1',
              fontFamily: "'Playfair Display', serif",
              margin: '0 0 10px'
            }}>
              10+1 <span style={{ fontSize: '15px', fontWeight: '600', color: '#4A5568', letterSpacing: '2px', display: 'block', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>GOLD SAVING SCHEME ONLINE</span>
            </div>

            <hr style={{ width: '100px', border: 'none', borderTop: '2px solid #C8A359', margin: '0 0 12px' }} />

            <p style={{ fontSize: '15px', color: '#2D3748', margin: '0 0 6px', fontWeight: '500' }}>
              Subscribe to our flexible gold monthly installment scheme: pay 10 installments, get <strong>100% OFF on the 11th installment!</strong>
            </p>
            <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 16px' }}>
              *Redeemable from the 6th month onwards | BIS Hallmarked Gold & Diamond Jewellery
            </p>
          </div>

        </div>
      </section>

      {/* ─── FLOATING HORIZONTAL START PLAN CARD (MATCHING BLUESTONE) ─── */}
      <section style={{ padding: '0 20px 25px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '6px',
          padding: '16px 24px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
          border: '1px solid #ebd8d4'
        }}>

          {/* Form */}
          <form onSubmit={handleStartPlan} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            alignItems: 'center'
          }}>

            {/* Input 1: Monthly Amount */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '10px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                Enter Monthly Amount (₹)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#718096', fontWeight: '600', fontSize: '13px' }}>₹</span>
                <input
                  type="number"
                  min="2"
                  step="1"
                  required
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 24px',
                    border: '1px solid #CBD5E0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1A202C',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Input 2: Email or Phone */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '10px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                Enter Email / Phone Number
              </label>
              <input
                type="text"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter email or phone number"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#1A202C',
                  outline: 'none'
                }}
              />
            </div>

            {/* CTA Button (Coral Red/Orange or Dark Navy) */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '14px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '9px 18px',
                  background: '#F05A47',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 3px 10px rgba(240, 90, 71, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? 'PROCESSING...' : 'START NOW'}
              </button>
            </div>

          </form>

          {/* Preset Chips */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: '#718096', flexWrap: 'wrap' }}>
            <span>Popular Amounts:</span>
            {[2, 5000, 10000, 15000, 25000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setMonthlyAmount(amt)}
                style={{
                  background: monthlyAmount === amt ? '#FFF5F4' : '#F7FAFC',
                  border: monthlyAmount === amt ? '1px solid #F05A47' : '1px solid #E2E8F0',
                  color: monthlyAmount === amt ? '#F05A47' : '#4A5568',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
              >
                {amt === 2 ? '₹2 (Test)' : `₹${amt.toLocaleString('en-IN')}`}
              </button>
            ))}
          </div>

          {/* Click to Pay Subtext */}
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#4A5568' }}>
            Want to pay your Gold Mine Installment?{' '}
            <button
              type="button"
              onClick={scrollToActivePlans}
              style={{ background: 'none', border: 'none', color: '#3182CE', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600', padding: 0 }}
            >
              Click to Pay
            </button>
          </div>

        </div>
      </section>

      {/* ─── STATUS ALERT ─── */}
      {msg && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 20px', padding: '0 20px' }}>
          <div style={{
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: msg.type === 'error' ? '#FFF5F5' : '#F0FFF4',
            color: msg.type === 'error' ? '#C53030' : '#276749',
            border: `1px solid ${msg.type === 'error' ? '#FEB2B2' : '#9AE6B4'}`
          }}>
            {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        </section>
      )}

      {/* ─── WHY GOLD MINE PLAN? SECTION ─── */}
      <section style={{ background: '#ffffff', padding: '40px 20px', borderTop: '1px solid #ebd8d4', borderBottom: '1px solid #ebd8d4' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", fontWeight: '700', color: '#1A202C', margin: '0 0 24px' }}>
            Why Choose Our Gold Saving Scheme Online?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            
            {/* Feature 1 */}
            <div style={{ padding: '18px 16px', border: '1px solid #EDF2F7', borderRadius: '6px', background: '#FAFCFE' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#EBF8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Calendar size={22} color="#3182CE" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D3748', margin: '0 0 6px' }}>Systematic Gold Investment Plan</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.5', margin: 0 }}>
                Build your assets with a systematic gold investment plan. Secure and accumulate digital gold saving scheme benefits month by month.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ padding: '18px 16px', border: '1px solid #EDF2F7', borderRadius: '6px', background: '#FAFCFE' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEEBC8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Heart size={22} color="#DD6B20" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D3748', margin: '0 0 6px' }}>Easy Gold Savings Plan</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.5', margin: 0 }}>
                An easy gold savings plan designed for upcoming weddings, special anniversaries, and luxury bridal jewellery purchases.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ padding: '18px 16px', border: '1px solid #EDF2F7', borderRadius: '6px', background: '#FAFCFE' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FED7D7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Award size={22} color="#E53E3E" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D3748', margin: '0 0 6px' }}>Gold Monthly Installment Scheme Bonus</h3>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.5', margin: 0 }}>
                Pay 10 monthly installments under our gold installment scheme, and we will credit the 11th month's installment completely free.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LIVE CALCULATOR & KARAT CONVERSIONS ─── */}
      <section style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Live Gold Rate Banner */}
        <div style={{
          background: '#ffffff',
          borderRadius: '6px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Today's Live 24K Gold Rate</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#1A202C', marginTop: '1px' }}>
              ₹{liveRates.rate24k.toLocaleString('en-IN')} <span style={{ fontSize: '13px', fontWeight: '400', color: '#718096' }}>/ gram</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#4A5568' }}>
            <div><strong>22K:</strong> ₹{liveRates.rate22k.toLocaleString('en-IN')}/g</div>
            <div><strong>18K:</strong> ₹{liveRates.rate18k.toLocaleString('en-IN')}/g</div>
            <div><strong>14K:</strong> ₹{liveRates.rate14k.toLocaleString('en-IN')}/g</div>
          </div>

          <button
            onClick={fetchLiveRate}
            style={{ background: '#F7FAFC', border: '1px solid #CBD5E0', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5568' }}
          >
            <RefreshCw size={12} className={loadingRate ? 'animate-spin' : ''} /> Refresh Rate
          </button>
        </div>

        {/* Live Karat Calculator Card */}
        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calculator size={18} color="#C8A359" />
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#1A202C' }}>Gold Weight Calculator at Maturity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
            
            {/* Left Breakdown */}
            <div style={{ background: '#FFF5F4', border: '1px solid #FED7D7', padding: '14px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#4A5568' }}>Monthly Installment:</span>
                <strong style={{ color: '#1A202C' }}>₹{monthlyAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#4A5568' }}>You Pay (10 Months):</span>
                <strong style={{ color: '#1A202C' }}>₹{userPaysTotal.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#276749', fontWeight: '600' }}>Zoniraz 11th Bonus Month:</span>
                <strong style={{ color: '#276749' }}>+ ₹{bonusAmount.toLocaleString('en-IN')} FREE</strong>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed #CBD5E0', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ fontWeight: '700', color: '#1A202C' }}>Total Maturity Savings Value:</span>
                <strong style={{ color: '#F05A47', fontSize: '16px' }}>₹{totalMaturityValue.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Right Karat Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4A5568', marginBottom: '6px' }}>
                Select Karat to View Equivalent Gold Weight:
              </label>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {['24K', '22K', '18K', '14K'].map(karat => (
                  <button
                    key={karat}
                    type="button"
                    onClick={() => setSelectedKarat(karat)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '4px',
                      border: selectedKarat === karat ? '2px solid #1A202C' : '1px solid #CBD5E0',
                      background: selectedKarat === karat ? '#1A202C' : '#ffffff',
                      color: selectedKarat === karat ? '#ffffff' : '#4A5568',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {karat}
                  </button>
                ))}
              </div>

              <div style={{ background: '#1E2D42', color: '#ffffff', borderRadius: '6px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Equivalent {selectedKarat} Gold Weight
                </div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#C8A359', marginTop: '2px' }}>
                  {karatWeights[selectedKarat]} <span style={{ fontSize: '14px', color: '#ffffff' }}>grams</span>
                </div>
                <div style={{ fontSize: '10px', color: '#CBD5E0', marginTop: '4px' }}>
                  Calculated based on live 24K rate ₹{liveRates.rate24k}/g
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── ACTIVE USER PLANS SECTION ─── */}
      <section id="my-active-plans-section" style={{ padding: '0 20px 50px', maxWidth: '1100px', margin: '0 auto' }}>
        {userEmail && (
          <React.Fragment>
            {/* Gold Wallet Summary Card */}
            {walletData && (
              <div style={{
                background: 'linear-gradient(135deg, #1e2d42 0%, #2b221d 100%)',
                borderRadius: '8px',
                padding: '16px 20px',
                color: '#ffffff',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#c8a359', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    MY GOLD WALLET BALANCE
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '2px', color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
                    {walletData.totalGold24kGrams || 0} g <span style={{ fontSize: '13px', fontWeight: '400', color: '#cbd5e0' }}>(24K Gold)</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Market Valuation</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#9ae6b4' }}>
                    ₹{(walletData.currentMarketValue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      window.history.pushState(null, '', '/profile#wallet');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }}
                    style={{
                      background: '#c8a359',
                      color: '#1e2d42',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    VIEW WALLET PASSBOOK →
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#1A202C', fontFamily: "'Playfair Display', serif" }}>
                    My 10+1 Gold Mine Plans
                  </h2>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>Account Email: {userEmail}</div>
                </div>
                <button
                  onClick={() => { fetchMyPlans(); fetchUserWallet(); }}
                  style={{ background: '#F7FAFC', border: '1px solid #CBD5E0', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#2D3748' }}
                >
                  Refresh My Plans & Wallet
                </button>
              </div>

            {loadingPlans ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#718096' }}>Loading your Gold Mine plans...</div>
            ) : myPlans.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', background: '#FFF5F4', borderRadius: '6px', color: '#718096', border: '1px solid #FED7D7' }}>
                You don't have any active 10+1 Gold Mine plans yet. Use the form above to start your plan!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myPlans.map(plan => (
                  <div key={plan.planId} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', background: '#ffffff' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#C8A359', fontWeight: '700', letterSpacing: '1px' }}>PLAN ID: {plan.planId}</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1A202C', marginTop: '2px' }}>
                          ₹{plan.monthlyAmount?.toLocaleString('en-IN')} / month
                        </div>
                        <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                          Started: {new Date(plan.startDate).toLocaleDateString()} | Maturity: {new Date(plan.maturityDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: plan.status === 'COMPLETED' ? '#F0FFF4' : '#FEFCBF',
                            color: plan.status === 'COMPLETED' ? '#22543D' : '#744210',
                            border: `1px solid ${plan.status === 'COMPLETED' ? '#9AE6B4' : '#F6E05E'}`
                          }}>
                            {plan.status === 'COMPLETED' ? '🎉 COMPLETED' : `ACTIVE (${plan.totalPaidInstallments}/10 Paid)`}
                          </span>

                          {plan.bonusLapsed ? (
                            <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', background: '#FFF5F5', color: '#E53E3E', border: '1px solid #FEB2B2' }}>
                              ⚠️ 11th Bonus Lapsed (Late EMI)
                            </span>
                          ) : (
                            <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', background: '#F0FFF4', color: '#276749', border: '1px solid #9AE6B4' }}>
                              ✨ 11th Bonus Eligible
                            </span>
                          )}
                        </div>

                        {plan.status === 'ACTIVE' && plan.totalPaidInstallments < 10 && (
                          <button
                            onClick={() => handlePayNextInstallment(plan.planId)}
                            disabled={payingPlanId === plan.planId}
                            style={{
                              display: 'block',
                              marginTop: '8px',
                              padding: '8px 14px',
                              borderRadius: '4px',
                              background: '#F05A47',
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: '12px',
                              border: 'none',
                              cursor: payingPlanId === plan.planId ? 'not-allowed' : 'pointer',
                              boxShadow: '0 3px 8px rgba(240, 90, 71, 0.2)'
                            }}
                          >
                            {payingPlanId === plan.planId ? 'Processing...' : `Pay Month #${plan.totalPaidInstallments + 1} Installment`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Gold Accumulation Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', background: '#F7FAFC', padding: '12px', borderRadius: '4px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#718096' }}>Total Gold (24K)</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#1A202C' }}>{plan.totalGold24kGrams} g</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#718096' }}>22K Gold Equiv.</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#C8A359' }}>{plan.karatWeights?.['22K']} g</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#718096' }}>18K Gold Equiv.</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#C8A359' }}>{plan.karatWeights?.['18K']} g</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#718096' }}>Total Savings Value</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#276749' }}>₹{plan.totalSavingsAmount?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Payment Table */}
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1A202C', marginBottom: '8px' }}>Installment Payment History:</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#EDF2F7', color: '#2D3748' }}>
                            <th style={{ padding: '7px' }}>Month #</th>
                            <th style={{ padding: '7px' }}>Payment Date</th>
                            <th style={{ padding: '7px' }}>Amount</th>
                            <th style={{ padding: '7px' }}>Live 24K Rate</th>
                            <th style={{ padding: '7px' }}>Gold Weight (24K)</th>
                            <th style={{ padding: '7px' }}>Paid By / Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plan.installments?.map(inst => (
                            <tr key={inst.installmentNumber} style={{ borderBottom: '1px solid #EDF2F7', background: inst.paidBy === 'ZONIRAZ_BONUS' ? '#F0FFF4' : '#ffffff' }}>
                              <td style={{ padding: '7px', fontWeight: '700' }}>#{inst.installmentNumber}</td>
                              <td style={{ padding: '7px' }}>{new Date(inst.paymentDate).toLocaleDateString()}</td>
                              <td style={{ padding: '7px', fontWeight: '600' }}>₹{inst.amount?.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '7px' }}>₹{inst.goldRate24k}/g</td>
                              <td style={{ padding: '7px', fontWeight: '700', color: '#C8A359' }}>+{inst.goldWeight24kGrams} g</td>
                              <td style={{ padding: '7px' }}>
                                {inst.paidBy === 'ZONIRAZ_BONUS' ? (
                                  <span style={{ color: '#22543D', fontWeight: '700', background: '#C6F6D5', padding: '2px 6px', borderRadius: '4px' }}>
                                    🎁 ZONIRAZ 100% FREE BONUS
                                  </span>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ color: '#2F855A', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      <ShieldCheck size={12} style={{ color: '#2F855A' }} />
                                      ✓ Paid via Razorpay
                                    </span>
                                    <span style={{ fontSize: '10px', color: '#4A5568' }}>
                                      {inst.paymentMethod || 'Razorpay (UPI / Card / Netbanking)'}
                                    </span>
                                    {inst.transactionId && (
                                      <span style={{ fontSize: '9px', color: '#718096', fontFamily: 'monospace' }}>
                                        Txn: {inst.transactionId}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </section>

      {/* Floating style animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

    </div>
  );
}
