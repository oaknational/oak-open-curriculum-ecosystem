import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  aggregateGraphEdges,
  createGraphNode,
  deduplicateGraphNodes,
  type GraphNodeInput,
} from './graph-identity.js';
import type { GraphEdgeObservation, GraphNode } from './graph-model.js';

const IMPORT_SOURCE: GraphNode = {
  id: 'node:file:c61428c7e393bf4f28c1620192b4ccd39a41ba99961da65a521f143f3e7677f6',
  kind: 'file',
  identityComponents: ['apps/a.ts'],
  label: 'apps/a.ts',
  path: 'apps/a.ts',
};

const IMPORT_TARGET: GraphNode = {
  id: 'node:package:9c9cfd2ed4bf7f64710dcc83a9642143bdbd7a2e14eb60ad28fe2c4f777cef52',
  kind: 'package',
  identityComponents: ['external', 'pkg', '.'],
  label: 'external :: pkg :: .',
  path: null,
};

const EARLIER_FILE: GraphNode = {
  id: 'node:file:04beffcb552c5c0ae385772c3a5f813c3d9a225cf02f154d573f11a79a985417',
  kind: 'file',
  identityComponents: ['a.ts'],
  label: 'a.ts',
  path: 'a.ts',
};

const LATER_FILE: GraphNode = {
  id: 'node:file:708ac17c457e5583a652b79bf68124eb9673050da78130cec50e56df68a76841',
  kind: 'file',
  identityComponents: ['z.ts'],
  label: 'z.ts',
  path: 'z.ts',
};

describe('createGraphNode', () => {
  it('derives the exact domain-separated file identity', () => {
    expect(unwrapOrThrow(createGraphNode({ kind: 'file', path: 'apps/a.ts' }))).toEqual({
      id: 'node:file:c61428c7e393bf4f28c1620192b4ccd39a41ba99961da65a521f143f3e7677f6',
      kind: 'file',
      identityComponents: ['apps/a.ts'],
      label: 'apps/a.ts',
      path: 'apps/a.ts',
    });
  });

  it.each([
    {
      input: {
        kind: 'workspace',
        root: 'apps/demo',
        manifestPath: 'apps/demo/package.json',
        packageName: null,
      },
      identityComponents: ['apps/demo', 'apps/demo/package.json', '<unnamed>'],
      path: null,
    },
    {
      input: {
        kind: 'package',
        ownership: 'external',
        packageName: 'pkg',
        subpath: null,
      },
      identityComponents: ['external', 'pkg', '.'],
      path: null,
    },
    {
      input: {
        kind: 'command',
        manifestPath: 'package.json',
        scriptName: 'build',
        literalCommand: 'pnpm build',
      },
      identityComponents: ['package.json', 'build', 'pnpm build'],
      path: null,
    },
    {
      input: {
        kind: 'artefact',
        identity: {
          kind: 'repo-prefix',
          prefix: 'agent-tools/dist///',
          memberSetSha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        },
      },
      identityComponents: [
        'repo-prefix',
        'agent-tools/dist/',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      ],
      path: null,
    },
    {
      input: {
        kind: 'registration',
        sourcePath: 'apps/server.ts',
        startLine: 7,
        terminalCallName: 'registerTool',
        target: null,
      },
      identityComponents: ['apps/server.ts', '7', 'registerTool', '<dynamic>'],
      path: null,
    },
    {
      input: {
        kind: 'external-contract',
        contractKind: 'module-specifier',
        identifier: '@scope/pkg',
      },
      identityComponents: ['module-specifier', '@scope/pkg'],
      path: null,
    },
  ] satisfies readonly {
    readonly input: GraphNodeInput;
    readonly identityComponents: readonly string[];
    readonly path: string | null;
  }[])('derives the $input.kind identity vocabulary', ({ input, identityComponents, path }) => {
    expect(unwrapOrThrow(createGraphNode(input))).toMatchObject({ identityComponents, path });
  });

  const invalidNodeCases: readonly { readonly input: GraphNodeInput; readonly message: string }[] =
    [
      { input: { kind: 'file', path: '' }, message: 'non-empty' },
      { input: { kind: 'file', path: 'bad\0path.ts' }, message: 'NUL' },
      {
        input: {
          kind: 'registration',
          sourcePath: 'a.ts',
          startLine: 0,
          terminalCallName: 'use',
          target: null,
        },
        message: 'positive safe integer',
      },
    ];

  it.each(invalidNodeCases)('refuses invalid identity input: $message', ({ input, message }) => {
    const error = unwrapErr(createGraphNode(input));

    expect(error).toMatchObject({ code: 'VALIDATION_FAILED' });
    expect(error.message).toContain(message);
  });
});

describe('aggregateGraphEdges', () => {
  function observation(evidencePath: string): GraphEdgeObservation {
    return {
      source: IMPORT_SOURCE,
      target: IMPORT_TARGET,
      kind: 'import',
      status: 'observed',
      producer: 'import:es-import',
      evidencePath,
    };
  }

  it('collapses only the complete edge tuple and preserves occurrence and evidence unions', () => {
    expect(
      unwrapOrThrow(
        aggregateGraphEdges([observation('z.ts'), observation('a.ts'), observation('z.ts')]),
      ),
    ).toEqual([
      {
        id: 'edge:import:b818f3fdc6c8a5f011f679835215988609bb24fb0229f186ad49abd9ebe4d14e',
        source: IMPORT_SOURCE.id,
        target: IMPORT_TARGET.id,
        kind: 'import',
        status: 'observed',
        producer: 'import:es-import',
        occurrenceCount: 3,
        evidencePaths: ['a.ts', 'z.ts'],
      },
    ]);
  });

  it('refuses a producer that is outside the edge-kind vocabulary at runtime', () => {
    const invalid = {
      ...observation('a.ts'),
      producer: 'build:project-reference',
    };
    expect(unwrapErr(aggregateGraphEdges([invalid])).message).toContain('producer');
  });
});

describe('deduplicateGraphNodes', () => {
  it('sorts and deduplicates equal nodes but refuses an id collision with unequal identity', () => {
    expect(unwrapOrThrow(deduplicateGraphNodes([LATER_FILE, EARLIER_FILE, LATER_FILE]))).toEqual([
      EARLIER_FILE,
      LATER_FILE,
    ]);

    const collision: GraphNode = { ...LATER_FILE, label: 'unequal' };
    expect(unwrapErr(deduplicateGraphNodes([LATER_FILE, collision])).message).toContain(
      'collision',
    );
  });
});
