import { describe, expect, it } from 'vitest';

import {
  type LoadLockedSkillIdsResult,
  loadLockedSkillIds,
} from '../../src/skills-adapter-generate/lock';

const validLockText = JSON.stringify({
  version: 1,
  skills: {
    'add-app-to-server': {
      source: 'modelcontextprotocol/ext-apps',
      sourceType: 'github',
      computedHash: 'e9441d0b6a4eedf016903b78648e25234d5fd40e191124e1a1d1e56e71e9a4f4',
    },
    'clerk-setup': {
      source: 'clerk/skills',
      sourceType: 'github',
      computedHash: '40670b1b6e109fa1a3b2d9e111642ec920409d4b3bb9afadb58b7d2f5f1019a6',
    },
    'convert-web-app': {
      source: 'modelcontextprotocol/ext-apps',
      sourceType: 'github',
      computedHash: '0000000000000000000000000000000000000000000000000000000000000000',
    },
  },
});

const malformedLockText = JSON.stringify({
  version: 1,
  skills: ['add-app-to-server', 'clerk-setup'],
});

function schemaViolationPath(result: LoadLockedSkillIdsResult): string | undefined {
  return result.kind === 'error' && result.error.kind === 'schema-violation'
    ? result.error.path
    : undefined;
}

describe('loadLockedSkillIds', () => {
  it('returns the locked skill ids as a set for a valid lock fixture', () => {
    const result = loadLockedSkillIds(validLockText);

    expect(result).toEqual({
      kind: 'ok',
      value: new Set(['add-app-to-server', 'clerk-setup', 'convert-web-app']),
    });
  });

  it('returns a typed schema-violation error when skills is an array, without throwing', () => {
    const result = loadLockedSkillIds(malformedLockText);

    expect(result).toMatchObject({
      kind: 'error',
      error: { kind: 'schema-violation' },
    });
    expect(schemaViolationPath(result)).toMatch(/skills/);
  });

  it('returns an empty set when skills is an empty map', () => {
    const result = loadLockedSkillIds(JSON.stringify({ version: 1, skills: {} }));

    expect(result).toEqual({ kind: 'ok', value: new Set() });
  });

  it('returns a typed schema-violation error naming version when version is missing', () => {
    const result = loadLockedSkillIds(JSON.stringify({ skills: {} }));

    expect(result).toMatchObject({
      kind: 'error',
      error: { kind: 'schema-violation' },
    });
    expect(schemaViolationPath(result)).toMatch(/version/);
  });

  it('returns a json-parse error when input is not valid JSON, without throwing', () => {
    const result = loadLockedSkillIds('{ not json');

    expect(result).toMatchObject({
      kind: 'error',
      error: { kind: 'json-parse' },
    });
  });
});
