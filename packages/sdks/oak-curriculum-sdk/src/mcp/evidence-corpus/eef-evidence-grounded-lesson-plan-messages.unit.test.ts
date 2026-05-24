/**
 * Tests for `getEefEvidenceGroundedLessonPlanMessages`.
 *
 * Each test describes a behavioural invariant of the message generator:
 * caller-context propagation, optional-arg conditional inclusion, phase
 * resolution effect, EEF guidance preamble splice, gate-1a tool name
 * orchestration, and graceful-default behaviour under missing args.
 *
 * Framing 3 (phase-resolution effect) deliberately tests the OUTPUT
 * effect of the KS-to-phase mapping rather than the presence of the
 * mapping table itself — the behaviour to describe is "given KS3 the
 * output references secondary phase", not "the mapping table appears
 * verbatim in the output". Either representation (inline table /
 * extracted helper) is acceptable so long as the phase-label effect
 * holds for the LLM reading the prompt.
 */

import { describe, it, expect } from 'vitest';

import { getEefEvidenceGroundedLessonPlanMessages } from './eef-evidence-grounded-lesson-plan-messages.js';

function getText(args: Readonly<Record<string, string | undefined>>): string {
  const messages = getEefEvidenceGroundedLessonPlanMessages(args);

  return messages
    .filter((m) => m.content.type === 'text')
    .map((m) => m.content.text)
    .join('\n');
}

describe('getEefEvidenceGroundedLessonPlanMessages', () => {
  it('incorporates the caller-supplied subject, keyStage, and topic into the message text', () => {
    const text = getText({ subject: 'mathematics', keyStage: 'KS3', topic: 'fractions' });

    expect(text).toContain('mathematics');
    expect(text).toContain('KS3');
    expect(text).toContain('fractions');
  });

  it('includes the focus argument when one is provided', () => {
    const text = getText({
      subject: 'science',
      keyStage: 'KS4',
      topic: 'photosynthesis',
      focus: 'metacognition',
    });

    expect(text).toContain('focus: "metacognition"');
  });

  it('omits the focus argument when none is provided', () => {
    const text = getText({ subject: 'science', keyStage: 'KS4', topic: 'photosynthesis' });

    expect(text).not.toContain('focus:');
  });

  it('produces a prompt body that resolves KS3 to the secondary phase', () => {
    const text = getText({ subject: 'history', keyStage: 'KS3', topic: 'WWI' });

    expect(text.toLowerCase()).toContain('secondary');
  });

  it('produces a prompt body that resolves EYFS to the early-years phase', () => {
    const text = getText({ subject: 'art', keyStage: 'EYFS', topic: 'colour' });

    expect(text.toLowerCase()).toContain('early_years');
  });

  it('produces a prompt body that resolves KS5 to the secondary phase (F9 edge case)', () => {
    const text = getText({ subject: 'biology', keyStage: 'KS5', topic: 'genetics' });

    expect(text.toLowerCase()).toContain('secondary');
  });

  it('splices the AGGREGATED_EEF_EVIDENCE_GUIDANCE preamble into the prompt body', () => {
    const text = getText({ subject: 'maths', keyStage: 'KS2', topic: 'place value' });

    expect(text).toContain('implementation quality');
    expect(text).toContain('best bets');
  });

  it('orchestrates the gate-1a tool eef-explore-evidence-for-context by name', () => {
    const text = getText({ subject: 'english', keyStage: 'KS1', topic: 'phonics' });

    expect(text).toContain('eef-explore-evidence-for-context');
  });

  it('does not regress to orchestrating the gate-1b recommend-evidence tool', () => {
    const text = getText({ subject: 'english', keyStage: 'KS1', topic: 'phonics' });

    expect(text).not.toContain('eef-recommend-evidence-for-context');
  });

  it('returns a graceful default message when called with no arguments', () => {
    const text = getText({});

    expect(text).toContain('the subject');
    expect(text).toContain('the key stage');
    expect(text).toContain('the topic');
  });

  it('returns exactly one user-role text message', () => {
    const messages = getEefEvidenceGroundedLessonPlanMessages({
      subject: 'maths',
      keyStage: 'KS2',
      topic: 'fractions',
    });

    expect(messages).toHaveLength(1);
    expect(messages[0]?.role).toBe('user');
    expect(messages[0]?.content.type).toBe('text');
  });
});
