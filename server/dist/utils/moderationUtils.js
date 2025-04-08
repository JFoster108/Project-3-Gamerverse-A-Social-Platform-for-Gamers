"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDailyModerationSummary = sendDailyModerationSummary;
const ModerationLog_1 = __importDefault(require("../models/ModerationLog"));
const emailTemplates_1 = require("./emailTemplates");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendDailyModerationSummary(triggeredBy) {
    const actions = await ModerationLog_1.default.find({
        date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (actions.length > 0) {
        await transporter.sendMail({
            to: process.env.MOD_EMAIL_NOTIF,
            from: process.env.EMAIL_USER,
            subject: "Daily Moderation Summary",
            html: emailTemplates_1.emailTemplates.moderationSummary(actions),
        });
    }
    if (triggeredBy) {
        await ModerationLog_1.default.create({
            moderator_id: triggeredBy,
            action: "manual_summary_trigger",
            user_id: null,
            reason: "Manual daily moderation summary triggered.",
        });
    }
}
