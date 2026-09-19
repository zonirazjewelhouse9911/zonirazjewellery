import React, { useState, useEffect, memo } from 'react';
import { API_BASE_URL, getUploadsUrl } from '../config';
import { cachedFetch } from '../utils/apiCache';
import LazyVideo from './LazyVideo';
const bridalVideo = "https://media.zoniraz.com/uploads/zoniraz_frontend/videos/1.mp4";
const everydayVideo = "https://media.zoniraz.com/uploads/zoniraz_frontend/videos/daleywear.mp4";
const officeVideo = "https://media.zoniraz.com/uploads/zoniraz_frontend/videos/officewear.mp4";
const solitaireVideo = "https://media.zoniraz.com/uploads/zoniraz_frontend/videos/d92d747b23c8205d85da43cb7d302733.mp4";
const heritageVideo = "https://media.zoniraz.com/uploads/zoniraz_frontend/videos/heritageGold.mp4";

const staticCollections = [
  {
    id: 'bridal',
    label: 'SIGNATURE',
    title: 'Bridal Collection',
    video: bridalVideo,
    href: '/rings?subcategory=bridal',
  },
  {
    id: 'everyday',
    label: 'LIFESTYLE',
    title: 'Everyday Wear',
    video: everydayVideo,
    href: '/rings?subcategory=everyday',
  },
  {
    id: 'office',
    label: 'ELEGANT',
    title: 'Office Wear',
    video: officeVideo,
    href: '/rings?subcategory=office-wear',
  },
  {
    id: 'solitaire',
    label: 'FINE JEWELLERY',
    title: 'Solitaire Dream',
    video: solitaireVideo,
    href: '/rings?subcategory=solitaire',
  },
  {
    id: 'heritage',
    label: 'CLASSIC',
    title: 'Heritage Gold',
    video: heritageVideo,
    href: '/rings?subcategory=heritage',
  },
];

const labelMap = {
  'bridal': 'SIGNATURE',
  'everyday': 'LIFESTYLE',
  'office': 'ELEGANT',
  'solitaire': 'FINE JEWELLERY',
  'heritage': 'CLASSIC'
};

const getVideoForSlug = (slug, rawImage) => {
  if (typeof rawImage === 'string' && (rawImage.endsWith('.mp4') || rawImage.endsWith('.webm') || rawImage.includes('/videos/'))) {
    return rawImage;
  }
  const s = String(slug || '').toLowerCase();
  if (s.includes('bridal')) return bridalVideo;
  if (s.includes('everyday') || s.includes('daily')) return everydayVideo;
  if (s.includes('office') || s.includes('work')) return officeVideo;
  if (s.includes('solitaire')) return solitaireVideo;
  if (s.includes('heritage') || s.includes('gold') || s.includes('classic')) return heritageVideo;
  return null;
};

const defaultImages = {
  'bridal': null,
  'everyday': null,
  'office': null,
  'solitaire': null,
  'heritage': null
};

const ShopByCollection = memo(function ShopByCollection({ products = [] }) {
  const [collections, setCollections] = useState(staticCollections);

  useEffect(() => {
    cachedFetch(`${API_BASE_URL}/api/userSide/getCollection`)
      .then(resData => {
        if (resData.success && resData.data && resData.data.length > 0) {
          const mapped = resData.data.map(col => {
            const id = col.slug || col._id;
            const cleanSlug = String(col.slug || id || '').toLowerCase();

            let matchedLabel = 'COLLECTION';
            if (col.tags && col.tags.length > 0) {
              const upperTag = String(col.tags[0]).toUpperCase();
              if (upperTag !== 'COLLECTION') matchedLabel = upperTag;
            }
            if (matchedLabel === 'COLLECTION') {
              if (cleanSlug.includes('bridal')) matchedLabel = 'SIGNATURE';
              else if (cleanSlug.includes('everyday')) matchedLabel = 'LIFESTYLE';
              else if (cleanSlug.includes('office')) matchedLabel = 'ELEGANT';
              else if (cleanSlug.includes('solitaire')) matchedLabel = 'FINE JEWELLERY';
              else if (cleanSlug.includes('heritage')) matchedLabel = 'CLASSIC';
            }

            const video = getVideoForSlug(cleanSlug, col.image);

            let image = typeof col.image === 'string' && (col.image.endsWith('.mp4') || col.image.includes('/videos/')) ? null : col.image;
            if (!image || image === '/images/site/default-collection.jpg') {
              const matchingProducts = products.filter(p => {
                const tagsList = p.tags ? (Array.isArray(p.tags) ? p.tags : [p.tags]) : [];
                const matchesTag = tagsList.some(t => String(t).toLowerCase() === cleanSlug);
                const matchesName = String(p.name || '').toLowerCase().includes(cleanSlug);
                return matchesTag || matchesName;
              });

              if (matchingProducts.length > 0 && matchingProducts[0].image) {
                image = matchingProducts[0].image;
              } else {
                image = defaultImages[cleanSlug] || null;
              }
            } else if (image && !image.startsWith('http') && !image.startsWith('/images/')) {
              image = getUploadsUrl(image);
            }

            let href = `/rings?subcategory=${cleanSlug}`;
            if (cleanSlug.includes('office')) href = '/rings?subcategory=office-wear';
            else if (cleanSlug.includes('solitaire')) href = '/rings?subcategory=solitaire';
            else if (cleanSlug.includes('bridal')) href = '/rings?subcategory=bridal';
            else if (cleanSlug.includes('everyday')) href = '/rings?subcategory=everyday';
            else if (cleanSlug.includes('heritage')) href = '/rings?subcategory=heritage';

            return {
              id,
              label: matchedLabel,
              title: col.name,
              image,
              video,
              href
            };
          });
          setCollections(mapped);
        }
      })
      .catch(err => console.error('Error fetching collection from backend:', err));
  }, [products]);

  if (collections.length === 0) return null;

  const displayed = collections.slice(0, 5);

  return (
    <section className="shop-collection-section">
      <div className="home-main-h1-container">
        <h1 className="home-main-h1">Shop Jewellery Across India</h1>
        <div className="home-main-h1-divider" />
      </div>

      <div className="shop-collection-header" style={{ cursor: 'pointer' }} onClick={() => {
        window.history.pushState(null, '', '/all-collections');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}>
        <h2 className="shop-collection-title">Shop by Collection</h2>
        <p className="shop-collection-subtitle">Curated categories crafted for every occasion</p>
      </div>

      <div className="shop-collection-grid">
        {/* Large left card */}
        <a href={displayed[0].href} className="collection-card collection-card-large">
          {displayed[0].video ? (
            <LazyVideo
              src={displayed[0].video}
              className="collection-card-img"
            />
          ) : (
            <img src={displayed[0].image} alt={displayed[0].title} className="collection-card-img" loading="lazy" decoding="async" width="600" height="600" />
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
                <LazyVideo
                  src={col.video}
                  className="collection-card-img"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              ) : (
                <img src={col.image} alt={col.title} className="collection-card-img" loading="lazy" decoding="async" width="300" height="300" />
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
});

export default ShopByCollection;
