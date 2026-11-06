/**
 * The grader files a projected case carries, as the host eval runner reads
 * them: `tool_used` indicators, a `regex` check on the trace, and an `llm`
 * rubric.
 *
 * @remarks
 * Three facts of the runner, read first-hand from its binary and its traces
 * on 2026-09-27, shape these graders. A `tool_used` grader counts the call,
 * not its outcome, so the positive indicator is paired with a trace check
 * that no read of the skill's own files was refused. Its `input_match` is a
 * regular expression tested against the serialised tool input, and the Skill
 * tool names a plugin skill `<plugin>:<skill>`, so the indicator is anchored
 * with a negative lookahead: `oak-specify` never counts a call to
 * `oak-specify-connection`. And the judge reads only the rubric, so the
 * rubric ties the judgement to the expected outcome's own elements (a
 * structure clause naming one skill's elements failed another skill's
 * correct records, read first-hand on the first specify run) and says
 * when the method's absence is correct.
 *
 * @packageDocumentation
 */

/** The lookahead that closes a host skill name, which is lower-case letters, digits and hyphens. */
const NAME_END = '(?![a-z0-9-])';

/** The plugin-fired indicator: the Skill tool called with exactly this host skill. */
export function skillFiredGrader(hostSkill: string): string {
  return [
    '---',
    'type: tool_used',
    'tool: Skill',
    `input_match: "${hostSkill}${NAME_END}"`,
    '---',
    '',
  ].join('\n');
}

/**
 * The negative-routing grader: the Skill tool never called with this host
 * skill. Anchored like the fired indicator, so a carried sibling taking the
 * request (the routing the case wants) is not counted against it.
 */
export function skillSilentGrader(hostSkill: string): string {
  return [
    '---',
    'type: tool_used',
    'tool: Skill',
    `input_match: "${hostSkill}${NAME_END}"`,
    'min: 0',
    'max: 0',
    '---',
    '',
  ].join('\n');
}

/**
 * The trace check paired with every indicator: no read of a file under any
 * of the plugin's skills was refused, so a counted Skill call is one whose
 * method and references the agent could reach. The runner's refusal text
 * names the path; skill directories carry no spaces.
 */
export function skillFilesReadableGrader(hostSkills: readonly string[]): string {
  const skills = hostSkills.join('|');
  return [
    '---',
    'type: regex',
    'target: trace',
    `pattern: 'Permission to read [^ ]*/skills/(${skills})/[^ ]* has been denied'`,
    'match: not_contains',
    '---',
    '',
  ].join('\n');
}

/** The judge's rubric: the expected outcome and every assertion, numbered. */
export function assertionsGrader(expectedOutput: string, assertions: readonly string[]): string {
  const numbered = assertions.map((assertion, index) => `${index + 1}. ${assertion}`);
  return [
    '---',
    'type: llm',
    'weight: 1',
    '---',
    '',
    "Judge the agent's final response against the expected outcome and every assertion below. Pass",
    'only when the expected outcome is substantively met and every assertion holds. Where the',
    'expected outcome calls for a method to be applied, judge whether the elements the expected',
    'outcome names are present in substance; a response that names or summarises the method',
    'without producing them fails. Where the expected outcome is that the method is correctly not',
    'applied, or that the request is routed elsewhere, judge the assertions alone. Judge only what',
    'the response says; the prompt states the facts the agent had, and asking for material the',
    'prompt does not supply is not a failure unless an assertion says so.',
    '',
    `Expected outcome: ${expectedOutput}`,
    '',
    'Assertions:',
    ...numbered,
    '',
  ].join('\n');
}
