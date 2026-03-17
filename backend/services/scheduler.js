import cron from 'node-cron';
import { campaignModel } from '../models/campaignModel.js';

/**
 * Automatically deactivates campaigns that have passed their deadline.
 * Runs every hour to ensure platform hygiene.
 */
export const initCampaignScheduler = () => {
    // Schedule check every hour: '0 * * * *'
    // For testing and high responsiveness, we can run it every 15 minutes: '*/15 * * * *'
    cron.schedule('*/15 * * * *', async () => {
        console.log('🕒 Running auto-deactivation check for expired campaigns...');
        try {
            const now = new Date();
            
            // Find all active campaigns where the deadline has passed
            const result = await campaignModel.updateMany(
                {
                    status: true,
                    deadline: { $lt: now }
                },
                {
                    $set: { status: false }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Automatically deactivated ${result.modifiedCount} expired campaigns.`);
            } else {
                console.log('ℹ️ No expired campaigns found to deactivate.');
            }
        } catch (error) {
            console.error('❌ Error during campaign auto-deactivation:', error);
        }
    });
    
    console.log('🚀 Campaign deactivation scheduler initialized (Every 15 minutes)');
};
