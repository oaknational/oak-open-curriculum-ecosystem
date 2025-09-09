import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest, Tool, TextContent } from '@modelcontextprotocol/sdk/types.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  isToolName,
} from '@oaknational/oak-curriculum-sdk';
import { getMcpTools } from './mcp-tools.js';
import { readEnv, parseCsv } from './env.js';
import { bearerAuth } from './auth.js';

// Dev-mode detection is handled inside the auth middleware

function formatToolResponse(
  result: unknown,
  isError = false,
): {
  content: readonly TextContent[];
  isError?: true;
} {
  return {
    content: [
      {
        type: 'text',
        text: isError
          ? `Error: ${result instanceof Error ? result.message : 'Unknown error'}`
          : JSON.stringify(result, null, 2),
      },
    ],
    ...(isError && { isError: true }),
  };
}

function findTool(name: string, tools: readonly Tool[]): Tool {
  for (const tool of tools) {
    if (tool.name === name) {
      return tool;
    }
  }
  throw new Error(`Unknown tool: ${name}`);
}

function dnsRebindingProtection(allowedHosts: readonly string[]): express.RequestHandler {
  const allowed = new Set(allowedHosts.map((h) => h.toLowerCase()));
  return (req, res, next) => {
    const hostHeader = req.headers.host;
    if (!hostHeader) {
      res.status(403).json({ error: 'Forbidden: missing Host header' });
      return;
    }
    const hostname = hostHeader.split(':')[0]?.toLowerCase();
    if (!allowed.has(hostname)) {
      res.status(403).json({ error: 'Forbidden: host not allowed' });
      return;
    }
    next();
  };
}

function createCorsMiddleware(
  mode: 'stateless' | 'session',
  allowedOrigins: readonly string[] | undefined,
) {
  const originSet = new Set((allowedOrigins ?? []).map((o) => o.toLowerCase()));
  const isSession = mode === 'session';
  return cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const isAllowed = originSet.size > 0 && originSet.has(origin.toLowerCase());
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('CORS: origin not allowed'));
      }
    },
    credentials: false,
    allowedHeaders: isSession
      ? ['Content-Type', 'Authorization', 'mcp-session-id']
      : ['Content-Type', 'Authorization'],
    exposedHeaders: isSession ? ['Mcp-Session-Id'] : [],
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
}

export function createApp(): express.Express {
  const app = express();
  // eslint-disable-next-line import-x/no-named-as-default-member -- generally good practice, but we use the default, so no tree shaking benefits
  app.use(express.json({ limit: '1mb' }));

  const { mode, allowedHosts, allowedOrigins } = readSecurityEnv();
  const corsMw = applySecurity(app, mode, allowedHosts, allowedOrigins);

  const { transport, ready, server } = initializeServer();
  registerHandlers(server);
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });

  setupOAuthMetadata(app, corsMw);
  app.use(bearerAuth);
  app.post('/mcp', createMcpHandler(transport));

  return app;
}

function readSecurityEnv(): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
} {
  const env = readEnv();
  const mode = (env.REMOTE_MCP_MODE ?? 'stateless') === 'session' ? 'session' : 'stateless';
  const allowedHosts = parseCsv(env.ALLOWED_HOSTS) ?? ['localhost', '127.0.0.1', '::1'];
  const allowedOrigins = parseCsv(env.ALLOWED_ORIGINS);
  return { mode, allowedHosts, allowedOrigins };
}

function applySecurity(
  app: express.Express,
  mode: 'stateless' | 'session',
  allowedHosts: readonly string[],
  allowedOrigins: readonly string[] | undefined,
): express.RequestHandler {
  app.use(dnsRebindingProtection(allowedHosts));
  const corsMw = createCorsMiddleware(mode, allowedOrigins);
  app.use(corsMw);
  return corsMw;
}

function initializeServer(): {
  server: Server;
  transport: StreamableHTTPServerTransport;
  ready: Promise<void>;
} {
  const server = new Server(
    { name: 'oak-curriculum-mcp-streamable-http', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const ready = server.connect(transport);
  return { server, transport, ready };
}

function setupOAuthMetadata(app: express.Express, corsMw: express.RequestHandler): void {
  app.options('/.well-known/oauth-protected-resource', corsMw);
  app.get('/.well-known/oauth-protected-resource', (_req, res) => {
    res.json({ resource: 'oak-curriculum-mcp-streamable-http', authorization_servers: [] });
  });
}

function registerHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: getMcpTools() }));

  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    try {
      const tools = getMcpTools();
      findTool(name, tools);
      if (!isToolName(name)) {
        return formatToolResponse(new Error(`Unknown tool: ${name}`), true);
      }
      const env = readEnv();
      const client = createOakPathBasedClient(env.OAK_API_KEY);
      const result = await executeToolCall(name, args, client);
      if (result.error) {
        return formatToolResponse(new Error(result.error.message), true);
      }
      return formatToolResponse(result.data);
    } catch (error) {
      const safeError = error instanceof Error ? error : new Error('Unknown error');
      return formatToolResponse(safeError, true);
    }
  });
}

function createMcpHandler(transport: StreamableHTTPServerTransport) {
  return async (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    await transport.handleRequest(req, res, req.body);
  };
}

export async function startDevServer(): Promise<void> {
  const app = createApp();
  const port = Number(process.env.PORT ?? 3333);
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve();
    });
    server.on('error', reject);
  });

  console.log(`Streaming HTTP MCP listening on http://localhost:${String(port)}`);
}
