const reviewService = require('../../services/userside/review');

exports.postReview = async (req, res) => {
    try {
        const { userId, productId, star, discription, images } = req.body;
        const result = await reviewService.postReview(userId, productId, star, discription, images);
        
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

exports.getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await reviewService.getUserReviews(userId);
        
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
