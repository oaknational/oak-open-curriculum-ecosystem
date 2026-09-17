/*
 * The fidelity disposition register: every diff the review surfaces gets a
 * recorded JUDGMENT here — fix, deliberate, investigate, matched, or
 * superseded — so a divergence is either being acted on or is a documented
 * decision, never silence. The tracked data lives in fidelity-register.json
 * (owner-editable); this module owns its schema and the boundary parse
 * (zod-at-the-boundary; Result out, never a throw).
 *
 * This register is the first realisation of the "divergence register" the
 * productionisation plan's WS2 stage 2 reads to avoid re-flagging ratified
 * divergences on future export re-ingests.
 */
import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { describeThrown } from './support';

/** Reserved `pairId` scope for judgments that apply to EVERY pair (e.g. a
 *  token-source migration shifting values across all captures). The report
 *  renders these in their own section; they are never orphan candidates. */
export const GLOBAL_PAIR_ID = 'global';

const DispositionSchema = z.enum(['fix', 'deliberate', 'investigate', 'matched', 'superseded']);

const FindingKindSchema = z.enum(['visual', 'feature', 'content', 'token']);

const RegisterEntrySchema = z
  .strictObject({
    /** `<pairId>/<finding-slug>` — stable across export refreshes. */
    id: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
    /** The pairing-map pair this finding was observed on, or the reserved
     *  {@link GLOBAL_PAIR_ID} scope for findings that apply to every pair. */
    pairId: z.string().regex(/^[a-z0-9-]+$/),
    kind: FindingKindSchema,
    summary: z.string().min(1),
    /** Demo-dir-relative evidence paths (captures, diffs, source files). */
    evidence: z.array(z.string().min(1)).min(1),
    disposition: DispositionSchema,
    rationale: z.string().min(1),
    /** A role handle (e.g. "director-9") — never a personal name or email. */
    author: z.string().min(1),
    /** A real ISO calendar date — 2026-99-99 is a typo, not a record. */
    date: z.iso.date(),
  })
  .refine((entry) => entry.id.startsWith(`${entry.pairId}/`), {
    message: 'entry id must be prefixed by its pairId',
  });

// strictObject, not object: this is an owner-edited JSON boundary, and a
// typo'd field name must be rejected loudly, never silently stripped from
// the machine-read register (strict-validation-at-boundary).
const RegisterSchema = z.strictObject({
  version: z.literal(1),
  entries: z.array(RegisterEntrySchema),
});

export type RegisterEntry = z.infer<typeof RegisterEntrySchema>;
export type FidelityRegister = z.infer<typeof RegisterSchema>;

/** Parse the raw register JSON at the boundary. Failure carries a readable
 *  line naming the register so the orchestrator's stderr is actionable. */
export function parseRegister(json: string): Result<FidelityRegister, string> {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (error: unknown) {
    return err(`fidelity-register: invalid JSON — ${describeThrown(error)}`);
  }
  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return err(`fidelity-register: schema violation — ${parsed.error.message}`);
  }
  return ok(parsed.data);
}

/** The register entries recorded against one pairing-map pair. */
export function entriesForPair(
  register: FidelityRegister,
  pairId: string,
): readonly RegisterEntry[] {
  return register.entries.filter((entry) => entry.pairId === pairId);
}

/** A schema-valid skeleton for a new finding on `pairId` — the report prints
 *  it as the copy-ready starting point for a human/agent judgment. */
export function newEntryTemplate(pairId: string, date: string): RegisterEntry {
  return {
    id: `${pairId}/describe-the-finding`,
    pairId,
    kind: 'visual',
    summary: 'Describe what differs between the export and the live app.',
    evidence: [`demo-evidence/fidelity-report/diff-${pairId}.png`],
    disposition: 'investigate',
    rationale: 'Why this disposition — cite the export, a ratified decision, or the open question.',
    author: 'role-handle',
    date,
  };
}
