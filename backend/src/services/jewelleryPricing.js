const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const JewelleryPricing = require("../models/jewelleryPricingModel");

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

class JewelleryPricingService {
  /**
   * Fetches the latest daily rates from the database.
   */
  async getLatestRates() {
    let rates = await JewelleryPricing.findOne().sort({ updatedAt: -1 });
    if (!rates) {
      // Return default rates if none found
      return {
        gold_rate_24k: 0,
        gold_rate_14k: 0,
        diamond_rate: 0,
        gemstone_rate: 0,
        gst_percent: 3
      };
    }
    const ratesObj = rates.toObject ? rates.toObject() : rates;
    const g24 = ratesObj.gold_rate_24k || 0;
    const g14 = ratesObj.gold_rate_14k || 0;
    ratesObj.gold_rate_24k = g24 > 0 ? g24 : Math.round(g14 * 24 / 14);
    ratesObj.gold_rate_14k = g14 > 0 ? g14 : Math.round(g24 * 14 / 24);
    return ratesObj;
  }

  /**
   * Updates or creates the daily jewellery rates.
   */
  async updateRates(rateData) {
    let rates = await JewelleryPricing.findOne();
    if (rates) {
      rates.gold_rate_14k = Number(rateData.gold_rate_14k) || 0;
      rates.diamond_rate = Number(rateData.diamond_rate) || 0;
      rates.gemstone_rate = Number(rateData.gemstone_rate) || 0;
      rates.gst_percent = Number(rateData.gst_percent) ?? 3;
      await rates.save();
    } else {
      rates = new JewelleryPricing({
        gold_rate_14k: Number(rateData.gold_rate_14k) || 0,
        diamond_rate: Number(rateData.diamond_rate) || 0,
        gemstone_rate: Number(rateData.gemstone_rate) || 0,
        gst_percent: Number(rateData.gst_percent) ?? 3
      });
      await rates.save();
    }
    return rates;
  }

  /**
   * Recalculates prices of all products in the database using current rates.
   */
  async recalculateAllProducts() {
    const rates = await this.getLatestRates();
    const products = await Product.find();

    const updatedProducts = [];

    for (const product of products) {
      // 1. Calculate Gold Purity Rate (Base gold weight is specified for 14K Gold)
      let goldRate = rates.gold_rate_14k;
      
      // If product has a specific karat setting, we could adjust the rate proportionately.
      // E.g. If uploader specifies 18K gold weight, goldRate = rates.gold_rate_14k * 18/14.
      // Since our base weight field is "Gold Weight (14k)", we use gold_rate_14k directly.
      const goldCost = (product.gold_weight || 0) * goldRate;

      // 2. Calculate Diamond Cost
      const diamondCount = product.diamond_count || 1;
      const totalDiamondWeight = (product.diamond_weight || 0) * diamondCount;
      const diamondCost = totalDiamondWeight * rates.diamond_rate;

      // 3. Calculate Gemstone Cost
      const gemstoneCost = (product.gemstone_weight || 0) * (rates.gemstone_rate || 0);

      // 4. Calculate Solitaire Cost
      const solitaireCost = product.solitaires_price || 0;

      // 5. Resolve Category and calculate making charges
      let category = null;
      if (product.category_id) {
        if (product.category_id.match(/^[0-9a-fA-F]{24}$/)) {
          category = await Category.findById(product.category_id);
        }
        if (!category) {
          const catName = categoryMap[product.category_id] || product.product_category;
          if (catName) {
            category = await Category.findOne({ name: catName });
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

      // 6. Total Cost before Tax
      const subtotal = goldCost + diamondCost + gemstoneCost + makingCharges + solitaireCost;

      // 6. Add GST Tax (standard is 3%)
      const gstPercent = rates.gst_percent ?? 3;
      const gst = subtotal * (gstPercent / 100);
      const finalPrice = Math.round(subtotal + gst);

      // 7. Update product document price and basePrice fields
      product.price = finalPrice;
      product.basePrice = finalPrice;
      
      await product.save();
      updatedProducts.push({
        id: product._id,
        title: product.product_title || product.name,
        price: finalPrice
      });
    }

    return updatedProducts;
  }

  /**
   * Calculates price dynamically for a product based on selected configuration.
   */
  async calculateDynamicPrice({ product_id, size, metal, diamond }) {
    const rates = await this.getLatestRates();
    const product = await Product.findById(product_id);
    if (!product) {
      throw new Error("Product not found");
    }

    // Fallback if daily rates are not configured (both are 0)
    if (rates.gold_rate_14k === 0 && rates.diamond_rate === 0) {
      return {
        price: product.price || 0,
        goldWeight: product.gold_weight || 0,
        goldCost: Math.round((product.price || 0) * 0.65),
        diamondCost: Math.round((product.price || 0) * 0.25),
        gemstoneCost: 0,
        makingCharges: product.makingCharges || 0,
        subtotal: product.price || 0,
        gst: 0,
        ratesUsed: rates
      };
    }

    // 1. Gold Purity Factor
    let purityFactor = 1.0; // base is 14k
    if (metal) {
      if (metal.includes("18 KT") || metal.includes("18K")) {
        purityFactor = 18 / 14;
      } else if (metal.includes("22 KT") || metal.includes("22K")) {
        purityFactor = 22 / 14;
      } else if (metal.includes("9 KT") || metal.includes("9K")) {
        purityFactor = 9 / 14;
      } else if (metal.toLowerCase().includes("platinum")) {
        purityFactor = 1.8; // Platinum multiplier
      } else if (metal.toLowerCase().includes("silver")) {
        purityFactor = 0.1; // Silver factor
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
    const goldCost = goldWeight * rates.gold_rate_14k * purityFactor;

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
    const totalDiamondWeight = (product.diamond_weight || 0) * diamondCount;
    const diamondCost = totalDiamondWeight * rates.diamond_rate * diamondQualityFactor;

    // 6. Gemstone Cost
    const gemstoneCost = (product.gemstone_weight || 0) * (rates.gemstone_rate || 0);

    // 7. Calculate Solitaire Cost
    const solitaireCost = product.solitaires_price || 0;

    // 8. Resolve category and calculate making charges
    let category = null;
    if (product.category_id) {
      if (product.category_id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(product.category_id);
      }
      if (!category) {
        const catName = categoryMap[product.category_id] || product.product_category;
        if (catName) {
          category = await Category.findOne({ name: catName });
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
