#!/usr/bin/env npx tsx
/* eslint-disable max-lines-per-function, max-statements, complexity, max-lines */
/**
 * @module ingest-all-combinations
 * @description Systematically ingest all combinations of subjects, keystages, and indexes.
 * Tracks progress and can resume after interruptions or failures.
 *
 * Usage:
 *   pnpm ingest:all              # Run all combinations
 *   pnpm ingest:all --resume     # Resume from last checkpoint
 *   pnpm ingest:all --dry-run    # Preview without ingesting
 *   pnpm ingest:all --reset      # Reset progress and start fresh
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

// All possible subjects from the OpenAPI schema
// TODO: This should be generated from the OpenAPI schema
const ALL_SUBJECTS = [
  'art',
  'citizenship',
  'computing',
  'cooking-nutrition',
  'design-technology',
  'english',
  'french',
  'geography',
  'german',
  'history',
  'maths',
  'music',
  'physical-education',
  'religious-education',
  'rshe-pshe',
  'science',
  'spanish',
] as const;

// All possible key stages
// TODO: This should be generated from the OpenAPI schema
const ALL_KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;

// All possible index kinds
// TODO: This should be generated from the OpenAPI schema
const ALL_INDEX_KINDS = [
  'lessons',
  'unit_rollup',
  'units',
  'sequences',
  'sequence_facets',
] as const;

type Subject = (typeof ALL_SUBJECTS)[number];
type KeyStage = (typeof ALL_KEY_STAGES)[number];
type IndexKind = (typeof ALL_INDEX_KINDS)[number];

interface Combination {
  subject: Subject;
  keyStage: KeyStage;
  index: IndexKind;
  id: string; // Unique identifier for this combination
}

interface CombinationResult {
  combination: Combination;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  exitCode?: number;
  error?: string;
  documentsIngested?: number;
}

interface ProgressState {
  startedAt: string;
  lastUpdatedAt: string;
  totalCombinations: number;
  completed: number;
  failed: number;
  skipped: number;
  results: CombinationResult[];
}

const PROGRESS_FILE = join(process.cwd(), '.ingest-progress.json');

/**
 * Generate all possible combinations of subject/keystage/index.
 */
function generateCombinations(): Combination[] {
  const combinations: Combination[] = [];

  for (const subject of ALL_SUBJECTS) {
    for (const keyStage of ALL_KEY_STAGES) {
      for (const index of ALL_INDEX_KINDS) {
        const id = `${subject}-${keyStage}-${index}`;
        combinations.push({ subject, keyStage, index, id });
      }
    }
  }

  return combinations;
}

/**
 * Load existing progress from disk, or create a new state.
 */
function loadProgress(): ProgressState {
  if (!existsSync(PROGRESS_FILE)) {
    const combinations = generateCombinations();
    return {
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      totalCombinations: combinations.length,
      completed: 0,
      failed: 0,
      skipped: 0,
      results: combinations.map((combination) => ({
        combination,
        status: 'pending',
      })),
    };
  }

  const json = readFileSync(PROGRESS_FILE, 'utf-8');
  return JSON.parse(json) as ProgressState;
}

/**
 * Save current progress to disk.
 */
function saveProgress(state: ProgressState): void {
  state.lastUpdatedAt = new Date().toISOString();
  writeFileSync(PROGRESS_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Reset progress file and start fresh.
 */
function resetProgress(): ProgressState {
  if (existsSync(PROGRESS_FILE)) {
    writeFileSync(PROGRESS_FILE + '.backup', readFileSync(PROGRESS_FILE));
    console.log(`📦 Backed up existing progress to ${PROGRESS_FILE}.backup`);
  }
  const combinations = generateCombinations();
  const state: ProgressState = {
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    totalCombinations: combinations.length,
    completed: 0,
    failed: 0,
    skipped: 0,
    results: combinations.map((combination) => ({
      combination,
      status: 'pending',
    })),
  };
  saveProgress(state);
  return state;
}

/**
 * Run the ingestion CLI for a specific combination.
 */
function runIngestion(
  combination: Combination,
  dryRun: boolean,
): Promise<{ exitCode: number; error?: string }> {
  return new Promise((resolve) => {
    const args = [
      'src/lib/elasticsearch/setup/ingest-live.ts',
      '--subject',
      combination.subject,
      '--keystage',
      combination.keyStage,
      '--index',
      combination.index,
      '--verbose',
    ];

    if (dryRun) {
      args.push('--dry-run');
    }

    const child = spawn('npx', ['tsx', ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('close', (code) => {
      resolve({ exitCode: code ?? 1 });
    });

    child.on('error', (err) => {
      resolve({ exitCode: 1, error: err.message });
    });
  });
}

/**
 * Print current progress statistics.
 */
function printProgress(state: ProgressState): void {
  const pending = state.results.filter((r) => r.status === 'pending').length;
  const running = state.results.filter((r) => r.status === 'running').length;
  const percentage = (
    ((state.completed + state.failed + state.skipped) / state.totalCombinations) *
    100
  ).toFixed(1);

  console.log('\n📊 Progress Summary:');
  console.log(`   Total: ${state.totalCombinations} combinations`);
  console.log(`   ✅ Completed: ${state.completed}`);
  console.log(`   ❌ Failed: ${state.failed}`);
  console.log(`   ⏭️  Skipped: ${state.skipped}`);
  console.log(`   ⏳ Pending: ${pending}`);
  console.log(`   🏃 Running: ${running}`);
  console.log(`   Progress: ${percentage}%\n`);
}

/**
 * Print recent failures for debugging.
 */
function printRecentFailures(state: ProgressState): void {
  const failures = state.results.filter((r) => r.status === 'failed');

  if (failures.length === 0) {
    return;
  }

  console.log('❌ Recent Failures:');
  failures.slice(-5).forEach((result) => {
    const { subject, keyStage, index } = result.combination;
    console.log(`   - ${subject}/${keyStage}/${index} (exit code: ${result.exitCode})`);
    if (result.error) {
      console.log(`     Error: ${result.error}`);
    }
  });
  console.log('');
}

/**
 * Main execution function.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const resume = args.includes('--resume');
  const reset = args.includes('--reset');
  const showHelp = args.includes('--help') || args.includes('-h');

  if (showHelp) {
    console.log(`
Systematic Ingestion of All Combinations

Usage:
  pnpm ingest:all [options]

Options:
  --resume      Resume from last checkpoint (default behavior if progress exists)
  --reset       Reset progress and start fresh
  --dry-run     Preview without actually ingesting
  --help, -h    Show this help message

Progress:
  Progress is tracked in .ingest-progress.json
  The script can be safely interrupted (Ctrl+C) and resumed later

Combinations:
  ${ALL_SUBJECTS.length} subjects × ${ALL_KEY_STAGES.length} key stages × ${ALL_INDEX_KINDS.length} indexes = ${ALL_SUBJECTS.length * ALL_KEY_STAGES.length * ALL_INDEX_KINDS.length} total combinations

Note:
  - Not all combinations will have data (some subject/keystage pairs don't exist)
  - Failed combinations are tracked and can be retried manually
  - The script will continue even if individual combinations fail
`);
    return;
  }

  console.log('🚀 Systematic Ingestion - All Combinations\n');

  let state: ProgressState;

  if (reset) {
    console.log('🔄 Resetting progress...\n');
    state = resetProgress();
  } else {
    state = loadProgress();
    if (resume || existsSync(PROGRESS_FILE)) {
      console.log('📂 Loaded existing progress\n');
    }
  }

  printProgress(state);

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No data will be ingested\n');
  }

  // Find next pending combination
  let processedCount = 0;

  for (const result of state.results) {
    if (result.status !== 'pending') {
      continue;
    }

    const { subject, keyStage, index, id } = result.combination;

    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔄 Processing: ${subject} / ${keyStage} / ${index}`);
    console.log(`   ID: ${id}`);
    console.log(`   ${processedCount + 1} of ${state.totalCombinations}`);
    console.log(`${'='.repeat(80)}\n`);

    // Update status to running
    result.status = 'running';
    result.startedAt = new Date().toISOString();
    saveProgress(state);

    // Run the ingestion
    const { exitCode, error } = await runIngestion(result.combination, dryRun);

    // Update result
    result.completedAt = new Date().toISOString();
    result.exitCode = exitCode;

    if (exitCode === 0) {
      result.status = 'success';
      state.completed++;
      console.log(`\n✅ Success: ${id}\n`);
    } else {
      result.status = 'failed';
      result.error = error;
      state.failed++;
      console.log(`\n❌ Failed: ${id} (exit code: ${exitCode})\n`);
    }

    saveProgress(state);
    processedCount++;

    // Print progress every 10 combinations
    if (processedCount % 10 === 0) {
      printProgress(state);
    }
  }

  // Final summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('🎉 All combinations processed!');
  console.log(`${'='.repeat(80)}\n`);

  printProgress(state);
  printRecentFailures(state);

  if (state.failed > 0) {
    console.log(`⚠️  ${state.failed} combination(s) failed.`);
    console.log(`   Review .ingest-progress.json for details.\n`);
  }

  if (state.completed === state.totalCombinations) {
    console.log('🏆 All combinations completed successfully!\n');
  }
}

// Run the script
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
