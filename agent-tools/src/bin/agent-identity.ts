#!/usr/bin/env node
import { runAgentIdentityCli } from './agent-identity-cli.js';
import { agentIdentityCliEnvironmentFromProcessEnv } from './agent-identity-cli-environment.js';

const result = runAgentIdentityCli({
  argv: process.argv.slice(2),
  env: agentIdentityCliEnvironmentFromProcessEnv(process.env),
});

process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

if (result.exitCode !== 0) {
  process.exit(result.exitCode);
}
