import React, { useState, useEffect } from 'react';
import { API_BASE_URL, getUploadsUrl } from '../config';
import { cachedFetch } from '../utils/apiCache';

const banner2_800 = "https://media.zoniraz.com/uploads/zoniraz_frontend/zZONIRAZ-800.webp";
const banner2_1400 = "https://media.zoniraz.com/uploads/zoniraz_frontend/zZONIRAZ-1400.webp";

const defaultImageSlide = { 
  id: 'def-1', 
  type: 'image', 
  src800: banner2_800, 
  src1400: banner2_1400, 
  title: '', 
  alt: 'Zoniraz Jewel House – Diamond Jewellery in Alwar' 
};
const customTextSlide = { id: 'custom-slide', type: 'custom' };

const initialSlides = [defaultImageSlide, customTextSlide];

export default function Hero() {
  const [slides, setSlides] = useState(initialSlides);
  const [current, setCurrent] = useState(0);
  // hii

  // Fetch dynamic banners from admin API and merge with default banners
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const data = await cachedFetch(`${API_BASE_URL}/api/admin/banners`);
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
              alt: b.alt || b.title || 'Zoniraz Jewel House – Diamond Jewellery in Alwar',
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
    "Trusted Diamond Jewellery Exporters in India",
    "Sell Old Gold Online | Trusted Value & Easy Exchange",
    "Affordable Diamond Jewellery in Alwar, Rajasthan",
    "Shop Classic & Elegant Diamond Jewellery in Rajasthan"
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

  // Touch swipe handling for mobile & tablet responsiveness
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }
  };

  return (
    <main
      className="hero-container hero-carousel"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Active Slide Track */}
      <div className="hero-slide-track">
        {currentSlide.type === 'video' ? (
          <div className="hero-slide-item" key={currentSlide.src || `video-${current}`}>
            <video
              src={currentSlide.src}
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={goNext}
              className="hero-slide-media hero-slide-video"
            >
              <track kind="captions" src="/empty.vtt" srcLang="en" label="English" default />
            </video>
          </div>
        ) : currentSlide.type === 'image' ? (
          <div className="hero-slide-item" key={currentSlide.id || `image-${current}`}>
            {currentSlide.link ? (
              <a 
                href={currentSlide.link} 
                target={currentSlide.link.startsWith('http') ? '_blank' : '_self'} 
                rel="noreferrer"
                className="hero-slide-link"
              >
                <picture className="hero-slide-picture">
                  {currentSlide.src800 && (
                    <source srcSet={currentSlide.src800} media="(max-width: 768px)" type="image/webp" />
                  )}
                  <source srcSet={currentSlide.src1400} type="image/webp" />
                  <img
                    src={currentSlide.src1400}
                    alt={currentSlide.alt || currentSlide.title || "Zoniraz Jewel House – Diamond Jewellery in Alwar"}
                    className="hero-slide-media"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
                {currentSlide.title && (
                  <div className="hero-banner-title-overlay">
                    <h2>{currentSlide.title}</h2>
                  </div>
                )}
              </a>
            ) : (
              <div className="hero-slide-wrapper">
                <picture className="hero-slide-picture">
                  {currentSlide.src800 && (
                    <source srcSet={currentSlide.src800} media="(max-width: 768px)" type="image/webp" />
                  )}
                  <source srcSet={currentSlide.src1400} type="image/webp" />
                  <img
                    src={currentSlide.src1400}
                    alt={currentSlide.alt || currentSlide.title || "Zoniraz Jewel House – Diamond Jewellery in Alwar"}
                    className="hero-slide-media"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
                {currentSlide.title && (
                  <div className="hero-banner-title-overlay">
                    <h2>{currentSlide.title}</h2>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="hero-custom-slide" key="custom-slide">
            <div className="hero-wave-bg-1" />
            <div className="hero-wave-bg-2" />
            <div className="hero-custom-text-container">
              <span className="hero-custom-tag">ZONIRAZ JEWELS</span>
              <h2 className={`hero-custom-text ${textFade ? 'active' : ''}`}>
                {rotatingTexts[textIndex]}
              </h2>
              <p className="hero-custom-desc">Luxury Jewellery Brand in India</p>
              <a href="/all-collections" className="hero-custom-btn">EXPLORE COLLECTIONS &rarr;</a>
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
