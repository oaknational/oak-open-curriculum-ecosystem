import { describe, expect, it } from 'vitest';

import { parseAdapterStubPointer } from '../../src/skills-adapter-generate/adapter-stub';
import { specPortableFrontmatter } from '../../src/skills-adapter-generate/canonical-frontmatter';
import {
  buildAdapterFrontmatter,
  parseFrontmatter,
  renderAdapter,
  type ParsedCanonicalSkill,
} from '../../src/skills-adapter-generate/generator';

describe('parseFrontmatter spec-portable optional fields', () => {
  it('carries every spec-portable optional field a canonical declares', () => {
    const canonical = `---
name: parallax-design-experiment
classification: active
description: Designs and critiques prospective experiments.
license: MIT
compatibility: Requires Python 3.10+ only for the optional structural validator.
metadata:
  owned: "true"
  version: "0.1.0"
allowed-tools: Read Grep
---

body
`;

    expect(parseFrontmatter(canonical)).toEqual({
      name: 'parallax-design-experiment',
      description: 'Designs and critiques prospective experiments.',
      license: 'MIT',
      compatibility: 'Requires Python 3.10+ only for the optional structural validator.',
      metadata: { owned: 'true', version: '0.1.0' },
      'allowed-tools': 'Read Grep',
    });
  });

  it('omits the optional fields entirely when the canonical declares none', () => {
    const result = parseFrontmatter(
      '---\nname: go\nclassification: active\ndescription: Re-ground execution.\n---\n\nbody\n',
    );

    expect(result).toEqual({ name: 'go', description: 'Re-ground execution.' });
  });

  it('strips the canonical-only keys the specification does not define', () => {
    const result = parseFrontmatter(
      '---\nname: x\nclassification: passive\nconcern: cognition\ndomain: ui-design\ndescription: A skill.\n---\n\nbody\n',
    );

    expect(result).toEqual({ name: 'x', description: 'A skill.' });
  });

  it('refuses a metadata value that is not a string — the spec map is string to STRING', () => {
    const unquotedVersion = `---
name: x
description: A canonical skill.
metadata:
  version: 1.0
---

body
`;

    expect(parseFrontmatter(unquotedVersion)).toBeUndefined();
  });

  it('refuses a metadata block that is not a map at all', () => {
    const listMetadata = '---\nname: x\ndescription: A skill.\nmetadata:\n  - owned\n---\n\nbody\n';

    expect(parseFrontmatter(listMetadata)).toBeUndefined();
  });

  it('refuses a non-string compatibility rather than dropping it silently', () => {
    const numeric = '---\nname: x\ndescription: A skill.\ncompatibility: 3\n---\n\nbody\n';

    expect(parseFrontmatter(numeric)).toBeUndefined();
  });

  it('refuses an empty allowed-tools string — a declared field with no value is malformed', () => {
    const empty = "---\nname: x\ndescription: A skill.\nallowed-tools: ''\n---\n\nbody\n";

    expect(parseFrontmatter(empty)).toBeUndefined();
  });

  it('refuses an empty description — the specification requires it non-empty', () => {
    const empty = "---\nname: x\ndescription: ''\n---\n\nbody\n";

    expect(parseFrontmatter(empty)).toBeUndefined();
  });
});

describe('specPortableFrontmatter', () => {
  it('reads the fields in the specification table order so emission is stable', () => {
    const slice = specPortableFrontmatter({
      name: 'x',
      description: 'A skill.',
      'allowed-tools': 'Read',
      metadata: { owned: 'true' },
      compatibility: 'Requires jq.',
      license: 'MIT',
    });

    expect(Object.keys(slice)).toEqual(['license', 'compatibility', 'metadata', 'allowed-tools']);
  });

  it('contributes no keys for a canonical that declares none', () => {
    expect(specPortableFrontmatter({ name: 'x', description: 'A skill.' })).toEqual({});
  });
});

describe('buildAdapterFrontmatter spec-portable pass-through', () => {
  it('passes every spec-portable optional field through verbatim, after name and description', () => {
    const result = buildAdapterFrontmatter(
      {
        name: 'parallax',
        description: 'Orchestrate an inquiry.',
        license: 'MIT',
        compatibility: 'Requires Python 3.10+.',
        metadata: { owned: 'true', collection: 'parallax' },
        'allowed-tools': 'Read Grep',
      },
      'oak-',
      'parallax',
    );

    expect(result).toEqual({
      name: 'oak-parallax',
      description: 'Orchestrate an inquiry.',
      license: 'MIT',
      compatibility: 'Requires Python 3.10+.',
      metadata: { owned: 'true', collection: 'parallax' },
      'allowed-tools': 'Read Grep',
    });
    expect(Object.keys(result)).toEqual([
      'name',
      'description',
      'license',
      'compatibility',
      'metadata',
      'allowed-tools',
    ]);
  });

  it('emits only name and description for a canonical carrying no optional field', () => {
    const result = buildAdapterFrontmatter(
      { name: 'parallax', description: 'Orchestrate an inquiry.' },
      'oak-',
      'parallax',
    );

    expect(Object.keys(result)).toEqual(['name', 'description']);
  });
});

describe('renderAdapter spec-portable pass-through', () => {
  const carrier: ParsedCanonicalSkill = {
    id: 'parallax-design-experiment',
    relativeDir: 'cognition/parallax-design-experiment',
    frontmatter: {
      name: 'parallax-design-experiment',
      description: 'Designs prospective experiments.',
      compatibility: 'Requires Python 3.10+ only for the optional structural validator.',
      metadata: { owned: 'true', version: '0.1.0', collection: 'parallax' },
    },
    canonicalPath: '/repo/.agent/skills/cognition/parallax-design-experiment/SKILL-CANONICAL.md',
    canonicalFilename: 'SKILL-CANONICAL.md',
  };

  it('emits the optional fields into the adapter frontmatter on both surfaces', () => {
    for (const surface of ['claude', 'agents'] as const) {
      const content = renderAdapter(carrier, 'oak-', surface);

      expect(content).toContain(
        'compatibility: Requires Python 3.10+ only for the optional structural validator.',
      );
      expect(content).toContain('metadata:\n  owned: "true"\n  version: 0.1.0\n');
      expect(content).toContain('collection: parallax');
    }
  });

  it('keeps the Practice-projection class marker recognisable — a wider frontmatter must not change the stub SHAPE', () => {
    const content = renderAdapter(carrier, 'oak-', 'claude');

    expect(parseAdapterStubPointer(content)).toBe(
      'cognition/parallax-design-experiment/SKILL-CANONICAL.md',
    );
  });

  it('round-trips the emitted metadata back to the canonical string values', () => {
    const emitted = renderAdapter(carrier, 'oak-', 'agents');

    expect(parseFrontmatter(emitted)).toMatchObject({
      name: 'oak-parallax-design-experiment',
      metadata: { owned: 'true', version: '0.1.0', collection: 'parallax' },
    });
  });
});
