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
 * The prompt body is a transitional evidence-corpus prompt until the graph-native
 * MCP surface lands. It may call the currently registered evidence context tool,
 * but it must not encode the old list-shaped implementation as a target
 * behaviour. The assistant uses EEF evidence as decision support and preserves
 * caveats, uncertainty, and professional judgement.
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
 * Focus enum (closed set drawn from the EEF priority vocabulary):
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
2. Treat the response as evidence context for options and trade-offs. Use only the evidence needed for that context, preserve relationships that matter, and do not force a fixed number of strands or one correct answer.
3. For each evidence item you use, preserve the implementation guidance and caveats that are present. If the transitional response lacks an evidence field needed for teacher judgement, state that limitation honestly rather than filling the gap.
4. Design a lesson plan that integrates the evidence-informed options and trade-offs, preserving every caveat verbatim from the citations alongside the approach it modifies.
5. Structure the lesson pedagogically: starter → main → practice → plenary, with a metacognitive reflection at plenary.

Return the lesson plan with the strand citations + caveats attached to each approach, and a brief summary of the evidence strength, trade-offs, and implementation considerations for the teacher's professional judgement.`,
      },
    },
  ];
}
