import { describe, expect, it } from 'vitest';

import { checkAdapters, type CheckerFs } from '../../src/skills-adapter-generate/checker';
import type { FsRead } from '../../src/skills-adapter-generate/carriage';
import {
  adapterTargetPath,
  buildAdapterFrontmatter,
  discoverCanonicals,
  generateExitCode,
  parseFrontmatter,
  renderAdapter,
  type AdapterSurface,
  type DiscoveryFs,
  type ParsedCanonicalSkill,
} from '../../src/skills-adapter-generate/generator';

const sampleCanonicalSkill = `---
name: start-right-quick
classification: active
description: Apply the repository start-right quick grounding workflow to the active session.
---

# Start Right (Quick)

## Goal

Workflow content here.
`;

describe('parseFrontmatter', () => {
  it('extracts name and description from a fenced canonical SKILL, discarding extra keys', () => {
    const result = parseFrontmatter(sampleCanonicalSkill);

    expect(result).toEqual({
      name: 'start-right-quick',
      description:
        'Apply the repository start-right quick grounding workflow to the active session.',
    });
  });

  it('returns undefined when the file lacks a frontmatter fence', () => {
    const result = parseFrontmatter('# Just a heading\n\nNo frontmatter.');

    expect(result).toBeUndefined();
  });

  it('returns undefined when frontmatter omits the required description', () => {
    const result = parseFrontmatter('---\nname: foo\n---\n\nbody');

    expect(result).toBeUndefined();
  });

  it('handles folded-scalar descriptions', () => {
    const folded = `---
name: commit
description: >-
  Create a well-formed commit for current changes with conventional
  message format.
---

body
`;
    const result = parseFrontmatter(folded);

    expect(result).toMatchObject({
      name: 'commit',
      description:
        'Create a well-formed commit for current changes with conventional message format.',
    });
  });
});

describe('buildAdapterFrontmatter', () => {
  it('renames the skill with the configured prefix and preserves the description', () => {
    const result = buildAdapterFrontmatter(
      { name: 'go', description: 'Re-ground execution.' },
      'oak-',
      'go',
    );

    expect(result).toEqual({
      name: 'oak-go',
      description: 'Re-ground execution.',
    });
  });

  it('uses an empty prefix when configured', () => {
    const result = buildAdapterFrontmatter(
      { name: 'go', description: 'Re-ground execution.' },
      '',
      'go',
    );

    expect(result).toEqual({ name: 'go', description: 'Re-ground execution.' });
  });
});

const encoder = new TextEncoder();

const ok = <T>(value: T): FsRead<T> => ({ kind: 'ok', value });

/** Discovery keeps its own plain-list seam (collapse-to-empty is its
 * documented error semantic); bridge the union-typed checker fs onto it. */
function asDiscovery(fs: CheckerFs): DiscoveryFs {
  return {
    readFileOrUndefined: (path) => fs.readFileOrUndefined(path),
    async listSubdirectoryNames(path) {
      const listed = await fs.listSubdirectoryNames(path);
      return listed.kind === 'ok' ? [...listed.value] : [];
    },
  };
}

/**
 * In-memory checker fs. Directory listings are the union of the explicit
 * `directories` map (which can express canonically-empty directories) and
 * listings derived from the `files` keys (so carried-file fixtures stay
 * consistent with the directories that hold them by construction).
 */
function makeTreeFs(
  directories: ReadonlyMap<string, readonly string[]>,
  files: ReadonlyMap<string, string>,
): CheckerFs {
  return {
    async readFileOrUndefined(path) {
      return files.get(path);
    },
    async readFileBytesOrUndefined(path) {
      const text = files.get(path);
      return ok(text === undefined ? undefined : encoder.encode(text));
    },
    async listSubdirectoryNames(path) {
      const names = new Set<string>(directories.get(path) ?? []);
      const prefix = `${path}/`;
      for (const filePath of files.keys()) {
        if (!filePath.startsWith(prefix)) {
          continue;
        }
        const remainder = filePath.slice(prefix.length);
        const separatorIndex = remainder.indexOf('/');
        if (separatorIndex > 0) {
          names.add(remainder.slice(0, separatorIndex));
        }
      }
      return ok([...names]);
    },
    async listFileNames(path) {
      const names: string[] = [];
      const prefix = `${path}/`;
      for (const filePath of files.keys()) {
        if (filePath.startsWith(prefix) && !filePath.slice(prefix.length).includes('/')) {
          names.push(filePath.slice(prefix.length));
        }
      }
      return ok(names);
    },
    async listOtherEntryNames() {
      // A text-map fixture holds regular files only; non-regular-entry
      // behaviour is proven in the carriage unit and integration suites.
      return ok([]);
    },
    async entryKind(path) {
      // Text-map semantics: a key is a regular file; a directory exists
      // when listed explicitly or implied by any file beneath it; the
      // fixture cannot express symlinks (integration suites own those).
      if (files.has(path)) {
        return ok('file' as const);
      }
      const prefix = `${path}/`;
      const isDirectory =
        directories.has(path) ||
        [...directories.keys()].some((dir) => dir.startsWith(prefix) || dir === path) ||
        [...files.keys()].some((filePath) => filePath.startsWith(prefix));
      return ok(isDirectory ? ('directory' as const) : ('absent' as const));
    },
    async isExecutableOrUndefined(path) {
      return ok(files.has(path) ? false : undefined);
    },
    async resolveRealPath(path) {
      return ok(path); // the text-map fixture holds no symlinked ancestors
    },
  };
}

function makeFs(files: ReadonlyMap<string, string>): CheckerFs {
  return makeTreeFs(new Map(), files);
}

const canonicalBody = '---\nname: x\ndescription: A canonical skill.\n---\n\nbody\n';

describe('discoverCanonicals', () => {
  const repoRoot = '/repo';

  it('discovers flat individuals and concern-tier members together', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['flat-one', 'fam']],
        ['/repo/.agent/skills/fam', ['member-a', 'member-b']],
      ]),
      new Map([
        ['/repo/.agent/skills/flat-one/SKILL-CANONICAL.md', canonicalBody],
        ['/repo/.agent/skills/fam/member-a/SKILL-CANONICAL.md', canonicalBody],
        ['/repo/.agent/skills/fam/member-b/SKILL-CANONICAL.md', canonicalBody],
      ]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.skipped).toEqual([]);
    expect(outcome.duplicates).toEqual([]);
    expect(outcome.canonicals.map((c) => [c.id, c.relativeDir])).toEqual([
      ['flat-one', 'flat-one'],
      ['member-a', 'fam/member-a'],
      ['member-b', 'fam/member-b'],
    ]);
  });

  it('skips a root directory that is neither a skill nor a concern tier', async () => {
    const fs = makeTreeFs(new Map([['/repo/.agent/skills', ['neither']]]), new Map());

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.canonicals).toEqual([]);
    expect(outcome.skipped).toEqual(['neither']);
  });

  it('skips a concern member directory without a readable canonical', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['fam']],
        ['/repo/.agent/skills/fam', ['good', 'hollow']],
      ]),
      new Map([['/repo/.agent/skills/fam/good/SKILL-CANONICAL.md', canonicalBody]]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.canonicals.map((c) => c.id)).toEqual(['good']);
    expect(outcome.skipped).toEqual(['fam/hollow']);
  });

  it('discovers a domain-tier member under a concern (concern/domain/skill)', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['domain-craft']],
        ['/repo/.agent/skills/domain-craft', ['ui-design']],
        ['/repo/.agent/skills/domain-craft/ui-design', ['skill-x']],
      ]),
      new Map([
        ['/repo/.agent/skills/domain-craft/ui-design/skill-x/SKILL-CANONICAL.md', canonicalBody],
      ]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.skipped).toEqual([]);
    expect(outcome.canonicals.map((c) => [c.id, c.relativeDir])).toEqual([
      ['skill-x', 'domain-craft/ui-design/skill-x'],
    ]);
  });

  it('discovers direct concern members and domain-tier members side by side', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['domain-craft']],
        ['/repo/.agent/skills/domain-craft', ['direct-member', 'ui-design']],
        ['/repo/.agent/skills/domain-craft/ui-design', ['skill-x']],
      ]),
      new Map([
        ['/repo/.agent/skills/domain-craft/direct-member/SKILL-CANONICAL.md', canonicalBody],
        ['/repo/.agent/skills/domain-craft/ui-design/skill-x/SKILL-CANONICAL.md', canonicalBody],
      ]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.skipped).toEqual([]);
    expect(outcome.canonicals.map((c) => [c.id, c.relativeDir])).toEqual([
      ['direct-member', 'domain-craft/direct-member'],
      ['skill-x', 'domain-craft/ui-design/skill-x'],
    ]);
  });

  it('skips a domain member directory without a readable canonical', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['domain-craft']],
        ['/repo/.agent/skills/domain-craft', ['ui-design']],
        ['/repo/.agent/skills/domain-craft/ui-design', ['good', 'hollow']],
      ]),
      new Map([
        ['/repo/.agent/skills/domain-craft/ui-design/good/SKILL-CANONICAL.md', canonicalBody],
      ]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.canonicals.map((c) => c.id)).toEqual(['good']);
    expect(outcome.skipped).toEqual(['domain-craft/ui-design/hollow']);
  });

  it('never walks deeper than the domain tier — a fourth level is content no harness can summon', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['fam']],
        ['/repo/.agent/skills/fam', ['dom']],
        ['/repo/.agent/skills/fam/dom', ['too-deep']],
        ['/repo/.agent/skills/fam/dom/too-deep', ['deeper']],
      ]),
      new Map([['/repo/.agent/skills/fam/dom/too-deep/deeper/SKILL-CANONICAL.md', canonicalBody]]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.canonicals).toEqual([]);
    expect(outcome.skipped).toEqual(['fam/dom/too-deep']);
  });

  it('reports duplicate leaf ids across shapes — the flat adapter namespace must stay injective', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['member-a', 'fam']],
        ['/repo/.agent/skills/fam', ['member-a']],
      ]),
      new Map([
        ['/repo/.agent/skills/member-a/SKILL-CANONICAL.md', canonicalBody],
        ['/repo/.agent/skills/fam/member-a/SKILL-CANONICAL.md', canonicalBody],
      ]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.duplicates).toEqual(['member-a']);
  });

  it('skips a skill directory whose canonical fails frontmatter parsing', async () => {
    const fs = makeTreeFs(
      new Map([['/repo/.agent/skills', ['broken']]]),
      new Map([['/repo/.agent/skills/broken/SKILL-CANONICAL.md', '# No frontmatter\n']]),
    );

    const outcome = await discoverCanonicals(repoRoot, asDiscovery(fs));

    expect(outcome.canonicals).toEqual([]);
    expect(outcome.skipped).toEqual(['broken']);
  });
});

describe('renderAdapter for concern-tier members', () => {
  const familyMember: ParsedCanonicalSkill = {
    id: 'parallax-frame',
    relativeDir: 'cognition/parallax-frame',
    frontmatter: { name: 'parallax-frame', description: 'Frame an inquiry.' },
    canonicalPath: '/repo/.agent/skills/parallax/skills/parallax-frame/SKILL-CANONICAL.md',
    canonicalFilename: 'SKILL-CANONICAL.md',
  };

  it('links the concern-relative canonical path while naming by leaf id', () => {
    const content = renderAdapter(familyMember, 'oak-', 'claude');

    expect(content).toContain('name: oak-parallax-frame');
    expect(content).toContain(
      'Read and follow `.agent/skills/cognition/parallax-frame/SKILL-CANONICAL.md`.',
    );
  });
});

describe('checkAdapters over a concern tier', () => {
  it('reports concern member adapters missing at their flat target paths', async () => {
    const fs = makeTreeFs(
      new Map([
        ['/repo/.agent/skills', ['fam']],
        ['/repo/.agent/skills/fam', ['member-a']],
      ]),
      new Map([['/repo/.agent/skills/fam/member-a/SKILL-CANONICAL.md', canonicalBody]]),
    );

    const result = await checkAdapters({ repoRoot: '/repo', prefix: 'oak-' }, fs);

    expect(result.missing).toEqual([
      adapterTargetPath('/repo', 'oak-', 'member-a', 'claude'),
      adapterTargetPath('/repo', 'oak-', 'member-a', 'agents'),
    ]);
  });
});

describe('checkAdapters', () => {
  const repoRoot = '/repo';
  const prefix = 'oak-';
  const sampleCanonical: ParsedCanonicalSkill = {
    id: 'sample',
    relativeDir: 'sample',
    frontmatter: { name: 'sample', description: 'A sample canonical skill.' },
    canonicalPath: '/repo/.agent/skills/sample/SKILL-CANONICAL.md',
    canonicalFilename: 'SKILL-CANONICAL.md',
  };

  function expectedAdapter(surface: AdapterSurface): { path: string; content: string } {
    return {
      path: adapterTargetPath(repoRoot, prefix, sampleCanonical.id, surface),
      content: renderAdapter(sampleCanonical, prefix, surface),
    };
  }

  it('reports no drift when adapters match what the generator would emit', async () => {
    const claude = expectedAdapter('claude');
    const agents = expectedAdapter('agents');
    const fs = makeFs(
      new Map([
        [
          sampleCanonical.canonicalPath,
          '---\nname: sample\ndescription: A sample canonical skill.\n---\n\nbody\n',
        ],
        [claude.path, claude.content],
        [agents.path, agents.content],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.drifted).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('reports the discovered canonical count so an empty corpus can refuse loudly', async () => {
    const directories = new Map<string, readonly string[]>([['/repo/.agent/skills', []]]);
    const files = new Map<string, string>();

    const result = await checkAdapters(
      { repoRoot: '/repo', prefix: 'oak-' },
      makeTreeFs(directories, files),
    );

    expect(result.canonicalCount).toBe(0);
  });

  it('surfaces skipped directories — content no harness can summon must fail the check', async () => {
    const directories = new Map([['/repo/.agent/skills', ['ghost']]]);
    const files = new Map<string, string>();

    const result = await checkAdapters(
      { repoRoot: '/repo', prefix: 'oak-' },
      makeTreeFs(directories, files),
    );

    expect(result.skipped).toEqual(['ghost']);
  });

  it('detects drift in a modified adapter that is still recognisably ours', async () => {
    const claude = expectedAdapter('claude');
    const agents = expectedAdapter('agents');
    const fs = makeFs(
      new Map([
        [
          sampleCanonical.canonicalPath,
          '---\nname: sample\ndescription: A sample canonical skill.\n---\n\nbody\n',
        ],
        // A frontmatter edit drifts the bytes but keeps the structural
        // stub shape, so the entry is still ours to adjudicate.
        [claude.path, claude.content.replace('A sample canonical skill.', 'Edited by hand.')],
        [agents.path, agents.content],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.drifted).toEqual([claude.path]);
    expect(result.missing).toEqual([]);
  });

  it('refuses an adapter mangled beyond recognition: an unprovable occupant is never adjudicated as drift', async () => {
    const claude = expectedAdapter('claude');
    const agents = expectedAdapter('agents');
    const fs = makeFs(
      new Map([
        [
          sampleCanonical.canonicalPath,
          '---\nname: sample\ndescription: A sample canonical skill.\n---\n\nbody\n',
        ],
        // Appended content breaks the structural stub shape — the entry
        // can no longer be proven ours; the checker refuses instead of
        // inviting a regeneration over unproven territory.
        [claude.path, `${claude.content}\n<!-- drift -->\n`],
        [agents.path, agents.content],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.drifted).toEqual([]);
    expect(result.refused.some((message) => /not recognisably ours/.test(message))).toBe(true);
  });

  it('detects missing adapters', async () => {
    const claude = expectedAdapter('claude');
    const agents = expectedAdapter('agents');
    const fs = makeFs(
      new Map([
        [
          sampleCanonical.canonicalPath,
          '---\nname: sample\ndescription: A sample canonical skill.\n---\n\nbody\n',
        ],
        [claude.path, claude.content],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.missing).toEqual([agents.path]);
    expect(result.drifted).toEqual([]);
  });
});

describe('checkAdapters carriage', () => {
  const repoRoot = '/repo';
  const prefix = 'oak-';
  const canonicalDir = '/repo/.agent/skills/cognition/parallax';
  const parsedParallax: ParsedCanonicalSkill = {
    id: 'parallax',
    relativeDir: 'cognition/parallax',
    frontmatter: { name: 'x', description: 'A canonical skill.' },
    canonicalPath: `${canonicalDir}/SKILL-CANONICAL.md`,
    canonicalFilename: 'SKILL-CANONICAL.md',
  };

  function adapterFixture(): ReadonlyMap<string, string> {
    const entries = new Map<string, string>([[parsedParallax.canonicalPath, canonicalBody]]);
    for (const surface of ['claude', 'agents'] as const) {
      entries.set(
        adapterTargetPath(repoRoot, prefix, parsedParallax.id, surface),
        renderAdapter(parsedParallax, prefix, surface),
      );
    }
    return entries;
  }

  function withCarried(extra: ReadonlyMap<string, string>): CheckerFs {
    return makeTreeFs(new Map(), new Map([...adapterFixture(), ...extra]));
  }

  const claudeDir = '/repo/.claude/skills/oak-parallax';
  const agentsDir = '/repo/.agents/skills/oak-parallax';

  it('is green when every carried file is byte-identical on both surfaces, counting the canonical carried set', async () => {
    const fs = withCarried(
      new Map([
        [`${canonicalDir}/references/a.md`, 'alpha'],
        [`${claudeDir}/references/a.md`, 'alpha'],
        [`${agentsDir}/references/a.md`, 'alpha'],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.drifted).toEqual([]);
    expect(result.missing).toEqual([]);
    expect(result.orphaned).toEqual([]);
    expect(result.carriedFileCount).toBe(1);
  });

  it('reports drift on a mutated carried file on one surface only', async () => {
    const fs = withCarried(
      new Map([
        [`${canonicalDir}/references/a.md`, 'alpha'],
        [`${claudeDir}/references/a.md`, 'alpha — mutated'],
        [`${agentsDir}/references/a.md`, 'alpha'],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.drifted).toEqual([`${claudeDir}/references/a.md`]);
  });

  it('reports a carried file missing from a surface', async () => {
    const fs = withCarried(
      new Map([
        [`${canonicalDir}/scripts/tool.py`, 'code'],
        [`${claudeDir}/scripts/tool.py`, 'code'],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.missing).toEqual([`${agentsDir}/scripts/tool.py`]);
  });

  it('reports orphans: projection files whose canonical source is gone', async () => {
    const fs = withCarried(new Map([[`${claudeDir}/references/deleted-upstream.md`, 'stale']]));

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.orphaned).toEqual([`${claudeDir}/references/deleted-upstream.md`]);
  });
});

describe('generateExitCode', () => {
  it('returns success when nothing was skipped and no leaf ids collide', () => {
    expect(
      generateExitCode({
        written: ['a', 'b'],
        skipped: [],
        duplicates: [],
        pruned: [],
        refused: [],
        sweptStale: [],
        cleared: [],
      }),
    ).toBe(0);
  });

  it('fails hard when any directory was skipped', () => {
    expect(
      generateExitCode({
        written: ['a'],
        skipped: ['uncategorised'],
        duplicates: [],
        pruned: [],
        refused: [],
        sweptStale: [],
        cleared: [],
      }),
    ).toBe(1);
  });

  it('fails hard when any emission was refused', () => {
    expect(
      generateExitCode({
        written: ['a'],
        skipped: [],
        duplicates: [],
        pruned: [],
        refused: ['canonical carried tree contains a symlink'],
        sweptStale: [],
        cleared: [],
      }),
    ).toBe(1);
  });

  it('fails hard when leaf ids collide in the flat adapter namespace', () => {
    expect(
      generateExitCode({
        written: [],
        skipped: [],
        duplicates: ['member-a'],
        pruned: [],
        refused: [],
        sweptStale: [],
        cleared: [],
      }),
    ).toBe(1);
  });

  it('treats pruned orphans as a successful cure, not a failure', () => {
    expect(
      generateExitCode({
        written: ['a'],
        skipped: [],
        duplicates: [],
        pruned: ['b'],
        refused: [],
        sweptStale: [],
        cleared: [],
      }),
    ).toBe(0);
  });
});
