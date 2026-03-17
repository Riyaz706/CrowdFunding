import cookieParser from "cookie-parser";
import exp from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
config();
import cors from "cors";
import userApp from "./routes/userApi.js";
import adminApp from "./routes/AdminApi.js";
import commonApp from "./routes/commonApp.js";
import { donationModel } from "./models/donationModel.js";  
import { initCampaignScheduler } from "./services/scheduler.js";

// create the server
const app = exp();

// middlewares
app.use(exp.json({
    verify: (req, res, buf) => {
        if (req.originalUrl?.includes('/webhook')) {
            req.rawBody = buf;
            console.log(`📦 Captured rawBody for: ${req.originalUrl} (${buf.length} bytes)`);
        }
    }
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? [process.env.FRONTEND_URL] 
        : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"],
    credentials: true
}));

const connection = async() => {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("DB connected successfully");
        initCampaignScheduler();
    } catch(err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        // Do not block app.listen if DB fails; let Render detect the open port
    }
}

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    app.use(exp.static(path.join(__dirname, "../frontend/dist")));
    
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/user-api") && !req.path.startsWith("/admin-api") && !req.path.startsWith("/common-api")) {
            res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
        }
    });
}

// Health check for deployment
app.get("/health", (req, res) => res.status(200).send("OK"));

// Start the server
const port = process.env.PORT || 3000;
console.log(`📡 Attempting to start server on port ${port}...`);

app.listen(port, "0.0.0.0", () => {
    console.log(`✅ App is listening on Port ${port}`);
    connection().catch(err => console.error("Critical DB failure:", err));
});

// routes to redirect
app.use("/user-api",userApp);
app.use("/admin-api",adminApp);
app.use("/common-api",commonApp);

// error handling
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});