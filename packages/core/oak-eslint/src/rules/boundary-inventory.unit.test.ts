import { describe, expect, it } from 'vitest';
import {
  checkIdentityPackTier,
  diffInventory,
  type IdentityPackTierEntry,
} from './boundary-inventory.js';

function presentTier(entries: readonly IdentityPackTierEntry[]): {
  tierState: 'present';
  strayRootEntries: readonly string[];
  entries: readonly IdentityPackTierEntry[];
} {
  return { tierState: 'present', strayRootEntries: [], entries };
}

// Assertion style, per testing-strategy §"Prove behaviour, never config or
// content": a refusal's observable contract is that a report EXISTS and that
// it names the concern and locates the offender. Tests therefore assert
// token presence on the joined report — never failure counts, ordering, or
// message prose, which are implementation granularity free to change.

describe('diffInventory', () => {
  it('returns no failures when declared and actual agree (order-insensitive)', () => {
    expect(
      diffInventory(
        'Design boundary inventory',
        ['@oaknational/b', '@oaknational/a'],
        ['@oaknational/a', '@oaknational/b'],
      ),
    ).toEqual([]);
  });

  it('reports a live workspace member the declaration lacks, attributed to the live side', () => {
    const failures = diffInventory(
      'Design boundary inventory',
      ['@oaknational/a'],
      ['@oaknational/a', '@oaknational/b'],
    );
    const report = failures.join('\n');
    const lineNamingMember = report
      .split('\n')
      .filter((line) => line.includes('@oaknational/b'))
      .join('\n');

    expect(report).toContain('Design boundary inventory');
    expect(lineNamingMember).toContain('Live');
  });

  it('reports a declared member the live workspace lacks, attributed to the declared side', () => {
    const failures = diffInventory('Library boundary inventory', ['@oaknational/gone'], []);
    const report = failures.join('\n');
    const lineNamingMember = report
      .split('\n')
      .filter((line) => line.includes('@oaknational/gone'))
      .join('\n');

    expect(report).toContain('Library boundary inventory');
    expect(lineNamingMember).toContain('Declared');
  });
});

const validPackJson: Record<string, unknown> = {
  name: '@oaknational/identity-pack-tango',
  version: '0.0.0-development',
  private: true,
  license: 'SEE LICENSE IN LICENCES.md',
};

// A complete data-only anatomy: manifest/data JSON (by place — the root
// manifests and *.tokens.json DTCG modules under dtcg/), authored CSS, docs,
// surface, vendored assets.
const dataOnlyFiles: readonly string[] = [
  'package.json',
  'manifest.json',
  'dtcg/palette.tokens.json',
  'brand.css',
  'README.md',
  'LICENCE',
  'assets/logo.svg',
  'fonts/display.woff2',
];

function packIn(
  directoryName: string,
  overrides: Record<string, unknown>,
  files: readonly string[] = dataOnlyFiles,
  symlinks: readonly string[] = [],
): IdentityPackTierEntry {
  return {
    directoryName,
    packageJson: {
      ...validPackJson,
      name: `@oaknational/identity-pack-${directoryName}`,
      ...overrides,
    },
    files,
    symlinks,
  };
}

function reportFor(entries: readonly IdentityPackTierEntry[]): string {
  return checkIdentityPackTier(presentTier(entries)).join('\n');
}

describe('checkIdentityPackTier', () => {
  it('refuses a missing tier directory, naming the tier path', () => {
    const report = checkIdentityPackTier({
      tierState: 'missing',
      strayRootEntries: [],
      entries: [],
    }).join('\n');

    expect(report).toContain('packages/design/identities');
  });

  it('refuses a tier path that is not a real directory — a linked tier would validate its target', () => {
    const report = checkIdentityPackTier({
      tierState: 'wrong-kind',
      strayRootEntries: [],
      entries: [],
    }).join('\n');

    expect(report).toContain('packages/design/identities');
    expect(report).toContain('kind');
  });

  it('refuses a stray tier-root entry, locating it — nothing sits outside the pack surfaces', () => {
    const report = checkIdentityPackTier({
      tierState: 'present',
      strayRootEntries: ['index.ts'],
      entries: [],
    }).join('\n');

    expect(report).toContain('packages/design/identities/index.ts');
  });

  it('passes on an existing tier with zero packs (the tier is minted before its first pack)', () => {
    expect(checkIdentityPackTier(presentTier([]))).toEqual([]);
  });

  it.each(['tango', 'delta'])(
    'passes a well-shaped data-only pack in directory %s',
    (directoryName) => {
      expect(checkIdentityPackTier(presentTier([packIn(directoryName, {})]))).toEqual([]);
    },
  );

  it.each(['tango', 'delta'])(
    'derives the required name from the directory: a pack in %s named for another slug is refused',
    (directoryName) => {
      const report = reportFor([packIn(directoryName, { name: '@oaknational/some-other-pack' })]);

      expect(report).toContain(`@oaknational/identity-pack-${directoryName}`);
      expect(report).toContain('@oaknational/some-other-pack');
      expect(report).toContain(`packages/design/identities/${directoryName}`);
    },
  );

  it('refuses a tier child that is itself a symbolic link, alone — nothing behind it is inspected', () => {
    const report = reportFor([
      {
        directoryName: 'tango',
        packageJson: undefined,
        files: [],
        symlinks: [],
        selfIsSymlink: true,
      },
    ]);
    expect(report).toContain('packages/design/identities/tango is a symbolic link');
    // Refused by KIND, alone: no phantom missing-manifest finding about a
    // target that was deliberately never read.
    expect(
      checkIdentityPackTier(
        presentTier([
          {
            directoryName: 'tango',
            packageJson: undefined,
            files: [],
            symlinks: [],
            selfIsSymlink: true,
          },
        ]),
      ),
    ).toHaveLength(1);
  });

  it('refuses a tier child with no package.json — every child is a pack workspace', () => {
    const report = reportFor([
      { directoryName: 'stray-dir', packageJson: undefined, files: [], symlinks: [] },
    ]);

    expect(report).toContain('packages/design/identities/stray-dir');
    expect(report).toContain('package.json');
  });

  it('reports an unparseable package.json as a located finding, not a crash', () => {
    const report = reportFor([
      {
        directoryName: 'tango',
        packageJson: undefined,
        files: ['package.json'],
        symlinks: [],
        parseFailure: 'Unexpected token } in JSON at position 40',
      },
    ]);

    expect(report).toContain('packages/design/identities/tango');
    expect(report).toContain('could not be parsed');
    expect(report).toContain('Unexpected token');
  });

  it.each([null, 'a string', 42])(
    'refuses a package.json that parses to a non-object (%j), locating the pack',
    (parsed) => {
      const report = reportFor([
        { directoryName: 'tango', packageJson: parsed, files: [], symlinks: [] },
      ]);

      expect(report).toContain('packages/design/identities/tango');
      expect(report).toContain('not an object');
    },
  );

  it.each([{ private: false }, { private: 'yes' }])(
    'refuses a pack whose private field is anything but literal true (%j)',
    (override) => {
      const report = reportFor([packIn('tango', override)]);

      expect(report).toContain('private');
      expect(report).toContain('packages/design/identities/tango');
    },
  );

  it('refuses a pack that declares scripts, even an empty scripts object — packs are data-only', () => {
    const report = reportFor([packIn('tango', { scripts: {} })]);

    expect(report).toContain('scripts');
    expect(report).toContain('packages/design/identities/tango');
  });

  it.each(['', '   '])(
    'refuses a pack whose license declaration is empty or whitespace-only (%j)',
    (license) => {
      const report = reportFor([packIn('tango', { license })]);

      expect(report).toContain('license');
      expect(report).toContain('packages/design/identities/tango');
    },
  );

  it('refuses a source-bearing pack — data-only is enforced on contents, not the scripts field', () => {
    const report = reportFor([packIn('tango', {}, [...dataOnlyFiles, 'src/index.ts'])]);

    expect(report).toContain('src/index.ts');
    expect(report).toContain('packages/design/identities/tango');
  });

  it('refuses a pack carrying tool configuration, naming the file', () => {
    const report = reportFor([packIn('tango', {}, [...dataOnlyFiles, 'eslint.config.js'])]);

    expect(report).toContain('eslint.config.js');
    expect(report).toContain('packages/design/identities/tango');
  });

  it('refuses a file class the closed anatomy has never admitted, naming the file', () => {
    const report = reportFor([packIn('tango', {}, [...dataOnlyFiles, 'pipeline.yaml'])]);

    expect(report).toContain('pipeline.yaml');
    expect(report).toContain('packages/design/identities/tango');
  });

  it('passes a pack whose contents are exactly the permitted data-only anatomy', () => {
    expect(checkIdentityPackTier(presentTier([packIn('tango', {}, dataOnlyFiles)]))).toEqual([]);
  });

  it('refuses a pack with no license declaration — each pack carries its own licence surface', () => {
    const report = reportFor([
      {
        directoryName: 'tango',
        packageJson: {
          name: '@oaknational/identity-pack-tango',
          version: '0.0.0-development',
          private: true,
        },
        files: [...dataOnlyFiles],
        symlinks: [],
      },
    ]);

    expect(report).toContain('license');
    expect(report).toContain('packages/design/identities/tango');
  });

  it('reports every fault of a single pack — a misnamed AND public pack has both concerns named', () => {
    const report = reportFor([
      packIn('tango', { name: '@oaknational/some-other-pack', private: false }),
    ]);

    expect(report).toContain('@oaknational/identity-pack-tango');
    expect(report).toContain('private');
  });

  it('reports faults across entries — each offending pack is located in the report', () => {
    const report = reportFor([
      { directoryName: 'stray-dir', packageJson: undefined, files: [], symlinks: [] },
      packIn('delta', { private: false }),
    ]);

    expect(report).toContain('packages/design/identities/stray-dir');
    expect(report).toContain('packages/design/identities/delta');
  });

  it.each(['biome.json', 'deno.json', 'package-lock.json', '.eslintrc.json', 'dtcg/biome.json'])(
    'admits JSON by place, never by extension: %s is refused as unadmitted JSON',
    (file) => {
      const report = reportFor([packIn('tango', {}, [...dataOnlyFiles, file])]);

      expect(report).toContain(file);
      expect(report).toContain('packages/design/identities/tango');
    },
  );

  it('refuses a nested package.json — the manifest place is the pack root only', () => {
    const report = reportFor([packIn('tango', {}, [...dataOnlyFiles, 'sub/package.json'])]);

    expect(report).toContain('sub/package.json');
  });

  it('admits *.tokens.json DTCG modules under dtcg/ at any depth', () => {
    expect(
      checkIdentityPackTier(
        presentTier([packIn('tango', {}, [...dataOnlyFiles, 'dtcg/semantic/dark.tokens.json'])]),
      ),
    ).toEqual([]);
  });

  it('refuses a committed dot-entry like .npmrc — content cannot hide behind a leading dot', () => {
    const report = reportFor([packIn('tango', {}, [...dataOnlyFiles, '.npmrc'])]);

    expect(report).toContain('.npmrc');
    expect(report).toContain('packages/design/identities/tango');
  });

  it('refuses a symbolic link by kind, naming the linked path', () => {
    const report = reportFor([packIn('tango', {}, dataOnlyFiles, ['assets/escape.svg'])]);

    expect(report).toContain('assets/escape.svg');
    expect(report).toContain('symbolic link');
  });

  it('collects manifest and anatomy faults together — a parse failure never shadows a source file', () => {
    const report = reportFor([
      {
        directoryName: 'tango',
        packageJson: undefined,
        files: ['package.json', 'src/index.ts'],
        symlinks: ['assets/escape.svg'],
        parseFailure: 'Unexpected token } in JSON at position 40',
      },
    ]);

    expect(report).toContain('could not be parsed');
    expect(report).toContain('src/index.ts');
    expect(report).toContain('assets/escape.svg');
  });

  it('collects a missing manifest alongside tool configuration in the same run', () => {
    const report = reportFor([
      { directoryName: 'tango', packageJson: undefined, files: ['turbo.json'], symlinks: [] },
    ]);

    expect(report).toContain('has no package.json');
    expect(report).toContain('turbo.json');
  });
});
