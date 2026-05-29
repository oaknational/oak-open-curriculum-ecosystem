# M1 — Operating Context and Layer Inventory

Companion working artefact to
[`collaboration-substrate-coordination-rightsizing.plan.md`](collaboration-substrate-coordination-rightsizing.plan.md).
M1 is the brief's first investigation move: state the real operating context
precisely, then inventory every coordination layer against it.

- **Date**: 2026-05-29
- **Author**: Leafy Regrowing Petal (claude / claude-opus-4-8 / `f9d588`)
- **Serves**: M2 (derive the minimal substrate). M1 is investigation, not a
  ratified design. The keep / fold / delete leans below are inputs to M2, not
  verdicts. Ratification is owner-facing.
- **Builds on**: the 2026-05-25 coordination-efficiency survey
  (`.agent/research/agentic-engineering/agent-coordination-efficiency-survey-2026-05-25.md`)
  and PDR-082 (which already derived per-layer keep / drop / change for the
  n=2 case). M1 generalises that per-layer logic across the whole substrate.

---

## §0 Frame correction — owner steer, 2026-05-29

After M1's inventory landed, the owner reset the design frame:

> "I am convinced [of the re-polarisation cure], the predicates must be defined
> now, evaluated and refined over time, all scenarios must assume no owner
> presence, the drive is towards full autonomy."

This corrects the load-bearing dimension of the §1 yardstick below. §1 made
**owner-presence** the keystone and used it to justify folding the
autonomous-team machinery as "redundant because the present owner is the
resolver/observer." That is the exact trap the Practice already records
(`owner_action_is_not_a_cure`): **owner-presence is a transitional stopgap,
never a design assumption.** Designing the substrate around it builds toward the
stopgap, not the goal.

What changes:

- **The yardstick re-bases.** From *"does the present owner already provide
  this?"* to *"at what n (and thread-topology, work-shape) does an **autonomous**
  agent or team genuinely need this?"* Owner-presence is removed as a design
  *reliance* — the substrate must not be built to depend on the owner being
  there. The owner remains available (the escalation backstop among other
  things); the drive is to reduce how often that backstop is needed, never to
  remove it. The predicate is n + topology + work-shape because those define what
  autonomous coordination needs — full stop.
- **The cure survives and sharpens.** Re-polarisation (light-by-default,
  heavy-gated-on-by-context) is ratified. The gate is now purely
  **n + topology + work-shape** — all autonomous-derivable — not owner-presence.
- **The verdicts re-base.** "Fold because the owner covers it" becomes "gate on
  n because autonomous coordination needs it only at that n." The 86-row
  inventory stands as the *catalogue*; most owner-presence-justified folds become
  "keep, engaged at the n where autonomy needs it." Net: the substrate is
  **preserved and dialled by n**, not deleted — making clean `delete` rarer
  still. The machinery is the autonomy target, merely mis-wired always-on.
- **PDR-082 needs re-derivation.** Its n=2 drop-set leaned on "liveness is
  owner-visible in chat." Building toward autonomy retires that justification:
  peer liveness at n=2 comes from the watcher + claim-freshness the agent itself
  reads. The strict definition is §5 — a re-derivation, not an open question.
- **The legacy routing system is deleted, not folded.** The
  routing-legacy-fallback compatibility arm is the bug source (the 2026-05-28
  watcher runaway) *and* a compatibility layer — principles §Strict-and-Complete
  and §Code-Design ("NEVER create compatibility layers… replace the old code…
  fail FAST") require its removal, not its preservation behind a dial. This work
  executes that removal: id-keyed-only routing, fail-fast on an id-less identity,
  no legacy arm, no fallback writer, no diagnostic to flood. This is distinct
  from the *correctly-built* autonomous-team machinery (§4.3), which is strictly
  gated by n — not a compatibility layer, and not deleted.

§5 defines the re-based predicates. §1–§4 are preserved as the inventory of
record; read their owner-presence rationales through this correction.

---

## §1 The operating context (the yardstick)

> Superseded as a *design* frame by §0: the table below accurately describes
> today's **transitional** reality, but the design target is owner-absent full
> autonomy. Read it as "where we are now," not "what to design to."

Every layer is measured against the context the repo actually runs in, not the
context the substrate was built for. Stating it precisely is the whole point of
M1: the layers were each grounded in a real incident, but the incidents
occurred in **this** context and were cured with machinery sized for a
**different** one.

| Dimension | The real context | What the substrate assumes |
| --- | --- | --- |
| Typical concurrency | 1–3 agents | Large multi-agent teams |
| Worst-case observed | ~4 agents (and 4 concurrent Opus is already a flagged quota-ceiling / fold-check signal) | Unbounded teams that must self-organise |
| Owner presence | **Present** in essentially every session — interactive owner-chat, owner routes around ceremony, owner acts as a real-time measuring instrument ("is that overhead massive?") | Unattended — agents must detect liveness, elect coordinators, and resolve escalations without a human in the loop |
| Trust | Trusted agents, good faith (the recorded threat model) | — |
| Liveness substrate | Owner-chat responsiveness when the owner is present (the PDR-082 insight) | Heartbeat crons + retirement-detection because no human observes the team |
| Coordination resolver | The owner, in the room, is the lowest-authority resolver for anything peer-dialogue cannot settle | A Director / coordinator role the team must stand up itself |

**Observed failure modes and the machinery each spawned** (the accretion
record — every row is a real incident cured locally):

| Incident | Cure that accreted |
| --- | --- |
| 2026-05-28 routing legacy-fallback runaway → watcher auto-killed | (the trigger for this very re-ground) |
| 16 inherited modified files → overstated "foundation complete" → schema-bump cascade found ~30 min in | §1a gate-runner election |
| Coordinator-less window after a handoff | PDR-064 coordinator-handoff-two-moments |
| Heartbeat stall / false-positive retirement | PDR-078 + ADR-186 heartbeat contract, ping-before-escalate, heartbeat-content state-binding |
| Watcher silently dropped events (95 min missed) | watcher self-test candidates (not yet landed) |
| Two agents claim the same singleton slice | singleton-lane coordination rule |
| Two agents claim overlapping cycles | cycle-overlap coordination rule |
| n=2 ceremony tax (~25 min coordination / ~4 min work) | PDR-082 n=2 mode |
| Verdict-standby heartbeats consuming owner task slots → owner intervened | PDR-082 (heartbeat drop at n=2) |
| Stale `.git/index.lock` from parallel committers | commit-queue + git-claim discipline |
| Snapshot-read-as-current-state (≥20 instances) | substrate-pointer pattern doc |

The shape is uniform: **a real incident, in a 1–3-agent owner-present session,
cured with a layer designed for a large unattended team.**

---

## §2 Ratified invariants (inputs, not open questions)

M2 holds these as constraints on the answer. They are not re-litigated here.
The first four are the brief's named invariants; all are already recorded in
[`agent-collaboration.md`](../../../directives/agent-collaboration.md) and
PDR-056.

1. **Advisory, not mechanical.** "Knowledge and communication, not mechanical
   refusals… agents are reasoning peers, not constrained subjects. Locks are
   the wrong tool for reasoning peers." Every rule is a tripwire, not a
   refusal. Hardening the trusted-agent model would be a category error.
2. **Text-first, not binary.** Coordination runs on markdown + JSON state, not
   bespoke binary protocols.
3. **Portable, not platform-native.** Platform agent-team features are optional
   accelerants, never fallbacks or runtime dependencies.
4. **Owner is final.** Dialogue between peers; the owner is the final
   tiebreaker through named channels. Route through the lowest-authority
   resolver that can decide.
5. **Ground each mechanism in observed need before promoting it** (the
   §Coordination Surface Discipline already in `agent-collaboration.md`):
   "Speculative coordination shapes accumulate as dead surfaces the moment
   they ship without an evidence-of-need claim. Before adding a new
   always-visible coordination surface, widen the regular state audit first."

---

## §3 The M1 thesis

Invariant 5 is the crux. **The substrate already contains the discipline that
would have prevented the accretion** — and the accretion happened anyway. Why?

Because each layer *was* grounded in an observed need: a real incident. The
discipline's surface test ("is there observed need?") passed every time. What
was never applied is the **deeper** test the real context demands: *is this
need a property of the real 1–3-agent owner-present context, or of the large
unattended team the mechanism is sized for?*

Most of the heavy machinery — Director ratification, coordinator-handoff
two-moments, gate-runner election, heartbeat crons, retirement detection,
team-cadence sweeps — exists to **substitute for a resolver and an observer the
owner already is, when present.** The owner in the room makes the autonomous
substitute redundant. The layer is grounded in an incident but not in the
context; it is dead weight the moment the owner is present, which is almost
always.

So the M1 hypothesis the inventory tests, layer by layer:

> **Keep** the cheap, durable, advisory primitives that earn their place at
> n=1 too (claims registry, comms-as-text substrate, tripwire rules,
> bootstrap fast-path, identity). **Fold or delete** the always-on autonomous-
> team machinery whose pressure the present owner already absorbs.

This is not a call to add a "minimal mode." It is a call to apply the existing
Coordination Surface Discipline retroactively, with owner-presence as the
yardstick the original applications were missing. The honest expected direction
is *less* — and "delete most of the always-on machinery" must be an acceptable
M1 finding, not a failure.

---

## §4 Layer inventory

**The yardstick question, applied to every layer:**

> Does the real context (1–3 agents, owner present, trusted, advisory) need
> this **always-on** — or is it substituting for a resolver/observer the owner
> already provides, or sized for an unattended team that does not occur?

**Row schema** (each layer):

- `layer` — the named coordination mechanism.
- `mechanism_type` — always-on rule / skill-section / PDR-doctrine /
  state-primitive / cron / broadcast-class / role.
- `spawning_incident` — the incident that motivated it.
- `recording_doctrine` — the PDR / ADR / rule / skill section that records it.
- `pressure_solved` — the coordination pressure it addresses.
- `cost_at_real_context` — low / medium / high, with a one-line note.
- `override_or_breakage_evidence` — evidence it is routed around, overridden,
  or has failed (or evidence it is load-bearing and quietly works).
- `preliminary_lean` — keep / fold / delete, **for M2 to ratify**.
- `rationale` — tied to the yardstick.

**Inventory clusters** (the doctrine-inventory fan-out covers these 10):

1. Identity & routing — PDR-027, PDR-076a, `active-agent-routing.ts`,
   `register-identity-on-thread-join`.
2. Claims & ownership — active-claims registry + TTL/heartbeat,
   `respect-active-agent-claims`, `register-active-areas-at-session-open`,
   `check-singleton-per-window`, commit-queue, PDR-026.
3. Comms stream & watcher — `comms-all-channels-watcher`, comms event kinds
   (ADR-183), comms-seen, PDR-080, `use-agent-comms-log`.
4. Liveness & heartbeat — PDR-078, ADR-186, `liveness-heartbeat-cron`,
   `ping-before-escalate`, heartbeat-content state-binding.
5. Coordinator / Director roles — PDR-064 (two-moments), PDR-074 (Director
   value), `agent-collaboration.md` §Coordinator Role, three-mode standby.
6. Retirement & handoff — PDR-063 (mid-cycle retirement), ADR-182 (handoff
   record substrate), first-out-closeout, closeout contract.
7. Team-start & rendezvous SKILL layers — `start-right-team` §1 (team-start
   broadcast), singleton-lane, cycle-overlap, §1a gate-runner election, §5
   team-cadence 120 s sweep.
8. n=2 mode — PDR-082 (the partial M2 already derived).
9. Curator & substrate-care — PDR-081.
10. Sidebars / escalations / joint decisions — multi-agent-collaboration
    sidebar-and-escalation, conversation/escalation schemas,
    joint-agent-decision-protocol.

**Inventory complete.** A 10-reader doctrine fan-out (workflow
`wf_a4a26942-2e0`) returned 86 layer rows; a completeness critic surfaced
16 further mechanisms and challenged 6 leans. The verbose per-layer rows live
in the workflow transcript; the synthesised findings below are the durable M1
record. All leans feed M2 (owner-facing ratification); nothing here is ratified.

### §4.1 Headline

- **~102 distinct coordination mechanisms** (86 inventoried + 16 critic-surfaced)
  across identity, claims, comms, liveness, coordinator/Director, retirement,
  team-start, n=2, curator, and sidebar/escalation clusters. The count is itself
  the accretion headline — this is a large substrate for a 1–3-agent context.
- **Verdict distribution: overwhelmingly `keep`, a coherent `fold` set, and
  effectively zero clean `delete`.** The cheap durable primitives (identity,
  claims, comms-as-text, tags, sidebars, the conditional/event-triggered rules)
  earn their place even at n=1. The always-on autonomous-team machinery does
  not.
- **This refines the §3 hypothesis.** §3 said "fold or delete the always-on
  machinery." The inventory says: almost nothing is *wrong* — the defect is
  **mis-polarisation**. The heavy machinery is wired **always-on by default**
  when it only earns its place in a context (n≥4, owner-absent, unattended
  rotating cast, or an explicitly-opted-in coordinator/Director seat) that
  rarely or never occurs. The single `delete` lean (coordinator-cadence cron)
  was correctly challenged to `fold`: a deleted doctrine must be re-derived from
  scratch; a folded-and-gated one is immediately available if the team ever
  scales.

### §4.2 The generative cure (the M1 → M2 bridge)

The whole `fold` set shares **one** structural defect: always-on-by-default
wiring for a context that is the exception, not the rule. The generative cure is
therefore not deletion but a **context predicate**:

> The default operating mode is the `keep` set — lightweight, always-on. The
> heavy machinery is **OFF by default** and gated **ON** only when its
> justifying context actually holds — keyed on **n + thread-topology +
> work-shape**, owner assumed absent (§0 correction; predicate tiers in §5).

This is the answer to the brief's open-problem #1 (the simplified first-principles
design that replaces the accreted layers): the layers don't need replacing, they
need **re-polarising**. **PDR-082 already prototyped exactly this for n=2** — it
is the proof-of-concept; M2 generalises it into the default mode. It also answers
open-problem #2 (replace-vs-migrate / sunset-forcing): extend the existing
Coordination Surface Discipline with a **context-predicate requirement** — a new
always-on mechanism must name the context in which its need occurs, and if that
context is rare/absent it must ship gated-off-by-default, never always-on.

### §4.3 The `fold` set — the cull/gate list (default OFF, gate ON by context)

Liveness/cadence machinery (gate to n≥4 OR owner-absent):

- Heartbeat cron (≤4-min, both agents) — PDR-078 / `liveness-heartbeat-cron`.
- Periodic + standby-state heartbeat broadcasts.
- 120s team-cadence message sweep (SKILL §5).
- 120s progress-report mandate (SKILL §5).
- Coordinator-cadence cron / periodic wakeup (critic: `fold` not `delete`).

Team-start ceremony (collapse to a single concise registration broadcast at
n≤2; drop the vacuous heartbeat-cron-status field):

- Multi-section 10-field team-start broadcast (SKILL §1).

Coordinator/Director machinery (gate to coordinator/Director seat opted-in;
n≥4 default):

- PDR-074 Director effectiveness model (ratification checklist, three-mode
  standby, structural properties) — **but retain PDR-083 (pure-direction
  boundary) and PDR-071 (mode-separation) as standalone durable primitives**
  (critic: a blind PDR-074 fold would orphan the cheapest, most useful element).
- Slice-scoped coordinator delegation (speculative; no worked instance).
- Coordinator-handoff two-moments — the SKILL's *unconditional presentation*
  folds; the PDR-064 doctrine itself is `keep` as dormant zero-cost reference.
- Coordinator-introduction-to-named-coordinator rule — and **strip the
  hardcoded "Wooded Spreading Thicket" coordinator name baked into
  `use-agent-comms-log.md`** (team-state leaked into permanent doctrine; a live
  maintenance defect making the rule wrong in every other session).
- Comms-tooling-improvements-route-to-coordinator rule → fold to "infra changes
  require owner direction" (owner-is-final already covers it).

Advisory-invariant violations (fold regardless of n):

- PDR-056 Cure (iii) heartbeat-or-die **auto-reclaim** — critic: the
  orchestrator/peer-may-auto-archive shape is a **mechanical gate, violating
  advisory-not-mechanical**. Correct cure already exists: consolidation surfaces
  stale claims, owner decides (the §7e `keep`).
- PDR-056 Cure (ix) deferred-commit-until-counterparty-ack (overlaps commit-queue;
  "wait for ack" collapses to "check owner" when owner present).

Heavy decision ceremony (gate to n≥3 touching-threads; keep schema additive):

- Joint-decision protocol ack-ceremony + mandatory session-handoff role-handoff
  sub-step → conditional on an active joint_decision. **Zero production
  instances since April 2026.** Keep the schema kinds (additive, free unused).
- Owner-escalation surface mandatory consolidate-docs reporting → latent
  scale-out substrate. **Zero live escalation cases ever.** Owner present is the
  real-time resolver.
- §7e joint-decision scan → conditional (critic: split §7e into 3 scans —
  **keep** claims-archival + sidebar-staleness, **fold** joint-decision scan).

Doctrine drift (fold = reconcile to current canonical):

- `(name, session_id_prefix)` routing-pair rule section → `(name, id)` per
  PDR-076a, with prefix as the legacy-fallback coordinate (critic sharpened the
  exact wording: don't drop the legacy fallback, name it).

Proposed scale-out (hold off-by-default; do not promote at the real context):

- ADR-184 sync event kind + urgency field.
- ADR-185 comms-event auto-acceptance metadata.
- PDR-065 grounding-cost amortisation Mode A/B.

Singleton/gate:

- `check-singleton-per-window` broadcast convention → owner-directed marshal
  assignment, then the pending `area-kind: gate-sweep` structural cure.

### §4.4 The `keep` set — the minimal always-on substrate (compact)

These earn their place at n=1 and cost a read/write or fire only on a real event:

- **Identity**: PDR-027 thread-continuity + additive rule; PDR-076a tuple +
  routing computation; `register-identity-on-thread-join`; session-close
  identity gate; identity preflight; PDR-076b body-file frontmatter contract.
- **Claims**: active-claims registry; `register-active-areas-at-session-open`;
  `respect-active-agent-claims`; commit-window claim + commit_queue + 6-step
  workflow; on-demand `heartbeat_at`; stale-claim archival (§7e claims scan);
  closed-claims archive; comms-seen convention; PDR-026 landing commitment.
- **Comms**: all-channels watcher + self-exclusion-only filter (PDR-082 keeps —
  the 2026-05-28 runaway is a CLI defect to fix, not a wrong-sizing); ADR-183
  failure-mode tagging; comms-event-stream-canonical authoring contract;
  three-checkpoint cadence (strip the hardcoded coordinator name); PDR-080
  absorption-before-rotation.
- **Liveness**: ADR-186 heartbeat lifecycle *schema* (durable even if crons
  fold); `ping-before-escalate` (conditional fire).
- **Coordinator**: opt-in symptom-triggered coordinator role; PDR-071
  mode-separation; PDR-083 pure-direction boundary; PDR-064 two-moments (dormant
  reference); PDR-077 Commit Marshal role (zero-ceremony owner-directed at n≤3).
- **Retirement/handoff**: PDR-063 mid-cycle retirement; ADR-182 handoff
  substrate; discontinuity-boundary validation; receiving-agent pickup contract;
  final-heartbeat-end + team-member closeout broadcasts (decouple rationale from
  the cron; drop the vacuous heartbeat-end template field at n≤2);
  `handoff-messages-self-contained`.
- **Team-start**: registration broadcast (substantive fields); singleton-lane
  rule; cycle-overlap rule; gate-runner election (conditional on non-clean tree);
  `ship-independent-coordinate-dependent`.
- **Curator**: PDR-081 role / triggers / per-pass log / SKILL; graduation
  buffer; cross-session vision; PDR-072 autonomic framing; peer-conflict
  preflight.
- **Sidebars**: sidebar protocol (markdown variant is the n=2-light form);
  sidebar expiry; PDR-056 Cure (i) out-of-band ack; Cure (v) CLI ergonomics
  (**and implement the missing `comms watch`/`reply`/`pending` + `list --tail`/
  `show` affordances** — the gap actively causes friction); Cure (ii) read/write
  claim-mode field.
- **Cross-cutting correctness**: `agent-state-observable` (makes the whole
  substrate load-bearing); `continuity-surface-commits-as-orphans`;
  `sha-prefix-in-collaboration-content`; `stage-by-explicit-pathspec`.
- **The prototype**: PDR-082 itself — `keep` and promote (consider renaming
  n=2 → n≤3 per the coordinator-role-threshold memory).

### §4.5 What M1 hands to M2

M2 (owner-facing) ratifies the minimal model. The concrete decision M1 surfaces:

1. **Adopt the re-polarisation cure** — light-by-default, heavy gated-on-by-
   context — generalising PDR-082 from an n=2 special case into the default
   operating mode. Is this the target design?
2. **Where does the context predicate live?** Candidate: a single
   `agent-collaboration.md` §Operating-Context-Mode section + a
   context-predicate clause added to §Coordination Surface Discipline, with the
   SKILL gating its heavy sections on it. (No new machinery — a gate on existing
   machinery.)
3. **Two immediate corrections that stand regardless of M2** (live defects, not
   design questions): strip the hardcoded coordinator name from
   `use-agent-comms-log.md`; reconcile the `(name, prefix)` routing-pair rule to
   PDR-076a. These are doctrine-drift fixes the inventory exposed.
4. **M4 supersession preview**: most of the `fold` set's cluster plans
   (`cost-of-collaboration`, the n2 work, sidebar/escalation, joint-decision,
   coordination-watcher-canonicalisation) are superseded-or-folded once the
   re-polarisation model is ratified — concrete list at M4.

---

## §5 The context predicates (defined now; refined over time)

Per the §0 steer, the gate that switches coordination machinery on is built
from autonomous-derivable dimensions, owner assumed absent. This is the initial
definition — built to be used and corrected, not frozen.

### Predicate dimensions (all autonomous-derivable; owner-presence excluded)

1. **n** — concurrent live agents on the shared tree/threads. Source:
   freshness-filtered live entries in `active-claims.json`. The dominant dial.
2. **topology** — do the live agents' claimed areas touch or overlap? Source:
   claim `areas`. (The survey's finding: the phase transition is in touching
   threads, not raw agent count.)
3. **work-shape** — design/decision vs parallel-execution vs monitoring.
   Source: claim `intent` / a declared shape field. Governs cadence, not
   machinery class.

### Tiers (the dial)

- **Tier 0 — Solo (n=1).** Identity, claims (self-audit + continuity seed),
  comms-as-record, continuity surfaces, mid-cycle/compaction **self**-handoff,
  and all cross-cutting correctness rules (`agent-state-observable`,
  `handoff-messages-self-contained`, `stage-by-explicit-pathspec`,
  `sha-prefix-in-collaboration-content`, `continuity-surface-commits-as-orphans`).
  No liveness cron, no coordinator, no cadence — there are no peers. The
  bootstrap fast-path and the dominant current case. The autonomous solo agent's
  "peer" is its own post-compaction future self — which is why the handoff and
  continuity primitives stay even at n=1.
- **Tier 1 — Small peer team (n=2-3).** Tier 0 + all-channels watcher (the
  agent's organ of peer-perception), claims-overlap consultation, substantive
  cross-agent broadcasts (tree-green / push-landed / gate-state / blocker),
  singleton-lane + cycle-overlap rules, sidebars, gate-runner election (on
  non-clean tree), mid-cycle handoff with peer pickup. Liveness is **event-driven**
  (watcher silence + claim-freshness), not a periodic cron — this is the
  re-derivation of PDR-082's n=2 mode under owner-absent (the cron's old "owner
  watches" replacement is gone, so liveness must come from substrate the agent
  itself can read).
- **Tier 2 — Coordinated team (n≥4 OR a touching-threads contention symptom).**
  Tier 1 + heartbeat cron + retirement detection + `ping-before-escalate` +
  coordinator/Director role + two-moments handoff + 120s cadence + joint-decision
  protocol + escalation surface. The full autonomous-team machinery the substrate
  already contains — engaged, not invented.

Tiers are **monotonic and additive**: a 1→2→3→4 transition engages the next tier
without re-loading; a 4→2 transition disengages Tier 2 cleanly. This is
PDR-082's "atomic mode-switch on team-size transition," generalised across all
tiers.

### Strict and total — no invented gaps

The predicate is **total**: every (n, topology) maps to exactly one tier; there
is no fallback tier and no undefined case. Specifics that could be mistaken for
open questions are design decisions, made here:

- **Escalation routes to the owner** — the standing backstop. There is no
  missing endpoint to invent. Autonomy is the drive to reduce how often it fires
  (pre-positioned routing, substrate resolution, lowest-authority resolver),
  not to replace the endpoint.
- **n=2 liveness is event-driven** — watcher silence + claim-freshness staleness
  (Tier 1). Heartbeat crons are Tier 2 only. The staleness threshold is a tuned
  constant, not an open design question.
- **Tier transitions read live claims** — n and topology come from
  freshness-filtered `active-claims.json`; an agent that crashed without closing
  is handled by the existing claim-freshness staleness, no new mechanism.

### Refinement is threshold-tuning, not redesign

"Refined over time" means the constants (staleness windows, the n thresholds)
are tuned against evidence — *not* that the design is provisional. The design is
fixed now. When it stabilises it graduates from this exploration artefact into
an `agent-collaboration.md` §Operating-Context-Mode section plus the
context-predicate clause on §Coordination Surface Discipline (§4.5 item 2).
