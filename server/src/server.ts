import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cron from "node-cron";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import adminResolvers from "./graphql/resolvers/adminResolvers";
import { createContext } from "./utils/context";
import { sendDailyModerationSummary } from "./utils/moderationUtils";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schedule daily moderation summary
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily moderation summary email...");
  await sendDailyModerationSummary();
});

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers: [resolvers, adminResolvers],
  context: createContext,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return error;
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false });

  // Global error handler
  app.use(errorHandler);

  const serverInstance = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} with GraphQL at /graphql`)
  );

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down...");
    await mongoose.connection.close();
    serverInstance.close(() => {
      console.log("Server closed.");
    });
  });
}

startServer();

export default app;
