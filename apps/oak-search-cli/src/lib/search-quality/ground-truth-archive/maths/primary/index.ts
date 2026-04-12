/**
 * Primary ground truth queries - 13 queries (3 per category + 1 control).
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 *
 * precise-topic-4 is a control query for imprecise-input-2, with same expected
 * slugs but no typos, to isolate fuzzy matching and tokenization effects.
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { MATHS_PRIMARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { MATHS_PRIMARY_PRECISE_TOPIC_2_QUERY } from './precise-topic-2.query';
import { MATHS_PRIMARY_PRECISE_TOPIC_3_QUERY } from './precise-topic-3.query';
import { MATHS_PRIMARY_PRECISE_TOPIC_4_QUERY } from './precise-topic-4.query';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_2_QUERY } from './natural-expression-2.query';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_3_QUERY } from './natural-expression-3.query';
import { MATHS_PRIMARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { MATHS_PRIMARY_IMPRECISE_INPUT_2_QUERY } from './imprecise-input-2.query';
import { MATHS_PRIMARY_IMPRECISE_INPUT_3_QUERY } from './imprecise-input-3.query';
import { MATHS_PRIMARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
import { MATHS_PRIMARY_CROSS_TOPIC_2_QUERY } from './cross-topic-2.query';
import { MATHS_PRIMARY_CROSS_TOPIC_3_QUERY } from './cross-topic-3.query';

// Import expected relevance
import { MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { MATHS_PRIMARY_PRECISE_TOPIC_2_EXPECTED } from './precise-topic-2.expected';
import { MATHS_PRIMARY_PRECISE_TOPIC_3_EXPECTED } from './precise-topic-3.expected';
import { MATHS_PRIMARY_PRECISE_TOPIC_4_EXPECTED } from './precise-topic-4.expected';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_2_EXPECTED } from './natural-expression-2.expected';
import { MATHS_PRIMARY_NATURAL_EXPRESSION_3_EXPECTED } from './natural-expression-3.expected';
import { MATHS_PRIMARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { MATHS_PRIMARY_IMPRECISE_INPUT_2_EXPECTED } from './imprecise-input-2.expected';
import { MATHS_PRIMARY_IMPRECISE_INPUT_3_EXPECTED } from './imprecise-input-3.expected';
import { MATHS_PRIMARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
import { MATHS_PRIMARY_CROSS_TOPIC_2_EXPECTED } from './cross-topic-2.expected';
import { MATHS_PRIMARY_CROSS_TOPIC_3_EXPECTED } from './cross-topic-3.expected';

/** All queries for this subject/phase */
export const MATHS_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  // Precise topic queries
  combineGroundTruth(MATHS_PRIMARY_PRECISE_TOPIC_QUERY, MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED),
  combineGroundTruth(MATHS_PRIMARY_PRECISE_TOPIC_2_QUERY, MATHS_PRIMARY_PRECISE_TOPIC_2_EXPECTED),
  combineGroundTruth(MATHS_PRIMARY_PRECISE_TOPIC_3_QUERY, MATHS_PRIMARY_PRECISE_TOPIC_3_EXPECTED),
  combineGroundTruth(MATHS_PRIMARY_PRECISE_TOPIC_4_QUERY, MATHS_PRIMARY_PRECISE_TOPIC_4_EXPECTED), // control for imprecise-input-2
  // Natural expression queries
  combineGroundTruth(
    MATHS_PRIMARY_NATURAL_EXPRESSION_QUERY,
    MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    MATHS_PRIMARY_NATURAL_EXPRESSION_2_QUERY,
    MATHS_PRIMARY_NATURAL_EXPRESSION_2_EXPECTED,
  ),
  combineGroundTruth(
    MATHS_PRIMARY_NATURAL_EXPRESSION_3_QUERY,
    MATHS_PRIMARY_NATURAL_EXPRESSION_3_EXPECTED,
  ),
  // Imprecise input queries
  combineGroundTruth(MATHS_PRIMARY_IMPRECISE_INPUT_QUERY, MATHS_PRIMARY_IMPRECISE_INPUT_EXPECTED),
  combineGroundTruth(
    MATHS_PRIMARY_IMPRECISE_INPUT_2_QUERY,
    MATHS_PRIMARY_IMPRECISE_INPUT_2_EXPECTED,
  ),
  combineGroundTruth(
    MATHS_PRIMARY_IMPRECISE_INPUT_3_QUERY,
    MATHS_PRIMARY_IMPRECISE_INPUT_3_EXPECTED,
  ),
  // Cross topic queries
  combineGroundTruth(MATHS_PRIMARY_CROSS_TOPIC_QUERY, MATHS_PRIMARY_CROSS_TOPIC_EXPECTED),
  combineGroundTruth(MATHS_PRIMARY_CROSS_TOPIC_2_QUERY, MATHS_PRIMARY_CROSS_TOPIC_2_EXPECTED),
  combineGroundTruth(MATHS_PRIMARY_CROSS_TOPIC_3_QUERY, MATHS_PRIMARY_CROSS_TOPIC_3_EXPECTED),
] as const;
