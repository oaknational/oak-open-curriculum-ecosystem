/**
 * Intent-based query deep analysis.
 *
 * Investigates WHY intent-based queries fail, examining actual results
 * and the gap between query intent and indexed metadata.
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

interface IntentQuery {
  readonly query: string;
  readonly expected: readonly string[];
  readonly intentType: string;
  readonly missingCapability: string;
}

const INTENT_QUERIES: readonly IntentQuery[] = [
  {
    query: 'challenging extension work for able mathematicians',
    expected: [
      'problem-solving-with-functions-and-proof',
      'problem-solving-with-iteration',
      'problem-solving-with-circle-theorems',
    ],
    intentType: 'difficulty + audience',
    missingCapability: 'Cannot map "able mathematicians" → Higher tier or problem-solving lessons',
  },
  {
    query: 'visual introduction to vectors for beginners',
    expected: ['column-vectors', 'algebraic-vector-notation', 'addition-with-vectors'],
    intentType: 'teaching approach + sequencing',
    missingCapability:
      'No lesson style (visual/practical) or sequencing position (intro/consolidation) metadata',
  },
];

/**
 * Analyses a single intent-based query.
 */
async function analyseQuery(q: IntentQuery): Promise<void> {
  const request = buildLessonRrfRequest({
    text: q.query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });
  const response = await esSearch<SearchLessonsIndexDoc>(request);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`QUERY: "${q.query}"`);
  console.log(`INTENT TYPE: ${q.intentType}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`\nEXPECTED: ${q.expected.slice(0, 3).join(', ')}`);
  console.log(`\nACTUAL TOP 10:`);

  response.hits.hits.forEach((hit, i) => {
    const doc = hit._source;
    const slug = doc.lesson_slug;
    const title = doc.lesson_title;
    const tiers = doc.tiers?.join(',') ?? 'none';
    const isExpected = q.expected.includes(slug);
    const marker = isExpected ? '✅ MATCH' : '';
    console.log(`  ${i + 1}. ${slug}`);
    console.log(`     Title: ${title}`);
    console.log(`     Tiers: ${tiers} ${marker}`);
  });

  const foundPositions = q.expected
    .map((e) => response.hits.hits.findIndex((h) => h._source.lesson_slug === e) + 1)
    .filter((i) => i > 0);

  console.log(
    `\nRESULT: Expected found at positions: ${foundPositions.length > 0 ? foundPositions.join(', ') : 'NOT IN TOP 10'}`,
  );
  console.log(`MISSING CAPABILITY: ${q.missingCapability}`);
}

/** Prints the root cause analysis summary. */
function printRootCauseAnalysis(): void {
  console.log('\n\n' + '='.repeat(70));
  console.log('ROOT CAUSE ANALYSIS');
  console.log('='.repeat(70));
  console.log(`
WHAT WE HAVE INDEXED:
  ✅ tier/tiers - Foundation/Higher (for KS4)
  ✅ lesson_keywords, key_learning_points, pupil_lesson_outcome
  ✅ teacher_tips, misconceptions - pedagogical support
  ✅ years - year group (10, 11)

WHAT INTENT-BASED QUERIES NEED:
  ❌ Lesson type classification (intro/consolidation/extension/problem-solving)
  ❌ Teaching approach metadata (visual/practical/discussion-based)
  ❌ NL→metadata mapping ("able mathematicians" → tier:higher)

WHAT WE HAVE NOT OPTIMISED:
  ❌ Tier-based boosting for difficulty queries
  ❌ Lesson title pattern matching ("problem-solving-*" → extension)
  ❌ Query intent classification, LLM query expansion

POTENTIAL IMPROVEMENTS:
  Tier 1: Add synonyms "extension/challenging" → "problem-solving"
  Tier 2: Use thread sequencing for lesson positioning
  Tier 4: LLM query classification and expansion
`);
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  console.log('INTENT-BASED QUERY DEEP ANALYSIS');
  console.log('Investigating WHY these queries fail\n');

  for (const q of INTENT_QUERIES) {
    await analyseQuery(q);
  }

  printRootCauseAnalysis();
}

main().catch(console.error);
