import { describe, expect, it } from 'vitest';

import { generateCorrelationId, type CorrelationContext } from './index.js';

describe('generateCorrelationId', () => {
  it('generates ID with correct format', () => {
    const id = generateCorrelationId();

    // Format: req_{timestamp}_{6-char-hex}
    expect(id).toMatch(/^req_\d+_[a-f0-9]{6}$/);
  });

  it('generates unique IDs across multiple calls', () => {
    const ids = new Set<string>();
    const count = 100;

    for (let i = 0; i < count; i++) {
      const id = generateCorrelationId();
      ids.add(id);
    }

    // All IDs should be unique
    expect(ids.size).toBe(count);
  });

  it('generates URL-safe IDs with no special characters', () => {
    const id = generateCorrelationId();

    // Should only contain alphanumeric characters and underscore
    expect(id).toMatch(/^[a-z0-9_]+$/);

    // Should be safe for headers and URLs (no encoding needed)
    expect(encodeURIComponent(id)).toBe(id);
  });

  it('generates IDs with increasing timestamps over time', () => {
    const id1 = generateCorrelationId();
    const timestamp1 = parseInt(id1.split('_')[1] ?? '0', 10);

    // Small delay to ensure timestamp advances
    const start = Date.now();
    while (Date.now() === start) {
      // busy wait for at least 1ms
    }

    const id2 = generateCorrelationId();
    const timestamp2 = parseInt(id2.split('_')[1] ?? '0', 10);

    expect(timestamp2).toBeGreaterThan(timestamp1);
  });

  it('generates IDs with 6-character hex random component', () => {
    const id = generateCorrelationId();
    const parts = id.split('_');

    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe('req');
    expect(parts[1]).toMatch(/^\d+$/); // timestamp
    expect(parts[2]).toMatch(/^[a-f0-9]{6}$/); // 6-char hex
    expect(parts[2]?.length).toBe(6);
  });
});

describe('CorrelationContext', () => {
  it('type check: CorrelationContext has correlationId property', () => {
    const context: CorrelationContext = {
      correlationId: 'req_1699123456789_a3f2c9',
    };

    expect(context.correlationId).toBe('req_1699123456789_a3f2c9');
  });
});
