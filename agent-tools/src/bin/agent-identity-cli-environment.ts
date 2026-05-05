import type { AgentIdentityCliEnvironment } from './agent-identity-cli.js';

/**
 * Select the process environment variables consumed by the `agent-identity` CLI.
 */
export function agentIdentityCliEnvironmentFromProcessEnv(
  env: NodeJS.ProcessEnv,
): AgentIdentityCliEnvironment {
  return {
    ...optionalEnvironmentValue(
      'PRACTICE_AGENT_SESSION_ID_CLAUDE',
      env.PRACTICE_AGENT_SESSION_ID_CLAUDE,
    ),
    ...optionalEnvironmentValue(
      'PRACTICE_AGENT_SESSION_ID_CURSOR',
      env.PRACTICE_AGENT_SESSION_ID_CURSOR,
    ),
    ...optionalEnvironmentValue(
      'PRACTICE_AGENT_SESSION_ID_CODEX',
      env.PRACTICE_AGENT_SESSION_ID_CODEX,
    ),
    ...optionalEnvironmentValue('CODEX_THREAD_ID', env.CODEX_THREAD_ID),
    ...optionalEnvironmentValue('OAK_AGENT_IDENTITY_OVERRIDE', env.OAK_AGENT_IDENTITY_OVERRIDE),
  };
}

function optionalEnvironmentValue(
  name: keyof AgentIdentityCliEnvironment,
  value: string | undefined,
): Partial<AgentIdentityCliEnvironment> {
  if (value === undefined) {
    return {};
  }

  return { [name]: value };
}
