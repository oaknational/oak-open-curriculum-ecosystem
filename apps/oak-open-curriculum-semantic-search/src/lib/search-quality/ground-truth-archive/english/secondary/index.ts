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
import { ENGLISH_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { ENGLISH_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { ENGLISH_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { ENGLISH_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { ENGLISH_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { ENGLISH_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { ENGLISH_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { ENGLISH_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const ENGLISH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    ENGLISH_SECONDARY_PRECISE_TOPIC_QUERY,
    ENGLISH_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    ENGLISH_SECONDARY_NATURAL_EXPRESSION_QUERY,
    ENGLISH_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    ENGLISH_SECONDARY_IMPRECISE_INPUT_QUERY,
    ENGLISH_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(ENGLISH_SECONDARY_CROSS_TOPIC_QUERY, ENGLISH_SECONDARY_CROSS_TOPIC_EXPECTED),
] as const;

// Re-export query definitions and expected relevance
export { ENGLISH_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { ENGLISH_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { ENGLISH_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { ENGLISH_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { ENGLISH_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { ENGLISH_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { ENGLISH_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { ENGLISH_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
