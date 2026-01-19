/**
 * Secondary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 *
 * @packageDocumentation
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { SCIENCE_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const SCIENCE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY,
    SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY,
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY,
    SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(SCIENCE_SECONDARY_CROSS_TOPIC_QUERY, SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED),
] as const;

// Re-export query definitions and expected relevance
export { SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { SCIENCE_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
