import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';

/**
 * The committed transcript of `refound-plant-orphan` (F1 §9): the proof
 * outcome shape, its rendering to `proofs/orphan-discrimination.v1.md`, and
 * the strict re-parse the zero-orphan acceptance gate verifies CONTENT with
 * — a transcript is trusted for what it provably records, never for merely
 * existing (`validators-must-recompute`). Pure — the plant texts and
 * selection logic live in `refound-plant-orphan-model.ts`; the
 * orchestration in `refound-plant-orphan-runner.ts`.
 *
 * @packageDocumentation
 */

/** Discrimination-proof transcript path relative to the artefact home. */
export const DISCRIMINATION_PROOF_SEGMENT = 'proofs/orphan-discrimination.v1.md';

const nonEmptyString = z.string().min(1);

/** What the three discrimination proofs measured (all detectors fired). */
const plantOrphanOutcomeSchema = z.strictObject({
  preamble: z.strictObject({
    file: nonEmptyString,
    lineStart: z.number().int().positive(),
    lineEnd: z.number().int().positive(),
    reasons: z.array(nonEmptyString).min(1),
  }),
  keyword: z.strictObject({
    file: nonEmptyString,
    plantedLine: z.number().int().positive(),
    misspeltInInventory: z.boolean(),
    misspeltInResidueBlock: z.boolean(),
    controlNets: z.array(nonEmptyString).min(1),
    netCShift: z.number().int(),
  }),
  sweep: z.strictObject({
    file: nonEmptyString,
    plantedLine: z.number().int().positive(),
    plantPresentInCopy: z.boolean(),
    sweepHitsForPlant: z.number().int().nonnegative(),
    sweepHitsForControl: z.number().int().nonnegative(),
  }),
});
export type PlantOrphanOutcome = z.infer<typeof plantOrphanOutcomeSchema>;

/**
 * The every-detector-fired invariants a committed outcome must satisfy —
 * recomputed from the machine record at every gate read, so a hand-edited
 * or truncated transcript cannot pass as a proof. (The plants themselves
 * cannot be re-run at gate time; what IS checkable is that the recorded
 * outcome states the discriminations the proof exists to make.)
 */
function checkOutcomeInvariants(outcome: PlantOrphanOutcome): Result<PlantOrphanOutcome, Error> {
  const checks: readonly (readonly [boolean, string])[] = [
    [
      outcome.keyword.misspeltInInventory,
      'the misspelt plant appears in inventory (nets almost-matched)',
    ],
    [
      !outcome.keyword.misspeltInResidueBlock,
      'the misspelt plant is not recorded in a residue block',
    ],
    [
      outcome.keyword.netCShift !== 1,
      `the control shifted Net C by ${String(outcome.keyword.netCShift)}, not 1`,
    ],
    [
      outcome.keyword.controlNets.join(',') !== 'C',
      `the control was captured by nets [${outcome.keyword.controlNets.join(', ')}], ` +
        'not by Net C alone',
    ],
    [
      !outcome.sweep.plantPresentInCopy,
      'the sweep plant is not recorded as present in the staged copy',
    ],
    [
      outcome.sweep.sweepHitsForPlant !== 0,
      'the marker-free sweep plant was hit (it must be net-invisible)',
    ],
    [
      outcome.sweep.sweepHitsForControl < 1,
      'the sweep control never hit (the scanner was not proven live)',
    ],
  ];
  const violations = checks.filter(([violated]) => violated).map(([, message]) => message);
  if (violations.length > 0) {
    return err(new Error(`discrimination-proof invariants unsatisfied: ${violations.join('; ')}`));
  }
  return ok(outcome);
}

/**
 * Parse a committed transcript's machine-readable outcome and recompute the
 * every-detector-fired invariants: the strict verdict the zero-orphan
 * acceptance gate trusts instead of file existence. Refusals name the
 * defect (no machine block, invalid JSON, schema violation, or an invariant
 * a genuine proof run could not have recorded).
 */
export function parseDiscriminationTranscript(text: string): Result<PlantOrphanOutcome, Error> {
  const machineBlock = /```json\r?\n([\s\S]*?)\r?\n```/.exec(text)?.[1];
  if (machineBlock === undefined) {
    return err(new Error('transcript carries no machine-readable outcome block (```json fenced)'));
  }
  let document: unknown;
  try {
    document = JSON.parse(machineBlock);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`transcript outcome block is not valid JSON: ${message}`));
  }
  const outcome = parseWithSchema({
    label: 'discrimination-proof outcome',
    schema: plantOrphanOutcomeSchema,
    value: document,
  });
  if (!outcome.ok) {
    return outcome;
  }
  return checkOutcomeInvariants(outcome.value);
}

/**
 * Render the committed transcript for
 * `proofs/orphan-discrimination.v1.md`: a human narrative plus a fenced
 * machine-readable JSON block. Deliberately timestamp-free — the transcript
 * is a pure function of the proof outcome, so double runs are
 * byte-identical (the determinism contract).
 */
export function buildDiscriminationTranscript(outcome: PlantOrphanOutcome): string {
  const machine = JSON.stringify(outcome, null, 2);
  return [
    '# Orphan-discrimination proof (v1)',
    '',
    'Planted-defect discrimination proofs for the refounding nets (F1 §9 plus the',
    'plan-todo plant set). Every plant ran on a STAGED SCRATCH COPY; the frozen',
    'tree was never touched. A zero-orphan residue result is acceptable only',
    'alongside this transcript, and the proof re-runs after ANY net or bound',
    'change.',
    '',
    '## Plant 1 — anchorless work-bearing preamble',
    '',
    `Planted 30 net-invisible work-bearing lines at the top of \`${outcome.preamble.file}\`.`,
    `Residue gained EXACTLY ONE orphan candidate at lines ` +
      `${String(outcome.preamble.lineStart)}-${String(outcome.preamble.lineEnd)} ` +
      `(reasons: ${outcome.preamble.reasons.join(', ')}); every other file's candidates`,
    'were unchanged.',
    '',
    '## Plant 2 — misspelt Net-C keyword work line',
    '',
    `Planted one work line with a misspelt keyword at line ` +
      `${String(outcome.keyword.plantedLine)} of \`${outcome.keyword.file}\`. It appeared in`,
    'residue, NOT in inventory, and the correctly-spelt control shifted the per-net',
    `diff by exactly one, in Net C alone (nets: ${outcome.keyword.controlNets.join(', ')}) —`,
    'the nets do not silently almost-match.',
    '',
    '## Plant 3 — marker-free sweep paraphrase (honest blindness)',
    '',
    `Planted a MARKER-FREE work-bearing paraphrase at line ` +
      `${String(outcome.sweep.plantedLine)} of a staged copy of \`${outcome.sweep.file}\`.`,
    'The sweep net returned ZERO hits for it while the plant was verifiably present',
    `in the copy, and a marker-bearing control line planted in the SAME copy hit ` +
      `${String(outcome.sweep.sweepHitsForControl)} time(s) in the SAME scan — the scanner`,
    'was live, and the sweep net ALONE still cannot see marker-free work. This is',
    'the honest residue signal the G1 item-6 reader-sample cure exists for; it is a',
    'blindness DISCLOSURE, not a pass.',
    '',
    '## Machine-readable outcome',
    '',
    '```json',
    machine,
    '```',
    '',
  ].join('\n');
}
