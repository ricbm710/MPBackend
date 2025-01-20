//db config
import { query } from "../db";

export const createUserInDb = async <T>(
  name: string,
  phone: string,
  email: string,
  password_hash: string
): Promise<T> => {
  const result = await query(
    "INSERT INTO app_user (name, phone, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, phone, email, password_hash]
  );
  return result.rows[0] as T;
};

export const getUserByEmailFromDb = async <T>(email: string): Promise<T> => {
  const result = await query("SELECT * FROM app_user WHERE email = $1", [
    email,
  ]);
  return result.rows[0] as T;
};

export const getUserByIdFromDb = async <T>(id: number): Promise<T> => {
  const result = await query(
    "SELECT name,phone,email FROM app_user WHERE id = $1",
    [id]
  );
  return result.rows[0] as T;
};
