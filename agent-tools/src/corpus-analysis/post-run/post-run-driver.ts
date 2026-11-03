/**
 * The deterministic post-run driver for the discovery pipeline.
 *
 * @remarks
 * Reads the committed checkpoint envelopes, strict re-parses every boundary, and runs
 * the full deterministic close: recall integrity (must be empty) → the stratified
 * recall report → the Choice-B graduate verdict (strict within-remit ≥ 0.6 AND lenient
 * ≥ 0.85 — a verdict to report, never an auto-rerun trigger) → map coverage → the
 * additive temporal-coverage report → corroboration of claimed on-disk homes →
 * recompute of every disposition by replaying the real `adjudicate` (the diff must be
 * zero) → the deterministic strength-of-evidence triage of every survivor (see
 * `./triage.ts` for the documented banding). Exits non-zero on an incomplete map (an
 * envelope carrying `mapComplete: false`), integrity violations or recompute mismatches,
 * naming each failing check (`postRunVerdict`); a recall MISS is reported, not failed.
 *
 * Usage (cwd = the agent-tools workspace):
 *
 * ```bash
 * pnpm post-run-driver --map-result <file> --reduce-result <file> \
 *   --validate-result <file> [--validate-result <file> ...] --meta-result <file>
 * ```
 *
 * `--validate-result` files are consumed in flag order; on resumed runs pass them
 * chronologically — the triage leg resolves each candidate from its LAST terminal
 * disposition.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { parseFlags } from '../../core/parse-flags.js';
import { resolveRepoRoot } from '../../core/repo-root.js';

import { checkMapCoverage } from '../cost-and-coverage.js';
import {
  findRecallIntegrityViolations,
  meetsGraduateGate,
  recallReport,
} from '../aggregation-recall.js';
import { RECALL_BASELINES } from '../recall-baseline-fixture.js';
import { corroborateAgainstHomes } from '../real-world-signal.js';
import {
  parseMapResult,
  parseMetaResult,
  parseReduceResult,
  parseValidateResult,
} from '../workflows/stage-io.js';
import type { MapResult, MetaResult, ReduceResult, ValidateResult } from '../workflows/stage-io.js';
import { makeCheckpointReader } from './checkpoint-io.js';
import { existingClaimedHomePaths } from './claimed-home-existence.js';
import {
  postRunVerdict,
  recomputeDispositions,
  temporalCoverageReport,
} from './post-run-analysis.js';
import { triageDispositions } from './triage.js';

/** The Choice-B graduate gate (owner-confirmed). */
const CHOICE_B = { minStrictWithinRemit: 0.6, minLooseWithinRemit: 0.85 } as const;

// projectDir is explicitly disabled: this driver reads checkpoints and claimed homes from
// the checkout it runs in, never from the harness project directory.
const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
const readCheckpoint = makeCheckpointReader(repoRoot);

interface Checkpoints {
  readonly mapResult: MapResult;
  readonly reduceResult: ReduceResult;
  readonly validateResults: readonly ValidateResult[];
  readonly metaResult: MetaResult;
}

interface CliFlags {
  readonly 'map-result'?: string;
  readonly 'reduce-result'?: string;
  readonly 'validate-result'?: readonly string[];
  readonly 'meta-result'?: string;
}

/** An unknown or malformed flag is an input error on the concise stderr path. */
function parseCliFlags(): Result<CliFlags, Error> {
  return parseFlags({
    options: {
      'map-result': { type: 'string' },
      'reduce-result': { type: 'string' },
      'validate-result': { type: 'string', multiple: true },
      'meta-result': { type: 'string' },
    },
  });
}

async function readCheckpoints(values: CliFlags): Promise<Result<Checkpoints, Error>> {
  const mapResult = await readCheckpoint(values['map-result'], '--map-result', parseMapResult);
  if (!mapResult.ok) {
    return mapResult;
  }
  const reduceResult = await readCheckpoint(
    values['reduce-result'],
    '--reduce-result',
    parseReduceResult,
  );
  if (!reduceResult.ok) {
    return reduceResult;
  }
  const validateResults = [];
  for (const filePath of values['validate-result'] ?? []) {
    const parsed = await readCheckpoint(filePath, '--validate-result', parseValidateResult);
    if (!parsed.ok) {
      return parsed;
    }
    validateResults.push(parsed.value);
  }
  if (validateResults.length === 0) {
    return err(new Error('At least one --validate-result is required.'));
  }
  const metaResult = await readCheckpoint(values['meta-result'], '--meta-result', parseMetaResult);
  if (!metaResult.ok) {
    return metaResult;
  }
  return ok({
    mapResult: mapResult.value,
    reduceResult: reduceResult.value,
    validateResults,
    metaResult: metaResult.value,
  });
}

function requireSuccess(checkpoints: Checkpoints): Result<undefined, Error> {
  const failures: string[] = [];
  if (!checkpoints.mapResult.ok) {
    failures.push(`map: ${checkpoints.mapResult.error}`);
  }
  if (!checkpoints.reduceResult.ok) {
    failures.push(`reduce: ${checkpoints.reduceResult.error}`);
  }
  for (const result of checkpoints.validateResults) {
    if (!result.ok) {
      failures.push(`validate: ${result.error}`);
    }
  }
  if (!checkpoints.metaResult.ok) {
    failures.push(`meta: ${checkpoints.metaResult.error}`);
  }
  return failures.length > 0
    ? err(new Error(`Failed stage envelopes:\n- ${failures.join('\n- ')}`))
    : ok(undefined);
}

const flags = parseCliFlags();
const checkpoints = flags.ok ? await readCheckpoints(flags.value) : flags;
if (checkpoints.ok) {
  const successes = requireSuccess(checkpoints.value);
  if (!successes.ok) {
    process.stderr.write(`${successes.error.message}\n`);
    process.exitCode = 1;
  } else if (
    checkpoints.value.mapResult.ok &&
    checkpoints.value.reduceResult.ok &&
    checkpoints.value.metaResult.ok
  ) {
    const { mapResult, reduceResult, metaResult } = checkpoints.value;
    const validateSuccesses = checkpoints.value.validateResults.flatMap((result) =>
      result.ok ? [result] : [],
    );
    const meta = metaResult.meta;

    const integrity = findRecallIntegrityViolations({
      matches: meta.recallMatches,
      baselines: RECALL_BASELINES,
    });
    const report = recallReport({ matches: meta.recallMatches, baselines: RECALL_BASELINES });
    const choiceB = meetsGraduateGate(report, CHOICE_B);
    const coverage = checkMapCoverage({ windows: mapResult.coverage });
    const temporal = temporalCoverageReport(reduceResult.candidates);
    const corroboration = corroborateAgainstHomes({
      claims: meta.corroborationClaims,
      // Claimed homes are repo-relative or absolute; anchor them at the repo root (a bare
      // existsSync would resolve a relative one against the agent-tools cwd and miss it).
      existingHomePaths: existingClaimedHomePaths({
        claims: meta.corroborationClaims,
        repoRoot,
      }),
    });
    const recomputes = recomputeDispositions(validateSuccesses);
    const recomputeMismatches = recomputes.filter((entry) => !entry.matches);
    const triage = triageDispositions({
      candidates: reduceResult.candidates,
      validateResults: validateSuccesses,
      meta,
      temporal,
      corroborations: corroboration,
    });

    process.stdout.write(
      `${JSON.stringify(
        {
          recallIntegrityViolations: integrity,
          recallReport: report,
          choiceB: { gate: CHOICE_B, pass: choiceB },
          mapCoverage: coverage,
          temporalCoverage: temporal,
          corroboration,
          dispositionRecompute: {
            total: recomputes.length,
            mismatches: recomputeMismatches,
          },
          triage,
        },
        null,
        2,
      )}\n`,
    );

    const verdict = postRunVerdict({
      integrityViolations: integrity.length,
      recomputeMismatches: recomputeMismatches.length,
      mapComplete: mapResult.mapComplete,
    });
    if (!verdict.ok) {
      process.stderr.write(
        `POST-RUN FAILURE: ${verdict.reasons.join('; ')} — do not trust this run's aggregates.\n`,
      );
      process.exitCode = 1;
    } else {
      process.stdout.write(
        `post-run close green: map complete, integrity empty, dispositions recompute to zero diff, Choice-B ${choiceB ? 'PASS' : 'MISS (reported, not failed — assess whether the tuning gap cost real discovery)'}\n`,
      );
    }
  }
} else {
  process.stderr.write(`${checkpoints.error.message}\n`);
  process.exitCode = 1;
}
