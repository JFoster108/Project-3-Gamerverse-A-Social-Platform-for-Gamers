"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moderationLogSchema = new mongoose_1.default.Schema({
    moderator_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String },
    date: { type: Date, default: Date.now },
});
const ModerationLog = mongoose_1.default.model("ModerationLog", moderationLogSchema);
exports.default = ModerationLog;
