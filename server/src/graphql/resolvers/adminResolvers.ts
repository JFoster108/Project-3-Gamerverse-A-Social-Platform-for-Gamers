import Post from "../../models/Post";
import Report from "../../models/Report";
import Appeal from "../../models/Appeal";
import ModerationLog from "../../models/ModerationLog";
import { ForbiddenError, ApolloError } from "apollo-server-express";
import { emailTemplates } from "../../utils/emailTemplates";
import { sendDailyModerationSummary } from "../../utils/moderationUtils";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function checkRole(user: any, allowedRoles: string[]) {
  if (!user || !user.roles || !allowedRoles.some((role) => user.roles.includes(role))) {
    throw new ForbiddenError("You do not have the required permissions to perform this action.");
  }
}

const adminResolvers = {
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

    triggerDailyModerationSummary: async (_: any, __: any, context: any) => {
        checkRole(context.user, ["admin"]);
        await sendDailyModerationSummary(context.user.id);
        return "Moderation summary sent successfully.";
    },
  },

  Query: {
    getModerationLogs: async (_: any, __: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      return await ModerationLog.find().sort({ date: -1 }).limit(20);
    },
    getPendingAppeals: async (_: any, __: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      return await Appeal.find({ status: "pending" });
    },
    getReports: async (_: any, __: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      return await Report.find({ status: "under review" });
    },
    getDailyModerationStats: async (_: any, __: any, context: any) => {
      checkRole(context.user, ["admin", "moderator"]);
      const countLogs = await ModerationLog.countDocuments({
        date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });
      const countAppeals = await Appeal.countDocuments({ status: "pending" });
      const countReports = await Report.countDocuments({ status: "under review" });
      return { countLogs, countAppeals, countReports };
    },
  },

};

export default adminResolvers;
