const product = require('../models/productModel');
const livePrice = require('../models/jewelleryPricingModel');

exports.productBasePricing = async (req, res) => {
    // let gold_weight = 0;
    // let gold_price = 0;
    // let total_diamond_weight = 0;
    // let diamond_price = 0;
    // let base_price = 0;
    // let base_price_withGST = 0;
    // let base_price_object = {}

    try {

        const current_price = await livePrice.findOne().sort({ createdAt: -1 });
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

            if (item.product_type && item.product_type.toLowerCase() === "diamond") {
                const total_diamond_weight = (item.diamond_weight || 0);
                const diamond_weight_g = total_diamond_weight * 0.2;
                const gemstone_weight_g = (item.gemstone_weight || 0) * 0.2;

                const raw_gold_weight = item.gold_weight || item.weight || 0;
                // Net Gold Weight = Gross Gold Weight - Diamond Weight (g) - Gemstone Weight (g)
                const net_gold_weight = Math.max(0, raw_gold_weight - diamond_weight_g - gemstone_weight_g);

                const gold_rate_14k = Math.floor(current_price.gold_rate_24k * 58.5 / 100);
                console.log(gold_rate_14k, "gold_rate_14k");

                item_gold_price = Math.floor(net_gold_weight * gold_rate_14k);
                item_diamond_price = total_diamond_weight * current_price.diamond_rate_ij_si;

                // Making charges = Net Gold Weight * 24K Gold Rate * Making Percentage / 100
                const gold_cost_24k = net_gold_weight * current_price.gold_rate_24k;
                const making_charges_amount = Math.round(gold_cost_24k * makingCharges / 100);

                const materials_cost = item_gold_price + item_diamond_price + solitaire_price + gemstone_price;
                item_base_price = materials_cost + making_charges_amount;
                item_base_price_withGST = item_base_price + (item_base_price * gst_percent / 100);

                return {
                    _id: item._id,
                    product_id: item.product_id,
                    product_title: item.product_title,
                    product_type: item.product_type,
                    gold_price: Math.round(item_gold_price),
                    diamond_price: Math.round(item_diamond_price),
                    making_charges: Math.round(making_charges_amount),
                    base_price_withGST: Math.round(item_base_price_withGST),
                    gold_weight: net_gold_weight
                };
            } else {
                const gold_rate_18kt = current_price.gold_rate_24k * 75 / 100;
                item_gold_price = gold_weight * gold_rate_18kt;

                // Making charges = Net Gold Weight * 24K Gold Rate * Making Percentage / 100
                const gold_cost_24k = gold_weight * current_price.gold_rate_24k;
                const making_charges_amount = Math.round(gold_cost_24k * makingCharges / 100);

                const materials_cost = item_gold_price;
                item_base_price = materials_cost + making_charges_amount;
                item_base_price_withGST = item_base_price + (item_base_price * gst_percent / 100);

                return {
                    _id: item._id,
                    product_id: item.product_id,
                    product_title: item.product_title,
                    product_type: item.product_type,
                    gold_price: Math.round(item_gold_price),
                    diamond_price: 0,
                    making_charges: Math.round(making_charges_amount),
                    base_price_withGST: Math.round(item_base_price_withGST),
                    gold_weight: gold_weight
                };
            }
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