# External Pointer-Surface Integration — Strategic Plan

**Status**: NOT STARTED — capture-only. Owner-gated decisions in
Phase 0 must be ratified before promotion to `current/`.
**Domain**: Agentic Engineering Enhancements
**Captured**: 2026-04-21 (Session opener arc)
**Related**:

- [PDR-027 — Threads, Sessions, and Agent Identity](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
- [PDR-026 — Per-Session Landing Commitment](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
- [PDR-029 — Perturbation-Mechanism Bundle](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
- [PDR-009 — Platform-Agnostic Skills](../../../practice-core/decision-records/PDR-009-platform-agnostic-skills.md)
- [`threads/README.md`](../../../memory/operational/threads/README.md)
- [`repo-continuity.md`](../../../memory/operational/repo-continuity.md)
- [`session-handoff.md`](../../../commands/session-handoff.md)
- Pending-graduations Due item: `observability-thread-legacy-singular-path`

## Guiding principle

**"Always choose long-term architectural excellence over expediency."**
This principle (owner-stated 2026-04-21) is the explicit
adjudicator for every Phase 0 decision below.

## Owner-ratified directives (this turn — 2026-04-21)

These directives are decisions, not options. The plan starts here.

1. **Long-term architectural excellence is the guide** for every
   decision in this plan, including mechanism choice, granularity,
   cadence, and surface count.
2. **Threads must be surfaced and not collapsed.** Whatever
   mechanism Linear uses to represent threads, the persistence,
   identity, and cardinality of threads must remain visible. A
   mechanism that flattens two threads into one Linear surface is
   misleading and disqualified. Owner-preferred mechanism: **labels
   on issues within the existing OOC project**. Other mechanisms
   acceptable only if they preserve no-collapse.
3. **This is infrastructure, not ritual.** A passive Linear
   Document plus a hopeful "remember to update Linear" note is
   ritual. Infrastructure means a firing surface (workflow gate)
   plus a health probe (read-side enforcement). Both layers are
   non-optional, per PDR-029's two-complementary-layers principle.
4. **Capture only this turn.** Author this plan; add a register
   entry; no other repo changes; no Linear writes. Execution
   resumes only after Phase 0 ratification.

## Problem and intent

**Problem.** The repo is the authoritative project-management
surface and will remain so. But the repo is opaque to anyone not
running an agent in it. Linear is the org-internal surface where
project visibility is expected. Today there is no connection
between the repo's continuity model (threads, landings,
pending-graduations register, doctrine landings) and the Linear
project that nominally tracks this repo's work. The Linear project
exists; it is empty of repo signal.

**Intent.** Treat Linear as a **peer pointer-surface** to the
authoritative repo state. Not a mirror. Not a duplicate plan
store. A small, low-noise, **architecturally honest** projection
of the repo's thread + landing model into Linear primitives, with
firing surfaces (workflow gate + health probe) that prevent the
projection from drifting into ritual.

**What this plan is not.** This plan is not a request for Linear
to host plans, decisions, doctrine, or operational memory. The
repo continues to own all of that. Linear receives a navigation
pointer (one Document) and a small, governed stream of landing
records (issues), labelled by thread.

## Background context (DO NOT TRIM during edits)

This section is load-bearing. Future agents resuming this plan
need the full conversation arc, the mechanism survey, and the
reasoning that produced the directives above. Trimming this
section invites re-litigation.

### Conversation arc (2026-04-21)

1. Owner asked what was visible in Linear; visibility was confined
   to one Initiative ("Oak Open Curriculum Ecosystem"), three
   Projects (incl. "Oak Open Curriculum Ecosystem"), no issues,
   one team member (the owner, Jim Cresswell, project lead).
2. Owner constraint: **no PII whatsoever in version control.**
   Linear IDs, user IDs, and any identifying info live only in a
   gitignored local config file (proposed
   `.agent/local/linear.local.json` with companion
   `linear.example.json`). The mapping between this checkout and
   Linear is explicit but private.
3. Owner intent: keep the repo as the primary project-management
   surface, but get a *visible sync* of high-level work into
   Linear for visibility — "not necessarily all plans, but some
   of the higher level stuff."
4. Agent surveyed canonical Linear-side and community sync
   mechanisms (recorded below). Owner directed: do not invent
   sync mechanisms; explore what exists; prefer canonical and
   idiomatic approaches.
5. Owner reframed the problem at metacognitive level: in an
   agentic world **documentation is infrastructure**; the repo
   already has thread + session machinery; Linear updates should
   ride existing surfaces, not invent new ones; create a parent
   plan capturing all of this.
6. Owner ratified this turn's directives (above): architectural
   excellence; threads must not collapse; infrastructure not
   ritual; capture only.

### Linear-side mechanisms surveyed

**First-party / canonical** (in approximate order of agent-fit):

- **Linear MCP server** at `mcp.linear.app/mcp` — already wired
  in this repo's `.cursor/settings.json` and `.claude/settings.json`
  via the `plugin-linear-linear` MCP plugin. Allows the operating
  agent to create/update issues, labels, comments, project
  updates, and documents in real time without bespoke client code.
  This is the canonical agent-mediated path.
- **Linear TypeScript SDK** (`@linear/sdk`) — typed GraphQL
  client. Appropriate if a non-agent automation surface (cron,
  GitHub Action, CLI) needs to write to Linear. Wraps
  `LinearClient`, `issueCreate`, `issueUpdate`, label management,
  and the agent-session APIs.
- **Linear Agents API** — first-class agent-as-member surface.
  OAuth with `actor=app`; `agentSessionCreateOnIssue`,
  `agentSessionUpdate`, agent activities. Future-facing; aligns
  with PDR-027 identity discipline if the org chooses to register
  this repo's agents as Linear app actors.
- **Linear GitHub integration** — PR linking (issue ID in branch
  name auto-links), GitHub Issues Sync (mirror mode). Mirror mode
  is a heavier coupling than this plan needs.
- **`@linear/import`** — first-party CLI. One-time migration tool
  (Trello, Asana, Jira, Pivotal, Shortcut, GitLab). Not relevant
  for an ongoing pointer-surface.

**Community / idiomatic**:

- **`@schpet/linear-cli`** — community CLI with per-repo
  `.linear.toml` config; agent-friendly. Useful as a fallback if
  MCP path is unavailable.
- **GitHub Actions**: `korosuke613/linear-app-create-issue-action`
  (creates Linear issues from Markdown), `ctriolo/action-create-linear-issue`
  (PR-driven). Useful if landings should produce Linear issues
  automatically from CI rather than from session-handoff.
- **Cursor → Linear native plugin** — already present; Cursor's
  blog "How Cursor integrated with Linear for agents" describes
  the pattern of agent sessions appearing in Linear with
  controlled noise (Cursor's principle: "be visible without
  becoming spam"). This plan's cadence choices honour the same
  noise principle.

### Repo-side machinery this plan rides

The repo already has a complete continuity stack. This plan does
not invent surfaces; it adds pointer-emission to existing ones.

- **Threads** (PDR-027) — the continuity unit. Two active
  threads today: `observability-sentry-otel`,
  `memory-feedback`. Thread identity, schema, and lifecycle in
  [`threads/README.md`](../../../memory/operational/threads/README.md).
- **Per-thread next-session record** — `*.next-session.md` per
  thread. Holds landing target per PDR-026.
- **Per-session landing commitment** (PDR-026, as amended
  2026-04-21 to per-thread-per-session) — every session lands
  exactly one thread's target. This is the natural emission
  event.
- **`session-handoff.md`** — the session-close workflow. Already
  refreshes the register, the napkin, and operational state.
  Natural insertion point for a Linear-emit step.
- **`/session-handoff` step 7c walkthrough** (Class A.2 gate — landed
  Session 4 as documentation; PDR-029 Amendment Log 2026-04-21
  codifies that active tripwires are markdown rituals, not scripts).
  Reads thread records structurally and asserts identity rows are
  current. Natural extension point for a Linear-pointer-freshness
  check added as an additional step bullet, walked by the agent.
- **Pending-graduations register** — the capture surface for
  candidates awaiting graduation. This plan's register entry
  rides it.

## Architectural mapping (the case for labels-not-issues for threads)

Threads and Linear issues have different lifetimes:

| Concept | Lifetime | Closes? |
|---|---|---|
| Thread | Indefinite (continuity unit) | No — threads end only when the work stream ends |
| Linear issue | Finite (work unit) | Yes — issues are designed to close |
| Linear label | Indefinite (classification) | No — labels persist across issues |

Therefore the structurally honest mapping is:

- **Thread → Linear label** (e.g. `thread/observability-sentry-otel`,
  `thread/memory-feedback`). Labels persist across every landing
  the thread ever produces. Filtering by label gives the full
  thread history.
- **Landing → Linear issue.** A landing is finite (PDR-026: one
  thread's target per session, evidenced and closed). Issues
  close cleanly. Each landing-issue carries the thread label.
- **Repo → Linear project.** The existing OOC project remains the
  container.
- **Navigation map → Linear Document.** One Document on the
  project, listing active threads with label-filter URLs and
  pointing back at `repo-continuity.md`. The Document is the
  static index; labels + issues are the dynamic state.

The alternatives were considered and rejected on architectural
grounds:

- **Thread-as-issue** (the agent's first proposal): forces
  perpetually-open issues (Linear anti-pattern) or reopen/close
  cycles per landing (state churn).
- **Thread-as-milestone**: misuses Linear milestones, which are
  designed for phased delivery within a project. Threads are not
  phased.
- **Thread-as-sub-project**: Linear has no sub-projects; would
  require multiple top-level projects per repo (administrative
  fan-out; conflates thread and project concepts).

The labels-not-issues mapping satisfies directive 2 (no
collapsing) cleanly, because labels can never collapse two
threads into one — the cardinality is enforced by Linear's data
model.

## GitHub Projects assessment (directive 6)

**Question**: Is there value in a GitHub Project surface in
addition to Linear, or is it complexity for no good reason?

**Honest assessment**: complexity for marginal value, given the
current visibility goal. Reasoning:

- The owner's stated visibility goal is org-internal: "*a visible
  sync into Linear to help with visibility*." Linear is the
  chosen org-internal surface.
- Repo (truth) + Linear (org-internal projection) covers that
  visibility space without redundancy.
- GitHub PRs and commits already provide the repo-native
  landing surface. PR descriptions + commit SHAs are linked from
  `repo-continuity.md`. A GitHub Project on top of those would
  duplicate, not add.
- Adding a third surface multiplies sync cost, drift risk, and
  reviewer attention burden. Each surface needs a firing cadence
  and a health probe to avoid becoming ritual.

**Caveat that would re-open this decision**: a future need for a
**public** roadmap visible to external curriculum partners or
community contributors. Linear is org-internal; GitHub
Projects/Discussions is the natural public surface. Not a current
need. Re-evaluate if that need surfaces.

**Recommendation**: defer. Final call belongs to Phase 0.3.

## Phase 0 — Owner-gated decisions (no execution before these resolve)

### 0.1 Linear primitive mapping

**0.1.a Threads → labels**: confirm (recommended on architectural
grounds above).

**0.1.b Landing → issue granularity** — choose one:

- **Option A** (recommended): one rolling open issue per thread
  for the *current landing target* (mutated at each session
  open/close), plus closed sibling issues for each historical
  landing. Pro: matches `*.next-session.md` cadence; current focus
  always visible at thread root. Con: rolling-issue mutation must
  be careful about not erasing history.
- **Option B**: one issue per landing only; no rolling parent.
  Pure historical trail. Pro: simpler; no mutation. Con: no
  single "current focus" anchor per thread; current target
  surfaces only via label filter.
- **Option C** (rejected): one issue per pending-graduations
  Due item. Architecturally weaker — Due items are an internal
  capture, not a landing.

**0.1.c Initial label set** — confirm two thread labels
(`thread/observability-sentry-otel`, `thread/memory-feedback`)
plus a small functional label set TBD.

### 0.2 Cadence

- **Per-session-close-on-landing** (recommended): emit only when
  a session lands a thread's target (PDR-026 emission event).
  Matches Cursor's "visible without spam" principle and PDR-029's
  firing-cadence-first principle. Cardinality: ≤1 emission per
  session per thread.
- **Per-thread-state-change** (alternative): emit on every
  meaningful state change (target updated mid-session, etc.).
  More frequent; more noise; closer to Cursor's bot-comment
  failure mode.

### 0.3 GitHub Projects

- Defer; do not add a GH Projects surface (recommended).
- Or: add GH Projects with explicit purpose statement (only if a
  public-roadmap need surfaces).

### 0.4 Sequencing relative to Session 4 of staged doctrine consolidation

Session 4 is already expanded (Family A Class A.1 + A.2 tripwire
installation, Family B meta-tripwires, cross-plane rules,
roadmap sync) and consumes the agent-names registry. Adding
Linear-integration scope to Session 4 risks scope creep against
the "scope discipline" decision class.

- **Capture-only now; execute after Session 4 closes**
  (recommended). Either Session 5+ or a dedicated thread
  (`external-pointer-surface` thread).
- Or: fold into Session 4 (rejected on scope-discipline grounds
  unless owner overrides).

### 0.5 PDR strategy

- **Amend PDR-027** (Threads, Sessions, Agent Identity) to add a
  §"External pointer-surfaces" subsection (recommended). PDR-027
  owns thread identity; an external pointer-surface is
  identity-projection. Amendment is the lighter intervention.
- Or: new PDR ("External Pointer-Surface Doctrine") — heavier;
  justified only if doctrine spans more than Linear (e.g.
  multiple external surfaces, or generic projection rules).

### 0.6 Pre-existing dependency: `observability-thread-legacy-singular-path`

This Due register item must resolve before Linear hookup, so the
integration does not encode a transient legacy path into the
Linear pointer surface. Resolution is Session 4 scope already.

## Proposed solution (subject to Phase 0)

### Layer 1 — Passive (low risk; Phase 1)

- **One Linear Document on the OOC project**: navigation map
  listing active threads with label-filter URLs and a pointer
  back to `repo-continuity.md` and the per-thread next-session
  records. Document is the static index; labels + issues are the
  dynamic state.
- **AGENTS.md / CLAUDE.md pointer**: a one-line note that Linear
  is a peer pointer-surface (read-only from the Linear side from
  a doctrine perspective), with a reference to this plan and
  `linear.example.json`.
- **`threads/README.md` schema field**: `linear_label` field on
  each thread row, with the canonical label name.

### Layer 2 — Local config (Phase 2)

- `.agent/local/linear.local.json` (gitignored) — actual IDs,
  workspace slug, label IDs, project ID, lead user ID.
- `.agent/local/linear.example.json` — schema and documentation
  (committed).
- `.agent/local/README.md` — explains the boundary; gitignore
  patterns documented.
- `.gitignore` — extend `.agent/local/**` (single-purpose
  exclusion; matches existing `.local` patterns).
- `.env.example` mirror entry if MCP/SDK paths require an env
  var (e.g. `LINEAR_API_KEY` for non-MCP fallback).

### Layer 3 — Firing surface (Phase 3 — the active layer)

- **`session-handoff.md` step 7c** (or wherever ordering is
  natural): if this session landed a thread's target, the agent
  uses the Linear MCP plugin to:
  - locate the rolling current-target issue for the thread
    (Option A) or close the previous landing issue and create a
    new one (Option B);
  - apply the thread label;
  - record landing summary (1–3 sentences);
  - link evidence (commit SHA, PR URL, plan reference);
  - close the issue if Option B, or update status if Option A.
- Cadence: ≤1 emission per session per thread (PDR-026
  enforced).
- Skill-shaped per PDR-009: a `pnpm linear:emit-landing` (or
  similar) command that the agent invokes; the workflow gate
  cites it; canonical lives in `.agent/skills/`; adapters per
  platform.

### Layer 4 — Stale-pointer audit (Phase 4 — the read-side enforcement)

- Extend `/jc-consolidate-docs` step 7c walkthrough (six-check
  stale-identity audit; landed Session 4 as documentation per
  PDR-029 Amendment Log 2026-04-21 — *active means markdown-ritual,
  not code execution*) with additional ritual checks that the agent
  performs by reading Linear via MCP and asserting:
  - every thread in `repo-continuity.md § Active threads` has
    its canonical label in Linear;
  - every active thread has a current landing-record issue
    matching the thread's `*.next-session.md` landing target;
  - the current issue's last update is within N sessions of the
    thread's last landing date.
- Failure modes raise warnings (not blocking unless owner
  upgrades). Matches PDR-029's "warn first, harden later"
  pattern.

### Layer 5 — Doctrine landing (Phase 5)

- PDR-027 amendment OR new PDR per Phase 0.5.
- Practice Core CHANGELOG entry.
- README index update.
- `documentation-sync-log.md` entry.

## Scope / Non-goals

### In scope

- Linear pointer-surface for threads (labels), landings (issues),
  and navigation (one Document) on the existing OOC project.
- Local-only PII boundary (`.agent/local/` gitignored).
- Firing surface in `session-handoff.md` and read-side health
  probe.
- PDR-027 amendment (or new PDR) landing the doctrine.

### Non-goals

- Mirror plans into Linear. Plans live in the repo.
- Mirror napkin / distilled / operational memory into Linear.
- Mirror PDRs / ADRs / patterns / rules into Linear.
- Any Linear → repo write direction. One-way only: repo is
  authoritative.
- GitHub Projects surface (unless Phase 0.3 reopens it).
- Linear writes from any path other than the firing surface.
- PII in version control. Ever.
- Cursor-style high-frequency agent-session comments on issues
  (matches owner's earlier "comment fatigue" framing).

## Risks and unknowns

| Risk / unknown | Why it matters | Mitigation direction |
|---|---|---|
| Two pointer-surfaces drift (repo + Linear) | Drift erodes trust in both | Repo is authoritative; Linear is derived; one-way sync; Phase 4 health probe asserts freshness |
| Stale Linear issues if landings recorded but not closed | Linear becomes a graveyard | Phase 4 probe; per-session-close cadence; Option A's rolling-issue model has explicit transition |
| Label proliferation if threads created freely | Linear label space pollutes | Threads are governed (PDR-027 cardinality discipline); label creation gated by thread-creation gate |
| Linear MCP latency at session-close | Slows down session-handoff | Fallback: skip on MCP timeout; Phase 4 probe catches misses next session |
| Cursor-in-Linear noise principle violated | Comment fatigue (owner-stated concern) | Per-session-close cadence; landing emission only; no per-action chatter |
| Plan executes before `observability-thread-legacy-singular-path` resolves | Encodes transient path | Phase 0.6 dependency; promotion blocked until resolution |
| Linear API key handling | PII / secret exposure | MCP path avoids client-side keys; if SDK path needed, key in `.agent/local/` only, never committed |
| Doctrine landing skipped | Plan executes without PDR amendment; doctrine drifts | Phase 5 is non-optional; promotion criteria require PDR change to be in scope |

## Promotion trigger

Promote this plan from `future/` to `current/` when **all** of
the following are true:

1. Phase 0 owner ratifications complete (0.1 mapping; 0.2
   cadence; 0.3 GH Projects defer/add; 0.4 sequencing; 0.5 PDR
   strategy).
2. `observability-thread-legacy-singular-path` Due item resolved
   (Phase 0.6).
3. Session 4 of the Staged Doctrine Consolidation plan has
   closed (per Phase 0.4 recommendation; owner override
   permitted).
4. The promoted executable plan defines:
   - deterministic slices for Layer 1 (Document) → Layer 5
     (PDR);
   - validation evidence (probe output, Linear screenshots,
     register graduation);
   - doc-as-DoD checklist (PDR amendment, README index,
     `documentation-sync-log.md`, Practice Core CHANGELOG).

## Reference

- Linear, "Continuous Planning in Linear" — <https://linear.app/now/continuous-planning-in-linear>
- Cursor blog, "How Cursor integrated with Linear for agents"
  (cited principle: visible without spam)
- This conversation transcript: see session opener arc dated
  2026-04-21 in agent transcripts
