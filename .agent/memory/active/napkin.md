---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

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
