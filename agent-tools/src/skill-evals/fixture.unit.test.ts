/**
 * Unit tests for the skill eval fixture boundary.
 *
 * @remarks
 * Each test describes one shape of fixture text and the parse result the
 * boundary must return for it: a conforming fixture parses to its typed
 * value; a malformed one is refused with the boundary named. Literal inputs,
 * no IO.
 */

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseSkillEvalsFixture, parseTriggerValidation } from './fixture.js';

const conformingFixture = JSON.stringify({
  skill_name: 'user-value',
  evals: [
    {
      id: 1,
      prompt: 'Rework these stories.',
      expected_output: 'A provisional model.',
      assertions: ['The dashboard is a proposed response', 'No quotations are invented'],
    },
  ],
});

describe('parseSkillEvalsFixture', () => {
  it('parses a conforming fixture to its cases', () => {
    const fixture = unwrapOrThrow(parseSkillEvalsFixture(conformingFixture));
    expect(fixture.skill_name).toBe('user-value');
    expect(fixture.evals[0]?.assertions).toHaveLength(2);
  });

  it('refuses text that is not JSON, naming the file', () => {
    expect(unwrapErr(parseSkillEvalsFixture('{not json')).message).toContain('evals.json');
  });

  it('refuses a case without assertions, naming the file', () => {
    const text = JSON.stringify({
      skill_name: 'user-value',
      evals: [{ id: 1, prompt: 'p', expected_output: 'e', assertions: [] }],
    });
    expect(unwrapErr(parseSkillEvalsFixture(text)).message).toContain('evals.json');
  });

  it('parses the skills a handoff case expects to reach, and refuses an empty list', () => {
    const one = { id: 1, prompt: 'p', expected_output: 'e', assertions: ['a'] };
    const declared = JSON.stringify({
      skill_name: 'plan',
      evals: [{ ...one, skills_expected: ['user-value', 'specify'] }],
    });
    expect(unwrapOrThrow(parseSkillEvalsFixture(declared)).evals[0]?.skills_expected).toEqual([
      'user-value',
      'specify',
    ]);
    const empty = JSON.stringify({ skill_name: 'plan', evals: [{ ...one, skills_expected: [] }] });
    expect(unwrapErr(parseSkillEvalsFixture(empty)).message).toContain('skills_expected');
  });

  it('refuses duplicate case ids', () => {
    const one = { id: 1, prompt: 'p', expected_output: 'e', assertions: ['a'] };
    const text = JSON.stringify({ skill_name: 'user-value', evals: [one, one] });
    expect(unwrapErr(parseSkillEvalsFixture(text)).message).toContain('duplicate case id 1');
  });

  it('refuses an unknown key, so a misspelt field never passes silently', () => {
    const text = JSON.stringify({
      skill_name: 'user-value',
      evals: [{ id: 1, prompt: 'p', expected_output: 'e', assertions: ['a'], asserts: [] }],
    });
    expect(unwrapErr(parseSkillEvalsFixture(text)).message).toContain('asserts');
  });
});

describe('parseTriggerValidation', () => {
  it('parses a list of trigger examples', () => {
    const examples = unwrapOrThrow(
      parseTriggerValidation(
        JSON.stringify([
          { query: 'Rework these stories', should_trigger: true },
          { query: 'Implement the settled heap', should_trigger: false },
        ]),
      ),
    );
    expect(examples.map((example) => example.should_trigger)).toEqual([true, false]);
  });

  it('refuses an example whose should_trigger is not a boolean, naming the file', () => {
    const text = JSON.stringify([{ query: 'q', should_trigger: 'yes' }]);
    expect(unwrapErr(parseTriggerValidation(text)).message).toContain('trigger-validation.json');
  });
});
