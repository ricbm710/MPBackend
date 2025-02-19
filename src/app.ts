import express, { Application } from "express";
import dotenv from "dotenv"; //makes it easier to retrieve .env variables
import cors from "cors"; //avoids the same origin policy browsers use

//routes
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

//error
import { Request, Response, NextFunction } from "express";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// const dbUrl = process.env.DATABASE_URL;
// const jwtSecret = process.env.JWT_SECRET;
// const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
// const apiKey = process.env.CLOUDINARY_API_KEY;
// const apiSecret = process.env.CLOUDINARY_API_SECRET;

const app: Application = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json()); //default express middleware

//routes
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

//* undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 Server Error 🚨", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  res.status(500).json({ message: err.message });
});
//start server
app.listen(PORT, () => {
  //console.log(`Este servidor esta conectado a la base de datos`);
});
