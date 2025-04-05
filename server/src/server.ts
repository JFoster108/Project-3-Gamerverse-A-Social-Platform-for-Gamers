import express, { Request, Response, NextFunction, Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
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
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://media.rawg.io", "https://via.placeholder.com"],
      "connect-src": ["'self'", "https://api.rawg.io"]
    }
  }
}));

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

// RAWG API proxy endpoints
const RAWG_API_KEY = process.env.RAWG_API_KEY || "f4489c2d5bec448384cd31c55ef03eae";

// Tags to exclude from results
const EXCLUDED_TAGS = [
  "sexual-content",
  "nudity",
  "nsfw",
  "adult",
  "mature",
  "hentai",
  "sexual",
  "porn"
];

app.get("/api/games", async (req: Request, res: Response) => {
  try {
    // Add safe content filters to any request
    const safeParams = {
      ...req.query,
      exclude_tags: EXCLUDED_TAGS.join(','),
      exclude_additions: true,
      key: RAWG_API_KEY
    };

    // Filter by ESRB rating if not already specified
    if (!safeParams.esrb_rating) {
      // Only get games with Everyone (1), Everyone 10+ (2), or Teen (3) ratings
      // ESRB rating IDs: 1=Everyone, 2=Everyone 10+, 3=Teen, 4=Mature, 5=Adults Only
      safeParams.esrb_rating = "1,2,3";
    }

    const response = await axios.get("https://api.rawg.io/api/games", {
      params: safeParams
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("RAWG API Error:", error);
    res.status(500).json({ error: "Failed to fetch games data" });
  }
});

// Similarly update the game details endpoint
app.get("/api/games/:id", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${req.params.id}`, {
      params: {
        key: RAWG_API_KEY
      }
    });
    
    // Check if the game has adult content tags
    const game = response.data;
    const hasMatureContent = game.tags?.some((tag: any) => 
      EXCLUDED_TAGS.includes(tag.slug || '')
    );
    
    if (hasMatureContent) {
      return res.status(403).json({ error: "Content not appropriate for all audiences" });
    }
    
    res.json(game);
  } catch (error) {
    console.error("RAWG API Error:", error);
    res.status(500).json({ error: "Failed to fetch game details" });
  }
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

  if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
  
    app.use(express.static(path.join(__dirname, "../client/dist")));
  
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
  }

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