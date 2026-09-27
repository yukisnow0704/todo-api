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

export type UpdatableFields = {
    title?: string
    done?: boolean
    category?: string
    priority?: string
    estimated_minutes?: number
}

export async function update(
    id: number,
    fields: UpdatableFields
): Promise<Todo | undefined> {
    const sets: string[] = []
    const values: (string | boolean | number)[] = []
    let i = 1

    if (fields.title !== undefined) {
        sets.push(`title = $${i++}`)
        values.push(fields.title)
    }
    if (fields.done !== undefined) {
        sets.push(`done = $${i++}`)
        values.push(fields.done)
    }
    if (fields.category !== undefined) {
        sets.push(`category = $${i++}`)
        values.push(fields.category)
    }
    if (fields.priority !== undefined) {
        sets.push(`priority = $${i++}`)
        values.push(fields.priority)
    }
    if (fields.estimated_minutes !== undefined) {
        sets.push(`estimated_minutes = $${i++}`)
        values.push(fields.estimated_minutes)
    }

    if (sets.length === 0) {
        return getById(id)
    }

    values.push(id as unknown as string)
    const result = await pool.query<Todo>(
        `UPDATE todos SET ${sets.join(", ")} WHERE id = $${i}
        RETURNING id, title, done, category, priority, estimated_minutes`, 
        values
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