const Product = require('../models/productModel');
const livePrice = require('../models/jewelleryPricingModel');

// Maps request-facing purity grade strings to their corresponding
// rate fields on the livePrice document.
const DIAMOND_RATE_FIELD_BY_GRADE = {
    "IJ-SI": "diamond_rate_ij_si",
    "GH-VS": "diamond_rate_gh_vs",
    "EF-VVS": "diamond_rate_ef_vvs",
    "FG-SI": "diamond_rate_fg_si",
    "1": "diamond_rate_ij_si",
    "2": "diamond_rate_gh_vs",
    "3": "diamond_rate_ef_vvs",
    "4": "diamond_rate_fg_si",
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
        // const weight_differenceINsize_g = 0.140;
        let real_gold_weight = 0;
        let real_diamond_weight = 0;
        let item_gold_price = 0;
        let item_diamond_price = 0;
        let item_base_price = 0;
        let item_base_price_withGST = 0;
        let item_making_charges = 0;
        let making_charges_amount = 0;

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
        let solitaire_price = product_data.solitaires_price || 0;
        if (rawDiamond === "IJ-SI" || rawDiamond === "1") {
            solitaire_price = product_data.solitaire_price_ij_si || product_data.solitaires_price || 0;
        } else if (rawDiamond === "GH-VS" || rawDiamond === "2") {
            solitaire_price = product_data.solitaire_price_gh_vs || product_data.solitaires_price || 0;
        } else if (rawDiamond === "EF-VVS" || rawDiamond === "3") {
            solitaire_price = product_data.solitaire_price_ef_vvs || product_data.solitaires_price || 0;
        } else if (rawDiamond === "FG-SI" || rawDiamond === "4") {
            solitaire_price = product_data.solitaire_price_fg_si || product_data.solitaires_price || 0;
        }
        const gemstone_price = product_data.gemstone_price || 0;

        // Resolve diamond rate based on purity grade, checking product manual rate first then live rate fallback
        const diamondRateField = DIAMOND_RATE_FIELD_BY_GRADE[rawDiamond];
        let diamond_rate = current_price.diamond_rate || 0;
        if (diamondRateField && product_data[diamondRateField] !== undefined && product_data[diamondRateField] > 0) {
            diamond_rate = product_data[diamondRateField];
        } else if (diamondRateField) {
            if (current_price[diamondRateField] !== undefined && current_price[diamondRateField] !== null) {
                diamond_rate = current_price[diamondRateField];
            } else {
                console.log(`Missing rate field "${diamondRateField}" on current_price doc, falling back to diamond_rate`);
            }
        } else if (rawDiamond) {
            console.log(`Unrecognized diamond purity grade: ${rawDiamond}, falling back to diamond_rate`);
        }

        if (product_data.product_type && product_data.product_type.toLowerCase() === "diamond") {
            const total_diamond_weight = (product_data.diamond_weight || 0);
            real_diamond_weight = total_diamond_weight;

            let gross_gold_weight = product_data.gold_weight;

            // Convert size from Aana to Inches
            // 1 Aana = 0.0625 Inch
            const sizeInInches = size * 0.0625;

            if (!isNaN(size)) {

                // -------------------------------
                // CHAIN CALCULATION
                // -------------------------------
                const catStr = (product_data.category || product_data.product_category || product_data.category_id || '').toLowerCase();

                // -------------------------------
                // CHAIN CALCULATION (Default 20")
                // -------------------------------
                if (
                    catStr === "chains" ||
                    catStr === "chain"
                ) {

                    // Database gold weight is for the base size stored in base_length
                    // Default base length = 20 inches if not stored
                    const baseLength = product_data.base_length || 20;

                    // Every 1 inch = 0.5 gram (500mg)
                    const weightPerInch = 0.5;

                    gross_gold_weight =
                        product_data.gold_weight +
                        ((sizeInInches - baseLength) * weightPerInch);
                }

                // ---------------------------------
                // MANGALSUTRA CALCULATION (Default 18")
                // ---------------------------------
                else if (
                    catStr === "mangalsutra" ||
                    catStr === "mangalsutras"
                ) {

                    // Database gold weight is for the base size stored in base_length
                    // Default base length = 18 inches if not stored
                    const baseLength = product_data.base_length || 18;

                    // Every 1 inch = 0.5 gram (500mg)
                    const weightPerInch = 0.5;

                    gross_gold_weight =
                        product_data.gold_weight +
                        ((sizeInInches - baseLength) * weightPerInch);
                }

                // ---------------------------------
                // TENNIS BRACELET CALCULATION (Default 20")
                // ---------------------------------
                else if (
                    catStr === "tennis bracelets" ||
                    catStr === "tennis bracelet" ||
                    catStr === "bracelets" ||
                    catStr === "bracelet"
                ) {

                    // Database weight belongs to 20 inch bracelet
                    const baseLength = product_data.base_length || 20;

                    // Calculate weight of 1 inch
                    const weightPerInch = product_data.gold_weight / baseLength;

                    // Final weight according to selected size
                    gross_gold_weight = weightPerInch * sizeInInches;
                }

                // ---------------------------------
                // NORMAL RINGS (OLD LOGIC)
                // ---------------------------------
                else {

                    const weight_differenceINsize_g = 0.140;

                    gross_gold_weight =
                        size === 12
                            ? product_data.gold_weight
                            : product_data.gold_weight +
                            (size - 12) * weight_differenceINsize_g;
                }
            }

            // Net Gold Weight = Gross Gold Weight - Diamond Weight (g) - Gemstone Weight (g)
            const diamond_weight_g = total_diamond_weight * 0.2;
            const gemstone_weight_g = (product_data.gemstone_weight || 0) * 0.2;
            const net_gold_weight = Math.max(0, gross_gold_weight - diamond_weight_g - gemstone_weight_g);
            real_gold_weight = net_gold_weight;

            // diamond rate calculation for custom (prioritize product manual rate, fallback to live rate)
            switch (rawDiamond) {
                case "IJ-SI":
                case "1":
                    diamond_rate = product_data.diamond_rate_ij_si || current_price.diamond_rate_ij_si || 0;
                    break;
                case "GH-VS":
                case "2":
                    diamond_rate = product_data.diamond_rate_gh_vs || current_price.diamond_rate_gh_vs || 0;
                    break;
                case "EF-VVS":
                case "3":
                    diamond_rate = product_data.diamond_rate_ef_vvs || current_price.diamond_rate_ef_vvs || 0;
                    break;
                case "FG-SI":
                case "4":
                    diamond_rate = product_data.diamond_rate_fg_si || current_price.diamond_rate_fg_si || 0;
                    break;
                default:
                    diamond_rate = product_data.diamond_rate_ij_si || current_price.diamond_rate_ij_si || current_price.diamond_rate || 0;
            }

            // 14k is the base weight reference; convert weight + rate for the selected karat
            switch (rawMetal) {
                case "9k": {
                    const gold_rate_9k = current_price.gold_rate_24k * 37 / 100;
                    const adjusted_weight = net_gold_weight - 21 / 100;
                    item_gold_price = adjusted_weight * gold_rate_9k;
                    real_gold_weight = adjusted_weight;
                    break;
                }
                case "18k": {
                    const gold_rate_18k = current_price.gold_rate_24k * 75 / 100;
                    const adjusted_weight = net_gold_weight + 16.5 / 100;
                    item_gold_price = adjusted_weight * gold_rate_18k;
                    real_gold_weight = adjusted_weight;
                    break;
                }
                case "22k": {
                    const gold_rate_22k = current_price.gold_rate_24k * 91.6 / 100;
                    const adjusted_weight = net_gold_weight + 33.1 / 100;
                    item_gold_price = adjusted_weight * gold_rate_22k;
                    real_gold_weight = adjusted_weight;
                    break;
                }
                case "24k": {
                    const gold_rate_24k = current_price.gold_rate_24k * 24 / 24;
                    const adjusted_weight = net_gold_weight + 41.5 / 100;
                    item_gold_price = adjusted_weight * gold_rate_24k;
                    real_gold_weight = adjusted_weight;
                    break;
                }
                default: {
                    // 14k fallback (also covers rawMetal === "14k")
                    const gold_rate_14k = Math.floor(current_price.gold_rate_24k * 58.5 / 100);
                    item_gold_price = Math.floor(net_gold_weight * gold_rate_14k);
                    real_gold_weight = net_gold_weight;
                }
            }

            item_diamond_price = total_diamond_weight * diamond_rate;

            // Making charges = Net Gold Weight * 24K Gold Rate * Making Percentage / 100
            const gold_cost_24k = net_gold_weight * current_price.gold_rate_24k;
            making_charges_amount = Math.round(gold_cost_24k * (product_data.making_charges || 0) / 100);

            const materials_cost = item_gold_price + item_diamond_price + solitaire_price + gemstone_price;
            item_base_price = materials_cost + making_charges_amount;
            item_base_price_withGST = Math.round(item_base_price + (item_base_price * gst_percent / 100));

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
            making_charges: making_charges_amount
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