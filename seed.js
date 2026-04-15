const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hospital_db";

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        const adminExists = await User.findOne({ email: 'admin@medflow.com' });
        if (adminExists) {
            console.log("Admin already exists!");
            process.exit();
        }

        const admin = new User({
            name: 'Dr. John Admin',
            email: 'admin@medflow.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        await admin.save();
        console.log("Admin user created successfully!");
        console.log("Email: admin@medflow.com");
        console.log("Password: adminpassword123");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedAdmin();
