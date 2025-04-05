"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    reported_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    reported_content_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    content_type: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: "under review" },
    moderator_action: { type: String, default: null },
}, { timestamps: true });
const Report = mongoose_1.default.model("Report", reportSchema);
exports.default = Report;
