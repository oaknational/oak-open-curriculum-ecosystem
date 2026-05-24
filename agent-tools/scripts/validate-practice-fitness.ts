#!/usr/bin/env node

import { fileURLToPath } from 'node:url';

export {
  classifyFitnessZone,
  CRITICAL_RATIO,
  estimateTokensFromContentChars,
  evaluateFitnessFile,
  extractFitnessContentText,
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
  formatFitnessResponseDiscipline,
  formatFitnessResult,
  getExitCode,
  getMode,
  runPracticeFitnessCheck,
  shouldInspectFitnessPath,
  worstZone,
} from '../src/practice-fitness/index.js';

import { runPracticeFitnessCheck } from '../src/practice-fitness/index.js';

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await runPracticeFitnessCheck();
  process.exit(exitCode);
}
