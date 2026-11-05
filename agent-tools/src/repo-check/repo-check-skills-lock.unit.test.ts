import { describe, expect, it } from 'vitest';

import { isInsideAny, lockedSkillRoots } from './repo-check-skills-lock.js';

/** What the lock's tool records for a vendored skill. */
const ENTRY = { source: 'upstream/skills', computedHash: 'a'.repeat(64) };

/** A lock pinning the named skills, each with a full entry. */
function lockOf(...names: readonly string[]): string {
  return JSON.stringify({
    version: 1,
    skills: Object.fromEntries(names.map((name) => [name, ENTRY])),
  });
}

describe('lockedSkillRoots', () => {
  it('gives the directory of each skill the lock pins', () => {
    expect(lockedSkillRoots(lockOf('clerk', 'clerk-backend-api'))).toStrictEqual({
      ok: true,
      value: ['.agents/skills/clerk/', '.agents/skills/clerk-backend-api/'],
    });
  });

  it('gives no directories when the repository has no lock', () => {
    expect(lockedSkillRoots(undefined)).toStrictEqual({ ok: true, value: [] });
  });

  it('fails a lock that is not JSON', () => {
    expect(lockedSkillRoots('{ "skills": ')).toHaveProperty(
      'error',
      expect.stringMatching(
        /^skills-lock\.json is not JSON \(.+\), so the vendored skills are unknown$/u,
      ),
    );
  });

  it('fails a lock with no skills object, saying where', () => {
    expect(lockedSkillRoots('{ "version": 1 }')).toHaveProperty(
      'error',
      expect.stringMatching(
        /^skills-lock\.json does not record its skills as the gate reads them \(at skills: /u,
      ),
    );
  });

  it.each([
    ['a bare key', null],
    ['an entry with no source', { computedHash: ENTRY.computedHash }],
    ['an entry whose hash is not a sha256', { ...ENTRY, computedHash: 'abc' }],
  ])('fails %s, naming the skill', (_case, entry) => {
    expect(lockedSkillRoots(JSON.stringify({ skills: { 'local-skill': entry } }))).toHaveProperty(
      'error',
      expect.stringContaining('(at skills.local-skill'),
    );
  });

  it.each(['../apps', 'nested/skill', '', 'Clerk', 'clerk--api', '-clerk'])(
    'fails a lock naming a skill %j, which is not a directory name',
    (name) => {
      expect(lockedSkillRoots(lockOf(name))).toHaveProperty(
        'error',
        expect.stringContaining('does not record its skills as the gate reads them'),
      );
    },
  );
});

describe('isInsideAny', () => {
  const roots = ['.agents/skills/clerk/', '.agents/skills/clerk-backend-api/'];

  it('holds for a file inside a directory', () => {
    expect(isInsideAny('.agents/skills/clerk-backend-api/scripts/run.sh', roots)).toBe(true);
  });

  it('does not hold for a sibling whose name starts with a locked name', () => {
    expect(isInsideAny('.agents/skills/clerk-cli/scripts/run.sh', roots)).toBe(false);
  });

  it('does not hold for a skill written here', () => {
    expect(isInsideAny('.agents/skills/local-skill/scripts/run.sh', roots)).toBe(false);
  });
});
