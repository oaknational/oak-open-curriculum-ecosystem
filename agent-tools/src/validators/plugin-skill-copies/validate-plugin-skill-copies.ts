#!/usr/bin/env node

/**
 * Plugin skill-copy validator.
 *
 * The ChatGPT/Codex package (`plugins/oak-open-curriculum-chatgpt/`) carries
 * the Claude plugin's three shared skills as checked-in copies. This gate
 * recomputes the byte-level comparison on every run and fails the build when a
 * copy drifts from its source, naming each file so the fix is a re-copy, not a
 * search. `evals/` is excluded: it is authoring tooling, not shipped skill
 * content.
 *
 * Wired into root `repo-validators:check` (pre-commit and CI).
 * Exit 0 = identical; 1 = drift found; 2 = misconfiguration (a root missing,
 * or nothing compared — an empty scan is a refusal, never a pass).
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import { createFileSystemSkillTreeReader } from './plugin-skill-copies-fs.js';
import { findSkillCopyDrift } from './plugin-skill-copies.js';

const SOURCE_SKILLS = 'plugins/oak-open-curriculum/skills';
const COPY_SKILLS = 'plugins/oak-open-curriculum-chatgpt/skills';
const SHARED_SKILLS = [
  'oak-accessibility',
  'oak-curriculum-principles',
  'oak-curriculum-principles-mcp-enabled',
] as const;
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

const report = findSkillCopyDrift(
  { sourceRoot, copyRoot, skills: SHARED_SKILLS },
  createFileSystemSkillTreeReader(IGNORED_DIRS),
);

if (report.filesCompared === 0 && report.findings.length === 0) {
  writeErrorLine('validate-plugin-skill-copies: compared no files — refusing to report clean.');
  process.exit(2);
}

if (report.findings.length > 0) {
  writeErrorLine(
    `validate-plugin-skill-copies: ${report.findings.length} difference(s) between ${SOURCE_SKILLS} and ${COPY_SKILLS}:`,
  );
  for (const finding of report.findings) {
    writeErrorLine(`  ${finding.kind}  ${finding.skill}/${finding.relativePath}`);
  }
  writeErrorLine(
    `Fix: the Claude plugin is the source. Re-copy each listed skill from ${SOURCE_SKILLS} to ${COPY_SKILLS} (omit evals/).`,
  );
  process.exit(1);
}

writeLine(
  `validate-plugin-skill-copies: ${SHARED_SKILLS.length} shared skills identical (${report.filesCompared} files compared).`,
);
