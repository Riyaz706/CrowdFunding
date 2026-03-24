import exp from "express";
import { campaignModel } from "../models/campaignModel.js";
import { userModel } from "../models/userModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { donationModel } from "../models/donationModel.js";

const adminApp = exp.Router();
export default adminApp;

// access all donations on the platform
adminApp.get("/all-donations", verifyToken("ADMIN"), async(req,res)=>{
    try {
        const allDonations = await donationModel.find()
            .populate('donor', 'firstName lastName email')
            .populate('campaign', 'title')
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            message: "Global transaction history loaded",
            payload: allDonations
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load transactions", error: error.message });
    }
});

// access all pending campaigns for approval
adminApp.get("/pending-campaigns", verifyToken("ADMIN"), async(req,res)=>{
    let campaignData = await campaignModel.find({status:false}).populate('creator', 'firstName lastName email');
    if(!campaignData || campaignData.length === 0){
        return res.status(200).json({message:"No pending campaigns found", payload: []})
    }
    return res.status(200).json({message:"Pending campaigns loaded successfully", payload: campaignData});
})

// access all campaigns regardless of status
adminApp.get("/all-campaigns", verifyToken("ADMIN"), async(req,res)=>{
    try {
        const allCampaigns = await campaignModel.find()
            .populate('creator', 'firstName lastName email')
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            message: "All campaigns loaded successfully",
            payload: allCampaigns
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load campaigns", error: error.message });
    }
});

// update campaign by id (full edit and status toggle)
adminApp.put("/campaign/:campaignId", verifyToken("ADMIN"), async(req,res)=>{
    try {
        const campaignId = req.params.campaignId;
        const updateData = { ...req.body };
        
        const campaignDoc = await campaignModel.findByIdAndUpdate(
            campaignId,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );
        
        if(!campaignDoc){
            return res.status(404).json({message:"Campaign not found"});
        }
        
        return res.status(201).json({
            message: "Campaign updated successfully",
            payload: campaignDoc
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update campaign", error: error.message });
    }
})


// block or unblock users
adminApp.put("/user/:userId",verifyToken("ADMIN"),async(req,res)=>{
    let userId = req.params.userId;
    let userDoc = await userModel.findOneAndUpdate({_id:userId},{$set:{isActive:req.body.status}},{returnDocument: 'after'});
    if(!userDoc){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json({message:"User status updated successfully",payload:userDoc});
})
