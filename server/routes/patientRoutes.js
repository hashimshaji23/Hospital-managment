// This file connects URLs (routes) to the functions in patientController.js

import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// "protect" checks the user is logged in
// "authorize(...)" checks the user has the right role

// POST /api/patients -> create a patient (only receptionist or admin)
router.post("/", protect, authorize("receptionist", "admin"), createPatient);

// GET /api/patients -> get all patients (staff only)
router.get("/", protect, authorize("receptionist", "doctor", "nurse", "admin"), getAllPatients);

// GET /api/patients/:id -> get one patient
router.get("/:id", protect, authorize("receptionist", "doctor", "nurse", "admin"), getPatientById);

// PUT /api/patients/:id -> update a patient
router.put("/:id", protect, authorize("receptionist", "admin"), updatePatient);

// DELETE /api/patients/:id -> delete a patient
router.delete("/:id", protect, authorize("admin"), deletePatient);

export default router;
