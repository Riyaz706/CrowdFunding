import exp from "express";
import { campaignModel } from "../models/campaignModel.js";
import { createPaymentIntent, handleWebhook } from "../Controllers/paymentController.js";
import { verifyToken } from "../controllers/verifyToken.js";
import { donationModel } from "../models/donationModel.js";

const userApp = exp.Router();
export default userApp;

// route to view all the campaigns(public)
userApp.get("/campaigns",async(req,res)=>{
    let campaignData = await campaignModel.find({status:true});
    if(!campaignData){
        return res.status(404).json({message:"campaign are not available"})
    }
    return res.status(201).json({message:"campaigns loaded successfully",payload:campaignData});
})

// create campaign(protected)
userApp.post("/create-campaign",verifyToken("USER"), async (req, res) => {
    let newCampaign = new campaignModel(req.body);
    let savedCampaign = await newCampaign.save();
    return res.status(201).json({
        message: "campaign created successfully",
        payload: savedCampaign
    });
});



// Protected route: user must be logged in to donate(Frontend requests the payment intent)
userApp.post("/create-payment-intent", verifyToken("USER"), createPaymentIntent);


// Stripe hits this endpoint when the payment succeeds
// Note: express.raw() is critical for signature verification
userApp.post('/webhook', exp.raw({ type: 'application/json' }), handleWebhook);

// route to get details of campaign by id
userApp.get("/campaign/:id", async (req, res) => {
    let campaign = await campaignModel.findOne({_id:req.params.id,status:true});
    if (!campaign) {
        return res.status(404).json({
            message: "campaign not found"
        });
    }
    return res.status(200).json({
        message: "campaign retrieved successfully",
        payload: campaign
    });
});
// route to get the details of donors of a campaign by id
userApp.get("/campaign-history/:campaignId",verifyToken("USER"),async(req,res)=>{
    let campaignId = req.params.campaignId;
    const donorsDoc = await campaignModel
            .findOne({ _id: campaignId, status: true })
            .populate({
                path: 'donations', // The field in your campaign schema
                populate: {
                    path: 'donor', // The donor field inside the donation document
                    select: 'firstName email'
                }
            });
    if(!donorsDoc){
        return res.status(401).json({message:"donors not found"})
    }
    return res.status(201).json({message:"donors retrieved succesfully",payload:donorsDoc.donations})
})
