import React from 'react';
import rightBgImg from '../assets/nine-kt.png';

export default function NewArrivals() {
  return (
    <section className="na-section">
      {/* Banner Container */}
      <div
        className="na-banner"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(93, 70, 60, 0.95) 0%, rgba(93, 70, 60, 0.8) 50%, rgba(0, 0, 0, 0) 100%), url(${rightBgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center'
        }}
      >
        <div className="na-banner-content">
          <div className="na-title-row">
            <h2 className="na-title">New Arrivals</h2>
          </div>
          <p className="na-description">
            New Arrivals Dropping Daily, Monday through Friday.<br />
            Explore the Latest Launches Now!
          </p>
        </div>
      </div>
    </section>
  );
}
