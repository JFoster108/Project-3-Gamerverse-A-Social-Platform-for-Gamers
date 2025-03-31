import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  rating: { type: Number, required: true },
  text: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reports: [
    {
      reported_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: { type: String },
    }
  ],
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;