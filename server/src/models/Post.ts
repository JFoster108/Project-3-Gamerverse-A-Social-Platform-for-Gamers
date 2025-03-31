import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  reports: [
    {
      reported_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  status: { type: String, default: "active" },
  nsfw: { type: Boolean, default: false },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;