import React from 'react';
import heroModelImg from '../assets/hero-model.png';

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Bride-to-be',
    quote: 'The detailing was exquisite and the finish felt so premium. It made my bridal look feel complete.'
  },
  {
    name: 'Aarav & Meera',
    role: 'Engagement gift',
    quote: 'We chose this piece for a special occasion and the craftsmanship exceeded all expectations.'
  },
  {
    name: 'Nisha K.',
    role: 'Loyal customer',
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
            <img src="/WhatsApp Image 2026-07-09 at 12.56.20 PM (2).jpeg" alt="Happy customer wearing stylish jewellery" />
            <div className="testimonial-feature-body">
              <div className="testimonial-stars">★★★★★</div>
              <p>
                “The moment I wore it, I knew it was exactly the kind of piece I had been searching for.
                Elegant, light, and full of charm.”
              </p>
              <span>— Ayesha, Delhi</span>
            </div>
          </article>

          <div className="testimonial-cards">
            {testimonials.map((item, index) => (
              <article className="testimonial-card" key={index}>
                <div className="testimonial-stars">★★★★★</div>
                <p>“{item.quote}”</p>
                <div className="testimonial-card-footer">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
