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
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret || webhookSecret.includes('mock')) {
            console.warn("⚠️ Warning: STRIPE_WEBHOOK_SECRET is missing or using a mock value.");
        }

        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error("❌ Webhook Signature Verify Failed:", err.message);
        console.log(`💡 Tip: Ensure your .env matching the secret from 'stripe listen'`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object;
        const { campaignId, donorId, description } = intent.metadata;
        const amount = intent.amount_received / 100;

        console.log(`🔍 Webhook processing succeeded payment: ${intent.id}`);
        console.log(`📦 Metadata: campaignId=${campaignId}, donorId=${donorId}`);

        try {
            // Check if this donation was already processed (Idempotency)
            const existingDonation = await donationModel.findOne({ transactionId: intent.id });
            if (existingDonation && existingDonation.paymentStatus === 'success') {
                console.log(`ℹ️ Donation ${intent.id} already processed. Skipping.`);
                return res.json({ received: true });
            }

            // 1. Create or Update the Donation document
            const donationDoc = await donationModel.findOneAndUpdate(
                { transactionId: intent.id },
                {
                    donor: donorId,
                    amount: amount,
                    campaign: campaignId,
                    description: description || '',
                    paymentStatus: 'success',
                    transactionId: intent.id
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Donation doc saved: ${donationDoc._id}`);

            // 2. Atomically update the campaign
            const campaignUpdate = await campaignModel.findByIdAndUpdate(
                campaignId,
                {
                    $addToSet: { donations: donationDoc._id },
                    $inc: { raisedAmount: amount }
                },
                { new: true }
            );
            console.log(`📈 Campaign updated. New raisedAmount: ${campaignUpdate?.raisedAmount}`);

            // 3. Update the user's donation history
            const userUpdate = await userModel.findByIdAndUpdate(
                donorId,
                {
                    $addToSet: { donations: donationDoc._id }
                },
                { new: true }
            );
            console.log(`👤 User history updated for: ${userUpdate?.email}`);

            console.log(`✅ Donation of ₹${amount} fully processed.`);
        } catch (dbErr) {
            console.error("❌ Database update failed for successful payment:", dbErr);
            return res.status(500).json({ message: "Database update failed" });
        }
    } else if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object;
        console.log(`⚠️ Payment failed: ${intent.id} - ${intent.last_payment_error?.message}`);
        const { campaignId, donorId } = intent.metadata;
        const amount = intent.amount / 100;
        const errorMessage = intent.last_payment_error?.message || 'Payment failed';

        try {
            await donationModel.findOneAndUpdate(
                { transactionId: intent.id },
                {
                    donor: donorId,
                    amount: amount,
                    campaign: campaignId,
                    description: `Failure: ${errorMessage}`,
                    paymentStatus: 'failed',
                    transactionId: intent.id
                },
                { upsert: true }
            );
            console.log(`⚠️ Payment attempt failed: ${errorMessage}`);
        } catch (dbErr) {
            console.error("❌ Failed to record payment failure:", dbErr);
        }
    }
    res.json({ received: true });
};

// Fallback verification for when webhooks are blocked (Self-healing)
export const verifyPaymentStatus = async (req, res) => {
    const { paymentIntentId } = req.params;
    const donorId = req.user.userId;

    try {
        console.log(`🔍 Manually verifying payment: ${paymentIntentId}`);
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (intent.status !== 'succeeded') {
            return res.status(400).json({ status: intent.status, message: "Payment not succeeded yet." });
        }

        const { campaignId, donorId: metadataDonorId, description } = intent.metadata;
        const amount = intent.amount_received / 100;

        // Security Check: Ensure the user verifying is the one who donated
        if (metadataDonorId !== donorId) {
            return res.status(403).json({ message: "Unauthorized verification attempt." });
        }

        // Check if already processed
        const existingDonation = await donationModel.findOne({ transactionId: paymentIntentId });
        if (existingDonation && existingDonation.paymentStatus === 'success') {
            return res.json({ success: true, message: "Handled by webhook or previous check.", donation: existingDonation });
        }

        // Process exactly like a successful webhook
        const donationDoc = await donationModel.findOneAndUpdate(
            { transactionId: paymentIntentId },
            {
                donor: donorId,
                amount: amount,
                campaign: campaignId,
                description: description || '',
                paymentStatus: 'success',
                transactionId: paymentIntentId
            },
            { upsert: true, new: true }
        );

        await campaignModel.findByIdAndUpdate(campaignId, {
            $addToSet: { donations: donationDoc._id },
            $inc: { raisedAmount: amount }
        });

        await userModel.findByIdAndUpdate(donorId, {
            $addToSet: { donations: donationDoc._id }
        });

        console.log(`✅ Manual verification successful for ₹${amount}`);
        res.json({ success: true, donation: donationDoc });

    } catch (error) {
        console.error("❌ Verification failed:", error.message);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};