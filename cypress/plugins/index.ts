import { defineConfig } from "cypress";
import mongoose from "mongoose";
import User from "../../server/src/models/User";
import bcrypt from "bcryptjs";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        async registerTestUser() {
          if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not set in environment.");
          }

          await mongoose.connect(process.env.MONGO_URI);

          const existing = await User.findOne({ email: "test@example.com" });
          if (!existing) {
            const password = await bcrypt.hash("password123", 10);
            await User.create({
              username: "testuser",
              email: "test@example.com",
              password,
            });
            console.log("✅ Test user registered.");
          } else {
            console.log("⚠️ Test user already exists.");
          }

          await mongoose.disconnect();
          return null;
        },
      });
    },
  },
});
