const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");

const { 
    user_address_manager_update,
    user_address_manager_delete,
    user_address_add,
   

} = require("../../controllers/userSide/address");



router.post("/user_address_manager_update",user_auth, user_address_manager_update)
router.post("/user_address_add",user_auth, user_address_add)
router.delete("/user_address_manager_delete",user_auth, user_address_manager_delete)

module.exports = router;