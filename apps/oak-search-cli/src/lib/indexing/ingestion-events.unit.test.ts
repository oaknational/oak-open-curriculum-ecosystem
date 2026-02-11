/**
 * Unit tests for ingestion event formatting.
 *
 * These tests verify that ingestion events are formatted correctly for logging.
 * Events are used throughout the ingestion process to provide observability.
 *
 * @see ingestion-events.ts
 */

import { describe, it, expect } from 'vitest';
import {
  formatIngestionEvent,
  createPhaseStartEvent,
  createPhaseEndEvent,
  createProgressEvent,
  createLessonSkippedEvent,
  createUnitSkippedEvent,
  createIngestionCompleteEvent,
  createSummaryEvent,
  type IngestionPhase,
  type LessonSkipReason,
} from './ingestion-events';

describe('formatIngestionEvent', () => {
  describe('phase events', () => {
    it('formats PHASE_START event with phase and context', () => {
      const event = createPhaseStartEvent('units', {
        subject: 'maths',
        keyStage: 'ks4',
        count: 36,
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('PHASE_START');
      expect(formatted).toContain('units');
      expect(formatted).toContain('subject=maths');
      expect(formatted).toContain('keyStage=ks4');
      expect(formatted).toContain('count=36');
    });

    it('formats PHASE_END event with indexed and skipped counts', () => {
      const event = createPhaseEndEvent('lessons', {
        subject: 'maths',
        keyStage: 'ks4',
        indexed: 298,
        skipped: 16,
        durationMs: 45200,
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('PHASE_END');
      expect(formatted).toContain('lessons');
      expect(formatted).toContain('indexed=298');
      expect(formatted).toContain('skipped=16');
      expect(formatted).toContain('duration=');
    });
  });

  describe('progress events', () => {
    it('formats PROGRESS event with current, total, and percentage', () => {
      const event = createProgressEvent('lessons', {
        current: 50,
        total: 314,
        unitSlug: 'quadratic-equations',
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('PROGRESS');
      expect(formatted).toContain('lessons');
      expect(formatted).toContain('50/314');
      expect(formatted).toContain('unit=quadratic-equations');
    });
  });

  describe('skip events', () => {
    it('formats LESSON_SKIPPED event with full context', () => {
      const event = createLessonSkippedEvent({
        lessonSlug: 'solving-by-completing-square',
        unitSlug: 'quadratic-equations',
        reason: 'summary_404',
        httpStatus: 404,
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('LESSON_SKIPPED');
      expect(formatted).toContain('lessonSlug=solving-by-completing-square');
      expect(formatted).toContain('unitSlug=quadratic-equations');
      expect(formatted).toContain('reason=summary_404');
      expect(formatted).toContain('httpStatus=404');
    });

    it('formats LESSON_SKIPPED event without httpStatus when not provided', () => {
      const event = createLessonSkippedEvent({
        lessonSlug: 'some-lesson',
        unitSlug: 'some-unit',
        reason: 'validation_error',
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('LESSON_SKIPPED');
      expect(formatted).toContain('reason=validation_error');
      expect(formatted).not.toContain('httpStatus');
    });

    it('formats UNIT_SKIPPED event with full context', () => {
      const event = createUnitSkippedEvent({
        unitSlug: 'some-unit',
        subject: 'maths',
        keyStage: 'ks4',
        reason: 'summary_unavailable',
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('UNIT_SKIPPED');
      expect(formatted).toContain('unitSlug=some-unit');
      expect(formatted).toContain('subject=maths');
      expect(formatted).toContain('keyStage=ks4');
      expect(formatted).toContain('reason=summary_unavailable');
    });
  });

  describe('completion events', () => {
    it('formats INGESTION_COMPLETE event with duration', () => {
      const event = createIngestionCompleteEvent({ durationMs: 67500 });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('INGESTION_COMPLETE');
      expect(formatted).toContain('duration=');
    });

    it('formats SUMMARY event with category and counts', () => {
      const event = createSummaryEvent({
        category: 'lessons',
        indexed: 298,
        skipped: 16,
      });

      const formatted = formatIngestionEvent(event);

      expect(formatted).toContain('SUMMARY');
      expect(formatted).toContain('lessons');
      expect(formatted).toContain('indexed=298');
      expect(formatted).toContain('skipped=16');
    });
  });
});

describe('type safety', () => {
  it('accepts valid phase values', () => {
    const phases: IngestionPhase[] = ['units', 'lessons', 'rollups', 'threads'];

    for (const phase of phases) {
      const event = createPhaseStartEvent(phase, { count: 10 });
      expect(event.phase).toBe(phase);
    }
  });

  it('accepts valid skip reasons', () => {
    const reasons: LessonSkipReason[] = [
      'summary_404',
      'summary_invalid',
      'transcript_error',
      'unknown',
    ];

    for (const reason of reasons) {
      const event = createLessonSkippedEvent({
        lessonSlug: 'test',
        unitSlug: 'test',
        reason,
      });
      expect(event.context.reason).toBe(reason);
    }
  });
});
