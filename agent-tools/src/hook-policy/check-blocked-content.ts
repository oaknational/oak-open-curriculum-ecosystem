import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  extractContentChange,
  parseHookInput,
  readStreamText,
  resolveContentPair,
} from './hook-input.js';
import { findAddedBlockedContent, findAddedScopedBlock } from './matchers.js';
import {
  POLICY_URL,
  loadBlockedContentPatterns,
  loadScopedContentBlocks,
} from './policy-loader.js';
import {
  PRE_TOOL_USE_EVENT_NAME,
  type PreToolUseDenyResponse,
  type RunPreToolUseContentGuardOptions,
  type ScopedContentBlock,
} from './types.js';

export type { PreToolUseDenyResponse, RunPreToolUseContentGuardOptions } from './types.js';

export { PreToolUseDenyResponseSchema } from './types.js';

export { extractContentChange, parseHookInput, readStreamText } from './hook-input.js';

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

/**
 * Build the structured deny payload Claude expects for `PreToolUse`.
 *
 * The optional citation surfaces the doctrinal anchor in the deny reason
 * so the agent learns *why* the pattern is forbidden, not only *that* it is.
 */
export function buildPreToolUseDenyResponse(
  blockedPattern: string,
  citation?: string,
): PreToolUseDenyResponse {
  const baseReason = `Blocked by repo hook policy: content contains forbidden pattern "${blockedPattern}". Only the project owner can use this pattern.`;
  const reason = citation === undefined ? baseReason : `${baseReason} Citation: ${citation}.`;
  return {
    hookSpecificOutput: {
      hookEventName: PRE_TOOL_USE_EVENT_NAME,
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}

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
  readonly scopedBlocks: readonly ScopedContentBlock[] | undefined;
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
 * Read + parse the Claude hook stdin payload into the resolved
 * new/prior content pair plus the optional file path. Extracted so the
 * orchestrator stays under the workspace's complexity cap.
 */
async function readResolvedContent(
  stdin: AsyncIterable<string | Buffer>,
  readPriorContent: (filePath: string) => string | null,
): Promise<{ newContent: string; priorContent: string; filePath?: string }> {
  const inputText = await readStreamText(stdin);
  const hookInput = parseHookInput(inputText);
  const change = extractContentChange(hookInput);
  const { newContent, priorContent } = resolveContentPair(change, readPriorContent);
  return { newContent, priorContent, filePath: change.filePath };
}

/**
 * Render a caught error's message for the stderr surface, preserving the
 * unknown-source convention used elsewhere in the workspace.
 */
function formatGuardError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown PreToolUse content hook failure.';
}

/**
 * Resolve a flat-blocked-pattern denial against new/prior content. Writes
 * the deny payload to stdout when matched; returns true so the orchestrator
 * skips the scoped-block phase.
 */
function denyOnBlockedPattern(
  newContent: string,
  priorContent: string,
  patterns: readonly string[],
  stdout: { write(text: string): void },
): boolean {
  const blockedPattern = findAddedBlockedContent(newContent, priorContent, patterns);
  if (blockedPattern === null) {
    return false;
  }
  stdout.write(`${JSON.stringify(buildPreToolUseDenyResponse(blockedPattern))}\n`);
  return true;
}

/**
 * Resolve a scoped-block denial against new/prior content. Writes the deny
 * payload (with citation) to stdout when matched.
 */
function denyOnScopedBlock(
  newContent: string,
  priorContent: string,
  filePath: string | undefined,
  blocks: readonly ScopedContentBlock[],
  stdout: { write(text: string): void },
): void {
  const matchedBlock = findAddedScopedBlock(newContent, priorContent, filePath, blocks);
  if (matchedBlock === null) {
    return;
  }
  stdout.write(
    `${JSON.stringify(buildPreToolUseDenyResponse(matchedBlock.pattern, matchedBlock.citation))}\n`,
  );
}

/**
 * Execute the content guard using Claude's stdin/stdout contract.
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
    const { newContent, priorContent, filePath } = await readResolvedContent(
      seams.stdin,
      seams.readPriorContent,
    );
    const patterns = seams.blockedPatterns ?? (await loadBlockedContentPatterns(seams.policyUrl));

    if (denyOnBlockedPattern(newContent, priorContent, patterns, seams.stdout)) {
      return { exitCode: 0 };
    }

    const blocks = seams.scopedBlocks ?? (await loadScopedContentBlocks(seams.policyUrl));
    denyOnScopedBlock(newContent, priorContent, filePath, blocks, seams.stdout);
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
