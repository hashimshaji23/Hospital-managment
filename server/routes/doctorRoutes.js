// This file connects URLs (routes) to the functions in doctorController.js

import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// anyone can view doctors (no login needed - patients need to browse doctors)
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

// only admin can add, update, or delete doctors
router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, authorize("admin"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

export default router;
