import fs from 'node:fs/promises';
import path from 'node:path';

import { evaluateFitnessFile, type FitnessResult } from './evaluate.js';
import {
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
  getExitCode,
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

async function readFitnessResults(
  repoRoot: string,
  fitnessFiles: readonly string[],
): Promise<FitnessResult[]> {
  return Promise.all(
    fitnessFiles.map(async (relPath) =>
      evaluateFitnessFile(relPath, await fs.readFile(path.join(repoRoot, relPath), 'utf8')),
    ),
  );
}

async function readDecisionDebtReadings(
  repoRoot: string,
  fitnessFiles: readonly string[],
): Promise<DecisionDebtReading[]> {
  const readings = await Promise.all(
    fitnessFiles.map(async (relPath) => {
      const content = await fs.readFile(path.join(repoRoot, relPath), 'utf8');
      if (!isConceptCounted(content)) {
        return null;
      }
      return {
        filename: relPath,
        result: evaluateDecisionDebt(content),
        configFinding: decisionDebtConfigurationFinding(content),
      };
    }),
  );
  return readings.filter((reading): reading is DecisionDebtReading => reading != null);
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
): Promise<number> {
  const mode = getMode(args);
  const fitnessFiles = await discoverFitnessFiles(repoRoot);
  const results = await readFitnessResults(repoRoot, fitnessFiles);
  const debtReadings = await readDecisionDebtReadings(repoRoot, fitnessFiles);

  writePracticeFitnessReport(io, mode, results);
  writeDecisionDebtSection(io, debtReadings);

  // Decision-debt is distinct in presentation but uniform in enforcement: its
  // zones gate exactly like size zones, and a schema failure (a concept-counted
  // file missing its thresholds) gates like a configuration finding.
  const zones = [
    ...results.map((result) => result.overallZone),
    ...debtReadings.flatMap((reading) =>
      reading.result.zone == null ? [] : [reading.result.zone],
    ),
  ];
  const hasConfigurationFindings =
    anyConfigurationFindings(results) ||
    debtReadings.some((reading) => reading.configFinding != null);

  return getExitCode(mode, zones, hasConfigurationFindings);
}

function anyConfigurationFindings(results: readonly FitnessResult[]): boolean {
  return results.some((result) => result.configurationFindings.length > 0);
}
