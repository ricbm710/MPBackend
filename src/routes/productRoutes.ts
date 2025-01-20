import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productController";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

export default router;
