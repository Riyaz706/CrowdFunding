import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { userModel } from "./models/userModel.js";
import { config } from "dotenv";

config();

const seedAdmin = async () => {
  try {
    if (!process.env.DB_URL) {
      console.error("DB_URL is not defined in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = "admin@crowdflow.com";
    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcryptjs.hash("admin123", 10);

    const adminUser = new userModel({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN"
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("------------------------------");
    console.log("Email: admin@crowdflow.com");
    console.log("Password: admin123");
    console.log("------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
