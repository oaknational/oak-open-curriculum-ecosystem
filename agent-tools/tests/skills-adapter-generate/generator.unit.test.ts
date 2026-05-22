import { describe, expect, it } from 'vitest';

import { checkAdapters, type CheckerFs } from '../../src/skills-adapter-generate/checker';
import {
  adapterTargetPath,
  buildAdapterFrontmatter,
  parseFrontmatter,
  renderAdapter,
  type AdapterSurface,
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
      'jc-',
      'go',
    );

    expect(result).toEqual({
      name: 'jc-go',
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

function makeFs(files: ReadonlyMap<string, string>): CheckerFs {
  return {
    async readFileOrUndefined(path) {
      return files.get(path);
    },
    async listSubdirectoryNames(path) {
      return path === '/repo/.agent/skills' ? ['sample'] : [];
    },
  };
}

describe('checkAdapters', () => {
  const repoRoot = '/repo';
  const prefix = 'jc-';
  const sampleCanonical: ParsedCanonicalSkill = {
    id: 'sample',
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

  it('detects drift in a modified adapter', async () => {
    const claude = expectedAdapter('claude');
    const agents = expectedAdapter('agents');
    const fs = makeFs(
      new Map([
        [
          sampleCanonical.canonicalPath,
          '---\nname: sample\ndescription: A sample canonical skill.\n---\n\nbody\n',
        ],
        [claude.path, `${claude.content}\n<!-- drift -->\n`],
        [agents.path, agents.content],
      ]),
    );

    const result = await checkAdapters({ repoRoot, prefix }, fs);

    expect(result.drifted).toEqual([claude.path]);
    expect(result.missing).toEqual([]);
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
