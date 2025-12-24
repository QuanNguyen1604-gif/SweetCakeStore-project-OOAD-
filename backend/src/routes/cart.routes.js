const express = require("express");
const { requireAuth } = require("../middleware/auth");
const cartCtrl = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", requireAuth, cartCtrl.getCart);
router.post("/items", requireAuth, cartCtrl.addItem);
router.put("/items/:productId", requireAuth, cartCtrl.updateQty);
router.delete("/items/:productId", requireAuth, cartCtrl.removeItem);
router.delete("/clear", requireAuth, cartCtrl.clearCart);

module.exports = router;
