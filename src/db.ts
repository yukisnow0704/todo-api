import { create } from "node:domain"
import { Pool } from "pg"

function createPool(): Pool {
    const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME

    if (instanceConnectionName) {
        return new Pool({
            host: `/cloudsql/${instanceConnectionName}`,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            max: 5,
        })
    }

    return new Pool({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max: 5,
    })
}

export const pool = createPool();

export async function ensureSchema(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
            category TEXT
        )
    `)
    await pool.query(`
        ALTER TABLE todos ADD COLUMN IF NOT EXISTS category TEXT
    `)
}