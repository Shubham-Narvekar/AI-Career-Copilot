"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/protected', authMiddleware_1.authenticateJWT, (req, res) => {
    const user = req.user;
    res.json({ message: 'You have accessed a protected route!', user });
});
exports.default = router;
