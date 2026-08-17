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
import { generateAdapters, generateExitCode } from '../skills-adapter-generate/generator.js';

function reportCheckFailures(result: Awaited<ReturnType<typeof checkAdapters>>): void {
  if (result.skipped.length > 0) {
    stderr.write(
      `Skipped directories (content no harness can summon): ${result.skipped.join(', ')}\n`,
    );
  }
  if (result.duplicates.length > 0) {
    stderr.write(
      `Duplicate canonical leaf ids (the flat adapter namespace cannot hold both): ${result.duplicates.join(', ')}\n`,
    );
  }
  if (result.missing.length > 0) {
    const missingList = result.missing.map((p) => `  ${p}`).join('\n');
    stderr.write(`Missing projection files:\n${missingList}\n`);
  }
  if (result.drifted.length > 0) {
    const driftedList = result.drifted.map((p) => `  ${p}`).join('\n');
    stderr.write(`Drifted projection files:\n${driftedList}\n`);
  }
  if (result.orphaned.length > 0) {
    const orphanedList = result.orphaned.map((p) => `  ${p}`).join('\n');
    stderr.write(
      `Orphaned carried files (canonical source gone; a generator run prunes them):\n${orphanedList}\n`,
    );
  }
  if (result.stale.length > 0) {
    const staleList = result.stale.map((p) => `  ${p}`).join('\n');
    stderr.write(
      `Stale Practice-namespace entries (no discovered canonical; a generator run removes them):\n${staleList}\n`,
    );
  }
  if (result.refused.length > 0) {
    const refusedList = result.refused.map((p) => `  ${p}`).join('\n');
    stderr.write(
      `Refusals (canonical symlinks or read failures — the verdict above is incomplete until these are cured):\n${refusedList}\n`,
    );
  }
  stderr.write('Regenerate with `pnpm skills:generate`, then `pnpm skills:check` to confirm.\n');
}

async function runCheck(repoRoot: string, prefix: string): Promise<number> {
  const result = await checkAdapters({ repoRoot, prefix });
  if (result.canonicalCount === 0) {
    if (result.refused.length > 0) {
      const refusedList = result.refused.map((p) => `  ${p}`).join('\n');
      stderr.write(`Refusals:\n${refusedList}\n`);
    }
    stderr.write(
      'Zero canonical skills discovered — a missing or unreadable `.agent/skills` root, not an empty estate. Refusing to certify.\n',
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
    const clearedList = outcome.cleared.map((p) => `  ${p}`).join('\n');
    stdout.write(
      `Cleared ${String(outcome.cleared.length)} Practice-projection directories before ` +
        `regeneration (entries without the class marker are not ours; untouched):\n${clearedList}\n`,
    );
  }
  stdout.write(`Wrote ${String(outcome.written.length)} projection files.\n`);
  if (outcome.pruned.length > 0) {
    const prunedList = outcome.pruned.map((p) => `  ${p}`).join('\n');
    stdout.write(
      `Pruned ${String(outcome.pruned.length)} orphaned carried files:\n${prunedList}\n`,
    );
  }
  if (outcome.sweptStale.length > 0) {
    const sweptList = outcome.sweptStale.map((p) => `  ${p}`).join('\n');
    stdout.write(
      `Removed ${String(outcome.sweptStale.length)} stale Practice-namespace entries ` +
        `(no discovered canonical):\n${sweptList}\n`,
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
      `ERROR — directories with no readable SKILL-CANONICAL.md: ${outcome.skipped.join(', ')}\n` +
        'These entries hold content no harness can summon (a directory at any of the three ratified ' +
        'tiers without a parseable canonical, or a dead end below them). Fix the canonical before regenerating.\n',
    );
  }
  if (outcome.refused.length > 0) {
    const refusedList = outcome.refused.map((p) => `  ${p}`).join('\n');
    stderr.write(
      `ERROR — refused emissions (canonical symlinks or read failures; nothing was written or pruned for these):\n${refusedList}\n`,
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
