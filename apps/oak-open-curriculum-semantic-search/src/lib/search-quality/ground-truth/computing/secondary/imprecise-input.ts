/**
 * Imprecise-input ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Verified: sql-searches is THE lesson about querying (SELECT). sql-fundamentals teaches foundational SQL (INSERT/UPDATE/DELETE). */
export const COMPUTING_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'databse querying lessons',
    category: 'imprecise-input',
    priority: 'critical',
    description:
      'Tests typo recovery for "databse" → "database". sql-searches (score=3) teaches SELECT which IS querying. sql-fundamentals (score=2) teaches foundational SQL syntax (INSERT/UPDATE/DELETE) — not querying itself, but related foundation.',
    expectedRelevance: {
      'sql-searches': 3,
      'sql-fundamentals': 2,
    },
  },
] as const;
