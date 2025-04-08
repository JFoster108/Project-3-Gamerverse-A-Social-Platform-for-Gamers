"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const createContext = ({ req, res }) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return { user, req, res };
        }
        catch {
            throw new apollo_server_express_1.AuthenticationError("Invalid or expired token. Please log in again.");
        }
    }
    return { req, res };
};
exports.createContext = createContext;
