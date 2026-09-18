
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
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";

// create the express app
const app = express();
connection()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL_
].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app") ||
        cleanOrigin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }),
);

app.use(express.json()); // allows us to read JSON data sent in requests

// routes - any request starting with these paths goes to the matching file
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

// a simple test route to check the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running fine!" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});