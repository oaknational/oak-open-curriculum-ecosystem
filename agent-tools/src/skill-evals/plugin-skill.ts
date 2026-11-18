import { posix } from 'node:path';

import { collect, err, ok, type Result } from '@oaknational/result';

import type { PluginSkill } from './project.js';
import type { SkillEvalsSeams } from './seams.js';
import {
  readRequired,
  withSiblingReferences,
  type PluginSkillFiles,
} from './sibling-projection.js';
import type { SourcedFile } from './sibling-references.js';

export type { PluginSkillFiles } from './sibling-projection.js';

/**
 * One skill's directory in the temporary plugin.
 *
 * @remarks
 * A plugin skill is the host adapter's frontmatter, so discovery is tested
 * on the projected description, over the canonical's body, so the Skill
 * tool itself delivers the method; the adapter's carried references sit
 * beside it, where the agent can read them (verified first-hand on
 * 2026-09-27: reads inside the plugin succeed and the runner substitutes
 * the plugin root variable in skill content). Nothing is placed in the
 * workspace, so the without-arm has no route to the method.
 *
 * A link into a sibling skill's references (read and never copied in the
 * repository) is rewritten by the sibling-references module to
 * `references/<sibling>/<file>` under the skill, and the file it names is
 * projected there from its canonical source, its own links rewritten the
 * same way, transitively. A linked reference that reads as absent is a
 * refusal naming the link, so every reference the projected files link is
 * in the plugin; links to anything else (a sibling's skill file, a rule)
 * stay as the canonical wrote them.
 *
 * @packageDocumentation
 */

/** The host adapter's directory, relative to the repository root. */
export function adapterDir(hostSkill: string): string {
  return posix.join('.claude', 'skills', hostSkill);
}

/** A markdown document's frontmatter block, delimiters included, and the body after it. */
function splitFrontmatter(
  text: string,
  label: string,
): Result<{ readonly frontmatter: string; readonly body: string }, Error> {
  const close = text.startsWith('---\n') ? text.indexOf('\n---\n', 4) : -1;
  if (close === -1) {
    return err(new Error(`${label} carries no frontmatter block`));
  }
  const end = close + '\n---\n'.length;
  return ok({ frontmatter: text.slice(0, end), body: text.slice(end) });
}

/** The plugin's SKILL.md for one skill: the adapter's frontmatter over the canonical's body, links as the canonical wrote them. */
function inlinedSkillFile(
  repoRoot: string,
  skill: PluginSkill,
  seams: SkillEvalsSeams,
): Result<SourcedFile, Error> {
  const adapterLabel = `the adapter .claude/skills/${skill.hostSkill}/SKILL.md`;
  const adapterPath = posix.join(repoRoot, adapterDir(skill.hostSkill), 'SKILL.md');
  const adapter = readRequired(adapterPath, adapterLabel, seams);
  if (!adapter.ok) {
    return adapter;
  }
  const canonicalRelativePath = posix.join(skill.canonicalRelativeDir, 'SKILL-CANONICAL.md');
  const canonical = readRequired(
    posix.join(repoRoot, canonicalRelativePath),
    canonicalRelativePath,
    seams,
  );
  if (!canonical.ok) {
    return canonical;
  }
  const head = splitFrontmatter(adapter.value, adapterLabel);
  if (!head.ok) {
    return head;
  }
  const method = splitFrontmatter(canonical.value, canonicalRelativePath);
  if (!method.ok) {
    return method;
  }
  return ok({
    file: {
      path: `skills/${skill.hostSkill}/SKILL.md`,
      content: `${head.value.frontmatter}${method.value.body}`,
      executable: false,
    },
    sourcePath: canonicalRelativePath,
  });
}

/** One adapter file placed where the plugin's skill lives; a listed file that reads as absent is an error. */
function adapterFile(
  dir: string,
  skill: PluginSkill,
  path: string,
  seams: SkillEvalsSeams,
): Result<SourcedFile, Error> {
  const text = readRequired(posix.join(dir, path), `the adapter file ${path}`, seams);
  return text.ok
    ? ok({
        file: { path: `skills/${skill.hostSkill}/${path}`, content: text.value, executable: false },
        sourcePath: posix.join(skill.canonicalRelativeDir, path),
      })
    : text;
}

/** One skill's files in the plugin: the inlined SKILL.md, the adapter's other files beside it, and every sibling reference they link. */
export function pluginSkillFiles(
  repoRoot: string,
  skill: PluginSkill,
  seams: SkillEvalsSeams,
): Result<PluginSkillFiles, Error> {
  const dir = posix.join(repoRoot, adapterDir(skill.hostSkill));
  const listed = seams.listFiles(dir);
  if (!listed.ok) {
    return listed;
  }
  if (!listed.value.includes('SKILL.md')) {
    return err(new Error(`no host adapter at .claude/skills/${skill.hostSkill}/SKILL.md`));
  }
  const inlined = inlinedSkillFile(repoRoot, skill, seams);
  if (!inlined.ok) {
    return inlined;
  }
  const others = collect(
    listed.value
      .filter((path) => path !== 'SKILL.md')
      .map((path) => adapterFile(dir, skill, path, seams)),
  );
  if (!others.ok) {
    return others;
  }
  return withSiblingReferences(repoRoot, skill, [inlined.value, ...others.value], seams);
}
