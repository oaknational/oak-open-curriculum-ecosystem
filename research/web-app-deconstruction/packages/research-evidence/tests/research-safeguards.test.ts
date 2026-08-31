import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { test, expect } from 'vitest';

import { validateConceptLensStructure } from '../lib/concept-lens-structure.js';
import { resolveInternalLink } from '../lib/research-links.js';

const validLens = `## Lens 1: exact structure

### Governing question

Question?

### Movement 1: observe

### Movement 2: define

Mechanism-neutral problem frame.

### Movement 3: reopen

Changed assumption.

### Movement 4: synthesise

Warrant. Falsifier.

#### Unresolved evidence
`;

test('concept-lens structure requires exact unfenced movements and output fields', () => {
  expect(validateConceptLensStructure(validLens, 'valid.md')).toEqual({
    lensCount: 1,
    failures: [],
  });

  const invalid = `${validLens.replace('### Movement 1: observe', '### Movement 10: observe')}

## Lens 1: duplicate number

\`\`\`
### Movement 1: fenced
### Movement 2: fenced
### Movement 3: fenced
### Movement 4: fenced
Problem frame. Changed assumption. Warrant. Falsifier. Unresolved evidence.
\`\`\`

## Lens broken heading
`;
  const result = validateConceptLensStructure(invalid, 'invalid.md');

  expect(result.lensCount).toBe(2);
  expect(result.failures.some((failure) => failure.includes('found 10, 2, 3, 4'))).toBeTruthy();
  expect(
    result.failures.some((failure) => failure.includes('expected Lens 2; found Lens 1')),
  ).toBeTruthy();
  expect(result.failures.some((failure) => failure.includes('found none'))).toBeTruthy();
  expect(result.failures.some((failure) => failure.includes('missing warrant'))).toBeTruthy();
  expect(
    result.failures.some((failure) => failure.includes('malformed concept-lens heading')),
  ).toBeTruthy();
});

test('internal links cannot escape lexically, by encoding or through symlinks', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'research-links-'));
  const root = path.join(parent, 'repository');
  const docs = path.join(root, 'docs');
  const outside = path.join(parent, 'outside.md');

  try {
    await mkdir(docs, { recursive: true });
    await writeFile(path.join(docs, 'source.md'), 'source');
    await writeFile(path.join(docs, 'target.md'), 'target');
    await writeFile(outside, 'outside');
    // A symlinked DIRECTORY smuggling outside content, created as a
    // 'junction' so the fixture needs no privilege on Windows (plain
    // symlinks require admin or Developer Mode there); the argument is
    // ignored on POSIX. The refusal under test is unchanged: a link whose
    // real location escapes the repository is refused.
    const outsideDocs = path.join(parent, 'outside-docs');
    await mkdir(outsideDocs);
    await writeFile(path.join(outsideDocs, 'payload.md'), 'outside');
    await symlink(outsideDocs, path.join(docs, 'escape'), 'junction');

    expect(resolveInternalLink(root, path.join(docs, 'source.md'), './target.md').error).toBeNull();
    expect(
      resolveInternalLink(root, path.join(docs, 'source.md'), '../../outside.md').error,
    ).toMatch(/escapes the repository/);
    expect(
      resolveInternalLink(root, path.join(docs, 'source.md'), '%2e%2e/%2e%2e/outside.md').error,
    ).toMatch(/escapes the repository/);
    expect(
      resolveInternalLink(root, path.join(docs, 'source.md'), './escape/payload.md').error,
    ).toMatch(/resolves outside the repository/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});
