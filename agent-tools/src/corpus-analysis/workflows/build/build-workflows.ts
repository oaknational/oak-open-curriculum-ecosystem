/**
 * Composition root: verify every corpus-analysis workflow artefact on each build.
 *
 * @remarks
 * Bundles every registered stage UNSEEDED (the run-data sentinel) through the shared
 * build core and enforces the full output contract in memory — so `pnpm build` proves
 * each stage still bundles into a valid harness artefact, without writing run scripts
 * nobody should launch. Seeded, launchable artefacts are written only by
 * `build-run-artefact.ts` from validated checkpoint data. This file is the single
 * process boundary: failures become a non-zero exit.
 *
 * @packageDocumentation
 */

import { checkHarnessArtefactContract } from './output-contract.js';
import { buildStageArtefact, STAGE_DEFINITIONS } from './workflow-builder.js';

let failed = false;

// Contract canary: prove the REAL parser leg rejects a known-bad artefact (a redeclared
// injected global + a dynamic import) before trusting the green verdicts below. A green
// gate that cannot go red proves nothing.
const canary = checkHarnessArtefactContract(
  'export const meta = {};\nlet log = 1;\nasync function main() {\n  return import("x");\n}\nreturn await main();\n',
);
if (canary.ok) {
  process.stderr.write('output-contract canary FAILED: a known-bad artefact passed the contract\n');
  failed = true;
} else {
  process.stdout.write('output-contract canary green (known-bad artefact rejected)\n');
}

for (const stage of STAGE_DEFINITIONS) {
  const outcome = await buildStageArtefact({ stage });
  if (outcome.ok) {
    process.stdout.write(
      `verified ${stage.name} (${outcome.value.length} chars, contract green, unseeded)\n`,
    );
  } else {
    process.stderr.write(`${outcome.error.message}\n`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
}
