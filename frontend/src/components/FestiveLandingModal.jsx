import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FestiveLandingModal.css';

export default function FestiveLandingModal({ onExplore, forceOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check session storage on mount to show animation when user opens the site
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    const hasSeen = sessionStorage.getItem('zoniraz_festive_seen');
    if (!hasSeen) {
      // Gentle 450ms delay after initial page render for silky smooth entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  // Handle close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHasInteracted(true);
    sessionStorage.setItem('zoniraz_festive_seen', 'true');
  }, []);

  // Handle Explore CTA
  const handleExplore = useCallback((e) => {
    if (e) e.preventDefault();
    handleClose();
    if (typeof onExplore === 'function') {
      onExplore();
    } else {
      window.history.pushState(null, '', '/all-collections');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [handleClose, onExplore]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Generate gentle ambient stardust particles
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 5.4 + (i % 3) * 7) % 94 + 3}%`,
      top: `${(i * 5.8 + 25) % 85}%`,
      size: `${2 + (i % 3) * 1.5}px`,
      duration: `${3.5 + (i % 4) * 0.8}s`,
      delay: `${(i * 0.35) % 3.2}s`
    }));
  }, []);

  return (
    <>
      {/* Main Luxury Festive Overlay */}
      <div 
        className={`zoniraz-festive-overlay ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Festive Diwali Greeting by Zoniraz"
      >
        <div className="zoniraz-festive-card">
          <div className="zoniraz-festive-canvas">
            {/* Pristine Reference Image Artwork (Cleaned with seamless gradient) */}
            <img 
              src="/festive-diwali-clean.jpg" 
              alt="Zoniraz Festive Radiance - Happy Diwali" 
              className="zoniraz-festive-base-img"
              loading="eager"
            />

            {/* Radial Vignette Lighting */}
            <div className="zoniraz-festive-vignette" />

            {/* Stardust Ambient Particles */}
            {particles.map((p) => (
              <span
                key={p.id}
                className="zoniraz-festive-particle"
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

            {/* Diamond Starburst Glints over Jewellery facets */}
            {/* Left earring diamond loop glint */}
            <div className="zoniraz-diamond-glint" style={{ left: '26%', top: '51%', animationDelay: '1.2s' }} />
            {/* Left earring cluster glint */}
            <div className="zoniraz-diamond-glint" style={{ left: '38%', top: '53%', animationDelay: '2.8s' }} />
            {/* Right earring cluster glint */}
            <div className="zoniraz-diamond-glint" style={{ left: '72%', top: '61%', animationDelay: '3.6s' }} />
            {/* Right earring loop glint */}
            <div className="zoniraz-diamond-glint" style={{ left: '62%', top: '58%', animationDelay: '0.8s' }} />

            {/* Interactive Animated Flame 1 (Left Diya Lamp Wick) */}
            <div className="zoniraz-festive-flame-wrapper zoniraz-festive-flame-left">
              <div className="zoniraz-festive-aura" />
              <div className="zoniraz-festive-flame">
                <div className="zoniraz-festive-flame-core" />
              </div>
            </div>

            {/* Interactive Animated Flame 2 (Right Diya Lamp Wick) */}
            <div className="zoniraz-festive-flame-wrapper zoniraz-festive-flame-right">
              <div className="zoniraz-festive-aura" />
              <div className="zoniraz-festive-flame">
                <div className="zoniraz-festive-flame-core" />
              </div>
            </div>

            {/* Top Bar with Zoniraz Brand Logo & Luxury Close Button */}
            <div className="zoniraz-festive-topbar">
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); handleClose(); }} 
                className="zoniraz-festive-brand-link"
                title="Zoniraz Jewels"
              >
                <img 
                  src="https://media.zoniraz.com/uploads/zoniraz_frontend/zoni.png" 
                  alt="Zoniraz Jewels" 
                  className="zoniraz-festive-logo-img"
                  onError={(e) => {
                    // Fallback to local logo if remote CDN fails
                    e.currentTarget.src = '/zoni.png';
                  }}
                />
              </a>

              <button 
                type="button"
                className="zoniraz-festive-close-btn"
                onClick={handleClose}
                aria-label="Close Festive Welcome"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Spacer for artwork breathing room */}
            <div style={{ flex: 1 }} />

            {/* Bottom Actions Panel with Gold Shimmer CTA */}
            <div className="zoniraz-festive-bottom">
              <button 
                type="button" 
                className="zoniraz-festive-cta-btn"
                onClick={handleExplore}
              >
                <span>✨ Explore Festive Jewels</span>
              </button>

              <button 
                type="button" 
                className="zoniraz-festive-skip-link"
                onClick={handleClose}
              >
                Continue to Store →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Replay Badge: Allows user to re-open the animated experience anytime */}
      {!isOpen && (
        <button
          type="button"
          className="zoniraz-festive-reopen-badge"
          onClick={() => setIsOpen(true)}
          aria-label="View Festive Greeting Animation"
        >
          <span className="zoniraz-festive-badge-diya-icon">🪔</span>
          <span>Diwali Radiance</span>
        </button>
      )}
    </>
  );
}
