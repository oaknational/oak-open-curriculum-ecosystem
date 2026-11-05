/**
 * The `gh` IO boundary for the PDR-131 throughput register.
 *
 * @remarks
 * Fetches the merged-PR corpus by running `gh` by name through the injected
 * executor seam (`pr-watch`'s {@link GhCommandExecutor}: tests inject a fake;
 * the CLI injects `execFileSync`). The payload is schema-parsed at this
 * boundary: external data enters typed or not at all.
 *
 * @packageDocumentation
 */
import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import type { GhCommandExecutor } from '../pr-watch/gh.js';

import type { MergedPrRecord } from './index.js';

const MERGED_PR_SCHEMA = z.array(
  z.object({
    number: z.number().int().positive(),
    createdAt: z.iso.datetime(),
    mergedAt: z.iso.datetime(),
    headRefName: z.string().min(1),
  }),
);

export const MERGED_PR_JSON_FIELDS = 'number,createdAt,mergedAt,headRefName';

/**
 * The register measures exactly one repository, named explicitly on every
 * fetch: without `--repo`, gh falls back to the checkout's configured
 * default, and a fork checkout (or a stray `gh repo set-default`) would
 * append valid-looking rows computed from the wrong PR corpus.
 */
export const CANONICAL_REPOSITORY = 'oaknational/oak-open-curriculum-ecosystem';

/**
 * List PRs merged into `main` within the inclusive `mergedSinceDate` ..
 * `mergedUntilDate` day range (day precision — the window filter re-applies
 * precisely downstream), up to `limit`. The merge-date-bounded search is
 * load-bearing: the non-search list path orders by CREATED_AT, so a prefix's
 * minimum merge time proves nothing about omitted rows (a long-lived PR
 * merged today could be silently dropped). The UPPER bound is load-bearing
 * for historical `--now` runs: an open `merged:>=` would let post-window
 * merges consume the cap and trip the coverage refusal on a window that is
 * actually complete. A transport or shape failure is a typed `err` the
 * caller reports — never a throw and never silently-empty data.
 */
export function fetchMergedPrs(input: {
  readonly executor: GhCommandExecutor;
  readonly limit: number;
  readonly mergedSinceDate: string;
  readonly mergedUntilDate: string;
}): Result<readonly MergedPrRecord[], Error> {
  let raw: string;

  try {
    raw = input.executor(
      'gh',
      [
        'pr',
        'list',
        '--repo',
        CANONICAL_REPOSITORY,
        '--state',
        'merged',
        '--base',
        'main',
        '--search',
        `merged:${input.mergedSinceDate}..${input.mergedUntilDate}`,
        '--limit',
        String(input.limit),
        '--json',
        MERGED_PR_JSON_FIELDS,
      ],
      { encoding: 'utf8' },
    );
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return err(new Error(`gh pr list returned non-JSON output: ${raw.slice(0, 200)}`));
  }

  return parseWithSchema({
    label: 'gh pr list --state merged',
    schema: MERGED_PR_SCHEMA,
    value: parsed,
  });
}

/**
 * Refuse a corpus that cannot prove it covers the window: the fetch is
 * merge-date-bounded, so hitting the cap exactly means older in-window
 * merges may exist beyond it — a silently truncated subset would yield
 * plausible-but-wrong metrics (the no-silent-caps discipline). The typed
 * err names the remedy.
 */
export function assertWindowCovered(input: {
  readonly prs: readonly MergedPrRecord[];
  readonly limit: number;
  readonly windowDays: number;
}): Result<readonly MergedPrRecord[], Error> {
  if (input.prs.length < input.limit) {
    return ok(input.prs);
  }

  return err(
    new Error(
      `the merge-date-bounded fetch hit its ${String(input.limit)}-PR cap for the ` +
        `${String(input.windowDays)}d window — re-run with a larger --limit`,
    ),
  );
}
