# Next-Session Record — school-data-search

Thread: `school-data-search` — Oak School Data Search service (POC MVP),
from research-brief normalisation through report, plan, and in-repo build.

## Participating agent identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | Opus 4.8 | 75123f | Hushed Lurking Mask | brief-normaliser | 2026-06-03 | 2026-06-03 |
| claude | Opus 4.8 | 88a769 | Furnace Roasting Brazier | report-and-plan-synthesiser | 2026-06-03 | 2026-06-03 |
| claude | Opus 4.8 | fac519 | Mossy Whispering Bark | owner-gate-session presenter/recorder | 2026-06-04 | 2026-06-04 |
| claude | Opus 4.8 | 80d50a | Fiery Sparking Caldera | deep-review + refinement | 2026-06-04 | 2026-06-04 |

## Current Continuation

- Branch: `feat/graph-tooling-tidyup` (shared working branch; report
  `36f1d61b`, plan collection `26b7eb77`; gate decisions committed
  2026-06-04 — see git log).
- Invocation pointer: `start-right-quick`, then this record. (`.remember`
  plugin retired 2026-06-04; the baton is this thread record + repo-continuity.)
- Controlling plan:
  [`school-data-search-poc.plan.md`](../../../plans/school-data-search/current/school-data-search-poc.plan.md)
  (lifecycle `current/`; promotes to `active/` when G-1/G-2/G-3/G-8 are
  decided — **now all decided** — and the first build workstream starts).
- **Deep review DONE 2026-06-04** (Fiery Sparking Caldera, `80d50a`):
  verdict — the work is **sound, faithful, and build-ready**. Synthesis
  fidelity to the briefs verified high (no manufactured convergence; "no
  brief mentions OpenAPI" confirmed); external/build-readiness claims
  re-verified against primary sources (GIAS daily CSV endpoint real; OGL
  covers the sources; Vercel/Neon facts hold; the Zod→OpenAPI→client
  toolchain is real and maintained). Two new owner decisions + execution
  refinements applied this session — see "Review outcome" below. Then
  proceed to the Landing target.
- **Completed 2026-06-04 (Mossy Whispering Bark — owner gate session):**
  all nine owner gates decided and recorded at decision time; a mandated
  high-stakes verification pass (5 parallel primary-source checks) that
  reopened and resolved three decisions (G-1 F-C→F-B; G-6 NI register +
  Scotland geospatial layer; coordinates dropped); the **licensing
  guardrail** and the **verification discipline** baked into the plan as
  required gates. Prior: synthesis report + plan collection (Furnace,
  2026-06-03); briefs normalised (Hushed Lurking Mask, 2026-06-03).

## Inputs (synthesised 2026-06-03; provenance record)

All in `.agent/reference-local/oak-school-search-research/` (gitignored).
The synthesis report is fully self-contained — these files are provenance
for re-verification only; nothing in tracked canon depends on reading them:

1. `additional-requirements.md` — owner requirements, override the briefs:
   (1) POC MVP is built IN THIS repo, not extracted until POC complete and a
   go/no-go decision is made; (2) ALL APIs MUST surface a strict,
   comprehensive OpenAPI 3.x-compliant specification.
2. `Oak School Data Search Project Brief 1-clean.md` — structure-repaired;
   references are owner-supplied approximate set, no inline positions.
3. `Oak School Data Search Project Brief 2-clean.md` — 56 inline citations
   over 31 verified source URLs.
4. `Oak School Data Search Project Brief 3-clean.md` — 42 inline citations
   over 24 verified source URLs.

The raw export `.md` sources sit beside the clean files (never-overwrite rule);
owner may direct their removal after comparison.

## Landing target for the next session on this thread

**ADR-041 amendment + ADR-190 → `active/` → WS1+.** All gates G-1…G-9 decided;
**WS-D1 / G-8 DONE 2026-06-04** — the 4-workspace bundle is ratified: the
`contracts`, `sdk` (data/ingest/search modules), `client`, and `apps/api`
workspaces under a new top-level `school-data-search/` tier; auth in apps/api;
authored boundary rules. Full
record: [decomposition doc](../../../plans/school-data-search/current/school-data-search-wsd1-decomposition.md)
(betty + fred reviewed/validated; 6-way split rejected). Remaining, in order:

1. **ADR-041 amendment** — add the `school-data-search/` tier matrix row + the
   authored boundary rules (enumerate workspaces in `pnpm-workspace.yaml`;
   hand-authored depcruise path-prefixes; an ESLint tier factory + unit tests
   wired into each workspace). Lands in the first scaffolding cycle, before
   any new-workspace code.
2. **ADR-190** — draft the produced-spec ADR as **F-B** (Zod 4 the single
   canonical source → OpenAPI 3.x via `@asteasolutions/zod-to-openapi`;
   generated-state-beats-authored-state doctrine; repo-wide forward policy;
   `Result` boundary) → `docs-adr-expert`. **Framing (review 2026-06-04):**
   justify F-B on its own merits (Zod is the repo's validation idiom; one
   source generates spec + code; owner direction) — NOT by "F-C impossible".
   A TypeSpec→Zod emitter is in active development by TypeSpec's architect but
   not production-ready in 2026 (`@typespec/emitter-framework` is an
   experimental dev-prerelease); record it as a revisit-trigger. The Cardinal
   Rule is upstream-consume-specific and does NOT govern this produced spec —
   not an "inversion".
3. Promote the plan to `active/` (G-1/G-2/G-3/G-8 all decided + build
   starting), then WS1/WS2/WS3 TDD cycles.

Carry the **verification discipline** as a required delivery gate:
high-stakes external-source claims are primary-verified before reliance
(plan top-note + the high-stakes register). The synthesis report is a
compiled evidence base, NOT a certified one — verify before building on it.

The 2026-06-03 synthesis-and-plan target and the 2026-06-04 gate walk are
both **complete**.

## Review outcome (2026-06-04, Fiery Sparking Caldera)

The deep review confirmed the work is sound; refinements landed this session
in the plan + report (working-tree). New owner decisions and changes carried
forward:

- **Observability (WS9):** reuse `@oaknational/logger` (Oak Logger, stdio
  sink only) + `@oaknational/observability` OTEL — no reinvention, **no
  remote sinks** for the POC (Slack alerts + Vercel-Observability-Plus out,
  named post-go).
- **Value-proof (WS11, new):** a Next.js school-picker page (server-side
  bearer; browser never sees the token; **access-gated/non-public**) where a
  user picks a real school across all four nations e2e — the go/no-go value
  proof, not capabilities alone. Refines the "no front-end UI" non-goal
  (picker page in; admin UI still out).
- **Canonical-ID stability** is the picker's stored-identity invariant — now
  a plan-level tested acceptance criterion + a per-nation `sourceId`-stability
  verification at WS4.
- **England/GIAS is the first WS4 milestone** (dominant data mass; V-02
  extract-licence is a display stop-rule — an FOI reply used weaker
  "fair-dealing" wording, confirm at fetch).
- **`change_events` field-level diffing + import-run-inspection detail API**
  DEFERRED to post-go (operational, not picker-essential) — owner-decided
  2026-06-04.
- Report §6 reframed (produced-spec is a separate concern, not a Cardinal-Rule
  inversion); C-10 env path corrected; risk table updated (Next.js decided;
  Vercel Pro+ for 800s; sourceId-stability).

Rejected during review: the value-trace finding of "no grounded consumer" —
the need/value are owner-settled (any education service must let the user pick
their school); horizontal infrastructure legitimately precedes its first
in-repo consumer.

## Standing decisions and constraints the thread carries forward

- **Owner requirements beat briefs.** All three briefs assume a NEW standalone
  monorepo (`oak-school-data-search`) with repo-bootstrap phases; requirement
  (1) invalidates that frame — the POC builds in THIS repo as workspace(s).
  Every brief phase/recommendation must be re-read through that lens
  (premature-crystallization risk: do not inherit the briefs' Phase 0).
- **Repo doctrine beats briefs** where they conflict: schema-first execution,
  TDD-as-design, strict validation at boundaries, distinct layers in distinct
  workspaces, no `process.env` in tests, workspace topology conventions.
- **OpenAPI 3.x requirement (2) is spec-first, not spec-derived**: this repo
  CONSUMES Oak's OpenAPI schema (ADR-029/030/031); the new service PRODUCES
  its own spec. The report should name how the existing schema-first doctrine
  maps onto a spec-producing service (likely ADR material — candidate, not
  decided).
- Brief convergence is canonically recorded in the
  [synthesis report](../../../reports/school-data-search-synthesis-report-2026-06-03.md)
  §3. The report was **CORRECTED 2026-06-04** where gate decisions superseded
  brief framing: runtime is **Next.js** (G-2 — the D-16 "fork" over-extended a
  frame-audit; Next.js was always the plan); contract layer is **F-B** (G-1,
  revised from F-C post-verification); **coordinates/OS-derived data dropped**
  (licensing guardrail). The plan §Phase 0 gate-decisions are authoritative
  over any superseded report framing.
- Citation provenance differs by brief: Briefs 2/3 inline `[[N]]` anchors are
  export-recovered and position-exact; Brief 1's reference list is
  owner-supplied and approximate with no position claims. Weight accordingly.
- **Gate decisions + session doctrine (2026-06-04; plan §Phase 0 is
  authoritative):** G-1 **F-B** (Zod 4 → `@asteasolutions/zod-to-openapi` →
  OpenAPI 3.x, CI-proven strict; `Result` boundary; repo-wide forward policy;
  ADR-190 to draft). G-2 **Next.js** + own Vercel project + Neon-preview
  opt-in + cron `0 2 * * *` UTC. G-3 canonical model (enum values derived from
  source data, not pinned; modelled name-variant rows; generic inspection, no
  rating; include `middle` phase). G-4 Postgres-only redacted snapshots behind
  a storage-port seam; retention env-config (snapshot 180d / change_events
  90d). G-5 script token-rotation + split-token + opaque cursor; rate-limit
  deferred to the WS7 security review. G-6 **per-source pipelines** (explicit
  provenance/freshness/configurable refresh; annual cadence fine); NI **ships**
  via DE annual publications; Scotland geospatial layer dropped. G-7
  deterministic ranking + **app-code multilingual normaliser** (store + search
  BOTH original & normalised; Postgres now, ES-Serverless later) + no-CDN-cache.
  G-9 no `npm publish` without explicit owner direction. Cross-cutting:
  **verification discipline** (external claims primary-verified before
  reliance; high-stakes register is a delivery gate), **licensing guardrail**
  (crystal-clear-open licences only; OS-derived data excluded),
  **completeness** (every operating school findable, all four nations —
  first-class acceptance), **configurable tunables** (env-config, not magic
  numbers).
