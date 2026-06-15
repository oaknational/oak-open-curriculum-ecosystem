---
name: "Session-State Foundation, Team-State Derivation, and Statusline Icons"
overview: "Ground the statusline session-shape work in the right foundation: collaboration state belongs to the SESSION (every session owns it; solo is the floor; the agent holds an opinion on owner presence/engagement). Team state is the non-trivial DERIVATION of the collective session states. The statusline projects this session's slice. Experimental discovery phase — the model is explored in this plan, NOT crystallised into a PDR/ADR yet (owner 2026-06-15)."
todos:
  - id: ws1-session-state-model
    content: "WS1: define the SESSION-STATE model — a pure, IO-free, schema-driven per-session type. Collaboration state (solo is the floor — a session always has it and knows it directly), roles (incl director), threads (incl explicit non-thread-work marker), the agent's owner-presence/engagement opinion, and this session's relations to others (the shared edges it participates in). The session OWNS this and publishes it to shared substrate. TDD: model and fixture-built session state, no IO."
    status: pending
    depends_on: []
  - id: ws2-team-state-derivation
    content: "WS2: derive TEAM state as the non-trivial composition of the collective PUBLISHED session states, IO-free core and thin IO adapter. The substrate artefacts (claims, comms participants, ArcAngel rosters, sidebars) ARE the published projections of session states; the active-agent set is their union, deduplicated by the (agent_name, id) identity tuple (PDR-076a, the authority PDR-095 delegates to) — NOT claim-holders alone. (Note: the current code dedups on name plus session_id_prefix at statusline-session-shape.ts:164-166, not the full UUID tuple — reconcile at WS2.) Bounded per-tick cost (no full comms-corpus scan; comms read globs comms-seen/*.heartbeat.json only). TDD over fixture published-session-state sets."
    status: pending
    depends_on: [ws1-session-state-model]
  - id: ws3-icon-projection
    content: "WS3: project THIS session's slice into the left-packed icon model. Pos1 NEVER empty (solo|pair|group from the size of the team THIS session shares an edge with — a bystander sharing no edge is solo, not inflated). Pos2 conventional comms; Pos3 ArcAngel; Pos4 director/directed-member. The owner-presence/engagement opinion is part of session state — whether/how it projects to a glyph is an OPEN design question for owner shaping (do not invent a position). Glyphs verified-rendering (no tofu). Pure register→icon string. TDD over the full matrix incl. left-pack."
    status: pending
    depends_on: [ws1-session-state-model]
  - id: ws4-wire-statusline
    content: "WS4: wire the projection into the statusline — replace resolveSessionShape with the session-state-first model. The OWN session's resting state is solo (the floor), never 'unknown'; 'unknown' applies ONLY to genuinely-unobservable OTHER sessions, and team state composes what is observable. Update statusline-render.ts and statusline-identity.ts (IO adapter gathers the bounded published-state sources). TDD: rework the fixture matrix; all statusline tests green."
    status: pending
    depends_on: [ws2-team-state-derivation, ws3-icon-projection]
  - id: ws5-readiness-and-proof
    content: "WS5: readiness and proof. Re-run the readiness review against the re-grounded design (the 2026-06-14 verdict predates it). Prove the bounded-source per-tick cost first-hand. Run the app: render the statusline for solo / pair / group / owner-present / owner-absent / ArcAngel-active / directed and capture the icon strings. Consolidation workflow on completion. NO PDR/ADR yet — discovery phase."
    status: pending
    depends_on: [ws4-wire-statusline]
isProject: false
---

# Session-State Foundation, Team-State Derivation, and Statusline Icons

**Created**: 2026-06-13 (team-state register, Whippoorwill holds Catacomb). **Re-grounded session-state-first**: 2026-06-15 (Cutter spins Quay, session 9b4085 — a PDR-027 session-id prefix, not a commit SHA) under owner direction. **Collection**: agent-tooling. **Lane**: `current/` (queued; not started).

> **Re-grounding note (2026-06-15).** This plan was originally framed *team-first*
> ("model the evolving state of the TEAM ... derived from bounded substrate"). The
> owner corrected the foundation: **collaboration state belongs to the session**,
> not to a shared registry the session is read out of. This rewrite leads with
> session state; team state becomes its derivation; the statusline becomes a
> projection. The prior framing's execution substance (bounded sources, cost
> contract, the union refinement) is preserved, re-homed under the corrected
> foundation. The 2026-06-14 assumptions-expert verdict **predates the
> re-grounding** and is carried below only as history — a fresh readiness pass is
> required (WS5).

## Discovery phase — not doctrine (owner, 2026-06-15)

The session/team-state model is in **experimental discovery**. This plan is the
discovery vehicle: it **names decisions and considerations; it does not
crystallise them**. No PDR or ADR is authored for this model now — it is too
early. Shapes are held deliberately open and revised as discovery proceeds.
`PDR-095` (collaboration is multi-dimensional) already exists and this model
*aligns with and extends* it, but the session-state foundation does **not**
graduate to doctrine until discovery settles. The §Non-goals make this binding.

## The concept (the re-grounding) — four pillars

1. **Collaboration state belongs to the session.** Every session owns its
   collaboration state and knows it *directly* — a session IS its own state, so
   it never has to read a shared file to learn whether it is collaborating. The
   shared substrate (claims registry, comms, ArcAngel channels, sidebars) is the
   **publication medium** by which a session makes its state observable to
   others, not the source of truth for the session's own state.
2. **Solo is the floor.** A session always has collaboration state, and the
   resting value is **solo** (not collaborating). There is no "unknown" resting
   state for one's *own* session. "Unknown" is meaningful only about *other*
   sessions that cannot be observed this tick — and even then, team state
   composes what *is* observable and defaults the rest, rather than collapsing
   the whole shape to blank. (This is the precise correction to the current
   code, where an absent `active-claims.json` yields `teamShape: 'unknown'` and
   renders no icon at all — see Context.)
3. **The agent holds an opinion on owner presence/engagement.** Whether the
   owner is currently present and engaged is a dimension of *session* state — the
   agent's live belief, owned by the session. It is modelled as a first-class
   session-state field. Whether and how it projects to the statusline is an open
   design question (WS3), shaped by the owner.
4. **Team state is the non-trivial derivation of the collective session states.**
   Team state is real, but it is *composed from* the published session states of
   the active agents — it is not a primary thing read independently of them. The
   substrate artefacts the derivation reads ARE those published projections.

The statusline renders **this session's projection** of the model.

## Context / problem

The Claude statusline today resolves a narrow per-agent shape
(`solo | peer | directed` and an ArcAngel wing) in
`agent-tools/src/claude/statusline-session-shape.ts`, from two cheap reads (the
claims registry and a rapid-comms listing). Two foundational problems:

1. **Wrong ownership / wrong floor.** `resolveSessionShape` returns
   `teamShape: 'unknown'` when `active-claims.json` is absent
   (`statusline-session-shape.ts:109-111`), and `teamIcon('unknown')` returns
   `undefined` (`statusline-indicators.ts:84`), so a normal session renders **no
   session-shape icon at all** (confirmed 2026-06-15 by running the built
   adapter: four-row acorn renders, icons NONE). The session's own state is
   self-known and should rest at **solo**, never `unknown`.
2. **Substrate-as-source, not session-as-source.** The model reads team shape
   *out of* shared substrate as if that were primary. The comms-corpus research
   named the **substrate-pointer pattern** — agents reading stale, fragmented
   snapshots of team state — as a recurring failure (it recurred live: a peer
   read a named-successor as active, a local HEAD as origin). The cure is a model
   where each session owns and publishes its state and team state is the derived
   composition.

There is also no **owner-presence/engagement** dimension at all today.

### Existing capabilities (build on, do not duplicate)

- Pure resolver / IO adapter split already exists
  (`statusline-session-shape.ts` pure; `statusline-identity.ts` adapter) — the
  WS1/WS2 pure-core and thin-adapter shape mirrors it.
- The interim session-relative resolver (2026-06-14): team shape gated on a
  fresh own claim, a new `observing` shape (dim eyes), and the
  `statusline-ansi.ts` / `statusline-indicators.ts` / `statusline-render.ts`
  module split. WS4 supersedes the single-enum `teamShape` but preserves its
  membership-relativity; the indicators module is the seam WS4 wires into.
- Verified glyphs (2026-06-13): 🧭 director, 👪 directed, 🤝 peer, 🧍 solo, 🪶 wing.
- The `(b)` wing-fix (`listExperiments` → `rapid-comms`, commit `6d1e45f35`).

## End goal

A **session-state model** owned by each session (collaboration state with a solo
floor, roles, threads, and an owner-presence opinion), from which **team state**
is derived as the composition of the collective published session states, and
from which the **statusline icons** are projected for this session. The model
tracks the team as a relational whole (agents = nodes, shared channels = edges,
threads = work-groupings) built up from session-owned state — explored
experimentally, not yet doctrine.

## Mechanism

Session-owned state, **published** to bounded substrate and **composed** into
team state, is the structural cure for the substrate-pointer pattern: each
session is the authority on itself; team state is one derivation; the statusline
is one projection. Deriving (not hand-maintaining) prevents drift; bounding the
sources (no full comms-corpus scan) keeps the constantly-ticking statusline
cheap. The solo floor guarantees the own-session projection is never blank.

## The icon specification (owner-fixed, carried forward)

Four left-packed positions; **Position 1 is never empty** (this is the solo-floor
pillar made visible). Where any other position is empty, the next present icon
fills the first free slot.

| Pos | Meaning | Glyph |
| --- | --- | --- |
| 1 | Team size for this session: **solo / pair / group** | size glyph (never empty) |
| 2 | Participates in **conventional comms** | handshake |
| 3 | Participates in **ArcAngel** comms | feather |
| 4 | **Director**, or **member of a directed team** | director / member glyph |

**Owner-presence/engagement** (Pillar 3) is modelled in session state; its icon
manifestation (a 5th position? a modifier on Pos1? not shown at all?) is an
**open design question for owner shaping at WS3** — this plan does not invent a
position for it (no unauthorised scope).

## The session-state model (WS1, illustrative — schema is source of truth, hand-authored)

Per session: `collaboration` (resting **solo**; the shared edges this session
participates in — claim-overlaps, comms threads, ArcAngel channels, sidebars),
`roles[]` (incl `director`), `threads[]` (with an explicit non-thread-work
marker), `owner_presence` (the agent's opinion: present-and-engaged / away /
unknown-about-the-owner — distinct from collaboration state). The session owns
this and publishes the observable parts.

**Team-level (derived, WS2):** the active-agent set (the UNION of agents across
the published session states visible in the bounded sources), `directed` (a fresh
`director`-role claim exists), `size` (distinct active agents → solo=1 / pair=2 /
group≥3 for *this session's* connected team).

## Bounded derivation sources (WS2) — the cost contract

The statusline ticks constantly; no full comms-corpus scan per tick.

- **Claims registry** (`active-claims.json`, small): published roles, director,
  threads, claim-overlap edges.
- **ArcAngel channels**: `.agent/collaboration/rapid-comms/*.md` — bounded
  listing; arity (pairwise / n=3 / n>3) from participant names in filename and
  in-file roster; liveness from mtime within the ARC window.
- **Conventional-comms participation**: the BOUNDED `comms-seen/*.heartbeat.json`
  watcher files and newest-N events — **never** a full `comms/` scan, **never**
  `comms-seen/*.json` (the large snapshots). (Carried from prior Condition B.)
- **Conventional group comms and sidebars**: `conversations/` and `sidebars/` are
  **descoped as union sources for this plan** (review consensus 2026-06-15,
  resolving carried Condition C/D): they carry no machine-readable
  participant-roster contract, and the active-agent set is well-covered by claims
  ∪ comms-heartbeats ∪ ArcAngel-rosters (the three sources with parseable
  identity). Re-admit them only when those surfaces publish a roster contract.
- **Threads**: the claims `thread` field and thread records; non-thread work marked.

Core is IO-free and pure (`published session states → team state`); a thin IO
adapter gathers the bounded reads (mirrors the existing pure-core / adapter
split).

## Refinement — the active-agent set is session-based, not claim-based

(Originally framed 2026-06-14 as "claim-independent"; re-expressed here under the
session-state foundation.) The active-agent set and team size derive from the
UNION of agents whose **published session state** is visible across any bounded
source — never from claim-holders alone. Claims measure *coordination over
mutable artefacts* (a read-write concern); a read-only session holds no claim yet
two read-only agents reasoning together are a genuine pair. Anchoring the set on
claims would render that pair `solo` — the exact failure the model exists to
retire. Pos2/Pos3 already key off claim-independent participation; this extends
the same to Pos1's agent set. **Membership vs observation:** Pos1 is the size of
*the team this session shares an edge with*, not the size of the active field
around it; a pure bystander is solo and must not be inflated.

## Means

Frontmatter todos WS1–WS5. WS1 (session-state model) is the foundation; WS2 (team
derivation) and WS3 (icon projection) both build on WS1 and are independent of
each other; WS4 (wiring) consumes WS2 and WS3; WS5 (readiness/proof) closes.

## Acceptance criteria and proof contract

| Id | Acceptance | Proof |
| --- | --- | --- |
| ws1 | Schema-driven session-state type compiles; a fixture session state exercises every field incl. solo-floor resting value, shared edges, and the owner-presence opinion | unit |
| ws2 | `published session states → team state` is pure and IO-free; the IO adapter reads only the bounded sources (asserted: no full `comms/` read, no `comms-seen/*.json`); active-agent union and size derived correctly over fixture sets | unit and integration |
| ws3 | Icon projection passes the full matrix: Pos1 solo/pair/group (never empty); Pos2/3/4 present-and-absent; left-pack ordering verified for every empty-position combination; glyphs render (no tofu) | unit |
| ws4 | `resolveSessionShape` replaced by the session-state-first model; OWN session rests at solo (never unknown); honest unknown retained ONLY for unobservable other sessions; render emits the projection; all statusline tests green | unit and integration |
| ws5 | Fresh readiness verdict recorded (post-re-grounding); per-tick cost measured on a realistic source set; app run captures icon strings for solo/pair/group/owner-present/owner-absent/ArcAngel/directed | non-code and value-proxy |

## Prerequisites

- **Beneficial**: the single ArcAngel-home constant (canonicalises
  `rapid-comms/`). Minimum shippable without it: WS2 reads the literal
  `.agent/collaboration/rapid-comms/` path; the constant is folded in when it
  lands.
- **Beneficial**: comms archive-move shrinks live `comms/`. Minimum shippable
  without it: WS2 uses the bounded heartbeat/recent-N surface regardless of
  corpus size (corpus-size-independent by design).

## Non-goals

- **No PDR/ADR authored during the discovery phase** (owner 2026-06-15). The
  model is explored here, not crystallised. Graduation to doctrine is a separate,
  later decision once discovery settles.
- No hand-maintained team-state file — team state is derived only.
- No full comms-corpus scan per tick; no `comms-seen/*.json` read.
- No new coordination machinery (CLIs/watchers/hooks) — a pure model and projection
  over existing substrate.
- No invented icon position for owner-presence — its manifestation is an open
  owner-shaped design question (WS3).
- No change to the underlying substrate surfaces — read-only.
- No broadening beyond the statusline projection in this plan; design the model
  reusably, but additional consumers are out of scope here (YAGNI).

## Risks

| Risk | Mitigation |
| --- | --- |
| Premature crystallisation of an unsettled model | Discovery framing is binding (§Non-goals); shapes stay open; reviewers briefed on discovery altitude |
| Premature *crystallisation* of an unsettled shape (NOT breadth) | The genuine risk is closing a shape into doctrine before discovery settles — not modelling fields for consumers the owner has in mind. Forward-design breadth is intended creation, not over-building (owner 2026-06-15). Hold shapes open; do not narrow on a no-current-consumer basis |
| Per-tick cost (rapid-comms and recent-comms reads) | Bounded glob (heartbeat-only); measure first-hand (WS5); heartbeat-only fallback |
| Glyph rendering (tofu) | Re-verify every glyph in the target terminals (prior tofu'd-peer lesson) |
| Left-pack / solo-floor ambiguity | The matrix test (WS3) is the executable spec; solo-floor is a named ws4 acceptance |
| Owner-presence opinion has no reliable signal source | Treat as the agent's *opinion* (best-effort belief), not a measured fact; WS1 models it as such; do not over-claim accuracy |

## Foundation alignment

- `principles.md`: simplicity-first — one session-owned model, pure core, no new
  machinery; the session is the authority on itself (clear ownership boundary).
- `schema-first-execution.md`: the session-state type flows from a hand-authored
  schema (collaboration coordination types — NOT the OpenAPI cardinal rule, which
  does not apply here).
- `testing-strategy.md` / `tdd-as-design.md`: every cycle is a test-and-code pair;
  the fixture matrix is the projection's executable spec; pure core keeps tests
  IO-free.
- Memory anchors: `feedback_premature_crystallization` (discovery framing),
  `feedback_present_key_is_not_graph_identity` (edges, not a field-on-every-record),
  `feedback_research_outputs_name_not_make_decisions`,
  `project_collaboration_paused_on_evidence`.

## Plan-body first-principles check

Fires at WS1 (is the owner-presence opinion genuinely session-owned state, or is
it being smuggled in as a measured fact it cannot be?), WS2 (is the bounded-source
set still the right cure?), and WS3 (does the left-pack spec survive contact with
real glyph widths / terminal rendering?).

## Readiness reviewers

Before any `READY FOR EXECUTION`: `assumptions-expert` (proportionality of the
model vs the single statusline consumer, **at discovery altitude** -- forward-design
fields are not over-building), `code-expert` (gateway), `test-expert` (the matrix
-- the pure-core/IO split), `architecture-expert` (the published-state adapter boundary —
substrate as publication medium, not source), and `type-expert` (the closed
`owner_presence` union and the pure-core types). `accessibility-expert` / `design-system-expert` not
applicable (terminal glyphs, not rendered UI).

## Readiness verdict (2026-06-14, assumptions-expert) — PRE-RE-GROUNDING, HISTORY ONLY

Recorded against the *team-first* framing; **superseded** by the 2026-06-15
re-grounding. A fresh pass is required (WS5). Retained for continuity:

> **READY-WITH-CONDITIONS.** Design sound; no critical findings. Conditions then
> open: **(A)** WS1 fields with no current consumer — owner verdict: retained as
> forward-design (absence of a consumer is not over-building). **(B, execution)**
> WS2 must glob `comms-seen/*.heartbeat.json` only (24 × ~500B), never
> `comms-seen/*.json` (~168 × 100–200KB). **(C/D, sourcing)** `conversations/` and
> `sidebars/` have no machine-readable participant-roster contract; either define
> the extraction contract or descope them as union sources until one exists — the
> active set is well-covered by claims ∪ comms-heartbeats ∪ ArcAngel-rosters.

Conditions B and C/D remain valid execution constraints under the re-grounding.

## Learning loop and lifecycle

Per [`templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
completion runs the consolidation workflow. The session-state model is a
discovery output — a *candidate* pattern, **not** graduated to PDR/ADR during the
discovery phase (owner 2026-06-15). Archive with outputs mined on completion.

## Relationship to other statusline plans (the unified lane)

All live in `agent-tooling/current/`; the canonical hub is the
[`statusline-enhancements` thread record](../../../memory/operational/threads/statusline-enhancements.next-session.md).

- **Sibling — logo column / reuse**:
  [`statusline-logo-modularisation.plan.md`](statusline-logo-modularisation.plan.md)
  — separates the Oak-mark logo mechanism and asset from the statusline setup and
  hardens the soft surface. Shares the `renderStatusline` seam with this plan;
  the two are coordinated, not dependent.
- **Supersedes** the narrow resolver from the archived
  [`statusline-session-shape-indicators.plan.md`](../archive/completed/statusline-session-shape-indicators.plan.md)
  (solo/peer/directed and arcActive).
- **Aligns with / extends** `PDR-095` (collaboration is multi-dimensional) — but
  authors no new doctrine during discovery.
- **Realises** the comms-research insight: a session-owned, derived team-state
  model is the structural cure for the substrate-pointer pattern.
- **Open hypothesis** (from the thread record): the ArcAngel wing may go dark
  during heavy idle collaboration if it keys on render-recency rather than
  membership — verify against `resolveArcActive` as part of WS2/WS4.

## Review dispositions (2026-06-15)

Findings from docs-adr-expert and architecture-experts barney/betty/fred/wilma,
each validated first-hand before acceptance (owner directive). YAGNI /
over-building / speculative-optionality findings were re-screened against the
innovation-and-discovery context (owner 2026-06-15): forward design for consumers
the owner has in mind is creation, not a YAGNI breach. Verdicts:

| # | Source | Finding | Verdict and action |
| --- | --- | --- | --- |
| 1 | docs / fred | Active-agent dedup cited PDR-027; hub cited PDR-095 — both wrong | **ACCEPTED.** Validated: PDR-095 frontmatter delegates dedup to PDR-076a. Fixed WS2 and hub to the (agent_name, id) tuple (PDR-076a); noted the code dedups on name-and-prefix, reconcile at WS2 |
| 2 | wilma / betty / barney | `conversations/` and `sidebars/` are contract-less union sources on the critical path (carried Condition C/D) | **ACCEPTED with innovation framing.** These are *intended* union sources, not dropped — they are deferred only because they carry no machine-readable participant-roster yet, and authoring that contract is out of this plan's read-only scope. Re-admit once those surfaces publish a roster. (This is a real parse-contract gap, not a no-consumer YAGNI narrowing.) |
| 3 | betty / fred / wilma | `owner_presence` field has no signal source; risks an open type | **ACCEPTED.** Model as a closed union, IO-free, held as opinion-not-fact; the signal-derivation is an explicit deferred discovery question — not over-specified now |
| 4 | wilma | IO adapter conflates read-failure with read-success-empty | **ACCEPTED.** WS2 adapter distinguishes them: read-failure → unknown (other sessions only); empty → contributes nothing; own session floor stays solo |
| 5 | wilma / betty | "shared edges" defined at projection time, not in the WS1 model | **ACCEPTED.** WS1 models shared edges as a first-class set (per present-key-is-not-graph-identity) |
| 6 | betty | WS4 doesn't name `statusline-indicators.ts` as a co-updated file | **ACCEPTED.** WS4 names it; `teamIcon` updates atomically with the `teamShape` change |
| 7 | fred | Readiness roster omits architecture and type reviewers | **ACCEPTED.** Both added |
| 8 | betty | No test for `ownAgentName === undefined` resting at solo | **ACCEPTED.** WS4 matrix includes the undefined-identity fixture (solo, not unknown) |
| 9 | wilma | ArcAngel clock-skew window assumption undocumented | **NOTED.** WS5 documents the 30-min window absorbs expected skew; `ageMs >= 0` already guards future mtime |
| 10 | docs | Re-grounding ref `9b4085` does not resolve as a git SHA | **REJECTED as a dead reference** — `9b4085` is the PDR-027 session-id prefix (per SessionStart), not a commit SHA; reviewer misread. Clarified wording to remove the ambiguity |
