#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { isErr, type Result } from '@oaknational/result';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import {
  parseImpactAreasRegistry,
  recomputeChoiceRegistry,
  type ChoiceRegistry,
} from './plan-corpus-registries.js';
import { loadCorpus } from './plan-corpus-loading.js';
import { type PlanConformanceFailure } from './plan-corpus-types.js';
import { validateCorpus } from './validate-plan-corpus-helpers.js';

/**
 * Plan-corpus validator: every `*.plan.md` under the live corpus root
 * conforms to the plan-node contract (`.agent/plans/plan-node-schema.md`,
 * the D23 structure), and the corpus coheres as a whole — `serves`
 * edges resolve (strategic → the published strategic-choice registry;
 * delivery/runbook → a strategic node in the corpus), `impact_areas`
 * members resolve against the closed registry, `depends_on` edges name
 * real plans, ratified delivery plans satisfy execution-anchor
 * consistency (`plan-execution-anchors.ts`), and an EMPTY corpus is a
 * failure, never a vacuous green.
 *
 * This gate is a deterministic function of repo content — no clock,
 * by design: re-running it on any historical commit reproduces that
 * commit's verdict. The time-dependent sibling concern (expired owner
 * gates) is deliberately NOT here: it alerts without blocking via
 * `check-plan-gate-drift.ts` (owner ruling 2026-07-31).
 *
 * **Scan root is the admission rule drawn as a directory boundary**:
 * only `.agent/plans/` is scanned. The conserved backlog
 * (`.agent/plans-backlog-2026-07/`) and the archived V0 sketch corpus
 * are outside by construction. Node dispatch is file-suffix-shaped:
 * only `*.plan.md` files are plan nodes; the schema doc, registries,
 * templates, and READMEs are not scanned.
 *
 * CI coverage rides `repo-validators:check` (CI static-checks); the
 * check↔CI parity validator guards that aggregate wiring.
 *
 * @packageDocumentation
 */

const STRATEGY_DIR = 'docs/strategy';
const IMPACT_AREAS_FILE = '.agent/plans/impact-areas.md';
const repoRoot = resolveRepoRoot(import.meta.url);

/** Read both strategy surfaces and recompute the choice registry. */
async function loadChoiceRegistry(): Promise<Result<ChoiceRegistry, Error>> {
  const strategyDir = path.join(repoRoot, STRATEGY_DIR);
  const readmeContent = await readFile(path.join(strategyDir, 'README.md'), 'utf8');
  const streamNames = (await readdir(strategyDir)).filter(
    (name) => name.startsWith('stream-') && name.endsWith('.md'),
  );
  const streamContents = await Promise.all(
    streamNames.map(async (name) => readFile(path.join(strategyDir, name), 'utf8')),
  );
  return recomputeChoiceRegistry(readmeContent, streamContents);
}

/** Read and parse the closed impact-areas registry. */
async function loadImpactAreas(): Promise<Result<ReadonlySet<string>, Error>> {
  const content = await readFile(path.join(repoRoot, IMPACT_AREAS_FILE), 'utf8');
  return parseImpactAreasRegistry(content);
}

/** Print the per-file conformance failures, path-anchored. */
function reportFailures(failures: readonly PlanConformanceFailure[]): void {
  writeErrorLine(`validate-plan-corpus: ${String(failures.length)} non-conformant plan file(s):`);
  for (const failure of failures) {
    writeErrorLine(`  ${failure.path}`);
    for (const message of failure.messages) {
      writeErrorLine(`    - ${message}`);
    }
  }
}

async function main(): Promise<number> {
  const choices = await loadChoiceRegistry();
  if (isErr(choices)) {
    writeErrorLine(`validate-plan-corpus: ${choices.error.message}`);
    return 1;
  }
  const impactAreas = await loadImpactAreas();
  if (isErr(impactAreas)) {
    writeErrorLine(`validate-plan-corpus: ${impactAreas.error.message}`);
    return 1;
  }
  const { fileFailures, parsed } = await loadCorpus(repoRoot);
  const failures = [...fileFailures, ...validateCorpus(parsed, choices.value, impactAreas.value)];
  if (failures.length > 0) {
    reportFailures(failures);
    return 1;
  }
  writeLine(
    `validate-plan-corpus: OK (${String(parsed.length)} plan file(s) conformant; serves, impact_areas, and depends_on edges resolved; execution anchoring consistent).`,
  );
  return 0;
}

process.exitCode = await main();
