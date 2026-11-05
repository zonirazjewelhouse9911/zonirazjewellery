import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FestiveLandingModal.css';

export default function FestiveLandingModal({ onEnter, forceOpen = false }) {
  // Always active on page reload as requested: "jb bhi site relode ho to ye aana chahiy"
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
    }, 900);
  }, [onEnter]);

  // Automatic disappearance after 5 to 7 seconds (6000ms = 6s) as requested:
  // "landing page ke animation ko 5to7 second ka kro"
  useEffect(() => {
    if (!isOpen || forceOpen) return;

    const autoTimer = setTimeout(() => {
      handleEnterWebsite();
    }, 6000);

    return () => clearTimeout(autoTimer);
  }, [isOpen, forceOpen, handleEnterWebsite]);

  // Support closing immediately on click or Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleEnterWebsite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleEnterWebsite]);

  // Floating ambient golden stardust particles
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
          onClick={handleEnterWebsite}
          role="dialog"
          aria-modal="true"
          aria-label="Happy Diwali - Zoniraz Jewel House"
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

          {/* Top Brand Header (No button) */}
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
          </header>

          {/* Main Central Content Area */}
          <main className="zoniraz-fullpage-content">
            {/* 1. Festive Reminder Headline */}
            <p className="zoniraz-fullpage-reminder-pre">
              Here’s a Reminder:
            </p>
            <h1 className="zoniraz-fullpage-reminder-main">
              The true light of the festive season is{' '}
              <span className="zoniraz-fullpage-reminder-you">YOU!</span>
            </h1>

            {/* 2. Central Jewellery Diya Piece: Left slides in from left, Right slides in from right */}
            <div className="zoniraz-landing-jewel-stage">
              {/* Sacred Rangoli Floor Mandala */}
              <img 
                src="/festive-floor-rangoli.png" 
                alt="Sacred Rangoli Mandala" 
                className="zoniraz-floor-rangoli-bg"
              />

              {/* Left Jewellery Piece (Slides in from Left Side) */}
              <div className="zoniraz-earring-left-wrapper">
                <img 
                  src="/festive-earring-left-tight.png" 
                  alt="Zoniraz Left Diamond Diya Earring" 
                  className="zoniraz-earring-piece-img"
                />

                {/* Left Flame Wick */}
                <div className="zoniraz-wick-flame-left">
                  <div className="zoniraz-wick-flame-aura" />
                  <div className="zoniraz-wick-flame-body">
                    <div className="zoniraz-wick-flame-core" />
                  </div>
                </div>

                {/* Diamond Starburst Glint on Left Earring */}
                <div className="zoniraz-jewel-glint" style={{ left: '46%', top: '48%', animationDelay: '1.2s' }} />
              </div>

              {/* Right Jewellery Piece (Slides in from Right Side) */}
              <div className="zoniraz-earring-right-wrapper">
                <img 
                  src="/festive-earring-right-tight.png" 
                  alt="Zoniraz Right Diamond Diya Earring" 
                  className="zoniraz-earring-piece-img"
                />

                {/* Right Flame Wick */}
                <div className="zoniraz-wick-flame-right">
                  <div className="zoniraz-wick-flame-aura" />
                  <div className="zoniraz-wick-flame-body">
                    <div className="zoniraz-wick-flame-core" />
                  </div>
                </div>

                {/* Diamond Starburst Glint on Right Earring */}
                <div className="zoniraz-jewel-glint" style={{ left: '48%', top: '56%', animationDelay: '2.4s' }} />
              </div>
            </div>

            {/* 3. Happy Diwali Section & Heartfelt Wishes Message */}
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

            {/* Subtle auto-skip hint (No button) */}
            <div className="zoniraz-fullpage-auto-hint">
              Tap anywhere to enter website
            </div>
          </main>

          {/* Footer Subtext */}
          <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', opacity: 0.8 }}>
            <span style={{ fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', color: '#e8cb9e' }}>
              Zoniraz Jewel House • Certified Diamond & Gold Jewellery
            </span>
          </footer>

          {/* Subtle Golden Ambient Progress Bar across Bottom (6s Duration) */}
          {!forceOpen && (
            <div className="zoniraz-landing-progress-track" aria-hidden="true">
              <div className="zoniraz-landing-progress-bar" />
            </div>
          )}
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
