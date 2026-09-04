import React from 'react';
const consultationImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498479/zoniraz_frontend/consultation-desk.jpg";
const blogsImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498423/zoniraz_frontend/gold-necklace-silk.jpg";

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
            <img src={consultationImg} alt="" aria-hidden="true" className="ze-card-img" loading="lazy" decoding="async" width="580" height="380" />
          </div>
          <span className="ze-card-label">BOOK AN APPOINTMENT</span>
        </a>

        {/* Right Card: Blogs */}
        <a href="#blogs" className="ze-card">
          <div className="ze-card-img-wrap">
            <img src={blogsImg} alt="" aria-hidden="true" className="ze-card-img" loading="lazy" decoding="async" width="580" height="380" />
          </div>
          <span className="ze-card-label">BLOGS</span>
        </a>
      </div>
    </section>
  );
}
