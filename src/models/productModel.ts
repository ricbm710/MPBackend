//db
import { query } from "../db";
//types
import { Product } from "../types/productType";

export const getAllProductsFromDb = async <T>(): Promise<T[]> => {
  const result = await query("SELECT * FROM product");
  return result.rows as T[];
};

export const getProductByIdFromDb = async <T>(
  id: string
): Promise<T | null> => {
  const result = await query<Product>(
    `SELECT 
        id, 
        name, 
        price, 
        product_condition, 
        description, 
        city, 
        image_name, 
        user_id, 
        published_date, 
        db_active 
       FROM product WHERE id=$1`,
    [id]
  );
  return (result.rows[0] as T) || null;
};
