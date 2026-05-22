/**
 * Teacher-oriented guidance for EEF evidence corpus responses.
 *
 * Provides the constant guidance text included in EEF evidence-corpus tool
 * descriptions and the gate-1a `eef-evidence-grounded-lesson-plan` prompt
 * (and gate-1b's recommend/explain/compare tools + second prompt). Helps
 * AI agents frame EEF Toolkit evidence responsibly when assembling
 * teacher-facing output.
 *
 * @remarks
 * This constant aggregates the two R-prescriptions from
 * `.agent/plans/sector-engagement/eef/future/evidence-integration-strategy.md`
 * that are genuinely prose-shaped:
 *
 * - R1 (strategy doc §"R1: Epistemic Honesty at the Response Level") —
 *   every recommendation or citation must surface its evidence strength
 *   alongside its impact estimate, name the population-average caveat, and
 *   name implementation quality as the strongest moderator of actual impact.
 *
 * - R7 (strategy doc §"R7: Professional Judgement Framing") —
 *   results must be framed as decision-support for teachers, not as
 *   automatic policy that replaces professional judgement.
 *
 * R3 (disadvantage-gap priority) is enforced structurally in the
 * scoring engine (`t5-scoring-engine` PP-weighting); R8 (partial coverage
 * honesty) is enforced structurally in the response envelope's
 * `data_coverage` field. Neither belongs in prose-form guidance — surfacing
 * them as instructions would duplicate a structural commitment as
 * advisory text, which is the anti-pattern the structural citation envelope
 * (`citation-shape.ts`) exists to prevent.
 *
 * @see ../../../../../../.agent/plans/sector-engagement/eef/future/evidence-integration-strategy.md
 */

/**
 * Aggregated guidance for how AI agents should frame EEF Toolkit evidence
 * when assembling teacher-facing output.
 *
 * Append this to tool descriptions or splice into prompt assembly to keep
 * the epistemic-honesty and professional-judgement framing consistent
 * across every EEF surface (gate-1a `eef-explore-evidence-for-context`
 * tool and `eef-evidence-grounded-lesson-plan` prompt; gate-1b
 * recommend/explain/compare tools and `eef-pupil-premium-strategy-review`
 * prompt).
 *
 * @example
 * ```typescript
 * description: `Tool summary.\n\n${AGGREGATED_EEF_EVIDENCE_GUIDANCE}\n\nUse this when...`
 * ```
 */
export const AGGREGATED_EEF_EVIDENCE_GUIDANCE = `How to frame EEF Toolkit evidence:
- Surface the evidence strength rating alongside every impact estimate — the months-of-additional-progress figure on its own is not sufficient
- Name the population-average caveat explicitly: the impact estimate describes the average effect under research conditions, not a guaranteed outcome for any particular classroom
- Name implementation quality as the strongest moderator of actual impact — a high-impact approach delivered poorly underperforms a moderate approach delivered well
- Frame results as decision-support, not automatic policy: these are "best bets" based on research evidence that should inform, not replace, the teacher's professional judgement
- Preserve every caveat verbatim from the source citations through any teacher-facing output; caveats are part of the evidence, not optional decoration` as const;
