---
title: Historical Napkin Synthesis — 2026-05-13
type: research
status: complete
date: 2026-05-13
author: Coppery Kindling Anvil / cursor / claude-opus-4.7 / 536dd4
corpus_window:
  - .agent/memory/active/archive/napkin-2026-05-12.md
  - .agent/memory/active/archive/napkin-2026-05-12b.md
  - .agent/memory/active/napkin.md
processed_marker: napkin.md (active, 2026-05-13), napkin-2026-05-12b.md, napkin-2026-05-12.md
selection_rationale: explicit owner direction 2026-05-13 ("deep dive into the current napkin and the two before it"); the three-rotation corpus covers the 2026-05-11 → 2026-05-13 multi-agent collaboration window where the owner-called architectural reset, the cost-of-collaboration plan landings (P0 → P5), the WS1.x graph stack execution, two false completion claims, and the dispatcher peer-triple all unfolded together
---

# Historical Napkin Synthesis — 2026-05-13

## Corpus window

Read in chronological order:

1. `napkin-2026-05-12.md` (694 lines; rotation closing 2026-05-12 — Wooded
   Spreading Thicket coordinator-deadlock window 2026-05-11, Sparking
   Charring Ash, Mistbound Watching Lantern, Soaring/Smouldering/Dusky/
   Fronded/Galactic/Shaded/Flamebright/Gilded sessions, plus 2026-05-12
   Wooded continuation P-Foundation correction)
2. `napkin-2026-05-12b.md` (1166 lines; rotation closing 2026-05-12 —
   the dispatcher peer-triple window: Brazen Stoking Ash gatekeeper +
   Lofty/Shaded/Radiant Codex implementers + Vining/Penumbral/Secret
   Cost-of-Collaboration P3-P4 work + Lush Sprouting Thicket
   codex-exec slice with the 6027e182 dual-breach correction +
   Starlit Scattering Moon WS1.2 + Clouded Vaulting Squall holistic
   re-plan + Flamebright Sparking Forge consolidation + Torrid /
   Smouldering Melting Kiln / Cosmic Gliding Aurora skill review
   chain + Dusky Lurking Shade napkin rotation)
3. `napkin.md` (current; 605 lines; 2026-05-12 Volcanic Charring
   Furnace distilled-stage closeout through 2026-05-13 Mossy
   Blossoming Canopy P8 TUI continuation, Quiet Stalking Mirror's
   WS1.5 review absorption + owner doctrine capture, Verdant Foraging
   Copse's completion-claim proof-pipeline report, the Solar /
   Umbral / Dim / Uplifted / Mossy Fruiting Codex continuation
   chain, and Ferny Regrowing Leaf's coordinator session)

## Selection rationale

Owner direction "do a deep dive into the current napkin and the two
before it". The corpus is bounded; this is a Step 6a archive-scale
historical synthesis. The processed marker delimits where future
"since last marker" passes start.

## Reflective pass (`/jc-metacognition`)

The directive's four questions, applied to the corpus's voice rather
than the meta-voice:

**What has changed?** The Practice has crossed a threshold from
single-agent, narrow-window operation into routinely supporting
parallel multi-agent windows under live cost-of-collaboration evolution.
The corpus's signature is **eight Codex sessions, three Claude Code
sessions, and three Cursor sessions in 48 hours**, all writing into
shared state, with the cost-of-collaboration plan moving from P0
broken-code-guard concept (2026-05-11 Wooded reset) through
P-Foundation, P1, P2, P3, P4, and P5 landings (2026-05-12 → 2026-05-13)
in the same window the agents were tripping over each other on the
defects the plan was being built to cure. The Practice was being
extended by the agents currently being constrained by it.

The owner-called architectural reset on 2026-05-11 ("everything has
ground to a halt, because everyone ends up waiting for everyone") was
not an exceptional event in this window. It was the operating
condition under which doctrine, tooling, and coordination had to be
co-evolved.

**Why?** Because the corpus is the empirical answer to the question
"what does multi-agent operation actually feel like at the boundary
of repo-wide gates and shared-state surfaces?" The answer is: it
feels like every advisory protocol decays under pressure; every
gatekeeper sweep stales the moment someone else writes; every
post-hook chain absorbs files no one queued; every coordinator
becomes the largest source of timing-coupled gate trips because
their job is to write coordination artefacts; every "I just landed
this slice" gets language-conflated with "the workstream is
complete" if the proof contract is prose-only.

**Would I do anything differently?** Three concrete behavioural
shifts for the next instance of each shape, drawn from across the
corpus:

1. *Before forwarding any GO signal*, run the gate myself. Brazen's
   inferred-clearance from Vining's commit produced a STOP-races-the-
   hook race that landed only by Shaded's unrelated unblock arriving
   inside Lofty's hook window. Outcome correct only by luck. The two
   seconds of `pnpm knip` are paid back the first time inferred
   clearance is wrong.
2. *Before claiming a workstream complete*, recompute completion
   against live plan acceptance rather than recent commit subject.
   P5 was reported complete twice and P8 once across this window
   while live acceptance was not satisfied. The fix is the
   completion-claim-proof-pipeline plan now in execution, but the
   in-the-moment discipline is: never reuse the word "complete"
   without naming which of the four states (slice landed / claim
   closed / acceptance complete / value delivered) is meant.
3. *Before treating a dirty slice as orphaned*, read
   `repo-continuity.md § Next Safe Steps` for owner-direction
   landing notes. Quiet Stalking Mirror's WS1.5 hold on
   lockfile-collision grounds was correct, but the held could have
   been avoided if the owner-initiated 43-file dependency refresh
   had been visible at the coordination layer. The continuity
   file's Next Safe Steps notes can carry owner-direction context
   that doesn't appear in comms-log or active-claims.

**What is the bridge from action to impact?** The bridge is
**enforcement at the boundary where the discipline must fire**, not
prose enrichment of the surfaces agents already read. This corpus
shows passive guidance losing to artefact gravity at every scale
the Practice currently operates at: distilled rules captured and
violated in the same session (Brazen's verify-gate-before-GO);
authored-then-violated doctrine sweeps (Shaded Ripening Copse's
"Parallel-safe alternative if topology approval is owner-blocked"
emitted exactly the conditional-trigger framing the day's work
was designed to prevent); pre-stage protocol drafted and bypassed
within the same hour (Wooded's `git add` + `git reset HEAD` after
authoring P3); the queue protocol bypassed because "queue list was
empty meant window clear" (Sparking Charring Ash). Each of these
is a single agent's discipline failing to bind their own next
action even though the discipline was *visible to them at decision
time*. The cure pattern is in the existing
[`passive-guidance-loses-to-artefact-gravity`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md);
this corpus contributes N≥6 fresh instances and elevates that
pattern from "stable" to "loop-validated".

## Emergent findings

Numbered for routing reference. Each finding is a claim about what
the corpus knows together that no single napkin knew.

### F1 — Capture-doesn't-cure recurs at the granularity of single decisions

The strongest emergent finding. Six independent instances in the
corpus where a discipline was captured (in napkin, distilled, plan,
or rule) and then violated by the same agent within the same
session, often within minutes:

- **Brazen Stoking Ash** (napkin-2026-05-12b): captured "verify the
  gate before GO" rule into the napkin during the dispatcher
  session; sent Lofty premature GO on the next cycle. Experience
  file `2026-05-12-dispatcher-race-with-uninterruptible-hook.md`
  records the meta-observation: "the lesson I had written down had
  no traction on my next action."
- **Wooded Spreading Thicket** (napkin-2026-05-12): authored
  cost-of-collaboration P3 plan whose stated workstream is
  "enforced commit queue", captured Sparking Charring Ash's
  identical bypass mistake hours earlier, updated the thread-record
  opener to make "pre-stage sequence is non-negotiable" the
  carry-forward rule — then went straight to `git add` +
  `git reset HEAD` (no pathspec) without enqueuing.
- **Sparking Charring Ash** (napkin-2026-05-12 — original
  instance): "I had read the commit-queue list (all entries
  abandoned) and rounded 'queue empty' off to 'window clear',
  which silently dropped the active-claim check."
- **Shaded Ripening Copse** (napkin-2026-05-12): emitted
  "Parallel-safe alternative if topology approval is
  owner-blocked: ..." in their own next-session statement —
  exactly the conditional-trigger framing the day's
  schedule-not-trigger doctrine sweep was designed to prevent.
  Owner caught it: "what do you mean 'if'?"
- **Lush Sprouting Thicket** (napkin-2026-05-12b): "Built ahead of
  lint signal" — implemented full codex-exec topic without
  running `pnpm lint` after each substantive edit, despite
  `lint-after-edit` being a canonical rule. 51 errors across
  3 files.
- **Coastal Cresting Prow** at the same time: Lush absorbed
  Coastal's peer-session files into commit `6027e182` citing the
  "include current memory/state when dirty" doctrine — even
  though that doctrine's "current" qualifier means *this session's*.
  Two procedural breaches in one commit; the compound breach
  motivated the post-commit owner correction and the napkin
  draft of a new rule candidate (which agent-collaboration.md
  has since absorbed at lines 222-224).

The N=6 across the corpus elevates a previously-recognised pattern
([`passive-guidance-loses-to-artefact-gravity`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md))
to a different status: it is no longer just a structural cure
*pointer*; it is a load-bearing **operating constraint** that
shapes how every cure should be evaluated. Cures that depend on
the agent re-reading and applying captured discipline at the
moment of decision are predictably weak; cures that fire
mechanically at the surface where the misshape would otherwise
land (a hook, a CLI guard, a tool-level refusal, an inline
reminder in tool output) have empirical traction.

This finding crosses **all three rotations** of the corpus. The
graduation question is whether this deserves a discrete distilled.md
entry that summarises the constraint for the structural-cure
choice point, since the existing pattern file is shape-specific
("artefact gravity") rather than constraint-stating ("always
prefer mechanical fire over re-read fire when both are available").

### F2 — Coordinator role structurally amplifies the defect it cannot see

Three independent corpus instances of the same shape:

- **Wooded Spreading Thicket** (napkin-2026-05-12): "my own sidebar
  file (`.agent/state/collaboration/sidebars/cli-comms-inbox-design-
  2026-05-11.md`, written 20:01Z) was the specific file that broke
  iteration 3 of the deadlock, ~2 minutes after my gatekeeper sweep
  cleared the tree at 19:59Z. A coordinator necessarily writes
  coordination artefacts (broadcasts, briefs, comms-messages,
  sidebars, monitor telemetry). Every one is a tree-state mutation."
- **Brazen Stoking Ash** (napkin-2026-05-12b): the dispatcher
  session generated comms events, sidebars, and continuity edits
  that produced staged-only-gates P0 risk on every cycle.
  Brazen's own admission: "most of what I shipped this session was
  not WS1.3 (that was Lofty's) — it was the captured friction
  surface that Dusky later distilled."
- **Ferny Regrowing Leaf** (current napkin): coordinator-role
  inversion in the other direction — coordinator wrote almost
  nothing while idle peers stood by waiting for direction; three
  owner escalations were required before the allocation matrix
  was produced. The PDR candidate
  `coordinator-role-as-allocator-not-gatekeeper` is captured but
  not yet in pending-graduations.

The cross-instance shape is: **the coordinator role's outputs
(coordination artefacts) are subject to the very gates and races
the coordinator is attempting to manage.** Wooded's case (writes
break the gate they sweep) and Brazen's case (writes generate
the friction they document) are over-write coordination failures.
Ferny's case (under-write coordination failure) is the inverse —
coordinator caution misread as licence to do nothing. Both
failure-modes share root cause: the coordinator role lacks a
clean boundary between "the artefacts I produce by being
coordinator" and "the work I am coordinating".

This finding extends and complements
[`inter-agent-sidebar-with-default-action`](../../memory/active/patterns/inter-agent-sidebar-with-default-action.md)
and the orchestrator-vs-gate distinction (PDR-053/ADR-176). The
candidate substance is a pattern-shaped PDR that names the
coordinator-as-allocator-not-gatekeeper shape positively, with
the over-write and under-write failure modes as polarity
companions. Trigger present in the corpus is N=3 instances of
two different failure modes converging on the same root cause.

### F3 — Completion language is overloaded across four distinct states

The corpus contains the empirical evidence that
[`completion-claims-and-value-proof-pipeline-report.md`](../../reports/agentic-engineering/deep-dive-syntheses/completion-claims-and-value-proof-pipeline-report.md)
synthesises into a four-state taxonomy:

| State | Example in corpus |
| --- | --- |
| Useful slice landed | P5 unified comms storage migration at `30c8ad15` |
| Claim/session closed | P5 closeout at `6a1d8d9e` |
| Workstream acceptance complete | not satisfied (DI/no-IO repair still required) |
| User value delivered | TUI as human-visible proof surface still incomplete |

Two false-completion claims in the corpus (P5 reported complete
twice; P8 once) all confused state 1 or 2 with state 3 or 4. The
report and plan exist; the in-the-moment cure is to **never use
"complete" without disambiguating which of the four states is
meant**. This is the doctrinal anchor that the
`completion-claim-proof-pipeline.plan.md` execution slices need
to operationalise (rule + jc-plan amendment + agent-tools CLI
verdict computation + TUI surfaces).

This finding is **already in execution**: a plan owns the work,
the report owns the rationale, and the first slice (rule +
jc-plan amendment) is the immediate next step. The synthesis
contribution here is to confirm the corpus produced the empirical
ground for it, not to introduce new doctrine.

### F4 — Multi-agent commit-window protocol assumes single-agent ownership

Three corpus instances of the same protocol-incompatibility:

- **Brazen → Lofty handover attempt** (napkin-2026-05-12b): Brazen
  wrote "pass me the staged-bundle fingerprint when ready; I run
  the commit-queue protocol end-to-end." Lofty caught the protocol
  incompatibility — `verify-staged` and `git commit` assume
  single-agent ownership; splitting them across two agents would
  either force authorship-of-code-not-written or fail at
  verify-staged.
- **Lush absorbed peer-session files into 6027e182**
  (napkin-2026-05-12b): related shape — the commit boundary
  carried files Lush did not author. Owner correction;
  doctrine clarified at `agent-collaboration.md` lines 222-224.
- **STOP signal racing pre-commit hook** (napkin-2026-05-12b
  Brazen + Lofty): the hook is uninterruptible by design;
  signal-chain coordination cannot prevent a commit that has
  entered the hook window. The cure is **mutual mechanical
  verification**: gatekeeper AND implementer both re-run the
  gate immediately before `git commit`.

The corpus pre-existing graduation: peer-pair review is not
peer-pair commit authorship is at `agent-collaboration.md` line
196; pathspec discipline at line 199-204. The candidate
substance NOT yet captured in doctrine is:

- the **mutual mechanical verification** discipline (item 3
  above) for cross-agent gate handoffs, AND
- the related observation that **independent gate probes vs
  hook-invoked gate probes can disagree under racing landings**
  (Brazen, napkin-2026-05-12b: `pnpm knip` red on independent
  probe, then green inside Lofty's hook window seconds later);
  hook output is authoritative.

These two are companion observations and form a single candidate
amendment to `agent-collaboration.md § Treat Commit as a
Short-Lived Shared Transaction Surface`.

### F5 — Cold-start opener blocks of thread records lag live-state routing

Two corpus instances of the same drift shape:

- **Solar Gliding Twilight** (current napkin, "Session Handoff
  Record Repair"): live HEAD had WS1.6/WS1.4/coordination-closeout
  landed, while `repo-continuity.md`, the connecting thread
  record, and the active graph plan still described WS1.4 as
  pending/next.
- **Solar Gliding Twilight** (current napkin, "Cold-Start
  Follow-Up"): the connecting thread record's top correctly
  named WS1.5/WS1.6/WS2.2/WS3.1 as next graph choices, but the
  self-bootstrapping cold-start section still routed fresh
  sessions to completed WS1.2.

Two failure modes within the same thread-record substrate within
24 hours. The shape is: **a thread record carries multiple
routing surfaces (current summary, cold-start opener, lane state)
that drift independently after coordinator closeouts.** Cure:
treat all routing surfaces in a thread record as live;
coordinator closeouts must refresh them all together; session
opener must search for stale completed-work identifiers before
declaring the handoff current.

This finding has no existing pattern home; it is the kind of
operational observation that belongs in
[`agent-collaboration.md`](../../directives/agent-collaboration.md)
or in a new pattern about thread-record drift. Trigger is N=2
within 24 hours; the pattern bar is met.

### F6 — Repo-wide gates serialise independent threads

The corpus's worked instances:

- **Repo-wide knip blocks one thread's commit because of another
  thread's unused exports** (napkin-2026-05-12b, Brazen):
  Lofty's WS1.3 cannot pass `pnpm check` because P4 work owned
  by Vining (different thread, different workspace) has unused
  exports.
- **Premature unblock signal — gate inferred clear from peer
  commit, not verified** (napkin-2026-05-12b, Brazen): Vining's
  `1bb369a5` introduced new public API exports that themselves
  triggered the unused-exports rule.
- **Independent vs hook-invoked gate disagreement** (Brazen,
  same source).

These are all corpus instances of the staged-only-gates P0
problem the cost-of-collaboration plan landed (P0 complete:
formatting/markdown gate-staged, type/lint/test repo-wide).
The remaining residue is that knip and depcruise are
intentionally classified as higher-standard gates at pre-push /
`pnpm check` / CI rather than the commit boundary. The corpus
confirms that classification was correct; cross-thread serialisation
remains visible at pre-push but no longer at every commit.

This finding is **graduated**; the substance contribution from
the corpus is empirical confirmation of the P0 design choice
rather than a new candidate. No new action.

### F7 — Identity routing-tuple on shared Codex prefix is insufficient

The corpus shows N≥4 sessions sharing Codex prefix `019e1d`
(Fiery Igniting Furnace, Dim Hiding Secret, Verdant Foraging
Copse, Solar Gliding Twilight, Umbral Masking Silhouette,
Luminous Threading Asteroid) plus separate `019e1c` chains
(Lofty/Shaded/Radiant/Penumbral/Secret Vanishing Moth) and
`019e1b` chains (Galactic/Coastal/Lush/Hushed/Twigged etc.).

Ferny's coordinator-experience observation: "coordinator can't
tell from claims surface alone whether three names = one session
or three sessions." This is a tooling gap the
`(agent_name, platform, session_id_prefix)` routing tuple cannot
fix at the routing layer; it needs either:

- session-aware identity discipline (one name per session even
  on rename), OR
- an explicit "rename within session" comms-event class so the
  coordinator sees `Fiery → Dim → Verdant` as one session
  changing names, not three separate sessions, OR
- richer claims surface that aggregates by session_id_prefix.

This is implementation work, not new doctrine; routing to
pending-graduations as a P4 follow-on (P4 landed `claims
active-agents` but did not solve the rename-within-session
shape).

### F8 — Long-running monitor loop discipline needs both timestamp surfaces

Single corpus instance, but worth recording for first-instance
visibility:

- **Umbral Masking Silhouette** (current napkin): "sorting comms
  JSON by embedded `created_at` missed freshly written message
  files whose timestamps were earlier than the current tail."
  The cure: long-running monitors must combine semantic
  timestamp reads with an mtime/file-freshness pass before
  reporting "no new messages."

This is first-instance; not yet at trigger. Pending-graduations
candidate with second-instance trigger.

### F9 — Lockfile-in-flux without coordination-layer declaration

Single corpus instance, but high-value for grounding doctrine:

- **Quiet Stalking Mirror** (current napkin): the dependency
  refresh slice (43 files: pnpm@10.33.4→@11.1.1, every workspace
  package.json, lockfile, SDK codegen artefacts) was visible
  only via `repo-continuity.md § Next Safe Steps`, not via
  `active-claims.json` or `shared-comms-log.md`. WS1.5 was
  correctly held on lockfile-collision grounds, but the held
  could have been avoided.

The cure named in the napkin: "if `active-claims.json` shows
no claim on a dirty slice, cross-check `repo-continuity.md
§ Next Safe Steps` for owner-direction landing notes before
treating the dirty slice as orphaned." This is a single
behaviour-change to grounding doctrine. First-instance;
pending-graduations candidate. Could land cheaply as a one-line
addition to `start-right-quick`'s live-state reading order.

### F10 — Owner doctrine: "no aliases, no fallbacks, fail fast and hard with helpful error message, replace old with new"

Owner-stated doctrine on 2026-05-13 captured by Quiet Stalking
Mirror, applied immediately to WS1.5 canon wrapper design.

The four parts already exist in `principles.md` as separate
principles:

- "NEVER create compatibility layers, no backwards compatibility"
  (line 159)
- "Fail FAST" (line 187)
- "Version with git, not with names" (line 268)
- "WE DON'T HEDGE" (line 350)

What is **new** is the owner's *positive four-part formulation*
as a coherent boundary-design discipline. The four pieces compose
into a single rule about boundary design at first-derivative
moments (new wrapper, new adapter, new schema, new public API).

Trigger as captured in the napkin: "second observation across a
different boundary." Corpus contains N=1 (the WS1.5 canon
application). Not yet at trigger. Pending-graduations candidate
with explicit boundary-design trigger.

If/when graduated, candidate destinations are (in preference
order):

1. New rule `.agent/rules/boundary-design-strictness.md` citing
   the four `principles.md` anchors as the operationalisation
   target. Adopter scope is *next contributor in this repo who
   designs a new boundary*; this is ADR-shaped, not PDR-shaped.
2. Amendment to `apply-architectural-principles.md` adding the
   four-part discipline as a worked operational instance.
3. Amendment to the existing `replace-dont-bridge.md` rule to
   absorb the other three parts (no aliases, fail fast,
   helpful error message) — this loses the positive
   four-part shape but is the lightest landing.

## Evidence arcs

Each finding's chronological evidence chain across the corpus:

- **F1 (capture-doesn't-cure)**: Sparking Charring Ash 2026-05-11
  → Wooded 2026-05-11 reset → Brazen 2026-05-12 dispatcher →
  Lush 2026-05-12 codex-exec → Shaded Ripening Copse 2026-05-11
  → Coastal-via-Lush 2026-05-12 absorbed-files. Six instances
  spanning all three napkins.
- **F2 (coordinator amplifies own defect)**: Wooded 2026-05-11
  (over-write) → Brazen 2026-05-12 (over-write) → Ferny
  2026-05-12 (under-write). Three instances; over-/under-
  symmetry distinguishable.
- **F3 (completion overloaded)**: P5 first claim 2026-05-13 →
  P5 second claim 2026-05-13 corrected → P8 claim 2026-05-13
  corrected → Verdant report 2026-05-13. Same agent (Codex)
  across `019e1d` chain, suggesting protocol-level not
  agent-level cause.
- **F4 (commit window single-agent assumption)**: Brazen→Lofty
  2026-05-12 → Lush absorbed-files 2026-05-12 → STOP race
  2026-05-12. All three within 24 hours; protocol-shape
  cluster.
- **F5 (thread-record drift)**: Solar Gliding Twilight 2026-05-13
  (twice). Same agent within 24 hours; would be
  pattern-promoted at second-agent observation.
- **F7 (identity tuple)**: 2026-05-12 → 2026-05-13 throughout
  the Codex chain. N≥10 sessions across three prefixes.
- **F9 (lockfile-no-comms)**: Quiet Stalking Mirror 2026-05-13.
  Single instance.
- **F10 (owner four-part doctrine)**: Quiet Stalking Mirror
  2026-05-13. Single instance.

## Rejected near-patterns

Tempting syntheses that did not clear the bar in this pass:

- **"Codex sessions need a `scope` argument to allocate work
  to themselves"** — observed once via Ferny's coordinator
  reflection but not corroborated; could be a coordinator-shape
  observation rather than a Codex-specific shape. Wait for a
  second instance.
- **"Detached monitor processes always become orphaned"** — N=1
  in the corpus (Wooded Spreading Thicket Python monitor; owner
  correction). Already in pending-graduations as
  detached-monitor-lifecycle-contract candidate; this corpus
  doesn't add a new instance.
- **"Reviewer dispatch in implementation cycles is over-budget"**
  — observed in the Lush codex-exec session (three
  reviewer-recommended specialists named but not invoked) but
  the owner direction was that gateway review was sufficient
  for that scope. This is owner-direction-specific, not a
  general failure mode.
- **"Knip on sub-path-export barrels is a recurrent surprise"**
  — observed at WS1.1 only (depcruise no-orphans); already
  captured in pending-graduations as a scaffold-checklist
  doc-update candidate. No new instance.
- **"Markdownlint --fix destroys prose containing `+` / `#` / `-`"**
  — observed in the corpus (Sparking Charring Ash 2026-05-11,
  Wooded 2026-05-11). Already in `distilled.md § 2026-05-12
  rotation`; nothing to graduate.

## Routing decisions

| Finding | Status | Destination | Action this pass |
| --- | --- | --- | --- |
| F1 capture-doesn't-cure | NEW emergent — N=6 | distilled.md (new entry pointing at structural-cure preference) + pattern note | Add distilled.md entry; cross-reference existing pattern |
| F2 coordinator amplifies own defect | NEW emergent — N=3 across two failure modes | new pattern OR PDR `pdr_kind: pattern` (coordinator-as-allocator-not-gatekeeper); PDR candidate Ferny captured | Add to pending-graduations with corpus evidence; surface PDR candidate to owner |
| F3 completion overloaded | Already in execution | `completion-claim-proof-pipeline.plan.md` | No new action; corpus confirms empirical ground |
| F4 commit-window single-agent | Partially graduated | `agent-collaboration.md` § Treat Commit as a Short-Lived Shared Transaction Surface — amendment for mutual mechanical verification + hook authority | Surface amendment candidate to owner |
| F5 thread-record drift | NEW emergent — N=2 within 24h | new pattern OR `agent-collaboration.md` amendment; coordinator closeout discipline | Surface candidate to owner |
| F6 repo-wide gates serialise threads | Graduated (P0) | `cost-of-collaboration.plan.md` P0 evidence | No new action |
| F7 identity tuple insufficient | NEW emergent — N≥10 sessions | pending-graduations entry; implementation work P4 follow-on | Add to pending-graduations |
| F8 monitor-loop dual-timestamp | First instance | pending-graduations entry; second-instance trigger | Add to pending-graduations |
| F9 lockfile-no-comms | First instance | `start-right-quick` workflow amendment; OR pending-graduations | Surface to owner — single one-line addition is cheap; no graduation theatre needed |
| F10 owner four-part doctrine | First instance | pending-graduations entry; second-instance trigger; rule candidate when triggered | Add to pending-graduations with the rule candidate destination preference order from §F10 |

## Cross-rotation meta-observation

Three rotations in 48 hours is not the normal cadence; it reflects
the load profile of this multi-agent collaboration window. The
distilled.md is itself at 312 lines (over its 275-line hard
limit), which is correctly read as the next-layer signal that
substance is graduating *upward* faster than the destination's
shape can absorb. The structural cure is not to compress the
distilled-stage but to land the graduations the corpus is
producing, which moves substance into permanent doctrine homes
and allows distilled.md's shape to relax naturally
([PDR-046 §Move 3](../../practice-core/decision-records/PDR-046-layered-knowledge-processing.md#move-3--a-layers-fitness-pressure-is-addressed-by-processing-the-next-layer-up-not-by-compression)).

The cross-rotation rate of structural change is high in this
window. Per [ADR-131 §Self-Referential Property](../../../docs/architecture/architectural-decisions/131-self-referential-property.md),
this warrants a deliberate pause-and-stabilise posture before
further Practice Core restructuring after the candidate
graduations from this synthesis land. The next consolidation
pass should explicitly check whether substance has settled or
whether the change rate has continued accelerating.

## Closing

The corpus is the empirical bedrock under the
cost-of-collaboration plan's P0-P5 landings, the completion-claim
proof pipeline plan, and the multi-agent dispatcher experience
file. Future passes can read this synthesis as the marker; the
next "since-marker" historical pass should start at the next
napkin rotation after `napkin.md` (current).
