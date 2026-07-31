#!/usr/bin/env node

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { loadCorpus } from './plan-corpus-loading.js';
import { detectGateExpiryDrift, formatGateExpiryAlert } from './plan-gate-drift.js';

/**
 * Persistent, NON-BLOCKING gate-expiry drift alert over the plan
 * corpus (`.agent/plans/plan-node-schema.md` §"Owner gates — expiring,
 * never open-ended").
 *
 * Owner ruling 2026-07-31: drift alerts, persistently, with clear
 * resolution instructions — it never blocks. This bin is therefore
 * wired into NO blocking aggregate (not `repo-validators:check`, not
 * pre-commit, not pre-push): its consumers are the session-open alert
 * hook and direct invocation (`pnpm plan-gates:check`). The exit code
 * stays in-band for those composers — 1 when drift or unparseable
 * files exist, 0 when the corpus is drift-free — and the persistence
 * (the alert repeats every run until the gate rows change) is the
 * anti-toleration mechanism.
 *
 * The clock read below is the instrument's own: an alert about the
 * calendar is honestly time-dependent, unlike the conformance
 * validator, which stays a deterministic function of repo content.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

async function main(): Promise<number> {
  const { fileFailures, parsed } = await loadCorpus(repoRoot);
  // UTC calendar date — the single quarantined clock read for drift.
  const todayIso = new Date().toISOString().slice(0, 10);
  const alert = formatGateExpiryAlert(detectGateExpiryDrift(parsed, todayIso), todayIso);
  for (const line of alert) {
    writeLine(line);
  }
  if (fileFailures.length > 0) {
    writeErrorLine(
      `check-plan-gate-drift: ${String(fileFailures.length)} plan file(s) could not be parsed, ` +
        'so their gates cannot be checked — run validate-plan-corpus for the conformance detail.',
    );
    return 1;
  }
  if (alert.length > 0) {
    return 1;
  }
  writeLine(
    `check-plan-gate-drift: no expired owner gates on live plans (as of ${todayIso}; ${String(parsed.length)} plan file(s) checked).`,
  );
  return 0;
}

process.exitCode = await main();
