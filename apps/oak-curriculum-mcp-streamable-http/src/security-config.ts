import { parseCsv } from './env.js';
import type { RuntimeConfig } from './runtime-config.js';

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

export function createSecurityConfig(config: RuntimeConfig): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
} {
  const mode = config.env.REMOTE_MCP_MODE === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(config.env.ALLOWED_HOSTS);
  const configuredOrigins = parseCsv(config.env.ALLOWED_ORIGINS);
  const vercelHost = config.vercelHostname;
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHost);
  const allowedOrigins = resolveAllowedOrigins(configuredOrigins, vercelHost);
  return { mode, allowedHosts, allowedOrigins };
}
