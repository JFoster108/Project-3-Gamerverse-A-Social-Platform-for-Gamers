"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const parentalControlSchema = new mongoose_1.default.Schema({
    parent_user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    child_user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    restricted_content: [{ type: String }],
    activity_log: [
        {
            action: { type: String },
            content_id: { type: mongoose_1.default.Schema.Types.ObjectId },
            timestamp: { type: Date, default: Date.now },
        }
    ],
    override_permissions: {
        nsfw_access: { type: Boolean, default: false },
        private_messaging: { type: Boolean, default: false },
    },
}, { timestamps: true });
const ParentalControl = mongoose_1.default.model("ParentalControl", parentalControlSchema);
exports.default = ParentalControl;
