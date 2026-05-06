import { createHash } from 'node:crypto';

import {
  deriveIdentity,
  type DerivedIdentityResult,
  type OverrideIdentityResult,
} from '../../src/core/agent-identity';
import { IDENTITY_WORD_GROUPS } from '../../src/core/agent-identity/wordlists';

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

  it('uses the approved neutral identity word group keys', () => {
    expect(IDENTITY_WORD_GROUPS.map((group) => group.group)).toEqual(APPROVED_IDENTITY_GROUPS);
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

  it('uses lowercase slug-safe words in every approved group slot', () => {
    const allWords = IDENTITY_WORD_GROUPS.flatMap((group) => [
      ...group.adjectives,
      ...group.verbs,
      ...group.nouns,
    ]);

    expect(allWords).not.toHaveLength(0);
    expect(allWords.every((word) => /^[a-z]+$/u.test(word))).toBe(true);
  });

  it('emits slot values that belong to the reported word group', () => {
    const result = expectDerivedIdentity(deriveIdentity('coherence-seed'));
    const group = expectIdentityWordGroup(
      IDENTITY_WORD_GROUPS.find((candidate) => candidate.group === result.group),
    );

    expect(group.adjectives).toContain(result.adjective);
    expect(group.verbs).toContain(result.verb);
    expect(group.nouns).toContain(result.noun);
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

function expectIdentityWordGroup(
  group: (typeof IDENTITY_WORD_GROUPS)[number] | undefined,
): (typeof IDENTITY_WORD_GROUPS)[number] {
  if (group === undefined) {
    throw new Error('expected identity word group to exist');
  }

  return group;
}
