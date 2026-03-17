import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [4, "First name should be at least 4 characters long"]
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]    },
    // Manual Reference to Campaigns created by this user
    campaigns: [{
        type: Schema.Types.ObjectId,
        ref: "Campaign"
    }],
    // Manual Reference to Donations made by this user
    donations: [{
        type: Schema.Types.ObjectId,
        ref: "Donation"
    }],
    isActive:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
}, {
    timestamps: true,
    versionKey: false
});

export const userModel = mongoose.models.User || model("User", userSchema);