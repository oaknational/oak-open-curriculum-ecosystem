/**
 * Full SVG Edge Configurations.
 * Edges are dynamically calculated from node centers.
 * @module widget-renderers/svg-full-edges
 */

import type { EdgeConfig } from './svg-components.js';
import { createEdgeBetweenNodes } from './svg-components.js';
import { FULL_SECTIONS } from './svg-full-sections.js';

/** Helper to create edge between nodes by ID. */
const edge = (from: string, to: string, rel: string, dashed: boolean): EdgeConfig =>
  createEdgeBetweenNodes(from, to, rel, dashed, FULL_SECTIONS);

/**
 * Creates full graph edges dynamically from node centers.
 * Moving a section automatically updates all connected edges.
 */
export function createFullEdges(): readonly EdgeConfig[] {
  return [
    // Context chain: Phase → Key Stage → Year Group
    edge('node-phase', 'node-keystage', 'includesKeyStages', false),
    edge('node-keystage', 'node-yeargroup', 'includesYears', false),
    // Core hierarchy: Subject → Sequence → Unit → Lesson
    edge('node-subject', 'node-sequence', 'hasSequences', false),
    edge('node-sequence', 'node-unit', 'containsUnits', false),
    edge('node-unit', 'node-lesson', 'containsLessons', false),
    // Subject → Key Stage (availableAt)
    edge('node-subject', 'node-keystage', 'availableAt', false),
    // Lesson → Content
    edge('node-lesson', 'node-quiz', 'hasQuizzes', false),
    edge('node-lesson', 'node-asset', 'hasAssets', false),
    edge('node-lesson', 'node-transcript', 'hasTranscript', false),
    // Quiz → Question → Answer
    edge('node-quiz', 'node-question', 'containsQuestions', false),
    edge('node-question', 'node-answer', 'hasAnswers', false),
    // Thread/Category relationships
    edge('node-thread', 'node-unit', 'linksAcrossYears', false),
    edge('node-unit', 'node-category', 'taggedWith', false),
    // Lesson → Metadata
    edge('node-lesson', 'node-keyword', 'hasKeywords', false),
    edge('node-lesson', 'node-misconception', 'addressesMisconceptions', false),
    edge('node-lesson', 'node-contentguidance', 'hasGuidance', false),
    edge('node-lesson', 'node-keylearningpoint', 'delivers', false),
    edge('node-lesson', 'node-teachertip', 'hasTips', false),
    // Content Guidance → Supervision Level
    edge('node-contentguidance', 'node-supervisionlevel', 'requiresSupervision', false),
    // Unit → Metadata
    edge('node-unit', 'node-priorknowledge', 'requiresPriorKnowledge', false),
    edge('node-unit', 'node-nationalcurriculum', 'covers', false),
    // KS4 inferred relationships
    edge('node-programme', 'node-sequence', 'derivedFrom (inferred)', true),
    edge('node-programme', 'node-tier', 'usesFactorWhen (inferred)', true),
    edge('node-programme', 'node-pathway', 'usesFactorWhen (inferred)', true),
    edge('node-programme', 'node-examboard', 'usesFactorWhen (inferred)', true),
    // Sequence → Exam Subject
    edge('node-sequence', 'node-examsubject', 'branchesInto (inferred)', true),
    // Exam Subject relationships
    edge('node-examsubject', 'node-tier', 'hasTiers (inferred)', true),
    edge('node-examsubject', 'node-unit', 'containsUnits (inferred)', true),
    // Tier → Unit
    edge('node-tier', 'node-unit', 'containsUnits (inferred)', true),
    // Unit/Lesson context (inferred)
    edge('node-unit', 'node-subject', 'belongsTo (inferred)', true),
    edge('node-unit', 'node-keystage', 'scopedTo (inferred)', true),
    edge('node-unit', 'node-yeargroup', 'targets (inferred)', true),
  ];
}

/** Full graph edges - 32 edges connecting 28 concepts. */
export const FULL_EDGES: readonly EdgeConfig[] = createFullEdges();
