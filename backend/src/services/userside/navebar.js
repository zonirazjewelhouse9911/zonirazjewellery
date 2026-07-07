const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");

exports.navbar = async (req, res) => {
    try {
        const data = await categoryModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    let: { catName: "$name" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $eq: [ { $toLower: "$product_category" }, { $toLower: "$$catName" } ] },
                                        { $eq: [ { $toLower: "$category" }, { $toLower: "$$catName" } ] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "products"
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryName: "$name",
                    products: {
                        $map: {
                            input: "$products",
                            as: "p",
                            in: {
                                productSubCategory: { 
                                    $ifNull: [
                                        "$$p.product_subcategory",
                                        { $ifNull: [ "$$p.specs.style", "" ] }
                                    ] 
                                },
                                productgender: { 
                                    $ifNull: [
                                        "$$p.gender",
                                        { $ifNull: [ "$$p.specs.gender", "" ] }
                                    ] 
                                },
                                price: { 
                                    $ifNull: [
                                        "$$p.price",
                                        { $ifNull: [ "$$p.basePrice", 0 ] }
                                    ] 
                                },
                                metal_type: { $ifNull: ["$$p.metal_type", ""] }
                            }
                        }
                    }
                }
            }
        ]);

        console.log(data, "dataaaaaaaa");

        return {
            message: "NAVEBAR",
            success: true,
            data: data
        };
    } catch (error) {
        console.log(error.message);

        return {
            message: "Something went wrong",
            success: false,
            error: error.message
        }
    }

}