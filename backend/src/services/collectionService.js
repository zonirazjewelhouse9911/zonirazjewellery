const Collection = require('../models/collectionModel');
const Product = require('../models/productModel');
const cacheManager = require('../utils/cacheManager');

class CollectionService {
  async getAllCollections() {
    const cached = cacheManager.get('all_collections');
    if (cached) return cached;

    const collections = await Collection.find().sort({ priority: 1, name: 1 }).lean();
    // Only select minimal fields needed for collection tag matching instead of full heavy product docs
    const products = await Product.find().select('product_title description product_slug tags').lean();

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
        ...col,
        productCount: linkedProducts.length
      };
    });

    cacheManager.set('all_collections', collectionsWithStats, 180000); // 3 min cache
    return collectionsWithStats;
  }

  async getCollectionById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Collection ID must be provided.');
    }

    let collection = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(id).lean();
    }
    if (!collection) {
      collection = await Collection.findOne({ slug: id }).lean();
    }
    return collection;
  }

  async createCollection(collectionData) {
    if (!collectionData.name || !collectionData.slug) {
      throw new Error('Collection Name and Slug are required.');
    }

    const existing = await Collection.findOne({ slug: collectionData.slug }).lean();
    if (existing) {
      throw new Error('Collection Slug is already in use.');
    }

    const collection = new Collection(collectionData);
    const saved = await collection.save();
    cacheManager.del('all_collections');
    return saved;
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
      const existing = await Collection.findOne({ slug: updateData.slug }).lean();
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

    const saved = await collection.save();
    cacheManager.del('all_collections');
    return saved;
  }
}

module.exports = new CollectionService();
