---
classification: core
description: Platform-specific per-user memory (Claude Code, Cursor, Codex per-user stores) is a buffer with a drainage contract into in-repo canonical surfaces (napkin/distilled/rules/PDRs), not a personal accumulator. Sweep own platform at session-handoff and consolidate-docs; cross-platform ingestion is consolidation-time.
---

# Platform-Specific Per-User Memory Is a Buffer

Operationalises
[PDR-124 (Definition-Surface Context Economy) §Decision 4](../practice-core/decision-records/PDR-124-definition-surface-context-economy.md)
in the index-line retirement step of §Per-User Memory Lifecycle.

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

- the `session-handoff` skill, step 6 — mirror at session close.
- the `consolidate-docs` skill, step 3 — cross-platform ingestion at
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

## No Mutable State As a Standing Fact

A durable memory surface stores facts that stay true and *pointers* to where
volatile truth lives — never the volatile truth itself as a standing assertion.
"WS3+ is paused", "the migration is done", "X is the current owner" are mutable
world-state: they are guaranteed to go stale, and a stale memory is recalled as
fact and asserted with confidence (the 2026-06-16 "collaboration is paused"
failure — the entry had been superseded two days earlier and was read as
current).

So when an entry must reference something mutable, store the **pointer and the
check**, phrased as an instruction, not the state phrased as a fact:

- Wrong (decays into a false fact): *"WS3+ is paused pending evidence."*
- Right (a pointer that stays useful): *"WS3+ status lives in `<plan>` §Status —
  re-read before relying; as of `<date>` it was under review against M4."*

Mutable operational state has a home already — the live-state surfaces
(`repo-continuity.md`, thread records, `active-claims.json`) re-derived every
session. Durable memory points at those; it does not freeze a copy of their
contents as a claim. This guard applies to every durable memory surface
(per-user `MEMORY.md` and entries, `distilled.md`, patterns), not only the
per-user buffer.

## How to Apply

At step 6 of every `session-handoff` and step 3 of every `consolidate-docs`
run, the agent sweeps **its own platform's per-user memory
surface** for substance with cross-platform value. The sweep
produces either:

- **A positive finding** — substance mirrored to `napkin.md` /
  `distilled.md` / pattern / PDR with a named in-repo
  destination. The per-entry memory file may be marked
  "Graduated to <path>" as an audit trail; its `MEMORY.md` index
  line is retired (§Per-User Memory Lifecycle step 3).
- **A justified empty result** — the per-user surface contained
  only platform-local craft notes (keyboard preferences, output
  formatting personal tastes, transient context-specific fixes
  with no cross-session pattern) and nothing graduated.

Declaring the sweep done **without performing it** is the failure
mode this rule blocks.

The per-user directory and its index are shared by every seat that
runs on the machine, not owned by the seat that happens to be writing:
one session overwrote another's resume head in the shared index
(2026-09-07). A seat writes its own dated block under its own
identity, reads its own block on resume — never the last one written
— and never rewrites another seat's entry; a correction to a shared
line is a re-truing that keeps every seat's head.

## Cross-Platform Ingestion Is Consolidation-Time

At session open, the agent reads **only its own platform's
surface**. Reading another platform's per-user memory for insight
is a consolidation-time activity (the `consolidate-docs` skill, step 3),
not a session-open activity. The reason: session-open grounding is
bounded by the session-open context budget (PDR-124's injected-tier
economy); sweeping all platforms' memories at every open would
exhaust it. At
consolidation depth, the agent is already in a wider-context mode
and the cross-platform sweep produces value rather than noise.

## Per-User Memory Lifecycle

When per-user memory entries are graduated to in-repo homes:

1. Land the graduation (new rule / pattern / PDR / SKILL
   amendment).
2. Update the per-user memory file's body with a "Graduated to
   <repo-path>" marker; keep the original substance as audit
   trail.
3. **Retire the entry's `MEMORY.md` index line.** The index is a
   session-injected surface
   ([PDR-124](../practice-core/decision-records/PDR-124-definition-surface-context-economy.md)):
   every line loads in every session. Once the substance lives in a
   repo home, an index line pointing at it is a double tax — the
   repo home already loads (or is read on demand), and the dead line
   crowds live entries toward the harness truncation point. The
   per-entry file (step 2) keeps the full audit trail; the index
   carries live, ungraduated entries only.

Entries graduated before this lifecycle was amended (2026-07-03,
PDR-124) may still hold "Graduated to …" index lines; retire them
on encounter during any sweep. This rule names the discipline so it
does not depend on agent recall.

## Composition

- [PDR-124 (definition-surface context economy)](../practice-core/decision-records/PDR-124-definition-surface-context-economy.md) —
  the two-tier contract this rule's index-line retirement step
  operationalises; truncation of the index is the defect signal it
  names.
- [`directive-file-context-budget`](directive-file-context-budget.md) —
  the sibling context-economy rule (directive-file *editing* below
  30% context, per PDR-052). Cross-platform per-user sweeps are
  session-open-budget work deferred to consolidation per PDR-124.
- [`executive-memory-drift-capture`](executive-memory-drift-capture.md) —
  when executive-memory drift surfaces, the corrective capture
  may seed both per-user memory AND napkin; this rule names the
  flow from one to the other.
- [`consolidate-at-second-consumer`](consolidate-at-second-consumer.md) —
  when the same substance appears in a second per-user memory
  on another platform, the consolidation trigger fires and
  the substance graduates.
