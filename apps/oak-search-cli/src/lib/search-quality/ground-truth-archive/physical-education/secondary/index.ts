/**
 * Secondary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { PHYSICAL_EDUCATION_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { PHYSICAL_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { PHYSICAL_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { PHYSICAL_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY,
    PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    PHYSICAL_EDUCATION_SECONDARY_NATURAL_EXPRESSION_QUERY,
    PHYSICAL_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    PHYSICAL_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY,
    PHYSICAL_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY,
    PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED,
  ),
] as const;
