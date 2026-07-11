const Product = require('../models/productModel');

exports.productPricing = async (req, res) => {
    console.log("productPricing API request query:", req.query);
    console.log("productPricing API request body:", req.body);

    const product_id = req.query.product_id || req.body.product_id;
    const rawSize = req.body.size || req.query.size || req.body.Ssize || req.query.Ssize;
    const size = Number(rawSize);

    console.log("Resolved product_id:", product_id);
    console.log("Resolved size:", size);

    try {
        const weight_differenceINsize_g = 0.140;
        let real_gold_weight = 0
        let real_diamond_weight = 0;


        const product_data = await Product.findById({ _id: product_id });
        if (!product_data) {
            return {
                success: false,
                message: "Product not found",
                data: null
            }
        }
        // console.log(product_data, "product_data");

        if (isNaN(size) || size === 12) {
            real_gold_weight = product_data.gold_weight;
            
        } else {
            // Proportional weight change based on distance from base size 12
            real_gold_weight = product_data.gold_weight + (size - 12) * weight_differenceINsize_g;
            
        }

        return {
            success: true,
            message: "product data",
            gold_weight: real_gold_weight

        }
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

