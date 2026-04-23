import { describe, expect, it } from 'vitest';
import {
  UnifiedLogger as BrowserUnifiedLogger,
  buildNormalizedError as browserBuildNormalizedError,
  buildResourceAttributes as browserBuildResourceAttributes,
  isNormalizedError as browserIsNormalizedError,
  normalizeError as browserNormalizeError,
  parseLogLevel as browserParseLogLevel,
  startTimer as browserStartTimer,
} from './index.js';
import {
  DEFAULT_STDIO_SINK_CONFIG,
  UnifiedLogger as NodeUnifiedLogger,
  buildResourceAttributes as nodeBuildResourceAttributes,
  createFileSink as nodeCreateFileSink,
  createNodeFileSink,
  createNodeStdoutSink,
  startTimer as nodeStartTimer,
} from './node.js';

describe('browser entrypoint', () => {
  it('exposes the browser-safe core API', () => {
    expect(BrowserUnifiedLogger).toBeTypeOf('function');
    expect(browserBuildResourceAttributes).toBeTypeOf('function');
    expect(browserBuildNormalizedError).toBeTypeOf('function');
    expect(browserIsNormalizedError).toBeTypeOf('function');
    expect(browserNormalizeError).toBeTypeOf('function');
    expect(browserParseLogLevel).toBeTypeOf('function');
    expect(browserStartTimer).toBeTypeOf('function');
  });
});

describe('node entrypoint', () => {
  it('exposes Node-only exports', () => {
    expect(nodeCreateFileSink).toBeTypeOf('function');
    expect(createNodeStdoutSink).toBeTypeOf('function');
    expect(createNodeFileSink).toBeTypeOf('function');
    expect(DEFAULT_STDIO_SINK_CONFIG).toBeDefined();
  });

  it('exposes all core exports', () => {
    expect(NodeUnifiedLogger).toBeTypeOf('function');
    expect(nodeBuildResourceAttributes).toBeTypeOf('function');
    expect(nodeStartTimer).toBeTypeOf('function');
  });
});
