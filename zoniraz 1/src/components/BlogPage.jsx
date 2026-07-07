import React, { useState } from 'react';

// Import images from assets to make it look premium
import silverEarringsImg from '../assets/silver-earrings.png';
import switchEarringsImg from '../assets/switch-earrings.png';
import dancingHoopsImg from '../assets/dancing-hoops.png';
import solitaireSetsImg from '../assets/solitaire-sets.png';
import goldNecklaceSilkImg from '../assets/gold-necklace-silk.png';
import layeredNecklacesImg from '../assets/layered-necklaces.png';
import caratlaneIconicsImg from '../assets/caratlane-iconics.png';
import infinityDiamondRingImg from '../assets/infinity_diamond_ring.png';
import meshClusterRingImg from '../assets/mesh_cluster_ring.png';

const blogArticles = [
  {
    id: 1,
    title: "Why Simple Gold Earrings Are the Must-Have Accessory of 2026",
    tags: ["Daily Wear", "Earrings", "Gold"],
    description: "In 2026, jewellery is speaking softer and smarter. Gold earrings lead this quiet revolution of wearable luxury.",
    date: "April 20, 2026",
    readTime: "4 min read",
    image: dancingHoopsImg
  },
  {
    id: 2,
    title: "From Dholna to Maang Tikka: Must-Have Bihari Bridal Jewellery",
    tags: ["Bridal", "Trending"],
    description: "In Bihar and Jharkhand, bridal adornment is nothing short of spectacular. Discover the traditions behind these unique pieces.",
    date: "March 28, 2026",
    readTime: "6 min read",
    image: goldNecklaceSilkImg
  },
  {
    id: 3,
    title: "Why Is Akshaya Tritiya the Most Auspicious Time to Buy Gold Jewellery?",
    tags: ["Festive", "Gold"],
    description: "At Zoniraz, we have always believed that certain days carry a special energy. Akshaya Tritiya is one of those rare occasions when tradition and beauty converge.",
    date: "May 5, 2026",
    readTime: "5 min read",
    image: switchEarringsImg
  },
  {
    id: 4,
    title: "Queen of the Aisle: Wedding jewels that make a statement",
    tags: ["Styling", "Bridal"],
    description: "Your wedding day is your time to shine like the queen you are, and while you may have spent months searching for the perfect bridal ensemble, the right jewellery can elevate your entire look.",
    date: "April 18, 2026",
    readTime: "8 min read",
    image: solitaireSetsImg
  },
  {
    id: 5,
    title: "The Ultimate Guide to Choosing a Diamond Engagement Ring",
    tags: ["Diamond", "Rings"],
    description: "Selecting the perfect diamond ring is a journey of emotion and precision. From the 4Cs to the setting style, every detail tells a story.",
    date: "April 12, 2026",
    readTime: "7 min read",
    image: infinityDiamondRingImg
  }
];

const categoryTags = [
  "All Blogs",
  "Gold",
  "Diamond",
  "Earrings",
  "Rings",
  "Trending",
  "Bridal",
  "Daily Wear",
  "Styling",
  "Editor's Picks"
];

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState("All Blogs");

  const filteredArticles = blogArticles.filter(article => {
    if (selectedTag === "All Blogs") return true;
    if (selectedTag === "Editor's Picks") return article.id === 4 || article.id === 1;
    return article.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
  });

  return (
    <div className="blog-page-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .blog-page-wrapper {
          background-color: #efe7e5;
          font-family: 'Montserrat', sans-serif;
          color: #2b221d;
          min-height: 100vh;
          padding: 40px 24px 80px 24px;
        }

        .blog-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Breadcrumb */
        .blog-breadcrumb {
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 30px;
          margin-top: 15px;
          font-weight: 500;
        }
        .blog-breadcrumb a {
          color: #8c7365;
          text-decoration: none;
          transition: color 0.3s;
        }
        .blog-breadcrumb a:hover {
          color: #c5a880;
        }

        /* Title / Hero Banner */
        .blog-hero {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #e1d8ea;
          position: relative;
          overflow: hidden;
        }

        .blog-hero-label {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #c5a880;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .blog-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight: 500;
          color: #2b221d;
          margin: 0 0 16px 0;
        }

        .blog-hero-subtitle {
          font-size: 14px;
          color: #746380;
          letter-spacing: 1px;
          margin: 0 auto;
          max-width: 600px;
          line-height: 1.6;
        }

        /* Tag Filters Bar */
        .blog-tags-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .blog-tag-btn {
          background-color: #ffffff;
          border: 1px solid #d4c5bd;
          color: #2b221d;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .blog-tag-btn:hover {
          border-color: #2b221d;
          background-color: #fcfbfa;
        }

        .blog-tag-btn.active {
          background-color: #2b221d;
          border-color: #2b221d;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(43, 34, 29, 0.25);
        }

        /* Grid Layout */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 30px;
        }

        @media (max-width: 480px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Blog Card Style */
        .blog-card {
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid #e1d8ea;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(99, 77, 64, 0.12);
        }

        .blog-card-img-wrapper {
          position: relative;
          padding-top: 60%; /* Aspect Ratio */
          overflow: hidden;
          background-color: #f7f1ef;
        }

        .blog-card-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .blog-card-img {
          transform: scale(1.06);
        }

        .blog-card-content {
          padding: 30px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .blog-card-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 11px;
          color: #8c7365;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .blog-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.4;
          color: #2b221d;
          margin: 0 0 12px 0;
          min-height: 56px;
        }

        .blog-card-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: #746380;
          margin: 0 0 24px 0;
          flex-grow: 1;
        }

        .blog-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f2ebe8;
          padding-top: 20px;
          margin-top: auto;
        }

        .blog-card-date-time {
          font-size: 11px;
          color: #a39084;
        }

        .blog-read-link {
          font-size: 12px;
          font-weight: 600;
          color: #c5a880;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.2s;
        }

        .blog-read-link:hover {
          color: #2b221d;
        }

        .empty-blogs {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px dashed #d4c5bd;
        }
        .empty-blogs h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #2b221d;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="blog-container">
        {/* Breadcrumb */}
        <div className="blog-breadcrumb">
          <a href="#">Home</a> &gt; <span style={{ color: '#2b221d', fontWeight: '600' }}>Zoniraz Journal</span>
        </div>

        {/* Hero Banner */}
        <div className="blog-hero">
          <div className="blog-hero-label">Zoniraz Journal</div>
          <h1 className="blog-hero-title">Wedding Statement Jewels</h1>
          <p className="blog-hero-subtitle">Crafted for your most precious moments</p>
        </div>

        {/* Categories Bar */}
        <div className="blog-tags-bar">
          {categoryTags.map(tag => (
            <button
              key={tag}
              className={`blog-tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredArticles.length === 0 ? (
          <div className="empty-blogs">
            <h3>No articles found</h3>
            <p>Try selecting another category to discover our stories.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredArticles.map(article => (
              <article key={article.id} className="blog-card">
                <div className="blog-card-img-wrapper">
                  <img src={article.image} alt={article.title} className="blog-card-img" />
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    {article.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="blog-card-tag">{tag}</span>
                    ))}
                  </div>
                  <h3 className="blog-card-title">{article.title}</h3>
                  <p className="blog-card-desc">{article.description}</p>
                  <div className="blog-card-footer">
                    <span className="blog-card-date-time">
                      {article.date} &bull; {article.readTime}
                    </span>
                    <a href="#blog" className="blog-read-link" onClick={(e) => { e.preventDefault(); alert("Story Reading Simulation: Full article coming soon!"); }}>
                      Read Story
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
