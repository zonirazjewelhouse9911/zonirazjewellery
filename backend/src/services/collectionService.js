const Collection = require('../models/collectionModel');
const Product = require('../models/productModel');

class CollectionService {
  async getAllCollections() {
    const collections = await Collection.find().sort({ priority: 1, name: 1 });
    const products = await Product.find();

    // Map through collections and dynamically calculate matching products based on tags/slug
    const collectionsWithStats = collections.map(col => {
      const colSlug = (col.slug || '').toLowerCase();
      const colTags = (col.tags || []).map(t => t.toLowerCase());

      const linkedProducts = products.filter(p => {
        const title = (p.product_title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const slug = (p.product_slug || '').toLowerCase();
        
        // Match if title, description, or slug contains the collection's slug, or any of the collection's tags
        const slugMatch = colSlug && (title.includes(colSlug) || desc.includes(colSlug) || slug.includes(colSlug));
        const tagMatch = colTags.some(tag => tag && (title.includes(tag) || desc.includes(tag) || slug.includes(tag)));
        
        return slugMatch || tagMatch;
      });

      return {
        ...col.toObject(),
        productCount: linkedProducts.length
      };
    });

    return collectionsWithStats;
  }

  async getCollectionById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Collection ID must be provided.');
    }

    let collection = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(id);
    }
    if (!collection) {
      collection = await Collection.findOne({ slug: id });
    }
    return collection;
  }

  async createCollection(collectionData) {
    if (!collectionData.name || !collectionData.slug) {
      throw new Error('Collection Name and Slug are required.');
    }

    const existing = await Collection.findOne({ slug: collectionData.slug });
    if (existing) {
      throw new Error('Collection Slug is already in use.');
    }

    const collection = new Collection(collectionData);
    return await collection.save();
  }

  async updateCollection(id, updateData) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Collection ID must be provided.');
    }

    let collection = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(id);
    }
    if (!collection) {
      collection = await Collection.findOne({ slug: id });
    }
    if (!collection) {
      throw new Error('Collection not found in database.');
    }

    // Check unique constraints for slug if it's being updated
    if (updateData.slug && updateData.slug !== collection.slug) {
      const existing = await Collection.findOne({ slug: updateData.slug });
      if (existing) {
        throw new Error('Target Collection Slug is already allocated to another item.');
      }
    }

    // Assign fields dynamically
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        collection[key] = updateData[key];
      }
    });

    return await collection.save();
  }
}

module.exports = new CollectionService();
