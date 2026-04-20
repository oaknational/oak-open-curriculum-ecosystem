# Repo Continuity

**Status**: Skeleton created by OAC Phase 2 (2026-04-20). Population
begins during OAC Phase 3 pilot. Until then the canonical continuity
contract lives in `.agent/prompts/session-continuation.prompt.md`'s
`Live continuity contract` section. Do **not** treat both as authoritative
simultaneously — the pilot-phase rule is: this file is populated only
when exercised by the OAC Phase 3 pilot scenarios; otherwise the prompt
remains the source of truth.

## Fields

The populated contract must cover exactly these fields:

- **Active workstreams** — list of slugs with pointers to their
  `workstreams/<slug>.md` brief files.
- **Primary workstream brief** — the current primary lane the session
  resumes into.
- **Repo-wide invariants / non-goals** — rules that apply to any
  session regardless of workstream.
- **Next safe step** — the action a freshly-resumed agent can
  execute without further context.
- **Deep consolidation status** — `not due — <reason>`,
  `due — <reason>`, or `completed this handoff — <reason>` per the
  consolidation gate in `session-handoff`.

## Compactness

This surface must stay compact. Workstream detail belongs in
`workstreams/<slug>.md`; tactical coordination belongs in
`runtime/tracks/*.md`; historical handoff addenda do not belong here at
all — they either graduate into permanent docs through the learning
loop or rotate out via `napkin.md` rotation.
