/**
 * Primary ground truth queries - 13 queries.
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { SCIENCE_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { SCIENCE_PRIMARY_PRECISE_TOPIC_2_QUERY } from './precise-topic-2.query';
import { SCIENCE_PRIMARY_PRECISE_TOPIC_3_QUERY } from './precise-topic-3.query';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION_2_QUERY } from './natural-expression-2.query';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_QUERY } from './natural-expression-3.query';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT_2_QUERY } from './imprecise-input-2.query';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT_3_QUERY } from './imprecise-input-3.query';
import { SCIENCE_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
import { SCIENCE_PRIMARY_CROSS_TOPIC_2_QUERY } from './cross-topic-2.query';
import { SCIENCE_PRIMARY_CROSS_TOPIC_3_QUERY } from './cross-topic-3.query';
import { SCIENCE_PRIMARY_CROSS_TOPIC_4_QUERY } from './cross-topic-4.query';

// Import expected relevance
import { SCIENCE_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { SCIENCE_PRIMARY_PRECISE_TOPIC_2_EXPECTED } from './precise-topic-2.expected';
import { SCIENCE_PRIMARY_PRECISE_TOPIC_3_EXPECTED } from './precise-topic-3.expected';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION_2_EXPECTED } from './natural-expression-2.expected';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_EXPECTED } from './natural-expression-3.expected';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT_2_EXPECTED } from './imprecise-input-2.expected';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT_3_EXPECTED } from './imprecise-input-3.expected';
import { SCIENCE_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
import { SCIENCE_PRIMARY_CROSS_TOPIC_2_EXPECTED } from './cross-topic-2.expected';
import { SCIENCE_PRIMARY_CROSS_TOPIC_3_EXPECTED } from './cross-topic-3.expected';
import { SCIENCE_PRIMARY_CROSS_TOPIC_4_EXPECTED } from './cross-topic-4.expected';

/** All queries for this subject/phase */
export const SCIENCE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  // Precise topic queries
  combineGroundTruth(SCIENCE_PRIMARY_PRECISE_TOPIC_QUERY, SCIENCE_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(
    SCIENCE_PRIMARY_PRECISE_TOPIC_2_QUERY,
    SCIENCE_PRIMARY_PRECISE_TOPIC_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_PRIMARY_PRECISE_TOPIC_3_QUERY,
    SCIENCE_PRIMARY_PRECISE_TOPIC_3_EXPECTED,
  ),
  // Natural expression queries
  combineGroundTruth(
    SCIENCE_PRIMARY_NATURAL_EXPRESSION_QUERY,
    SCIENCE_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_PRIMARY_NATURAL_EXPRESSION_2_QUERY,
    SCIENCE_PRIMARY_NATURAL_EXPRESSION_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_QUERY,
    SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_EXPECTED,
  ),
  // Imprecise input queries
  combineGroundTruth(
    SCIENCE_PRIMARY_IMPRECISE_INPUT_QUERY,
    SCIENCE_PRIMARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_PRIMARY_IMPRECISE_INPUT_2_QUERY,
    SCIENCE_PRIMARY_IMPRECISE_INPUT_2_EXPECTED,
  ),
  combineGroundTruth(
    SCIENCE_PRIMARY_IMPRECISE_INPUT_3_QUERY,
    SCIENCE_PRIMARY_IMPRECISE_INPUT_3_EXPECTED,
  ),
  // Cross topic queries
  combineGroundTruth(SCIENCE_PRIMARY_CROSS_TOPIC_QUERY, SCIENCE_PRIMARY_CROSS_TOPIC_EXPECTED),
  combineGroundTruth(SCIENCE_PRIMARY_CROSS_TOPIC_2_QUERY, SCIENCE_PRIMARY_CROSS_TOPIC_2_EXPECTED),
  combineGroundTruth(SCIENCE_PRIMARY_CROSS_TOPIC_3_QUERY, SCIENCE_PRIMARY_CROSS_TOPIC_3_EXPECTED),
  combineGroundTruth(SCIENCE_PRIMARY_CROSS_TOPIC_4_QUERY, SCIENCE_PRIMARY_CROSS_TOPIC_4_EXPECTED),
] as const;
