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
  (req, res, next) => {
    console.log("File Upload Debugging:");
    console.log("File:", req.file); // Logs the uploaded file
    console.log("Body:", req.body); // Logs other form data
    console.log("Params:", req.params); // Logs product ID from URL
    next(); // Pass control to modifyProduct
  },
  authenticateToken,
  upload.single("imageFile"),
  modifyProduct
);

export default router;
