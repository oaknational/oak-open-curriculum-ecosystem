---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-05-28 (later) — escape-hatch process re-enacts F (Woodland Swaying Pollen)

### Correction absorbed (retrospective metacognition)

- **Owner caught two moves in one planning session**: (1) I posed a *forced*
  conclusion (full nodes — my own worked examples showed graded disclosure isn't
  a helpful lever, whole corpus < ceiling) as a balanced A/B menu instead of
  stating the verdict; (2) I re-imported deferral ("gate-1b later", "D6-gated
  fast-follow", "consolidate-at-third-consumer defers it") when the explicit goal
  was to *remove* the 1a/1b deferral framing — the owner had made ZERO deferral
  decisions.
- **The pattern (the durable bit)**: both — plus a near-miss "rank the broad
  result down to N" (sort-plus-slice, a list-op) — share one root: **F's
  *process***. F shipped stubs + lateral workarounds + the gate-split, all ways
  to dodge the complete build. I had internalised the foundation's *content*
  (graph≠list, no stubs) while still running F's *process* (dodge the complete
  commitment via an escape hatch). Knowing the anti-pattern did not immunise me
  from re-enacting its shape.
- **Behaviour change**: the tell is **the reach for an exit** — "defer", "let the
  owner pick", "rank it down" — not the vocabulary. When I reach for one, treat
  it as a flag that a complete commitment is available and I'm flinching. Check,
  then make it. Deferral is an owner decision, never my silent default; a forced
  conclusion is stated, not offered as a menu.
- **Source plane**: `doctrine` (agent practice). Also landed in the graph-tooling
  foundation §9 as a named anti-pattern.

## Session: 2026-05-28 — napkin rotation (Sylvan Whispering Fern)

Rotated the 2026-05-27/28 napkin (was HARD: 408 lines / 19558 chars) during a
`consolidate-until-done` dedicated-knowledge-curation pass. The processed source
is archived verbatim in the [companion archive][archive].

Behaviour-changing lessons graduated to `distilled.md`:

- `tail -F | grep` watchers re-emit their whole history on file rewrite — use a
  dedup poll (two instances).
- Read git merge/divergence risk from content (`git diff HEAD origin/<branch>`),
  not a raw `HEAD..origin` name-status diff.
- Generated adapters are never hand-written — fix the generator, don't stub
  (owner-corrected).
- Treat session-opener fitness as stale until you rerun it this session.

The remaining 2026-05-27/28 entries were duplicates of existing rules, skills,
`distilled.md`, or permanent homes (`replace-dont-bridge` + the
`routing-legacy-fallback-sunset` plan; consolidate-docs mode contract;
supersession-refreshes-continuity; collaboration-state-is-source;
`verify-dont-trust`; `register-active-areas`; proportionate-exploration in
per-user memory + `pending-graduations.md`). They are preserved in the archive,
not lifted. Item-level disposition ledger: [curator pass][ledger].

## Session: 2026-05-28 — consolidate-until-done: held commits (Sylvan)

A stale 0-byte `.git/index.lock` (held by Cursor's `gitWorker.js` / GitLens, not
an agent — confirmed via `ps` + solo session, no claims) blocked the commit
index. Diagnosed read-only, surfaced to the owner per the lock rules; owner chose
HOLD. Behaviour: in Cursor-concurrent sessions a 0-byte index.lock can persist
from IDE git integrations — diagnose by age + `ps` (IDE vs agent) and surface,
never autonomously remove. Goal-state: `consolidate-until-done` is substantively
complete (strict-hard green; buffers dispositioned; ledger written); the only
outstanding act is the owner-deferred commit of the working-tree bundle.

[archive]: archive/napkin-2026-05-28-sylvan-curation.md
[ledger]: ../operational/curator-passes/2026-05-28-sylvan-whispering-fern.md
