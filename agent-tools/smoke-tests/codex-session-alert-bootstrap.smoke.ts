import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { typeSafeGet } from '@oaknational/type-helpers';

import { TEAM_ALERT_BOOTSTRAP_HELP_TEXT } from '../src/codex/team-alert-bootstrap-cli-args.js';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const hookPath = join(repoRoot, '.codex/hooks/practice-session-identity.mjs');
const bootstrapCliPath = join(repoRoot, 'agent-tools/dist/src/codex/team-alert-bootstrap-cli.js');
const input = JSON.stringify({
  session_id: '22e83599-a627-4427-b23c-fe6ce046e859',
  source: 'startup',
  hook_event_name: 'SessionStart',
  model: 'GPT-5',
});
const result = spawnSync(process.execPath, [hookPath], {
  cwd: repoRoot,
  input,
  encoding: 'utf8',
});

if (result.status !== 0) {
  process.stderr.write(
    `Codex SessionStart hook exited ${String(result.status)}:\n${result.stderr}`,
  );
  process.exit(1);
}

const additionalContext = readAdditionalContext(result.stdout);
const requiredSnippets = [
  '[Practice agent identity]',
  '[Codex team alert bootstrap]',
  'follow the generated Codex team-session alert bootstrap in AGENTS.md',
  '.agent/rules/use-monitor-for-event-driven-wake.md#codex-notify-session-relay',
];
const missing = requiredSnippets.filter((snippet) => !additionalContext?.includes(snippet));
if (missing.length > 0) {
  process.stderr.write(
    `Codex SessionStart hook omitted required context:\n${missing.join('\n')}\n` +
      `stdout: ${result.stdout}\n`,
  );
  process.exit(1);
}

verifyInvalidBootstrapInvocationDoesNotWrite();
verifyHelpInvocationDoesNotWrite('--help');
verifyHelpInvocationDoesNotWrite('-h');

process.stdout.write(
  'codex-session-alert-bootstrap smoke: shipped hook context and CLI refusal verified\n',
);

interface HookResponse {
  readonly hookSpecificOutput?: unknown;
}

interface HookSpecificOutput {
  readonly additionalContext?: unknown;
}

function readAdditionalContext(stdout: string): string | undefined {
  const parsed = parseJsonRecord(stdout);
  if (parsed === undefined) {
    return undefined;
  }
  const hookOutput = typeSafeGet(parsed, 'hookSpecificOutput');
  return readContextFromHookOutput(hookOutput);
}

function parseJsonRecord(value: string): HookResponse | undefined {
  try {
    const parsed: unknown = JSON.parse(value);
    return isHookResponse(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function readContextFromHookOutput(hookOutput: unknown): string | undefined {
  if (!isHookSpecificOutput(hookOutput)) {
    return undefined;
  }
  const context = typeSafeGet(hookOutput, 'additionalContext');
  return typeof context === 'string' ? context : undefined;
}

function isHookResponse(value: unknown): value is HookResponse {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHookSpecificOutput(value: unknown): value is HookSpecificOutput {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function containsStackFrame(output: string): boolean {
  return output.split('\n').some((line) => line.trimStart().startsWith('at '));
}

function verifyInvalidBootstrapInvocationDoesNotWrite(): void {
  const agentsPath = join(repoRoot, 'AGENTS.md');
  const agentsBefore = readFileSync(agentsPath);
  const invalid = spawnSync(process.execPath, [bootstrapCliPath, '--definitely-unknown'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const agentsAfter = readFileSync(agentsPath);

  if (invalid.status === 0 || invalid.status === null) {
    process.stderr.write(
      `Invalid bootstrap invocation exited ${String(invalid.status)}:\n${invalid.stderr}`,
    );
    process.exit(1);
  }
  if (
    !invalid.stderr.includes(
      'Unsupported Codex team-alert bootstrap arguments: --definitely-unknown',
    ) ||
    !invalid.stderr.includes(TEAM_ALERT_BOOTSTRAP_HELP_TEXT)
  ) {
    process.stderr.write(
      `Invalid bootstrap invocation omitted actionable help:\n${invalid.stderr}`,
    );
    process.exit(1);
  }
  if (containsStackFrame(invalid.stderr)) {
    process.stderr.write(`Invalid bootstrap invocation leaked a stack trace:\n${invalid.stderr}`);
    process.exit(1);
  }
  if (invalid.stdout.includes('Generated AGENTS.md')) {
    process.stderr.write(`Invalid bootstrap invocation wrote success output:\n${invalid.stdout}`);
    process.exit(1);
  }
  if (!agentsBefore.equals(agentsAfter)) {
    process.stderr.write('Invalid bootstrap invocation changed AGENTS.md.\n');
    process.exit(1);
  }
}

function verifyHelpInvocationDoesNotWrite(helpFlag: '--help' | '-h'): void {
  const agentsPath = join(repoRoot, 'AGENTS.md');
  const agentsBefore = readFileSync(agentsPath);
  const help = spawnSync(process.execPath, [bootstrapCliPath, helpFlag], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const agentsAfter = readFileSync(agentsPath);

  if (help.status !== 0) {
    process.stderr.write(
      `Bootstrap ${helpFlag} invocation exited ${String(help.status)}:\n${help.stderr}`,
    );
    process.exit(1);
  }
  if (!help.stdout.includes(TEAM_ALERT_BOOTSTRAP_HELP_TEXT)) {
    process.stderr.write(`Bootstrap ${helpFlag} invocation omitted full help:\n${help.stdout}`);
    process.exit(1);
  }
  if (help.stderr !== '' || containsStackFrame(`${help.stdout}\n${help.stderr}`)) {
    process.stderr.write(
      `Bootstrap ${helpFlag} invocation emitted an unexpected error or stack trace:\n` +
        `${help.stdout}${help.stderr}`,
    );
    process.exit(1);
  }
  if (help.stdout.includes('Generated AGENTS.md')) {
    process.stderr.write(
      `Bootstrap ${helpFlag} invocation wrote success-generation output:\n${help.stdout}`,
    );
    process.exit(1);
  }
  if (!agentsBefore.equals(agentsAfter)) {
    process.stderr.write(`Bootstrap ${helpFlag} invocation changed AGENTS.md.\n`);
    process.exit(1);
  }
}
