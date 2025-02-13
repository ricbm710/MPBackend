import express, { Application } from "express";
import dotenv from "dotenv"; //makes it easier to retrieve .env variables
import cors from "cors"; //avoids the same origin policy browsers use

//routes
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config(); //loads variables

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

//start server
app.listen(PORT, () => {
  //console.log(`Este servidor esta conectado a la base de datos`);
});
