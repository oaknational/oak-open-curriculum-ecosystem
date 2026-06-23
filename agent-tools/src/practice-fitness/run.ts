import fs from 'node:fs/promises';
import path from 'node:path';

import { evaluateFitnessFile, type FitnessResult } from './evaluate.js';
import {
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
  type FitnessMode,
} from './model.js';
import {
  formatFitnessResponseDiscipline,
  formatFitnessInventory,
  formatSummary,
  summariseResults,
} from './format.js';
import { formatFitnessResultsByCategory } from './categories.js';
import { discoverFitnessFiles } from './paths.js';
import {
  decisionDebtConfigurationFinding,
  evaluateDecisionDebt,
  isConceptCounted,
} from './decision-debt.js';
import { formatDecisionDebtSection, type DecisionDebtReading } from './decision-debt-report.js';

interface PracticeFitnessIo {
  readonly log: (message?: string) => void;
}

export function getMode(args: readonly string[]): FitnessMode {
  if (args.includes('--informational')) {
    return FITNESS_MODE_INFORMATIONAL;
  }
  if (args.includes('--strict-hard')) {
    return FITNESS_MODE_STRICT_HARD;
  }
  return FITNESS_MODE_STRICT;
}

/** A fitness file's repo-relative path paired with its content, read once. */
interface FitnessFileContent {
  readonly relPath: string;
  readonly content: string;
}

/** Reads a UTF-8 file by absolute path. Injected in tests to prove single-read. */
type FileReader = (absPath: string) => Promise<string>;

const defaultReadFile: FileReader = (absPath) => fs.readFile(absPath, 'utf8');

/**
 * Read every fitness file from disk **exactly once**. Both the fitness report and
 * the decision-debt reading derive from this single pass (see
 * {@link deriveFitnessResults} and {@link deriveDecisionDebtReadings}), so a large
 * estate is never read twice.
 */
export async function readFitnessFiles(
  repoRoot: string,
  fitnessFiles: readonly string[],
  readFile: FileReader = defaultReadFile,
): Promise<FitnessFileContent[]> {
  return Promise.all(
    fitnessFiles.map(async (relPath) => ({
      relPath,
      content: await readFile(path.join(repoRoot, relPath)),
    })),
  );
}

function deriveFitnessResults(files: readonly FitnessFileContent[]): FitnessResult[] {
  return files.map(({ relPath, content }) => evaluateFitnessFile(relPath, content));
}

function deriveDecisionDebtReadings(
  files: readonly FitnessFileContent[],
  now: Date,
): DecisionDebtReading[] {
  return files
    .filter(({ content }) => isConceptCounted(content))
    .map(({ relPath, content }) => ({
      filename: relPath,
      result: evaluateDecisionDebt(content, now),
      configFinding: decisionDebtConfigurationFinding(content),
    }));
}

function writeDecisionDebtSection(
  io: PracticeFitnessIo,
  readings: readonly DecisionDebtReading[],
): void {
  const section = formatDecisionDebtSection(readings);
  if (section === '') {
    return;
  }
  io.log(`\n${section}`);
  io.log();
}

function writeFileResults(io: PracticeFitnessIo, results: readonly FitnessResult[]): void {
  io.log(formatFitnessResultsByCategory(results));
}

function writeSummary(
  io: PracticeFitnessIo,
  mode: FitnessMode,
  results: readonly FitnessResult[],
): void {
  const counts = summariseResults(results);
  io.log(formatSummary(mode, counts));

  if (counts.soft + counts.hard + counts.critical > 0) {
    io.log(formatFitnessResponseDiscipline());
    io.log();
  }
}

function writeZoneInventory(io: PracticeFitnessIo, results: readonly FitnessResult[]): void {
  io.log(formatFitnessInventory(results));
}

function writeConfigurationFindings(
  io: PracticeFitnessIo,
  results: readonly FitnessResult[],
): void {
  const filesWithFindings = results.filter((result) => result.configurationFindings.length > 0);
  if (filesWithFindings.length === 0) {
    return;
  }

  io.log(
    '\n\x1b[33mConfiguration findings (frontmatter invalid; separate from overall zone):\x1b[0m',
  );
  for (const result of filesWithFindings) {
    for (const finding of result.configurationFindings) {
      io.log(`  ${result.filename}: ${finding.text}`);
    }
  }
}

function writeCriticalPostMortemPrompt(
  io: PracticeFitnessIo,
  results: readonly FitnessResult[],
): void {
  const hasCritical = results.some((result) => result.overallZone === 'critical');
  if (!hasCritical) {
    return;
  }

  io.log(
    '\n\x1b[35mCritical zone detected. Per ADR-144 §Loop Health, a short post-mortem is required:\x1b[0m',
  );
  io.log('  1. Why did the earlier zones not fire?');
  io.log("  2. Was the limit set incorrectly for this file's role?");
  io.log('  3. Is the file a symptom of a missing graduation (ADR, governance doc, README)?');
}

export function writePracticeFitnessReport(
  io: PracticeFitnessIo,
  mode: FitnessMode,
  results: readonly FitnessResult[],
): void {
  io.log('\nPractice Fitness Check (ADR-144 three-zone model)');
  io.log('══════════════════════════════════════════════════\n');
  writeFileResults(io, results);
  writeSummary(io, mode, results);
  writeZoneInventory(io, results);
  writeConfigurationFindings(io, results);
  writeCriticalPostMortemPrompt(io, results);
  io.log();
}

export async function runPracticeFitnessCheck(
  args: readonly string[] = process.argv.slice(2),
  repoRoot = process.cwd(),
  io: PracticeFitnessIo = console,
  now: Date = new Date(),
): Promise<number> {
  const mode = getMode(args);
  const fitnessFiles = await discoverFitnessFiles(repoRoot);
  const files = await readFitnessFiles(repoRoot, fitnessFiles);
  const results = deriveFitnessResults(files);
  const debtReadings = deriveDecisionDebtReadings(files, now);

  writePracticeFitnessReport(io, mode, results);
  writeDecisionDebtSection(io, debtReadings);

  // Fitness is a report-only prioritisation signal (ADR-144): every zone — size,
  // count, dwell — and every configuration finding is surfaced to be acted on with
  // full weight, but fitness never fails a build. The exit code is always 0; the
  // mode governs report framing only.
  return 0;
}
