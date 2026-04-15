const path = require('path');
const backendPath = path.join(__dirname, 'backend');
const mongoose = require(path.join(backendPath, 'node_modules', 'mongoose'));
const User = require(path.join(backendPath, 'models', 'User'));
require('dotenv').config({ path: path.join(backendPath, '.env') });

const MONGO_URI = "mongodb://127.0.0.1:27017/medflow_db";

async function forceCreateAdmin() {
    console.log("Starting force seed (Shared Mongoose Instance Check)...");
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");

        const deleted = await User.deleteMany({ email: 'admin@medflow.com' });
        console.log("Deleted old admins:", deleted.deletedCount);

        const admin = new User({
            name: 'Dr. John Admin',
            email: 'admin@medflow.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        await admin.save();
        console.log("Admin user created successfully!");
        
        await mongoose.disconnect();
        console.log("Disconnected.");
        process.exit(0);
    } catch (err) {
        console.error("Critical Error:", err);
        process.exit(1);
    }
}

forceCreateAdmin();
