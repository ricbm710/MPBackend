//db
import { query } from "../db";
//types
import { Product } from "../types/productType";

export const getAllProductsFromDb = async <T>(): Promise<T[]> => {
  const result = await query<Product>(
    `SELECT 
        id, 
        name, 
        price::int AS price,  -- Convert price to an integer
        product_condition, 
        description, 
        city, 
        image_name, 
        user_id, 
        published_date, 
        db_active 
       FROM product`
  );
  return result.rows as T[];
};

export const getProductByIdFromDb = async <T>(
  id: string
): Promise<T | null> => {
  const result = await query<Product>(
    `SELECT 
        id, 
        name, 
        price::int AS price,  -- Convert price to an integer
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

export const createProductInDb = async (
  name: string,
  price: number,
  condition: string,
  description: string,
  city: string,
  imageName: string,
  userId: number
): Promise<number> => {
  //Capitalize
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formattedName = capitalizeFirstLetter(name);
  const formattedCondition = capitalizeFirstLetter(condition);
  const formattedDescription = capitalizeFirstLetter(description);

  const result = await query(
    "INSERT INTO product (name, price, product_condition, description, city, image_name, user_id, published_date) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE) RETURNING id",
    [
      formattedName,
      price,
      formattedCondition,
      formattedDescription,
      city,
      imageName,
      userId,
    ]
  );

  // Cast result to the expected type
  const rows = result.rows as { id: number }[]; // Assert rows' type

  if (rows.length === 0) {
    throw new Error("Failed to insert the product.");
  }

  return rows[0].id; // Safely access `id`
};

export const getProductsByUserIdFromDb = async <T>(
  userId: string
): Promise<T[]> => {
  const result = await query<Product>(
    `SELECT 
        id, 
        name, 
        price::int AS price,  -- Convert price to an integer
        product_condition, 
        description, 
        city, 
        image_name, 
        user_id, 
        published_date, 
        db_active 
     FROM product WHERE user_id=$1`,
    [userId]
  );
  return result.rows as T[];
};

export const updateProductFromDb = async <T>(
  id: string,
  name: string,
  price: number,
  condition: string,
  description: string,
  city: string,
  imageName?: string // Optional parameter
): Promise<number> => {
  // Capitalize
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formattedName = capitalizeFirstLetter(name);
  const formattedCondition = capitalizeFirstLetter(condition);
  const formattedDescription = capitalizeFirstLetter(description);

  // Construct query dynamically based on imageName existence
  const queryParams = [
    id,
    formattedName,
    price,
    formattedCondition,
    formattedDescription,
    city,
  ];

  let queryText = `
    UPDATE product
    SET name = $2,
        price = $3,
        product_condition = $4,
        description = $5,
        city = $6`;

  if (imageName) {
    queryText += `, image_name = $7`;
    queryParams.push(imageName);
  }

  queryText += ` WHERE id = $1 RETURNING id`;

  const result = await query(queryText, queryParams);

  // Cast result to the expected type
  const rows = result.rows as { id: number }[];

  if (rows.length === 0) {
    throw new Error("Failed to update the product.");
  }

  return rows[0].id;
};
