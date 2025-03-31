import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platforms: [{ type: String }],
  release_date: { type: Date },
  genre: [{ type: String }],
  cover_image: { type: String },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;