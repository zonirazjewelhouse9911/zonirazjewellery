const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const JewelleryPricing = require("../models/jewelleryPricingModel");
const cacheManager = require("../utils/cacheManager");

// Category map to resolve short string IDs to standard category names
const categoryMap = {
  "1": "Rings",
  "2": "Earrings",
  "3": "Necklaces",
  "4": "Bracelets",
  "5": "Bangles",
  "6": "Pendants",
  "7": "Chains"
};

const isPlainGoldProduct = (product) => {
  if (!product) return false;
  const pType = String(product.product_type || '').toLowerCase().trim();
  const cType = String(product.custom_type || '').toLowerCase().trim();
  return (
    pType === 'gold' ||
    pType === 'plain gold' ||
    pType === 'plain gold jewelry' ||
    pType === 'plain gold jewellery' ||
    pType === 'plan gold jewelry' ||
    pType === 'plan gold jewellery' ||
    pType === 'plain_gold' ||
    pType === 'plain-gold' ||
    pType.includes('plain gold') ||
    pType.includes('plan gold') ||
    cType === 'gold' ||
    cType.includes('plain gold') ||
    cType.includes('plan gold')
  );
};

class JewelleryPricingService {
  /**
   * Fetches the latest daily rates from the database.
   */
  async getLatestRates() {
    const cached = await cacheManager.get("jewellery_rates");
    if (cached) return cached;

    let rates = await JewelleryPricing.findOne().sort({ updatedAt: -1 }).lean();
    if (!rates) {
      const defaultRates = {
        gold_rate_24k: 0,
        gold_rate_14k: 0,
        diamond_rate: 0,
        diamond_rate_ij_si: 0,
        diamond_rate_gh_vs: 0,
        diamond_rate_ef_vvs: 0,
        diamond_rate_fg_si: 0,
        custom_diamond_rates: {},
        gemstone_rate: 0,
        gst_percent: 3
      };
      await cacheManager.set("jewellery_rates", defaultRates, 180000);
      return defaultRates;
    }
    const ratesObj = rates;
    const g24 = ratesObj.gold_rate_24k || 0;
    const g14 = ratesObj.gold_rate_14k || 0;
    ratesObj.gold_rate_24k = g24 > 0 ? g24 : Math.round(g14 * 24 / 14);
    ratesObj.gold_rate_14k = g14 > 0 ? g14 : Math.round(g24 * 14 / 24);
    ratesObj.custom_diamond_rates = ratesObj.custom_diamond_rates || {};

    await cacheManager.set("jewellery_rates", ratesObj, 180000);
    return ratesObj;
  }

  /**
   * Updates or creates the daily jewellery rates.
   */
  async updateRates(rateData) {
    let rates = await JewelleryPricing.findOne().sort({ updatedAt: -1 });
    const gold_rate_24k = Number(rateData.gold_rate_24k) || 0;
    const gold_rate_14k = Math.round(gold_rate_24k * 58.5 / 100);
    const diamond_rate_ij_si = Number(rateData.diamond_rate_ij_si) || 0;
    const diamond_rate_gh_vs = Number(rateData.diamond_rate_gh_vs) || 0;
    const diamond_rate_ef_vvs = Number(rateData.diamond_rate_ef_vvs) || 0;
    const diamond_rate_fg_si = Number(rateData.diamond_rate_fg_si) || 0;
    const diamond_rate = Number(rateData.diamond_rate) || diamond_rate_ij_si || diamond_rate_gh_vs || diamond_rate_ef_vvs || diamond_rate_fg_si || 0;

    let customDiamondRates = {};
    if (rateData.custom_diamond_rates) {
      if (typeof rateData.custom_diamond_rates === 'string') {
        try {
          customDiamondRates = JSON.parse(rateData.custom_diamond_rates);
        } catch (e) {
          console.error("Failed to parse custom_diamond_rates string in updateRates", e);
        }
      } else if (typeof rateData.custom_diamond_rates === 'object') {
        customDiamondRates = rateData.custom_diamond_rates;
      }
    }

    if (rates) {
      rates.gold_rate_24k = gold_rate_24k;
      rates.gold_rate_14k = gold_rate_14k;
      rates.diamond_rate = diamond_rate;
      rates.diamond_rate_ij_si = diamond_rate_ij_si || diamond_rate;
      rates.diamond_rate_gh_vs = diamond_rate_gh_vs || diamond_rate;
      rates.diamond_rate_ef_vvs = diamond_rate_ef_vvs || diamond_rate;
      rates.diamond_rate_fg_si = diamond_rate_fg_si || diamond_rate;
      rates.custom_diamond_rates = customDiamondRates;
      rates.gemstone_rate = Number(rateData.gemstone_rate) || 0;
      rates.gst_percent = (rateData.gst_percent !== undefined && !isNaN(Number(rateData.gst_percent))) ? Number(rateData.gst_percent) : (rates.gst_percent || 3);
      await rates.save();
    } else {
      rates = new JewelleryPricing({
        gold_rate_24k,
        gold_rate_14k,
        diamond_rate,
        diamond_rate_ij_si: diamond_rate_ij_si || diamond_rate,
        diamond_rate_gh_vs: diamond_rate_gh_vs || diamond_rate,
        diamond_rate_ef_vvs: diamond_rate_ef_vvs || diamond_rate,
        diamond_rate_fg_si: diamond_rate_fg_si || diamond_rate,
        custom_diamond_rates: customDiamondRates,
        gemstone_rate: Number(rateData.gemstone_rate) || 0,
        gst_percent: (rateData.gst_percent !== undefined && !isNaN(Number(rateData.gst_percent))) ? Number(rateData.gst_percent) : 3
      });
      await rates.save();
    }
    await Promise.all([
      cacheManager.del("jewellery_rates"),
      cacheManager.del("product_base_pricing_all"),
      cacheManager.del("admin_products_all"),
      cacheManager.del("user_products_all")
    ]);
    return rates;
  }

  /**
   * Recalculates prices of all products in the database using current rates.
   * Optimized to avoid N+1 queries by pre-fetching categories and using bulkWrite.
   */
  async recalculateAllProducts() {
    const [rates, products, allCategories] = await Promise.all([
      this.getLatestRates(),
      Product.find().lean(),
      Category.find().lean()
    ]);

    // Build fast in-memory category lookup maps (avoids N queries in loop)
    const categoryMapById = new Map();
    const categoryMapByName = new Map();
    for (const cat of allCategories) {
      if (cat._id) categoryMapById.set(cat._id.toString(), cat);
      if (cat.name) categoryMapByName.set(cat.name.toLowerCase().trim(), cat);
      if (cat.slug) categoryMapByName.set(cat.slug.toLowerCase().trim(), cat);
    }

    const updatedProducts = [];
    const bulkOps = [];

    for (const product of products) {
      const isPlainGold = isPlainGoldProduct(product);
      const raw_gold_weight = product.gold_weight || product.gross_weight || product.weight || 0;
      let makingChargesPercent = product.making_charges || product.makingCharges || 0;
      const gst_percent = rates.gst_percent ?? 3;

      let rawSolitaire = product.solitaires_quality ? String(product.solitaires_quality) : '1';
      if (rawSolitaire.includes(',')) {
        const parts = rawSolitaire.split(',').map(s => s.trim()).filter(s => s !== '0');
        rawSolitaire = parts.length > 0 ? parts[0] : '1';
      } else if (rawSolitaire === '0' || !rawSolitaire) {
        rawSolitaire = '1';
      }

      let solitaire_price = 0;
      if (rawSolitaire === "IJ-SI" || rawSolitaire === "1") {
        solitaire_price = product.solitaire_price_ij_si || product.solitaire_price_gh_vs || product.solitaire_price_ef_vvs || product.solitaire_price_fg_si || product.solitaires_price || 0;
      } else if (rawSolitaire === "GH-VS" || rawSolitaire === "2") {
        solitaire_price = product.solitaire_price_gh_vs || product.solitaire_price_ij_si || product.solitaire_price_ef_vvs || product.solitaire_price_fg_si || product.solitaires_price || 0;
      } else if (rawSolitaire === "EF-VVS" || rawSolitaire === "3") {
        solitaire_price = product.solitaire_price_ef_vvs || product.solitaire_price_ij_si || product.solitaire_price_gh_vs || product.solitaire_price_fg_si || product.solitaires_price || 0;
      } else if (rawSolitaire === "FG-SI" || rawSolitaire === "4") {
        solitaire_price = product.solitaire_price_fg_si || product.solitaire_price_ij_si || product.solitaire_price_gh_vs || product.solitaire_price_ef_vvs || product.solitaires_price || 0;
      } else {
        solitaire_price = product.solitaire_price_ij_si || product.solitaire_price_gh_vs || product.solitaire_price_ef_vvs || product.solitaire_price_fg_si || product.solitaires_price || 0;
      }
      const gemstone_price = product.gemstone_price || 0;

      const pType = String(product.product_type || '').toLowerCase();
      const isSilverOrPlatinum = pType === 'silver' || pType === 'platinum';

      let finalPrice = 0;
      if (isSilverOrPlatinum) {
        const baseProductPrice = Number(product.price || product.basePrice || 0);
        const makingCharges = baseProductPrice * (makingChargesPercent / 100);
        const subtotal = baseProductPrice + gemstone_price + solitaire_price + makingCharges;
        finalPrice = Math.round(subtotal + subtotal * (gst_percent / 100));
      } else if (!isPlainGold && (pType === 'diamond' || (!pType && (Number(product.diamond_weight || 0) > 0 || product.diamond_quality)))) {
        const total_diamond_weight = product.diamond_weight || 0;
        const diamond_weight_g = total_diamond_weight * 0.2;
        const gemstone_weight_g = (product.gemstone_weight || 0) * 0.2;
        const solitaire_weight_g = (product.solitaires_weight || product.solitaire_weight || 0) * 0.2;
        const net_gold_weight = Math.max(0, raw_gold_weight - diamond_weight_g - solitaire_weight_g - gemstone_weight_g);

        const gold_rate_14k = Math.floor(rates.gold_rate_24k * 58.5 / 100);
        const item_gold_price = Math.floor(net_gold_weight * gold_rate_14k);

        const item_diamond_rate = rates.diamond_rate_ij_si || rates.diamond_rate || product.diamond_rate_ij_si || 0;
        const item_diamond_price = total_diamond_weight * item_diamond_rate;

        const gold_cost_24k = net_gold_weight * rates.gold_rate_24k;
        const making_charges_amount = Math.round(gold_cost_24k * makingChargesPercent / 100);

        const materials_cost = item_gold_price + item_diamond_price + solitaire_price + gemstone_price;
        const item_base_price = materials_cost + making_charges_amount;
        const gst_amount = Math.round(item_base_price * (gst_percent / 100));
        finalPrice = Math.round(item_base_price + gst_amount);
      } else {
        const gold_rate_22kt = Math.floor(rates.gold_rate_24k * 91.6 / 100);
        const effectiveGoldWeight = raw_gold_weight;
        const item_gold_price = Math.floor(effectiveGoldWeight * gold_rate_22kt);

        const gold_cost_24k = effectiveGoldWeight * rates.gold_rate_24k;
        const making_charges_amount = Math.round(gold_cost_24k * makingChargesPercent / 100);

        const materials_cost = item_gold_price + solitaire_price + gemstone_price;
        const item_base_price = materials_cost + making_charges_amount;
        const gst_amount = Math.round(item_base_price * (gst_percent / 100));
        finalPrice = Math.round(item_base_price + gst_amount);
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { price: finalPrice, basePrice: finalPrice } }
        }
      });

      updatedProducts.push({
        id: product._id,
        title: product.product_title || product.name,
        price: finalPrice
      });
    }

    // Execute all updates in a single batch write instead of N individual saves
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    return updatedProducts;
  }

  /**
   * Calculates price dynamically for a product based on selected configuration.
   */
  async calculateDynamicPrice({ product_id, size, metal, diamond }) {
    const rates = await this.getLatestRates();
    const product = await Product.findById(product_id).lean();
    if (!product) {
      throw new Error("Product not found");
    }

    const isPlainGold = isPlainGoldProduct(product);

    // Fallback if daily rates are not configured (both are 0)
    if (rates.gold_rate_14k === 0 && rates.diamond_rate === 0) {
      return {
        price: product.price || 0,
        goldWeight: product.gold_weight || 0,
        goldCost: Math.round((product.price || 0) * (isPlainGold ? 1.0 : 0.65)),
        diamondCost: isPlainGold ? 0 : Math.round((product.price || 0) * 0.25),
        gemstoneCost: 0,
        makingCharges: product.makingCharges || 0,
        subtotal: product.price || 0,
        gst: 0,
        ratesUsed: rates
      };
    }

    // 1. Gold Purity Factor
    // For Plain Gold Jewelry: base gold weight is defined at 22K (91.6% purity).
    // For Diamond Jewelry: base gold weight is defined at 14K (58.5% purity).
    let purityFactor = 1.0;
    if (isPlainGold) {
      if (metal) {
        if (metal.includes("24 KT") || metal.includes("24K")) {
          purityFactor = 24 / 22;
        } else if (metal.includes("22 KT") || metal.includes("22K")) {
          purityFactor = 1.0;
        } else if (metal.includes("18 KT") || metal.includes("18K")) {
          purityFactor = 18 / 22;
        } else if (metal.includes("14 KT") || metal.includes("14K")) {
          purityFactor = 14 / 22;
        } else if (metal.includes("9 KT") || metal.includes("9K")) {
          purityFactor = 9 / 22;
        }
      }
    } else {
      if (metal) {
        if (metal.includes("18 KT") || metal.includes("18K")) {
          purityFactor = 18 / 14;
        } else if (metal.includes("22 KT") || metal.includes("22K")) {
          purityFactor = 22 / 14;
        } else if (metal.includes("24 KT") || metal.includes("24K")) {
          purityFactor = 24 / 14;
        } else if (metal.includes("9 KT") || metal.includes("9K")) {
          purityFactor = 9 / 14;
        } else if (metal.toLowerCase().includes("platinum")) {
          purityFactor = 1.8; // Platinum multiplier
        } else if (metal.toLowerCase().includes("silver")) {
          purityFactor = 0.1; // Silver factor
        }
      }
    }

    // 2. Gold weight adjustment by size (ring size)
    // Base size is 12. Size increment weight is 0.14g.
    const selectedSize = Number(size);
    let goldWeight = product.gold_weight || 0;
    if (!isNaN(selectedSize) && selectedSize > 0) {
      // Linear formula relative to base size 12
      goldWeight = goldWeight + (selectedSize - 12) * 0.14;
    }
    // Prevent negative weight
    if (goldWeight < 0) goldWeight = 0;

    // 3. Gold Component Cost
    const baseGoldRate = isPlainGold ? Math.floor(rates.gold_rate_24k * 0.916) : rates.gold_rate_14k;
    const goldCost = goldWeight * baseGoldRate * purityFactor;

    // 4. Diamond Purity / Quality Factor
    let diamondQualityFactor = 1.0; // base is FG-SI
    if (diamond) {
      const q = diamond.toUpperCase();
      if (q.includes("VVS") || q.includes("EF-VS") || q.includes("VVS-EF")) {
        diamondQualityFactor = 1.35;
      } else if (q.includes("VS-GH") || q.includes("GH-VS") || q.includes("VS")) {
        diamondQualityFactor = 1.18;
      } else if (q.includes("GH-SI") || q.includes("SI-GH")) {
        diamondQualityFactor = 1.08;
      } else if (q.includes("IJ-SI") || q.includes("SI-IJ")) {
        diamondQualityFactor = 0.90;
      }
    }

    // 5. Diamond Cost
    const diamondCount = product.diamond_count || 1;
    const totalDiamondWeight = isPlainGold ? 0 : (product.diamond_weight || 0) * diamondCount;
    const diamondCost = isPlainGold ? 0 : (totalDiamondWeight * rates.diamond_rate * diamondQualityFactor);

    // 6. Gemstone Cost
    const gemstoneCost = (product.gemstone_weight || 0) * (rates.gemstone_rate || 0);

    // 7. Calculate Solitaire Cost
    const solitaireCost = product.solitaires_price || 0;

    // 8. Resolve category and calculate making charges
    let category = null;
    if (product.category_id) {
      if (product.category_id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(product.category_id).lean();
      }
      if (!category) {
        const catName = categoryMap[product.category_id] || product.product_category;
        if (catName) {
          category = await Category.findOne({ name: catName }).lean();
        }
      }
    }

    let makingCharges = 0;
    const baseCost = goldCost + diamondCost + gemstoneCost + solitaireCost;

    if (product.making_charges || product.makingCharges) {
      const mcPercent = product.making_charges || product.makingCharges || 0;
      makingCharges = baseCost * (mcPercent / 100);
    } else if (category && category.config && category.config.makingCharges) {
      const mc = category.config.makingCharges;
      if (mc.type === "fixed") {
        makingCharges = mc.value || 0;
      } else if (mc.type === "percentage") {
        makingCharges = baseCost * ((mc.value || 0) / 100);
      }
    }

    // 9. Total Cost before Tax
    const subtotal = goldCost + diamondCost + gemstoneCost + makingCharges + solitaireCost;

    // 10. Add GST Tax (standard is 3%)
    const gstPercent = rates.gst_percent ?? 3;
    const gst = subtotal * (gstPercent / 100);
    const finalPrice = Math.round(subtotal + gst);

    return {
      price: finalPrice,
      goldWeight,
      goldCost,
      diamondCost,
      gemstoneCost,
      makingCharges,
      subtotal,
      gst,
      ratesUsed: {
        gold_rate_14k: rates.gold_rate_14k,
        diamond_rate: rates.diamond_rate,
        gemstone_rate: rates.gemstone_rate,
        gst_percent: gstPercent
      }
    };
  }
}

module.exports = new JewelleryPricingService();
