const { navbar } = require("../../controllers/userSide/navebar");
const express = require("express");
const httpCache = require("../../middleware/httpCache");
const router = express.Router();

router.get("/GetNavbar", httpCache(120), navbar);
module.exports = router;