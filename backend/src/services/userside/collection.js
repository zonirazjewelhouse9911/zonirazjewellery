const collectionModel = require('../../models/collectionModel');

exports.getCollection = async () => {
    try {
        const data = await collectionModel.find()
        if (!data) {
            return {
                success: false,
                message: "No collection found",

            }
        }
        return {
            success: true,
            data: data,
            message: "Collection fetched successfully",
            count: data.length
        }
    } catch (error) {
        console.log(error.message);

        return {
            success: false,
            message: "Something went wrong",
            error: error.message
        }
    }
}

