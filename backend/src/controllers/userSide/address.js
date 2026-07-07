const {
    user_address_manager,
    user_address_add,
    user_address_manager_update,
    user_address_manager_delete,
    
  } = require("../../services/userside/address");



exports.user_address_manager = async (req, res) => {
    let data = await user_address_manager(req, res);

    data = data.data.entries


  res.send("send")
  };
exports.user_address_add = async (req, res) => {
    let data = await user_address_add(req, res);
    data = data.data.entries


  res.send("add")

  };

exports.user_address_manager_update = async (req, res) => {
    let data = await user_address_manager_update(req, res);

  res.send("send")

  };
exports.user_address_manager_delete = async (req, res) => {
    let data = await user_address_manager_delete(req, res);

  res.send("send")

  };
