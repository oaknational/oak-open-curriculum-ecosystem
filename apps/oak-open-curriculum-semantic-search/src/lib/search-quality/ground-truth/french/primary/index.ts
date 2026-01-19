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
import { FRENCH_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { FRENCH_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { FRENCH_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { FRENCH_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { FRENCH_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { FRENCH_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { FRENCH_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { FRENCH_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const FRENCH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(FRENCH_PRIMARY_PRECISE_TOPIC_QUERY, FRENCH_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    FRENCH_PRIMARY_NATURAL_EXPRESSION_QUERY,
    FRENCH_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(FRENCH_PRIMARY_IMPRECISE_INPUT_QUERY, FRENCH_PRIMARY_IMPRECISE_INPUT_EXPECTED),
  combineGroundTruth(FRENCH_PRIMARY_CROSS_TOPIC_QUERY, FRENCH_PRIMARY_CROSS_TOPIC_EXPECTED),
] as const;

// Re-export query definitions and expected relevance
export { FRENCH_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { FRENCH_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { FRENCH_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { FRENCH_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { FRENCH_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { FRENCH_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { FRENCH_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { FRENCH_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
