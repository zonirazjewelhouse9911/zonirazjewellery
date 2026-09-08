const Category = require('../models/categoryModel');
const cacheManager = require('../utils/cacheManager');

class CategoryService {
  async getAllCategories() {
    const cached = cacheManager.get('all_categories');
    if (cached) return cached;

    const categories = await Category.find().sort({ name: 1 }).lean();
    cacheManager.set('all_categories', categories, 180000); // 3 min cache
    return categories;
  }

  async getCategoryById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Category ID must be provided.');
    }

    let category = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id).lean();
    }
    if (!category) {
      category = await Category.findOne({ slug: id }).lean();
    }
    return category;
  }

  async createCategory(categoryData) {
    if (!categoryData.name || !categoryData.slug) {
      throw new Error('Category Name and Slug are required.');
    }

    const existing = await Category.findOne({ slug: categoryData.slug }).lean();
    if (existing) {
      throw new Error('Category Slug is already in use.');
    }

    const category = new Category(categoryData);
    const saved = await category.save();
    cacheManager.del('all_categories');
    cacheManager.del('navbar_data');
    return saved;
  }

  async updateCategory(id, updateData) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Category ID must be provided.');
    }

    let category = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({ slug: id });
    }
    if (!category) {
      throw new Error('Category not found in database.');
    }

    // Check unique constraints for slug if it's being updated
    if (updateData.slug && updateData.slug !== category.slug) {
      const existing = await Category.findOne({ slug: updateData.slug }).lean();
      if (existing) {
        throw new Error('Target Category Slug is already allocated to another item.');
      }
    }

    // Assign fields dynamically
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        category[key] = updateData[key];
      }
    });

    const saved = await category.save();
    cacheManager.del('all_categories');
    cacheManager.del('navbar_data');
    return saved;
  }

  async getCategoryProductCounts() {
    const Product = require('../models/productModel');
    const agg = await Product.aggregate([
      { $match: { category_id: { $exists: true, $ne: null } } },
      { $group: { _id: '$category_id', count: { $sum: 1 } } }
    ]);
    const counts = {};
    for (const item of agg) {
      if (item._id) counts[item._id] = item.count;
    }
    return counts;
  }
}

module.exports = new CategoryService();
