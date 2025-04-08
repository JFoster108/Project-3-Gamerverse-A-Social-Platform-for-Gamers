"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../../models/Post"));
const postResolvers = {
    Query: {
        getAllPosts: async () => await Post_1.default.find({ status: "active" }),
        getPostById: async (_, { id }) => await Post_1.default.findById(id),
        myPosts: async (_, __, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            return await Post_1.default.find({ user_id: context.user.id });
        },
    },
    Mutation: {
        createPost: async (_, { input }, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            const newPost = new Post_1.default({ user_id: context.user.id, ...input });
            await newPost.save();
            return newPost;
        },
        deletePost: async (_, { id }, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            await Post_1.default.findByIdAndDelete(id);
            return "Post deleted successfully";
        },
        likePost: async (_, { id }, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            const post = await Post_1.default.findById(id);
            if (!post)
                throw new Error("Post not found");
            post.likes.push(context.user.id);
            await post.save();
            return post;
        },
        unlikePost: async (_, { id }, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            const post = await Post_1.default.findById(id);
            if (!post)
                throw new Error("Post not found");
            post.likes = post.likes.filter((userId) => userId.toString() !== context.user.id);
            await post.save();
            return post;
        },
    },
};
exports.default = postResolvers;
