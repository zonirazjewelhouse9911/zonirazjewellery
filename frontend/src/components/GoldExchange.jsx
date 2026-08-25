import React from 'react';

import purityBadgeImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.04 PM (1).jpeg';
import purityMarkImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.04 PM.jpeg';
import sglImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.05 PM (1).jpeg';
import igiImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.05 PM.jpeg';
import trustSafetyImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.06 PM (1).jpeg';
import certQualityImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.06 PM (2).jpeg';
import naturalDiamondImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.06 PM.jpeg';
import bisLogoImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.07 PM (1).jpeg';
import authenticJewelleryImg from '../assets/WhatsApp Image 2026-07-24 at 12.32.07 PM.jpeg';

const certBadges = [
  { id: 1, img: purityBadgeImg, alt: 'Assured Purity & Trusted Quality', title: 'Assured Purity' },
  { id: 2, img: purityMarkImg, alt: '22K916 Purity Mark', title: 'Purity Hallmark' },
  { id: 3, img: sglImg, alt: 'SGL Solitaire Gemmological Laboratories', title: 'SGL Certified' },
  { id: 4, img: igiImg, alt: 'IGI International Gemological Institute', title: 'IGI Certified' },
  { id: 5, img: trustSafetyImg, alt: 'Trust & Safety', title: 'Trust & Safety' },
  { id: 6, img: certQualityImg, alt: 'Certified Quality', title: 'Certified Quality' },
  { id: 7, img: naturalDiamondImg, alt: '100% Natural Diamond Certified', title: 'Natural Diamond' },
  { id: 8, img: bisLogoImg, alt: 'BIS Hallmarked Logo', title: 'BIS Hallmarked' },
  { id: 9, img: authenticJewelleryImg, alt: 'Authentic Jewellery Guarantee', title: 'Authentic Jewellery' }
];

export default function GoldExchange() {
  return (
    <section className="ge-section">
      <div className="ge-container">
        {/* Sell Old Gold Card */}
        <div className="ge-card ge-sell-card">
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

          <a href="#sell-gold" className="ge-card-btn">
            SELL OLD GOLD &rarr;
          </a>

          {/* Faint background decorative arrow */}
          <div className="ge-deco-arrow">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.06">
              <path d="M20 50 C20 30, 40 20, 60 20 C80 20, 80 40, 60 50 C40 60, 40 80, 80 80" strokeLinecap="round" />
              <polyline points="70 70 80 80 70 90" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* New Separate Trust & Certification Card Below */}
        <div className="ge-card ge-trust-card">
          <div className="ge-trust-header">
            <div className="ge-card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="ge-card-title ge-trust-title">Our Trust & Purity Assurances</h3>
              <p className="ge-card-description ge-trust-desc">
                100% Hallmarked gold, international gemological certification & complete purity guarantee.
              </p>
            </div>
          </div>

          <div className="ge-cert-grid">
            {certBadges.map((badge) => (
              <div key={badge.id} className="ge-cert-badge-item">
                <div className="ge-cert-img-box">
                  <img src={badge.img} alt={badge.alt} title={badge.title} className="ge-cert-badge-img" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

