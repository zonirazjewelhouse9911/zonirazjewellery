const mongoose = require('mongoose');
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

    let normalizedMetal = String(rawMetal || '').toLowerCase().trim();
    if (normalizedMetal.includes('18')) normalizedMetal = '18k';
    else if (normalizedMetal.includes('9')) normalizedMetal = '9k';
    else if (normalizedMetal.includes('22')) normalizedMetal = '22k';
    else if (normalizedMetal.includes('24')) normalizedMetal = '24k';
    else if (normalizedMetal.includes('14')) normalizedMetal = '14k';
    else normalizedMetal = '14k';

    let normalizedDiamond = String(rawDiamond || '').toUpperCase().trim();
    if (normalizedDiamond === '1') normalizedDiamond = 'IJ-SI';
    else if (normalizedDiamond === '2') normalizedDiamond = 'GH-VS';
    else if (normalizedDiamond === '3') normalizedDiamond = 'EF-VVS';
    else if (normalizedDiamond === '4') normalizedDiamond = 'FG-SI';

    console.log("Resolved product_id:", product_id);
    console.log("Resolved normalizedMetal:", normalizedMetal, "normalizedDiamond:", normalizedDiamond, "size:", size);

    try {
        let real_gold_weight = 0;
        let real_diamond_weight = 0;
        let item_gold_price = 0;
        let item_diamond_price = 0;
        let item_base_price = 0;
        let item_base_price_withGST = 0;
        let making_charges_amount = 0;
        let gst_amount = 0;

        let product_data = null;
        if (mongoose.Types.ObjectId.isValid(product_id)) {
            product_data = await Product.findById(product_id);
        }
        if (!product_data) {
            product_data = await Product.findOne({
                $or: [
                    { product_id: product_id },
                    { product_slug: product_id }
                ]
            });
        }
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

        const gst_percent = current_price.gst_percent || 3;
        const reqSolitaire = req.body.solitaire || req.body.solitaires_quality;
        let rawSolitaire = reqSolitaire || product_data.solitaires_quality || normalizedDiamond;
        if (typeof rawSolitaire === 'string' && rawSolitaire.includes(',')) {
            const parts = rawSolitaire.split(',').map(s => s.trim()).filter(s => s !== '0');
            rawSolitaire = parts.length > 0 ? parts[0] : '1';
        } else if (rawSolitaire === '0' || !rawSolitaire) {
            rawSolitaire = '1';
        }

        let solitaire_price = 0;
        if (rawSolitaire === "IJ-SI" || rawSolitaire === "1") {
            solitaire_price = product_data.solitaire_price_ij_si || product_data.solitaire_price_gh_vs || product_data.solitaire_price_ef_vvs || product_data.solitaire_price_fg_si || product_data.solitaires_price || 0;
        } else if (rawSolitaire === "GH-VS" || rawSolitaire === "2") {
            solitaire_price = product_data.solitaire_price_gh_vs || product_data.solitaire_price_ij_si || product_data.solitaire_price_ef_vvs || product_data.solitaire_price_fg_si || product_data.solitaires_price || 0;
        } else if (rawSolitaire === "EF-VVS" || rawSolitaire === "3") {
            solitaire_price = product_data.solitaire_price_ef_vvs || product_data.solitaire_price_ij_si || product_data.solitaire_price_gh_vs || product_data.solitaire_price_fg_si || product_data.solitaires_price || 0;
        } else if (rawSolitaire === "FG-SI" || rawSolitaire === "4") {
            solitaire_price = product_data.solitaire_price_fg_si || product_data.solitaire_price_ij_si || product_data.solitaire_price_gh_vs || product_data.solitaire_price_ef_vvs || product_data.solitaires_price || 0;
        } else {
            solitaire_price = product_data.solitaire_price_ij_si || product_data.solitaire_price_gh_vs || product_data.solitaire_price_ef_vvs || product_data.solitaire_price_fg_si || product_data.solitaires_price || 0;
        }
        const gemstone_price = product_data.gemstone_price || 0;

        // Resolve diamond rate based on purity grade
        const diamondRateField = DIAMOND_RATE_FIELD_BY_GRADE[normalizedDiamond];
        let diamond_rate = current_price.diamond_rate || 0;
        if (diamondRateField && product_data[diamondRateField] !== undefined && product_data[diamondRateField] > 0) {
            diamond_rate = product_data[diamondRateField];
        } else if (diamondRateField) {
            if (current_price[diamondRateField] !== undefined && current_price[diamondRateField] !== null) {
                diamond_rate = current_price[diamondRateField];
            }
        }

        const total_diamond_weight = (product_data.diamond_weight || 0);
        real_diamond_weight = total_diamond_weight;

        let base_gold_weight = product_data.gold_weight || product_data.gross_weight || product_data.weight || 0;
        let gross_gold_weight = base_gold_weight;

        // Convert size from Aana to Inches (1 Aana = 0.0625 Inch)
        const sizeInInches = size * 0.0625;

        if (!isNaN(size)) {
            const catStr = (product_data.category || product_data.product_category || product_data.category_id || '').toLowerCase();

            if (catStr === "chains" || catStr === "chain") {
                const baseLength = product_data.base_length || 20;
                const weightPerInch = 0.5;
                gross_gold_weight = base_gold_weight + ((sizeInInches - baseLength) * weightPerInch);
            } else if (catStr === "mangalsutra" || catStr === "mangalsutras") {
                const baseLength = product_data.base_length || 18;
                const weightPerInch = 0.5;
                gross_gold_weight = base_gold_weight + ((sizeInInches - baseLength) * weightPerInch);
            } else if (catStr === "tennis bracelets" || catStr === "tennis bracelet" || catStr === "bracelets" || catStr === "bracelet") {
                const baseLength = product_data.base_length || 20;
                const weightPerInch = base_gold_weight / baseLength;
                gross_gold_weight = weightPerInch * sizeInInches;
            } else {
                const weight_differenceINsize_g = 0.140;
                gross_gold_weight = size === 12 ? base_gold_weight : base_gold_weight + (size - 12) * weight_differenceINsize_g;
            }
        }

        // Karat purity density multiplier relative to 14K (base weight reference)
        let karat_weight_multiplier = 1.0;
        let gold_rate_used = 0;

        switch (normalizedMetal) {
            case "9k":
                karat_weight_multiplier = 37 / 58.5;
                gold_rate_used = current_price.gold_rate_24k * 0.37;
                break;
            case "18k":
                karat_weight_multiplier = 75 / 58.5;
                gold_rate_used = current_price.gold_rate_24k * 0.75;
                break;
            case "22k":
                karat_weight_multiplier = 91.6 / 58.5;
                gold_rate_used = current_price.gold_rate_24k * 0.916;
                break;
            case "24k":
                karat_weight_multiplier = 100 / 58.5;
                gold_rate_used = current_price.gold_rate_24k;
                break;
            default: // 14k
                karat_weight_multiplier = 1.0;
                gold_rate_used = Math.floor(current_price.gold_rate_24k * 0.585);
                break;
        }

        gross_gold_weight = gross_gold_weight * karat_weight_multiplier;

        // Net Gold Weight = Gross Gold Weight - Diamond Weight (g) - Solitaire Weight (g) - Gemstone Weight (g)
        const diamond_weight_g = total_diamond_weight * 0.2;
        const solitaire_weight_g = (product_data.solitaires_weight || product_data.solitaire_weight || 0) * 0.2;
        const gemstone_weight_g = (product_data.gemstone_weight || 0) * 0.2;
        const net_gold_weight = Math.max(0, gross_gold_weight - diamond_weight_g - solitaire_weight_g - gemstone_weight_g);
        real_gold_weight = net_gold_weight;

        // Diamond rate calculation
        switch (normalizedDiamond) {
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

        item_gold_price = net_gold_weight * gold_rate_used;
        item_diamond_price = total_diamond_weight * diamond_rate;

        // Making charges = Net Gold Weight * 24K Gold Rate * Making Percentage / 100
        const gold_cost_24k = net_gold_weight * current_price.gold_rate_24k;
        making_charges_amount = Math.round(gold_cost_24k * (product_data.making_charges || 0) / 100);

        const materials_cost = item_gold_price + item_diamond_price + solitaire_price + gemstone_price;
        item_base_price = materials_cost + making_charges_amount;
        gst_amount = Math.round(item_base_price * (gst_percent / 100));
        item_base_price_withGST = Math.round(item_base_price + gst_amount);

        return res.status(200).json({
            success: true,
            message: "product data",
            gross_weight: Number(gross_gold_weight.toFixed(3)),
            gold_weight: Number(net_gold_weight.toFixed(3)),
            net_gold_weight: Number(net_gold_weight.toFixed(3)),
            gold_price: Math.round(item_gold_price),
            gold_rate_used: Math.round(gold_rate_used),
            price: item_base_price_withGST,
            diamond_weight: real_diamond_weight,
            diamond_price: Math.round(item_diamond_price),
            diamond_rate_used: diamond_rate,
            diamond_grade: normalizedDiamond || null,
            solitaire_price: Math.round(solitaire_price),
            making_charges: making_charges_amount,
            gst_amount: gst_amount,
            gst_percent: gst_percent
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