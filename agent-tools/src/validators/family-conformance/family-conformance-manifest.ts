import { type AnySchema, type ErrorObject, type ValidateFunction } from 'ajv';
import Ajv from 'ajv/dist/2020.js';

import { err, ok, type Result } from '@oaknational/result';

import { failureAsError } from '../../core/failure-as-error.js';

/**
 * The family conformance manifest: its location, its typed shape and its
 * schema validation.
 *
 * The manifest (`.agent/family/<family>/practice-operations.json`) is one
 * tooling family's declared Practice-operation scripts and gate placement,
 * the same bytes in every repository of the family; `host.json` beside it
 * carries this host's values for the two placeholders. Both are validated
 * against the Core-carried JSON Schema before any comparison runs, so a
 * malformed declaration is a refusal and never a silent pass. The schema is
 * the contract; the interfaces below are the enforcement types the compiled
 * guards narrow to.
 *
 * @packageDocumentation
 */

/**
 * Repo-relative path of the schema document: the one constant that changes
 * when the schema lands in the Core as
 * `.agent/practice-core/schemas/family-conformance.schema.json`.
 */
export const FAMILY_CONFORMANCE_SCHEMA_REL_PATH =
  '.agent/practice-core/schemas/family-conformance.schema.json';

/** The tooling family this validator belongs to. */
export const FAMILY_NAME = 'typescript';

/** Repo-relative path of the host's placeholder values (the contextual layer). */
export const HOST_VALUES_REL_PATH = '.agent/family/host.json';

/** Repo-relative path of the family manifest. */
export const FAMILY_MANIFEST_REL_PATH = `.agent/family/${FAMILY_NAME}/practice-operations.json`;

/** Repo-relative directory of the family's hook bodies. */
export const FAMILY_HOOKS_REL_DIR = `.agent/family/${FAMILY_NAME}/hooks`;

/** Repo-relative directory of the host's live hooks. */
export const LIVE_HOOKS_REL_DIR = '.husky';

/** JSON pointer of the host-values shape inside the schema document. */
const HOST_VALUES_POINTER = '#/$defs/host_values';

/** The host's values for the manifest placeholders. */
export interface HostValues {
  readonly scope: string;
  readonly skill_prefix: string;
}

/** The `check` skeleton: family legs around two host slots. */
export interface CheckSkeleton {
  readonly head: readonly string[];
  readonly slot_before_build: 'host';
  readonly gates: readonly string[];
  readonly slot_after_tests: 'host';
  readonly tail: readonly string[];
}

/** The family manifest, as the schema admits it. */
export interface FamilyManifest {
  readonly family: string;
  readonly scripts: Readonly<Record<string, string>>;
  readonly check: CheckSkeleton;
  readonly aggregates: Readonly<Record<string, readonly string[]>>;
  readonly hooks: readonly string[];
  readonly ci: { readonly workflow: string; readonly fan_in_job: string };
  readonly compiler_base_flags: Readonly<Record<string, boolean>>;
  readonly formatter: { readonly config_file: string; readonly forbidden: readonly string[] };
  readonly package_manager: { readonly name: string; readonly major: number };
}

/** The two compiled guards one schema document yields. */
export interface FamilySchemaValidators {
  readonly manifest: ValidateFunction<FamilyManifest>;
  readonly host: ValidateFunction<HostValues>;
}

function isAnySchema(value: unknown): value is AnySchema {
  return typeof value === 'boolean' || (typeof value === 'object' && value !== null);
}

/**
 * Compile the schema document into the manifest guard and the host-values
 * guard. Strict mode stays ON: a typo'd keyword in the contract fails
 * compilation loudly instead of silently weakening the check. The host
 * guard is a `$ref` into the registered document, so the document's `$id`
 * is required.
 */
export function compileFamilySchemas(
  schemaDocument: unknown,
): Result<FamilySchemaValidators, Error> {
  if (!isAnySchema(schemaDocument) || typeof schemaDocument === 'boolean') {
    return err(new Error('the family conformance schema is not a JSON object'));
  }
  const schemaId = schemaDocument.$id;
  if (schemaId === undefined) {
    return err(new Error('the family conformance schema has no $id'));
  }
  try {
    const ajv = new Ajv({ strict: true, allErrors: true });
    const manifest = ajv.compile<FamilyManifest>(schemaDocument);
    const host = ajv.compile<HostValues>({ $ref: `${schemaId}${HOST_VALUES_POINTER}` });
    return ok({ manifest, host });
  } catch (failure) {
    return err(failureAsError(failure, 'the family conformance schema compile'));
  }
}

function formatIssue(issue: ErrorObject): string {
  return `${issue.instancePath || '(root)'} ${issue.message ?? 'invalid'}`;
}

/**
 * Narrow a parsed document through a compiled guard, naming every violated
 * site on refusal.
 */
export function validateWithSchema<T>(
  validate: ValidateFunction<T>,
  value: unknown,
  label: string,
): Result<T, Error> {
  if (validate(value)) {
    return ok(value);
  }
  const issues = (validate.errors ?? []).map(formatIssue).join('; ');
  return err(new Error(`${label} does not satisfy the family conformance schema: ${issues}`));
}
