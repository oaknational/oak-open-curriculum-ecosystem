/**
 * Curriculum domain synonyms - barrel file.
 *
 * This module is the SINGLE SOURCE OF TRUTH for synonyms used across:
 * - MCP tools (natural language understanding)
 * - Search app (Elasticsearch synonym expansion)
 * - Any other consumer needing term normalisation
 *
 * @remarks
 * Synonyms are curated by humans and AI agents working together.
 * Entries marked [MINED-YYYY-MM-DD] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples.
 *
 * [2026-01-16] Complete coverage for all 17 subjects achieved.
 *
 * @packageDocumentation
 */

// ═══════════════════════════════════════════════════════════════════════════
// SUBJECT-SPECIFIC SYNONYMS (alphabetical by subject)
// ═══════════════════════════════════════════════════════════════════════════

import { artSynonyms } from './art.js';
import { citizenshipSynonyms } from './citizenship.js';
import { computingSynonyms } from './computing.js';
import { cookingNutritionSynonyms } from './cooking-nutrition.js';
import { designTechnologySynonyms } from './design-technology.js';
import { englishSynonyms } from './english.js';
import { frenchSynonyms } from './french.js';
import { geographySynonyms } from './geography.js';
import { germanSynonyms } from './german.js';
import { historySynonyms } from './history.js';
import { mathsSynonyms } from './maths.js';
import { musicSynonyms } from './music.js';
import { physicalEducationSynonyms } from './physical-education.js';
import { religiousEducationSynonyms } from './religious-education.js';
import { rshePsheSynonyms } from './rshe-pshe.js';
import { scienceSynonyms } from './science.js';
import { spanishSynonyms } from './spanish.js';

// ═══════════════════════════════════════════════════════════════════════════
// STRUCTURAL/GENERIC SYNONYMS
// ═══════════════════════════════════════════════════════════════════════════

import { educationalAcronymSynonyms, genericSynonyms } from './education.js';
import { examBoardSynonyms } from './exam-boards.js';
import { keyStageSynonyms } from './key-stages.js';
import { numberSynonyms } from './numbers.js';
import { subjectSynonyms } from './subjects.js';

/**
 * Combined synonyms data object.
 *
 * This contains only the synonym mappings without metadata.
 * Metadata (description, note) is added in ontologyData for AI agent context.
 *
 * @remarks
 * Categories are ordered alphabetically within groups:
 * 1. Subject-specific concepts (by subject name)
 * 2. Structural/generic concepts
 */
export const synonymsData = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SUBJECT-SPECIFIC CONCEPTS (alphabetical)
  // ═══════════════════════════════════════════════════════════════════════════
  artConcepts: artSynonyms,
  citizenshipConcepts: citizenshipSynonyms,
  computingConcepts: computingSynonyms,
  cookingNutritionConcepts: cookingNutritionSynonyms,
  designTechnologyConcepts: designTechnologySynonyms,
  englishConcepts: englishSynonyms,
  frenchConcepts: frenchSynonyms,
  geographyThemes: geographySynonyms,
  germanConcepts: germanSynonyms,
  historyTopics: historySynonyms,
  mathsConcepts: mathsSynonyms,
  musicConcepts: musicSynonyms,
  physicalEducationConcepts: physicalEducationSynonyms,
  religiousEducationConcepts: religiousEducationSynonyms,
  rshePsheConcepts: rshePsheSynonyms,
  scienceConcepts: scienceSynonyms,
  spanishConcepts: spanishSynonyms,

  // ═══════════════════════════════════════════════════════════════════════════
  // STRUCTURAL/GENERIC CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════
  educationalAcronyms: educationalAcronymSynonyms,
  examBoards: examBoardSynonyms,
  generic: genericSynonyms,
  keyStages: keyStageSynonyms,
  numbers: numberSynonyms,
  subjects: subjectSynonyms,
} as const;

export type SynonymsData = typeof synonymsData;
