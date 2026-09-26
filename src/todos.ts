import { pool } from "./db.js"
import { enqueueAnalyzeTodoTask } from "./tasks.js"

export type Todo = {
    id: number
    title: string
    done: boolean
    category: string,
    priority: string,
    estimated_minutes: BigInteger
}

export async function getAll(): Promise<Todo[]> {
    const result = await pool.query<Todo>(
        "SELECT id, title, done, category, priority, estimated_minutes FROM todos ORDER BY id"
    )
    return result.rows
}

export async function getById(id: number): Promise<Todo | undefined> {
    const result = await pool.query<Todo>(
        "SELECT id, title, done, category, priority, estimated_minutes FROM todos WHERE id = $1",
        [id]
    )
    return result.rows[0]
}

export async function create(title: string): Promise<Todo> {
    const result = await pool.query<Todo>(
        "INSERT INTO todos (title, done) VALUES ($1, false) RETURNING id, title, done",
        [title]
    )
    
    const todo = result.rows[0];

    enqueueAnalyzeTodoTask(todo.id, todo.title).catch((error) => {
        console.error(JSON.stringify({ event: "enqueue_error", message: String(error) }));
    });

    return todo;
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