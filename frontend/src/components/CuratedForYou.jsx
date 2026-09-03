import React from 'react';
import women800 from '../assets/women-800.webp';
import women1400 from '../assets/women-1400.webp';
import men800 from '../assets/mens-800.webp';
import men1400 from '../assets/mens-1400.webp';
import kids800 from '../assets/kids-800.webp';
import kids1400 from '../assets/kids-1400.webp';

const genderCards = [
  { id: 'women', label: 'Women Jewellery', image800: women800, image1400: women1400, href: '#women' },
  { id: 'men',   label: 'Men Jewellery',   image800: men800,   image1400: men1400,   href: '#men'   },
  { id: 'kids',  label: 'Kids Jewellery',  image800: kids800,  image1400: kids1400,  href: '#kids'  },
];

export default function CuratedForYou() {
  return (
    <section className="cfy-section">
      {/* Centered Header */}
      <div className="cfy-header">
        <h2 className="cfy-title">Curated For You</h2>
        <p className="cfy-subtitle">Shop By Gender</p>
      </div>

      {/* Three equal cards */}
      <div className="cfy-grid">
        {genderCards.map((card) => (
          <a key={card.id} href={card.href} className="cfy-card">
            <div className="cfy-card-img-wrap">
              <picture>
                <source srcSet={card.image800} media="(max-width: 768px)" type="image/webp" />
                <source srcSet={card.image1400} type="image/webp" />
                <img src={card.image1400} alt={card.label} className="cfy-card-img" loading="lazy" decoding="async" width="400" height="500" />
              </picture>
            </div>
            <p className="cfy-card-label">{card.label}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
