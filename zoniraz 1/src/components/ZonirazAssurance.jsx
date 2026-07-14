import React, { useState, useEffect, useRef } from 'react';
import craftsmanshipImg from '../assets/nine-kt.png';
import ethicalImg from '../assets/shaya-diamonds.png';
import transparencyImg from '../assets/solitaire-sets.png';
import warrantyImg from '../assets/dancing-hoops.png';
import buybackImg from '../assets/gulnaara.png';
import craftsmanshipVideo from '../assets/videos/1.mp4';
import ethicallyVideo from '../assets/videos/3.mp4';
import transparencyVideo from '../assets/videos/5.mp4';
import warrantyVideo from '../assets/videos/6.mp4';
import buybackVideo from '../assets/videos/4.mp4';

const stories = [
  {
    id: 1,
    title: 'Quality Craftsmanship',
    subtitle: 'Meticulously crafted jewelry for lasting brilliance.',
    image: craftsmanshipImg,
    video: craftsmanshipVideo,
    tag: 'Signature Quality',
    tagSub: '18KT & 22KT Pure Gold'
  },
  {
    id: 2,
    title: 'Ethically Sourced',
    subtitle: 'Responsibly selected gems, honoring earth and humanity.',
    image: ethicalImg,
    video: ethicallyVideo,
    tag: 'Conflict-Free Stones',
    tagSub: '100% Certified Origins'
  },
  {
    id: 3,
    title: '100% Transparency',
    subtitle: 'No hidden costs. Full breakdown of gold weights and stone values.',
    image: transparencyImg,
    video: transparencyVideo,
    tag: 'Certified Purity',
    tagSub: 'SGL & IGI Hallmarked'
  },
  {
    id: 4,
    title: 'Lifetime Warranty',
    subtitle: 'Enjoy free polishing, repair support, and quality checks.',
    image: warrantyImg,
    video: warrantyVideo,
    tag: 'Lifetime Care',
    tagSub: 'Free Maintenance Support'
  },
  {
    id: 5,
    title: 'Assured Buyback',
    subtitle: 'Secure the best value with our transparent buyback policies.',
    image: buybackImg,
    video: buybackVideo,
    tag: 'Easy Buyback',
    tagSub: '100% Gold Value Return'
  }
];

export default function ZonirazAssurance() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with the middle (3rd) card active
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // Start playing by default
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRefs = useRef([]);

  // Sync video elements play/mute state
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;
      if (index === activeIndex) {
        videoEl.muted = isMuted;
        if (isPaused) {
          videoEl.pause();
        } else {
          videoEl.play().catch((err) => {
            console.log('Autoplay play interrupted:', err);
          });
        }
      } else {
        videoEl.pause();
        videoEl.muted = true;
      }
    });
  }, [activeIndex, isPaused, isMuted, isExpanded]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stories.length);
    setIsPaused(false); // Play new video automatically
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
    setIsPaused(false); // Play new video automatically
  };

  return (
    <section className="za-section">
      <div className="za-header-centered">
        <h2 className="za-centered-title">Zoniraz Assurance</h2>
        <p className="za-centered-subtitle">Crafted by experts, cherished by you</p>
        <div className="za-centered-underline" />
      </div>

      <div className={`za-story-carousel-container ${isExpanded ? 'za-carousel-expanded' : ''}`}>
        {/* Navigation Arrows - Hidden in expanded mode */}
        {!isExpanded && (
          <button className="za-carousel-arrow za-arrow-left" onClick={handlePrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className={`za-story-cards-wrapper ${isExpanded ? 'expanded-mode' : ''}`}>
          {stories.map((story, index) => {
            // Determine card position classes for 5 cards
            let positionClass = '';
            if (index === activeIndex) {
              positionClass = 'za-card-active';
            } else if (index === (activeIndex - 1 + stories.length) % stories.length) {
              positionClass = 'za-card-left';
            } else if (index === (activeIndex + 1) % stories.length) {
              positionClass = 'za-card-right';
            } else if (index === (activeIndex - 2 + stories.length) % stories.length) {
              positionClass = 'za-card-far-left';
            } else if (index === (activeIndex + 2) % stories.length) {
              positionClass = 'za-card-far-right';
            }

            return (
              <div
                key={story.id}
                className={`za-story-card ${positionClass}`}
                onClick={() => {
                  if (index !== activeIndex) {
                    setActiveIndex(index);
                    setIsPaused(false); // Autoplay when clicked/activated
                  }
                }}
              >
                {/* Card Background Video/Image */}
                {story.video ? (
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={story.video}
                    className="za-card-bg-img"
                    loop
                    muted={index !== activeIndex || isMuted}
                    playsInline
                    style={{ objectFit: 'cover' }}
                    autoPlay
                  />
                ) : (
                  <img src={story.image} alt={story.title} className="za-card-bg-img" />
                )}

                {/* Dark Vignette Overlay */}
                <div className="za-card-vignette" />

                {/* Floating Video Controls Overlay (Only on Active Card) */}
                {index === activeIndex && (
                  <div className="za-video-controls" onClick={(e) => e.stopPropagation()}>
                    {/* Play/Pause Button */}
                    <button className="za-control-btn" onClick={() => setIsPaused(!isPaused)} title={isPaused ? "Play" : "Pause"}>
                      {isPaused ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      )}
                    </button>

                    {/* Mute/Unmute Button */}
                    <button className="za-control-btn" onClick={() => setIsMuted(!isMuted)} title={isMuted ? "Unmute" : "Mute"}>
                      {isMuted ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                      )}
                    </button>

                    {/* Expand/Single Page Mode Button */}
                    <button className="za-control-btn za-btn-expand" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Back to Carousel" : "View Single Page"}>
                      {isExpanded ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}

                {/* Card Text Content */}
                <div className="za-card-info-content">
                  <h3 className="za-card-story-title">{story.title}</h3>
                  <p className="za-card-story-sub">{story.subtitle}</p>
                </div>

                {/* Floating Product-style Badge at Bottom */}
                <div className="za-card-bottom-tag">
                  <div className="za-tag-details">
                    <span className="za-tag-icon">✦</span>
                    <div>
                      <span className="za-tag-main">{story.tag}</span>
                      <span className="za-tag-sub">{story.tagSub}</span>
                    </div>
                  </div>
                  <div className="za-tag-arrow">&rarr;</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows - Hidden in expanded mode */}
        {!isExpanded && (
          <button className="za-carousel-arrow za-arrow-right" onClick={handleNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}