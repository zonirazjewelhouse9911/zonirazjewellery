import React from 'react';

export default function ExchangeProgram() {
  return (
    <section className="ep-section">
      <div className="ep-container">
        {/* Header Block */}
        <div className="ep-header">
          <h2 className="ep-title">Exchange Program</h2>
          <p className="ep-subtitle">Trusted by 2.8M+ families</p>
          <a href="#explore-exchange" className="ep-cta-btn">
            EXPLORE NOW &rarr;
          </a>
        </div>

        {/* Text Divider Line */}
        <div className="ep-divider-row">
          <div className="ep-line" />
          <p className="ep-divider-text">
            Trust us to be part of your precious moments and to deliver jewellery that you'll cherish forever.
          </p>
          <div className="ep-line" />
        </div>

        {/* 4 Feature Columns */}
        <div className="ep-features-grid">
          {/* Feature 1 */}
          <div className="ep-feature-item">
            <div className="ep-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                <path d="M22 11.5A10 10 0 0 0 3.2 7.2L2.5 8M2 12.5a10 10 0 0 0 18.8 4.3l0.7-0.8" />
              </svg>
            </div>
            <h4 className="ep-feature-title">Zoniraz Exchange</h4>
          </div>

          {/* Feature 2 */}
          <div className="ep-feature-item">
            <div className="ep-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 12L2 9z" />
                <path d="M11 3 8 9l4 12 4-12-3-6" />
              </svg>
            </div>
            <h4 className="ep-feature-title">The Purity Guarantee</h4>
          </div>

          {/* Feature 3 */}
          <div className="ep-feature-item">
            <div className="ep-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4 className="ep-feature-title">Complete Transparency and Trust</h4>
          </div>

          {/* Feature 4 */}
          <div className="ep-feature-item">
            <div className="ep-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h4 className="ep-feature-title">Lifetime Maintenance</h4>
          </div>
        </div>
      </div>
    </section>
  );
}
