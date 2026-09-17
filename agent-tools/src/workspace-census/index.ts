/**
 * Workspace classification census — enumeration and validation
 * instrument. Governing record:
 * `.agent/plans/delivery/workspace-classification-census.plan.md`
 * (ratified 2026-08-12; execution gate discharged at the owner's word
 * 2026-08-14). This package owns the MECHANICAL side of the census: the
 * subject predicate, the closed column vocabularies, row validation,
 * the legacy-matrix parser, and the delta derivation. Judged readings
 * (classifications, target states, thinnest-slice dispositions) are
 * data the instrument validates, never facts it invents.
 *
 * This barrel exports the instrument's consumed surface only (the CLI
 * wires the commands; the vocabularies stay module-internal until a
 * second consumer — the survey-machinery ledger instrument — earns
 * their export per consolidate-at-second-consumer).
 */
export { CODE_EXTENSIONS } from './vocabulary.js';
export { deriveSubjects, type CensusSubject } from './subjects.js';
export { validateRows, type CensusRow } from './rows.js';
export { computeDelta, parseLegacyMatrix } from './delta.js';
export { parseRowsArtefactJson } from './artefact.js';
export { parseMemberList } from './inputs.js';
export { renderMatrixString } from './render-command.js';
