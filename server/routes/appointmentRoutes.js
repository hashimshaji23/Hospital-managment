import express from "express";
import requireClerkAuth from "../middleware/clerkAuth.js";

import { cancelAppointment, confirmPayment, creatAppointment, getAppointments, getAppointmentsByDoctor, getAppointmentsByPatient, getRegisterUserCount, getStats, updateAppointment } from "../controllers/AppointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary", getStats);


// Authentic routes

appointmentRouter.post("/", requireClerkAuth, creatAppointment);
appointmentRouter.get("/me", requireClerkAuth, getAppointmentsByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentsByDoctor);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/paitents/count", getRegisterUserCount);
appointmentRouter.put("/:id", updateAppointment);

export default appointmentRouter;