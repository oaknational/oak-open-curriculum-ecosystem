#!/usr/bin/env node

/**
 * Plugin skill-copy validator.
 *
 * The ChatGPT/Codex package (`plugins/oak-open-curriculum-chatgpt/`) carries
 * the Claude plugin's shared skills as checked-in copies. This gate discovers
 * which skills exist under both roots, recomputes the byte-level comparison of
 * each on every run, and fails the build when a copy drifts from its source,
 * naming each file so the fix is a re-copy, not a search. A top-level `evals/`
 * directory is excluded: it is authoring tooling, not shipped skill content.
 * Symlinks are reported as findings and never followed (principles.md §No
 * symlinks).
 *
 * Wired into root `repo-validators:check` (pre-commit and CI).
 * Exit 0 = identical; 1 = findings (drift, a missing or invalid skill, a
 * symlink); 2 = refusal (a root missing or symlinked, no skill shared by both
 * roots, nothing compared and nothing found, or an IO failure — an empty or
 * broken scan is never a pass). The verdict is decided by the pure
 * `decideSkillCopyVerdict`, so each exit code is asserted in unit tests rather
 * than only observable by running this binary.
 *
 * @packageDocumentation
 */

import { lstatSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import { createFileSystemSkillTreeReader } from './plugin-skill-copies-fs.js';
import { decideSkillCopyVerdict } from './plugin-skill-copies-verdict.js';
import { findSkillCopyDrift, type SkillCopyReport } from './plugin-skill-copies.js';

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
  // lstat: a root that is itself a symlink is refused, never followed.
  const stat = lstatSync(dir, { throwIfNoEntry: false });
  if (stat === undefined) {
    writeErrorLine(`validate-plugin-skill-copies: ${label} skills root is missing: ${dir}`);
    process.exit(2);
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    writeErrorLine(
      `validate-plugin-skill-copies: ${label} skills root is not a real directory (symlinks are not permitted, principles.md §No symlinks): ${dir}`,
    );
    process.exit(2);
  }
}

// The filesystem is the boundary: an IO failure (permissions, a directory
// vanishing mid-scan) is translated here into the refusal exit, never left as
// an uncaught exception whose default exit code would read as "drift found".
let report: SkillCopyReport;
try {
  report = findSkillCopyDrift(
    { sourceRoot, copyRoot },
    createFileSystemSkillTreeReader(IGNORED_DIRS),
  );
} catch (error: unknown) {
  writeErrorLine(`validate-plugin-skill-copies: could not read the skill trees — ${String(error)}`);
  process.exit(2);
}

const verdict = decideSkillCopyVerdict(report, {
  sourceRoot: SOURCE_SKILLS,
  copyRoot: COPY_SKILLS,
  ignoredDirs: IGNORED_DIRS,
});

for (const line of verdict.lines) {
  if (verdict.code === 0) {
    writeLine(line);
  } else {
    writeErrorLine(line);
  }
}
process.exit(verdict.code);
