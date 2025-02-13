import { NextFunction, Request, Response } from "express";
//utils
import { verifyToken } from "../utils/jwtUtils";
//jsonwebtoken
import { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

declare global {
  namespace Express {
    interface Request {
      authUser?: JwtPayload & { id: number };
    }
  }
}

//*this middleware gets the current token in the header of the request
//*example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzM3MjUxNTE1LCJleHAiOjE3MzcyNTUxMTV9.A3s8EkuK7FpguDVJep0VDE473oFQQh9xhsq37za1GZQ
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Token no encontrado o está mal conformado." });
      return;
    }

    const token = authHeader?.split(" ")[1];

    // Verify the token string using the verifyToken util function
    try {
      const { decoded, expired } = verifyToken(token!);
      if (expired) {
        res.status(403).json({ error: "Token has expired" });
        return;
      }
      req.authUser = decoded;

      next();
    } catch (err) {
      res.status(403).json({ error: "Token is invalid." });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};
