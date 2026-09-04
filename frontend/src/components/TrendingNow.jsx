import React, { memo } from 'react';
import LazyVideo from './LazyVideo';
const giftingVideo = "https://res.cloudinary.com/fxokwlyu/video/upload/v1788498726/zoniraz_frontend/videos/9.mp4";
const origamiVideo = "https://res.cloudinary.com/fxokwlyu/video/upload/v1788498506/zoniraz_frontend/videos/4.mp4";
const AuspiciousOccasion = "https://res.cloudinary.com/fxokwlyu/video/upload/v1788498484/zoniraz_frontend/videos/neck.mp4";

const trendingItems = [
  {
    id: 1,
    title: 'Auspicious Occasion',
    video: AuspiciousOccasion,
  },
  {
    id: 2,
    title: 'Gifting Jewellery',
    video: giftingVideo,
  },
  {
    id: 3,
    title: 'Origami Edit',
    video: origamiVideo,
  },
];

const TrendingNow = memo(function TrendingNow() {
  return (
    <section className="trending-section">
      <div 
        className="trending-header" 
        style={{ cursor: 'pointer' }}
        onClick={() => { window.location.hash = 'trending-now'; }}
        title="Click to view all trending & most bought products"
      >
        <h2 className="trending-title">Trending Now &rarr;</h2>
        <p className="trending-subtitle">Jewellery pieces everyone’s eyeing right now (Click to view all)</p>
        <div className="trending-underline" />
      </div>

      <div className="trending-grid">
        {trendingItems.map((item) => (
          <div key={item.id} className="trending-card" style={{ cursor: 'default' }}>
            <div className="trending-card-img-wrap">
              {item.video ? (
                <LazyVideo
                  src={item.video}
                  className="trending-card-img"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              ) : (
                <img src={item.image} alt={item.title} className="trending-card-img" loading="lazy" decoding="async" width="400" height="400" />
              )}
            </div>
            <h3 className="trending-card-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
});

export default TrendingNow;
