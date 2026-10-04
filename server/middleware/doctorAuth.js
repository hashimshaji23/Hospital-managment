import jwt from "jsonwebtoken"
import Doctor from "../models/Doctor.js"

export default async function doctorAuth(req, res, next) {

    const authHeader = req.headers.authorization;

    // Check token

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Doctor not authorized , token missing."
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Admins are allowed to manage any doctor record.
        if (payload.role === "admin") {
            const targetId = req.params.id;
            const doctor = targetId ? await Doctor.findById(targetId).select("-password") : null;
            if (targetId && !doctor) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found"
                });
            }
            req.doctor = doctor;
            req.isAdmin = true;
            return next();
        }

        if (payload.role && payload.role !== "doctor") {
            return res.status(403).json({
                success: false,
                message: "Access Denied (not a doctor)"
            });
        }

        // Fetch doctor

        const doctor = await Doctor.findById(payload.id).select("-password");

        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Doctor not found"
            });
        }
        req.doctor = doctor;
        next();
    } catch (err) {
        console.error("Doctor JWT verification failed :", err)
        return res.status(401).json({
            success: false,
            message: "Token invalid or missing or expired"
        })
    }

}
