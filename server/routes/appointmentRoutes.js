import express from "express";
import { clerkMiddleware } from "@clerk/express";

import { cancelAppointment, confirmPayment, creatAppointment, getAppointments, getAppointmentsByDoctor, getAppointmentsByPatient, getRegisterUserCount, getStats, updateAppointment } from "../controllers/AppointmentController.js";
import { requireAuth } from "@clerk/clerk-sdk-node";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary", getStats);


// Authentic routes

appointmentRouter.post("/", clerkMiddleware(), requireAuth(), creatAppointment);
appointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getAppointmentsByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentsByDoctor);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/paitents/count", getRegisterUserCount);
appointmentRouter.put("/:id", updateAppointment);

export default appointmentRouter;