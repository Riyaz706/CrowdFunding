import exp from "express";
import { campaignModel } from "../models/campaignModel.js";
import { userModel } from "../models/userModel.js";
import { verifyToken } from "../controllers/verifyToken.js";

const adminApp = exp.Router();
export default adminApp;

// access all pending campaigns for approval
adminApp.get("/pending-campaigns", verifyToken("ADMIN"), async(req,res)=>{
    let campaignData = await campaignModel.find({status:false}).populate('creator', 'firstName email');
    if(!campaignData || campaignData.length === 0){
        return res.status(200).json({message:"No pending campaigns found", payload: []})
    }
    return res.status(200).json({message:"Pending campaigns loaded successfully", payload: campaignData});
})

// publish or unpublish campaigns by id(protected)
adminApp.put("/campaign/:campaignId",verifyToken("ADMIN"),async(req,res)=>{
    let campaignId = req.params.campaignId;
    let campaignDoc = await campaignModel.findOneAndUpdate({_id:campaignId},{$set:{status:req.body.status}},{new:true});
    if(!campaignDoc){
        return res.status(404).json({message:"campaign not found"});
    }
    return res.status(201).json({message:"campaign published successfully",payload:campaignDoc});
})


// block or unblock users
adminApp.put("/user/:userId",verifyToken("ADMIN"),async(req,res)=>{
    let userId = req.params.userId;
    let userDoc = await userModel.findOneAndUpdate({_id:userId},{$set:{isActive:req.body.status}},{new:true});
    if(!userDoc){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json({message:"User status updated successfully",payload:userDoc});
})
