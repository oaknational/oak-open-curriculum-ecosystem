/**
 * Schema conformance tests — validates generated Zod schemas against
 * real API response shapes.
 *
 * These tests guard against the `.strict().and(.strict())` codegen bug
 * (Snag 5) where allOf intersections with strict on both sides rejected
 * valid API data. The fix removes .strict() from intersection members
 * in the v3→v4 transform.
 */

import { describe, it, expect } from 'vitest';
import { rawCurriculumSchemas } from '@oaknational/curriculum-sdk-generation/zod';

describe('QuestionsForKeyStageAndSubjectResponseSchema conformance', () => {
  const schema = rawCurriculumSchemas.QuestionsForKeyStageAndSubjectResponseSchema;

  const orderQuestionFixture = {
    lessonSlug: 'a-model-of-the-structure-of-dna',
    lessonTitle: 'A model of the structure of DNA',
    starterQuiz: [
      {
        question: 'Starting from the smallest, put these structures in order of size.',
        questionType: 'order',
        answers: [
          { order: 2, type: 'text', content: 'DNA' },
          { order: 3, type: 'text', content: 'nucleus' },
          { order: 4, type: 'text', content: 'cell' },
          { order: 5, type: 'text', content: 'tissue' },
        ],
      },
    ],
    exitQuiz: [
      {
        question: 'A short-answer question.',
        questionType: 'short-answer',
        answers: [{ type: 'text', content: 'answer' }],
      },
    ],
  };

  it('validates order-type question answers with {order, type, content} shape', () => {
    const result = schema.safeParse([orderQuestionFixture]);

    expect(result.success).toBe(true);
  });

  it('validates multiple-choice answers with {type, content, distractor} shape', () => {
    const fixture = {
      lessonSlug: 'test-lesson',
      lessonTitle: 'Test Lesson',
      starterQuiz: [
        {
          question: 'Which of these?',
          questionType: 'multiple-choice',
          answers: [
            { type: 'text', content: 'Option A', distractor: false },
            { type: 'text', content: 'Option B', distractor: true },
          ],
        },
      ],
      exitQuiz: [
        {
          question: 'Short answer.',
          questionType: 'short-answer',
          answers: [{ type: 'text', content: 'answer' }],
        },
      ],
    };

    const result = schema.safeParse([fixture]);

    expect(result.success).toBe(true);
  });

  it('validates match-type answers with {matchOption, correctChoice} shape', () => {
    const fixture = {
      lessonSlug: 'test-lesson',
      lessonTitle: 'Test Lesson',
      starterQuiz: [
        {
          question: 'Match each keyword.',
          questionType: 'match',
          answers: [
            {
              matchOption: { type: 'text', content: 'cell' },
              correctChoice: { type: 'text', content: 'basic unit of life' },
            },
          ],
        },
      ],
      exitQuiz: [
        {
          question: 'Short answer.',
          questionType: 'short-answer',
          answers: [{ type: 'text', content: 'answer' }],
        },
      ],
    };

    const result = schema.safeParse([fixture]);

    expect(result.success).toBe(true);
  });

  it('rejects answers with genuinely unknown properties on non-intersection schemas', () => {
    const fixture = {
      lessonSlug: 'test-lesson',
      lessonTitle: 'Test Lesson',
      starterQuiz: [
        {
          question: 'Which?',
          questionType: 'multiple-choice',
          answers: [{ type: 'text', content: 'A', distractor: false, extraField: 'bad' }],
        },
      ],
      exitQuiz: [
        {
          question: 'Short answer.',
          questionType: 'short-answer',
          answers: [{ type: 'text', content: 'answer' }],
        },
      ],
    };

    const result = schema.safeParse([fixture]);

    expect(result.success).toBe(false);
  });
});
