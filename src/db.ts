import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  //port: Number(process.env.PORT),
});

export async function query<T>(
  text: string,
  params?: any[]
): Promise<{ rows: T[] }> {
  const result = await pool.query(text, params);
  return result;
}
