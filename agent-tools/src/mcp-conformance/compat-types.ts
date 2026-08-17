/**
 * Boundary schemas for the `mcpjam compat` operation — per-host compatibility
 * verdicts for the served surface.
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

/**
 * The structured failure envelope `mcpjam` writes to stderr when a compat run
 * cannot produce a report.
 *
 * This is the wrapper's ONLY evidence on the failure path — stdout is empty —
 * so it is parsed strictly rather than string-matched, and its `code` and
 * `message` are carried verbatim into the run's failure reason.
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

/**
 * Where a host-profile fact came from, weakest to strongest as the vendor
 * ranks them (PROVENANCE_RANK in the engine): `assumed` (a default), `probe`
 * (the host's own capability handshake), `vendor-doc` (published
 * documentation), `observed` (a live run).
 *
 * Kept on the parsed surface because it grades how far a verdict can be
 * trusted — the vendor surfaces it so "a verdict never reads as more
 * authoritative than its weakest source", and the wrapper's summary carries
 * it through to the reader for the same reason.
 */
const compatProvenanceSchema = z.enum(['observed', 'vendor-doc', 'probe', 'assumed']);

/**
 * Which axis a finding belongs to: `apps` (widget rendering AND widget
 * capability use — the engine files `capability_unsupported` here too) or
 * `server` (protocol-level facts, e.g. protocol version).
 */
const compatLaneSchema = z.enum(['apps', 'server']);

/**
 * The vendor's stable machine key per finding class. Pinned as an enum
 * deliberately, unlike the failure envelope's free-string `code`: a novel
 * finding class changes what the verdict MEANS, so it must stop the run for
 * adjudication rather than flow through as an unrecognised string.
 */
const compatFindingCodeSchema = z.enum([
  'app_only_unrenderable',
  'widget_text_fallback',
  'capability_unsupported',
  'protocol_version_mismatch',
]);

/**
 * One finding. `title`, `detail` and `remediation` are the vendor's own
 * words: parsed so the document round-trips, never compared — the vendor
 * documents them as "default copy, not the contract", and pinning prose
 * would turn a copy edit into a red gate.
 */
const compatFindingSchema = z
  .object({
    lane: compatLaneSchema,
    severity: z.enum(['blocker', 'degraded', 'info']),
    code: compatFindingCodeSchema,
    capability: z.string().min(1).optional(),
    tools: z.array(z.string().min(1)).optional(),
    title: z.string(),
    detail: z.string(),
    remediation: z.string().optional(),
    provenance: compatProvenanceSchema.optional(),
  })
  .strict();

/**
 * The smallest host count a complete capture can have. The catalogue bundled
 * with the pinned SDK carries 16; this floor is deliberately that number and
 * not "whatever the catalogue says at runtime", because the point is to catch
 * a vendor report that is SHORTER than the catalogue it claims to cover.
 * Raise it when the pin moves and the catalogue grows.
 */
const CATALOGUE_HOST_FLOOR = 16;

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
 * `hosts` carries a FLOOR and a uniqueness rule, not a non-empty check: a
 * document naming fewer hosts than the pinned catalogue is an incomplete
 * capture, and letting it parse hands the caller a verdict about hosts nobody
 * evaluated. The compat twin of the suites' every-group-carries-a-case
 * refinement — see the constraint below for why a floor rather than an exact
 * count.
 */
export const compatReportSchema = z
  .object({
    target: z.string().min(1),
    catalogSource: z.enum(['live', 'bundled']),
    catalogVersion: z.number(),
    widgets: z.object({ total: z.number(), appOnly: z.number() }).strict(),
    // Free-form vendor strings naming what the run could not determine (a
    // capped tool list, an unreadable widget). Never empty-string entries:
    // an unnamed unknown is indistinguishable from no unknown at all.
    unknownDimensions: z.array(z.string().min(1)),
    summary: z
      .object({
        works: z.number(),
        degraded: z.number(),
        blocked: z.number(),
        unknown: z.number(),
      })
      .strict(),
    // The pinned offline catalogue carries a fixed host set, so a capture
    // naming fewer is INCOMPLETE, not small — and an incomplete capture read
    // as usable is a verdict about hosts nobody evaluated. A bare non-empty
    // check accepted a one-host report until review caught it.
    //
    // A floor rather than an exact count: the count belongs to the SDK pin,
    // and hard-coding it here would red the parse on a dependency bump that
    // legitimately adds a host. The floor catches the failure mode that
    // actually occurs (a truncated or partial vendor report) while letting
    // the catalogue grow. The app's own gate asserts the exact set by name.
    hosts: z
      .array(compatHostSchema)
      .min(CATALOGUE_HOST_FLOOR, {
        message: `a compat capture must name at least ${String(CATALOGUE_HOST_FLOOR)} hosts — fewer means the vendor reported a partial catalogue, which has no verdict semantics`,
      })
      .refine((hosts) => new Set(hosts.map((host) => host.hostId)).size === hosts.length, {
        message: 'a compat capture must not name the same host twice',
      }),
  })
  .strict();

export type CompatReport = z.infer<typeof compatReportSchema>;
