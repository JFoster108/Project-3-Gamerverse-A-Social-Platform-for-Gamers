import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import adminResolvers from "./graphql/resolvers/adminResolvers";
import { createContext } from "./utils/context";
import { errorHandler } from "./middleware/errorHandler";


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

// RAWG API proxy endpoints
const RAWG_API_KEY = process.env.RAWG_API_KEY;
if (!RAWG_API_KEY) {
  console.error("RAWG_API_KEY not found in environment variables");
  process.exit(1);
}

app.get("/api/games", async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        ...req.query,
        key: RAWG_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("RAWG API Error:", error);
    res.status(500).json({ error: "Failed to fetch games data" });
  }
});

app.get("/api/games/:id", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${req.params.id}`, {
      params: {
        key: RAWG_API_KEY
      }
    });
    res.json(response.data);
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