import fs from 'node:fs/promises';
import path from 'node:path';

import { isJsonObject } from '../../collaboration-state/json.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine, writeErrorLine } from '../../core/terminal-output.js';

import {
  findBashEntriesMissingReappraisal,
  findGroupsMissingReappraisal,
} from './validate-policy-reappraisal-helpers.js';

/**
 * Standalone validator that fails if any doctrine block in
 * `.agent/hooks/policy.json` lacks a non-empty `reappraisal` — across both
 * enforcement surfaces: the content guard's `preToolUseContent.scoped_blocks`
 * groups and the Bash guard's `preToolUse.blocked_patterns` object entries.
 *
 * Both guards' load-time schemas leave the teaching fields optional so a missing
 * value never fails the guard closed (which would brick the worktree on a
 * stale-dist/new-policy mismatch — and a stale Bash guard blocks every command
 * including the rebuild). This gate is the commit-time counterpart: it enforces,
 * where blocking is safe, that every doctrine block pairs its citation with the
 * positive reappraisal direction the firing signals — so a block teaches the
 * agent to step back and re-assess the concept rather than reword around it (the
 * content guard) or reach for a sibling destructive command (the Bash guard)
 * (PDR-044 §Innate immunity, as amended).
 *
 * Wired into root `repo-validators:check`, so it runs on every pre-commit,
 * pre-push, and CI run alongside the sibling validators.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Extract `preToolUseContent.scoped_blocks` from parsed policy, or undefined. */
function scopedBlocksFrom(policy: unknown): unknown {
  if (
    !isJsonObject(policy) ||
    !isJsonObject(policy.hooks) ||
    !isJsonObject(policy.hooks.preToolUseContent)
  ) {
    return undefined;
  }
  return policy.hooks.preToolUseContent.scoped_blocks;
}

/** Extract `preToolUse.blocked_patterns` from parsed policy, or undefined. */
function blockedPatternsFrom(policy: unknown): unknown {
  if (
    !isJsonObject(policy) ||
    !isJsonObject(policy.hooks) ||
    !isJsonObject(policy.hooks.preToolUse)
  ) {
    return undefined;
  }
  return policy.hooks.preToolUse.blocked_patterns;
}

async function main(): Promise<void> {
  const policyPath = path.join(repoRoot, '.agent/hooks/policy.json');
  const parsed: unknown = JSON.parse(await fs.readFile(policyPath, 'utf8'));
  const groupFindings = findGroupsMissingReappraisal(scopedBlocksFrom(parsed));
  const bashFindings = findBashEntriesMissingReappraisal(blockedPatternsFrom(parsed));

  if (groupFindings.length === 0 && bashFindings.length === 0) {
    writeLine(
      'validate-policy-reappraisal: OK (every content-guard scoped-block group and Bash ' +
        'blocked-pattern entry carries a reappraisal direction)',
    );
    return;
  }

  const sections: string[] = [];
  if (groupFindings.length > 0) {
    sections.push(
      `${groupFindings.length} content-guard scoped-block group(s) lack a positive reappraisal direction:\n` +
        groupFindings
          .map((finding) => `  ${finding.concept} (reappraisal ${finding.reason})`)
          .join('\n'),
    );
  }
  if (bashFindings.length > 0) {
    sections.push(
      `${bashFindings.length} Bash blocked-pattern entry/entries cannot teach a reappraisal:\n` +
        bashFindings.map((finding) => `  ${finding.pattern} (${finding.reason})`).join('\n'),
    );
  }

  writeErrorLine(
    `validate-policy-reappraisal: reappraisal-presence check failed.\n\n${sections.join('\n\n')}\n\n` +
      `Every doctrine block in .agent/hooks/policy.json must pair its citation with a non-empty ` +
      `\`reappraisal\` — the positive direction the firing signals — so a block teaches the agent to ` +
      `step back and re-assess the concept rather than reword around it or reach for a sibling ` +
      `destructive command (PDR-044 §Innate immunity, as amended). Bash blocked_patterns entries must ` +
      `be objects carrying a non-empty \`concept\` and \`reappraisal\`. The load-time schemas leave ` +
      `these optional only so a missing value never bricks the worktree; this commit-time gate is ` +
      `where presence is enforced.`,
  );
  process.exit(1);
}

await main();
