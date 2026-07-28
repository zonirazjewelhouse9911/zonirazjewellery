import React, { useState } from 'react';
import { ArrowLeft, Coins, ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock, Shield, Award, CheckCircle2 } from 'lucide-react';

export default function SellGoldPage({ onBack }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    goldDetails: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.goldDetails) {
      alert("Please fill all required fields marked with *");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        appointmentDate: '',
        appointmentTime: '',
        goldDetails: ''
      });
      alert("Thank you! Your Sell Old Gold enquiry has been submitted. Our valuation executive will contact you shortly.");
    }, 1500);
  };

  const faqs = [
    {
      question: "How do I sell my physical old gold ornaments?",
      answer: "Selling your physical old gold is easy and 100% transparent! Simply fill out the enquiry form above or visit our store. Our certified gemologists test your gold in front of you using advanced German Karatmeter machines and offer instant payout."
    },
    {
      question: "What documents are required to sell physical old gold?",
      answer: "You need to bring a valid government-issued photo ID (Aadhaar Card, PAN Card, or Passport) along with original purchase invoices/receipts of the gold items if available."
    },
    {
      question: "Is there any melting or testing charge for physical gold?",
      answer: "No, we offer 100% free gold purity testing in front of you with zero hidden charges. We evaluate your gold based on exact weight and purity at live market rates."
    },
    {
      question: "How will I receive the payout for my sold gold?",
      answer: "Payouts are transferred instantly to your bank account via UPI, IMPS, or NEFT, or cash payout as per government regulatory guidelines."
    }
  ];

  return (
    <div className="sellgold-page-container">
      {/* Back button & Breadcrumb */}
      <div className="sellgold-header-nav">
        <button className="sellgold-back-btn" onClick={onBack || (() => window.location.hash = '')}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <span className="sellgold-breadcrumb">Home / Physical Gold / Sell Old Gold</span>
      </div>

      {/* Gold Sub Header Nav Bar */}
      <div className="gold-sub-navbar">
        <div className="gold-nav-brand">
          <Coins size={20} className="gold-nav-icon" />
          <span>Gold Portal <small>by ZONIRAZ</small></span>
        </div>
        <div className="gold-nav-links">
          <a href="#buy-gold" className="gold-nav-link">BUY GOLD</a>
          <a href="#sell-gold" className="gold-nav-link active">SELL OLD GOLD</a>
        </div>
      </div>

      <div className="sellgold-content-wrapper">
        <div className="sellgold-heading-block">
          <h1 className="sellgold-main-title">Sell Old Gold</h1>
          <p className="sellgold-subtitle">
            Get maximum market value for your physical old gold ornaments with 100% transparent Karatmeter testing and instant payout.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="gold-features-bar">
          <div className="feature-item">
            <Shield className="feature-icon" size={24} />
            <div>
              <strong>German Karatmeter Testing</strong>
              <p>100% non-destructive & accurate purity check</p>
            </div>
          </div>
          <div className="feature-item">
            <Award className="feature-icon" size={24} />
            <div>
              <strong>Live Market Rates</strong>
              <p>Best price guaranteed for old physical gold</p>
            </div>
          </div>
          <div className="feature-item">
            <CheckCircle2 className="feature-icon" size={24} />
            <div>
              <strong>Instant Payout</strong>
              <p>Immediate bank transfer (UPI/IMPS/NEFT)</p>
            </div>
          </div>
        </div>

        {/* Contact Us Form & Info Section */}
        <div className="sellgold-contact-grid">
          {/* Left Column: Contact & Store Info */}
          <div className="sellgold-info-card">
            <h2 className="info-card-title">Visit Our Store or Contact Us</h2>
            <p className="info-card-desc">
              Have old gold jewellery, coins, or bars? Book an appointment or contact our team directly for a free valuation.
            </p>

            <div className="info-details-list">
              <div className="info-detail-item">
                <MapPin className="detail-icon" size={20} />
                <div>
                  <strong>Store Address</strong>
                  <p>Tilak Market, 7, Hanuman Burj, Kabir Colony, Alwar, Rajasthan 301001, India</p>
                </div>
              </div>

              <div className="info-detail-item">
                <Phone className="detail-icon" size={20} />
                <div>
                  <strong>Phone / Call Us</strong>
                  <p><a href="tel:+919784836060">+91 9784836060</a></p>
                </div>
              </div>

              <div className="info-detail-item">
                <Mail className="detail-icon" size={20} />
                <div>
                  <strong>Email Inquiry</strong>
                  <p><a href="mailto:zonirazjewelhose@gmail.com">zonirazjewelhose@gmail.com</a></p>
                </div>
              </div>

              <div className="info-detail-item">
                <Clock className="detail-icon" size={20} />
                <div>
                  <strong>Store Hours</strong>
                  <p>Mon - Sat: 10:00 AM - 8:00 PM (Sunday Closed)</p>
                </div>
              </div>
            </div>

            <div className="important-note-box">
              <strong>Note:</strong> Please carry a valid Photo ID (Aadhaar / PAN card) when visiting our store for physical gold evaluation.
            </div>
          </div>

          {/* Right Column: Contact Us Form */}
          <div className="sellgold-form-card">
            <h2 className="form-card-title">Sell Old Gold Enquiry Form</h2>
            <p className="form-card-subtitle">Fill in your details below and our team will get in touch with you shortly.</p>

            <form onSubmit={handleSubmit} className="sellgold-contact-form">
              <div className="form-row-2col">
                <div className="form-field">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="mobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobile"
                    placeholder="10-digit Mobile Number"
                    pattern="[0-9]{10}"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-row-2col">
                <div className="form-field">
                  <label htmlFor="appointmentDate">Store Visit Date (Optional)</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="appointmentTime">Preferred Time Slot (Optional)</label>
                  <select
                    id="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  >
                    <option value="">Select Time Slot</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="goldDetails">Physical Gold Details / Query *</label>
                <textarea
                  id="goldDetails"
                  rows="4"
                  placeholder="Mention gold items (e.g. Bangles, Ring, Chain), approximate weight in grams, or any questions..."
                  required
                  value={formData.goldDetails}
                  onChange={(e) => setFormData({ ...formData, goldDetails: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="sellgold-submit-btn" disabled={submitted}>
                {submitted ? 'Submitting Enquiry...' : 'Submit Sell Enquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="sellgold-faq-section">
          <h2 className="faq-main-title">Selling Physical Old Gold <span>FAQs</span></h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'open' : ''}`}>
                <div className="faq-question-row" onClick={() => toggleFaq(i)}>
                  <h3>{faq.question}</h3>
                  {activeFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {activeFaq === i && (
                  <div className="faq-answer-row">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded CSS */}
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
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FAF8F6;
          border: 1px solid #E5DFD9;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          color: #554A42;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sellgold-back-btn:hover {
          background: #EFEAE4;
          color: #2C2520;
        }

        .sellgold-breadcrumb {
          font-size: 12px;
          color: #8C7E75;
          letter-spacing: 0.5px;
        }

        .gold-sub-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #EFEAE4;
          border-radius: 12px;
          padding: 12px 24px;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        }

        .gold-nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 18px;
          color: #A98E73;
        }

        .gold-nav-brand small {
          font-size: 11px;
          color: #8C7E75;
          font-weight: 400;
        }

        .gold-nav-links {
          display: flex;
          gap: 20px;
        }

        .gold-nav-link {
          text-decoration: none;
          color: #6C5F56;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .gold-nav-link:hover {
          color: #A98E73;
        }

        .gold-nav-link.active {
          color: #A98E73;
          border-bottom: 2px solid #A98E73;
          border-radius: 0;
        }

        .sellgold-content-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sellgold-heading-block {
          margin-bottom: 30px;
          text-align: left;
        }

        .sellgold-main-title {
          font-size: 32px;
          font-weight: 600;
          color: #2C2520;
          margin-bottom: 8px;
        }

        .sellgold-subtitle {
          font-size: 15px;
          color: #6C5F56;
          max-width: 750px;
          line-height: 1.6;
        }

        .gold-features-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 35px;
        }

        .feature-item {
          background: #FFFFFF;
          border: 1px solid #EFEAE4;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .feature-icon {
          color: #A98E73;
          flex-shrink: 0;
        }

        .feature-item strong {
          display: block;
          font-size: 14px;
          color: #2C2520;
          margin-bottom: 2px;
        }

        .feature-item p {
          font-size: 12px;
          color: #8C7E75;
          margin: 0;
        }

        .sellgold-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 30px;
          margin-bottom: 50px;
        }

        @media (max-width: 850px) {
          .sellgold-contact-grid {
            grid-template-columns: 1fr;
          }
        }

        .sellgold-info-card {
          background: #FFFFFF;
          border: 1px solid #EFEAE4;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .info-card-title {
          font-size: 22px;
          font-weight: 600;
          color: #2C2520;
          margin-bottom: 8px;
        }

        .info-card-desc {
          font-size: 14px;
          color: #6C5F56;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .info-details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .info-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .detail-icon {
          color: #A98E73;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .info-detail-item strong {
          display: block;
          font-size: 14px;
          color: #2C2520;
          margin-bottom: 2px;
        }

        .info-detail-item p {
          font-size: 13px;
          color: #6C5F56;
          margin: 0;
          line-height: 1.4;
        }

        .info-detail-item a {
          color: #A98E73;
          text-decoration: none;
        }

        .important-note-box {
          background: #FAF5EE;
          border-left: 4px solid #A98E73;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          color: #5C4A3A;
        }

        .sellgold-form-card {
          background: #FFFFFF;
          border: 1px solid #EFEAE4;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
        }

        .form-card-title {
          font-size: 22px;
          font-weight: 600;
          color: #2C2520;
          margin-bottom: 6px;
        }

        .form-card-subtitle {
          font-size: 13px;
          color: #8C7E75;
          margin-bottom: 24px;
        }

        .sellgold-contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .form-row-2col {
            grid-template-columns: 1fr;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 600;
          color: #4A3E36;
          letter-spacing: 0.3px;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #E0D7CE;
          border-radius: 8px;
          background: #FDFBF9;
          font-size: 14px;
          color: #2C2520;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #A98E73;
          box-shadow: 0 0 0 3px rgba(169, 142, 115, 0.12);
          background: #FFFFFF;
        }

        .sellgold-submit-btn {
          margin-top: 8px;
          padding: 14px 24px;
          background: #2C2520;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }

        .sellgold-submit-btn:hover {
          background: #A98E73;
        }

        .sellgold-submit-btn:disabled {
          background: #CCCCCC;
          cursor: not-allowed;
        }

        .sellgold-faq-section {
          background: #FFFFFF;
          border: 1px solid #EFEAE4;
          border-radius: 16px;
          padding: 35px 30px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.02);
        }

        .faq-main-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #2C2520;
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
          border: 1px solid #EFEAE4;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .faq-question-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #FDFBF9;
          cursor: pointer;
        }

        .faq-question-row h3 {
          font-size: 15px;
          font-weight: 500;
          color: #2C2520;
          margin: 0;
        }

        .faq-answer-row {
          padding: 16px 20px;
          background: #FFFFFF;
          border-top: 1px solid #EFEAE4;
        }

        .faq-answer-row p {
          font-size: 14px;
          color: #6C5F56;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
