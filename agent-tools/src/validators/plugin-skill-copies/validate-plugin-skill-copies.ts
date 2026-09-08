#!/usr/bin/env node

/**
 * Plugin skill-copy validator.
 *
 * The ChatGPT/Codex package (`plugins/oak-open-curriculum-chatgpt/`) carries
 * the Claude plugin's shared skills as checked-in copies. This gate discovers
 * which skills exist under both roots, recomputes the byte-level comparison of
 * each on every run, and fails the build when a copy drifts from its source,
 * naming each file so the fix is a re-copy, not a search. `evals/` is
 * excluded: it is authoring tooling, not shipped skill content.
 *
 * Wired into root `repo-validators:check` (pre-commit and CI).
 * Exit 0 = identical; 1 = drift found; 2 = refusal (a root missing, no skill
 * shared by both roots, or nothing compared — an empty scan is never a pass).
 * The verdict is decided by the pure `decideSkillCopyVerdict`, so each exit
 * code is asserted in unit tests rather than only observable by running this
 * binary.
 *
 * @packageDocumentation
 */

import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import { createFileSystemSkillTreeReader } from './plugin-skill-copies-fs.js';
import { decideSkillCopyVerdict, findSkillCopyDrift } from './plugin-skill-copies.js';

const SOURCE_SKILLS = 'plugins/oak-open-curriculum/skills';
const COPY_SKILLS = 'plugins/oak-open-curriculum-chatgpt/skills';
const IGNORED_DIRS = ['evals'] as const;

const repoRoot = resolveRepoRoot(import.meta.url);
const sourceRoot = path.join(repoRoot, SOURCE_SKILLS);
const copyRoot = path.join(repoRoot, COPY_SKILLS);

for (const [label, dir] of [
  ['source', sourceRoot],
  ['copy', copyRoot],
] as const) {
  if (!existsSync(dir)) {
    writeErrorLine(`validate-plugin-skill-copies: ${label} skills root is missing: ${dir}`);
    process.exit(2);
  }
}

// Roots are resolved through symlinks so a linked root compares its real
// contents rather than being skipped as a non-directory.
const report = findSkillCopyDrift(
  { sourceRoot: realpathSync(sourceRoot), copyRoot: realpathSync(copyRoot) },
  createFileSystemSkillTreeReader(IGNORED_DIRS),
);
const verdict = decideSkillCopyVerdict(report, {
  sourceRoot: SOURCE_SKILLS,
  copyRoot: COPY_SKILLS,
});

for (const line of verdict.lines) {
  if (verdict.code === 0) {
    writeLine(line);
  } else {
    writeErrorLine(line);
  }
}
process.exit(verdict.code);
