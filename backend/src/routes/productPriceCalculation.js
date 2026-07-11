const express = require("express");
const router = express.Router();
// const user_auth = require("../../middleware/user_auth");

const {
    productPricing
} = require("../controllers/productPriceCalculation");

router.post("/productPricing", productPricing)
router.get("/productPricing", productPricing)

module.exports = router;