import React from 'react';
import auspiciousImg from '../assets/solitaire-sets.png';
import giftingImg from '../assets/trendy-mangalsutras.png';
import origamiImg from '../assets/silver-earrings.png';

const trendingItems = [
  {
    id: 1,
    title: 'Auspicious Occasion',
    image: auspiciousImg,
    href: '#auspicious',
  },
  {
    id: 2,
    title: 'Gifting Jewellery',
    image: giftingImg,
    href: '#gifting',
  },
  {
    id: 3,
    title: 'Origami Edit',
    image: origamiImg,
    href: '#origami',
  },
];

export default function TrendingNow() {
  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2 className="trending-title">Trending Now</h2>
        <p className="trending-subtitle">Jewellery pieces everyone’s eyeing right now</p>
        <div className="trending-underline" />
      </div>

      <div className="trending-grid">
        {trendingItems.map((item) => (
          <a key={item.id} href={item.href} className="trending-card">
            <div className="trending-card-img-wrap">
              <img src={item.image} alt={item.title} className="trending-card-img" />
            </div>
            <h3 className="trending-card-title">{item.title}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}
