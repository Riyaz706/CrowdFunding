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
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"],
    credentials: true
}));

const connection = async() => {
    try{
        let connect = await mongoose.connect(process.env.DB_URL)
        console.log("DB connected successfully");
        app.listen(process.env.PORT, () => {
            console.log("App is listening on Port", process.env.PORT);
        });
    }catch(err){
        console.log(err.message);
    }
}

connection();

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