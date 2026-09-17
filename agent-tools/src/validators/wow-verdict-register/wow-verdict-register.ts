/*
 * The wow-verdict register: every owner verdict on a rendered page, and the
 * design-review instrument's three-leg results beside it, so the
 * instrument's miss-rate against the owner's actual verdicts is measurable
 * (completion plan W0.7 — blocking authority is earned). Named distinctly
 * from the hub's fidelity register, whose module
 * (demos/oak-curriculum-hub/tools/fidelity-register.ts) is this schema's
 * precedent: zod at the boundary over the owner-editable JSON data at
 * docs/design/design-review/wow-verdict-register.json (REGISTER_PATH
 * below), a Result out, never a throw. Homed here on the plan-schema
 * validator precedent — the register is cross-demo, so its parser lives
 * with the estate's validators, not inside any design workspace (the
 * 2026-08-08 home ruling; see the minting record beside the data).
 *
 * Row classes (a discriminated union — the class differences are
 * structural, never refine-patched):
 * - `checkpoint` (W1.3, W1.5, W2.9, the Quality-bar checkpoints): the row
 *   was SHOWN to the owner — owner verdict + date required, and the three
 *   instrument-leg results required (plan W0.7).
 * - `pre-read` (the W0.9/W0.10 pre-reads, which run before the instrument
 *   exists): owner verdict + date required; leg results optional.
 * - `instrument-blocked`: a leg FAIL stopped the render from reaching the
 *   owner, so there IS no owner verdict — the row carries the leg results
 *   and the Director disposition (the Quality-bar rule-3 shape) instead.
 *   Owner fields are reserved for rows the owner actually saw; a blocked
 *   row inventing them must never parse.
 */
import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/** The live register's home, relative to the repo root (the plan-schema
 *  CORPUS_ROOT precedent). */
export const REGISTER_PATH = 'docs/design/design-review/wow-verdict-register.json';

const VerdictSchema = z.enum(['PASS', 'FAIL', 'ITERATE']);

/* Closed rosters (closed-shape-design-optionality): identity and theme
 * enums encode the CURRENT canonical rosters — the plan's three identities
 * and the theme runtime's five presets (read from oak-theme.js at
 * authoring). The schema is versioned; the rosters evolve with it at the
 * W0.10 taste-anchor sittings or an identity rename, never by an open
 * string absorbing typos into the coverage data. */
const IdentitySchema = z.enum(['oak', 'emc2', 'pds']);
const ThemeSchema = z.enum(['light', 'dark', 'system', 'high-contrast', 'colour-safe']);

const CellSchema = z.strictObject({
  identity: IdentitySchema,
  theme: ThemeSchema,
});

/** The rubric's seven criteria (rubric.md §Criteria), as slugs. */
const CriterionSlugSchema = z.enum([
  'type-scale',
  'spatial-rhythm',
  'hierarchy',
  'colour-discipline',
  'composition-grammar',
  'cross-page-cohesion',
  'ordered-calm-readability',
]);

/* strictObject throughout: the register JSON is owner-edited, so a silently
 * stripped unknown key (a typo'd field name) would be silent data loss —
 * strict-validation-at-boundary applies at full strength here. */
const CriterionResultSchema = z
  .strictObject({
    verdict: VerdictSchema,
    note: z.string().min(1).optional(),
  })
  .refine((criterion) => criterion.verdict === 'PASS' || criterion.note !== undefined, {
    message:
      'a non-PASS criterion verdict requires a note — per-criterion evidence is what calibrates the instrument',
  });

/** One leg's rubric evaluation: a verdict per criterion (exhaustive — the
 *  enum-keyed record refuses a partial evaluation), plus the free-form arm
 *  in `notes`. */
const LegResultSchema = z
  .strictObject({
    verdict: VerdictSchema,
    perCriterion: z.record(CriterionSlugSchema, CriterionResultSchema),
    notes: z.string().min(1).optional(),
  })
  .refine((leg) => leg.verdict === 'PASS' || leg.notes !== undefined, {
    message:
      'a FAIL or ITERATE leg verdict requires notes — the instrument earns its blocking authority through recorded evidence, so an unexplained FAIL must never parse',
  });

const InstrumentLegResultsSchema = z.strictObject({
  seat: LegResultSchema,
  accessibilityExpert: LegResultSchema,
  designSystemExpert: LegResultSchema,
});

const RealDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((date) => !Number.isNaN(Date.parse(date)), {
    message: 'dates in the register must be real calendar dates',
  });

const RowBase = {
  page: z.string().min(1),
  demo: z.string().min(1),
  qualitiesJudged: z.array(z.string().min(1)).min(1),
  cellsCovered: z.array(CellSchema).min(1),
  /** Provenance pointer: the record and event the row's words live in. */
  source: z.string().min(1),
};

const CheckpointRowSchema = z.strictObject({
  ...RowBase,
  rowClass: z.literal('checkpoint'),
  verdict: VerdictSchema,
  ownerStatementDate: RealDateSchema,
  instrumentLegResults: InstrumentLegResultsSchema,
});

const PreReadRowSchema = z.strictObject({
  ...RowBase,
  rowClass: z.literal('pre-read'),
  verdict: VerdictSchema,
  ownerStatementDate: RealDateSchema,
  instrumentLegResults: InstrumentLegResultsSchema.optional(),
});

/** The Quality-bar rule-3 disposition a blocking FAIL routes to. */
const DirectorDispositionSchema = z.strictObject({
  decision: z.enum(['blocked-upheld', 'released']),
  date: RealDateSchema,
  source: z.string().min(1),
});

const InstrumentBlockedRowSchema = z.strictObject({
  ...RowBase,
  rowClass: z.literal('instrument-blocked'),
  instrumentLegResults: InstrumentLegResultsSchema,
  directorDisposition: DirectorDispositionSchema,
});

const RegisterRowSchema = z.discriminatedUnion('rowClass', [
  CheckpointRowSchema,
  PreReadRowSchema,
  InstrumentBlockedRowSchema,
]);

const RegisterSchema = z.strictObject({
  version: z.literal(1),
  entries: z.array(RegisterRowSchema),
});

export type RegisterRow = z.infer<typeof RegisterRowSchema>;
export type WowVerdictRegister = z.infer<typeof RegisterSchema>;

function describeThrown(thrown: unknown): string {
  return thrown instanceof Error ? thrown.message : String(thrown);
}

/** Parse the raw register JSON at the boundary. Failure carries a readable
 *  line naming the register so a consumer's stderr is actionable. */
export function parseWowVerdictRegister(json: string): Result<WowVerdictRegister, string> {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (error: unknown) {
    return err(`wow-verdict-register: invalid JSON — ${describeThrown(error)}`);
  }
  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return err(`wow-verdict-register: schema violation — ${parsed.error.message}`);
  }
  return ok(parsed.data);
}

/** The register rows recorded against one demo. */
export function rowsForDemo(register: WowVerdictRegister, demo: string): readonly RegisterRow[] {
  return register.entries.filter((row) => row.demo === demo);
}
