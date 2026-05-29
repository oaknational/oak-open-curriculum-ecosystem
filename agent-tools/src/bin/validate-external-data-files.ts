#!/usr/bin/env node
import { fileURLToPath } from 'node:url';

import { repoRoot } from '../core/runtime.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import {
  findExternalDataViolations,
  formatExternalDataViolations,
} from '../external-data/external-data-contract.js';
import { discoverExternalDataFiles } from '../external-data/external-data-discovery.js';

/**
 * Repo-validator entry point for the `*.external-data.ts` file convention.
 *
 * Walks the repository for `*.external-data.ts` snapshot modules and fails if
 * any breaks the convention's contract: a snapshot MUST export its data typed
 * `unknown`, MUST carry a provenance docstring, and MUST NOT export logic
 * (function / class / enum). The contract exists because the suffix excludes a
 * file from Sonar's duplication gate; without enforcement the suffix could be
 * used to smuggle duplicated logic past that gate (see
 * `docs/governance/sonar-disposition-policy.md` §Duplications).
 *
 * Wired into the root `repo-validators:check` script. The contract logic lives
 * in `../external-data/external-data-contract.ts` and discovery in
 * `../external-data/external-data-discovery.ts` (both pure, unit-tested); this
 * file is the thin process binding only.
 *
 * @packageDocumentation
 */

const REMEDIATION =
  'A `*.external-data.ts` file (excluded from Sonar duplication detection; see ' +
  'docs/governance/sonar-disposition-policy.md §Duplications) MUST export its data typed ' +
  '`unknown`, MUST carry a provenance docstring, and MUST NOT export logic (function / class / ' +
  'enum). Fix the file(s) above, or — if the content is hand-written logic rather than a ' +
  'faithful external snapshot — rename it off the `.external-data.ts` suffix so its duplication ' +
  'is measured by the standard quality gate.';

async function run(): Promise<void> {
  const files = await discoverExternalDataFiles(repoRoot());
  const violations = findExternalDataViolations(files);

  if (violations.length === 0) {
    writeLine(
      `validate-external-data-files: OK (${files.length} *.external-data.ts file(s) satisfy the contract)`,
    );
    return;
  }

  writeErrorLine(
    `validate-external-data-files: ${violations.length} contract violation(s) found.\n\n` +
      `${formatExternalDataViolations(violations)}\n\n${REMEDIATION}`,
  );
  process.exit(1);
}

const isDirectExecution =
  process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  await run();
}
