import { unwrapOrThrow } from '@oaknational/result';

import type {
  GeneratedOutputRule,
  ProvenanceClassificationConfig,
  RoleRule,
} from '../config-classification-model.js';
import type { WorkspaceRecord } from '../file-model.js';
import {
  createProvenanceClassifier,
  type ProvenanceClassifier,
} from '../provenance-classification.js';
import { createRoleClassifier, type RoleClassifier } from '../role-classification.js';

const GENERATED_RULES = [
  {
    id: 'generated-models',
    pathPrefix: 'apps/a/src/generated/',
    producerEvidence: ['tools/producer.ts'],
  },
] as const satisfies readonly GeneratedOutputRule[];

interface ClassificationProgramFixture {
  readonly workspaces: readonly WorkspaceRecord[];
  readonly provenance: ProvenanceClassifier;
  readonly roles: RoleClassifier;
}

export function classificationProgramFixture(): ClassificationProgramFixture {
  return {
    workspaces: [{ root: 'apps/a', name: '@scope/a', manifestPath: 'apps/a/package.json' }],
    provenance: unwrapOrThrow(createProvenanceClassifier(PROVENANCE_CONFIG, GENERATED_RULES)),
    roles: unwrapOrThrow(createRoleClassifier(ROLE_RULES)),
  };
}

const PROVENANCE_CONFIG: ProvenanceClassificationConfig = {
  generatedPathMatchers: [
    {
      id: 'generated-directory-segment',
      kind: 'complete-path-segment',
      values: ['generated', '__generated__'],
    },
    {
      id: 'generated-ts-basename-suffix',
      kind: 'basename-suffix',
      values: ['.generated.ts', '.generated.tsx'],
    },
  ],
  generatedHeaderMatchers: [
    {
      id: 'leading-generated-banner',
      source: '(?:auto[- ]?generated|generated file|do not edit)',
      flags: 'iu',
      commentRangeSelection: 'leading comments',
      matchSelection: 'earliest',
      offsetRule: 'UTF-16',
    },
  ],
  importedReferencePathRules: [],
  pathMatcherSemantics: 'exact path',
  signalCollection: 'all',
  signalDeduplication: 'structural',
  signalOrdering: 'UTF-16',
  generatedConfirmed: 'producer rule',
  generatedDeclaredUnconfirmed: 'path or header',
  imported: 'explicit only',
  authored: 'readable unmatched',
  unknown: 'unreadable with no generated or imported signal',
  precedence: [
    'generated-confirmed',
    'generated-declared-unconfirmed',
    'imported',
    'authored',
    'unknown',
  ],
};

const ROLE_RULES: readonly RoleRule[] = [
  { role: 'test-spec-support-fixture', match: 'all', pathRegexes: ['(?:^|/)tests?/'] },
  { role: 'generator', match: 'all', pathRegexes: [String.raw`(?:^|/)generate[^/]*\.ts$`] },
  {
    role: 'generated-contract-data-carrier',
    match: 'all',
    provenanceValues: ['generated-confirmed', 'generated-declared-unconfirmed'],
  },
  { role: 'build-time-producer', match: 'all', pathRegexes: ['(?:^|/)build/'] },
  { role: 'cli-hook-operator', match: 'all', pathRegexes: ['(?:^|/)scripts?/'] },
  { role: 'tsx-syntax-source', match: 'all', pathRegexes: [String.raw`\.tsx$`] },
  {
    role: 'api-facade',
    match: 'all',
    pathRegexes: [String.raw`(?:^|/)index\.tsx?$`],
    sourcePredicates: ['contains-export-declaration'],
  },
  { role: 'config-setup', match: 'all', pathRegexes: [String.raw`\.config\.tsx?$`] },
  { role: 'declaration', match: 'all', pathRegexes: [String.raw`\.d\.ts$`] },
  { role: 'research-evidence-template', match: 'all', pathRegexes: ['^research/'] },
  { role: 'implementation-source', match: 'all', fallback: 'readable-with-no-other-role' },
  { role: 'unknown', match: 'all', fallback: 'unreadable-invalid-utf8-or-unsupported-mode' },
];
