// This file connects URLs (routes) to the functions in authController.js

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// when someone sends POST request to /api/auth/register -> run registerUser
router.post("/register", registerUser);

// when someone sends POST request to /api/auth/login -> run loginUser
router.post("/login", loginUser);

export default router;
