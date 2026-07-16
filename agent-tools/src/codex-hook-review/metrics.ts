import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import {
  appendGuardedRegularFile,
  ensureGuardedDirectory,
  inspectGuardedRegularFile,
  rotateGuardedRegularFile,
} from './guarded-local-io.js';

export const REVIEW_METRICS_MAX_BYTES = 1024 * 1024;

export interface ReviewMetric {
  readonly recorded_at: string;
  readonly outcome:
    | 'pass'
    | 'concern'
    | 'uncertain'
    | 'invalidated'
    | 'busy'
    | 'skipped'
    | 'failed';
  readonly reason?: string;
  readonly model?: string;
  readonly mechanism?: 'inline' | 'instructions' | 'skill';
  readonly duration_ms?: number;
  readonly gitleaks_ms?: number;
  readonly codex_ms?: number;
  readonly input_tokens?: number;
  readonly cached_input_tokens?: number;
  readonly output_tokens?: number;
}

export type ReviewMetricError =
  | { readonly kind: 'log-directory-failed' }
  | { readonly kind: 'log-stat-failed' }
  | { readonly kind: 'rotation-remove-failed' }
  | { readonly kind: 'rotation-rename-failed' }
  | { readonly kind: 'log-append-failed' };

export async function appendReviewMetric(
  projectRoot: string,
  metric: ReviewMetric,
): Promise<Result<void, ReviewMetricError>> {
  const logDirectory = join(projectRoot, '.claude', 'logs');
  const logPath = join(logDirectory, 'codex-review.ndjson');
  const rotatedPath = `${logPath}.1`;
  const line = `${JSON.stringify(metric)}\n`;
  const directory = await ensureGuardedDirectory(projectRoot, [
    { name: '.claude' },
    { name: 'logs' },
  ]);
  if (!directory.ok) {
    return err({ kind: 'log-directory-failed' });
  }
  const currentSize = await fileSize(logPath);
  if (!currentSize.ok) {
    return currentSize;
  }
  const rotated = await rotateIfNeeded(logPath, rotatedPath, currentSize.value, line);
  if (!rotated.ok) {
    return rotated;
  }
  const appended = await appendGuardedRegularFile(logPath, line, 0o600);
  return appended.ok ? ok(undefined) : err({ kind: 'log-append-failed' });
}

async function rotateIfNeeded(
  logPath: string,
  rotatedPath: string,
  currentSize: number,
  line: string,
): Promise<Result<void, ReviewMetricError>> {
  if (currentSize + Buffer.byteLength(line) <= REVIEW_METRICS_MAX_BYTES) {
    return ok(undefined);
  }
  const rotated = await rotateGuardedRegularFile(logPath, rotatedPath);
  return rotated.ok ? ok(undefined) : err({ kind: 'rotation-rename-failed' });
}

async function fileSize(path: string): Promise<Result<number, ReviewMetricError>> {
  const inspected = await inspectGuardedRegularFile(path);
  if (!inspected.ok) {
    return err({ kind: 'log-stat-failed' });
  }
  return ok(inspected.value.kind === 'missing' ? 0 : inspected.value.stats.size);
}
