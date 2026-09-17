/**
 * Portability-validator consumer of the shared skills-tree topology walker
 * (`skills-adapter-generate/skill-tree-walk.ts` — the canonical owner of
 * the three-tier shape, consolidated at its second consumer, 2026-08-10).
 * This consumer collects existing canonical paths for
 * frontmatter/classification validation; dead-end directories are the
 * adapter checker's loud-skip territory, not this validator's.
 */

import { walkSkillTree } from '../../skills-adapter-generate/skill-tree-walk.js';

export interface SkillsWalkFs {
  listSubdirs(relPath: string): Promise<readonly string[]>;
  exists(relPath: string): Promise<boolean>;
}

export interface CanonicalSkillWalk {
  /** Repo-relative canonical paths for frontmatter validation. */
  readonly canonicalPaths: string[];
}

/**
 * Collect every canonical `SKILL-CANONICAL.md` at the three ratified tiers,
 * so frontmatter validation sees the same corpus the adapter generator
 * serves.
 */
export async function collectCanonicalSkillPaths(fs: SkillsWalkFs): Promise<CanonicalSkillWalk> {
  const walk: CanonicalSkillWalk = { canonicalPaths: [] };
  await walkSkillTree(
    {
      listChildDirectories: (relativeDir) =>
        fs.listSubdirs(relativeDir === '' ? '.agent/skills' : `.agent/skills/${relativeDir}`),
      hasCanonical: (relativeDir) => fs.exists(`.agent/skills/${relativeDir}/SKILL-CANONICAL.md`),
    },
    {
      onCanonical(relativeDir) {
        walk.canonicalPaths.push(`.agent/skills/${relativeDir}/SKILL-CANONICAL.md`);
      },
    },
  );
  return walk;
}
