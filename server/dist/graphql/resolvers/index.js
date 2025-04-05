"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
const authResolvers_1 = __importDefault(require("./authResolvers"));
const postResolvers_1 = __importDefault(require("./postResolvers"));
const gameResolvers_1 = __importDefault(require("./gameResolvers"));
const resolvers = (0, merge_1.mergeResolvers)([authResolvers_1.default, postResolvers_1.default, gameResolvers_1.default]);
exports.default = resolvers;
