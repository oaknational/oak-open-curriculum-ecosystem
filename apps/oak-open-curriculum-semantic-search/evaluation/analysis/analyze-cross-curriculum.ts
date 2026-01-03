/* eslint max-lines: [error, 500] -- Cross-curriculum analysis requires subject/key-stage mappings and report generation */
/**
 * Cross-curriculum baseline analysis script.
 *
 * Runs ground truth queries against any subject/key stage combination
 * and generates per-category MRR breakdown.
 *
 * **Key Feature**: Per-key-stage query filtering ensures only queries targeting
 * content available in the specified key stage are evaluated. This prevents
 * false negatives when KS3 queries are run against KS4-filtered results.
 *
 * Usage:
 *   npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=english --keyStage=ks4
 *   npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=english --keyStage=ks3
 *   npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=science --keyStage=ks2
 *   npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=maths --keyStage=ks4
 *
 * **Available Subject/Key-Stage Combinations**:
 * - english: ks1, ks2, ks3, ks4
 * - science: ks2, ks3
 * - history: ks2, ks3
 * - geography: ks3
 * - religious-education: ks3
 * - maths: ks4
 * - french, spanish, german: ks3
 * - computing, art, music, design-technology, citizenship: ks3
 * - physical-education: ks3
 * - cooking-nutrition: ks2
 *
 * **Classification**: ANALYSIS SCRIPT (not a test)
 */

// Load environment variables
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '../../.env.local');
const repoRootEnv = resolve(thisDir, '../../../../.env');

dotenvConfig({ path: envLocalPath });
dotenvConfig({ path: repoRootEnv });

// Maths - KS4 only (from main index)
import { ALL_MATHS_GROUND_TRUTH_QUERIES } from '../../src/lib/search-quality/ground-truth/index';

// English - per key stage (from english module)
import {
  ENGLISH_KS4_ALL_QUERIES,
  ENGLISH_KS3_ALL_QUERIES,
  ENGLISH_PRIMARY_ALL_QUERIES,
} from '../../src/lib/search-quality/ground-truth/english';

// Science - per key stage (from science module)
import {
  SCIENCE_KS3_ALL_QUERIES,
  SCIENCE_PRIMARY_ALL_QUERIES,
} from '../../src/lib/search-quality/ground-truth/science';

// History - per key stage (from history module)
import {
  HISTORY_KS3_ALL_QUERIES,
  HISTORY_PRIMARY_ALL_QUERIES,
} from '../../src/lib/search-quality/ground-truth/history';

// Geography - KS3 only (from main index)
import { GEOGRAPHY_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/geography';

// RE - KS3 only (from main index)
import { RE_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/religious-education';

// Languages - KS3 only
import { FRENCH_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/french';
import { SPANISH_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/spanish';
import { GERMAN_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/german';

// Creative - KS3 only
import { COMPUTING_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/computing';
import { ART_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/art';
import { MUSIC_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/music';
import { DT_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/design-technology';

// Other
import { PE_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/physical-education';
import { CITIZENSHIP_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/citizenship';
import { COOKING_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/cooking-nutrition';
import {
  processQueryResult,
  calculateOverallMrr,
  calculateCategoryMrr,
  type QueryBaselineResult,
} from '../../src/lib/search-quality/baseline-runner';
import type {
  QueryCategory,
  GroundTruthQuery,
} from '../../src/lib/search-quality/ground-truth/types';
import { esSearch } from '../../src/lib/elastic-http';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders';
import type { KeyStage, SearchSubjectSlug, SearchLessonsIndexDoc } from '../../src/types/oak';
import { isKeyStage, isSubject } from '@oaknational/oak-curriculum-sdk';

/**
 * Ground truth queries by subject AND key stage.
 *
 * This mapping enables accurate per-key-stage baseline measurement by selecting
 * only the queries that target content available in each key stage.
 *
 * **Key Stage Coverage**:
 * - English: KS1-4 (Primary queries used for both KS1 and KS2)
 * - Science: KS2-3 (Primary = KS2, no KS4 content available)
 * - History: KS2-3 (Primary = KS2)
 * - Maths: KS4 only (KS1-3 ground truths not yet created)
 * - Geography, RE, Languages, Creative subjects: KS3 only
 * - Cooking: KS2 only
 * - RSHE: Deferred (no bulk data)
 *
 * When a subject/KS combination is `null`, no ground truths exist for that combination.
 */
const GROUND_TRUTHS_BY_SUBJECT_AND_KS: Readonly<
  Record<SearchSubjectSlug, Readonly<Partial<Record<KeyStage, readonly GroundTruthQuery[] | null>>>>
> = {
  art: {
    ks3: ART_ALL_QUERIES,
  },
  citizenship: {
    ks3: CITIZENSHIP_ALL_QUERIES,
  },
  computing: {
    ks3: COMPUTING_ALL_QUERIES,
  },
  'cooking-nutrition': {
    ks2: COOKING_ALL_QUERIES,
  },
  'design-technology': {
    ks3: DT_ALL_QUERIES,
  },
  english: {
    ks1: ENGLISH_PRIMARY_ALL_QUERIES,
    ks2: ENGLISH_PRIMARY_ALL_QUERIES,
    ks3: ENGLISH_KS3_ALL_QUERIES,
    ks4: ENGLISH_KS4_ALL_QUERIES,
  },
  french: {
    ks3: FRENCH_ALL_QUERIES,
  },
  geography: {
    ks3: GEOGRAPHY_ALL_QUERIES,
  },
  german: {
    ks3: GERMAN_ALL_QUERIES,
  },
  history: {
    ks2: HISTORY_PRIMARY_ALL_QUERIES,
    ks3: HISTORY_KS3_ALL_QUERIES,
  },
  maths: {
    ks4: ALL_MATHS_GROUND_TRUTH_QUERIES,
  },
  music: {
    ks3: MUSIC_ALL_QUERIES,
  },
  'physical-education': {
    ks3: PE_ALL_QUERIES,
  },
  'religious-education': {
    ks3: RE_ALL_QUERIES,
  },
  'rshe-pshe': {}, // Deferred until bulk data available
  science: {
    ks2: SCIENCE_PRIMARY_ALL_QUERIES,
    ks3: SCIENCE_KS3_ALL_QUERIES,
  },
  spanish: {
    ks3: SPANISH_ALL_QUERIES,
  },
} as const;

/**
 * Gets available key stages for a subject that have ground truths.
 */
function getAvailableKeyStages(subject: SearchSubjectSlug): readonly KeyStage[] {
  const subjectGroundTruths = GROUND_TRUTHS_BY_SUBJECT_AND_KS[subject];
  const keyStages: KeyStage[] = [];
  for (const ks of ['ks1', 'ks2', 'ks3', 'ks4'] as const) {
    if (subjectGroundTruths[ks]) {
      keyStages.push(ks);
    }
  }
  return keyStages;
}

/**
 * Gets ground truth queries for a specific subject/key-stage combination.
 *
 * @returns The queries if available, or null if no ground truths exist for this combination.
 */
function getQueriesForSubjectAndKeyStage(
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): readonly GroundTruthQuery[] | null {
  const subjectGroundTruths = GROUND_TRUTHS_BY_SUBJECT_AND_KS[subject];
  const queries = subjectGroundTruths[keyStage];
  return queries ?? null;
}

/**
 * Default key stage by subject (used when not specified).
 */
const DEFAULT_KEY_STAGES: Readonly<Record<SearchSubjectSlug, KeyStage>> = {
  art: 'ks3',
  citizenship: 'ks3',
  computing: 'ks3',
  'cooking-nutrition': 'ks2',
  'design-technology': 'ks3',
  english: 'ks4',
  french: 'ks3',
  geography: 'ks3',
  german: 'ks3',
  history: 'ks3',
  maths: 'ks4',
  music: 'ks3',
  'physical-education': 'ks3',
  'religious-education': 'ks3',
  'rshe-pshe': 'ks3',
  science: 'ks3',
  spanish: 'ks3',
} as const;

/**
 * Search lessons using 4-way hybrid.
 */
async function searchLessons(
  query: string,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): Promise<{ results: readonly string[]; latencyMs: number }> {
  const start = performance.now();

  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject,
    keyStage,
  });

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  const latencyMs = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.lesson_slug);

  return { results, latencyMs };
}

/**
 * Run baseline for all queries in a subject.
 */
async function runSubjectBaseline(
  queries: readonly GroundTruthQuery[],
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): Promise<readonly QueryBaselineResult[]> {
  const results: QueryBaselineResult[] = [];

  for (const query of queries) {
    const { results: actualResults, latencyMs } = await searchLessons(
      query.query,
      subject,
      keyStage,
    );
    const result = processQueryResult(query, actualResults, latencyMs);
    results.push(result);
  }

  return results;
}

/**
 * All possible categories
 */
const CATEGORIES: readonly QueryCategory[] = [
  'naturalistic',
  'misspelling',
  'synonym',
  'multi-concept',
  'colloquial',
  'intent-based',
] as const;

/** Status and notes based on MRR value */
interface MrrStatusInfo {
  readonly status: string;
  readonly notes: string;
}

/**
 * Determines status and notes for a given MRR value.
 */
function getMrrStatus(mrr: number): MrrStatusInfo {
  if (mrr < 0.3) {
    return { status: '❌ Poor', notes: 'High priority fix' };
  }
  if (mrr < 0.5) {
    return { status: '⚠️ Acceptable', notes: 'Improvement needed' };
  }
  if (mrr < 0.8) {
    return { status: '✅ Good', notes: '' };
  }
  return { status: '✅ Excellent', notes: '' };
}

/**
 * Prints a single category row in the report table.
 */
function printCategoryRow(category: QueryCategory, results: readonly QueryBaselineResult[]): void {
  const categoryResults = results.filter((r) => r.category === category);
  const count = categoryResults.length;
  if (count === 0) {
    return;
  }

  const mrr = calculateCategoryMrr(results, category);
  const { status, notes } = getMrrStatus(mrr);

  console.log(
    `| ${category.padEnd(14)} | ${String(count).padStart(5)} | ${mrr.toFixed(3)} | ${status.padEnd(12)} | ${notes.padEnd(20)} |`,
  );
}

/**
 * Generate per-category breakdown report.
 */
function generateCategoryReport(
  results: readonly QueryBaselineResult[],
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): void {
  console.log('\n' + '='.repeat(80));
  console.log(`PER-CATEGORY MRR BREAKDOWN: ${subject.toUpperCase()} (${keyStage.toUpperCase()})`);
  console.log('='.repeat(80));
  console.log();
  console.log('| Category       | Count | MRR   | Status       | Notes                |');
  console.log('|----------------|-------|-------|--------------|----------------------|');

  for (const category of CATEGORIES) {
    printCategoryRow(category, results);
  }

  console.log();
  console.log('Overall MRR: ' + calculateOverallMrr(results).toFixed(3));
  console.log('Total Queries: ' + results.length);
  console.log('='.repeat(80));
  console.log();
}

/**
 * Prints details for a single query result.
 */
function printQueryDetails(result: QueryBaselineResult): void {
  const found = result.firstRelevantRank !== null;
  const status = found ? `Rank ${result.firstRelevantRank}` : 'Not in top 10';
  const symbol = found ? (result.firstRelevantRank === 1 ? '✅' : '⚠️') : '❌';

  console.log(`${symbol} "${result.query}"`);
  console.log(`   Status: ${status}, MRR: ${result.mrr.toFixed(3)}`);

  const needsDetail = result.firstRelevantRank === null || result.firstRelevantRank > 3;
  if (needsDetail) {
    console.log(`   Expected: ${result.expectedSlugs.slice(0, 2).join(', ')}`);
    console.log(`   Top results: ${result.actualTop10.slice(0, 3).join(', ')}`);
  }

  console.log();
}

/**
 * Prints all results for a category.
 */
function printCategoryBreakdown(
  category: QueryCategory,
  results: readonly QueryBaselineResult[],
): void {
  const categoryResults = results.filter((r) => r.category === category);
  if (categoryResults.length === 0) {
    return;
  }

  console.log(`\n### ${category.toUpperCase()}`);
  console.log();

  categoryResults.forEach(printQueryDetails);
}

/**
 * Generate detailed query-by-query breakdown.
 */
function generateQueryBreakdown(results: readonly QueryBaselineResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('QUERY-BY-QUERY BREAKDOWN');
  console.log('='.repeat(80));
  console.log();

  for (const category of CATEGORIES) {
    printCategoryBreakdown(category, results);
  }

  console.log('='.repeat(80));
}

/** Validates and returns the subject from CLI input. Exits on error. */
function validateSubject(subjectInput: string | undefined): SearchSubjectSlug {
  if (!subjectInput) {
    console.error('Error: --subject is required');
    console.error('Available: maths, english, science, history, geography, religious-education');
    process.exit(1);
  }
  if (!isSubject(subjectInput)) {
    console.error(`Error: Invalid subject "${subjectInput}"`);
    process.exit(1);
  }
  const available = getAvailableKeyStages(subjectInput);
  if (available.length === 0) {
    console.error(`Error: No ground truths for "${subjectInput}"`);
    process.exit(1);
  }
  return subjectInput;
}

/** Resolves key stage from CLI input or default. Exits on error. */
function resolveKeyStage(subject: SearchSubjectSlug, keyStageInput: string | undefined): KeyStage {
  const available = getAvailableKeyStages(subject);
  if (!keyStageInput) {
    const defaultKs = DEFAULT_KEY_STAGES[subject];
    return getQueriesForSubjectAndKeyStage(subject, defaultKs) ? defaultKs : available[0];
  }
  if (!isKeyStage(keyStageInput)) {
    console.error(`Error: Invalid key stage "${keyStageInput}". Valid: ks1, ks2, ks3, ks4`);
    process.exit(1);
  }
  if (!getQueriesForSubjectAndKeyStage(subject, keyStageInput)) {
    console.error(
      `Error: No queries for ${subject} at ${keyStageInput}. Available: ${available.join(', ')}`,
    );
    process.exit(1);
  }
  return keyStageInput;
}

/** Parse command-line arguments. */
function parseCliArgs(): { subject: SearchSubjectSlug; keyStage: KeyStage; verbose: boolean } {
  const { values } = parseArgs({
    options: {
      subject: { type: 'string', short: 's' },
      keyStage: { type: 'string', short: 'k' },
      verbose: { type: 'boolean', short: 'v', default: false },
    },
  });
  const subject = validateSubject(values.subject);
  const keyStage = resolveKeyStage(subject, values.keyStage);
  return { subject, keyStage, verbose: values.verbose ?? false };
}

/**
 * Main analysis function.
 */
async function main(): Promise<void> {
  const { subject, keyStage, verbose } = parseCliArgs();

  // Get queries for this specific subject/key-stage combination
  const queries = getQueriesForSubjectAndKeyStage(subject, keyStage);
  if (!queries) {
    // This should not happen as parseCliArgs validates, but defensive check
    console.error(`No ground truth queries for ${subject} at ${keyStage.toUpperCase()}`);
    const available = getAvailableKeyStages(subject);
    console.error(`Available key stages: ${available.join(', ')}`);
    process.exit(1);
  }

  console.log(`Running ${subject} (${keyStage.toUpperCase()}) baseline analysis...`);
  console.log(`Ground truth queries for this key stage: ${queries.length}`);
  console.log('This will take a few seconds...\n');

  const results = await runSubjectBaseline(queries, subject, keyStage);

  generateCategoryReport(results, subject, keyStage);

  if (verbose) {
    generateQueryBreakdown(results);
  }

  console.log('\nAnalysis complete. Copy the tables above to update baseline documentation.');
}

// Run if called directly
main().catch(console.error);
