---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-05-31 — Foamy docs-consolidation rotation

The prior archive-only source-buffer replacement was invalid because active
napkin content was hidden before the owner could trust the item-level
disposition proof. This rotation happens after the restored content was
re-checked against the source-buffer ledger, the active `distilled.md` entries
were separately dispositioned, and the remaining candidate doctrine was routed
to `pending-graduations.md` with explicit owner gates.

Verbatim source is preserved in the active-memory archive as
`napkin-2026-05-31-foamy-docs-consolidation.md`. Disposition evidence lives in:

- the Eclipsed source-buffer ledger for the restored source-item inventory;
- the Open Lofting / Foamy curator ledger for the repaired pass and continuation
  batches;
- `pending-graduations.md` for owner-gated doctrine that should not be promoted
  without a trigger.

Do not treat this archive as completion by itself. The completion proof is the
item disposition ledger plus the active homes above; the archive is only the
verbatim source record.

## Session: 2026-05-31 — Foamy self-correction note

During this pass I accidentally searched a pattern containing backticks without
shell-quoting it, so `zsh` attempted command substitutions for the dates inside
the pattern and printed `command not found` noise. No files changed. Behaviour
change: quote any `rg` pattern that contains backticks or shell-significant
characters before running it.

## Session: 2026-05-31 — Blooming longitudinal napkin review

### Mistakes Made

- While opening the longitudinal-review claim I passed
  `.agent/state/collaboration/comms/*.json` unquoted. `zsh` expanded it into the
  full comms corpus, the `claims open` helper rejected the argument list, and no
  claim was written. Behaviour change: quote every claim `--area-pattern` that
  contains `*`, `?`, brackets, backticks, or other shell-significant characters;
  globs are claim metadata, not shell input.
- During final commit, I trusted `commit-queue --help` when it omitted the
  required `--id` option for `enqueue`; the canonical skill was correct and the
  helper rejected the first enqueue. Behaviour change: for commit-queue identity
  fields, trust the canonical commit skill and pass the preflight UUID even when
  short help output is stale.

### Patterns to Remember

- When the owner asks for deep `session-handoff` plus deep `consolidate-docs`
  but explicitly says "no `pnpm check`, no commit", honour that as the validation
  and lifecycle boundary. Use session-completion consolidation, run narrower
  relevant checks such as fitness/markdown/format only if useful, and name the
  aggregate check as intentionally skipped rather than treating the workflow as
  blocked.

## Session: 2026-05-31 — Foamy longitudinal brief handoff

### What Was Done

- Authored `codex-napkin-longitudinal-review.brief.md` for the next Codex
  session to review the active napkin plus the recomputed last twenty archived
  napkins, with explicit missed-content and long-timescale pattern questions.
- Light handoff routes the next session to that brief without claiming the
  longitudinal review itself has run.

### Patterns to Remember

- When the owner asks for a future dedicated curation pass, it is valid to land
  a precise next-session brief and mark deep consolidation `due` to that route,
  rather than expanding a light handoff into the curation work itself.

### Surprise

- **Expected**: `comms append --tag heartbeat --body ...` would work for a
  singleton-check broadcast.
- **Actual**: heartbeat-tagged events reject free-form `--body` and require typed
  heartbeat state args; a `behaviour-note` tag worked for the free-form notice.
- **Why expectation failed**: I treated `heartbeat` as a generic urgency tag
  instead of a typed event shape.
- **Behaviour change**: use `behaviour-note` for free-form coordination notices,
  or provide the heartbeat-specific typed args when the event is a real heartbeat.
- **Source plane**: `operational`

## Session: 2026-05-31 — EEF plan old-list correction

### Patterns to Remember

- When the owner says an old implementation is wrong, do not frame the next plan
  as preserving compatibility with it. The old implementation is evidence only
  for what to delete. Any overlap with old outputs is acceptable only as an
  incidental result independently derived from the new ratified value, surface,
  and architecture; the old code must not be kept, repaired, wrapped, consulted,
  or used as the source of expected behaviour.
