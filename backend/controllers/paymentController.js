import Stripe from 'stripe';
import { config } from 'dotenv';
import { campaignModel } from '../models/campaignModel.js';
import { donationModel } from '../models/donationModel.js';
import { userModel } from '../models/userModel.js';
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim());

export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, campaignId } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Stripe amount is in subunits (e.g., paise for INR)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            description: 'Campaign Donation',
            metadata: {
                campaignId: campaignId,
                donorId: req.user.userId,
                description: req.body.description || '' // Capturing donor message
            },
            shipping: {
                name: req.user.firstName || 'Donor',
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                  },
              },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        console.error("Payment Intent Error:", err);
        res.status(500).json({ message: "Payment initialization failed", error: err.message });
    }
};


// function to update the db after payment
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        const body = req.rawBody || req.body;
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook Signature Verify Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object;
        const { campaignId, donorId, description } = intent.metadata;
        const amount = intent.amount_received / 100;

        try {
            // Check if this donation was already processed (Idempotency)
            const existingDonation = await donationModel.findOne({ transactionId: intent.id });
            if (existingDonation) {
                console.log(`ℹ️ Donation ${intent.id} already processed. Skipping.`);
                return res.json({ received: true });
            }

            // 1. Create the Donation document
            const newDonation = await donationModel.create({
                donor: donorId,
                amount: amount,
                campaign: campaignId,
                description: description || '',
                paymentStatus: 'success',
                transactionId: intent.id
            });

            // 2. Atomically update the campaign
            await campaignModel.findByIdAndUpdate(
                campaignId,
                {
                    $push: { donations: newDonation._id },
                    $inc: { raisedAmount: amount }
                }
            );

            // 3. Update the user's donation history
            await userModel.findByIdAndUpdate(
                donorId,
                {
                    $push: { donations: newDonation._id }
                }
            );

            console.log(`✅ Donation of ₹${amount} processed for campaign ${campaignId}`);
        } catch (dbErr) {
            console.error("❌ Database update failed for successful payment:", dbErr);
            // We return 500 so Stripe retries later if it was a transient DB error
            return res.status(500).json({ message: "Database update failed" });
        }
    }
    res.json({ received: true });
};