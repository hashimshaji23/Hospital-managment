
import express from "express";
import multer from "multer";
import {
  createDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctors,
  doctorLogin,
  toggleAvilability,
} from "../controllers/doctorController.js";
// import { authorize } from "../middleware/authMiddleware.js";
import adminOrDoctorAuth from "../middleware/adminOrDoctorAuth.js";

const router = express.Router();

const upload = multer({ dest: "/tmp" });

// anyone can view doctors (no login needed - patients need to browse doctors)
router.get("/", getDoctors);
router.post("/login", doctorLogin)
router.get("/:id", getDoctorById);

// only admin can add, update, or delete doctors
router.post("/", upload.single("image"), createDoctor)
// router.post("/", protect, authorize("admin"), doctorLogin);
router.post("/:id/toggle-availability", adminOrDoctorAuth, toggleAvilability)
router.put("/:id", adminOrDoctorAuth, upload.single("image"), updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
