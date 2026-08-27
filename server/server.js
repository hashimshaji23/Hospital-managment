
import "dotenv/config"; // loads variables from .env file
import express from "express";
import connection from "./config/db.js";
import cors from "cors";

import { clerkMiddleware } from '@clerk/express'
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import serviceRouter from "./routes/ServiceRouter.js";
import appointmentRouter from "./routes/appointmentRoutes.js";

// create the express app
const app = express();
connection()

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
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);

// a simple test route to check the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running fine!" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});