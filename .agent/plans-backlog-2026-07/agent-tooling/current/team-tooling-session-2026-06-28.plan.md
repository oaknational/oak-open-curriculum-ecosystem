---
name: "Team-Tooling Session — Director + 2 Implementers (2026-06-28)"
status: current
overview: "Make multi-agent coordination trustworthy and ergonomic — the cheap corruption floor plus the spawn-flow keystone — readying the worktree-per-agent transition."
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: "worktree-per-agent transition (Director + ephemeral-Implementer operating model)"
  strategic_choice: "PDR-117 Director/Implementer roles; the worktree-per-agent transition"
  derives_from: "cost-of-collaboration.plan.md §Locked scope (owner-decided 2026-06-28)"
isProject: true
---

# Team-Tooling Session — Director + 2 Implementers (2026-06-28)

**Last Updated**: 2026-06-28
**Status**: 🟢 APPROVED (owner-approved 2026-06-28; readiness-reviewed) — awaiting only the Director-authored companion opener instance (a pre-session move-0)
**Operating model**: Director + 2 implementers, each in its own git worktree (PDR-117).

The cohesion anchor for the next long-running team session. It fixes the team-level impact and
outcomes and traces every lane to them; the per-lane work lives in the referenced execution plans
(ADR-117 one-fact-one-home), and the operational HOW lives in the companion
[team-session-opener](../../../prompts/agentic-engineering/team-session-opener.prompt.md) instance
(to be instantiated alongside this plan). The build list is the owner-decided
[`cost-of-collaboration.plan.md` §Locked scope](cost-of-collaboration.plan.md).

---

## Team-Level Impact (the north star)

- **Impact**: every agent (and the owner) in future multi-agent sessions is better off because the
  team's own coordination state becomes **trustworthy** (liveness cannot be corrupted by a dead
  agent's false heartbeat; a claim from a worktree is visible to peers; a session runs in the right
  tree) and **ergonomic** (spawning and per-message coordination stop being manual and error-prone).
  This is the load-bearing increment for the worktree-per-agent transition (the strategic root in the
  [director brief](../../../memory/operational/director-handoff.md)).
- **Why now**: the dedicated consolidation merged (#267 → `main`); the readiness analysis shows the
  corruption floor is cheap and the spawn-flow keystone is owner-approved and ready-to-build; the
  scope is locked. The next effort is exactly this session.

## Team-Level Outcome Goals (what this session delivers)

- **O1 — Liveness is trustworthy.** A dead agent's watcher stops (no false heartbeats), the canonical
  comms watcher provably surfaces events, and heartbeat-silence is surfaced. Proof: F-82 verified
  (output pasted), F-101 kill-tree landed, F-75 alert landed.
- **O2 — Claim/comms coordination is correct and ergonomic.** A `--active` claim from a linked
  worktree resolves the coordination home, and the per-message tax is cut. Proof: F-85 default landed;
  the comms+claims ergonomics batch (F-72 / F-89 / F-70 / F-77 / F-79 / F-80) shipped.
- **O3 — Spawn is one command and the team picture is derived.** `agent spawn <lane>` yields a built,
  draft-PR'd worktree and a launch command; the Director reads `(identity → worktree → branch →
  last-seen)` from one derived surface. Proof: spawn-flow Phase 1 E2E + Phase 2 (the F-98 binding
  view) + the F-98 heartbeat-age column.
- **O4 — The composed-liveness model is DECIDED (not built).** A decision record (PDR-118 OQ5
  amendment) specifies the model and its consumer-absent fallback, unblocking the F-44 structural fix
  for a later session. Proof: the record authored and owner-ratified.
- **O5 — Orientation is discoverable on the MCP (sticking-plaster).** A connected agent finds the
  `oak-under-the-hood` tool for non-curriculum / mechanism / MCP-app / repo questions — one pointer
  sentence on the discovery surface, relaxing the over-separation that hid it. Precursor to the
  architectural fix. Proof: the server-instructions name orientation, and a real-client check routes a
  "how is this built" query there while curriculum queries still route to the curriculum tools.

## Cohesion Mechanism (what the worktree-pilot lacked)

- **Lane-to-outcome trace**: every seat below names the outcome it serves; a lane serving no outcome
  is cut or re-scoped, not run.
- **The Director holds the whole**: the Director keeps every live lane traceable to an outcome and
  re-routes drift (PDR-117 minimum-action; direct, do not execute). Its operational instance is the
  [director brief](../../../memory/operational/director-handoff.md).
- **Cohesion checkpoints**: (1) the **F-82 result** is an opening gate — if the watcher filter has
  drifted, the team coordinates blind, so the comms/ergonomics work and cadence are reshaped before
  proceeding; (2) each PR merge waypoint; (3) a mid-arc checkpoint (session-discipline component);
  (4) the **O4/OQ5 decision late**, deliberately fed by the build lanes' lived liveness experience —
  the session is the experiment that grounds the model.
- **Owner-interface discipline**: the Director is the single owner-interface (PDR-117 routing). The
  **code-owner merge gate is the owner's** (the owner's account) — the Director drives each PR to
  merge-ready; the owner clicks. No `--admin`, no `--no-verify`.

## Sequencing and bootstrap (the session dogfoods its own tool)

Spawn-flow is built *during* the session that wants it, so the cheap Must-floor is the runway:

1. **Bootstrap (manual, correct-by-the-opener).** Each implementer creates its worktree manually
   (`git worktree add … && pnpm install && pnpm build`, per the opener) and coordinates by **explicit
   `--active <coordination-home>`** — the opener already mandates explicit targeting, so coordination
   is *correct* from the first move with no new code. F-85 later makes that the default (ergonomic,
   not a correctness blocker for this session).
2. **F-82 first** (Implementer B, move-1) — the opening gate above.
3. **Parallel build** — A on the spawn/binding lane; B on the floor/liveness/ergonomics lane.
4. **Adopt the tool as it lands** — once A's `agent spawn` works, later worktrees/spawns use it.
5. **O4/OQ5 decision late** — a peer-design sidebar (Director + a wound-down implementer; design
   work suits a sidebar, not hub-and-spoke), output a decision record, owner-ratified.

**Clean slip-order if time runs short** (named so slippage is deliberate, not silent): F-75 first
(a Could), then the ergonomics-batch tail, then the F-98 heartbeat-age column — each is a tail with
nothing waiting on it. F-98 is the binding lane's definition-of-done; if spawn-flow Phase 1 overruns
it slips cleanly.

## Seats and Lanes

The whole session builds agent tooling, so the template's dedicated agent-tooling seat is **folded** —
every lane is a tooling fix, and new friction surfaced live is absorbed by the lane it touches (or the
floor lane). Operational seat-brief detail (owned surfaces, must-not-touch, worktree) lives in the
companion opener instance — referenced, not duplicated here.

| Seat | Serves | Lane (one line) | Execution plan | Hard sequencing gate |
| --- | --- | --- | --- | --- |
| Director | all | Direct; hold cohesion; route; merge-sequence; state/continuity writes; frame + adjudicate the OQ5 decision | [director brief (PDR-117)](../../../memory/operational/director-handoff.md) | — |
| Implementer A | O3 | Spawn/binding: spawn-flow Phase 1 → Phase 2 (F-98 binding view) → F-98 heartbeat-age column (critical path) | [`agent-spawn-flow-tool.plan.md`](agent-spawn-flow-tool.plan.md) | launch-in-worktree convention codified *after* the first spawn E2E (its own Phase 0) |
| Implementer B | O1, O2 | Floor + liveness + ergonomics: F-82 verify (first) → F-101 kill-tree → F-75 → F-85 `--active`→home → comms+claims batch | [frictions register](../../../memory/operational/frictions-register.md) (batch home); [`cost-of-collaboration.plan.md`](cost-of-collaboration.plan.md) | F-75 starts *after* F-101 (it makes heartbeat-silence truthful) |
| O4 (no standing seat) | O4 | OQ5 composed-liveness **decision** only — a late Director+implementer design sidebar | [`cost-of-collaboration.plan.md` §Locked scope](cost-of-collaboration.plan.md) | runs *late*, fed by the build lanes' lived liveness evidence |
| O5 (compact, flexible) | O5 | One pointer sentence on the MCP discovery surface → `oak-under-the-hood` (non-curriculum / mechanism / repo questions). Tiny + independent (MCP app/SDK domain) — a quick deliverable for whichever implementer has capacity, or Director-routed | [`under-the-hood-mcp-discovery-pointer.plan.md`](../../sdk-and-mcp-enhancements/current/under-the-hood-mcp-discovery-pointer.plan.md) | none (independent of the agent-tooling lanes) |

## Referenced Execution Plans (the work — not restated here)

- [`agent-spawn-flow-tool.plan.md`](agent-spawn-flow-tool.plan.md) — serves O3 (the binding lane).
- [`cost-of-collaboration.plan.md`](cost-of-collaboration.plan.md) — the locked scope and the
  liveness/coordination workstreams (serves O1/O2/O4).
- [frictions register](../../../memory/operational/frictions-register.md) — **the home of the comms+claims ergonomics batch**
  (F-72 / F-89 / F-70 / F-77 / F-79 / F-80) and the authoritative state for F-82, F-85, F-101, F-75.
- [`agent-tools-cli-ergonomics.plan.md`](agent-tools-cli-ergonomics.plan.md) — **related convention
  work** (PDR-055 cl.7–10; WS0 Phase-0-gated, whole-surface). The six point-fixes contribute friction
  evidence to it but are **not** homed in it and **not** gated on its WS0 — its Non-Goals forbid the
  friction-fenced shape. See the Non-Goal below.
- [`under-the-hood-mcp-discovery-pointer.plan.md`](../../sdk-and-mcp-enhancements/current/under-the-hood-mcp-discovery-pointer.plan.md)
  — serves O5 (the MCP orientation-discoverability sticking-plaster; precursor to the
  tool-taxonomy-and-orientation architectural review).

## Acceptance Criteria (team-level, outcome-based)

1. **O1 proven** — F-82 verify output pasted; a killed agent's watcher stops emitting within the lease
   window (no false heartbeats); F-75 fires on heartbeat-silence. Each F-NN closed in the register.
2. **O2 proven** — a `--active` claim written from a linked worktree appears in the coordination
   home; each ergonomics-batch F-NN closed with its gate.
3. **O3 proven** — `agent spawn <lane>` E2E produces a built, draft-PR'd worktree and a launch command
   that starts a session rendering its *true* worktree; the F-98 view shows `(identity → worktree →
   branch → last-seen)` for the live team, where `last-seen` is the heartbeat-age column (PDR-078
   event-recency, input-to-verify — owned by the spawn-flow plan's Phase 2).
4. **O4 proven** — the OQ5 decision record (PDR-118 amendment) authored and owner-ratified, naming the
   model and the consumer-absent fallback; the F-44 structural fix recorded as unblocked.
5. **Cohesion held** — every lane that ran traced to an outcome; drift was re-routed, not absorbed (a
   closeout assessment, not "the lanes shipped").
6. **Operating-model evidence** — the Director captures PDR-117's defined metric **owner-visible
   coordination prompts per landed cycle** (owner-directed clarifications + owner-fielded escalations ÷
   cycles landed) *live during the session* (its inputs are transient — comms stream + owner chat);
   qualitative notes may accompany, not replace, the ratio. Record this session as PDR-117
   **second-instance** evidence, folded into the worktree-per-agent transition home.
7. **O5 proven** — the MCP discovery surface names `oak-under-the-hood` for non-curriculum / mechanism
   / repo questions; a real-client / MCPJam check routes an orientation or "how is this built" query
   there while curriculum queries still route to the curriculum tools.

## Non-Goals (YAGNI)

- The OQ5 **implementation** (the composed-liveness build, the F-44 code-consumer fix, the stall-aware
  F-98 column) — decided this session, built later onto the F-98 view as its scaffold.
- The knowledge-distribution substrate first slice (E3) — zero session impact; the future arc is
  preserved by spawn-flow being built substrate-aligned.
- Authoring per-lane execution plans from scratch — they exist and are referenced.
- A general any-agent spawn surface — spawn is coordinator-launched only (per the spawn-flow plan).
- **Discharging `agent-tools-cli-ergonomics.plan.md`** — the six ergonomics point-fixes ship now under
  the locked scope, homed in the frictions register; they do **not** satisfy that plan's whole-surface
  convention (WS0) or its WS6 conformance guard, which later generalise/absorb them. Its
  anti-perpetuation Non-Goal is consciously deferred here, not violated.

## Operating Model and Cadence (referenced, not restated)

- **Coordination branch**: `coordination/team-tooling-session-2026-06-28` (off `main`, created
  2026-06-28) — the Director-owned coordination home; implementer PRs are pure diffs.
- **Operational setup**: instantiate the
  [team-session-opener](../../../prompts/agentic-engineering/team-session-opener.prompt.md) for this
  session (entry ritual, worktrees + single coordination-home, branch classes, seat briefs, cadence,
  closeout).
- **Director pre-session move-0 (BLOCKING)**: the Director authors the
  `team-tooling-session-2026-06-28` opener instance from that template **before any implementer runs
  the entry ritual** (the opener IS the entry ritual + seat briefs). It MUST populate the A↔B
  owned-surfaces / must-not-touch boundaries over the shared `agent-tools/src/` CLI surface — the
  concrete overlap being B's whole-surface ergonomics + liveness edits (collaboration-state CLI,
  `claim-reports.ts`, `cli-*.ts`) and A's spawn-flow additions to the same tree — with a resolving rule
  (file-partition or land-order). Worktree isolation + ADR-204 require-up-to-date already prevent
  silent clobber; this boundary minimises merge conflicts.
- **Roles**:
  [PDR-117](../../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md);
  the coordinator doctrine in [`agent-collaboration.md`](../../../directives/agent-collaboration.md).
- **Session discipline**: [`session-discipline`](../../../plans/templates/components/session-discipline.md) —
  the four tripwires apply to every seat.

## Risks

| Risk | Mitigation |
|------|------------|
| Cohesion loss as lanes fan out | The cohesion mechanism + Director checkpoints above |
| Bootstrap chicken-and-egg (the tool built during the session that wants it) | The Must-floor is laid first; coordination is correct via explicit `--active <home>` (opener convention) until F-85 lands; the team adopts `agent spawn` as it lands |
| Implementer B's lane is full (five deliverables) | Named slip-order (F-75 → ergonomics tail); seat rotation for B as context deepens (PDR-063) |
| Critical-path (A's spawn-flow) overrun | F-98/heartbeat-column is the clean slip (the tail; nothing waits on it) |
| Stall-detection residual (OQ5 not built) | Director treats freshness / claim-staleness as **input-to-verify only** (F-44), never a liveness verdict; primary live cross-check is **direct comms ping-before-escalate** against the PDR-078 heartbeat-event stream (made deliverable by F-82); the F-98 heartbeat-age column is supporting input-to-verify *when it lands* (it is the clean slip, so the mitigation must not depend on it). The session grounds the OQ5 decision |
| Code-owner merge gate is the owner's | Director drives each PR to merge-ready; owner clicks; ADR-204 require-up-to-date serialises merges |

## Lifecycle and Consolidation

- **Lifecycle triggers**: [`lifecycle-triggers`](../../../plans/templates/components/lifecycle-triggers.md).
- **Closeout**: the Director is the team closeout owner; runs the full `session-handoff` +
  `consolidate-docs` **before** the final coordination-branch PR merges (opener §Coordination cadence).
- **Completion**: outcomes proven (acceptance above); the per-lane plans archived per ADR-117; the
  operating-model evidence folded into the worktree-per-agent transition home.
- **Readiness review (done 2026-06-28)**: a 4-lens review (assumptions-expert proportionality /
  blocking-legitimacy / load-split; PDR-117 doctrine; outcomes/cohesion; completeness), each finding
  adversarially verified. 7 confirmed → 5 distinct fixes (1 must-fix + 4 should-fix; the must-fix and
  two should-fixes converged on the ergonomics-plan citation), 13 refuted. All folded above and
  assessed first-hand before folding — the must-fix verified against the ergonomics plan's WS0 gate +
  Non-Goals.
