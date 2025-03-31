import mongoose from "mongoose";

const appealSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  content_type: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "pending" },
  moderator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  resolution: { type: String, default: null },
}, { timestamps: true });

const Appeal = mongoose.model("Appeal", appealSchema);
export default Appeal;