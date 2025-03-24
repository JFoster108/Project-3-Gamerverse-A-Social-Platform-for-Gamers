import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { ApolloServer, ApolloError, AuthenticationError, ForbiddenError } from "apollo-server-express";
import typeDefs from "./graphql/typeDefs";
import Post from "./models/Post";
import Appeal from "./models/Appeal";
import Report from "./models/Report";
import resolvers from "./graphql/resolvers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Ensure environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.FRONTEND_URL) {
  throw new Error("Missing required environment variables: EMAIL_USER, EMAIL_PASS, or FRONTEND_URL");
}

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility function for role-based permission checks
export function checkRole(user: any, allowedRoles: string[]) {
  if (!user || !user.roles || !allowedRoles.some((role) => user.roles.includes(role))) {
    throw new ForbiddenError("You do not have the required permissions to perform this action.");
  }
}

// Admin/Moderator actions integrated with permission checks
export const adminResolvers = {
  Mutation: {
    deletePost: async (_: any, { postId }: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      await Post.findByIdAndDelete(postId);
      return "Post deleted successfully.";
    },

    flagPost: async (_: any, { postId, reason }: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      await Report.create({
        reported_by: context.user.id,
        reported_content_id: postId,
        content_type: "post",
        reason,
      });
      return "Post flagged for review.";
    },

    approveAppeal: async (_: any, { appealId, resolution }: any, context: any) => {
      checkRole(context.user, ["admin"]);
      const appeal = await Appeal.findById(appealId);
      if (!appeal) throw new ApolloError("Appeal not found.");
      appeal.status = "approved";
      appeal.resolution = resolution;
      appeal.moderator_id = context.user.id;
      await appeal.save();
      return "Appeal approved successfully.";
    },
  },
};

// Request Password Reset Endpoint
app.post("/api/auth/request-password-reset", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await mongoose.model("User").findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click here to reset your password: ${resetUrl}`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
});

// Reset Password Endpoint
app.post("/api/auth/reset-password", async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const user = await mongoose.model("User").findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    next(err);
  }
});

// Apollo Server setup with auth context and custom permission error formatting
const server = new ApolloServer({
  typeDefs,
  resolvers: [resolvers, adminResolvers],
  context: ({ req, res }) => {
    const token = req.cookies.token;
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string);
        return { user, req, res };
      } catch {
        throw new AuthenticationError("Invalid or expired token. Please log in again.");
      }
    }
    return { req, res };
  },
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    if (error.originalError instanceof AuthenticationError) {
      return new ApolloError("Authentication failed. Please log in.", "UNAUTHENTICATED");
    }
    if (error.originalError instanceof ForbiddenError) {
      return new ApolloError("You do not have permission to perform this action.", "FORBIDDEN");
    }
    return new ApolloError(error.message, error.extensions?.code || "INTERNAL_SERVER_ERROR");
  },
});

// Global Error Handling Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "An unexpected error occurred." });
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} with GraphQL at /graphql`)
  );
}

startServer();

export default app;
