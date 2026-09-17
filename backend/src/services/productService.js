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
  '8': 'Drop Earrings',
  '9': 'Diamond'
};

const genderMap = {
  '1': 'Male',
  '2': 'Female',
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

    if (productData.product_title) {
      productData.name = productData.product_title;
    }

    if (productData.product_slug) {
      productData.slug = productData.product_slug;
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

    if (productData.solitaire_weight !== undefined || productData.solitaires_weight !== undefined) {
      const weight = Number(productData.solitaire_weight || productData.solitaires_weight || 0);
      productData.solitaire_weight = weight;
      productData.solitaires_weight = weight;
    }

    if (!productData.create_date || !(productData.create_date instanceof Date) || isNaN(productData.create_date.getTime())) {
      if (typeof productData.create_date === 'string' && !isNaN(new Date(productData.create_date).getTime())) {
        productData.create_date = new Date(productData.create_date);
      } else {
        productData.create_date = new Date();
      }
    }
    productData.modify_date = new Date();

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

    if (updateData.product_title) {
      updateData.name = updateData.product_title;
    }

    if (updateData.product_slug) {
      updateData.slug = updateData.product_slug;
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

    if (updateData.solitaire_weight !== undefined || updateData.solitaires_weight !== undefined) {
      const weight = Number(updateData.solitaire_weight ?? updateData.solitaires_weight ?? 0);
      updateData.solitaire_weight = weight;
      updateData.solitaires_weight = weight;
    }

    // Do not allow client payload to corrupt or change create_date on existing items
    if ('create_date' in updateData) {
      delete updateData.create_date;
    }

    // Ensure existing product has a valid create_date
    if (!product.create_date || !(product.create_date instanceof Date) || isNaN(product.create_date.getTime())) {
      product.create_date = (product._id && typeof product._id.getTimestamp === 'function')
        ? product._id.getTimestamp()
        : new Date();
    }

    // Always refresh modify_date to current timestamp
    product.modify_date = new Date();
    delete updateData.modify_date;

    // Assign fields dynamically
    Object.keys(updateData).forEach(key => {
      // Exclude _id, __v, and timestamps
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        const val = updateData[key];
        // Defensive check: do not assign empty plain objects to fields that expect primitive or date types
        if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date) && Object.keys(val).length === 0) {
          if (!['custom_diamond_rates', 'custom_solitaire_prices', 'gallery'].includes(key)) {
            return;
          }
        }
        product[key] = val;
      }
    });

    return await product.save();
  }

  async deleteProduct(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Product ID must be provided.');
    }
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndDelete(id);
    }
    if (!product) {
      product = await Product.findOneAndDelete({ product_id: id });
    }
    if (!product) {
      throw new Error('Product not found in database.');
    }
    return product;
  }

  async deleteMultipleProducts(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('An array of product IDs must be provided.');
    }

    const objectIds = ids.filter(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
    
    const result = await Product.deleteMany({
      $or: [
        { _id: { $in: objectIds } },
        { product_id: { $in: ids } }
      ]
    });

    return result;
  }
}

module.exports = new ProductService();
