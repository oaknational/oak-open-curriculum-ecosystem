import { basename } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { TEMPLATES_DIR } from './adapter-spec.js';
import { readDeclaredAdapters, type TemplateReads } from './declared-adapters.js';

/**
 * The declared-adapters read over injected template reads (`TemplateReads`): the health
 * probe's platform truth is read from here, so every refusal arm is described against what
 * the reads report (an unlistable directory, an empty set, an entry the read refuses, a name
 * a path cannot carry, a stray regular file), and the happy path reads the declarations in
 * name order. The reduction's own refusals (an undeclared template, a name two templates
 * render) are `declaredAdaptersFrom`'s, described in its unit cells. The live reads are the
 * file-system boundary: one no-follow open, and on a host without `O_NOFOLLOW` the post-open
 * identity check, both from the estate's shared `core/no-follow-read.ts`.
 */

const role = (name: string, platforms: string): string =>
  `---\ndescription: ${name} reviews.\nplatforms:\n${platforms}---\n\n## Delegation Triggers\n`;

/**
 * In-memory reads over one templates directory: the entries listed, each file's read by its
 * basename; an entry read before it was listed reads as absent.
 */
function readsOf(
  listing: Result<readonly string[], string>,
  files: Readonly<Record<string, Result<string, string>>>,
): TemplateReads {
  return {
    list: () => listing,
    read: (file) => files[basename(file)] ?? err('cannot read the template (ENOENT)'),
  };
}

const ROOT = '/repo';

describe('readDeclaredAdapters', () => {
  it('reads every template in name order to its declared adapters', () => {
    const reads = readsOf(ok(['beta.md', 'alpha.md']), {
      'alpha.md': ok(role('alpha', '  - cursor\n  - claude\n')),
      'beta.md': ok(role('beta', '  - gemini\n')),
    });
    expect(readDeclaredAdapters(ROOT, reads)).toStrictEqual({
      ok: true,
      value: [
        { name: 'alpha', platforms: ['cursor', 'claude'] },
        { name: 'beta', platforms: ['gemini'] },
      ],
    });
  });

  it('refuses an unlistable templates directory and an empty one, naming the directory', () => {
    expect(readDeclaredAdapters(ROOT, readsOf(err('ENOENT'), {}))).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}: cannot list the templates (ENOENT)`,
    });
    expect(readDeclaredAdapters(ROOT, readsOf(ok([]), {}))).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}: no templates, so no adapter is declared`,
    });
  });

  it.each(['not a regular file', 'cannot read the template (EACCES)'])(
    "refuses an entry the read refuses, naming it under the templates directory: '%s'",
    (refusal) => {
      const reads = readsOf(ok(['alpha.md', 'linked.md']), {
        'alpha.md': ok(role('alpha', '  - claude\n')),
        'linked.md': err(refusal),
      });
      expect(readDeclaredAdapters(ROOT, reads)).toStrictEqual({
        ok: false,
        error: `${TEMPLATES_DIR}/linked.md: ${refusal}`,
      });
    },
  );

  it('refuses a name a path cannot carry and a stray regular file, before any read', () => {
    expect(readDeclaredAdapters(ROOT, readsOf(ok(['Bad Name.md']), {}))).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}/Bad Name.md: "Bad Name": not a template basename (lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no suffix)`,
    });
    expect(readDeclaredAdapters(ROOT, readsOf(ok(['notes.txt']), {}))).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}/notes.txt: not a template (the templates directory admits .md templates only)`,
    });
  });
});
