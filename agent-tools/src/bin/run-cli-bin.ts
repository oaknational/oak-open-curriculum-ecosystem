import { agentToolsCliEnvironmentFromProcessEnv, runAgentToolsCli } from './agent-tools-cli.js';
import type {
  AgentToolsCliInput,
  AgentToolsCliResult,
  AgentToolsEnvironment,
} from './agent-tools-cli-types.js';

export interface RunCliBinDeps {
  /** The unified CLI topic this bin binds to (e.g. `'agent-identity'`). Prepended to user argv before invoking the runner. */
  readonly command: string;
  /** User-supplied argv; production-default is `process.argv.slice(2)`. */
  readonly argv: readonly string[];
  /** Working directory the runner should treat as the repo root. */
  readonly cwd: string;
  /** Pre-transformed env; production-default is `agentToolsCliEnvironmentFromProcessEnv(process.env)`. */
  readonly env: AgentToolsEnvironment;
  /** Writable surface for runner success output; production-default is `process.stdout`. Tests inject a capture object. */
  readonly stdout: Pick<NodeJS.WritableStream, 'write'>;
  /** Writable surface for runner diagnostic output and uncaught-throw reporting; production-default is `process.stderr`. */
  readonly stderr: Pick<NodeJS.WritableStream, 'write'>;
  /** Sink for the runner's exit code, or `2` on uncaught throw. Bound to `process.exitCode = code` in production; injected sink in tests (`process.exit()` is intentionally NOT used — flush ordering matters and termination is the host's call). */
  readonly setExitCode: (code: number) => void;
  /** Injected runner; production-default is `runAgentToolsCli`. Tests substitute a stub to drive happy / Error-throw / non-Error-throw paths without process spawning. */
  readonly runner: (input: AgentToolsCliInput) => Promise<AgentToolsCliResult>;
}

/**
 * Run the unified agent-tools CLI for `deps.command`, writing the runner's
 * result through the injected io surfaces. On a thrown Error: emit `.message`;
 * on a thrown non-Error: emit `String(value)`. Exit code mirrors the runner;
 * `2` on uncaught throw.
 *
 * Pure core: no `process.*` access. Unit tests drive it with explicit literal
 * inputs (per `feedback_tests_no_global_state`). The `runCliBinFromProcess`
 * adapter binds this to the real process for production use.
 */
export async function runCliBin(deps: RunCliBinDeps): Promise<void> {
  try {
    // `AgentToolsCliInput.stdout` (the in-flight streaming surface for topics
    // like `codex-exec last-message`) is intentionally NOT populated here.
    // `deps.stdout` is the *result-flush* surface for `AgentToolsCliResult.stdout`
    // returned after the runner completes; the in-flight surface is a distinct
    // semantic that the runner falls back to `process.stdin`/`process.stdout`
    // for. A future command that requires streaming through `deps.stdout` will
    // need this construction extended explicitly.
    const result = await deps.runner({
      argv: [deps.command, ...deps.argv],
      env: deps.env,
      cwd: deps.cwd,
    });
    deps.stdout.write(result.stdout);
    deps.stderr.write(result.stderr);
    deps.setExitCode(result.exitCode);
  } catch (error: unknown) {
    deps.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    deps.setExitCode(2);
  }
}

/**
 * Process-binding adapter: each `agent-tools/src/bin/<command>.ts` file calls
 * this with its command name as the only differing surface across the cluster.
 */
export async function runCliBinFromProcess(command: string): Promise<void> {
  return runCliBin({
    command,
    argv: process.argv.slice(2),
    cwd: process.cwd(),
    env: agentToolsCliEnvironmentFromProcessEnv(process.env),
    stdout: process.stdout,
    stderr: process.stderr,
    setExitCode: (code) => {
      process.exitCode = code;
    },
    runner: runAgentToolsCli,
  });
}
