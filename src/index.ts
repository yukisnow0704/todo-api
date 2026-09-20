import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getAll, getById, create, remove } from "./todos.js"

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: "Todo API is running" })
})

app.get("/api/todos", (c) => {
  return c.json(getAll())
})

app.get("/api/todos/:id", (c) => {
  const id = Number(c.req.param("id"))
  const todo = getById(id)
  if (!todo) {
    return c.json({ error: "not found" }, 404)
  }
  return c.json(todo)
})

app.post("/api/todos", async (c) => {
  const body = await c.req.json<{ title?: string }>()
  if (!body.title) {
    return c.json({ error: "title is required" }, 400)
  }
  const todo = create(body.title)
  return c.json(todo, 201)
})

app.delete("/api/todos/:id", (c) => {
  const id = Number(c.req.param("id"))
  const ok = remove(id)
  if (!ok) {
    return c.json({ error: "not found" }, 404)
  }
  return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 8080

serve({
  fetch: app.fetch,
  port: port,
})

console.log(`Server is running on port ${port}`)
