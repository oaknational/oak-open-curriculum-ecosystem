import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

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
 * Extract the Bash command from a Claude PreToolUse payload.
 *
 * @param {unknown} hookInput
 * @returns {string}
 */
export function extractBashCommand(hookInput) {
  if (hookInput !== null && typeof hookInput === 'object') {
    if (
      'tool_input' in hookInput &&
      hookInput.tool_input !== null &&
      typeof hookInput.tool_input === 'object' &&
      'command' in hookInput.tool_input &&
      typeof hookInput.tool_input.command === 'string'
    ) {
      return hookInput.tool_input.command;
    }

    if (
      'toolInput' in hookInput &&
      hookInput.toolInput !== null &&
      typeof hookInput.toolInput === 'object' &&
      'command' in hookInput.toolInput &&
      typeof hookInput.toolInput.command === 'string'
    ) {
      return hookInput.toolInput.command;
    }

    if ('command' in hookInput && typeof hookInput.command === 'string') {
      return hookInput.command;
    }

    if (
      'parameters' in hookInput &&
      hookInput.parameters !== null &&
      typeof hookInput.parameters === 'object' &&
      'command' in hookInput.parameters &&
      typeof hookInput.parameters.command === 'string'
    ) {
      return hookInput.parameters.command;
    }
  }

  throw new Error('Claude PreToolUse hook input did not include a Bash command.');
}

/**
 * Split a shell command into simple whitespace-delimited tokens.
 *
 * This is intentionally conservative: the blocked patterns in `policy.json`
 * are plain token sequences, so a lightweight tokenizer is sufficient.
 *
 * @param {string} command
 * @returns {string[]}
 */
export function tokenizeCommand(command) {
  return command.trim().split(/\s+/u).filter(Boolean);
}

/**
 * @typedef {{ pattern: string, citation?: string }} BlockedEntry
 */

/**
 * Normalise a string-or-entry blocked pattern into a `BlockedEntry`.
 *
 * @param {string | BlockedEntry} entry
 * @returns {BlockedEntry}
 */
function normaliseEntry(entry) {
  return typeof entry === 'string' ? { pattern: entry } : entry;
}

/**
 * Match a blocked pattern against a command by token subsequence.
 *
 * This catches reordered Git arguments such as
 * `git push origin HEAD --force` for the policy pattern `git push --force`.
 *
 * Each entry may be a bare pattern string or a `BlockedEntry` carrying a
 * doctrinal citation; the citation is surfaced in the deny payload so the
 * agent learns *why* the pattern is forbidden, not only *that* it is.
 *
 * @param {string} command
 * @param {readonly (string | BlockedEntry)[]} blockedPatterns
 * @returns {BlockedEntry | null}
 */
export function findBlockedPattern(command, blockedPatterns) {
  const commandTokens = tokenizeCommand(command);

  for (const blockedPattern of blockedPatterns) {
    const entry = normaliseEntry(blockedPattern);
    const patternTokens = tokenizeCommand(entry.pattern);
    let patternIndex = 0;

    for (const commandToken of commandTokens) {
      if (commandToken === patternTokens[patternIndex]) {
        patternIndex += 1;
      }

      if (patternIndex === patternTokens.length) {
        return entry;
      }
    }
  }

  return null;
}

/**
 * Build the structured deny payload Claude expects for `PreToolUse`.
 *
 * When the entry carries a citation, it is appended to the reason so the
 * doctrinal anchor travels to the agent at the moment of denial.
 *
 * @param {BlockedEntry} blockedEntry
 * @returns {{
 *   hookSpecificOutput: {
 *     hookEventName: string,
 *     permissionDecision: string,
 *     permissionDecisionReason: string,
 *   },
 * }}
 */
export function buildPreToolUseDenyResponse(blockedEntry) {
  const baseReason = `Blocked by repo hook policy: matched dangerous pattern "${blockedEntry.pattern}".`;
  const reason =
    blockedEntry.citation === undefined
      ? baseReason
      : `${baseReason} Citation: ${blockedEntry.citation}.`;
  return {
    hookSpecificOutput: {
      hookEventName: PRE_TOOL_USE_EVENT_NAME,
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}

/**
 * Validate a single blocked-pattern entry: bare string or `{pattern, citation?}`.
 *
 * @param {unknown} entry
 * @returns {boolean}
 */
function isValidBlockedPatternEntry(entry) {
  if (typeof entry === 'string') {
    return true;
  }
  if (entry === null || typeof entry !== 'object') {
    return false;
  }
  if (!('pattern' in entry) || typeof entry.pattern !== 'string') {
    return false;
  }
  if ('citation' in entry && typeof entry.citation !== 'string') {
    return false;
  }
  return true;
}

/**
 * Parse blocked command patterns from already-loaded policy data.
 *
 * Each entry is either a plain string (legacy) or a `BlockedEntry` with a
 * required `pattern` and optional `citation`. The matcher accepts both forms.
 *
 * @param {unknown} policy
 * @returns {readonly (string | BlockedEntry)[]}
 */
export function parseBlockedPatternPolicy(policy) {
  if (
    policy === null ||
    typeof policy !== 'object' ||
    !('hooks' in policy) ||
    policy.hooks === null ||
    typeof policy.hooks !== 'object' ||
    !('preToolUse' in policy.hooks) ||
    policy.hooks.preToolUse === null ||
    typeof policy.hooks.preToolUse !== 'object' ||
    !('blocked_patterns' in policy.hooks.preToolUse) ||
    !Array.isArray(policy.hooks.preToolUse.blocked_patterns) ||
    !policy.hooks.preToolUse.blocked_patterns.every(isValidBlockedPatternEntry)
  ) {
    throw new Error('The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.');
  }

  return policy.hooks.preToolUse.blocked_patterns;
}

/**
 * Load blocked command patterns from the canonical hook policy.
 *
 * @param {URL} policyUrl
 * @returns {Promise<readonly (string | BlockedEntry)[]>}
 */
export async function loadBlockedPatterns(policyUrl = POLICY_URL) {
  const policyText = await fs.readFile(policyUrl, 'utf8');
  const policy = JSON.parse(policyText);
  return parseBlockedPatternPolicy(policy);
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
 * Execute the `PreToolUse` guard using Claude's stdin/stdout contract.
 *
 * Exit code semantics:
 * - `0`: hook completed successfully; stdout may contain a deny payload.
 * - `2`: hook failed closed; stderr explains why Claude should stop.
 *
 * @param {{
 *   stdin?: AsyncIterable<string | Buffer>,
 *   stdout?: { write: (text: string) => void },
 *   stderr?: { write: (text: string) => void },
 *   policyUrl?: URL,
 *   blockedPatterns?: readonly (string | BlockedEntry)[],
 * }} options
 * @returns {Promise<{ exitCode: number }>}
 */
export async function runPreToolUseGuard(options = {}) {
  const {
    stdin = process.stdin,
    stdout = process.stdout,
    stderr = process.stderr,
    policyUrl = POLICY_URL,
    blockedPatterns,
  } = options;

  try {
    const inputText = await readStreamText(stdin);
    const hookInput = parseHookInput(inputText);
    const command = extractBashCommand(hookInput);
    const patterns = blockedPatterns ?? (await loadBlockedPatterns(policyUrl));
    const blockedEntry = findBlockedPattern(command, patterns);

    if (blockedEntry !== null) {
      stdout.write(`${JSON.stringify(buildPreToolUseDenyResponse(blockedEntry))}\n`);
    }

    return { exitCode: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown PreToolUse hook failure.';
    stderr.write(`${message}\n`);
    return { exitCode: 2 };
  }
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const { exitCode } = await runPreToolUseGuard();
  process.exit(exitCode);
}
