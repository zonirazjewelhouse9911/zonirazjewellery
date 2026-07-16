import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { ArrowLeft, HelpCircle, Shield, TrendingDown, Coins, ChevronDown, ChevronUp, AlertCircle, Clock } from 'lucide-react';

export default function SellGoldPage({ onBack }) {
  const [liveRate14k, setLiveRate14k] = useState(4200); // 14k rate default
  const [amount, setAmount] = useState('');
  const [grams, setGrams] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Timer State for rate lock (Caratlane style countdown)
  const [secondsLeft, setSecondsLeft] = useState(76); // 1 minute 16 seconds default

  // 24K Sell rate calculation
  const sellRate24k = Math.round(liveRate14k * 24 / 14);

  // Fetch latest jewellery rates from daily settings
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jewellery-pricing`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.gold_rate_14k) {
          setLiveRate14k(data.data.gold_rate_14k);
        }
      })
      .catch(err => console.error('Error fetching gold rate:', err));
  }, []);

  // Timer countdown implementation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Reset to a random timer value between 60 and 90 seconds
          return Math.floor(Math.random() * 30) + 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Convert seconds to MM:SS format
  const formatTimer = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Convert amount to grams
  const handleAmountChange = (val) => {
    setAmount(val);
    if (!val || isNaN(val)) {
      setGrams('');
      return;
    }
    const calculatedGrams = (parseFloat(val) / sellRate24k).toFixed(4);
    setGrams(calculatedGrams);
  };

  // Convert grams to amount
  const handleGramsChange = (val) => {
    setGrams(val);
    if (!val || isNaN(val)) {
      setAmount('');
      return;
    }
    const calculatedAmount = Math.round(parseFloat(val) * sellRate24k);
    setAmount(calculatedAmount.toString());
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    alert(`Sell Order Confirmed!\nSelling Weight: ${grams} gms\nProceeds: ₹${parseFloat(amount).toLocaleString('en-IN')} will be credited to your linked bank account.`);
    if (onBack) onBack();
    else window.location.hash = '';
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I sell my gold?",
      answer: "Selling your digital gold is simple! Enter either the value in Rupees or weight in grams you wish to sell. Confirm the transaction, and the proceeds will be directly credited to your registered bank account via secure instant transfer."
    },
    {
      question: "Is there any lock-in period to sell gold?",
      answer: "No, there is no lock-in period. You can purchase and sell your gold on the same day, subject to standard verification check protocols."
    },
    {
      question: "How long will it take to get the money in my bank account?",
      answer: "Usually, the money is credited to your bank account instantly via IMPS bank transfer. In rare cases of banking network delays, it may take up to 24 hours."
    },
    {
      question: "Why is the buy and sell price different on the same day?",
      answer: "The difference between the buy and sell rate (spread) covers processing fees, secure vaulting/insurance costs with Brink's, and live commodity market price fluctuations."
    }
  ];

  return (
    <div className="sellgold-page-container">
      {/* Back button & Breadcrumb */}
      <div className="sellgold-header-nav">
        <button className="sellgold-back-btn" onClick={onBack || (() => window.location.hash = '')}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <span className="sellgold-breadcrumb">Home / Digital Gold / Sell Gold</span>
      </div>

      {/* Gold Sub Header Nav Bar */}
      <div className="gold-sub-navbar">
        <div className="gold-nav-brand">
          <Coins size={20} className="gold-nav-icon" />
          <span>eGold <small>by ZONIRAZ</small></span>
        </div>
        <div className="gold-nav-links">
          <a href="#digital-gold" className="gold-nav-link">BUY GOLD</a>
          <a href="#delivery" className="gold-nav-link">GIFT CARD</a>
          <a href="#delivery" className="gold-nav-link">GIFT CARD CLAIM</a>
          <a href="#delivery" className="gold-nav-link">EXCHANGE / REDEEM</a>
          <a href="#sell-gold" className="gold-nav-link active">SELL GOLD</a>
          <a href="#terms" className="gold-nav-link">FAQ</a>
        </div>
      </div>

      <div className="sellgold-content-wrapper">
        <h1 className="sellgold-main-title">Sell Gold</h1>

        {/* 3-Card Grid */}
        <div className="sellgold-cards-grid">
          {/* Card 1: Converter Form */}
          <div className="sellgold-card convert-card">
            <form onSubmit={handleProceed}>
              <div className="converter-flex">
                <div className="convert-input-group">
                  <label className="convert-label">Sell Gold by Amount</label>
                  <div className="convert-input-wrap">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="convert-input"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="equals-sign">=</div>

                <div className="convert-input-group">
                  <label className="convert-label">or Sell in Grams</label>
                  <div className="convert-input-wrap">
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Enter Grams"
                      className="convert-input text-right"
                      value={grams}
                      onChange={(e) => handleGramsChange(e.target.value)}
                    />
                    <span className="input-suffix">gms</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="sellgold-submit-btn" 
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Proceed to Sell
              </button>
            </form>
          </div>

          {/* Card 2: Live Rate display */}
          <div className="sellgold-card rate-card">
            <div className="rate-card-header">
              <span className="card-lbl">Sell Rate</span>
              <span className="timer-badge">
                <Clock size={12} className="timer-icon" /> Price valid for {formatTimer(secondsLeft)} min
              </span>
            </div>
            <div className="rate-value">₹{sellRate24k.toLocaleString('en-IN')}/gram</div>
            <div className="rate-purity-row">
              <Shield size={14} className="purity-icon" />
              <span>24K 99.9% Purity</span>
              <HelpCircle size={12} className="info-icon-trigger" title="Live certified 24 karat gold rate" />
            </div>
          </div>

          {/* Card 3: Gold Balance display */}
          <div className="sellgold-card balance-card">
            <div className="balance-icon-wrap">
              <Coins size={32} className="balance-coin" />
            </div>
            <div className="balance-label">Gold Balance</div>
            <div className="balance-value">0.00 gms</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="sellgold-quick-links">
          <a href="#profile" className="quick-lnk">Check Sell History →</a>
          <a href="#digital-gold" className="quick-lnk">Redeem Gold →</a>
        </div>

        {/* FAQ Accordion Section */}
        <div className="sellgold-faq-section">
          <h2 className="faq-main-title">Selling the Gold <span>FAQs</span></h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'open' : ''}`}>
                <div className="faq-question-row" onClick={() => toggleFaq(i)}>
                  <h3>{faq.question}</h3>
                  {activeFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                <div className="faq-answer-row">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styled JSX */}
      <style>{`
        .sellgold-page-container {
          padding: 30px 4% 60px;
          background-color: #FAF8F6;
          min-height: 100vh;
          font-family: var(--font-serif), serif;
          color: #2C2520;
        }

        .sellgold-header-nav {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 24px;
        }

        .sellgold-back-btn {
          background: transparent;
          border: none;
          color: #A98E73;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0;
          transition: color 0.2s ease;
        }

        .sellgold-back-btn:hover {
          color: #8C735B;
        }

        .sellgold-breadcrumb {
          font-size: 12px;
          color: #8E867E;
        }

        /* Gold Subbar styled matching Caratlane premium banner */
        .gold-sub-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #FFFFFF;
          padding: 12px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(93, 70, 60, 0.04);
          margin-bottom: 30px;
          border: 1px solid #EAE5E0;
        }

        .gold-nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #634d40;
        }

        .gold-nav-brand small {
          font-size: 10px;
          font-weight: 400;
          color: #A98E73;
          letter-spacing: 0.1em;
          margin-left: 4px;
        }

        .gold-nav-icon {
          color: #A98E73;
        }

        .gold-nav-links {
          display: flex;
          gap: 20px;
        }

        .gold-nav-link {
          text-decoration: none;
          color: #8E867E;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 6px 0;
          position: relative;
          transition: color 0.2s ease;
        }

        .gold-nav-link:hover, .gold-nav-link.active {
          color: #A98E73;
        }

        .gold-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #A98E73;
          border-radius: 2px;
        }

        .sellgold-content-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sellgold-main-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #2C2520;
        }

        /* 3-Card Grid System */
        .sellgold-cards-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .sellgold-card {
          background-color: #FFFFFF;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(93, 70, 60, 0.04);
          border: 1px solid #EAE5E0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .convert-card {
          justify-content: space-between;
        }

        .converter-flex {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .convert-input-group {
          flex: 1;
        }

        .convert-label {
          display: block;
          font-size: 13px;
          color: #8E867E;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .convert-input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid #C5A880;
          border-radius: 8px;
          padding: 8px 12px;
          background-color: #FFFFFF;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .convert-input-wrap:focus-within {
          border-color: #A98E73;
          box-shadow: 0 0 0 3px rgba(169, 142, 115, 0.15);
        }

        .input-prefix {
          font-size: 16px;
          color: #2C2520;
          font-weight: 600;
          margin-right: 6px;
        }

        .input-suffix {
          font-size: 13px;
          color: #8E867E;
          font-weight: 500;
          margin-left: 6px;
        }

        .convert-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 16px;
          color: #2C2520;
          font-weight: 600;
          padding: 0;
        }

        .text-right {
          text-align: right;
        }

        .equals-sign {
          font-size: 24px;
          color: #A98E73;
          font-weight: 600;
          margin-top: 15px;
        }

        .sellgold-submit-btn {
          background-color: #A98E73;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .sellgold-submit-btn:hover:not(:disabled) {
          background-color: #8C735B;
          transform: translateY(-1px);
        }

        .sellgold-submit-btn:disabled {
          background-color: #E6E1DC;
          color: #A29B93;
          cursor: not-allowed;
        }

        /* Live Rate card styling */
        .rate-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-lbl {
          font-size: 14px;
          color: #8E867E;
          font-weight: 500;
        }

        .timer-badge {
          background-color: #FDF3E7;
          color: #D47B25;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .timer-icon {
          color: #D47B25;
        }

        .rate-value {
          font-size: 22px;
          font-weight: 700;
          color: #634d40;
          margin-bottom: 12px;
        }

        .rate-purity-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #8E867E;
          font-weight: 500;
        }

        .purity-icon {
          color: #4CAF50;
        }

        .info-icon-trigger {
          color: #C5A880;
          cursor: pointer;
          margin-left: 2px;
        }

        /* Gold Balance card styling */
        .balance-card {
          align-items: center;
          text-align: center;
        }

        .balance-icon-wrap {
          width: 50px;
          height: 50px;
          background-color: #F8F3EE;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .balance-coin {
          color: #A98E73;
        }

        .balance-label {
          font-size: 13px;
          color: #8E867E;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .balance-value {
          font-size: 18px;
          font-weight: 700;
          color: #2C2520;
        }

        /* Quick Links styling */
        .sellgold-quick-links {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding: 0 4px;
        }

        .quick-lnk {
          text-decoration: none;
          color: #A98E73;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .quick-lnk:hover {
          color: #8C735B;
        }

        /* FAQs accordion styling */
        .sellgold-faq-section {
          margin-top: 50px;
        }

        .faq-main-title {
          font-size: 20px;
          font-weight: 700;
          color: #2C2520;
          margin-bottom: 24px;
        }

        .faq-main-title span {
          color: #A98E73;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background-color: #FFFFFF;
          border-radius: 8px;
          border: 1px solid #EAE5E0;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .faq-item.open {
          border-color: #C5A880;
        }

        .faq-question-row {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .faq-question-row h3 {
          font-size: 14px;
          font-weight: 600;
          color: #634d40;
          margin: 0;
        }

        .faq-answer-row {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          background-color: #FCFAF9;
        }

        .faq-item.open .faq-answer-row {
          max-height: 120px;
        }

        .faq-answer-row p {
          padding: 0 20px 16px 20px;
          font-size: 13px;
          color: #8E867E;
          line-height: 1.5;
          margin: 0;
        }

        /* Responsive styling */
        @media (max-width: 900px) {
          .sellgold-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .converter-flex {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .equals-sign {
            transform: rotate(90deg);
            margin: 0 auto;
            height: 20px;
          }

          .text-right {
            text-align: left;
          }

          .gold-sub-navbar {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .gold-nav-links {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
