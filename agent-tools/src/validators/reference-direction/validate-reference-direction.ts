import fs from 'node:fs/promises';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine } from '../../core/terminal-output.js';

import {
  findReferenceDirectionViolations,
  type ScanFile,
} from './validate-reference-direction-helpers.js';

/**
 * Reference-direction validator (PDR-105). Scans the policed doctrine surfaces
 * (portable Core + repo doctrine) and reports references that point the wrong
 * way down the artefact fundamentality hierarchy — a portable Core doc citing a
 * repo-specific one (portability axis), or a durable doc citing an ephemeral
 * surface (durability axis).
 *
 * **Report-first (exit 0).** There is pre-existing wrong-direction debt; a
 * hard-failing gate would brick the build. Per the repo's `new-rules-start-at-warn`
 * and report-only-fitness doctrine, this validator makes the debt mechanically
 * visible and trackable on every check run (un-masking it — PDR-105 §Enforcement),
 * and escalation to a blocking gate is a separate owner decision once the debt is
 * burned down. Wired into root `repo-validators:check`.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Directories whose markdown files are policed as reference *sources*. */
const POLICED_ROOTS = [
  '.agent/practice-core',
  '.agent/rules',
  '.agent/directives',
  'docs/architecture/architectural-decisions',
  'docs/governance',
] as const;

async function collectMarkdown(relRoot: string): Promise<ScanFile[]> {
  const absRoot = path.join(repoRoot, relRoot);
  let entries: string[];
  try {
    entries = await fs.readdir(absRoot, { recursive: true });
  } catch {
    return [];
  }
  const files: ScanFile[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.md')) {
      continue;
    }
    const relPath = path.posix.join(relRoot, entry.split(path.sep).join('/'));
    const content = await fs.readFile(path.join(repoRoot, relPath), 'utf8');
    files.push({ path: relPath, content });
  }
  return files;
}

async function main(): Promise<void> {
  const files: ScanFile[] = [];
  for (const root of POLICED_ROOTS) {
    files.push(...(await collectMarkdown(root)));
  }
  const violations = findReferenceDirectionViolations(files);

  if (violations.length === 0) {
    writeLine(
      'validate-reference-direction: OK (no wrong-direction references in policed doctrine).',
    );
    return;
  }

  const byAxis = { portability: 0, durability: 0 };
  const byFile = new Map<string, number>();
  for (const v of violations) {
    byAxis[v.axis]++;
    byFile.set(v.sourcePath, (byFile.get(v.sourcePath) ?? 0) + 1);
  }

  writeLine(
    `validate-reference-direction: ${String(violations.length)} wrong-direction reference(s) — ` +
      `${String(byAxis.portability)} portability (Core → repo-specific), ` +
      `${String(byAxis.durability)} durability (doctrine → ephemeral). REPORT-ONLY (PDR-105).`,
  );
  writeLine('');
  writeLine('  Reference direction must flow toward the more fundamental artefact (PDR-105):');
  writeLine('  Core cites only Core; doctrine never cites plans/threads/state. Burndown by file:');
  for (const [file, count] of [...byFile.entries()].sort((a, b) => b[1] - a[1])) {
    writeLine(`    ${file}: ${String(count)}`);
  }
}

await main();
