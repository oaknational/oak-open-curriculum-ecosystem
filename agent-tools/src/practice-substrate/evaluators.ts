/**
 * Compatibility barrel for pure Practice substrate evaluators.
 */

export { evaluateLegacyEventRoot, evaluateRetiredPathReferences } from './path-evaluators.js';
export {
  evaluateMergeClassDeclarations,
  evaluateStableIdentityCollisions,
} from './metadata-evaluators.js';
export {
  evaluateConflictMarkers,
  evaluateGeneratedReadModelDrift,
  evaluateParseState,
} from './structural-evaluators.js';
export { classifyRepairPreservation, evaluateMergeTopology } from './topology-evaluators.js';
export { evaluateOpenQuestions } from './open-questions-evaluator.js';
