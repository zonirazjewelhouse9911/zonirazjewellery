const {register,user_login,verifyOtp,userID } = require("../../services/userside/user_validation");

exports.register = async (req, res) => {
    try {
      const data = await register(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.verifyOtp = async (req, res) => {
    try {
      const data = await verifyOtp(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.user_login = async (req, res) => {
    try {
      const data = await user_login(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.userID = async (req, res) => {
    try {
      const data = await userID(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };