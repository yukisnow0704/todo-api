import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getAll, getById, create, remove } from "./todos.js"
import { ensureSchema } from './db.js'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: "Todo API is running" })
})

app.get("/api/todos", async (c) => {
  const todos = await getAll()
  return c.json(todos)
})

app.get("/api/todos/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const todo = await getById(id)
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

app.delete("/api/todos/:id", async (c) => {
  const id = Number(c.req.param("id"))
  const ok = await remove(id)
  if (!ok) {
    return c.json({ error: "not found" }, 404)
  }
  return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 8080

async function main() {
  await ensureSchema()

  serve({
    fetch: app.fetch,
    port,
  })

  console.log(`Server is running on port ${port}`)
}

main()
