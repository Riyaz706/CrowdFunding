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
        let newUserDoc = await register(req.body);
        res.status(201).json({message:"user created successfull", payload: newUserDoc});
    } catch (err) {
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
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: '/'
        })
        // send res
        res.status(201).json({ message: "user login success" , payload:user})
    } catch (err) {
        next(err);
    }
})

import { verifyToken } from "../controllers/verifyToken.js";

// verify auth (token based)
commonApp.get("/verify-auth", verifyToken("USER", "ADMIN"), async (req, res) => {
    res.status(200).json({ message: "Authenticated", payload: req.user });
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

// logout
commonApp.post("/logout",async(req,res)=> {
    res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        
    });
    res.status(200).json({message:"logout successful"});
})
