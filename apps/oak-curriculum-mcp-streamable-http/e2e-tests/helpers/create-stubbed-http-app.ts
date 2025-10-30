import type express from 'express';
import { createApp } from '../../src/index.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
// No longer using bearer tokens - using auth bypass instead
export const STUB_DEV_BEARER_TOKEN = ''; // Deprecated, kept for backward compatibility
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
    DANGEROUSLY_DISABLE_AUTH: process.env.DANGEROUSLY_DISABLE_AUTH,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    BASE_URL: process.env.BASE_URL,
    MCP_CANONICAL_URI: process.env.MCP_CANONICAL_URI,
    ALLOWED_HOSTS: process.env.ALLOWED_HOSTS,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  } as const;

  // Configure for stub mode with auth bypass
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.OAK_API_KEY = STUB_API_KEY;

  // Disable auth for E2E tests
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
  
  // Clerk keys not needed when auth disabled, but set for completeness
  process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
  process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';

  setEnv('BASE_URL', undefined);
  setEnv('MCP_CANONICAL_URI', undefined);
  process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
  setEnv('ALLOWED_ORIGINS', undefined);

  const app = createApp();

  const restoreEnvironment = (): void => {
    setEnv('OAK_CURRICULUM_MCP_USE_STUB_TOOLS', previous.OAK_CURRICULUM_MCP_USE_STUB_TOOLS);
    setEnv('OAK_API_KEY', previous.OAK_API_KEY);
    setEnv('DANGEROUSLY_DISABLE_AUTH', previous.DANGEROUSLY_DISABLE_AUTH);
    setEnv('CLERK_PUBLISHABLE_KEY', previous.CLERK_PUBLISHABLE_KEY);
    setEnv('CLERK_SECRET_KEY', previous.CLERK_SECRET_KEY);
    setEnv('BASE_URL', previous.BASE_URL);
    setEnv('MCP_CANONICAL_URI', previous.MCP_CANONICAL_URI);
    setEnv('ALLOWED_HOSTS', previous.ALLOWED_HOSTS);
    setEnv('ALLOWED_ORIGINS', previous.ALLOWED_ORIGINS);
  };

  return { app, restoreEnvironment };
}
