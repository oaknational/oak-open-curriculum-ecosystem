/**
 * Primary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { MUSIC_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { MUSIC_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { MUSIC_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { MUSIC_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { MUSIC_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { MUSIC_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { MUSIC_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { MUSIC_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const MUSIC_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(MUSIC_PRIMARY_PRECISE_TOPIC_QUERY, MUSIC_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    MUSIC_PRIMARY_NATURAL_EXPRESSION_QUERY,
    MUSIC_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(MUSIC_PRIMARY_IMPRECISE_INPUT_QUERY, MUSIC_PRIMARY_IMPRECISE_INPUT_EXPECTED),
  combineGroundTruth(MUSIC_PRIMARY_CROSS_TOPIC_QUERY, MUSIC_PRIMARY_CROSS_TOPIC_EXPECTED),
] as const;
