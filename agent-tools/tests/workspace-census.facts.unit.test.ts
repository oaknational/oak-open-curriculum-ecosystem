import { describe, expect, it } from 'vitest';

import {
  assembleFacts,
  type ManifestSummaryInput,
  type SubjectGrepCounts,
} from '../src/workspace-census/facts.js';
import {
  aggregateSourceDependencies,
  parseDepcruiseModules,
  parseTurboTasks,
} from '../src/workspace-census/graph-inputs.js';
import type { CensusSubject } from '../src/workspace-census/index.js';

const AGENT_TOOLS: CensusSubject = {
  dirPath: 'agent-tools',
  publishedName: '@oaknational/agent-tools',
  sources: ['pnpm-member'],
};
const SCRIPTS: CensusSubject = { dirPath: 'scripts', publishedName: null, sources: ['code-root'] };

const MANIFESTS: ManifestSummaryInput[] = [
  {
    dirPath: 'agent-tools',
    name: '@oaknational/agent-tools',
    isPrivate: true,
    licence: 'MIT',
    hasExports: false,
    internalDependencies: ['@oaknational/result'],
  },
  {
    dirPath: 'packages/core/result',
    name: '@oaknational/result',
    isPrivate: false,
    licence: 'MIT',
    hasExports: true,
    internalDependencies: [],
  },
];

const EMPTY_GREPS: SubjectGrepCounts = {
  oakInDocs: 0,
  oakInSource: 0,
  cssOakVariables: 0,
  dottedOakNamespaces: 0,
  oakEnvKeys: 0,
};

function factsFor(subjects: readonly CensusSubject[]) {
  return assembleFacts({
    subjects,
    manifests: MANIFESTS,
    trackedFilesBySubject: new Map([
      ['agent-tools', ['agent-tools/src/a.ts', 'agent-tools/README.md']],
      ['scripts', ['scripts/run.sh']],
    ]),
    grepCountsBySubject: new Map([
      ['agent-tools', { ...EMPTY_GREPS, oakInDocs: 3, dottedOakNamespaces: 1 }],
      ['scripts', EMPTY_GREPS],
    ]),
  });
}

describe('assembleFacts — detector facts, one entry per subject', () => {
  it('covers every subject exactly once, keyed on dirPath', () => {
    const facts = factsFor([AGENT_TOOLS, SCRIPTS]);
    expect(facts.map((entry) => entry.dirPath)).toEqual(['agent-tools', 'scripts']);
  });

  it('carries the manifest summary for member subjects and null for manifest-less subjects', () => {
    const facts = factsFor([AGENT_TOOLS, SCRIPTS]);
    expect(facts[0]?.manifest).toMatchObject({ name: '@oaknational/agent-tools', licence: 'MIT' });
    expect(facts[1]?.manifest).toBeNull();
  });

  it('derives internal dependents from the manifests (consumer topology at workspace grain)', () => {
    const facts = assembleFacts({
      subjects: [
        AGENT_TOOLS,
        {
          dirPath: 'packages/core/result',
          publishedName: '@oaknational/result',
          sources: ['pnpm-member'],
        },
      ],
      manifests: MANIFESTS,
      trackedFilesBySubject: new Map(),
      grepCountsBySubject: new Map(),
    });
    const result = facts.find((entry) => entry.dirPath === 'packages/core/result');
    expect(result?.internalDependents).toEqual(['@oaknational/agent-tools']);
  });

  it('profiles tracked files into total and code counts', () => {
    const facts = factsFor([AGENT_TOOLS]);
    expect(facts[0]?.fileProfile).toEqual({ trackedFiles: 2, codeFiles: 1 });
  });

  it('banks subject-grain source dependencies and turbo tasks when supplied', () => {
    const facts = assembleFacts({
      subjects: [AGENT_TOOLS],
      manifests: MANIFESTS,
      trackedFilesBySubject: new Map(),
      grepCountsBySubject: new Map(),
      sourceDependenciesBySubject: new Map([['agent-tools', ['packages/core/result']]]),
      turboTasksByPackage: new Map([['@oaknational/agent-tools', ['build', 'test']]]),
    });
    expect(facts[0]?.sourceDependencies).toEqual(['packages/core/result']);
    expect(facts[0]?.turboTasks).toEqual(['build', 'test']);
  });

  it('carries grep counts verbatim and zero-fills subjects with no recorded counts', () => {
    const facts = factsFor([AGENT_TOOLS, SCRIPTS]);
    expect(facts[0]?.oakMarkers.oakInDocs).toBe(3);
    expect(facts[0]?.oakMarkers.dottedOakNamespaces).toBe(1);
    const noCounts = assembleFacts({
      subjects: [SCRIPTS],
      manifests: [],
      trackedFilesBySubject: new Map(),
      grepCountsBySubject: new Map(),
    });
    expect(noCounts[0]?.oakMarkers).toEqual(EMPTY_GREPS);
  });
});

describe('graph-input parsing — depcruise and turbo dry-run to subject grain', () => {
  it('aggregates module edges to distinct cross-subject dependencies', () => {
    const parsed = parseDepcruiseModules(
      JSON.stringify({
        modules: [
          {
            source: 'agent-tools/src/a.ts',
            dependencies: [
              { resolved: 'packages/core/result/src/index.ts' },
              { resolved: 'agent-tools/src/b.ts' },
              { resolved: 'node_modules/zod/index.js' },
            ],
          },
        ],
      }),
    );
    expect(parsed).toMatchObject({ ok: true });
    const subjects: CensusSubject[] = [
      AGENT_TOOLS,
      {
        dirPath: 'packages/core/result',
        publishedName: '@oaknational/result',
        sources: ['pnpm-member'],
      },
    ];
    const modules = parsed.ok ? parsed.value : [];
    const aggregated = aggregateSourceDependencies(subjects, modules);
    expect(aggregated.get('agent-tools')).toEqual(['packages/core/result']);
    expect(aggregated.get('packages/core/result')).toEqual([]);
  });

  it('never attributes Node builtins to the root subject catch-all', () => {
    const root: CensusSubject = { dirPath: '.', publishedName: null, sources: ['code-root'] };
    const parsed = parseDepcruiseModules(
      JSON.stringify({
        modules: [
          {
            source: 'agent-tools/src/a.ts',
            dependencies: [{ resolved: 'node:fs' }, { resolved: 'fs' }, { resolved: 'node:path' }],
          },
        ],
      }),
    );
    expect(parsed).toMatchObject({ ok: true });
    const modules = parsed.ok ? parsed.value : [];
    const aggregated = aggregateSourceDependencies([root, AGENT_TOOLS], modules);
    expect(aggregated.get('agent-tools')).toEqual([]);
  });

  it('drops unresolvable specifiers instead of attributing their raw text to a subject', () => {
    const root: CensusSubject = { dirPath: '.', publishedName: null, sources: ['code-root'] };
    const parsed = parseDepcruiseModules(
      JSON.stringify({
        modules: [
          {
            source: 'agent-tools/src/a.ts',
            dependencies: [
              { resolved: 'vite/client', couldNotResolve: true },
              { resolved: '../api-schema/path-parameters.js', couldNotResolve: true },
            ],
          },
        ],
      }),
    );
    expect(parsed).toMatchObject({ ok: true });
    const modules = parsed.ok ? parsed.value : [];
    const aggregated = aggregateSourceDependencies([root, AGENT_TOOLS], modules);
    expect(aggregated.get('agent-tools')).toEqual([]);
  });

  it('still attributes genuine root-owned file imports to the root subject', () => {
    const root: CensusSubject = { dirPath: '.', publishedName: null, sources: ['code-root'] };
    const parsed = parseDepcruiseModules(
      JSON.stringify({
        modules: [
          {
            source: 'agent-tools/src/a.ts',
            dependencies: [{ resolved: 'eslint.config.ts' }],
          },
        ],
      }),
    );
    expect(parsed).toMatchObject({ ok: true });
    const modules = parsed.ok ? parsed.value : [];
    const aggregated = aggregateSourceDependencies([root, AGENT_TOOLS], modules);
    expect(aggregated.get('agent-tools')).toEqual(['.']);
  });

  it('rejects depcruise output without a modules array', () => {
    expect(parseDepcruiseModules('{"summary": {}}')).toMatchObject({ ok: false });
  });

  it('parses turbo dry-run tasks per package and skips the root pseudo-package', () => {
    const parsed = parseTurboTasks(
      JSON.stringify({
        tasks: [
          { package: '@oaknational/agent-tools', task: 'test' },
          { package: '@oaknational/agent-tools', task: 'build' },
          { package: '//', task: 'lint' },
        ],
      }),
    );
    expect(parsed).toMatchObject({ ok: true });
    const byPackage = parsed.ok ? parsed.value : new Map<string, string[]>();
    expect(byPackage.get('@oaknational/agent-tools')).toEqual(['build', 'test']);
    expect(byPackage.has('//')).toBe(false);
  });
});
