import React, { useRef } from 'react';
import { API_BASE_URL, getUploadsUrl } from '../config';
const goldRingImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498434/zoniraz_frontend/aneka.jpg";
const goldNecklaceImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498423/zoniraz_frontend/gold-necklace-silk.jpg";
const hoopsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498439/zoniraz_frontend/dancing-hoops.jpg";
const mangalsutraImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498451/zoniraz_frontend/mangalsutra-earrings.jpg";
const charmsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498414/zoniraz_frontend/watch-charms.jpg";
const layeredImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498446/zoniraz_frontend/layered-necklaces.jpg";
const banglesImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498436/zoniraz_frontend/stretchable-bangles.jpg";
const yellowGoldNosePinBannerImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498472/zoniraz_frontend/yellow-gold-nose-pin-banner.jpg";

const defaultImages = {
  'rings': goldRingImg,
  'earrings': hoopsImg,
  'pendants': goldNecklaceImg,
  'nose-pins': yellowGoldNosePinBannerImg,
  'bracelets': banglesImg,
  'mangalsutra': mangalsutraImg,
  'mangalsutras': mangalsutraImg,
  'necklaces': layeredImg,
  'bangles': banglesImg
};

const staticCategories = [
  { id: 'rings',        label: 'RINGS',           image: goldRingImg },
  { id: 'earrings',     label: 'EARRINGS',         image: hoopsImg },
  { id: 'pendants',     label: 'PENDANTS',         image: goldNecklaceImg },
  { id: 'nose-pins',    label: 'NOSE PINS',        image: yellowGoldNosePinBannerImg },
  { id: 'bracelets',    label: 'BRACELETS',        image: banglesImg },
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
    fetch(`${API_BASE_URL}/api/admin/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map(cat => {
            let catImg = cat.image || '';
            if (catImg) {
              catImg = getUploadsUrl(catImg);
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <button className="fpm-arrow" onClick={() => scroll(1)} aria-label="Scroll right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
              <img src={cat.image} alt="" aria-hidden="true" className="fpm-card-img" loading="lazy" decoding="async" width="240" height="290" />
            </div>
            <span className="fpm-card-label">{cat.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
