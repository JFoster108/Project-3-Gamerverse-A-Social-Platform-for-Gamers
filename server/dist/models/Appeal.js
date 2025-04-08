"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appealSchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    content_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    content_type: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: "pending" },
    moderator_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: null },
    resolution: { type: String, default: null },
}, { timestamps: true });
const Appeal = mongoose_1.default.model("Appeal", appealSchema);
exports.default = Appeal;
