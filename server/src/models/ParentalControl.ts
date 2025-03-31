import mongoose from "mongoose";

const parentalControlSchema = new mongoose.Schema({
  parent_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  child_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restricted_content: [{ type: String }],
  activity_log: [
    {
      action: { type: String },
      content_id: { type: mongoose.Schema.Types.ObjectId },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  override_permissions: {
    nsfw_access: { type: Boolean, default: false },
    private_messaging: { type: Boolean, default: false },
  },
}, { timestamps: true });

const ParentalControl = mongoose.model("ParentalControl", parentalControlSchema);
export default ParentalControl;