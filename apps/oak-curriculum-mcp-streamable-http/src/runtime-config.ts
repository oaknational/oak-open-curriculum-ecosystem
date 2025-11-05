import { readEnv, type Env } from './env.js';

export interface RuntimeConfig {
  readonly env: Env;
  readonly dangerouslyDisableAuth: boolean;
  readonly useStubTools: boolean;
  readonly vercelHostname?: string;
}

function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const env = readEnv(source);
  return {
    env,
    dangerouslyDisableAuth: toBooleanFlag(source.DANGEROUSLY_DISABLE_AUTH),
    useStubTools: toBooleanFlag(source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
    vercelHostname: source.VERCEL_URL?.toLowerCase(),
  };
}
