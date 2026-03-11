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

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.version).toBe('v-test');
    }
  });

  it('returns error for invalid JSON', () => {
    const parsed = parseMetaJson('{not-valid-json}');
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toMatch(/Invalid metadata JSON/);
      expect(parsed.error.type).toBe('invalid_json');
    }
  });

  it('returns error for schema-invalid JSON', () => {
    const parsed = parseMetaJson(JSON.stringify({ version: 'only-version' }));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toMatch(/IndexMetaDoc schema/);
      expect(parsed.error.type).toBe('schema_mismatch');
    }
  });
});
