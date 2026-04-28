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
 * Match a blocked pattern against a command by token subsequence.
 *
 * This catches reordered Git arguments such as
 * `git push origin HEAD --force` for the policy pattern `git push --force`.
 *
 * @param {string} command
 * @param {readonly string[]} blockedPatterns
 * @returns {string | null}
 */
export function findBlockedPattern(command, blockedPatterns) {
  const commandTokens = tokenizeCommand(command);

  for (const blockedPattern of blockedPatterns) {
    const patternTokens = tokenizeCommand(blockedPattern);
    let patternIndex = 0;

    for (const commandToken of commandTokens) {
      if (commandToken === patternTokens[patternIndex]) {
        patternIndex += 1;
      }

      if (patternIndex === patternTokens.length) {
        return blockedPattern;
      }
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
      permissionDecisionReason: `Blocked by repo hook policy: matched dangerous pattern "${blockedPattern}".`,
    },
  };
}

/**
 * Parse blocked command patterns from already-loaded policy data.
 *
 * @param {unknown} policy
 * @returns {string[]}
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
    !policy.hooks.preToolUse.blocked_patterns.every((pattern) => typeof pattern === 'string')
  ) {
    throw new Error('The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.');
  }

  return policy.hooks.preToolUse.blocked_patterns;
}

/**
 * Load blocked command patterns from the canonical hook policy.
 *
 * @param {URL} policyUrl
 * @returns {Promise<string[]>}
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
 *   blockedPatterns?: readonly string[],
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
    const blockedPattern = findBlockedPattern(command, patterns);

    if (blockedPattern !== null) {
      stdout.write(`${JSON.stringify(buildPreToolUseDenyResponse(blockedPattern))}\n`);
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
