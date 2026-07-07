import React from 'react';
import bridalImg from '../assets/hero-model.png';
import everydayImg from '../assets/gulnaara.png';
import officeImg from '../assets/silver-necklaces.png';
import solitaireImg from '../assets/solitaire-sets.png';
import heritageImg from '../assets/nine-kt.png';

const collections = [
  {
    id: 'bridal',
    label: 'SIGNATURE',
    title: 'Bridal Collection',
    image: bridalImg,
    large: true,
    href: '#bridal',
  },
  {
    id: 'everyday',
    label: 'LIFESTYLE',
    title: 'Everyday Wear',
    image: everydayImg,
    large: false,
    href: '#everyday',
  },
  {
    id: 'office',
    label: 'ELEGANT',
    title: 'Office Wear',
    image: officeImg,
    large: false,
    href: '#office',
  },
  {
    id: 'solitaire',
    label: 'FINE JEWELLERY',
    title: 'Solitaire Dream',
    image: solitaireImg,
    large: false,
    href: '#solitaire',
  },
  {
    id: 'heritage',
    label: 'CLASSIC',
    title: 'Heritage Gold',
    image: heritageImg,
    large: false,
    href: '#heritage',
  },
];

export default function ShopByCollection() {
  return (
    <section className="shop-collection-section">
      <div className="shop-collection-header">
        <h2 className="shop-collection-title">Shop by Collection</h2>
        <p className="shop-collection-subtitle">Curated categories crafted for every occasion</p>
      </div>

      <div className="shop-collection-grid">
        {/* Large left card */}
        <a href={collections[0].href} className="collection-card collection-card-large">
          <img src={collections[0].image} alt={collections[0].title} className="collection-card-img" />
          <div className="collection-card-overlay">
            <span className="collection-card-label">{collections[0].label}</span>
            <h3 className="collection-card-name">{collections[0].title}</h3>
            <span className="collection-card-explore">EXPLORE →</span>
          </div>
        </a>

        {/* Right 2x2 grid */}
        <div className="shop-collection-right">
          {collections.slice(1).map((col) => (
            <a key={col.id} href={col.href} className="collection-card collection-card-small">
              <img src={col.image} alt={col.title} className="collection-card-img" />
              <div className="collection-card-overlay">
                <span className="collection-card-label">{col.label}</span>
                <h3 className="collection-card-name">{col.title}</h3>
                <span className="collection-card-explore">EXPLORE →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
