const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: '/images/site/default-collection.jpg'
  },
  tags: {
    type: [String],
    default: []
  },
  priority: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Auto-handles createdAt and updatedAt
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
