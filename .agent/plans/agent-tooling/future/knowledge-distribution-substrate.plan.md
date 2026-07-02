---
name: "Knowledge-Distribution Substrate (and the spawn flow as its first proving instance)"
status: future-strategic
type: developer-experience
lineage:
  serves_stream: agentic-framework
  derives_from: >
    F-98 / PDR-118 (agent work-state); the owner's substrate direction (2026-06-28);
    the comms event-graph (ADR-199 / PDR-094) as the working proof; PDR-119 (memory
    as an event-graph) as the first generalisation; the graph-approach convergence.
created: 2026-06-28
created_by: Beluga rides Wave (claude-code, claude-opus-4-8[1m])
---

# Knowledge-Distribution Substrate

> **What this records.** A session's worth of design insight, captured before context
> loss. The thesis (owner, 2026-06-28): claims, comms, memory, commit queues, the
> work-state binding, and the agent-spawn brief are **all the same act — moving
> information — done ad-hoc**. The missing foundation is **one strictly-defined,
> exhaustively-tested knowledge-distribution substrate** that every specific flow is a
> typed instance of. This is the agentic-framework value stream's core, and the
> graph-approach ([[project_graph_approach_is_practice_convergence_target]]) made
> foundational. **Status: future-strategic — recorded understanding + plan, not a build
> authorisation.**

## Why (the impact)

Today every information flow re-invents five things independently: *where it lives*,
*how it moves*, *what shape it is*, *how it fails*, and *how a consumer finds it*. The
symptoms are not separate bugs — they are the **absence of a substrate** showing through
in N places: two `git worktree list` parsers, three git-IO failure boundaries, the F-41
claims tail (claims don't default to the coordination home), authored-vs-derived
work-state, hand-maintained rosters, divergent freshness/liveness reads.

**Impact wanted:** one authoritative substrate where each flow declares its axes once and
is otherwise a thin typed instance. Consequences: the inconsistencies dissolve by
construction; new flows are cheap and correct; the substrate is the one thing held to the
highest assurance bar because everything rests on it.

## The substrate — five axes, each defined once

1. **Location & scope** — `per-session` · `worktree-local (per machine)` ·
   `checkout-portable` · `cross-machine-tracked`. One model (the #256 three-tier taxonomy;
   per-machine-home **resolution** as a declared property — the [HOME] need
   `resolveCoordinationHome` serves today, subsumed as a view, not pinned as the definition;
   git for tracked), never re-decided per flow.
2. **Record / event shape** — typed, PDR-027 identity-stamped, content-addressed,
   append-only where narrative, with typed edges (`supersedes` / `refines` / `links-to`).
   One schema spine.
3. **Transport verbs** — `append` · `render` (deterministic projection over the event
   set) · `union` (git for tracked, directory for local) · `archive-not-delete`
   (rotation) · `graduate` (an edge to a permanent home). One vocabulary.
4. **Failure semantics** — `loud-write-safety` · `soft-cosmetic` · `fail-fast-validation`
   · `advisory`, **declared per flow** over **one** classified, trusted-git IO boundary.
   (The two worktree parsers and three IO boundaries collapse to one.)
5. **Resolution** — how a consumer *finds* information, **declared as a property of the model**:
   per-machine-home resolution (the [HOME] need `resolveCoordinationHome` serves today, subsumed as
   one view), tracked-via-git, or identity-keyed. One resolver derived over the model — not the
   existing function as its definition.

### Grounded, not invented

The substrate is the **generalisation of the one flow that already works**: comms —
~1,900 immutable, content-addressed events, git-unioned, archived-not-deleted, never
needing a semantic merge. PDR-119 already takes the first generalisation step (memory →
event-graph, retiring `/oak-semantic-merge` for the append-only-narrative class). So the
substrate is *extracted upward* (comms = consumer one, memory = two — the natural
consolidate-at-second-consumer line), strict and tested **because** it rests
on the working instance.

## Two-layer identity model (Note 1, 2026-06-28)

The substrate must make explicit a layering that already exists implicitly:

- **Session identity** (`session_id` → deterministic name; PDR-027): the *running
  process*. Ephemeral — changes on every restart / compaction / succession (the
  Chinook→Hearth→Callisto→Cinder→Pulsar churn is exactly this).
- **Assignment / seat** — the *stable lane* `{worktree, branch, role, task, Director}` a succession of
  sessions occupies and hands off. This is the **work-state binding** (PDR-118, **derived**) + the role
  from the brief — **NOT a claim.**
- **Claim** — **optional and situational**: opened only to coordinate on a *mutable artefact/area* (and,
  in the Director case, to carry a coordination role across succession — `60baf0b1` adopted, a *special
  case*). An agent **exists, has a name, is on the team, and holds a seat with NO claim**
  ([[feedback_collaboration_is_not_claim_coordination]]: claims cover mutable artefacts).

**Verdict on Note 1:** identity / presence-membership /
work-state-seat / role / claim are **distinct facets**, not one (decompose-at-the-tension). No new ID
primitive is needed; the seat is the derived work-state binding + the role from the brief; the claim is
an optional coordination flow layered on only when there's mutable-area coordination. The session-name
is a human-friendly label on the current occupant; the stable handle is the **seat (work-state + role)**.
The session-name's *provenance* is itself an identity-flow concern (the identity row in §"Flows that
re-home"): the substrate-native cure **renders** the name from a once-stamped `session_id`+era rather than
caching it in env, which [`agent-naming-schema-v3`](../current/agent-naming-schema-v3.plan.md) takes its
first step toward via era-pinning (its §"Connection to the Knowledge-Distribution Substrate" records the
reconciliation).

## The spawn flow — the first proving instance

A single instance that exercises the substrate end-to-end and dissolves the most.

**Shape:** an `agent spawn` primitive, **run by a coordinator already in the primary
checkout** (it has the built tooling *and* the context for the new agent), that:

1. creates the worktree + branch + a fresh PDR-027 identity; **builds it** (folds in F-90);
   opens the draft PR (worktree-hygiene clause 1); **creates the seat** — the worktree/branch/role/task
   assignment carried in the brief (the work-state binding the spawned agent derives). **No claim is
   required** to exist or hold the seat; a claim is opened later only if the agent coordinates on a
   mutable area (for a Director-style coordination role, that claim is pre-positioned per PDR-064
   Moment-1);
2. emits a **copy-paste launch command** that `cd`s into the worktree, sets
   `PRACTICE_AGENT_SESSION_ID`, and starts the agent — **rooting the new session in the
   worktree**;
3. writes a **brief from a template** (`you are an implementer · X is the Director ·
   working on Y · ultrathink / start-right-team / metacognition / reason · don't trust
   subagents`), optionally as the opening prompt (`claude "$(cat <brief>)"`).

**What it dissolves / proves:**

- **The binding is born at spawn and derived forever after — never authored.** The
  coordinator knows `identity → worktree → branch` because it created them; the launched
  session, rooted in its worktree, *derives* the binding from its own cwd and *adopts* the
  seat (joined by the worktree + the brief's pointer). The anchor primitive, the
  `worktree_anchor` field, and the work-state authoring machinery are **gone** (lens-4).
- **The human paste is the right seam** — a sandboxed agent can't fork a terminal, and the
  human crossing that boundary is the owner-attention control point at the birth of an
  agent.
- **Start-right-team is automated** (the brief is the opener).
- **§B2 shrinks** — every spawned worktree is built at spawn, so "build every worktree" and
  half the binary-pin urgency dissolve as a by-product.

## Lens-4 dissolutions (what disappears, not what we build)

- **Launch-in-worktree** (via the spawn launch command) dissolves the authored-anchor
  machinery, F-87 (no launch-in-worktree), F-90 (unbuilt worktree), and most of F-91 (cwd
  reset) — the reset now lands in the worktree.
- **The substrate** dissolves the per-flow inconsistency: two parsers → one
  `parseWorktreeRecords`; three IO boundaries → one classified boundary; the F-41 claims
  tail → claims default to the home; hand-maintained rosters → a derived view.
- **The derived seat (work-state binding + role)** dissolves the need for a new identity primitive; the
  claim stays an optional coordination layer.

## Flows that re-home as typed instances

| Flow | Today (ad-hoc) | As a substrate instance |
| --- | --- | --- |
| Comms | the working proof | the canonical event flow (append/render/archive) |
| Memory | capture→distil→graduate, semantic-merge | event flow + render + `graduate` edges (PDR-119) |
| Claims / seats | required `--active`, no home default (F-41 tail) | register flow, finds the home; the seat handle |
| Work-state binding | authored-or-derived (PDR-118/ADR-206) | **derived** flow (launch-in-worktree); git ground truth + the home |
| Commit queue | bespoke paths | ordered-register flow |
| Spawn brief | (new) | directed-payload flow |
| Cross-worktree roster | hand-authored | derived view flow |
| Agent identity / name | env-cached name or era (`OAK_AGENT_IDENTITY_OVERRIDE` / `OAK_AGENT_NAMING_SCHEMA_ID`) | identity-event flow: stamp `session_id`+era once, **render** the name (no re-derive, no env era-pin); [`agent-naming-schema-v3`](../current/agent-naming-schema-v3.plan.md) era-pinning is the first proving step |

## The path (recorded plan)

Owner-approved lean (2026-06-28): **define the substrate's contract deliberately** (the
five axes, grounded in the comms event-graph) **and build the spawn flow as its first
proving instance — together**, the way comms proved the event model. Then re-cast the
work-state binding, the claims F-41 tail, and the launcher as flows on it.

Sequence (not authorised to build; recorded for when GO is given):

1. **Substrate contract** — a PDR (portable model: the five axes, the two-layer identity,
   the event/edge/render/archive/graduate verbs) grounded in comms + PDR-119; its host
   phenotype in an ADR at build time.
2. **Spawn flow** — `agent spawn` (coordinator-creates → human-pastes → derive-the-binding
   → brief template), the first proving instance.
3. **Re-cast existing flows** — claims-find-the-home (F-41 tail), one `parseWorktreeRecords`
   and one IO boundary, the derived roster (retire the hand-maintained map).

**Empirical gates (must verify, do not assume):**

- **Render-from-a-linked-worktree:** confirm a session launched in its worktree has cwd /
  `workspace.current_dir` = the worktree (does the harness cwd-reset land in the worktree?).
  This gate is the keystone of the whole binding dissolution.
- **Launch mechanism:** Claude Code native `--worktree` (the statusline contract's
  `worktree.original_cwd` implies it enters) vs a wrapper `cd && claude` — evaluate both.

## Open questions

1. **Substrate store** — graph-core (RDF, suited to the curriculum/intent graph) vs an
   evolved general Practice-graph store for operational state (PDR-119 §Sequencing). The
   substrate ships substrate-agnostic.
2. **Seat lifecycle** — exact pre-position→adopt mechanics for a coordinator opening a
   pending-adoption claim before the session exists; relation to PDR-064.
3. **Cross-machine** — resolution currently resolves only a **per-machine home** (the [HOME] need
   `resolveCoordinationHome` serves today); a shared/cross-machine resolution is unbuilt, out of scope.
4. **PDR-119 tail (open dissolution question)** — do the index-narrative surfaces
   (`repo-continuity.md`, `director-handoff.md`) **subsume as deterministic renders over the event
   set** (the substrate's render verb projecting them, dissolving in-place mutation *and* any semantic
   merge)? PDR-119 currently defers them (immutability fails in place); hold this as the open
   question of whether the index-narrative surfaces become deterministic renders over the event set.

## Relationship to existing work (SSOT / decoupling — documentation is infrastructure)

This plan is a **deeper frame, not a competing source of truth.** It must point to the
existing homes, never duplicate their content:

- **`collaboration-substrate-coordination-rightsizing` (the keystone) owns the
  coordination-substrate disposition.** That plan re-derives the *minimal coordination*
  machinery and its M4 produces the cull/fold/supersede list for the comms/coordination
  cluster. **This plan does not re-litigate that** — it sits one level up: the
  *knowledge-distribution substrate* is the foundational information-movement layer that
  coordination (claims/comms/watcher/liveness/roles), memory, and work-state are all
  **flows on**. Rightsizing culls the *coordination instance* to fit; this names the
  *substrate* the instance rests on. The two are decoupled and reference each other; the
  cluster's overlap analysis stays in the M1 inventory (its SSOT).
- **Supersedes** only the **authored-anchor** framing of the work-state binding (the
  ADR-206 draft + the registry plan's `worktree_anchor` / assert-primitive machinery): the
  binding becomes **derived** via launch-in-worktree. PDR-118's model stands; its OQ2
  resolves by the launch-topology change.
- ADR-206/207 numbers are released (ADR-207 is in use by the owner for DORA metrics).
- Does **not** re-decide what comms (ADR-199/PDR-094), memory (PDR-119), or the tier
  taxonomy (#256) settle — it **generalises** them (points to them as the proof and the
  members), per DRY.
- **The documentation estate is itself an instance of this substrate** — moving
  understanding across sessions/agents, ephemeral→durable. SSOT, DRY, decoupling,
  well-defined interfaces, and stable indexes are the substrate's strictness expressed for
  docs; the homing discipline, the practice-index bridge (Core↔host interface), and
  "entry points point, they do not carry" are existing instances of it.

## Non-goals

- No build authorisation — this is recorded understanding + a plan; the build is owner-GO-
  gated and proceeds via a substrate PDR + a host ADR.
- No new identity primitive. **The claim is NOT the seat** — an agent exists, has a name, is on the
  team, and holds a seat with no claim; a claim is optional, opened only for mutable-area coordination.
- No cross-machine collaboration filesystem (out of scope).
