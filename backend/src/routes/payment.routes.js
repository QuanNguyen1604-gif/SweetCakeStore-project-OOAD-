const express = require("express");
const { requireAuth } = require("../middleware/auth");
const paymentCtrl = require("../controllers/payment.controller");

const router = express.Router();

router.post("/pay", requireAuth, paymentCtrl.pay);

module.exports = router;
