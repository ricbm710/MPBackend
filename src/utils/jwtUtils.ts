import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (
  token: string
): { expired: boolean; decoded?: any } => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { expired: false, decoded };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { expired: true };
    }
    //if not expiration related, throw any other error
    throw error;
  }
};
