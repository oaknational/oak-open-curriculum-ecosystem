import { describe, expect, it } from 'vitest';
import { UnifiedLogger } from './unified-logger';

describe('browser entrypoint', () => {
  it('does not expose Node-only exports', async () => {
    const entryModule = await import('./index');

    expect(entryModule).not.toHaveProperty('createNodeStdoutSink');
    expect(entryModule).not.toHaveProperty('createFileSink');
    expect(entryModule).not.toHaveProperty('DEFAULT_STDIO_SINK_CONFIG');
  });

  it('exposes core types and functions', async () => {
    const entryModule = await import('./index');

    expect(entryModule).toHaveProperty('UnifiedLogger');
    expect(entryModule).toHaveProperty('buildResourceAttributes');
    expect(entryModule).toHaveProperty('startTimer');
  });
});

describe('node entrypoint', () => {
  it('exposes Node-only exports', async () => {
    const entryModule = await import('./node');

    expect(entryModule).toHaveProperty('createNodeStdoutSink');
    expect(entryModule).toHaveProperty('createFileSink');
    expect(entryModule).toHaveProperty('DEFAULT_STDIO_SINK_CONFIG');
  });

  it('exposes UnifiedLogger and core utilities', async () => {
    const entryModule = await import('./node');

    expect(entryModule).toHaveProperty('UnifiedLogger');
    expect(entryModule).toHaveProperty('buildResourceAttributes');
    expect(entryModule).toHaveProperty('startTimer');
  });
});
