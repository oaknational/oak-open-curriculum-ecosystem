#!/usr/bin/env node
import { runAgentIdentityCli, type AgentIdentityCliEnvironment } from './agent-identity-cli.js';

const result = runAgentIdentityCli({
  argv: process.argv.slice(2),
  env: processEnvironment(),
});

process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

if (result.exitCode !== 0) {
  process.exit(result.exitCode);
}

function processEnvironment(): AgentIdentityCliEnvironment {
  return {
    ...(process.env.CLAUDE_SESSION_ID === undefined
      ? {}
      : { CLAUDE_SESSION_ID: process.env.CLAUDE_SESSION_ID }),
    ...(process.env.CODEX_THREAD_ID === undefined
      ? {}
      : { CODEX_THREAD_ID: process.env.CODEX_THREAD_ID }),
    ...(process.env.OAK_AGENT_SEED === undefined
      ? {}
      : { OAK_AGENT_SEED: process.env.OAK_AGENT_SEED }),
    ...(process.env.OAK_AGENT_IDENTITY_OVERRIDE === undefined
      ? {}
      : { OAK_AGENT_IDENTITY_OVERRIDE: process.env.OAK_AGENT_IDENTITY_OVERRIDE }),
  };
}
