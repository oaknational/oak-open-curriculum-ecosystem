import { createHash } from 'node:crypto';

import {
  deriveIdentity,
  type DerivedIdentityResult,
  type OverrideIdentityResult,
} from '../../src/core/agent-identity';
import {
  ACTIVE_NAMING_SCHEMA_ID,
  NAMING_SCHEMAS,
} from '../../src/core/agent-identity/schema-registry';

const APPROVED_IDENTITY_GROUPS = [
  'celestial',
  'maritime',
  'botanical',
  'ember',
  'aerial',
  'nocturnal',
] as const;

describe('deriveIdentity', () => {
  it('returns the same derived identity for the same seed', () => {
    const first = expectDerivedIdentity(deriveIdentity('example-session-id-001'));
    const second = expectDerivedIdentity(deriveIdentity('example-session-id-001'));

    expect(first).toEqual(second);
    expect(first.kind).toBe('derived');
  });

  it('formats derived identity display and slug values consistently', () => {
    const result = deriveIdentity('format-check-seed');

    expect(result.kind).toBe('derived');
    expect(result.displayName).toMatch(/^[A-Z][a-z]+ [a-z]+ [A-Z][a-z]+$/u);
    expect(result.slug).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/u);
    expect(result.seedDigest).toBe(createHash('sha256').update('format-check-seed').digest('hex'));
  });

  it('uses a type-total override result when an override is supplied', () => {
    const result = expectOverrideIdentity(
      deriveIdentity('override-seed', {
        override: '  Frolicking   Toast  ',
      }),
    );

    expect(result).toEqual({
      kind: 'override',
      namingSchemaVersion: 'override',
      displayName: 'Frolicking Toast',
      slug: 'frolicking-toast',
      seedDigest: createHash('sha256').update('override-seed').digest('hex'),
      override: 'Frolicking Toast',
    });
  });

  it('stamps derived results with the active naming schema version', () => {
    const result = expectDerivedIdentity(deriveIdentity('version-seed'));

    expect(result.namingSchemaVersion).toBe('v2-noun-verb-noun');
  });

  it('derives the pinned ground-truth name whether the active schema is implicit or explicit', () => {
    const implicit = expectDerivedIdentity(deriveIdentity('version-seed'));
    const explicit = expectDerivedIdentity(
      deriveIdentity('version-seed', { schemaId: 'v2-noun-verb-noun' }),
    );

    expect(implicit.displayName).toBe('Starling weaves Bluff');
    expect(implicit.slug).toBe('starling-weaves-bluff');
    expect(explicit).toEqual(implicit);
  });

  it('rejects an empty seed before derivation', () => {
    expect(() => deriveIdentity('   ')).toThrow('seed must be a non-empty string');
  });

  it('rejects an empty override before returning an override result', () => {
    expect(() => deriveIdentity('seed', { override: '   ' })).toThrow(
      'override must be a non-empty string',
    );
  });

  it('uses the approved neutral identity word group keys in every registered schema', () => {
    for (const schema of Object.values(NAMING_SCHEMAS)) {
      expect(schema.groups.map((group) => group.group)).toEqual([...APPROVED_IDENTITY_GROUPS]);
    }
  });

  it('routes a fixed seed corpus across every approved word group', () => {
    const expectedGroups = new Set(APPROVED_IDENTITY_GROUPS);
    const groups = new Set(
      Array.from({ length: 600 }, (_, index) => deriveIdentity(`fixed-seed-${index}`))
        .map(expectDerivedIdentity)
        .map((result) => result.group),
    );

    expect(groups).toEqual(expectedGroups);
  });

  it('uses lowercase slug-safe words in every registered schema column', () => {
    const allWords = Object.values(NAMING_SCHEMAS).flatMap((schema) =>
      schema.groups.flatMap((group) => group.columns.flat()),
    );

    expect(allWords).not.toHaveLength(0);
    expect(allWords.every((word) => /^[a-z]+$/u.test(word))).toBe(true);
  });

  it('emits words that belong to the reported word group, in column order', () => {
    const result = expectDerivedIdentity(deriveIdentity('coherence-seed'));
    const activeSchema = NAMING_SCHEMAS[ACTIVE_NAMING_SCHEMA_ID];
    const group = activeSchema.groups.find((candidate) => candidate.group === result.group);

    expect(group).toBeDefined();
    expect(result.words).toHaveLength(activeSchema.columnCasing.length);
    result.words.forEach((word, index) => {
      expect(group?.columns[index]).toContain(word);
    });
  });
});

function expectDerivedIdentity(result: ReturnType<typeof deriveIdentity>): DerivedIdentityResult {
  if (result.kind !== 'derived') {
    throw new Error(`expected derived identity, received ${result.kind}`);
  }

  return result;
}

function expectOverrideIdentity(result: ReturnType<typeof deriveIdentity>): OverrideIdentityResult {
  if (result.kind !== 'override') {
    throw new Error(`expected override identity, received ${result.kind}`);
  }

  return result;
}
