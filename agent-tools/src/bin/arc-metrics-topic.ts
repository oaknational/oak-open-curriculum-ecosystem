import { runArcMetricsCli } from '../arc-metrics/cli.js';
import { OutputBuffer } from './agent-tools-cli-topics.js';
import type { AgentToolsCliInput, AgentToolsCliResult } from './agent-tools-cli-types.js';

/** The `arc-metrics` topic's handler for the unified entrypoint. */
export async function runArcMetricsTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  return runArcMetricsCli({
    argv: args,
    cwd: input.cwd,
    env: input.env,
    stdout,
    stderr,
  });
}
