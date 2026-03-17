import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { campaignModel } from './models/campaignModel.js';

dotenv.config();

const sampleImages = [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?q=80&w=2026&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
];

const updateCampaigns = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB...");

        const campaigns = await campaignModel.find();
        console.log(`Found ${campaigns.length} campaigns. Updating...`);

        for (let i = 0; i < campaigns.length; i++) {
            const imageUrl = sampleImages[i % sampleImages.length];
            await campaignModel.findByIdAndUpdate(campaigns[i]._id, { imageUrl });
            console.log(`Updated campaign: ${campaigns[i].title}`);
        }

        console.log("All campaigns updated with sample images!");
        process.exit(0);
    } catch (error) {
        console.error("Error updating campaigns:", error);
        process.exit(1);
    }
};

updateCampaigns();
