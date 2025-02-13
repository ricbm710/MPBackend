import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByUserId,
  modifyProduct,
} from "../controllers/productController";
//middleware
import { authenticateToken } from "../middleware/authenticateToken";
import { upload } from "../middleware/multer-config";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post(
  "/products",
  authenticateToken,
  upload.single("imageFile"),
  createProduct
);
router.get("/my-products", authenticateToken, getProductsByUserId);
router.put(
  "/products/:id",
  authenticateToken,
  upload.single("imageFile"),
  modifyProduct
);

export default router;
