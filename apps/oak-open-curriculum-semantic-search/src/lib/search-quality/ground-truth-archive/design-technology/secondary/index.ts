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
import { DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
import { DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
import { DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
import { DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';

// Import expected relevance
import { DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
import { DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
import { DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
import { DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';

/** All queries for this subject/phase */
export const DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_QUERY,
    DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_EXPECTED,
  ),
  combineGroundTruth(
    DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_QUERY,
    DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_EXPECTED,
  ),
  combineGroundTruth(
    DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_QUERY,
    DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_EXPECTED,
  ),
  combineGroundTruth(
    DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_QUERY,
    DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_EXPECTED,
  ),
] as const;

// Re-export query definitions and expected relevance
export { DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_QUERY } from './precise-topic.query';
export { DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_QUERY } from './natural-expression.query';
export { DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_QUERY } from './imprecise-input.query';
export { DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_QUERY } from './cross-topic.query';
export { DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_EXPECTED } from './precise-topic.expected';
export { DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_EXPECTED } from './natural-expression.expected';
export { DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_EXPECTED } from './imprecise-input.expected';
export { DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_EXPECTED } from './cross-topic.expected';
