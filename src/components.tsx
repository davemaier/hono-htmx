import { html } from "hono/html";

export const Layout = (props: { children: any }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <link rel="stylesheet" href="./tailwind.css" />
      <title>Hono + htmx</title>
    </head>
    <body>
      <div class="p-4">
        <h1 class="font-bold text-4xl mb-4"><a href="/">Todo</a></h1>
        ${props.children}
      </div>
    </body>
  </html>
`;

export const AddTodo = () => (
  <form
    hx-post="/todo"
    hx-target="#todo"
    hx-swap="beforebegin"
    _="on htmx:afterRequest reset() me"
    class="mb-4"
  >
    <div class="mb-3">
      <input
        name="title"
        type="text"
        class="bg-yellow-900 border border-gray-300 text-gray-900 rounded-lg p-2.5"
      />
    </div>
    <button
      class="text-white bg-gray-500 hover:bg-blue-800 rounded-lg px-5 py-2 text-center"
      type="submit"
    >
      Submit
    </button>
  </form>
);

export const Item = ({ title, id }: { title: string; id: string }) => (
  <p
    hx-delete={`/todo/${id}`}
    hx-swap="outerHTML"
    class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-slate-200 text-gray-600 mb-2"
  >
    {title}
    <button class="font-medium">Deleted</button>
  </p>
);
