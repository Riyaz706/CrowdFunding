import Stripe from 'stripe';
import { config } from 'dotenv';
import { campaignModel } from '../models/campaignModel.js';
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    const { amount, campaignId } = req.body;

    // Stripe amount is in subunits (e.g., paise for INR, cents for USD)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'inr',
        metadata: {
            campaignId: campaignId,
            donorId: req.user.userId // Coming from your verifyToken middleware
        }
    });

    if (!paymentIntent) {
        return res.status(500).json({ message: "Payment initialization failed", error: err.message });
    }
    res.status(200).json({
        clientSecret: paymentIntent.client_secret
    });
};


// function to update the db after payment
export const handleWebhook = async (req, res) => {
    // ... signature verification ...
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);


    if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object;
        const { campaignId, donorId } = intent.metadata;
        const amount = intent.amount_received / 100;

        // 1. Create the Donation document
        const newDonation = await Donation.create({
            donor: donorId,
            amount: amount,
            campaignId: campaignId
        });

        // 2. Atomically update the campaign
        // This pushes the new donation reference AND updates the total amount
        const updatedCampaign = await campaignModel.findByIdAndUpdate(
            campaignId,
            {
                $push: { donations: newDonation._id },
                $inc: { raisedAmount: amount }
            },
            { new: true } // Returns the document after update
        );

        console.log("Campaign updated with new donation:", updatedCampaign);
    }
    res.json({ received: true });
};