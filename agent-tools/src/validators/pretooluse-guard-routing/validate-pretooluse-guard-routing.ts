import fs from 'node:fs/promises';
import path from 'node:path';

import { isJsonObject } from '../../collaboration-state/json.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine, writeErrorLine } from '../../core/terminal-output.js';

import { findUnroutedGuardCommands } from './validate-pretooluse-guard-routing-helpers.js';

/**
 * Standalone validator that fails if any `PreToolUse` hook in
 * `.claude/settings.json` runs a dist-built hook-policy guard directly instead
 * of routing through the shim `.claude/hooks/run-pretooluse-guard.mjs`.
 *
 * Direct invocation (`node <guard>.js`) fails OPEN *silently* when the artefact
 * is missing (node exits 1, which Claude Code treats as non-blocking). The shim
 * takes control of the verdict instead — fail closed (exit 2) for a
 * built-but-broken guard, deliberate loud-and-logged fail open for a not-yet-built
 * one. This gate locks in shim routing so a silent revert cannot reopen the
 * uncontrolled window.
 *
 * Wired into root `repo-validators:check`, so it runs on every pre-commit and
 * pre-push alongside the sibling validators.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Extract the command strings from one `PreToolUse` matcher group. */
function commandsFromGroup(group: unknown): string[] {
  if (!isJsonObject(group) || !Array.isArray(group.hooks)) {
    return [];
  }
  return group.hooks.flatMap((hook) =>
    isJsonObject(hook) && typeof hook.command === 'string' ? [hook.command] : [],
  );
}

/** Extract every `PreToolUse` hook command string from parsed settings. */
function preToolUseCommands(settings: unknown): string[] {
  if (!isJsonObject(settings) || !isJsonObject(settings.hooks)) {
    return [];
  }
  const groups = settings.hooks.PreToolUse;
  return Array.isArray(groups) ? groups.flatMap(commandsFromGroup) : [];
}

async function main(): Promise<void> {
  const settingsPath = path.join(repoRoot, '.claude/settings.json');
  const parsed: unknown = JSON.parse(await fs.readFile(settingsPath, 'utf8'));
  const unrouted = findUnroutedGuardCommands(preToolUseCommands(parsed));

  if (unrouted.length === 0) {
    writeLine(
      'validate-pretooluse-guard-routing: OK (all PreToolUse guards route through the shim)',
    );
    return;
  }

  writeErrorLine(
    `validate-pretooluse-guard-routing: ${unrouted.length} PreToolUse guard(s) invoke a dist artefact directly.\n\n` +
      `${unrouted.map((command) => `  ${command}`).join('\n')}\n\n` +
      `Route each through the shim, e.g. ` +
      `\`node "$\{CLAUDE_PROJECT_DIR}/.claude/hooks/run-pretooluse-guard.mjs" <guard-dist-path>\`. ` +
      `Direct \`node <guard>.js\` fails OPEN *silently* when the artefact is missing; ` +
      `the shim makes the verdict controlled (loud + logged).`,
  );
  process.exit(1);
}

await main();
