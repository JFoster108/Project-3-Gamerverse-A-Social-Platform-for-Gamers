import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reported_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reported_content_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  content_type: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "under review" },
  moderator_action: { type: String, default: null },
}, { timestamps: true });

const Report = mongoose.model("Report", reportSchema);
export default Report;