---
fitness_line_target: 120
fitness_line_limit: 150
fitness_char_limit: 9000
fitness_line_length: 100
---

# Orientation

This directive carries the layering contract: where content lives in
the repo, in what authority order, and which layer owns which kind of
claim. It is a directive because it governs stance for every session —
it does not change with workstream drift.

See [`.agent/memory/README.md`](../memory/README.md) for the
three-mode memory taxonomy and
[`.agent/memory/operational/README.md`](../memory/operational/README.md)
for the operational-memory surfaces and authority order within them.

## Layers

| Layer | Purpose | Surfaces | Read trigger |
| --- | --- | --- | --- |
| **Doctrine** | Read-and-internalise; sets stance for every session | `.agent/directives/` (AGENT.md, principles, testing-strategy, schema-first-execution, metacognition, orientation) | Session open — Ground First step 1 |
| **Portable Doctrine** | Cross-repo Practice doctrine; travels with Practice Core | `.agent/practice-core/` (trinity, PDRs, patterns) | Orientation + when Practice questions arise |
| **Active Memory** | Learning loop — capture, distil, graduate, enforce | `.agent/memory/active/` (napkin, distilled, patterns, archive) | Session open — Ground First step 3 |
| **Operational Memory** | Continuity / session-resume state | `.agent/memory/operational/` (repo-continuity, threads, workstreams, tracks) | Session open — Ground First step 4 |
| **Executive Memory** | Stable organisational contracts and catalogues | `.agent/memory/executive/` (artefact inventory, reviewer catalogue, adapter matrix) | Ad-hoc lookup when taking an action the surface governs |
| **Plans** | Scope, sequencing, acceptance criteria | `.agent/plans/*/active/*`, `.agent/plans/*/current/*` | When picking up a lane |
| **Reference** | Library — read-to-learn about a matter | `.agent/reference/` (deep-dives, research, audits, reports, work-to-date) | When investigating a topic |
| **Workflow** | Named rituals and canonical commands | `.agent/skills/`, `.agent/commands/`, `.agent/rules/`, `.agent/sub-agents/` | On invocation or trigger |
| **Platform Adapters** | Thin wrappers pointing back at canonical surfaces | `.cursor/`, `.claude/`, `.gemini/`, `.agents/`, `.codex/` | Platform-specific activation |

## Authority Order (for same-scope conflicts)

When two surfaces make conflicting claims on the same field, the
higher-authority surface wins. This is a tiebreaker for same-scope
conflicts, not a gating rule across different-scope claims.

1. **Plans** (`.agent/plans/*/active/*`) — scope, sequencing,
   acceptance criteria, validation.
2. **`memory/operational/repo-continuity.md`** — canonical continuity
   contract.
3. **`memory/operational/threads/<slug>.next-session.md`** — thread-level
   identity + next-session landing (PDR-027).
4. **`memory/operational/workstreams/<slug>.md`** — lane-level
   short-horizon state.
5. **`memory/operational/tracks/*.md`** — tactical coordination only;
   never authoritative for scope.

Doctrine (directives, ADRs, PDRs) sits above these for *governance*
claims — a plan that contradicts an ADR must yield, unless the plan
explicitly amends the ADR in the same commit.

## Routing Rule

New content belongs at the most durable layer that fits its
read-trigger and lifecycle:

- If it governs behaviour on **every session** → directive.
- If it carries **cross-repo portable** doctrine → Practice Core.
- If it captures **learning in progress** or **stabilised rules** →
  active memory.
- If it tracks **what's live right now** for session resume →
  operational memory.
- If it is a **stable contract or catalogue** that is looked up when
  performing a specific action → executive memory.
- If it governs **scope, sequencing, or acceptance** for a specific
  piece of work → plan.
- If it is **reference material** read to learn about a matter →
  reference.
- If it is a **named ritual or command** → skills / commands /
  rules.

Content that fits multiple layers lives at the most durable layer and
is referenced from shallower layers. Directives do not duplicate ADRs;
ADRs do not duplicate PDRs; plans do not duplicate principles;
executive memory does not duplicate ADRs.

## Owner Precedence

When the owner's stated direction conflicts with any surface —
including this directive — the owner wins. Non-goals and scope
decisions in plans that contradict recent owner direction are wrong
per the
[owner-beats-plan invariant](../memory/operational/repo-continuity.md#repo-wide-invariants--non-goals).
Any session executing against a plan with non-goals MUST re-read them
against recent owner direction before acting.
