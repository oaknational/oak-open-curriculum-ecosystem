/**
 * The one shared topology walker for the canonical skills tree — the
 * canonical owner of the ratified three-tier shape (consolidated at its
 * second consumer, 2026-08-10): flat (`<id>/`), concern member
 * (`<concern>/<id>/`), and domain member (`<concern>/<domain>/<id>/`,
 * owner-ruled 2026-08-10). The tree closes at three tiers — a directory
 * with no canonical at the third tier is a dead end whatever it contains.
 *
 * Consumers bring their own probe and handlers: adapter discovery
 * (`discovery.ts` beside this module) parses frontmatter and reports
 * skips; the portability validator consumes the same discovered
 * paths for frontmatter/classification validation and lock
 * cross-referencing. Topology changes happen HERE, once.
 */

/** All paths handed to the probe are skills-root-relative directory paths. */
export interface SkillTreeProbe {
  /** Child directory names of `<skills-root>/<relativeDir>` ('' = the root). */
  listChildDirectories(relativeDir: string): Promise<readonly string[]>;
  /** Whether `<skills-root>/<relativeDir>/SKILL-CANONICAL.md` is present. */
  hasCanonical(relativeDir: string): Promise<boolean>;
}

export interface SkillTreeHandlers {
  /** A directory carrying a canonical file (which may still fail parsing —
   * that judgment is the consumer's). */
  onCanonical(relativeDir: string): Promise<void> | void;
  /** A directory with no canonical and nowhere left to walk: empty, or at
   * the closed third tier (a deeper level is never inspected). */
  onDeadEnd?(relativeDir: string): Promise<void> | void;
}

const MAX_TIER = 3;

/** Walk the skills tree, visiting every node exactly once. */
export async function walkSkillTree(
  probe: SkillTreeProbe,
  handlers: SkillTreeHandlers,
): Promise<void> {
  for (const rootDir of await probe.listChildDirectories('')) {
    await walkNode(probe, handlers, rootDir, 1);
  }
}

async function walkNode(
  probe: SkillTreeProbe,
  handlers: SkillTreeHandlers,
  relativeDir: string,
  tier: number,
): Promise<void> {
  if (await probe.hasCanonical(relativeDir)) {
    await handlers.onCanonical(relativeDir);
    return;
  }
  if (tier >= MAX_TIER) {
    await handlers.onDeadEnd?.(relativeDir);
    return;
  }
  const children = await probe.listChildDirectories(relativeDir);
  if (children.length === 0) {
    await handlers.onDeadEnd?.(relativeDir);
    return;
  }
  for (const child of children) {
    await walkNode(probe, handlers, `${relativeDir}/${child}`, tier + 1);
  }
}
