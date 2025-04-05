"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../../models/Post"));
const Report_1 = __importDefault(require("../../models/Report"));
const Appeal_1 = __importDefault(require("../../models/Appeal"));
const ModerationLog_1 = __importDefault(require("../../models/ModerationLog"));
const apollo_server_express_1 = require("apollo-server-express");
const emailTemplates_1 = require("../../utils/emailTemplates");
const moderationUtils_1 = require("../../utils/moderationUtils");
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
function checkRole(user, allowedRoles) {
    if (!user || !user.roles || !allowedRoles.some((role) => user.roles.includes(role))) {
        throw new apollo_server_express_1.ForbiddenError("You do not have the required permissions to perform this action.");
    }
}
const adminResolvers = {
    Mutation: {
        deletePost: async (_, { postId }, context) => {
            checkRole(context.user, ["admin", "moderator"]);
            await Post_1.default.findByIdAndDelete(postId);
            await ModerationLog_1.default.create({
                moderator_id: context.user.id,
                action: "delete_post",
                user_id: null,
                reason: "Post removed by admin/moderator",
            });
            await transporter.sendMail({
                to: process.env.MOD_EMAIL_NOTIF,
                from: process.env.EMAIL_USER,
                subject: "Post Deleted Notification",
                html: emailTemplates_1.emailTemplates.postDeleted(context.user.id, postId),
            });
            return "Post deleted, logged, and moderators notified.";
        },
        flagPost: async (_, { postId, reason }, context) => {
            checkRole(context.user, ["admin", "moderator"]);
            await Report_1.default.create({
                reported_by: context.user.id,
                reported_content_id: postId,
                content_type: "post",
                reason,
            });
            await ModerationLog_1.default.create({
                moderator_id: context.user.id,
                action: "flag_post",
                user_id: null,
                reason,
            });
            await transporter.sendMail({
                to: process.env.MOD_EMAIL_NOTIF,
                from: process.env.EMAIL_USER,
                subject: "Post Flagged Notification",
                html: emailTemplates_1.emailTemplates.postFlagged(context.user.id, postId, reason),
            });
            return "Post flagged, logged, and moderators notified.";
        },
        approveAppeal: async (_, { appealId, resolution }, context) => {
            checkRole(context.user, ["admin"]);
            const appeal = await Appeal_1.default.findById(appealId);
            if (!appeal)
                throw new apollo_server_express_1.ApolloError("Appeal not found.");
            appeal.status = "approved";
            appeal.resolution = resolution;
            appeal.moderator_id = context.user.id;
            await appeal.save();
            await ModerationLog_1.default.create({
                moderator_id: context.user.id,
                action: "approve_appeal",
                user_id: appeal.user_id,
                reason: resolution,
            });
            await transporter.sendMail({
                to: process.env.MOD_EMAIL_NOTIF,
                from: process.env.EMAIL_USER,
                subject: "Appeal Approved Notification",
                html: emailTemplates_1.emailTemplates.appealApproved(context.user.id, appealId, resolution),
            });
            return "Appeal approved, logged, and moderators notified.";
        },
        triggerDailyModerationSummary: async (_, __, context) => {
            checkRole(context.user, ["admin"]);
            await (0, moderationUtils_1.sendDailyModerationSummary)(context.user.id);
            return "Moderation summary sent successfully.";
        },
    },
    Query: {
        getModerationLogs: async (_, __, context) => {
            checkRole(context.user, ["admin", "moderator"]);
            return await ModerationLog_1.default.find().sort({ date: -1 }).limit(20);
        },
        getPendingAppeals: async (_, __, context) => {
            checkRole(context.user, ["admin", "moderator"]);
            return await Appeal_1.default.find({ status: "pending" });
        },
        getReports: async (_, __, context) => {
            checkRole(context.user, ["admin", "moderator"]);
            return await Report_1.default.find({ status: "under review" });
        },
        getDailyModerationStats: async (_, __, context) => {
            checkRole(context.user, ["admin", "moderator"]);
            const countLogs = await ModerationLog_1.default.countDocuments({
                date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            });
            const countAppeals = await Appeal_1.default.countDocuments({ status: "pending" });
            const countReports = await Report_1.default.countDocuments({ status: "under review" });
            return { countLogs, countAppeals, countReports };
        },
    },
};
exports.default = adminResolvers;
