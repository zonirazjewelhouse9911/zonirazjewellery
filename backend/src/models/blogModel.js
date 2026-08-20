const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    default: "GOLD DAILY WEAR",
    trim: true
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  excerpt: {
    type: String,
    default: ""
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  image: {
    type: String,
    default: ""
  },
  date: {
    type: String,
    default: ""
  },
  readTime: {
    type: String,
    default: "5 min read"
  },
  author: {
    type: String,
    default: "Zoniraz Team"
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
