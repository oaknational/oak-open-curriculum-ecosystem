import type { UniversalToolExecutors } from '../tools/index.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';

function createStubExecution(toolName: unknown): ToolExecutionResult {
  if (toolName === 'get-key-stages') {
    return {
      data: [
        { slug: 'ks1', title: 'Key Stage 1' },
        { slug: 'ks2', title: 'Key Stage 2' },
      ],
    };
  }
  if (toolName === 'get-search-lessons') {
    return {
      data: [
        { lessonSlug: 'stub-lesson-1', lessonTitle: 'Stub Lesson 1' },
        { lessonSlug: 'stub-lesson-2', lessonTitle: 'Stub Lesson 2' },
      ],
    };
  }
  if (toolName === 'get-search-transcripts') {
    return {
      data: [
        { transcriptSlug: 'stub-transcript-1', transcriptTitle: 'Stub Transcript 1' },
        { transcriptSlug: 'stub-transcript-2', transcriptTitle: 'Stub Transcript 2' },
      ],
    };
  }
  if (toolName === 'get-sequences-units') {
    return {
      data: [
        {
          unitSlug: 'unit-1',
          unitTitle: 'Unit 1',
          lessons: [],
        },
      ],
    };
  }
  if (toolName === 'get-lessons-summary') {
    return {
      data: {
        lessonTitle: 'Stub Lesson',
        unitSlug: 'unit-1',
        unitTitle: 'Unit 1',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
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
    executeMcpTool: (name, _args) => Promise.resolve(createStubExecution(name)),
  };
}
