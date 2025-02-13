import express from "express";
//controller
import { getUserById, getUserDetails } from "../controllers/userController";
//middleware
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/users/details", authenticateToken, getUserDetails);
router.get("/users/:id", getUserById);

export default router;
