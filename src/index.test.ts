import { describe, it, expect } from "vitest"
import { getAll, getById, create, remove } from "./todos.js"
import { title } from "node:process"

describe("todos", () => {
    it("getAll returns an array", () => {
        expect(Array.isArray(getAll())).toBe(true)
    })

    it("create adds a new todo", () => {
        const before = getAll().length
        const title = String("テスト用タスク")
        const todo = create(title)
        expect(getAll().length).toBe(before + 1)
        expect(todo.title).toBe(title)
        expect(todo.done).toBe(false)
    })

    it("getById finds the created todo", () => {
        const title = String("検索テスト")
        const todo = create(title)
        const found = getById(todo.id)
        expect(found?.title).toBe(title)
    })

    it("remove deletes a todo", () => {
        const todo = create("削除予定")
        const ok = remove(todo.id)
        expect(ok).toBe(true)
        expect(getById(todo.id)).toBeUndefined()
    })

    it("remove returns flase for non-existent id", () => {
        const ok = remove(999999)
        expect(ok).toBe(false)
    })
})
