const product = require('../models/productModel');
const livePrice = require('../models/jewelleryPricingModel');

exports.productBasePricing = async (req, res) => {
    let gold_weight = 0;
    let gold_price = 0;
    let total_diamond_weight = 0;
    let diamond_price = 0;
    let base_price = 0;
    let base_price_withGST = 0;
    let base_price_object = {}

    try {
        // const product_category = req.query.product_category;
        const current_price = await livePrice.findOne().sort({ createdAt: -1 });



        // console.log(current_price);
        const product_data = await product.find();
        if (!product_data) {
            return {
                success: false,
                message: "Product not found",
                data: null
            }
        }

        const calculated_products = product_data.map((item) => {
            console.log(item.product_type);
            let item_gold_price = 0;
            let item_diamond_price = 0;
            let item_base_price = 0;
            let item_base_price_withGST = 0;

            const makingCharges = item.making_charges || 0;
            const gst_percent = current_price.gst_percent || 3;
            const gold_weight = item.gold_weight || 0;
            const solitaire_price = item.solitaires_price || 0;
            const gemstone_price = item.gemstone_price || 0;

            if (item.product_type === "Diamond") {
                const total_diamond_weight = (item.diamond_weight || 0) * (item.diamond_count || 1);
                console.log(total_diamond_weight, "total_diamond_weight");

                // if (solitaire_price>0 || !gemstone_price > 0) {
                //     item_gold_price = gold_weight * current_price.gold_rate_24k;
                // } else {
                //     const gold_rate_14k = current_price.gold_rate_24k * 14 / 24;
                //     item_gold_price = gold_weight * gold_rate_14k;
                // }
                const gold_rate_14k = current_price.gold_rate_24k * 14 / 24;
                item_gold_price = gold_weight * gold_rate_14k;
                item_diamond_price = total_diamond_weight * current_price.diamond_rate;
                item_base_price = item_gold_price + item_diamond_price + makingCharges + solitaire_price + gemstone_price;
                item_base_price_withGST = item_base_price + (item_base_price * gst_percent / 100);
                console.log(item_base_price_withGST, "base_price_withGST");
            } else {
                const gold_rate_18kt = current_price.gold_rate_24k * 18 / 24;
                item_gold_price = gold_weight * gold_rate_18kt;
                item_base_price = item_gold_price + makingCharges;
                item_base_price_withGST = item_base_price + (item_base_price * gst_percent / 100);
                console.log(item_base_price_withGST, "base_price_withGST");
            }

            return {
                _id: item._id,
                product_id: item.product_id,
                product_title: item.product_title,
                product_type: item.product_type,
                gold_price: Math.round(item_gold_price),
                diamond_price: Math.round(item_diamond_price),
                base_price_withGST: Math.round(item_base_price_withGST),

            };
        });

        return {
            success: true,
            message: "Product base pricing",
            data: calculated_products,
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