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
 * Entries marked [MINED-2025-12-26] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples.
 *
 * @packageDocumentation
 */

import { computingSynonyms } from './computing.js';
import { educationalAcronymSynonyms, genericSynonyms } from './education.js';
import { englishSynonyms } from './english.js';
import { examBoardSynonyms } from './exam-boards.js';
import { geographySynonyms } from './geography.js';
import { historySynonyms } from './history.js';
import { keyStageSynonyms } from './key-stages.js';
import { mathsSynonyms } from './maths.js';
import { musicSynonyms } from './music.js';
import { numberSynonyms } from './numbers.js';
import { scienceSynonyms } from './science.js';
import { subjectSynonyms } from './subjects.js';

// Re-export individual modules for direct access
export { computingSynonyms } from './computing.js';
export { educationalAcronymSynonyms, genericSynonyms } from './education.js';
export { englishSynonyms } from './english.js';
export { examBoardSynonyms } from './exam-boards.js';
export { geographySynonyms } from './geography.js';
export { historySynonyms } from './history.js';
export { keyStageSynonyms } from './key-stages.js';
export { mathsSynonyms } from './maths.js';
export { musicSynonyms } from './music.js';
export { numberSynonyms } from './numbers.js';
export { scienceSynonyms } from './science.js';
export { subjectSynonyms } from './subjects.js';

/**
 * Combined synonyms data object.
 *
 * This contains only the synonym mappings without metadata.
 * Metadata (description, note) is added in ontologyData for AI agent context.
 */
export const synonymsData = {
  subjects: subjectSynonyms,
  numbers: numberSynonyms,
  keyStages: keyStageSynonyms,
  examBoards: examBoardSynonyms,
  geographyThemes: geographySynonyms,
  historyTopics: historySynonyms,
  mathsConcepts: mathsSynonyms,
  englishConcepts: englishSynonyms,
  scienceConcepts: scienceSynonyms,
  computingConcepts: computingSynonyms,
  musicConcepts: musicSynonyms,
  generic: genericSynonyms,
  educationalAcronyms: educationalAcronymSynonyms,
} as const;

export type SynonymsData = typeof synonymsData;
