import { Request, Response } from "express";
//model
import { getUserByEmailFromDb, getUserByIdFromDb } from "../models/userModel";

export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.authUser!;
  try {
    const result = await getUserByIdFromDb(id);
    if (!result) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user name." });
  }
};
