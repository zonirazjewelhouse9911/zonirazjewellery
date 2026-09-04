import React from 'react';
const ringTopImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498434/zoniraz_frontend/aneka.jpg";
const ringBottomImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498436/zoniraz_frontend/stretchable-bangles.jpg";
const heritageImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498480/zoniraz_frontend/shaya-diamonds.jpg";

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
            <img src={ringTopImg} alt="Gold Diamond Ring" className="zw-card-img" loading="lazy" decoding="async" width="500" height="300" />
          </div>
          <div className="zw-card zw-card-stacked">
            <img src={ringBottomImg} alt="Diamond Band" className="zw-card-img" loading="lazy" decoding="async" width="500" height="300" />
          </div>
        </div>

        {/* Right featured card */}
        <div className="zw-right-col">
          <div className="zw-card zw-card-featured">
            <img src={heritageImg} alt="The Heritage Collection" className="zw-card-img" loading="lazy" decoding="async" width="600" height="620" />
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
