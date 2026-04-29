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
 * Extract incoming content and prior-content references from a Claude Edit or
 * Write tool payload.
 *
 * For Edit: `new_string` is the incoming content; `old_string` is the prior.
 * For Write: `content` is the incoming content; `file_path` is returned as an
 * optional prior-content reference. The extraction step never reads the file.
 *
 * The hook blocks patterns that are being ADDED — present in the new content
 * but absent from the prior content. This allows edits that preserve an
 * already-present pattern without blocking.
 *
 * @param {unknown} hookInput
 * @returns {{ newContent: string, priorContent: string, priorFilePath?: string }}
 */
export function extractContentChange(hookInput) {
  const input = resolveInput(hookInput);

  // Edit tool: new_string vs old_string
  if ('new_string' in input && typeof input.new_string === 'string') {
    const prior =
      'old_string' in input && typeof input.old_string === 'string' ? input.old_string : '';
    return { newContent: input.new_string, priorContent: prior };
  }

  // Write tool: content vs existing file
  if ('content' in input && typeof input.content === 'string') {
    if ('file_path' in input && typeof input.file_path === 'string') {
      return { newContent: input.content, priorContent: '', priorFilePath: input.file_path };
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
 * Build the structured deny payload Claude expects for `PreToolUse`.
 *
 * @param {string} blockedPattern
 * @returns {{
 *   hookSpecificOutput: {
 *     hookEventName: string,
 *     permissionDecision: string,
 *     permissionDecisionReason: string,
 *   },
 * }}
 */
export function buildPreToolUseDenyResponse(blockedPattern) {
  return {
    hookSpecificOutput: {
      hookEventName: PRE_TOOL_USE_EVENT_NAME,
      permissionDecision: 'deny',
      permissionDecisionReason: `Blocked by repo hook policy: content contains forbidden pattern "${blockedPattern}". Only the project owner can use this pattern.`,
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
 * @param {{
 *   stdin?: AsyncIterable<string | Buffer>,
 *   stdout?: { write: (text: string) => void },
 *   stderr?: { write: (text: string) => void },
 *   policyUrl?: URL,
 *   blockedPatterns?: readonly string[],
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
    readPriorContent = readPriorFileContent,
  } = options;

  try {
    const inputText = await readStreamText(stdin);
    const hookInput = parseHookInput(inputText);
    const { newContent, priorContent } = resolveContentPair(
      extractContentChange(hookInput),
      readPriorContent,
    );
    const patterns = blockedPatterns ?? (await loadBlockedContentPatterns(policyUrl));
    const blockedPattern = findAddedBlockedContent(newContent, priorContent, patterns);

    if (blockedPattern !== null) {
      stdout.write(`${JSON.stringify(buildPreToolUseDenyResponse(blockedPattern))}\n`);
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
