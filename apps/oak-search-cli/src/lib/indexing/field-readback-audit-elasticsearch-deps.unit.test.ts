import { describe, expect, it } from 'vitest';
import { resolveReadbackIndexName } from '../../../operations/ingestion/field-readback-audit-elasticsearch-deps.js';

describe('field readback audit elasticsearch deps', () => {
  it('keeps alias names for live-alias audits', () => {
    expect(resolveReadbackIndexName('oak_lessons')).toBe('oak_lessons');
    expect(resolveReadbackIndexName('oak_sequences_sandbox')).toBe('oak_sequences_sandbox');
  });

  it('resolves concrete versioned indexes for staged audits', () => {
    expect(resolveReadbackIndexName('oak_lessons', 'v2026-03-21-143022')).toBe(
      'oak_lessons_v2026-03-21-143022',
    );
    expect(resolveReadbackIndexName('oak_sequences_sandbox', 'v2026-03-21-143022')).toBe(
      'oak_sequences_sandbox_v2026-03-21-143022',
    );
  });

  it('fails fast when a staged audit alias is unknown', () => {
    expect(() => resolveReadbackIndexName('oak_unknown_alias', 'v2026-03-21-143022')).toThrow(
      'Unknown readback alias: oak_unknown_alias',
    );
  });
});
