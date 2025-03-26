import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { Response } from "express";

const authResolvers = {
  Mutation: {
    register: async (_: any, { input }: any) => {
      const { username, email, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return "User registered successfully";
    },

    login: async (_: any, { email, password }: any, { res }: { res: Response }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
      res.cookie("token", token, { httpOnly: true, sameSite: "strict", secure: true });
      return "Login successful";
    },

    logout: async (_: any, __: any, { res }: { res: Response }) => {
      res.clearCookie("token");
      return "Logged out successfully";
    },

    updateProfile: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const updatedUser = await User.findByIdAndUpdate(context.user.id, args, { new: true }).select("-password");
      return updatedUser;
    },
  },

  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) return null;
      return await User.findById(context.user.id).select("-password");
    },
    getUserById: async (_: any, { id }: any) => {
      return await User.findById(id).select("-password");
    },
  },
};

export default authResolvers;
