<!-- markdownlint-disable -->
<!-- original: https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server -->

---

title: Build an MCP server in your application with Clerk
description: Learn how to build an MCP server using Clerk's OAuth server in your
application.
sdk: nextjs, expressjs
sdkScoped: "true"
canonical: /docs/:sdk:/guides/development/mcp/build-mcp-server
lastUpdated: 2025-10-15T17:48:27.000Z
availableSdks: nextjs,expressjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: expressjs

---

<If sdk="expressjs">
  <TutorialHero
    exampleRepo={[
  {
    title: "Express & Clerk MCP Server Repo",
    link: "https://github.com/clerk/mcp-express-example"
  }
]}
    beforeYouStart={[
  {
    title: "A Clerk application is required.",
    link: "/docs/getting-started/quickstart/setup-clerk",
    icon: "clerk",
  },
  {
    title: "Integrate Clerk into your Express application",
    link: "/docs/nextjs/getting-started/quickstart",
    icon: "expressjs",
  },
]}
  />

This guide demonstrates how to build an MCP server using Clerk's OAuth server in your Express app. It assumes that you have already integrated Clerk into your app by following the <SDKLink href="/docs/nextjs/getting-started/quickstart" sdks={["nextjs","react","js-frontend","chrome-extension","expo","android","ios","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>quickstart</SDKLink>.
</If>

> \[!IMPORTANT]
> For most client implementations of MCP, [dynamic client registration](https://openid.net/specs/openid-connect-registration-1_0.html) is required. This allows MCP-compatible clients to automatically register themselves with your server during the OAuth flow.
> Before proceeding, ensure you have toggled on the **Dynamic client registration** option in the [OAuth Applications](https://dashboard.clerk.com/~/oauth-applications) page in the Clerk Dashboard.

<Steps>
  ## Install dependencies

To get started, this implementation requires the following packages to be installed in your project:

  <If sdk="expressjs">
    * [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk): Provides the core SDK for building an MCP server, including utilities to define tools and handle LLM requests.
    * [`@clerk/mcp-tools`](https://github.com/clerk/mcp-tools): A helper library built on top of the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) used to connect Clerk OAuth with MCP easily.
    * [`cors`](https://github.com/expressjs/cors): Express middleware for handling CORS requests, which is needed for public clients to access your MCP server.

    <CodeBlockTabs options={["npm", "yarn", "pnpm", "bun"]}>
      ```bash {{ filename: 'terminal' }}
      npm install @modelcontextprotocol/sdk @clerk/mcp-tools cors
      ```

      ```bash {{ filename: 'terminal' }}
      yarn add @modelcontextprotocol/sdk @clerk/mcp-tools cors
      ```

      ```bash {{ filename: 'terminal' }}
      pnpm add @modelcontextprotocol/sdk @clerk/mcp-tools cors
      ```

      ```bash {{ filename: 'terminal' }}
      bun add @modelcontextprotocol/sdk @clerk/mcp-tools cors
      ```
    </CodeBlockTabs>

  </If>

## Set up your app with Clerk and MCP imports

The following code is the starting point for your MCP server. It includes the imports and setup needed to implement an MCP server with Clerk.

  <If sdk="expressjs">
    ```ts {{ filename: 'index.ts' }}
    import 'dotenv/config'
    import { type MachineAuthObject, clerkClient, clerkMiddleware } from '@clerk/express'
    import {
      mcpAuthClerk,
      protectedResourceHandlerClerk,
      streamableHttpHandler,
    } from '@clerk/mcp-tools/express'
    import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
    import express from 'express'
    import cors from 'cors'

    const app = express()
    // if you need to interface with a public client, this is required
    app.use(cors({ exposedHeaders: ['WWW-Authenticate'] }))
    app.use(clerkMiddleware())
    app.use(express.json())

    app.listen(3000)
    ```

  </If>

## Create your MCP server and define tools

To let external LLM-powered tools securely interact with your app, you need to define an MCP server, and expose one or more [resources](https://modelcontextprotocol.io/docs/concepts/resources), [prompts](https://modelcontextprotocol.io/docs/concepts/prompts), and/or [tools](https://modelcontextprotocol.io/docs/concepts/tools).

For this guide, you'll implement a single, example tool called `get_clerk_user_data` that retrieves information about the authenticated Clerk user. For more documentation on how to build MCP tools, see the [MCP documentation](https://modelcontextprotocol.io/docs/concepts/tools).

  <If sdk="expressjs">
    The `McpServer()` function is used to create a new MCP server with a name and version. The `server.tool()` function is used to define tools that external LLM-based apps can invoke. Each tool includes:
  </If>

- A name (`get-clerk-user-data`).
- A description of what the tool does.
- Input parameters (none in this case).
- A function that represents the implementation of the tool. In this case, it extracts the user ID, which is provided by Clerk's OAuth authentication, and then fetches the user's data using Clerk's <SDKLink href="/docs/reference/backend/user/get-user" sdks={["js-backend"]} code={true}>getUser()</SDKLink> method. The response is then returned in MCP's expected response format.

  <If sdk="expressjs">
    ```ts {{ filename: 'index.ts', mark: [[15, 37]], collapsible: true }}
    import 'dotenv/config'
    import { type MachineAuthObject, clerkClient, clerkMiddleware } from '@clerk/express'
    import {
      mcpAuthClerk,
      protectedResourceHandlerClerk,
      streamableHttpHandler,
    } from '@clerk/mcp-tools/express'
    import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
    import express from 'express'

  const app = express()
  app.use(clerkMiddleware())
  app.use(express.json())

  const server = new McpServer({
  name: 'test-server',
  version: '0.0.1',
  })

  server.tool(
  'get*clerk_user_data',
  'Gets data about the Clerk user that authorized this request',
  {},
  async (*, { authInfo }) => {
  // non-null assertion is safe here, mcpAuthClerk ensures presence
  const userId = authInfo!.extra!.userId! as string
  const userData = await clerkClient.users.getUser(userId)

        return {
          content: [{ type: 'text', text: JSON.stringify(userData) }],
        }
      },

  )

  app.listen(3000)

  ````

  </If>

  <If sdk="expressjs">
  ## Secure your MCP server & expose metadata endpoints

  Now that your MCP server and tools are defined, the next step is to secure your endpoints and expose them according to the MCP specification. To comply with the MCP specification, your server must expose [OAuth protected resource metadata](https://datatracker.ietf.org/doc/html/rfc9728#section-4.1) at a specific endpoint (`.well-known/oauth-protected-resource`). This metadata allows clients to discover where to authenticate, and some details about how the authentication service works. Older versions of the MCP spec required that you also expose [OAuth authorization server metadata](https://datatracker.ietf.org/doc/html/rfc8414) at a specific endpoint (`.well-known/oauth-authorization-server`). This is no longer required by the current MCP spec, but it may be necessary for some clients that only support older versions of the spec.

  Clerk provides prebuilt helpers via [`@clerk/mcp-tools`](https://github.com/clerk/mcp-tools) that handle this for you:

  * `mcpAuthClerk`: Authentication middleware that automatically verifies the `Authorization` header using Clerk-issued OAuth tokens. If unauthorized, it returns a `www-authenticate` header [in accordance with the MCP specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#authorization-server-location).
  * `protectedResourceHandlerClerk`: Express handler that serves OAuth **protected resource metadata** in the format expected by MCP clients. This handler lets you define specific supported OAuth scopes to declare what access levels your resource requires.
  * `authServerMetadataHandlerClerk`: Express handler that serves OAuth **authorization server metadata** in the format expected by MCP clients. This is still often needed for clients that implement older mcp spec versions.
  * `streamableHttpHandler`: Express handler that connects your MCP server to incoming requests using the [streamable HTTP transport](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http).

  > \[!NOTE]
  > For a more in-depth explanation of these helpers, see the [MCP Express reference](https://github.com/clerk/mcp-tools/tree/main/express).

  To secure your endpoints and expose your MCP server to a client, add the following code to your file:

  ```ts {{ filename: 'index.ts', mark: [[3, 4]] }}
  // The rest of your code...

  app.post('/mcp', mcpAuthClerk, streamableHttpHandler(server))
  app.get(
    '/.well-known/oauth-protected-resource/mcp',
    // Specify the scopes that your MCP server needs here
    protectedResourceHandlerClerk({ scopes_supported: ['email', 'profile'] }),
  )
  // This is still often needed for clients that implement the older mcp spec
  app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk)

  app.listen(3000)
  ````

  > \[!WARNING]
  > Your `.well-known` endpoints must be **publicly accessible** for MCP clients to discover OAuth metadata. When protecting routes, consider these paths and ensure they are not protected.

  </If>

## Finished 🎉

Once this is complete, clients that support the latest MCP spec can now invoke the `get-clerk-user-data` tool to securely fetch user data from your app, assuming the request is authorized with a Clerk OAuth token. To test this out, [learn how to connect your client LLM to the MCP server](/docs/guides/development/mcp/connect-mcp-client).

The next step is to replace the demo tool with your own tools, resources, and/or prompts that are relevant to your app. You can learn more about how to do this in the [MCP SDK documentation](https://modelcontextprotocol.io/docs/concepts/tools).
</Steps>
