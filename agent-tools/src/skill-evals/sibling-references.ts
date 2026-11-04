import { posix } from 'node:path';

import type { PluginSkill, ProjectedFile } from './project.js';

/**
 * Links from a projected skill file into a sibling skill's references.
 *
 * @remarks
 * A canonical body or reference may link a sibling skill's reference
 * (`../<sibling>/references/<file>` from the body, `../../<sibling>/...`
 * from a reference: read and never copied in the repository). In the
 * plugin the skill sits under `skills/<host>/`, where such a path names
 * nothing, so every inline link is resolved against the file's canonical
 * location; one that lands in a sibling's `references/` is pointed at
 * `references/<sibling>/<file>` under the skill, and the file it names is
 * reported for projection there; one that lands in the skill's own
 * `references/` is pointed at that copy from wherever the linking file now
 * sits, so a sibling's file that links back keeps resolving. Links with a
 * scheme, absolute links, bare fragments and links that would resolve above
 * the repository are left as written, as are reference-style definitions,
 * titled links and angle-bracket links.
 *
 * @packageDocumentation
 */

/** A sibling's reference file a projected file links: read from its canonical source, placed under the skill. */
export interface SiblingReference {
  readonly sourcePath: string;
  readonly projectedPath: string;
  /** The canonical path of the file that links it, and the link as written, for the refusal. */
  readonly linkedFrom: string;
  readonly target: string;
}

/** A file to project, with the canonical path its links are written from. */
export interface SourcedFile {
  readonly file: ProjectedFile;
  readonly sourcePath: string;
}

/** An inline markdown link's target: `](target)`, the target free of `)` and whitespace. */
const INLINE_LINK = /\]\(([^)\s]+)\)/gu;

/** A path inside a skill's references: the skill's canonical directory and the path below its first `references/`. */
const REFERENCE_PATH = /^(?<skillDir>.+?)\/references\/(?<rest>.+)$/u;

/** Whether a link target is a relative path this projector may rewrite: no scheme, not absolute, not a bare fragment, not angle-bracketed. */
function isRelativePath(target: string): boolean {
  return (
    !target.startsWith('#') &&
    !target.startsWith('/') &&
    !target.startsWith('<') &&
    !target.includes('://')
  );
}

/** A link target split at its fragment, the `#` kept with the fragment. */
function splitFragment(target: string): { readonly path: string; readonly fragment: string } {
  const hash = target.indexOf('#');
  return hash === -1
    ? { path: target, fragment: '' }
    : { path: target.slice(0, hash), fragment: target.slice(hash) };
}

/** The canonical directory and the path below its `references/` a resolved path names; nothing when it is no reference. */
function referenceOf(
  resolved: string,
): { readonly skillDir: string; readonly rest: string } | undefined {
  const groups = REFERENCE_PATH.exec(resolved)?.groups;
  const skillDir = groups?.['skillDir'];
  const rest = groups?.['rest'];
  return skillDir === undefined || rest === undefined ? undefined : { skillDir, rest };
}

/** Where a reference sits in the plugin: the skill's own under `references/`, a sibling's under `references/<sibling>/`. */
function projectedReferencePath(
  reference: { readonly skillDir: string; readonly rest: string },
  skill: PluginSkill,
): string {
  const own = reference.skillDir === skill.canonicalRelativeDir;
  return posix.join(
    'skills',
    skill.hostSkill,
    'references',
    own ? '' : posix.basename(reference.skillDir),
    reference.rest,
  );
}

/** One link's rewrite: the link to the reference's place in the plugin and, for a sibling's, the copy it needs; nothing when it names no reference. */
function referenceLink(
  target: string,
  sourcePath: string,
  projectedPath: string,
  skill: PluginSkill,
): { readonly link: string; readonly needed: SiblingReference | undefined } | undefined {
  if (!isRelativePath(target)) {
    return undefined;
  }
  const { path, fragment } = splitFragment(target);
  const resolved = posix.normalize(posix.join(posix.dirname(sourcePath), path));
  const reference = resolved.startsWith('../') ? undefined : referenceOf(resolved);
  if (reference === undefined) {
    return undefined;
  }
  const projected = projectedReferencePath(reference, skill);
  const own = reference.skillDir === skill.canonicalRelativeDir;
  return {
    link: `](${posix.relative(posix.dirname(projectedPath), projected)}${fragment})`,
    needed: own
      ? undefined
      : { sourcePath: resolved, projectedPath: projected, linkedFrom: sourcePath, target },
  };
}

/** The file with every link into a skill's references pointed at where the plugin holds it (a sibling's copy, or the skill's own from wherever the linking file now sits), and the sibling copies it needs, in link order. */
export function rewriteSiblingLinks(
  sourced: SourcedFile,
  skill: PluginSkill,
): { readonly file: ProjectedFile; readonly needed: readonly SiblingReference[] } {
  const needed: SiblingReference[] = [];
  const content = sourced.file.content.replaceAll(INLINE_LINK, (link: string, target: string) => {
    const rewrite = referenceLink(target, sourced.sourcePath, sourced.file.path, skill);
    if (rewrite === undefined) {
      return link;
    }
    if (rewrite.needed !== undefined) {
      needed.push(rewrite.needed);
    }
    return rewrite.link;
  });
  return { file: { ...sourced.file, content }, needed };
}
