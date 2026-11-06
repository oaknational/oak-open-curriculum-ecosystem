#!/usr/bin/env node

/**
 * Commit-Skill Advisory Orchestrator
 *
 * Runs the commit skill's pre-`git commit` advisory discipline checks as a
 * single composed sequence: fitness (`practice:fitness:strict-hard`),
 * vocabulary (`practice:vocabulary`), then commit message validation
 * (`check-commit-message`, run in this process). Exits with the first non-zero
 * exit code; exit 0 means every advisory check passed.
 *
 * **Polarity is advisory, NOT blocking.** This script is agent-invoked. Its
 * non-zero exit is information for the agent to read and route, NEVER a
 * commit verdict. The blocking commit-time enforcement is `.husky/pre-commit`,
 * a separate enforcement surface with different scope (format / markdownlint
 * / lint / type-check / depcruise / knip / test) that does NOT include the
 * fitness check that this advisory carries.
 *
 * A non-zero exit from this script is NEVER licence to propose `--no-verify`
 * (forbidden by `feedback_no_verify_fresh_permission` and the
 * `no-verify-requires-fresh-authorisation` rule), construct a doctrinal-
 * collision framing, or otherwise reshape the commit. See
 * [PDR-053](.agent/practice-core/decision-records/PDR-053-orchestrator-vs-gate-structural-cure.md)
 * and [ADR-176](docs/architecture/architectural-decisions/176-commit-skill-advisory-orchestrator-naming.md)
 * for the structural-cure doctrine.
 *
 * Doctrinal anchors:
 * - PDR-038 §2026-05-04 amendment — un-enforced doctrine at maturity is a
 *   net liability; fitness and vocabulary are stated principles paired with
 *   structural enforcement at this surface.
 * - PDR-044 — memetic immune system, innate-immunity layer; fast,
 *   deterministic write-time detection at the commit boundary.
 * - PDR-053 — orchestrator-vs-gate structural cure (advisory polarity at
 *   filename + banner + skill-doctrine).
 * - ADR-144 — three-zone fitness vocabulary consistency.
 * - ADR-176 — commit-skill advisory orchestrator naming and surface polarity.
 *
 * The orchestrator is dependency-injected so the wiring shape can be unit
 * tested without spawning real sub-processes.
 *
 * Exit codes:
 *   0   every advisory check passed
 *   ≠0  the first failing advisory check's exit code
 *
 * Message intake: the arguments are `check-commit-message`'s (`-m`, `-F`,
 * `-F -`, or stdin), passed to its check in this process, never onto another
 * command line (see {@link commitSkillAdvisoryChecks}).
 */

import { fileURLToPath } from 'node:url';

import { runFileBackedChild } from '../core/file-backed-child.js';

import { checkCommitMessage } from './check-commit-message.js';

const ADVISORY_BANNER = '[ADVISORY ONLY — NOT A COMMIT GATE]';

/**
 * Result of running a single advisory check.
 */
export interface AdvisoryCheckResult {
  readonly exitCode: number;
  readonly stderr: string;
}

/**
 * Result of running the full commit-skill advisory sequence.
 */
export type CommitSkillAdvisoriesResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly failedCheck: 'fitness' | 'vocabulary' | 'message';
      readonly exitCode: number;
      readonly stderr: string;
    };

/**
 * The three advisory checks the orchestrator drives, in their run order.
 */
export interface CommitSkillAdvisoryChecks {
  readonly fitnessCheck: () => Promise<AdvisoryCheckResult>;
  readonly vocabularyCheck: () => Promise<AdvisoryCheckResult>;
  readonly messageCheck: () => Promise<AdvisoryCheckResult>;
}

/**
 * Pure orchestrator: drives the three advisory checks in order and
 * short-circuits on the first failure. Caller injects the check
 * implementations; the runtime entry binds the real checks through
 * {@link commitSkillAdvisoryChecks}.
 *
 * @param input - the three injected advisory-check functions
 * @returns the orchestrator outcome
 */
export async function runCommitSkillAdvisories(
  input: CommitSkillAdvisoryChecks,
): Promise<CommitSkillAdvisoriesResult> {
  const fitness = await input.fitnessCheck();
  if (fitness.exitCode !== 0) {
    return {
      ok: false,
      failedCheck: 'fitness',
      exitCode: fitness.exitCode,
      stderr: fitness.stderr,
    };
  }

  const vocabulary = await input.vocabularyCheck();
  if (vocabulary.exitCode !== 0) {
    return {
      ok: false,
      failedCheck: 'vocabulary',
      exitCode: vocabulary.exitCode,
      stderr: vocabulary.stderr,
    };
  }

  const message = await input.messageCheck();
  if (message.exitCode !== 0) {
    return {
      ok: false,
      failedCheck: 'message',
      exitCode: message.exitCode,
      stderr: message.stderr,
    };
  }

  return { ok: true };
}

/**
 * The three advisory checks, built from the arguments this command was given.
 *
 * @remarks
 * The tree-state checks run as pnpm scripts with fixed arguments. The message
 * check runs in this process, through `checkMessage`, and takes every argument
 * this command was given. So no argument reaches another command line: under
 * `cross-spawn` on Windows, a `pnpm.cmd` shim's arguments pass through
 * `cmd.exe`, which reads them a second time, and a quote in a commit subject
 * could end the quoting early. Running in-process also lets `-F -` read this
 * command's own stdin, which a launched check never receives.
 *
 * @param forwardedArgs - this command's arguments, in `check-commit-message`'s intake form
 * @param deps - how a pnpm script is launched, and the in-process message check
 * @returns the checks {@link runCommitSkillAdvisories} drives
 */
export function commitSkillAdvisoryChecks(
  forwardedArgs: readonly string[],
  deps: {
    readonly runPnpm: (args: readonly string[]) => Promise<AdvisoryCheckResult>;
    readonly checkMessage: (argv: readonly string[]) => number;
  },
): CommitSkillAdvisoryChecks {
  return {
    fitnessCheck: async () => deps.runPnpm(['practice:fitness:strict-hard']),
    vocabularyCheck: async () => deps.runPnpm(['practice:vocabulary']),
    messageCheck: async () => ({ exitCode: deps.checkMessage(forwardedArgs), stderr: '' }),
  };
}

function describeFailure(
  failure: Extract<CommitSkillAdvisoriesResult, { readonly ok: false }>,
): string {
  const headers: Record<typeof failure.failedCheck, string> = {
    fitness: 'practice:fitness:strict-hard (PDR-038 §2026-05-04 amendment)',
    vocabulary: 'practice:vocabulary (ADR-144)',
    message: 'pnpm agent-tools:check-commit-message',
  };

  return `commit-skill ADVISORY check "${failure.failedCheck}" failed (${headers[failure.failedCheck]}); exit ${failure.exitCode}. ${ADVISORY_BANNER} — read, route, and act per the substance-led path; this is NOT a commit verdict.`;
}

async function main(forwardedArgs: readonly string[]): Promise<number> {
  const repoRoot = process.cwd();

  process.stderr.write(`${ADVISORY_BANNER}\n`);
  process.stderr.write(
    'commit-skill advisory orchestrator — runs fitness, vocabulary, and message checks as advisory pre-screen.\n',
  );
  process.stderr.write(
    'A non-zero exit is information for the agent to read and route. It is NEVER a commit verdict, NEVER licence to propose --no-verify, and NEVER licence to construct a doctrinal-collision framing. See PDR-053 and ADR-176.\n\n',
  );

  const result = await runCommitSkillAdvisories(
    commitSkillAdvisoryChecks(forwardedArgs, {
      runPnpm: async (args) => runFileBackedChild({ command: 'pnpm', args, cwd: repoRoot }),
      checkMessage: checkCommitMessage,
    }),
  );

  if (result.ok) {
    return 0;
  }

  process.stderr.write(`${describeFailure(result)}\n`);
  return result.exitCode;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main(process.argv.slice(2));
  process.exit(exitCode);
}
