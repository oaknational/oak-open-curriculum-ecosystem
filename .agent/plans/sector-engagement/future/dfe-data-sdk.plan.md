---
name: "DfE Data SDK (Explore Education Statistics API)"
overview: "Strategic seed for a typed, transport-agnostic SDK as a thin layer over the DfE Explore Education Statistics (EES) public API, living in a new workspace. Schema-first from the API's published OpenAPI document; runtime-unknown data narrowed at the boundary; Result-pattern errors; zero Oak-domain logic. Workspace language (TypeScript or Python) is a named promotion-time decision — the owner has explicitly authorised a Python workspace (2026-06-12), which would also unlock future Python-workspace integration into this monorepo. The DfE source is complementary to the EEF corpus, never a replacement (owner posture, 2026-06-12): the repo pulls on multiple sources to maximise the value of the MCP app and related tooling. Gated on a named Oak consumer with ratified value — candidates already on file: the EEF school-leadership evidence surface, EEF outcome-evaluation baselines, and DfE-statistics enrichment of the school-context workflows the EEF corpus serves."
type: seed
status: future
related_plans:
  - "../eef/future/eef-school-leadership-evidence.plan.md"
  - "../eef/future/eef-outcome-evaluation-infrastructure.plan.md"
  - "../eef/reference/eef-data-surfacing-gap-research-2026-06-12.md"
specialist_reviewer: "assumptions-expert, type-expert, architecture-expert-betty, architecture-expert-barney, docs-adr-expert"
todos:
  - id: establish-consumer-value
    content: "Establish the first named Oak consumer and its ratified value before any design: which Oak surface needs DfE statistics (school-leadership context, outcome-evaluation baselines, school-context workflows), what decisions the data changes, and which EES datasets serve it. Output is a ratified consumer-value statement, not a tool or SDK design."
    status: pending
    depends_on: []
  - id: ratify-workspace-and-codegen-shape
    content: "On consumer evidence, ratify the workspace shape at promotion: language (TypeScript or Python — decided by the first consumer's runtime and the §Workspace language considerations; owner authorised Python 2026-06-12), workspace name (TS recommendation: packages/sdks/dfe-ees-sdk, package @oaknational/dfe-ees-sdk), whether codegen generalises oak-sdk-codegen, stands as a sibling generator, or uses a Python OpenAPI generator (Separate Framework from Consumer pressure), and the ADR recording the new external data source (ADR-157 family) plus, on the Python path, the ADR for Python-workspace integration into the monorepo."
    status: pending
    depends_on: [establish-consumer-value]
  - id: promote-to-executable
    content: "Author the executable current/ plan from this seed: TDD cycles over the generated client (codegen from openapi-v1.json, boundary narrowing, Result-pattern endpoint wrappers, SQID metadata helpers), quality gates, and the consumer's first resolved statistic as the value proof."
    status: pending
    depends_on: [ratify-workspace-and-codegen-shape]
---

# DfE Data SDK — thin layer over the Explore Education Statistics API (seed)

## Problem and intent

Oak hard-codes UK school-context statistics today: the EEF corpus carries
`uk_context.national_averages` (pupil-premium percentage, SEND-support and
EHCP percentages, average school sizes) and 2024-25 pupil-premium funding
rates as a static snapshot with no refresh path and an unresolved upstream
licence (see the
[EEF surfacing-gap research](../eef/reference/eef-data-surfacing-gap-research-2026-06-12.md)
§3 and §6). The same class of data — plus attainment baselines, attendance,
SEND, destinations — is published authoritatively by the DfE on
[Explore Education Statistics](https://explore-education-statistics.service.gov.uk/data-catalogue)
under the Open Government Licence v3.0, with a public, anonymous, JSON,
OpenAPI-documented query API.

Intent: when an Oak surface needs DfE statistics, it consumes them through
one typed, schema-first SDK rather than ad-hoc fetches, hand-rolled types,
or hard-coded snapshots.

The DfE source is **complementary to the EEF corpus, never a replacement**
(owner posture, 2026-06-12): the EEF corpus is an evidence synthesis about
teaching strategies; EES is the national statistics estate. The MCP app and
related tooling pull on multiple sources to maximise value, and each source
remains whole and authoritative for what it is.

## End goal, mechanism, means

- **End goal**: Oak surfaces that need UK education statistics consume
  them with full type flow, provenance, and freshness — the statistic a
  teacher or school leader sees traces to a named DfE dataset version.
- **Mechanism**: the EES API publishes an OpenAPI document, so the
  repo's cardinal schema-first pattern applies directly — types,
  validators, and endpoint descriptors are generated from the spec at
  codegen time; runtime files are thin façades
  (`.agent/directives/schema-first-execution.md`). EES responses are
  runtime-unknown data, so they narrow at the boundary through generated
  predicates/validators (ADR-153 pattern) — the opposite discipline to
  the EEF fixed corpus, and the same schema-first family.
- **Means**: a new workspace under `packages/sdks/` providing a thin
  client over the API's eleven endpoints (publication listing, dataset
  summary/metadata/versions, GET/POST query, CSV download), Result-pattern
  error handling, and label↔SQID metadata helpers. The SDK is the
  consumer-general framework layer; Oak-specific dataset selections,
  caching policy, and surfacing live with consumers.

## Settled research facts (2026-06-12, first-hand)

All verified directly this session (live API calls and official docs), **as
observed 2026-06-12 — these are dated observations, not standing warrants;
re-verify at promotion**, including a re-run of the build-vs-buy survey (the
TypeScript-SDK absence and the Python-client-in-development status are the
most drift-prone facts here):

- **API**: REST, JSON, **anonymous** (verified by unauthenticated live
  call), **Beta** status. Base `https://api.education.gov.uk/statistics/v1`.
  OpenAPI document:
  `https://statistics.api.education.gov.uk/docs/reference-v1/openapi-v1.json`.
  Docs: `https://api.education.gov.uk/statistics/docs/`.
- **Query capability**: POST query with boolean criteria (`and`/`or`/`not`),
  filters, geographic levels and location codes (LA codes, school URN,
  provider UKPRN in the schema), time periods, sorts; pagination to
  10,000 rows per page; per-dataset versioning (`dataSetVersion`, wildcard
  support) with a version-changes endpoint.
- **Coverage**: 1,085 datasets in the catalogue, of which **140 are
  API-queryable across 22 publications** (live publication list,
  2026-06-12): SEN in England, pupil attendance (weekly) and absence,
  schools/pupils and their characteristics, KS2 attainment, KS4
  performance, phonics, multiplication tables check, EYFS profile,
  A level and 16-18 results, destinations (KS4, 16-18, longer-term,
  HE progression), NEET, children in need / looked after, FE workforce,
  apprenticeships, elective home education, children missing education.
  Notably absent from the API set as of this date: school workforce and
  exclusions (catalogue ZIP/CSV only).
- **Licence**: Open Government Licence v3.0 (standard GOV.UK statement,
  verified on dataset pages) — a clean contrast with the EEF snapshot's
  unresolved provenance.
- **Existing SDKs** (build-vs-buy):
  [`eesyapi.R`](https://github.com/dfe-analytical-services/eesyapi.R) (R),
  a Python client in development, and PowerBI connectors — all by DfE
  Analytical Services. **No TypeScript/JavaScript SDK exists**, so a thin
  TS SDK is not duplicating a first-party offering.
- **Response mechanics**: query results key filters/indicators/locations
  by opaque SQIDs; human-readable mapping requires the dataset metadata
  endpoint. A `debug` mode exists but is explicitly not for production.
- **Rate limits / SLA**: none documented; support route at
  `https://statistics.api.education.gov.uk/docs/support/`.

## Domain boundaries and non-goals

- **Transport-agnostic**: the SDK ships no MCP, HTTP-server, or CLI
  types; surfacing is a consumer concern (house rule for infrastructure
  workspaces).
- **No Oak-domain logic**: dataset choices, statistic interpretation,
  caching, and presentation belong to consumers. The framework test
  applies: a non-Oak consumer could use this SDK unchanged.
- **No analytics or derivations**: the SDK returns what the API returns,
  typed; it computes nothing (deterministic-data doctrine, ADR-191
  family).
- **Not a bulk-catalogue manager**: the 945 non-API datasets (ZIP/CSV
  downloads) are out of scope; the API's own CSV endpoint is in scope as
  a thin wrapper only.
- **No scraping**: API-published datasets only.

## Dependencies and sequencing

- **Blocking**: a named Oak consumer with ratified value (the promotion
  gate below). Existence of the data is not a reason to build.
- **Beneficial**: the EEF school-leadership value statement (its
  school-context parameters — SEND, PP, attainment — map directly onto EES
  API publications; workforce excepted, as school-workforce data is
  catalogue-only today); the EEF outcome-evaluation plan
  (national baselines as ground truth); the EEF corpus refresh/licence
  clarification (EES-sourced statistics can complement the corpus's
  school-context fields in the same workflows — a consumer-side
  enrichment decision, recorded here, owned there; the corpus remains
  whole and authoritative for EEF evidence). Minimum shippable shape without any of these: the
  SDK with one real consumer of any kind; without any consumer it does
  not ship.

## Workspace language — a named promotion decision

The owner has explicitly authorised a Python workspace as an acceptable
shape (2026-06-12): it requires additional integration work but would
also unlock future Python-workspace integration into this TypeScript
monorepo as a strategic side-benefit. The decision is made at promotion
by the first named consumer's runtime; neither path is the default.

- **TypeScript path**: directly importable by Oak's runtime surfaces
  (the MCP server and SDK consumers); reuses the existing codegen,
  type-flow, and quality-gate estate; no first-party TS client exists,
  so building duplicates nothing.
- **Python path**: aligns with DfE Analytical Services' own tooling —
  their in-development Python client shifts build-vs-buy toward
  consume-or-contribute rather than build; natural fit if the first
  consumer is analysis/evaluation-shaped (the outcome-evaluation
  candidate) rather than runtime-shaped; unlocks the monorepo's first
  Python workspace. Costs, blocking on this path: full quality-gate
  parity (package management, tests, lint, type-checking, turbo task
  wiring, CI) — gate parity is not optional (never-disable-checks
  doctrine), and TypeScript consumers cannot import it directly, so a
  runtime consumer would need a service/CLI/artefact seam, which must
  be named in the consumer-value statement before this path is chosen.

The owner sketched a candidate integration shape for the Python path
(2026-06-12; the exact shape is for a future session to explore, not
decided here): the Python workspace participates in the pnpm + turbo
graph through a minimal workspace root — a `package.json` whose scripts
defer to `uv` or to built binaries, or whatever mechanism that
exploration ratifies — plus a `python/` directory that is pure Python
tooling all the way down, and nothing else beyond the truly necessary
or very useful. Reference material:
[`oaknational/oak-python-starter`](https://github.com/oaknational/oak-python-starter)
— Oak's Python template with Practice-grade gate analogues (uv,
hatchling, pytest + coverage, pyright, ruff, pre-commit, commitizen,
deptry, import-linter), noted by the owner as somewhat out of date.

Every dependency, tool, and mechanism named on the Python path —
including the starter's tooling list and the `package.json`-defers-to-uv
sketch — is **illustrative only** (owner, 2026-06-12): the actual
approach and tooling are chosen only after deep critical analysis at the
exploration/promotion stage, not inherited from this seed or the
template.

## Strategic acceptance criteria

1. A named Oak consumer resolves a real statistic (for example the
   national pupil-premium-eligible percentage for the latest academic
   year) end-to-end through the SDK with full schema-derived type flow
   in the chosen language — zero ad-hoc types, zero assertion escapes,
   Result-pattern errors handled, all repo gates green (including full
   gate parity for a Python workspace).
2. The SDK workspace contains no Oak-domain logic (framework test
   passes) and no transport types.
3. Every consumed value carries provenance the consumer can surface:
   publication, dataset id, dataset version, and OGL attribution.
4. A spec refresh (`openapi-v1.json` change) is absorbed by re-running
   the generator plus build — no hand-edits in consumers
   (cardinal-rule shape).

## Risks and unknowns

- **Beta API**: breaking changes are plausible; mitigation is dataset
  version pinning in queries plus the codegen refresh path (criterion 4).
- **Undocumented rate limits**: unknown operational envelope; consumers
  needing volume must probe and record findings at promotion.
- **SQID opacity**: every useful query needs a metadata round-trip;
  the SDK's metadata helpers must make this cheap, or consumers will
  hand-cache mappings ad hoc.
- **Coverage gaps**: 140 of 1,085 datasets; school workforce and
  exclusions are not API-queryable today — a consumer needing them has
  no API path and this plan does not invent one.
- **Codegen home**: whether `oak-sdk-codegen` generalises to a second
  OpenAPI source, a sibling generator stands alone, or a Python
  OpenAPI generator applies is an open architecture decision (Separate
  Framework from Consumer); decided at promotion with the named
  reviewers.
- **Python-path integration cost**: a first Python workspace carries
  toolchain, gate-parity, and CI integration work that no current
  workspace exercises; underestimating it would erode the thin-SDK
  proportionality this seed promises. The promotion review prices it
  explicitly before the language decision is made.

## Promotion trigger

A named Oak consumer with a ratified value statement exists (for
example: the school-leadership evidence surface reaches its
value-ratification gate and names EES-sourced context data, or the
outcome-evaluation plan promotes and names national baselines — these are
illustrative candidates, not an exhaustive trigger set; any named Oak
consumer with a ratified value statement satisfies the gate). On
promotion, execution decisions — workspace name, codegen shape, ADR,
TDD cycle plan — are finalised in a `current/` executable plan per the
plan architecture; implementation detail in this seed is reference
context from completed research, not an execution commitment.

## Lifecycle and learning loop

This seed carries no executable work; lifecycle triggers
(`../../templates/components/lifecycle-triggers.md`) and the
consolidation workflow bind at promotion, when the executable plan is
authored.
