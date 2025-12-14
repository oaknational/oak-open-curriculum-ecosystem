/**
 * Discover lessons from Maths KS4 for ground truth population.
 *
 * This script queries the search API to find actual lesson slugs,
 * which are needed to populate the ground truth relevance judgments.
 *
 * @usage
 * ```bash
 * cd apps/oak-open-curriculum-semantic-search
 * pnpm dev &  # Start server
 * sleep 5
 * npx tsx scripts/discover-lessons.ts
 * ```
 *
 * @output Prints lesson slugs and titles for each test query
 */

import { HybridResponseLessons } from '../src/lib/openapi.schemas.js';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3003';

const TEST_QUERIES = [
  'Pythagoras theorem',
  'quadratic equations',
  'trigonometry',
  'simultaneous equations',
  'expanding brackets',
  'pythagorus', // Misspelling
  'how to solve equations with x squared', // Natural language
] as const;

async function searchLessons(query: string) {
  const response = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: query,
      scope: 'lessons',
      subject: 'maths',
      keyStage: 'ks4',
      size: 10,
    }),
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  const raw: unknown = await response.json();
  return HybridResponseLessons.parse(raw);
}

function printHeader(): void {
  console.log('='.repeat(60));
  console.log('Maths KS4 Lesson Discovery');
  console.log('='.repeat(60));
  console.log(`\nBase URL: ${BASE_URL}\n`);
}

function printFooter(): void {
  console.log('\n' + '='.repeat(60));
  console.log('NEXT STEPS:');
  console.log('1. Copy the slugs above into ground-truth.ts');
  console.log('2. Replace 0 with relevance scores (3=high, 2=relevant, 1=marginal)');
  console.log('3. Run pnpm test:e2e -- search-quality');
  console.log('='.repeat(60));
}

function printQueryResults(
  query: string,
  data: ReturnType<typeof HybridResponseLessons.parse>,
): void {
  console.log('query: ', query);
  console.log(`Total hits: ${data.total}, took: ${data.took}ms`);
  console.log(`\nTop 10 results (for ground truth):\n`);
  console.log('expectedRelevance: {');
  for (const result of data.results) {
    console.log(`  '${result.lesson.lesson_slug}': 0, // ${result.lesson.lesson_title}`);
  }
  console.log('},');
}

async function discoverLessons(): Promise<void> {
  printHeader();

  for (const query of TEST_QUERIES) {
    console.log(`\n--- Query: "${query}" ---\n`);
    try {
      const data = await searchLessons(query);
      printQueryResults(query, data);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  printFooter();
}

discoverLessons().catch((error) => {
  console.error('Discovery failed:', error);
  process.exit(1);
});
