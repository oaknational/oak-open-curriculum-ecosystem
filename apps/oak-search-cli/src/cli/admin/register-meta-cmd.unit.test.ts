import { describe, expect, it } from 'vitest';
import { parseMetaJson } from './register-meta-cmd.js';

describe('parseMetaJson', () => {
  it('parses valid IndexMetaDoc JSON', () => {
    const parsed = parseMetaJson(
      JSON.stringify({
        version: 'v-test',
        ingested_at: '2026-03-11T00:00:00.000Z',
        subjects: ['maths'],
        key_stages: ['ks3'],
        duration_ms: 1234,
        doc_counts: { lessons: 1 },
      }),
    );

    expect(parsed.version).toBe('v-test');
  });

  it('throws for invalid JSON', () => {
    expect(() => parseMetaJson('{not-valid-json}')).toThrow(/Invalid metadata JSON/);
  });

  it('throws for schema-invalid JSON', () => {
    expect(() => parseMetaJson(JSON.stringify({ version: 'only-version' }))).toThrow(
      /IndexMetaDoc schema/,
    );
  });
});
