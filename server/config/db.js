import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

// first connect to the database, then start the server
const connection = () => {
    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("Connected to MongoDB successfully");
        })
        .catch((error) => {
            console.log("Failed to connect to MongoDB:", error.message);
        });
}

export default connection;