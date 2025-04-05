"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "An unexpected error occurred." });
};
exports.errorHandler = errorHandler;
