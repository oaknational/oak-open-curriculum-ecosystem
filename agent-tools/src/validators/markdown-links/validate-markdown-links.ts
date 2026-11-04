#!/usr/bin/env node

import path from 'node:path';

import { glob } from 'tinyglobby';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { describeGitReadFailure, listTrackedPathSet } from '../../core/repository-paths.js';
import { readText } from '../portability/portability-fs.js';
import { writeLine } from '../../core/terminal-output.js';

import {
  isExcludedPath,
  type MarkdownLinkReport,
  type ScanFile,
} from './validate-markdown-links-helpers.js';
import { findBrokenLinks } from './validate-markdown-links-report.js';

/**
 * Markdown internal-link validator. Scans the repo's doc surfaces, extracts
 * internal links (inline `](target)` and reference-def `[label]: target`,
 * ignoring URLs, mailto, pure `#anchors`, and backticked concept-names), and
 * reports any whose resolved file or directory does not exist. It also rejects
 * a tracked source that links to an untracked target: the target does not travel
 * with its referrer, so the dependency violates PDR-105 even when it is present
 * in the current checkout. For each missing target whose only fault is
 * relative-path depth — a unique non-archive path with the same basename exists
 * elsewhere — it emits the corrected relative path as a `suggestedFix`. It does
 * NOT modify Markdown.
 *
 * Broken links fail the gate. The validator became blocking after the
 * repository-wide broken-link backlog was repaired. A tracked-path listing git
 * could not give fails it too: without the listing the untracked-target rule
 * cannot be judged.
 *
 * Cross-file fragment validation (does a `#section` exist in the *target* file)
 * is a documented future enhancement and is out of scope here — markdownlint
 * already covers same-file fragments.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Glob patterns for every policed live Markdown source in the repository. */
const SCAN_GLOBS = ['**/*.md'] as const;

/** Globs excluded from the existence inventory because they cannot be portable targets. */
const INVENTORY_IGNORE_GLOBS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/*.original.md',
  '.agent/reference-local/**',
  // Repo-local pnpm store cache (gitignored, machine-local): package
  // tarball contents are never live sources or portable link targets.
  '.pnpm-store/**',
  // Agent worktrees nested in the checkout (gitignored, machine-local;
  // owner ruling 2026-09-30): whole sibling checkouts, never link targets.
  '.claude/worktrees/**',
] as const;

/** Additional non-live or generated Markdown sources excluded from validation. */
const SOURCE_IGNORE_GLOBS = [
  ...INVENTORY_IGNORE_GLOBS,
  '**/archive/**',
  '.agents/**',
  '.claude/**',
  '.cursor/**',
  '.agent/state/collaboration/shared-comms-log.md',
  '.agent/state/collaboration/cross-worktree-work-state.md',
  // Handoff and succession records are frozen point-in-time captures that
  // may quote other documents' relative links verbatim (e.g. a review
  // output preserved word-for-word quoting a README's sibling link);
  // link integrity is not a property frozen records can or should hold.
  '.agent/state/collaboration/handoffs/**',
  // Machine-local scratch at the repo root (gitignored): agent working
  // trees and review workspaces land here and are never live sources.
  'tmp/**',
  // Copilot agent worktrees (owner ruling 2026-07-24: excluded from all
  // tools).
  '.github/copilot-worktrees/**',
  // design-sync working surfaces (gitignored, regenerated per sync): the
  // staged converter scripts and the built upload bundle. The bundle's
  // generated Markdown resolves links against the UPLOADED project layout,
  // not this repo's, so repo-relative validation is meaningless for it.
  '.ds-sync/**',
  'ds-bundle/**',
  // Same class: the curation sync's per-sync staging of direct-write drafts
  // (MCP-160) — their links resolve against the studio project layout.
  'packages/design/oak-design-system/.sync-staging/**',
] as const;

/** Collect repo-relative POSIX paths matching the given globs, minus excluded paths. */
async function collectMarkdownPaths(
  patterns: readonly string[],
  ignoreGlobs: readonly string[],
): Promise<string[]> {
  const matches = await glob([...patterns], {
    cwd: repoRoot,
    dot: true,
    ignore: [...ignoreGlobs],
  });
  return matches.map((m) => m.split(path.sep).join('/')).filter((p) => !isExcludedPath(p));
}

/** Collect every present, non-excluded internal file and directory target. */
async function collectRepoPaths(): Promise<string[]> {
  const matches = await glob(['**/*'], {
    cwd: repoRoot,
    dot: true,
    ignore: [...INVENTORY_IGNORE_GLOBS],
    onlyFiles: false,
  });
  return matches
    .map((m) => m.split(path.sep).join('/').replace(/\/$/, ''))
    .filter((p) => !isExcludedPath(p));
}

/** Read the scan-source files into memory as {@link ScanFile} records. */
async function readScanFiles(relPaths: readonly string[]): Promise<ScanFile[]> {
  const files: ScanFile[] = [];
  for (const relPath of relPaths) {
    const content = await readText(repoRoot, relPath);
    files.push({ path: relPath, content });
  }
  return files;
}

/** Print the grouped broken-link report plus the totals summary. */
function reportBrokenLinks(report: MarkdownLinkReport): void {
  const { totals } = report;
  writeLine(
    `validate-markdown-links: ${String(totals.brokenLinks)} broken internal link(s) ` +
      `across ${String(totals.filesScanned)} scanned file(s) — ` +
      `${String(totals.autoFixable)} auto-fixable (unique basename), ` +
      `${String(totals.manual)} manual. BLOCKING.`,
  );

  if (report.byFile.length > 0) {
    writeLine('');
    writeLine('  Broken internal links by source file (written target -> suggested fix):');
    for (const group of report.byFile) {
      writeLine(`    ${group.sourcePath}:`);
      for (const link of group.links) {
        const fix = link.suggestedFix ?? '(manual — no unique match)';
        writeLine(
          `      L${String(link.line)}  ${link.writtenTarget}  ->  ${fix} [${link.reason}]`,
        );
      }
    }
  }

  writeLine('');
  writeLine(
    `  Totals: ${String(totals.filesScanned)} files scanned, ` +
      `${String(totals.linksChecked)} internal links checked, ` +
      `${String(totals.brokenLinks)} broken, ` +
      `${String(totals.autoFixable)} auto-fixable, ${String(totals.manual)} manual.`,
  );
}

async function main(): Promise<void> {
  const trackedPaths = listTrackedPathSet(repoRoot);
  if (!trackedPaths.ok) {
    writeLine(
      `validate-markdown-links: cannot list tracked paths — ` +
        `${describeGitReadFailure(trackedPaths.error)}. BLOCKING.`,
    );
    process.exitCode = 1;
    return;
  }
  const scanPaths = await collectMarkdownPaths(SCAN_GLOBS, SOURCE_IGNORE_GLOBS);
  // The target inventory is broader than the Markdown source set: every
  // present internal file or directory can be a valid Markdown dependency.
  const repoPaths = await collectRepoPaths();
  const files = await readScanFiles(scanPaths);

  const report = findBrokenLinks(files, repoPaths, trackedPaths.value);

  if (report.totals.brokenLinks === 0) {
    writeLine('validate-markdown-links: OK (no broken internal links in scanned surfaces).');
    return;
  }

  reportBrokenLinks(report);
  process.exitCode = 1;
}

await main();
