/**
 * Operator profile — the family-1 enforcement schema.
 *
 * The operator profile is the Practice's one surface outside a repository
 * (the operator-profile PDR): `~/.practice/profile/index.md` for what is
 * true of the operator everywhere, `repos/<scope-key>.md` for one repository
 * line, and `machines/<machine-key>.md` for one machine only — the split
 * that lets the root be an optional private git repository the operator
 * syncs between machines. Every document opens with a YAML frontmatter
 * block. The portable CONTRACT for that block is the Core-carried JSON
 * Schema at `.agent/practice-core/schemas/operator-profile.schema.json`;
 * this module is the estate's ENFORCEMENT surface, a strict zod mirror, and
 * the `validate-operator-profile-contract.ts` smoke (package script
 * `validate-operator-profile-contract`) proves the two agree on every
 * fixture so drift red-gates.
 */

import { z } from 'zod';

/** Repo-relative path of the Core-carried contract document. */
export const OPERATOR_PROFILE_CONTRACT_REL_PATH =
  '.agent/practice-core/schemas/operator-profile.schema.json';

/** The schema family this enforcement surface implements. */
export const OPERATOR_PROFILE_SCHEMA_VERSION = 1;

/** Name of the shared document inside the profile root. */
export const INDEX_FILE_NAME = 'index.md';

/** Directory (inside the profile root) holding repository-scoped documents. */
export const SCOPES_DIR_NAME = 'repos';

/** Directory (inside the profile root) holding machine-scoped documents. */
export const MACHINES_DIR_NAME = 'machines';

/**
 * The root package name as a key, lowercase: `name`, or `scope--name` for a
 * scoped `@scope/name`; the scope file is `repos/<scope_key>.md`.
 */
export const SCOPE_KEY_PATTERN = /^[a-z0-9][a-z0-9._-]*(?:--[a-z0-9][a-z0-9._-]*)?$/;

/** The short host name, lowercase; the machine file is `machines/<machine_key>.md`. */
export const MACHINE_KEY_PATTERN = /^[a-z0-9][a-z0-9.-]*$/;

/** YYYY-MM-DD with the month bounded to 01-12 and the day to 01-31 — the contract's pattern, verbatim. */
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const commonFields = {
  practice_profile: z.literal('operator-profile'),
  schema_version: z.literal(OPERATOR_PROFILE_SCHEMA_VERSION),
  updated: z.string().regex(DATE_PATTERN, 'an ISO calendar date, YYYY-MM-DD'),
  ratified: z.boolean(),
  seeded_by: z.string().min(1).optional(),
  operator: z.string().min(1).optional(),
};

const indexFrontmatterSchema = z.strictObject({
  ...commonFields,
  kind: z.literal('index'),
});

const scopeFrontmatterSchema = z.strictObject({
  ...commonFields,
  kind: z.literal('scope'),
  scope_key: z
    .string()
    .regex(
      SCOPE_KEY_PATTERN,
      'the root package name, lowercase: name, or scope--name for a scoped @scope/name',
    ),
});

const machineFrontmatterSchema = z.strictObject({
  ...commonFields,
  kind: z.literal('machine'),
  machine_key: z.string().regex(MACHINE_KEY_PATTERN, 'the short host name, lowercase'),
});

/** Any profile document's frontmatter: exactly one of the three kinds. */
export const operatorProfileFrontmatterSchema = z.discriminatedUnion('kind', [
  indexFrontmatterSchema,
  scopeFrontmatterSchema,
  machineFrontmatterSchema,
]);

export type OperatorProfileFrontmatter = z.infer<typeof operatorProfileFrontmatterSchema>;
export type OperatorProfileKind = OperatorProfileFrontmatter['kind'];
