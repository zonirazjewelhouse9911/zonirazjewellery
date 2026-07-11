import React, { useState, useEffect } from 'react';
import banner1 from '../assets/ten-off.jpg.jpeg';
import banner2 from '../assets/ZONIRAZ.png';
import heroVideo from '../assets/vs-p_v2.mp4';

const slides = [
  { id: 1, type: 'video', src: heroVideo },
  { id: 2, type: 'image', src: banner1 },
  { id: 3, type: 'image', src: banner2 },
  { id: 4, type: 'custom' },
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

  // Rotating texts for the 4th custom slide
  const rotatingTexts = [
    "A Symphony of Brilliance and Elegance",
    "Handcrafted Masterpieces Tailored for You",
    "Exchange Your Gold for Infinite Value",
    "Lifetime Maintenance & Complete Transparency"
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [textFade, setTextFade] = useState(true);

  useEffect(() => {
    let textTimer;
    if (slides[current].type === 'custom') {
      textTimer = setInterval(() => {
        setTextFade(false);
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
          setTextFade(true);
        }, 500); // Wait for fade-out transition
      }, 4000); // Rotate text every 4 seconds
    }
    return () => clearInterval(textTimer);
  }, [current]);

  // Auto-advance logic: Timer only for non-video slides
  useEffect(() => {
    if (slides[current].type !== 'video') {
      const timer = setTimeout(() => {
        goNext();
      }, slides[current].type === 'custom' ? 16000 : 5500);
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
      {/* Background Media (Video / Image / Custom) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        {slides[current].type === 'video' ? (
          <video
            key={slides[current].src}
            src={slides[current].src}
            autoPlay
            muted
            playsInline
            onEnded={goNext}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />
        ) : slides[current].type === 'image' ? (
          <img
            src={slides[current].src}
            alt="Zoniraz Jewellery Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />
        ) : (
          <div className="hero-custom-slide">
            <div className="hero-wave-bg-1" />
            <div className="hero-wave-bg-2" />
            <div className="hero-custom-text-container">
              <span className="hero-custom-tag">ZONIRAZ JEWELS</span>
              <h2 className={`hero-custom-text ${textFade ? 'active' : ''}`}>
                {rotatingTexts[textIndex]}
              </h2>
              <p className="hero-custom-desc">Curating elegance for every precious milestone</p>
              <a href="#collections" className="hero-custom-btn">EXPLORE COLLECTIONS &rarr;</a>
            </div>
          </div>
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

