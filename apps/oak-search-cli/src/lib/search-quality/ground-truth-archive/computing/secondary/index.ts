/**
 * Secondary ground truth queries - 5 queries (4 standard + 1 future-intent).
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 *
 * NOTE: future-intent queries are excluded from aggregate statistics
 * but included in benchmarks to track progress toward future capabilities.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { COMPUTING_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { COMPUTING_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { COMPUTING_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { COMPUTING_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
import { COMPUTING_SECONDARY_FUTURE_INTENT_QUERY } from './future-intent.query';

// Import expected relevance
import { COMPUTING_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { COMPUTING_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { COMPUTING_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { COMPUTING_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
import { COMPUTING_SECONDARY_FUTURE_INTENT_EXPECTED } from './future-intent.expected';

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
  // future-intent: excluded from aggregate stats, tracks Level 3-4 progress
  combineGroundTruth(
    COMPUTING_SECONDARY_FUTURE_INTENT_QUERY,
    COMPUTING_SECONDARY_FUTURE_INTENT_EXPECTED,
  ),
] as const;
