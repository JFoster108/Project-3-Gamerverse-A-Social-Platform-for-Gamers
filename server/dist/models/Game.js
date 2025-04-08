"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gameSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    platforms: [{ type: String }],
    release_date: { type: Date },
    genre: [{ type: String }],
    cover_image: { type: String },
});
const Game = mongoose_1.default.model("Game", gameSchema);
exports.default = Game;
