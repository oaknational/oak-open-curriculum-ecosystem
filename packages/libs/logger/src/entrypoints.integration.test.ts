import { describe, expect, it } from 'vitest';

describe('browser entrypoint', () => {
  it('does not expose Node-only exports', async () => {
    const entryModule = await import('./index');

    expect(entryModule).not.toHaveProperty('MultiSinkLogger');
    expect(entryModule).not.toHaveProperty('createFileSink');
    expect(entryModule).not.toHaveProperty('DEFAULT_STDIO_SINK_CONFIG');
  });

  it('throws when file sinks are requested from browser entry', async () => {
    const { createAdaptiveLogger } = await import('./index');

    const invalidSinkConfig = {
      stdout: true,
      file: {
        path: './logs/browser-entry-test.log',
        append: true,
      },
    } as const;

    expect(() => createAdaptiveLogger({ level: 'INFO' }, undefined, invalidSinkConfig)).toThrow(
      /node/i,
    );
  });
});

describe('node entrypoint', () => {
  it('exposes Node-only exports', async () => {
    const entryModule = await import('./node');

    expect(entryModule).toHaveProperty('MultiSinkLogger');
    expect(entryModule).toHaveProperty('createFileSink');
    expect(entryModule).toHaveProperty('DEFAULT_STDIO_SINK_CONFIG');
  });

  it('returns a MultiSinkLogger instance when file sinks are enabled', async () => {
    const { createAdaptiveLogger, MultiSinkLogger } = await import('./node');

    const logger = createAdaptiveLogger({ level: 'INFO' }, undefined, { stdout: true });

    expect(logger).toBeInstanceOf(MultiSinkLogger);
  });
});
