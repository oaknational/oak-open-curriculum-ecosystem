import type { UniversalToolExecutors } from '../tools/index.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';

function canonical(path: string): string {
  return `https://www.thenational.academy${path}`;
}

// eslint-disable-next-line max-lines-per-function -- this is a test stub
function createStubExecution(toolName: unknown): ToolExecutionResult {
  if (toolName === 'get-key-stages') {
    return {
      data: {
        data: [
          {
            slug: 'ks1',
            title: 'Key Stage 1',
            canonicalUrl: canonical('/teachers/key-stages/ks1'),
          },
          {
            slug: 'ks2',
            title: 'Key Stage 2',
            canonicalUrl: canonical('/teachers/key-stages/ks2'),
          },
        ],
        response: { status: 200 },
      },
    };
  }
  if (toolName === 'get-search-lessons') {
    return {
      data: {
        data: [
          {
            lessonSlug: 'performing-your-chosen-gothic-poem',
            lessonTitle: 'Performing your chosen Gothic poem',
            similarity: 0.9,
            units: [
              {
                unitSlug: 'gothic-poetry',
                unitTitle: 'Gothic poetry',
                examBoardTitle: null,
                keyStageSlug: 'ks3',
                subjectSlug: 'english',
              },
            ],
            canonicalUrl: canonical('/teachers/lessons/performing-your-chosen-gothic-poem'),
          },
        ],
        response: { status: 200 },
      },
    };
  }
  if (toolName === 'get-search-transcripts') {
    return {
      data: {
        data: [
          {
            lessonTitle: 'The Roman invasion of Britain',
            lessonSlug: 'the-roman-invasion-of-britain',
            transcriptSnippet: 'The Romans were ready,',
            canonicalUrl: canonical('/teachers/lessons/the-roman-invasion-of-britain'),
          },
        ],
        response: { status: 200 },
      },
    };
  }
  if (toolName === 'get-sequences-units') {
    return {
      data: {
        data: [
          {
            year: 3,
            title: 'Year 3',
            units: [
              {
                unitTitle: 'Stub Unit',
                unitOrder: 1,
                unitOptions: [
                  {
                    unitTitle: 'Stub Unit',
                    unitSlug: 'stub-unit',
                  },
                ],
                categories: [],
                threads: [],
              },
            ],
            canonicalUrl: canonical('/teachers/sequences/stub-sequence'),
          },
        ],
        response: { status: 200 },
      },
    };
  }
  if (toolName === 'get-key-stages-subject-lessons') {
    return {
      data: {
        data: [
          {
            unitSlug: 'stub-unit',
            unitTitle: 'Stub Unit',
            lessons: [
              {
                lessonSlug: 'stub-lesson',
                lessonTitle: 'Stub Lesson',
              },
            ],
            canonicalUrl: canonical('/teachers/units/stub-unit'),
          },
        ],
        response: { status: 200 },
      },
    };
  }
  if (toolName === 'get-lessons-summary') {
    return {
      data: {
        lessonTitle: 'Stub Lesson',
        unitSlug: 'stub-unit',
        unitTitle: 'Stub Unit',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks1',
        keyStageTitle: 'Key Stage 1',
        canonicalUrl: canonical('/teachers/lessons/stub-lesson'),
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: true,
      },
    };
  }
  return { data: { stubbed: true } };
}

export function resolveToolExecutors(): UniversalToolExecutors {
  if (process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS !== 'true') {
    return {};
  }
  return {
    executeMcpTool: (name, _args) => {
      console.log('executeMcpTool', name, _args);
      return Promise.resolve(createStubExecution(name));
    },
  };
}
