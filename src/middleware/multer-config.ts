//multer
import multer, { StorageEngine, FileFilterCallback } from "multer";
//path
import path from "path";
//express
import { Request } from "express";

const imageStorage = process.env.IMAGE_STORAGE;
let storage: StorageEngine;

if (imageStorage === "local") {
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = path.resolve(
        __dirname,
        "../../../Frontend/public/images/products"
      );

      // Debugging log to check the resolved path
      console.log("Saving file to:", uploadPath);

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const productName = req.body.name || "product"; // Ensure product name exists
      const shortName = productName.replace(/\s+/g, "").substring(0, 10); // Take first 5 non-space characters
      const ext = path.extname(file.originalname);
      cb(null, `${timestamp}-${shortName}${ext}`);
    },
  });
} else {
  //* this is for saving in the memory so it can be stores later on Cloudinary service
  storage = multer.memoryStorage(); // Store in memory instead of disk
}

// File filter for images
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  //console.log("Filtering file:", file.originalname, "with type", file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!")); // Reject non-image files
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
