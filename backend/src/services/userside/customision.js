const productModel = require("../../models/productModel");

exports.customision = async (req, res) => {
    try {
        const { productId, metal, purity, size, stone } = req.body;

        if (!productId) {
            return {
                massege : "product id is required ",
                success : false,
            }
        }

        if (!metal || !purity || !size || !stone) {
            return {
                massege : "metal, purity, size, and stone fields are required ",
                success : false,
            }
        }

        let product = null;
        if (productId.match(/^[0-9a-fA-F]{24}$/)) {
            product = await productModel.findById(productId);
        }
        if (!product) {
            product = await productModel.findOne({ product_id: productId });
        }
        if (!product) {
            product = await productModel.findOne({ product_slug: productId });
        }
        if (!product) {
            product = await productModel.findOne({ slug: productId });
        }

        if (!product) {
            return {
                massege : "product not found ",
                success : false,
            }
        }

        const price = Number(product.price) || 0;
        const metalVal = parseFloat(metal) || 0;
        const stoneVal = parseFloat(stone) || 0;
        
        const metalPrice = price * metalVal;
        const stonePrice = price * stoneVal;
        const totalPrice = price + metalPrice + stonePrice;

        return {
            massege : "product customision ",
            success : true,
            data : {
                productId,
                metal,
                purity,
                size,
                stone,
                price,
                metalPrice,
                stonePrice,
                totalPrice
            }
        }
    } 
    catch (error) {
        console.error(error);
        return {
            massege : "something went wrong ",
            success : false,
            error : error.message
        }
    }
};