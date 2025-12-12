/**
 * Experiment library exports.
 *
 * @module experiments/lib
 */

export type {
  RetrievalMode,
  ContentType,
  ModeMetrics,
  ModeResults,
  ContentTypeExperiment,
} from './experiment-types.js';

export { runLessonExperiments, runUnitExperiments } from './experiment-runners.js';
export { logAllResults } from './experiment-logging.js';
