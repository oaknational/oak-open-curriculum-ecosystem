# School Data Search

Plan collection for the **Oak School Data Search service**: a
privacy-conservative, provenance-carrying canonical dataset of UK schools
(England, Wales, Scotland, Northern Ireland, and GIAS-hosted overseas
records) served through an authenticated REST API with a typed client —
built IN THIS repository as a POC MVP, with extraction deferred until POC
completion and an owner go/no-go decision.

## Document roles

| Document | Role |
| --- | --- |
| [Synthesis report](../../reports/school-data-search-synthesis-report-2026-06-03.md) | Evidence authority: convergent foundation, divergence matrix (named owner decisions), collision ledger, OpenAPI inversion analysis, build-time verification ledger — synthesised from three independent research briefs + the owner requirements |
| [`current/school-data-search-poc.plan.md`](current/school-data-search-poc.plan.md) | The executable POC plan: owner decision gates G-1…G-9, then build workstreams WS1–WS11 as TDD cycles |
| [`current/school-data-search-wsd1-decomposition.md`](current/school-data-search-wsd1-decomposition.md) | The G-8-ratified workspace decomposition (4-workspace bundle under a top-level `school-data-search/` tier) |
| [Thread record](../../memory/operational/threads/school-data-search.next-session.md) | Session continuity for the `school-data-search` thread |

The research inputs themselves (three briefs + owner requirements) live in
the gitignored `.agent/reference-local/` lane; the synthesis report is
fully self-contained, so nothing in this collection depends on reading
them.

## Lifecycle

| Lane | Contents |
| --- | --- |
| [`current/`](current/README.md) | [`school-data-search-poc.plan.md`](current/school-data-search-poc.plan.md) — queued; promotes to `active/` when gates G-1/G-2/G-3/G-8 are decided and build starts |

`active/`, `future/`, and `archive/completed/` are created when first
needed.

## Status

📋 Queued — the plan is decision-complete as a structure; execution is
gated on the Phase 0 owner decisions (the gates walk the synthesis
report's divergence matrix and OpenAPI inversion analysis; no further
research is required to decide them).

## Boundaries

- **Curriculum search is not here**: hybrid semantic search over Oak
  curriculum content belongs to [semantic-search/](../semantic-search/).
  This collection owns the school-register dataset service only.
- **Architectural decisions land as ADRs**, not in plan bodies — the
  produced-spec OpenAPI question (report §6) is ADR material ratified at
  gate G-1.

## Reviewer dispositions (plan readiness)

Recorded at authoring (2026-06-03): `assumptions-expert` reviewed the
synthesis report (READY-WITH-CHANGES; applied) and
`architecture-expert-betty` reviewed it (READY-WITH-CHANGES; three
blockers verified and applied — D-16 runtime fork, search-contracts
reuse correction, F-C contract shape). The executable plan's own
readiness review (`assumptions-expert`, 2026-06-03):
**READY-WITH-CHANGES, no blockers** — coverage verified complete (all 16
D-forks, 5 gated collisions, F-A/F-B/F-C, and 12 V-items homed); all
gate blocking relationships verified legitimate; all three
architecture carry-items confirmed landed. Applied: G-2 unblocks
narrowed to app-workspace scaffolding; structured `depends_on` added to
the todo graph; the G-1 "ALL APIs" scope clarification made explicit;
the V-06 Scotland licence stop-rule made explicit. Noted without edit:
per-WS validation commands are derivable only after G-8 names the
workspaces (the plan states this).
