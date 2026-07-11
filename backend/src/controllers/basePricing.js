const {
    productBasePricing
} = require("../services/basePricing");

exports.productBasePricing = async (req, res) => {
    try {
        let result = await productBasePricing(req, res);
        if (result.success) {
            return res.status(200).json(result || []);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};