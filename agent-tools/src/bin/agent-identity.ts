#!/usr/bin/env node
import { agentToolsCliEnvironmentFromProcessEnv, runAgentToolsCli } from './agent-tools-cli.js';

try {
  const result = await runAgentToolsCli({
    argv: ['agent-identity', ...process.argv.slice(2)],
    env: agentToolsCliEnvironmentFromProcessEnv(process.env),
    cwd: process.cwd(),
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exitCode = result.exitCode;
} catch (error: unknown) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
}
