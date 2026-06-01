import { fileURLToPath } from 'node:url';

import {
  buildPreToolUseDenyResponse,
  extractBashCommand,
  findBlockedPattern,
} from './blocked-patterns.js';
import { parseHookInput, readStreamText } from './hook-input.js';
import { POLICY_URL, loadBlockedPatterns } from './policy-loader.js';
import type { RunPreToolUseBlockedPatternGuardOptions } from './types.js';

export {
  buildPreToolUseDenyResponse,
  extractBashCommand,
  findBlockedPattern,
  tokenizeCommand,
} from './blocked-patterns.js';
export { parseHookInput, readStreamText } from './hook-input.js';
export { loadBlockedPatterns, parseBlockedPatternPolicy } from './policy-loader.js';

/**
 * Apply default seams so the orchestrator stays under the complexity cap.
 */
function applyGuardDefaults(options: RunPreToolUseBlockedPatternGuardOptions) {
  return {
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    stderr: options.stderr ?? process.stderr,
    policyUrl: options.policyUrl ?? POLICY_URL,
    blockedPatterns: options.blockedPatterns,
  };
}

/** Render a caught error's message for the stderr surface. */
function formatGuardError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown PreToolUse hook failure.';
}

/**
 * Execute the Bash `PreToolUse` guard using Claude's stdin/stdout contract.
 *
 * Exit code semantics:
 * - `0`: hook completed successfully; stdout may contain a deny payload.
 * - `2`: hook failed closed; stderr explains why Claude should stop.
 *
 * The first match wins; only one deny payload is written.
 */
export async function runPreToolUseGuard(
  options: RunPreToolUseBlockedPatternGuardOptions = {},
): Promise<{ exitCode: number }> {
  const seams = applyGuardDefaults(options);

  try {
    const inputText = await readStreamText(seams.stdin);
    const command = extractBashCommand(parseHookInput(inputText));
    const patterns = seams.blockedPatterns ?? (await loadBlockedPatterns(seams.policyUrl));
    const blockedEntry = findBlockedPattern(command, patterns);

    if (blockedEntry !== null) {
      seams.stdout.write(`${JSON.stringify(buildPreToolUseDenyResponse(blockedEntry))}\n`);
    }

    return { exitCode: 0 };
  } catch (error) {
    seams.stderr.write(`${formatGuardError(error)}\n`);
    return { exitCode: 2 };
  }
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const { exitCode } = await runPreToolUseGuard();
  process.exit(exitCode);
}
