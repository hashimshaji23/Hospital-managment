
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

const allowedOrgins = [
  "http://localhost:5173",
  "http://localhost:5174"
]
app.use(
  cors({
    origin: function (orgin, callback) {
      if (!orgin) return callback(null, true);
      if (allowedOrgins.includes(orgin)) {
        return callback(null, true)
      }
      return callback(new Error("Not allowed CORS"));
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