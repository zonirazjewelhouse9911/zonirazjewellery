import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FestiveLandingModal.css';

export default function FestiveLandingModal({ onEnter }) {
  // Always true on fresh page load/reload as requested: "jb bhi site relode ho to ye aana chahiy"
  const [isOpen, setIsOpen] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Smooth exit transition into main website
  const handleEnterWebsite = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
      if (typeof onEnter === 'function') {
        onEnter();
      }
    }, 600);
  }, [onEnter]);

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleEnterWebsite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleEnterWebsite]);

  // Floating background stardust particles across entire 100vw x 100vh screen
  const ambientParticles = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.7 + 2) % 96}%`,
      top: `${(i * 4.1 + 15) % 90}%`,
      size: `${2 + (i % 3) * 1.6}px`,
      duration: `${4 + (i % 5) * 1.1}s`,
      delay: `${(i * 0.28) % 3.5}s`
    }));
  }, []);

  return (
    <>
      {isOpen && (
        <div 
          className={`zoniraz-festive-landing-screen active ${isExiting ? 'exiting' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Happy Diwali Greetings - Zoniraz Jewel House"
        >
          {/* Full-Screen Ambient Stardust & Sparkle Particle Field */}
          <div className="zoniraz-festive-bg-stars">
            {ambientParticles.map((p) => (
              <span
                key={p.id}
                className="zoniraz-landing-particle"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.duration,
                  animationDelay: p.delay
                }}
              />
            ))}
          </div>

          {/* Top Brand Navigation Header */}
          <header className="zoniraz-landing-header">
            <div className="zoniraz-landing-logo-box">
              <img 
                src="https://media.zoniraz.com/uploads/zoniraz_frontend/zoni.png" 
                alt="Zoniraz Jewels" 
                className="zoniraz-landing-logo-img"
                onError={(e) => { e.currentTarget.src = '/zoni.png'; }}
              />
              <span className="zoniraz-landing-hallmark-tag">
                Crafting Brilliance for Generations
              </span>
            </div>

            <button 
              type="button" 
              className="zoniraz-landing-skip-top"
              onClick={handleEnterWebsite}
              aria-label="Enter Website"
            >
              <span>Enter Store</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          {/* Center Stage: Authentic Reference Artwork + Live Diya Flames & Sparkles */}
          <main className="zoniraz-landing-content-wrap">
            <div className="zoniraz-landing-visual-stage">
              {/* Reference Artwork Base Image */}
              <img 
                src="/festive-diwali-clean.jpg" 
                alt="Happy Diwali by Zoniraz" 
                className="zoniraz-landing-artwork-img"
                loading="eager"
              />

              {/* Diamond Pavé Starburst Glints */}
              <div className="zoniraz-landing-glint" style={{ left: '26%', top: '51%', animationDelay: '1.2s' }} />
              <div className="zoniraz-landing-glint" style={{ left: '38%', top: '53%', animationDelay: '2.8s' }} />
              <div className="zoniraz-landing-glint" style={{ left: '72%', top: '61%', animationDelay: '3.6s' }} />
              <div className="zoniraz-landing-glint" style={{ left: '62%', top: '58%', animationDelay: '0.8s' }} />

              {/* Live Animated Diya Flame 1 (Left Wick) */}
              <div className="zoniraz-landing-flame-1">
                <div className="zoniraz-landing-flame-aura" />
                <div className="zoniraz-landing-flame">
                  <div className="zoniraz-landing-flame-core" />
                </div>
              </div>

              {/* Live Animated Diya Flame 2 (Right Wick) */}
              <div className="zoniraz-landing-flame-2">
                <div className="zoniraz-landing-flame-aura" />
                <div className="zoniraz-landing-flame">
                  <div className="zoniraz-landing-flame-core" />
                </div>
              </div>
            </div>

            {/* Heartfelt Diwali Wishes Message */}
            <div className="zoniraz-landing-wishes-box">
              <div className="zoniraz-landing-flourish">
                <span className="zoniraz-landing-flourish-line" />
                <span className="zoniraz-landing-flourish-icon">🪔</span>
                <span className="zoniraz-landing-flourish-line" />
              </div>

              <p className="zoniraz-landing-wishes-text">
                "May the auspicious glow of Deepavali illuminate your life with boundless peace, health, and prosperity. May every moment sparkle with warmth, togetherness, and cherished celebrations."
              </p>
              
              <div className="zoniraz-landing-wishes-sign">
                ✨ Wishing You & Your Family a Joyous & Prosperous Diwali ✨
              </div>
            </div>

            {/* Enter Website Action Button (No explore festive jewels button) */}
            <div className="zoniraz-landing-bottom-action">
              <button 
                type="button" 
                className="zoniraz-landing-enter-btn"
                onClick={handleEnterWebsite}
              >
                <span>Enter Website</span>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </main>

          {/* Footer Subtext */}
          <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', opacity: 0.75 }}>
            <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#e0c39a' }}>
              Zoniraz Jewel House • Certified Diamond & Gold Jewellery
            </span>
          </footer>
        </div>
      )}

      {/* Floating Reopen Pill: When landing page is dismissed, user can reopen anytime */}
      {!isOpen && (
        <button
          type="button"
          className="zoniraz-landing-reopen-pill"
          onClick={() => {
            setIsExiting(false);
            setIsOpen(true);
          }}
          aria-label="View Diwali Greeting"
        >
          <span style={{ fontSize: '14px' }}>🪔</span>
          <span>Diwali Wishes</span>
        </button>
      )}
    </>
  );
}
