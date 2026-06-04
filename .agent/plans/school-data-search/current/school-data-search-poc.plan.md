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
    content: 'Gate G-1 (owner): contract layer = F-B code-first, Zod 4 single canonical source → OpenAPI 3.x via @asteasolutions/zod-to-openapi → client via hey-api/orval; CI proves strict 3.x; repo-wide forward policy; Result boundary; ADR-190 — DECIDED 2026-06-04 (F-C reopened post-verification: no neutral-def→Zod tooling)'
    status: completed
  - id: g2-runtime-topology
    content: 'Gate G-2 (owner): runtime = Next.js (D-16); own Vercel project; preview posture Neon-contingent (V-08); cron = `0 2 * * *` (02:00 UTC daily, D-06); WS-D1 authored this session — DECIDED 2026-06-04'
    status: completed
  - id: g3-canonical-model
    content: 'Gate G-3 (owner): enum values derived from source data at mapping WS (minimal, source-reachable, sourceStatus/sourceType preserved); phase includes middle; special modelled once; name-variants = modelled rows (D-11, one-way door); generic inspection, no rating (D-15, V-03); dataset_versions (D-12); granularity minimal-now — DECIDED 2026-06-04'
    status: completed
  - id: g4-storage-retention
    content: 'Gate G-4 (owner): substrate = Postgres-only redacted snapshots behind a storage-port interface (swap-ready, no Blob now); retention = env-config defaults snapshot 180d / change_events 90d (configurable via @oaknational/env); unredacted-quarantine excluded (NOT a config toggle — PII safety) — DECIDED 2026-06-04'
    status: completed
  - id: g5-auth-mechanics
    content: 'Gate G-5 (owner): admin-token rotation = operational script (no HTTP endpoint); token = split-token id+secret hashed (HMAC-SHA-256+pepper), token_prefix for lookup/audit; cursor = opaque, pins datasetVersionId+sort tuple (no HMAC-signing); rate-limiting deferred for POC, flagged for WS7 security-expert — DECIDED 2026-06-04'
    status: completed
  - id: g6-sources-composition
    content: 'Gate G-6 (owner): per-source pipelines w/ explicit provenance+freshness+configurable refresh (annual cadence fine); Scotland = contact-details + independent register (both OGL; geospatial layer DROPPED); NI SHIPS via DE annual publications (scraper-free); Wales = address list incl. independents + DataMapWales OGL-clean enrichment; coordinates/OS-derived DROPPED entirely; OPEN-school completeness non-negotiable — DECIDED 2026-06-04 (NI/Scotland revised post-verification)'
    status: completed
  - id: g7-search-mechanics
    content: 'Gate G-7 (owner): ranking = deterministic buckets + stable tie-breaks (D-13); normalisation = app-code pure-fn multilingual normaliser (EN/Welsh/Gaelic/Turkish/Hebrew-translit), STORE BOTH original+normalised, SEARCH BOTH, Postgres now / ES-Serverless later (D-14); cache = no shared CDN + client-owned local caching (D-09) — DECIDED 2026-06-04'
    status: completed
  - id: ws-d1-decomposition
    content: 'WS-D1: workspace decomposition proposal (seam map, Drizzle ownership, boundary rules) for G-8 ratification'
    status: pending
    depends_on: [g2-runtime-topology]
  - id: g8-decomposition-ratify
    content: 'Gate G-8 (owner): ratify the workspace decomposition proposal'
    status: pending
    depends_on: [ws-d1-decomposition]
  - id: g9-publishing
    content: 'Gate G-9 (owner): client builds unpublished; NO npm publish without explicit owner direction (forced by POC boundary, owner req 1) — DECIDED 2026-06-04'
    status: completed
  - id: ws1-contract-canon
    content: 'WS1: contract canon + generated surfaces per G-1 (spec serving, CI 3.x validation, client workspace unpublished)'
    status: pending
    depends_on: [g1-contract-layer, g8-decomposition-ratify]
  - id: ws2-canonical-model
    content: 'WS2: canonical model + per-source mapping tables (fail-until-mapped; V-12)'
    status: pending
    depends_on: [g3-canonical-model, g8-decomposition-ratify]
  - id: ws3-ingestion-framework
    content: 'WS3: ingestion framework (fetch, checksum, redacted snapshots, import-run state machine, advisory lock, idempotency); per-source pipeline with explicit configurable refresh-period + provenance/freshness surfaced (heterogeneous cadences: daily..annual)'
    status: pending
    depends_on: [g4-storage-retention, g8-decomposition-ratify]
  - id: ws4-nation-adapters
    content: 'WS4: nation adapters England/Wales/Scotland/NI with fixtures incl. forbidden-field + non-OGL rows; NI via DE annual publications (annual refresh); NO coordinates/OS-derived/UPRN fields (V-06/V-10 mooted — geospatial layer dropped); per-source licence + provenance/freshness confirmed (V-01..V-05, V-07, V-09); open-school completeness proof per nation'
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
    content: 'WS9: observability via @oaknational/logger (stdio sink only) + @oaknational/observability OTEL; scrubber proofs; no remote sinks (Slack/Plus out for POC)'
    status: pending
    depends_on: [ws7-api-auth]
  - id: ws10-docs-runbook
    content: 'WS10: workspace READMEs, data-sources/licensing/attribution doc, runbook, TSDoc audit'
    status: pending
    depends_on: [ws4-nation-adapters, ws6-search, ws8-cron-preview-safety, ws9-observability]
  - id: ws11-value-proof-picker
    content: 'WS11: value-proof school-picker page (Next.js, server-side bearer, access-gated/non-public, user picks a real school across all 4 nations, e2e)'
    status: pending
    depends_on: [ws6-search, ws7-api-auth]
  - id: poc-go-no-go
    content: 'POC go/no-go evidence pack assembled for the owner extraction decision'
    status: pending
    depends_on: [ws10-docs-runbook, ws11-value-proof-picker]
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

**Claim verification (required, multi-layer — owner directive 2026-06-04)**:
the report compiles claims from three external research briefs, which are
not infallible. Every load-bearing external-source claim (brief-asserted
source capabilities, vendor behaviours, data shapes) MUST be verified
against its primary source before it is relied upon in build, and the
verification recorded — the layers are: brief assertion → report
cross-grading → primary-source confirmation. The report's §7 register is
therefore a **required** verification gate, not a list of optional checks;
source-data and vendor claims are verified at the owning workstream where
the real data or runtime exists (`verify-data-supports-shape-before-building`,
`verify-vendor-call-shapes-at-plan-author-time`, `verify-dont-trust`). A
decision recorded at a gate does NOT imply its underlying external claims
are verified — that is a separate, required step. Verifications completed
live this session (2026-06-04): the deployed app is Express and no workspace
uses Next.js (repo `vercel.json`); Vercel cron is UTC-only (Vercel docs);
the GOV.WALES address list includes independent schools (gov.wales).
Cautionary instance: a single brief's (B2) caution on Welsh independents was
compiled into the report as if consensus and only primary-source
verification corrected it — the exact failure mode this discipline exists to
catch.

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
- No front-end admin UI; no user-auth (Clerk) flows for the POC; no
  React/RSC component package. (Exception: the WS11 school-picker page is in
  scope — it is the value proof, a server-side-bearer, access-gated
  (non-public) demo page, not an admin surface and not a published component
  package.)
- No Elasticsearch (the export seam is kept clean; adoption is a later
  decision); no postcode-radius search; no updated-since endpoint; no
  manual record overrides.
- No storage or exposure of phone, email, headteacher/named-contact,
  admissions-policy, parliamentary-constituency, or
  protected-characteristic fields; no closed-licence data; no IP logging.
- **Licensing guardrail (owner directive 2026-06-04): only crystal-clear,
  open, respected licences.** A licence allowlist parallel to the privacy
  allowlist — a source's data enters the canonical dataset only once its
  licence is confirmed open (OGL v3 or equivalent) and is then respected
  with correct attribution; public display is blocked until the licence is
  crystal-clear. No Crown-Copyright-encumbered or unclear-licence data.
- **No coordinates / no OS-derived data.** Latitude/longitude, easting/
  northing, geometry, UPRN, and any Ordnance Survey / AddressBase-derived
  field are excluded — dropped from the POC entirely, and not adopted later
  unless their licence is proven crystal-clear-open. (Hence the Scotland
  geospatial layer is dropped and DataMapWales geometry is excluded.)
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
either decided at its gate, parked with its named trigger here, or
rejected as framed. A reframed gate is a verdict on the gate's shape: it
routes back to synthesis as new work and amends the gate row — it is
never pressed into a decision or disguised as a park.

| Gate | Decision | Report source | Unblocks |
| --- | --- | --- | --- |
| G-1 | Contract-layer source of truth: F-A spec-first / F-B code-first / F-C shared-definition codegen; ratify the produced-spec ADR; clarify the "ALL APIs" scope reading (repo-wide policy or this service only — changes the ADR's scope, not this service's obligation) | §6, §5 C-03, C-05 (client error surface), §7 V-11 | WS1, WS7 |
| G-2 | App runtime = **Next.js** (D-16) + its own Vercel project + Neon-contingent preview posture (V-08) + cron = `0 2 * * *` UTC daily (D-06) + WS-D1 authored this session — **DECIDED 2026-06-04** | §4 D-16, D-06; §5 C-08 | WS-D1 finalisation, WS7, WS8, app-workspace scaffolding |
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

### Gate decisions (owner gate session, 2026-06-04)

Decisions recorded at decision time as the owner walks the gates (Mossy
Whispering Bark, `fac519`). Architectural ratifications land as ADRs.

- **G-1 — DECIDED 2026-06-04** (initially F-C; revised to F-B
  post-verification — V-11 confirmed no maintained neutral-definition→Zod
  toolchain exists in 2026, so the F-C shape is not cleanly buildable).
  Contract-layer canon = **F-B code-first with Zod 4 as the single
  canonical source**: hand-author Zod 4 schemas; generate the OpenAPI 3.x
  document from them via **`@asteasolutions/zod-to-openapi`** (v8 — Zod 4,
  OpenAPI 3.0/3.1), and the typed client downstream via
  `@hey-api/openapi-ts` or `orval`; a **CI gate proves the emitted spec is
  strict, comprehensive, and 3.x-compliant** (requirement 2 becomes a
  verified derived property). One canonical source (Zod), everything else
  generated → spec and code cannot drift — the no-drift intent of the
  original F-C choice, delivered with maintained tooling. "ALL APIs" scope
  reading = **repo-wide forward policy** (the ADR establishes
  produced-OpenAPI-from-Zod as the contract pattern for services this repo
  builds; existing surfaces not retrofitted). Client PUBLIC error surface =
  **`Result<T, E>` at the boundary** (C-05). Produced-spec ADR → **ADR-190**
  (drafted this session, as F-B). Unblocks WS1, WS7.

- **G-2 (runtime + topology) — DECIDED 2026-06-04.** App runtime =
  **Next.js App Router** — the briefs' 3/3 recommendation on the service's
  own merits and the owner's standing intent. This was always a Next.js
  app; the D-16 "fork" over-extended the standalone→in-repo frame-audit,
  which bears on scaffolding (C-01), not on the runtime. The app workspace
  bootstraps via `pnpm create next-app@latest` and is adapted into the
  monorepo. Vercel topology = **its own Vercel project** (determined, not a
  fork: a distinct Next.js app, and a Vercel project serves one framework
  shape). Preview-safety = **Neon-contingent posture**, not an
  unconditional block: Neon's Vercel integration branches a database per
  preview deployment, so preview ingestion writes to an isolated branch,
  not shared/production data — verify the per-preview provisioning and
  whether Vercel runs cron in preview at all (V-08), settle alongside G-4
  (storage substrate). Cron (D-06) = **`0 2 * * *`** (02:00 UTC daily).
  Advisory lock + once-per-day idempotency are ingestion-concurrency safety
  (WS3), independent of the schedule. WS-D1 authored **this session**, after
  the gate walk
  (architecture-expert betty + fred review), then G-8.

- **G-3 (canonical model) — DECIDED 2026-06-04.** Enum _values_ (status
  D-01, type D-02, phase D-03) are derived from real source vocabularies at
  the per-nation mapping workstreams (WS2/WS4), not pinned from the briefs:
  minimal, each value source-reachable (fail-until-mapped), with raw
  `sourceStatus`/`sourceType` preserved verbatim alongside; ungrounded brief
  values (B2 `merged`/`temporarily_closed`) excluded pending V-12. Locked
  correctness now: phase includes `middle` (England); `special` is modelled
  once as establishment-type, never double-encoded as a phase. Name-variants
  (D-11) = explicitly modelled rows (primary/official/previous/alternative),
  not jsonb — they feed indexed search; a one-way door, decided early.
  Inspection (D-15) = one generic `inspection` shape across all four
  nations, not England-specific `ofsted`, with no promised current-rating
  field (V-03: 2024 GIAS removal). Release model (D-12) = `dataset_versions`
  - `live_dataset_version` pointer. Granularity = minimal-now, expand
  additively later (single `post_16`; no live consumer forces a finer
  split). Unblocks WS2.

- **G-4 (storage / retention / privacy) — DECIDED 2026-06-04.** Snapshot
  substrate = **Postgres-only redacted snapshots** (no Vercel Blob at POC),
  behind a **single storage-port interface** with one Postgres adapter, so a
  later Postgres→Blob swap is a new adapter + config selection with no other
  code touched (the report's named snapshot-store seam; §Separate Framework
  from Consumer). Redacted-only — the allowlist strips contact/person
  fields, so no PII at rest. **Retention = configuration, not hardcoded**:
  env-validated values (via `@oaknational/env` / `env-resolution`, C-10)
  with defaults **snapshot 180 days, `change_events` 90 days** — changing
  them is an env change, no code edit. This generalises (owner directive
  2026-06-04): operational tunables are env-config with documented defaults,
  not magic numbers. **Unredacted-quarantine = excluded**, and deliberately
  NOT exposed as a trivial config toggle: enabling persistence of unredacted
  (PII-bearing) data must be a deliberate, reviewed change, never a flag flip
  (org no-PII; the 3/3 never-persist posture). Unblocks WS3.

- **G-5 (auth mechanics) — DECIDED 2026-06-04.** Admin-token rotation =
  **operational script** (`pnpm admin:rotate-token`), no HTTP rotation
  endpoint (smaller attack surface; 2/3 briefs). Token format =
  **split-token** `oak_sds_<id>_<secret>`, hashed at rest (HMAC-SHA-256 +
  pepper), `token_prefix` column for O(1) lookup + per-consumer audit
  (D-10). Cursor integrity = **opaque cursor pinning `datasetVersionId` +
  sort tuple** (the 3/3 load-bearing property); no HMAC-signing —
  proportionate for an authenticated internal API where tampering only
  affects the caller's own pagination. Rate-limiting (C-09) = **deferred
  for the POC** (internal, bearer-gated, behind Cloudflare), explicitly
  flagged for the WS7 `security-expert` review, not silently inherited.
  The whole auth surface gets `security-expert` review at WS7. Unblocks WS7.

- **G-6 (sources composition) — DECIDED 2026-06-04** (NI + Scotland revised
  post-verification). **Per-source ingest pipelines** (owner directive
  2026-06-04): each data source is its own pipeline with an **explicit,
  configurable refresh period** and explicit **provenance + freshness**
  surfaced (per-record provenance + `/api/metadata`); heterogeneous cadences
  are fine — a daily source and an annually-updated source coexist, the
  annual one simply caches longer. **Scotland (D-07)** = School Contact
  Details (primary register — status + opened/closed + renamed history) + the
  Independent Schools register, **both clean OGL**; the School Roll &
  Locations geospatial layer is **dropped** (it existed only for
  coordinates/enrichment and carries OS-Crown-copyright + an unconfirmed
  LGIH licence — excluded under the licensing guardrail). **Northern Ireland
  (D-08)** = **ships** (not deferred). Its register is a per-source pipeline
  over the **DE annual school-level publications** (annual refresh,
  scraper-free) rather than the fragile ASP.NET Institution-Search scrape
  (V-05); WS4 confirms the exact source gives adequate operating-school
  coverage and records its provenance/freshness/refresh. **Wales** =
  GOV.WALES address list (verified 2026-06-04 to include **independent**
  schools) + DataMapWales for **OGL-clean** maintained enrichment (geometry/
  coordinates excluded per the guardrail); closed/historical Welsh coverage
  is a documented best-effort gap (V-04). **Coordinates dropped entirely**
  across all nations (see §Non-goals — licensing guardrail). **Completeness
  is a first-class acceptance criterion** (owner directive 2026-06-04): every
  _operating_ school across all four nations must be findable —
  non-negotiable, proven per-nation at WS4 (hard-fail validation +
  row-count-delta guards, §3.4); closed/historical completeness is
  best-effort. Unblocks WS4.

- **G-7 (search mechanics) — DECIDED 2026-06-04.** Ranking (D-13) =
  **deterministic buckets/tiers** (exact-original → exact-normalised →
  prefix → alias/previous → FTS → trigram) with stable tie-breaks
  (`active DESC, name_norm ASC, id ASC`); no ML, no magic-number weights;
  fixture-tested at WS6. Normalisation (D-14, owner-expanded 2026-06-04) =
  an **app-code pure-function normaliser** covering multilingual proper
  nouns — English, Welsh, Irish & Scottish Gaelic, and Latin-transliterated
  names (Turkish, Hebrew, etc.). The multilingual edge cases (Turkish
  dotted/dotless i, Welsh digraphs, transliteration variants) require a
  tested function, not DB-side `unaccent` alone, applied identically at
  index and query time (the invariant). **Store BOTH** `name_original`
  (verbatim — display + exact match) and `name_normalised`, on schools and
  on every modelled name-variant row (D-11), and **search against BOTH**.
  Postgres (`pg_trgm` on both forms + `simple` FTS, not English stemming)
  for the POC; **Elasticsearch Serverless** is the named later enhancement
  if the project is taken forward (the §3.8 export seam stays clean).
  Multilingual coverage is an explicit WS6 acceptance criterion (fixtures
  for Welsh / Gaelic / Turkish / Hebrew-transliteration). Cache headers
  (D-09) = **no shared CDN caching** for authenticated query endpoints (3/3,
  locked); API emits `no-store`/`private` + Vercel CDN-off; consumer-local
  caching standardised in the client package. Required verifications:
  `pg_trgm`/`unaccent` multilingual behaviour fixture-proven at WS6;
  Cloudflare/Vercel cache-header behaviour verified against live docs at WS7.
  Unblocks WS6, WS7 (headers).

- **G-9 (client-package publishing) — DECIDED 2026-06-04.** Set by the POC
  boundary (owner requirement 1): the client workspace is built and used
  in-repo **unpublished**; **no `npm publish`** without explicit owner
  direction (earliest at/after go/no-go). Not a genuine fork — recorded for
  completeness (C-07).

### Required high-stakes verifications (delivery gate — owner directive 2026-06-04)

The plan/report is NOT considered delivered until every high-stakes
external-source claim below is checked against its primary source (verified
✓; pending ☐). Lower-stakes data-population claims verify at their owning
build workstreams per the verification discipline above.

- ✓ Deployed app is Express; no workspace uses Next.js — repo `vercel.json` (2026-06-04).
- ✓ Vercel cron is UTC-only — Vercel docs (2026-06-04).
- ✓ GOV.WALES address list includes independent schools — gov.wales (2026-06-04).
- ✓ **V-01** GIAS automated-fetch: **VIABLE** — public daily CSV
  (`ea-edubase-api-prod.azurewebsites.net/edubase/downloads/public/edubasealldata{YYYYMMDD}.csv`),
  no auth, plain GET, OGL v3; the GIAS web UI bot-blocks but the data
  endpoint is open. Build-confirm the exact official endpoint + URL
  retention at WS4 (the official Downloads page was bot-blocked to the
  checker; URL evidenced via a DfE-Digital repo + a live fetch).
- ⚠ **V-05** NI register: the Institution Search "export" is a fragile
  ASP.NET viewstate POST (a scraper), NOT a clean URL/API; OpenDataNI is
  stale (2016); the DE annual Excel publications (2024/25) are the current
  scraper-free option but are per-type statistical files. → **RESOLVED
  2026-06-04**: NI ships via a per-source pipeline over the DE annual
  publications (annual refresh, scraper-free); WS4 confirms coverage +
  provenance.
- ⚠ **V-11** Contract toolchain: F-C (neutral shared-definition → both
  OpenAPI + Zod) is NOT cleanly buildable in 2026 — no maintained
  TypeSpec→Zod emitter. The no-drift intent is delivered by **F-B with Zod
  as the single canonical source** (Zod → OpenAPI 3.x via maintained
  `zod-openapi` / `@asteasolutions/zod-to-openapi`; → typed client via
  `@hey-api/openapi-ts` / `orval`; CI gate proves strict 3.x). → **RESOLVED
  2026-06-04**: G-1 = F-B, Zod 4 canonical + `@asteasolutions/zod-to-openapi`
  (caught before the ADR was drafted).
- ✓ **V-08 (Neon/Vercel)** preview branching is REAL but **opt-in /
  configured** (not automatic — a WS8 setup toggle); Vercel cron is
  **production-only** (cron-in-preview guard is moot). Preview-safety
  resolved: enable Neon preview branching + a cheap `VERCEL_ENV` guard on
  destructive admin routes. (Note: Neon Free/Launch cap = 10 branches/project.)
- ✓ **V-02** GIAS licence = OGL v3 (store + display + attribution OK).
  ⚠ **V-06** Scotland geospatial = OGL v3 but requires OS-Crown-copyright +
  **LGIH** attribution, and the LGIH component's open-licence status is
  unconfirmed → public display of Scotland coordinates blocked until cleared.
  → **RESOLVED 2026-06-04**: coordinates + all OS-derived data (lat/long,
  easting/northing, geometry, UPRN) dropped entirely (licensing guardrail);
  the Scotland School Roll & Locations geospatial layer is dropped.

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

**England/GIAS is the first milestone** — it is the dominant data mass, so
de-risk it before investing in WS5–WS11.

- England/GIAS (first): V-01 (automated-fetch viability — the daily public
  CSV endpoint), V-02 (extract-level licence-string capture per snapshot —
  a STOP-RULE: public display blocked until the licence is confirmed
  crystal-clear; an FOI reply used weaker "fair-dealing" wording, so confirm
  at fetch time), V-03 (inspection-field availability), V-09 (download route)
  verified here; BSO/offshore rows flow with `locationCountry` from address.
- Wales: GOV.WALES address list (includes independents — V-04 confirmed
  2026-06-04) + DataMapWales OGL-clean maintained enrichment with
  geometry/coordinates EXCLUDED (licensing guardrail); V-07 (layer currency)
  verified here; closed/historical coverage is a documented best-effort gap.
- Scotland: School Contact Details (primary register — status, opened/closed,
  renamed history) + the Independent Schools register, both clean OGL. The
  School Roll & Locations geospatial layer is DROPPED (coordinates +
  OS-Crown-copyright/LGIH-encumbered — excluded under the guardrail);
  V-06/V-10 mooted.
- Northern Ireland: SHIPS via a per-source pipeline over the DE annual
  school-level publications (annual refresh, scraper-free — NOT the fragile
  ASP.NET Institution-Search scrape); V-05 confirms operating-school
  coverage + provenance/freshness. No coordinates.
- **Per-nation `sourceId` identity verification**: confirm each source
  provides a per-school identifier that is BOTH stable across refreshes AND a
  unique identity at school grain (cardinality 1:1 — a present/stable field is
  not automatically a unique id). GIAS URN is stable + unique; Scotland SEED
  can be 1:many (one SEED → multiple campuses), so verify the contact-details
  register's grain; confirm Wales `school_code` and the NI reference likewise.
  The canonical ID built from it is the picker's stored-identity contract.
- Every adapter ships fixtures: valid rows, closed/proposed/independent/
  special/PRU rows where the source supports them, malformed rows,
  duplicate-ID rows, unexpected-enum rows, and forbidden-field rows.
- Acceptance: each enabled source ingests to staging with hard-fail
  validation; **open-school completeness proven per nation** (first-class,
  G-6); per-source licence + provenance/freshness + sourceId-stability
  recorded with evidence; proof level: unit + integration.

### WS5 — Release model and promotion (after WS2, WS3)

- Version-scoped staging, whole-dataset promotion in a single transaction,
  pointer/current-flag flip per G-3 naming, row-count gates (>10% fail with
  explicit override; warn-band posture per report D-considerations).
- **`change_events` field-level diffing + the import-run-inspection detail
  API (`GET /api/admin/import-runs/:id`) are DEFERRED to post-go**
  (operational observability, not picker-essential — owner-decided
  2026-06-04). In-POC: whole-dataset promotion + basic import-run success/fail
  status + the stale-serving-after-failed-import proof (all picker-essential).
- Acceptance: failed import provably leaves the previous dataset serving
  (the stale-serving proof is a named integration test); promotion is
  atomic; the live pointer never references an in-flight import; proof level:
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

### WS9 — Observability (after WS7)

- Reuse the repo's logging/observability — do NOT reinvent (owner directive
  2026-06-04): `@oaknational/logger` (the Oak Logger, node entry) with
  **stdio as the only sink** via its `sink-config`, plus
  `@oaknational/observability` for OTEL conventions + redaction; comply with
  the `require-observability-emission` ESLint rule. **No remote sinks for the
  POC** (Slack-webhook alerts + Vercel-Observability-Plus are out — named
  post-go).
- Query scrubbing proofs (emails, phone-like, postcodes, long numerics; no
  person-name heuristics — school names contain personal names);
  no-IP-no-token logging proofs.
- Acceptance: logs emit via `@oaknational/logger` to stdio only (assert no
  remote sink configured); OTEL spans present; scrubber proven by fixture
  corpus; forbidden log content fails tests; proof level: unit + integration.

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

### WS11 — Value-proof school-picker page (after WS6, WS7)

The POC's go/no-go bar is a demonstrated value-path, not capabilities alone
(owner directive 2026-06-04). Build a Next.js page (e.g. `/pick-your-school`)
whose server side holds the bearer token and proxies to the service's own
autocomplete/detail routes — the browser never sees the token, so the page is
the reference server-side consumer and preserves the no-browser-credentials
design. This is not an admin UI; it is the value proof. **Access-gated**
(Vercel deployment protection / basic auth) — the POC stays non-public even
for the demo page (owner-decided 2026-06-04).

- Acceptance: a user can type-and-pick a real school in EACH of England,
  Wales, Scotland, and Northern Ireland; the selected canonical school and
  its stable ID are shown; the page is not publicly reachable (access-gate
  proven); proof level: e2e (running-system smoke per testing-strategy E2E
  constraints).

### Go/no-go evidence pack (closes the POC)

Assemble for the owner extraction decision (owner requirement 1): gate
decisions + ADR links; acceptance evidence per WS; **the working
school-picker page demonstrating the value across all four nations (WS11)**;
the V-ledger outcomes; operational posture (cost, stdio logs/traces observed,
import success/fail history); known gaps. The extraction decision itself is
out of this plan's scope.

## Acceptance criteria (plan level)

Outcome-level; each maps to WS-level proof contracts above:

1. A nightly guarded refresh produces a promoted dataset; a failed import
   provably leaves the previous dataset serving; a school keeps the SAME
   canonical ID across refreshes/promotions (the picker's stored-identity
   contract).
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
6. Logs/traces emit through `@oaknational/logger` (stdio sink only) +
   `@oaknational/observability` OTEL conventions; no remote sink configured.
7. The client package builds and contract-tests against the canon
   (publishing only per G-9).
8. Every gate G-1…G-9 has a recorded owner decision; ratified
   architectural decisions exist as ADRs.
9. The go/no-go evidence pack exists and is owner-consumable.
10. A school-picker page lets a user pick a real school across all four
    nations end-to-end (WS11) — the value proof for go/no-go.

## Prerequisite classification

- **Blocking**: G-1, G-2, G-3, G-8 (foundations); Neon provisioning + the
  G-2 Vercel topology decision before WS7/WS8 deployment work; ADR-041
  boundary-rule additions before first new-workspace code.
- **Beneficial**: Vercel Blob (only if G-4 selects it; Postgres-only is
  the minimum shippable shape); preview database branches (manual preview DB
  is the minimum shape). Remote observability sinks (Slack alerts,
  Vercel-Observability-Plus) are out of the POC — stdio only (WS9).

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| Source-surface assumptions fail at build (report §7 V-01…V-12) | Each V-item is owned by a named WS with evidence recording; adapters fail fast and loudly; per-source launch posture decided at G-6 |
| One-way doors decided casually (promotion model, name-variants, normalisation locus, snapshot substrate — report §3.3/§4 reversal-cost notes) | The gates walk the report's reversal-cost notes explicitly; decisions land as ADRs where architectural |
| Gate session stalls the lane | Gates are one owner session walking the report; the report carries all considerations — no further research is required to decide |
| Preview deployment triggers real ingestion | WS8 preview-safety is a tested correctness property, not configuration hygiene |
| Next.js (first Next workspace; existing app is Express) destabilises shared tooling | Scaffolding isolates Next-specific config to the app workspace; base configs extended not replaced; ADR-041 boundary diff lands first |
| Contract drift between spec, validation, types, client | G-1 shape makes drift build-detectable by construction; CI spec gate (WS1) |
| Vendor call-shape drift (pooling, OTEL registration, duration config) | Pinned shapes verified in the consuming WS against installed/published docs (V-08, V-11) |
| Upstream `sourceId` changes break a consuming service's stored school ID | Per-nation sourceId-stability verification at WS4; canonical-ID stability is a plan-level tested invariant |
| Ingestion exceeds function duration ceiling | `maxDuration` 800s needs Vercel Pro/Enterprise (Hobby caps 300s) — ensure the project tier; chunk ingestion if needed |
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
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md):
  the Cardinal Rule governs CONSUMING the upstream Oak Open Curriculum spec —
  it does NOT govern this service's own produced contract (owner direction
  2026-06-04). Producing this service's Zod→OpenAPI spec is a separate
  concern (G-1 = Zod-canonical, F-B), recorded as ADR-190. Not an inversion
  of the Cardinal Rule.

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
