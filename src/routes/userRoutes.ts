import express from "express";
//controller
import { getUserDetails } from "../controllers/userController";
//middleware
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/users/details", authenticateToken, getUserDetails);

export default router;
