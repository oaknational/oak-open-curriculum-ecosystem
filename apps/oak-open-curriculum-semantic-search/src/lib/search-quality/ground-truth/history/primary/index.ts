/**
 * Primary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 *
 * @packageDocumentation
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { HISTORY_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { HISTORY_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { HISTORY_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { HISTORY_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { HISTORY_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { HISTORY_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { HISTORY_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { HISTORY_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const HISTORY_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(HISTORY_PRIMARY_PRECISE_TOPIC_QUERY, HISTORY_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    HISTORY_PRIMARY_NATURAL_EXPRESSION_QUERY,
    HISTORY_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    HISTORY_PRIMARY_IMPRECISE_INPUT_QUERY,
    HISTORY_PRIMARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(HISTORY_PRIMARY_CROSS_TOPIC_QUERY, HISTORY_PRIMARY_CROSS_TOPIC_EXPECTED),
] as const;

// Re-export query definitions and expected relevance
export { HISTORY_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { HISTORY_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { HISTORY_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { HISTORY_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { HISTORY_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { HISTORY_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { HISTORY_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { HISTORY_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
