"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const node_cron_1 = __importDefault(require("node-cron"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const adminResolvers_1 = __importDefault(require("./graphql/resolvers/adminResolvers"));
const context_1 = require("./utils/context");
const moderationUtils_1 = require("./utils/moderationUtils");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
// Schedule daily moderation summary
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("Running daily moderation summary email...");
    await (0, moderationUtils_1.sendDailyModerationSummary)();
});
// Apollo Server setup
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers: [resolvers_1.default, adminResolvers_1.default],
    context: context_1.createContext,
    formatError: (error) => {
        console.error("GraphQL Error:", error);
        return error;
    },
});
async function startServer() {
    await server.start();
    server.applyMiddleware({ app, cors: false });
    // Global error handler
    app.use(errorHandler_1.errorHandler);
    const serverInstance = app.listen(PORT, () => console.log(`Server running on port ${PORT} with GraphQL at /graphql`));
    // Graceful shutdown
    process.on("SIGTERM", async () => {
        console.log("SIGTERM received, shutting down...");
        await mongoose_1.default.connection.close();
        serverInstance.close(() => {
            console.log("Server closed.");
        });
    });
}
startServer();
exports.default = app;
