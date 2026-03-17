import mongoose from "mongoose";
const { Schema, model } = mongoose;

const campaignSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "campaign title is required"],
            minlength: [5, "title should be at least 5 characters"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "campaign description is required"]
        },
        goalAmount: {
            type: Number,
            required: [true, "goal amount is required"]
        },
        raisedAmount: {
            type: Number,
            default: 0
        },
        deadline: {
            type: Date,
            required: [true, "deadline is required"]
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User", // Must match userModel name
            required: true
        },
        // We keep this for quick lookups, but be cautious with large lists
        donations: [{
            type: Schema.Types.ObjectId,
            ref: "Donation"
        }],
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const campaignModel = mongoose.models.Campaign || model("Campaign", campaignSchema);