/**
 * Message generator for the `eef-evidence-grounded-lesson-plan` MCP prompt.
 *
 * Lives in `evidence-corpus/` (alongside `citation-shape.ts`,
 * `eef-evidence-guidance.ts`, and the rest of the EEF surface) rather
 * than in `../mcp-prompt-messages.ts` for two reasons: (1) the parent
 * generators file would exceed the workspace `max-lines: 250` ceiling
 * once a fifth multi-paragraph generator is added; (2) co-locating the
 * EEF generator with its sibling `AGGREGATED_EEF_EVIDENCE_GUIDANCE`
 * constant keeps the EEF feature surface cohesive.
 *
 * The generator is invoked by `getPromptMessages` in `../mcp-prompts.ts`
 * when the prompt name matches `eef-evidence-grounded-lesson-plan`.
 *
 * @remarks
 * The prompt body adapts the predecessor T10 design (preserved at the
 * predecessor plan location recoverable through git history; the live
 * adaptation rationale lives in the current `eef-evidence-corpus.plan.md`
 * §Phase E T10 narrative) for the 2026-05-21 gate-1a / gate-1b split:
 * where the predecessor
 * orchestrated a ranked-list response from `recommend-evidence-for-context`
 * (gate-1b), this gate-1a version orchestrates a subgraph response from
 * `eef-explore-evidence-for-context` (gate-1a, t6a). The 5-step
 * orchestration spine and the F8 / F9 / F10 resolutions from the
 * predecessor are preserved; step 2's selection criterion adapts from
 * rank-ordering to contextual-fit-from-the-subgraph because the t6a
 * response is a typed subgraph, not a sorted list.
 *
 * Key Stage to Phase mapping (F9 resolution; inline in the prompt body
 * per the predecessor's deliberate choice — the LLM does the mapping
 * using the table, which is more permissive than rejecting KS5 inputs
 * at the schema boundary):
 *
 * - EYFS → early_years
 * - KS1, KS2 → primary
 * - KS3, KS4 → secondary
 * - KS5 → secondary (EEF coverage is primarily up to age 16)
 *
 * Focus enum (F10 resolution; closed set matching `RankOptions.context.focus`):
 * `closing_disadvantage_gap`, `metacognition`, `literacy`, `numeracy`,
 * `behaviour`, `feedback`. The generator does not validate the value;
 * MCP-protocol schema validation is the boundary check.
 */

import type { PromptMessage } from '../mcp-prompt-types.js';
import { AGGREGATED_EEF_EVIDENCE_GUIDANCE } from './eef-evidence-guidance.js';

/**
 * Generates messages for the `eef-evidence-grounded-lesson-plan` prompt.
 *
 * @param args - User-provided arguments (subject, keyStage, topic; optional focus)
 * @returns Messages guiding the model through evidence-grounded lesson design
 */
export function getEefEvidenceGroundedLessonPlanMessages(
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  const subject = args.subject ?? 'the subject';
  const keyStage = args.keyStage ?? 'the key stage';
  const topic = args.topic ?? 'the topic';
  const focus = args.focus;
  const focusClause = focus === undefined ? '' : `, focus: "${focus}"`;

  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `Design an evidence-grounded lesson plan on "${topic}" in ${subject} for ${keyStage}.

${AGGREGATED_EEF_EVIDENCE_GUIDANCE}

Key Stage to Phase mapping (use this when calling tools that expect "phase"):
- EYFS → early_years
- KS1, KS2 → primary
- KS3, KS4 → secondary
- KS5 → secondary (EEF coverage is primarily up to age 16)

Please:

1. Call eef-explore-evidence-for-context to surface EEF Toolkit strands matching the lesson context:
   eef-explore-evidence-for-context({ subject: "${subject}", key_stage: "${keyStage}", topic: "${topic}"${focusClause} })
2. The response is a typed subgraph of EEF strands (not a ranked list). Select 2-3 strands whose evidence and implementation requirements fit the lesson context; use the subgraph's strand-to-strand connections as a signal for pedagogically related approaches.
3. For each selected strand, extract the implementation guidance carried on the strand's record: CPD intensity, time to embed, key staff roles involved. If a strand's implementation fields are not present in the default projection, note this honestly and proceed with the fields that are available.
4. Design a lesson plan that integrates the selected approaches, preserving every caveat verbatim from the citations alongside the approach it modifies.
5. Structure the lesson pedagogically: starter → main → practice → plenary, with a metacognitive reflection at plenary.

Return the lesson plan with the strand citations + caveats attached to each approach, and a brief summary of the evidence strength + implementation considerations for the teacher's professional judgement.`,
      },
    },
  ];
}
