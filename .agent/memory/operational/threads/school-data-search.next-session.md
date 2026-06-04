# Next-Session Record — school-data-search

Thread: `school-data-search` — Oak School Data Search service (POC MVP),
from research-brief normalisation through report, plan, and in-repo build.

## Participating agent identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | Opus 4.8 | 75123f | Hushed Lurking Mask | brief-normaliser | 2026-06-03 | 2026-06-03 |
| claude | Opus 4.8 | 88a769 | Furnace Roasting Brazier | report-and-plan-synthesiser | 2026-06-03 | 2026-06-03 |
| claude | Opus 4.8 | fac519 | Mossy Whispering Bark | owner-gate-session presenter/recorder | 2026-06-04 | 2026-06-04 |

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
- **Next session STARTS WITH A REVIEW** (owner directive 2026-06-04):
  (1) **work done** — plan §Phase 0 `### Gate decisions (owner gate session,
  2026-06-04)` (all nine gates G-1…G-9 decided) and the `### Required
  high-stakes verifications (delivery gate)` register; (2) **work ahead** —
  the Landing target below (WS-D1 → G-8 → `active/` → WS1+; ADR-190 draft).
  Then proceed.
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

**WS-D1 → G-8 → build.** The gate walk is complete (all nine gates decided
2026-06-04; see plan §Phase 0 `### Gate decisions`). Remaining, in order:

1. **WS-D1** — author the workspace decomposition proposal on the now-settled
   ground (Next.js app + the F-B contract workspace + per-source ingestion
   pipelines + canonical model + Postgres-only redacted-snapshot store
   behind a port seam), then `architecture-expert` betty (cohesion/coupling)
   and fred (ADR-041) review → **G-8** ratification.
2. **ADR-190** — draft the produced-spec ADR as **F-B** (Zod 4 the single
   canonical source → OpenAPI 3.x via `@asteasolutions/zod-to-openapi`;
   generated-state-beats-authored-state doctrine; repo-wide forward policy;
   `Result` boundary) → `docs-adr-expert`.
3. Promote the plan to `active/` (G-1/G-2/G-3/G-8 all decided + build
   starting), then WS1/WS2/WS3 TDD cycles.

Carry the **verification discipline** as a required delivery gate:
high-stakes external-source claims are primary-verified before reliance
(plan top-note + the high-stakes register). The synthesis report is a
compiled evidence base, NOT a certified one — verify before building on it.

The 2026-06-03 synthesis-and-plan target and the 2026-06-04 gate walk are
both **complete**.

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
