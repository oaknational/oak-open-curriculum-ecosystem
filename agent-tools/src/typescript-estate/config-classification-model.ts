import type { FileRole } from './file-vocabulary.js';
import type { NonEmptyReadonlyArray, RepoPath } from './scalar-model.js';

export interface WorkspaceYamlParserOptions {
  readonly version: '1.2';
  readonly schema: 'core';
  readonly strict: true;
  readonly uniqueKeys: true;
  readonly stringKeys: false;
  readonly merge: false;
  readonly resolveKnownTags: false;
  readonly customTags: readonly [];
  readonly intAsBigInt: false;
  readonly prettyErrors: false;
  readonly logLevel: 'silent';
}

export interface WorkspaceAttributionConfig {
  readonly manifestPath: 'pnpm-workspace.yaml';
  readonly manifestTreeRequirement: string;
  readonly utf8Decoding: string;
  readonly yamlParser: {
    readonly package: 'yaml';
    readonly version: '2.9.0';
    readonly entrypoint: 'parseAllDocuments';
    readonly options: WorkspaceYamlParserOptions;
  };
  readonly documentRule: string;
  readonly rootRule: string;
  readonly packagesRule: string;
  readonly patternGrammar: string;
  readonly candidateManifestRule: string;
  readonly packageJsonRule: string;
  readonly packageNamePattern: '^(?:[A-Za-z0-9_~-][A-Za-z0-9._~-]*|@[A-Za-z0-9_~-][A-Za-z0-9._~-]*/[A-Za-z0-9_~-][A-Za-z0-9._~-]*)$';
  readonly packageNameRule: string;
  readonly attributionRule: string;
  readonly dependencyRule: string;
}

export interface GeneratedOutputRule {
  readonly id: string;
  readonly pathPrefix: RepoPath;
  readonly producerEvidence: NonEmptyReadonlyArray<RepoPath>;
}

export interface GeneratedOutputRuleSemantics {
  readonly ruleIdentity: string;
  readonly prefixForm: string;
  readonly prefixSeparation: string;
  readonly producerEvidence: string;
  readonly failureBehaviour: string;
}

export interface ProvenanceClassificationConfig {
  readonly generatedPathMatchers: readonly [
    {
      readonly id: 'generated-directory-segment';
      readonly kind: 'complete-path-segment';
      readonly values: readonly ['generated', '__generated__'];
    },
    {
      readonly id: 'generated-ts-basename-suffix';
      readonly kind: 'basename-suffix';
      readonly values: readonly ['.generated.ts', '.generated.tsx'];
    },
  ];
  readonly generatedHeaderMatchers: readonly [
    {
      readonly id: 'leading-generated-banner';
      readonly source: '(?:auto[- ]?generated|generated file|do not edit)';
      readonly flags: 'iu';
      readonly commentRangeSelection: string;
      readonly matchSelection: string;
      readonly offsetRule: string;
    },
  ];
  readonly importedReferencePathRules: readonly [];
  readonly pathMatcherSemantics: string;
  readonly signalCollection: string;
  readonly signalDeduplication: string;
  readonly signalOrdering: string;
  readonly generatedConfirmed: string;
  readonly generatedDeclaredUnconfirmed: string;
  readonly imported: string;
  readonly authored: string;
  readonly unknown: string;
  readonly precedence: readonly [
    'generated-confirmed',
    'generated-declared-unconfirmed',
    'imported',
    'authored',
    'unknown',
  ];
}

interface RoleSelectors {
  readonly pathRegexes?: NonEmptyReadonlyArray<string>;
  readonly provenanceValues?: NonEmptyReadonlyArray<
    'generated-confirmed' | 'generated-declared-unconfirmed'
  >;
  readonly sourcePredicates?: NonEmptyReadonlyArray<'contains-export-declaration'>;
}

type AtLeastOne<T> = {
  readonly [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

export type RoleSelectorRule = {
  readonly role: Exclude<FileRole, 'implementation-source' | 'unknown'>;
  readonly match: 'all';
} & AtLeastOne<RoleSelectors>;

export type RoleFallbackRule =
  | {
      readonly role: 'implementation-source';
      readonly match: 'all';
      readonly fallback: 'readable-with-no-other-role';
    }
  | {
      readonly role: 'unknown';
      readonly match: 'all';
      readonly fallback: 'unreadable-invalid-utf8-or-unsupported-mode';
    };

export type RoleRule = RoleSelectorRule | RoleFallbackRule;

export interface RoleSemanticsConfig {
  readonly pathRegexCompilation: string;
  readonly ruleUniqueness: string;
  readonly withinFamily: 'or';
  readonly acrossPopulatedFamilies: 'and';
  readonly selectorEvaluation: string;
  readonly sourcePredicateAvailability: string;
  readonly fallbackEvaluation: string;
  readonly roleOutput: string;
  readonly semanticBoundary: string;
}

/** The classification projection copied from one validated detector document. */
export interface FileClassificationConfig {
  readonly workspaceAttribution: WorkspaceAttributionConfig;
  readonly generatedOutputRules: readonly GeneratedOutputRule[];
  readonly provenanceClassification: ProvenanceClassificationConfig;
  readonly roleRules: readonly RoleRule[];
}
