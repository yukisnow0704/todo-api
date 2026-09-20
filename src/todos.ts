export type Todo = {
    id: number
    title: string
    done: boolean
}

let todos: Todo[] = [
    { id: 1, title: "Honoを学ぶ", done: false },
    { id: 2, title: "Cloud Runにデプロイする", done: false},
]

let nextId = 3

export function getAll(): Todo[] {
    return todos
}

export function getById(id: number): Todo | undefined {
    return todos.find((t) => t.id === id)
}

export function create(title: string): Todo {
    const todo: Todo = { id: nextId++, title, done: false }
    todos.push(todo)
    return todo
}

export function remove(id: number): boolean {
    const before = todos.length
    todos = todos.filter((t) => t.id !== id)
    return todos.length < before
}