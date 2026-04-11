/**
 * Secondary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { FRENCH_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { FRENCH_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { FRENCH_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { FRENCH_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { FRENCH_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { FRENCH_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { FRENCH_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { FRENCH_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const FRENCH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(FRENCH_SECONDARY_PRECISE_TOPIC_QUERY, FRENCH_SECONDARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    FRENCH_SECONDARY_NATURAL_EXPRESSION_QUERY,
    FRENCH_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    FRENCH_SECONDARY_IMPRECISE_INPUT_QUERY,
    FRENCH_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(FRENCH_SECONDARY_CROSS_TOPIC_QUERY, FRENCH_SECONDARY_CROSS_TOPIC_EXPECTED),
] as const;
