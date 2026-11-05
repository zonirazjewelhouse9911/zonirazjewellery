import React, { useState, useMemo } from 'react';
import './FestiveLandingPage.css';
import FestiveLandingModal from './FestiveLandingModal';

export default function FestiveLandingPage({ products = [] }) {
  const [selectedTab, setSelectedTab] = useState('all');

  // Filter curated festive items
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    
    return products.filter((item) => {
      if (selectedTab === 'all') return true;
      const cat = (item.category || item.category_name || '').toLowerCase();
      if (selectedTab === 'coins') return cat.includes('coin');
      if (selectedTab === 'necklaces') return cat.includes('necklace') || cat.includes('pendant');
      if (selectedTab === 'earrings') return cat.includes('earring');
      if (selectedTab === 'rings') return cat.includes('ring');
      return true;
    }).slice(0, 12);
  }, [products, selectedTab]);

  return (
    <div className="festive-page-container">
      {/* Immersive Festive Hero with Animated Reference Design */}
      <section className="festive-hero-section">
        <div className="festive-hero-card-wrapper">
          <FestiveLandingModal forceOpen={true} onExplore={() => {
            const el = document.getElementById('festive-collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
        </div>
      </section>

      {/* Festive Collection Section */}
      <section id="festive-collection" className="festive-showcase-section">
        <div className="festive-section-header">
          <span className="festive-section-tag">✨ Auspicious Celebrations</span>
          <h2 className="festive-section-title">The Diwali Festive Showcase</h2>
          <p className="festive-section-desc">
            Celebrate the festival of radiance with handcrafted gold, diamond, and festive coin collections by Zoniraz Jewel House.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="festive-tabs-row">
          <button 
            type="button"
            className={`festive-tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTab('all')}
          >
            All Festive Specials
          </button>
          <button 
            type="button"
            className={`festive-tab-btn ${selectedTab === 'coins' ? 'active' : ''}`}
            onClick={() => setSelectedTab('coins')}
          >
            Gold & Silver Coins
          </button>
          <button 
            type="button"
            className={`festive-tab-btn ${selectedTab === 'necklaces' ? 'active' : ''}`}
            onClick={() => setSelectedTab('necklaces')}
          >
            Festive Necklaces
          </button>
          <button 
            type="button"
            className={`festive-tab-btn ${selectedTab === 'earrings' ? 'active' : ''}`}
            onClick={() => setSelectedTab('earrings')}
          >
            Radiant Earrings
          </button>
          <button 
            type="button"
            className={`festive-tab-btn ${selectedTab === 'rings' ? 'active' : ''}`}
            onClick={() => setSelectedTab('rings')}
          >
            Statement Rings
          </button>
        </div>

        {/* Product Grid */}
        <div className="festive-products-grid">
          {filteredProducts.map((p) => {
            const imgUrl = p.images?.[0] || p.image || 'https://media.zoniraz.com/uploads/zoniraz_frontend/zoni1.png';
            const price = p.price || p.base_price || 0;
            const slug = p.slug || p._id || p.id;

            return (
              <div key={p._id || p.id || Math.random()} className="festive-product-card">
                <div className="festive-product-img-box">
                  <span className="festive-badge">Diwali Special</span>
                  <img src={imgUrl} alt={p.name || 'Zoniraz Jewellery'} className="festive-product-img" loading="lazy" />
                </div>
                <div className="festive-product-info">
                  <div>
                    <h3 className="festive-product-name">{p.name || 'Exquisite Jewellery Piece'}</h3>
                    <div className="festive-product-purity">
                      {p.gold_purity || '22 KT'} Gold • BIS Hallmarked
                    </div>
                  </div>
                  <div>
                    <div className="festive-product-price-row">
                      <span className="festive-product-price">
                        ₹{Number(price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <a 
                      href={`/product/${slug}`} 
                      className="festive-view-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, '', `/product/${slug}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                    >
                      View Piece
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privileges Banner */}
      <section className="festive-perks-section">
        <div className="festive-perks-grid">
          <div className="festive-perk-item">
            <span className="festive-perk-icon">🪔</span>
            <h4 className="festive-perk-title">100% Certified Purity</h4>
            <p className="festive-perk-desc">Every piece is BIS Hallmarked & IGI / SGL certified for guaranteed authenticity.</p>
          </div>
          <div className="festive-perk-item">
            <span className="festive-perk-icon">🎁</span>
            <h4 className="festive-perk-title">Complimentary Insured Shipping</h4>
            <p className="festive-perk-desc">Tamper-evident transit insurance delivered safely right to your doorstep.</p>
          </div>
          <div className="festive-perk-item">
            <span className="festive-perk-icon">✨</span>
            <h4 className="festive-perk-title">0% Making Charge Privileges</h4>
            <p className="festive-perk-desc">Exclusive festive pricing advantages on certified coins & gold jewellery.</p>
          </div>
          <div className="festive-perk-item">
            <span className="festive-perk-icon">💎</span>
            <h4 className="festive-perk-title">Virtual Video Styling</h4>
            <p className="festive-perk-desc">Connect live with Zoniraz jewellery stylists from the comfort of your home.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

