const categoryService = require('../services/categoryService');

class CategoryController {
  getCategories = async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      console.error('Get Categories Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch categories list' });
    }
  }

  getCategoryById = async (req, res) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found in database' });
      }
      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      console.error('Get Single Category Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve category details' });
    }
  }

  createCategory = async (req, res) => {
    try {
      const category = await categoryService.createCategory(req.body);
      return res.status(201).json({
        success: true,
        message: 'Category successfully created',
        data: category
      });
    } catch (error) {
      console.error('Create Category Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to create category' });
    }
  }

  updateCategory = async (req, res) => {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Category successfully updated',
        data: category
      });
    } catch (error) {
      console.error('Update Category Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update category' });
    }
  }
}

module.exports = new CategoryController();
