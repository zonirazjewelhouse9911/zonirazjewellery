const Cart = require('../../models/cartModel');

exports.addToCart = async (userId, productId, quantity = 1) => {
    try {
        if (!userId || !productId) {
            return {
                success: false,
                message: "User ID and Product ID are required."
            };
        }
        // Find existing cart for user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        } else {
            // Check if product already exists in cart
            const productIndex = cart.products.findIndex(
                p => p.productId.toString() === productId.toString()
            );

            if (productIndex > -1) {
                // Product exists, increment quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product
                cart.products.push({ productId, quantity });
            }
        }

        const data = await cart.save();

        return {
            success: true,
            message: "Item added to cart successfully",
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

exports.removeFromCart = async (userId, productId) => {
    try {
        if (!userId || !productId) {
            return {
                success: false,
                message: "User ID and Product ID are required."
            };
        }

        // Find cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return {
                success: false,
                message: "Cart not found for this user."
            };
        }

        // Filter out the product
        cart.products = cart.products.filter(
            p => p.productId.toString() !== productId.toString()
        );

        const data = await cart.save();

        return {
            success: true,
            message: "Item removed from cart successfully",
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