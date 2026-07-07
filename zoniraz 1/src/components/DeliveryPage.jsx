import React, { useState } from 'react';

const helpCategories = [
  {
    id: 'delivery',
    label: 'Order Delivery and Shopping',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8M10 12l2 2 4-4" />
      </svg>
    )
  },
  {
    id: 'account',
    label: 'My Account',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    id: 'returns',
    label: 'Returns and Exchanges',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    id: 'international',
    label: 'International Shipping',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    id: 'giftcards',
    label: 'Gift Cards',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )
  }
];

const categoryFAQs = {
  delivery: [
    {
      q: "How can I know the status of my order?",
      a: "You can track your order by logging into your account and visiting the 'My Orders' section. You will also receive regular email and SMS updates about your order status."
    },
    {
      q: "What happens if my order is lost in transit?",
      a: "In the rare case that your order is lost in transit, please contact our customer support within 15 days of the expected delivery date. We will initiate an investigation with our courier partner and arrange for a replacement or full refund."
    },
    {
      q: "Where do you deliver within India?",
      a: "We deliver across all major cities and towns in India through our trusted courier network. Enter your pincode on the product page to check if delivery is available to your location."
    },
    {
      q: "I live outside India. Can I order something to be delivered in India?",
      a: "Yes! You can place an international order and have it delivered to an Indian address. Simply select India as the delivery country during checkout and provide the Indian delivery address."
    },
    {
      q: "Do I need to pay shipping/delivery charges?",
      a: "We offer free shipping on all orders above ₹1999. For orders below this amount, a nominal shipping fee is applied based on your location and order weight."
    },
    {
      q: "How soon will I receive my order?",
      a: "Standard orders are delivered within 5-7 business days. Express delivery is available in select cities within 1-2 business days. Custom or made-to-order jewellery may take 10-14 business days."
    },
    {
      q: "Do we need to show a id proof?",
      a: "ID proof may be required at the time of delivery for high-value orders above ₹50,000 as per our security policy. Please keep a valid government ID handy."
    },
    {
      q: "Do we need a pan card?",
      a: "A PAN card is required for purchases above ₹2,00,000 as per the Income Tax Act. For purchases above ₹50,000, Form 60 may be required if PAN is not available."
    }
  ],
  account: [
    {
      q: "How do I create an account?",
      a: "Click on the 'User' icon in the navbar and follow the sign-up process with your email and mobile number."
    }
  ],
  payment: [
    {
      q: "What are the payment options available?",
      a: (
        <div>
          <h5 style={{ fontWeight: '600', color: '#2b221d', marginTop: '0', marginBottom: '8px' }}>Domestic Orders</h5>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', lineHeight: '1.6', color: '#746380' }}>
            Payments can be made through credit cards, debit cards, international cards, net banking or cash on delivery. Please note that payments will be accepted only in INR for domestic orders. In case of international credit cards, the transaction amount will be converted to INR before the payment is accepted. Currency conversion charges may apply based on your credit card policy.
          </p>

          <h5 style={{ fontWeight: '600', color: '#2b221d', marginBottom: '8px' }}>International Orders</h5>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', lineHeight: '1.6', color: '#746380' }}>
            Payments are accepted through PayPal Payment gateway either by your PayPal account or by using International credit/debit cards only. For orders being shipped outside India, the payment will be accepted only in US Dollars. For international orders, currency conversion rates will apply according to the prevailing exchange rates on the day of placing the order.
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#8c7365', fontWeight: '600' }}>
            NOTE: Indian issued cards will not be accepted for international orders.
          </p>

          <h5 style={{ fontWeight: '600', color: '#2b221d', marginBottom: '8px' }}>ID Proof Requirements (International)</h5>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', lineHeight: '1.6', color: '#746380' }}>
            For International Orders you will be required to send us government-issued photo Identity proof preferably: Driving License or Passport.
          </p>

          <h5 style={{ fontWeight: '600', color: '#2b221d', marginBottom: '12px' }}>International Import Duties (Indicative)</h5>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d4c5bd', textAlign: 'left', fontWeight: '600', color: '#2b221d' }}>
                <th style={{ padding: '8px 4px' }}>S.No</th>
                <th style={{ padding: '8px 4px' }}>Country</th>
                <th style={{ padding: '8px 4px' }}>Duty (%)</th>
                <th style={{ padding: '8px 4px' }}>VAT/Tax (%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, c: 'The US', d: '5.8%', v: '11%' },
                { no: 2, c: 'The UK', d: '5%', v: '20%' },
                { no: 3, c: 'Canada', d: '8.5%', v: '5%' },
                { no: 4, c: 'The UAE', d: '5%', v: '5%' },
                { no: 5, c: 'Australia', d: '5%', v: '11%' },
                { no: 6, c: 'Singapore', d: '0%', v: '7%' },
                { no: 7, c: 'New Zealand', d: '0.05%', v: '15%' },
                { no: 8, c: 'The Netherlands', d: '4%', v: '21%' },
                { no: 9, c: 'Germany', d: '0%', v: '20%' },
                { no: 10, c: 'Nepal', d: '9.5%', v: '0%' },
                { no: 11, c: 'Saudi Arabia', d: '5%', v: '0%' }
              ].map(row => (
                <tr key={row.no} style={{ borderBottom: '1px solid #f2ebe8', color: '#746380' }}>
                  <td style={{ padding: '8px 4px' }}>{row.no}</td>
                  <td style={{ padding: '8px 4px' }}>{row.c}</td>
                  <td style={{ padding: '8px 4px' }}>{row.d}</td>
                  <td style={{ padding: '8px 4px' }}>{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ margin: '0', fontSize: '11.5px', color: '#8c7365', fontStyle: 'italic' }}>
            All rates are subject to change and borne by the customer at the time of delivery.
          </p>
        </div>
      )
    },
    {
      q: "Which credit cards are accepted for domestic and international payments?",
      a: "For domestic payments, we accept Visa, MasterCard, RuPay, and Diner's Club cards. For international payments, we accept Visa, MasterCard, American Express, and Diner's Club cards."
    },
    {
      q: "Which domestic debit cards are accepted?",
      a: "We accept all domestic debit cards issued by Indian banks including Visa, MasterCard, RuPay, and Maestro."
    },
    {
      q: "Accepted domestic banks for payment through net banking?",
      a: "We support net banking through all major Indian banks, including State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Punjab National Bank (PNB), and many others."
    }
  ],
  returns: [
    {
      q: "How can I cancel my order?",
      a: "Orders once placed can only be cancelled prior to shipment. Refer cancellation policy."
    },
    {
      q: "In case I change my mind about the size picked up, can I replace the order?",
      a: "Yes, you can request a size replacement within 15 days of delivery. The item must be unused, in its original condition, and with all tags and product certification intact."
    },
    {
      q: "What do I do if I receive the wrong product?",
      a: "If you receive an incorrect product, please contact our support team immediately (within 24 hours of receipt) with pictures of the parcel. We will arrange a reverse pickup and ship the correct item on priority."
    },
    {
      q: "The product that I received was damaged and I want to return it. What do I do?",
      a: "In case of damaged deliveries, please report it to our customer support within 24 hours of delivery. We will organize a free pickup and validate the claim to issue a complete refund or replacement."
    },
    {
      q: "What is the return policy?",
      a: "We offer a 15-day hassle-free return policy on our standard products. The product should be in its original packaging with the invoice and authenticity certificate."
    },
    {
      q: "Do I need to pay for the return shipment if I return my order?",
      a: "No, reverse pickup is absolutely free of cost for all domestic returns within India."
    },
    {
      q: "Are there certain products which are not eligible for the return?",
      a: "Yes, customized jewellery, custom sizing, personalized engravings, and custom-made orders are not eligible for returns or cancellations."
    },
    {
      q: "How do I return my order?",
      a: "To return your order, go to 'My Account' > 'My Orders', select the order, and click on 'Return Order' to schedule a pickup. Our courier partner will pick up the package within 48 hours."
    }
  ],
  international: [
    {
      q: "Which are the international shipping destinations covered?",
      a: "Australia | Bahrain | Canada | Germany | Italy | Kenya | Kuwait | Malaysia | Netherlands | New Zealand | Oman | Portugal | Qatar | Romania | Saudi Arabia | Singapore | South Africa | Spain | United Arab Emirates | United Kingdom | United States of America"
    },
    {
      q: "What is the minimum order value for an international order?",
      a: "There is no minimum order value required for placing an international order. However, shipping rates and import duties will be calculated depending on the order value and destination."
    },
    {
      q: "What products are excluded from international delivery?",
      a: "Gold coins, loose birthstones, and custom designs may be restricted for international shipping depending on customs regulations and safety guidelines."
    },
    {
      q: "Which mode of payment options are available for international orders?",
      a: "Payments are processed securely via PayPal, either through your PayPal account or using international Credit/Debit cards (Visa, MasterCard, American Express, Diner's Club)."
    },
    {
      q: "Who is the shipping partner?",
      a: "We partner with leading global logistics providers like DHL, FedEx, and UPS to ensure safe and fully insured shipping of your precious cargo."
    },
    {
      q: "In how many days will i receive my international order?",
      a: "International orders are typically delivered within 7 to 14 business days from the dispatch date, subject to customs clearance in the destination country."
    },
    {
      q: "What are shipping charges?",
      a: "Shipping charges are calculated at checkout based on package weight and destination. We offer free shipping on international orders above $500 USD."
    },
    {
      q: "Are returns or exchanges accepted?",
      a: "We currently do not accept returns or exchanges for international orders due to complex import/export procedures and high transit costs. Please select sizes and details carefully."
    }
  ],
  giftcards: [
    {
      q: "How can I purchase a Zoniraz Gift Card?",
      a: "You can purchase Zoniraz e-Gift Cards directly from our website in denominations ranging from ₹1,000 to ₹50,000."
    },
    {
      q: "What is the validity of a Gift Card?",
      a: "Zoniraz Gift Cards are valid for 1 year from the date of issue and can be redeemed both online and at our showrooms."
    }
  ]
};

export default function DeliveryPage({ initialCategory = 'delivery' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [openFaq, setOpenFaq] = useState(null);

  React.useEffect(() => {
    setActiveCategory(initialCategory);
    setOpenFaq(null);
  }, [initialCategory]);

  const activeCategoryLabel = helpCategories.find(cat => cat.id === activeCategory)?.label || "Help Center";
  const faqs = categoryFAQs[activeCategory] || [];

  return (
    <div className="delivery-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .delivery-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Montserrat', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 40px 24px 80px 24px;
        }

        .delivery-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Breadcrumb */
        .delivery-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 24px;
          margin-top: 15px;
          font-weight: 500;
        }
        .delivery-breadcrumb a { color: #8c7365; text-decoration: none; }

        /* Page Title */
        .delivery-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 500;
          color: #2b221d;
          margin-bottom: 30px;
          padding-bottom: 16px;
          border-bottom: 1px solid #d4c5bd;
        }

        /* Main two-column layout */
        .delivery-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .delivery-layout {
            grid-template-columns: 1fr;
          }
        }

        /* LEFT: Help Categories Sidebar */
        .help-sidebar {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #e1d8ea;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          position: sticky;
          top: 20px;
        }

        .help-sidebar-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8c7365;
          padding: 20px 24px 14px 24px;
          border-bottom: 1px solid #f2ebe8;
        }

        .help-category-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 16px 24px;
          text-align: left;
          background: none;
          border: none;
          border-bottom: 1px solid #f7f3f2;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #2b221d;
          transition: background-color 0.2s, color 0.2s;
        }
        .help-category-btn:last-child {
          border-bottom: none;
        }
        .help-category-btn svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #a39084;
          transition: color 0.2s;
        }
        .help-category-btn:hover {
          background-color: #faf7f5;
        }
        .help-category-btn.active {
          background-color: #2b221d;
          color: #ffffff;
        }
        .help-category-btn.active svg {
          color: #c5a880;
        }

        /* Contact box below sidebar */
        .need-help-box {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #e1d8ea;
          padding: 28px 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          margin-top: 20px;
          text-align: center;
        }

        .need-help-box h4 {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px 0;
          color: #2b221d;
        }

        .need-help-phone {
          font-size: 20px;
          font-weight: 700;
          color: #2b221d;
          margin-bottom: 4px;
        }

        .need-help-hours {
          font-size: 11px;
          color: #8c7365;
          margin-bottom: 18px;
        }

        .contact-support-btn {
          display: inline-block;
          background-color: #2b221d;
          color: #ffffff;
          padding: 10px 28px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background-color 0.2s;
          cursor: pointer;
          border: none;
          font-family: 'Montserrat', sans-serif;
        }
        .contact-support-btn:hover {
          background-color: #44352d;
        }

        /* RIGHT: FAQ Section */
        .faq-panel {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #e1d8ea;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          overflow: hidden;
        }

        .faq-panel-header {
          padding: 30px 36px 20px 36px;
          border-bottom: 1px solid #f2ebe8;
        }

        .faq-panel-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .faq-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
          color: #2b221d;
          margin: 0;
        }

        /* FAQ Accordion */
        .faq-list {
          padding: 0;
        }

        .faq-item {
          border-bottom: 1px solid #f2ebe8;
        }
        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 36px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #2b221d;
          text-align: left;
          gap: 16px;
          transition: background-color 0.2s;
        }

        .faq-question-btn:hover {
          background-color: #faf7f5;
        }

        .faq-question-btn.open {
          color: #c5a880;
        }

        .faq-chevron {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #a39084;
          transition: transform 0.3s ease;
        }
        .faq-chevron.rotated {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .faq-answer.open {
          max-height: 1500px;
        }

        .faq-answer-inner {
          padding: 0 36px 22px 36px;
          font-size: 13.5px;
          line-height: 1.7;
          color: #746380;
        }

        /* Still have questions block */
        .still-questions-block {
          margin: 24px 36px 36px 36px;
          background-color: #ebdcd0;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
        }

        .still-questions-block h4 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #2b221d;
          margin: 0 0 10px 0;
        }

        .still-questions-block p {
          font-size: 13px;
          color: #746380;
          margin: 0 0 20px 0;
          line-height: 1.6;
        }
      `}</style>

      <div className="delivery-container">
        {/* Breadcrumb */}
        <div className="delivery-breadcrumb">
          <a href="#">Home</a> &gt; <span style={{ color: '#2b221d', fontWeight: '600' }}>Delivery Information</span>
        </div>

        <h1 className="delivery-page-title">Zoniraz Help Center</h1>

        <div className="delivery-layout">
          {/* LEFT SIDEBAR */}
          <div>
            <div className="help-sidebar">
              <div className="help-sidebar-title">Help Categories</div>
              {helpCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`help-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Need more help? box */}
            <div className="need-help-box">
              <h4>Need more help?</h4>
              <div className="need-help-phone">97848 36060</div>
              <div className="need-help-hours">10 AM – 8 PM (Mon–Sat)</div>
              <button className="contact-support-btn" onClick={() => { window.location.hash = 'contact'; }}>
                Contact Us
              </button>
            </div>
          </div>

          {/* RIGHT FAQ PANEL */}
          <div className="faq-panel">
            <div className="faq-panel-header">
              <div className="faq-panel-breadcrumb">
                {activeCategoryLabel}
              </div>
              <h2 className="faq-panel-title">{activeCategoryLabel}</h2>
            </div>

            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button
                    className={`faq-question-btn ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <svg className={`faq-chevron ${openFaq === i ? 'rotated' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                    <div className="faq-answer-inner">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Still have questions */}
            <div className="still-questions-block">
              <h4>Still have questions?</h4>
              <p>Our support team is available to help you with your queries about our collections and services.</p>
              <button className="contact-support-btn" onClick={() => { window.location.hash = 'contact'; }}>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
