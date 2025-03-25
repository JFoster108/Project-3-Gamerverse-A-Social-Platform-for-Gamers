import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import cron from "node-cron";
import { ApolloServer, ApolloError, AuthenticationError, ForbiddenError } from "apollo-server-express";
import typeDefs from "./graphql/typeDefs";
import Post from "./models/Post";
import Appeal from "./models/Appeal";
import Report from "./models/Report";
import ModerationLog from "./models/ModerationLog";
import resolvers from "./graphql/resolvers";
import { emailTemplates } from "./utils/emailTemplates";

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

// Admin authentication middleware
function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const user: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!user.roles || !user.roles.includes("admin")) {
      return res.status(403).json({ message: "Forbidden: Admins only." });
    }
    req.body.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

export async function sendDailyModerationSummary(triggeredBy?: string) {
  const actions = await ModerationLog.find({
    date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (actions.length > 0) {
    await transporter.sendMail({
      to: process.env.MOD_EMAIL_NOTIF,
      from: process.env.EMAIL_USER,
      subject: "Daily Moderation Summary",
      html: emailTemplates.moderationSummary(actions),
    });
  }

  // Log manual triggers
  if (triggeredBy) {
    await ModerationLog.create({
      moderator_id: triggeredBy,
      action: "manual_summary_trigger",
      user_id: null,
      reason: "Manual daily moderation summary triggered.",
    });
  }
}

// Schedule daily summary at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily moderation summary email...");
  await sendDailyModerationSummary();
});

// Manual trigger route (for admin panel)
app.post("/api/admin/send-moderation-summary", async (req, res) => {
  try {
    // Optional: Add admin authentication check here
    await sendDailyModerationSummary();
    res.status(200).json({ message: "Moderation summary sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending moderation summary." });
  }
});

app.get("/api/admin/moderation-logs", adminAuthMiddleware, async (req, res) => {
  const logs = await ModerationLog.find().sort({ date: -1 }).limit(20);
  res.json(logs);
});

app.get("/api/admin/pending-appeals", adminAuthMiddleware, async (req, res) => {
  const appeals = await Appeal.find({ status: "pending" });
  res.json(appeals);
});

app.get("/api/admin/reports", adminAuthMiddleware, async (req, res) => {
  const reports = await Report.find({ status: "under review" });
  res.json(reports);
});

app.get("/api/admin/stats/daily-summary", adminAuthMiddleware, async (req, res) => {
  const countLogs = await ModerationLog.countDocuments({
    date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  const countAppeals = await Appeal.countDocuments({ status: "pending" });
  const countReports = await Report.countDocuments({ status: "under review" });
  res.json({ countLogs, countAppeals, countReports });
});

// Utility function for role-based permission checks
export function checkRole(user: any, allowedRoles: string[]) {
  if (!user || !user.roles || !allowedRoles.some((role) => user.roles.includes(role))) {
    throw new ForbiddenError("You do not have the required permissions to perform this action.");
  }
}

// Admin/Moderator actions with permission checks, audit logging, and HTML email notifications
export const adminResolvers = {
  Mutation: {
    deletePost: async (_: any, { postId }: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      await Post.findByIdAndDelete(postId);
      await ModerationLog.create({
        moderator_id: context.user.id,
        action: "delete_post",
        user_id: null,
        reason: "Post removed by admin/moderator",
      });

      await transporter.sendMail({
        to: process.env.MOD_EMAIL_NOTIF,
        from: process.env.EMAIL_USER,
        subject: "Post Deleted Notification",
        html: emailTemplates.postDeleted(context.user.id, postId),
      });

      return "Post deleted, logged, and moderators notified.";
    },

    flagPost: async (_: any, { postId, reason }: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      await Report.create({
        reported_by: context.user.id,
        reported_content_id: postId,
        content_type: "post",
        reason,
      });
      await ModerationLog.create({
        moderator_id: context.user.id,
        action: "flag_post",
        user_id: null,
        reason,
      });

      await transporter.sendMail({
        to: process.env.MOD_EMAIL_NOTIF,
        from: process.env.EMAIL_USER,
        subject: "Post Flagged Notification",
        html: emailTemplates.postFlagged(context.user.id, postId, reason),
      });

      return "Post flagged, logged, and moderators notified.";
    },

    approveAppeal: async (_: any, { appealId, resolution }: any, context: any) => {
      checkRole(context.user, ["admin"]);
      const appeal = await Appeal.findById(appealId);
      if (!appeal) throw new ApolloError("Appeal not found.");
      appeal.status = "approved";
      appeal.resolution = resolution;
      appeal.moderator_id = context.user.id;
      await appeal.save();

      await ModerationLog.create({
        moderator_id: context.user.id,
        action: "approve_appeal",
        user_id: appeal.user_id,
        reason: resolution,
      });

      await transporter.sendMail({
        to: process.env.MOD_EMAIL_NOTIF,
        from: process.env.EMAIL_USER,
        subject: "Appeal Approved Notification",
        html: emailTemplates.appealApproved(context.user.id, appealId, resolution),
      });

      return "Appeal approved, logged, and moderators notified.";
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
      html: `<h2>Password Reset Request</h2>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
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
