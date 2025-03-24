import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Post from "../models/Post";
import Game from "../models/Game";

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) return null;
      return await User.findById(context.user.id).select("-password");
    },
    getAllPosts: async () => await Post.find({ status: "active" }),
    getAllGames: async () => await Game.find(),
  },

  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return "User registered successfully";
    },

    login: async (_: any, { email, password }: any, { res }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
      res.cookie("token", token, { httpOnly: true, sameSite: "strict", secure: true });
      return "Login successful";
    },

    updateProfile: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const updatedUser = await User.findByIdAndUpdate(context.user.id, args, { new: true }).select("-password");
      return updatedUser;
    },

    createPost: async (_: any, { text, image, nsfw }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const newPost = new Post({ user_id: context.user.id, text, image, nsfw });
      await newPost.save();
      return newPost;
    },
  },
};

export default resolvers;