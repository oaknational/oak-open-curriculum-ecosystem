#!/usr/bin/env node

import { resolveRepoRoot } from '../../core/repo-root.js';
import { listFiles, readText, writeText } from '../portability/portability-fs.js';
import { writeLine } from '../../core/terminal-output.js';

import {
  parsePatternEntry,
  PATTERNS_README,
  renderPatternIndex,
  spliceIndexSection,
  type PatternEntry,
  type PatternParseError,
} from './validate-patterns-index-helpers.js';

/**
 * Patterns-index validator / generator. Derives the
 * `.agent/memory/active/patterns/README.md` "## Pattern Index" section from each
 * pattern file's frontmatter and checks the committed README matches. Run with
 * `--fix` to regenerate the section in place.
 *
 * **Blocking.** The index is generated, so a mismatch (a new pattern file with no
 * entry, a stale count, a hand-edit) is a real drift and fails the gate — the
 * structural cure for an index that previously drifted by hand. The fix is
 * mechanical (`--fix`), never manual transcription.
 *
 * @packageDocumentation
 */

const PATTERNS_DIR = '.agent/memory/active/patterns';
const repoRoot = resolveRepoRoot(import.meta.url);
const FIX = process.argv.includes('--fix');

/** Basename of a repo-relative pattern path (links in the index are same-dir filenames). */
function basename(relPath: string): string {
  return relPath.slice(relPath.lastIndexOf('/') + 1);
}

/** Read and parse every pattern file, partitioning into entries and parse errors. */
async function loadPatterns(): Promise<{
  entries: PatternEntry[];
  errors: PatternParseError[];
}> {
  const paths = await listFiles(repoRoot, PATTERNS_DIR, '.md');
  const patternFiles = paths.map(basename).filter((f) => f !== PATTERNS_README);
  const entries: PatternEntry[] = [];
  const errors: PatternParseError[] = [];
  for (const filename of patternFiles) {
    const content = await readText(repoRoot, `${PATTERNS_DIR}/${filename}`);
    const parsed = parsePatternEntry(filename, content);
    if ('reason' in parsed) {
      errors.push(parsed);
    } else {
      entries.push(parsed);
    }
  }
  return { entries, errors };
}

/**
 * Print the non-blocking note for files indexed without a `use_this_when` hint.
 *
 * `use_this_when` is the schema's primary discovery field
 * (`patterns/README.md` §Frontmatter Schema), so a missing one is a real gap.
 * This recurring note is the **warn stage** of a new check over a pre-existing
 * gap (per the new-rules-start-at-warn discipline): once a curation pass fills
 * the missing hints, this should escalate to a blocking failure.
 */
function noteMissingHints(entries: readonly PatternEntry[]): void {
  const missing = entries.filter((entry) => entry.useThisWhen === undefined);
  if (missing.length === 0) {
    return;
  }
  writeLine(
    `validate-patterns-index: note — ${String(missing.length)} indexed pattern(s) have no ` +
      `\`use_this_when\` frontmatter (a future curation pass should add one):`,
  );
  for (const entry of missing) {
    writeLine(`  ${entry.filename}`);
  }
}

/** Reconcile the committed index against the generated one (or write it under `--fix`). */
async function reconcileIndex(entries: readonly PatternEntry[]): Promise<void> {
  const readmeRel = `${PATTERNS_DIR}/${PATTERNS_README}`;
  const readme = await readText(repoRoot, readmeRel);
  const expected = spliceIndexSection(readme, renderPatternIndex(entries));
  const count = String(entries.length);

  if (expected === readme) {
    writeLine(`validate-patterns-index: OK (${count} patterns indexed, section in sync).`);
    return;
  }
  if (FIX) {
    await writeText(repoRoot, readmeRel, expected, []);
    writeLine(`validate-patterns-index: regenerated the Pattern Index (${count} patterns).`);
    return;
  }
  writeLine(
    `validate-patterns-index: the Pattern Index is out of sync with the ${count} pattern files ` +
      `(missing entries, stale counts, or a hand-edit). ` +
      `Run \`pnpm --filter @oaknational/agent-tools validate-patterns-index:fix\`.`,
  );
  process.exitCode = 1;
}

async function main(): Promise<void> {
  const { entries, errors } = await loadPatterns();
  if (errors.length > 0) {
    writeLine(
      `validate-patterns-index: ${String(errors.length)} pattern file(s) cannot be indexed ` +
        `(fix the frontmatter):`,
    );
    for (const error of errors) {
      writeLine(`  ${error.filename}: ${error.reason}`);
    }
    process.exitCode = 1;
    return;
  }
  noteMissingHints(entries);
  await reconcileIndex(entries);
}

await main();
