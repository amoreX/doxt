import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", registerUser);

// POST /api/auth/login - Login user
router.post("/login", loginUser);

// POST /api/auth/logout - Logout user
router.post("/logout", logoutUser);

export default router;
