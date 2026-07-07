const Product = require('../../models/productModel');

exports.getSimilarProducts = async (productId, limit = 4) => {
    try {
        if (!productId) {
            return {
                success: false,
                message: "Product ID must be provided."
            };
        }

        // Find target product
        let targetProduct = null;
        if (productId.match(/^[0-9a-fA-F]{24}$/)) {
            targetProduct = await Product.findById(productId);
        }
        if (!targetProduct) {
            targetProduct = await Product.findOne({ product_id: productId });
        }
        if (!targetProduct) {
            targetProduct = await Product.findOne({ product_slug: productId });
        }
        if (!targetProduct) {
            targetProduct = await Product.findOne({ slug: productId });
        }

        if (!targetProduct) {
            return {
                success: false,
                message: "Target product not found."
            };
        }

        // Query similar products in the same category or subcategory, excluding the product itself
        const categoryMatch = targetProduct.category_id || targetProduct.category;
        const subcategoryMatch = targetProduct.subcategory_id;

        const matchQuery = {
            _id: { $ne: targetProduct._id },
            $or: []
        };

        if (categoryMatch) {
            matchQuery.$or.push({ category_id: categoryMatch });
            matchQuery.$or.push({ category: categoryMatch });
        }
        if (targetProduct.product_category) {
            matchQuery.$or.push({ product_category: targetProduct.product_category });
        }
        if (subcategoryMatch) {
            matchQuery.$or.push({ subcategory_id: subcategoryMatch });
        }
        if (targetProduct.product_subcategory) {
            matchQuery.$or.push({ product_subcategory: targetProduct.product_subcategory });
        }

        // Fallback similarity match
        if (matchQuery.$or.length === 0) {
            matchQuery.$or.push({ product_type: targetProduct.product_type });
        }

        const data = await Product.find(matchQuery).limit(Number(limit) || 4);

        return {
            success: true,
            data: data,
            message: "Similar products retrieved successfully"
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Something went wrong",
            error: error.message
        };
    }
};
