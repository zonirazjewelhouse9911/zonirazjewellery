import React from 'react';

// Import images to make collections look beautiful
import meshClusterRingImg from '../assets/mesh_cluster_ring.png';
import dancingHoopsImg from '../assets/dancing-hoops.png';
import infinityNecklacesImg from '../assets/infinity-necklaces.png';

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .about-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Montserrat', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 40px 24px 80px 24px;
        }

        .about-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Breadcrumb */
        .about-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 30px;
          margin-top: 15px;
          font-weight: 500;
        }
        .about-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
        }

        /* Hero Banner */
        .about-hero {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #e1d8ea;
          position: relative;
        }

        .about-hero-est {
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #c5a880;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .about-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight: 500;
          color: #2b221d;
          margin: 0 0 20px 0;
        }

        .about-hero-desc {
          font-size: 14.5px;
          color: #746380;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Main Info Section (50 Years of Excellence) */
        .about-section-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 50px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #e1d8ea;
          margin-bottom: 40px;
        }

        .about-sec-badge {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #c5a880;
          font-weight: 700;
          margin-bottom: 14px;
          display: block;
        }

        .about-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 500;
          color: #2b221d;
          margin: 0 0 20px 0;
        }

        .about-sec-paragraph {
          font-size: 14px;
          line-height: 1.8;
          color: #746380;
          margin-bottom: 24px;
          text-align: justify;
        }

        .about-quote-box {
          background-color: #fbf9f8;
          border-left: 3px solid #c5a880;
          padding: 20px 24px;
          border-radius: 0 16px 16px 0;
          font-size: 13.5px;
          line-height: 1.7;
          color: #8c7365;
          font-style: italic;
          margin: 0;
        }

        /* Counters/Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          border: 1px solid #e1d8ea;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #c5a880;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #2b221d;
        }

        /* Exquisite Collections */
        .collections-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 30px;
          color: #2b221d;
        }

        .coll-grid-luxury {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 50px;
        }
        @media (max-width: 768px) {
          .coll-grid-luxury {
            grid-template-columns: 1fr;
          }
        }

        .coll-luxury-card {
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e1d8ea;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          text-align: center;
          transition: transform 0.3s ease;
        }
        .coll-luxury-card:hover {
          transform: translateY(-5px);
        }

        .coll-img-wrapper {
          height: 220px;
          background-color: #fcfbfa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .coll-img-wrapper img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }

        .coll-luxury-details {
          padding: 24px 20px;
          border-top: 1px solid #f2ebe8;
        }

        .coll-luxury-details h4 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #2b221d;
          margin: 0 0 6px 0;
        }
        .coll-luxury-details p {
          font-size: 11px;
          color: #c5a880;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin: 0;
        }

        /* Showroom Premium Infrastructure */
        .showroom-panel {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 50px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #e1d8ea;
          margin-bottom: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .showroom-panel {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .showroom-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 500;
          color: #2b221d;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .showroom-content p {
          font-size: 14px;
          line-height: 1.7;
          color: #746380;
          margin: 0 0 20px 0;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .features-list li {
          font-size: 13.5px;
          color: #2b221d;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .features-list li::before {
          content: '✦';
          color: #c5a880;
          font-size: 14px;
        }

        .showroom-stats-box {
          background-color: #ebdcd0;
          border-radius: 20px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .support-info-row {
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px dashed rgba(43, 34, 29, 0.15);
          padding-bottom: 16px;
        }
        .support-info-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .support-info-row svg {
          width: 24px;
          height: 24px;
          color: #2b221d;
          flex-shrink: 0;
        }

        .support-info-row h5 {
          margin: 0 0 4px 0;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #2b221d;
        }
        .support-info-row p {
          margin: 0;
          font-size: 13px;
          color: #2b221d;
        }

        /* Mission & Vision Rows */
        .mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }
        @media (max-width: 768px) {
          .mv-grid {
            grid-template-columns: 1fr;
          }
        }

        .mv-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #e1d8ea;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .mv-card h4 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: #2b221d;
          margin-top: 0;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mv-card h4::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #c5a880;
          transform: rotate(45deg);
        }

        .mv-card p {
          font-size: 13.5px;
          line-height: 1.7;
          color: #746380;
          margin: 0;
          text-align: justify;
        }

        /* Stay Connected Block */
        .connected-block {
          background-color: #2b221d;
          color: #ffffff;
          border-radius: 24px;
          padding: 50px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(43, 34, 29, 0.15);
        }

        .connected-block h3 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .connected-block p {
          font-size: 14px;
          line-height: 1.7;
          color: #d4c5bd;
          max-width: 600px;
          margin: 0 auto;
        }
      `}</style>

      <div className="about-container">
        {/* Breadcrumb */}
        <div className="about-breadcrumb">
          <a href="#">Home</a> &gt; <span style={{ color: '#2b221d', fontWeight: '600' }}>About Zoniraz</span>
        </div>

        {/* Hero */}
        <div className="about-hero">
          <div className="about-hero-est">Est. 1976</div>
          <h1 className="about-hero-title">Our Heritage</h1>
          <p className="about-hero-desc">
            Zoniraz Jewel House Pvt Ltd is one of the leading jewellery manufacturer, wholesaler, retailer and exporter in the international Jewels market.
          </p>
        </div>

        {/* 50 Years Excellence Section */}
        <div className="about-section-card">
          <span className="about-sec-badge">50 Years of Excellence</span>
          <h2 className="about-sec-title">A Legacy of Trust and Craftsmanship</h2>
          <p className="about-sec-paragraph">
            From the last 50 Years we are serving for our loyal customers and delivering them not only a qualitative and best designs of Jewellery but also a trustful and responsible brand.
          </p>
          <blockquote className="about-quote-box">
            "Zoniraz Jewel house believes in customer satisfaction because it’s your own brand and without your satisfaction we can’t win your trust, & customer trust is a part of our policy. This is the only reason we always keep customer satisfaction and trust above the price and profit of our product."
          </blockquote>
        </div>

        {/* Key Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">BIS Hallmarked</div>
          </div>
        </div>

        {/* Exquisite Collections Title */}
        <h3 className="collections-section-title">Exquisite Collections</h3>

        {/* Exquisite Collections Grid */}
        <div className="coll-grid-luxury">
          {/* Rings */}
          <div className="coll-luxury-card">
            <div className="coll-img-wrapper">
              <img src={meshClusterRingImg} alt="Rings Collection" />
            </div>
            <div className="coll-luxury-details">
              <h4>Rings</h4>
              <p>Designer Collection</p>
            </div>
          </div>

          {/* Earrings */}
          <div className="coll-luxury-card">
            <div className="coll-img-wrapper">
              <img src={dancingHoopsImg} alt="Earrings Collection" />
            </div>
            <div className="coll-luxury-details">
              <h4>Earrings</h4>
              <p>Designer Collection</p>
            </div>
          </div>

          {/* Pendants */}
          <div className="coll-luxury-card">
            <div className="coll-img-wrapper">
              <img src={infinityNecklacesImg} alt="Pendants Collection" />
            </div>
            <div className="coll-luxury-details">
              <h4>Pendants</h4>
              <p>Designer Collection</p>
            </div>
          </div>
        </div>

        {/* Premium Infrastructure */}
        <div className="showroom-panel">
          <div className="showroom-content">
            <span className="about-sec-badge" style={{ marginBottom: '8px' }}>Premium Infrastructure</span>
            <h3>The Showroom Experience</h3>
            <p>
              When you step in our showroom you will feel a great ambience and well managed and decorated staff to serve you in finest way.
            </p>
            <ul className="features-list">
              <li>Well-constructed 2 Floor Showroom</li>
              <li>Wide area designer display lounges</li>
              <li>Air Conditioned & Eye-warming lights</li>
              <li>Musical Atmosphere & Cozy Sofas</li>
            </ul>
          </div>

          {/* Showroom Stats/Support box */}
          <div className="showroom-stats-box">
            {/* 24/7 Support */}
            <div className="support-info-row">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <h5>24/7 Support</h5>
                <p>Always available to assist you</p>
              </div>
            </div>

            {/* Global Reach */}
            <div className="support-info-row">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <div>
                <h5>Global Reach</h5>
                <p>Exporter in the international market</p>
              </div>
            </div>

            {/* Helpline */}
            <div className="support-info-row">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h5>Customer Helpline</h5>
                <p style={{ fontWeight: '700' }}>97848 36060</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mv-grid">
          {/* Mission */}
          <div className="mv-card">
            <h4>Our Mission</h4>
            <p style={{ marginBottom: '14px' }}>
              Zoniraz Jewelhouse was founded with the mission: “Next Generation of Jewellery Industry for Customer Support and Satisfaction”.
            </p>
            <p>
              We dedicatedly begin our work at early stage and search for rough Diamonds in the most remote parts of the world, ensuring every client has a reason to smile.
            </p>
          </div>

          {/* Vision */}
          <div className="mv-card">
            <h4>Our Vision</h4>
            <p style={{ marginBottom: '14px' }}>
              To reach every customer and become the largest jewellery chain with satisfied and happy customers.
            </p>
            <p>
              Jewellery is a part of culture and in India, women are considered symbols of power and love. Our jewellery increases the grace and glory of your personality.
            </p>
          </div>
        </div>

        {/* Stay Connected */}
        <div className="connected-block">
          <h3>Stay Connected</h3>
          <p>
            Our customer can connect with us all around the world, no matter where you are and how much time you have been our customer.
          </p>
        </div>

      </div>
    </div>
  );
}
