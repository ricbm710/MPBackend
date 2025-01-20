import { Request, Response } from "express";
//utils
import { comparePassword, hashPassword } from "../utils/bcryptUtils";
import { generateToken } from "../utils/jwtUtils";
//models
import { createUserInDb, getUserByEmailFromDb } from "../models/userModel";
//types
import { User } from "../types/userType";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, phone, email, password } = req.body;
  try {
    //password gets hashed
    const passwordHash = await hashPassword(password);
    //create user
    const newUser = await createUserInDb<User>(
      name,
      phone,
      email,
      passwordHash
    );
    res.status(201).json({ message: "New user created." });
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data." });
  }
};

//this function returns the jwt string if succesful
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmailFromDb<User>(email);

    if (user && (await comparePassword(password, user.password_hash))) {
      const token = generateToken(user.id);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  } catch {
    res.status(500).json({ error: "Login failed." });
  }
};
