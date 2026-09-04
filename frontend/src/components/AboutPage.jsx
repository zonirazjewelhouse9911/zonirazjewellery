import React from 'react';

// Import images to make collections look beautiful
const meshClusterRingImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498420/zoniraz_frontend/mesh_cluster_ring.jpg";
const dancingHoopsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498439/zoniraz_frontend/dancing-hoops.jpg";
const infinityNecklacesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498427/zoniraz_frontend/infinity-necklaces.jpg";

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
          border: 1px solid #dbcfcb;
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
          border: 1px solid #dbcfcb;
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
          border: 1px solid #dbcfcb;
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
          border: 1px solid #dbcfcb;
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
          border: 1px solid #dbcfcb;
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
          border: 1px solid #dbcfcb;
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
          <h1 className="about-hero-title">Our Heritage as a Premium Luxury Jewellery Brand</h1>
          <p className="about-hero-desc">
            Zoniraz Jewel House Pvt Ltd is recognized globally as a premium luxury jewellery brand. We operate as a premier jewellery manufacturer, wholesaler, retailer, and exporter, delivering fine craftsmanship to the international luxury jewels market.
          </p>
        </div>

        {/* 50 Years Excellence Section */}
        <div className="about-section-card">
          <span className="about-sec-badge">50 Years of Excellence</span>
          <h2 className="about-sec-title">A Legacy of Trust and Certified Diamond Jewellery Online</h2>
          <p className="about-sec-paragraph">
            For over half a century, we have served our discerning clientele, establishing Zoniraz as one of the most famous jewellery brands. We deliver exquisite designs of hallmarked jewellery online, backed by an unwavering commitment to quality and consumer transparency.
          </p>
          <blockquote className="about-quote-box">
            "Zoniraz Jewel House prioritizes customer satisfaction because we believe that trust is the cornerstone of a luxury jewellery brand. We always keep customer delight and integrity above price and profit, ensuring that when you buy luxury jewellery online, you receive an experience matching the highest standards of the finest international houses."
          </blockquote>
        </div>

        {/* Key Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">Years of Luxury Expertise</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">BIS Hallmarked Jewellery</div>
          </div>
        </div>

        {/* Exquisite Collections Title */}
        <h3 className="collections-section-title">Exquisite Designer Diamond Jewellery</h3>

        {/* Exquisite Collections Grid */}
        <div className="coll-grid-luxury">
          {/* Rings */}
          <div className="coll-luxury-card">
            <div className="coll-img-wrapper">
              <img src={meshClusterRingImg} alt="Branded gold jewellery rings collection" loading="lazy" decoding="async" width="300" height="300" />
            </div>
            <div className="coll-luxury-details">
              <h4>Rings</h4>
              <p>Luxury Bridal Jewellery</p>
            </div>
          </div>
 
          {/* Earrings */}
          <div className="coll-luxury-card">
            <div className="coll-img-wrapper">
              <img src={dancingHoopsImg} alt="Designer diamond jewellery earrings collection" loading="lazy" decoding="async" width="300" height="300" />
            </div>
            <div className="coll-luxury-details">
              <h4>Earrings</h4>
              <p>Fine Luxury Diamond Jewelry</p>
            </div>
          </div>
 
          {/* Pendants */}
          <div className="coll-luxury-card">
            <div className="coll-img-wrapper">
              <img src={infinityNecklacesImg} alt="Certified diamond jewellery online pendants collection" loading="lazy" decoding="async" width="300" height="300" />
            </div>
            <div className="coll-luxury-details">
              <h4>Pendants</h4>
              <p>Famous Jewellery Brands Collection</p>
            </div>
          </div>
        </div>

        {/* Premium Infrastructure */}
        <div className="showroom-panel">
          <div className="showroom-content">
            <span className="about-sec-badge" style={{ marginBottom: '8px' }}>Premium Infrastructure</span>
            <h3>Our Trusted Jewellery Showroom</h3>
            <p>
              When you step into our trusted jewellery showroom, you will experience a sophisticated ambience, guided by our dedicated experts who showcase the finest branded gold jewellery and luxury diamond jewelry.
            </p>
            <ul className="features-list">
              <li>Elegant Two-Floor Showroom Infrastructure</li>
              <li>Exclusive Lounges for Designer Diamond Jewellery</li>
              <li>Air-Conditioned Private Viewing Rooms</li>
              <li>Atmosphere of Luxury and Refined Hospitality</li>
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
                <h5>Client Support</h5>
                <p>Assistance for certified diamond jewellery online</p>
              </div>
            </div>

            {/* Global Reach */}
            <div className="support-info-row">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <div>
                <h5>Jewellery Shipping Abroad</h5>
                <p>Express international delivery across global markets</p>
              </div>
            </div>

            {/* Helpline */}
            <div className="support-info-row">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h5>Helpline & Showroom Location</h5>
                <p style={{ fontWeight: '700' }}>
                  <a href="tel:+919784836060" style={{ textDecoration: 'none', color: 'inherit' }}>97848 36060</a>
                </p>
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
              Zoniraz was established to introduce the next generation of custom luxury bridal jewellery, emphasizing trust, expert guidance, and customer service.
            </p>
            <p>
              We source high-quality rough diamonds from the most remote areas of the world, transforming them into signature designer diamond jewellery collections.
            </p>
          </div>

          {/* Vision */}
          <div className="mv-card">
            <h4>Our Vision</h4>
            <p style={{ marginBottom: '14px' }}>
              To offer access to our exquisite collections worldwide, becoming the global destination for buying luxury jewellery online.
            </p>
            <p>
              We celebrate culture by crafting branded gold jewellery and luxury diamond jewelry that enhances the grace and individuality of every personality.
            </p>
          </div>
        </div>

        {/* Stay Connected */}
        <div className="connected-block">
          <h3>Stay Connected with Our Brand</h3>
          <p>
            Our clients can reach us from anywhere in the world to explore new releases, track international shipments, or book a private consultation at our trusted showroom.
          </p>
        </div>

      </div>
    </div>
  );
}
