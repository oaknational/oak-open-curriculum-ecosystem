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
- [`active/distilled.md`](active/distilled.md) — refined rules; ~200-line target.
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
- [`operational/workstreams/<slug>.md`](operational/workstreams/) — per-lane resumption briefs.
- [`operational/tracks/<workstream>--<agent>--<branch>.md`](operational/tracks/) — single-writer tactical coordination cards (ephemeral; resolved-or-deleted at session close).

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
- [`executive/invoke-code-reviewers.md`](executive/invoke-code-reviewers.md) — reviewer catalogue, triage ladder, worked examples.
- [`executive/cross-platform-agent-surface-matrix.md`](executive/cross-platform-agent-surface-matrix.md) — platform-adapter surface matrix.

**Read trigger**: ad-hoc lookup when performing an action the surface
governs (adding an artefact, picking a reviewer, checking platform
parity).

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
3. **`operational/workstreams/<slug>.md`** — lane-level short-horizon state.
4. **`operational/tracks/*.md`** — tactical coordination only; never authoritative for scope.

This is a same-scope tiebreaker, not a gating rule across different
scopes.
