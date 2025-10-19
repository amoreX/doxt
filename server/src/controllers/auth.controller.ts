import { Request, Response } from "express";
import { register, login, logout } from "../services/auth.service";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const result = await register(email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const result = await logout(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to logout" });
  }
};
