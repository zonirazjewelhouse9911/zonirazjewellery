import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FestiveLandingModal.css';

export default function FestiveLandingModal({ onEnter }) {
  // Always true on reload as requested: "jb bhi site relode ho to ye aana chahiy"
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

  // Floating background stardust particles across entire 100vw x 100vh page
  const ambientParticles = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.6 + 2) % 96}%`,
      top: `${(i * 4.2 + 10) % 90}%`,
      size: `${2 + (i % 3) * 1.5}px`,
      duration: `${4 + (i % 5) * 1.1}s`,
      delay: `${(i * 0.28) % 3.5}s`
    }));
  }, []);

  return (
    <>
      {isOpen && (
        <div 
          className={`zoniraz-fullpage-festive-landing active ${isExiting ? 'exiting' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Happy Diwali Greetings - Zoniraz Jewel House"
        >
          {/* Full-Screen Ambient Golden Stardust Particles */}
          <div className="zoniraz-fullpage-particles-layer">
            {ambientParticles.map((p) => (
              <span
                key={p.id}
                className="zoniraz-fullpage-star"
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
          <header className="zoniraz-fullpage-header">
            <div className="zoniraz-fullpage-logo-group">
              <img 
                src="https://media.zoniraz.com/uploads/zoniraz_frontend/zoni.png" 
                alt="Zoniraz Jewels" 
                className="zoniraz-fullpage-logo"
                onError={(e) => { e.currentTarget.src = '/zoni.png'; }}
              />
              <span className="zoniraz-fullpage-hallmark">
                Crafting Brilliance for Generations
              </span>
            </div>

            <button 
              type="button" 
              className="zoniraz-fullpage-skip-btn"
              onClick={handleEnterWebsite}
              aria-label="Enter Store"
            >
              <span>Enter Store</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          {/* Main Central Content: Perfectly Stacked With No Overlap */}
          <main className="zoniraz-fullpage-content">
            {/* 1. Festive Reminder Heading */}
            <p className="zoniraz-fullpage-reminder-pre">
              Here’s a Reminder:
            </p>
            <h1 className="zoniraz-fullpage-reminder-main">
              The true light of the festive season is{' '}
              <span className="zoniraz-fullpage-reminder-you">YOU!</span>
            </h1>

            {/* 2. Central Jewellery Diya Piece With Pinpoint Locked Flames */}
            <div className="zoniraz-landing-jewel-stage">
              <img 
                src="/festive-earrings-diya.png" 
                alt="Zoniraz Diamond Diya Earrings" 
                className="zoniraz-landing-jewel-img"
                loading="eager"
              />

              {/* Diamond Pavé Starburst Glints */}
              <div className="zoniraz-jewel-glint" style={{ left: '38%', top: '51%', animationDelay: '1.2s' }} />
              <div className="zoniraz-jewel-glint" style={{ left: '60%', top: '56%', animationDelay: '2.6s' }} />
              <div className="zoniraz-jewel-glint" style={{ left: '32%', top: '58%', animationDelay: '3.8s' }} />

              {/* Live Animated Diya Flame 1 (Left Wick: 45.34% left, 23.65% top) */}
              <div className="zoniraz-jewel-flame-1">
                <div className="zoniraz-jewel-flame-aura" />
                <div className="zoniraz-jewel-flame">
                  <div className="zoniraz-jewel-flame-core" />
                </div>
              </div>

              {/* Live Animated Diya Flame 2 (Right Wick: 54.10% left, 36.59% top) */}
              <div className="zoniraz-jewel-flame-2">
                <div className="zoniraz-jewel-flame-aura" />
                <div className="zoniraz-jewel-flame">
                  <div className="zoniraz-jewel-flame-core" />
                </div>
              </div>
            </div>

            {/* 3. Happy Diwali Section & Heartfelt Message */}
            <h2 className="zoniraz-fullpage-diwali-title">
              Happy Diwali!
            </h2>

            <div className="zoniraz-fullpage-flourish">
              <span className="zoniraz-fullpage-flourish-line" />
              <span className="zoniraz-fullpage-flourish-diya">🪔</span>
              <span className="zoniraz-fullpage-flourish-line" />
            </div>

            <p className="zoniraz-fullpage-wishes-quote">
              "May the auspicious divine glow of Deepavali illuminate your life with boundless peace, health, and prosperity. May every moment sparkle with warmth, togetherness, and cherished celebrations."
            </p>
            
            <div className="zoniraz-fullpage-wishes-salutation">
              ✨ Wishing You & Your Family a Blessed & Luminous Diwali ✨
            </div>

            {/* 4. Luxury Enter Website Action Button */}
            <button 
              type="button" 
              className="zoniraz-fullpage-enter-button"
              onClick={handleEnterWebsite}
            >
              <span>Enter Website</span>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </main>

          {/* Footer Subtext */}
          <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', opacity: 0.8 }}>
            <span style={{ fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', color: '#e8cb9e' }}>
              Zoniraz Jewel House • Certified Diamond & Gold Jewellery
            </span>
          </footer>
        </div>
      )}

      {/* Floating Reopen Pill: When landing page is dismissed, user can reopen anytime */}
      {!isOpen && (
        <button
          type="button"
          className="zoniraz-fullpage-reopen-badge"
          onClick={() => {
            setIsExiting(false);
            setIsOpen(true);
          }}
          aria-label="View Diwali Greeting"
        >
          <span style={{ fontSize: '15px' }}>🪔</span>
          <span>Diwali Wishes</span>
        </button>
      )}
    </>
  );
}
