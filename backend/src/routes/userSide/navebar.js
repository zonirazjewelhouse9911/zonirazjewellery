const { navbar } = require("../../controllers/userSide/navebar");
const express = require("express");
const router = express.Router();

router.get("/GetNavbar", navbar);
module.exports = router;