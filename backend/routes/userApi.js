import exp from "express";
import { campaignModel } from "../models/campaignModel.js";
import { createPaymentIntent, handleWebhook, verifyPaymentStatus } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { donationModel } from "../models/donationModel.js";

const userApp = exp.Router();
export default userApp;

// route to view all the campaigns(public)
userApp.get("/campaigns", async (req, res) => {
    const now = new Date();
    let campaignData = await campaignModel.find({ 
        status: true,
        deadline: { $gt: now }
    }).populate('creator', 'firstName lastName email');
    if (!campaignData || campaignData.length === 0) {
        return res.status(404).json({ message: "campaigns are not available or have ended" })
    }
    return res.status(201).json({message:"campaigns loaded successfully",payload:campaignData});
})

// create campaign(protected)
userApp.post("/create-campaign", verifyToken("USER"), async (req, res) => {
    try {
        // Automatically set the creator from the authenticated user token
        const campaignData = {
            ...req.body,
            creator: req.user.userId
        };
        
        const newCampaign = new campaignModel(campaignData);
        const savedCampaign = await newCampaign.save();
        
        return res.status(201).json({
            message: "campaign created successfully",
            payload: savedCampaign
        });
    } catch (error) {
        console.error("Error creating campaign:", error);
        return res.status(500).json({
            message: "Failed to create campaign",
            error: error.message
        });
    }
});



// Protected route: user must be logged in to donate(Frontend requests the payment intent)
userApp.post("/create-payment-intent", verifyToken("USER"), createPaymentIntent);

// Protected route: user must be logged in to verify payment status
userApp.get("/verify-payment/:paymentIntentId", verifyToken("USER"), verifyPaymentStatus);

// Stripe hits this endpoint when the payment succeeds
// Note: express.raw() is critical for signature verification
userApp.post('/webhook', handleWebhook);

// route to get details of campaign by id
userApp.get("/campaign/:id", async (req, res) => {
    let campaign = await campaignModel.findOne({
        _id: req.params.id
    }).populate('creator', 'firstName lastName email');
    if (!campaign) {
        return res.status(404).json({
            message: "campaign not found or has expired"
        });
    }
    return res.status(200).json({
        message: "campaign retrieved successfully",
        payload: campaign
    });
});
// route to get the details of donors of a campaign by id
userApp.get("/campaign-history/:campaignId", verifyToken("USER"), async (req, res) => {
    let campaignId = req.params.campaignId;
    const donorsDoc = await campaignModel
            .findOne({ _id: campaignId })
            .populate({
                path: 'donations', // The field in your campaign schema
                populate: {
                    path: 'donor', // The donor field inside the donation document
                    select: 'firstName lastName email'
                }
            });
    if(!donorsDoc){
        return res.status(401).json({message:"donors not found"})
    }
    return res.status(201).json({message:"donors retrieved succesfully",payload:donorsDoc.donations})
})

// route to get campaigns created by the logged-in user
userApp.get("/my-campaigns", verifyToken("USER"), async (req, res) => {
    try {
        const userId = req.user.userId;
        const myCampaigns = await campaignModel.find({ creator: userId })
            .populate({
                path: 'donations',
                populate: { path: 'donor', select: 'firstName lastName email' }
            })
            .sort({ createdAt: -1 });
        
        // Calculate summaries
        const totalRaised = myCampaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);
        const totalDonationsReceived = myCampaigns.reduce((acc, c) => acc + (c.donations?.length || 0), 0);

        return res.status(200).json({
            message: "Your campaigns loaded successfully",
            payload: myCampaigns,
            summary: {
                totalRaised,
                totalDonationsReceived,
                totalCampaigns: myCampaigns.length
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load your campaigns", error: error.message });
    }
});

// route to get donations made by the logged-in user (Sent Donations)
userApp.get("/my-donations", verifyToken("USER"), async (req, res) => {
    try {
        const userId = req.user.userId;
        const myDonations = await donationModel.find({ donor: userId })
            .populate('campaign', 'title status')
            .sort({ createdAt: -1 });
        
        // Calculate summaries
        const totalDonated = myDonations.reduce((acc, d) => d.paymentStatus === 'success' ? acc + d.amount : acc, 0);

        return res.status(200).json({
            message: "Your donations loaded successfully",
            payload: myDonations,
            summary: {
                totalDonated,
                totalDonationsMade: myDonations.length
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load your donations", error: error.message });
    }
});

// route to get donations RECEIVED by the logged-in user's campaigns
userApp.get("/received-donations", verifyToken("USER"), async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // 1. Find all campaigns created by this user
        const userCampaigns = await campaignModel.find({ creator: userId }).select('_id');
        const campaignIds = userCampaigns.map(c => c._id);
        
        // 2. Find all donations linked to those campaigns
        const receivedDonations = await donationModel.find({ campaign: { $in: campaignIds } })
            .populate('donor', 'firstName lastName email')
            .populate('campaign', 'title')
            .sort({ createdAt: -1 });

        // Calculate total received across all campaigns
        const totalReceived = receivedDonations.reduce((acc, d) => d.paymentStatus === 'success' ? acc + d.amount : acc, 0);

        return res.status(200).json({
            message: "Received donations loaded successfully",
            payload: receivedDonations,
            summary: {
                totalReceived,
                totalDonationsCount: receivedDonations.length
            }
        });
    } catch (error) {
        console.error("Error fetching received donations:", error);
        return res.status(500).json({ message: "Failed to load received donations", error: error.message });
    }
});
