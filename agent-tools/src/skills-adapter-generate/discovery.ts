/**
 * Canonical skill discovery, shared by the adapter generator and the drift
 * checker so both walk the corpus identically.
 *
 * Three standard shapes live under `.agent/skills/`: a flat individual
 * (`<id>/SKILL-CANONICAL.md`), a concern-tier member
 * (`<concern>/<id>/SKILL-CANONICAL.md`), and a domain-tier member
 * (`<concern>/<domain>/<id>/SKILL-CANONICAL.md` — the owner-ruled
 * 2026-08-10 domain subdirectories, e.g. `domain-craft/ui-design/`; one
 * domain tier under a concern, never deeper). A root entry that is none of
 * these shapes, a member directory without a canonical, a fourth tree
 * level, and a canonical with unparseable frontmatter are all skipped
 * loudly: they hold content no harness can summon.
 *
 * The frontmatter CONTRACT — the Agent Skills schema, what it strips, and
 * the spec-portable slice both adapter surfaces carry — lives in
 * `canonical-frontmatter.ts`; this module owns the walk and the seam.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { parse as parseYaml } from 'yaml';

import {
  validateCanonicalFrontmatter,
  type CanonicalFrontmatter,
} from './canonical-frontmatter.js';
import { walkSkillTree } from './skill-tree-walk.js';

export const CANONICAL_FILENAME = 'SKILL-CANONICAL.md';

export type { CanonicalFrontmatter } from './canonical-frontmatter.js';

export interface ParsedCanonical {
  readonly id: string;
  /** Directory of the canonical relative to `.agent/skills/` — the leaf id
   * for a flat individual, `<concern>/<id>` for a concern-tier member,
   * `<concern>/<domain>/<id>` for a domain-tier member. */
  readonly relativeDir: string;
  readonly frontmatter: CanonicalFrontmatter;
  readonly canonicalPath: string;
  readonly canonicalFilename: string;
}

/** Filesystem seam so unit tests can pass a deterministic in-memory map. */
export interface DiscoveryFs {
  readFileOrUndefined(path: string): Promise<string | undefined>;
  listSubdirectoryNames(path: string): Promise<readonly string[]>;
}

export interface DiscoveryOutcome {
  readonly canonicals: readonly ParsedCanonical[];
  /** Directories holding content no harness can summon. Loud by contract. */
  readonly skipped: readonly string[];
  /** Leaf ids seen more than once. The emitted adapter namespace is flat, so
   * a duplicate would silently last-writer-win; discovery reports it and the
   * generator refuses to emit. */
  readonly duplicates: readonly string[];
}

const realDiscoveryFs: DiscoveryFs = {
  async readFileOrUndefined(path) {
    try {
      return await readFile(path, 'utf8');
    } catch {
      return undefined;
    }
  },
  async listSubdirectoryNames(path) {
    let dirents;
    try {
      dirents = await readdir(path, { withFileTypes: true });
    } catch {
      return [];
    }
    return dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  },
};

/**
 * Discover every canonical skill under `.agent/skills/` via the shared
 * three-tier topology walker.
 */
export async function discoverCanonicals(
  repoRoot: string,
  fs: DiscoveryFs = realDiscoveryFs,
): Promise<DiscoveryOutcome> {
  const canonicals: ParsedCanonical[] = [];
  const skipped: string[] = [];
  const canonicalsRoot = join(repoRoot, '.agent', 'skills');

  // Topology lives in the shared walker (the canonical owner of the
  // three-tier shape); this consumer parses frontmatter and reports skips.
  // A directory whose canonical file exists but fails parsing reaches
  // onCanonical and is skipped there — the walker only probes presence.
  await walkSkillTree(
    {
      listChildDirectories: (relativeDir) =>
        fs.listSubdirectoryNames(join(canonicalsRoot, relativeDir)),
      hasCanonical: async (relativeDir) =>
        (await fs.readFileOrUndefined(join(canonicalsRoot, relativeDir, CANONICAL_FILENAME))) !==
        undefined,
    },
    {
      async onCanonical(relativeDir) {
        const parsed = await parseCanonicalAt(canonicalsRoot, relativeDir, fs);
        if (parsed === 'absent' || parsed === 'unparseable') {
          skipped.push(relativeDir);
        } else {
          canonicals.push(parsed);
        }
      },
      onDeadEnd(relativeDir) {
        skipped.push(relativeDir);
      },
    },
  );

  return { canonicals, skipped, duplicates: duplicateLeafIds(canonicals) };
}

async function parseCanonicalAt(
  canonicalsRoot: string,
  relativeDir: string,
  fs: DiscoveryFs,
): Promise<ParsedCanonical | 'absent' | 'unparseable'> {
  const canonicalPath = join(canonicalsRoot, relativeDir, CANONICAL_FILENAME);
  const text = await fs.readFileOrUndefined(canonicalPath);
  if (text === undefined) {
    return 'absent';
  }
  const frontmatter = parseFrontmatter(text);
  if (frontmatter === undefined) {
    return 'unparseable';
  }
  const id = relativeDir.split('/').at(-1) ?? relativeDir;
  return { id, relativeDir, frontmatter, canonicalPath, canonicalFilename: CANONICAL_FILENAME };
}

function duplicateLeafIds(canonicals: readonly ParsedCanonical[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const canonical of canonicals) {
    if (seen.has(canonical.id) && !duplicates.includes(canonical.id)) {
      duplicates.push(canonical.id);
    }
    seen.add(canonical.id);
  }
  return duplicates;
}

/**
 * Extract the leading YAML frontmatter block from a markdown file body and
 * validate it against the Agent Skills frontmatter schema
 * (`canonical-frontmatter.ts`, which owns the contract and documents what
 * it admits, strips, and refuses).
 *
 * Returns undefined when the file lacks a frontmatter fence or the block
 * fails the schema. The caller reads `undefined` as an unparseable
 * canonical, which the generator and the drift checker both fail on loudly
 * rather than emitting a projection that disagrees with its source.
 */
export function parseFrontmatter(text: string): CanonicalFrontmatter | undefined {
  const fenceMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (fenceMatch === null) {
    return undefined;
  }
  const yamlBody = fenceMatch[1] ?? '';
  return validateCanonicalFrontmatter(parseYaml(yamlBody));
}
