import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Claude PreToolUse event name for deny responses. */
const PRE_TOOL_USE_EVENT_NAME = 'PreToolUse';
const POLICY_URL = new URL('../.agent/hooks/policy.json', import.meta.url);

/**
 * Parse JSON text from Claude's hook stdin payload.
 *
 * @param {string} hookInputText
 * @returns {unknown}
 */
export function parseHookInput(hookInputText) {
  try {
    return JSON.parse(hookInputText);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse failure.';
    throw new Error(`Claude PreToolUse hook input was not valid JSON: ${message}`);
  }
}

/**
 * Resolve the tool input object from various Claude hook payload shapes.
 *
 * @param {unknown} hookInput
 * @returns {Record<string, unknown>}
 */
function resolveInput(hookInput) {
  if (hookInput !== null && typeof hookInput === 'object') {
    if (
      'tool_input' in hookInput &&
      hookInput.tool_input !== null &&
      typeof hookInput.tool_input === 'object'
    ) {
      return hookInput.tool_input;
    }
    if (
      'toolInput' in hookInput &&
      hookInput.toolInput !== null &&
      typeof hookInput.toolInput === 'object'
    ) {
      return hookInput.toolInput;
    }
    return hookInput;
  }
  throw new Error('Claude PreToolUse hook input was not an object.');
}

/**
 * Extract incoming content, prior-content references, and the target file path
 * from a Claude Edit or Write tool payload.
 *
 * For Edit: `new_string` is the incoming content; `old_string` is the prior;
 * `file_path` (when present) anchors path-scoped checks.
 *
 * For Write: `content` is the incoming content; `file_path` is both the
 * scope anchor AND the prior-content reference. The extraction step never
 * reads the file itself — the read is delegated to the caller.
 *
 * The hook blocks patterns that are being ADDED — present in the new content
 * but absent from the prior content. This allows edits that preserve an
 * already-present pattern without blocking.
 *
 * @param {unknown} hookInput
 * @returns {{
 *   newContent: string,
 *   priorContent: string,
 *   filePath?: string,
 *   priorFilePath?: string,
 * }}
 */
export function extractContentChange(hookInput) {
  const input = resolveInput(hookInput);

  // Edit tool: new_string vs old_string
  if ('new_string' in input && typeof input.new_string === 'string') {
    const prior =
      'old_string' in input && typeof input.old_string === 'string' ? input.old_string : '';
    const filePathInfo =
      'file_path' in input && typeof input.file_path === 'string'
        ? { filePath: input.file_path }
        : {};
    return { newContent: input.new_string, priorContent: prior, ...filePathInfo };
  }

  // Write tool: content vs existing file
  if ('content' in input && typeof input.content === 'string') {
    if ('file_path' in input && typeof input.file_path === 'string') {
      return {
        newContent: input.content,
        priorContent: '',
        filePath: input.file_path,
        priorFilePath: input.file_path,
      };
    }
    return { newContent: input.content, priorContent: '' };
  }

  throw new Error('Claude PreToolUse hook input did not include writable content.');
}

/**
 * Resolve final new/prior content using an injected prior-content reader.
 *
 * @param {{ newContent: string, priorContent: string, priorFilePath?: string }} change
 * @param {(path: string) => string | null} readPriorContent
 * @returns {{ newContent: string, priorContent: string }}
 */
export function resolveContentPair(change, readPriorContent) {
  if (change.priorFilePath === undefined) {
    return { newContent: change.newContent, priorContent: change.priorContent };
  }

  return {
    newContent: change.newContent,
    priorContent: readPriorContent(change.priorFilePath) ?? '',
  };
}

/**
 * @typedef {{
 *   pattern: string,
 *   kind?: 'literal' | 'regex',
 *   include_paths: readonly string[],
 *   exclude_paths?: readonly string[],
 *   excludes_inline_code?: boolean,
 *   excludes_lines_with?: readonly string[],
 *   citation: string,
 * }} ScopedContentBlock
 */

/**
 * Strip inline-code spans (backticked text) from a single line.
 *
 * Used by the regex matcher so that a SHA wrapped in backticks
 * (e.g. `abc1234`) is treated as a code reference and not as a
 * load-bearing literal token in the prose.
 *
 * @param {string} line
 * @returns {string}
 */
function stripInlineCodeSpans(line) {
  return line.replaceAll(/`[^`]+`/gu, '');
}

/**
 * Decide whether a line is *predominantly code-shaped* (a YAML/JSON-style
 * data line, an indented data fragment, or a line whose substance is the
 * backticked tokens) versus *prose-narrative* (a sentence containing
 * backticked references). The discipline (per PDR-053 surface-polarity
 * doctrine and the no-moving-targets rule) is that backticked SHAs in
 * prose are intentional pointers and SHOULD fire the moving-target rule;
 * backticked SHAs inside data-shaped lines (YAML field values, table
 * cells, JSON snippets) are the data being documented and SHOULD NOT.
 *
 * Heuristic: the line is "predominantly code-shaped" when its
 * non-backticked content does not contain a recognisable sentence
 * fragment (≥3 consecutive alphabetic words separated by spaces).
 * Sentence-shape content marks the line as prose; absence marks it as
 * data.
 *
 * @param {string} line
 * @returns {boolean}
 */
export function lineIsPredominantlyCodeShaped(line) {
  const stripped = stripInlineCodeSpans(line);
  // Three-word run of alphabetic tokens separated by spaces marks the
  // line as prose. Apostrophes within words are allowed.
  const proseRun = /\b[A-Za-z][A-Za-z']+\s+[A-Za-z][A-Za-z']+\s+[A-Za-z][A-Za-z']+\b/u;
  return !proseRun.test(stripped);
}

/**
 * Scan content line-by-line for a regex match that respects fenced
 * code blocks, inline code (when configured AND the line is data-shaped),
 * and explicit historical-reference markers.
 *
 * - Lines inside fenced code blocks (delimited by `​`​`​`) are skipped.
 * - When `excludes_inline_code` is true, inline-code spans are stripped
 *   from each line before the regex test ONLY IF the line is
 *   predominantly code-shaped (per `lineIsPredominantlyCodeShaped`). For
 *   prose-narrative lines (a sentence with a backticked token), the line
 *   is tested verbatim — backticked SHAs in prose are intentional moving-
 *   target pointers and the rule fires on them.
 * - Lines containing any `excludes_lines_with` marker are skipped.
 *
 * @param {string} content
 * @param {ScopedContentBlock} block
 * @returns {boolean}
 */
function scanLinesForRegex(content, block) {
  const regex = new RegExp(block.pattern, 'iu');
  const excludesInlineCode = block.excludes_inline_code ?? false;
  const excludeMarkers = block.excludes_lines_with ?? [];
  let inFence = false;

  for (const rawLine of content.split('\n')) {
    if (rawLine.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    if (excludeMarkers.some((marker) => rawLine.includes(marker))) {
      continue;
    }
    const probeLine =
      excludesInlineCode && lineIsPredominantlyCodeShaped(rawLine)
        ? stripInlineCodeSpans(rawLine)
        : rawLine;
    if (regex.test(probeLine)) {
      return true;
    }
  }

  return false;
}

/**
 * Decide whether a literal pattern is being added — present in new content
 * but absent from prior content, ignoring case.
 *
 * @param {string} newContent
 * @param {string} priorContent
 * @param {ScopedContentBlock} block
 * @returns {boolean}
 */
function literalMatchAdded(newContent, priorContent, block) {
  const lowerNew = newContent.toLowerCase();
  const lowerPrior = priorContent.toLowerCase();
  const lowerPattern = block.pattern.toLowerCase();
  return lowerNew.includes(lowerPattern) && !lowerPrior.includes(lowerPattern);
}

/**
 * Decide whether a regex pattern is being added — matched in new content
 * (after fence/inline-code/marker exclusions) but unmatched in prior
 * content under the same exclusion rules.
 *
 * @param {string} newContent
 * @param {string} priorContent
 * @param {ScopedContentBlock} block
 * @returns {boolean}
 */
function regexMatchAdded(newContent, priorContent, block) {
  if (!scanLinesForRegex(newContent, block)) {
    return false;
  }
  return !scanLinesForRegex(priorContent, block);
}

/**
 * Check whether a blocked pattern is being ADDED — present in new content
 * but absent from prior content.
 *
 * @param {string} newContent
 * @param {string} priorContent
 * @param {readonly string[]} blockedPatterns
 * @returns {string | null}
 */
export function findAddedBlockedContent(newContent, priorContent, blockedPatterns) {
  const lowerNew = newContent.toLowerCase();
  const lowerPrior = priorContent.toLowerCase();

  for (const pattern of blockedPatterns) {
    const lowerPattern = pattern.toLowerCase();
    if (lowerNew.includes(lowerPattern) && !lowerPrior.includes(lowerPattern)) {
      return pattern;
    }
  }

  return null;
}

/**
 * Match a single path-scope entry against a file path.
 *
 * - Entries beginning with `**​/​*` are treated as a suffix match
 *   (e.g. `**​/​*.plan.md` matches any path ending in `.plan.md`).
 * - All other entries are treated as substring matches against the
 *   file path, which works equivalently for absolute and relative
 *   forms because the path always contains its own directory prefix.
 *
 * @param {string} filePath
 * @param {string} scope
 * @returns {boolean}
 */
function matchesPathScope(filePath, scope) {
  if (scope.startsWith('**/*')) {
    return filePath.endsWith(scope.slice(4));
  }
  return filePath.includes(scope);
}

/**
 * Determine whether a file path is in scope for a `ScopedContentBlock` —
 * matches at least one include and no excludes.
 *
 * @param {string | undefined} filePath
 * @param {readonly string[]} includePaths
 * @param {readonly string[]} excludePaths
 * @returns {boolean}
 */
export function isPathInScope(filePath, includePaths, excludePaths = []) {
  if (filePath === undefined) {
    return false;
  }
  const matchesInclude = includePaths.some((scope) => matchesPathScope(filePath, scope));
  if (!matchesInclude) {
    return false;
  }
  return !excludePaths.some((scope) => matchesPathScope(filePath, scope));
}

/**
 * Find a path-scoped doctrine block whose pattern is being ADDED — present
 * in new content but absent from prior content — when the target file
 * matches the block's include/exclude paths.
 *
 * @param {string} newContent
 * @param {string} priorContent
 * @param {string | undefined} filePath
 * @param {readonly ScopedContentBlock[]} scopedBlocks
 * @returns {ScopedContentBlock | null}
 */
export function findAddedScopedBlock(newContent, priorContent, filePath, scopedBlocks) {
  for (const block of scopedBlocks) {
    if (!isPathInScope(filePath, block.include_paths, block.exclude_paths)) {
      continue;
    }
    const matched =
      block.kind === 'regex'
        ? regexMatchAdded(newContent, priorContent, block)
        : literalMatchAdded(newContent, priorContent, block);
    if (matched) {
      return block;
    }
  }

  return null;
}

/**
 * Build the structured deny payload Claude expects for `PreToolUse`.
 *
 * The optional citation surfaces the doctrinal anchor in the deny reason
 * so the agent learns *why* the pattern is forbidden, not only *that* it is.
 *
 * @param {string} blockedPattern
 * @param {string} [citation]
 * @returns {{
 *   hookSpecificOutput: {
 *     hookEventName: string,
 *     permissionDecision: string,
 *     permissionDecisionReason: string,
 *   },
 * }}
 */
export function buildPreToolUseDenyResponse(blockedPattern, citation) {
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
 * Parse blocked content patterns from already-loaded policy data.
 *
 * @param {unknown} policy
 * @returns {string[]}
 */
export function parseBlockedContentPolicy(policy) {
  if (
    policy === null ||
    typeof policy !== 'object' ||
    !('hooks' in policy) ||
    policy.hooks === null ||
    typeof policy.hooks !== 'object' ||
    !('preToolUseContent' in policy.hooks) ||
    policy.hooks.preToolUseContent === null ||
    typeof policy.hooks.preToolUseContent !== 'object' ||
    !('blocked_patterns' in policy.hooks.preToolUseContent) ||
    !Array.isArray(policy.hooks.preToolUseContent.blocked_patterns) ||
    !policy.hooks.preToolUseContent.blocked_patterns.every((pattern) => typeof pattern === 'string')
  ) {
    throw new Error(
      'The canonical hook policy did not contain hooks.preToolUseContent.blocked_patterns.',
    );
  }

  return policy.hooks.preToolUseContent.blocked_patterns;
}

/**
 * Validate a single scoped block entry shape.
 *
 * @param {unknown} entry
 * @returns {boolean}
 */
function isValidScopedBlockEntry(entry) {
  if (entry === null || typeof entry !== 'object') {
    return false;
  }
  if (!('pattern' in entry) || typeof entry.pattern !== 'string') {
    return false;
  }
  if (
    !('include_paths' in entry) ||
    !Array.isArray(entry.include_paths) ||
    entry.include_paths.length === 0 ||
    !entry.include_paths.every((scope) => typeof scope === 'string')
  ) {
    return false;
  }
  if (
    'exclude_paths' in entry &&
    (!Array.isArray(entry.exclude_paths) ||
      !entry.exclude_paths.every((scope) => typeof scope === 'string'))
  ) {
    return false;
  }
  if (!('citation' in entry) || typeof entry.citation !== 'string') {
    return false;
  }
  if ('kind' in entry && entry.kind !== 'literal' && entry.kind !== 'regex') {
    return false;
  }
  if ('excludes_inline_code' in entry && typeof entry.excludes_inline_code !== 'boolean') {
    return false;
  }
  if (
    'excludes_lines_with' in entry &&
    (!Array.isArray(entry.excludes_lines_with) ||
      !entry.excludes_lines_with.every((marker) => typeof marker === 'string'))
  ) {
    return false;
  }
  if (entry.kind === 'regex') {
    try {
      new RegExp(entry.pattern, 'u');
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Parse path-scoped doctrine blocks from already-loaded policy data.
 *
 * Returns an empty array when the policy omits the optional
 * `scoped_blocks` section, so callers do not have to special-case
 * legacy policy files.
 *
 * @param {unknown} policy
 * @returns {readonly ScopedContentBlock[]}
 */
export function parseScopedContentBlocks(policy) {
  if (
    policy === null ||
    typeof policy !== 'object' ||
    !('hooks' in policy) ||
    policy.hooks === null ||
    typeof policy.hooks !== 'object' ||
    !('preToolUseContent' in policy.hooks) ||
    policy.hooks.preToolUseContent === null ||
    typeof policy.hooks.preToolUseContent !== 'object'
  ) {
    return [];
  }

  const section = policy.hooks.preToolUseContent;
  if (!('scoped_blocks' in section)) {
    return [];
  }

  if (
    !Array.isArray(section.scoped_blocks) ||
    !section.scoped_blocks.every(isValidScopedBlockEntry)
  ) {
    throw new Error(
      'The canonical hook policy hooks.preToolUseContent.scoped_blocks was malformed.',
    );
  }

  return section.scoped_blocks;
}

/**
 * Load blocked content patterns from the canonical hook policy.
 *
 * @param {URL} policyUrl
 * @returns {Promise<string[]>}
 */
export async function loadBlockedContentPatterns(policyUrl = POLICY_URL) {
  const policyText = await fs.readFile(policyUrl, 'utf8');
  const policy = JSON.parse(policyText);
  return parseBlockedContentPolicy(policy);
}

/**
 * Load path-scoped doctrine blocks from the canonical hook policy.
 *
 * @param {URL} policyUrl
 * @returns {Promise<readonly ScopedContentBlock[]>}
 */
export async function loadScopedContentBlocks(policyUrl = POLICY_URL) {
  const policyText = await fs.readFile(policyUrl, 'utf8');
  const policy = JSON.parse(policyText);
  return parseScopedContentBlocks(policy);
}

/**
 * Read prior file content for the real hook adapter.
 *
 * @param {string} path
 * @returns {string | null}
 */
function readPriorFileContent(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Read all text from a stream.
 *
 * @param {AsyncIterable<string | Buffer>} stdin
 * @returns {Promise<string>}
 */
export async function readStreamText(stdin) {
  let text = '';

  for await (const chunk of stdin) {
    text += chunk.toString();
  }

  return text;
}

/**
 * Execute the content guard using Claude's stdin/stdout contract.
 *
 * Two layers of detection are run, in order:
 *   1. Flat `blocked_patterns` — universal, path-agnostic block.
 *   2. `scoped_blocks` — path-scoped, citation-bearing doctrine blocks
 *      (the trip-list at write-time).
 *
 * The first match wins; only one deny payload is written.
 *
 * @param {{
 *   stdin?: AsyncIterable<string | Buffer>,
 *   stdout?: { write: (text: string) => void },
 *   stderr?: { write: (text: string) => void },
 *   policyUrl?: URL,
 *   blockedPatterns?: readonly string[],
 *   scopedBlocks?: readonly ScopedContentBlock[],
 *   readPriorContent?: (path: string) => string | null,
 * }} options
 * @returns {Promise<{ exitCode: number }>}
 */
export async function runPreToolUseContentGuard(options = {}) {
  const {
    stdin = process.stdin,
    stdout = process.stdout,
    stderr = process.stderr,
    policyUrl = POLICY_URL,
    blockedPatterns,
    scopedBlocks,
    readPriorContent = readPriorFileContent,
  } = options;

  try {
    const inputText = await readStreamText(stdin);
    const hookInput = parseHookInput(inputText);
    const change = extractContentChange(hookInput);
    const { newContent, priorContent } = resolveContentPair(change, readPriorContent);
    const patterns = blockedPatterns ?? (await loadBlockedContentPatterns(policyUrl));
    const blockedPattern = findAddedBlockedContent(newContent, priorContent, patterns);

    if (blockedPattern !== null) {
      stdout.write(`${JSON.stringify(buildPreToolUseDenyResponse(blockedPattern))}\n`);
      return { exitCode: 0 };
    }

    const blocks = scopedBlocks ?? (await loadScopedContentBlocks(policyUrl));
    const matchedBlock = findAddedScopedBlock(newContent, priorContent, change.filePath, blocks);

    if (matchedBlock !== null) {
      stdout.write(
        `${JSON.stringify(
          buildPreToolUseDenyResponse(matchedBlock.pattern, matchedBlock.citation),
        )}\n`,
      );
    }

    return { exitCode: 0 };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown PreToolUse content hook failure.';
    stderr.write(`${message}\n`);
    return { exitCode: 2 };
  }
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const { exitCode } = await runPreToolUseContentGuard();
  process.exit(exitCode);
}
