import { appendFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { isErr, ok, type Result } from '@oaknational/result';

import {
  buildCopilotPreToolUseDenyResponse,
  buildPreToolUseDenyResponse,
} from './content-deny-response.js';
import {
  extractContentChanges,
  routeContentChanges,
  selectExactlyOneSchema,
} from './content-change-router.js';
import { parseHookInput, readStreamText, resolveContentPair } from './hook-input.js';
import { evaluateContentPolicy } from './content-policy-core.js';
import { findAddedBlockedContent, findAddedScopedBlock } from './matchers.js';
import {
  POLICY_URL,
  loadBlockedContentPatterns,
  loadScopedContentBlocks,
} from './policy-loader.js';
import {
  type RoutedContentChanges,
  type RunPreToolUseContentGuardOptions,
} from './content-types.js';
import type { ScopedContentBlockGroup } from './types.js';

export type {
  CopilotPreToolUseDenyResponse,
  RunPreToolUseContentGuardOptions,
} from './content-types.js';
export type { PreToolUseDenyResponse } from './types.js';

export { CopilotPreToolUseDenyResponseSchema } from './content-types.js';
export { PreToolUseDenyResponseSchema } from './types.js';

export { extractContentChanges, routeContentChanges, selectExactlyOneSchema };

export { parseHookInput, readStreamText } from './hook-input.js';

export {
  findAddedBlockedContent,
  findAddedScopedBlock,
  isPathInScope,
  lineIsPredominantlyCodeShaped,
} from './matchers.js';

export {
  loadScopedContentBlocks,
  parseBlockedContentPolicy,
  parseScopedContentBlocks,
} from './policy-loader.js';

export {
  buildCopilotPreToolUseDenyResponse,
  buildPreToolUseDenyResponse,
} from './content-deny-response.js';

/**
 * Read prior file content for the real hook adapter.
 */
function readPriorFileContent(filePath: string): string | null {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Apply default seams to the guard options. Extracted so the orchestrator's
 * complexity stays under the workspace's cap.
 */
function applyGuardDefaults(options: RunPreToolUseContentGuardOptions): {
  readonly stdin: AsyncIterable<string | Buffer>;
  readonly stdout: { write(text: string): void };
  readonly stderr: { write(text: string): void };
  readonly policyUrl: URL;
  readonly blockedPatterns: readonly string[] | undefined;
  readonly scopedBlocks: readonly ScopedContentBlockGroup[] | undefined;
  readonly readPriorContent: (filePath: string) => string | null;
} {
  return {
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    stderr: options.stderr ?? process.stderr,
    policyUrl: options.policyUrl ?? POLICY_URL,
    blockedPatterns: options.blockedPatterns,
    scopedBlocks: options.scopedBlocks,
    readPriorContent: options.readPriorContent ?? readPriorFileContent,
  };
}

/**
 * Read, schema-route, and normalise a hook payload, then resolve any
 * whole-file prior-content references. The platform discriminant is retained
 * only for the response renderer.
 */
async function readResolvedContentChanges(
  stdin: AsyncIterable<string | Buffer>,
  readPriorContent: (filePath: string) => string | null,
): Promise<Result<RoutedContentChanges, Error>> {
  const inputText = await readStreamText(stdin);
  const hookInputResult = parseHookInput(inputText);
  if (isErr(hookInputResult)) {
    return hookInputResult;
  }
  const routedResult = routeContentChanges(hookInputResult.value);
  if (isErr(routedResult)) {
    captureUnmatchedInput(inputText, routedResult.error.message);
    return routedResult;
  }
  const changes = routedResult.value.changes.map((change) => {
    const { newContent, priorContent } = resolveContentPair(change, readPriorContent);
    return {
      newContent,
      priorContent,
      ...(change.filePath === undefined ? {} : { filePath: change.filePath }),
    };
  });
  return ok({ responseFormat: routedResult.value.responseFormat, changes });
}

/**
 * DIAGNOSTIC SCAFFOLD — worktree-only, removed before any landing. Appends
 * the raw PreToolUse payload that matched zero schemas to a gitignored
 * machine-local file (`tmp/pretooluse-unmatched.jsonl`) so the live Copilot
 * CLI envelope shape can be OBSERVED before it is schematised
 * (verify-data-supports-shape: a schema is never guessed from a denial).
 * Capture failure is swallowed deliberately: the fail-closed deny result
 * must never be masked or altered by diagnostics.
 */
function captureUnmatchedInput(rawInput: string, reason: string): void {
  try {
    appendFileSync(
      'tmp/pretooluse-unmatched.jsonl',
      `${JSON.stringify({ at: new Date().toISOString(), reason, rawInput })}\n`,
    );
  } catch {
    /* deliberate: diagnostics must never change the guard's result */
  }
}

/**
 * Render a caught error's message for the stderr surface, preserving the
 * unknown-source convention used elsewhere in the workspace.
 */
function formatGuardError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown PreToolUse content hook failure.';
}

/**
 * Execute the content guard using a schema-routed PreToolUse contract.
 *
 * Two layers of detection are run, in order:
 *   1. Flat `blocked_patterns` — universal, path-agnostic block.
 *   2. `scoped_blocks` — path-scoped, citation-bearing doctrine blocks.
 *
 * The first match wins; only one deny payload is written.
 */
export async function runPreToolUseContentGuard(
  options: RunPreToolUseContentGuardOptions = {},
): Promise<{ exitCode: number }> {
  const seams = applyGuardDefaults(options);

  try {
    const routedResult = await readResolvedContentChanges(seams.stdin, seams.readPriorContent);
    if (isErr(routedResult)) {
      seams.stderr.write(`${routedResult.error.message}\n`);
      return { exitCode: 2 };
    }
    const routed = routedResult.value;
    const patterns = seams.blockedPatterns ?? (await loadBlockedContentPatterns(seams.policyUrl));
    const blocks = seams.scopedBlocks ?? (await loadScopedContentBlocks(seams.policyUrl));
    const decision = evaluateContentPolicy(routed.changes, patterns, blocks);
    if (decision.kind === 'deny') {
      const response =
        routed.responseFormat === 'claude'
          ? buildPreToolUseDenyResponse(decision.deny)
          : buildCopilotPreToolUseDenyResponse(decision.deny);
      seams.stdout.write(`${JSON.stringify(response)}\n`);
    }
    return { exitCode: 0 };
  } catch (error) {
    seams.stderr.write(`${formatGuardError(error)}\n`);
    return { exitCode: 2 };
  }
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const { exitCode } = await runPreToolUseContentGuard();
  process.exit(exitCode);
}
