import React from 'react';
import giftingVideo from '../assets/videos/9.mp4';
import origamiVideo from '../assets/videos/4.mp4';
import AuspiciousOccasion from '../assets/videos/neck.mp4'

const trendingItems = [
  {
    id: 1,
    title: 'Auspicious Occasion',
    video: AuspiciousOccasion,
    href: '#auspicious',
  },
  {
    id: 2,
    title: 'Gifting Jewellery',
    video: giftingVideo,
    href: '#gifting',
  },
  {
    id: 3,
    title: 'Origami Edit',
    video: origamiVideo,
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
          </a>
        ))}
      </div>
    </section>
  );
}
