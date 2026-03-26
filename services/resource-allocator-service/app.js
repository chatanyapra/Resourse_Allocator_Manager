import express from "express";
import cors from "cors";
import podRoutes from "./routes/pod.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Enable CORS for cross-service communication
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Health check endpoint (public)
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "resource-allocator-service" });
});

// API routes
app.use("/api/pod", podRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;