import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  appendReviewMetric,
  REVIEW_METRICS_MAX_BYTES,
} from '../../src/codex-hook-review/metrics.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('appendReviewMetric', () => {
  it('writes content-free NDJSON under the ignored Claude logs directory', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-metrics-');
    await appendReviewMetric(root, {
      recorded_at: '2026-07-16T00:00:00.000Z',
      outcome: 'pass',
      duration_ms: 1200,
      input_tokens: 900,
    });

    const logPath = join(root, '.claude', 'logs', 'codex-review.ndjson');
    expect(await fileSystem.readText(logPath)).toBe(
      '{"recorded_at":"2026-07-16T00:00:00.000Z","outcome":"pass","duration_ms":1200,"input_tokens":900}\n',
    );
    expect(await fileSystem.mode(logPath)).toBe(0o600);
  });

  it('keeps exactly one rotation when the next line crosses one MiB', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-metrics-');
    const logDirectory = join(root, '.claude', 'logs');
    const logPath = join(logDirectory, 'codex-review.ndjson');
    await fileSystem.createDirectory(logDirectory, { recursive: true });
    await fileSystem.writeText(logPath, 'x'.repeat(REVIEW_METRICS_MAX_BYTES));
    await appendReviewMetric(root, {
      recorded_at: '2026-07-16T00:00:00.000Z',
      outcome: 'skipped',
    });

    expect(await fileSystem.size(`${logPath}.1`)).toBe(REVIEW_METRICS_MAX_BYTES);
    expect(await fileSystem.readText(logPath)).toContain('"outcome":"skipped"');
  });

  it('rejects a linked log file without modifying its target', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-metrics-');
    const outside = await fileSystem.temporaryRoot('codex-review-metrics-target-');
    const logDirectory = join(root, '.claude', 'logs');
    const target = join(outside, 'target.txt');
    await fileSystem.createDirectory(logDirectory, { recursive: true });
    await fileSystem.writeText(target, 'unchanged');
    await fileSystem.createSymbolicLink(target, join(logDirectory, 'codex-review.ndjson'));

    const result = await appendReviewMetric(root, {
      recorded_at: '2026-07-16T00:00:00.000Z',
      outcome: 'pass',
    });

    expect(result).toStrictEqual({ ok: false, error: { kind: 'log-stat-failed' } });
    expect(await fileSystem.readText(target)).toBe('unchanged');
  });

  it('rejects a linked Claude directory without writing through it', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-metrics-');
    const outside = await fileSystem.temporaryRoot('codex-review-metrics-target-');
    await fileSystem.createSymbolicLink(outside, join(root, '.claude'));

    const result = await appendReviewMetric(root, {
      recorded_at: '2026-07-16T00:00:00.000Z',
      outcome: 'pass',
    });

    expect(result).toStrictEqual({ ok: false, error: { kind: 'log-directory-failed' } });
    expect(await fileSystem.entries(outside)).toEqual([]);
  });
});
