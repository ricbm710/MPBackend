import { Request, Response } from "express";
//model
import { getUserByEmailFromDb, getUserByIdFromDb } from "../models/userModel";
//type
import { User } from "../types/userType";

export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.authUser!;
  try {
    const result = await getUserByIdFromDb(id ? id.toString() : "");
    if (!result) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user name." });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await getUserByIdFromDb<User>(id);
    if (!result) {
      res
        .status(404)
        .json({ error: "Usuario no encontrado en Base de Datos." });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "No se pudo extraer la información de usuario" });
  }
};
