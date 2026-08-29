// Creates (or promotes) an admin user so you can log into the Admin app.
//
// Usage:
//   node scripts/seedAdmin.js
//   node scripts/seedAdmin.js --email you@example.com --password yourPassword --name "Your Name"
//
// Defaults: admin@medicare.com / admin123

import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const email = getArg("email", "admin@medicare.com");
const password = getArg("password", "admin123");
const name = getArg("name", "Admin");

async function run() {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not set in .env");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URL);

    const existing = await User.findOne({ email });
    if (existing) {
        if (existing.role !== "admin") {
            existing.role = "admin";
            await existing.save();
            console.log(`User ${email} already existed — promoted to admin.`);
        } else {
            console.log(`Admin user ${email} already exists. Nothing to do.`);
        }
    } else {
        await User.create({ name, email, password, role: "admin" });
        console.log(`Created admin user:\n  email: ${email}\n  password: ${password}`);
    }

    await mongoose.disconnect();
}

run().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
