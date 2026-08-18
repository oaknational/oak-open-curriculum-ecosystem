---
id: lesson-search-index-automation
node_type: delivery
name: "Lesson-retrieval Bucket 3 — self-maintaining index freshness"
overview: "Make search-index freshness self-maintaining: scheduled ingest with a reconciliation gate that refuses unexplained shrinkage, and an observable source-snapshot vintage."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - served-surface
tickets: []
depends_on:
  - plan: lesson-search-freshness-and-error-envelope
    kind: beneficial
owner_gates: []
last_updated: 2026-08-12
---

# Lesson-retrieval Bucket 3 — self-maintaining index freshness

> Follow-on future plan (owner-authorised 2026-08-12: "follow-on future plans
> for buckets 2 and 3"). Sketch — this is the deliberately-scheduled structural
> investment; its cadence and thresholds (named below) are owner/infra decisions
> resolved at ratification. Source:
> `.agent/reports/mcp-lesson-retrieval-gap-analysis-2026-08-12.md` §"Bucket 3".

## Goal

Search-index freshness stops depending on someone remembering to rebuild it. A
scheduled pipeline downloads, ingests, and alias-swaps the bulk bundle; a
reconciliation gate refuses a swap that would drop lessons the declared inclusion
policy says should be present; and every index and search response carries its
source-snapshot vintage, so staleness is **observable** rather than silent. This
is the owner-named infrastructure gap behind the whole lesson-retrieval finding —
it makes Bucket 1's manual rebuild the interim, not the steady, state.

## Mechanism

- **Scheduled download → ingest → alias-swap** of the bulk bundle — the same
  machinery Bucket 1 exercises by hand, put on a schedule.
- **A reconciliation gate.** Before the alias swaps, recompute expected-vs-indexed
  counts against the **declared inclusion policy** (the configurable
  restricted-inclusion switch Bucket 1 introduces) and refuse an unexplained
  shrinkage — so a stale or partial bundle can never silently shrink what search
  serves (the 2026-07-27 drop this whole lane traced back to). The dependency on
  Bucket 1 is `beneficial`, not blocking: if this lands first, the gate reads
  today's HARDCODED exclusion as its policy source instead — the switch becomes
  the policy source only once it exists.
- **Vintage stamp.** Index metadata and search responses carry the
  source-snapshot vintage (`manifest.downloadedAt`) so a consumer — and the
  estate — can see how fresh the served corpus is.

The degraded-summary fallback that an earlier analysis floated as a Bucket-3
candidate is **not in this plan**: the owner ruled 2026-08-12 that there is no
fallback — the layer explains unavailability and points at the website, and never
serves a substitute. Serving what upstream deliberately withholds would be a
licensing violation; the reconciliation gate and the vintage stamp carry the
freshness guarantee instead.

## Acceptance criteria (each with a proof — required)

- The pipeline runs on a schedule and swaps the alias **only** when the
  reconciliation gate passes. **Proof:** the gate logic is `repo-safe` (a test
  driving a passing and a failing reconciliation); the scheduled run is
  `owner-held` (the named schedule + its console, verified there).
- An unexplained shrinkage against the inclusion policy **refuses** the swap.
  **Proof (`repo-safe`):** a test feeding a synthetic under-count and asserting
  the swap is refused and surfaced, not silently applied.
- Every search response carries the source-snapshot vintage. **Proof
  (`repo-safe`):** a response-shape test asserting `manifest.downloadedAt` (or its
  chosen field) is present and matches the served snapshot.

## Todos (optional; proofs on todos optional)

- The reconciliation gate as a standalone, tested function over
  (bundle-expected, index-actual, inclusion-policy) — one PR.
- The vintage stamp through ingest → index metadata → search response — one PR.
- The scheduled pipeline home + its wiring — one PR, its schedule/home routed
  with the owner.

## Out of scope

- The degraded-summary fallback — dropped by owner ruling 2026-08-12 (no
  fallback ever); the freshness guarantee is carried by the gate + vintage stamp,
  not by substitution.
- The manual rebuild and the error envelope — Bucket 1; boundary differentiation
  — Bucket 2.
- Real-time index updates — an inherent limit: a snapshot-backed index's
  staleness is bounded by refresh cadence (the bulk-freshness contract's window),
  never eliminated, absent upstream change events.
- Any upstream/API change — backlogged for when the API code moves into the repo.

## Open decisions (resolved by the picking-up seat at ratification)

- The refresh cadence and the pipeline's scheduled home (owner/infra) — likely
  shares infra with Bucket 2's coherence canary, so surface the two scheduled
  homes to the owner as ONE infra decision, not two.
- The reconciliation gate's shrinkage tolerance — how much movement is
  "explained" by normal upstream churn vs a drop that must refuse the swap.
