import { sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import { err, isErr, ok, unwrapOrThrow, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { buildExtractorIdentity, type IdentityReadPort } from './implementation-identity.js';

const IDENTITY_PATH = '/checkout/agent-tools/dist/src/typescript-estate/implementation-identity.js';
const ENTRY_PATH = '/checkout/agent-tools/dist/src/bin/agent-tools.js';

class MemoryIdentityReader implements IdentityReadPort {
  readonly #files: ReadonlyMap<string, Uint8Array>;

  constructor(files: Readonly<Record<string, string>>) {
    this.#files = new Map(
      Object.entries(files).map(([path, contents]) => [path, Buffer.from(contents)]),
    );
  }

  canonicalRealpath(path: string): Result<string, Error> {
    return ok(path);
  }

  readRegularFileNoFollow(input: {
    readonly chainRoot: string;
    readonly ownerRoot: string;
    readonly path: string;
  }): Result<Uint8Array, Error> {
    // On Windows the module-URL round trip hands the product drive-prefixed,
    // backslash paths; the fixture is authored in POSIX form, so lookups
    // shed the drive and separators first.
    const key = input.path
      .replace(/^[A-Za-z]:/u, '')
      .split(sep)
      .join('/');
    const bytes = this.#files.get(key);
    return bytes === undefined ? err(new Error(`missing ${input.path}`)) : ok(bytes);
  }
}

function identityFixture(overrides: Readonly<Record<string, string>> = {}): MemoryIdentityReader {
  return new MemoryIdentityReader({
    [ENTRY_PATH]: [
      "import '../typescript-estate/implementation-identity.js';",
      "export { feature } from '../feature.js';",
      "import 'node:not-a-runtime-builtin/but-syntax-valid';",
      "import '@scope/package/subpath';",
      "void import('../lazy.js');",
    ].join('\n'),
    [IDENTITY_PATH]: "export { helper } from './helper.js';\n",
    '/checkout/agent-tools/dist/src/typescript-estate/helper.js': 'export const helper = 1;\n',
    '/checkout/agent-tools/dist/src/feature.js': 'export const feature = 2;\n',
    '/checkout/agent-tools/dist/src/lazy.js': 'export const lazy = 3;\n',
    '/checkout/agent-tools/package.json': '{"name":"@oaknational/agent-tools"}\n',
    '/checkout/pnpm-lock.yaml': 'lockfileVersion: 9\n',
    ...overrides,
  });
}

describe('buildExtractorIdentity integration', () => {
  it('reports and hashes the real built ESM closure plus its manifest and lock deterministically', () => {
    const reader = identityFixture();

    const identity = unwrapOrThrow(
      buildExtractorIdentity({
        identityModuleUrl: pathToFileURL(IDENTITY_PATH),
        nodeVersion: 'v24.6.0',
        read: reader,
      }),
    );

    expect(identity).toMatchObject({
      implementationVersion: '2.0.0',
      nodeVersion: 'v24.6.0',
      canonicalJsonVersion: 'lexicographic-object-keys-v1',
    });
    expect(identity.typescriptVersion).toMatch(/^6\.0\./u);
    expect(identity.implementationSha256).toMatch(/^[a-f0-9]{64}$/u);
    expect(identity.implementationFiles.map(({ path }) => path)).toEqual([
      'agent-tools/dist/src/bin/agent-tools.js',
      'agent-tools/dist/src/feature.js',
      'agent-tools/dist/src/lazy.js',
      'agent-tools/dist/src/typescript-estate/helper.js',
      'agent-tools/dist/src/typescript-estate/implementation-identity.js',
      'agent-tools/package.json',
      'pnpm-lock.yaml',
    ]);
    expect(identity.implementationFiles.every(({ sha256 }) => /^[a-f0-9]{64}$/u.test(sha256))).toBe(
      true,
    );

    const repeated = unwrapOrThrow(
      buildExtractorIdentity({
        identityModuleUrl: pathToFileURL(IDENTITY_PATH),
        nodeVersion: 'v24.6.0',
        read: identityFixture(),
      }),
    );
    expect(repeated).toEqual(identity);
  });

  it.each([
    ['void import(moduleName);', 'non-literal dynamic import'],
    ["import '../../../outside.js';", 'escapes executingDistRoot'],
    ["import '../source.ts';", 'source .ts/.tsx execution'],
    ["import 'node:fs?query';", 'unresolved module specifier'],
  ])('refuses an unprovable executable member: %s', (entrypoint, expectedMessage) => {
    const result = buildExtractorIdentity({
      identityModuleUrl: pathToFileURL(IDENTITY_PATH),
      nodeVersion: 'v24.6.0',
      read: identityFixture({ [ENTRY_PATH]: entrypoint }),
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toMatchObject({ code: 'IDENTITY_INVALID' });
      expect(result.error.message).toContain(expectedMessage);
    }
  });

  it('requires the executing identity module to be a member of the entrypoint closure', () => {
    const result = buildExtractorIdentity({
      identityModuleUrl: pathToFileURL(IDENTITY_PATH),
      nodeVersion: 'v24.6.0',
      read: identityFixture({ [ENTRY_PATH]: 'export const unrelated = true;\n' }),
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toContain(
        'identity module is absent from the executable closure',
      );
    }
  });

  it('accepts valid BOM-prefixed JavaScript members without changing their identity bytes', () => {
    const reader = identityFixture({
      '/checkout/agent-tools/dist/src/feature.js': '\ufeffexport const feature = 2;\n',
    });

    const identity = unwrapOrThrow(
      buildExtractorIdentity({
        identityModuleUrl: pathToFileURL(IDENTITY_PATH),
        nodeVersion: 'v24.6.0',
        read: reader,
      }),
    );

    expect(
      identity.implementationFiles.find(({ path }) => path.endsWith('/feature.js')),
    ).toMatchObject({ byteCount: Buffer.byteLength('\ufeffexport const feature = 2;\n') });
  });

  it('discovers a literal dynamic import when an options argument is present', () => {
    const reader = identityFixture({
      [ENTRY_PATH]: [
        "import '../typescript-estate/implementation-identity.js';",
        "void import('../lazy.js', { with: { type: 'json' } });",
      ].join('\n'),
    });

    const identity = unwrapOrThrow(
      buildExtractorIdentity({
        identityModuleUrl: pathToFileURL(IDENTITY_PATH),
        nodeVersion: 'v24.6.0',
        read: reader,
      }),
    );

    expect(identity.implementationFiles.map(({ path }) => path)).toContain(
      'agent-tools/dist/src/lazy.js',
    );
  });
});
