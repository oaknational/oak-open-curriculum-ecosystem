/**
 * Schema-validated loader for `skills-lock.json`.
 *
 * Establishes the trust boundary for every later
 * `skills-adapter-generate` consumer: the lock file is parsed and
 * Ajv-validated here once, and consumers receive a typed, immutable
 * `Set<string>` of locked skill ids rather than re-parsing the JSON
 * themselves.
 */
import Ajv, { type ErrorObject } from 'ajv/dist/2020.js';

/**
 * Validated shape of a single entry under the `skills` map of
 * `skills-lock.json`. The schema below proves these three fields are
 * present and string-typed; this interface preserves that proof in the
 * TypeScript type so downstream consumers do not re-validate.
 */
interface LockedSkillEntry {
  readonly source: string;
  readonly sourceType: string;
  readonly computedHash: string;
}

/**
 * Discriminated error type carried by {@link LoadLockedSkillIdsResult}.
 */
type LockError =
  | { readonly kind: 'json-parse'; readonly message: string }
  | { readonly kind: 'schema-violation'; readonly message: string; readonly path: string };

/**
 * Result of {@link loadLockedSkillIds}.
 *
 * The shape mirrors `agent-tools/src/bin/agent-identity-cli-parser.ts` so
 * that consolidation into a shared Result module remains straightforward
 * once a third consumer appears.
 */
export type LoadLockedSkillIdsResult =
  | { readonly kind: 'ok'; readonly value: ReadonlySet<string> }
  | { readonly kind: 'error'; readonly error: LockError };

interface LockFileShape {
  readonly version: number;
  readonly skills: Record<string, LockedSkillEntry>;
}

const lockSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['version', 'skills'],
  // Top-level additionalProperties: true is intentional — the lock file is
  // generator-owned and may grow new top-level keys. Per-skill entries below
  // are fully constrained.
  additionalProperties: true,
  properties: {
    version: { type: 'number' },
    skills: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        required: ['source', 'sourceType', 'computedHash'],
        properties: {
          source: { type: 'string' },
          sourceType: { type: 'string' },
          computedHash: { type: 'string' },
        },
        additionalProperties: true,
      },
    },
  },
} as const;

const ajv = new Ajv({ allErrors: false, strict: false });
const validate = ajv.compile<LockFileShape>(lockSchema);

/**
 * Parse and validate `skills-lock.json` content.
 *
 * @param rawJsonText - The raw text of `skills-lock.json`.
 * @returns A {@link LoadLockedSkillIdsResult} carrying either the locked skill
 *   id set or a typed error. Never throws.
 */
export function loadLockedSkillIds(rawJsonText: string): LoadLockedSkillIdsResult {
  const parsed = parseJsonText(rawJsonText);
  if (parsed.kind === 'error') {
    return parsed;
  }

  if (!validate(parsed.value)) {
    return schemaViolation(validate.errors?.[0]);
  }

  return { kind: 'ok', value: extractIds(parsed.value.skills) };
}

function parseJsonText(
  rawJsonText: string,
): { kind: 'ok'; value: unknown } | { kind: 'error'; error: LockError } {
  try {
    return { kind: 'ok', value: JSON.parse(rawJsonText) };
  } catch (error) {
    return {
      kind: 'error',
      error: {
        kind: 'json-parse',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

function schemaViolation(error: ErrorObject | undefined): LoadLockedSkillIdsResult {
  return {
    kind: 'error',
    error: {
      kind: 'schema-violation',
      message: error?.message ?? 'lock file failed schema validation',
      path: schemaErrorPath(error),
    },
  };
}

function schemaErrorPath(error: ErrorObject | undefined): string {
  if (error === undefined) {
    return '';
  }
  const missing =
    error.keyword === 'required' && typeof error.params['missingProperty'] === 'string'
      ? `/${error.params['missingProperty']}`
      : '';
  return `${error.instancePath}${missing}`;
}

function extractIds(skills: Record<string, LockedSkillEntry>): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const key in skills) {
    if (Object.hasOwn(skills, key)) {
      ids.add(key);
    }
  }
  return ids;
}
