/**
 * Build one SEEDED, launchable workflow artefact from committed checkpoint files.
 *
 * @remarks
 * Mirrors `corpus-analysis/workflows/build/build-run-artefact.ts`. Argv parsing and the
 * write live here; checkpoint-read + pipeline-glue + boundary re-parse live in
 * `derive-stage-run-data.ts` (file-length discipline). Writes
 * `dist/restatement-audit/workflows/<stage>.workflow.seeded.mjs` for
 * `Workflow({scriptPath})`.
 *
 * Relative file flags resolve against the REPOSITORY ROOT (never the process cwd, which
 * pnpm pins to the agent-tools workspace regardless of where the operator stands) — the
 * committed checkpoint paths under `.agent/reports/restatement-audit/` therefore work
 * identically from any invocation directory, matching every flag-path CLI in this
 * workspace (`flag-path-resolve.ts`). Usage:
 *
 * ```bash
 * pnpm restatement-audit-build-run-artefact --stage map --partition <partition.json> --gazetteer <gazetteer.v1.json>
 * pnpm restatement-audit-build-run-artefact --stage reduce --map-result <instances.json>
 * pnpm restatement-audit-build-run-artefact --stage validate --map-result <instances.json> \
 *   --reduce-result <clusters.json> --ceiling 5000000 [--validate-result <prior.json> ...]
 * pnpm restatement-audit-build-run-artefact --stage meta --map-result <instances.json> \
 *   --reduce-result <clusters.json> --validate-result <dispositions.json> [--validate-result <tail.json> ...]
 * ```
 *
 * @packageDocumentation
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { deriveRunData, type CliFlags, type StageRunData } from './derive-stage-run-data.js';
import { buildStageArtefact } from '../../../workflow-build/workflow-builder.js';
import { parseFlags } from '../../../core/parse-flags.js';
import { BUILD_CONFIG, STAGE_DEFINITIONS, WORKFLOW_OUT_DIR } from './build-config.js';

/** The full usage block the agent-tools help contract requires (README §CLI help contract). */
const USAGE = String.raw`Usage: pnpm restatement-audit-build-run-artefact --stage <stage> [stage flags]

Build one SEEDED, launchable workflow artefact from committed checkpoint files.
Writes dist/restatement-audit/workflows/<stage>.workflow.seeded.mjs for
Workflow({scriptPath}). All file flags take paths to committed checkpoint JSON;
paths resolve against the REPOSITORY ROOT (not the invoking cwd) and must stay
within the repository — an escaping or external path is refused before any read.

Required:
  --stage <map|reduce|validate|meta>       Pipeline stage to seed (REQUIRED).

Stage flags (REQUIRED per stage unless marked optional):
  map:       --partition <partition.json> --gazetteer <gazetteer.v1.json>
  reduce:    --map-result <instances.json>
  validate:  --map-result <instances.json> --reduce-result <clusters.json>
             --ceiling <positive integer, token hard-abort ceiling>
             [--validate-result <prior.json> ...]   (repeatable; resume narrowing)
  meta:      --map-result <instances.json> --reduce-result <clusters.json>
             --validate-result <dispositions.json>  (repeatable)

Other:
  --help     Print this usage block and exit 0.

Examples (paths repo-root-relative, like every committed checkpoint):
  pnpm restatement-audit-build-run-artefact --stage map \
    --partition .agent/reports/restatement-audit/partition.json \
    --gazetteer .agent/reports/restatement-audit/gazetteer.v1.json
  pnpm restatement-audit-build-run-artefact --stage validate \
    --map-result .agent/reports/restatement-audit/instances.json \
    --reduce-result .agent/reports/restatement-audit/clusters.json --ceiling 5000000
`;

/** Print the error AND the full usage block, then flag a non-zero exit (help contract). */
function failWithUsage(message: string): void {
  process.stderr.write(`${message}\n\n${USAGE}`);
  process.exitCode = 1;
}

function parseCliFlags(): Result<CliFlags, Error> {
  const flags = parseFlags({
    options: {
      stage: { type: 'string' },
      partition: { type: 'string' },
      gazetteer: { type: 'string' },
      'map-result': { type: 'string' },
      'reduce-result': { type: 'string' },
      'validate-result': { type: 'string', multiple: true },
      ceiling: { type: 'string' },
    },
  });
  if (!flags.ok) {
    return flags;
  }
  const values = flags.value;
  return ok({
    stage: values.stage ?? '',
    partition: values.partition,
    gazetteer: values.gazetteer,
    mapResult: values['map-result'],
    reduceResult: values['reduce-result'],
    validateResults: values['validate-result'] ?? [],
    ceiling: values.ceiling === undefined ? undefined : Number(values.ceiling),
  });
}

async function resolveRunData(): Promise<
  Result<{ stage: (typeof STAGE_DEFINITIONS)[number]; data: StageRunData }, Error>
> {
  const flags = parseCliFlags();
  if (!flags.ok) {
    return flags;
  }
  const stage = STAGE_DEFINITIONS.find((definition) => definition.name === flags.value.stage);
  if (stage === undefined) {
    return err(
      new Error(`Unknown stage "${flags.value.stage}" — expected map | reduce | validate | meta.`),
    );
  }
  const data = await deriveRunData(flags.value);
  return data.ok ? ok({ stage, data: data.value }) : data;
}

if (process.argv.includes('--help')) {
  process.stdout.write(USAGE);
} else {
  const resolved = await resolveRunData();
  if (resolved.ok) {
    const artefact = await buildStageArtefact({
      config: BUILD_CONFIG,
      stage: resolved.value.stage,
      runData: resolved.value.data,
    });
    if (artefact.ok) {
      const outPath = path.join(
        WORKFLOW_OUT_DIR,
        `${resolved.value.stage.name}.workflow.seeded.mjs`,
      );
      await mkdir(WORKFLOW_OUT_DIR, { recursive: true });
      await writeFile(outPath, artefact.value, 'utf8');
      process.stdout.write(
        `seeded ${outPath} (${artefact.value.length} chars, contract green) — launch with Workflow({scriptPath}) from the repo root.\n`,
      );
    } else {
      // A failed artefact build is a runtime failure, not flag misuse — no usage block.
      process.stderr.write(`${artefact.error.message}\n`);
      process.exitCode = 1;
    }
  } else {
    failWithUsage(resolved.error.message);
  }
}
