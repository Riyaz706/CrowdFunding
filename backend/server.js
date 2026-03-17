import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";

import userApp from "./routes/userApi.js";
import adminApp from "./routes/adminApi.js";
import commonApp from "./routes/commonApp.js";
import { initCampaignScheduler } from "./services/scheduler.js";

config();

const app = express();

/* =========================
   ✅ MIDDLEWARES
========================= */

// security headers
app.use(helmet());

// logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS (dynamic from env)
app.use(cors({
    origin: process.env.CLIENT_URL?.split(","),
    credentials: true
}));

// body parser (with webhook raw body support)
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl?.includes("/webhook")) {
            req.rawBody = buf;
        }
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   ✅ ROUTES
========================= */

app.use("/user-api", userApp);
app.use("/admin-api", adminApp);
app.use("/common-api", commonApp);

/* =========================
   ✅ HEALTH CHECK (IMPORTANT)
========================= */
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running"
    });
});

/* =========================
   ✅ ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);

    // mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message
        });
    }

    // mongoose cast error
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format"
        });
    }

    // duplicate key error
    const errCode = err.code ?? err?.cause?.code;
    const keyValue = err.keyValue ?? err?.cause?.keyValue;

    if (errCode === 11000) {
        const field = Object.keys(keyValue)[0];
        return res.status(409).json({
            message: `${field} already exists`
        });
    }

    // custom error
    if (err.status) {
        return res.status(err.status).json({
            message: err.message
        });
    }

    // fallback
    res.status(500).json({
        message: "Internal Server Error"
    });
});

/* =========================
   ✅ DATABASE + SERVER START
========================= */

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

        console.log("✅ MongoDB connected");

        // start scheduler AFTER DB connection
        initCampaignScheduler();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Failed to connect DB:", err.message);
        process.exit(1); // crash app (important for production)
    }
};

startServer();