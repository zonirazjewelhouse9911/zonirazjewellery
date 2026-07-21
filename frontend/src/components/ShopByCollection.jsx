import React, { useState, useEffect } from 'react';
import { API_BASE_URL, getUploadsUrl } from '../config';
import bridalVideo from '../assets/videos/1.mp4';
import everydayVideo from '../assets/videos/daleywear.mp4';
import officeVideo from '../assets/videos/officewear.mp4';
import solitaireVideo from '../assets/videos/d92d747b23c8205d85da43cb7d302733.mp4';
import heritageVideo from '../assets/videos/heritageGold.mp4';

const staticCollections = [
  {
    id: 'bridal',
    label: 'SIGNATURE',
    title: 'Bridal Collection',
    video: bridalVideo,
    href: '#bridal',
  },
  {
    id: 'everyday',
    label: 'LIFESTYLE',
    title: 'Everyday Wear',
    video: everydayVideo,
    href: '#everyday',
  },
  {
    id: 'office',
    label: 'ELEGANT',
    title: 'Office Wear',
    video: officeVideo,
    href: '#office',
  },
  {
    id: 'solitaire',
    label: 'FINE JEWELLERY',
    title: 'Solitaire Dream',
    video: solitaireVideo,
    href: '#solitaire',
  },
  {
    id: 'heritage',
    label: 'CLASSIC',
    title: 'Heritage Gold',
    video: heritageVideo,
    href: '#heritage',
  },
];

const labelMap = {
  'bridal': 'SIGNATURE',
  'everyday': 'LIFESTYLE',
  'office': 'ELEGANT',
  'solitaire': 'FINE JEWELLERY',
  'heritage': 'CLASSIC'
};

const defaultImages = {
  'bridal': null,
  'everyday': null,
  'office': null,
  'solitaire': null,
  'heritage': null
};

export default function ShopByCollection({ products = [] }) {
  const [collections, setCollections] = useState(staticCollections);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/userSide/getCollection`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data && resData.data.length > 0) {
          const mapped = resData.data.map(col => {
            const id = col.slug || col._id;
            const label = col.tags?.[0]?.toUpperCase() || labelMap[col.slug] || 'COLLECTION';

            // Search products to find real product image as fallback
            const cleanSlug = String(col.slug || '').toLowerCase();
            const matchingProducts = products.filter(p => {
              const tagsList = p.tags ? (Array.isArray(p.tags) ? p.tags : [p.tags]) : [];
              const matchesTag = tagsList.some(t => String(t).toLowerCase() === cleanSlug);
              const matchesName = String(p.name || '').toLowerCase().includes(cleanSlug);
              return matchesTag || matchesName;
            });

            // Map image path safely
            let image = col.image;
            if (!image || image === '/images/site/default-collection.jpg') {
              if (matchingProducts.length > 0 && matchingProducts[0].image) {
                image = matchingProducts[0].image;
              } else {
                image = defaultImages[col.slug] || null;
              }
            } else if (!image.startsWith('http') && !image.startsWith('/images/')) {
              image = getUploadsUrl(image);
            }

            const video = col.slug === 'bridal' ? bridalVideo : (col.slug === 'everyday' ? everydayVideo : (col.slug === 'office' ? officeVideo : (col.slug === 'solitaire' ? solitaireVideo : (col.slug === 'heritage' ? heritageVideo : null))));

            return {
              id,
              label,
              title: col.name,
              image,
              video,
              href: `#${id}`
            };
          });
          setCollections(mapped);
        }
      })
      .catch(err => console.error('Error fetching collection from backend:', err));
  }, [products]);

  if (collections.length === 0) return null;

  // homepage only shows 5 collections
  const displayed = collections.slice(0, 5);

  return (
    <section className="shop-collection-section">
      <div className="shop-collection-header" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = 'collections'}>
        <h2 className="shop-collection-title">Shop by Collection</h2>
        <p className="shop-collection-subtitle">Curated categories crafted for every occasion</p>
      </div>

      <div className="shop-collection-grid">
        {/* Large left card */}
        <a href={displayed[0].href} className="collection-card collection-card-large">
          {displayed[0].video ? (
            <video
              src={displayed[0].video}
              autoPlay
              loop
              muted
              playsInline
              className="collection-card-img"
            />
          ) : (
            <img src={displayed[0].image} alt={displayed[0].title} className="collection-card-img" />
          )}
          <div className="collection-card-overlay">
            <span className="collection-card-label">{displayed[0].label}</span>
            <h3 className="collection-card-name">{displayed[0].title}</h3>
            <span className="collection-card-explore">EXPLORE →</span>
          </div>
        </a>

        {/* Right 2x2 grid */}
        <div className="shop-collection-right">
          {displayed.slice(1).map((col) => (
            <a key={col.id} href={col.href} className="collection-card collection-card-small">
              {col.video ? (
                <video
                  src={col.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="collection-card-img"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              ) : (
                <img src={col.image} alt={col.title} className="collection-card-img" />
              )}
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
