import { createHash } from 'node:crypto';

import {
  deriveIdentity,
  type DerivedIdentityResult,
  type OverrideIdentityResult,
} from '../../src/core/agent-identity';
import { IDENTITY_WORD_GROUPS } from '../../src/core/agent-identity/wordlists';

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
    expect(result.displayName).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+$/u);
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
      displayName: 'Frolicking Toast',
      slug: 'frolicking-toast',
      seedDigest: createHash('sha256').update('override-seed').digest('hex'),
      override: 'Frolicking Toast',
    });
  });

  it('rejects an empty seed before derivation', () => {
    expect(() => deriveIdentity('   ')).toThrow('seed must be a non-empty string');
  });

  it('rejects an empty override before returning an override result', () => {
    expect(() => deriveIdentity('seed', { override: '   ' })).toThrow(
      'override must be a non-empty string',
    );
  });

  it('spreads a fixed seed corpus across all approved word groups', () => {
    const groups = new Set(
      Array.from({ length: 300 }, (_, index) => deriveIdentity(`fixed-seed-${index}`))
        .filter((result) => result.kind === 'derived')
        .map((result) => result.group),
    );

    expect(groups).toEqual(new Set(['botanical', 'celestial', 'maritime']));
  });

  it('emits slot values that belong to the reported word group', () => {
    const result = deriveIdentity('coherence-seed');
    expect(result.kind).toBe('derived');

    if (result.kind === 'derived') {
      const group = IDENTITY_WORD_GROUPS.find((candidate) => candidate.group === result.group);

      expect(group).toBeDefined();
      expect(group?.adjectives).toContain(result.adjective);
      expect(group?.verbs).toContain(result.verb);
      expect(group?.nouns).toContain(result.noun);
    }
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
