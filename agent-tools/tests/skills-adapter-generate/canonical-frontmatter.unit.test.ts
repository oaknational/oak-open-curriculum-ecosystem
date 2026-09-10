import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';

import {
  buildAdapterFrontmatter,
  renderAdapter,
} from '../../src/skills-adapter-generate/adapter-render';
import { parseAdapterStubPointer } from '../../src/skills-adapter-generate/adapter-stub';
import {
  parseFrontmatter,
  type ParsedCanonical,
} from '../../src/skills-adapter-generate/discovery';

const sampleCanonicalSkill = `---
name: start-right-quick
classification: active
description: Apply the repository start-right quick grounding workflow to the active session.
---

# Start Right (Quick)

## Goal

Workflow content here.
`;

/** The canonical frontmatter contract has one describing home, matching the
 * one product home the schema now has. */
describe('parseFrontmatter', () => {
  it('extracts the required fields from a fenced canonical', () => {
    expect(parseFrontmatter(sampleCanonicalSkill)).toEqual({
      ok: true,
      value: {
        name: 'start-right-quick',
        description:
          'Apply the repository start-right quick grounding workflow to the active session.',
      },
    });
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

    expect(parseFrontmatter(folded)).toMatchObject({
      ok: true,
      value: {
        name: 'commit',
        description:
          'Create a well-formed commit for current changes with conventional message format.',
      },
    });
  });

  it('strips the canonical-only keys the specification does not define', () => {
    const result = parseFrontmatter(
      '---\nname: x\nclassification: passive\nconcern: cognition\ndomain: ui-design\ndescription: A skill.\n---\n\nbody\n',
    );

    expect(result).toEqual({ ok: true, value: { name: 'x', description: 'A skill.' } });
  });

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
      ok: true,
      value: {
        name: 'parallax-design-experiment',
        description: 'Designs and critiques prospective experiments.',
        license: 'MIT',
        compatibility: 'Requires Python 3.10+ only for the optional structural validator.',
        metadata: { owned: 'true', version: '0.1.0' },
        'allowed-tools': 'Read Grep',
      },
    });
  });
});

/** Every refusal names WHAT to fix: the operator-facing end of this path is
 * a CLI line, and "the file is unreadable" is false for a readable file
 * with one mistyped value. */
describe('parseFrontmatter refusals name the reason', () => {
  it('refuses a file with no frontmatter fence', () => {
    expect(parseFrontmatter('# Just a heading\n\nNo frontmatter.')).toEqual({
      ok: false,
      error: 'no YAML frontmatter fence',
    });
  });

  /** A different system state from "the schema refused a field": the vendor
   * `YAMLParseError` is CAUGHT and converted, never thrown out of the run.
   * Its reason carries a vendor tail, so it cannot share the field-path rows. */
  it('refuses unreadable YAML instead of throwing out of the run', () => {
    const result = parseFrontmatter('---\nname: x\n  bad: [indent\n---\n\nbody\n');

    expect(result.ok, 'expected the vendor parse error to be converted, not thrown').toBe(false);
    expect(!result.ok && result.error).toContain('unreadable YAML frontmatter');
  });

  /** The six SCHEMA refusals are one behaviour — zod refuses and the reason
   * projects as `<field path>: <message>` — so they enumerate as rows. The
   * fragment is the FIELD PATH only: the message tail is zod's own prose and
   * pinning it would break on a zod upgrade for no behavioural reason. */
  it.each([
    ['a missing required field', '---\nname: foo\n---\n\nbody', 'description'],
    [
      'an unquoted version YAML reads as a number',
      '---\nname: x\ndescription: A skill.\nmetadata:\n  version: 1.0\n---\n\nbody\n',
      'metadata.version',
    ],
    [
      'a metadata block that is not a map at all',
      '---\nname: x\ndescription: A skill.\nmetadata:\n  - owned\n---\n\nbody\n',
      'metadata',
    ],
    [
      'a non-string compatibility',
      '---\nname: x\ndescription: A skill.\ncompatibility: 3\n---\n\nbody\n',
      'compatibility',
    ],
    [
      'a declared allowed-tools with no value',
      "---\nname: x\ndescription: A skill.\nallowed-tools: ''\n---\n\nbody\n",
      'allowed-tools',
    ],
    ['an empty description', "---\nname: x\ndescription: ''\n---\n\nbody\n", 'description'],
  ])('refuses %s, naming the field', (_case, canonical, field) => {
    const result = parseFrontmatter(canonical);

    expect(result.ok, `expected a refusal naming ${field}`).toBe(false);
    expect(!result.ok && result.error).toContain(field);
  });
});

describe('buildAdapterFrontmatter', () => {
  it('renames the skill with the configured prefix and preserves the description', () => {
    const result = buildAdapterFrontmatter(
      { name: 'go', description: 'Re-ground execution.' },
      'oak-',
      'go',
    );

    expect(result).toEqual({ name: 'oak-go', description: 'Re-ground execution.' });
  });

  it('uses an empty prefix when configured', () => {
    const result = buildAdapterFrontmatter(
      { name: 'go', description: 'Re-ground execution.' },
      '',
      'go',
    );

    expect(result).toEqual({ name: 'go', description: 'Re-ground execution.' });
  });

  it('passes every spec-portable optional field through, and rewrites only the name', () => {
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
  });
});

describe('renderAdapter spec-portable pass-through', () => {
  const carrier: ParsedCanonical = {
    id: 'parallax-design-experiment',
    relativeDir: 'cognition/parallax-design-experiment',
    frontmatter: {
      name: 'parallax-design-experiment',
      description: 'Designs prospective experiments.',
      license: 'MIT',
      compatibility: 'Requires Python 3.10+ only for the optional structural validator.',
      metadata: { owned: 'true', version: '0.1.0', collection: 'parallax' },
      'allowed-tools': 'Read Grep',
    },
    canonicalPath: '/repo/.agent/skills/cognition/parallax-design-experiment/SKILL-CANONICAL.md',
    canonicalFilename: 'SKILL-CANONICAL.md',
  };

  const lineIndex = (content: string, key: string): number =>
    content.split('\n').findIndex((line) => line.startsWith(`${key}:`));

  it.each(['claude', 'agents'] as const)(
    're-parses to the canonical values on the %s surface',
    (surface) => {
      const emitted = renderAdapter(carrier, 'oak-', surface);

      expect(parseFrontmatter(emitted)).toEqual({
        ok: true,
        value: {
          name: `oak-${carrier.id}`,
          description: 'Designs prospective experiments.',
          license: 'MIT',
          compatibility: 'Requires Python 3.10+ only for the optional structural validator.',
          metadata: { owned: 'true', version: '0.1.0', collection: 'parallax' },
          'allowed-tools': 'Read Grep',
        },
      });
    },
  );

  it('emits the frontmatter in the specification field order', () => {
    const content = renderAdapter(carrier, 'oak-', 'claude');

    const order = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'];
    const positions = order.map((key) => lineIndex(content, key));

    expect(positions).not.toContain(-1);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('emits no optional key at all for a canonical that declares none', () => {
    const bare: ParsedCanonical = {
      ...carrier,
      id: 'go',
      frontmatter: { name: 'go', description: 'Re-ground execution.' },
    };

    // Re-parsing names any leaked key on failure, where a per-key
    // line-index probe would only report a number.
    expect(parseFrontmatter(renderAdapter(bare, 'oak-', 'claude'))).toEqual({
      ok: true,
      value: { name: 'oak-go', description: 'Re-ground execution.' },
    });
  });

  /** The surfaces exist for FOREIGN vendors to read, and the two YAML
   * resolutions disagree about which bare scalars are strings: a 1.1
   * consumer (PyYAML, Ruby Psych, `yaml.v2`) reads `yes` and `1:30` as a
   * boolean and the number 90, while a 1.2 consumer reads `0o17` as 15.
   * Explicit quoting is what makes the projection survive BOTH, so both
   * are the assertion — reading the emitted file back the way each
   * consumer would, never a pin on our serialiser's quoting style. */
  it.each(['1.1', '1.2'] as const)(
    'emits metadata a YAML %s consumer still reads as strings',
    (version) => {
      const ambiguous: ParsedCanonical = {
        ...carrier,
        frontmatter: {
          name: 'x',
          description: 'A skill.',
          metadata: {
            experimental: 'yes',
            retired: 'no',
            enabled: 'on',
            disabled: 'off',
            short: 'y',
            since: '2026-09-09',
            window: '1:30',
            octalish: '0o17',
          },
        },
      };

      const emitted = renderAdapter(ambiguous, 'oak-', 'claude');
      const asForeignConsumerReadsIt: unknown = parseYaml(
        /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(emitted)?.[1] ?? '',
        { version },
      );

      expect(asForeignConsumerReadsIt).toMatchObject({
        metadata: {
          experimental: 'yes',
          retired: 'no',
          enabled: 'on',
          disabled: 'off',
          short: 'y',
          since: '2026-09-09',
          window: '1:30',
          octalish: '0o17',
        },
      });
    },
  );

  it('keeps the Practice-projection class marker recognisable — a wider frontmatter must not change the stub SHAPE', () => {
    const content = renderAdapter(carrier, 'oak-', 'claude');

    expect(parseAdapterStubPointer(content)).toBe(
      'cognition/parallax-design-experiment/SKILL-CANONICAL.md',
    );
  });
});
