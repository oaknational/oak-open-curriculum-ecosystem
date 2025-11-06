import { PassThrough } from 'node:stream';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  createStubToolExecutionAdapter,
  McpToolError,
  createOakPathBasedClient,
  type ToolName,
} from '@oaknational/oak-curriculum-sdk';

import { registerMcpTools } from '../server.js';
import type { UniversalToolExecutors } from '../../tools/index.js';
import { loadRuntimeConfig } from '../../runtime-config.js';

interface JsonRpcMessage {
  readonly jsonrpc: '2.0';
  readonly id?: string | number | null;
  readonly method?: string;
  readonly params?: unknown;
  readonly result?: unknown;
  readonly error?: unknown;
}

class JsonLineBuffer {
  private buffer = '';

  append(chunk: Buffer): void {
    this.buffer += chunk.toString('utf8');
  }

  readLine(): string | null {
    const newlineIndex = this.buffer.indexOf('\n');
    if (newlineIndex === -1) {
      return null;
    }
    const line = this.buffer.slice(0, newlineIndex);
    this.buffer = this.buffer.slice(newlineIndex + 1);
    return line;
  }
}

function isJsonRpcMessage(value: unknown): value is JsonRpcMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('jsonrpc' in value)) {
    return false;
  }
  return Reflect.get(value, 'jsonrpc') === '2.0';
}

class JsonRpcQueue {
  private readonly buffer = new JsonLineBuffer();
  private readonly pending: JsonRpcMessage[] = [];
  private readonly stream: PassThrough;

  constructor(stream: PassThrough) {
    this.stream = stream;
    this.stream.on('data', (chunk: Buffer) => {
      this.buffer.append(chunk);
      this.drain();
    });
  }

  private drain(): void {
    let line: string | null;
    while ((line = this.buffer.readLine()) !== null) {
      const parsed: unknown = JSON.parse(line);
      if (!isJsonRpcMessage(parsed)) {
        throw new TypeError('Received invalid JSON-RPC message');
      }
      this.pending.push(parsed);
    }
  }

  async readForId(targetId: JsonRpcMessage['id']): Promise<JsonRpcMessage> {
    for (;;) {
      const initialLength = this.pending.length;
      for (let index = 0; index < initialLength; index += 1) {
        const candidate = this.pending.shift();
        if (!candidate) {
          break;
        }
        if (candidate.id === targetId) {
          return candidate;
        }
        this.pending.push(candidate);
      }
      const chunk: Buffer = await new Promise((resolve) => {
        this.stream.once('data', (data: Buffer) => {
          resolve(data);
        });
      });
      this.buffer.append(chunk);
      this.drain();
    }
  }
}

export interface StubbedStdioServerOptions {
  readonly missingTools?: readonly ToolName[];
}

export interface StubbedStdioServer {
  request(message: JsonRpcMessage): Promise<JsonRpcMessage>;
  close(): Promise<void>;
}

function createNoopLogger(): {
  trace: () => void;
  debug: () => void;
  info: () => void;
  warn: () => void;
  error: () => void;
  fatal: () => void;
} {
  const noop = (): void => undefined;
  return {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
  };
}

function buildToolExecutors(missingTools: ReadonlySet<ToolName>): UniversalToolExecutors {
  const stubExecutor = createStubToolExecutionAdapter();
  return {
    executeMcpTool: (name, args) => {
      if (missingTools.has(name)) {
        return Promise.resolve({
          error: new McpToolError(`Stub payload not available for tool: ${name}`, name, {
            code: 'STUB_NOT_FOUND',
          }),
        });
      }
      return stubExecutor(name, args);
    },
  };
}

export async function createStubbedStdioServer(
  options?: StubbedStdioServerOptions,
): Promise<StubbedStdioServer> {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  const transport = new StdioServerTransport(stdin, stdout);
  const server = new McpServer({ name: 'test-stdio-server', version: 'test' });
  const missingTools = new Set(options?.missingTools ?? []);
  const runtimeConfig = loadRuntimeConfig();

  registerMcpTools(
    server,
    createOakPathBasedClient('stub-api-key'),
    createNoopLogger(),
    runtimeConfig,
    buildToolExecutors(missingTools),
  );

  await server.connect(transport);

  const queue = new JsonRpcQueue(stdout);

  return {
    async request(message: JsonRpcMessage): Promise<JsonRpcMessage> {
      if (!Object.prototype.hasOwnProperty.call(message, 'id')) {
        throw new TypeError('JSON-RPC message must include an id field');
      }
      stdin.write(`${JSON.stringify(message)}\n`);
      return queue.readForId(message.id ?? null);
    },
    async close(): Promise<void> {
      await transport.close();
      stdin.destroy();
      stdout.destroy();
    },
  };
}
