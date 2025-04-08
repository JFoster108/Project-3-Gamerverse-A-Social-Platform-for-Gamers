"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const authResolvers = {
    Mutation: {
        register: async (_, { input }) => {
            const { username, email, password } = input;
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = new User_1.default({ username, email, password: hashedPassword });
            await user.save();
            return "User registered successfully";
        },
        login: async (_, { email, password }, { res }) => {
            const user = await User_1.default.findOne({ email });
            if (!user)
                throw new Error("Invalid credentials");
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch)
                throw new Error("Invalid credentials");
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("token", token, { httpOnly: true, sameSite: "strict", secure: true });
            return "Login successful";
        },
        logout: async (_, __, { res }) => {
            res.clearCookie("token");
            return "Logged out successfully";
        },
        updateProfile: async (_, args, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            const updatedUser = await User_1.default.findByIdAndUpdate(context.user.id, args, { new: true }).select("-password");
            return updatedUser;
        },
    },
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user)
                return null;
            return await User_1.default.findById(context.user.id).select("-password");
        },
        getUserById: async (_, { id }) => {
            return await User_1.default.findById(id).select("-password");
        },
    },
};
exports.default = authResolvers;
