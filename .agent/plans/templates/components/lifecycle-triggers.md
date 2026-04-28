# Component: Lifecycle Triggers

Use this component in plans that touch more than a trivial single-file
change, and in every Practice, process, platform-adapter, or multi-agent
collaboration plan.

## Required Lifecycle Touch Points

Before implementation starts, name how the work will pass through these
touch points:

1. **Session entry** — run `start-right-quick` or `start-right-thorough`,
   read active claims, recent collaboration log entries, and relevant
   decision-thread files.
2. **Work-shape declaration** — record the smallest sufficient plan
   artefact before mutation:
   - trivial work: landing target or explicit no-landing reason;
   - bounded non-trivial work: simple plan in chat or the touched thread
     record, naming goal, scope, validation, and lifecycle touch points;
   - multi-session, architectural, Practice, cross-workspace, or high-risk
     work: executable repo plan in `current/` or `active/`.
3. **Pre-edit coordination** — register active areas and leave an
   observable artefact proving the registry was consulted.
4. **During work** — append to the shared communication log or a decision
   thread when direction, overlap, or coordination state changes.
5. **Session handoff** — close own active claims into
   `closed-claims.archive.json`, update relevant decision threads, refresh
   continuity surfaces, and run the consolidation trigger check.
6. **Deep consolidation** — let `consolidate-docs` audit stale claims,
   closure history, decision threads, schema validity, and Practice
   propagation.

## WS3B Boundary

Sidebar, timeout, and owner-escalation artefacts are not part of this
component. They remain paused until explicitly promoted by the owner or by
real decision-thread evidence that async coordination is insufficient.

## Merge-Readiness Rule

For non-trivial work, missing lifecycle handling is a merge-readiness gap:
the plan or handoff must either complete the touch point or record an
explicit no-change / not-applicable rationale.
