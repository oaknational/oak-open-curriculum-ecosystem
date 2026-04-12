/**
 * Secondary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { GERMAN_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { GERMAN_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { GERMAN_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { GERMAN_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { GERMAN_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { GERMAN_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { GERMAN_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { GERMAN_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const GERMAN_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(GERMAN_SECONDARY_PRECISE_TOPIC_QUERY, GERMAN_SECONDARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    GERMAN_SECONDARY_NATURAL_EXPRESSION_QUERY,
    GERMAN_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    GERMAN_SECONDARY_IMPRECISE_INPUT_QUERY,
    GERMAN_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(GERMAN_SECONDARY_CROSS_TOPIC_QUERY, GERMAN_SECONDARY_CROSS_TOPIC_EXPECTED),
] as const;
