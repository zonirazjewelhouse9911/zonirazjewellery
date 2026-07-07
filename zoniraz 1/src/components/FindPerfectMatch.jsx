import React, { useRef } from 'react';
import earringsImg from '../assets/silver-earrings.png';
import necklacesImg from '../assets/silver-necklaces.png';
import braceletsImg from '../assets/silver-bracelets.png';
import hoopsImg from '../assets/dancing-hoops.png';
import mangalsutraImg from '../assets/mangalsutra-earrings.png';
import charmsImg from '../assets/watch-charms.png';
import layeredImg from '../assets/layered-necklaces.png';
import banglesImg from '../assets/stretchable-bangles.png';

const categories = [
  { id: 'rings',        label: 'RINGS',           image: earringsImg },
  { id: 'earrings',     label: 'EARRINGS',         image: hoopsImg },
  { id: 'pendants',     label: 'PENDANTS',         image: necklacesImg },
  { id: 'nose-pins',    label: 'NOSE PINS',        image: charmsImg },
  { id: 'bracelets',    label: 'BRACELETS',        image: braceletsImg },
  { id: 'mangalsutra',  label: 'MANGALSUTRA',      image: mangalsutraImg },
  { id: 'necklaces',    label: 'NECKLACES',        image: layeredImg },
  { id: 'bangles',      label: 'BANGLES',          image: banglesImg },
];

export default function FindPerfectMatch() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="fpm-section">
      <div className="fpm-header">
        <div>
          <h2 className="fpm-title">Find Your Perfect Match</h2>
          <div className="fpm-underline" />
        </div>
        <div className="fpm-arrows">
          <button className="fpm-arrow" onClick={() => scroll(-1)} aria-label="Scroll left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <button className="fpm-arrow" onClick={() => scroll(1)} aria-label="Scroll right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="fpm-scroll-wrapper" ref={scrollRef}>
        {categories.map((cat) => (
          <a key={cat.id} href={`#${cat.id}`} className="fpm-card">
            <div className="fpm-card-img-wrap">
              <img src={cat.image} alt={cat.label} className="fpm-card-img" />
            </div>
            <span className="fpm-card-label">{cat.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
