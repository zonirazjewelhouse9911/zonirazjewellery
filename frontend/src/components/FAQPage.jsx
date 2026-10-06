import React, { useState, useEffect, useMemo } from 'react';

const FAQ_DATA = [
  {
    id: 1,
    num: '01',
    category: 'Jewellery Collection',
    categorySlug: 'jewellery',
    question: 'What types of jewellery does Zoniraz offer?',
    answer: 'Zoniraz offers a wide range of diamond jewellery, rings, earrings, nose pins, pendants and other elegant jewellery designs for everyday wear and special occasions.',
    tags: ['diamond jewellery', 'rings', 'earrings', 'nose pins', 'pendants', 'everyday wear', 'occasions'],
    actionLink: { label: 'Explore All Collections', href: '/all-collections' }
  },
  {
    id: 2,
    num: '02',
    category: 'Bridal & Alwar',
    categorySlug: 'bridal',
    question: 'Does Zoniraz offer bridal and wedding jewellery in Alwar?',
    answer: 'Yes, Zoniraz offers jewellery for brides and weddings, including bridal jewellery, wedding jewellery, diamond necklace sets, diamond earrings and diamond nose pins in Alwar.',
    tags: ['bridal jewellery', 'wedding jewellery', 'diamond necklace sets', 'diamond earrings', 'diamond nose pins', 'alwar'],
    actionLink: { label: 'Visit Alwar Showroom', href: '/zoniraz-alwar' }
  },
  {
    id: 3,
    num: '03',
    category: 'Shipping & Delivery',
    categorySlug: 'shipping',
    question: 'Does Zoniraz deliver jewellery internationally?',
    answer: 'Yes, Zoniraz supports international jewellery shipping and worldwide delivery for eligible orders.',
    tags: ['international shipping', 'worldwide delivery', 'eligible orders', 'courier', 'global'],
    actionLink: { label: 'Shipping & Delivery Info', href: '/delivery' }
  },
  {
    id: 4,
    num: '04',
    category: 'Franchise & Business',
    categorySlug: 'franchise',
    question: 'Does Zoniraz offer jewellery franchise opportunities in India?',
    answer: 'Yes, Zoniraz provides opportunities for entrepreneurs interested in entering the jewellery business through a jewellery franchise model, subject to business requirements and eligibility.',
    tags: ['franchise opportunities', 'business', 'entrepreneurs', 'india', 'expansion'],
    actionLink: { label: 'Explore Franchise Details', href: '/franchise' }
  },
  {
    id: 5,
    num: '05',
    category: 'Franchise & Business',
    categorySlug: 'franchise',
    question: 'What are the benefits of opening a Zoniraz jewellery franchise?',
    answer: 'A Zoniraz franchise can provide entrepreneurs with the opportunity to operate under an established jewellery brand while accessing a range of jewellery products, brand support and business expertise.',
    tags: ['brand support', 'business expertise', 'jewellery products', 'growth', 'franchise benefits'],
    actionLink: { label: 'Franchise Enquiry Form', href: '/franchise' }
  },
  {
    id: 6,
    num: '06',
    category: 'Shipping & Delivery',
    categorySlug: 'shipping',
    question: 'Can international customers order jewellery from Zoniraz?',
    answer: 'Yes, international customers can enquire about jewellery orders and worldwide jewellery delivery. Zoniraz provides support for overseas orders and international jewellery shipping.',
    tags: ['international customers', 'overseas orders', 'worldwide delivery', 'customs', 'support'],
    actionLink: { label: 'International Support', href: '/contact' }
  },
  {
    id: 7,
    num: '07',
    category: 'Customer Support',
    categorySlug: 'contact',
    question: 'How can I contact Zoniraz for jewellery enquiries?',
    answer: 'You can contact Zoniraz through the contact details provided on the official website for product, order and jewellery-related enquiries.',
    tags: ['contact details', 'customer support', 'enquiries', 'phone', 'email', 'alwar'],
    actionLink: { label: 'Get in Touch', href: '/contact' }
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'jewellery', label: 'Jewellery & Collections' },
  { id: 'bridal', label: 'Bridal & Alwar' },
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'franchise', label: 'Franchise Opportunities' },
  { id: 'contact', label: 'Enquiries & Support' }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({ 1: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const all = {};
    FAQ_DATA.forEach(item => {
      all[item.id] = true;
    });
    setOpenItems(all);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.categorySlug === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText = item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));

      return matchCategory && matchText;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="faq-page-wrapper">
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .faq-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Montserrat', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 40px 24px 80px 24px;
        }

        .faq-container {
          max-width: 1060px;
          margin: 0 auto;
        }

        /* Breadcrumb */
        .faq-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 28px;
          margin-top: 10px;
          font-weight: 500;
        }

        .faq-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .faq-breadcrumb a:hover {
          color: #c5a880;
        }

        .faq-breadcrumb-current {
          color: #2b221d;
          font-weight: 600;
        }

        /* Hero Header Card */
        .faq-hero-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 50px 40px 45px;
          text-align: center;
          margin-bottom: 35px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #dbcfcb;
          position: relative;
          overflow: hidden;
        }

        .faq-hero-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c5a880, transparent);
        }

        .faq-badge-top {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c5a880;
          font-weight: 700;
          margin-bottom: 14px;
          padding: 4px 14px;
          border-radius: 20px;
          background: rgba(197, 168, 128, 0.08);
          border: 1px solid rgba(197, 168, 128, 0.25);
        }

        .faq-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 600;
          color: #2b221d;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .faq-hero-desc {
          font-size: 14.5px;
          color: #634d40;
          max-width: 680px;
          margin: 0 auto 30px auto;
          line-height: 1.7;
          font-weight: 400;
        }

        /* Search Bar */
        .faq-search-wrapper {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .faq-search-input {
          width: 100%;
          padding: 15px 48px 15px 48px;
          background: #FAF8F6;
          border: 1.5px solid #d4c5bd;
          border-radius: 50px;
          font-size: 14.5px;
          font-family: 'Montserrat', sans-serif;
          color: #2b221d;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }

        .faq-search-input:focus {
          border-color: #c5a880;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(197, 168, 128, 0.15);
        }

        .faq-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #8c7365;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .faq-search-clear {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #8c7365;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 50%;
        }

        .faq-search-clear:hover {
          color: #2b221d;
        }

        /* Filter Tabs */
        .faq-filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
        }

        .faq-category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .faq-chip {
          background: #ffffff;
          border: 1px solid #dbcfcb;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 12.5px;
          font-weight: 500;
          color: #634d40;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .faq-chip:hover {
          border-color: #c5a880;
          color: #2b221d;
        }

        .faq-chip.active {
          background: #2b221d;
          color: #ffffff;
          border-color: #2b221d;
          font-weight: 600;
        }

        .faq-action-toggles {
          display: flex;
          gap: 10px;
          font-size: 12px;
        }

        .faq-toggle-btn {
          background: #ffffff;
          border: 1px solid #dbcfcb;
          padding: 7px 14px;
          border-radius: 8px;
          color: #634d40;
          cursor: pointer;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }

        .faq-toggle-btn:hover {
          border-color: #c5a880;
          color: #c5a880;
        }

        /* FAQ Accordion List */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 50px;
        }

        .faq-item {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #dbcfcb;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .faq-item:hover {
          border-color: #c5a880;
          box-shadow: 0 6px 22px rgba(197, 168, 128, 0.12);
        }

        .faq-item.open {
          border-color: #c5a880;
          box-shadow: 0 8px 26px rgba(197, 168, 128, 0.14);
        }

        .faq-question-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          cursor: pointer;
          font-family: inherit;
        }

        .faq-question-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .faq-number-badge {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: #c5a880;
          background: rgba(197, 168, 128, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(197, 168, 128, 0.2);
        }

        .faq-item.open .faq-number-badge {
          background: #2b221d;
          color: #c5a880;
          border-color: #2b221d;
        }

        .faq-question-text-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .faq-category-tag {
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #8c7365;
          font-weight: 600;
        }

        .faq-question-title {
          font-family: 'Playfair Display', serif;
          font-size: 17.5px;
          font-weight: 600;
          color: #2b221d;
          margin: 0;
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .faq-item:hover .faq-question-title {
          color: #9d7b4d;
        }

        .faq-item.open .faq-question-title {
          color: #2b221d;
        }

        .faq-chevron-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FAF8F6;
          border: 1px solid #dbcfcb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #634d40;
          transition: all 0.3s ease;
        }

        .faq-chevron-icon svg {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }

        .faq-item.open .faq-chevron-icon {
          background: #c5a880;
          color: #ffffff;
          border-color: #c5a880;
        }

        .faq-item.open .faq-chevron-icon svg {
          transform: rotate(180deg);
        }

        /* Answer Section */
        .faq-answer-collapse {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
        }

        .faq-answer-content {
          padding: 0 26px 26px 78px;
          position: relative;
        }

        .faq-answer-inner {
          position: relative;
          padding-left: 20px;
          border-left: 2px solid #c5a880;
        }

        .faq-answer-text {
          font-size: 15px;
          line-height: 1.8;
          color: #4a3f37;
          margin: 0 0 16px 0;
          font-weight: 400;
        }

        .faq-action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #9d7b4d;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 6px;
          background: rgba(197, 168, 128, 0.08);
          border: 1px solid rgba(197, 168, 128, 0.3);
          transition: all 0.2s ease;
        }

        .faq-action-link:hover {
          background: #c5a880;
          color: #ffffff;
          border-color: #c5a880;
        }

        .faq-action-link svg {
          width: 14px;
          height: 14px;
          transition: transform 0.2s ease;
        }

        .faq-action-link:hover svg {
          transform: translateX(3px);
        }

        /* Empty State */
        .faq-empty-state {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #dbcfcb;
          padding: 50px 20px;
          text-align: center;
          color: #634d40;
        }

        .faq-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #2b221d;
          margin: 0 0 10px 0;
        }

        .faq-empty-desc {
          font-size: 13.5px;
          color: #8c7365;
          margin: 0 0 20px 0;
        }

        .faq-reset-btn {
          background: #2b221d;
          color: #ffffff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Need More Help / Contact Section */
        .faq-contact-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 45px 40px;
          border: 1px solid #dbcfcb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          text-align: center;
        }

        .faq-contact-subtitle {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c5a880;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .faq-contact-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #2b221d;
          margin: 0 0 12px 0;
        }

        .faq-contact-desc {
          font-size: 14px;
          color: #634d40;
          max-width: 580px;
          margin: 0 auto 30px auto;
          line-height: 1.6;
        }

        .faq-contact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .faq-support-tile {
          background: #FAF8F6;
          border: 1px solid #dbcfcb;
          border-radius: 16px;
          padding: 24px 18px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.25s ease;
        }

        .faq-support-tile:hover {
          transform: translateY(-4px);
          border-color: #c5a880;
          box-shadow: 0 8px 24px rgba(197, 168, 128, 0.15);
          background: #ffffff;
        }

        .faq-tile-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(197, 168, 128, 0.12);
          color: #9d7b4d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          border: 1px solid rgba(197, 168, 128, 0.25);
        }

        .faq-tile-icon svg {
          width: 22px;
          height: 22px;
        }

        .faq-tile-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #2b221d;
          margin-bottom: 4px;
        }

        .faq-tile-desc {
          font-size: 11.5px;
          color: #8c7365;
          line-height: 1.4;
        }

        /* Mobile Responsiveness */
        @media (max-width: 900px) {
          .faq-contact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .faq-page-wrapper {
            padding: 24px 16px 60px 16px;
          }

          .faq-hero-card {
            padding: 35px 20px 30px;
            border-radius: 18px;
          }

          .faq-hero-title {
            font-size: 27px;
          }

          .faq-hero-desc {
            font-size: 13.5px;
            margin-bottom: 24px;
          }

          .faq-filters-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .faq-question-btn {
            padding: 18px 16px;
            gap: 12px;
          }

          .faq-question-left {
            gap: 12px;
          }

          .faq-number-badge {
            width: 30px;
            height: 30px;
            font-size: 13px;
            border-radius: 8px;
          }

          .faq-question-title {
            font-size: 15px;
          }

          .faq-answer-content {
            padding: 0 16px 20px 58px;
          }

          .faq-answer-text {
            font-size: 14px;
          }

          .faq-contact-grid {
            grid-template-columns: 1fr;
          }

          .faq-contact-card {
            padding: 30px 18px;
            border-radius: 18px;
          }
        }
      `}</style>

      <div className="faq-container">
        {/* Breadcrumb */}
        <div className="faq-breadcrumb">
          <a href="/">Home</a> &gt; <span className="faq-breadcrumb-current">Frequently Asked Questions</span>
        </div>

        {/* Hero Header Section */}
        <section className="faq-hero-card">
          <div className="faq-badge-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '13px', height: '13px' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Zoniraz Help &amp; FAQs
          </div>

          <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          <p className="faq-hero-desc">
            Discover answers to common queries regarding Zoniraz jewellery collections, bridal offerings in Alwar,
            international shipping, franchise partnerships, and customer support.
          </p>

          {/* Search Box */}
          <div className="faq-search-wrapper">
            <svg className="faq-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="faq-search-input"
              placeholder="Search questions by keyword (e.g., bridal, franchise, international)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button
                type="button"
                className="faq-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* Filter Chips & Expand/Collapse Controls */}
        <div className="faq-filters-bar">
          <div className="faq-category-chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`faq-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="faq-action-toggles">
            <button type="button" className="faq-toggle-btn" onClick={expandAll}>
              Expand All
            </button>
            <button type="button" className="faq-toggle-btn" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <article key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <div className="faq-question-left">
                      <span className="faq-number-badge">{item.num}</span>
                      <div className="faq-question-text-wrapper">
                        <span className="faq-category-tag">{item.category}</span>
                        <h2 className="faq-question-title">{item.question}</h2>
                      </div>
                    </div>
                    <div className="faq-chevron-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${item.id}`}
                    className="faq-answer-collapse"
                    style={{
                      maxHeight: isOpen ? '400px' : '0px',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="faq-answer-content">
                      <div className="faq-answer-inner">
                        <p className="faq-answer-text">{item.answer}</p>
                        {item.actionLink && (
                          <a href={item.actionLink.href} className="faq-action-link">
                            {item.actionLink.label}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="faq-empty-state">
              <h3 className="faq-empty-title">No matching questions found</h3>
              <p className="faq-empty-desc">
                We couldn't find any questions matching "{searchQuery}". Please try another keyword or browse all questions.
              </p>
              <button
                type="button"
                className="faq-reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Show All FAQs
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions Contact Grid */}
        <section className="faq-contact-card">
          <span className="faq-contact-subtitle">Have Additional Inquiries?</span>
          <h2 className="faq-contact-title">We're Here to Help</h2>
          <p className="faq-contact-desc">
            Our jewellery specialists and franchise advisors are available to assist with custom orders,
            bridal consultations, and franchise partnership discussions.
          </p>

          <div className="faq-contact-grid">
            {/* Phone Support */}
            <a href="tel:+919784836060" className="faq-support-tile" aria-label="Call Zoniraz customer care">
              <div className="faq-tile-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="faq-tile-title">Direct Call</span>
              <span className="faq-tile-desc">+91 97848 36060</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919784836060?text=Hello%20Zoniraz%20Jewels%2C%20I%20have%20an%20enquiry%20regarding%20jewellery"
              target="_blank"
              rel="noopener noreferrer"
              className="faq-support-tile"
              aria-label="Chat on WhatsApp"
            >
              <div className="faq-tile-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <span className="faq-tile-title">WhatsApp Chat</span>
              <span className="faq-tile-desc">Instant Assistance</span>
            </a>

            {/* Email Support */}
            <a href="mailto:zonirazjewelhouse@gmail.com" className="faq-support-tile" aria-label="Email Zoniraz support">
              <div className="faq-tile-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="faq-tile-title">Email Us</span>
              <span className="faq-tile-desc">zonirazjewelhouse@gmail.com</span>
            </a>

            {/* Visit Alwar Showroom */}
            <a href="/zoniraz-alwar" className="faq-support-tile" aria-label="Visit Zoniraz Alwar showroom">
              <div className="faq-tile-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="faq-tile-title">Visit Showroom</span>
              <span className="faq-tile-desc">Tilak Market, Alwar</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
