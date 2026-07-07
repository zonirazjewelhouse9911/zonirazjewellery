import React from 'react';

export default function GoldExchange() {
  return (
    <section className="ge-section">
      <div className="ge-grid">
        {/* Left Card - Sell Old Gold */}
        <div className="ge-card">
          <div className="ge-card-icon-wrap">
            <span className="ge-icon-rotated">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="5" width="14" height="14" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </span>
          </div>

          <h3 className="ge-card-title">Sell Your Old Gold</h3>
          <p className="ge-card-description">
            Turn your unused gold into instant value with our transparent in-store valuation process.
          </p>
          <p className="ge-card-fineprint">* ALWAR BRANCH ONLY</p>

          <a href="#book-valuation" className="ge-card-btn">
            BOOK VALUATION &rarr;
          </a>

          {/* Faint background decorative arrow */}
          <div className="ge-deco-arrow">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.06">
              <path d="M20 50 C20 30, 40 20, 60 20 C80 20, 80 40, 60 50 C40 60, 40 80, 80 80" strokeLinecap="round" />
              <polyline points="70 70 80 80 70 90" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right Card - Exchange Program */}
        <div className="ge-card">
          <div className="ge-card-icon-wrap ge-icon-arch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.5 2v6h6M21.5 22v-6h-6" />
              <path d="M22 11.5A10 10 0 0 0 3.2 7.2L2.5 8M2 12.5a10 10 0 0 0 18.8 4.3l0.7-0.8" />
            </svg>
          </div>

          <h3 className="ge-card-title">Exchange your Old Gold for 100% Value!</h3>
          <p className="ge-card-description">
            Unlock full value for your old gold today with our <strong>Exchange Program!</strong>
          </p>

          <a href="#exchange-program" className="ge-card-btn">
            KNOW MORE &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
