# Platform-Specific Per-User Memory Is a Buffer

Vendor-managed per-user memory surfaces — Claude Code
`~/.claude/projects/<project>/memory/`, Cursor `~/.cursor/chats/`
plus `prompt_history.json`, Codex `~/.codex/memories/` — are
**platform-specific buffers** with a drainage contract into the
in-repo canonical surfaces. They are not personal accumulators and
not a substitute for `napkin.md` / `distilled.md` / rules / PDRs.

## The Invariant

Substance written into per-user memory with cross-platform or
cross-session value **MUST** be integrated into in-repo surfaces
during:

- `oak-session-handoff` step 6 — mirror at session close.
- `oak-consolidate-docs` step 3 — cross-platform ingestion at
  thread-scoped depth.

Until that integration happens, the substance lives in a single
platform's per-user buffer and is invisible to:

- Agents on other platforms working the same repo.
- Future sessions of the same agent on the same platform (memories
  age; the in-repo surfaces are the durable canonical).
- The owner's audit trail (the per-user memory is not version-
  controlled inside the repo).

## Why

Per-user memory is **observation-shaped storage**: it captures
session-local insight at write time. The in-repo surfaces are
**institutional-knowledge-shaped storage**: they are read by every
agent at every session open. Treating the per-user surface as a
personal store rather than as a buffer produces a recurring failure
mode — substance pools in one agent's memory and never propagates.

Owner-stated 2026-05-17 after a recurrence: *"part of the function
of the session handoff and the document consolidation flows is to
sweep vendor specific memories and integrate them into our learning
loop, so that all agents working on the repo can benefit from the
understanding."*

## How to Apply

At every `oak-session-handoff` step 6 and `oak-consolidate-docs`
step 3, the agent sweeps **its own platform's per-user memory
surface** for substance with cross-platform value. The sweep
produces either:

- **A positive finding** — substance mirrored to `napkin.md` /
  `distilled.md` / pattern / PDR with a named in-repo
  destination. The per-user memory entry may be marked
  "Graduated to <path>" as an audit trail.
- **A justified empty result** — the per-user surface contained
  only platform-local craft notes (keyboard preferences, output
  formatting personal tastes, transient context-specific fixes
  with no cross-session pattern) and nothing graduated.

Declaring the sweep done **without performing it** is the failure
mode this rule blocks.

## Cross-Platform Ingestion Is Consolidation-Time

At session open, the agent reads **only its own platform's
surface**. Reading another platform's per-user memory for insight
is a consolidation-time activity (`oak-consolidate-docs` step 3),
not a session-open activity. The reason: session-open grounding is
bounded by the directive-file-context-budget rule; sweeping all
platforms' memories at every open would exhaust the budget. At
consolidation depth, the agent is already in a wider-context mode
and the cross-platform sweep produces value rather than noise.

## Per-User Memory Lifecycle

When per-user memory entries are graduated to in-repo homes:

1. Land the graduation (new rule / pattern / PDR / SKILL
   amendment).
2. Update the per-user memory file's body with a "Graduated to
   <repo-path>" marker; keep the original substance as audit
   trail.
3. Update the per-user `MEMORY.md` index entry's description with
   a similar marker.

This pattern is already in use (see entries marked "Graduated to
…" in any platform's MEMORY.md). This rule names the discipline so
it does not depend on agent recall.

## Composition

- [`directive-file-context-budget`](directive-file-context-budget.md) —
  session-open grounding budget. Cross-platform per-user sweeps
  are explicitly excluded from the budget and deferred to
  consolidation.
- [`executive-memory-drift-capture`](executive-memory-drift-capture.md) —
  when executive-memory drift surfaces, the corrective capture
  may seed both per-user memory AND napkin; this rule names the
  flow from one to the other.
- [`consolidate-at-third-consumer`](consolidate-at-third-consumer.md) —
  when the same substance appears in three per-user memories
  across different platforms, the consolidation trigger fires and
  the substance graduates.
