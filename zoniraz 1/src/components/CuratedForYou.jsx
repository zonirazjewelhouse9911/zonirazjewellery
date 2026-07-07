import React from 'react';
import womenImg from '../assets/hero-model.png';
import menImg from '../assets/mens-platinum.png';
import kidsImg from '../assets/gifts-for-mom.png';

const genderCards = [
  { id: 'women', label: 'Women Jewellery', image: womenImg, href: '#women' },
  { id: 'men',   label: 'Men Jewellery',   image: menImg,   href: '#men'   },
  { id: 'kids',  label: 'Kids Jewellery',  image: kidsImg,  href: '#kids'  },
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
              <img src={card.image} alt={card.label} className="cfy-card-img" />
            </div>
            <p className="cfy-card-label">{card.label}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
