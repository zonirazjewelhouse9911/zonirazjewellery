const { getCollection } = require('../../controllers/userSide/collection')
const express = require("express");
const router = express.Router();

router.get("/getCollection", getCollection);
module.exports = router;