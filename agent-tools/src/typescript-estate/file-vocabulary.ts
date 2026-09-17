export const ROLE_VALUES = [
  'test-spec-support-fixture',
  'generator',
  'generated-contract-data-carrier',
  'build-time-producer',
  'cli-hook-operator',
  'tsx-syntax-source',
  'api-facade',
  'config-setup',
  'declaration',
  'research-evidence-template',
  'implementation-source',
  'unknown',
] as const;

export type FileRole = (typeof ROLE_VALUES)[number];

export const SOURCE_EXTENSIONS = ['.ts', '.tsx'] as const;

export type SourceExtension = (typeof SOURCE_EXTENSIONS)[number];

export const PROVENANCE_VALUES = [
  'authored',
  'generated-confirmed',
  'generated-declared-unconfirmed',
  'imported',
  'unknown',
] as const;

export type Provenance = (typeof PROVENANCE_VALUES)[number];

export const DELIVERY_DIMENSIONS = [
  'typecheckProjectIncluded',
  'emittingProjectIncluded',
  'buildEmitted',
  'packageExported',
  'executableEntry',
  'runtimeRegistered',
  'operatorInvoked',
  'filesystemOrStringLoaded',
  'verificationOnly',
  'repositoryReferenceOnly',
] as const;

export type DeliveryDimension = (typeof DELIVERY_DIMENSIONS)[number];

export const DELIVERY_STATES = ['present', 'absent', 'not-probed', 'ambiguous'] as const;

export type DeliveryState = (typeof DELIVERY_STATES)[number];

export const TYPE_TRUTH_IDS = [
  'type-assertion',
  'any-keyword',
  'unknown-keyword',
  'non-null-assertion',
  'typescript-suppression',
  'record-string-unknown',
  'zod-unknown',
] as const;

export type TypeTruthId = (typeof TYPE_TRUTH_IDS)[number];

export const MODULE_DECLARATION_KINDS = [
  'import',
  'import-equals',
  're-export',
  'dynamic-import',
  'require',
] as const;

export type ModuleDeclarationKind = (typeof MODULE_DECLARATION_KINDS)[number];

export const SCHEMA_SHAPE_KINDS = ['interface', 'type-literal', 'zod-object'] as const;

export type SchemaShapeKind = (typeof SCHEMA_SHAPE_KINDS)[number];

export const SCHEMA_SHAPE_UNSUPPORTED_REASONS = [
  'computed-property-name',
  'interface-heritage',
  'index-signature',
  'call-signature',
  'construct-signature',
  'spread-assignment',
  'unsupported-member-kind',
  'zod-argument-count',
  'zod-non-object-argument',
] as const;

export type SchemaShapeUnsupportedReason = (typeof SCHEMA_SHAPE_UNSUPPORTED_REASONS)[number];

export const REPETITION_REGION_KINDS = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunction',
  'MethodDeclaration',
  'GetAccessor',
  'SetAccessor',
  'Constructor',
  'ClassDeclaration',
  'InterfaceDeclaration',
  'TypeAliasDeclaration',
  'TypeLiteral',
  'ObjectLiteralExpression',
] as const;

export type RepetitionRegionKind = (typeof REPETITION_REGION_KINDS)[number];
