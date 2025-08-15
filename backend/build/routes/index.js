"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to CodePlatter API",
        status: "success",
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map