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
 *   axis and no frontmatter execution state — when the operator's
 *   tracker holds the work, execution state lives there via the
 *   optional `tickets` edge; it never lives here.
 * - `status` carries ratification state ONLY
 *   (`sketch | ratified | archived | superseded`): every plan is born
 *   `sketch` and governs no work until its stamp
 *   (`ratified_by` + `ratified_date` + `ratified_where`) is complete.
 * - Closed shapes throughout: the key set is strict and every enum is
 *   closed — new members arrive by reviewed, additive change.
 *
 * Cross-FILE rules (serves resolution, `impact_areas` registry
 * membership, `depends_on` resolution, and corpus non-emptiness)
 * compose in the corpus helpers — this module owns single-file shape
 * only. `tickets` is optional visibility metadata at every level:
 * plan validity is repo-internal (owner ruling 2026-08-07 — a repo
 * obligation must never depend on records in an external service).
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

const kebabSlug = z.string().regex(KEBAB_SLUG, 'expected a kebab-case slug');
const isoDate = z.string().regex(ISO_DATE, 'expected an ISO date (YYYY-MM-DD)');
const nonEmpty = z.string().min(1);

/** A stamp field: a value once given, `null` while the plan is a sketch. */
const stampText = nonEmpty.nullable();
const stampDate = isoDate.nullable();

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
  superseded_by: kebabSlug.optional(),
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
  readonly [field: 'serves', present: boolean, message: string][]
> = {
  strategic: [['serves', true, 'strategic nodes require serves (a published strategic-choice ID)']],
  delivery: [['serves', true, 'delivery plans require serves (a strategic node id)']],
  runbook: [],
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
