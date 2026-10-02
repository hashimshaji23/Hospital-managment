import express from "express";
import requireClerkAuth from "../middleware/clerkAuth.js";

import { cancelServiceAppointment, confirmServicePayment, createServiceAppointment, getServiceAppointmentById, getServiceAppointmentByPatient, getServiceAppointments, getServiceAppointmentStats, updateServiceAppointment } from "../controllers/serviceAppointmentController.js";

const serviceAppointmentRouter = express.Router()

serviceAppointmentRouter.get("/", getServiceAppointments);
serviceAppointmentRouter.get("/confirm", confirmServicePayment);
serviceAppointmentRouter.get("/stats/summary", getServiceAppointmentStats);

serviceAppointmentRouter.post("/", requireClerkAuth, createServiceAppointment);

serviceAppointmentRouter.get("/me", requireClerkAuth, getServiceAppointmentByPatient);

serviceAppointmentRouter.get("/:id", getServiceAppointmentById);
serviceAppointmentRouter.put("/:id", updateServiceAppointment);
serviceAppointmentRouter.post("/:id/cancel", cancelServiceAppointment);

export default serviceAppointmentRouter;