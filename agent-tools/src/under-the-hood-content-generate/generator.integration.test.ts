/**
 * Integration tests for the generator over its injected filesystem seam
 * (simple fakes as arguments — testing-strategy §Integration; no real IO):
 * fallible writes translate to Err at the boundary (ADR-088), and a
 * classified canonical renders and writes the generated module.
 */
import { isErr, unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  checkContentModule,
  generateContentModule,
  renderGeneratedModule,
  type GeneratorFileIo,
} from './generator.js';
import { syntheticCanonical } from './test-helpers/synthetic-canonical.js';

/** A reader that serves the synthetic canonical and nothing else. */
const readsCanonicalOnly: GeneratorFileIo['readTextFile'] = (path: string) =>
  Promise.resolve(path.endsWith('SKILL-CANONICAL.md') ? syntheticCanonical() : undefined);

/** A writer that refuses every write, so a check that writes is caught. */
const neverWrites: GeneratorFileIo['writeTextFile'] = () =>
  Promise.reject(new Error('check must not write'));

describe('generateContentModule (integration)', () => {
  it('surfaces a filesystem write failure as Err, never a rejection', async () => {
    const io: GeneratorFileIo = {
      readTextFile: readsCanonicalOnly,
      writeTextFile: () => Promise.reject(new Error('EACCES: permission denied')),
    };
    const result = await generateContentModule('/repo', io);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/Cannot write/);
    expect(unwrapErr(result)).toContain('EACCES');
  });

  it('writes the rendered module for a classified canonical', async () => {
    const written = new Map<string, string>();
    const io: GeneratorFileIo = {
      readTextFile: readsCanonicalOnly,
      writeTextFile: (path: string, content: string) => {
        written.set(path, content);
        return Promise.resolve();
      },
    };
    const result = await generateContentModule('/repo', io);
    const outputPath = unwrap(result);
    expect(written.get(outputPath)).toContain('export const OAK_UNDER_THE_HOOD_ORIENTATION =');
  });
});

/** A file IO serving the synthetic canonical, the given committed module text for every other read, and no writes. */
function ioWithCommittedModule(committed: string | undefined): GeneratorFileIo {
  return {
    readTextFile: (path: string) => {
      if (path.endsWith('SKILL-CANONICAL.md')) {
        return Promise.resolve(syntheticCanonical());
      }
      return Promise.resolve(committed);
    },
    writeTextFile: neverWrites,
  };
}

describe('checkContentModule (integration)', () => {
  it('reports up to date when the committed module matches the regeneration', async () => {
    const expected = await generateExpectedModule();
    const outcome = await checkContentModule('/repo', ioWithCommittedModule(expected));
    expect(outcome).toEqual({
      ok: true,
      detail: 'Under-the-hood content module is up to date.',
    });
  });

  it('reports a missing committed module', async () => {
    const outcome = await checkContentModule('/repo', ioWithCommittedModule(undefined));
    expect(outcome.ok).toBe(false);
    expect(outcome.detail).toMatch(/Missing generated module/);
  });

  it('reports a stale committed module', async () => {
    const outcome = await checkContentModule('/repo', ioWithCommittedModule('// stale content\n'));
    expect(outcome.ok).toBe(false);
    expect(outcome.detail).toMatch(/stale/);
  });
});

/** The module text a regeneration of the synthetic canonical produces. */
async function generateExpectedModule(): Promise<string> {
  const written = new Map<string, string>();
  const io: GeneratorFileIo = {
    readTextFile: (path: string) =>
      Promise.resolve(path.endsWith('SKILL-CANONICAL.md') ? syntheticCanonical() : undefined),
    writeTextFile: (path: string, content: string) => {
      written.set(path, content);
      return Promise.resolve();
    },
  };
  const outputPath = unwrap(await generateContentModule('/repo', io));
  const moduleText = written.get(outputPath);
  if (moduleText === undefined) {
    return renderGeneratedModule('');
  }
  return moduleText;
}
