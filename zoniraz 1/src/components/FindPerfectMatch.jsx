import React, { useRef } from 'react';
import earringsImg from '../assets/silver-earrings.png';
import necklacesImg from '../assets/silver-necklaces.png';
import braceletsImg from '../assets/silver-bracelets.png';
import hoopsImg from '../assets/dancing-hoops.png';
import mangalsutraImg from '../assets/mangalsutra-earrings.png';
import charmsImg from '../assets/watch-charms.png';
import layeredImg from '../assets/layered-necklaces.png';
import banglesImg from '../assets/stretchable-bangles.png';

const defaultImages = {
  'rings': earringsImg,
  'earrings': hoopsImg,
  'pendants': necklacesImg,
  'nose-pins': charmsImg,
  'bracelets': braceletsImg,
  'mangalsutra': mangalsutraImg,
  'mangalsutras': mangalsutraImg,
  'necklaces': layeredImg,
  'bangles': banglesImg
};

const staticCategories = [
  { id: 'rings',        label: 'RINGS',           image: earringsImg },
  { id: 'earrings',     label: 'EARRINGS',         image: hoopsImg },
  { id: 'pendants',     label: 'PENDANTS',         image: necklacesImg },
  { id: 'nose-pins',    label: 'NOSE PINS',        image: charmsImg },
  { id: 'bracelets',    label: 'BRACELETS',        image: braceletsImg },
  { id: 'mangalsutra',  label: 'MANGALSUTRA',      image: mangalsutraImg },
  { id: 'necklaces',    label: 'NECKLACES',        image: layeredImg },
  { id: 'bangles',      label: 'BANGLES',          image: banglesImg },
];

export default function FindPerfectMatch({ products = [] }) {
  const scrollRef = useRef(null);
  const [categories, setCategories] = React.useState([]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    fetch('http://localhost:55000/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map(cat => {
            let catImg = cat.image || '';
            if (catImg) {
              if (catImg.startsWith('/')) {
                catImg = `http://localhost:55000${catImg}`;
              } else if (catImg.startsWith('uploads/')) {
                catImg = `http://localhost:55000/${catImg}`;
              } else if (!catImg.startsWith('http')) {
                catImg = `http://localhost:55000/uploads/${catImg}`;
              }
            } else {
              const cleanId = String(cat.slug || cat.name || '').toLowerCase().replace(/ /g, '-');
              catImg = defaultImages[cleanId] || defaultImages['rings'];
            }

            return {
              id: String(cat.slug || cat.name || '').toLowerCase().replace(/ /g, '-'),
              label: String(cat.name || '').toUpperCase(),
              image: catImg
            };
          });
          setCategories(mapped);
        }
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        // Fallback to static if backend fails
        setCategories(staticCategories);
      });
  }, []);

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
