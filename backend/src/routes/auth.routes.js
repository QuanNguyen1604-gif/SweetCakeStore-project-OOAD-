const express = require("express");
const { requireAuth } = require("../middleware/auth");
const authCtrl = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/logout", authCtrl.logout);
router.get("/me", requireAuth, authCtrl.me);

module.exports = router;
