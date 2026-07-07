const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

const categoryMap = {
  '1': 'Rings',
  '2': 'Earrings',
  '3': 'Necklaces',
  '4': 'Bracelets',
  '5': 'Bangles',
  '6': 'Pendants',
  '7': 'Chains'
};

const subcategoryMap = {
  '1': 'Engagement Rings',
  '2': 'Solitaire Rings',
  '3': 'Casual Rings',
  '4': 'Cocktail Rings',
  '5': 'Band Rings',
  '6': 'Stud Earrings',
  '7': 'Hoop Earrings',
  '8': 'Drop Earrings'
};

const genderMap = {
  '1': 'Men',
  '2': 'Women',
  '3': 'Unisex',
  '4': 'Kids'
};

const metalMap = {
  '1': 'White Gold',
  '2': 'Yellow Gold',
  '3': 'Rose Gold',
  '4': 'Platinum',
  '5': 'Silver'
};

async function getCategoryName(categoryId) {
  if (!categoryId) return null;
  
  if (categoryMap[categoryId]) {
    return categoryMap[categoryId];
  }
  
  try {
    let category = null;
    if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(categoryId);
    }
    if (!category) {
      category = await Category.findOne({ slug: categoryId });
    }
    if (category) {
      return category.name;
    }
  } catch (err) {
    console.error("Error looking up category name:", err);
  }
  
  return categoryId;
}

function getSubcategoryName(subcategoryId) {
  if (!subcategoryId) return null;
  return subcategoryMap[subcategoryId] || subcategoryId;
}

function getGenderName(genderId) {
  if (!genderId) return null;
  return genderMap[genderId] || genderId;
}

function getMetalTypeName(metalType) {
  if (!metalType) return null;
  return metalType
    .split(',')
    .map(id => id.trim())
    .map(id => metalMap[id] || id)
    .join(', ');
}

class ProductService {
  async getAllProducts() {
    return await Product.find().sort({ create_date: -1 }).lean();
  }

  async getProductById(id) {
    if (!id || typeof id !== 'string') {
      return null;
    }

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ product_id: id }).lean();
    }
    return product;
  }

  async createProduct(productData) {
    if (!productData.product_id) {
      throw new Error('Product ID is required.');
    }

    const existing = await Product.findOne({ product_id: productData.product_id });
    if (existing) {
      throw new Error('Product ID is already in use.');
    }

    if (productData.category_id) {
      productData.product_category = await getCategoryName(productData.category_id);
    }

    if (productData.subcategory_id) {
      productData.product_subcategory = getSubcategoryName(productData.subcategory_id);
    }

    if (productData.gender) {
      productData.gender = getGenderName(productData.gender);
    }

    if (productData.metal_type) {
      productData.metal_type = getMetalTypeName(productData.metal_type);
    }

    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(id, updateData) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Product ID must be provided.');
    }

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ product_id: id });
    }
    if (!product) {
      throw new Error('Product not found in database.');
    }

    // Check unique constraints for product_id if it's being updated
    if (updateData.product_id && updateData.product_id !== product.product_id) {
      const existing = await Product.findOne({ product_id: updateData.product_id });
      if (existing) {
        throw new Error('Target Product ID is already allocated to another item.');
      }
    }

    if (updateData.category_id) {
      updateData.product_category = await getCategoryName(updateData.category_id);
    }

    if (updateData.subcategory_id) {
      updateData.product_subcategory = getSubcategoryName(updateData.subcategory_id);
    }

    if (updateData.gender) {
      updateData.gender = getGenderName(updateData.gender);
    }

    if (updateData.metal_type) {
      updateData.metal_type = getMetalTypeName(updateData.metal_type);
    }

    // Assign fields dynamically
    Object.keys(updateData).forEach(key => {
      // Exclude _id updates
      if (key !== '_id' && key !== '__v') {
        product[key] = updateData[key];
      }
    });

    return await product.save();
  }
}

module.exports = new ProductService();
