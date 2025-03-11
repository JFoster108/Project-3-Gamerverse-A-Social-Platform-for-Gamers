import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema & Model
interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  favoriteGames?: string[];
  friendCodes?: {
    nintendo?: string;
    playstation?: string;
    xbox?: string;
    steam?: string;
  };
  isPrivate: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  favoriteGames: { type: [String] },
  friendCodes: {
    nintendo: { type: String },
    playstation: { type: String },
    xbox: { type: String },
    steam: { type: String },
  },
  isPrivate: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

// Authentication Middleware
const authMiddleware = (req: Request, res: Response, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Authentication Routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// Protected Route Example
app.get("/api/users/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.body.user.id).select("-password");
  res.json(user);
});

// Profile Update Route
app.put("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password updates via this route
    const user = await User.findByIdAndUpdate(req.body.user.id, updates, { new: true, runValidators: true }).select("-password");
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Password Change Route
app.put("/api/auth/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.body.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
});

export default app;