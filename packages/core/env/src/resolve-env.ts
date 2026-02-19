/**
 * Environment resolution pipeline.
 *
 * Reads `.env` and `.env.local` from the monorepo root using non-mutating
 * `dotenv.parse()`, merges them with the caller-provided `processEnv`
 * (highest precedence), validates the merged result against a Zod schema,
 * and returns `Result<T, EnvResolutionError>`.
 *
 * The consuming app defines its requirements via a Zod schema. This
 * module owns loading, merging, validation, and diagnostics. The app
 * decides what to do with the result.
 *
 * @example
 * ```typescript
 * import { resolveEnv } from '@oaknational/mcp-env';
 * import { z } from 'zod';
 *
 * const AppSchema = z.object({ API_KEY: z.string().min(1) });
 *
 * const result = resolveEnv({
 *   schema: AppSchema,
 *   processEnv: process.env,
 *   startDir: process.cwd(),
 * });
 *
 * if (!result.ok) {
 *   console.error(result.error.message);
 *   process.exit(1);
 * }
 * console.log(result.value.API_KEY);
 * ```
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as dotenvParse } from 'dotenv';
import type { z } from 'zod';
import { ok, err, type Result } from '@oaknational/result';
import { findRepoRoot } from './repo-root.js';

/**
 * Options for the environment resolution pipeline.
 *
 * @typeParam TSchema - Zod schema type describing the expected env shape
 */
export interface ResolveEnvOptions<TSchema extends z.ZodType> {
  /** Zod schema that defines the required and optional env vars */
  readonly schema: TSchema;
  /** The process environment object (typically `process.env`) */
  readonly processEnv: Readonly<Record<string, string | undefined>>;
  /** Directory from which to begin searching for the monorepo root */
  readonly startDir: string;
}

/**
 * Diagnostic information for a single environment variable key.
 *
 * Reports whether the key was present in the merged environment
 * (across all sources: `.env`, `.env.local`, `processEnv`).
 */
export interface EnvKeyDiagnostic {
  readonly key: string;
  readonly present: boolean;
}

/**
 * Structured error returned when environment resolution fails.
 *
 * Contains a human-readable message, per-key diagnostics showing
 * which keys were present or absent, and the raw Zod validation issues.
 */
export interface EnvResolutionError {
  readonly message: string;
  readonly diagnostics: readonly EnvKeyDiagnostic[];
  readonly zodIssues: readonly z.core.$ZodIssue[];
}

/**
 * Parses a `.env` file into a key-value record without mutating `process.env`.
 *
 * @param filePath - Absolute path to the `.env` file
 * @returns Parsed key-value pairs, or empty object if the file does not exist
 */
function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }
  return dotenvParse(readFileSync(filePath, 'utf-8'));
}

/**
 * Extracts the top-level keys that a Zod schema expects.
 *
 * For `ZodObject`, reads keys from `.shape`. For schemas wrapped in
 * effects (e.g. via `.superRefine()`), reads from `._zpiInput.shape`.
 * Returns an empty array for schemas whose shape cannot be introspected.
 */
function extractSchemaKeys(schema: z.ZodType): readonly string[] {
  const shape = getShapeRecord(schema);
  if (!shape) {
    return [];
  }
  const keys: string[] = [];
  for (const key in shape) {
    keys.push(key);
  }
  return keys;
}

/**
 * Extracts the shape record from a Zod schema using duck-typing.
 *
 * Handles both direct ZodObject (has `.shape`) and ZodEffects-wrapped
 * schemas (has `._zpiInput.shape` in Zod v4).
 */
function getShapeRecord(schema: z.ZodType): z.ZodRawShape | undefined {
  if ('shape' in schema && isZodRawShape(schema.shape)) {
    return schema.shape;
  }

  if (
    '_zpiInput' in schema &&
    typeof schema._zpiInput === 'object' &&
    schema._zpiInput !== null &&
    'shape' in schema._zpiInput &&
    isZodRawShape(schema._zpiInput.shape)
  ) {
    return schema._zpiInput.shape;
  }

  return undefined;
}

function isZodRawShape(value: unknown): value is z.ZodRawShape {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Builds per-key diagnostics indicating which schema keys are present
 * in the merged environment.
 */
function buildDiagnostics(
  merged: Readonly<Record<string, string | undefined>>,
  schemaKeys: readonly string[],
): readonly EnvKeyDiagnostic[] {
  return schemaKeys.map((key) => {
    const value = merged[key];
    return { key, present: typeof value === 'string' && value.length > 0 };
  });
}

/**
 * Resolves environment variables from the standard source hierarchy,
 * validates against the provided Zod schema, and returns a typed Result.
 *
 * Source precedence (lowest to highest):
 * 1. `.env` — shared defaults (committed)
 * 2. `.env.local` — local developer overrides (gitignored)
 * 3. `processEnv` — explicit env vars (e.g. `KEY=val command`)
 *
 * @typeParam TSchema - Zod schema type
 * @param options - Pipeline options: schema, processEnv, startDir
 * @returns `Ok` with validated data, or `Err` with structured diagnostics
 */
export function resolveEnv<TSchema extends z.ZodType>(
  options: ResolveEnvOptions<TSchema>,
): Result<z.infer<TSchema>, EnvResolutionError> {
  const { schema, processEnv, startDir } = options;

  const repoRoot = findRepoRoot(startDir);

  const dotEnvValues = parseEnvFile(join(repoRoot, '.env'));
  const dotEnvLocalValues = parseEnvFile(join(repoRoot, '.env.local'));

  const merged: Record<string, string | undefined> = {
    ...dotEnvValues,
    ...dotEnvLocalValues,
    ...processEnv,
  };

  const parsed = schema.safeParse(merged);
  const schemaKeys = extractSchemaKeys(schema);
  const diagnostics = buildDiagnostics(merged, schemaKeys);

  if (parsed.success) {
    return ok(parsed.data);
  }

  const missingKeys = diagnostics.filter((d) => !d.present).map((d) => d.key);

  const issueMessages = parsed.error.issues.map((i: z.core.$ZodIssue) => i.message);

  const message =
    `Environment validation failed.\n` +
    `  Missing keys: ${missingKeys.length > 0 ? missingKeys.join(', ') : 'none'}\n` +
    `  Validation errors: ${issueMessages.join('; ')}`;

  return err({
    message,
    diagnostics,
    zodIssues: parsed.error.issues,
  });
}
