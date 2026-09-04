import React, { useState, useEffect } from 'react';
import { API_BASE_URL, getUploadsUrl } from '../config';

const banner2_800 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498454/zoniraz_frontend/zZONIRAZ-800.webp";
const banner2_1400 = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498476/zoniraz_frontend/zZONIRAZ-1400.webp";

const defaultImageSlide = { id: 'def-1', type: 'image', src800: banner2_800, src1400: banner2_1400, title: '' };
const customTextSlide = { id: 'custom-slide', type: 'custom' };

const initialSlides = [defaultImageSlide, customTextSlide];

export default function Hero() {
  const [slides, setSlides] = useState(initialSlides);
  const [current, setCurrent] = useState(0);

  // Fetch dynamic banners from admin API and merge with default banners
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/banners`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const activeBanners = data.data.filter(b => b.isActive !== false);
          
          const combinedSlides = [defaultImageSlide];

          activeBanners.forEach((b, index) => {
            combinedSlides.push({
              id: b._id || `banner-${index}`,
              type: 'image',
              src1400: getUploadsUrl(b.imageUrl),
              src800: getUploadsUrl(b.imageUrl, 800),
              title: b.title || '',
              link: b.link || ''
            });
          });

          // Include custom tagline slide
          combinedSlides.push(customTextSlide);

          if (isMounted) {
            setSlides(combinedSlides);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic hero banners:', err);
      }
    };

    fetchBanners();
    return () => { isMounted = false; };
  }, []);

  // Ensure current index stays within valid range
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides, current]);

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (index) => {
    setCurrent(index);
  };

  // Rotating texts for the custom slide
  const rotatingTexts = [
    "A Symphony of Brilliance and Elegance",
    "Handcrafted Masterpieces Tailored for You",
    "Exchange Your Gold for Infinite Value",
    "Lifetime Maintenance & Complete Transparency"
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [textFade, setTextFade] = useState(true);

  const currentSlide = slides[current] || slides[0];

  useEffect(() => {
    let textTimer;
    if (currentSlide?.type === 'custom') {
      textTimer = setInterval(() => {
        setTextFade(false);
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
          setTextFade(true);
        }, 500);
      }, 4000);
    }
    return () => clearInterval(textTimer);
  }, [current, currentSlide]);

  // Auto-advance logic for carousel slides
  useEffect(() => {
    if (currentSlide?.type !== 'video') {
      const timer = setTimeout(() => {
        goNext();
      }, currentSlide?.type === 'custom' ? 16000 : 5500);
      return () => clearTimeout(timer);
    }
  }, [current, currentSlide]);

  return (
    <main
      className="hero-container hero-carousel"
      style={{
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
        {currentSlide.type === 'video' ? (
          <video
            key={currentSlide.src}
            src={currentSlide.src}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={goNext}
            className="hero-slide-media"
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <track kind="captions" src="https://res.cloudinary.com/fxokwlyu/raw/upload/v1788498402/zoniraz_frontend/empty.vtt" srcLang="en" label="English" default />
          </video>
        ) : currentSlide.type === 'image' ? (
          currentSlide.link ? (
            <a 
              href={currentSlide.link} 
              target={currentSlide.link.startsWith('http') ? '_blank' : '_self'} 
              rel="noreferrer"
              style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
            >
              <picture style={{ width: '100%', height: '100%', display: 'block' }}>
                <source srcSet={currentSlide.src800 || currentSlide.src1400} media="(max-width: 768px)" type="image/webp" />
                <source srcSet={currentSlide.src1400} type="image/webp" />
                <img
                  src={currentSlide.src1400}
                  alt={currentSlide.title || "Zoniraz Hero Banner"}
                  className="hero-slide-media"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="1310"
                  height="485"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </picture>
              {currentSlide.title && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '5%',
                    zIndex: 5,
                    background: 'rgba(18, 16, 14, 0.75)',
                    backdropFilter: 'blur(12px)',
                    padding: '12px 24px',
                    borderRadius: '14px',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: '80%'
                  }}
                >
                  <h2 style={{ fontFamily: 'serif', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {currentSlide.title}
                  </h2>
                </div>
              )}
            </a>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <picture style={{ width: '100%', height: '100%', display: 'block' }}>
                <source srcSet={currentSlide.src800 || currentSlide.src1400} media="(max-width: 768px)" type="image/webp" />
                <source srcSet={currentSlide.src1400} type="image/webp" />
                <img
                  src={currentSlide.src1400}
                  alt={currentSlide.title || "Zoniraz Hero Banner"}
                  className="hero-slide-media"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="1310"
                  height="485"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                  }}
                />
              </picture>
              {currentSlide.title && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '5%',
                    zIndex: 5,
                    background: 'rgba(18, 16, 14, 0.75)',
                    backdropFilter: 'blur(12px)',
                    padding: '12px 24px',
                    borderRadius: '14px',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: '80%'
                  }}
                >
                  <h2 style={{ fontFamily: 'serif', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {currentSlide.title}
                  </h2>
                </div>
              )}
            </div>
          )
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
      {slides.length > 1 && (
        <button
          className="carousel-arrow carousel-arrow-prev"
          onClick={goPrev}
          aria-label="Previous slide"
          style={{ zIndex: 10 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      )}

      {/* Next Arrow */}
      {slides.length > 1 && (
        <button
          className="carousel-arrow carousel-arrow-next"
          onClick={goNext}
          aria-label="Next slide"
          style={{ zIndex: 10 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
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
      )}
    </main>
  );
}
