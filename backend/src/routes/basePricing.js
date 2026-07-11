const express = require("express");
const router = express.Router();
// const user_auth = require("../../middleware/user_auth");

const {
    productBasePricing
} = require("../controllers/basePricing");

router.get("/productBasePricing", productBasePricing)
// router.get("/productPricing", productPricing)

module.exports = router;