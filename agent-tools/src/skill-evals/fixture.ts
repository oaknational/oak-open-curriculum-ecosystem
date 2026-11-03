import type { Result } from '@oaknational/result';
import { z } from 'zod';

import { parseJsonTextResult } from '../core/json.js';
import { parseWithSchema } from '../core/schema-parse.js';

/**
 * The declared eval fixtures of a canonical skill, parsed strictly at the
 * read boundary.
 *
 * @remarks
 * A skill declares its evaluation in two files under its `evals/` directory:
 * `evals.json` (the cases: a prompt, the expected outcome, the assertions a
 * judge checks and, for a case that exercises a handoff, the skills it
 * expects to reach) and `trigger-validation.json` (queries that should, or
 * should not, make the skill fire). These schemas are that contract; the
 * types flow from them. A fixture that does not conform is refused with the
 * boundary named, never projected into a suite that would run on a guess
 * (`strict-validation-at-boundary`).
 *
 * @packageDocumentation
 */

const nonEmptyString = z.string().min(1);

const evalCaseSchema = z
  .object({
    id: z.number().int().positive(),
    prompt: nonEmptyString,
    expected_output: nonEmptyString,
    assertions: z.array(nonEmptyString).min(1),
    /**
     * The canonical names of the skills this case expects the agent to
     * invoke, when the case exercises a handoff beyond the skill under
     * evaluation; each must be that skill or one carried beside it.
     */
    skills_expected: z.array(nonEmptyString).min(1).optional(),
  })
  .strict();

/** One declared eval case. */
export type EvalCase = z.infer<typeof evalCaseSchema>;

const fixtureSchema = z
  .object({
    skill_name: nonEmptyString,
    evals: z.array(evalCaseSchema).min(1),
  })
  .strict()
  .superRefine((fixture, context) => {
    const seen = new Set<number>();
    for (const evalCase of fixture.evals) {
      if (seen.has(evalCase.id)) {
        context.addIssue({ code: 'custom', message: `duplicate case id ${evalCase.id}` });
      }
      seen.add(evalCase.id);
    }
  });

/** A skill's `evals/evals.json`, validated. */
export type SkillEvalsFixture = z.infer<typeof fixtureSchema>;

const triggerExampleSchema = z
  .object({
    query: nonEmptyString,
    should_trigger: z.boolean(),
  })
  .strict();

/** One declared trigger example. */
export type TriggerExample = z.infer<typeof triggerExampleSchema>;

const triggerValidationSchema = z.array(triggerExampleSchema);

/** Parse the text of a skill's `evals/evals.json`. */
export function parseSkillEvalsFixture(text: string): Result<SkillEvalsFixture, Error> {
  const json = parseJsonTextResult(text, 'evals.json');
  if (!json.ok) {
    return json;
  }
  return parseWithSchema({ label: 'evals.json', schema: fixtureSchema, value: json.value });
}

/** Parse the text of a skill's `evals/trigger-validation.json`. */
export function parseTriggerValidation(text: string): Result<readonly TriggerExample[], Error> {
  const json = parseJsonTextResult(text, 'trigger-validation.json');
  if (!json.ok) {
    return json;
  }
  return parseWithSchema({
    label: 'trigger-validation.json',
    schema: triggerValidationSchema,
    value: json.value,
  });
}
