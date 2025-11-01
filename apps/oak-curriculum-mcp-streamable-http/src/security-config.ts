import { parseCsv } from './env.js';

const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'] as const;
const BASE_ORIGINS = ['http://localhost:3000', 'http://localhost:3333'] as const;

function resolveAllowedHosts(
  configured: readonly string[] | undefined,
  vercelHost: string | undefined,
): readonly string[] {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHost) {
    return Array.from(new Set([vercelHost, ...BASE_HOSTS]));
  }
  return BASE_HOSTS;
}

function resolveAllowedOrigins(
  configured: readonly string[] | undefined,
  vercelHost: string | undefined,
): readonly string[] | undefined {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHost) {
    return Array.from(new Set([`https://${vercelHost}`, ...BASE_ORIGINS]));
  }
  return BASE_ORIGINS;
}

export function readSecurityEnv(): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
} {
  const mode = (process.env.REMOTE_MCP_MODE ?? 'stateless') === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(process.env.ALLOWED_HOSTS);
  const configuredOrigins = parseCsv(process.env.ALLOWED_ORIGINS);
  const vercelHost = process.env.VERCEL_URL?.toLowerCase();
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHost);
  const allowedOrigins = resolveAllowedOrigins(configuredOrigins, vercelHost);
  return { mode, allowedHosts, allowedOrigins };
}
