import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    query: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.query) {
      alert("Please fill all required fields marked with *");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        appointmentDate: '',
        appointmentTime: '',
        query: ''
      });
      alert("Thank you! Your query has been successfully submitted. We will get back to you within 24 hours.");
    }, 2000);
  };

  return (
    <div className="contact-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .contact-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Inter', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 40px 24px 80px 24px;
        }

        .contact-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Breadcrumbs */
        .contact-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
          margin-top: 15px;
          font-weight: 500;
        }
        .contact-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
        }

        /* Heading Style */
        .page-main-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 500;
          color: #2b221d;
          margin-bottom: 24px;
          border-bottom: 1px solid #d4c5bd;
          padding-bottom: 16px;
        }

        /* White Info Block */
        .about-info-block {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          margin-bottom: 50px;
        }

        .about-main-text {
          font-size: 14px;
          line-height: 1.8;
          color: #746380;
          margin-bottom: 30px;
          text-align: justify;
        }

        .mission-vision-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 768px) {
          .mission-vision-row {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .mission-vision-col h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: #2b221d;
          margin-top: 0;
          margin-bottom: 15px;
        }

        .mission-vision-col p {
          font-size: 13.5px;
          line-height: 1.7;
          color: #746380;
          text-align: justify;
          margin: 0;
        }

        /* Have A Question Section */
        .question-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 500;
          text-align: center;
          margin-top: 50px;
          margin-bottom: 36px;
          color: #2b221d;
        }

        /* Split Contact Card */
        .split-contact-box {
          background-color: #ffffff;
          border-radius: 24px;
          border: 1px solid #e1d8ea;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        @media (max-width: 900px) {
          .split-contact-box {
            grid-template-columns: 1fr;
          }
        }

        .split-half {
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .split-half.left-call {
          background-color: #ffffff;
        }

        .split-half.center-email {
          background-color: #ebdcd0;
          border-left: 1px solid #e1d8ea;
          border-right: 1px solid #e1d8ea;
        }
        .split-half.right-address {
          background-color: #ffffff;
        }
        @media (max-width: 900px) {
          .split-half.center-email {
            border-left: none;
            border-right: none;
            border-top: 1px solid #e1d8ea;
            border-bottom: 1px solid #e1d8ea;
          }
          .split-half.right-address {
            border-top: 1px solid #e1d8ea;
          }
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid #c5a880;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #2b221d;
        }
        .icon-circle svg {
          width: 22px;
          height: 22px;
          stroke: #523f34;
        }

        .split-half h4 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 500;
          color: #2b221d;
          margin-top: 0;
          margin-bottom: 12px;
        }

        .split-half .contact-value {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #2b221d;
          margin-bottom: 8px;
        }

        .split-half .timing-text {
          font-size: 11px;
          color: #8c7365;
          margin: 0;
        }

        .toll-free-centered {
          text-align: center;
          font-size: 12px;
          color: #746380;
          line-height: 1.6;
          max-width: 650px;
          margin: 0 auto 50px auto;
          font-style: italic;
        }

        /* Message Form Card */
        .form-luxury-container {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 50px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #e1d8ea;
          margin-top: 40px;
        }

        .form-title-centered {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 500;
          text-align: center;
          margin-top: 0;
          margin-bottom: 8px;
          color: #2b221d;
        }

        .form-subtitle-centered {
          text-align: center;
          font-size: 13px;
          color: #8c7365;
          margin-bottom: 40px;
        }

        .form-field-group {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field-group label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #2b221d;
        }

        .form-field-group label span {
          color: #de3581;
        }

        .beige-input, .beige-select, .beige-textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #d4c5bd;
          border-radius: 12px;
          font-size: 13px;
          color: #2b221d;
          background-color: #ebdcd0;
          box-sizing: border-box;
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .beige-input:focus, .beige-select:focus, .beige-textarea:focus {
          border-color: #2b221d;
          background-color: #f7f1ec;
        }

        .form-two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .form-two-cols {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .submit-query-btn {
          width: 100%;
          background-color: #2b221d;
          color: #ffffff;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 15px;
        }

        .submit-query-btn:hover {
          background-color: #44352d;
        }
        .submit-query-btn:active {
          transform: scale(0.99);
        }
      `}</style>

      <div className="contact-container">
        {/* Breadcrumbs */}
        <div className="contact-breadcrumb">
          <a href="#">Home</a> &gt; <a href="#contact">Help & Contact</a> &gt; <span style={{ color: '#2b221d', fontWeight: '600' }}>Help & Contact</span>
        </div>

        {/* Header */}
        <h1 className="page-main-title">Help & Contact</h1>

        {/* About Info White Block */}
        <div className="about-info-block">
          <p className="about-main-text">
            Zoniraz Jewel house Pvt LTD. is one of the leading Jewellery manufacturer, wholesaler, retailer and exporter in the international Jewels, Gems and Precious stones market. For the last 50 Years we have been serving our loyal customers and delivering them not only qualitative and best designs of Jewellery but also a trustful and responsible brand. Launching our new jewellery brand of real gold and diamond jewellery silver jewellery birthstones. We speak about quality, experience, customer satisfaction, trust, honesty, belief and relationship. Our product gives you royal life experience and a high lifestyle. We believe in trust and honesty in our relationships with our customers, that is why trust is part of our policy. Our strong and elegant designs of jewellery raise grace and build personality and also serve a royal look as most of our designs are derived from Indian culture. We have varied ranges of unique collections of our products to satisfy various demands of different customers.
          </p>

          <div className="mission-vision-row">
            {/* Mission */}
            <div className="mission-vision-col">
              <h3>Our Mission</h3>
              <p>
                Our mission is to serve our customers with maximum satisfaction, and our goal is “ Next Generation Of Jewellery Industry for Customer Support and Satisfaction.” To execute and complete our mission we passionately commence our work at an early stage as well as search for rough diamond. Our diamond jewellery export also has begun and we are satisfying our customers with our excellent designed diamond jewellery.
              </p>
            </div>

            {/* Vision */}
            <div className="mission-vision-col">
              <h3>Our Vision</h3>
              <p>
                Our vision is to grow and reach every customer and become one of the emerging jewellery chains with satisfied and delightful customers. We are consistently making efforts in the path of this vision as well as this is the reason that today 50 years old jewels house Zoniraz website has loyalty and dedication of delivering superior quality, distinctive designs to satisfy our customers.
              </p>
            </div>
          </div>
        </div>

        {/* Have A Question Section */}
        <h2 className="question-section-title">Have A Question</h2>

        {/* Split Contact Box */}
        <div className="split-contact-box">
          {/* Call Us At */}
          <div className="split-half left-call">
            <div className="icon-circle">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4>Call Us At</h4>
            <div className="contact-value">97848 36060</div>
            <p className="timing-text">Mon-Sat: 10AM - 8PM, Sun: Closed</p>
          </div>

          {/* Write to Us */}
          <div className="split-half center-email">
            <div className="icon-circle">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4>Write to Us</h4>
            <div className="contact-value" style={{ fontSize: '15px' }}>zonirazjewelhouse@gmail.com</div>
          </div>

          {/* Visit Us At */}
          <div className="split-half right-address">
            <div className="icon-circle">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4>Visit Us At</h4>
            <div className="contact-value" style={{ fontSize: '13.5px', lineHeight: '1.5', fontWeight: '400', color: '#746380' }}>
              Tilak Market, 7, Hanuman Burj,<br />
              Kabir Colony,<br />
              Alwar, Rajasthan 301001<br />
              India
            </div>
          </div>
        </div>

        {/* Centered Notice */}
        <p className="toll-free-centered">
          The toll free number is only applicable for domestic orders within India. For international customers or deliveries please reach us out through whatsapp or email.
        </p>

        {/* Message Form Box */}
        <div className="form-luxury-container">
          <h2 className="form-title-centered">Send Us A Message</h2>
          <p className="form-subtitle-centered">We'll get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-two-cols">
              {/* Name */}
              <div className="form-field-group">
                <label htmlFor="name-input">Name *</label>
                <input 
                  type="text" 
                  id="name-input"
                  className="beige-input" 
                  placeholder="Enter Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Mobile */}
              <div className="form-field-group">
                <label htmlFor="mobile-input">Mobile *</label>
                <input 
                  type="tel" 
                  id="mobile-input"
                  className="beige-input" 
                  placeholder="Enter Mobile"
                  pattern="[0-9]{10}"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-field-group">
              <label htmlFor="email-input">Email *</label>
              <input 
                type="email" 
                id="email-input"
                className="beige-input" 
                placeholder="Enter Email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="form-two-cols">
              {/* Appointment Date */}
              <div className="form-field-group">
                <label htmlFor="appointment-date-input">Book Appointment (Optional)</label>
                <input 
                  type="date" 
                  id="appointment-date-input"
                  className="beige-input" 
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                />
              </div>

              {/* Time Slot */}
              <div className="form-field-group">
                <label htmlFor="appointment-time-input">&nbsp;</label>
                <select 
                  id="appointment-time-input"
                  className="beige-select"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                >
                  <option value="">Select Time</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="form-field-group">
              <label htmlFor="query-textarea">Message *</label>
              <textarea 
                id="query-textarea"
                className="beige-textarea" 
                rows="5" 
                placeholder="Enter Query"
                required
                value={formData.query}
                onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
              />
            </div>

            <button type="submit" className="submit-query-btn" disabled={submitted}>
              {submitted ? 'Submitting...' : 'Submit Query'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
