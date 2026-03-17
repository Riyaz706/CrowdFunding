import mongoose from 'mongoose';
import { config } from 'dotenv';
import { donationModel } from './models/donationModel.js';
import { campaignModel } from './models/campaignModel.js';
import { userModel } from './models/userModel.js';

config();

const inspect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB for inspection.");

        const donationCount = await donationModel.countDocuments();
        console.log(`Total Donations in DB: ${donationCount}`);

        const lastDonations = await donationModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('donor', 'firstName email')
            .populate('campaign', 'title');

        console.log("--- Last 5 Donations ---");
        lastDonations.forEach(d => {
            console.log(`[${d.createdAt.toISOString()}] Amount: ₹${d.amount} | Status: ${d.paymentStatus} | Donor: ${d.donor?.email} | Campaign: ${d.campaign?.title} | TX: ${d.transactionId}`);
        });

        // Check for the specific transaction ID the user mentioned
        // clientSecret: pi_3TBowjGRDLiIRHOA3o1ByThH_... -> ID: pi_3TBowjGRDLiIRHOA3o1ByThH
        const specificId = "pi_3TBowjGRDLiIRHOA3o1ByThH";
        const specificDonation = await donationModel.findOne({ transactionId: specificId });
        if (specificDonation) {
            console.log(`\nFound specific donation for ${specificId}:`);
            console.log(JSON.stringify(specificDonation, null, 2));
        } else {
            console.log(`\n❌ Specific donation ${specificId} NOT FOUND in DB.`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Inspection failed:", err);
    }
};

inspect();
