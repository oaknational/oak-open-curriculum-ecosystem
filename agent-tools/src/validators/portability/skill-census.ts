/**
 * The Claude skill-permission census composition: the wiring that reads
 * `.claude/skills`, scopes it to the Practice class, and reports missing
 * `Skill(<name>)` entries. Extracted from the validator script so the
 * composition is importable and testable (the script itself binds its
 * repo root at module load and cannot be aimed at a fixture).
 */
import path from 'node:path';

import { realCarriageReadFs, type FsRead } from '../../skills-adapter-generate/carriage-fs.js';
import { readRegularFileTextNoFollow } from '../../skills-adapter-generate/read-regular-file.js';
import { surfaceRootGuardFailure } from '../../skills-adapter-generate/surface-roots.js';

import { getSkillPermissionIssues, selectPracticeSkillDirs } from './skill-permission-checks.js';
import { CLAUDE_SETTINGS_PATH } from './portability-constants.js';

/**
 * The filesystem seam the census reads through. Every method distinguishes
 * absence from failure: absence is classified per each read's own contract
 * (ENOENT for the listings, `readRegularFileTextNoFollow`'s documented
 * absence class for stub reads), while any other failure is a typed
 * `failure` the census surfaces as an issue, NEVER swallowed as "no
 * Practice skills" (the false-green review round 2026-08-12 defect 4 closed).
 * Injectable so the fail-closed behaviour is testable without a root-only
 * chmod fixture.
 */
export interface CensusFs {
  listSubdirectoryNames(path: string): Promise<FsRead<readonly string[]>>;
  readRegularFileTextNoFollow(path: string): Promise<FsRead<string | undefined>>;
  resolveRealPath(path: string): Promise<FsRead<string>>;
}

const realCensusFs: CensusFs = {
  listSubdirectoryNames: (p) => realCarriageReadFs.listSubdirectoryNames(p),
  readRegularFileTextNoFollow,
  resolveRealPath: (p) => realCarriageReadFs.resolveRealPath(p),
};

/**
 * The Claude permission census, scoped to the Practice class. Guards the
 * `.claude/skills` surface root first (a symlinked root or ancestor would
 * census directories outside the repo — read-through channel, security round 2
 * 2026-08-12), then selects the marker-carrying projections
 * (`selectPracticeSkillDirs`, whose reader is fd-anchored so a symlinked
 * `SKILL.md` is never read through) and reports any missing `Skill(<name>)`
 * entries. Vendor-class skills are the external machinery's business and never
 * censused.
 *
 * Every filesystem step reads through the typed seam: an unreadable root or
 * Practice entry (any non-ENOENT failure) becomes a census ISSUE, never a
 * silent "no Practice skills" pass.
 */
export async function practiceSkillPermissionIssues(
  repoRoot: string,
  permissions: string[],
  fs: CensusFs = realCensusFs,
): Promise<string[]> {
  const skillsRoot = path.join(repoRoot, '.claude/skills');
  const rootGuard = await surfaceRootGuardFailure({
    root: skillsRoot,
    surface: '.claude/skills',
    repoReal: await fs.resolveRealPath(repoRoot),
    resolveRealPath: (p) => fs.resolveRealPath(p),
  });
  if (rootGuard !== undefined) {
    return [`${CLAUDE_SETTINGS_PATH}: ${rootGuard}`];
  }
  const listing = await fs.listSubdirectoryNames(skillsRoot);
  if (listing.kind === 'failure') {
    return [`${CLAUDE_SETTINGS_PATH}: ${listing.message}`];
  }
  const selection = await selectPracticeSkillDirs(listing.value, (dirName) =>
    fs.readRegularFileTextNoFollow(path.join(skillsRoot, dirName, 'SKILL.md')),
  );
  return [
    ...selection.failures.map((message) => `${CLAUDE_SETTINGS_PATH}: ${message}`),
    ...getSkillPermissionIssues({
      claudeCommandFiles: [],
      claudeSkillDirs: selection.selected,
      claudeSettingsPermissions: permissions,
    }),
  ];
}
