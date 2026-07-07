import React, { useState, useEffect } from 'react';
import banner1 from '../assets/ten-off.jpg.jpeg';
import banner2 from '../assets/ZONIRAZ.png';
import heroVideo from '../assets/vs-p_v2.mp4';

const slides = [
  { id: 1, type: 'video', src: heroVideo },
  { id: 2, type: 'image', src: banner1 },
  { id: 3, type: 'image', src: banner2 },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (index) => {
    setCurrent(index);
  };

  // Auto-advance logic: Timer only for images; videos use onEnded event
  useEffect(() => {
    if (slides[current].type === 'image') {
      const timer = setTimeout(() => {
        goNext();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [current]);

  return (
    <main
      className="hero-container hero-carousel"
      style={{
        minHeight: '480px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Media (Video / Image) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {slides[current].type === 'video' ? (
          <video
            key={slides[current].src}
            src={slides[current].src}
            autoPlay
            muted
            playsInline
            onEnded={goNext} // Automatically advance to the next slide when the video ends
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <img
            src={slides[current].src}
            alt="Zoniraz Jewellery Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
      </div>

      {/* Prev Arrow */}
      <button 
        className="carousel-arrow carousel-arrow-prev" 
        onClick={goPrev} 
        aria-label="Previous slide"
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Next Arrow */}
      <button 
        className="carousel-arrow carousel-arrow-next" 
        onClick={goNext} 
        aria-label="Next slide"
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="carousel-dots" style={{ zIndex: 10 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
