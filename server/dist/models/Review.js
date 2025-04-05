"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    game_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Game", required: true },
    rating: { type: Number, required: true },
    text: { type: String },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    reports: [
        {
            reported_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            reason: { type: String },
        }
    ],
}, { timestamps: true });
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
