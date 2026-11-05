import { describe, expect, it } from 'vitest';

import { installTimeClosure, type InstallTimeClosureVerdict } from './install-time-closure.js';
import { type Manifest, type WorkspaceManifestInput } from './install-time-manifest.js';

const RECIPE = 'tsup && tsc --emitDeclarationOnly --project tsconfig.build.json';
const ROOT_DIR = 'tools';

const DIST_EXPORTS = { '.': { types: './dist/index.d.ts', import: './dist/index.js' } };

/** A dependency record declaring each name at `workspace:*`. */
function ws(...names: readonly string[]): Readonly<Record<string, string>> {
  return Object.fromEntries(names.map((name) => [name, 'workspace:*']));
}

/**
 * A workspace package: dist-only and built by the recipe, with any manifest
 * field the case gives replacing the default.
 */
function pkg(dir: string, name: string, fields: Partial<Manifest> = {}): WorkspaceManifestInput {
  return {
    dir,
    manifest: { name, exports: DIST_EXPORTS, scripts: { build: RECIPE }, ...fields },
  };
}

/** The package running the bootstrap: its dependencies are where the closure starts. */
function root(fields: Partial<Manifest>): WorkspaceManifestInput {
  return pkg(ROOT_DIR, '@x/tools', { exports: { '.': './src/index.ts' }, ...fields });
}

function closure(inputs: readonly WorkspaceManifestInput[]): InstallTimeClosureVerdict {
  return installTimeClosure(inputs, { rootDir: ROOT_DIR, buildRecipe: RECIPE });
}

/** The verdict a closure of exactly these members, in this order, reads as. */
function members(...names: readonly string[]) {
  return { ok: true, value: names.map((name) => ({ name })) };
}

describe('installTimeClosure membership', () => {
  it('builds each reached dist-only package, witnessed by every dist file its entry points name', () => {
    const verdict = closure([
      root({ devDependencies: ws('@x/config'), dependencies: ws('@x/result') }),
      pkg('core/config', '@x/config', {
        exports: {
          './tsup': { types: './dist/tsup.base.d.ts', import: './dist/tsup.base.js' },
          './vitest': { import: './dist/vitest.base.js', default: './dist/vitest.base.js' },
          './fallback': ['./dist/fallback.js'],
        },
      }),
      pkg('core/result', '@x/result'),
    ]);

    expect(verdict).toStrictEqual({
      ok: true,
      value: [
        {
          dir: 'core/config',
          name: '@x/config',
          distArtifacts: ['tsup.base.d.ts', 'tsup.base.js', 'vitest.base.js', 'fallback.js'],
        },
        { dir: 'core/result', name: '@x/result', distArtifacts: ['index.d.ts', 'index.js'] },
      ],
    });
  });

  it('leaves out a dist-only package the root never reaches, however it is built', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/result') }),
      pkg('core/result', '@x/result'),
      pkg('libs/graph', '@x/graph'),
      pkg('design/tokens', '@x/tokens', { scripts: { build: 'tsx src/build.ts && tsup' } }),
    ]);

    expect(verdict).toMatchObject(members('@x/result'));
  });

  it('follows workspace edges transitively, whichever dependency field declares them', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/result') }),
      pkg('core/result', '@x/result', {
        devDependencies: ws('@x/config'),
        peerDependencies: ws('@x/peer'),
      }),
      pkg('core/config', '@x/config'),
      pkg('core/peer', '@x/peer'),
    ]);

    expect(verdict).toMatchObject(members('@x/config', '@x/peer', '@x/result'));
  });

  it('follows a workspace:^ range and neither follows nor refuses a registry range', () => {
    const verdict = closure([
      {
        dir: ROOT_DIR,
        manifest: {
          name: '@x/tools',
          exports: { '.': './src/index.ts' },
          dependencies: { '@x/result': 'workspace:^', zod: '^4.0.0' },
        },
      },
      pkg('core/result', '@x/result'),
    ]);

    expect(verdict).toMatchObject(members('@x/result'));
  });

  it('never makes the root a member, even with dist exports and a build the recipe is not', () => {
    const verdict = closure([
      root({
        exports: DIST_EXPORTS,
        scripts: { build: 'tsc -p tsconfig.build.json' },
        dependencies: ws('@x/result'),
      }),
      pkg('core/result', '@x/result'),
    ]);

    expect(verdict).toMatchObject(members('@x/result'));
  });

  it('reads dist/x and ./dist/x alike, in main and types as in exports', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/sdk') }),
      pkg('sdks/sdk', '@x/sdk', { exports: {}, main: 'dist/index.js', types: 'dist/index.d.ts' }),
    ]);

    expect(verdict).toStrictEqual({
      ok: true,
      value: [{ dir: 'sdks/sdk', name: '@x/sdk', distArtifacts: ['index.js', 'index.d.ts'] }],
    });
  });

  it('witnesses only dist targets, skipping a package.json self-export and a null target', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/mixed') }),
      pkg('core/mixed', '@x/mixed', {
        exports: {
          '.': { import: './dist/index.js' },
          './package.json': './package.json',
          './internal': null,
        },
      }),
    ]);

    expect(verdict).toStrictEqual({
      ok: true,
      value: [{ dir: 'core/mixed', name: '@x/mixed', distArtifacts: ['index.js'] }],
    });
  });

  it('leaves out a reached package whose entry points name no dist file', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/source', '@x/result') }),
      pkg('libs/source', '@x/source', { exports: { '.': './src/index.ts' } }),
      pkg('core/result', '@x/result'),
    ]);

    expect(verdict).toMatchObject(members('@x/result'));
  });
});

describe('installTimeClosure order', () => {
  it('builds a package after the members it reaches, including through a non-member', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/app-lib') }),
      pkg('libs/app-lib', '@x/app-lib', { dependencies: ws('@x/bridge') }),
      pkg('libs/bridge', '@x/bridge', {
        exports: { '.': './src/index.ts' },
        dependencies: ws('@x/base'),
      }),
      pkg('core/base', '@x/base'),
    ]);

    expect(verdict).toMatchObject(members('@x/base', '@x/app-lib'));
  });

  it('builds the config base, then the lint plugin, then what devDepends on both, whatever the names', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/alpha'), devDependencies: ws('@x/plugin', '@x/zconfig') }),
      pkg('core/alpha', '@x/alpha', { devDependencies: ws('@x/plugin', '@x/zconfig') }),
      pkg('core/plugin', '@x/plugin', { devDependencies: ws('@x/zconfig') }),
      pkg('core/zconfig', '@x/zconfig'),
    ]);

    expect(verdict).toMatchObject(members('@x/zconfig', '@x/plugin', '@x/alpha'));
  });

  it('breaks ties by name, never by the order the workspace was read in', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/zeta', '@x/alpha', '@x/mid') }),
      pkg('core/zeta', '@x/zeta'),
      pkg('core/mid', '@x/mid'),
      pkg('core/alpha', '@x/alpha'),
    ]);

    expect(verdict).toMatchObject(members('@x/alpha', '@x/mid', '@x/zeta'));
  });

  it('refuses a dependency cycle among members, naming them and the members waiting on them', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/a', '@x/c') }),
      pkg('core/a', '@x/a', { devDependencies: ws('@x/b') }),
      pkg('core/b', '@x/b', { devDependencies: ws('@x/a') }),
      pkg('core/c', '@x/c', { devDependencies: ws('@x/a') }),
    ]);

    expect(verdict).toHaveProperty('ok', false);
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/a'));
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/b'));
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/c'));
  });

  it('tolerates a cycle among packages that are not members, since none of them is built', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/app-lib') }),
      pkg('libs/app-lib', '@x/app-lib', { dependencies: ws('@x/left') }),
      pkg('libs/left', '@x/left', {
        exports: { '.': './src/l.ts' },
        devDependencies: ws('@x/right'),
      }),
      pkg('libs/right', '@x/right', {
        exports: { '.': './src/r.ts' },
        devDependencies: ws('@x/left'),
      }),
    ]);

    expect(verdict).toMatchObject(members('@x/app-lib'));
  });
});

describe('installTimeClosure refusals', () => {
  it('refuses a workspace dependency no workspace manifest names, wherever it is declared', () => {
    const verdict = closure([
      root({ dependencies: ws('@x/result') }),
      pkg('core/result', '@x/result', { dependencies: ws('@x/ghost') }),
    ]);

    expect(verdict).toHaveProperty('ok', false);
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/result'));
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/ghost'));
  });

  it('refuses when no workspace package sits at the root directory', () => {
    const verdict = closure([pkg('core/result', '@x/result')]);

    expect(verdict).toHaveProperty('ok', false);
    expect(verdict).toHaveProperty('error', expect.stringContaining(ROOT_DIR));
  });

  it('refuses a manifest without a name, naming its file', () => {
    const verdict = closure([root({}), { dir: 'broken', manifest: { exports: {} } }]);

    expect(verdict).toHaveProperty('ok', false);
    expect(verdict).toHaveProperty('error', expect.stringContaining('broken/package.json'));
  });

  it('refuses two workspace packages with the same name, naming both directories', () => {
    const verdict = closure([root({}), pkg('a/result', '@x/result'), pkg('b/result', '@x/result')]);

    expect(verdict).toHaveProperty('ok', false);
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/result'));
    expect(verdict).toHaveProperty('error', expect.stringContaining('a/result'));
    expect(verdict).toHaveProperty('error', expect.stringContaining('b/result'));
  });

  it.each([
    ['no build script', {}],
    ['a build that stops short of the declarations', { build: 'tsup' }],
    ['a build of its own', { build: 'tsx src/build.ts && tsup' }],
  ])('refuses a member with %s, naming it', (_case, scripts) => {
    const verdict = closure([
      root({ dependencies: ws('@x/tokens') }),
      pkg('design/tokens', '@x/tokens', { scripts }),
    ]);

    expect(verdict).toHaveProperty('ok', false);
    expect(verdict).toHaveProperty('error', expect.stringContaining('@x/tokens'));
    expect(verdict).toHaveProperty('error', expect.stringContaining('design/tokens'));
  });
});
