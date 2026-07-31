/**
 * Zod transcription of the planning-estate plan-node contract.
 *
 * @remarks
 * Transcribes `.agent/plans/plan-node-schema.md` (the structure
 * owner-ratified at planning-sitting part 1, 2026-07-22 — decisions
 * register D23). Authored as a redo of the prior V0 module, not an
 * edit of it (D23: the corpus is replaced by redoing its creation).
 * Design bindings, all from the ratified contract:
 *
 * - Three node types (`strategic | delivery | runbook`); no `kind`
 *   axis and no frontmatter execution state — execution lives in
 *   Linear via the `tickets` edge, never here.
 * - `status` carries ratification state ONLY
 *   (`sketch | ratified | archived | superseded`): every plan is born
 *   `sketch` and governs no work until its stamp
 *   (`ratified_by` + `ratified_date` + `ratified_where`) is complete.
 * - Closed shapes throughout: the key set is strict and every enum is
 *   closed — new members arrive by reviewed, additive change.
 * - Owner gates always carry an absolute `expires` (no open-ended
 *   holding states); the default horizon is strategy-scoped data
 *   (`gate_expiry_default` on strategic nodes), never a schema
 *   constant.
 *
 * Cross-FILE rules (serves resolution, `impact_areas` registry
 * membership, `depends_on` resolution, corpus non-emptiness, and the
 * execution-anchor consistency rule in `plan-execution-anchors.ts`)
 * compose in the corpus helpers — this module owns single-file shape
 * only.
 * The ticket requirement in particular is corpus-level by necessity:
 * it binds only within anchored subtrees, which is a `serves`-edge
 * question no single-file refinement can answer (dated amendment
 * 2026-07-31; ADR-221 lens 4).
 *
 * @packageDocumentation
 */

import { z } from 'zod';

/** Stable kebab-case slug (`id`, `serves` node refs, `superseded_by`). */
const KEBAB_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** ISO calendar date, the only date form the contract admits. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** A Linear ticket reference, e.g. `MCP-101`. */
const TICKET_ID = /^[A-Z][A-Z0-9]*-\d+$/;

/**
 * Day-scale ISO-8601 duration, e.g. `P3D`, `P21D`. Deliberately narrow
 * (closed-additive): gate horizons are day-scale by design; finer or
 * coarser grammars arrive by reviewed change when a real tempo needs
 * one — never speculatively (also keeps the pattern simple, S5843).
 */
const DAY_SCALE_DURATION = /^P\d+D$/;

const kebabSlug = z.string().regex(KEBAB_SLUG, 'expected a kebab-case slug');
const isoDate = z.string().regex(ISO_DATE, 'expected an ISO date (YYYY-MM-DD)');
const nonEmpty = z.string().min(1);

/** A stamp field: a value once given, `null` while the plan is a sketch. */
const stampText = nonEmpty.nullable();
const stampDate = isoDate.nullable();

/** An expiring owner gate — never an open holding state. */
const ownerGateSchema = z.strictObject({
  awaiting: z.enum(['owner-decision', 'external-input']),
  clears_when: nonEmpty,
  expires: isoDate.describe('expires: an absolute date is mandatory on every gate'),
});

/** A `depends_on` edge entry, typed on the edge. */
const dependsOnSchema = z.strictObject({
  plan: kebabSlug,
  kind: z.enum(['blocking', 'beneficial']),
});

/** The field contract before cross-field refinement. Closed key set. */
const basePlanNodeSchema = z.strictObject({
  id: kebabSlug,
  node_type: z.enum(['strategic', 'delivery', 'runbook']),
  name: nonEmpty,
  overview: nonEmpty,
  status: z.enum(['sketch', 'ratified', 'superseded', 'archived']),
  ratified_by: stampText.optional(),
  ratified_date: stampDate.optional(),
  ratified_where: stampText.optional(),
  serves: nonEmpty.optional(),
  impact_areas: z.array(kebabSlug).min(1, 'every plan declares at least one impact area'),
  tickets: z
    .array(z.string().regex(TICKET_ID, 'expected a ticket reference like MCP-101'))
    .optional(),
  depends_on: z.array(dependsOnSchema).optional(),
  owner_gates: z.array(ownerGateSchema).optional(),
  superseded_by: kebabSlug.optional(),
  gate_expiry_default: z
    .string()
    .regex(DAY_SCALE_DURATION, 'expected a day-scale ISO-8601 duration (e.g. P3D)')
    .optional(),
  last_updated: isoDate,
});

/** The parsed base shape the cross-field refinements operate on. */
type BasePlanNode = z.output<typeof basePlanNodeSchema>;

/** The three stamp fields, checked together at ratification. */
const STAMP_FIELDS = ['ratified_by', 'ratified_date', 'ratified_where'] as const;

/** Ratified means the stamp is complete — executed is not ratified. */
function refineStampCompleteness(value: BasePlanNode, ctx: z.RefinementCtx): void {
  if (value.status !== 'ratified') {
    return;
  }
  for (const field of STAMP_FIELDS) {
    const present = value[field] !== undefined && value[field] !== null;
    if (!present) {
      ctx.addIssue({
        code: 'custom',
        path: [field],
        message: `status 'ratified' requires a complete stamp: '${field}' must be set`,
      });
    }
  }
}

/** No plan leaves the estate without naming its successor. */
function refineSupersededCoupling(value: BasePlanNode, ctx: z.RefinementCtx): void {
  if (value.status === 'superseded' && value.superseded_by === undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['superseded_by'],
      message: "status 'superseded' requires a superseded_by successor",
    });
  }
}

/** The per-type requirement matrix: [field, mustBePresent, message]. */
const TYPE_RULES: Record<
  BasePlanNode['node_type'],
  readonly [field: 'serves' | 'gate_expiry_default', present: boolean, message: string][]
> = {
  strategic: [
    ['serves', true, 'strategic nodes require serves (a published strategic-choice ID)'],
    [
      'gate_expiry_default',
      true,
      'strategic nodes require gate_expiry_default (the subtree tempo)',
    ],
  ],
  delivery: [
    ['serves', true, 'delivery plans require serves (a strategic node id)'],
    [
      'gate_expiry_default',
      false,
      'gate_expiry_default is strategy-scoped data: forbidden on delivery plans',
    ],
  ],
  runbook: [
    [
      'gate_expiry_default',
      false,
      'gate_expiry_default is strategy-scoped data: forbidden on runbooks',
    ],
  ],
};

/** Per-type dispatch over the requirement matrix. */
function refineTypeDispatch(value: BasePlanNode, ctx: z.RefinementCtx): void {
  for (const [field, mustBePresent, message] of TYPE_RULES[value.node_type]) {
    const present = value[field] !== undefined;
    if (present !== mustBePresent) {
      ctx.addIssue({ code: 'custom', path: [field], message });
    }
  }
}

/**
 * The plan-node frontmatter contract: the strict base field contract
 * plus the cross-field rules (stamp completeness, superseded coupling,
 * per-type dispatch).
 */
export const planNodeSchema = basePlanNodeSchema.superRefine((value, ctx) => {
  refineStampCompleteness(value, ctx);
  refineSupersededCoupling(value, ctx);
  refineTypeDispatch(value, ctx);
});

/** The parsed, validated plan-node frontmatter. */
export type PlanNode = z.infer<typeof planNodeSchema>;
