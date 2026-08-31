import React from 'react';

export default function ZonirazAlwarPage() {
  const storeAddress = "Tilak Market, 7, Hanuman Burj, Kabir Colony, Alwar, Rajasthan 301001";
  const storePhone = "+919784836060";
  const displayPhone = "+91 97848 36060";
  const storeEmail = "zonirazjewelhouse@gmail.com";
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Zoniraz Jewel House Tilak Market Alwar Rajasthan");
  const whatsappUrl = "https://wa.me/919784836060?text=" + encodeURIComponent("Hello Zoniraz Alwar Store, I would like to make an enquiry.");

  const highlights = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="1.8">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ),
      title: "100% Hallmarked Gold & Certified Diamonds",
      desc: "Every piece of jewellery at our Alwar showroom comes with guaranteed BIS Hallmarking and certified diamond quality."
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="1.8">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M16 21h5v-5"/>
        </svg>
      ),
      title: "Instant Old Gold Exchange",
      desc: "Get 100% maximum value for your old gold with our transparent digital karatmeter testing at Alwar store."
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      title: "Gold Mine Savings Plan",
      desc: "Enroll in our exclusive monthly gold savings plan directly at our Alwar showroom for extra savings."
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      title: "Bespoke Custom Jewellery",
      desc: "Work with our master artisans in Alwar to craft custom engagement rings, bridal sets, and personalized pieces."
    }
  ];

  const featuredCollections = [
    { name: "Bridal Jewellery Sets", image: "/jewelry banner 1.png", link: "/products?collection=bridal" },
    { name: "Diamond Rings & Solitaires", image: "/gold banner .jpg.jpeg", link: "/products?category=rings" },
    { name: "Gold Earrings & Jhumkas", image: "/banner 2.jpg.jpeg", link: "/products?category=earrings" },
    { name: "Exclusive Necklaces", image: "/zoniraz banner 5.jpg.jpeg", link: "/products?category=necklaces" }
  ];

  const faqs = [
    {
      q: "Where is the Zoniraz Alwar showroom located?",
      a: "Our Alwar showroom is located at Tilak Market, 7, Hanuman Burj, Kabir Colony, Alwar, Rajasthan 301001."
    },
    {
      q: "What are the store timings for Zoniraz Alwar?",
      a: "We are open all days from 10:30 AM to 8:30 PM."
    },
    {
      q: "Can I exchange my old gold at the Alwar store?",
      a: "Yes! We offer 100% transparent old gold valuation with computerized karatmeter testing right at our Alwar store."
    },
    {
      q: "Do I need an appointment before visiting?",
      a: "Walk-ins are always welcome! However, you can also book a prior appointment or WhatsApp us for personalized bridal consultation."
    }
  ];

  return (
    <div className="alwar-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .alwar-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 40px 24px 80px 24px;
        }

        .alwar-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Breadcrumbs */
        .alwar-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
          margin-top: 15px;
          font-weight: 500;
        }
        .alwar-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
        }

        /* Hero Banner - Clean Theme matching Website */
        .alwar-hero {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #dbcfcb;
          position: relative;
        }

        .alwar-hero-tag {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c5a880;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .alwar-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 600;
          color: #2b221d;
          margin: 0 0 16px;
        }
        .alwar-hero-title span {
          color: #c5a880;
          font-style: italic;
        }

        .alwar-hero-desc {
          font-size: 16px;
          color: #635349;
          max-width: 700px;
          margin: 0 auto 30px;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Action Buttons */
        .alwar-btn-group {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .alwar-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 26px;
          border-radius: 30px;
          background-color: #c5a880;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(197, 168, 128, 0.3);
          transition: all 0.3s ease;
        }
        .alwar-btn-primary:hover {
          background-color: #a3845b;
          transform: translateY(-1px);
        }

        .alwar-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 26px;
          border-radius: 30px;
          background-color: #ffffff;
          border: 1px solid #dbcfcb;
          color: #2b221d;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .alwar-btn-secondary:hover {
          background-color: #f7f3f1;
          border-color: #c5a880;
        }

        .alwar-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 26px;
          border-radius: 30px;
          background-color: #25D366;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
          transition: all 0.3s ease;
        }
        .alwar-btn-whatsapp:hover {
          background-color: #1eb956;
          transform: translateY(-1px);
        }

        /* Cards & Grids */
        .alwar-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .alwar-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 36px 30px;
          border: 1px solid #dbcfcb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .alwar-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #2b221d;
          margin-top: 0;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .alwar-highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .alwar-highlight-item {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 28px 24px;
          border: 1px solid #dbcfcb;
          box-shadow: 0 4px 15px rgba(0,0,0,0.015);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .alwar-highlight-item:hover {
          border-color: #c5a880;
          transform: translateY(-2px);
        }

        .alwar-collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .alwar-col-card {
          display: block;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #dbcfcb;
          aspect-ratio: 4/3;
          background-color: #f7f3f1;
        }
        .alwar-col-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .alwar-col-card:hover img {
          transform: scale(1.05);
        }
        .alwar-col-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(43,34,29,0.85) 0%, rgba(43,34,29,0.05) 70%);
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }
        .alwar-col-text {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }

        .alwar-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #2b221d;
          text-align: center;
          margin: 0 0 10px;
        }
        .alwar-section-sub {
          font-size: 15px;
          color: #635349;
          text-align: center;
          margin: 0 0 36px;
        }

        .alwar-faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .alwar-faq-item {
          background-color: #fcf9f8;
          border-radius: 12px;
          padding: 20px 24px;
          border: 1px solid #ebdcd7;
        }

        @media (max-width: 768px) {
          .alwar-hero {
            padding: 40px 20px;
          }
          .alwar-hero-title {
            font-size: 30px;
          }
          .alwar-page-wrapper {
            padding: 20px 16px 60px 16px;
          }
        }
      `}</style>

      <div className="alwar-container">
        
        {/* Breadcrumb */}
        <div className="alwar-breadcrumb">
          <a href="/">Home</a> &nbsp;/&nbsp; <span style={{ color: '#2b221d', fontWeight: '600' }}>Zoniraz Alwar</span>
        </div>

        {/* Hero Section (Matching Website Palette & Typography) */}
        <div className="alwar-hero">
          <div className="alwar-hero-tag">Official Flagship Store • Alwar, Rajasthan</div>
          <h1 className="alwar-hero-title">
            Zoniraz Jewel House <span>Alwar</span>
          </h1>
          <p className="alwar-hero-desc">
            Experience timeless elegance, certified diamond jewellery, and hallmarked gold craftsmanship at our exclusive Alwar showroom.
          </p>

          {/* Action Buttons */}
          <div className="alwar-btn-group">
            <a href={`tel:${storePhone}`} className="alwar-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Alwar Store ({displayPhone})
            </a>

            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="alwar-btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Get Directions
            </a>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="alwar-btn-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.163 5.281-1.385c1.455.794 3.09 1.212 4.789 1.213h.004c5.506 0 9.989-4.478 9.99-9.985.001-2.669-1.036-5.178-2.923-7.066C17.194 3.038 14.685 2 12.012 2z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Location & Visit Cards */}
        <div className="alwar-card-grid">
          
          <div className="alwar-card">
            <h2 className="alwar-card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Store Address & Details
            </h2>

            <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#4a3d35', marginBottom: '20px' }}>
              <strong style={{ color: '#2b221d', fontSize: '16px', display: 'block', marginBottom: '4px' }}>Zoniraz Jewel House</strong>
              {storeAddress}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#635349' }}>
              <div><strong style={{ color: '#2b221d' }}>Phone:</strong> <a href={`tel:${storePhone}`} style={{ color: '#8c7365', textDecoration: 'none' }}>{displayPhone}</a></div>
              <div><strong style={{ color: '#2b221d' }}>Email:</strong> <a href={`mailto:${storeEmail}`} style={{ color: '#8c7365', textDecoration: 'none' }}>{storeEmail}</a></div>
              <div><strong style={{ color: '#2b221d' }}>Showroom Hours:</strong> 10:30 AM – 8:30 PM (Mon – Sun)</div>
            </div>
          </div>

          <div className="alwar-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 className="alwar-card-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  <line x1="8" y1="2" x2="8" y2="18"/>
                  <line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
                Visit Our Alwar Showroom
              </h2>
              <p style={{ fontSize: '14px', color: '#635349', lineHeight: '1.6', marginBottom: '20px' }}>
                Located in the heart of Alwar at Tilak Market, Hanuman Burj. Step into our boutique for a luxury jewellery shopping experience guided by expert consultants.
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="alwar-btn-primary"
              style={{ justifyContent: 'center', borderRadius: '12px', width: '100%', boxSizing: 'border-box' }}
            >
              Open Location in Google Maps ➔
            </a>
          </div>

        </div>

        {/* Highlights Section */}
        <div>
          <h2 className="alwar-section-title">Why Visit Zoniraz Alwar?</h2>
          <p className="alwar-section-sub">Premium craftsmanship, absolute purity guarantee, and personalized customer care.</p>

          <div className="alwar-highlights-grid">
            {highlights.map((item, idx) => (
              <div key={idx} className="alwar-highlight-item">
                <div style={{ marginBottom: '14px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '16px', color: '#2b221d', margin: '0 0 8px', fontWeight: '600' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#635349', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Collections Showcase */}
        <div>
          <h2 className="alwar-section-title">Showroom Collections</h2>
          <p className="alwar-section-sub">Explore our handpicked range of gold, diamond, and solitaire designs available at Alwar.</p>

          <div className="alwar-collections-grid">
            {featuredCollections.map((col, idx) => (
              <a key={idx} href={col.link} className="alwar-col-card">
                <img src={col.image} alt={col.name} />
                <div className="alwar-col-overlay">
                  <span className="alwar-col-text">{col.name} ➔</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="alwar-card">
          <h2 className="alwar-section-title" style={{ fontSize: '26px', marginBottom: '24px' }}>
            Frequently Asked Questions
          </h2>

          <div className="alwar-faq-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className="alwar-faq-item">
                <h3 style={{ fontSize: '15px', color: '#2b221d', margin: '0 0 8px', fontWeight: '600' }}>{faq.q}</h3>
                <p style={{ fontSize: '13px', color: '#635349', margin: 0, lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
