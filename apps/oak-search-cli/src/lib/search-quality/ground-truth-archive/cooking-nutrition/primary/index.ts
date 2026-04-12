/**
 * Primary ground truth queries - 4 queries, 1 per category.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { COOKING_NUTRITION_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { COOKING_NUTRITION_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { COOKING_NUTRITION_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { COOKING_NUTRITION_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { COOKING_NUTRITION_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { COOKING_NUTRITION_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { COOKING_NUTRITION_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { COOKING_NUTRITION_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const COOKING_NUTRITION_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    COOKING_NUTRITION_PRIMARY_PRECISE_TOPIC_QUERY,
    COOKING_NUTRITION_PRIMARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    COOKING_NUTRITION_PRIMARY_NATURAL_EXPRESSION_QUERY,
    COOKING_NUTRITION_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    COOKING_NUTRITION_PRIMARY_IMPRECISE_INPUT_QUERY,
    COOKING_NUTRITION_PRIMARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    COOKING_NUTRITION_PRIMARY_CROSS_TOPIC_QUERY,
    COOKING_NUTRITION_PRIMARY_CROSS_TOPIC_EXPECTED,
  ),
] as const;
