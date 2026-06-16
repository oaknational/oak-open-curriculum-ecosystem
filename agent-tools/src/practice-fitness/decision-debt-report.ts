/**
 * Renders the decision-debt report — a *separate category* in the fitness
 * report, distinct from the content-size per-file detail. It shows each
 * concept-counted buffer's live count, zone, and per-status breakdown; surfaces
 * a schema failure when a designated file is misconfigured; and, when any buffer
 * is hard/critical, prompts the PDR-067/PDR-068 pipeline triage. The cure framing
 * is decision-debt's own (decide and diagnose the pipeline), never the size
 * cure (trim/split/raise-limit).
 */

import { zoneGlyph } from './format.js';
import type { DecisionDebtResult } from './decision-debt.js';
import { ZONE_RANK } from './model.js';

export interface DecisionDebtReading {
  readonly filename: string;
  readonly result: DecisionDebtResult;
  readonly configFinding: string | null;
}

const INVERSION_GUARD =
  '  Decision-debt falls only by deciding (graduate/reject with provenance) — never by\n' +
  '  deleting or annotating an undecided item, and never by raising the limit.';

const TRIAGE = [
  '  Hard/critical means the producer is outrunning the consumer. Diagnose the pipeline',
  '  (PDR-067/PDR-068) — never trim or raise the limit:',
  '    - Consumer cadence: is graduation only firing at deep consolidations? Run the',
  '      lightweight trigger-scan any session.',
  '    - Unscannable triggers: are entries gated on conditions nothing re-checks?',
  '    - Doctrine-drafting in the buffer: are entries growing into the artefact they',
  '      should already have become?',
  '    - Over-eager capture: should ripe candidates graduate now, and unstable ones live',
  '      in distilled-memory instead of the register?',
].join('\n');

function summariseFindings(findings: DecisionDebtResult['findings']): string[] {
  if (findings.length === 0) {
    return [];
  }
  const counts = new Map<string, number>();
  for (const finding of findings) {
    counts.set(finding.kind, (counts.get(finding.kind) ?? 0) + 1);
  }
  const summary = [...counts].map(([kind, count]) => `${count} ${kind}`).join(', ');
  const noun = findings.length === 1 ? 'entry' : 'entries';
  const lines = [`    \x1b[31m⚠ ${findings.length} non-conformant ${noun}:\x1b[0m ${summary}`];

  // One representative example per kind — the full list is the migration worklist
  // (run the conformance validator), not the report's job to enumerate.
  const shown = new Set<string>();
  for (const finding of findings) {
    if (!shown.has(finding.kind)) {
      shown.add(finding.kind);
      lines.push(`      e.g. ${finding.kind}: ${finding.detail}`);
    }
  }
  return lines;
}

function formatReadingLines(reading: DecisionDebtReading): string[] {
  const { filename, result, configFinding } = reading;
  const { pending, due, overdue } = result.byStatus;
  const lines = [
    `  ${filename}  ${zoneGlyph(result.zone)}`,
    `    Live decision-debt: ${result.count}`,
    `    By status: pending ${pending}, due ${due}, overdue ${overdue}`,
  ];
  if (configFinding != null) {
    lines.push(`    \x1b[35m🚨 schema failure:\x1b[0m ${configFinding}`);
  }
  lines.push(...summariseFindings(result.findings));
  return lines;
}

function hasBackPressure(readings: readonly DecisionDebtReading[]): boolean {
  return readings.some(
    (reading) => reading.result.zone != null && ZONE_RANK[reading.result.zone] >= ZONE_RANK.hard,
  );
}

/**
 * Render the decision-debt section, or the empty string when no file is
 * concept-counted (the section is then omitted entirely).
 */
export function formatDecisionDebtSection(readings: readonly DecisionDebtReading[]): string {
  if (readings.length === 0) {
    return '';
  }

  const lines = [
    '\x1b[36mDecision-debt — concept-counted buffers (flow-rate, not size):\x1b[0m',
    '',
  ];
  for (const reading of readings) {
    lines.push(...formatReadingLines(reading), '');
  }
  lines.push(INVERSION_GUARD);
  if (hasBackPressure(readings)) {
    lines.push('', TRIAGE);
  }
  return lines.join('\n');
}
