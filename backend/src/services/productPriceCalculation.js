const Product = require('../models/productModel');
const livePrice = require('../models/jewelleryPricingModel');

// Maps request-facing purity grade strings to their corresponding
// rate fields on the livePrice document.
const DIAMOND_RATE_FIELD_BY_GRADE = {
    "IJ-SI": "diamond_rate_ij_si",
    "GH-SI": "diamond_rate_gh_si",
    "FG-SI": "diamond_rate_fg_si",
    "EF-VVS": "diamond_rate_ef_vvs",
};

exports.productPricing = async (req, res) => {
    console.log("productPricing API request query:", req.query);
    console.log("productPricing API request body:", req.body);

    const product_id = req.query.product_id || req.body.product_id;
    const rawSize = req.body.size || req.query.size || req.body.Ssize || req.query.Ssize;
    const rawMetal = req.body.metal || req.query.metal || req.body.Smetal || req.query.Smetal;
    const rawDiamond = req.body.diamond || req.query.diamond || req.body.Sdiamond || req.query.Sdiamond;
    const size = Number(rawSize);

    console.log("Resolved product_id:", product_id);
    console.log("Resolved size:", rawMetal);

    try {
        const weight_differenceINsize_g = 0.140;
        let real_gold_weight = 0;
        let real_diamond_weight = 0;
        let item_gold_price = 0;
        let item_diamond_price = 0;
        let item_base_price = 0;
        let item_base_price_withGST = 0;

        const product_data = await Product.findById(product_id);
        if (!product_data) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                data: null
            });
        }

        const current_price = await livePrice.findOne().sort({ createdAt: -1 });
        if (!current_price) {
            return res.status(404).json({
                success: false,
                message: "No live pricing data available",
                data: null
            });
        }

        const makingCharges = product_data.making_charges || 0;
        const gst_percent = current_price.gst_percent || 3;
        const solitaire_price = product_data.solitaires_price || 0;
        const gemstone_price = product_data.gemstone_price || 0;

        // Resolve diamond rate based on purity grade, falling back to the
        // generic diamond_rate if the grade is missing/unrecognized.
        const diamondRateField = DIAMOND_RATE_FIELD_BY_GRADE[rawDiamond];
        let diamond_rate = current_price.diamond_rate || 0;
        if (diamondRateField) {
            if (current_price[diamondRateField] !== undefined && current_price[diamondRateField] !== null) {
                diamond_rate = current_price[diamondRateField];
            } else {
                console.log(`Missing rate field "${diamondRateField}" on current_price doc, falling back to diamond_rate`);
            }
        } else if (rawDiamond) {
            console.log(`Unrecognized diamond purity grade: ${rawDiamond}, falling back to diamond_rate`);
        }

        if (product_data.product_type && product_data.product_type.toLowerCase() === "diamond") {
            const total_diamond_weight = (product_data.diamond_weight || 0) * (product_data.diamond_count || 1);
            real_diamond_weight = total_diamond_weight;

            if (product_data.product_category === "Rings") {
                // Base weight at reference size 12, adjusted proportionally
                real_gold_weight = (isNaN(size) || size === 12)
                    ? product_data.gold_weight
                    : product_data.gold_weight + (size - 12) * weight_differenceINsize_g;

                // 14k is the base weight reference; convert weight + rate for the selected karat
                switch (rawMetal) {
                    case "9k": {
                        const gold_rate_9k = current_price.gold_rate_24k * 9 / 24;
                        const adjusted_weight = real_gold_weight * 9 / 14;
                        item_gold_price = adjusted_weight * gold_rate_9k;
                        real_gold_weight = adjusted_weight;
                        break;
                    }
                    case "18k": {
                        const gold_rate_18k = current_price.gold_rate_24k * 18 / 24;
                        const adjusted_weight = real_gold_weight * 18 / 14;
                        item_gold_price = adjusted_weight * gold_rate_18k;
                        real_gold_weight = adjusted_weight;
                        break;
                    }
                    case "22k": {
                        const gold_rate_22k = current_price.gold_rate_24k * 22 / 24;
                        const adjusted_weight = real_gold_weight * 22 / 14;
                        item_gold_price = adjusted_weight * gold_rate_22k;
                        real_gold_weight = adjusted_weight;
                        break;
                    }
                    case "24k": {
                        const gold_rate_24k = current_price.gold_rate_24k * 24 / 24;
                        const adjusted_weight = real_gold_weight * 24 / 14;
                        item_gold_price = adjusted_weight * gold_rate_24k;
                        real_gold_weight = adjusted_weight;
                        break;
                    }
                    default: {
                        // 14k fallback (also covers rawMetal === "14k")
                        const gold_rate_14k = current_price.gold_rate_24k * 14 / 24;
                        item_gold_price = real_gold_weight * gold_rate_14k;
                    }
                }
            } else {
                // TODO: handle gold weight/pricing for non-Ring diamond categories
                console.log(`No gold pricing branch defined for category: ${product_data.product_category}`);
            }

            item_diamond_price = total_diamond_weight * diamond_rate;
            item_base_price = item_gold_price + item_diamond_price + makingCharges + solitaire_price + gemstone_price;
            item_base_price_withGST = Math.round(item_base_price + (item_base_price * gst_percent / 100));
            console.log(item_base_price_withGST, "base_price_withGST");

        } else {
            console.log(`No pricing branch defined for product_type: ${product_data.product_type}`);
            return res.status(400).json({
                success: false,
                message: `Pricing not implemented for product_type: ${product_data.product_type}`,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "product data",
            gold_weight: real_gold_weight,
            price: item_base_price_withGST,
            diamond_weight: real_diamond_weight,
            diamond_rate_used: diamond_rate,
            diamond_grade: rawDiamond || null,
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};