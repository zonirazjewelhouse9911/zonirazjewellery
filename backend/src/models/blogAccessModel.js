const mongoose = require("mongoose");

const blogAccessSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    trim: true,
    default: ""
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "Blog Writer"
  },
  role: {
    type: String,
    default: "blog_writer"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const BlogAccess = mongoose.model("BlogAccess", blogAccessSchema);
module.exports = BlogAccess;
