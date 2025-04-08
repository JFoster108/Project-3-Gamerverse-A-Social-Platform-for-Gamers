"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    image: { type: String },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
    reports: [
        {
            reported_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            reason: { type: String },
            date: { type: Date, default: Date.now },
        }
    ],
    status: { type: String, default: "active" },
    nsfw: { type: Boolean, default: false },
}, { timestamps: true });
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;
