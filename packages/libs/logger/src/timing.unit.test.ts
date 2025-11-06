/**
 * Unit tests for timing utilities
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startTimer } from './timing';

describe('startTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks elapsed time accurately', () => {
    const timer = startTimer();

    // Advance time by 100ms
    vi.advanceTimersByTime(100);

    const elapsed = timer.elapsed();
    expect(elapsed).toBeCloseTo(100, 0);
  });

  it('formats duration as milliseconds when less than 1 second', () => {
    const timer = startTimer();

    // Advance time by 500ms
    vi.advanceTimersByTime(500);

    const duration = timer.end();
    expect(duration.ms).toBeCloseTo(500, 0);
    expect(duration.formatted).toMatch(/^\d+ms$/);
    expect(duration.formatted).toBe('500ms');
  });

  it('formats duration as seconds when 1 second or more', () => {
    const timer = startTimer();

    // Advance time by 2.5 seconds
    vi.advanceTimersByTime(2500);

    const duration = timer.end();
    expect(duration.ms).toBeCloseTo(2500, 0);
    expect(duration.formatted).toMatch(/^\d+\.\d{2}s$/);
    expect(duration.formatted).toBe('2.50s');
  });

  it('end() returns final duration with both ms and formatted', () => {
    const timer = startTimer();

    vi.advanceTimersByTime(1234);

    const duration = timer.end();
    expect(duration).toHaveProperty('ms');
    expect(duration).toHaveProperty('formatted');
    expect(typeof duration.ms).toBe('number');
    expect(typeof duration.formatted).toBe('string');
  });

  it('generates unique timers that do not interfere with each other', () => {
    const timer1 = startTimer();
    vi.advanceTimersByTime(100);

    const timer2 = startTimer();
    vi.advanceTimersByTime(50);

    const duration1 = timer1.end();
    const duration2 = timer2.end();

    expect(duration1.ms).toBeCloseTo(150, 0);
    expect(duration2.ms).toBeCloseTo(50, 0);
  });

  it('handles zero duration correctly', () => {
    const timer = startTimer();

    const duration = timer.end();
    expect(duration.ms).toBeGreaterThanOrEqual(0);
    expect(duration.formatted).toMatch(/^\d+ms$/);
  });

  it('rounds milliseconds to nearest integer in formatted output', () => {
    const timer = startTimer();

    vi.advanceTimersByTime(123.7);

    const duration = timer.end();
    expect(duration.formatted).toBe('124ms');
  });

  it('formats seconds with 2 decimal places', () => {
    const timer = startTimer();

    vi.advanceTimersByTime(1234.567);

    const duration = timer.end();
    expect(duration.formatted).toBe('1.23s');
  });
});
