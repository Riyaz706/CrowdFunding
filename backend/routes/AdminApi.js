import exp from "express";
import { campaignModel } from "../models/campaignModel.js";
import { verifyToken } from "../controllers/verifyToken.js";

const adminApp = exp.Router();
export default adminApp;

// access all the campaigns
adminApp.get("/campaigns",async(req,res)=>{
    let campaignData = await campaignModel.find({status:true});
    if(!campaignData){
        return res.status(404).json({message:"campaign are not available"})
    }
    return res.status(201).json({message:"campaigns loaded successfully",payload:campaignData});
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
    let userDoc = await campaignModel.findOneAndUpdate({_id:userId},{$set:{status:req.body.status}},{new:true});
    if(!userDoc){
        return res.status(404).json({message:"campaign not found"});
    }
    return res.status(201).json({message:"campaign published successfully",payload:userDoc});
})
