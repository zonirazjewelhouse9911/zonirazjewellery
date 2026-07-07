const customisionService = require('../../services/userside/customision');

exports.customision = async (req, res) => {
    try {
        const result = await customisionService.customision(req, res);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            massege: "something went wrong ",
            error: error.message
        });
    }
};
