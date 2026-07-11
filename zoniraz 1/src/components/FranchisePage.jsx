import React, { useState } from 'react';
import goldNecklaceSilk from '../assets/gold-necklace-silk.png';

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    budget: '',
    experience: '',
    details: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.location || !formData.budget) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    // Simulate API Submission
    setTimeout(() => {
      setSubmitting(false);
      alert("Thank you! Your Franchise Enquiry has been submitted successfully. Our team will review your application and contact you shortly.");
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        budget: '',
        experience: '',
        details: ''
      });
    }, 1500);
  };

  return (
    <div className="franchise-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .franchise-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #5d463c;
          min-height: 100vh;
          padding: 40px 4% 80px 4%;
        }

        .franchise-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Breadcrumbs */
        .franchise-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .franchise-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .franchise-breadcrumb a:hover {
          color: #c5a880;
        }

        .franchise-hero {
          position: relative;
          background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/jewelry banner 1.jpg.jpeg");
          background-size: cover;
          background-position: center;
          border-radius: 20px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          margin-bottom: 50px;
          box-shadow: 0 10px 30px rgba(93, 70, 60, 0.15);
        }

        .franchise-hero-content {
          max-width: 800px;
          color: #ffffff;
        }

        .franchise-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          font-weight: 400;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .franchise-hero-subtitle {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Three Value Cards */
        .franchise-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 50px;
        }

        .value-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 40px 35px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(93, 70, 60, 0.08);
        }

        .value-card-icon-wrapper {
          width: 54px;
          height: 54px;
          background-color: #f7f3f1;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          color: #c5a880;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .value-card:hover .value-card-icon-wrapper {
          background-color: #5d463c;
          color: #c5a880;
        }

        .value-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: #2b221d;
          margin-bottom: 12px;
        }

        .value-card-desc {
          font-size: 13px;
          line-height: 1.6;
          color: #746380;
        }

        /* Main Split Container */
        .franchise-form-card {
          background-color: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(93, 70, 60, 0.06);
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          margin-bottom: 40px;
        }

        /* Left Side */
        .franchise-info-panel {
          background-color: #2b221d;
          color: #ffffff;
          padding: 60px 45px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .info-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 400;
          line-height: 1.25;
          margin-bottom: 16px;
        }

        .info-panel-desc {
          font-size: 13px;
          line-height: 1.7;
          color: #d5c8bf;
          margin-bottom: 48px;
          font-weight: 300;
        }

        .info-point {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 32px;
        }

        .info-point-icon {
          width: 38px;
          height: 38px;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c5a880;
          flex-shrink: 0;
        }

        .info-point-text h4 {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .info-point-text p {
          font-size: 13px;
          line-height: 1.5;
          color: #d5c8bf;
          font-weight: 300;
        }

        .info-quote-box {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 24px;
          margin-top: 30px;
        }

        .info-quote-text {
          font-size: 12.5px;
          line-height: 1.6;
          color: #d5c8bf;
          font-style: italic;
          font-weight: 300;
        }

        /* Right Side Form */
        .franchise-form-panel {
          padding: 60px 50px;
          background-color: #ffffff;
        }

        .form-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group-full {
          grid-column: span 2;
        }

        .form-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #8c7365;
        }

        .form-input, .form-select, .form-textarea {
          padding: 12px 16px;
          border: 1.5px solid #dbcfcb;
          border-radius: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #2b221d;
          background-color: #faf7f5;
          outline: none;
          transition: border-color 0.25s ease, background-color 0.25s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #c5a880;
          background-color: #ffffff;
        }

        .form-textarea {
          height: 110px;
          resize: none;
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #bfaea8;
          font-size: 13px;
        }

        .submit-btn {
          width: 100%;
          background-color: #c5a880;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 16px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(197, 168, 128, 0.2);
        }

        .submit-btn:hover {
          background-color: #5d463c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(93, 70, 60, 0.15);
        }

        .submit-btn:disabled {
          background-color: #dbcfcb;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .privacy-disclaimer {
          margin-top: 24px;
          font-size: 9px;
          color: #8c7365;
          text-align: center;
          letter-spacing: 1px;
          line-height: 1.5;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .franchise-form-card {
            grid-template-columns: 1fr;
          }
          .franchise-hero-title {
            font-size: 42px;
          }
        }

        @media (max-width: 768px) {
          .franchise-values-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .form-grid-2col {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .form-group-full {
            grid-column: span 1;
          }
          .franchise-info-panel, .franchise-form-panel {
            padding: 40px 24px;
          }
          .franchise-hero-title {
            font-size: 32px;
          }
          .franchise-hero {
            height: 300px;
          }
          .info-panel-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="franchise-container">
        {/* Breadcrumb */}
        <div className="franchise-breadcrumb">
          <a href="#">Home</a> / <span>Franchise Enquiry</span>
        </div>

        {/* Hero Section */}
        <div className="franchise-hero">
          <div className="franchise-hero-content">
          </div>
        </div>

        {/* Three Value Proposition Cards */}
        <div className="franchise-values-grid">
          {/* Card 1: Heritage Excellence */}
          <div className="value-card">
            <div className="value-card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}>
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h3 className="value-card-title">Heritage Excellence</h3>
            <p className="value-card-desc">
              50 years of manufacturing excellence and trust in the international jewels market.
            </p>
          </div>

          {/* Card 2: Global Reach */}
          <div className="value-card">
            <div className="value-card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 className="value-card-title">Global Reach</h3>
            <p className="value-card-desc">
              A leading exporter and wholesaler with a footprint spanning major jewelry hubs.
            </p>
          </div>

          {/* Card 3: Partner Support */}
          <div className="value-card">
            <div className="value-card-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '24px', height: '24px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="value-card-title">Partner Support</h3>
            <p className="value-card-desc">
              Comprehensive operational support, marketing leverage, and inventory management.
            </p>
          </div>
        </div>

        {/* Split Card Layout (Info + Form) */}
        <div className="franchise-form-card">
          
          {/* Left Column: Info Panel */}
          <div className="franchise-info-panel">
            <div>
              <h2 className="info-panel-title">Start Your Journey With Us</h2>
              <p className="info-panel-desc">
                We are looking for visionary partners who understand the language of luxury and are committed to maintaining the high standards of the Zoniraz brand.
              </p>

              {/* Expansion Model */}
              <div className="info-point">
                <div className="info-point-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div className="info-point-text">
                  <h4>Expansion Model</h4>
                  <p>FOCO & FOFO Models available for Tier 1 & Tier 2 cities.</p>
                </div>
              </div>

              {/* Brand Value */}
              <div className="info-point">
                <div className="info-point-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                </div>
                <div className="info-point-text">
                  <h4>Brand Value</h4>
                  <p>Access to exclusive collections and established customer loyalty.</p>
                </div>
              </div>
            </div>

            {/* Legacy Quote */}
            <div className="info-quote-box">
              <p className="info-quote-text">
                "Our franchise partners aren't just business associates; they are the guardians of our 50-year legacy."
              </p>
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="franchise-form-panel">
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2col">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* City / Location */}
                <div className="form-group">
                  <label className="form-label" htmlFor="location">City / Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    placeholder="Preferred location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Investment Budget */}
                <div className="form-group">
                  <label className="form-label" htmlFor="budget">Investment Budget *</label>
                  <select
                    id="budget"
                    name="budget"
                    className="form-select"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Range</option>
                    <option value="50l-1c">₹50 Lakhs - ₹1 Crore</option>
                    <option value="1c-2c">₹1 Crore - ₹2 Crores</option>
                    <option value="2c-5c">₹2 Crores - ₹5 Crores</option>
                    <option value="5c+">Above ₹5 Crores</option>
                  </select>
                </div>

                {/* Business Experience */}
                <div className="form-group">
                  <label className="form-label" htmlFor="experience">Business Experience</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    className="form-input"
                    placeholder="e.g. Retail, Real Estate"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                {/* Additional Details */}
                <div className="form-group form-group-full">
                  <label className="form-label" htmlFor="details">Additional Details</label>
                  <textarea
                    id="details"
                    name="details"
                    className="form-textarea"
                    placeholder="Tell us about your vision for a Zoniraz franchise.."
                    value={formData.details}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '13px', height: '13px' }}>
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>

              <div className="privacy-disclaimer">
                By submitting this form, you agree to our franchise partnership terms & privacy policy
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
