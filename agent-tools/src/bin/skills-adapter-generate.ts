#!/usr/bin/env node
/**
 * CLI for the skills adapter generator.
 *
 * Usage (`--prefix` is REQUIRED — this estate's canonical value is `oak-`;
 * the root `pnpm skills:generate` / `pnpm skills:check` scripts pin it, and
 * an unpinned run would mint a second, unprefixed skill estate the pinned
 * checker never inspects):
 *   skills-adapter-generate --prefix=oak-            # generate adapters
 *   skills-adapter-generate --check --prefix=oak-    # exit non-zero on drift
 *   skills-adapter-generate --clear --prefix=oak-    # clear then generate
 */
import { argv, exit, stderr, stdout } from 'node:process';

import { checkAdapters } from '../skills-adapter-generate/checker.js';
import { CLI_USAGE, parseCliFlags, type CliFlags } from '../skills-adapter-generate/cli-flags.js';
import {
  generateAdapters,
  generateExitCode,
  type SkippedDirectory,
} from '../skills-adapter-generate/generator.js';

/**
 * Render one entry per line, indented. EVERY reported list uses this: a
 * `skipped` entry now carries its refusal reason, and a zod message
 * contains commas of its own ("expected string, received number"), so
 * comma-joining two refusals onto one line produces a sentence no operator
 * can split back into entries.
 */
function indentedList(entries: readonly string[]): string {
  return entries.map((entry) => `  ${entry}`).join('\n');
}

/**
 * The ONE place a skipped directory becomes a display line. Discovery
 * carries `{ relativeDir, reason }` so the seam stays structured; both the
 * check and the generate path print it through here, so the two renderings
 * cannot drift.
 */
function skippedLines(skipped: readonly SkippedDirectory[]): string {
  return indentedList(skipped.map((entry) => `${entry.relativeDir} — ${entry.reason}`));
}

function reportCheckFailures(result: Awaited<ReturnType<typeof checkAdapters>>): void {
  if (result.skipped.length > 0) {
    stderr.write(
      `Skipped directories (content no harness can summon), with the reason for each:\n${skippedLines(result.skipped)}\n`,
    );
  }
  if (result.duplicates.length > 0) {
    stderr.write(
      `Duplicate canonical leaf ids (the flat adapter namespace cannot hold both):\n${indentedList(result.duplicates)}\n`,
    );
  }
  if (result.missing.length > 0) {
    stderr.write(`Missing projection files:\n${indentedList(result.missing)}\n`);
  }
  if (result.drifted.length > 0) {
    stderr.write(`Drifted projection files:\n${indentedList(result.drifted)}\n`);
  }
  if (result.orphaned.length > 0) {
    stderr.write(
      `Orphaned carried files (canonical source gone; a generator run prunes them):\n${indentedList(result.orphaned)}\n`,
    );
  }
  if (result.stale.length > 0) {
    stderr.write(
      `Stale Practice-namespace entries (no discovered canonical; a generator run removes them):\n${indentedList(result.stale)}\n`,
    );
  }
  if (result.refused.length > 0) {
    stderr.write(
      `Refusals (canonical symlinks or read failures — the verdict above is incomplete until these are cured):\n${indentedList(result.refused)}\n`,
    );
  }
  stderr.write('Regenerate with `pnpm skills:generate`, then `pnpm skills:check` to confirm.\n');
}

async function runCheck(repoRoot: string, prefix: string): Promise<number> {
  const result = await checkAdapters({ repoRoot, prefix });
  if (result.canonicalCount === 0) {
    if (result.refused.length > 0) {
      stderr.write(`Refusals:\n${indentedList(result.refused)}\n`);
    }
    // The reasons belong on THIS branch too. An estate whose canonicals
    // were all refused for a mistyped field also lands here, and blaming
    // the `.agent/skills` root would be false while discarding the field
    // name that says what to fix.
    if (result.skipped.length > 0) {
      stderr.write(
        `Skipped directories (content no harness can summon), with the reason for each:\n${skippedLines(result.skipped)}\n`,
      );
    }
    stderr.write(
      'Zero canonical skills discovered — a missing or unreadable `.agent/skills` root, or every canonical refused; never an empty estate. Refusing to certify.\n',
    );
    return 1;
  }
  const failureCount =
    result.drifted.length +
    result.missing.length +
    result.orphaned.length +
    result.duplicates.length +
    result.skipped.length +
    result.stale.length +
    result.refused.length;
  if (failureCount === 0) {
    stdout.write(
      `All adapters are up to date (${String(result.canonicalCount)} canonical skills, ` +
        `${String(result.carriedFileCount)} carried supporting files per surface).\n`,
    );
    return 0;
  }
  reportCheckFailures(result);
  return 1;
}

async function runGenerate(repoRoot: string, flags: CliFlags): Promise<number> {
  // The clear is folded into generation behind the discovery-completeness
  // gate: `generateAdapters` clears only after it has fully discovered the
  // canonicals it must regenerate, so `--clear` from the wrong directory (zero
  // canonicals) removes nothing (review 2026-08-12, defect 1). The removed
  // directories come back on `outcome.cleared`.
  const outcome = await generateAdapters({
    repoRoot,
    prefix: flags.prefix,
    clearFirst: flags.clear,
  });
  reportGenerateOutcome(outcome);
  if (outcome.written.length === 0 && outcome.skipped.length === 0) {
    stderr.write(
      'ERROR — no canonicals discovered under .agent/skills; wrong working directory?\n',
    );
    return 1;
  }
  return generateExitCode(outcome);
}

function reportGenerateOutcome(outcome: Awaited<ReturnType<typeof generateAdapters>>): void {
  if (outcome.cleared.length > 0) {
    stdout.write(
      `Cleared ${String(outcome.cleared.length)} Practice-projection directories before ` +
        `regeneration (entries without the class marker are not ours; untouched):\n${indentedList(outcome.cleared)}\n`,
    );
  }
  stdout.write(`Wrote ${String(outcome.written.length)} projection files.\n`);
  if (outcome.pruned.length > 0) {
    stdout.write(
      `Pruned ${String(outcome.pruned.length)} orphaned carried files:\n${indentedList(outcome.pruned)}\n`,
    );
  }
  if (outcome.sweptStale.length > 0) {
    stdout.write(
      `Removed ${String(outcome.sweptStale.length)} stale Practice-namespace entries ` +
        `(no discovered canonical):\n${indentedList(outcome.sweptStale)}\n`,
    );
  }
  if (outcome.duplicates.length > 0) {
    stderr.write(
      `ERROR — duplicate canonical leaf ids: ${outcome.duplicates.join(', ')}\n` +
        'The adapter namespace is flat; emission is refused so neither claimant silently shadows the other. ' +
        'Rename one canonical before regenerating.\n',
    );
  }
  if (outcome.skipped.length > 0) {
    stderr.write(
      `ERROR — canonicals discovery refused, with the reason for each:\n${skippedLines(outcome.skipped)}\n` +
        'These entries hold content no harness can summon (a directory at any of the three ratified ' +
        'tiers with no canonical, unreadable YAML, or frontmatter the Agent Skills specification does ' +
        'not admit). Fix the canonical named above before regenerating.\n',
    );
  }
  if (outcome.refused.length > 0) {
    stderr.write(
      `ERROR — refused emissions (canonical symlinks or read failures; nothing was written or pruned for these):\n${indentedList(outcome.refused)}\n`,
    );
  }
}

async function main(): Promise<number> {
  const parsed = parseCliFlags(argv.slice(2));
  if (parsed.kind === 'help') {
    stdout.write(`${CLI_USAGE}\n`);
    return 0;
  }
  if (parsed.kind === 'error') {
    stderr.write(`ERROR — ${parsed.message}\n${CLI_USAGE}\n`);
    return 2;
  }
  const flags = parsed.flags;
  const repoRoot = process.cwd();
  return flags.check ? await runCheck(repoRoot, flags.prefix) : await runGenerate(repoRoot, flags);
}

try {
  const code = await main();
  exit(code);
} catch (error: unknown) {
  stderr.write(`skills-adapter-generate failed: ${String(error)}\n`);
  exit(1);
}
