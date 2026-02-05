/**
 * Secondary ground truth queries - 19 queries total.
 *
 * - 14 general secondary queries (4 natural-expression, 4 imprecise-input, 3 per other category)
 * - 4 KS4 subject filter queries (biology, chemistry, physics, combined-science)
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 *
 * @packageDocumentation
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import KS4 subject filter queries
import { SCIENCE_KS4_ALL_QUERIES } from './ks4';

// Import query definitions
import { SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { SCIENCE_SECONDARY_PRECISE_TOPIC_2_QUERY } from './precise-topic-2.query';
import { SCIENCE_SECONDARY_PRECISE_TOPIC_3_QUERY } from './precise-topic-3.query';
import { SCIENCE_SECONDARY_PRECISE_TOPIC_4_QUERY } from './precise-topic-4.query';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_QUERY } from './natural-expression-2.query';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_QUERY } from './natural-expression-3.query';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_QUERY } from './natural-expression-4.query';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_2_QUERY } from './imprecise-input-2.query';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_3_QUERY } from './imprecise-input-3.query';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_4_QUERY } from './imprecise-input-4.query';
import { SCIENCE_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
import { SCIENCE_SECONDARY_CROSS_TOPIC_2_QUERY } from './cross-topic-2.query';
import { SCIENCE_SECONDARY_CROSS_TOPIC_3_QUERY } from './cross-topic-3.query';

// Import expected relevance
import { SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { SCIENCE_SECONDARY_PRECISE_TOPIC_2_EXPECTED } from './precise-topic-2.expected';
import { SCIENCE_SECONDARY_PRECISE_TOPIC_3_EXPECTED } from './precise-topic-3.expected';
import { SCIENCE_SECONDARY_PRECISE_TOPIC_4_EXPECTED } from './precise-topic-4.expected';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_EXPECTED } from './natural-expression-2.expected';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_EXPECTED } from './natural-expression-3.expected';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_EXPECTED } from './natural-expression-4.expected';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_2_EXPECTED } from './imprecise-input-2.expected';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_3_EXPECTED } from './imprecise-input-3.expected';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT_4_EXPECTED } from './imprecise-input-4.expected';
import { SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
import { SCIENCE_SECONDARY_CROSS_TOPIC_2_EXPECTED } from './cross-topic-2.expected';
import { SCIENCE_SECONDARY_CROSS_TOPIC_3_EXPECTED } from './cross-topic-3.expected';

/** All queries for this subject/phase */
export const SCIENCE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  // Precise topic queries
  combineGroundTruth(
    SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY,
    SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_PRECISE_TOPIC_2_QUERY,
    SCIENCE_SECONDARY_PRECISE_TOPIC_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_PRECISE_TOPIC_3_QUERY,
    SCIENCE_SECONDARY_PRECISE_TOPIC_3_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_PRECISE_TOPIC_4_QUERY,
    SCIENCE_SECONDARY_PRECISE_TOPIC_4_EXPECTED,
  ),
  // Natural expression queries
  combineGroundTruth(
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY,
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_QUERY,
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_QUERY,
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_QUERY,
    SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_EXPECTED,
  ),
  // Imprecise input queries
  combineGroundTruth(
    SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY,
    SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_IMPRECISE_INPUT_2_QUERY,
    SCIENCE_SECONDARY_IMPRECISE_INPUT_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_IMPRECISE_INPUT_3_QUERY,
    SCIENCE_SECONDARY_IMPRECISE_INPUT_3_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_IMPRECISE_INPUT_4_QUERY,
    SCIENCE_SECONDARY_IMPRECISE_INPUT_4_EXPECTED,
  ),
  // Cross topic queries
  combineGroundTruth(SCIENCE_SECONDARY_CROSS_TOPIC_QUERY, SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED),
  combineGroundTruth(
    SCIENCE_SECONDARY_CROSS_TOPIC_2_QUERY,
    SCIENCE_SECONDARY_CROSS_TOPIC_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_SECONDARY_CROSS_TOPIC_3_QUERY,
    SCIENCE_SECONDARY_CROSS_TOPIC_3_EXPECTED,
  ),
  // KS4 subject filter queries
  ...SCIENCE_KS4_ALL_QUERIES,
] as const;

// Re-export query definitions
export { SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_2_QUERY } from './precise-topic-2.query';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_3_QUERY } from './precise-topic-3.query';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_4_QUERY } from './precise-topic-4.query';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_QUERY } from './natural-expression-2.query';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_QUERY } from './natural-expression-3.query';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_QUERY } from './natural-expression-4.query';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_2_QUERY } from './imprecise-input-2.query';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_3_QUERY } from './imprecise-input-3.query';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_4_QUERY } from './imprecise-input-4.query';
export { SCIENCE_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { SCIENCE_SECONDARY_CROSS_TOPIC_2_QUERY } from './cross-topic-2.query';
export { SCIENCE_SECONDARY_CROSS_TOPIC_3_QUERY } from './cross-topic-3.query';

// Re-export expected relevance
export { SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_2_EXPECTED } from './precise-topic-2.expected';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_3_EXPECTED } from './precise-topic-3.expected';
export { SCIENCE_SECONDARY_PRECISE_TOPIC_4_EXPECTED } from './precise-topic-4.expected';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_EXPECTED } from './natural-expression-2.expected';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_EXPECTED } from './natural-expression-3.expected';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_EXPECTED } from './natural-expression-4.expected';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_2_EXPECTED } from './imprecise-input-2.expected';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_3_EXPECTED } from './imprecise-input-3.expected';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT_4_EXPECTED } from './imprecise-input-4.expected';
export { SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
export { SCIENCE_SECONDARY_CROSS_TOPIC_2_EXPECTED } from './cross-topic-2.expected';
export { SCIENCE_SECONDARY_CROSS_TOPIC_3_EXPECTED } from './cross-topic-3.expected';

// Re-export KS4 subject filter queries
export {
  SCIENCE_KS4_ALL_QUERIES,
  SCIENCE_KS4_BIOLOGY_QUERIES,
  SCIENCE_KS4_CHEMISTRY_QUERIES,
  SCIENCE_KS4_PHYSICS_QUERIES,
  SCIENCE_KS4_COMBINED_SCIENCE_QUERIES,
  SCIENCE_KS4_BIOLOGY_FILTER_QUERY,
  SCIENCE_KS4_CHEMISTRY_FILTER_QUERY,
  SCIENCE_KS4_PHYSICS_FILTER_QUERY,
  SCIENCE_KS4_COMBINED_SCIENCE_FILTER_QUERY,
  SCIENCE_KS4_BIOLOGY_FILTER_EXPECTED,
  SCIENCE_KS4_CHEMISTRY_FILTER_EXPECTED,
  SCIENCE_KS4_PHYSICS_FILTER_EXPECTED,
  SCIENCE_KS4_COMBINED_SCIENCE_FILTER_EXPECTED,
} from './ks4';
