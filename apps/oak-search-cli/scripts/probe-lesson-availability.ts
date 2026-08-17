#!/usr/bin/env -S pnpm exec tsx
/**
 * Probe the upstream Oak API's lesson-availability responses.
 *
 * Fetches three lessons — one available, one that does not exist, and one
 * absent for copyright (restriction) reasons — and prints the response
 * status codes and error messages side by side, for the summary and
 * transcript endpoints plus the check-restricted oracle.
 *
 * Why both endpoints: the summary endpoint currently returns an identical
 * 404 "Lesson not found" for the missing and restricted cases, while the
 * transcript endpoint differentiates the restricted case via its error
 * message (400 "Transcript not available…" with a "blocked" cause). The
 * side-by-side output makes that asymmetry visible.
 *
 * Usage (from apps/oak-search-cli):
 *   pnpm exec tsx scripts/probe-lesson-availability.ts
 *   pnpm exec tsx scripts/probe-lesson-availability.ts <available> <missing> <restricted>
 *
 * Loads the full search-cli runtime config (same schema as download-bulk.ts):
 * OAK_API_KEY plus the Elasticsearch/search credentials that schema requires
 * must be present in .env.local, even though only OAK_API_KEY is used here —
 * a probe-specific minimal schema is routed to the Bucket-2 coherence-canary
 * lane (this script is its seed). OAK_API_URL overrides the default base URL.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { typeSafeEntries } from '@oaknational/type-helpers';
import { loadConfigOrExit } from '../src/runtime-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_BASE_URL = 'https://open-api.thenational.academy/api/v0';

const DEFAULT_LESSONS = {
  available: 'heating-and-cooling',
  missing: 'this-lesson-does-not-exist-probe',
  restricted: 'pure-substance',
} as const;

/** Upstream error body: `{ message, code }` plus an undocumented `data.cause` on some endpoints. */
const errorBodySchema = z.looseObject({
  message: z.string().optional(),
  code: z.string().optional(),
  data: z.looseObject({ cause: z.string().optional() }).optional(),
});

const summaryBodySchema = z.looseObject({ lessonTitle: z.string().optional() });

const restrictionMapSchema = z.record(z.string(), z.string());

interface ProbeOutcome {
  readonly status: number | 'network-error';
  readonly detail: string;
  readonly raw: unknown;
}

/**
 * Neutralise line breaks and other whitespace control characters in response-
 * or argv-derived text before it reaches the log, so external data cannot
 * forge or split log lines (Sonar S5145 log-injection class).
 */
function sanitizeForLog(value: string): string {
  return value.replaceAll(/[\n\r\t\v\f]+/gu, ' ');
}

function formatPart(label: string, value: string | undefined): string | undefined {
  return value === undefined ? undefined : `${label}=${JSON.stringify(value)}`;
}

function describeErrorBody(body: unknown): string {
  const parsed = errorBodySchema.safeParse(body);
  if (!parsed.success) {
    return JSON.stringify(body)?.slice(0, 200) ?? String(body);
  }
  const parts = [
    formatPart('message', parsed.data.message),
    formatPart('code', parsed.data.code),
    formatPart('cause', parsed.data.data?.cause),
  ].filter((part) => part !== undefined);
  return parts.length > 0 ? parts.join('  ') : JSON.stringify(parsed.data).slice(0, 200);
}

function describeSuccessBody(body: unknown): string {
  const parsed = summaryBodySchema.safeParse(body);
  if (parsed.success && parsed.data.lessonTitle !== undefined) {
    return `lessonTitle=${JSON.stringify(parsed.data.lessonTitle)}`;
  }
  return `(payload, ${JSON.stringify(body)?.length ?? 0} bytes)`;
}

async function probe(url: string, apiKey: string, init?: RequestInit): Promise<ProbeOutcome> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    const body: unknown = await response.json().catch(() => '(unparseable body)');
    const detail = response.ok ? describeSuccessBody(body) : describeErrorBody(body);
    return { status: response.status, detail, raw: body };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { status: 'network-error', detail, raw: undefined };
  }
}

async function probeLesson(
  baseUrl: string,
  apiKey: string,
  label: string,
  slug: string,
): Promise<void> {
  console.log(`── ${label.toUpperCase()}: ${sanitizeForLog(slug)}`);
  const summary = await probe(`${baseUrl}/lessons/${encodeURIComponent(slug)}/summary`, apiKey);
  console.log(
    `   GET /lessons/{slug}/summary     → ${String(summary.status)}  ${sanitizeForLog(summary.detail)}`,
  );
  const transcript = await probe(
    `${baseUrl}/lessons/${encodeURIComponent(slug)}/transcript`,
    apiKey,
  );
  console.log(
    `   GET /lessons/{slug}/transcript  → ${String(transcript.status)}  ${sanitizeForLog(transcript.detail)}`,
  );
  console.log('');
}

async function printRestrictionStatuses(
  baseUrl: string,
  apiKey: string,
  slugs: readonly string[],
): Promise<void> {
  const outcome = await probe(`${baseUrl}/lessons/check-restricted`, apiKey, {
    method: 'POST',
    body: JSON.stringify({ lessonSlugs: slugs }),
  });
  console.log(`── POST /lessons/check-restricted (all three) → ${String(outcome.status)}`);
  const parsed = restrictionMapSchema.safeParse(outcome.raw);
  if (parsed.success) {
    for (const [slug, status] of typeSafeEntries(parsed.data)) {
      console.log(
        `   ${sanitizeForLog(String(status)).padEnd(16)} ${sanitizeForLog(String(slug))}`,
      );
    }
    return;
  }
  console.log(`   ${sanitizeForLog(outcome.detail)}`);
}

async function main(): Promise<void> {
  const env = loadConfigOrExit({ processEnv: process.env, startDir: __dirname }).env;
  const apiKey = env.OAK_API_KEY;
  if (apiKey === undefined || apiKey === '') {
    console.error('OAK_API_KEY is required — set it in .env.local or as an environment variable');
    process.exitCode = 1;
    return;
  }
  const baseUrl = process.env.OAK_API_URL ?? DEFAULT_BASE_URL;

  const [availableArg, missingArg, restrictedArg] = process.argv.slice(2);
  const lessons = {
    available: availableArg ?? DEFAULT_LESSONS.available,
    missing: missingArg ?? DEFAULT_LESSONS.missing,
    restricted: restrictedArg ?? DEFAULT_LESSONS.restricted,
  };

  console.log(`Base URL: ${sanitizeForLog(baseUrl)}\n`);
  for (const [label, slug] of typeSafeEntries(lessons)) {
    await probeLesson(baseUrl, apiKey, label, slug);
  }
  await printRestrictionStatuses(baseUrl, apiKey, [
    lessons.available,
    lessons.missing,
    lessons.restricted,
  ]);
}

await main();
