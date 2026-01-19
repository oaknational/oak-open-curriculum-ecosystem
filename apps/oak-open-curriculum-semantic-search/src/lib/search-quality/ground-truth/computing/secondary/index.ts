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
import { COMPUTING_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { COMPUTING_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { COMPUTING_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { COMPUTING_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { COMPUTING_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { COMPUTING_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { COMPUTING_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { COMPUTING_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const COMPUTING_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    COMPUTING_SECONDARY_PRECISE_TOPIC_QUERY,
    COMPUTING_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    COMPUTING_SECONDARY_NATURAL_EXPRESSION_QUERY,
    COMPUTING_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    COMPUTING_SECONDARY_IMPRECISE_INPUT_QUERY,
    COMPUTING_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    COMPUTING_SECONDARY_CROSS_TOPIC_QUERY,
    COMPUTING_SECONDARY_CROSS_TOPIC_EXPECTED,
  ),
] as const;

// Re-export query definitions and expected relevance
export { COMPUTING_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { COMPUTING_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { COMPUTING_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { COMPUTING_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { COMPUTING_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { COMPUTING_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { COMPUTING_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { COMPUTING_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
