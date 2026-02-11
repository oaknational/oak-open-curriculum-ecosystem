/**
 * API method factories for Oak SDK client.
 *
 * Split by responsibility:
 * - lesson-methods: Lesson transcripts, summaries, and listings
 * - unit-methods: Unit listings and summaries
 * - sequence-methods: Subject sequences and sequence units
 * - asset-methods: Subject assets
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 * @see {@link ../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md}
 */

export {
  makeGetLessonTranscript,
  makeGetLessonSummary,
  makeGetLessonsByKeyStageAndSubject,
} from './lesson-methods';

export { makeGetUnitsByKeyStageAndSubject, makeGetUnitSummary } from './unit-methods';

export { makeGetSubjectSequences, makeGetSequenceUnits } from './sequence-methods';

export { makeGetSubjectAssets } from './asset-methods';
