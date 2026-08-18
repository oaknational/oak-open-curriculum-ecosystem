/*
 * The slug → target-fragment mapping for surfaces keyed by identity.
 *
 * Identity slugs and the fragments that name things ABOUT an identity are not
 * the same vocabulary: `creature` is the slug in `?brand=` URLs and on disk,
 * while `emc2` is the fragment in pair ids, evidence filenames and description
 * keys. This module is the one place that maps between them, so no consumer
 * re-declares the correspondence. Framework-free, so the server route, the
 * fidelity tooling and the client control can all share it.
 */
import { err, ok, type Result } from '@oaknational/result';

/** The ratified identity names (wow-verdict-register roster). */
export type TargetIdentity = 'oak' | 'pds' | 'emc2';

/** Every known slug and the fragment that names it. Slugs whose fragment is
 *  their own name are listed explicitly rather than defaulted: the table is
 *  the complete statement of the vocabulary, and adding an identity means
 *  adding a row here. */
const FRAGMENT_BY_SLUG: Readonly<Partial<Record<string, TargetIdentity>>> = {
  oak: 'oak',
  pds: 'pds',
  creature: 'emc2',
};

/**
 * Map every identity slug to its fragment. A slug with no row is a drifted
 * roster, not a defaultable case — it fails loud so a later identity addition
 * trips this boundary instead of silently naming its evidence after nothing.
 * Pure; callers unwrap at module load, the zod-at-module-init precedent.
 */
export function targetFragmentsFor(
  identities: readonly string[],
): Result<Readonly<Record<string, TargetIdentity>>, string> {
  const fragments: Record<string, TargetIdentity> = {};
  const unknown: string[] = [];
  for (const slug of identities) {
    const fragment = FRAGMENT_BY_SLUG[slug];
    if (fragment === undefined) {
      unknown.push(slug);
    } else {
      fragments[slug] = fragment;
    }
  }
  if (unknown.length > 0) {
    const quoted = unknown.map((slug) => `'${slug}'`).join(', ');
    return err(
      `identities: no target fragment for ${quoted} — add a row to FRAGMENT_BY_SLUG in lib/identities.ts alongside the identity change`,
    );
  }
  return ok(fragments);
}
