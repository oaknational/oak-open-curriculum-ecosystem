---
id: boot-failure-observability
node_type: delivery
name: 'Diagnosis: boot failures reach Sentry, and configuration guards name what failed'
overview: 'Report configuration failures that occur before observability is constructed, under a bounded reporter contract that preserves the privacy posture, and make the pseudonym-keyring guard name which check failed.'
status: sketch
serves: first-major-release
impact_areas:
  - analytics-and-observability
tickets:
  - MCP-480
depends_on: []
owner_gates: []
last_updated: 2026-08-11
---

# Diagnosis: boot failures reach Sentry

## Goal

When the server refuses to start, the refusal arrives where someone
will see it, carrying enough detail to act on — without ever carrying
the offending value.

## Problem

Two failures, one boundary.

**Unreportable by construction.** `loadConfiguredApp` resolves the
runtime config before constructing observability, and Sentry is built
*from* that config. A configuration failure therefore throws before any
Sentry client exists. Incident evidence on MCP-480 shows the ordinary
error pipe works while boot failures remain upstream of it.

**Under-informative.** The environment validator's message is
exemplary: it names the failing key, the rule, and where to fix it. The
analytics resolver's is `invalid PostHog product-analytics
configuration: pseudonym keyring failed strict validation`, which does
not distinguish JSON parsing, strict shape, base64url canonicality, or
uniqueness. Content-free was a deliberate secret-safety choice and the
caution is right, but it overshot: the same boundary now carries two
diagnostic doctrines, and the opaque one's diagnosis cost is recorded
on MCP-480.

Fail-fast itself is correct and stays — booting without valid
pseudonymisation configuration would be a privacy defect, not a
degraded mode.

## Mechanism

**1. Bootstrap reporter, under a bounded contract.** The following clauses
are the deliverable because this sits inside the ADR-218 privacy posture:

- activates only from Sentry inputs that parse strictly under the
  shared `SentryEnvSchema` (`@oaknational/env`) with live mode
  selected; `off` and `fixture` modes remain authoritative and make no
  network call, and on inputs the schema rejects the reporter stays
  silent — no activation, no network call, no new failure;
- sanitises through the shared redaction barrier, with no bypass path;
- never includes the invalid value, only the guard that rejected it;
- makes one capture attempt and allows at most **500 ms** for flush
  before `boundaryError` rethrows; there is no retry on the boot-failure
  path;
- failure, rejection, or timeout in reporter initialisation, capture,
  or flush never masks the original boundary error. The reporter may
  delay rethrow only within the 500 ms deadline.

**Build-vs-buy.** The implementation extends the shared
`@oaknational/sentry-node` boundary and its existing Sentry SDK adapter,
redaction hooks, capture, and `flush(timeoutMs)` primitives. The app does
not initialise `@sentry/node` directly or create a parallel redaction
policy. The missing product capability is the pre-runtime bootstrap
composition under the bounded contract above; it is a thin shared-library
seam, not a second observability stack.

The activation axis is stated against the surface as it exists. This
app still resolves the shared `SentryEnvSchema` and gates delivery on
`SENTRY_MODE` (`off` / `fixture` / `sentry`); the ADR-171 orthogonal
axes (`OBSERVABILITY_SINKS` typed list, fixture as an orthogonal tee)
are the recorded successor shape, and the app's migration to them is
named implementation debt in its `docs/observability.md`. The migration
edge for this reporter is declared here: when the app adopts the axes,
"live mode selected" restates as "the `sentry` sink selected", the
fixture tee stays no-network, and the redaction barrier remains
unconditional on both shapes.

**2. Guards name the guard.** The keyring resolver reports which check
failed plus shape facts — entry count, id pattern match, key length,
canonical-decode result — and never the value. Governing rule for the
estate: **name the guard, never the value.**

## Acceptance criteria

1. A configuration failure produces a Sentry error naming the failing
   key — proof: **repo-safe**, an integration test driving the boot
   boundary with an invalid environment against a recording fake
   reporter, asserting the captured event's content.
2. `off` and `fixture` modes make no network call from the bootstrap
   reporter — proof: **repo-safe**, the same suite asserting zero
   transport interactions in those modes (the mode axis as the app
   implements it today; the declared migration edge restates this
   criterion on the ADR-171 axes when the app migrates).
3. No captured event contains the offending value and the shared
   ADR-160 barrier remains the only sanitiser — proof: **repo-safe**, a
   consuming-workspace integration test sending a known canary through
   the bootstrap reporter and asserting the post-redaction recording
   fake contains the redaction marker and not the canary bytes.
4. Capture is attempted without making boot refusal unbounded — proof:
   **repo-safe**, fake-clock tests covering successful flush, reporter
   initialisation failure, capture failure, flush rejection, and a flush
   that never settles. Every arm propagates the original boundary error
   unchanged and the hanging arm crosses no more than the 500 ms deadline.
5. The keyring guard names which check failed — proof: **repo-safe**,
   unit tests over each guard arm (parse, shape, canonicality,
   uniqueness) asserting the distinguishing message and shape facts.
6. The end-to-end path and destination redaction work on a deployed
   surface — proof: **owner-held**, a deliberately invalid preview
   environment producing a Sentry error naming the key, plus a synthetic
   bootstrap canary observed redacted at the destination with its raw
   bytes absent; verifier the lane agent, evidence recorded on MCP-480.
7. Invalid Sentry inputs leave the reporter silent — proof:
   **repo-safe**, tests driving the boot boundary with Sentry inputs
   that fail `SentryEnvSchema` and asserting no activation, zero
   transport interactions, and the original boundary error propagating
   unchanged.

## Out of scope

- **Making boot failures non-fatal.** Fail-fast stays. Booting without
  valid pseudonymisation configuration would be a privacy defect, not a
  degraded mode, so this node changes only what the refusal *reports* —
  never whether it refuses.
- **Reporting the offending value.** The reporter names the failing
  key, the rule it broke, and where to fix it. It never carries the
  value, and the ADR-160 redaction conformance proof is the criterion
  that keeps that true rather than merely intended.
- **Widening the reportable surface.** Only configuration failures
  occurring *after* valid bootstrap Sentry inputs exist are reportable.
  A failure earlier than that has nothing to report through, and
  pretending otherwise would add a second silent path.
- **Rewriting the environment validator's messages.** They are already
  exemplary; this node raises the analytics resolver to their standard
  rather than changing the standard.
- **Detection or alerting.** Getting the refusal into Sentry is this
  node; noticing it and interrupting someone belongs to
  [`production-liveness-detection`](production-liveness-detection.plan.md).

## Relationship to the sibling nodes

Diagnosis arm. Siblings:
[`deploy-config-fails-the-build`](deploy-config-fails-the-build.plan.md),
[`production-liveness-detection`](production-liveness-detection.plan.md).
Detection tells you production is down; this node is what tells you
why. The shipped recovery arm is preserved in the archived
`release-redeploy-recovery` record.

*Authored by Birch holds Seedling (e48fe2, agent), 2026-08-03. Amended
2026-08-09 per the adjudicated 2026-08-05 eleven-expert review
(`deploy-reliability-corpus-amendment`, rows 20–23; row 23 records the
bounded-reporter design verified sound, with the evidence to be cited
at execution pickup).*
