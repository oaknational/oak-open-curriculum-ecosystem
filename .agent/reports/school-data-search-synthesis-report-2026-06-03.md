# Oak School Data Search — Research Synthesis Report — 2026-06-03

**Authored by**: Furnace Roasting Brazier (claude / Opus 4.8 / `88a769`),
owner-directed (thread `school-data-search`; landing target recorded in
[the thread record](../memory/operational/threads/school-data-search.next-session.md)).

**Status**: synthesis. **This report decides nothing.** Convergence across the
three research briefs is presented as the high-confidence foundation;
divergences are NAMED owner decisions with considerations attached; collisions
between brief assumptions and the owner requirements or this repository's
doctrine are recorded in an explicit ledger; claims no brief can ground are
flagged for build-time verification, never asserted. Decisions are taken at
the owner gates carried by the companion plan
([`school-data-search` plan collection](../plans/school-data-search/README.md)).

## 1. Purpose, inputs, provenance and confidence model

### 1.1 Inputs

Four owner-designated inputs, all in the gitignored
`.agent/reference-local/oak-school-search-research/` lane (this report is
therefore fully self-contained: every load-bearing claim is quoted or cited
here with its resolved source URL — nothing in tracked canon depends on
reading the gitignored files):

1. `additional-requirements.md` — owner requirements; they OVERRIDE the
   briefs (quoted verbatim in §2).
2. `Oak School Data Search Project Brief 1-clean.md` (**B1**) — 1,922 lines.
3. `Oak School Data Search Project Brief 2-clean.md` (**B2**) — 191 lines.
4. `Oak School Data Search Project Brief 3-clean.md` (**B3**) — 845 lines.

The three briefs are three independent deep-research answers to the SAME
research brief. The raw export `.md` files beside the clean files are
provenance only; the clean files are canonical (normalised 2026-06-03 by
Hushed Lurking Mask with citation recovery doubly verified against the PDF
export surfaces; source PDFs deleted on owner direction).

### 1.2 Citation confidence model

- **B2**: 56 inline position-exact `[[N]]` citations over 31 verified source
  URLs. Cited here as `B2 [[N]]`; every anchor used resolves in §8.1.
- **B3**: 42 inline position-exact `[[N]]` citations over 24 verified source
  URLs. Cited here as `B3 [[N]]`; resolved in §8.2.
- **B1**: the export lost its inline citations; its reference list is an
  owner-supplied verified approximate set (21 URLs; 19 probed OK, 2 GIAS URLs
  bot-blocked as expected) with **no position claims**. Cited here as
  `B1 (approx)` and weighted accordingly: B1-only claims are treated as
  single-source recommendations, not verified facts. Key URLs in §8.3.

Where all three briefs assert the same position, that convergence is itself
the evidence grade ("3/3"). Where two agree, "2/3" with the dissent named.

### 1.3 Known provenance limits

- **The original research brief is not among the inputs.** Its constraints
  (for example "02:00 UK time", "Cloudflare sits in front", "plaintext token
  storage acceptable", the illustrative `School` type) are reconstructed here
  only via convergent quotation across the three answers. Where original
  wording could change a decision, the gate in the plan names that.
- The briefs' "Confirmed decisions" sections speak with a decided voice.
  That voice is **brief-author recommendation**, not owner ratification.
  Nothing in §3 is decided until an owner gate ratifies it.
- No personal data from source materials is reproduced in this report; where
  source schemas expose person-identifying fields, only the schema field
  names are named (they are the subject of the exclusion policy).

## 2. Owner requirements (the override layer)

Quoted verbatim from `additional-requirements.md` (2026-06-03):

> 1. In the first instance, the POC MVP, the service will be built in THIS
>    repo, and not extracted until the POC is complete and we decide whether
>    to take the project forward.
> 2. ALL APIs MUST surface a strict, comprehensive OpenAPI specification
>    that is fully compliant with the latest OpenAPI 3.x specification.

Override consequences:

- **Requirement 1 invalidates the briefs' shared frame.** All three briefs
  assume a NEW standalone monorepo named `oak-school-data-search` with a
  repo-bootstrap Phase 0 (workspace files, Turbo config, base tsconfig,
  ESLint/Prettier, test tooling, semantic-release, LICENSE, root README).
  None of that scaffolding is inherited: this repository already provides
  it. Every brief phase and recommendation is re-read through the in-repo
  lens (collision ledger, §5). Extraction is a **named later gate**
  (post-POC go/no-go), not a design input now.
- **Requirement 2 is absent from all three briefs.** No brief surfaces an
  OpenAPI specification anywhere; all three build the API contract as Zod
  schemas shared through the client package. The requirement therefore does
  not merely add an artefact — it restructures the contract layer (§5 C-03)
  and inverts this repository's schema-first flow (§6).
- Scope reading of "ALL APIs": the plain reading within the requirements
  file is all API surfaces of THIS service (public and admin alike). A
  broader reading (all APIs in the repository) exists; the OpenAPI gate in
  the plan names this clarification for the owner at decision time.

## 3. Convergent foundation (high confidence)

Positions held by all three briefs unless marked otherwise. Each is a
high-confidence **recommendation foundation** for the plan; ratification
happens at the plan's gates.

### 3.1 Platform and service shape

- **Strict TypeScript service using this repo's toolchain idiom** — pnpm,
  Turbo, strict TS, Vitest, Playwright, Stryker, Prettier (3/3; B2 [[4]],
  B3 [[6]], B1 (approx) — all three independently cite this repository's
  own configuration as the conventions reference).
- **Next.js App Router Route Handlers, deployed on Vercel as Functions**
  (3/3; B2 [[1]]). **Node.js runtime, not Edge** — database access, heavier
  ingestion, cryptographic token checks, transactional promotion (3/3;
  B2 [[1]]). The 3/3 vote stands on the service's own merits and the
  owner's standing intent: this is a Next.js app. The standalone→in-repo
  frame change (C-01) bears on scaffolding, not on the runtime reasoning;
  that Next.js is the monorepo's first Next workspace (the existing MCP app
  is Express) is an implementation consequence, not a reason to reopen the
  choice. Decided at G-2 (2026-06-04) — see D-16.
- **Fluid Compute enabled; raised `maxDuration` on ingest/admin routes**
  (3/3; B2 [[17]], B3 [[18]]). Refresh runs synchronously inside the
  cron/admin request; `after()`/`waitUntil()` only for small post-response
  work such as token `lastUsedAt` updates (B2 [[17]], B1 (approx)).

### 3.2 Storage and query layer

- **Postgres on Neon via the Vercel Marketplace** (3/3; B2 [[2]],
  B3 [[1]]). Vercel's own Postgres product is retired; historical Vercel
  Postgres databases moved to Neon in December 2024 (B2 [[2]]); Neon's
  current guidance under Fluid Compute is standard TCP connections with a
  connection pool (B3 [[1]]; B1 (approx) adds Vercel's `attachDatabasePool`
  guidance — vendor shape flagged V-08).
- **Drizzle ORM + explicit SQL migrations**, with targeted raw SQL for
  search/promotion paths (3/3; B2 [[2]][[30]], B3 [[16]]). All three
  independently reject Prisma for this workload (SQL-heavy, extension-aware,
  serverless pooling friction; B2 [[2]]).

### 3.3 Serving model: versioned datasets, whole-dataset promotion

- Every canonical row is scoped to a dataset version/release; a single
  pointer (or current-flag) names the promoted dataset; **the API reads only
  the promoted dataset, never in-flight imports** (3/3).
- **Promotion is whole-dataset, not per-source** — per-source flips would
  create mixed freshness windows and break pagination coherence (3/3;
  B2 [[16]]). A failed import leaves the previous promoted dataset serving
  (the core resilience promise, 3/3).
- `POST /api/admin/refresh/:source` runs a per-source fetch/parse/validate
  into staging for diagnostics but does NOT flip live data (B2 [[16]]; B1
  and B3 carry the same route with the same whole-dataset promotion rule).
- Unchanged sources (checksum/ETag/Last-Modified) are carried forward into
  the new staging dataset and recorded as skipped-unchanged (B1 (approx),
  B3; B2 compatible).
- **Reversal-cost note (one-way door)**: once the schema is built around
  version-scoped canonical rows with FK references, moving to per-source
  promotion or a mutable latest-rows model is a full schema migration plus
  ingestion rewrite — cheap at POC scale, expensive once import history
  accumulates. The 3/3 convergence lowers the chance of re-deciding, not
  the cost of reversing.

### 3.4 Ingestion and validation posture

- Nation-by-nation source adapters over **official, openly licensed sources
  only**; raw download is ephemeral; checksum/ETag/Last-Modified and source
  metadata captured immediately (3/3).
- **Hard-fail validation by default**: unknown enum/status, missing required
  source ID, duplicate source ID, duplicate canonical ID, impossible dates,
  schema/header drift, forbidden field mapped into canonical output — all
  fail (3/3; B2 [[19]]). Row-count delta >10% versus the last successful
  import fails promotion unless an explicit admin override is supplied
  (3/3; B1 adds a 5–10% warn band).
- Global advisory lock + once-per-local-day idempotency around refresh
  (3/3; B2 [[18]]).
- Every tolerated anomaly must be named in code, fixtures, tests, and docs —
  no generic best-effort handling (B1 (approx), B3; B2 compatible "only
  tolerate anomalies explicitly named in code and tests").

### 3.5 Privacy: allowlist-driven exclusion (and why it is not optional)

- **Field allowlist per source; conservative exclusion of contact and
  person-identifying fields** — no phone numbers, no email addresses, no
  headteacher/principal names, no named contacts (3/3). The source material
  makes this concrete rather than theoretical: the GIAS raw schema includes
  `TelephoneNum`, `HeadFirstName`, `HeadLastName` (B3 [[4]] — DfE's own
  engineering DDL for the public CSV); GIAS establishment pages expose
  headteacher/principal and telephone (B2 [[3]]); DataMapWales exposes
  `phone_number` (B2 [[7]]); Scotland's School Roll & Locations layer
  exposes `email` and `phone` (B2 [[9]]); Wales' address list publishes
  telephone and email (B3 [[8]]); the NI open location CSV includes
  `Telephone` and `Email` (B3 [[12]]).
- **Never persist unredacted raw files** (3/3): originals live only in
  memory/tmp during processing; what persists is a redacted snapshot
  artefact plus checksums/metadata sufficient to re-fetch and verify the
  exact upstream file (B2 [[3]], B3, B1 (approx)).
- **No user PII; no IP logging** — never log `x-forwarded-for` /
  `cf-connecting-ip` / kin; never log bearer/admin tokens (3/3;
  B2 [[22]]). Search queries are logged only after a targeted scrub
  (emails, phone-like strings, full UK postcodes, long numeric IDs;
  deliberately NO person-name heuristics because school names contain
  personal names) (3/3).
- Forbidden-field enforcement is test-backed: fixtures contain the
  forbidden columns and tests fail if one is ever mapped into canonical
  output, snapshots, API responses, or logs (3/3).
- B1-only extension: exclusion also of admissions-policy, parliamentary-
  constituency, protected-characteristic aggregates (for example SIMD /
  minority-ethnic proportions in the Scottish layer), with the same
  allowlist mechanism (B1 (approx); B2/B3 compatible by allowlist
  construction). Aligned with this organisation's no-PII instruction.

### 3.6 Canonical model

- **Canonical ID formula** (3/3, identical):
  `${registerCountry}:${sourceSystem}:${sourceId}`.
- `registerCountry ∈ {england, wales, scotland, northern_ireland}` with
  **`locationCountry` kept separate** for physically-overseas entities;
  `country` is accepted as an alias for `registerCountry` in the API (3/3;
  B2 [[3]]).
- A separate **source-identifiers collection** keeps URN, LAESTAB, UKPRN,
  DfE number, SEED, SchUID, LA codes queryable without inventing a
  universal external ID (3/3; B2 [[13]]).
- **Trusts/MATs/governing bodies are not standalone entities** in MVP;
  trust/MAT metadata attaches to school records where sources provide it
  (3/3; B2 [[12]]).
- Previous/alternative names participate in search (3/3; modelling fork in
  D-11).
- Include broadly: state schools, academies, free schools, independents,
  special schools, AP/PRUs, nurseries, FE/sixth-form institutions where
  registered, closed/proposed schools where sources expose status, and
  GIAS-hosted British Schools Overseas / offshore / service-children
  records with `registerCountry = "england"` and `locationCountry` from the
  address (3/3; B2 [[3]][[5]], B3 [[7]][[15]]). Standalone MOD/DCS overseas
  ingestion is excluded from MVP — no stable machine-readable register was
  found (3/3; B3 [[14]]).

### 3.7 Sources (the convergent register map)

- **England: GIAS public downloads as the spine.** Comprehensive DfE
  register (~65,000 establishments, 250+ fields, downloads updated daily;
  B2 [[5]], B3 [[2]][[3]]); includes academies, maintained, independents,
  FE, specialist post-16, plus British-schools-overseas, offshore, and
  service-children categories (B2 [[5]][[3]]). OGL v3 with attribution
  (B2 [[6]]).
- **Wales: two-source model.** Welsh Government address list of schools /
  PRUs (broad register including independents; B3 [[8]]) + DataMapWales
  "Schools - Maintained" layer for maintained-school enrichment (35
  attributes including `school_code`, governance, `welsh_medium`, geometry;
  OGL; B2 [[7]]).
- **Scotland: official Scottish Government publications** — School Contact
  Details (open schools; opened/closed since 2006; renamed schools;
  OGL v3; B2 [[8]], B3 [[11]]) + the Independent Schools register
  (B2 [[8]], B3 [[11]]); the School Roll & Locations geospatial layer for
  coordinates and enriched metadata, where `SchUID` is the unique field
  (one SEED can map to multiple campuses; B2 [[8]][[9]]). Composition fork
  in D-07.
- **Northern Ireland: DE Institution Search / Schools Plus as the register
  spine** (currently 1,123 open institutions in the public search;
  B2 [[10]], B3 [[13]]) + school-level enrolment (and available-places,
  B3) workbooks for enrichment; OGL posture per DE NI (B2 [[11]]).
  The OpenDataNI School Locations CSV is stale (created ~9 years ago,
  updated ~8 years ago; B3 [[12]]) — never the primary source (3/3; role
  fork in D-08).
- **Licensing**: OGL v3 across GIAS / GOV.WALES / gov.scot / DE NI permits
  storage, combination, internal API use, and public display with
  attribution (3/3; B2 [[6]][[11]]); provenance (source URL, licence
  string, attribution, downloaded-at, source-updated-at) is stored per
  record/snapshot (3/3). Code licence MIT; data never relicensed as
  Oak-owned (3/3).

### 3.8 Search

- **Postgres-native search for MVP; Elasticsearch deferred** (3/3): UK
  school corpus scale does not justify ES (England ≈65k rows; B2 [[5]]).
  The pipeline keeps a clean later seam: promoted canonical dataset →
  search-document builder → Postgres table now / ES index writer later;
  Postgres remains source of truth; `POST /api/admin/reindex-search`
  rebuilds (3/3; B2 [[15]]).
- **`pg_trgm` + `unaccent` + full-text search with a `simple`-based
  configuration, NOT English stemming** — school names are proper nouns
  with Welsh/Gaelic forms and abbreviations (3/3; B2 [[5]][[19]][[20]],
  B3 [[5]]).
- **Deterministic, explainable ranking** — exact normalised name → exact
  official name → prefix → alias/previous-name → full-text rank → trigram
  similarity, with active-first and stable tie-breaks (name, then id); no
  opaque/ML ranking in MVP (3/3; B2 [[20]]; mechanism fork in D-13).
- **Cursor pagination** with opaque cursors that pin the promoted dataset
  version so pagination stays coherent within one promoted dataset (3/3;
  integrity fork in D-10). No total counts in MVP (B1 (approx); B2/B3
  response shapes compatible).
- Autocomplete: minimal capped surface, prefix-priority, `q` length ≥ 2
  (3/3 in substance).

### 3.9 API surface (convergent 10-route core, 3/3)

```text
GET  /api/health
GET  /api/metadata
GET  /api/schools
GET  /api/schools/:id
GET  /api/schools/autocomplete
POST /api/admin/refresh
POST /api/admin/refresh/:source
POST /api/admin/reindex-search
GET  /api/admin/import-runs
GET  /api/admin/import-runs/:id
```

(B2 [[1]]; B3 adds a separate cron entry route; B1 (approx) adds
`POST /api/admin/tokens/refresh` — both folded into forks D-05/D-06.)

Query parameters for `GET /api/schools` (3/3): `q`, `country` (alias),
`registerCountry`, `locationCountry`, `active`, `status`, `type`, `phase`,
`sourceSystem`, `limit`, `cursor`. Two response shapes: `SchoolSummary`
(list/autocomplete) and `SchoolDetail` (detail) (3/3). `GET /api/metadata`
reports promoted dataset version + per-source freshness/licence/attribution
(3/3).

### 3.10 AuthN/AuthZ

- **Opaque bearer tokens for machine-to-machine consumers; hashed at rest,
  never plaintext** — all three briefs independently override the research
  brief's recorded "plaintext acceptable" stance (3/3; B2 [[21]] citing
  OWASP REST guidance). Constant-time comparison; only consumer identity +
  token prefix ever logged; overlapping old/new token windows for rotation
  (3/3).
- **Separate admin auth**: single active admin token, hashed, 24 h TTL
  (3/3). Rotation mechanism is a fork (D-05). Cron authenticates with a
  separate `CRON_SECRET`, not the admin token (B1 (approx), B3 [[17]]).

### 3.11 Caching

- **No shared CDN caching for any authenticated, query-carrying endpoint**
  — search query strings encode user intent; Cloudflare respects
  `private` / `no-store` and treats query strings as cache identity
  (3/3; B2 [[23]], B3 [[19]]). Vercel's `CDN-Cache-Control` /
  `Vercel-CDN-Cache-Control` give intermediary-cache control (B2 [[23]]).
- Consumer-local caching (inside the calling server app) is the sanctioned
  alternative (3/3). Metadata/detail header nuances are a fork (D-09).

### 3.12 Observability and operations

- **OpenTelemetry via `@vercel/otel` + `instrumentation.ts`** (3/3;
  B2 [[25]], B3 [[20]]); structured JSON logs with request/import
  correlation fields; Vercel Observability (Plus) first; Slack webhook for
  application-domain alerts (import failures, validation-gate trips,
  row-count anomalies, promotion failures, admin-auth failures) (3/3;
  B2 [[25]][[31]]). B1 adds an alert-throttle table keyed by
  `{alertType, sourceSystem, day}` (B1 (approx)).
- **`change_events` persisted in Postgres in addition to OTEL logs** —
  field-level diffs powering `GET /api/admin/import-runs/:id` (3/3;
  B2 [[26]]).
- Preview/production separation with separate databases; cron and
  destructive admin operations disabled in preview; functions co-located
  with the database region (3/3; B2 [[27]], B3 [[21]][[23]]).
- **Cost posture ≈ zero incremental** at this scale; the first non-trivial
  later cost would be Elasticsearch Serverless — a further reason it stays
  deferred (3/3; B2 [[28]], B3 [[22]][[24]]).

### 3.13 Testing posture

- **Vitest** units for parsers, normalisers, validators, ID generation,
  status mapping, forbidden-field enforcement, log scrubbing, cursors,
  ranking; **Supertest** route-level integration (auth, filters,
  pagination, stale-serving-after-failed-import); **Playwright** smoke only
  (minimal status/docs page); **Stryker** mutation tests scoped to critical
  pure logic (token verification, status mapping, scrubbing, ranking,
  promotion gates) (3/3; B2 [[4]]).
- Fixtures for every nation including closed/proposed/independent/special/
  PRU rows, malformed rows, duplicate-ID rows, overseas rows, and rows
  carrying forbidden contact fields (3/3).
- DI-style runtime config; **no `process.env` mutation in tests** — all
  three briefs independently cite this repository's testing conventions as
  the model (B2 [[4]], B3 [[6]], B1 (approx)).

### 3.14 Client package

- **`@oaknational/school-data-search-client`**: public npm package, typed
  fetch-based server-side client; useless without a bearer token; no
  browser credential support; typed error classes; TSDoc with RSC and
  route-handler examples (3/3; B2 [[24]]).
- **No separate contracts package**: the client package hosts the shared
  request/response contracts that the API app also consumes (B2 [[24]],
  B3 explicit; B1 compatible). NOTE: the contract-layer source of truth is
  restructured by owner requirement 2 — see C-03 and §6 before treating
  this shape as settled.

## 4. Divergence matrix — named owner decisions

Each entry is a fork the owner decides (with engineering considerations
attached, including where this repository's doctrine pulls). The plan
carries these as explicit gates; none is silently defaulted.

### D-01 Canonical status enum

- **B1**: `open, open_but_proposed_to_close, proposed_to_open, closed,
  inactive, unknown` — maps 1:1 onto GIAS's public status vocabulary
  (B1 (approx); GIAS statuses confirmed in B2 [[6]]).
- **B2**: `open, closed, proposed, opening, closing, merged,
  temporarily_closed, inactive, unknown` — richer lifecycle, but `merged` /
  `temporarily_closed` are not grounded in any cited source vocabulary
  (flagged V-12).
- **B3**: `open, closed, proposed, mothballed, open_but_proposed_to_close,
  unknown` — `mothballed` reflects Scottish/Welsh source terminology.
- Considerations: small-and-stable beats expressive-but-unmapped (repo
  strict-and-complete doctrine: every enum value must be reachable from a
  mapped source value, else it fails ingestion); source `sourceStatus` is
  preserved verbatim alongside the canonical value in all three models, so
  the canonical enum can stay minimal without losing fidelity.

### D-02 Canonical establishment-type enum

- **B1**: 16 values (adds `higher_education`, `childrens_centre`,
  `early_years_setting`, `sixth_form_or_fe_college` combined).
- **B2**: 15 values (adds `local_authority_school`,
  `service_children_education`, splits `further_education_college` /
  `sixth_form_college`).
- **B3**: 13 values (`mainstream_school` baseline, single
  `british_school_overseas`, no `offshore_school`).
- Considerations: the source registers expose materially different type
  vocabularies (B2 [[12]]); the enum is a normalisation target, so the real
  decision is the **mapping-table coverage per source** — choose the enum
  whose values can all be reached by at least one mapped source value, and
  let everything else fail-until-mapped (3/3 validation posture, §3.4).

### D-03 Canonical phase enum

- **B1**: `nursery, primary, middle, secondary, all_through, sixth_form,
  further_education, special, not_applicable, unknown` (treats `special` as
  a phase).
- **B2**: `early_years, primary, middle, secondary, all_through, post_16,
  not_applicable, unknown`.
- **B3**: as B2 but **without `middle`** — England's GIAS data includes
  middle schools, so B3's set cannot represent them faithfully.
- Considerations: phase and establishment-type must not encode the same
  fact twice (B1's `special` phase overlaps its `special_school` type);
  `post_16` vs `sixth_form`+`further_education` granularity is a consumer
  question — what will Oak applications filter by?

### D-04 Snapshot substrate and retention

- **B1**: private Vercel Blob for redacted snapshots + Postgres metadata;
  gzip; 365-day retention; optional unredacted quarantine ≤ 7 days,
  disabled by default (B1 (approx)).
- **B2**: redacted snapshot artefact + import metadata persisted; substrate
  unspecified; retention unspecified (B2 [[3]]).
- **B3**: redacted JSON/JSONL snapshots (Blob implied by cost note) +
  per-row source snapshots in Postgres; 180-day retention (B3).
- Considerations: introducing Vercel Blob is a new vendor storage surface
  for this repository (operational posture, OIDC vs token auth — B1
  (approx)), and snapshots in Blob couple the data layer to the vendor —
  migrating out later is a bulk re-store operation (reversal cost worth
  weighing now); at this data scale Postgres-only storage of redacted rows
  may be simpler (First Question) — one fewer service, one transaction
  boundary; retention length is a data-governance call. The unredacted
  quarantine option exists only in B1 and weakens the 3/3
  "never persist unredacted" posture — including it is a deliberate owner
  choice, not a default.
- Adjacent retention fork, same decision family: **`change_events`
  retention** — B2 names "a limited period such as 90 days"; B1 and B3
  store change events with no stated retention. A named parameter for the
  owner (or an explicit documented default), never a silent inheritance of
  B2's figure.

### D-05 Admin-token rotation mechanism

- **B1**: HTTP endpoint `POST /api/admin/tokens/refresh` guarded by an
  `ADMIN_BOOTSTRAP_SECRET` env var; returns the new token exactly once
  (B1 (approx)).
- **B2**: explicitly **do not** expose a rotation HTTP endpoint in MVP;
  ship an operational script (`pnpm admin:rotate-token`) — smaller attack
  surface (B2 [[21]]).
- **B3**: operational script using a long-lived bootstrap secret from
  Vercel env (B3).
- Direct contradiction (B1 vs B2/B3, 2/3 for script-only). Considerations:
  an always-on token-minting route is standing attack surface guarded by a
  static secret; a script is operationally clunkier but smaller surface;
  either way the bootstrap secret's custody is the real control point.

### D-06 Cron mechanics for "02:00 Europe/London"

- **B2/B3**: hourly cron (`5 * * * *` style) hitting a guarded refresh
  endpoint; handler converts to Europe/London and runs only when local
  hour = 02; advisory lock + `last_scheduled_local_date` idempotency
  (B2 [[18]], B3 [[17]]). B2 adds: Vercel does not guarantee minute-perfect
  invocation, which the hourly+guard pattern absorbs.
- **B1**: two UTC schedules (`0 1 * * *` and `0 2 * * *`) + the same local
  guard (B1 (approx)).
- Considerations: identical correctness; hourly+guard buys tolerance to
  invocation jitter at the cost of 22 no-op invocations/day; two-schedule
  buys fewer invocations with slightly more config subtlety. Both need the
  same in-handler guard, lock, and idempotency.

### D-07 Scotland source composition

- **B1**: School Roll & Locations geospatial layer as the PRIMARY
  maintained register (SchUID unique; SEED preserved as additional
  identifier) + Independent Schools register; flags that the geospatial
  layer's licence metadata needs implementation-time legal confirmation
  (B1 (approx)).
- **B2**: three sources — School Contact Details (primary register),
  Independent register, School Roll & Locations for coordinates/enrichment
  (B2 [[8]][[9]]).
- **B3**: the contact-details workbook trio (open; opened/closed since
  2006; renamed) + Independent register; geospatial layer not in its MVP
  source list (B3 [[11]]).
- Considerations: only the contact-details publication carries
  opened/closed and renamed-school history (strong `active`/status/
  previous-names support — B3 [[11]]); only the geospatial layer carries
  coordinates, but its licence needs the V-06 sign-off and its published
  vintage needs the V-10 currency check; SchUID-vs-SEED identity choice
  determines `sourceId` for Scotland (B2 [[8]]).

### D-08 Northern Ireland coordinates path

- **B2**: Open Data NI location dataset usable only after an
  implementation-time freshness check (B2 [[10]]).
- **B3**: stale dataset is a schema hint only; if the Institution Search
  export proves unstable, the fallback is a controlled scraper around the
  official export flow — never the stale CSV (B3 [[12]][[13]]).
- **B1**: fallback/geospatial aid after row-identity validation
  (B1 (approx)).
- Considerations: NI may simply ship without coordinates in MVP (B2 names
  this explicitly as a follow-on option); a scraper around an official form
  is operationally fragile and needs its own gate.

### D-09 Cache headers for metadata and detail

- **B2**: `no-store` everywhere (simplest, most conservative; B2 [[23]]).
- **B3**: `metadata` private max-age=300 + SWR=60; `detail` private
  max-age=3600 + SWR=300 (B3 [[19]]).
- **B1**: private max-age=300 on metadata/detail + `CDN-Cache-Control:
  no-store` + `Vary: Authorization` (B1 (approx)).
- Considerations: only private (browser/process-local) caching differs —
  all three keep shared CDN caches off; for server-to-server consumers a
  `private` directive mostly benefits in-process HTTP caches, so the real
  question is whether consumer-local caching is standardised in the client
  package instead (3/3 sanction consumer-local caching).

### D-10 Token format and cursor integrity

- Token format: **B1** `oak_sds_live_<tokenId>_<secret>` + `token_prefix`
  column + HMAC-SHA-256 with a pepper (`TOKEN_HASH_PEPPER`); **B3**
  `oak_sds_<tokenId>_<secret>` split-token lookup-then-hash; **B2** token
  ID + high-entropy hash, format unspecified (B2 [[21]]).
- Cursor integrity: **B1** HMAC-signed cursors (`CURSOR_SIGNING_SECRET`),
  reject tampering; **B3** cursor bound to a request hash so reuse across
  changed `q`/filters is rejected; **B2** opaque base64url cursor embedding
  `datasetVersionId` + sort tuple.
- Considerations: split-token (ID + secret) gives O(1) lookup and
  per-consumer audit; signing cursors adds a secret to manage — worth it
  only if cursor tampering is a real threat for an authenticated internal
  API; binding cursors to the dataset version (3/3) is the load-bearing
  correctness property.

### D-11 Name-variant modelling

- **B2**: separate alias rows (`school_aliases`); **B3**:
  `school_name_variants` rows (primary/official/previous/alternative);
  **B1**: `previous_names`/`alternative_names` jsonb arrays on `schools`.
- Considerations: rows participate in indexed search directly (2/3 shape;
  matches the trigram-index-per-name approach); jsonb is simpler but pushes
  alias search into the document build; repo strictness doctrine favours
  explicitly modelled rows (decompose-at-the-tension). Reversal cost:
  either shape becomes a data migration across all promoted datasets once
  history accumulates — a quiet one-way door, so decide once, early.

### D-12 Release-model naming

- `dataset_versions` + `live_dataset_version` singleton pointer (B1/B2) vs
  `dataset_releases` + mark-one-current (B3). Same mechanics; pick one
  vocabulary and use it everywhere (one-concept-one-name repo principle).

### D-13 Ranking mechanism

- **B1**: explicit numeric weight formula (exact=1000, official=950,
  prefix=800, alias-prefix=700, FTS=300·ts_rank_cd, trigram=100·similarity,
  alias-trigram=75·similarity, active +50, country-match +25)
  (B1 (approx)).
- **B2/B3**: ordered deterministic buckets/tiers with the same signal set
  and the same tie-breaks (`active DESC, name_norm ASC, id ASC`)
  (B2 [[20]], B3 [[5]]).
- Considerations: identical test surface (ground-truth ranking fixtures,
  3/3); numeric weights are tunable but invite magic-number drift; buckets
  are more explainable. Either way the ranking must remain deterministic
  and fixture-tested.

### D-14 Search-normalisation locus

- **B1**: application-code normaliser (NFKD, diacritic strip, `&`→"and",
  type-word preservation) feeding pre-normalised columns (B1 (approx)).
- **B2/B3**: database-side `simple` + `unaccent` text-search configuration
  (B2 [[19]], B3 [[5]]).
- Considerations: app-code normalisation is unit-testable in isolation and
  keeps SQL simpler; DB-config normalisation keeps one normalisation locus
  for FTS and trigram alike; mixed approaches risk subtle mismatch between
  indexed and queried forms (the real invariant: ONE normalisation
  function, applied identically at index and query time). Reversal cost:
  switching locus after indexes are built means a full reindex — a cron
  run at POC scale, a maintenance window at production scale.

### D-15 Inspection modelling (with a cross-brief factual conflict)

- **B3**: generic `inspection { body, externalId, url,
  lastInspectionDate }` replacing England-specific `ofsted` — fits four
  inspectorates (B3).
- **B1**: `ofsted` jsonb retained (B1 (approx)).
- **B2**: model inspection/report **links** when present and do NOT model
  or promise a current overall rating field, because a 2024 GIAS update
  removed Ofsted rating and last-inspection date from public downloads/API
  (B2 [[6]]).
- The factual conflict (does the public extract still carry
  last-inspection data at all?) is verification item V-03; the modelling
  fork (generic vs Ofsted-specific) is the owner decision. Considerations:
  generic `inspection` is the only shape that serves all four nations; B2's
  finding caps what can be promised regardless of shape.

### D-16 App runtime framework — RESOLVED: Next.js (G-2, 2026-06-04)

The briefs vote 3/3 for Next.js App Router, on the service's own merits
(first-class Vercel Functions integration, `instrumentation.ts` OTEL hook,
route-segment `maxDuration`, the documented Route-Handler shape) and in
line with the owner's standing intent. **This is a Next.js app — it was
always the plan.** Raising the runtime as a fork over-extended the
frame-audit: the standalone→in-repo frame change (C-01) bears on
scaffolding, not on the runtime reasoning, so the briefs' convergence was
never in genuine contention here. That Next.js is the monorepo's first Next
workspace (the existing MCP app, `apps/oak-curriculum-mcp-streamable-http`,
declares `"framework": "express"`) is an implementation consequence — a new
framework-class surface in the toolchain — not a reason to reopen the
choice. The app workspace bootstraps via `pnpm create next-app@latest` and
is adapted into the monorepo. Topology and preview-safety consequences are
in C-08; the remaining open G-2 mechanic is the cron schedule (D-06).

## 5. Collision ledger — briefs vs owner requirements vs repo doctrine

Each entry: the brief assumption, what it collides with, and the corrective
frame the plan adopts (or gates).

### C-01 Standalone-monorepo frame (ALL briefs) vs owner requirement 1

Every brief designs `oak-school-data-search` as a new repo with a Phase 0
bootstrap. Owner requirement 1 invalidates the frame: the POC builds in THIS
repository as workspace(s); pnpm/Turbo/strict-TS/test tooling/hooks/CI are
inherited, not built. **No Phase 0 is carried into the plan.** Extraction is
a named post-POC gate.

### C-02 All-domain-logic-in-app layout (ALL briefs) vs layer doctrine

All three put parsers, normalisers, validation, promotion, search, auth, and
contracts inside `apps/api/src/**`. This repository's doctrine
(`principles.md` §Layer Role Topology, §Separate Framework from Consumer,
§Architectural Model): apps are thin user interfaces; domain logic lives in
SDK/library workspaces; distinct architectural layers live in distinct
workspaces; "could another app need this?" routes shared logic to packages.
The corrective frame: the briefs' module map becomes **workspace-decomposition
candidates** (for example: ingestion framework vs Oak-source consumers;
canonical model + contracts; search; the thin HTTP app — framework per
D-16). Two further seams are named as future extraction points even if
they start co-located (Context Specificity Gradient): the **token/auth
subsystem** (hash-at-rest, constant-time verify, rotation — reusable by
any authenticated internal API) and the **search-document builder** (the
canonical-dataset → search-document boundary that §3.8 already names as
the later Elasticsearch seam). Two execution prerequisites ride with the
decomposition: (1) **workspace boundary rules** — the repo enforces
dependency direction via generated ESLint/depcruise rule sets (ADR-041);
new workspaces must be added to that rule surface BEFORE their first code
lands, not after; (2) **Drizzle schema ownership** — table definitions and
the migration runner belong to the data-access layer, importing canonical
types from the model workspace, so the model workspace stays free of
runtime database dependencies. The decomposition itself is a named design
decision in the plan (architecture-reviewer input; owner-visible), not a
silent restructure.

### C-03 Zod-contracts-in-client (ALL briefs) vs owner requirement 2

The briefs' contract source of truth is hand-authored Zod in the client
package. Requirement 2 makes the OpenAPI specification the contract
artefact that MUST exist, be strict and comprehensive, and be 3.x-compliant.
Two sources of truth cannot both be canonical — the contract layer needs a
single source with everything else generated or derived. Full analysis and
decision space in §6; carried as a blocking gate in the plan.

### C-04 Build-then-test phasing (B1/B3 phase plans) vs TDD-as-design

B1 Phase 11 and B3 Phase 10 deliver "tests" as a late phase after API/auth
phases. This repository's doctrine: a test describes a system state and
product code is the path into it — two halves of one act of design landing
atomically (`tdd-as-design.md`; `testing-strategy.md`). The plan re-sequences
all brief phases into TDD cycles as the unit of landing; no test-backfill
phases exist.

### C-05 Throw-based error sketches vs the Result pattern

Brief client/API sketches model failures as thrown typed error classes.
Repo doctrine: `Result<T, E>` with explicit case handling and preserved
cause chains (`principles.md` §Code Design; `use-result-pattern` rule).
Service internals follow Result. The published client's PUBLIC error surface
is a boundary-semantics decision (npm consumers may expect throw-based
APIs) — named in the plan's contract gate, not silently decided either way.

### C-06 GitHub-Actions/semantic-release assumptions vs repo tooling

B1/B3 specify GitHub Actions pipelines and semantic-release. In-repo, the
existing gate stack (Husky hooks, repo CI, repo validators, commit
conventions) governs; release/publishing tooling for a new public package is
part of the C-07 gate rather than copied from the briefs.

### C-07 Public npm publishing during POC vs the POC boundary

All briefs assume `@oaknational/school-data-search-client` publishes to npm
in MVP. Owner requirement 1 frames this phase as a POC that may not be taken
forward; publishing a public package is an outward-facing, hard-to-reverse
act. **Owner gate**: build the package workspace; publish only on explicit
owner direction (possibly at/after go/no-go).

### C-08 Standalone deployment topology vs in-repo operational reality

Briefs assume a dedicated Vercel project with its own env/cron/preview
setup. In-repo, the collision is sharper than operational wiring:

- **App runtime is Next.js (D-16), not a fork** — the briefs' 3/3 vote
  stands on the service's merits and the owner's standing intent. The
  standalone→in-repo frame change bears on scaffolding (C-01), not the
  runtime; raising it as a fork over-extended the frame-audit.
- **Vercel project topology is determined, not a fork**: the service is a
  distinct Next.js app, and a Vercel project serves one framework shape, so
  it gets its own Vercel project.
- **Preview-safety posture is Neon-contingent, not an unconditional
  block**: under Neon's Vercel integration each preview deployment gets an
  isolated database branch, so preview ingestion writes to that branch, not
  shared/production data — the corruption risk that would force "disable
  admin/cron in preview" largely dissolves. The posture is gated on
  verifying the per-preview provisioning and whether Vercel runs cron on
  preview deployments at all (V-08); external source fetches still fire from
  a preview regardless of DB isolation. Settle alongside G-4.
- **Function-config**: ingest routes need raised Fluid Compute /
  `maxDuration` ceilings (V-08); in the service's own Vercel project this is
  a local config concern, not a blast-radius risk to other apps.

Neon marketplace provisioning, env var management, and project naming ride
with these as plan workstream items with owner visibility; B1's Vercel
Blob adds a further vendor surface only if D-04 selects it.

### C-09 Rate limiting deferred (briefs) vs repo security posture

Briefs defer rate limiting ("if later needed"). This repository has
app-layer rate limiting precedent on its public HTTP MCP server. For an
internal bearer-authenticated service behind Cloudflare the deferral may be
right — but it is a named security-posture decision for the plan's security
review, not an inherited default.

### C-10 Hand-rolled env loading vs existing repo capability (positive)

Briefs specify hand-written Zod-validated env modules (`src/lib/env.ts`).
This repository already provides schema-driven env validation as reusable
workspaces: `@oaknational/env` (`packages/core/env`) +
`@oaknational/env-resolution` (`packages/libs/env-resolution`) — B2 itself
cites the env package as the conventions reference, B2 [[22]]. Reuse, don't
duplicate. Likewise structured-OTEL conventions
(`packages/core/observability`, cited by B2 [[26]]) are a genuine import
target. **Correction recorded at review**: `packages/libs/search-contracts`
(cited by B2 [[15]]) is NOT reusable here — its exports are derived from
Oak curriculum search index schemas (field inventories, stage contract
matrices for the curriculum pipeline); it serves as a pattern reference
only, and the new service's contracts must not be placed inside it (that
would couple the school-data domain into the curriculum search pipeline).
The genuine leverage set is env + env-resolution + observability — still
a gain the standalone frame hid, just a smaller one than the briefs'
citations suggest.

## 6. The produced-spec contract — ADR material (ADR-190)

> **Owner correction (2026-06-04):** this is NOT an "inversion" of the
> Cardinal Rule. Schema-first (the Cardinal Rule) is specific to CONSUMING
> the upstream Oak Open Curriculum spec; it does not govern a service's own
> produced contract. Producing this service's spec is a separate concern,
> decided at G-1 as **F-B (Zod-canonical → OpenAPI + code)**. The analysis
> below is retained as decision history; read "inversion" framing throughout
> as "a new, separate spec-producing concern".

**The structural fact**: this repository's cardinal rule makes an OpenAPI
schema the single source of truth that everything else is GENERATED from —
but in the consuming direction (Oak's published Open Curriculum API spec →
`pnpm sdk-codegen` → all types/validators/tools; ADR-029 no-manual-API-data,
ADR-030 SDK-single-source-of-truth, ADR-031 generation-time extraction;
`schema-first-execution.md`). The school-data-search service is the first
surface this repository builds that must PRODUCE a spec (owner
requirement 2). The doctrine question is how the generated-state principle
maps onto a spec-producing service — a separate concern, not a reversal of
the consume-direction Cardinal Rule.

**The doctrine that actually transfers**: in the consuming direction the
spec is canonical because Oak does not own it — it is an upstream oracle.
In the producing direction Oak owns everything, so WHAT is canonical is an
authoring choice. The principle that transfers is therefore not
"spec-first" itself but its generator: **generated state beats authored
state; one source of truth; heavy lifting at codegen time**
(`principles.md` §Cardinal Rule, §Context Specificity Gradient). The repo
also already holds OpenAPI↔Zod bridge capability in the consuming
direction (`packages/core/openapi-zod-client-adapter`), evidence that this
toolchain class is in-estate.

**Decision space** (each shape can satisfy requirement 2; they differ in
what is hand-authored canon and what is generated; presented unweighted —
the owner decides at the gate):

- **F-A Spec-first.** Hand-author the OpenAPI 3.x document as the contract
  source of truth; generate server-side validation, route types, the typed
  client and its runtime validators, and contract tests from it. The spec's
  strictness is a property of the canon itself. Cost: maintaining a
  hand-authored spec as the single canon; a spec-to-everything generator
  toolchain to stand up (V-11).
- **F-B Code-first.** Hand-author Zod schemas (the briefs' shape); generate
  the OpenAPI document from them at build time. Closest to the briefs'
  design. Cost: "strict, comprehensive, fully 3.x compliant" becomes a
  derived property needing its own CI verification gate; drift pressure
  between authored schemas and emitted spec.
- **F-C Shared-definition codegen.** Hand-author neither the spec nor the
  Zod as canon: a single schema definition (a schema language or a typed
  definition source) generates BOTH the OpenAPI document and the runtime
  schemas/types/client at build time. Strongest fit to
  generated-state-beats-authored-state; the spec and the code cannot
  drift because both are emissions. Cost: the definition language/tool
  choice is load-bearing (V-11) and the team works one abstraction above
  both artefacts.
- Under every shape: spec versioning, where the spec is served (for
  example `GET /api/openapi.json` and/or a repo-tracked artefact), and
  spec-quality gates (3.x validation in CI) are part of the same decision.

**Why this is ADR-shaped**: it generalises beyond this service ("services
this repository builds expose OpenAPI specs as their contract source of
truth, with generated validation/types/clients") and it extends the
repository's central architectural doctrine to a new direction of flow. Per
repo practice (ADRs permanent, plans ephemeral), the report **names** the
candidate; the plan carries a blocking owner gate (decide F-A / F-B / F-C
and ratify the ADR) before any contract code is written. Toolchain choices
(which generator libraries) are vendor surfaces verified at the consuming
workstream per `verify-vendor-call-shapes-at-plan-author-time` (V-11).

**Scope note**: requirement 2 says "ALL APIs". Within this project's
requirements file that plainly binds every API surface of the new service
(public and admin). Whether the owner also intends it as repo-wide policy
for other HTTP surfaces is a clarification the gate asks — it changes the
ADR's scope, not this service's obligation.

## 7. Build-time verification ledger

Claims that no brief grounds (or briefs contradict), flagged for
verification at the named build moment — never asserted by this report or
the plan.

| ID | Item | Source of doubt | Verify when |
| --- | --- | --- | --- |
| V-01 | GIAS automated-fetch viability (downloads blocked probes; bot policy; exact download endpoints) | B1 reference note: GIAS blocks automated fetches; 2 owner probe URLs bot-blocked | First ingestion WS (England adapter) — named early milestone |
| V-02 | GIAS extract-level licence string for the live download | B3 could not retrieve it; B2 cites page-level OGL | England adapter; capture licence string per snapshot at fetch time; block public display until confirmed (B3 acceptance criterion) |
| V-03 | Ofsted rating / last-inspection availability in current GIAS public downloads/API | B2 [[6]] cites a 2024 removal; B1/B3 field models still carry inspection-date fields | England source-schema mapping WS |
| V-04 | Wales **closed/historical**-school coverage (independents CONFIRMED covered: the GOV.WALES address list includes independent schools — verified 2026-06-04; the earlier independent concern was a B2-only artefact, retracted) | B3 [[10]]: only an ad-hoc closures dataset, no continuous machine-readable closed register | Wales adapter WS; ship current + independent Wales, document the closed/historical gap (best-effort, lower-priority for find-your-current-school) |
| V-05 | NI Institution Search export automation (machine interface) + NI coordinates freshness | B3 [[13]] export interface unconfirmed; B2 [[10]] freshness unconfirmed | NI adapter WS — named early milestone |
| V-06 | Scotland School Roll & Locations licence/attribution terms | B1 flags non-OGL-clean aggregator metadata; legal sign-off needed before public display | Scotland adapter WS + pre-release legal gate |
| V-07 | DataMapWales maintained-layer currency | B2 [[7]] says modified 2026-04-23; B1 table says 2025-03-21 — cross-brief conflict | Wales adapter WS (read the layer's live metadata) |
| V-08 | Vendor call shapes: `attachDatabasePool`, `@vercel/otel` registration, Neon TCP pooling under Fluid Compute, `maxDuration` ceilings (300 s default / 800 s max claimed, B3 [[18]]) | Plan-author-time verification deferred to consuming WS per repo rule | Each consuming WS, against installed/published docs |
| V-09 | GIAS ingest route (public downloads vs legacy SOAP) and exact file endpoints | B3 [[2]] notes SOAP exists; downloads recommended | England adapter WS |
| V-10 | Scotland geospatial dataset vintage (URLs reference `SG_SchoolRoll_2023*`) | B1 (approx) URL set | Scotland adapter WS |
| V-11 | OpenAPI generator toolchain options for the §6 gate (spec-first codegen vs zod-to-openapi class of tools) | No brief addresses OpenAPI at all | Contract-layer WS, after the §6 owner gate |
| V-12 | Source status vocabularies justifying any canonical status value (esp. B2's `merged` / `temporarily_closed`) | Not grounded in cited source pages | Per-nation mapping-table WS (D-01 input) |

## 8. Citation key (complete, self-contained)

### 8.1 Brief 2 anchors (position-exact, verified)

| Anchor | URL |
| --- | --- |
| [[1]] | <https://nextjs.org/docs/app/getting-started/route-handlers> |
| [[2]] | <https://vercel.com/docs/postgres> |
| [[3]] | <https://get-information-schools.service.gov.uk/establishments/establishment/details/149180> |
| [[4]] | <https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/package.json> |
| [[5]] | <https://www.get-information-schools.service.gov.uk/Guidance/General> |
| [[6]] | <https://www.get-information-schools.service.gov.uk/> |
| [[7]] | <https://datamap.gov.wales/layers/geonode%3Amaintained_schools_wg> |
| [[8]] | <https://www.gov.scot/publications/school-contact-details/> |
| [[9]] | <https://maps.gov.scot/server/rest/services/ScotGov/UtilityGovernmental/MapServer/0?f=pjson> |
| [[10]] | <https://apps.education-ni.gov.uk/appinstitutes/default.aspx> |
| [[11]] | <https://www.education-ni.gov.uk/articles/crown-copyright-education> |
| [[12]] | <https://www.get-information-schools.service.gov.uk/responsibilities> |
| [[13]] | <https://get-information-schools.service.gov.uk/Search?NoResults=True&SearchType=Text> |
| [[14]] | <https://vercel.com/docs/postgres.md> |
| [[15]] | <https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/packages/libs/search-contracts/README.md> |
| [[16]] | <https://vercel.com/docs/cron-jobs/manage-cron-jobs> |
| [[17]] | <https://vercel.com/docs/functions/configuring-functions/duration> |
| [[18]] | <https://vercel.com/docs/cron-jobs> |
| [[19]] | <https://www.postgresql.org/docs/current/datatype-textsearch.html> |
| [[20]] | <https://www.postgresql.org/docs/current/pgtrgm.html> |
| [[21]] | <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> |
| [[22]] | <https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/packages/core/env/README.md> |
| [[23]] | <https://developers.cloudflare.com/cache/concepts/default-cache-behavior/> |
| [[24]] | <https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/packages/sdks/oak-curriculum-sdk/docs/mcp/README.md> |
| [[25]] | <https://vercel.com/docs/tracing/instrumentation> |
| [[26]] | <https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/packages/core/observability/README.md> |
| [[27]] | <https://vercel.com/docs/functions> |
| [[28]] | <https://vercel.com/docs/functions/usage-and-pricing> |
| [[29]] | <https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/pnpm-workspace.yaml> |
| [[30]] | <https://orm.drizzle.team/docs/migrations> |
| [[31]] | <https://vercel.com/docs/alerts> |

### 8.2 Brief 3 anchors (position-exact, verified)

| Anchor | URL |
| --- | --- |
| [[1]] | <https://vercel.com/docs/postgres> |
| [[2]] | <https://www.get-information-schools.service.gov.uk/> |
| [[3]] | <https://www.get-information-schools.service.gov.uk/Guidance/General> |
| [[4]] | <https://raw.githubusercontent.com/DFE-Digital/gias-query-tool/main/ddl/tables/create_schools_raw.sql> |
| [[5]] | <https://www.postgresql.org/docs/current/pgtrgm.html> |
| [[6]] | <https://raw.githubusercontent.com/oaknational/oak-open-curriculum-ecosystem/main/package.json> |
| [[7]] | <https://www.get-information-schools.service.gov.uk/Establishments/Establishment/Details/152299> |
| [[8]] | <https://www.gov.wales/addresses-and-phone-numbers-schools-and-pupil-referral-units> |
| [[9]] | <https://stats.gov.wales/en-GB> |
| [[10]] | <https://www.gov.wales/ad-hoc-statistical-requests-7-18-october-2024> |
| [[11]] | <https://www.gov.scot/publications/school-contact-details/> |
| [[12]] | <https://www.opendatani.gov.uk/dataset/locate-a-school> |
| [[13]] | <https://apps.education-ni.gov.uk/appinstitutes/default.aspx> |
| [[14]] | <https://www.gov.uk/government/publications/british-schools-overseas-inspection-reports/british-schools-overseas-accredited-schools-inspection-reports> |
| [[15]] | <https://get-information-schools.service.gov.uk/about/> |
| [[16]] | <https://orm.drizzle.team/docs/migrations> |
| [[17]] | <https://vercel.com/docs/cron-jobs> |
| [[18]] | <https://vercel.com/docs/fluid-compute> |
| [[19]] | <https://developers.cloudflare.com/cache/concepts/default-cache-behavior/> |
| [[20]] | <https://vercel.com/docs/tracing/instrumentation> |
| [[21]] | <https://vercel.com/docs/functions> |
| [[22]] | <https://vercel.com/docs/cron-jobs/manage-cron-jobs> |
| [[23]] | <https://neon.com/docs/guides/vercel-branch-cleanup> |
| [[24]] | <https://vercel.com/docs/observability.md> |

### 8.3 Brief 1 verified official source links (owner-supplied, approximate, no position claims)

England/GIAS: <https://www.get-information-schools.service.gov.uk/> ·
<https://www.get-information-schools.service.gov.uk/Downloads> (bot-blocks
automated fetches; no guessed per-file endpoints) ·
<https://www.gov.uk/guidance/get-information-about-schools>

Wales: <https://www.gov.wales/addresses-and-phone-numbers-schools-and-pupil-referral-units> ·
<https://www.gov.wales/sites/default/files/publications/2026-04/address-list-schools-values.ods> ·
<https://datamap.gov.wales/layers/geonode%3Amaintained_schools_wg> ·
<https://datamap.gov.wales/capabilities/layer/7525/?ows_service=wfs>

Scotland: <https://www.gov.scot/publications/school-contact-details/> ·
<https://www.data.gov.uk/dataset/9a6f9d86-9698-4a5d-a2c8-89f3b212c52c/scottish-school-roll-and-locations> ·
<https://maps.gov.scot/ATOM/shapefiles/SG_SchoolRoll_2023_Table.zip> ·
<https://maps.gov.scot/ATOM/shapefiles/SG_SchoolRoll_2023.zip> ·
<https://maps.gov.scot/server/rest/services/ScotGov/UtilityGovernmental/MapServer/0> ·
<https://www.gov.scot/publications/independent-schools-in-scotland-register/>

Northern Ireland: <https://apps.education-ni.gov.uk/appinstitutes/default.aspx>
(export via the page's form; no direct URL) ·
<https://www.opendatani.gov.uk/@department-of-education/locate-a-school>

Overseas (considered): <https://www.gov.uk/government/publications/british-schools-overseas-inspection-reports/british-schools-overseas-accredited-schools-inspection-reports> ·
<https://www.gov.uk/guidance/education-overseas-for-service-children>

## 9. What happens next

The companion plan collection
([`.agent/plans/school-data-search/`](../plans/school-data-search/README.md))
turns §3 into sequenced TDD workstreams and carries §4's forks, §5's gated
collisions, and §6 as explicit owner gates, with §7 as named verification
steps inside the owning workstreams. Reviewer dispositions for this report
(assumptions-expert; architecture-expert-betty) are recorded in §10.

## 10. Reviewer dispositions

Both reviewers dispatched 2026-06-03 on this synthesis BEFORE plan
authoring (owner-mandated sequence). Findings were validated against the
artefacts before acting; reviewer-claimed facts were independently
re-verified in-repo where load-bearing.

**assumptions-expert — READY-WITH-CHANGES.** 12 grounding spot-checks
passed; no decision smuggling found. Applied: §3.9 heading corrected to
"convergent 10-route core" (B1/B3 carry one extra route each, held in
D-05/D-06); `change_events` retention added as a named fork (D-04);
§6 re-presented unweighted (resolved jointly with the betty F-C finding).
Rejected with reasons: (a) "B2 [[1]] imprecise for Node-vs-Edge" — the
citation model is brief-position-based (§1.2) and B2's Node-not-Edge
sentence sits in the [[1]]-anchored passage; (b) "no-total-counts should
grade 2/3" — the conservative B1-positive grading stands (understating
confidence is the safe direction; the position is non-load-bearing).

**architecture-expert-betty — READY-WITH-CHANGES.** All three blockers
independently re-verified in-repo and accepted: (1) no workspace uses
Next.js and the deployed app declares `"framework": "express"` → new fork
D-16 + C-08 upgraded (the briefs' 3/3 Next.js vote was frame-dependent);
(2) `packages/libs/search-contracts` exports are curriculum-search-domain
specific → C-10 corrected (pattern reference only, not an import target);
(3) §6 decision space was incomplete → F-C added and the cardinal-rule
parallel corrected to the generated-state principle. Should-fixes applied:
auth/token + search-document-builder named as future-extraction seams,
ADR-041 boundary-rule prerequisite, and Drizzle schema ownership (C-02);
cron/topology sub-risks named (C-08); one-way-door labels added (§3.3,
D-04, D-11, D-14). Plan-side items carried into the companion plan: the
framework gate before scaffolding, boundary-rules-before-first-code, and
preview-safety as a tested correctness property.
