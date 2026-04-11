/**
 * Primary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { ART_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { ART_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { ART_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { ART_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { ART_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { ART_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { ART_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { ART_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const ART_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(ART_PRIMARY_PRECISE_TOPIC_QUERY, ART_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(ART_PRIMARY_NATURAL_EXPRESSION_QUERY, ART_PRIMARY_NATURAL_EXPRESSION_EXPECTED),
  combineGroundTruth(ART_PRIMARY_IMPRECISE_INPUT_QUERY, ART_PRIMARY_IMPRECISE_INPUT_EXPECTED),
  combineGroundTruth(ART_PRIMARY_CROSS_TOPIC_QUERY, ART_PRIMARY_CROSS_TOPIC_EXPECTED),
] as const;
