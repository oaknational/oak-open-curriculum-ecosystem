# Next-Session Record — school-data-search

Thread: `school-data-search` — Oak School Data Search service (POC MVP),
from research-brief normalisation through report, plan, and in-repo build.

## Participating agent identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | Opus 4.8 | 75123f | Hushed Lurking Mask | brief-normaliser | 2026-06-03 | 2026-06-03 |
| claude | Opus 4.8 | 88a769 | Furnace Roasting Brazier | report-and-plan-synthesiser | 2026-06-03 | 2026-06-03 |

## Current Continuation

- Branch: `feat/graph-tooling-tidyup` (shared working branch; report and plan
  landed here — `36f1d61b` report, `26b7eb77` plan collection).
- Invocation pointer: `start-right-quick`, then this record.
- Controlling plan:
  [`school-data-search-poc.plan.md`](../../../plans/school-data-search/current/school-data-search-poc.plan.md)
  (lifecycle `current/`; promotes to `active/` when gates G-1/G-2/G-3/G-8 are
  decided and build starts).
- Next safe step: the **owner gate session** — walk gates G-1…G-9 against the
  [synthesis report](../../../reports/school-data-search-synthesis-report-2026-06-03.md)
  (divergence matrix §4, collision ledger §5, OpenAPI inversion §6). The
  report carries all considerations; no further research is required to
  decide. Architectural ratifications at the gates land as ADRs.
- Completed (2026-06-03, Furnace Roasting Brazier): the synthesis report
  (self-contained, citation-grounded, reviewed pre-landing by
  assumptions-expert + architecture-expert-betty, dispositions in report
  §10) and the plan collection (gates G-1…G-9, WS-D1, WS1–WS10 with
  structured `depends_on`; assumptions-expert plan-readiness review:
  ready-with-changes, no blockers, findings applied; docs-adr-expert chain
  review clean). Prior session: briefs normalised (Hushed Lurking Mask).
- Acceptance bar: met — tracked, self-contained report + executable plan,
  zero dependence on gitignored files (docs-adr-expert verified the chain).

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

**The owner gate session.** Walk gates G-1…G-9 in the
[controlling plan](../../../plans/school-data-search/current/school-data-search-poc.plan.md)
§Phase 0 against the synthesis report. Gate outcomes: decided, parked with
a named trigger (PDR-058), or rejected as framed — a reframed gate routes
back to synthesis as new work and amends the gate row. Blocking structure:
G-1/G-2/G-3/G-8 unblock all build workstreams; G-4→WS3, G-5→WS7, G-6→WS4,
G-7→WS6; G-9 gates publishing only. Decisions recorded in the plan (todo
flips) and, where architectural (G-1 produced-spec shape is the named ADR
candidate), as ADRs. After the gates: WS-D1 (workspace decomposition
proposal) → G-8 ratification → promote the plan to `active/` and begin
WS1/WS2/WS3 TDD cycles. WS-D1's placement — authored in-session once G-2
is decided, or after close — is an owner micro-decision taken at G-2.

The synthesis-and-plan landing target set on 2026-06-03 is **complete**
(report `36f1d61b`, plan `26b7eb77`).

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
- Brief convergence is now canonically recorded in the
  [synthesis report](../../../reports/school-data-search-synthesis-report-2026-06-03.md)
  §3 — superseding this record's earlier preliminary list. Note the report's
  §3.1 caveat: the briefs' 3/3 Next.js vote was frame-dependent (no in-repo
  workspace uses Next.js); the runtime is fork D-16, decided at gate G-2.
- Citation provenance differs by brief: Briefs 2/3 inline `[[N]]` anchors are
  export-recovered and position-exact; Brief 1's reference list is
  owner-supplied and approximate with no position claims. Weight accordingly
  when the report cites evidence.
