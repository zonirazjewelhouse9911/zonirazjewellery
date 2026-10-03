import React from 'react';
const heroModelImg = "https://media.zoniraz.com/uploads/zoniraz_frontend/hero-model.png";

const testimonials = [
  {
    name: 'Harsha Narang',
    role: 'Verified Customer',
    location: 'Alwar, India',
    quote: 'Best quality diamonds and designs in alwar city as compared with other brands'
  },
  {
    name: 'Vikas Gangawat',
    role: 'Loyal Customer',
    location: 'Alwar, India',
    quote: 'One of the best online jewellery shop. Awesome collection n behavior of owner n services is excellent. Recommend zoniraz !'
  },
  {
    name: 'Shilpa Chawla',
    role: 'Verified Customer',
    location: 'Alwar, India',
    quote: "I recently explored gold jewellery in Alwar and Zoniraz had one of the best collections I've seen."
  }
];

export default function TestimonialSection() {
  return (
    <section className="testimonial-section">
      <div className="testimonial-shell">
        <div className="testimonial-intro">
          <p className="testimonial-eyebrow">CLIENT LOVE</p>
          <h2>Why our customers keep coming back</h2>
          <p>
            From bridal sparkle to everyday elegance, our jewellery is loved for its beauty, best diamond quality, comfort, and lasting craftsmanship.
          </p>
        </div>

        <div className="testimonial-grid">
          <article className="testimonial-feature-card">
            <img src="https://media.zoniraz.com/uploads/zoniraz_frontend/WhatsApp_Image_2026-07-09_at_12_56_20_PM__2_.jpg" alt="Happy customer wearing stylish jewellery" loading="lazy" decoding="async" width="400" height="500" />
            <div className="testimonial-feature-body">
              <div className="testimonial-stars">★★★★★</div>
              <p>
                “One of the best online gold & diamond jewellery shop. I am very impressed with their services and recommend all to definitely buy.”
              </p>
              <span>— Rahul Sharma, Alwar, India</span>
            </div>
          </article>

          <div className="testimonial-cards">
            {testimonials.map((item, index) => (
              <article className="testimonial-card" key={index}>
                <div className="testimonial-stars">★★★★★</div>
                <p>“{item.quote}”</p>
                <div className="testimonial-card-footer">
                  <strong>{item.name}</strong>
                  <span>{item.role} • {item.location}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
