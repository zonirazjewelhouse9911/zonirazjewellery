import React from 'react';

export default function BottomRibbon() {
  return (
    <div className="bottom-ribbon">
      <div className="ribbon-features-full">
        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3v18M3 12h18M12 3c3 4 3 6 0 9s-3 5 0 9M3 12c4-3 6-3 9 0s5 3 9 0" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="feature-info">
            <h3>Elegance</h3>
            <p>We celebrate grace in simplicity and design.</p>
          </div>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 3h12l4 6-10 12L2 9z" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="feature-info">
            <h3>Quality</h3>
            <p>Meticulously crafted jewelry for lasting brilliance.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M20 12h2M2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4"/>
            </svg>
          </div>
          <div className="feature-info">
            <h3>Innovation</h3>
            <p>Constantly evolving to create modern, unique pieces.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
