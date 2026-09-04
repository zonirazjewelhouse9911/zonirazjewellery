import React from 'react';
const heroModelImg = "https://res.cloudinary.com/fxokwlyu/image/upload/v1788498432/zoniraz_frontend/hero-model.png";

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Bride-to-be',
    location: 'Mumbai, India',
    quote: 'The detailing was exquisite and the finish felt so premium. It made my bridal look feel complete.'
  },
  {
    name: 'Aarav & Meera',
    role: 'Engagement gift',
    location: 'Bengaluru, India',
    quote: 'We chose this piece for a special occasion and the craftsmanship exceeded all expectations.'
  },
  {
    name: 'Nisha K.',
    role: 'Loyal customer',
    location: 'London, UK',
    quote: 'Every time I shop here, I feel like I’m choosing something timeless and beautifully made.'
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
            From bridal sparkle to everyday elegance, our jewellery is loved for its beauty, comfort,
            and lasting craftsmanship.
          </p>
        </div>

        <div className="testimonial-grid">
          <article className="testimonial-feature-card">
            <img src="https://res.cloudinary.com/fxokwlyu/image/upload/v1788498410/zoniraz_frontend/WhatsApp_Image_2026-07-09_at_12_56_20_PM__2_.jpg" alt="Happy customer wearing stylish jewellery" loading="lazy" decoding="async" width="400" height="500" />
            <div className="testimonial-feature-body">
              <div className="testimonial-stars">★★★★★</div>
              <p>
                “The moment I wore it, I knew it was exactly the kind of piece I had been searching for.
                Elegant, light, and full of charm.”
              </p>
              <span>— Ayesha, Delhi, India</span>
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
