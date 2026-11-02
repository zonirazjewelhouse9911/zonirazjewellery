const Coin = require('../models/coinModel');

/**
 * Calculates coin price according to standard jewellery formula:
 * (price + makking + gst) - discount
 *
 * @param {Object} params
 * @param {number} params.price Base metal price
 * @param {number} params.making_charges Making charges (makking)
 * @param {number} params.gst_percent GST percentage (default 3%)
 * @param {number} params.discount_percent Discount percentage
 * @returns {Object} Full breakdown of calculations
 */
function calculateCoinPricing({ price = 0, making_charges = 0, gst_percent = 3, discount_percent = 0 }) {
  const basePrice = Math.max(0, Number(price) || 0);
  const makingCharges = Math.max(0, Number(making_charges) || 0);
  const gstPct = Math.max(0, Number(gst_percent) !== undefined ? Number(gst_percent) : 3);
  const discountPct = Math.max(0, Math.min(100, Number(discount_percent) || 0));

  // Subtotal before tax = base price + making charges
  const subtotal = basePrice + makingCharges;

  // GST on (price + makking)
  const gstAmount = Math.round((subtotal * (gstPct / 100)) * 100) / 100;

  // Gross total / MRP before discount = price + makking + gst
  const grossTotal = Math.round((subtotal + gstAmount) * 100) / 100;

  // Discount amount in INR = grossTotal * (discount% / 100)
  const discountAmount = Math.round((grossTotal * (discountPct / 100)) * 100) / 100;

  // Final selling price = (price + gst + makking) - discount
  const finalPrice = Math.max(0, Math.round(grossTotal - discountAmount));

  return {
    base_price: basePrice,
    making_charges: makingCharges,
    subtotal: Math.round(subtotal),
    gst_percent: gstPct,
    gst_amount: gstAmount,
    gross_total: Math.round(grossTotal), // (price + gst + makking)
    discount_percent: discountPct,
    discount_amount: discountAmount,
    final_price: finalPrice, // (price + gst + makking) - discount
    savings: discountAmount
  };
}

/**
 * Format coin document for public product catalog & category pages
 */
function formatCoinForCatalog(coin) {
  const pricing = calculateCoinPricing({
    price: coin.price,
    making_charges: coin.making_charges,
    gst_percent: coin.gst_percent,
    discount_percent: coin.discount_percent
  });

  const primaryImage = coin.image || (Array.isArray(coin.images) && coin.images[0]) || '';
  const images = Array.isArray(coin.images) && coin.images.length > 0 
    ? coin.images 
    : (primaryImage ? [primaryImage] : []);

  const coinTypeLabel = coin.coin_type ? coin.coin_type.charAt(0).toUpperCase() + coin.coin_type.slice(1) : 'Gold';
  const categoryName = coin.coin_type === 'silver' ? 'Silver Coins' : 'Gold Coins';

  return {
    _id: coin._id,
    id: coin._id.toString(),
    product_id: coin._id.toString(),
    name: coin.title,
    product_title: coin.title,
    product_category: categoryName,
    category: categoryName,
    product_subcategory: `${coinTypeLabel} Coins`,
    subcategory: `${coinTypeLabel} Coins`,
    product_type: 'coin',
    coin_type: coin.coin_type,
    weight: coin.weight_grams,
    product_weight: coin.weight_grams,
    gold_weight: coin.coin_type === 'gold' ? coin.weight_grams : 0,
    purity: coin.purity,
    price: pricing.final_price, // (price + gst + makking) - discount
    originalPrice: pricing.gross_total, // (price + gst + makking)
    basePrice: coin.price,
    discount: pricing.discount_amount,
    discount_percent: pricing.discount_percent,
    making_charges: coin.making_charges,
    gst_percent: coin.gst_percent,
    gst_amount: pricing.gst_amount,
    pricing_breakdown: pricing,
    image: primaryImage,
    images: images,
    gallery: images,
    stock: coin.stock !== undefined ? coin.stock : 10,
    description: coin.description,
    sku: coin.sku,
    status: coin.status || '1',
    is_coin: true,
    createdAt: coin.createdAt
  };
}

class CoinService {
  /**
   * Get all coins with optional filtering and pricing calculation
   */
  async getAllCoins(query = {}) {
    const filter = {};

    if (query.status !== undefined && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.coin_type && query.coin_type !== 'all') {
      filter.coin_type = query.coin_type.toLowerCase();
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { purity: { $regex: query.search, $options: 'i' } },
        { sku: { $regex: query.search, $options: 'i' } }
      ];
    }

    const coins = await Coin.find(filter).sort({ createdAt: -1 }).lean();

    return coins.map(coin => ({
      ...coin,
      pricing: calculateCoinPricing({
        price: coin.price,
        making_charges: coin.making_charges,
        gst_percent: coin.gst_percent,
        discount_percent: coin.discount_percent
      })
    }));
  }

  /**
   * Get active coins formatted for consumer catalog
   */
  async getActiveCoinsCatalog(query = {}) {
    const filter = { status: '1' };
    if (query.coin_type && query.coin_type !== 'all') {
      filter.coin_type = query.coin_type.toLowerCase();
    }
    const coins = await Coin.find(filter).sort({ weight_grams: 1, createdAt: -1 }).lean();
    return coins.map(formatCoinForCatalog);
  }

  /**
   * Get single coin by ID
   */
  async getCoinById(id) {
    const coin = await Coin.findById(id).lean();
    if (!coin) return null;
    return {
      ...coin,
      pricing: calculateCoinPricing({
        price: coin.price,
        making_charges: coin.making_charges,
        gst_percent: coin.gst_percent,
        discount_percent: coin.discount_percent
      })
    };
  }

  /**
   * Create coin
   */
  async createCoin(data) {
    const images = Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []);
    const primaryImage = data.image || (images.length > 0 ? images[0] : '');

    const coin = new Coin({
      title: data.title,
      coin_type: (data.coin_type || 'gold').toLowerCase(),
      weight_grams: Number(data.weight_grams) || 10,
      purity: data.purity || '24K (999)',
      price: Number(data.price) || 0,
      making_charges: Number(data.making_charges) || 0,
      gst_percent: data.gst_percent !== undefined ? Number(data.gst_percent) : 3,
      discount_percent: Number(data.discount_percent) || 0,
      image: primaryImage,
      images: images,
      stock: data.stock !== undefined ? Number(data.stock) : 10,
      sku: data.sku || `COIN-${(data.coin_type || 'AU').toUpperCase().slice(0, 2)}-${data.weight_grams || 10}G-${Date.now().toString().slice(-4)}`,
      description: data.description || '',
      status: data.status || '1'
    });

    await coin.save();

    return {
      ...coin.toObject(),
      pricing: calculateCoinPricing({
        price: coin.price,
        making_charges: coin.making_charges,
        gst_percent: coin.gst_percent,
        discount_percent: coin.discount_percent
      })
    };
  }

  /**
   * Update coin
   */
  async updateCoin(id, data) {
    const updateData = { ...data };

    if (updateData.images && Array.isArray(updateData.images)) {
      if (!updateData.image && updateData.images.length > 0) {
        updateData.image = updateData.images[0];
      }
    }

    if (updateData.coin_type) {
      updateData.coin_type = updateData.coin_type.toLowerCase();
    }
    if (updateData.weight_grams !== undefined) updateData.weight_grams = Number(updateData.weight_grams);
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.making_charges !== undefined) updateData.making_charges = Number(updateData.making_charges);
    if (updateData.gst_percent !== undefined) updateData.gst_percent = Number(updateData.gst_percent);
    if (updateData.discount_percent !== undefined) updateData.discount_percent = Number(updateData.discount_percent);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const updated = await Coin.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!updated) return null;

    return {
      ...updated,
      pricing: calculateCoinPricing({
        price: updated.price,
        making_charges: updated.making_charges,
        gst_percent: updated.gst_percent,
        discount_percent: updated.discount_percent
      })
    };
  }

  /**
   * Delete coin
   */
  async deleteCoin(id) {
    return await Coin.findByIdAndDelete(id);
  }

  /**
   * Standalone price calculation helper
   */
  calculatePrice(params) {
    return calculateCoinPricing(params);
  }
}

module.exports = new CoinService();
module.exports.calculateCoinPricing = calculateCoinPricing;
module.exports.formatCoinForCatalog = formatCoinForCatalog;

