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
import { SPANISH_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { SPANISH_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { SPANISH_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { SPANISH_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { SPANISH_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { SPANISH_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { SPANISH_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { SPANISH_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const SPANISH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(SPANISH_PRIMARY_PRECISE_TOPIC_QUERY, SPANISH_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    SPANISH_PRIMARY_NATURAL_EXPRESSION_QUERY,
    SPANISH_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    SPANISH_PRIMARY_IMPRECISE_INPUT_QUERY,
    SPANISH_PRIMARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(SPANISH_PRIMARY_CROSS_TOPIC_QUERY, SPANISH_PRIMARY_CROSS_TOPIC_EXPECTED),
] as const;

// Re-export query definitions and expected relevance
export { SPANISH_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { SPANISH_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { SPANISH_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { SPANISH_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { SPANISH_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { SPANISH_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { SPANISH_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { SPANISH_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
