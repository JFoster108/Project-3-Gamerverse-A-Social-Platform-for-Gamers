import ModerationLog from "../models/ModerationLog";
import { emailTemplates } from "./emailTemplates";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  if (triggeredBy) {
    await ModerationLog.create({
      moderator_id: triggeredBy,
      action: "manual_summary_trigger",
      user_id: null,
      reason: "Manual daily moderation summary triggered.",
    });
  }
}
