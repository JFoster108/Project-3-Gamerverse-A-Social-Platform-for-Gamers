import mongoose from "mongoose";

const moderationLogSchema = new mongoose.Schema({
  moderator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: { type: String },
  date: { type: Date, default: Date.now },
});

const ModerationLog = mongoose.model("ModerationLog", moderationLogSchema);
export default ModerationLog;