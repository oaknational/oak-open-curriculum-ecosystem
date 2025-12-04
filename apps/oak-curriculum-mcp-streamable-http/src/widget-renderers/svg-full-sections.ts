/**
 * Full SVG Section Configurations.
 * @module widget-renderers/svg-full-sections
 */
import type { SectionConfig } from './svg-components.js';
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

export const FULL_CONTEXT_SECTION = {
  id: 'context-section',
  label: 'Context',
  position: { x: 18, y: 12 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-phase', 'Phase', 100, 35, 2, 26, 'node-context'),
    n('node-keystage', 'Key Stage', 130, 35, 177, 26, 'node-context'),
    n('node-yeargroup', 'Year Group', 130, 35, 417, 26, 'node-context'),
  ],
} as const satisfies SectionConfig;

export const FULL_CORE_STRUCTURE_SECTION = {
  id: 'core-structure-section',
  label: 'Core Structure',
  position: { x: 18, y: 118 },
  labelPosition: { x: 0, y: 60 },
  nodes: [
    n('node-subject', 'Subject', 90, 40, 2, 12, 'node-core'),
    n('node-sequence', 'Sequence', 130, 40, 182, 12, 'node-core'),
    n('node-unit', 'Unit', 80, 40, 412, 12, 'node-core'),
    n('node-lesson', 'Lesson', 100, 40, 602, 12, 'node-core'),
  ],
} as const satisfies SectionConfig;

export const FULL_CONTENT_SECTION = {
  id: 'content-section',
  label: 'Content',
  position: { x: 618, y: 218 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-quiz', 'Quiz', 100, 35, 2, 32, 'node-content'),
    n('node-asset', 'Asset', 100, 35, 122, 32, 'node-content'),
    n('node-transcript', 'Transcript', 120, 35, 242, 32, 'node-content'),
    n('node-question', 'Question', 120, 35, -8, 132, 'node-content'),
    n('node-answer', 'Answer', 100, 35, 2, 232, 'node-content'),
  ],
} as const satisfies SectionConfig;

export const FULL_TAXONOMY_SECTION = {
  id: 'taxonomy-section',
  label: 'Taxonomy',
  position: { x: 288, y: 255 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-thread', 'Thread', 110, 35, 2, 32, 'node-taxonomy'),
    n('node-category', 'Category', 140, 35, 132, 32, 'node-taxonomy'),
  ],
} as const satisfies SectionConfig;

export const FULL_KS4_SECTION = {
  id: 'ks4-section',
  label: 'KS4',
  position: { x: 18, y: 398 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-programme', 'Programme', 160, 35, 2, 27, 'node-ks4'),
    n('node-tier', 'Tier', 100, 35, 2, 124, 'node-ks4'),
    n('node-pathway', 'Pathway', 120, 35, 130, 124, 'node-ks4'),
    n('node-examsubject', 'Exam Subject', 140, 35, 260, 159, 'node-ks4'),
    n('node-examboard', 'Exam Board', 160, 35, 2, 224, 'node-ks4'),
  ],
} as const satisfies SectionConfig;

export const FULL_METADATA_SECTION = {
  id: 'metadata-section',
  label: 'Metadata',
  position: { x: 808, y: 518 },
  labelPosition: { x: 0, y: 0 },
  nodes: [
    n('node-keyword', 'Keyword', 120, 35, 2, 32, 'node-metadata'),
    n('node-misconception', 'Misconception', 140, 35, 142, 32, 'node-metadata'),
    n('node-contentguidance', 'Content Guidance', 170, 35, 2, 82, 'node-metadata'),
    n('node-keylearningpoint', 'Key Learning Point', 180, 35, 192, 82, 'node-metadata'),
    n('node-teachertip', 'Teacher Tip', 130, 35, 2, 132, 'node-metadata'),
    n('node-supervisionlevel', 'Supervision Level', 180, 35, 152, 132, 'node-metadata'),
    n('node-priorknowledge', 'Prior Knowledge', 160, 35, 2, 182, 'node-metadata'),
    n('node-nationalcurriculum', 'National Curriculum', 180, 35, 182, 182, 'node-metadata'),
  ],
} as const satisfies SectionConfig;

export const FULL_SECTIONS = [
  FULL_CONTEXT_SECTION,
  FULL_CORE_STRUCTURE_SECTION,
  FULL_CONTENT_SECTION,
  FULL_TAXONOMY_SECTION,
  FULL_KS4_SECTION,
  FULL_METADATA_SECTION,
] as const;

export const LEGEND_CONFIG = {
  position: { x: 20, y: 800 },
  width: 1210,
  height: 70,
  items: [
    { cssClass: 'node-core', label: 'Structure', x: 120 },
    { cssClass: 'node-context', label: 'Context', x: 250 },
    { cssClass: 'node-content', label: 'Content', x: 370 },
    { cssClass: 'node-taxonomy', label: 'Taxonomy', x: 490 },
    { cssClass: 'node-ks4', label: 'KS4', x: 620 },
    { cssClass: 'node-metadata', label: 'Metadata', x: 720 },
  ],
} as const;
