#!/usr/bin/env node

/**
 * Sweep entry point: mint every canonical rule's frontmatter from the hand-kept sources.
 *
 * ```sh
 * pnpm --filter @oaknational/agent-tools rule-frontmatter-sweep           # dry run: report only
 * pnpm --filter @oaknational/agent-tools rule-frontmatter-sweep --write   # write the blocks
 * ```
 *
 * The rules swept are the tracked files under `.agent/rules/` (the tracked tree is the
 * universe, never the disk), read through this estate's git seam (`repository-paths.ts`);
 * a listing failure is a refusal, never an empty sweep. The reconciliation report on stdout is the table the landing
 * pull request carries. Exit 0 when the sweep completed, 1 when it refused, 2 on bad usage.
 *
 * @packageDocumentation
 */

import { argv, stderr, stdout } from 'node:process';

import { err, ok, type Result } from '@oaknational/result';

import { scanArgs } from '../core/cli-arg-parser.js';
import { resolveRepoRoot } from '../core/repo-root.js';
import { describeGitReadFailure, listTrackedFiles } from '../core/repository-paths.js';

import { renderReconciliationReport } from './render-reconciliation-report.js';
import { sweepRuleFrontmatter, type SweepOutcome } from './sweep-rule-frontmatter.js';

const USAGE = [
  'Usage: rule-frontmatter-sweep [--write]',
  '  --write  write the derived frontmatter into each rule; without it, report only',
  '  --help   show this usage',
].join('\n');

const RULES_DIR = '.agent/rules/';

interface SweepFlags {
  write: boolean;
  help: boolean;
}

/** The tracked rule names, the prefix and the `.md` stripped and nothing else dropped: a nested or
 * foreign entry reaches the name boundary (`refuseNonBasenames`) and is refused there by name. */
function trackedRuleNames(repoRoot: string): Result<readonly string[], string> {
  const tracked = listTrackedFiles(repoRoot);
  if (!tracked.ok) {
    return err(describeGitReadFailure(tracked.error));
  }
  return ok(
    tracked.value
      .filter((file) => file.startsWith(RULES_DIR))
      .map((file) => file.slice(RULES_DIR.length).replace(/\.md$/u, '')),
  );
}

/** Print the sweep's outcome (the refusals, or the reconciliation report and the summary line) and name the exit code. */
function reportOutcome(outcome: SweepOutcome, write: boolean): number {
  if (outcome.refused.length > 0) {
    stderr.write(`Sweep refused; nothing written (${String(outcome.refused.length)} reasons):\n`);
    for (const reason of outcome.refused) {
      stderr.write(`- ${reason}\n`);
    }
    return 1;
  }
  if (outcome.declarations.length > 0) {
    stdout.write(renderReconciliationReport(outcome.reconciliations));
  } else {
    stdout.write('Nothing derived: every rule already carries its declaration.\n');
  }
  stdout.write(
    `\n${String(outcome.declarations.length)} rule declarations derived, ` +
      `${String(outcome.reconciliations.length)} reconciliations, ` +
      `${String(outcome.alreadyDeclared.length)} rules already declared, ` +
      `${String(outcome.written.length)} files written${write ? '' : ' (dry run)'}.\n`,
  );
  return 0;
}

async function main(): Promise<number> {
  const flags: SweepFlags = { write: false, help: false };
  const scan = scanArgs(argv.slice(2), flags, {
    flags: {
      '--write': (state) => {
        state.write = true;
      },
      '--help': (state) => {
        state.help = true;
      },
      '-h': (state) => {
        state.help = true;
      },
    },
    valueOptions: {},
    helpText: USAGE,
  });
  if (!scan.ok) {
    stderr.write(`ERROR — ${scan.error}\n`);
    return 2;
  }
  if (flags.help) {
    stdout.write(`${USAGE}\n`);
    return 0;
  }
  // projectDir is explicitly disabled: this tool derives from and writes into the tree it
  // runs inside. The CLAUDE_PROJECT_DIR leg would rebind a worktree invocation to the
  // primary checkout and silently sweep the wrong estate.
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const ruleNames = trackedRuleNames(repoRoot);
  if (!ruleNames.ok) {
    stderr.write(`Sweep refused; nothing written: ${ruleNames.error}\n`);
    return 1;
  }
  const outcome = await sweepRuleFrontmatter({
    repoRoot,
    ruleNames: ruleNames.value,
    write: flags.write,
  });
  return reportOutcome(outcome, flags.write);
}

// Set the exit code and let the event loop drain stdout: `process.exit` can truncate piped
// output, and the reconciliation report is meant to be piped into a pull request body.
try {
  process.exitCode = await main();
} catch (error: unknown) {
  stderr.write(`rule-frontmatter-sweep failed: ${String(error)}\n`);
  process.exitCode = 1;
}
