/**
 * Shared corpus-loading plumbing for the plan-schema instruments.
 *
 * @remarks
 * Both composition roots — `validate-plan-corpus.ts` (blocking
 * conformance gate) and `check-plan-gate-drift.ts` (non-blocking
 * persistent alert) — walk the same corpus root and parse the same
 * `*.plan.md` files; this module is that shared walk, extracted at the
 * second consumer. It owns file discovery and per-file parsing only;
 * what each instrument does with the parsed corpus stays its own.
 *
 * @packageDocumentation
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { isErr } from '@oaknational/result';

import { type ParsedPlanFile, type PlanConformanceFailure } from './plan-corpus-types.js';
import { validatePlanFile } from './validate-plan-corpus-helpers.js';

/** The live corpus root, relative to the repo root. */
const CORPUS_ROOT = '.agent/plans';

/** One directory entry as the corpus walk sees it. */
interface CorpusDirEntry {
  readonly name: string;
  readonly isDirectory: boolean;
}

/**
 * The filesystem the corpus walk reads through — injectable so tests
 * exercise the walk without real IO (ADR-078).
 */
export interface CorpusFileSystem {
  readonly readdir: (dir: string) => Promise<readonly CorpusDirEntry[]>;
  readonly readFile: (file: string) => Promise<string>;
}

const productionFileSystem: CorpusFileSystem = {
  readdir: async (dir) =>
    (await readdir(dir, { withFileTypes: true })).map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    })),
  readFile: async (file) => readFile(file, 'utf8'),
};

/**
 * Recursively collect `*.plan.md` files under a directory. Every
 * subdirectory is walked — directory names carry no archive semantics;
 * a plan leaves the corpus only through its own status field or a
 * deletion diff, never through a path move.
 */
async function collectPlanFiles(dir: string, fileSystem: CorpusFileSystem): Promise<string[]> {
  const entries = await fileSystem.readdir(dir);
  const collected: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory) {
      collected.push(...(await collectPlanFiles(full, fileSystem)));
    } else if (entry.name.endsWith('.plan.md')) {
      collected.push(full);
    }
  }
  return collected;
}

/** The parsed corpus: per-file failures split from file-level-valid plans. */
export interface ParsedCorpus {
  readonly fileFailures: PlanConformanceFailure[];
  readonly parsed: ParsedPlanFile[];
}

/**
 * Discover and parse the whole corpus under the repo's live corpus
 * root, sorted for deterministic report order.
 */
export async function loadCorpus(
  repoRoot: string,
  fileSystem: CorpusFileSystem = productionFileSystem,
): Promise<ParsedCorpus> {
  const planPaths = (await collectPlanFiles(path.join(repoRoot, CORPUS_ROOT), fileSystem)).toSorted(
    (a, b) => a.localeCompare(b),
  );
  const fileFailures: PlanConformanceFailure[] = [];
  const parsed: ParsedPlanFile[] = [];
  for (const planPath of planPaths) {
    const relative = path.relative(repoRoot, planPath);
    const content = await fileSystem.readFile(planPath);
    const result = validatePlanFile(relative, content);
    if (isErr(result)) {
      fileFailures.push(result.error);
    } else {
      parsed.push({ path: relative, node: result.value });
    }
  }
  return { fileFailures, parsed };
}
