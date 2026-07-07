const { navbar } = require("../../services/userside/navebar");

exports.navbar = async (req, res) => {
    const data = await navbar(req, res);

    if (data.success) {
        return res.status(200).json(data);
    } else {
        return res.status(500).json(data);
    }
}