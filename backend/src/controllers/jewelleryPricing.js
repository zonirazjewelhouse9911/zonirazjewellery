const jewelleryPricingService = require("../services/jewelleryPricing");

class JewelleryPricingController {
  /**
   * GET /api/jewellery-pricing
   * Returns current gold and diamond rates.
   */
  getRates = async (req, res) => {
    try {
      const rates = await jewelleryPricingService.getLatestRates();
      return res.status(200).json({
        success: true,
        data: rates
      });
    } catch (error) {
      console.error("Get rates error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve daily rates"
      });
    }
  };

  /**
   * POST /api/jewellery-pricing
   * Saves updated daily rates and triggers recalculation of all products.
   */
  updateRates = async (req, res) => {
    try {
      const { 
        gold_rate_24k, 
        diamond_rate, 
        diamond_rate_ij_si,
        diamond_rate_gh_vs,
        diamond_rate_ef_vvs,
        diamond_rate_fg_si,
        gemstone_rate, 
        gst_percent 
      } = req.body;
      
      if (gold_rate_24k === undefined) {
        return res.status(400).json({
          success: false,
          message: "24k gold rate is required"
        });
      }

      // 1. Update rates
      const rates = await jewelleryPricingService.updateRates({
        gold_rate_24k,
        diamond_rate,
        diamond_rate_ij_si,
        diamond_rate_gh_vs,
        diamond_rate_ef_vvs,
        diamond_rate_fg_si,
        gemstone_rate,
        gst_percent
      });

      // 2. Trigger automatic price recalculation of all products
      const updatedProducts = await jewelleryPricingService.recalculateAllProducts();

      return res.status(200).json({
        success: true,
        message: "Rates updated and all product prices recalculated successfully",
        data: {
          rates,
          recalculatedCount: updatedProducts.length,
          updatedProducts
        }
      });
    } catch (error) {
      console.error("Update rates and recalculate error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update rates or recalculate product prices"
      });
    }
  };

  /**
   * POST /api/jewellery-pricing/calculate
   * Dynamically calculates price of a product based on selected size, metal, and diamond options.
   */
  calculatePrice = async (req, res) => {
    try {
      const { product_id, size, metal, diamond } = req.body;
      if (!product_id) {
        return res.status(400).json({
          success: false,
          message: "product_id is required"
        });
      }

      const calculation = await jewelleryPricingService.calculateDynamicPrice({
        product_id,
        size,
        metal,
        diamond
      });

      return res.status(200).json({
        success: true,
        ...calculation
      });
    } catch (error) {
      console.error("Calculate price error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to calculate dynamic price"
      });
    }
  };
}

module.exports = new JewelleryPricingController();
