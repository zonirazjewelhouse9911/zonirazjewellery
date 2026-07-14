import React from 'react';
import consultationImg from '../assets/consultation-desk.png';
import blogsImg from '../assets/gold-necklace-silk.png';

export default function ZonirazExperience() {
  return (
    <section className="ze-section">
      {/* Header Block */}
      <div className="ze-header">
        <h2 className="ze-title">Zoniraz Experience</h2>
        <p className="ze-subtitle">Find a Boutique or Book a Consultation</p>
      </div>

      {/* Grid containing two equal cards */}
      <div className="ze-grid">
        {/* Left Card: Book an Appointment */}
        <a href="#contact" className="ze-card">
          <div className="ze-card-img-wrap">
            <img src={consultationImg} alt="Book an Appointment" className="ze-card-img" />
          </div>
          <span className="ze-card-label">BOOK AN APPOINTMENT</span>
        </a>

        {/* Right Card: Blogs */}
        <a href="#blogs" className="ze-card">
          <div className="ze-card-img-wrap">
            <img src={blogsImg} alt="Blogs" className="ze-card-img" />
          </div>
          <span className="ze-card-label">BLOGS</span>
        </a>
      </div>
    </section>
  );
}
