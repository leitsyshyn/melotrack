import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import * as schema from "@/db/schema";

// Required on Vercel Node runtime
neonConfig.webSocketConstructor = ws;

// Force secure websockets in serverless envs
neonConfig.useSecureWebSocket = true;

// (Often helps behind proxies/CDNs)
neonConfig.pipelineTLS = true;

// Keep the pool tiny in serverless (avoid too many sockets)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 1,
  idleTimeoutMillis: 5_000,
  connectionTimeoutMillis: 10_000,
});

export const db = drizzle({ client: pool, schema });
export type DB = typeof db;
