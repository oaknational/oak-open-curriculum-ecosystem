/**
 * The deterministic salvage driver for a completed discovery run (salvage ws1).
 *
 * @remarks
 * Reads the committed reduce / validate / meta checkpoints plus the banked free-tool
 * verdict corpus, recomputes the on-disk corroboration report (repo-root anchored), and
 * prints the full salvage tier table (`./salvage-tiers.ts` documents the tier algebra
 * and the conservation invariant). Zero validate re-spend; no LLM in the loop. Thin
 * composition root: every branch and decision lives in the tested pure modules.
 *
 * Usage (cwd = the agent-tools workspace):
 *
 * ```bash
 * pnpm salvage-driver --reduce-result <file> \
 *   --validate-result <file> [--validate-result <file> ...] \
 *   --meta-result <file> --banked-verdicts <file>
 * ```
 *
 * `--validate-result` files are consumed in flag order; on resumed runs pass them
 * chronologically — the tier algebra resolves each candidate from its LAST terminal
 * disposition, exactly as the post-run driver's triage leg does.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { parseFlags } from '../../core/parse-flags.js';
import { resolveRepoRoot } from '../../core/repo-root.js';

import { corroborateAgainstHomes } from '../real-world-signal.js';
import { parseMetaResult, parseReduceResult, parseValidateResult } from '../workflows/stage-io.js';
import type { MetaResult, ReduceResult } from '../workflows/stage-io.js';
import { parseBankedFreetoolVerdicts } from './banked-verdicts.js';
import type { BankedFreetoolVerdicts } from './banked-verdicts.js';
import { makeCheckpointReader } from './checkpoint-io.js';
import { existingClaimedHomePaths } from './claimed-home-existence.js';
import { computeSalvageTiers } from './salvage-tiers.js';
import type { SalvageTierTable } from './salvage-tiers.js';
import type { ValidateSuccess } from './triage.js';

// projectDir is explicitly disabled: this driver reads checkpoints and claimed homes from
// the checkout it runs in, never from the harness project directory.
const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
const readCheckpoint = makeCheckpointReader(repoRoot);

interface SalvageInputs {
  readonly reduceResult: Extract<ReduceResult, { ok: true }>;
  readonly validateResults: readonly ValidateSuccess[];
  readonly metaResult: Extract<MetaResult, { ok: true }>;
  readonly bankedVerdicts: BankedFreetoolVerdicts;
}

async function readValidateSuccesses(
  filePaths: readonly string[],
): Promise<Result<readonly ValidateSuccess[], Error>> {
  const successes: ValidateSuccess[] = [];
  for (const filePath of filePaths) {
    const parsed = await readCheckpoint(filePath, '--validate-result', parseValidateResult);
    if (!parsed.ok) {
      return parsed;
    }
    if (!parsed.value.ok) {
      return err(new Error(`Failed validate envelope in ${filePath}: ${parsed.value.error}`));
    }
    successes.push(parsed.value);
  }
  if (successes.length === 0) {
    return err(new Error('At least one --validate-result is required.'));
  }
  return ok(successes);
}

interface CliFlags {
  readonly 'reduce-result'?: string;
  readonly 'validate-result'?: readonly string[];
  readonly 'meta-result'?: string;
  readonly 'banked-verdicts'?: string;
}

/** An unknown or malformed flag is an input error on the concise stderr path. */
function parseCliFlags(): Result<CliFlags, Error> {
  return parseFlags({
    options: {
      'reduce-result': { type: 'string' },
      'validate-result': { type: 'string', multiple: true },
      'meta-result': { type: 'string' },
      'banked-verdicts': { type: 'string' },
    },
  });
}

async function readInputs(values: CliFlags): Promise<Result<SalvageInputs, Error>> {
  const reduceResult = await readCheckpoint(
    values['reduce-result'],
    '--reduce-result',
    parseReduceResult,
  );
  if (!reduceResult.ok) {
    return reduceResult;
  }
  if (!reduceResult.value.ok) {
    return err(new Error(`Failed reduce envelope: ${reduceResult.value.error}`));
  }
  const validateResults = await readValidateSuccesses(values['validate-result'] ?? []);
  if (!validateResults.ok) {
    return validateResults;
  }
  const metaResult = await readCheckpoint(values['meta-result'], '--meta-result', parseMetaResult);
  if (!metaResult.ok) {
    return metaResult;
  }
  if (!metaResult.value.ok) {
    return err(new Error(`Failed meta envelope: ${metaResult.value.error}`));
  }
  const bankedVerdicts = await readCheckpoint(
    values['banked-verdicts'],
    '--banked-verdicts',
    parseBankedFreetoolVerdicts,
  );
  if (!bankedVerdicts.ok) {
    return bankedVerdicts;
  }
  return ok({
    reduceResult: reduceResult.value,
    validateResults: validateResults.value,
    metaResult: metaResult.value,
    bankedVerdicts: bankedVerdicts.value,
  });
}

function salvage(inputs: SalvageInputs): Result<SalvageTierTable, Error> {
  const meta = inputs.metaResult.meta;
  const corroborations = corroborateAgainstHomes({
    claims: meta.corroborationClaims,
    // Claimed homes are repo-relative; anchor them at the repo root (a bare
    // existsSync would resolve against the agent-tools cwd and miss every one).
    existingHomePaths: existingClaimedHomePaths({
      claims: meta.corroborationClaims,
      repoRoot,
    }),
  });
  return computeSalvageTiers({
    candidates: inputs.reduceResult.candidates,
    validateResults: inputs.validateResults,
    meta,
    corroborations,
    bankedOpusVerdicts: inputs.bankedVerdicts.opusFreetool,
  });
}

const flags = parseCliFlags();
const inputs = flags.ok ? await readInputs(flags.value) : flags;
if (inputs.ok) {
  const tiers = salvage(inputs.value);
  if (tiers.ok) {
    process.stdout.write(`${JSON.stringify(tiers.value, null, 2)}\n`);
  } else {
    process.stderr.write(`${tiers.error.message}\n`);
    process.exitCode = 1;
  }
} else {
  process.stderr.write(`${inputs.error.message}\n`);
  process.exitCode = 1;
}
