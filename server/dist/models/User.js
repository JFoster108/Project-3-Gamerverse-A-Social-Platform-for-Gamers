"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    friend_codes: {
        nintendo: { type: String },
        steam: { type: String },
        psn: { type: String },
    },
    roles: { type: [String], default: ["user"] },
    warnings: { type: Number, default: 0 },
    muted_until: { type: Date, default: null },
    banned: { type: Boolean, default: false },
    age_verified: { type: Boolean, default: false },
    is_minor: { type: Boolean, default: false },
    parental_account: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    blocked_users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    nsfw_allowed: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
