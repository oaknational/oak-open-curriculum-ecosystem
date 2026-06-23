#!/usr/bin/env node
/**
 * WS7 pre-archive-move provenance check runner — the "script in the curator
 * pass" of ADR-199 §"Provenance survivor" / PDR-094 Invariant 3.
 *
 * @remarks
 * Thin entry over the tested {@link runProvenanceCheck} module. It runs the
 * **completeness** check: the candidate set is every known event, so any event
 * cited in a permanent record (ADR / PDR / pattern / governance doc) that the git-tracked digest
 * `.agent/reference/comms-cited-events.md` does not cover is reported — its
 * provenance would not survive a clean checkout after rotation. Exits non-zero
 * on any violation or on a fail-closed scan error, so a curator pass cannot
 * archive-move while a cited event is uncovered.
 *
 * @packageDocumentation
 */

import { join } from 'node:path';

import {
  collectKnownEventIds,
  runProvenanceCheck,
} from '../collaboration-state/provenance/provenance-scan.js';
import { createNodeProvenanceScanIo } from '../collaboration-state/provenance/provenance-scan-node.js';
import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';

const repoRoot = resolveRepoRoot(import.meta.url);

const eventDirs = [
  join(repoRoot, '.agent/state/collaboration/comms'),
  join(repoRoot, '.agent/state/collaboration/comms-archive'),
];
const docRoots = [
  join(repoRoot, 'docs/architecture/architectural-decisions'),
  join(repoRoot, '.agent/practice-core/decision-records'),
  join(repoRoot, '.agent/memory/active/patterns'),
  // Governance docs — PDR-094 Invariant 3 names "a decision record, a pattern, a
  // governance doc". Rules and directives govern agent behaviour and cite events
  // as worked-instance evidence, so they are in scope (an adversarial sweep found
  // three such citations that the ADR-199 §4 "ADRs/PDRs/patterns" wording missed;
  // ADR-199's scan-scope wording is amended to match in WS7 Phase 3).
  join(repoRoot, '.agent/rules'),
  join(repoRoot, '.agent/directives'),
];
const digestPath = join(repoRoot, '.agent/reference/comms-cited-events.md');

const io = createNodeProvenanceScanIo();

// Completeness check: the candidate set is every known event, so a cited event
// the digest does not cover is reported regardless of any specific move-set.
const candidateEventIds = new Set<string>();
for (const dir of eventDirs) {
  const listed = io.listEventFilenames(dir);
  if (listed.ok) {
    for (const id of collectKnownEventIds(listed.value)) {
      candidateEventIds.add(id);
    }
  }
}

const result = runProvenanceCheck({ eventDirs, docRoots, digestPath, candidateEventIds }, io);

if (!result.ok) {
  writeErrorLine(`comms-provenance-check: FAILED — ${result.error.kind}: ${result.error.cause}`);
  process.exitCode = 1;
} else {
  const report = result.value;
  writeLine(
    `comms-provenance-check: ${String(report.knownCount)} known events; ${String(report.citedEventIds.length)} cited in permanent docs; ${String(report.coveredEventIds.length)} covered by digest`,
  );
  if (report.violations.length > 0) {
    writeErrorLine(
      `comms-provenance-check: ${String(report.violations.length)} cited event(s) NOT covered by the digest — provenance would not survive rotation:`,
    );
    for (const id of report.violations) {
      writeErrorLine(`  - ${id}`);
    }
    process.exitCode = 1;
  } else {
    writeLine('comms-provenance-check: OK — every cited event is covered by the digest.');
  }
}
