import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  friend_codes: {
    nintendo: { type: String },
    steam: { type: String },
    psn: { type: String },
  },
  roles: { type: [String], default: ["user"] },
  warnings: { type: Number, default: 0 },
  muted_until: { type: Date, default: null },
  banned: { type: Boolean, default: false },
  age_verified: { type: Boolean, default: false },
  is_minor: { type: Boolean, default: false },
  parental_account: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  blocked_users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  nsfw_allowed: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
