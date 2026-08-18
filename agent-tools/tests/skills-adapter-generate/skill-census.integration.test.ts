import { afterEach, describe, expect, it } from 'vitest';

import { adapterStubPointerLine } from '../../src/skills-adapter-generate/adapter-stub';
import {
  practiceSkillPermissionIssues,
  type CensusFs,
} from '../../src/validators/portability/skill-census';

import {
  cleanupSandboxes,
  removeRepoPath,
  sandboxRepo,
  symlinkRepoPath,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

const stub = (title: string, pointer: string): string =>
  `---\nname: x\ndescription: y\n---\n\n# ${title} (Claude Code)\n\n${adapterStubPointerLine(pointer)}\n`;

afterEach(() => {
  cleanupSandboxes();
});

describe('practiceSkillPermissionIssues over a real filesystem', () => {
  it('censuses only marker-carrying projections, ignoring a Vendor entry — and reports the missing Skill() entry', async () => {
    const root = sandboxRepo();
    writeRepoFile(
      root,
      '.claude/skills/oak-commit/SKILL.md',
      stub('Commit', 'commit/SKILL-CANONICAL.md'),
    );
    writeRepoFile(root, '.claude/skills/clerk/SKILL.md', '# Clerk\n\nVendor body, no marker.\n');

    const issues = await practiceSkillPermissionIssues(root, []);

    expect(issues).toStrictEqual([
      '.claude/settings.json: Claude skill adapter "oak-commit" has no Skill(oak-commit) entry in permissions.allow',
    ]);
  });

  it('is silent when the sole Practice projection is permitted', async () => {
    const root = sandboxRepo();
    writeRepoFile(
      root,
      '.claude/skills/oak-commit/SKILL.md',
      stub('Commit', 'commit/SKILL-CANONICAL.md'),
    );

    const issues = await practiceSkillPermissionIssues(root, ['Skill(oak-commit)']);

    expect(issues).toStrictEqual([]);
  });

  it('refuses a symlinked surface root rather than censusing directories outside the repo', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    writeRepoFile(
      outside,
      'skills/oak-external/SKILL.md',
      stub('External', 'external/SKILL-CANONICAL.md'),
    );
    removeRepoPath(root, '.claude/skills');
    symlinkRepoPath(root, '.claude/skills', `${outside}/skills`);

    const issues = await practiceSkillPermissionIssues(root, []);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/resolves outside/);
    expect(issues.some((issue) => issue.includes('oak-external'))).toBe(false);
  });

  it('surfaces an unreadable .claude/skills root as an issue rather than passing as "no Practice skills"', async () => {
    const root = sandboxRepo();
    // A regular file where the skills root should be — readdir gives ENOTDIR,
    // a non-ENOENT failure that must NOT read as an empty (absent) surface.
    writeRepoFile(root, '.claude/skills', 'not a directory\n');

    const issues = await practiceSkillPermissionIssues(root, []);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain('cannot list');
  });
});

describe('practiceSkillPermissionIssues fail-closed on unreadable state (injected seam)', () => {
  const passesRootGuard = async (p: string) => ({ kind: 'ok', value: p }) as const;

  it('reports a root-listing failure as an issue, never a silent "no Practice skills"', async () => {
    const fs: CensusFs = {
      async listSubdirectoryNames() {
        return { kind: 'failure', message: 'cannot list /repo/.claude/skills: EACCES' };
      },
      async readRegularFileTextNoFollow() {
        return { kind: 'ok', value: undefined };
      },
      resolveRealPath: passesRootGuard,
    };

    const issues = await practiceSkillPermissionIssues('/repo', [], fs);

    expect(issues).toStrictEqual([
      '.claude/settings.json: cannot list /repo/.claude/skills: EACCES',
    ]);
  });

  it('reports an unreadable Practice entry as an issue rather than dropping it', async () => {
    const fs: CensusFs = {
      async listSubdirectoryNames() {
        return { kind: 'ok', value: ['oak-x'] };
      },
      async readRegularFileTextNoFollow() {
        return {
          kind: 'failure',
          message: 'cannot read /repo/.claude/skills/oak-x/SKILL.md: EACCES',
        };
      },
      resolveRealPath: passesRootGuard,
    };

    const issues = await practiceSkillPermissionIssues('/repo', [], fs);

    expect(issues).toContain(
      '.claude/settings.json: cannot read /repo/.claude/skills/oak-x/SKILL.md: EACCES',
    );
  });
});
