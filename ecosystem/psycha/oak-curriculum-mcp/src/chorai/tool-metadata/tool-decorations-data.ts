/**
 * Tool decoration data - ADR-029/030/031 compliant
 *
 * This file contains the actual decoration data, separated from the main
 * tool-decorations.ts file to meet line limits.
 *
 * All decorations are keyed by operationId from the SDK.
 * These are purely additive metadata fields, no API data.
 */

import type { ToolDecoration } from './types';

/**
 * Tool decorations for all Oak Curriculum API operations
 */
export const TOOL_DECORATIONS_DATA: Record<string, ToolDecoration> = {
  // Search & Discovery
  'getLessons-searchByTextSimilarity': {
    displayName: 'Search Lessons',
    description: 'Search for lessons across the Oak curriculum with powerful filtering',
    longDescription:
      'Perform comprehensive searches across Oak lessons. Filter by key stage, subject, and more.',
    tags: ['search', 'lessons'],
    complexity: 'simple',
    category: 'search',
    examples: [
      {
        title: 'Search KS2 fractions',
        input: { q: 'fractions', keyStage: 'ks2', subject: 'maths' },
        description: 'Find KS2 maths lessons about fractions.',
      },
    ],
  },
  'searchTranscripts-searchTranscripts': {
    displayName: 'Search Transcripts',
    description: 'Search lesson transcripts for specific content',
    tags: ['search', 'transcript'],
    complexity: 'simple',
    category: 'search',
  },

  // Content & Lessons
  'getLessons-getLesson': {
    displayName: 'Get Lesson Summary',
    description: 'Retrieve summary details for a specific lesson',
    longDescription:
      'Get comprehensive information about a lesson including objectives, vocabulary, and resources.',
    tags: ['content', 'lessons'],
    complexity: 'simple',
    category: 'content',
  },
  'getLessonTranscript-getLessonTranscript': {
    displayName: 'Get Lesson Transcript',
    description: 'Retrieve the lesson video transcript',
    tags: ['content', 'transcript', 'accessibility'],
    complexity: 'simple',
    category: 'content',
  },
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons': {
    displayName: 'Get Lessons by Key Stage and Subject',
    description: 'List all lessons for a key stage and subject',
    longDescription:
      'Retrieve comprehensive list of lessons available for a specific key stage and subject combination, grouped by unit.',
    tags: ['lessons', 'key-stage', 'subject', 'planning'],
    complexity: 'simple',
    category: 'content',
  },

  // Planning & Units
  'getSequences-getSequenceUnits': {
    displayName: 'Get Sequence Units',
    description: 'Retrieve units within a curriculum sequence',
    longDescription:
      'Get all units that belong to a specific curriculum sequence, optionally filtered by year.',
    tags: ['sequences', 'units', 'planning'],
    complexity: 'simple',
    category: 'planning',
  },
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits': {
    displayName: 'Get Units by Key Stage and Subject',
    description: 'Retrieve all units for a key stage and subject combination',
    longDescription:
      'Get comprehensive list of all teaching units available for a specific key stage and subject.',
    tags: ['units', 'planning', 'key-stage', 'subject'],
    complexity: 'simple',
    category: 'planning',
  },
  'getUnits-getUnit': {
    displayName: 'Get Unit Summary',
    description: 'Retrieve detailed information about a specific unit',
    longDescription:
      'Get comprehensive unit details including lessons, prior knowledge requirements, and national curriculum statements.',
    tags: ['units', 'planning', 'curriculum'],
    complexity: 'simple',
    category: 'planning',
  },
  'getThreads-getThreadUnits': {
    displayName: 'Get Thread Units',
    description: 'List all units within a specific thread',
    longDescription: 'Retrieve all teaching units that belong to a specific curriculum thread.',
    tags: ['threads', 'units', 'planning'],
    complexity: 'simple',
    category: 'planning',
  },

  // Resources & Assets
  'getAssets-getSequenceAssets': {
    displayName: 'Get Sequence Assets',
    description: 'Download assets for a curriculum sequence',
    longDescription:
      'Retrieve downloadable resources like worksheets, slides, and videos for an entire sequence.',
    tags: ['assets', 'downloads', 'resources', 'sequences'],
    complexity: 'simple',
    category: 'resources',
  },
  'getAssets-getSubjectAssets': {
    displayName: 'Get Subject Assets',
    description: 'Download assets for a subject at a key stage',
    longDescription:
      'Retrieve all downloadable resources for a subject within a specific key stage.',
    tags: ['assets', 'downloads', 'resources', 'subjects'],
    complexity: 'simple',
    category: 'resources',
  },
  'getAssets-getLessonAssets': {
    displayName: 'Get Lesson Assets',
    description: 'Download all assets for a specific lesson',
    longDescription:
      'Retrieve all downloadable resources associated with a lesson including worksheets, slides, and videos.',
    tags: ['assets', 'downloads', 'resources', 'lessons'],
    complexity: 'simple',
    category: 'resources',
  },
  'getAssets-getLessonAsset': {
    displayName: 'Get Single Lesson Asset',
    description: 'Download a specific asset from a lesson',
    longDescription: 'Retrieve a single downloadable resource from a lesson by asset type.',
    tags: ['assets', 'downloads', 'resources', 'lessons'],
    complexity: 'simple',
    category: 'resources',
  },

  // Assessment & Questions
  'getQuestions-getQuestionsForLessons': {
    displayName: 'Get Lesson Quiz Questions',
    description: 'Retrieve quiz questions and answers for a lesson',
    longDescription: 'Get all quiz questions with answers and distractors for a specific lesson.',
    tags: ['assessment', 'quiz', 'questions', 'lessons'],
    complexity: 'simple',
    category: 'assessment',
  },
  'getQuestions-getQuestionsForSequence': {
    displayName: 'Get Sequence Quiz Questions',
    description: 'Retrieve all quiz questions for a sequence',
    longDescription: 'Get all quiz questions with answers across an entire curriculum sequence.',
    tags: ['assessment', 'quiz', 'questions', 'sequences'],
    complexity: 'simple',
    category: 'assessment',
  },
  'getQuestions-getQuestionsForKeyStageAndSubject': {
    displayName: 'Get Quiz Questions by Key Stage and Subject',
    description: 'Retrieve quiz questions for a key stage and subject',
    longDescription:
      'Get all quiz questions available for a specific key stage and subject combination.',
    tags: ['assessment', 'quiz', 'questions', 'key-stage', 'subject'],
    complexity: 'simple',
    category: 'assessment',
  },

  // Metadata - Core
  'getKeyStages-getKeyStages': {
    displayName: 'Get Key Stages',
    description: 'Retrieve all available key stages',
    tags: ['metadata', 'key-stages'],
    complexity: 'simple',
    category: 'metadata',
  },
  'getSubjects-getAllSubjects': {
    displayName: 'Get All Subjects',
    description: 'Retrieve all available subjects',
    tags: ['metadata', 'subjects'],
    complexity: 'simple',
    category: 'metadata',
  },

  // Metadata - Subjects Extended
  'getSubjects-getSubject': {
    displayName: 'Get Subject Sequences',
    description: 'Retrieve sequences for a specific subject',
    longDescription:
      'Get all curriculum sequences available for a subject, including phase and key stage information.',
    tags: ['metadata', 'subjects', 'sequences'],
    complexity: 'simple',
    category: 'metadata',
  },
  'getSubjects-getSubjectSequence': {
    displayName: 'Get Subject Sequence Details',
    description: 'Retrieve detailed sequence information for a subject',
    tags: ['metadata', 'subjects', 'sequences'],
    complexity: 'simple',
    category: 'metadata',
  },
  'getSubjects-getSubjectKeyStages': {
    displayName: 'Get Subject Key Stages',
    description: 'List key stages where a subject is taught',
    longDescription: 'Retrieve all key stages in which a specific subject is available.',
    tags: ['metadata', 'subjects', 'key-stages'],
    complexity: 'simple',
    category: 'metadata',
  },
  'getSubjects-getSubjectYears': {
    displayName: 'Get Subject Year Groups',
    description: 'List year groups where a subject is taught',
    longDescription: 'Retrieve all year groups in which a specific subject is available.',
    tags: ['metadata', 'subjects', 'years'],
    complexity: 'simple',
    category: 'metadata',
  },

  // Metadata - Threads
  'getThreads-getAllThreads': {
    displayName: 'Get All Threads',
    description: 'List all curriculum threads for sequence filtering',
    longDescription:
      'Retrieve all available threads that can be used as filters for curriculum sequences.',
    tags: ['metadata', 'threads', 'filters'],
    complexity: 'simple',
    category: 'metadata',
  },

  // Metadata - API
  'changelog-changelog': {
    displayName: 'Get API Changelog',
    description: 'View history of API changes',
    longDescription:
      'Retrieve the complete changelog showing all significant API changes with dates and versions.',
    tags: ['api', 'metadata', 'changelog', 'version'],
    complexity: 'simple',
    category: 'metadata',
  },
  'changelog-latest': {
    displayName: 'Get Latest API Version',
    description: 'Get the current API version information',
    longDescription: 'Retrieve the latest API version number and most recent change notes.',
    tags: ['api', 'metadata', 'version'],
    complexity: 'simple',
    category: 'metadata',
  },
  'getRateLimit-getRateLimit': {
    displayName: 'Check Rate Limit',
    description: 'Check current API rate limit status',
    longDescription: 'Check your current rate limit status without consuming any request quota.',
    tags: ['api', 'metadata', 'rate-limit'],
    complexity: 'simple',
    category: 'metadata',
  },
};
