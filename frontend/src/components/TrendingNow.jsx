import React from 'react';
import giftingVideo from '../assets/videos/9.mp4';
import origamiVideo from '../assets/videos/4.mp4';
import AuspiciousOccasion from '../assets/videos/neck.mp4';

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

export default function TrendingNow() {
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
                <video
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="trending-card-img"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              ) : (
                <img src={item.image} alt={item.title} className="trending-card-img" />
              )}
            </div>
            <h3 className="trending-card-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
