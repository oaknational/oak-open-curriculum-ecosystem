/**
 * Deep analysis of colloquial query performance.
 *
 * Investigates WHY colloquial queries (informal language) succeed or fail,
 * examining actual results and the gap between informal phrasing and indexed content.
 *
 * @packageDocumentation
 */
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(thisDir, '../../.env.local') });
dotenvConfig({ path: resolve(thisDir, '../../../../.env') });

import { esSearch } from '../../src/lib/elastic-http';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders';
import type { SearchLessonsIndexDoc } from '../../src/types/oak';

interface ColloquialQuery {
  readonly query: string;
  readonly expected: readonly string[];
  readonly description: string;
}

const COLLOQUIAL_QUERIES: readonly ColloquialQuery[] = [
  {
    query: 'that sohcahtoa stuff for triangles',
    expected: [
      'applying-trigonometric-ratios-in-context',
      'problem-solving-with-right-angled-trigonometry',
      'checking-and-securing-understanding-of-tangent-ratio-problems',
    ],
    description: 'SOHCAHTOA acronym + informal "that...stuff" phrasing',
  },
  {
    query: 'the bit where you complete the square',
    expected: [
      'solving-quadratic-equations-by-completing-the-square',
      'solving-complex-quadratic-equations-by-completing-the-square',
      'factorising-using-the-difference-of-two-squares',
    ],
    description: '"the bit where" noise + actual term',
  },
];

/** Print query header. */
function printQueryHeader(query: string, description: string): void {
  console.log('='.repeat(70));
  console.log(`QUERY: "${query}"`);
  console.log(`DESCRIPTION: ${description}`);
  console.log('='.repeat(70));
  console.log('');
}

/** Print expected slugs. */
function printExpected(expected: readonly string[]): void {
  console.log('EXPECTED SLUGS:');
  expected.forEach((slug) => console.log(`  - ${slug}`));
  console.log('');
}

/** Print results and return positions of expected matches. */
function printResults(
  hits: readonly { _source: SearchLessonsIndexDoc }[],
  expected: readonly string[],
): readonly number[] {
  console.log('ACTUAL TOP 20 RESULTS:');
  const positions: number[] = [];

  hits.forEach((hit, i) => {
    const src = hit._source;
    const isExpected = expected.includes(src.lesson_slug);
    if (isExpected) {
      positions.push(i + 1);
    }
    const marker = isExpected ? ' ✅ EXPECTED' : '';
    console.log(`${(i + 1).toString().padStart(3)}. ${src.lesson_slug}${marker}`);
    console.log(`       Title: ${src.lesson_title}`);
    if (src.lesson_keywords) {
      console.log(`       Keywords: ${src.lesson_keywords.join(', ')}`);
    }
  });

  return positions;
}

/** Print analysis summary. */
function printAnalysis(positions: readonly number[]): void {
  console.log('');
  console.log('ANALYSIS:');
  if (positions.length === 0) {
    console.log('  ❌ None of the expected lessons found in top 20');
  } else {
    console.log(`  Expected found at positions: ${positions.join(', ')}`);
    const mrr = 1 / positions[0];
    console.log(`  MRR: ${mrr.toFixed(3)}`);
  }
}

/** Print trigonometry content summary. */
function printTrigSummary(hits: readonly { _source: SearchLessonsIndexDoc }[]): void {
  const trigContent = hits.filter((hit) => {
    const slug = hit._source.lesson_slug;
    const title = hit._source.lesson_title.toLowerCase();
    return (
      slug.includes('trig') ||
      title.includes('trig') ||
      title.includes('sine') ||
      title.includes('cosine') ||
      title.includes('tangent')
    );
  });

  console.log('');
  console.log(`TRIGONOMETRY-RELATED IN TOP 20: ${trigContent.length} lessons`);
  trigContent.forEach((hit) => {
    const pos = hits.indexOf(hit) + 1;
    console.log(`  ${pos}. ${hit._source.lesson_slug}`);
  });
  console.log('');
}

/** Analyze a single colloquial query. */
async function analyzeQuery(q: ColloquialQuery): Promise<void> {
  printQueryHeader(q.query, q.description);
  printExpected(q.expected);

  const request = buildLessonRrfRequest({
    text: q.query,
    size: 20,
    subject: 'maths',
    keyStage: 'ks4',
  });

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  const positions = printResults(response.hits.hits, q.expected);
  printAnalysis(positions);
  printTrigSummary(response.hits.hits);
}

/** Print root cause analysis. */
function printRootCause(): void {
  console.log('='.repeat(70));
  console.log('ROOT CAUSE ANALYSIS');
  console.log('='.repeat(70));
  console.log('');
  console.log('Query 1 ("sohcahtoa") issues:');
  console.log('  - "sohcahtoa" is a mnemonic acronym for Sin/Cos/Tan ratios');
  console.log('  - Synonym exists: sohcahtoa → trigonometry (in maths.ts)');
  console.log('  - "that...stuff for" is noise that should be filtered');
  console.log('  - Expected lessons may not contain "sohcahtoa" in content');
  console.log('');
  console.log('Query 2 ("complete the square") issues:');
  console.log('  - "the bit where you" is noise that gets filtered (B.4)');
  console.log('  - "complete the square" is the actual search term');
  console.log('  - This query should work well due to noise filtering');
  console.log('');
}

/** Main entry point. */
async function main(): Promise<void> {
  console.log('COLLOQUIAL QUERY DEEP ANALYSIS');
  console.log('Investigating performance of informal language queries');
  console.log('');

  for (const q of COLLOQUIAL_QUERIES) {
    await analyzeQuery(q);
  }

  printRootCause();
}

main().catch(console.error);
