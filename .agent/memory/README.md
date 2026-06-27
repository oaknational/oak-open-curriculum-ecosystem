# Agent Memory

Three modes of persistent memory, distinguished by refresh cadence,
purpose, and read trigger. Memory is the layer of content that is
*written and read* (as distinct from directives, which are
*read-and-internalise* doctrine, and reference/, which is *read-to-learn*
documentation).

## The Three Modes

### [`active/`](active/) — Learning-loop memory

**Purpose**: capture-distil-graduate-enforce. Active memory is the
ongoing learning record — what happened, what surprised us, what's
consolidating into rules.

**Refresh cadence**: continuous during sessions; fitness-governed
rotation.

**Contents**:

- [`active/napkin.md`](active/napkin.md) — ephemeral capture; ~500-line rotation threshold.
- [`active/distilled.md`](active/distilled.md) — refined cross-session
  lessons; fitness targets live in the file frontmatter.
- [`active/patterns/`](active/patterns/) — ecosystem-grounded pattern instances.
- [`active/archive/`](active/archive/) — napkin rotations and historical capture material.

**Read trigger**: session start (Ground First step 3 of start-right).

### [`operational/`](operational/) — Continuity / session-resume memory

**Purpose**: the repo's answer to *"where are we right now, what's
live, what's next."* Operational memory is the short-horizon
coordination surface that lets the next session (human or agent)
recover orientation after any interruption.

**Refresh cadence**: per session (`session-handoff` writes; session-
start reads).

**Contents**:

- [`operational/repo-continuity.md`](operational/repo-continuity.md) — canonical continuity contract.
- [`operational/open-questions.md`](operational/open-questions.md) — non-urgent unresolved decision-shapes for consolidation-time drain.
- [`operational/threads/<slug>.next-session.md`](operational/threads/) — per-thread identity + next-session landing + lane state (PDR-027).

**Read trigger**: session resume (Ground First step 4 of start-right).

### [`executive/`](executive/) — Organisational / contract memory

**Purpose**: stable schema knowledge about how the repo is organised
— artefact contracts, reviewer catalogue, platform-adapter matrix.
Executive memory is *looked up* when taking a specific action (e.g.
adding a new skill, choosing which reviewer to invoke), not
internalised before each session.

**Refresh cadence**: only when the artefact architecture itself
evolves (rarely).

**Contents**:

- [`executive/artefact-inventory.md`](executive/artefact-inventory.md) — canonical-vs-adapter taxonomy + how-to create new artefacts.
- [`executive/invoke-code-experts.md`](executive/invoke-code-experts.md) — reviewer catalogue, triage ladder, worked examples.
- [`executive/cross-platform-agent-surface-matrix.md`](executive/cross-platform-agent-surface-matrix.md) — platform-adapter surface matrix.
- [`executive/memory-state-substrate-contracts.md`](executive/memory-state-substrate-contracts.md) — human-facing host-local substrate instance for `.agent/state/`, `.agent/memory/`, generated read models, and historical roots; strict data lives beside it in `memory-state-substrate-contracts.manifest.json` and `memory-state-substrate-contracts.schema.json`; portable specification lives in PDR-050.

**Read trigger**: ad-hoc lookup when performing an action the surface
governs (adding an artefact, picking a reviewer, checking platform
parity).

## Tracking Tiers (memory / repo state / local state)

The three modes above classify memory by *refresh cadence*. A second,
orthogonal axis classifies the whole agent substrate by *tracking and
portability* — and it is the axis that decides what git tracks. There are
three tiers, and **only local state is git-ignored**:

| Tier | What it is | Tracked? | Examples |
| --- | --- | --- | --- |
| **memory** | Knowledge — learning and doctrine; portable across sessions (and, for Practice Core, across repos) | tracked | `active/` (napkin, distilled, patterns), the knowledge registers (pending-graduations, open-questions), `executive/` contracts, Practice Core |
| **repo state** | Work-in-progress state — repo-specific but **checkout-portable** (the same content applies on any clone of this repo) | tracked | `operational/` continuity: `repo-continuity.md`, `threads/*.next-session.md`, `director-handoff.md` |
| **local state** | Checkout/machine/session-specific — true only for this checkout right now | **git-ignored** | `.agent/state/`: `active-claims.json`, comms events, the rendered shared-comms log |

The discriminator between repo state and local state: **would this be true
on another checkout of the repo?** A thread record's "WS-1 next" or "PR #224
merged" applies on any clone → **repo state (tracked)**. "Which agent is
editing which file right now" / live coordination → **local state
(git-ignored)**.

**Invariant: only local state (`.agent/state/`) is git-ignored; memory and
repo state are tracked.** This is the existing boundary, not a new decision:
[ADR-203](../../docs/architecture/architectural-decisions/203-state-tier-process-and-archive-move.md)
establishes `.agent/state/collaboration/` as untracked-by-design, and
[PDR-094](../practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
governs its archive-not-delete disposition. The continuity surfaces under
`operational/` are repo state — correctly tracked as-is; no migration.

Precisely: `.agent/state/` **straddles tiers** — the git-ignore boundary is
drawn by its `.gitignore` rules, not by the directory. The **git-ignored local
state** is `active-claims.json`, the `comms/` events, `handoffs/`, the rendered
`shared-comms-log.md`, `cross-worktree-work-state.md`, and the processed
`archive/`. But three surfaces under the same directory are **tracked
repo-tier decision-provenance** — `conversations/`, `escalations/`, and
`sidebars/` (a decision record is true on any checkout, so it is committed, not
left local) — alongside the directory **scaffolding** (`README`s, the
`.gitignore` itself, `.example.json` fixtures). So `.agent/state/` is not
synonymous with "local state": classify by the `.gitignore` rules, and **commit
conversations / escalations / sidebars as the durable provenance they are.**

## Relationship to Other Layers

| Layer | Purpose | Surfaces |
| --- | --- | --- |
| **Directives** (`.agent/directives/`) | Doctrine — read-and-internalise; sets stance | `AGENT.md`, `principles.md`, `testing-strategy.md`, `schema-first-execution.md`, `metacognition.md`, `orientation.md` |
| **Memory** (this directory) | Persistent content — read and written; distinguished by mode | `active/`, `operational/`, `executive/` |
| **Reference** (`.agent/reference/`) | Library — read-to-learn about a matter | deep-dives, research, audits, reports, work-to-date artefacts |
| **Practice Core** (`.agent/practice-core/`) | Portable Practice doctrine — travels cross-repo | trinity, PDRs, patterns, incoming/ |

## Authority Order (for operational conflicts)

When operational surfaces disagree on the same field, the order is:

1. **Plans** (`.agent/plans/*/active/*`) — scope, sequencing, acceptance.
2. **`operational/repo-continuity.md`** — canonical continuity contract.
3. **`operational/threads/<slug>.next-session.md`** — thread-level identity + next-session landing + lane state.

This is a same-scope tiebreaker, not a gating rule across different
scopes.
