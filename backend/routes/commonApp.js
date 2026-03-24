import exp from "express";
import { userModel } from "../models/userModel.js";
import {hash} from "bcrypt"
import { authentication, register } from "../services/authService.js";
import { campaignModel } from "../models/campaignModel.js";
import { donationModel } from "../models/donationModel.js";

const commonApp = exp.Router();
export default commonApp;

// register user(public)
commonApp.post("/register",async(req,res,next)=>{
    try {
        console.log("📝 Registration attempt body:", req.body);
        let newUserDoc = await register(req.body);
        res.status(201).json({message:"user created successfull", payload: newUserDoc});
    } catch (err) {
        console.error("❌ Registration Error:", err);
        next(err);
    }
})

// authenticated user or admin(public)
commonApp.post("/login",async(req,res,next)=>{
    try {
        // get user credentials obj
        let userCred = req.body;
        // call authenticate service
        let { token, user } = await authentication(userCred);
        // save token as httpOnly
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
            path: '/'
        })
        // send res
        res.status(201).json({ message: "user login success" , payload:user})
    } catch (err) {
        next(err);
    }
})

import { verifyToken } from "../middleware/verifyToken.js";

// verify auth (token based)
commonApp.get("/verify-auth", verifyToken("USER", "ADMIN"), async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "User is blocked" });
        }
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({ message: "Authenticated", payload: userObj });
    } catch (error) {
        res.status(500).json({ message: "Auth verification failed", error: error.message });
    }
});

// Global Stats
commonApp.get("/stats", async (req, res) => {
    try {
        const campaigns = await campaignModel.find({ status: true });
        const totalRaised = campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);
        const totalCampaigns = campaigns.length;
        
        // Count unique donors from successful donations
        const donations = await donationModel.find({ paymentStatus: 'success' });
        const uniqueDonors = new Set(donations.map(d => d.donor?.toString())).size;

        return res.status(200).json({
            message: "Global stats loaded",
            payload: {
                totalRaised,
                totalCampaigns,
                totalDonors: uniqueDonors
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load stats", error: error.message });
    }
});

// logout (allow both GET and POST for convenience)
commonApp.all("/logout", async (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: '/'
    });
    res.status(200).json({ message: "logout successful" });
});
