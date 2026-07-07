const similarProductsService = require('../../services/userside/similarProducts');

exports.getSimilarProducts = async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit } = req.query;
        const result = await similarProductsService.getSimilarProducts(productId, limit);
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};
