import React from 'react';
import rightBgImg from '../assets/nine-kt.png';
import silverIdolsImg from '../assets/silver-bracelets.png';
import mangalsutraImg from '../assets/trendy-mangalsutras.png';

export default function NewArrivals() {
  return (
    <section className="na-section">
      {/* Banner Container */}
      <div 
        className="na-banner"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(93, 70, 60, 0.95) 0%, rgba(93, 70, 60, 0.8) 50%, rgba(0, 0, 0, 0) 100%), url(${rightBgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center'
        }}
      >
        <div className="na-banner-content">
          <div className="na-title-row">
            <h2 className="na-title">New Arrivals</h2>
            <span className="na-badge">
              <span className="na-badge-icon">💎</span> 500+ New Items
            </span>
          </div>
          <p className="na-description">
            New Arrivals Dropping Daily, Monday through Friday.<br />
            Explore the Latest Launches Now!
          </p>
        </div>
      </div>

      {/* Floating Overlapping Cards */}
      <div className="na-cards-row">
        <a href="#silver-idols" className="na-card">
          <div className="na-card-img-wrap">
            <img src={silverIdolsImg} alt="Silver Idols" className="na-card-img" />
          </div>
          <div className="na-card-label">Silver Idols</div>
        </a>

        <a href="#station-mangalsutra" className="na-card">
          <div className="na-card-img-wrap">
            <img src={mangalsutraImg} alt="Station Mangalsutra" className="na-card-img" />
          </div>
          <div className="na-card-label">Station Mangalsutra</div>
        </a>
      </div>
    </section>
  );
}
