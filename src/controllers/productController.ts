import { Request, Response } from "express";
//types
import { Product } from "../types/productType";
//model
import {
  getAllProductsFromDb,
  getProductByIdFromDb,
} from "../models/productModel";

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
