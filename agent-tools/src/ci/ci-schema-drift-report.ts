/**
 * Pure report builder for the schema-drift signal. One verdict renders every
 * consuming surface — the `::warning` annotation, the step-summary line, and
 * the informational commit-status description — so the signal cannot fire on
 * one surface and silently miss another (the 2026-08-18 failure: the
 * annotation fired on every drifted build while no PR/commit surface carried
 * anything, and the 0.7.0→0.11.0 drift was found by a live smoke test
 * instead of this sensor).
 *
 * Every path yields a verdict — `in-sync`, `drifted`, or `skipped` — so a
 * fetch failure produces a status that SAYS "skipped" rather than a missing
 * status indistinguishable from the check never running.
 *
 * Upstream text (`info.version`) is untrusted: it is escaped through the
 * shared annotation escaper and length-capped before composing, so a crafted
 * version cannot break out of a workflow-command line or flood a status.
 *
 * Side-effect-free (no fetch, no fs, no env) like its sibling
 * {@link file://./ci-schema-drift-eval.ts}; the runner owns all IO.
 *
 * @packageDocumentation
 */

import { isJsonObject } from '../core/json.js';

import { evaluateSchemaDrift } from './ci-schema-drift-eval.js';
import { escapeAnnotationMessage } from './ci-turbo-report-formatting.js';

/**
 * The commit-status API truncates descriptions beyond 140 characters; the
 * builder stays inside the limit, and composes verdict-and-versions FIRST so
 * truncation can only ever eat the remedial tail, never the payload.
 */
export const STATUS_DESCRIPTION_LIMIT = 140;

/** Upstream version strings are capped before composing — untrusted input never floods a surface. */
const VERSION_LENGTH_CAP = 32;

const CACHE_FILE_ANNOTATION =
  'file=packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json';

/** Everything the drift signal's surfaces render from. */
export interface SchemaDriftReport {
  readonly outcome: 'in-sync' | 'drifted' | 'skipped';
  readonly cachedVersion: string;
  readonly liveVersion: string;
  /** GitHub Actions `::warning` line; present on drift only (annotations are drift-only). */
  readonly annotation: string | undefined;
  /** One markdown line for the step summary — EVERY outcome gets a line, so absence is never the signal. */
  readonly summaryMarkdown: string;
  /** Commit-status description, always within {@link STATUS_DESCRIPTION_LIMIT}, verdict first. */
  readonly statusDescription: string;
}

/** Escape workflow-command metacharacters and cap length: upstream text stays inert on every surface. */
function sanitiseVersion(rawVersion: string): string {
  const escaped = escapeAnnotationMessage(rawVersion);
  return escaped.length <= VERSION_LENGTH_CAP ? escaped : escaped.slice(0, VERSION_LENGTH_CAP);
}

/**
 * The raw `info.version`, untouched: equality is judged on this value, so two
 * versions that differ only beyond the render cap still read as different.
 * Rendering goes through {@link sanitiseVersion}; never compare the rendered
 * forms.
 */
function extractRawVersion(schemaText: string): string {
  try {
    const parsed: unknown = JSON.parse(schemaText);
    if (isJsonObject(parsed) && isJsonObject(parsed['info'])) {
      const version: unknown = parsed['info']['version'];
      if (typeof version === 'string') {
        return version;
      }
    }
  } catch {
    // fall through to the honest unknown
  }
  return 'unknown';
}

function truncateToLimit(text: string): string {
  return text.length <= STATUS_DESCRIPTION_LIMIT
    ? text
    : `${text.slice(0, STATUS_DESCRIPTION_LIMIT - 1)}…`;
}

/** Build the verdict for a run whose comparison never happened (fetch failed, cache missing). */
export function buildSkippedSchemaDriftReport(reason: string): SchemaDriftReport {
  const safeReason = escapeAnnotationMessage(reason);
  return {
    outcome: 'skipped',
    cachedVersion: 'unknown',
    liveVersion: 'unknown',
    annotation: undefined,
    summaryMarkdown: `⏭️ Schema drift check skipped this run: ${safeReason}.`,
    statusDescription: truncateToLimit(`Skipped this run: ${safeReason}`),
  };
}

/** Build the single drift verdict every signal surface renders from. */
export function buildSchemaDriftReport(cachedText: string, liveText: string): SchemaDriftReport {
  const rawCachedVersion = extractRawVersion(cachedText);
  const rawLiveVersion = extractRawVersion(liveText);
  const cachedVersion = sanitiseVersion(rawCachedVersion);
  const liveVersion = sanitiseVersion(rawLiveVersion);
  const { drifted } = evaluateSchemaDrift(cachedText, liveText);

  if (!drifted) {
    return {
      outcome: 'in-sync',
      cachedVersion,
      liveVersion,
      annotation: undefined,
      summaryMarkdown: `✅ Schema cache in sync with the live upstream spec (version ${liveVersion}, as of this run).`,
      statusDescription: truncateToLimit(`In sync: upstream ${liveVersion} (as of this run)`),
    };
  }

  const versionNote =
    rawLiveVersion === rawCachedVersion
      ? `Both are version ${liveVersion} but content differs (upstream may have changed without a version bump).`
      : `Cached: ${cachedVersion}, live: ${liveVersion}.`;

  return {
    outcome: 'drifted',
    cachedVersion,
    liveVersion,
    annotation: `::warning ${CACHE_FILE_ANNOTATION}::Schema cache has drifted from the live upstream spec. ${versionNote} Run \`pnpm sdk-codegen:refresh\` to update the cache and rebuild.`,
    summaryMarkdown: `⚠️ **Schema cache drifted from upstream.** ${versionNote} Run \`pnpm sdk-codegen:refresh\`.`,
    statusDescription: truncateToLimit(
      `Drift: cached ${cachedVersion}, live ${liveVersion} (as of this run) — pnpm sdk-codegen:refresh`,
    ),
  };
}
