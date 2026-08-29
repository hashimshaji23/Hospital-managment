import jwt from "jsonwebtoken"
import Doctor from "../models/Doctor.js"

const JWT_SECRET = process.env.JWT_SECRET;

// Allows two kinds of callers through to doctor update/toggle routes:
//  1. An admin (User with role "admin") — can manage any doctor.
//  2. The doctor themselves (Doctor JWT, role "doctor") — can only manage their own record.
export default async function adminOrDoctorAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token missing."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        if (payload.role === "admin") {
            req.isAdmin = true;
            return next();
        }

        if (payload.role !== "doctor") {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        const doctor = await Doctor.findById(payload.id).select("-password");
        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Doctor not found"
            });
        }
        req.doctor = doctor;
        return next();
    } catch (err) {
        console.error("adminOrDoctorAuth JWT verification failed:", err);
        return res.status(401).json({
            success: false,
            message: "Token invalid or missing or expired"
        });
    }
}
