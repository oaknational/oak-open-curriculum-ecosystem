/**
 * Secondary ground truth queries - 5 queries (1 per category + 1 additional cross-topic).
 *
 * This index combines query definitions and expected relevance using
 * combineGroundTruth() at runtime.
 *
 * @packageDocumentation
 */
import { combineGroundTruth, type GroundTruthQuery } from '../../types';

// Import query definitions
import { RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
import { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_QUERY } from './cross-topic-2.query';

// Import expected relevance
import { RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
import { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_EXPECTED } from './cross-topic-2.expected';

/** All queries for this subject/phase */
export const RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY,
    RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_QUERY,
    RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY,
    RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY,
    RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_QUERY,
    RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_EXPECTED,
  ),
] as const;

// Re-export query definitions and expected relevance
export { RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_QUERY } from './cross-topic-2.query';
export { RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
export { RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_EXPECTED } from './cross-topic-2.expected';
