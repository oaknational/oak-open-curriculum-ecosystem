/* eslint-disable max-lines -- Data configuration for all 68 subject×keystage combinations */
/**
 * Static curriculum pattern configuration.
 *
 * This is the SINGLE SOURCE OF TRUTH for how to traverse the curriculum API
 * for each subject × key stage combination. If the API structure changes,
 * this file must be updated and all downstream consumers will fail validation.
 *
 * The 7 identified patterns are:
 * 1. simple-flat: Simple year → units[] → lessons[] (most common)
 * 2. tier-variants: year → tiers[] → units[] (Maths KS4)
 * 3. exam-board-variants: Multiple sequences per subject (12 subjects)
 * 4. exam-subject-split: year → examSubjects[] → tiers[] → units[] (Science KS4)
 * 5. unit-options: units have unitOptions[] for specialisms (6 subjects)
 * 6. no-ks4: No KS4 content (Cooking-nutrition)
 * 7. empty: No content for this combination
 *
 * @see ADR-080 Comprehensive Curriculum Data Denormalisation Strategy
 * @see .agent/analysis/curriculum-structure-analysis.md
 */

/**
 * The 7 identified structural patterns in the curriculum API.
 */
export type CurriculumPattern =
  | 'simple-flat' // Patterns 1 & 2: year → units[] → lessons[]
  | 'tier-variants' // Pattern 3: year → tiers[] → units[]
  | 'exam-board-variants' // Pattern 4: Multiple sequences per subject
  | 'exam-subject-split' // Pattern 5: year → examSubjects[] → tiers[] → units[]
  | 'unit-options' // Pattern 6: units have unitOptions[]
  | 'no-ks4' // Pattern 7: No KS4 content
  | 'empty'; // Edge case: No content for this combination

/**
 * Traversal strategy for fetching curriculum data.
 */
export type TraversalStrategy =
  | 'key-stage-lessons' // Use /key-stages/{ks}/subject/{subject}/lessons
  | 'sequence-units' // Use /sequences/{seq}/units with year param
  | 'skip'; // No data available for this combination

/**
 * Configuration for a subject × key stage combination.
 */
export interface PatternConfig {
  /** Primary pattern for this combination */
  readonly pattern: CurriculumPattern;

  /** Additional patterns that combine with the primary */
  readonly combinesWith?: readonly CurriculumPattern[];

  /** Required traversal approach */
  readonly traversal: TraversalStrategy;

  /** For exam board variants: the sequence slugs to query */
  readonly sequences?: readonly string[];

  /** Human-readable notes for debugging */
  readonly notes?: string;
}

/**
 * Key for a subject × key stage combination.
 */
export type SubjectKeyStageKey =
  | 'art:ks1'
  | 'art:ks2'
  | 'art:ks3'
  | 'art:ks4'
  | 'citizenship:ks1'
  | 'citizenship:ks2'
  | 'citizenship:ks3'
  | 'citizenship:ks4'
  | 'computing:ks1'
  | 'computing:ks2'
  | 'computing:ks3'
  | 'computing:ks4'
  | 'cooking-nutrition:ks1'
  | 'cooking-nutrition:ks2'
  | 'cooking-nutrition:ks3'
  | 'cooking-nutrition:ks4'
  | 'design-technology:ks1'
  | 'design-technology:ks2'
  | 'design-technology:ks3'
  | 'design-technology:ks4'
  | 'english:ks1'
  | 'english:ks2'
  | 'english:ks3'
  | 'english:ks4'
  | 'french:ks1'
  | 'french:ks2'
  | 'french:ks3'
  | 'french:ks4'
  | 'geography:ks1'
  | 'geography:ks2'
  | 'geography:ks3'
  | 'geography:ks4'
  | 'german:ks1'
  | 'german:ks2'
  | 'german:ks3'
  | 'german:ks4'
  | 'history:ks1'
  | 'history:ks2'
  | 'history:ks3'
  | 'history:ks4'
  | 'maths:ks1'
  | 'maths:ks2'
  | 'maths:ks3'
  | 'maths:ks4'
  | 'music:ks1'
  | 'music:ks2'
  | 'music:ks3'
  | 'music:ks4'
  | 'physical-education:ks1'
  | 'physical-education:ks2'
  | 'physical-education:ks3'
  | 'physical-education:ks4'
  | 'religious-education:ks1'
  | 'religious-education:ks2'
  | 'religious-education:ks3'
  | 'religious-education:ks4'
  | 'rshe-pshe:ks1'
  | 'rshe-pshe:ks2'
  | 'rshe-pshe:ks3'
  | 'rshe-pshe:ks4'
  | 'science:ks1'
  | 'science:ks2'
  | 'science:ks3'
  | 'science:ks4'
  | 'spanish:ks1'
  | 'spanish:ks2'
  | 'spanish:ks3'
  | 'spanish:ks4';

/**
 * Complete pattern configuration map for all 68 subject × key stage combinations.
 *
 * Pattern assignments verified against:
 * - API responses via MCP tools (2025-12-29)
 * - Bulk download data analysis
 * - curriculum-structure-analysis.md
 */
export const CURRICULUM_PATTERN_CONFIG: Readonly<Record<SubjectKeyStageKey, PatternConfig>> = {
  // ========== ART ==========
  'art:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'art:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'art:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'art:ks4': {
    pattern: 'unit-options',
    traversal: 'key-stage-lessons',
    notes: 'Has unit options for Fine Art, Photography, Textiles, 3D Design, Graphic Comms',
  },

  // ========== CITIZENSHIP ==========
  // No primary content
  'citizenship:ks1': { pattern: 'empty', traversal: 'skip', notes: 'No KS1-KS2 content' },
  'citizenship:ks2': { pattern: 'empty', traversal: 'skip', notes: 'No KS1-KS2 content' },
  'citizenship:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'citizenship:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: ['citizenship-secondary-core', 'citizenship-secondary-gcse'],
    notes: 'Core and GCSE variants',
  },

  // ========== COMPUTING ==========
  'computing:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'computing:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'computing:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'computing:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: [
      'computing-secondary-aqa',
      'computing-secondary-core',
      'computing-secondary-gcse',
      'computing-secondary-ocr',
    ],
    notes: 'AQA, OCR, Core, GCSE variants',
  },

  // ========== COOKING-NUTRITION ==========
  'cooking-nutrition:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'cooking-nutrition:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'cooking-nutrition:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'cooking-nutrition:ks4': { pattern: 'no-ks4', traversal: 'skip', notes: 'No KS4 content' },

  // ========== DESIGN-TECHNOLOGY ==========
  'design-technology:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'design-technology:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'design-technology:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'design-technology:ks4': {
    pattern: 'unit-options',
    traversal: 'key-stage-lessons',
    notes: 'Has unit options for Papers/boards, Polymers/timbers, Textiles',
  },

  // ========== ENGLISH ==========
  'english:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'english:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'english:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'english:ks4': {
    pattern: 'exam-board-variants',
    combinesWith: ['unit-options'],
    traversal: 'sequence-units',
    sequences: ['english-secondary-aqa', 'english-secondary-edexcel', 'english-secondary-eduqas'],
    notes: 'AQA, Edexcel, Eduqas + unit options for text choices (different novels)',
  },

  // ========== FRENCH ==========
  // No KS1 content (starts KS2)
  'french:ks1': { pattern: 'empty', traversal: 'skip', notes: 'French starts at KS2' },
  'french:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'french:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'french:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: ['french-secondary-aqa', 'french-secondary-edexcel'],
    notes: 'AQA, Edexcel',
  },

  // ========== GEOGRAPHY ==========
  'geography:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'geography:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'geography:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'geography:ks4': {
    pattern: 'exam-board-variants',
    combinesWith: ['unit-options'],
    traversal: 'sequence-units',
    sequences: ['geography-secondary-aqa', 'geography-secondary-edexcelb'],
    notes: 'AQA, Edexcel B + unit options for Coastal, River, Glacial landscapes',
  },

  // ========== GERMAN ==========
  // No primary content
  'german:ks1': { pattern: 'empty', traversal: 'skip', notes: 'German is secondary only' },
  'german:ks2': { pattern: 'empty', traversal: 'skip', notes: 'German is secondary only' },
  'german:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'german:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: ['german-secondary-aqa', 'german-secondary-edexcel'],
    notes: 'AQA, Edexcel',
  },

  // ========== HISTORY ==========
  'history:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'history:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'history:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'history:ks4': {
    pattern: 'exam-board-variants',
    combinesWith: ['unit-options'],
    traversal: 'sequence-units',
    sequences: ['history-secondary-aqa', 'history-secondary-edexcel'],
    notes: 'AQA, Edexcel + unit options for Battle of Hastings, Durham Cathedral, etc.',
  },

  // ========== MATHS ==========
  'maths:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'maths:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'maths:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'maths:ks4': {
    pattern: 'tier-variants',
    traversal: 'sequence-units',
    sequences: ['maths-secondary'],
    notes: 'Must extract tier from response.tiers[]. No exam boards.',
  },

  // ========== MUSIC ==========
  'music:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'music:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'music:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'music:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: [
      'music-secondary-aqa',
      'music-secondary-edexcel',
      'music-secondary-eduqas',
      'music-secondary-ocr',
    ],
    notes: 'AQA, Edexcel, Eduqas, OCR',
  },

  // ========== PHYSICAL-EDUCATION ==========
  'physical-education:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'physical-education:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'physical-education:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'physical-education:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: [
      'physical-education-secondary-aqa',
      'physical-education-secondary-core',
      'physical-education-secondary-edexcel',
      'physical-education-secondary-gcse',
      'physical-education-secondary-ocr',
    ],
    notes: 'AQA, Edexcel, OCR, Core, GCSE',
  },

  // ========== RELIGIOUS-EDUCATION ==========
  'religious-education:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'religious-education:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'religious-education:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'religious-education:ks4': {
    pattern: 'exam-board-variants',
    combinesWith: ['unit-options'],
    traversal: 'sequence-units',
    sequences: [
      'religious-education-secondary-aqa',
      'religious-education-secondary-core',
      'religious-education-secondary-edexcelb',
      'religious-education-secondary-eduqas',
    ],
    notes: 'AQA, Edexcel B, Eduqas, Core + unit options for Buddhism vs Islam beliefs/practices',
  },

  // ========== RSHE-PSHE ==========
  'rshe-pshe:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'rshe-pshe:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'rshe-pshe:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'rshe-pshe:ks4': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },

  // ========== SCIENCE ==========
  'science:ks1': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'science:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'science:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'science:ks4': {
    pattern: 'exam-subject-split',
    combinesWith: ['exam-board-variants', 'tier-variants'],
    traversal: 'sequence-units',
    sequences: ['science-secondary-aqa', 'science-secondary-edexcel', 'science-secondary-ocr'],
    notes:
      'CRITICAL: /key-stages/ks4/subject/science/lessons returns EMPTY. ' +
      'Must traverse examSubjects[] (biology, chemistry, physics, combined-science) → tiers[].',
  },

  // ========== SPANISH ==========
  // No KS1 content (starts KS2)
  'spanish:ks1': { pattern: 'empty', traversal: 'skip', notes: 'Spanish starts at KS2' },
  'spanish:ks2': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'spanish:ks3': { pattern: 'simple-flat', traversal: 'key-stage-lessons' },
  'spanish:ks4': {
    pattern: 'exam-board-variants',
    traversal: 'sequence-units',
    sequences: ['spanish-secondary-aqa', 'spanish-secondary-edexcel'],
    notes: 'AQA, Edexcel',
  },
} as const;

/**
 * Get pattern configuration for a subject × key stage combination.
 */
export function getPatternConfig(subject: string, keyStage: string): PatternConfig | undefined {
  // Safe assertion: function validates against config at runtime
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const key = `${subject}:${keyStage}` as SubjectKeyStageKey;
  return CURRICULUM_PATTERN_CONFIG[key];
}
