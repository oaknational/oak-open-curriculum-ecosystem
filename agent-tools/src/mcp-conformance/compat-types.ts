/**
 * Boundary schemas for the `mcpjam compat` operation — per-host MCP Apps /
 * widget compatibility verdicts for the served surface (protocol negotiation
 * is outside the capture's scope — it supplies no connection facts).
 *
 * WHY THIS IS A SEPARATE BOUNDARY FROM THE SUITES. The `protocol`, `apps` and
 * `oauth` suites share one contract that `types.ts` models: a
 * `--reporter json-summary` document on stdout, present whether the suite
 * passed or failed, with the exit code carrying no verdict. `compat` inverts
 * it. Verified first-hand against the lockfile-pinned `@mcpjam/cli` 3.19.0
 * (resolving `@mcpjam/sdk` 2.4.0), 2026-08-14:
 *
 * - There is no `--reporter`; output is the CLI's own projection, emitted
 *   through the global `--format json` (which is also the non-TTY default).
 * - A successful run writes its report to STDOUT.
 * - A failed run writes NOTHING to stdout and describes itself in a
 *   structured envelope on STDERR, exiting 1 for an operational error or 2
 *   for a usage error.
 *
 * So for a suite, exit 1 means "here is your report"; for compat it means
 * "there is no report". Admitting compat into `ConformanceSuite` would force
 * the report schema into a union and invert the evidence gate for one member
 * of a closed enum — a compatibility bridge. It is a sibling operation
 * instead, following the `--drive` precedent.
 */
import { z } from 'zod';

import { compatFindingSchema, compatProvenanceSchema } from './compat-finding.js';

/**
 * The structured failure envelope `mcpjam` writes to stderr when a compat run
 * cannot produce a report.
 *
 * This is the wrapper's ONLY evidence on the failure path — stdout is empty —
 * so it is parsed strictly rather than string-matched, and its `code` and
 * `message` are carried into the run's failure reason — through
 * `boundedExcerpt`, so credential shapes are masked and the length is capped,
 * with the vendor's own classification otherwise untouched.
 *
 * Reporting the vendor's own words matters more here than it first appears:
 * the vendor classifies an authorisation failure as `INTERNAL_ERROR`, not
 * `UNAUTHORIZED` (observed against the deployed alpha with no credentials,
 * 2026-08-14 — the message names `HTTP 401` while the code does not).
 * Re-interpreting that into a friendlier code would put this wrapper's guess
 * where the vendor's evidence belongs, and would drift silently the moment the
 * vendor's own classification improves.
 *
 * `code` is typed as a non-empty string rather than an enum: the vendor's code
 * vocabulary is its own to extend, and pinning it here would turn a new
 * vendor code into a parse failure that destroys the diagnostic it arrived
 * with — the opposite of what the failure path is for. `details` stays
 * `unknown`: the wrapper never reads it, and pinning vendor-internal
 * diagnostics would make the boundary brittle for no verdict value.
 *
 * `.strict()` on both levels: an unrecognised shape reaching this parser means
 * the operation's dispatch is wrong (a success report parsed as a failure, or
 * a reporter change), and that must surface loudly rather than resolve to a
 * failure the wrapper never observed.
 */
export const compatErrorEnvelopeSchema = z
  .object({
    error: z
      .object({
        code: z.string().min(1),
        message: z.string().min(1),
        details: z.unknown().optional(),
      })
      .strict(),
  })
  .strict();

/**
 * Per-host verdict. `unknown` is not a failure to report — it is the engine
 * refusing to guess, and it is load-bearing: a truncated tool list demotes
 * every would-be `works` to `unknown` rather than asserting a verdict the
 * evidence cannot support.
 */
const compatVerdictSchema = z.enum(['works', 'degraded', 'blocked', 'unknown']);

const compatHostSchema = z
  .object({
    hostId: z.string().min(1),
    hostLabel: z.string(),
    verdict: compatVerdictSchema,
    provenance: compatProvenanceSchema,
    findings: z.array(compatFindingSchema),
  })
  .strict();

/**
 * The compat report as the CLI projects it — NOT the SDK's richer
 * `HostCompatReport`. The projection drops the per-lane verdicts and each
 * host's `verifiedAt`, so per-lane baselining is not available through this
 * surface at all; that is a property of the CLI, recorded here so a future
 * reader does not go looking for lane data the wrapper could have kept.
 *
 * This boundary judges SHAPE and internal consistency: a capture names at
 * least one host, never the same host twice, and its summary counts agree
 * with its own host verdicts. WHICH hosts it must name — the pinned
 * catalogue's exact set — belongs to the evidence gate, which can tell a
 * drifted catalogue from a malformed document and say so.
 */
export const compatReportSchema = z
  .object({
    target: z.string().min(1),
    catalogSource: z.enum(['live', 'bundled']),
    catalogVersion: z.number(),
    // Counts derived from array lengths in the CLI (`total` sums three widget
    // lists; `appOnly` is a subset of them), so a negative, fractional, or
    // subset-larger-than-whole value is a document contradicting itself, not
    // a surface to report on (review, 2026-09-15).
    widgets: z
      .object({ total: z.number().int().nonnegative(), appOnly: z.number().int().nonnegative() })
      .strict()
      .refine((widgets) => widgets.appOnly <= widgets.total, {
        message: 'app-only widgets are a subset of all widgets, so appOnly cannot exceed total',
      }),
    // Free-form vendor strings naming what the run could not determine (a
    // capped tool list, an unreadable widget). Never empty-string entries:
    // an unnamed unknown is indistinguishable from no unknown at all.
    unknownDimensions: z.array(z.string().min(1)),
    // Counts, not opinions: a negative or fractional tally is a malformed
    // document, and the cross-check below ties each count to the hosts it
    // claims to summarise.
    summary: z
      .object({
        works: z.number().int().nonnegative(),
        degraded: z.number().int().nonnegative(),
        blocked: z.number().int().nonnegative(),
        unknown: z.number().int().nonnegative(),
      })
      .strict(),
    // Structural only: a capture must name at least one host, each once. WHICH
    // hosts — the pinned catalogue's exact set — is judged in the evidence
    // gate, not here. Enforcing the pin at the schema made the gate's
    // `catalog-mismatch` diagnosis unreachable for the very case it exists
    // for: a live-catalogue report whose host set has drifted failed as a
    // generic shape error first (review, 2026-09-10).
    hosts: z
      .array(compatHostSchema)
      .min(1)
      .refine((hosts) => new Set(hosts.map((host) => host.hostId)).size === hosts.length, {
        message: 'a compat capture must not name the same host twice',
      }),
  })
  .strict()
  // A document that contradicts itself is not evidence. The vendor's summary
  // is a projection of its own host list, so each count must equal that
  // verdict's tally — without this a zero-exit report could claim
  // `blocked: 16` while listing sixteen `works` hosts, and the run would
  // verdict `pass` and emit the host projection (review, 2026-09-10).
  .refine(
    (report) =>
      (['works', 'degraded', 'blocked', 'unknown'] as const).every(
        (verdict) =>
          report.summary[verdict] ===
          report.hosts.filter((host) => host.verdict === verdict).length,
      ),
    {
      message:
        "a compat capture's summary counts must equal the tally of its own host verdicts — a report that contradicts itself is not evidence",
    },
  );

export type CompatReport = z.infer<typeof compatReportSchema>;
