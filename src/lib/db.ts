// import "dotenv/config";
// import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";

// import * as schema from "@/db/schema";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type DB = typeof db;
