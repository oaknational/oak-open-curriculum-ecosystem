---
id: lesson-search-freshness-and-error-envelope
node_type: delivery
name: "Lesson-retrieval Bucket 1 — index freshness + error envelope"
overview: "Rebuild search from the fresh bundle with a documented restricted-exclusion switch, and carry structured, contract-pinned errors through the MCP envelope."
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-08-12
ratified_where: "Owner decision card 2026-08-12 (Wren calls Downdraft session 6b29b5): 'Ratify Bucket 1 only'; recorded in .agent/memory/operational/threads/upstream-api-alignment.next-session.md"
serves: first-major-release
impact_areas:
  - served-surface
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-12
---

# Lesson-retrieval Bucket 1 — index freshness + error envelope

> Decision-complete, for a seat (TBD) to pick up nowish (owner instruction
> 2026-08-12). Every policy decision it needs is already ruled — there are no
> open owner gates. Source: `.agent/reports/mcp-lesson-retrieval-gap-analysis-2026-08-12.md`
> §"Bucket 1"; machinery verified first-hand 2026-08-12 (paths below are current
> on the primary checkout).

## Goal

Search stops silently dropping lessons the catalogue lists. The index is rebuilt
from the fresh 2026-08-12 bulk bundle — restoring the ogl-compatible corpus and
the new `rshe-pshe` subject — and the restricted-exclusion policy becomes a
single **documented, configurable switch (default: exclude)** instead of a
hardcoded, implicit filter, so the choice is honest and cheap to revisit. And
every MCP tool error carries machine-discriminable **structure** —
`{code, message, upstreamMessage}` — instead of a flattened prose string, so an
integrator can tell an unknown slug from a copyright-restricted lesson from a
generic upstream failure mechanically. The estate stops losing information it
already has.

## Mechanism

Three coordinated moves, each reusing machinery that already exists:

1. **Rebuild from the fresh bundle** through the existing blue/green lifecycle.
   `apps/oak-search-cli` `admin versioned-ingest` (create → ingest → verify →
   alias-swap → cleanup; the swap lives in
   `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts`), or the
   two-step `admin stage` → `admin promote --target-version <v>`, run against
   `apps/oak-search-cli/bulk-downloads/` (manifest `downloadedAt`
   2026-08-12T10:50Z, restricted flags present). This restores freshness and is
   the falsifier for the unproven 2026-07-27 restricted-class drop.

2. **Make the restricted-exclusion policy a documented, configurable switch,
   default exclude** (owner ruling 2026-08-12: keep restricted out for now,
   configurable, documented). Today the exclusion is HARDCODED and unconditional
   in `packages/sdks/oak-sdk-codegen/src/bulk/restricted-lesson-filter.ts`
   (`excludeRestrictedLessons` / `excludeRestrictedLessonsFromFile`, no
   parameter), called at the TWO exclusion sites
   `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts:136` and
   `packages/sdks/oak-sdk-codegen/vocab-gen/vocab-gen.ts:176`; the `admin verify`
   expected-count is DERIVED downstream of the ingest filter
   (`run-versioned-ingest.ts:78-79`), so it tracks the switch automatically (no
   third edit — confirm that tracking holds). Introduce one switch — a parameter
   on the SDK filter, surfaced as a documented flag on the ingest command
   (mirroring the existing `--bulk-dir` / `--subject-filter` options) so
   revisiting is a config change, not a code edit — that both exclusion sites read
   consistently; **default reproduces today's behaviour byte-for-byte**. Record
   the choice in a short ADR (ingest-strategy neighbours ADR-093 / ADR-140), NOT
   the stale `INGESTION-GUIDE.md`; document the follow-on
   cost of flipping it (see Out of scope): restricted rows are dropped before any
   document is built, so *including* them additionally requires threading the
   `restricted` flag through the lesson-document builder — that work is named,
   not done here.

3. **Preserve error structure through the envelope, and contract-pin the
   vocabulary.** The SDK already classifies upstream errors
   (`packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts` →
   `McpToolError {code, message, cause}`; codes `RESOURCE_NOT_FOUND`,
   `CONTENT_NOT_AVAILABLE`, `AUTHENTICATION_REQUIRED`, `UPSTREAM_API_ERROR`,
   `UPSTREAM_SERVER_ERROR`). The `code` is then DROPPED at `formatError`
   (`universal-tool-shared.ts:107`), which emits only `{content:[text],
   isError:true}`. Carry `{code, message, upstreamMessage}` in the
   `structuredContent` channel — which the SDK (1.30.0) already populates on the
   *success* path — by changing `formatError` and its two callers
   (`universal-tools/executor.ts:55`; `aggregated-fetch/execution.ts:112`).
   Classification is transport, never correction: generated pass-through tools
   stay faithful. Then pin the upstream vocabulary: the copyright signal today is
   a single brittle `data.cause.includes('blocked')` match
   (`classify-error-response.ts:83`) that no test exercises against real upstream
   wording — a contract test reddens on drift, with `upstreamMessage` carried
   verbatim.

## Acceptance criteria (each with a proof — required)

- **Search serves the fresh, restricted-excluded corpus.** A rebuild from the
  2026-08-12 bundle produces an index whose document count reconciles against the
  declared inclusion policy (restricted excluded). **Proof:** `repo-safe` —
  `admin verify` reconciliation (expected-vs-indexed count) passes on the staged
  index (this proves ingest dropped nothing it was fed under policy — NOT subject
  presence); `owner-held` — the promoted alias serves the fresh corpus AND the
  `rshe-pshe` subject is present in results, confirmed via an actual search
  request filtered to `rshe-pshe` against the promoted alias (the CLI's own
  search command) and recorded on the pickup ticket (the MCP-153 owner-carded
  promotion precedent; `es:status` counts and the availability probe do not
  prove result presence — amendment 2026-08-13, fold #872 review). Confirm at pickup whether `rshe-pshe`
  is genuinely new in the 2026-08-12 bundle or was already promoted (the
  2026-07-27 lane recorded `rshe-pshe` live) — either way this is a presence
  check, not a count claim.
- **The restricted-exclusion policy is one documented switch, default exclude,
  behaviour-preserving at default.** **Proof:** `repo-safe` — a test asserting the
  switch defaults to exclude and that toggling it changes inclusion, with the
  existing `restricted-lesson-exclusion.integration.test.ts` still green at
  default; the choice and its revisit cost are documented in the ingest docs.
- **Every MCP tool error result carries `{code, message, upstreamMessage}` as
  structured content.** Bucket 1 preserves the emitted error classes without
  prose parsing; it does NOT distinguish a restricted lesson from an unknown
  slug where upstream emits the identical 404 (the `/summary` ambiguity) —
  that oracle-based distinction is Bucket 2's (amendment 2026-08-13, fold
  #872 review: boundary stated explicitly; wording only, scope unchanged). **Proof:** `repo-safe` — a test over each error class
  (`RESOURCE_NOT_FOUND` / `CONTENT_NOT_AVAILABLE` / `AUTHENTICATION_REQUIRED` /
  `UPSTREAM_*`) asserting the structured fields on both the generated
  pass-through path and the `fetch` path.
- **The upstream error vocabulary is contract-pinned.** **Proof:** `repo-safe` —
  a test that reddens if the `blocked`-cause copyright vocabulary drifts (i.e.
  would silently reclassify `CONTENT_NOT_AVAILABLE` to `UPSTREAM_API_ERROR`), with
  `upstreamMessage` carried verbatim through the envelope.

## Todos (optional; proofs on todos optional)

- **Configurable restricted-exclusion switch** (default exclude) reaching the SDK
  filter + the two exclusion call sites (the `admin verify` expected-count is
  derived, not a third), with the pinning test
  (`restricted-lesson-exclusion.integration.test.ts`) updated and the choice
  recorded in the ADR. One PR (default ≤2 rounds).
- **Rebuild + promote** from the fresh bundle via the blue/green lifecycle;
  stage → verify (reconciliation green) → promote. One operational slice against
  the existing command surface (NOT the stale `INGESTION-GUIDE.md`; use the
  `versioned-ingest` / `stage`+`promote` command source).
- **Structured error envelope**: `formatError` + its two callers carry
  `{code, message, upstreamMessage}` via `structuredContent`. One PR.
- **Error-vocabulary contract test** — rides with the envelope PR or a small
  standalone PR.

## Out of scope

- **Including restricted lessons' metadata now** — the owner ruled exclude-for-now
  (2026-08-12); the switch makes it cheap to revisit. Its follow-on (threading
  `restricted` through the lesson-document builder so included lessons are marked
  in results) is *named* so the revisit cost is honest, but not built here.
- **`fetch` 404 oracle enrichment and the coherence canary** — Bucket 2
  (`lesson-retrieval-boundary-differentiation`), which consumes this plan's error
  envelope.
- **Automatic index updates, the scheduled reconciliation gate, and the vintage
  stamp** — Bucket 3 (`lesson-search-index-automation`); this plan's rebuild is
  the manual interim it subsumes.
- **A degraded-summary fallback** — dropped by owner ruling 2026-08-12 (no
  fallback ever; the layer explains unavailability and points at the website).
- **Any upstream/API change** (the transcript-500 and quiz-silent-empty
  unknown-slug defects, the KS4-science summary collateral, message
  differentiation, spec enumeration, the OWA/Hasura view-history question):
  backlogged for when the API code moves into the repo — held as
  questions-with-evidence in the analysis report §"What should change in the API"
  (owner ruling: note + discoverable + backlog).
- **Full truing of the stale `INGESTION-GUIDE.md` runbook** — a discovered issue
  (it documents an `es:ingest --api --subject --key-stage --all` interface the
  current `versioned-ingest` no longer has). This plan records the
  inclusion-policy switch in a short ADR (above) but does not re-true the whole
  runbook; named here so the staleness is not lost.

## First-principles / readiness notes

- **No open owner gates.** Every policy decision is already ruled
  (exclude/configurable/documented; no fallback; API items backlogged), which is
  what makes this plan decision-complete rather than gated.
- **Build-vs-buy:** no vendor integration — all three moves parameterise or
  re-route existing first-party machinery (the blue/green lifecycle, the SDK
  filter, the SDK's own `structuredContent` success-path channel).
- **`plan-body-first-principles-check` fires** on the switch shape (a parameter
  on an existing pure function, not a new config system), the envelope (reuse of
  the existing structured channel, no new plumbing), and the small-PR landing
  path above.
- **One pickup-verification grounds AC3/AC4 (not an owner gate):** confirm that
  the MCP SDK 1.30.0 transport carries `structuredContent` through on an
  `isError: true` result AND that target clients read it on error results (some
  ignore `structuredContent` when `isError` is set). The success path already
  uses the channel; the error path does not — so this is the one load-bearing
  technical unknown, settled by a probe at pickup before committing the shape.
- **Nearest neighbour** for the envelope work:
  `mcp-output-schemas-response-validation` (structured MCP responses). The
  `{code, message, upstreamMessage}` triple is the target CONTRACT; its exact
  serialization (field names, any `outputSchema`) aligns to that neighbour's
  conventions at pickup — the triple is the intent, not a bikeshed to reopen.
