const collectionService = require('../collectionService');

exports.getCollection = async () => {
    try {
        const data = await collectionService.getAllCollections();
        return {
            success: true,
            data: data,
            message: "Collection fetched successfully",
            count: data ? data.length : 0
        };
    } catch (error) {
        console.log(error.message);

        return {
            success: false,
            message: "Something went wrong",
            error: error.message
        };
    }
};

