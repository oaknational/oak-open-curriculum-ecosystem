import { readFile } from 'node:fs/promises';

import { evaluateOpenQuestions } from './open-questions-evaluator.js';
import { OPEN_QUESTIONS_PATH, absolutePath } from './live-types.js';
import { type SubstrateFinding } from './types.js';

const OPEN_QUESTIONS_SURFACE = 'memory-operational-open-questions';

/**
 * Read and validate the live open-questions operational-memory register.
 */
export async function evaluateLiveOpenQuestions(
  repoRoot: string,
): Promise<readonly SubstrateFinding[]> {
  const text = await readFile(absolutePath(repoRoot, OPEN_QUESTIONS_PATH), 'utf8');

  return evaluateOpenQuestions({
    surface: OPEN_QUESTIONS_SURFACE,
    path: OPEN_QUESTIONS_PATH,
    text,
  });
}
