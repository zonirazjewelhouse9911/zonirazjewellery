const Category = require('../models/categoryModel');

class CategoryService {
  async getAllCategories() {
    return await Category.find().sort({ name: 1 });
  }

  async getCategoryById(id) {
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
    return category;
  }

  async createCategory(categoryData) {
    if (!categoryData.name || !categoryData.slug) {
      throw new Error('Category Name and Slug are required.');
    }

    const existing = await Category.findOne({ slug: categoryData.slug });
    if (existing) {
      throw new Error('Category Slug is already in use.');
    }

    const category = new Category(categoryData);
    return await category.save();
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
      const existing = await Category.findOne({ slug: updateData.slug });
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

    return await category.save();
  }
}

module.exports = new CategoryService();
