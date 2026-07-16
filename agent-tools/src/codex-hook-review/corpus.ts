import { CALIBRATION_CORPUS } from './corpus-calibration.js';
import { HELD_OUT_EASY_CORPUS } from './corpus-held-out-easy.js';
import { HELD_OUT_HARD_CORPUS } from './corpus-held-out-hard.js';
import { HELD_OUT_MEDIUM_CORPUS } from './corpus-held-out-medium.js';
import { type BenchmarkCase } from './types.js';

export const HELD_OUT_CORPUS = [
  ...HELD_OUT_EASY_CORPUS,
  ...HELD_OUT_MEDIUM_CORPUS,
  ...HELD_OUT_HARD_CORPUS,
] as const satisfies readonly BenchmarkCase[];

export const BENCHMARK_CORPUS = [
  ...CALIBRATION_CORPUS,
  ...HELD_OUT_CORPUS,
] as const satisfies readonly BenchmarkCase[];

export { CALIBRATION_CORPUS };
