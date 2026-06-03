---
plan_id: school-data-search-poc
title: 'School Data Search POC MVP — in-repo build'
type: executable
status: queued
lifecycle: current
last_updated: 2026-06-03
evidence_source: '../../../reports/school-data-search-synthesis-report-2026-06-03.md'
thread: school-data-search
todos:
  - id: g1-contract-layer
    content: 'Gate G-1 (owner): contract-layer source of truth — F-A / F-B / F-C — and ratify the produced-spec ADR'
    status: pending
  - id: g2-runtime-topology
    content: 'Gate G-2 (owner): app runtime framework (D-16) + Vercel project topology, preview safety, cron mechanics'
    status: pending
  - id: g3-canonical-model
    content: 'Gate G-3 (owner): canonical enums and model shapes (status, type, phase, name-variants, release naming, inspection)'
    status: pending
  - id: g4-storage-retention
    content: 'Gate G-4 (owner): snapshot substrate, snapshot retention, change-event retention, quarantine posture'
    status: pending
  - id: g5-auth-mechanics
    content: 'Gate G-5 (owner): admin-token rotation mechanism, token format, cursor integrity, rate-limiting posture'
    status: pending
  - id: g6-sources-composition
    content: 'Gate G-6 (owner): Scotland source composition, NI coordinates path, Wales closed-school launch posture'
    status: pending
  - id: g7-search-mechanics
    content: 'Gate G-7 (owner): ranking mechanism, normalisation locus, metadata/detail cache headers'
    status: pending
  - id: ws-d1-decomposition
    content: 'WS-D1: workspace decomposition proposal (seam map, Drizzle ownership, boundary rules) for G-8 ratification'
    status: pending
    depends_on: [g2-runtime-topology]
  - id: g8-decomposition-ratify
    content: 'Gate G-8 (owner): ratify the workspace decomposition proposal'
    status: pending
    depends_on: [ws-d1-decomposition]
  - id: g9-publishing
    content: 'Gate G-9 (owner): client-package publishing posture — no npm publish without explicit owner direction'
    status: pending
  - id: ws1-contract-canon
    content: 'WS1: contract canon + generated surfaces per G-1 (spec serving, CI 3.x validation, client workspace unpublished)'
    status: pending
    depends_on: [g1-contract-layer, g8-decomposition-ratify]
  - id: ws2-canonical-model
    content: 'WS2: canonical model + per-source mapping tables (fail-until-mapped; V-12)'
    status: pending
    depends_on: [g3-canonical-model, g8-decomposition-ratify]
  - id: ws3-ingestion-framework
    content: 'WS3: ingestion framework (fetch, checksum, redacted snapshots, import-run state machine, advisory lock, idempotency)'
    status: pending
    depends_on: [g4-storage-retention, g8-decomposition-ratify]
  - id: ws4-nation-adapters
    content: 'WS4: nation adapters England/Wales/Scotland/NI with fixtures incl. forbidden-field rows (V-01..V-07, V-09, V-10)'
    status: pending
    depends_on: [g6-sources-composition, ws2-canonical-model, ws3-ingestion-framework]
  - id: ws5-release-promotion
    content: 'WS5: dataset versioning, whole-dataset promotion, change events, stale-serving proofs'
    status: pending
    depends_on: [ws2-canonical-model, ws3-ingestion-framework]
  - id: ws6-search
    content: 'WS6: search documents, deterministic ranking, cursors, autocomplete per G-7'
    status: pending
    depends_on: [g7-search-mechanics, ws5-release-promotion]
  - id: ws7-api-auth
    content: 'WS7: API routes, bearer/admin auth per G-5, cache headers, spec surface integration'
    status: pending
    depends_on: [g5-auth-mechanics, g7-search-mechanics, ws1-contract-canon, ws5-release-promotion]
  - id: ws8-cron-preview-safety
    content: 'WS8: DST-safe cron + tested preview-safety guards + admin workflows'
    status: pending
    depends_on: [g2-runtime-topology, ws7-api-auth]
  - id: ws9-observability
    content: 'WS9: OTEL wiring via repo observability package, Slack alerts, scrubber proofs'
    status: pending
    depends_on: [ws7-api-auth]
  - id: ws10-docs-runbook
    content: 'WS10: workspace READMEs, data-sources/licensing/attribution doc, runbook, TSDoc audit'
    status: pending
    depends_on: [ws4-nation-adapters, ws6-search, ws8-cron-preview-safety, ws9-observability]
  - id: poc-go-no-go
    content: 'POC go/no-go evidence pack assembled for the owner extraction decision'
    status: pending
    depends_on: [ws10-docs-runbook]
---

# School Data Search POC MVP — In-Repo Build

**Status**: queued (`current/`). Promotion to `active/` happens when gates
G-1, G-2, G-3, and G-8 are decided and the first build workstream starts.

**Evidence authority**: the
[synthesis report](../../../reports/school-data-search-synthesis-report-2026-06-03.md)
(2026-06-03) — convergent foundation (§3), divergence matrix (§4), collision
ledger (§5), OpenAPI inversion analysis (§6), build-time verification ledger
(§7). This plan does not restate the evidence; it sequences the work and
carries the decisions as explicit owner gates. Architectural decisions
ratified at the gates land as ADRs; ADRs are the architectural source of
truth and outlive this plan.

**Owner requirements (override layer, quoted in report §2)**: (1) the POC
MVP builds IN THIS repo and is not extracted until POC completion and a
go/no-go decision; (2) ALL APIs MUST surface a strict, comprehensive
OpenAPI specification fully compliant with the latest OpenAPI 3.x
specification.

## End goal, mechanism, means (PDR-018)

- **End goal**: Oak server-side applications can search and retrieve a
  canonical, provenance-carrying, privacy-conservative dataset of UK
  schools (England, Wales, Scotland, Northern Ireland, GIAS-hosted
  overseas) through an authenticated REST API with a typed client — proven
  as an in-repo POC carrying enough evidence for an owner go/no-go on
  taking the service forward.
- **Mechanism**: official-register ingestion with hard-fail validation and
  whole-dataset promotion guarantees a coherent always-serveable dataset;
  Postgres-native deterministic search serves the lookup need at UK-school
  scale without new search infrastructure; an OpenAPI-canonical contract
  layer keeps API, validation, types, and client in provable agreement.
- **Means**: the gate set G-1…G-9 (owner decisions), then build
  workstreams WS1–WS10 as TDD cycles, each with acceptance criteria and
  deterministic validation, closing with a go/no-go evidence pack.

## Non-goals

Carried from the convergent brief non-goals (report §3) plus the POC
boundary:

- No public unauthenticated API; no browser/client-side production access.
- No front-end admin UI; no user-auth (Clerk) flows; no React/RSC package.
- No Elasticsearch (the export seam is kept clean; adoption is a later
  decision); no postcode-radius search; no updated-since endpoint; no
  manual record overrides.
- No storage or exposure of phone, email, headteacher/named-contact,
  admissions-policy, parliamentary-constituency, or
  protected-characteristic fields; no closed-licence data; no IP logging.
- No standalone MOD/DCS overseas ingestion (GIAS-hosted records only).
- No extraction to a separate repository during the POC (owner
  requirement 1); no npm publishing without G-9.
- This plan does not retrofit OpenAPI requirements onto existing repo
  surfaces; the G-1 gate records the owner's scope reading (report §6
  scope note).

## Phase 0 — Owner decision gates

The report carries the considerations; each gate names the decision, its
report source, and what it unblocks. Gates are decided in an owner session
walking the report (any order within a bundle; the blocking structure is
explicit below). Per PDR-058 there are no bare deferrals: every fork is
either decided at its gate or carries its named trigger here.

| Gate | Decision | Report source | Unblocks |
| --- | --- | --- | --- |
| G-1 | Contract-layer source of truth: F-A spec-first / F-B code-first / F-C shared-definition codegen; ratify the produced-spec ADR; clarify the "ALL APIs" scope reading (repo-wide policy or this service only — changes the ADR's scope, not this service's obligation) | §6, §5 C-03, C-05 (client error surface), §7 V-11 | WS1, WS7 |
| G-2 | App runtime framework (Next.js vs established in-repo pattern) + Vercel project topology + preview-safety posture + cron mechanics | §4 D-16, D-06; §5 C-08 | WS-D1 finalisation, WS7, WS8, app-workspace scaffolding |
| G-3 | Canonical status / establishment-type / phase enums; name-variant modelling; release-model naming; inspection modelling | §4 D-01, D-02, D-03, D-11, D-12, D-15 | WS2 |
| G-4 | Snapshot substrate + retention; change-event retention; unredacted-quarantine posture (B1-only option) | §4 D-04 | WS3 |
| G-5 | Admin-token rotation mechanism; token format; cursor integrity; rate-limiting posture | §4 D-05, D-10; §5 C-09 | WS7 |
| G-6 | Scotland source composition; NI coordinates path; Wales closed-school launch posture | §4 D-07, D-08; §7 V-04 | WS4 (per nation) |
| G-7 | Ranking mechanism; normalisation locus; metadata/detail cache headers | §4 D-13, D-14, D-09 | WS6, WS7 (headers) |
| G-8 | Ratify the WS-D1 workspace decomposition proposal | §5 C-02 | All workspace scaffolding |
| G-9 | Client-package publishing posture | §5 C-07 | Any `npm publish` (never before this gate) |

Blocking structure: G-1, G-2, G-3, G-8 block all build workstreams
(contract canon, runtime, model, and workspace shape are foundations).
G-4 blocks WS3; G-5 blocks WS7; G-6 blocks WS4; G-7 blocks WS6. G-9 blocks
publishing only — the client workspace builds unpublished regardless.

### WS-D1 — Workspace decomposition proposal (input to G-8)

Produce the concrete decomposition proposal the owner ratifies at G-8,
applying report §5 C-02:

- Seam candidates: ingestion framework vs Oak-source consumers; canonical
  model + contracts; search; thin HTTP app (framework per G-2). Named
  future-extraction seams even if co-located at POC scale: token/auth
  subsystem; search-document builder (the Elasticsearch seam).
- Drizzle schema ownership: table definitions + migration runner live in
  the data-access layer; the model workspace stays free of runtime
  database dependencies.
- Boundary rules: enumerate the ADR-041 dependency-direction additions and
  the ESLint/depcruise rule-surface changes — these land in the first
  scaffolding cycle, BEFORE any new-workspace code.
- First Question applied: the minimum workspace count that preserves the
  layer doctrine at POC scale, with named extraction triggers for the
  deferred seams.

Acceptance: a written proposal (this collection) naming workspaces, their
dependency directions, the boundary-rule diff, and the deferred seams with
triggers. Reviewers: architecture-expert-betty (cohesion/coupling) and
architecture-expert-fred (ADR-041 compliance) before G-8.

## Phase 1 — Build workstreams (TDD cycles as the unit of landing)

Every workstream decomposes into TDD cycle-pairs at execution time (test +
product code in one commit; Red → Green → Refactor;
[tdd-phases](../../templates/components/tdd-phases.md)). The cycle lists
below are scope definitions, not exhaustive cycle enumerations — the
executing session derives cycles from the acceptance criteria
([session-discipline](../../templates/components/session-discipline.md):
template-not-contract). The briefs' build-then-test phase ordering is NOT
inherited (report §5 C-04).

### WS1 — Contract canon and generated surfaces (after G-1, G-8)

- Stand up the G-1 shape: the contract source of truth, generation
  pipeline, spec serving surface, and CI spec-quality gate (OpenAPI 3.x
  validation; strictness checks).
- Client package workspace builds and contract-tests against the canon —
  unpublished (G-9).
- Vendor toolchain shapes verified against installed/published docs at
  this WS (report §7 V-11; `verify-vendor-call-shapes-at-plan-author-time`).
- Acceptance: spec validates as OpenAPI 3.x in CI; API request/response
  validation, types, and client provably derive from the canon (drift is
  build-detectable); proof level: unit + integration.

### WS2 — Canonical model and mapping tables (after G-3)

- Canonical types per G-3; per-source mapping tables for status, type,
  phase; fail-until-mapped posture (unknown source value fails ingestion);
  V-12 verification (source vocabularies justify every canonical value).
- Canonical-ID generation (`${registerCountry}:${sourceSystem}:${sourceId}`);
  source-identifiers modelling; name-variant modelling per G-3.
- Acceptance: every canonical enum value reachable from at least one
  mapped source value; forbidden-field canonical mapping fails tests;
  proof level: unit.

### WS3 — Ingestion framework (after G-4, G-8)

- Fetch core (conditional headers, checksum, timeout, bounded retry on
  network/5xx/429 only), redaction-before-persistence, snapshot store per
  G-4, import-run state machine, global advisory lock, once-per-local-day
  idempotency.
- Framework/consumer split per WS-D1: the framework is source-agnostic;
  nation specifics live in WS4 adapters.
- Acceptance: redacted-snapshot invariant proven by fixtures containing
  forbidden fields (they never persist); unchanged-source short-circuit
  proven; re-run idempotency proven; proof level: unit + integration.

### WS4 — Nation adapters (after G-6; per-nation sub-workstreams)

- England/GIAS: V-01 (automated-fetch viability — named early milestone),
  V-02 (licence-string capture per snapshot), V-03 (inspection-field
  availability), V-09 (download route) verified here; BSO/offshore rows
  flow with `locationCountry` from address.
- Wales: address list + DataMapWales merge; V-04 (closed/independent
  coverage posture per G-6), V-07 (layer currency) verified here.
- Scotland: composition per G-6; V-06 (geospatial licence sign-off gate
  before any public display), V-10 (dataset vintage) verified here. V-06
  is a STOP-RULE, not a documentation item: Scotland coordinates from the
  geospatial layer must not reach any owner-visible display surface until
  the licence/attribution sign-off is recorded.
- Northern Ireland: Institution Search export automation (V-05 — named
  early milestone); enrolment/available-places enrichment; coordinates
  path per G-6.
- Every adapter ships fixtures: valid rows, closed/proposed/independent/
  special/PRU rows where the source supports them, malformed rows,
  duplicate-ID rows, unexpected-enum rows, and forbidden-field rows.
- Acceptance: each enabled source ingests to staging with hard-fail
  validation; per-source verification items recorded with evidence;
  proof level: unit + integration.

### WS5 — Release model and promotion (after WS2, WS3)

- Version-scoped staging, whole-dataset promotion in a single transaction,
  pointer/current-flag flip per G-3 naming, change events per G-4
  retention, row-count gates (>10% fail with explicit override; warn-band
  posture per report D-considerations).
- Acceptance: failed import provably leaves the previous dataset serving
  (the stale-serving proof is a named integration test); promotion is
  atomic; change events power import-run inspection; proof level:
  integration.

### WS6 — Search (after WS5; G-7)

- Search-document builder (the named Elasticsearch seam stays clean);
  ranking per G-7 with ground-truth fixtures (exact, prefix, alias, fuzzy,
  active-first, country-filter cases); ONE normalisation function applied
  identically at index and query time (locus per G-7); cursor pagination
  pinned to the promoted dataset version; autocomplete with capped minimal
  surface.
- Acceptance: deterministic ranking proven by fixtures; cursor coherence
  across promotion proven; proof level: unit + integration.

### WS7 — API surface and auth (after WS1, WS5; G-5)

- The convergent 10-route core (report §3.9) on the G-2 runtime; bearer
  auth with hashed tokens, constant-time verification, prefix-only
  logging, overlapping rotation windows; admin auth per G-5; cache headers
  per G-7; request validation from the WS1 canon; spec surface served.
- Rate-limiting posture per G-5 decision.
- Acceptance: all data routes require valid bearer auth; auth failures
  logged without secrets; contract tests prove responses match the canon;
  forbidden fields absent from every response; proof level: integration +
  E2E (running-system smoke per testing-strategy E2E constraints).

### WS8 — Cron and preview safety (after WS7; G-2)

- DST-safe 02:00 Europe/London trigger per G-2 mechanics; `CRON_SECRET`
  auth; **preview-safety as a tested correctness property**: cron and
  destructive admin routes provably disabled outside production
  (environment discrimination injected, not ambient — no `process.env` in
  tests).
- Acceptance: local-hour guard + once-per-day idempotency proven; the
  preview-disable proof is a named test; proof level: unit + integration.

### WS9 — Observability and alerts (after WS7)

- OTEL wiring per G-2 runtime using the repo observability package (report
  §5 C-10); structured log fields per the convergent set; query scrubbing
  proofs (emails, phone-like, postcodes, long numerics; no person-name
  heuristics); no-IP-no-token logging proofs; Slack alert path with
  throttling, tested against a fake webhook.
- Acceptance: scrubber proven by fixture corpus; forbidden log content
  fails tests; alert paths fire on the named conditions; proof level:
  unit + integration.

### WS10 — Docs, runbook, TSDoc (after all build WSs)

- Workspace READMEs (every new workspace); a data-sources document
  carrying per-source licence, attribution, update cadence, and the
  V-ledger outcomes; runbook (import failure response, token rotation,
  promotion rollback); TSDoc on all public surfaces per repo doctrine;
  documentation-propagation per the
  [component](../../templates/components/documentation-propagation.md).
- Acceptance: onboarding path from collection README → workspace READMEs →
  TSDoc holds; docs-adr-expert + onboarding-expert review; proof level:
  non-code (review evidence).

### Go/no-go evidence pack (closes the POC)

Assemble for the owner extraction decision (owner requirement 1): gate
decisions + ADR links; acceptance evidence per WS; the V-ledger outcomes;
operational posture (cost, alerts observed, import-run history); known
gaps. The extraction decision itself is out of this plan's scope.

## Acceptance criteria (plan level)

Outcome-level; each maps to WS-level proof contracts above:

1. A nightly guarded refresh produces a promoted dataset; a failed import
   provably leaves the previous dataset serving.
2. Canonical records, snapshots, API responses, and logs contain only
   allowlisted fields — proven by forbidden-field fixtures at every layer.
3. Search supports exact/prefix/alias/fuzzy/filtered lookup with
   deterministic, fixture-proven ranking and stable dataset-pinned cursor
   pagination.
4. All data endpoints require bearer auth; admin auth is separate,
   single-active, TTL-bound; secrets and IPs never reach logs.
5. The API surfaces a strict, comprehensive OpenAPI 3.x-compliant
   specification, CI-validated, with API/validation/types/client provably
   derived from the G-1 canon (owner requirement 2).
6. OTEL traces/logs/metrics emit through the repo observability
   conventions; Slack alerts fire on import/promotion failures.
7. The client package builds and contract-tests against the canon
   (publishing only per G-9).
8. Every gate G-1…G-9 has a recorded owner decision; ratified
   architectural decisions exist as ADRs.
9. The go/no-go evidence pack exists and is owner-consumable.

## Prerequisite classification

- **Blocking**: G-1, G-2, G-3, G-8 (foundations); Neon provisioning + the
  G-2 Vercel topology decision before WS7/WS8 deployment work; ADR-041
  boundary-rule additions before first new-workspace code.
- **Beneficial**: Vercel Blob (only if G-4 selects it; Postgres-only is
  the minimum shippable shape); Slack webhook provisioning (alert code
  ships with a fake-webhook proof; live webhook can follow); preview
  database branches (manual preview DB is the minimum shape).

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| Source-surface assumptions fail at build (report §7 V-01…V-12) | Each V-item is owned by a named WS with evidence recording; adapters fail fast and loudly; per-source launch posture decided at G-6 |
| One-way doors decided casually (promotion model, name-variants, normalisation locus, snapshot substrate — report §3.3/§4 reversal-cost notes) | The gates walk the report's reversal-cost notes explicitly; decisions land as ADRs where architectural |
| Gate session stalls the lane | Gates are one owner session walking the report; the report carries all considerations — no further research is required to decide |
| Preview deployment triggers real ingestion | WS8 preview-safety is a tested correctness property, not configuration hygiene |
| New framework class (if G-2 selects Next.js) destabilises shared tooling | G-2 considers the report's D-16 toolchain-surface analysis; if selected, scaffolding isolates Next-specific config to the app workspace |
| Contract drift between spec, validation, types, client | G-1 shape makes drift build-detectable by construction; CI spec gate (WS1) |
| Vendor call-shape drift (pooling, OTEL registration, duration config) | Pinned shapes verified in the consuming WS against installed/published docs (V-08, V-11) |
| PII reaches storage or logs | Allowlist-driven design with forbidden-field fixtures at snapshot, canonical, API, and log layers (WS3/WS4/WS7/WS9) |

## Foundation alignment

- [`principles.md`](../../../directives/principles.md): layer-role
  topology and Separate-Framework-from-Consumer drive WS-D1/G-8;
  strict-and-complete drives fail-until-mapped (WS2) and hard-fail
  validation (WS3/WS4); Result-pattern error handling in service
  internals (client public surface per G-1/C-05); fail-fast with helpful
  errors throughout.
- [`testing-strategy.md`](../../../directives/testing-strategy.md): TDD
  cycle-pairs as the unit of landing at unit/integration/E2E; no
  `process.env` in tests (environment injected — WS8 preview proofs);
  fixtures anchored to captured source schemas; mutation testing scoped to
  critical pure logic (mapping, scrubbing, ranking, tokens, gates).
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md)
  with report §6: the produced-spec inversion is decided at G-1 and
  recorded as an ADR; generated state beats authored state in whichever
  shape the owner ratifies.

## Plan-body first-principles check

- **Shape clause**: every WS proves Oak-authored behaviour (mapping,
  redaction, promotion, ranking, auth, guards) — no vendor-did-its-job
  tests; vendor integration is proven at smoke/E2E level only.
- **Landing-path clause**: new workspaces enter the lint/type/test gate
  footprint via base-config extension and the ADR-041 boundary-rule diff
  in the FIRST scaffolding cycle; plan files themselves are markdownlint
  canon (`.agent/plans/` is inside the gate footprint).
- **Vendor-literal clause**: no vendor call shapes are pinned by this plan
  body; every pinned shape in the briefs is re-verified in its consuming
  WS (V-08, V-11) against installed/published docs.
- **Optionality-surface clause**: every fork is a named gate with a named
  owner and report-sourced considerations; no bare `deferred` status
  exists; publishing (G-9) and extraction (post-POC) have named owners and
  triggers rather than open-ended optionality.

## Readiness reviewers

- This plan: `assumptions-expert` at readiness (dispatched 2026-06-03;
  disposition recorded in the collection README).
- WS-D1/G-8: `architecture-expert-betty` + `architecture-expert-fred`.
- Per-cycle execution: `code-expert` gateway per `invoke-code-experts`;
  `security-expert` on WS3 (PII/redaction), WS7 (auth, trust boundary),
  WS8 (cron secret, preview safety); `test-expert` on the first cycles of
  each WS; `docs-adr-expert` + `onboarding-expert` at WS10.

## Learning loop and lifecycle

- Lifecycle touch points per
  [lifecycle-triggers](../../templates/components/lifecycle-triggers.md):
  claim registration per session, work-shape declaration, handoff closure,
  consolidation at milestone boundaries.
- Plan completion, gate-bundle closure, and archival run
  [`consolidate-docs`](../../../skills/consolidate-docs/SKILL-CANONICAL.md);
  outcomes mine into ADRs/READMEs before archive per ADR-117.
- Quality gates per
  [quality-gates](../../templates/components/quality-gates.md): focused
  deterministic validation per cycle; canonical aggregate gate at phase
  and final validation.
