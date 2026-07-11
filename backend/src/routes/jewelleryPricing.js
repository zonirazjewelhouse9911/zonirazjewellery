const express = require("express");
const router = express.Router();
const jewelleryPricingController = require("../controllers/jewelleryPricing");

// GET endpoints for fetching daily rates
router.get("/jewellery-pricing", jewelleryPricingController.getRates);

// POST endpoints for updating rates and triggering product recalculations
router.post("/jewellery-pricing", jewelleryPricingController.updateRates);

// POST endpoint for calculating dynamic product prices based on customization parameters
router.post("/jewellery-pricing/calculate", jewelleryPricingController.calculatePrice);

module.exports = router;
