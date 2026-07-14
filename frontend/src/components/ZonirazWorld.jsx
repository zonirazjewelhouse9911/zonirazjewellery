import React from 'react';
import ringTopImg from '../assets/aneka.png';
import ringBottomImg from '../assets/stretchable-bangles.png';
import heritageImg from '../assets/shaya-diamonds.png';

export default function ZonirazWorld() {
  return (
    <section className="zw-section">
      <div className="zw-header">
        <h2 className="zw-title">Zoniraz World</h2>
        <div className="zw-underline" />
      </div>

      <div className="zw-grid">
        {/* Left stacked cards */}
        <div className="zw-left-col">
          <div className="zw-card zw-card-stacked">
            <img src={ringTopImg} alt="Gold Diamond Ring" className="zw-card-img" />
          </div>
          <div className="zw-card zw-card-stacked">
            <img src={ringBottomImg} alt="Diamond Band" className="zw-card-img" />
          </div>
        </div>

        {/* Right featured card */}
        <div className="zw-right-col">
          <div className="zw-card zw-card-featured">
            <img src={heritageImg} alt="The Heritage Collection" className="zw-card-img" />
            <div className="zw-featured-overlay">
              <h3 className="zw-featured-title">The Heritage</h3>
              <p className="zw-featured-subtitle">CRAFTING BRILLIANCE FOR GENERATIONS.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
