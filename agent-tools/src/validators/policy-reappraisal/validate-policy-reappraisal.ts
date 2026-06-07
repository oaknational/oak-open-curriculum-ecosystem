import fs from 'node:fs/promises';
import path from 'node:path';

import { isJsonObject } from '../../collaboration-state/json.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine, writeErrorLine } from '../../core/terminal-output.js';

import { findGroupsMissingReappraisal } from './validate-policy-reappraisal-helpers.js';

/**
 * Standalone validator that fails if any `preToolUseContent.scoped_blocks`
 * group in `.agent/hooks/policy.json` lacks a non-empty `reappraisal`.
 *
 * The content guard's load-time schema leaves `reappraisal` optional so a
 * missing value never fails the guard closed (which would brick the worktree
 * on a stale-dist/new-policy mismatch). This gate is the commit-time
 * counterpart: it enforces, where blocking is safe, that every doctrine block
 * pairs its citation with the positive reappraisal direction the firing
 * signals — so a block teaches the agent to step back and re-assess the
 * concept rather than reword around it (PDR-044 §Innate immunity, as amended).
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

async function main(): Promise<void> {
  const policyPath = path.join(repoRoot, '.agent/hooks/policy.json');
  const parsed: unknown = JSON.parse(await fs.readFile(policyPath, 'utf8'));
  const findings = findGroupsMissingReappraisal(scopedBlocksFrom(parsed));

  if (findings.length === 0) {
    writeLine(
      'validate-policy-reappraisal: OK (every scoped-block group carries a reappraisal direction)',
    );
    return;
  }

  writeErrorLine(
    `validate-policy-reappraisal: ${findings.length} scoped-block group(s) lack a positive reappraisal direction.\n\n` +
      `${findings.map((finding) => `  ${finding.concept} (reappraisal ${finding.reason})`).join('\n')}\n\n` +
      `Every doctrine block in .agent/hooks/policy.json must pair its citation with a non-empty ` +
      `\`reappraisal\` — the positive direction the firing signals, so a block teaches the agent to ` +
      `step back and re-assess the concept rather than reword around it (PDR-044 §Innate immunity, ` +
      `as amended). The load-time schema leaves it optional only so a missing value never bricks the ` +
      `worktree; this commit-time gate is where presence is enforced.`,
  );
  process.exit(1);
}

await main();
