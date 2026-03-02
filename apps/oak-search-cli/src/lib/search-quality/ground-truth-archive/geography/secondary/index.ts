/**
 * Secondary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { GEOGRAPHY_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { GEOGRAPHY_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { GEOGRAPHY_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { GEOGRAPHY_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const GEOGRAPHY_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    GEOGRAPHY_SECONDARY_PRECISE_TOPIC_QUERY,
    GEOGRAPHY_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_QUERY,
    GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_QUERY,
    GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    GEOGRAPHY_SECONDARY_CROSS_TOPIC_QUERY,
    GEOGRAPHY_SECONDARY_CROSS_TOPIC_EXPECTED,
  ),
] as const;

// Re-export query definitions and expected relevance
export { GEOGRAPHY_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { GEOGRAPHY_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { GEOGRAPHY_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { GEOGRAPHY_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
