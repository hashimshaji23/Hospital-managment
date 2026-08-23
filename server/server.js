// This is the main file that starts our backend server.

import "dotenv/config"; // loads variables from .env file
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

// create the express app
const app = express();

// middleware (functions that run on every request)

// Only allow requests coming from our React app's address.
// Vite's default dev server runs on http://localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json()); // allows us to read JSON data sent in requests

// routes - any request starting with these paths goes to the matching file
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);

// a simple test route to check the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running fine!" });
});

// get the port and database URL from our .env file
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// first connect to the database, then start the server
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error.message);
  });
