/**
 * Pure classification of an axe run's contrast evidence (the F15 cure).
 * axe-core 4.12.1 withholds some MEASURED failures from `violations`:
 * an exact 1:1 ratio usually means intentionally hidden text, so it is
 * filed under `incomplete` with messageKey `equalRatio` — which is how
 * invisible masthead text passed CI as "no WCAG 2.2 AA violations".
 * The split that matters lives in the check DATA, not the buckets:
 * `contrastRatio > 0` means axe resolved both colours and measured,
 * and a measured ratio below the rule's own expectation is a WCAG
 * 1.4.3 failure wherever axe filed it. Ratio 0 is axe's not-measured
 * sentinel (a real contrast ratio is never below 1); those nodes stay
 * unmeasured and are bounded by a named reason set so a novel reason
 * class fails loudly instead of joining the noise. Pure data in, plain
 * projections out — testable without the browser import chain.
 */
import type { AxeBuilder } from '@axe-core/playwright';
import { z } from 'zod';

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type AxeRuleResult = AxeResults['incomplete'][number];
type AxeNodeResult = AxeRuleResult['nodes'][number];

/** The one axe rule whose incomplete bucket carries measured evidence. */
const CONTRAST_RULE = 'color-contrast';

/**
 * Unmeasured-reason classes adjudicated 2026-08-13 (first-hand census
 * of the built artefact, bundle-2 pre-execution review; each entry
 * carries its evidence — extending this set requires the same):
 * - `bgGradient` — axe cannot resolve a background through a gradient
 *   (the kit's `--surface-page-image` and creature's tone bands).
 *   Gradient-backed text is therefore NOT machine-verified for 1.4.3;
 *   that coverage hole is a named ledger finding, not a tolerance.
 * - `shortTextContent` — axe withholds single-character nodes out of
 *   caution; when it also measured a ratio, the measured branch above
 *   still judges it.
 * - `elmPartiallyObscured` — axe declines paint attribution for
 *   elements partly clipped by their own overflow container. Observed
 *   at the 320px reflow cells: data-table columns inside the table's
 *   overflow-x scroller — the reflow idiom the suite itself mandates —
 *   while the SAME token pairing is measured on the unobscured columns
 *   of the same table in the same run.
 * Any reason outside this set fails loudly for fresh adjudication.
 */
export const ADJUDICATED_UNMEASURED_CONTRAST: ReadonlySet<string> = new Set([
  'bgGradient',
  'shortTextContent',
  'elmPartiallyObscured',
]);

/** The check-data SHAPES axe attaches to color-contrast results — the
 *  vendor has several, not one: measured nodes carry contrastRatio +
 *  expectedContrastRatio, while some early-return reasons carry a
 *  messageKey with one or neither measurement field (nonBmp and
 *  complexTextShadows carry only the key; pseudoContent carries the
 *  key + expected but no ratio — verified against the 4.12.1 source,
 *  gateway review). Every field is therefore optional and the refine
 *  requires at least one marker, so a named reason always SURVIVES to
 *  the fence instead of collapsing to no-check-data. Not a documented
 *  public contract — re-validate on any axe upgrade. */
const contrastCheckData = z
  .object({
    contrastRatio: z.number().optional(),
    expectedContrastRatio: z.string().optional(),
    messageKey: z.string().optional(),
  })
  .refine((data) => data.contrastRatio !== undefined || data.messageKey !== undefined);
type ContrastCheckData = z.infer<typeof contrastCheckData>;

/** The measurement, iff axe actually measured: a positive ratio (0 is
 *  the vendor's not-measured sentinel — a real contrast ratio is never
 *  below 1) paired with the rule's own expectation, e.g. "4.5:1".
 *  Every node lands in exactly one seam: nodes with evidence are
 *  judged by measuredContrastFailures, all others by the reason
 *  fence. */
function measuredEvidence(
  data: ContrastCheckData | null,
): { readonly ratio: number; readonly required: number } | null {
  if (
    data === null ||
    data.contrastRatio === undefined ||
    data.contrastRatio <= 0 ||
    data.expectedContrastRatio === undefined
  ) {
    return null;
  }
  return { ratio: data.contrastRatio, required: Number.parseFloat(data.expectedContrastRatio) };
}

export interface MeasuredContrastFailure {
  readonly target: string;
  readonly ratio: number;
  readonly required: number;
  readonly bucket: 'violations' | 'incomplete';
}

export interface UnmeasuredContrastNode {
  readonly target: string;
  readonly reason: string;
}

export interface IncompleteRuleSummary {
  readonly id: string;
  readonly impact: string;
  readonly targets: readonly string[];
}

function nodeTarget(node: AxeNodeResult): string {
  return node.target.map(String).join(' ');
}

/** First check on the node carrying contrast data. Only `any` is
 *  scanned: axe-core 4.12.1 declares color-contrast with empty `all`
 *  and `none` check lists, and this function is only reached for that
 *  rule. If a future axe moves the check, the node surfaces as
 *  no-check-data through the loud fence — fails safe, never silent. */
function contrastData(node: AxeNodeResult): ContrastCheckData | null {
  for (const check of node.any) {
    const parsed = contrastCheckData.safeParse(check.data);
    if (parsed.success) {
      return parsed.data;
    }
  }
  return null;
}

function contrastRules(
  results: Pick<AxeResults, 'violations' | 'incomplete'>,
): { rule: AxeRuleResult; bucket: MeasuredContrastFailure['bucket'] }[] {
  return [
    ...results.violations
      .filter((r) => r.id === CONTRAST_RULE)
      .map((rule) => ({
        rule,
        bucket: 'violations' as const,
      })),
    ...results.incomplete
      .filter((r) => r.id === CONTRAST_RULE)
      .map((rule) => ({
        rule,
        bucket: 'incomplete' as const,
      })),
  ];
}

/** Every contrast node axe MEASURED (both colours resolved) whose ratio
 *  fails the rule's own expectation — union of both buckets, so a
 *  withheld 1:1 counts exactly like a filed violation. */
export function measuredContrastFailures(
  results: Pick<AxeResults, 'violations' | 'incomplete'>,
): MeasuredContrastFailure[] {
  const failures: MeasuredContrastFailure[] = [];
  for (const { rule, bucket } of contrastRules(results)) {
    for (const node of rule.nodes) {
      const evidence = measuredEvidence(contrastData(node));
      if (evidence !== null && evidence.ratio < evidence.required) {
        failures.push({
          target: nodeTarget(node),
          ratio: evidence.ratio,
          required: evidence.required,
          bucket,
        });
      }
    }
  }
  return failures;
}

/** Incomplete contrast nodes axe did NOT measure whose stated reason
 *  falls outside the adjudicated set — a novel reason class must be
 *  adjudicated, never silently absorbed. */
export function novelUnmeasuredContrast(
  results: Pick<AxeResults, 'incomplete'>,
  adjudicated: ReadonlySet<string>,
): UnmeasuredContrastNode[] {
  const novel: UnmeasuredContrastNode[] = [];
  for (const rule of results.incomplete.filter((r) => r.id === CONTRAST_RULE)) {
    for (const node of rule.nodes) {
      const data = contrastData(node);
      if (measuredEvidence(data) !== null) {
        continue; // measured — judged by measuredContrastFailures
      }
      const reason = data?.messageKey ?? 'no-check-data';
      if (!adjudicated.has(reason)) {
        novel.push({ target: nodeTarget(node), reason });
      }
    }
  }
  return novel;
}

/** Incomplete results from every rule EXCEPT color-contrast. axe files
 *  some outright failures as incomplete (the reviewOnFail rules, e.g.
 *  bypass), so an empty projection here is a real claim, not hygiene. */
export function incompleteOutsideContrast(
  results: Pick<AxeResults, 'incomplete'>,
): IncompleteRuleSummary[] {
  return results.incomplete
    .filter((rule) => rule.id !== CONTRAST_RULE)
    .map((rule) => ({
      id: rule.id,
      impact: rule.impact ?? 'unknown',
      targets: rule.nodes.map(nodeTarget),
    }));
}
