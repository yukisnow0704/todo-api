import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest"
import { getAll, getById, create, remove } from "./todos.js"
import { ensureSchema, pool } from "./db.js"
import { get } from "node:http"

beforeAll(async () => {
    await ensureSchema()
})

beforeEach(async () => {
    await pool.query("DELETE FROM todos")
})

afterAll(async () => {
    await pool.end()
})

describe("todos", () => {
    it("getAll returns an empty array initially", async () => {
        const todos = await getAll()
        expect(todos).toEqual([])
    })

    it("create adds a new todo", async () => {
        const title = String("テスト用タスク")
        const todo = await create(title)
        const todos = await getAll()
        expect(todos.length).toBe(1)
        expect(todo.title).toBe(title)
        expect(todo.done).toBe(false)
    })

    it("getById finds the created todo", async () => {
        const title = String("検索テスト")
        const created = await create(title)
        const found = await getById(created.id)
        expect(found?.title).toBe(title)
    })

    it("remove deletes a todo", async () => {
        const created = await create("削除予定")
        const ok = await remove(created.id)
        expect(ok).toBe(true)
        expect(await getById(created.id)).toBeUndefined()
    })

    it("remove returns flase for non-existent id", async () => {
        const ok = await remove(999999)
        expect(ok).toBe(false)
    })
})
