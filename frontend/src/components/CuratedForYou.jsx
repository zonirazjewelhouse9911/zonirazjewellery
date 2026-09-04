import React from 'react';
const women800 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498419/zoniraz_frontend/women-800.webp";
const women1400 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498418/zoniraz_frontend/women-1400.webp";
const men800 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498417/zoniraz_frontend/mens-800.webp";
const men1400 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498415/zoniraz_frontend/mens-1400.webp";
const kids800 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498458/zoniraz_frontend/kids-800.webp";
const kids1400 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498440/zoniraz_frontend/kids-1400.webp";

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
