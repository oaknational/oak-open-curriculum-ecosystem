/**
 * The vendored skills: the directories `skills-lock.json` pins under
 * `.agents/skills/`, whose files are the upstream's bytes and are never edited
 * here, so the shellcheck gate leaves them out.
 *
 * The lock is the one record of which skills are vendored, and the gate reads
 * it rather than a list of its own, so a skill that joins or leaves the lock
 * joins or leaves the exclusion in the same change. A skill written in this
 * repository is not in the lock and is linted. An entry counts only when it carries what the lock's tool records
 * for a vendored skill, its source and its content hash, so a bare key cannot
 * take a directory out of the lint. A lock this module cannot read fails the
 * gate; a repository with no lock has no vendored skills.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { z } from 'zod';

/** The lock, relative to the repository root. */
export const SKILLS_LOCK = 'skills-lock.json';

const VENDORED_SKILLS_DIRECTORY = '.agents/skills/';

/** A skill's directory name: lower-case words joined by hyphens, never a path. */
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/** What the lock records for each vendored skill that the gate relies on. */
const lockEntrySchema = z.object({
  source: z.string().min(1),
  computedHash: z.string().regex(/^[0-9a-f]{64}$/u),
});

/** The part of the lock the gate reads: the vendored skills, by directory name. */
const lockSchema = z.object({ skills: z.record(z.string().regex(SKILL_NAME), lockEntrySchema) });

function parsedJson(text: string): Result<unknown, string> {
  try {
    return ok(JSON.parse(text));
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : String(error));
  }
}

/**
 * The directory of each skill the lock pins, each ending `/`.
 *
 * @param lockText - The lock's text, or undefined when the repository has no lock.
 * @returns The directories, none when there is no lock, or a failure line when
 *   the lock is not JSON or its `skills` is not an object keyed by skill names.
 */
export function lockedSkillRoots(lockText: string | undefined): Result<readonly string[], string> {
  if (lockText === undefined) {
    return ok([]);
  }
  const json = parsedJson(lockText);
  if (!json.ok) {
    return err(`${SKILLS_LOCK} is not JSON (${json.error}), so the vendored skills are unknown`);
  }
  const lock = lockSchema.safeParse(json.value);
  if (lock.success) {
    return ok(typeSafeKeys(lock.data.skills).map((name) => `${VENDORED_SKILLS_DIRECTORY}${name}/`));
  }
  const [issue] = lock.error.issues;
  const where =
    issue === undefined || issue.path.length === 0 ? 'its top level' : issue.path.join('.');
  return err(
    `${SKILLS_LOCK} does not record its skills as the gate reads them (at ${where}: ${issue?.message ?? 'invalid'}), so the vendored skills are unknown`,
  );
}

/**
 * Whether a repo-relative path is inside one of the directories.
 *
 * @param file - Repo-relative path.
 * @param roots - Directories, each ending `/`.
 */
export function isInsideAny(file: string, roots: readonly string[]): boolean {
  return roots.some((root) => file.startsWith(root));
}
