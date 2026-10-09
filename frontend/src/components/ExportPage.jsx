import React, { useState } from 'react';

export default function ExportPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    businessType: '',
    productInterest: '',
    orderVolume: '',
    timeline: '',
    requirements: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyName || !formData.email || !formData.phone || !formData.country || !formData.businessType) {
      alert("Please fill in all mandatory fields marked with *");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    const formEl = document.getElementById('export-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="export-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .export-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 36px 4% 80px 4%;
        }

        .export-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Breadcrumbs */
        .export-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 22px;
          font-weight: 600;
        }

        .export-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .export-breadcrumb a:hover {
          color: #c5a880;
        }

        /* Hero Showcase Banner */
        .export-hero-showcase {
          background: linear-gradient(135deg, #1f1815 0%, #2c221d 50%, #17120f 100%);
          border: 1px solid rgba(197, 168, 128, 0.28);
          border-radius: 28px;
          padding: 60px 40px;
          text-align: center;
          margin-bottom: 45px;
          box-shadow: 0 16px 40px rgba(31, 24, 21, 0.16);
          position: relative;
          overflow: hidden;
        }

        .export-hero-showcase::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(245, 196, 81, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .export-hero-showcase::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .export-hero-content {
          position: relative;
          z-index: 2;
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .export-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245, 196, 81, 0.12);
          border: 1px solid rgba(245, 196, 81, 0.35);
          color: #F5C451;
          border-radius: 30px;
          padding: 7px 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .badge-sparkle {
          font-size: 12px;
          color: #F5C451;
        }

        .export-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 500;
          line-height: 1.25;
          margin: 0 0 16px 0;
          color: #ffffff;
        }

        .gold-shimmer-text {
          background: linear-gradient(135deg, #F5C451 0%, #ecd599 50%, #c5a880 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }

        .export-hero-subtitle {
          font-size: 14.5px;
          color: #d5c8bf;
          line-height: 1.7;
          margin: 0 0 32px 0;
          font-weight: 300;
          max-width: 720px;
        }

        /* Stats Row */
        .export-hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 18px 24px;
          margin-bottom: 34px;
          width: 100%;
          max-width: 780px;
          box-sizing: border-box;
          gap: 12px;
        }

        .hero-stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 600;
          color: #F5C451;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #d5c8bf;
          font-weight: 500;
          margin-top: 4px;
        }

        /* Hero Action Buttons */
        .export-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-primary-btn {
          background: linear-gradient(135deg, #c5a880 0%, #b8986c 100%);
          color: #ffffff;
          padding: 15px 32px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(197, 168, 128, 0.3);
          border: none;
          cursor: pointer;
        }

        .hero-primary-btn:hover {
          background: linear-gradient(135deg, #d8bc93 0%, #c5a880 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(197, 168, 128, 0.4);
        }

        .hero-secondary-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          padding: 15px 28px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
        }

        .hero-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
        }

        /* Pillars Grid */
        .export-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          margin-bottom: 50px;
        }

        .pillar-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 32px 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #dbcfcb;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(93, 70, 60, 0.1);
        }

        .pillar-icon-wrapper {
          width: 52px;
          height: 52px;
          background-color: #faf7f5;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c5a880;
          margin-bottom: 18px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .pillar-card:hover .pillar-icon-wrapper {
          background-color: #2b221d;
          color: #F5C451;
        }

        .pillar-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 600;
          color: #2b221d;
          margin: 0 0 8px 0;
        }

        .pillar-desc {
          font-size: 12.5px;
          color: #746380;
          line-height: 1.55;
          margin: 0;
        }

        /* Split Section: Form & Info */
        .export-main-card {
          background-color: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(93, 70, 60, 0.07);
          border: 1px solid #dbcfcb;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          margin-bottom: 50px;
        }

        /* Left Side (Info) */
        .export-info-panel {
          background-color: #2b221d;
          color: #ffffff;
          padding: 55px 42px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .export-info-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: #F5C451;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .export-info-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 400;
          line-height: 1.3;
          margin: 0 0 16px 0;
          color: #ffffff;
        }

        .export-info-desc {
          font-size: 13.5px;
          line-height: 1.7;
          color: #d5c8bf;
          margin-bottom: 36px;
          font-weight: 300;
        }

        .export-spec-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 36px;
        }

        .export-spec-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .export-spec-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c5a880;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .export-spec-text h4 {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .export-spec-text p {
          font-size: 12.5px;
          color: #d5c8bf;
          line-height: 1.5;
          margin: 0;
          font-weight: 300;
        }

        .export-quick-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 22px;
        }

        .export-quick-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #F5C451;
          margin-bottom: 12px;
        }

        .export-contact-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
        }

        .export-contact-link {
          color: #ffffff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: color 0.2s ease;
        }

        .export-contact-link:hover {
          color: #c5a880;
        }

        /* Right Side (Form) */
        .export-form-panel {
          padding: 55px 48px;
          background-color: #ffffff;
        }

        .form-heading-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 500;
          color: #2b221d;
          margin: 0 0 6px 0;
        }

        .form-heading-subtitle {
          font-size: 13px;
          color: #746380;
          margin-bottom: 28px;
        }

        .export-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 18px;
          margin-bottom: 20px;
        }

        .export-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .export-form-group-full {
          grid-column: span 2;
        }

        .export-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #2b221d;
        }

        .export-label span {
          color: #de3581;
        }

        .export-input, .export-select, .export-textarea {
          padding: 12px 16px;
          border: 1.5px solid #dbcfcb;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #2b221d;
          background-color: #faf7f5;
          outline: none;
          transition: border-color 0.2s ease, background-color 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .export-input:focus, .export-select:focus, .export-textarea:focus {
          border-color: #2b221d;
          background-color: #ffffff;
        }

        .export-textarea {
          height: 105px;
          resize: vertical;
        }

        .export-submit-btn {
          width: 100%;
          background-color: #2b221d;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 16px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
          margin-top: 12px;
          box-shadow: 0 4px 15px rgba(43, 34, 29, 0.15);
        }

        .export-submit-btn:hover {
          background-color: #5d463c;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(43, 34, 29, 0.22);
        }

        .export-submit-btn:disabled {
          background-color: #bfaea8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .export-success-banner {
          background-color: #f7fbf8;
          border: 1.5px solid #a3d9a5;
          border-radius: 16px;
          padding: 35px 28px;
          text-align: center;
        }

        .export-success-icon {
          width: 50px;
          height: 50px;
          background-color: #2e7d32;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        .export-success-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #1e4620;
          margin: 0 0 8px 0;
        }

        .export-success-desc {
          font-size: 13.5px;
          color: #3b6e3f;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .export-reset-btn {
          background-color: #2b221d;
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 20px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
        }

        /* Process Steps */
        .export-process-section {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 45px 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid #dbcfcb;
          margin-bottom: 50px;
        }

        .process-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .process-sec-tag {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: #c5a880;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }

        .process-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #2b221d;
          margin: 0;
          font-weight: 500;
        }

        .process-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          position: relative;
        }

        .process-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-number-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ebdcd0;
          color: #2b221d;
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border: 1.5px solid #c5a880;
        }

        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: #2b221d;
          margin: 0 0 6px 0;
        }

        .step-desc {
          font-size: 12px;
          color: #746380;
          line-height: 1.55;
          margin: 0;
        }

        /* FAQ Section */
        .export-faq-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 45px 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid #dbcfcb;
        }

        .faq-item {
          border-bottom: 1px solid #ede4e0;
          padding: 18px 0;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 500;
          color: #2b221d;
          gap: 16px;
        }

        .faq-icon {
          color: #c5a880;
          font-size: 20px;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .faq-answer {
          font-size: 13.5px;
          color: #746380;
          line-height: 1.7;
          margin-top: 12px;
          padding-right: 20px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .export-hero-showcase {
            padding: 45px 30px;
          }
          .export-hero-title {
            font-size: 34px;
          }
          .export-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .export-main-card {
            grid-template-columns: 1fr;
          }
          .process-steps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .export-hero-showcase {
            padding: 35px 20px;
            border-radius: 20px;
          }
          .export-hero-title {
            font-size: 28px;
          }
          .export-hero-subtitle {
            font-size: 13px;
          }
          .export-hero-stats {
            grid-template-columns: repeat(2, 1fr);
            padding: 14px 16px;
            gap: 16px;
          }
          .export-pillars-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .export-grid-2col {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .export-form-group-full {
            grid-column: span 1;
          }
          .export-info-panel, .export-form-panel {
            padding: 35px 20px;
          }
          .process-steps-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .export-process-section, .export-faq-card {
            padding: 35px 20px;
          }
        }
      `}</style>

      <div className="export-container">
        {/* Breadcrumbs */}
        <div className="export-breadcrumb">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Home
          </a>
          {' '}/ <span style={{ color: '#2b221d', fontWeight: 600 }}>Global Jewellery Export</span>
        </div>

        {/* Luxury Hero Banner (Clean Image-Free Editorial Layout) */}
        <div className="export-hero-showcase">
          <div className="export-hero-content">
            <div className="export-hero-badge">
              <span className="badge-sparkle">✦</span>
              <span>EST. 1974 &bull; GLOBAL JEWELLERY EXPORT DIVISION</span>
            </div>
            <h1 className="export-hero-title">
              Fine Gold &amp; Diamond <span className="gold-shimmer-text">Jewellery Exports</span>
            </h1>
            <p className="export-hero-subtitle">
              Direct factory manufacturing &amp; worldwide delivery of 100% BIS Hallmarked gold and IGI/GIA certified natural diamond jewellery for international retailers, wholesalers, and private boutique brands.
            </p>

            <div className="export-hero-stats">
              <div className="hero-stat-pill">
                <span className="stat-value">50+</span>
                <span className="stat-label">Years Legacy</span>
              </div>
              <div className="hero-stat-pill">
                <span className="stat-value">100%</span>
                <span className="stat-label">Insured Cargo</span>
              </div>
              <div className="hero-stat-pill">
                <span className="stat-value">BIS &amp; IGI</span>
                <span className="stat-label">Certified Purity</span>
              </div>
              <div className="hero-stat-pill">
                <span className="stat-value">Custom</span>
                <span className="stat-label">OEM / CAD</span>
              </div>
            </div>

            <div className="export-hero-actions">
              <button onClick={scrollToForm} className="hero-primary-btn" type="button">
                <span>Submit Export Enquiry</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '15px', height: '15px' }}>
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
              <a
                href="https://wa.me/919784836060?text=Hello%20Zoniraz,%20I%20am%20interested%20in%20Jewellery%20Export%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="hero-secondary-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px', color: '#25D366' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.419 9.86-9.86.001-2.636-1.02-5.115-2.876-6.973-1.857-1.859-4.335-2.88-6.97-2.882-5.437 0-9.863 4.42-9.866 9.861-.001 1.639.429 3.238 1.248 4.636L1.879 21.6l4.768-1.246zm11.758-5.326c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                <span>WhatsApp Trade Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="export-pillars-grid">
          {/* 1: Certified Purity */}
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '24px', height: '24px' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="pillar-title">100% Certified Purity</h3>
            <p className="pillar-desc">
              BIS Hallmarked 22K/18K/14K Gold with certified natural diamonds from IGI, GIA &amp; SGL labs.
            </p>
          </div>

          {/* 2: Global Logistics */}
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '24px', height: '24px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="pillar-title">Insured Door-to-Door</h3>
            <p className="pillar-desc">
              Global secured logistics via FedEx, Malca-Amit &amp; Brink's with end-to-end transit insurance.
            </p>
          </div>

          {/* 3: Custom B2B & OEM */}
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '24px', height: '24px' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 className="pillar-title">Custom OEM / B2B</h3>
            <p className="pillar-desc">
              Dedicated CAD/CAM designers, rapid 3D prototyping, and confidential white-label manufacturing.
            </p>
          </div>

          {/* 4: Export Compliance */}
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '24px', height: '24px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="pillar-title">Complete Compliance</h3>
            <p className="pillar-desc">
              Official Indian export documentation, Kimberly Process Certification &amp; Certificate of Origin.
            </p>
          </div>
        </div>

        {/* Main Export Section (Split Info + Form) */}
        <div className="export-main-card" id="export-form-section">
          {/* Left Column: Export Details */}
          <div className="export-info-panel">
            <div>
              <span className="export-info-tag">Direct Factory Exporter</span>
              <h2 className="export-info-title">Global Trade &amp; Bulk Orders</h2>
              <p className="export-info-desc">
                Whether you are an established international retail chain, a boutique jeweler, or an online designer brand, Zoniraz provides competitive wholesale pricing, precision craftsmanship, and dependable delivery schedules.
              </p>

              <div className="export-spec-list">
                <div className="export-spec-item">
                  <div className="export-spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="export-spec-text">
                    <h4>Gold Standards Available</h4>
                    <p>22K (916), 18K (750), 14K (585) in Yellow, Rose, and White Gold.</p>
                  </div>
                </div>

                <div className="export-spec-item">
                  <div className="export-spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="export-spec-text">
                    <h4>Diamond &amp; Gemstone Grading</h4>
                    <p>Natural Diamonds (EF-VVS, GH-VS/SI) &amp; Certified Precious Gems.</p>
                  </div>
                </div>

                <div className="export-spec-item">
                  <div className="export-spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="export-spec-text">
                    <h4>Serving Global Markets</h4>
                    <p>USA, Canada, UK, UAE / Middle East, Australia, Europe, and Southeast Asia.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="export-quick-box">
              <div className="export-quick-title">Dedicated Export Coordinator</div>
              <div className="export-contact-row">
                <a href="tel:+919784836060" className="export-contact-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', color: '#F5C451' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 97848 36060</span>
                </a>
                <a href="mailto:zonirazjewelhouse@gmail.com" className="export-contact-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', color: '#F5C451' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>zonirazjewelhouse@gmail.com</span>
                </a>
                <a href="https://wa.me/919784836060?text=Hello,%20I%20am%20interested%20in%20Zoniraz%20Jewellery%20Export%20Services." target="_blank" rel="noopener noreferrer" className="export-contact-link">
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px', color: '#25D366' }}>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.419 9.86-9.86.001-2.636-1.02-5.115-2.876-6.973-1.857-1.859-4.335-2.88-6.97-2.882-5.437 0-9.863 4.42-9.866 9.861-.001 1.639.429 3.238 1.248 4.636L1.879 21.6l4.768-1.246zm11.758-5.326c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  <span>Chat on WhatsApp Export Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="export-form-panel">
            {submitted ? (
              <div className="export-success-banner">
                <div className="export-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '26px', height: '26px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="export-success-title">Export Enquiry Received</h3>
                <p className="export-success-desc">
                  Thank you for reaching out to Zoniraz Global Exports. Our international trade executive will review your specifications and contact you with a catalogue and preliminary estimate within 24 hours.
                </p>
                <button
                  type="button"
                  className="export-reset-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      country: '',
                      businessType: '',
                      productInterest: '',
                      orderVolume: '',
                      timeline: '',
                      requirements: ''
                    });
                  }}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="form-heading-title">Export Enquiry Form</h2>
                <p className="form-heading-subtitle">Fill in your business details for customized pricing &amp; catalogues.</p>

                <div className="export-grid-2col">
                  {/* Full Name */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="fullName">Full Name <span>*</span></label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="export-input"
                      placeholder="e.g. Alexander Wright"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Company Name */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="companyName">Company / Business Name <span>*</span></label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      className="export-input"
                      placeholder="e.g. Wright Jewels LLC"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Business Email */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="email">Business Email <span>*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="export-input"
                      placeholder="alexander@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="phone">Phone / WhatsApp <span>*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="export-input"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="country">Destination Country / City <span>*</span></label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="export-input"
                      placeholder="e.g. United States, New York"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Business Type */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="businessType">Business Type <span>*</span></label>
                    <select
                      id="businessType"
                      name="businessType"
                      className="export-select"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Jewellery Wholesaler / Distributor">Jewellery Wholesaler / Distributor</option>
                      <option value="Retail Showroom Chain">Retail Showroom Chain</option>
                      <option value="Independent Boutique Jeweler">Independent Boutique Jeweler</option>
                      <option value="E-Commerce / Online Brand">E-Commerce / Online Brand</option>
                      <option value="Custom Private Label / OEM">Custom Private Label / OEM</option>
                      <option value="Corporate Gifting / Institutional">Corporate Gifting / Institutional</option>
                      <option value="Private Collector / High Net Worth">Private Collector / High Net Worth</option>
                    </select>
                  </div>

                  {/* Product Category Interest */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="productInterest">Jewellery Interest</label>
                    <select
                      id="productInterest"
                      name="productInterest"
                      className="export-select"
                      value={formData.productInterest}
                      onChange={handleChange}
                    >
                      <option value="">Select Collection</option>
                      <option value="Diamond Studded Fine Jewellery">Diamond Studded Fine Jewellery (14K/18K)</option>
                      <option value="Plain Gold Jewellery (22K / 18K)">Plain Gold Jewellery (22K / 18K)</option>
                      <option value="Solitaires & Loose Diamonds">Solitaires &amp; Certified Loose Diamonds</option>
                      <option value="Precious Gemstone Jewellery">Precious Gemstone Jewellery (Emerald, Ruby, Sapphire)</option>
                      <option value="Bridal Sets & Heavy Masterpieces">Bridal Sets &amp; Heavy Masterpieces</option>
                      <option value="Custom OEM / Bespoke CAD Production">Custom OEM / Bespoke CAD Production</option>
                      <option value="Gold Coins & Bars (24K 999)">Gold Coins &amp; Bars (24K 999 Purity)</option>
                    </select>
                  </div>

                  {/* Estimated Order Volume / Budget */}
                  <div className="export-form-group">
                    <label className="export-label" htmlFor="orderVolume">Estimated Order Value (USD)</label>
                    <select
                      id="orderVolume"
                      name="orderVolume"
                      className="export-select"
                      value={formData.orderVolume}
                      onChange={handleChange}
                    >
                      <option value="">Select Range</option>
                      <option value="Sample Order ($2,500 - $5,000)">Sample Order ($2,500 - $5,000)</option>
                      <option value="$5,000 - $25,000">$5,000 - $25,000</option>
                      <option value="$25,000 - $75,000">$25,000 - $75,000</option>
                      <option value="$75,000 - $200,000">$75,000 - $200,000</option>
                      <option value="Above $200,000 (Bulk Wholesale)">Above $200,000 (Bulk Wholesale)</option>
                    </select>
                  </div>

                  {/* Additional Requirements / Specs */}
                  <div className="export-form-group export-form-group-full">
                    <label className="export-label" htmlFor="requirements">Specifications / Requirements</label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      className="export-textarea"
                      placeholder="Please specify piece types, diamond clarity preferences (e.g. VVS-VS), gold purity (14K/18K/22K), target delivery dates, or custom CAD design references..."
                      value={formData.requirements}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button type="submit" className="export-submit-btn" disabled={submitting}>
                  {submitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Export Enquiry</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>

                <div style={{ marginTop: '16px', fontSize: '10px', color: '#8c7365', textAlign: 'center', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Zoniraz is a registered Indian jewellery exporter. All transactions comply with RBI &amp; Customs regulations.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 4-Step Export Workflow */}
        <div className="export-process-section">
          <div className="process-header">
            <span className="process-sec-tag">Smooth &amp; Transparent Workflow</span>
            <h2 className="process-sec-title">Our International Export Process</h2>
          </div>

          <div className="process-steps-grid">
            {/* Step 1 */}
            <div className="process-step-item">
              <div className="step-number-circle">01</div>
              <h3 className="step-title">Enquiry &amp; Quotation</h3>
              <p className="step-desc">
                Submit design specs or choose from our catalogue. We provide transparent live-metal based pricing &amp; stone estimations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="process-step-item">
              <div className="step-number-circle">02</div>
              <h3 className="step-title">CAD / Sample Approval</h3>
              <p className="step-desc">
                Our design studio shares 3D CAD renders and digital video renders for master approval prior to casting.
              </p>
            </div>

            {/* Step 3 */}
            <div className="process-step-item">
              <div className="step-number-circle">03</div>
              <h3 className="step-title">Precision Manufacturing</h3>
              <p className="step-desc">
                Artisanal craftsmanship, computerized stone setting, BIS hallmarking, and independent IGI/GIA diamond certification.
              </p>
            </div>

            {/* Step 4 */}
            <div className="process-step-item">
              <div className="step-number-circle">04</div>
              <h3 className="step-title">Insured Global Dispatch</h3>
              <p className="step-desc">
                Export customs clearance, tamper-proof packaging, and door-to-door courier tracking via Brink's, Malca-Amit or FedEx.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="export-faq-card">
          <div className="process-header" style={{ marginBottom: '24px' }}>
            <span className="process-sec-tag">Got Questions?</span>
            <h2 className="process-sec-title">Export Frequently Asked Questions</h2>
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(0)}>
              <span>What is the minimum order quantity (MOQ) for international orders?</span>
              <span className="faq-icon">{activeFaq === 0 ? '−' : '+'}</span>
            </div>
            {activeFaq === 0 && (
              <div className="faq-answer">
                We accommodate both sample orders for boutique partners (starting from $2,500 USD) as well as large-scale bulk manufacturing orders for multi-store retail brands. There is no strict piece minimum for high-value certified solitaires and bridal sets.
              </div>
            )}
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(1)}>
              <span>How are international jewellery shipments insured and delivered?</span>
              <span className="faq-icon">{activeFaq === 1 ? '−' : '+'}</span>
            </div>
            {activeFaq === 1 && (
              <div className="faq-answer">
                All export parcels are 100% insured against loss or damage in transit. We partner with premier precious commodity logistics providers including Malca-Amit, Brink's Global, and FedEx Express Secured Services. Full tracking details are provided upon customs clearance.
              </div>
            )}
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(2)}>
              <span>Are all exported gold and diamond jewellery items certified?</span>
              <span className="faq-icon">{activeFaq === 2 ? '−' : '+'}</span>
            </div>
            {activeFaq === 2 && (
              <div className="faq-answer">
                Yes. Every gold article is stamped with Government of India BIS Hallmark with HUID (Hallmark Unique Identification). All diamond and gemstone jewellery items are accompanied by authentic grading reports from internationally recognized labs like IGI, GIA, or SGL.
              </div>
            )}
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(3)}>
              <span>Can you manufacture custom designs under our own private brand label?</span>
              <span className="faq-icon">{activeFaq === 3 ? '−' : '+'}</span>
            </div>
            {activeFaq === 3 && (
              <div className="faq-answer">
                Absolutely. We provide full OEM and private label white-glove services. We sign non-disclosure agreements (NDAs) to protect your exclusive intellectual property and provide custom logo stamping, personalized tags, and custom jewelry packaging.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
