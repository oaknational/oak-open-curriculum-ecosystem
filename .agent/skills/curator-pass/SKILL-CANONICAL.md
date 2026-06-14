---
name: curator-pass
classification: active
description: Run one curator pass on the repo's knowledge substrate. Use when allocated the curator boundary on team-start, when owner-directed to a curation lane, when a graduation buffer crosses critical fitness, when a pending-graduations trigger fires, or when a landed substrate shows an adoption gap.
---

# Curator Pass

## Goal

Run one curator pass under PDR-081: survey the knowledge substrate,
route durable knowledge to permanent homes, surface home-gaps and
structural defects as routing events, drain graduation buffers,
and record the pass via its commit plus a close-of-pass comms broadcast (the
per-pass log surface is superseded — see §Per-Pass Log).

The canonical role key is `curator`; `Knowledge Curator` is the
descriptive session label for the same substrate-care responsibility.

The doctrine for the role lives in
[`PDR-081`](../../practice-core/decision-records/PDR-081-curator-role-and-substrate-care-lane.md).
The principle the role operationalises lives in
[`PDR-072`](../../practice-core/decision-records/PDR-072-knowledge-curation-as-autonomic-learning.md).
This SKILL is the actionable workflow for a single pass.

## When To Run

- Team-start allocates the `curator` boundary to this agent.
- Owner directly invokes the substrate-care lane.
- A graduation buffer (typically `pending-graduations.md`) crosses
  its critical fitness envelope.
- A `pending-graduations` trigger condition fires (second-instance
  evidence, owner-direction-cleared on a previously gated entry).
- A landed substrate shows near-zero adoption after its observation
  window (adoption-gap signal).
- The active memory surfaces have absorbed substance worth routing
  after a substantive substrate-producing window.

Do not start a curator pass if the substrate-care lane is already
owned by a live peer. Coordinate through the team-start broadcast
and the active-claims registry before opening the pass.

## Foundation

Run the shared start-right grounding first. Identity preflight,
active-claims survey, comms-tail survey, working-tree status. A
curator pass that has not grounded against live state will route
substance to stale homes.

## Workflow

### Step 1 — Open the pass

Open a normal active claim on the substrate-care lane
(`register-active-areas-at-session-open`) before substantive work begins —
that claim, not a per-pass log file, is the observable claim on the lane.
(The per-pass log surface is superseded — see §Per-Pass Log; do not author one.)

### Step 2 — Survey

Survey the knowledge surfaces. Read each end to end where length
permits; sample structurally where it does not (section headers
plus targeted reads). The surfaces:

- Active memory: `napkin.md`, `distilled.md`, `patterns/`.
- Operational memory: `repo-continuity.md`,
  `pending-graduations.md`, thread next-session records, tracks.
- Platform-specific per-user memory: the surface for the current
  agent's platform only.
- Comms event stream: scan recent events; check tag-namespace
  adoption signals (e.g. `failure-mode`, `behaviour-note`,
  `heartbeat`).
- In-repo platform plans: anything in `.agent/plans/.../current/`
  that overlaps the substrate-care lane.

Record each surface and its disposition in the pass log's
Surfaces-surveyed table.

### Step 3 — Identify durable knowledge ready to route

For each candidate in the active memory + pending-graduations
register:

1. Is the substance stable (no longer mutating session-by-session)?
2. Has the trigger condition fired (second-instance evidence,
   owner-direction)?
3. Is the home identified (PDR / ADR / rule / pattern / directive
   / skill / canon surface)?

If all three: route. If not all three: leave in place; the
substance is not yet ready.

The pass log records the routing as a one-line pointer:
*"<concept> → <permanent home>"*. The substance lives at the
destination, not in the log.

### Step 4 — Identify home-gaps

Some mature substance has no obvious permanent home. The cure is
not to force it into the nearest file; the cure is to surface the
gap as a structural-cure proposal.

Each home-gap surfacing routes to the owner as a comms event or
directly in a routing exchange. The pass log records the gap by
short title plus pointer to the routing event.

### Step 5 — Identify structural defects

Defects in the substrate itself — autonomic-curation failures
(e.g. distillation-buffer contamination), drift in identity
surfaces, adoption gaps on landed substrate, classification
confusions — get surfaced as routing events.

The substance of each defect lives at the comms event (or napkin
entry if active-memory observation is the right home). The pass
log records the defect by short title plus pointer.

### Step 6 — Drain graduation buffers

Where the buffer carries entries whose trigger has fired and whose
home is identified, route the substance and remove the entry from
the buffer. Where the buffer carries entries that are not records
of curation work and not records of what graduated, leave them; the
buffer is allowed to hold trigger-and-home-gated candidates.

Where the buffer carries records of curation work or records of
what graduated, migrate those out (the buffer is buffer only).
Substance moves to the curator-passes directory (for curation-work
records, metadata only) or to the archive (for graduation records,
preserved as historical capture).

### Step 7 — Owner-decisions

A curator pass routinely surfaces decisions that need owner
ratification — graduation of an entry to a principle-class
destination, classification of a substrate ambiguity, scoping of a
buffer migration. Route those through the normal owner-decision
gates (AskUserQuestion or equivalent on the host platform). The
pass log records each decision by name and verdict, not by
substance.

### Step 8 — Close the pass

Emit a single comms broadcast naming the pass. The broadcast carries the
substance the pass surfaced (defect descriptions, adoption-gap findings,
home-gap proposals) plus any carry-forward for the next pass and the
substrate-care signals (what changed health-wise). The commit(s) plus the
homed substance are the durable record — do **not** author a per-pass log
file (see §Per-Pass Log).

## Per-Pass Log — Superseded

The former per-pass log file (a "surfaces surveyed → disposition" /
"concept → home" pointer index) is **superseded** by
[`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md)
(comms-research closeout consolidation, 2026-06-14; PDR-081 §Amendment Log):
the commit plus the homed substance are the curator's record, and git history
is the pass-navigation index. The pass's observable claim is a normal active
claim (`register-active-areas-at-session-open`); its surfaced substance rides
the close-of-pass comms broadcast and lands in its permanent home. **Do not
author a per-pass disposition-pointer log file.** The step-prose above that
still mentions "the per-pass log" references this superseded surface and
aligns to a commit-plus-broadcast record on next curator use.

## Forbidden moves

A curator pass MUST NOT:

- Mutate plugin-managed capture buffers directly. Surface defects
  in those buffers as structural-cure proposals to the plugin
  contract.
- Delete primary-source streams reserved for separate mining
  (e.g. comms event logs preserved for team-dynamics insight
  extraction). Substance is extracted; sources are preserved.
- Trim active-memory surfaces under fitness pressure. Knowledge
  preservation outranks fitness; the structural cure is graduation
  upward.
- Author principle-class changes without owner approval. The
  curator surfaces the proposal; the owner ratifies.
- Carry substance in the per-pass log file. Substance has one
  permanent home; the log points at it.

## Closeout

Standard team-member closeout shape applies when the pass runs
inside a multi-agent session. The curator's closeout names the
pass log file, any retained claims, and the comms broadcast event
id that carries the substantive findings.

A solo curator-pass session closes by emitting the broadcast and
finalising the log file; no team-member-closeout broadcast is
required if no team is live.

## Cascade

The doctrine cascade from PDR-081 includes optional adopting-repo
ADRs that name the substrate implementation (where the per-pass
log lives, what filename convention applies, how the pass interacts
with quality gates). This SKILL assumes the substrate exists; if a
repo has not yet adopted the substrate, the first curator pass
authors it.
