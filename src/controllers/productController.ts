import { Request, Response } from "express";
//types
import { Product } from "../types/productType";
//model
import {
  createProductInDb,
  getAllProductsFromDb,
  getProductByIdFromDb,
  getProductsByUserIdFromDb,
  updateProductFromDb,
} from "../models/productModel";
//image manipulation
import path from "path";
import fs from "fs";
//cloudinary
import cloudinary, { uploadImageToCloudinary } from "../utils/cloudinary";

const imageStorage = process.env.IMAGE_STORAGE;

//get all products
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getAllProductsFromDb<Product[]>();
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: "No se pudo extraer los productos de la base de datos." });
  }
};
//get product by id
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await getProductByIdFromDb<Product>(id);
    if (!result) {
      res
        .status(404)
        .json({ error: "Producto no encontrado en base de datos." });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "No se pudo extraer el producto de la base de datos." });
  }
};

//create product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, price, condition, description, city, imageFile } = req.body;
  const { id } = req.authUser!;

  let imageData: string | undefined;

  if (imageStorage === "local") {
    // Get the filename from the uploaded file
    const imageName = req.file?.filename; // This is the file with the timestamp
    //console.log(imageName);

    if (!imageName) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }
    imageData = imageName;
  } else {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    imageData = await uploadImageToCloudinary(req.file.buffer);
    //console.log(imageData);
  }

  try {
    // Store the product.
    const productId = await createProductInDb(
      name,
      price,
      condition,
      description,
      city,
      imageData,
      id
    );

    res.status(201).json({
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't create this new product" });
  }
};

export const getProductsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.authUser!;
  try {
    const result = await getProductsByUserIdFromDb(id ? id.toString() : "");
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "No se pudo extraer los productos del usuario." });
  }
};

export const modifyProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, price, condition, description, city, imageFile } = req.body;
  const productId = req.params.id;

  let imageData: string | undefined;

  // set imageData for new image
  if (imageStorage === "local") {
    // Get the filename from the uploaded file
    const imageName = req.file?.filename; // This is the file with the timestamp

    if (!imageName) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }
    imageData = imageName;
  } else {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    imageData = await uploadImageToCloudinary(req.file.buffer);
  }

  try {
    const existingProduct = await getProductByIdFromDb<Product>(productId);
    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // delete old image if changed
    if (imageStorage === "local") {
      // If a new image was uploaded, delete the old image file

      if (imageData && existingProduct.image_name) {
        const oldImagePath = path.resolve(
          __dirname,
          "../../../Frontend/public/images/products",
          existingProduct.image_name // This is just the filename, not a full path
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
    } else {
      //* For Cloudinary
      if (existingProduct.image_name) {
        const publicIdMatch =
          existingProduct.image_name.match(/\/v\d+\/(.+)\.\w+$/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;

        if (publicId) {
          // Delete the old image from Cloudinary
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }
    // Modify the product row taking the imageData
    const updateResult = await updateProductFromDb(
      productId,
      name,
      price,
      condition,
      description,
      city,
      imageData
    );

    res.status(201).json({
      message: "Product updated successfully.",
      updateResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't update the product.",
    });
  }
};
