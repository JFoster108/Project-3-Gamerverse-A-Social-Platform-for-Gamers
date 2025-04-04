"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("../../models/Game"));
const gameResolvers = {
    Query: {
        getAllGames: async () => await Game_1.default.find(),
        searchGames: async (_, { title }) => {
            return await Game_1.default.find({ title: { $regex: title, $options: "i" } });
        },
    },
};
exports.default = gameResolvers;
