#!/usr/bin/env node

/**
 * Lineage-name leak validator.
 *
 * Enforces the transplant's closure invariant over every tracked live surface:
 * the names of the lineage the Practice was transplanted from (declared once
 * in the `lineage-name` scoped block of `.agent/hooks/policy.json`) appear only
 * in the records that tell the transplant's story, in the site's content
 * directory and in the LinkedIn workspace, never in a fixture, a manifest, a
 * reference link or a comment.
 * The block's names and scope are the same ones the PreToolUse write-hook
 * applies, so the gate and the guard match the same names and exempt the same
 * files; the tracked-file listing and the binary/generated skip policy come
 * from `core/tracked-file-scan`, shared with the sibling gates.
 *
 * Wired into root `docs-validators:check`, which runs in `pnpm check` and CI.
 * Exit 0 = clean, or the policy defines no lineage-name block (an estate not
 * transplanted from another has no lineage names to check); exit 1 = at least
 * one lineage name on a live surface; exit 2 = refusal — the policy cannot be
 * loaded, defines more than one lineage-name block, the block is malformed
 * (non-literal, or a name the hook would read differently) or declares no
 * name, or a tracked file cannot be read (the scan never silently skips one). The status is returned from `main` and set on
 * `process.exitCode`, so buffered diagnostics reach a pipe before the process
 * ends.
 *
 * @packageDocumentation
 */

import { resolveRepoRoot } from '../../core/repo-root.js';
import { describeGitReadFailure, listTrackedFiles } from '../../core/repository-paths.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { describeUnreadable, readScanFiles } from '../../core/tracked-file-scan.js';
import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

import {
  lineageNeedles,
  needleDefects,
  scanForLineageNames,
  selectLineageNameBlock,
} from './validate-no-lineage-names-helpers.js';

const NAME = 'validate-no-lineage-names';

function refuse(reason: string): number {
  writeErrorLine(`${NAME}: ${reason}`);
  return 2;
}

async function loadBlocks(): Promise<readonly ScopedContentBlockGroup[] | undefined> {
  try {
    return await loadScopedContentBlocks();
  } catch (cause) {
    writeErrorLine(`${NAME}: cannot load .agent/hooks/policy.json (${String(cause)})`);
    return undefined;
  }
}

function report(
  hits: readonly { file: string; line: number; column: number; text: string }[],
): void {
  writeErrorLine(`✖ ${String(hits.length)} lineage name(s) on live surfaces:`);
  for (const hit of hits) {
    writeErrorLine(`  ${hit.file}:${String(hit.line)}:${String(hit.column)}  ${hit.text}`);
  }
  writeErrorLine('');
  writeErrorLine(
    'The lineage the Practice was transplanted from is named only in the records that tell that ' +
      'story (provenance, changelog, memory, reports, plans, the transplant exploration), in ' +
      "the site's content directory and in the LinkedIn workspace. On a live surface, name this " +
      'estate instead. See the ' +
      'lineage-name block in .agent/hooks/policy.json for the names and the scope, and the plan ' +
      'of record, closure item 5.',
  );
}

/**
 * The block and its needles; the clean status (exit 0), already written, when
 * the policy defines no block; or the refusal already written (exit 2) when
 * the policy cannot be loaded, defines two blocks, or the block is malformed
 * or empty.
 */
async function resolveNeedles(): Promise<
  { readonly block: ScopedContentBlockGroup; readonly needles: readonly string[] } | number
> {
  const blocks = await loadBlocks();
  if (blocks === undefined) {
    return 2;
  }
  const selected = selectLineageNameBlock(blocks);
  if (!selected.ok) {
    return refuse(selected.error);
  }
  const block = selected.value;
  if (block === undefined) {
    writeLine(
      `✓ no \`lineage-name\` block in .agent/hooks/policy.json: this estate declares no lineage names to check`,
    );
    return 0;
  }
  const defects = needleDefects(block);
  if (defects.length > 0) {
    // The hook reads the block raw; a block the gate would have to normalise
    // is one the two would read differently. Refuse rather than diverge.
    return refuse(`the \`lineage-name\` block is malformed — ${defects.join('; ')}`);
  }
  const needles = lineageNeedles(block);
  if (needles.length === 0) {
    return refuse('the `lineage-name` block declares no name');
  }
  return { block, needles };
}

async function main(): Promise<number> {
  const repoRoot = resolveRepoRoot(import.meta.url);
  const resolved = await resolveNeedles();
  if (typeof resolved === 'number') {
    return resolved;
  }
  const { block, needles } = resolved;
  const listing = listTrackedFiles(repoRoot);
  if (!listing.ok) {
    return refuse(`cannot list tracked files — ${describeGitReadFailure(listing.error)}`);
  }
  const scan = readScanFiles(repoRoot, listing.value);
  if (!scan.ok) {
    return refuse(describeUnreadable(scan.error));
  }
  const files = scan.value;
  const hits = scanForLineageNames(files, block, needles);
  if (hits.length === 0) {
    writeLine(
      `✓ no lineage names (${needles.join(', ')}) on the live surfaces of ${String(files.length)} scannable tracked files`,
    );
    return 0;
  }
  report(hits);
  return 1;
}

process.exitCode = await main();
