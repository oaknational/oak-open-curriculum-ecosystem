/**
 * Teacher-oriented guidance for EEF evidence corpus responses.
 *
 * Provides the constant guidance text included in EEF evidence-corpus tool
 * descriptions and the `eef-evidence-grounded-lesson-plan` prompt. Helps AI
 * agents frame EEF Toolkit evidence responsibly when assembling teacher-facing
 * output.
 *
 * @remarks
 * This constant aggregates the two R-prescriptions from
 * `.agent/plans/sector-engagement/eef/future/evidence-integration-strategy.md`
 * that are genuinely prose-shaped:
 *
 * - R1 (strategy doc §"R1: Epistemic Honesty at the Response Level") —
 *   every evidence use must surface evidence strength alongside its impact
 *   estimate, name the population-average caveat, and name implementation
 *   quality as the strongest moderator of actual impact.
 *
 * - R7 (strategy doc §"R7: Professional Judgement Framing") —
 *   results must be framed as decision-support for teachers, not as
 *   automatic policy that replaces professional judgement.
 *
 * Partial coverage honesty is teacher-facing: the teacher owns the adoption
 * decision, so weak, partial, or absent evidence must be visible rather than
 * silently converted into a selection or omission.
 *
 * @see ../../../../../../.agent/plans/sector-engagement/eef/future/evidence-integration-strategy.md
 */

/**
 * Aggregated guidance for how AI agents should frame EEF Toolkit evidence
 * when assembling teacher-facing output.
 *
 * Append this to tool descriptions or splice into prompt assembly to keep the
 * epistemic-honesty and professional-judgement framing consistent across the
 * EEF evidence-corpus surface.
 *
 * @example
 * ```typescript
 * description: `Tool summary.\n\n${AGGREGATED_EEF_EVIDENCE_GUIDANCE}\n\nUse this when...`
 * ```
 */
export const AGGREGATED_EEF_EVIDENCE_GUIDANCE = `How to frame EEF Toolkit evidence:
- Use EEF when the teacher asks for evidence context, and when you are already adapting, combining, or framing Oak material pedagogically; do not use it for curriculum retrieval alone
- Whenever you use EEF, briefly say what prompted the invocation using a flexible pattern such as "EEF because: [pedagogical choice]"
- Surface the evidence strength rating alongside every impact estimate — the months-of-additional-progress figure on its own is not sufficient
- Name the population-average caveat explicitly: the impact estimate describes the average effect under research conditions, not a guaranteed outcome for any particular classroom
- Name implementation quality as the strongest moderator of actual impact — a high-impact approach delivered poorly underperforms a moderate approach delivered well
- Frame results as decision-support, not automatic policy: these are evidence-informed considerations that should inform, not replace, the teacher's professional judgement
- Use options and trade-offs language: show what the evidence suggests, where it is limited, and what the teacher may weigh
- Make weak, partial, or absent evidence explicit whenever it occurs: the teacher is the expert, and the assistant provides options and honest limits rather than deciding what to adopt or change
- Preserve every caveat verbatim from the source citations through any teacher-facing output; caveats are part of the evidence, not optional decoration` as const;
