# Next-Session Record — school-data-search

Thread: `school-data-search` — Oak School Data Search service (POC MVP),
from research-brief normalisation through report, plan, and in-repo build.

## Participating agent identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | Opus 4.8 | 75123f | Hushed Lurking Mask | brief-normaliser | 2026-06-03 | 2026-06-03 |

## Current Continuation

- Branch: `feat/graph-tooling-tidyup` (shared working branch; this lane has no
  branch of its own yet — the next session decides whether report/plan land
  here or on a fresh branch).
- Invocation pointer: `start-right-quick`, then this record.
- Controlling plan: none yet — authoring the plan IS the next session's work.
- Next safe step: read the four inputs end-to-end, then author the synthesis
  report, then the plan (see Landing target).
- Completed prerequisites: all three research briefs normalised to verified
  clean markdown (2026-06-03, this session); citation recovery doubly verified
  against PDF surfaces; PDFs deleted (owner-directed); Brief 1 references are
  an owner-supplied verified approximate set (21 URLs, 19 probed OK, 2 GIAS
  bot-blocked as expected).
- Recent relevant commits: none (the lane's artefacts are gitignored
  reference-local files plus uncommitted continuity edits; owner directed
  no-commit at the normalisation session's close).
- Team expectation: unknown until live grounding.
- Acceptance bar: a tracked, self-contained report + an executable plan that
  do not depend on reading gitignored files.

## Inputs (read all four end-to-end before authoring)

All in `.agent/reference-local/oak-school-search-research/` (gitignored —
quote what the report needs into tracked canon; CI and other agents cannot
read this lane):

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

**Synthesis discipline (owner emphasis 2026-06-03: synthesise ALL inputs):**

- Verify input completeness at session open by re-listing
  `.agent/reference-local/oak-school-search-research/` — owner files have
  arrived mid-session twice; anything new there is first-class input.
- Ground every load-bearing synthesis claim by brief + citation (`[[N]]`
  anchors in Briefs 2/3 resolve to verified URLs; Brief 1's references are
  approximate, no position claims). A claim no brief can ground is flagged
  for build-time verification, never asserted.
- Dispatch `assumptions-expert` (plus an architecture reviewer as needed) on
  the synthesis report BEFORE authoring the plan — real-time, not backfill.

Author and land in tracked canon:

1. **Synthesis report** (home: `.agent/reports/`) — the three briefs are three
   independent answers to the SAME research brief. The report's value is the
   synthesis surface: (a) convergent foundation (what all three agree on —
   high confidence), (b) divergence matrix (where they differ — each a named
   decision with considerations, NOT a made decision; feature-shaping forks
   are the owner's), (c) collision ledger between brief assumptions and the
   owner requirements / this repo's doctrine, (d) claims needing live
   re-verification at build time.
2. **Plan** (home: `.agent/plans/` — new lane, e.g. `school-data-search/`)
   per the plan architecture (`oak-plan`), grounded in the report.

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
- Briefs converge on (verify in synthesis, do not assume): Next.js App Router
  API on Vercel, Neon Postgres via marketplace, Drizzle ORM + explicit SQL
  migrations, Postgres FTS + pg_trgm (Elasticsearch deferred), redacted
  snapshots, hashed bearer tokens, OTEL observability, Slack alerts, MIT code
  licence, OGL-only data, nightly 02:00 Europe/London refresh with whole-
  dataset promotion, conservative PII exclusion allowlists.
- Citation provenance differs by brief: Briefs 2/3 inline `[[N]]` anchors are
  export-recovered and position-exact; Brief 1's reference list is
  owner-supplied and approximate with no position claims. Weight accordingly
  when the report cites evidence.
