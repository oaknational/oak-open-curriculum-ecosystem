import { describe, it, expect, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';

import { extractToolPayload } from './tools.js';

const noop = vi.fn();
const logger: Logger = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop,
};

describe('extractToolPayload', () => {
  it('extracts data from a 2-item content array (summary + JSON)', () => {
    const resultRecord = {
      content: [
        { type: 'text', text: 'Get Key Stages: 200' },
        { type: 'text', text: JSON.stringify({ status: 200, data: [{ slug: 'ks1' }] }) },
      ],
      isError: false,
    };

    const payload = extractToolPayload(resultRecord, logger);
    expect(payload).toHaveLength(1);
    expect(payload[0]).toEqual({ slug: 'ks1' });
  });

  it('throws when the only text content item is not valid JSON', () => {
    const resultRecord = {
      content: [{ type: 'text', text: 'Not valid JSON at all' }],
      isError: false,
    };

    expect(() => extractToolPayload(resultRecord, logger)).toThrow();
  });
});
