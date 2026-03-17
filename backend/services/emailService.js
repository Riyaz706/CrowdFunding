import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

// Create a transporter using SMTP
// For production, use service like Gmail, Sendgrid, etc.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === "465", // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send a welcome email to a new user
 */
export const sendWelcomeEmail = async (userEmail, name) => {
    const mailOptions = {
        from: `"CrowdFunding Team" <${process.env.EMAIL_FROM}>`,
        to: userEmail,
        subject: 'Welcome to CrowdFunding!',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h1 style="color: #1a1a1a;">Welcome, ${name}!</h1>
                <p style="color: #666; line-height: 1.6;">
                    Thank you for joining our platform. We're excited to have you as part of our community of changemakers.
                </p>
                <p style="color: #666; line-height: 1.6;">
                    Start exploring projects or create your own movement today!
                </p>
                <div style="margin-top: 30px;">
                    <a href="http://localhost:5173/campaigns" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Projects</a>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email sent to: ${userEmail}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
    }
};

/**
 * Send a donation receipt to the donor
 */
export const sendDonationReceipt = async (donorEmail, amount, campaignTitle) => {
    const mailOptions = {
        from: `"CrowdFunding Receipt" <${process.env.EMAIL_FROM}>`,
        to: donorEmail,
        subject: 'Donation Receipt - Thank You!',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #1a1a1a;">Thank you for your donation!</h2>
                <p style="color: #666; line-height: 1.6;">
                    You have successfully contributed <strong>₹${amount}</strong> to the campaign: <strong>${campaignTitle}</strong>.
                </p>
                <p style="color: #666; line-height: 1.6;">
                    Your support helps bring important projects to life.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999;">This is an automated receipt for your records.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Receipt sent to: ${donorEmail}`);
    } catch (error) {
        console.error('❌ Error sending receipt:', error);
    }
};

/**
 * Notify the campaign creator about a new donation
 */
export const sendCreatorNotification = async (creatorEmail, donorName, amount, campaignTitle) => {
    const mailOptions = {
        from: `"CrowdFunding Alert" <${process.env.EMAIL_FROM}>`,
        to: creatorEmail,
        subject: 'New Donation Received!',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #1a1a1a;">Great news!</h2>
                <p style="color: #666; line-height: 1.6;">
                    <strong>${donorName}</strong> just donated <strong>₹${amount}</strong> to your campaign: <strong>${campaignTitle}</strong>.
                </p>
                <p style="color: #666; line-height: 1.6;">
                    Your project is moving closer to its goal!
                </p>
                <div style="margin-top: 30px;">
                    <a href="http://localhost:5173/donor-tracking" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Notification sent to creator: ${creatorEmail}`);
    } catch (error) {
        console.error('❌ Error sending creator notification:', error);
    }
};
