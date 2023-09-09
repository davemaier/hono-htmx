import { Hono } from "hono/quick";
import { serveStatic } from "hono/cloudflare-workers";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";

import { todo } from "./schema";
import { Layout, AddTodo, Item } from "./components";

type Bindings = {
  DB: D1Database;
};

type Todo = {
  title: string;
  id: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/tailwind.css", serveStatic({ path: "./tailwind.css" }));
app.get("/csshmr.js", serveStatic({ path: "./csshmr.js" }));

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const todos = await db.select().from(todo);

  return c.html(
    <Layout>
      <AddTodo />
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id.toString()} />;
      })}
      <div id="todo"></div>
    </Layout>
  );
});

app.post(
  "/todo",
  zValidator(
    "form",
    z.object({
      title: z.string().min(1),
    })
  ),
  async (c) => {
    const { title } = c.req.valid("form");
    const id = crypto.randomUUID();
    await c.env.DB.prepare(`INSERT INTO todo(title) VALUES(?);`)
      .bind(title)
      .run();
    return c.html(<Item title={title} id={id} />);
  }
);

app.delete("/todo/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare(`DELETE FROM todo WHERE id = ?;`).bind(id).run();
  c.status(200);
  return c.body(null);
});

export default app;
