import { Pool } from "pg";
import "dotenv/config";

const dbLocation = process.env.DB_LOCATION;

const pool =
  dbLocation === "neon"
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required for Neon DB
      })
    : new Pool({
        //local
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.PORT),
      });

export async function query<T>(
  text: string,
  params?: any[]
): Promise<{ rows: T[] }> {
  const result = await pool.query(text, params);
  return result;
}

// Test the connection on startup
pool
  .connect()
  .then(() => console.log(`✅ Connected to PostgreSQL ${dbLocation}`))
  .catch((err) => console.error("❌ Database connection error:", err));
