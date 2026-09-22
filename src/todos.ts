import { pool } from "./db.js"

export type Todo = {
    id: number
    title: string
    done: boolean
}

export async function getAll(): Promise<Todo[]> {
    const result = await pool.query<Todo>(
        "SELECT id, title, done FROM todos ORDER BY id"
    )
    return result.rows
}

export async function getById(id: number): Promise<Todo | undefined> {
    const result = await pool.query<Todo>(
        "SELECT id, title, done FROM todos WHERE id = $1",
        [id]
    )
    return result.rows[0]
}

export async function create(title: string): Promise<Todo> {
    const result = await pool.query<Todo>(
        "INSERT INTO todos (title, done) VALUES ($1, false) RETURNING id, title, done",
        [title]
    )
    return result.rows[0]
}

export async function remove(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id])
    return (result.rowCount ?? 0) > 0
}