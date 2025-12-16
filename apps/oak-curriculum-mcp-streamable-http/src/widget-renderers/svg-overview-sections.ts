/**
 * Overview SVG Section Configurations.
 * Edges are dynamically calculated from node centers.
 */
import type { SectionConfig, EdgeConfig } from './svg-components.js';
import { createEdgeBetweenNodes } from './svg-components.js';
import { getConceptBrief } from './concept-briefs.js';

const n = (id: string, label: string, w: number, h: number, x: number, y: number, c: string) =>
  ({
    id,
    label,
    width: w,
    height: h,
    position: { x, y },
    cssClass: c,
    brief: getConceptBrief(id),
  }) as const;

export const OVERVIEW_CONTEXT_SECTION = {
  id: 'context-section',
  label: 'Context',
  position: { x: 28, y: 15 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-phase', 'Phase', 100, 35, 2, 30, 'node-context'),
    n('node-keystage', 'Key Stage', 130, 35, 167, 30, 'node-context'),
    n('node-yeargroup', 'Year Group', 130, 35, 382, 30, 'node-context'),
  ],
} as const satisfies SectionConfig;

export const OVERVIEW_CORE_STRUCTURE_SECTION = {
  id: 'core-structure-section',
  label: 'Core Structure',
  position: { x: 28, y: 145 },
  labelPosition: { x: 0, y: 63 },
  nodes: [
    n('node-subject', 'Subject', 100, 40, 2, 15, 'node-core'),
    n('node-sequence', 'Sequence', 130, 40, 172, 15, 'node-core'),
    n('node-unit', 'Unit', 80, 40, 392, 15, 'node-core'),
    n('node-lesson', 'Lesson', 100, 40, 652, 15, 'node-core'),
  ],
} as const satisfies SectionConfig;

export const OVERVIEW_TAXONOMY_SECTION = {
  id: 'taxonomy-section',
  label: 'Taxonomy',
  position: { x: 288, y: 270 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-thread', 'Thread', 110, 35, 2, 35, 'node-taxonomy'),
    n('node-category', 'Category', 120, 35, 142, 35, 'node-taxonomy'),
  ],
} as const satisfies SectionConfig;

export const OVERVIEW_CONTENT_SECTION = {
  id: 'content-section',
  label: 'Content',
  position: { x: 618, y: 270 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-quiz', 'Quiz', 80, 35, 2, 35, 'node-content'),
    n('node-asset', 'Asset', 80, 35, 102, 35, 'node-content'),
    n('node-transcript', 'Transcript', 115, 35, 212, 35, 'node-content'),
    n('node-question', 'Question', 120, 35, 42, 145, 'node-content'),
    n('node-answer', 'Answer', 105, 35, 77, 235, 'node-content'),
  ],
} as const satisfies SectionConfig;

export const OVERVIEW_KS4_SECTION = {
  id: 'ks4-section',
  label: 'KS4',
  position: { x: 28, y: 362 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-programme', 'Programme', 130, 35, 2, 33, 'node-ks4'),
    n('node-tier', 'Tier', 80, 35, 2, 113, 'node-ks4'),
    n('node-pathway', 'Pathway', 110, 35, 102, 113, 'node-ks4'),
    n('node-examboard', 'Exam Board', 130, 35, 2, 193, 'node-ks4'),
  ],
} as const satisfies SectionConfig;

export const OVERVIEW_SECTIONS = [
  OVERVIEW_CONTEXT_SECTION,
  OVERVIEW_CORE_STRUCTURE_SECTION,
  OVERVIEW_TAXONOMY_SECTION,
  OVERVIEW_CONTENT_SECTION,
  OVERVIEW_KS4_SECTION,
] as const;

/** Helper to create edge between nodes by ID. */
const edge = (from: string, to: string, rel: string, dashed: boolean): EdgeConfig =>
  createEdgeBetweenNodes(from, to, rel, dashed, OVERVIEW_SECTIONS);

/**
 * Creates overview edges dynamically from node centers.
 * Moving a section automatically updates all connected edges.
 */
export function createOverviewEdges(): readonly EdgeConfig[] {
  return [
    // Context chain: Phase → Key Stage → Year Group
    edge('node-phase', 'node-keystage', 'includesKeyStages', false),
    edge('node-keystage', 'node-yeargroup', 'includesYears', false),
    // Core hierarchy: Subject → Sequence → Unit → Lesson
    edge('node-subject', 'node-sequence', 'hasSequences', false),
    edge('node-sequence', 'node-unit', 'containsUnits', false),
    edge('node-unit', 'node-lesson', 'containsLessons', false),
    // Context → Core (inferred)
    edge('node-phase', 'node-subject', 'belongsTo (inferred)', true),
    edge('node-keystage', 'node-sequence', 'scopedTo (inferred)', true),
    edge('node-yeargroup', 'node-unit', 'targets (inferred)', true),
    // Unit → Taxonomy
    edge('node-unit', 'node-thread', 'taggedWith', true),
    edge('node-unit', 'node-category', 'taggedWith', true),
    // Lesson → Content
    edge('node-lesson', 'node-quiz', 'hasQuizzes', false),
    edge('node-lesson', 'node-asset', 'hasAssets', false),
    edge('node-lesson', 'node-transcript', 'hasTranscript', false),
    // Quiz → Question → Answer
    edge('node-quiz', 'node-question', 'containsQuestions', false),
    edge('node-question', 'node-answer', 'hasAnswers', false),
    // KS4 relationships
    edge('node-programme', 'node-tier', 'usesFactorWhen (inferred)', false),
    edge('node-programme', 'node-pathway', 'usesFactorWhen (inferred)', false),
    edge('node-tier', 'node-examboard', 'usesFactorWhen (inferred)', false),
  ];
}
