/**
 * Concept brief descriptions for SVG node tooltips.
 * Mirrors the brief descriptions from knowledge-graph-data.ts in the SDK.
 * @module widget-renderers/concept-briefs
 */

/**
 * Map of node ID to brief description.
 * Node IDs use the format 'node-{conceptId}'.
 * These descriptions come from the curriculum knowledge graph.
 */
const CONCEPT_BRIEFS: Readonly<Record<string, string>> = {
  // Structure (core hierarchy)
  'node-subject': 'Curriculum subject area (maths, history, etc.)',
  'node-sequence': 'Internal API grouping of units across years',
  'node-unit': 'Topic of study with ordered lessons',
  'node-lesson': 'Teaching session with 8 standard components',
  // Content (within lesson)
  'node-quiz': 'Starter or exit assessment',
  'node-question': 'Quiz question with answers',
  'node-answer': 'Correct answer or distractor',
  'node-asset': 'Downloadable resource (slides, worksheet)',
  'node-transcript': 'Video transcript text',
  // Context (scoping)
  'node-phase': 'Primary or secondary',
  'node-keystage': 'KS1-KS4 formal education stage',
  'node-yeargroup': 'Year 1-11 school year',
  // Taxonomy (cross-cutting)
  'node-thread': 'Conceptual strand linking units across years',
  'node-category': 'Subject-specific grouping of units',
  // KS4 complexity
  'node-programme': 'User-facing curriculum pathway (derived view)',
  'node-tier': 'Foundation or higher difficulty level',
  'node-pathway': 'Core or GCSE route through KS4',
  'node-examboard': 'AQA, OCR, Edexcel, Eduqas',
  'node-examsubject': 'Biology, Chemistry, Physics (KS4 science)',
  // Educational metadata
  'node-keyword': 'Critical vocabulary for the lesson',
  'node-misconception': 'Common misunderstanding to address',
  'node-contentguidance': 'Sensitive content advisory',
  'node-supervisionlevel': 'Adult supervision requirement level',
  'node-priorknowledge': 'Prerequisite understanding required',
  'node-nationalcurriculum': 'NC coverage alignment',
  'node-keylearningpoint': 'Main knowledge outcome of lesson',
  'node-teachertip': 'Pedagogical guidance for delivery',
};

/**
 * Gets the brief description for a node ID.
 * Returns undefined if no brief is found.
 */
export function getConceptBrief(nodeId: string): string | undefined {
  return CONCEPT_BRIEFS[nodeId];
}
