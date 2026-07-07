const Reveiw = require('../../models/reveiwModel');

exports.postReview = async (userId, productId, star, discription, images = []) => {
    try {
        if (!userId || !productId) {
            return {
                success: false,
                message: "User ID and Product ID are required."
            };
        }

        // Find existing review document for this user
        let userReviews = await Reveiw.findOne({ userId });

        const newProductReview = {
            productId,
            star: Number(star) || 1,
            discription: discription || "",
            images: Array.isArray(images) ? images : [images].filter(Boolean)
        };

        if (!userReviews) {
            // Create a new review document for this user
            userReviews = new Reveiw({
                userId,
                products: [newProductReview]
            });
        } else {
            // Check if user has already reviewed this product
                 productIndex = userReviews.products.findIndex(
                p => p.productId.toString() === productId.toString()
            );

            if (productIndex > -1) {
                // Update existing product review
                userReviews.products[productIndex].star = newProductReview.star;
                userReviews.products[productIndex].discription = newProductReview.discription;
                userReviews.products[productIndex].images = newProductReview.images;
            } else {
                // Push new product review
                userReviews.products.push(newProductReview);
            }
        }

        const data = await userReviews.save();

        return {
            success: true,
            message: "Review submitted successfully",
            data: data
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Something went wrong",
            error: error.message
        };
    }
};

exports.getUserReviews = async (userId) => {
    try {
        if (!userId) {
            return {
                success: false,
                message: "User ID is required."
            };
        }

        const data = await Reveiw.findOne({ userId }).populate('products.productId');

        return {
            success: true,
            data: data || { userId, products: [] },
            message: "Reviews fetched successfully"
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Something went wrong",
            error: error.message
        };
    }
};
