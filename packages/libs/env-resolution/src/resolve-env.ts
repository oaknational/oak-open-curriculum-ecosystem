/**
 * Environment resolution pipeline.
 *
 * Loads `.env` / `.env.local` from both repo root and app root, merges
 * with `processEnv` (highest precedence), validates against a Zod schema,
 * and returns `Result<T, EnvResolutionError>`.
 *
 * The consuming app defines its requirements via a Zod schema. This
 * module owns loading, merging, validation, and diagnostics.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as dotenvParse } from 'dotenv';
import type { z } from 'zod';
import { ok, err, type Result } from '@oaknational/result';
import { findRepoRoot, findAppRoot } from './repo-root.js';

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
 * Extracts unique top-level keys from Zod validation issues.
 *
 * These are keys that actually caused validation failures, as opposed to
 * keys that are merely absent but optional.
 */
function extractFailingKeys(issues: readonly z.core.$ZodIssue[]): readonly string[] {
  return [
    ...new Set(
      issues.flatMap((i) =>
        i.path.filter((segment): segment is string => typeof segment === 'string'),
      ),
    ),
  ];
}

/**
 * Builds a structured error for a failed environment validation.
 *
 * Distinguishes between keys that actually caused validation failures
 * (shown prominently) and keys that are merely absent but optional
 * (shown as a lower-priority diagnostic). This prevents operators from
 * being confused by a long list of "missing" optional keys when only
 * one key has an invalid value.
 */
function buildEnvResolutionError(
  diagnostics: readonly EnvKeyDiagnostic[],
  issues: readonly z.core.$ZodIssue[],
  isVercel: boolean,
): EnvResolutionError {
  const absentKeys = diagnostics.filter((d) => !d.present).map((d) => d.key);
  const failingKeys = extractFailingKeys(issues);
  const issueMessages = issues.map((i) => i.message);

  const failingKeySet = new Set(failingKeys);
  const absentButNotFailing = absentKeys.filter((k) => !failingKeySet.has(k));

  const vercelGuidance =
    isVercel && failingKeys.length > 0
      ? `\n  This is a Vercel deployment. Configure the failing keys in your ` +
        `Vercel project settings (Settings → Environment Variables): ${failingKeys.join(', ')}`
      : '';

  const optionalAbsentLine =
    absentButNotFailing.length > 0
      ? `\n  (${String(absentButNotFailing.length)} optional key${absentButNotFailing.length === 1 ? '' : 's'} not configured: ${absentButNotFailing.join(', ')})`
      : '';

  const message =
    `Environment validation failed.\n` +
    `  Failing keys: ${failingKeys.length > 0 ? failingKeys.join(', ') : 'none'}\n` +
    `  Validation errors: ${issueMessages.join('; ')}` +
    optionalAbsentLine +
    vercelGuidance;

  return { message, diagnostics, zodIssues: issues };
}

/**
 * Resolves environment variables from a five-source hierarchy,
 * validates against the provided Zod schema, and returns a typed Result.
 *
 * Source precedence (lowest to highest):
 * 1. Repo root `.env` — shared defaults (committed)
 * 2. Repo root `.env.local` — local developer overrides (gitignored)
 * 3. App root `.env` — app-specific defaults (committed)
 * 4. App root `.env.local` — app-specific local overrides (gitignored)
 * 5. `processEnv` — explicit env vars (e.g. `KEY=val command`)
 *
 * When the app root and repo root are the same directory, the app-level
 * layer is skipped to avoid redundant double-loading.
 *
 * In serverless environments (Vercel, etc.) where no filesystem markers
 * exist, both root finders return `undefined` and the hierarchy collapses
 * to `processEnv` only.
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
  const appRoot = findAppRoot(startDir);

  const repoDotEnv = repoRoot ? parseEnvFile(join(repoRoot, '.env')) : {};
  const repoDotEnvLocal = repoRoot ? parseEnvFile(join(repoRoot, '.env.local')) : {};

  const appIsDistinct = appRoot !== undefined && appRoot !== repoRoot;
  const appDotEnv = appIsDistinct ? parseEnvFile(join(appRoot, '.env')) : {};
  const appDotEnvLocal = appIsDistinct ? parseEnvFile(join(appRoot, '.env.local')) : {};

  const merged: Record<string, string | undefined> = {
    ...repoDotEnv,
    ...repoDotEnvLocal,
    ...appDotEnv,
    ...appDotEnvLocal,
    ...processEnv,
  };

  const parsed = schema.safeParse(merged);
  const schemaKeys = extractSchemaKeys(schema);
  const diagnostics = buildDiagnostics(merged, schemaKeys);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(buildEnvResolutionError(diagnostics, parsed.error.issues, processEnv.VERCEL === '1'));
}
