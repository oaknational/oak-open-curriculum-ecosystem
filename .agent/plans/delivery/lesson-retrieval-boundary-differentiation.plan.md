---
id: lesson-retrieval-boundary-differentiation
node_type: delivery
name: "Lesson-retrieval Bucket 2 — boundary differentiation"
overview: "At the retrieval boundary, tell unknown from restricted from present-but-unretrievable, and catch listing-vs-retrieval drift on a schedule."
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
    kind: blocking
owner_gates: []
last_updated: 2026-08-12
---

# Lesson-retrieval Bucket 2 — boundary differentiation

> Follow-on future plan (owner-authorised 2026-08-12: "follow-on future plans
> for buckets 2 and 3"). Sketch — carries the intent and the mechanism; its
> remaining decisions (named below) are resolved by the picking-up seat at
> ratification. The authoritative source is
> `.agent/reports/mcp-lesson-retrieval-gap-analysis-2026-08-12.md` §"Bucket 2".

## Goal

When a lesson cannot be retrieved, an integrator can mechanically tell **which**
of three cases they are in — the slug is unknown, the lesson exists but is
copyright-restricted, or the lesson exists in the catalogue but is not
retrievable through this surface — from the error alone, without guessing. And a
scheduled coherence probe catches a listing-serves-it / retrieval-cannot
divergence within a day, instead of an external integrator being the detector
(the era-2 subject-gate collateral went unnoticed until one reported it).

## Mechanism

Two moves, both on surfaces we own:

- **`fetch` 404 enrichment via the `check-restricted` oracle.** Upstream's
  summary 404 is byte-identical for unknown, restricted, and subject-gated
  slugs (the deliberate anti-leak policy — status conflated, differentiated only
  by message, and only fully on `/assets`). On a summary 404, one oracle call
  plus a catalogue/listing presence check differentiates: **restricted** →
  structured `CONTENT_NOT_AVAILABLE` carrying the honest explanation and the
  lesson's `oakUrl` (the website serves it); **present-but-unretrievable-here**
  (in listings / our index, ogl-compatible) → a self-describing
  contradiction signal; **absent everywhere** → true not-found. `fetch` is our
  constructed `aggregated-fetch` tool, fully ours to build. This is inference
  from extra calls, never upstream truth — a known and accepted limit.
- **A coherence canary.** A scheduled probe asserting the invariant: every slug
  the listing endpoint serves is either fetchable or carries a machine-readable
  unavailability reason. The `probe-lesson-availability` script is its seed; the
  effort is the scheduled home and the alert routing, not the probe logic.

Sequenced after Bucket 1's error envelope so the enrichment lands as **structure,
not prose** — that ordering is why this depends `blocking` on
`lesson-search-freshness-and-error-envelope`. The block is NARROW, though: the
oracle call, the catalogue-presence check, and the `oakUrl` lookup are all
independent of Bucket 1 — only the final structured emission needs the envelope,
so most of the build could begin before Bucket 1 lands if a scheduler ever wanted
it.

## Acceptance criteria (each with a proof — required)

- `fetch` returns three mechanically-distinct structured results for the three
  404 sub-cases (unknown / restricted / present-but-unretrievable). **Proof
  (`repo-safe`):** an integration test over one lesson of each class — available,
  restricted, unknown — asserting distinct `code`s and the presence of `oakUrl`
  on the restricted case; the `probe-lesson-availability` script demonstrates the
  three classes in one run.
- The restricted case explains unavailability and points at the website; it
  never serves restricted content. **Proof (`repo-safe`):** a test asserting the
  restricted result carries the explanation + `oakUrl` and no lesson body.
- The coherence canary asserts the listing-vs-retrieval invariant and raises an
  alert on divergence. **Proof:** the assertion logic is `repo-safe` (a test over
  a synthetic listing/retrieval mismatch); the scheduled run + alert delivery is
  `owner-held` (named home and routing target, verified in that console).

## Todos (optional; proofs on todos optional)

- `fetch` 404 enrichment in `aggregated-fetch` — one PR (default ≤2 rounds).
- Coherence canary: promote the probe script to a scheduled assertion + alert —
  one PR for the assertion, its scheduled home routed with the owner.

## Out of scope

- The index rebuild and the error envelope — Bucket 1
  (`lesson-search-freshness-and-error-envelope`); this plan consumes that
  envelope, it does not build it.
- Automatic index updates — Bucket 3 (`lesson-search-index-automation`).
- Any upstream/API change (the transcript-500 and quiz-silent-empty unknown-slug
  defects, message-differentiation restoration, spec vocabulary enumeration):
  backlogged for when the API code moves into the repo — held as
  questions-with-evidence in the analysis report §"What should change in the
  API", per owner ruling 2026-08-12 (note + discoverable + backlog).
- Serving restricted content under any fallback — an inherent limit; the layer
  explains unavailability and points at the website, never substitutes.

## Open decisions (resolved by the picking-up seat at ratification)

- The coherence canary's scheduled home and alert-routing target (an infra/owner
  decision — where it runs, who it pages). At ratification this converts to an
  actual `owner_gate` (scheduled-home + routing) — flag it so it is not lost when
  the sketch is promoted. Likely shares infra with Bucket 3's pipeline (below), so
  surface the two scheduled homes to the owner as ONE infra decision.
- The "present in the catalogue" check's authoritative source (our search index
  vs the live listing endpoint) — a one-call cost either way; pick the cheaper
  reliable one at pickup.
