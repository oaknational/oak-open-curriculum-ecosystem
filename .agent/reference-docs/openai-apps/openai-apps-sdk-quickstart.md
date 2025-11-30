original doc: <https://developers.openai.com/apps-sdk/quickstart>

Examples repo: <https://github.com/openai/openai-apps-sdk-examples>

# Quickstart

## Introduction

The Apps SDK relies on the [Model Context Protocol (MCP)](/apps-sdk/concepts/mcp-server) to expose your app to ChatGPT. To build an app for ChatGPT with the Apps SDK, you will need two things:

1. A web component built with the framework of your choice – you are free to build your app as you see fit, that will be rendered in an iframe in the ChatGPT interface.
2. A Model Context Protocol (MCP) server that will be used to expose your app and define your app's capabilities (tools) to ChatGPT.

In this quickstart, we'll build a simple to-do list app, contained in a single HTML file that keeps the markup, CSS, and JavaScript together.

To see more advanced examples using React, see the [examples repository on GitHub](https://github.com/openai/openai-apps-sdk-examples).

## Build a web component

Let's start by creating a file called `public/todo-widget.html` in a new directory that will be the UI rendered by the Apps SDK in ChatGPT.
This file will contain the web component that will be rendered in the ChatGPT interface.

Add the following content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Todo list</title>
    <style>
      :root {
        color: #0b0b0f;
        font-family:
          'Inter',
          system-ui,
          -apple-system,
          sans-serif;
      }

      html,
      body {
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 16px;
        background: #f6f8fb;
      }

      main {
        width: 100%;
        max-width: 360px;
        min-height: 260px;
        margin: 0 auto;
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      }

      h2 {
        margin: 0 0 16px;
        font-size: 1.25rem;
      }

      form {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      form input {
        flex: 1;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid #cad3e0;
        font-size: 0.95rem;
      }

      form button {
        border: none;
        border-radius: 10px;
        background: #111bf5;
        color: white;
        font-weight: 600;
        padding: 0 16px;
        cursor: pointer;
      }

      input[type='checkbox'] {
        accent-color: #111bf5;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      li {
        background: #f2f4fb;
        border-radius: 12px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      li span {
        flex: 1;
      }

      li[data-completed='true'] span {
        text-decoration: line-through;
        color: #6c768a;
      }
    </style>
  </head>
  <body>
    <main>
      <h2>Todo list</h2>
      <form id="add-form" autocomplete="off">
        <input id="todo-input" name="title" placeholder="Add a task" />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list"></ul>
    </main>

    <script type="module">
      const listEl = document.querySelector('#todo-list');
      const formEl = document.querySelector('#add-form');
      const inputEl = document.querySelector('#todo-input');

      let tasks = [...(window.openai?.toolOutput?.tasks ?? [])];

      const render = () => {
        listEl.innerHTML = '';
        tasks.forEach((task) => {
          const li = document.createElement('li');
          li.dataset.id = task.id;
          li.dataset.completed = String(Boolean(task.completed));

          const label = document.createElement('label');
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          label.style.gap = '10px';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = Boolean(task.completed);

          const span = document.createElement('span');
          span.textContent = task.title;

          label.appendChild(checkbox);
          label.appendChild(span);
          li.appendChild(label);
          listEl.appendChild(li);
        });
      };

      const updateFromResponse = (response) => {
        if (response?.structuredContent?.tasks) {
          tasks = response.structuredContent.tasks;
          render();
        }
      };

      const handleSetGlobals = (event) => {
        const globals = event.detail?.globals;
        if (!globals?.toolOutput?.tasks) return;
        tasks = globals.toolOutput.tasks;
        render();
      };

      window.addEventListener('openai:set_globals', handleSetGlobals, {
        passive: true,
      });

      const mutateTasksLocally = (name, payload) => {
        if (name === 'add_todo') {
          tasks = [...tasks, { id: crypto.randomUUID(), title: payload.title, completed: false }];
        }

        if (name === 'complete_todo') {
          tasks = tasks.map((task) =>
            task.id === payload.id ? { ...task, completed: true } : task,
          );
        }

        if (name === 'set_completed') {
          tasks = tasks.map((task) =>
            task.id === payload.id ? { ...task, completed: payload.completed } : task,
          );
        }

        render();
      };

      const callTodoTool = async (name, payload) => {
        if (window.openai?.callTool) {
          const response = await window.openai.callTool(name, payload);
          updateFromResponse(response);
          return;
        }

        mutateTasksLocally(name, payload);
      };

      formEl.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = inputEl.value.trim();
        if (!title) return;
        await callTodoTool('add_todo', { title });
        inputEl.value = '';
      });

      listEl.addEventListener('change', async (event) => {
        const checkbox = event.target;
        if (!checkbox.matches('input[type="checkbox"]')) return;
        const id = checkbox.closest('li')?.dataset.id;
        if (!id) return;

        if (!checkbox.checked) {
          if (window.openai?.callTool) {
            checkbox.checked = true;
            return;
          }

          mutateTasksLocally('set_completed', { id, completed: false });
          return;
        }

        await callTodoTool('complete_todo', { id });
      });

      render();
    </script>
  </body>
</html>
```

### Using the Apps SDK in your web component

`window.openai` is the bridge between your frontend and ChatGPT.

When ChatGPT loads the iframe, it injects the latest tool response into `window.openai.toolOutput`, which is an object specific to the Apps SDK.
Subsequent calls to `window.openai.callTool` return fresh structured content so the UI stays in sync.

## Build an MCP server

Install the official Python or Node MCP SDK to create a server and expose a `/mcp` endpoint.

In this quickstart, we'll use the [Node SDK](https://github.com/modelcontextprotocol/typescript-sdk).

If you're using Python, refer to our [examples repository on GitHub](https://github.com/openai/openai-apps-sdk-examples) to see an example MCP server with the Python SDK.

Install the Node SDK and Zod with:

```bash
npm install @modelcontextprotocol/sdk zod
```

### MCP server with Apps SDK resources

Register a resource for your component bundle and the tools the model can call (e.g. `add_todo` and `complete_todo`) so ChatGPT can drive the UI.

Create a file named `server.js` and paste the following example that uses the Node SDK:

```js
const todoHtml = readFileSync('public/todo-widget.html', 'utf8');

const addTodoInputSchema = {
  title: z.string().min(1),
};

const completeTodoInputSchema = {
  id: z.string().min(1),
};

let todos = [];
let nextId = 1;

const replyWithTodos = (message) => ({
  content: message ? [{ type: 'text', text: message }] : [],
  structuredContent: { tasks: todos },
});

function createTodoServer() {
  const server = new McpServer({ name: 'todo-app', version: '0.1.0' });

  server.registerResource('todo-widget', 'ui://widget/todo.html', {}, async () => ({
    contents: [
      {
        uri: 'ui://widget/todo.html',
        mimeType: 'text/html+skybridge',
        text: todoHtml,
        _meta: { 'openai/widgetPrefersBorder': true },
      },
    ],
  }));

  server.registerTool(
    'add_todo',
    {
      title: 'Add todo',
      description: 'Creates a todo item with the given title.',
      inputSchema: addTodoInputSchema,
      _meta: {
        'openai/outputTemplate': 'ui://widget/todo.html',
        'openai/toolInvocation/invoking': 'Adding todo',
        'openai/toolInvocation/invoked': 'Added todo',
      },
    },
    async (args) => {
      const title = args?.title?.trim?.() ?? '';
      if (!title) return replyWithTodos('Missing title.');
      const todo = { id: `todo-${nextId++}`, title, completed: false };
      todos = [...todos, todo];
      return replyWithTodos(`Added "${todo.title}".`);
    },
  );

  server.registerTool(
    'complete_todo',
    {
      title: 'Complete todo',
      description: 'Marks a todo as done by id.',
      inputSchema: completeTodoInputSchema,
      _meta: {
        'openai/outputTemplate': 'ui://widget/todo.html',
        'openai/toolInvocation/invoking': 'Completing todo',
        'openai/toolInvocation/invoked': 'Completed todo',
      },
    },
    async (args) => {
      const id = args?.id;
      if (!id) return replyWithTodos('Missing todo id.');
      const todo = todos.find((task) => task.id === id);
      if (!todo) {
        return replyWithTodos(`Todo ${id} was not found.`);
      }

      todos = todos.map((task) => (task.id === id ? { ...task, completed: true } : task));

      return replyWithTodos(`Completed "${todo.title}".`);
    },
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = '/mcp';

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end('Missing URL');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

  if (req.method === 'OPTIONS' && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type, mcp-session-id',
      'Access-Control-Expose-Headers': 'Mcp-Session-Id',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/plain' }).end('Todo MCP server');
    return;
  }

  const MCP_METHODS = new Set(['POST', 'GET', 'DELETE']);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

    const server = createTodoServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    });

    res.on('close', () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.writeHead(500).end('Internal server error');
      }
    }
    return;
  }

  res.writeHead(404).end('Not Found');
});

httpServer.listen(port, () => {
  console.log(`Todo MCP server listening on http://localhost:${port}${MCP_PATH}`);
});
```

This snippet also responds to `GET /` for health checks, handles CORS preflight for `/mcp` and nested routes like `/mcp/actions`, and returns `404 Not Found` for OAuth discovery routes you are not using yet. That keeps ChatGPT’s connector wizard from surfacing 502 errors while you iterate without authentication.

## Run locally

If you're using a web framework like React, build your component into static assets so the HTML template can inline them.
Usually, you can run a build command such as `npm run build` to produce a `dist` directory with your compiled assets.

In this quickstart, since we're using vanilla HTML, no build step is required.

Start the MCP server on `http://localhost:<port>/mcp` from the directory that contains `server.js` (or `server.ts`).

Make sure you have `"type": "module"` in your `package.json` file:

```json
{
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.20.2",
    "zod": "^3.25.76"
  }
}
```

Then run the server with the following command:

```bash
node server.js
```

The server should print `Todo MCP server listening on http://localhost:8787/mcp` once it is ready.

### Test with MCP Inspector

You can use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test your server locally.

```bash
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

This will open a browser window with the MCP Inspector interface. You can use this to test your server and see the tool responses.

![MCP Inspector](/images/apps-sdk/mcp_inspector.png)

### Expose your server to the public internet

For ChatGPT to access your server during development, you need to expose it to the public internet. You can use a tool such as [ngrok](https://ngrok.com/) to open a tunnel to your local server.

```bash
ngrok http <port>
```

This will give you a public URL like `https://<subdomain>.ngrok.app` that you can use to access your server from ChatGPT.

When you add you connector, provide the public URL with the `/mcp` path (e.g. `https://<subdomain>.ngrok.app/mcp`).

## Add your app to ChatGPT

Once you have your MCP server and web component working locally, you can add your app to ChatGPT with the following steps:

1. Enable [developer mode](https://platform.openai.com/docs/guides/developer-mode) under **Settings → Apps & Connectors → Advanced settings** in ChatGPT.
2. Click the **Create** button to add a connector under **Settings → Connectors** and paste the HTTPS + `/mcp` URL from your tunnel or deployment (e.g. `https://<subdomain>.ngrok.app/mcp`).
3. Name the connector, provide a short description and click **Create**.

<div style={{ width: "50%", margin: "0 auto", display: "block" }}>
  <img
    src="/images/apps-sdk/new_connector.jpg"
    alt="Add your connector to ChatGPT"
  />
</div>

4. Open a new chat, add your connector from the **More** menu (accessible after clicking the **+** button), and prompt the model (e.g., “Add a new task to read my book”). ChatGPT will stream tool payloads so you can confirm inputs and outputs.

![Add your connector to a conversation](/images/apps-sdk/developer_mode_more.jpg)

## Next steps

From there, you can iterate on the UI/UX, prompts, tool metadata, and the overall experience.

Refresh the connector after each change to the MCP server (tools, metadata,
etc.) You can do this by clicking the **Refresh** button in **Settings →
Connectors** after selecting your connector.

Read our [app developer guidelines](/apps-sdk/app-developer-guidelines) to learn more about the best practices for building apps for ChatGPT, and make sure you [research your use case](/apps-sdk/plan/use-case) and [read our design guidelines](/apps-sdk/concepts/design-guidelines) before building.

Once you understand the basics, you can leverage the Apps SDK to [build a ChatGPT UI](/apps-sdk/build/chatgpt-ui) using the Apps SDK primitives, [authenticate users](/apps-sdk/build/auth) if needed, and [persist state](/apps-sdk/build/storage).
