const { getCollection } = require('../../services/userside/collection')

exports.getCollection = async (req, res) => {
    try {
        const data = await getCollection();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}