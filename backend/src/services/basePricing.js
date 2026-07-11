const product = require('../models/productModel');
const livePrice = require('../models/jewelleryPricingModel');

exports.productBasePricing = async (req, res) => {
    let gold_weight = 0;
    let gold_price = 0;
    let total_diamond_weight = 0;
    let diamond_price = 0;
    let base_price = 0;
    let base_price_withGST = 0;

    try {
        const product_category = req.query.product_category;
        const current_price = await livePrice.findOne().sort({ createdAt: -1 });



        // console.log(current_price);
        const product_data = await product.find({ product_category: product_category });
        if (!product_data) {
            return {
                success: false,
                message: "Product not found",
                data: null
            }
        }
        if(product_category==="Pendants"){
             product_data.map((item) => {
            console.log(item.product_type);
            if (item.product_type === "Diamond") {


                if (!item.solitaires_price) {
                    console.log("no solitaire weight");
                    total_diamond_weight = item.diamond_weight * item.diamond_count
                    console.log(total_diamond_weight, "total_diamond_weight");
                    const makingCharges = item.making_charges
                    const gst_percent = current_price.gst_percent
                    gold_weight = item.gold_weight
                    gold_price = gold_weight * current_price.gold_rate_14k
                    diamond_price = total_diamond_weight * current_price.diamond_rate

                    base_price = gold_price + diamond_price + makingCharges
                    base_price_withGST = base_price + (base_price * gst_percent / 100);
                    console.log(base_price_withGST, "base_price_withGST");


                    return {
                        success: true,
                        message: "Product base pricing",
                        gold_price: gold_price,
                        diamond_price: diamond_price
                    }

                }
                else {
                    total_diamond_weight = item.diamond_weight * item.diamond_count
                    console.log(total_diamond_weight, "total_diamond_weight");
                    const makingCharges = item.making_charges
                    const gst_percent = current_price.gst_percent
                    const solitaire_price = item.solitaires_price
                    gold_weight = item.gold_weight
                    gold_price = gold_weight * current_price.gold_rate_14k
                    diamond_price = total_diamond_weight * current_price.diamond_rate
                    base_price = gold_price + diamond_price + makingCharges + solitaire_price
                    base_price_withGST = base_price + (base_price * gst_percent / 100);
                    console.log(base_price_withGST, "base_price_withGST");

                }


            } else {

                const makingCharges = item.making_charges
                const gst_percent = current_price.gst_percent
                gold_weight = item.gold_weight
                const gold_rate_18kt = current_price.gold_rate_14k * 22 / 14;
                gold_price = gold_weight * gold_rate_18kt
                base_price = gold_price + makingCharges
                base_price_withGST = base_price + (base_price * gst_percent / 100);
                console.log(base_price_withGST, "base_price_withGST");
            }
        })
        }else if(product_category==="Rings"){
             product_data.map((item) => {
            console.log(item.product_type);
            if (item.product_type === "Diamond") {


                if (!item.solitaires_price) {
                    console.log("no solitaire weight");
                    total_diamond_weight = item.diamond_weight * item.diamond_count
                    console.log(total_diamond_weight, "total_diamond_weight");
                    const makingCharges = item.making_charges
                    const gst_percent = current_price.gst_percent
                    gold_weight = item.gold_weight
                    gold_price = gold_weight * current_price.gold_rate_14k
                    diamond_price = total_diamond_weight * current_price.diamond_rate

                    base_price = gold_price + diamond_price + makingCharges
                    base_price_withGST = base_price + (base_price * gst_percent / 100);
                    console.log(base_price_withGST, "base_price_withGST");


                    return {
                        success: true,
                        message: "Product base pricing",
                        gold_price: gold_price,
                        diamond_price: diamond_price
                    }

                } else {
                    total_diamond_weight = item.diamond_weight * item.diamond_count
                    console.log(total_diamond_weight, "total_diamond_weight");
                    const makingCharges = item.making_charges
                    const gst_percent = current_price.gst_percent
                    const solitaire_price = item.solitaires_price
                    gold_weight = item.gold_weight
                    gold_price = gold_weight * current_price.gold_rate_14k
                    diamond_price = total_diamond_weight * current_price.diamond_rate
                    base_price = gold_price + diamond_price + makingCharges + solitaire_price
                    base_price_withGST = base_price + (base_price * gst_percent / 100);
                    console.log(base_price_withGST, "base_price_withGST");

                }


            } else {

                const makingCharges = item.making_charges
                const gst_percent = current_price.gst_percent
                gold_weight = item.gold_weight
                const gold_rate_18kt = current_price.gold_rate_14k * 22 / 14;
                gold_price = gold_weight * gold_rate_18kt
                base_price = gold_price + makingCharges
                base_price_withGST = base_price + (base_price * gst_percent / 100);
                console.log(base_price_withGST, "base_price_withGST");
            }
        })
            
        }else if(product_category==="Necklaces"){
            
        }else if(product_category==="Bracelets"){
            
        }else if(product_category==="Bangles"){
            
        }else if(product_category==="Chains"){
            
        }
       
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
            data: null
        }
    }

}