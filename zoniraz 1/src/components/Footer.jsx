import React from 'react';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top-row">
        {/* Logo & Tagline */}
        <div className="footer-col brand-col">
          <a href="#" className="footer-brand-logo">
            <svg className="footer-logo-diamond" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
            </svg>
            <span className="footer-logo-text">ZONIRAZ</span>
          </a>
          <p className="footer-tagline">Crafting brilliance for generations.</p>
        </div>

        {/* Useful Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Useful Links</h4>
          <ul className="footer-links-list">
            <li><a href="#delivery">Delivery Information</a></li>
            <li><a href="#shipping">International Shipping</a></li>
            <li><a href="#payment">Payment Options</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#giftcards">Gift Cards</a></li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-col">
          <h4 className="footer-col-title">Information</h4>
          <ul className="footer-links-list">
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#about">About Zoniraz</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact Us</h4>
          <ul className="footer-links-list contact-info-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 9784836060</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', lineHeight: '1.4' }}>
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '3px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                Tilak Market, 7, Hanuman Burj,<br />
                Kabir Colony,<br />
                Alwar, Rajasthan 301001<br />
                India
              </span>
            </li>
          </ul>
        </div>

        {/* Partnership */}
        <div className="footer-col partnership-col">
          <h4 className="footer-col-title">Partnership</h4>
          <a href="#franchise" className="franchise-btn">
            FRANCHISE ENQUIRY
          </a>
          <p className="partnership-tagline">JOIN THE LEGACY OF EXCELLENCE AND TRUST.</p>
        </div>
      </div>

      <div className="footer-divider-line" />

      <div className="footer-bottom-row">
        {/* Social */}
        <div className="footer-social-wrapper">
          <span className="social-label">Social</span>
          <div className="social-icons-group">
            {/* YouTube */}
            <a href="https://www.youtube.com/@zonirazjewel" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 00-2.11 2.107C0 8.028 0 12 0 12s0 3.972.502 5.837a3.003 3.003 0 002.11 2.107C4.476 20.455 12 20.455 12 20.455s7.524 0 9.388-.511a3.003 3.003 0 002.11-2.107C24 15.972 24 12 24 12s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Pinterest */}
            <a href="https://pin.it/4wDWdW6Nr" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.42.04-3.46.21-.93 1.35-5.73 1.35-5.73s-.34-.69-.34-1.72c0-1.61.93-2.82 2.1-2.82 1 0 1.48.75 1.48 1.64 0 1-.64 2.5-1 3.88-.28 1.18.59 2.14 1.75 2.14 2.1 0 3.72-2.22 3.72-5.43 0-2.84-2.04-4.82-4.95-4.82-3.37 0-5.36 2.53-5.36 5.15 0 1 .39 2.1 0.88 2.7.1.12.1.22.07 0.33-.1.4-.3.89-.34.97-.05.1-.12.13-.24.08-1.57-.73-2.55-3.03-2.55-4.87 0-3.97 2.89-7.62 8.32-7.62 4.37 0 7.77 3.11 7.77 7.28 0 4.35-2.74 7.84-6.55 7.84-1.28 0-2.48-.66-2.9-1.46L11 19.5c-.32 1.25-.9 2.53-1.44 3.4C10.74 23.63 11.36 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
              </svg>
            </a>
            {/* X */}
            <a href="https://x.com/zonirazjewel" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/zonirazjewel/" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/zonirazjewel/" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/zonirazjewel/" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* Threads */}
            <a href="https://www.threads.com/@zonirazjewel/" target="_blank" rel="noopener noreferrer" className="social-circle-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.5 2C6.6 2 2 6.6 2 12.5S6.6 23 12.5 23c2.4 0 4.6-.8 6.4-2.2l-1.2-1.3C16.1 20.6 14.4 21 12.5 21 7.8 21 4 17.2 4 12.5S7.8 4 12.5 4s8.5 3.8 8.5 8.5c0 3-1.8 5.6-4.6 5.6-1.5 0-2.7-1-2.7-2.7V10c0-1.8-1.5-3.3-3.3-3.3S7.1 8.2 7.1 10v2.7c0 1.8 1.5 3.3 3.3 3.3.8 0 1.5-.3 2.1-.8 1.1 1.7 3.2 2.8 5.6 2.8 4.2 0 6.9-3.5 6.9-7.8C25 6.6 20.4 2 12.5 2zm-2.1 12.2c-.9 0-1.6-.7-1.6-1.6V10c0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6v2.7c.1.8-.6 1.5-1.6 1.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="footer-meta-wrapper">
          <p className="copyright-text">
            &copy; 2026 Zoniraz Limited. All Rights Reserved.
          </p>
          <div className="footer-legal-links">
            <a href="#terms">Terms & Conditions</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
