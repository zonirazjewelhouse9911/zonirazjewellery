import React from 'react';

// Dynamically import all feature images from assets/image
const featureImages = Object.values(
  import.meta.glob('../assets/image/*.jpeg', { eager: true, import: 'default' })
);

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

        {/* Feature Images Showcase Grid */}
        <div className="ep-images-grid">
          {featureImages.map((imgSrc, idx) => (
            <div key={idx} className="ep-image-item">
              <img 
                src={imgSrc} 
                alt={`Zoniraz Guarantee ${idx + 1}`} 
                className="ep-feature-img" 
              />
            </div>
          ))}
        </div>

        {/* Banner Cards Row */}
        <div className="ep-banner-cards-row">
          <a href="#gold-mine" className="ep-banner-card" style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
            <img src="/zoniraz banner 5.jpg.jpeg" alt="Gold Mine 10+1 Monthly Installment Plan" className="ep-banner-img" />
          </a>
          <a href="#sell-gold" className="ep-banner-card" style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
            <img src="/gold banner .jpg.jpeg" alt="Sell & Exchange Old Gold" className="ep-banner-img" />
          </a>
        </div>

      </div>
    </section>
  );
}
