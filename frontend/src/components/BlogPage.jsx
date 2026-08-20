import React, { useState } from 'react';
import weddingBanner from '../assets/WEDDING BANNER.png';
import diamondRingImg from '../assets/infinity_diamond_ring.png';
import goldSavingImg from '../assets/solitaire-sets.png';
import pendantImg from '../assets/layered-necklaces.png';

const categories = ["All Blogs", "Gold", "Diamond", "Earrings", "Rings", "Trending", "Bridal", "Daily Wear", "Styling", "Editor's Picks"];

const blogPosts = [
  {
    id: 1,
    category: "GOLD \u00A0 DAILY WEAR",
    tags: ["Gold", "Daily Wear", "Earrings"],
    title: "10 Timeless Gold Earring Styles Every Woman Must Own in 2026",
    excerpt: "Gold earrings have always been the cornerstone of Indian jewellery. Whether it's a pair of delicate studs for the office or bold jhumkas for a festive evening, the right gold earrings can elevate any look. In 2026, wearable luxury is all about pieces that move with you — lightweight, hallmarked, and crafted to last a lifetime.",
    date: "July 28, 2026 \u2022 5 min read",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=800",
    slug: "timeless-gold-earring-styles-2026"
  },
  {
    id: 2,
    category: "DIAMOND \u00A0 RINGS",
    tags: ["Diamond", "Rings", "Trending"],
    title: "How to Choose the Perfect Diamond Engagement Ring: The Complete 2026 Guide",
    excerpt: "Choosing a diamond engagement ring is one of the most meaningful decisions you will ever make. From understanding the 4Cs — Cut, Clarity, Colour, and Carat — to picking the ideal setting style, every detail matters. At Zoniraz, our certified diamond jewellery is designed to tell your unique love story with unmatched brilliance and craftsmanship.",
    date: "July 20, 2026 \u2022 7 min read",
    image: diamondRingImg,
    slug: "diamond-engagement-ring-complete-guide-2026"
  },
  {
    id: 3,
    category: "BRIDAL \u00A0 STYLING",
    tags: ["Bridal", "Styling", "Gold"],
    title: "The Ultimate Bridal Jewellery Guide: From Maang Tikka to Bangles",
    excerpt: "Your wedding day deserves jewellery that tells a story. From the delicate shimmer of a maang tikka to the bold statement of stacked gold bangles, bridal jewellery is an art form. Discover how to build a complete bridal set that complements your lehenga, reflects your personality, and becomes a treasured heirloom for generations.",
    date: "July 10, 2026 \u2022 8 min read",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    slug: "ultimate-bridal-jewellery-guide"
  },
  {
    id: 4,
    category: "GOLD \u00A0 INVESTMENT",
    tags: ["Gold", "Trending", "Editor's Picks"],
    title: "Gold Saving Scheme: The Smartest Way to Invest in Gold Monthly",
    excerpt: "Buying gold all at once can be a heavy investment. That's why a smart gold saving scheme — where you invest a fixed amount every month — is the modern way to build your gold portfolio. Zoniraz's Gold Mine plan lets you accumulate gold systematically, benefiting from rupee-cost averaging and flexible redemption in jewellery.",
    date: "June 28, 2026 \u2022 6 min read",
    image: goldSavingImg,
    slug: "gold-saving-scheme-smartest-investment"
  },
  {
    id: 5,
    category: "GOLD \u00A0 EXCHANGE",
    tags: ["Gold", "Styling"],
    title: "Old Gold Exchange: How to Get the Best Value for Your Old Jewellery",
    excerpt: "Is your old gold gathering dust in a locker? Turn it into something beautiful. The old gold exchange process at Zoniraz is transparent, fair, and hassle-free. We evaluate your gold at current market rates using certified BIS standards, giving you full value to upgrade into our latest hallmarked collections — diamonds, necklaces, or custom rings.",
    date: "June 15, 2026 \u2022 5 min read",
    image: "https://images.unsplash.com/photo-1569397288884-4d43d6738fbd?auto=format&fit=crop&q=80&w=800",
    slug: "old-gold-exchange-best-value"
  },
  {
    id: 6,
    category: "STYLING \u00A0 PENDANTS",
    tags: ["Gold", "Styling", "Daily Wear"],
    title: "Gold Pendant Necklaces: The Art of Layering for Every Occasion",
    excerpt: "A gold pendant necklace is the most versatile piece in any jewellery wardrobe. Whether you layer delicate chains for a bohemian office look or wear a single bold diamond pendant to a wedding, the right necklace frames your face and completes your outfit. Explore Zoniraz's curated range of 18k and 22k gold pendants designed for everyday luxury.",
    date: "June 5, 2026 \u2022 4 min read",
    image: pendantImg,
    slug: "gold-pendant-necklace-layering-guide"
  }
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Blogs");
  const [posts, setPosts] = useState(blogPosts);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Ensure posts are sorted latest first
          const sorted = [...data.data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          setPosts(sorted);
        }
      } catch (err) {
        console.error("Failed to load dynamic blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const filteredPosts = activeCategory === "All Blogs" 
    ? posts 
    : posts.filter(post => {
        if (Array.isArray(post.tags)) {
          return post.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase());
        }
        if (post.category) {
          return post.category.toLowerCase().includes(activeCategory.toLowerCase());
        }
        return false;
      });

  return (

    <div className="blog-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .blog-page-wrapper {
          background-color: #F5EEE6;
          font-family: 'Montserrat', sans-serif;
          color: #2a221b;
          min-height: 100vh;
          padding: 120px 24px 80px 24px;
        }

        .blog-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Breadcrumb */
        .blog-breadcrumb {
          font-size: 11px;
          color: #6b6259;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 24px;
          font-weight: 600;
        }

        /* Hero Banner */
        .blog-hero {
          border-radius: 40px;
          padding: 80px 40px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(158, 98, 64, 0.15);
          position: relative;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 320px;
          overflow: hidden;
          background-color: #9e6240;
        }

        .blog-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }

        .blog-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(60, 30, 10, 0.45);
          z-index: 1;
          border-radius: 40px;
        }

        .blog-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .blog-hero-tag {
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          margin-bottom: 16px;
        }

        .blog-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          font-weight: 400;
          margin: 0 0 20px 0;
          line-height: 1.2;
        }

        .blog-hero-desc {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.95);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Filters */
        .blog-filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 48px;
        }

        .filter-btn {
          background-color: #ffffff;
          color: #5c544d;
          border: 1px solid #e2d8cf;
          border-radius: 30px;
          padding: 10px 24px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .filter-btn:hover {
          border-color: #c29867;
          color: #2b221d;
        }

        .filter-btn.active {
          background-color: #221c17;
          color: #ffffff;
          border-color: #221c17;
        }

        /* Blog Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
          .blog-hero-title {
            font-size: 36px;
          }
          .blog-hero {
            padding: 50px 20px;
            min-height: auto;
          }
        }

        /* Blog Card */
        .blog-card {
          background-color: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
        }

        .blog-card-img-wrapper {
          height: 240px;
          overflow: hidden;
          width: 100%;
        }

        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .blog-card-img {
          transform: scale(1.03);
        }

        .blog-card-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .blog-card-tag {
          font-size: 10px;
          font-weight: 700;
          color: #9e7a56;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .blog-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          line-height: 1.4;
          color: #2a221b;
          margin: 0 0 16px 0;
          font-weight: 500;
        }

        .blog-card-title a {
          color: #2a221b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .blog-card-title a:hover {
          color: #9e7a56;
        }

        .blog-card-excerpt {
          font-size: 13.5px;
          line-height: 1.7;
          color: #6e6359;
          margin-bottom: 32px;
          flex-grow: 1;
          font-weight: 400;
        }

        .blog-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f2eae1;
          padding-top: 20px;
          margin-top: auto;
        }

        .blog-card-date {
          font-size: 11px;
          color: #9e9286;
          font-weight: 500;
        }

        .blog-card-link {
          font-size: 11px;
          font-weight: 700;
          color: #9e7a56;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .blog-card-link:hover {
          color: #7d5f40;
        }

        /* Empty State */
        .blog-empty {
          text-align: center;
          padding: 60px 20px;
          background-color: #ffffff;
          border-radius: 28px;
          border: 1px solid #e2d8cf;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }
        .blog-empty p {
          color: #6e6359;
          font-size: 16px;
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      <div className="blog-container">
        {/* Breadcrumb */}
        <div className="blog-breadcrumb">
          HOME &nbsp;&gt;&nbsp; ZONIRAZ JOURNAL
        </div>

        {/* Hero Banner */}
        <div className="blog-hero">
          <img src={weddingBanner} alt="Wedding Banner" className="blog-hero-bg" />
        </div>

        {/* Filters */}
        <div className="blog-filters">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} className="blog-card">
              {/* Image Container */}
              <div className="blog-card-img-wrapper">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="blog-card-img"
                />
              </div>

              {/* Content */}
              <div className="blog-card-content">
                <div className="blog-card-tag">
                  {post.category}
                </div>
                
                <h2 className="blog-card-title">
                  <a href={`/blog/${post.slug}`}>
                    {post.title}
                  </a>
                </h2>
                
                <p className="blog-card-excerpt">
                  {post.excerpt}
                </p>
                
                <div className="blog-card-footer">
                  <span className="blog-card-date">
                    {post.date}
                  </span>
                  <a
                    href={`/blog/${post.slug}`}
                    className="blog-card-link"
                  >
                    READ STORY
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="blog-empty">
            <p>No articles found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
