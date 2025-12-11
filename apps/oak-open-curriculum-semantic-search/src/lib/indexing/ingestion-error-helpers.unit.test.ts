/**
 * @module ingestion-error-helpers.unit.test
 * @description Unit tests for ingestion error helper pure functions.
 */

import { describe, it, expect } from 'vitest';
import { isRetryableStatus, formatContext, calculateSummary } from './ingestion-error-helpers';
import type { IngestionContext, IngestionIssue } from './ingestion-error-types';

describe('isRetryableStatus', () => {
  it('returns true for 500 status', () => {
    expect(isRetryableStatus(500)).toBe(true);
  });

  it('returns true for 502 status', () => {
    expect(isRetryableStatus(502)).toBe(true);
  });

  it('returns true for 503 status', () => {
    expect(isRetryableStatus(503)).toBe(true);
  });

  it('returns true for 504 status', () => {
    expect(isRetryableStatus(504)).toBe(true);
  });

  it('returns false for 404 status', () => {
    expect(isRetryableStatus(404)).toBe(false);
  });

  it('returns false for 200 status', () => {
    expect(isRetryableStatus(200)).toBe(false);
  });

  it('returns false for undefined status', () => {
    expect(isRetryableStatus(undefined)).toBe(false);
  });
});

describe('formatContext', () => {
  it('formats empty context as empty string', () => {
    const context: IngestionContext = {};
    expect(formatContext(context)).toBe('');
  });

  it('formats context with keyStage', () => {
    const context: IngestionContext = { keyStage: 'ks2' };
    expect(formatContext(context)).toBe('ks=ks2');
  });

  it('formats context with subject', () => {
    const context: IngestionContext = { subject: 'maths' };
    expect(formatContext(context)).toBe('subject=maths');
  });

  it('formats context with unitSlug', () => {
    const context: IngestionContext = { unitSlug: 'fractions-unit' };
    expect(formatContext(context)).toBe('unit=fractions-unit');
  });

  it('formats context with lessonSlug', () => {
    const context: IngestionContext = { lessonSlug: 'intro-to-fractions' };
    expect(formatContext(context)).toBe('lesson=intro-to-fractions');
  });

  it('formats context with operation', () => {
    const context: IngestionContext = { operation: 'getLessonSummary' };
    expect(formatContext(context)).toBe('op=getLessonSummary');
  });

  it('formats full context with all fields', () => {
    const context: IngestionContext = {
      keyStage: 'ks3',
      subject: 'science',
      unitSlug: 'atoms-unit',
      lessonSlug: 'atomic-structure',
      operation: 'getLessonTranscript',
    };
    expect(formatContext(context)).toBe(
      'ks=ks3, subject=science, unit=atoms-unit, lesson=atomic-structure, op=getLessonTranscript',
    );
  });
});

describe('calculateSummary', () => {
  const baseTimestamp = new Date('2024-01-01T00:00:00Z');

  it('returns zeroed summary for empty issues array', () => {
    const summary = calculateSummary([]);

    expect(summary.totalErrors).toBe(0);
    expect(summary.totalWarnings).toBe(0);
    expect(summary.byHttpStatus).toEqual({});
    expect(summary.byOperation).toEqual({});
    expect(summary.byKeyStage).toEqual({});
    expect(summary.bySubject).toEqual({});
    expect(summary.issues).toEqual([]);
  });

  it('counts errors and warnings correctly', () => {
    const issues: IngestionIssue[] = [
      {
        severity: 'error',
        message: 'Error 1',
        context: {},
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'warning',
        message: 'Warning 1',
        context: {},
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'error',
        message: 'Error 2',
        context: {},
        timestamp: baseTimestamp,
        retryable: false,
      },
    ];

    const summary = calculateSummary(issues);

    expect(summary.totalErrors).toBe(2);
    expect(summary.totalWarnings).toBe(1);
  });

  it('aggregates by HTTP status', () => {
    const issues: IngestionIssue[] = [
      {
        severity: 'warning',
        message: 'Not found',
        context: {},
        httpStatus: 404,
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'warning',
        message: 'Server error',
        context: {},
        httpStatus: 500,
        timestamp: baseTimestamp,
        retryable: true,
      },
      {
        severity: 'warning',
        message: 'Another 500',
        context: {},
        httpStatus: 500,
        timestamp: baseTimestamp,
        retryable: true,
      },
    ];

    const summary = calculateSummary(issues);

    expect(summary.byHttpStatus).toEqual({ 404: 1, 500: 2 });
  });

  it('aggregates by operation', () => {
    const issues: IngestionIssue[] = [
      {
        severity: 'error',
        message: 'Op1 failed',
        context: { operation: 'getLessonSummary' },
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'error',
        message: 'Op2 failed',
        context: { operation: 'getLessonTranscript' },
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'warning',
        message: 'Op1 warning',
        context: { operation: 'getLessonSummary' },
        timestamp: baseTimestamp,
        retryable: false,
      },
    ];

    const summary = calculateSummary(issues);

    expect(summary.byOperation).toEqual({
      getLessonSummary: 2,
      getLessonTranscript: 1,
    });
  });

  it('aggregates by key stage', () => {
    const issues: IngestionIssue[] = [
      {
        severity: 'error',
        message: 'KS2 error',
        context: { keyStage: 'ks2' },
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'error',
        message: 'KS3 error',
        context: { keyStage: 'ks3' },
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'warning',
        message: 'KS2 warning',
        context: { keyStage: 'ks2' },
        timestamp: baseTimestamp,
        retryable: false,
      },
    ];

    const summary = calculateSummary(issues);

    expect(summary.byKeyStage).toEqual({ ks2: 2, ks3: 1 });
  });

  it('aggregates by subject', () => {
    const issues: IngestionIssue[] = [
      {
        severity: 'error',
        message: 'Maths error',
        context: { subject: 'maths' },
        timestamp: baseTimestamp,
        retryable: false,
      },
      {
        severity: 'warning',
        message: 'Science warning',
        context: { subject: 'science' },
        timestamp: baseTimestamp,
        retryable: false,
      },
    ];

    const summary = calculateSummary(issues);

    expect(summary.bySubject).toEqual({ maths: 1, science: 1 });
  });

  it('includes issues array in summary', () => {
    const issues: IngestionIssue[] = [
      {
        severity: 'error',
        message: 'Test error',
        context: { keyStage: 'ks1' },
        timestamp: baseTimestamp,
        retryable: false,
      },
    ];

    const summary = calculateSummary(issues);

    expect(summary.issues).toBe(issues);
  });
});
