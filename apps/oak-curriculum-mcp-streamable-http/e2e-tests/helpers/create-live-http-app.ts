import type express from 'express';
import { createApp } from '../../src/index.js';
import type { ToolHandlerOverrides } from '../../src/handlers.js';

export interface LiveHttpApp {
  readonly app: express.Express;
  readonly restoreEnvironment: () => void;
}

export interface CreateLiveHttpAppOptions {
  readonly overrides?: ToolHandlerOverrides;
}

function setEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, key);
    return;
  }
  process.env[key] = value;
}

export function createLiveHttpApp(options?: CreateLiveHttpAppOptions): LiveHttpApp {
  const previous = {
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS,
    OAK_API_KEY: process.env.OAK_API_KEY,
    REMOTE_MCP_DEV_TOKEN: process.env.REMOTE_MCP_DEV_TOKEN,
    REMOTE_MCP_ALLOW_NO_AUTH: process.env.REMOTE_MCP_ALLOW_NO_AUTH,
    DANGEROUSLY_DISABLE_AUTH: process.env.DANGEROUSLY_DISABLE_AUTH,
    BASE_URL: process.env.BASE_URL,
    MCP_CANONICAL_URI: process.env.MCP_CANONICAL_URI,
    NODE_ENV: process.env.NODE_ENV,
    ALLOWED_HOSTS: process.env.ALLOWED_HOSTS,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  } as const;

  setEnv('OAK_CURRICULUM_MCP_USE_STUB_TOOLS', undefined);
  process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'live-mode-api-key';
  process.env.REMOTE_MCP_DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'live-mode-dev-token';
  setEnv('REMOTE_MCP_ALLOW_NO_AUTH', undefined);
  setEnv('DANGEROUSLY_DISABLE_AUTH', undefined);
  process.env.BASE_URL = 'http://localhost:3333';
  process.env.MCP_CANONICAL_URI = previous.MCP_CANONICAL_URI ?? 'http://localhost:3333/mcp';
  process.env.NODE_ENV = 'test';
  process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
  setEnv('ALLOWED_ORIGINS', undefined);

  const app = createApp({ toolHandlerOverrides: options?.overrides });

  const restoreEnvironment = (): void => {
    setEnv('OAK_CURRICULUM_MCP_USE_STUB_TOOLS', previous.OAK_CURRICULUM_MCP_USE_STUB_TOOLS);
    setEnv('OAK_API_KEY', previous.OAK_API_KEY);
    setEnv('REMOTE_MCP_DEV_TOKEN', previous.REMOTE_MCP_DEV_TOKEN);
    setEnv('REMOTE_MCP_ALLOW_NO_AUTH', previous.REMOTE_MCP_ALLOW_NO_AUTH);
    setEnv('DANGEROUSLY_DISABLE_AUTH', previous.DANGEROUSLY_DISABLE_AUTH);
    setEnv('BASE_URL', previous.BASE_URL);
    setEnv('MCP_CANONICAL_URI', previous.MCP_CANONICAL_URI);
    setEnv('NODE_ENV', previous.NODE_ENV);
    setEnv('ALLOWED_HOSTS', previous.ALLOWED_HOSTS);
    setEnv('ALLOWED_ORIGINS', previous.ALLOWED_ORIGINS);
  };

  return { app, restoreEnvironment };
}
