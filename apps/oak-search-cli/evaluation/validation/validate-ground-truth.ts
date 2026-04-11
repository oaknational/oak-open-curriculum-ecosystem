/**
 * Ground truth validation script.
 *
 * Validates all ground truth entries against:
 * 1. Generated slug data from bulk downloads
 * 2. Structural validation (Zod schemas)
 * 3. Semantic validation (completeness, consistency)
 * 4. Entry-level coverage (category distribution)
 *
 * ## Type Safety
 *
 * The `GroundTruthQuery` type enforces required fields at compile time:
 * - `category` - Required (TypeScript enforced)
 * - `priority` - Required (TypeScript enforced)
 * - `description` - Required (TypeScript enforced)
 *
 * Missing these fields will cause `pnpm type-check` to fail.
 *
 * ## Check Categories (18 total)
 *
 * **Entry-level (2 checks)**:
 * - Duplicate queries within entry
 * - Category coverage (required categories with minimums)
 *
 * **Per-query (16 checks)**:
 * - Slug existence, format, cross-subject
 * - Score validity (1-3), distribution, highly-relevant presence
 * - Query length (3-10 words), slug count (2-5)
 * - Phase/KS4 consistency
 * - Zod schema validation
 *
 * Run with: pnpm ground-truth:validate
 * Generate types first: pnpm bulk:codegen
 *
 * @see GROUND-TRUTH-GUIDE.md
 * @see ADR-085 Ground Truth Validation Discipline
 */

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllGroundTruthEntries } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import { typeSafeKeys, typeSafeEntries } from '@oaknational/curriculum-sdk';
import {
  ALL_LESSON_SLUGS,
  TOTAL_LESSON_SLUG_COUNT,
  getSubjectForSlug,
  validateGroundTruthQuery,
  BULK_DATA_MANIFEST,
  SUBJECT_PHASE_COUNT,
} from '../../ground-truths/generated/index.js';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth-archive/types.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
const generatedDir = resolve(thisDir, '../../ground-truths/generated');

// ============================================================================
// Types
// ============================================================================

/**
 * A validation issue found during ground truth validation.
 *
 * Exported for use in unit tests that verify validation behaviour.
 */
export interface ValidationIssue {
  readonly severity: 'error';
  readonly category: string;
  readonly entry: string;
  readonly query?: string;
  readonly slug?: string;
  readonly message: string;
}

interface ValidationSummary {
  readonly totalQueries: number;
  readonly totalSlugs: number;
  readonly errors: number;
  readonly issuesByCategory: Map<string, number>;
}

// ============================================================================
// Validation Checks
// ============================================================================

/**
 * Check 1: All slugs exist in bulk data.
 */
function checkSlugExistence(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  const slugs = typeSafeKeys(query.expectedRelevance);
  for (const slug of slugs) {
    if (!ALL_LESSON_SLUGS.has(slug)) {
      issues.push({
        severity: 'error',
        category: 'invalid-slug',
        entry,
        query: query.query,
        slug,
        message: `Slug not found in bulk data: ${slug}`,
      });
    }
  }
}

/**
 * Check 2: No empty expectedRelevance.
 */
function checkNonEmptyRelevance(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  const slugs = typeSafeKeys(query.expectedRelevance);
  if (slugs.length === 0) {
    issues.push({
      severity: 'error',
      category: 'empty-relevance',
      entry,
      query: query.query,
      message: `Query has empty expectedRelevance - guaranteed MRR=0`,
    });
  }
}

/**
 * Check 3: Relevance scores are 1, 2, or 3.
 */
function checkRelevanceScores(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  for (const [slug, score] of typeSafeEntries(query.expectedRelevance)) {
    if (score !== 1 && score !== 2 && score !== 3) {
      issues.push({
        severity: 'error',
        category: 'invalid-score',
        entry,
        query: query.query,
        slug,
        message: `Invalid relevance score ${score} - must be 1, 2, or 3`,
      });
    }
  }
}

/**
 * Check 4: No duplicate queries within an entry.
 */
function checkDuplicateQueries(
  entry: string,
  queries: readonly GroundTruthQuery[],
  issues: ValidationIssue[],
): void {
  const seen = new Map<string, number>();
  for (const query of queries) {
    const normalizedQuery = query.query.toLowerCase().trim();
    const existingIndex = seen.get(normalizedQuery);
    if (existingIndex !== undefined) {
      issues.push({
        severity: 'error',
        category: 'duplicate-query',
        entry,
        query: query.query,
        message: `Duplicate query (first seen at index ${existingIndex})`,
      });
    } else {
      seen.set(normalizedQuery, seen.size);
    }
  }
}

/**
 * Required categories for consistent coverage.
 *
 * Every subject-phase entry MUST have queries in ALL of these categories
 * to ensure benchmarks are comparable across the curriculum.
 *
 * Categories:
 * - `precise-topic`: Teacher uses curriculum terminology (basic retrieval)
 * - `natural-expression`: Teacher uses everyday language (vocabulary bridging)
 * - `imprecise-input`: Teacher makes typos (error recovery)
 * - `cross-topic`: Teacher wants intersection content (concept overlap)
 *
 * @see ADR-085 Ground Truth Validation Discipline
 */
export const REQUIRED_CATEGORIES = [
  'precise-topic',
  'natural-expression',
  'imprecise-input',
  'cross-topic',
] as const;

/**
 * Minimum queries per required category.
 *
 * **Updated 2026-01-11**: Per M3 plan and audit decision, each entry
 * now requires exactly 1 query per category (4 total per entry).
 * This ensures consistent, AI-curated ground truths across all subjects.
 *
 * @see M3 plan: .agent/plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md
 * @see Audit: .agent/evaluations/audits/ground-truth-audit-2026-01.md
 */
export type GroundTruthCategorySlug =
  | 'precise-topic'
  | 'natural-expression'
  | 'imprecise-input'
  | 'cross-topic';

export const CATEGORY_MINIMUMS: Readonly<Record<GroundTruthCategorySlug, number>> = {
  'precise-topic': 1,
  'natural-expression': 1,
  'imprecise-input': 1,
  'cross-topic': 1,
};

/**
 * Entry-level check: Category coverage.
 *
 * Each entry must have minimum required category coverage
 * to ensure benchmarks are comparable across subjects/phases.
 *
 * Validates that all categories in {@link REQUIRED_CATEGORIES} have
 * at least the minimum count specified in {@link CATEGORY_MINIMUMS}.
 *
 * @param entry - The entry identifier (e.g., "maths/primary")
 * @param queries - The queries to validate
 * @param issues - Array to push validation issues into (mutated)
 *
 * @example
 * ```typescript
 * const issues: ValidationIssue[] = [];
 * checkCategoryCoverage('maths/primary', queries, issues);
 * if (issues.length > 0) {
 *   console.error('Category coverage errors:', issues);
 * }
 * ```
 */
export function checkCategoryCoverage(
  entry: string,
  queries: readonly GroundTruthQuery[],
  issues: ValidationIssue[],
): void {
  const categoryCounts = new Map<string, number>();

  for (const query of queries) {
    // category is required by TypeScript, so always defined
    const count = categoryCounts.get(query.category) ?? 0;
    categoryCounts.set(query.category, count + 1);
  }

  for (const required of REQUIRED_CATEGORIES) {
    const count = categoryCounts.get(required) ?? 0;
    const minimum = CATEGORY_MINIMUMS[required] ?? 1;

    if (count < minimum) {
      issues.push({
        severity: 'error',
        category: 'category-coverage',
        entry,
        message: `Entry has ${count} '${required}' queries - minimum ${minimum} required for consistent benchmarks`,
      });
    }
  }
}

/**
 * Check 5: No duplicate slugs within a single query's expectedRelevance.
 */
function checkDuplicateSlugsInQuery(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  // Object.entries naturally deduplicates keys, so check for repeated definition
  // This is more of a code review check - object literal syntax would error
  // But worth having for programmatic generation
  const slugs = typeSafeKeys(query.expectedRelevance);
  const uniqueSlugs = new Set(slugs);
  if (uniqueSlugs.size !== slugs.length) {
    issues.push({
      severity: 'error',
      category: 'duplicate-slug-in-query',
      entry,
      query: query.query,
      message: `Query has duplicate slugs in expectedRelevance`,
    });
  }
}

/**
 * Check 6: Query length 3-10 words.
 */
function checkQueryLength(entry: string, query: GroundTruthQuery, issues: ValidationIssue[]): void {
  const words = query.query.trim().split(/\s+/);
  if (words.length < 3) {
    issues.push({
      severity: 'error',
      category: 'short-query',
      entry,
      query: query.query,
      message: `Query is too short (${words.length} words, recommend 3-10)`,
    });
  } else if (words.length > 10) {
    issues.push({
      severity: 'error',
      category: 'long-query',
      entry,
      query: query.query,
      message: `Query is long (${words.length} words, recommend 3-10)`,
    });
  }
}

// NOTE: Category, priority, and description presence checks removed.
// These fields are now REQUIRED in the GroundTruthQuery type.
// Missing fields will cause `pnpm type-check` to fail at compile time.

/**
 * Check 9: Slug format (lowercase, hyphens).
 */
function checkSlugFormat(entry: string, query: GroundTruthQuery, issues: ValidationIssue[]): void {
  const slugs = typeSafeKeys(query.expectedRelevance);
  for (const slug of slugs) {
    // Valid slug format: lowercase letters, numbers, hyphens
    if (!/^[a-z0-9-]+$/.test(slug)) {
      issues.push({
        severity: 'error',
        category: 'slug-format',
        entry,
        query: query.query,
        slug,
        message: `Slug has unusual format (expected lowercase with hyphens)`,
      });
    }
  }
}

/**
 * Check 10: Cross-subject contamination.
 *
 * Validates that slugs in a subject's ground truth actually belong to that subject.
 * For example, maths/primary should only contain maths lessons, not science lessons.
 */
function checkCrossSubjectContamination(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  // Extract subject from entry path (e.g., "maths/primary" -> "maths")
  const parts = entry.split('/');
  if (parts.length < 2) {
    return;
  } // Can't determine subject

  const expectedSubject = parts[0];
  if (expectedSubject === undefined) {
    return;
  }

  const slugs = typeSafeKeys(query.expectedRelevance);
  for (const slug of slugs) {
    const actualSubject = getSubjectForSlug(slug);
    if (actualSubject !== undefined && actualSubject !== expectedSubject) {
      issues.push({
        severity: 'error',
        category: 'cross-subject',
        entry,
        query: query.query,
        slug,
        message: `Slug '${slug}' is from subject '${actualSubject}', expected '${expectedSubject}'`,
      });
    }
  }
}

/**
 * Check 13: Minimum slugs per query.
 *
 * Queries with only 1 expected result are weak - can't distinguish ranking quality.
 * At least 2-3 expected results recommended.
 */
function checkMinimumSlugs(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  const slugCount = typeSafeKeys(query.expectedRelevance).length;
  if (slugCount === 1) {
    issues.push({
      severity: 'error',
      category: 'single-slug',
      entry,
      query: query.query,
      message: `Query has only 1 expected result - recommend 2-3 for ranking quality`,
    });
  }
}

/**
 * Check 14: Score distribution within query.
 *
 * If all scores are identical (e.g., all 3s), the ground truth lacks granularity
 * for evaluating ranking quality. This applies to queries with 2+ slugs.
 */
function checkScoreDistribution(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  const scores = new Set(
    typeSafeKeys(query.expectedRelevance).map((k) => query.expectedRelevance[k]),
  );
  const slugCount = typeSafeKeys(query.expectedRelevance).length;

  // Error if there are 2+ slugs but all same score - can't test ranking quality
  if (slugCount >= 2 && scores.size === 1) {
    const score = [...scores][0];
    issues.push({
      severity: 'error',
      category: 'uniform-scores',
      entry,
      query: query.query,
      message: `All ${slugCount} slugs have same score (${score}) - must vary relevance for ranking tests`,
    });
  }
}

/**
 * Check 15: At least one highly relevant (score=3) result.
 *
 * Queries should have at least one highly relevant result, otherwise
 * `MRR@k` will be artificially low.
 */
function checkHasHighlyRelevant(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  const hasScore3 = typeSafeKeys(query.expectedRelevance).some(
    (k) => query.expectedRelevance[k] === 3,
  );
  const slugCount = typeSafeKeys(query.expectedRelevance).length;

  if (slugCount > 0 && !hasScore3) {
    issues.push({
      severity: 'error',
      category: 'no-highly-relevant',
      entry,
      query: query.query,
      message: `Query has no highly relevant (score=3) results - may skew MRR`,
    });
  }
}

/**
 * Check 18: Maximum slugs per query.
 *
 * More than 5 expected results indicates the query is too broad.
 * Ground truths should test ranking quality with specific queries.
 */
function checkMaximumSlugs(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  const slugCount = typeSafeKeys(query.expectedRelevance).length;
  if (slugCount > 5) {
    issues.push({
      severity: 'error',
      category: 'too-many-slugs',
      entry,
      query: query.query,
      message: `Query has ${slugCount} expected results - maximum 5 (query may be too broad)`,
    });
  }
}

/**
 * Check 11: Phase consistency (KS4 slugs not in primary).
 */
function checkPhaseConsistency(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  // If entry contains 'primary', check that keyStage is ks1 or ks2
  // If entry contains 'secondary', check that keyStage is ks3 or ks4
  const isPrimary = entry.includes('primary');
  const isSecondary = entry.includes('secondary');

  if (query.keyStage !== undefined) {
    const isKs1Or2 = query.keyStage === 'ks1' || query.keyStage === 'ks2';
    const isKs3Or4 = query.keyStage === 'ks3' || query.keyStage === 'ks4';

    if (isPrimary && !isKs1Or2) {
      issues.push({
        severity: 'error',
        category: 'phase-mismatch',
        entry,
        query: query.query,
        message: `Primary entry has non-primary keyStage: ${query.keyStage}`,
      });
    }
    if (isSecondary && !isKs3Or4) {
      issues.push({
        severity: 'error',
        category: 'phase-mismatch',
        entry,
        query: query.query,
        message: `Secondary entry has non-secondary keyStage: ${query.keyStage}`,
      });
    }
  }
}

/**
 * Check 12: KS4 property consistency.
 *
 * If keyStage is ks4, verify it's in a secondary ground truth file.
 */
function checkKs4Consistency(
  entry: string,
  query: GroundTruthQuery,
  issues: ValidationIssue[],
): void {
  if (query.keyStage === 'ks4' && entry.includes('primary')) {
    issues.push({
      severity: 'error',
      category: 'ks4-in-primary',
      entry,
      query: query.query,
      message: `KS4 keyStage in primary ground truth file`,
    });
  }
}

/**
 * Run Zod schema validation.
 */
function checkZodSchema(entry: string, query: GroundTruthQuery, issues: ValidationIssue[]): void {
  const result = validateGroundTruthQuery(query);
  if (!result.success) {
    for (const issue of result.error.issues) {
      issues.push({
        severity: 'error',
        category: 'schema-validation',
        entry,
        query: query.query,
        message: `Schema validation failed: ${issue.message} at ${issue.path.join('.')}`,
      });
    }
  }
}

/**
 * Validate ground truth completeness against the bulk data manifest.
 *
 * Every subject/phase combination in the bulk data should have
 * corresponding ground truth entries in the registry.
 */
function checkManifestCompleteness(
  registryKeys: ReadonlySet<string>,
  issues: ValidationIssue[],
): void {
  for (const row of BULK_DATA_MANIFEST) {
    const key = `${row.subject}/${row.phase}`;
    if (!registryKeys.has(key)) {
      issues.push({
        severity: 'error',
        entry: key,
        category: 'manifest-completeness',
        message: `Bulk data contains ${row.lessonCount} lessons for ${key} but no ground truth entry exists`,
      });
    }
  }
}

// ============================================================================
// Main Validation
// ============================================================================

/**
 * Validate all ground truth entries.
 *
 * Runs 17 validation checks:
 * - 1 manifest-level check (bulk data completeness)
 * - 2 entry-level checks (duplicate queries, category coverage)
 * - 14 per-query checks (slug existence, scores, etc.)
 *
 * NOTE: Category, priority, and description are enforced by TypeScript at compile time.
 * Run `pnpm type-check` to verify these fields are present.
 */
function validateGroundTruths(): readonly ValidationIssue[] {
  const entries = getAllGroundTruthEntries();
  const allIssues: ValidationIssue[] = [];

  const registryKeys = new Set(entries.map((entry) => `${entry.subject}/${entry.phase}`));
  checkManifestCompleteness(registryKeys, allIssues);

  for (const entry of entries) {
    const entryKey = `${entry.subject}/${entry.phase}`;
    const queries = entry.queries;

    // Entry-level checks
    checkDuplicateQueries(entryKey, queries, allIssues);
    checkCategoryCoverage(entryKey, queries, allIssues);

    // Per-query checks (14 checks)
    // NOTE: Category, priority, description presence enforced by TypeScript (pnpm type-check)
    for (const query of queries) {
      checkZodSchema(entryKey, query, allIssues);
      checkSlugExistence(entryKey, query, allIssues);
      checkNonEmptyRelevance(entryKey, query, allIssues);
      checkRelevanceScores(entryKey, query, allIssues);
      checkDuplicateSlugsInQuery(entryKey, query, allIssues);
      checkQueryLength(entryKey, query, allIssues);
      checkSlugFormat(entryKey, query, allIssues);
      checkCrossSubjectContamination(entryKey, query, allIssues);
      checkPhaseConsistency(entryKey, query, allIssues);
      checkKs4Consistency(entryKey, query, allIssues);
      checkMinimumSlugs(entryKey, query, allIssues);
      checkScoreDistribution(entryKey, query, allIssues);
      checkHasHighlyRelevant(entryKey, query, allIssues);
      checkMaximumSlugs(entryKey, query, allIssues);
    }
  }

  return allIssues;
}

/**
 * Compute validation summary.
 */
function computeSummary(issues: readonly ValidationIssue[]): ValidationSummary {
  const entries = getAllGroundTruthEntries();
  let totalQueries = 0;
  let totalSlugs = 0;

  for (const entry of entries) {
    totalQueries += entry.queries.length;
    for (const query of entry.queries) {
      totalSlugs += typeSafeKeys(query.expectedRelevance).length;
    }
  }

  const issuesByCategory = new Map<string, number>();

  for (const issue of issues) {
    const count = issuesByCategory.get(issue.category) ?? 0;
    issuesByCategory.set(issue.category, count + 1);
  }

  return {
    totalQueries,
    totalSlugs,
    errors: issues.length,
    issuesByCategory,
  };
}

/**
 * Print validation issues grouped by category.
 */
function printIssues(issues: readonly ValidationIssue[]): void {
  const byCategory = new Map<string, ValidationIssue[]>();
  for (const issue of issues) {
    const existing = byCategory.get(issue.category) ?? [];
    existing.push(issue);
    byCategory.set(issue.category, existing);
  }

  for (const [category, categoryIssues] of byCategory) {
    console.log(`\n❌ ${category} (${categoryIssues.length}):`);

    // Show first 5 issues per category
    const toShow = categoryIssues.slice(0, 5);
    for (const issue of toShow) {
      console.log(`  ${issue.entry}: ${issue.message}`);
      if (issue.query) {
        console.log(`    Query: "${issue.query.slice(0, 50)}..."`);
      }
      if (issue.slug) {
        console.log(`    Slug: ${issue.slug}`);
      }
    }
    if (categoryIssues.length > 5) {
      console.log(`  ... and ${categoryIssues.length - 5} more`);
    }
  }
}

/**
 * Print summary.
 */
function printSummary(summary: ValidationSummary): void {
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('VALIDATION SUMMARY');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`Total queries:     ${summary.totalQueries}`);
  console.log(`Total slugs:       ${summary.totalSlugs}`);
  console.log(`Valid slugs pool:  ${TOTAL_LESSON_SLUG_COUNT}`);
  console.log(`Errors:            ${summary.errors}`);
  console.log('');

  if (summary.issuesByCategory.size > 0) {
    console.log('Errors by category:');
    for (const [category, count] of summary.issuesByCategory) {
      console.log(`  ${category}: ${count}`);
    }
  }
}

/**
 * Main entry point.
 *
 * Only runs when executed directly as a script, not when imported.
 */
function main(): void {
  console.log('Ground Truth Validation');
  console.log('═══════════════════════\n');

  // Check that generated types exist
  const indexPath = resolve(generatedDir, 'index.ts');
  if (!existsSync(indexPath)) {
    console.error('❌ Generated types not found!');
    console.error('   Run: pnpm bulk:codegen');
    process.exit(1);
  }

  console.log(
    `Validating against ${TOTAL_LESSON_SLUG_COUNT} valid slugs from ${SUBJECT_PHASE_COUNT} subject/phase combinations...\n`,
  );

  const issues = validateGroundTruths();
  const summary = computeSummary(issues);

  if (issues.length === 0) {
    printSummary(summary);
    console.log('\n✅ All ground truth entries are valid!\n');
    process.exit(0);
  }

  printIssues(issues);
  printSummary(summary);

  console.log('\n❌ Validation failed. Fix all errors before running benchmarks.\n');
  console.log('See GROUND-TRUTH-GUIDE.md for how to find valid slugs.\n');
  process.exit(1);
}

// Only run main() when executed directly as a script, not when imported for testing
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
