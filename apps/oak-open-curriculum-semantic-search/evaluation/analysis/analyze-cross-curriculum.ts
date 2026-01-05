/* eslint max-lines: [error, 580] -- Cross-curriculum analysis with phase/key-stage filtering */
/**
 * Cross-curriculum baseline analysis script with phase-based filtering.
 *
 * Usage: npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=english --phase=primary
 *        npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=maths --keyStage=ks4
 *        npx tsx evaluation/analysis/analyze-cross-curriculum.ts --subject=english --keyStages=ks3,ks4
 *
 * Phase filters expand: primary → ks1,ks2 | secondary → ks3,ks4
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

// Ground truth imports by subject - using phase-aligned exports
import { ALL_MATHS_QUERIES } from '../../src/lib/search-quality/ground-truth/index';
import {
  ENGLISH_SECONDARY_ALL_QUERIES,
  ENGLISH_PRIMARY_ALL_QUERIES,
} from '../../src/lib/search-quality/ground-truth/english';
import {
  SCIENCE_SECONDARY_ALL_QUERIES,
  SCIENCE_PRIMARY_ALL_QUERIES,
} from '../../src/lib/search-quality/ground-truth/science';
import {
  HISTORY_SECONDARY_ALL_QUERIES,
  HISTORY_PRIMARY_ALL_QUERIES,
} from '../../src/lib/search-quality/ground-truth/history';
import { GEOGRAPHY_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/geography';
import { RE_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/religious-education';
import { FRENCH_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/french';
import { SPANISH_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/spanish';
import { GERMAN_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/german';
import { COMPUTING_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/computing';
import { ART_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/art';
import { MUSIC_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/music';
import { DT_ALL_QUERIES } from '../../src/lib/search-quality/ground-truth/design-technology';
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
import {
  type Phase,
  expandPhasesToKeyStages,
} from '../../src/lib/hybrid-search/phase-filter-utils';

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
/**
 * Ground truth queries by subject AND key stage.
 *
 * Uses phase-aligned exports but maps to key stages for ES filtering.
 * Secondary queries cover both KS3 and KS4.
 */
const GROUND_TRUTHS_BY_SUBJECT_AND_KS: Readonly<
  Record<SearchSubjectSlug, Readonly<Partial<Record<KeyStage, readonly GroundTruthQuery[] | null>>>>
> = {
  art: { ks3: ART_ALL_QUERIES },
  citizenship: { ks3: CITIZENSHIP_ALL_QUERIES },
  computing: { ks3: COMPUTING_ALL_QUERIES },
  'cooking-nutrition': { ks2: COOKING_ALL_QUERIES },
  'design-technology': { ks3: DT_ALL_QUERIES },
  english: {
    ks1: ENGLISH_PRIMARY_ALL_QUERIES,
    ks2: ENGLISH_PRIMARY_ALL_QUERIES,
    ks3: ENGLISH_SECONDARY_ALL_QUERIES,
    ks4: ENGLISH_SECONDARY_ALL_QUERIES,
  },
  french: { ks3: FRENCH_ALL_QUERIES },
  geography: { ks3: GEOGRAPHY_ALL_QUERIES },
  german: { ks3: GERMAN_ALL_QUERIES },
  history: { ks2: HISTORY_PRIMARY_ALL_QUERIES, ks3: HISTORY_SECONDARY_ALL_QUERIES },
  maths: { ks3: ALL_MATHS_QUERIES, ks4: ALL_MATHS_QUERIES },
  music: { ks3: MUSIC_ALL_QUERIES },
  'physical-education': { ks3: PE_ALL_QUERIES },
  'religious-education': { ks3: RE_ALL_QUERIES },
  'rshe-pshe': {},
  science: { ks2: SCIENCE_PRIMARY_ALL_QUERIES, ks3: SCIENCE_SECONDARY_ALL_QUERIES },
  spanish: { ks3: SPANISH_ALL_QUERIES },
} as const;

/** Gets available key stages for a subject that have ground truths. */
function getAvailableKeyStages(subject: SearchSubjectSlug): readonly KeyStage[] {
  const gt = GROUND_TRUTHS_BY_SUBJECT_AND_KS[subject];
  return (['ks1', 'ks2', 'ks3', 'ks4'] as const).filter((ks) => gt[ks]);
}

/** Gets ground truth queries for a specific subject/key-stage combination. */
function getQueriesForSubjectAndKeyStage(
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): readonly GroundTruthQuery[] | null {
  return GROUND_TRUTHS_BY_SUBJECT_AND_KS[subject][keyStage] ?? null;
}

/** Default key stage by subject (used when not specified). */
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

/** Search filter options for baseline analysis. */
interface SearchOptions {
  readonly subject: SearchSubjectSlug;
  readonly keyStage?: KeyStage;
  readonly keyStages?: readonly KeyStage[];
  readonly phase?: Phase;
  readonly phases?: readonly Phase[];
  readonly years?: readonly string[];
  readonly examBoards?: readonly string[];
}

/**
 * Search lessons using 4-way hybrid.
 */
async function searchLessons(
  query: string,
  options: SearchOptions,
): Promise<{ results: readonly string[]; latencyMs: number }> {
  const start = performance.now();

  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject: options.subject,
    keyStage: options.keyStage,
    keyStages: options.keyStages ? [...options.keyStages] : undefined,
    phase: options.phase,
    phases: options.phases ? [...options.phases] : undefined,
    years: options.years ? [...options.years] : undefined,
    examBoards: options.examBoards ? [...options.examBoards] : undefined,
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
  options: SearchOptions,
): Promise<readonly QueryBaselineResult[]> {
  const results: QueryBaselineResult[] = [];

  for (const query of queries) {
    const { results: actualResults, latencyMs } = await searchLessons(query.query, options);
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

/** Validates a phase string. */
function isPhase(value: string): value is Phase {
  return value === 'primary' || value === 'secondary';
}

/** Parses comma-separated string into array, filtering invalid values. */
function parseKeyStages(input: string | undefined): KeyStage[] | undefined {
  if (!input) {
    return undefined;
  }
  const values = input.split(',').map((v) => v.trim().toLowerCase());
  const valid: KeyStage[] = [];
  for (const v of values) {
    if (isKeyStage(v)) {
      valid.push(v);
    }
  }
  return valid.length > 0 ? valid : undefined;
}

/** Parses comma-separated string into array. */
function parseStringArray(input: string | undefined): string[] | undefined {
  if (!input) {
    return undefined;
  }
  const values = input.split(',').map((v) => v.trim());
  return values.length > 0 ? values : undefined;
}

/** CLI arguments for the analysis script. */
interface CliArgs {
  readonly subject: SearchSubjectSlug;
  readonly keyStage?: KeyStage;
  readonly keyStages?: readonly KeyStage[];
  readonly phase?: Phase;
  readonly years?: readonly string[];
  readonly examBoards?: readonly string[];
  readonly verbose: boolean;
}

/** Parse command-line arguments. */
function parseCliArgs(): CliArgs {
  const { values } = parseArgs({
    options: {
      subject: { type: 'string', short: 's' },
      keyStage: { type: 'string', short: 'k' },
      keyStages: { type: 'string' },
      phase: { type: 'string', short: 'p' },
      years: { type: 'string', short: 'y' },
      examBoards: { type: 'string', short: 'e' },
      verbose: { type: 'boolean', short: 'v', default: false },
    },
  });

  const subject = validateSubject(values.subject);

  // Handle phase filtering
  let phase: Phase | undefined;
  if (values.phase) {
    if (!isPhase(values.phase)) {
      console.error(`Error: Invalid phase "${values.phase}". Valid: primary, secondary`);
      process.exit(1);
    }
    phase = values.phase;
  }

  // Handle keyStages (comma-separated)
  const keyStages = parseKeyStages(values.keyStages);

  // Resolve single keyStage only if phase and keyStages not provided
  let keyStage: KeyStage | undefined;
  if (!phase && !keyStages) {
    keyStage = resolveKeyStage(subject, values.keyStage);
  }

  return {
    subject,
    keyStage,
    keyStages,
    phase,
    years: parseStringArray(values.years),
    examBoards: parseStringArray(values.examBoards),
    verbose: values.verbose ?? false,
  };
}

/** Result of resolving queries and filter label from CLI args. */
interface ResolvedQueries {
  readonly queries: readonly GroundTruthQuery[];
  readonly filterLabel: string;
}

/** Merges queries from multiple key stages. */
function mergeQueriesFromKeyStages(
  subject: SearchSubjectSlug,
  keyStages: readonly KeyStage[],
): readonly GroundTruthQuery[] {
  const merged: GroundTruthQuery[] = [];
  for (const ks of keyStages) {
    const queries = getQueriesForSubjectAndKeyStage(subject, ks);
    if (queries) {
      merged.push(...queries);
    }
  }
  return merged;
}

/** Resolves queries based on CLI filtering mode (phase, keyStages, or keyStage). Exits on error. */
function resolveQueries(args: CliArgs): ResolvedQueries {
  const { subject } = args;
  if (args.phase) {
    const keyStages = expandPhasesToKeyStages([args.phase]);
    return {
      queries: mergeQueriesFromKeyStages(subject, keyStages),
      filterLabel: `${subject} (phase=${args.phase})`,
    };
  }
  if (args.keyStages?.length) {
    return {
      queries: mergeQueriesFromKeyStages(subject, args.keyStages),
      filterLabel: `${subject} (keyStages=${args.keyStages.join(',')})`,
    };
  }
  if (args.keyStage) {
    const ksQueries = getQueriesForSubjectAndKeyStage(subject, args.keyStage);
    if (!ksQueries) {
      console.error(
        `No queries for ${subject} at ${args.keyStage.toUpperCase()}. Available: ${getAvailableKeyStages(subject).join(', ')}`,
      );
      return process.exit(1);
    }
    return { queries: ksQueries, filterLabel: `${subject} (${args.keyStage.toUpperCase()})` };
  }
  console.error('Error: Must specify --keyStage, --keyStages, or --phase');
  return process.exit(1);
}

/** Builds SearchOptions from CLI args. */
function buildSearchOptions(args: CliArgs): SearchOptions {
  return {
    subject: args.subject,
    keyStage: args.keyStage,
    keyStages: args.keyStages,
    phase: args.phase,
    years: args.years,
    examBoards: args.examBoards,
  };
}

/** Formats filter description for display. */
function formatFilters(args: CliArgs): string {
  const parts: string[] = [];
  if (args.phase) {
    parts.push(`phase=${args.phase}`);
  }
  if (args.keyStages) {
    parts.push(`keyStages=${args.keyStages.join(',')}`);
  }
  if (args.keyStage) {
    parts.push(`keyStage=${args.keyStage}`);
  }
  if (args.years) {
    parts.push(`years=${args.years.join(',')}`);
  }
  if (args.examBoards) {
    parts.push(`examBoards=${args.examBoards.join(',')}`);
  }
  return parts.length > 0 ? parts.join(', ') : 'none';
}

/** Main analysis function. */
async function main(): Promise<void> {
  const args = parseCliArgs();
  const { queries, filterLabel } = resolveQueries(args);
  if (queries.length === 0) {
    console.error(`No ground truth queries found for ${filterLabel}`);
    process.exit(1);
  }
  console.log(
    `Running ${filterLabel} baseline analysis...\nFilters: ${formatFilters(args)}\nQueries: ${queries.length}\n`,
  );
  const results = await runSubjectBaseline(queries, buildSearchOptions(args));
  const reportKs = args.keyStage ?? (args.phase ? expandPhasesToKeyStages([args.phase])[0] : 'ks3');
  generateCategoryReport(results, args.subject, reportKs);
  if (args.verbose) {
    generateQueryBreakdown(results);
  }
  console.log('\nAnalysis complete. Copy the tables above to update baseline documentation.');
}

// Run if called directly
main().catch(console.error);
