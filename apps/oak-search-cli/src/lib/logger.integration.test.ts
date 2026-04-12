import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LogSink } from '@oaknational/logger';
import { clearAdditionalSinks, registerAdditionalSink, searchLogger } from './logger.js';

afterEach(() => {
  clearAdditionalSinks();
});

describe('registerAdditionalSink', () => {
  it('a registered sink receives log events', () => {
    const write = vi.fn();
    const fakeSink: LogSink = { write };

    registerAdditionalSink(fakeSink);
    searchLogger.info('test message');

    expect(write).toHaveBeenCalledTimes(1);
    expect(write.mock.calls[0]?.[0]).toEqual(expect.objectContaining({ message: 'test message' }));
  });

  it('clearAdditionalSinks removes all sinks', () => {
    const write = vi.fn();
    const fakeSink: LogSink = { write };

    registerAdditionalSink(fakeSink);
    clearAdditionalSinks();
    searchLogger.info('after clear');

    expect(write).not.toHaveBeenCalled();
  });

  it('multiple sinks all receive events', () => {
    const writeA = vi.fn();
    const writeB = vi.fn();
    const sinkA: LogSink = { write: writeA };
    const sinkB: LogSink = { write: writeB };

    registerAdditionalSink(sinkA);
    registerAdditionalSink(sinkB);
    searchLogger.info('multi-sink');

    expect(writeA).toHaveBeenCalledTimes(1);
    expect(writeB).toHaveBeenCalledTimes(1);
  });

  it('registerAdditionalSink invalidates cache', () => {
    const writeA = vi.fn();
    const writeB = vi.fn();
    const sinkA: LogSink = { write: writeA };
    const sinkB: LogSink = { write: writeB };

    registerAdditionalSink(sinkA);
    searchLogger.info('first log');

    registerAdditionalSink(sinkB);
    searchLogger.info('second log');

    expect(writeB).toHaveBeenCalledTimes(1);
  });
});
