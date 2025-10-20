import type express from 'express';
import { createApp } from '../../src/index.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
export const STUB_DEV_BEARER_TOKEN = 'stub-dev-token';
const STUB_API_KEY = 'stub-api-key';

export interface StubbedHttpApp {
  readonly app: express.Express;
  readonly restoreEnvironment: () => void;
}

function setEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, key);
    return;
  }
  process.env[key] = value;
}

export function createStubbedHttpApp(): StubbedHttpApp {
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

  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.OAK_API_KEY = STUB_API_KEY;
  process.env.REMOTE_MCP_DEV_TOKEN = STUB_DEV_BEARER_TOKEN;
  setEnv('REMOTE_MCP_ALLOW_NO_AUTH', undefined);
  setEnv('DANGEROUSLY_DISABLE_AUTH', undefined);
  setEnv('BASE_URL', undefined);
  setEnv('MCP_CANONICAL_URI', undefined);
  process.env.NODE_ENV = 'test';
  process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
  setEnv('ALLOWED_ORIGINS', undefined);

  const app = createApp();

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
