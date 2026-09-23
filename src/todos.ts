import { pool } from "./db.js"
import { classifyTitle } from "./classify.js"

export type Todo = {
    id: number
    title: string
    done: boolean
    category: string
}

export async function getAll(): Promise<Todo[]> {
    const result = await pool.query<Todo>(
        "SELECT id, title, done, category FROM todos ORDER BY id"
    )
    return result.rows
}

export async function getById(id: number): Promise<Todo | undefined> {
    const result = await pool.query<Todo>(
        "SELECT id, title, done, category FROM todos WHERE id = $1",
        [id]
    )
    return result.rows[0]
}

export async function create(title: string): Promise<Todo> {
    
    const category = await classifyTitle(title);

    const result = await pool.query<Todo>(
        "INSERT INTO todos (title, done, category) VALUES ($1, false, $2) RETURNING id, title, done, category",
        [title, category]
    )
    console.log(JSON.stringify({
        event: "todo_operation",
        operation: "create",
        todoId: result.rows[0].id,
        title: result.rows[0].title,
        category: result.rows[0].category,
        timestamp: new Date().toISOString(),
    }));
    return result.rows[0]
}

export async function remove(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id])
    console.log(JSON.stringify({
        event: "todo_operation",
        operation: "delete",
        todoId: id,
        timestamp: new Date().toISOString(),
    }));
    return (result.rowCount ?? 0) > 0
}