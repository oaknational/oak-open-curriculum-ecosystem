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
import { MATHS_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { MATHS_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { MATHS_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { MATHS_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { MATHS_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const MATHS_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(MATHS_PRIMARY_PRECISE_TOPIC_QUERY, MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    MATHS_PRIMARY_NATURAL_EXPRESSION_QUERY,
    MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(MATHS_PRIMARY_IMPRECISE_INPUT_QUERY, MATHS_PRIMARY_IMPRECISE_INPUT_EXPECTED),
  combineGroundTruth(MATHS_PRIMARY_CROSS_TOPIC_QUERY, MATHS_PRIMARY_CROSS_TOPIC_EXPECTED),
] as const;

// Re-export query definitions and expected relevance
export { MATHS_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { MATHS_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { MATHS_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { MATHS_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { MATHS_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { MATHS_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
