---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure; 115 clears the noise while still flagging genuine over-runs.
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `agent-collaboration-research` thread

> **THREAD RETIRED — comms-corpus research concluded 2026-06-14.** WS0–WS7 complete and
> MERGED to main (PR #208, `a6b14a8a3`). The class-tiered archive-not-delete rotation is
> ratified and homed as **PDR-094** (portable contract) + **ADR-199** (repo phenotype); the
> research findings live in `reports/agentic-engineering/` (WS2 corpus survey, WS3 failure-mode
> taxonomy, WS5 rotation proposal, WS6 synthesis) and the rightsizing keystone M4; theme 1
> (substrate-pointer) graduated to the `substrate-pointer-read-as-current-state` pattern. The
> candidate-themes catalogue below is conserved here as **research substrate** (a floor for what
> counts as a pattern, not a live lane). This record is retired — absent from the Active/Paused
> thread indexes. The one **standing** residual is the steady-state curator-pass obligation (the
> coordination-tier archive-move; see §"WS7 Closeout — Conserved Findings"), wired into the
> lifecycle skills (`consolidate-docs` step 3a + `oak-curator-pass`) — fired by retention-window
> elapse, not by reopening this thread. (The historical WS1 blind-pass fence — defer both
> Candidate Themes sections during a cold read — is preserved in §Resume Contract; it is moot
> now the research is concluded.)

## Status

**WS0–WS6 COMPLETE + first-hand verified; WS5 RATIFIED; CONSOLIDATION BODY COMPLETE (2026-06-13,
Juno mends Plasma / `3cc9d5`) — the ratified rotation decision is now homed as PDR-094 (portable
contract) + ADR-199 (repo phenotype); M2 + SC1 routed into the rightsizing keystone M4; the WS6 §5
recommendations routed to their consumer plans; one PDR-089-evidence finding buffered. WS7
(archive-not-delete CODE migration) remains the only open body — gated on owner go + coordination with
the statusline/agent-tools lane (shared `agent-tools/`); WS7 steps 1–2 (author the rotation ADR +
capture its cited-event provenance) are SATISFIED by this consolidation. Lane: Kayak herds Ballast →
Bluebell mends Mulch (`c2ef19`) → Juno mends Plasma (`3cc9d5`), sole owner.** Cast progression
on `feat/comms-research`: Katydid hunts Roost + Myrtle weaves Thicket (WS0–WS3) → Geyser stirs
Bronze (WS3-forward + B/D/M2) → Kayak herds Ballast (WS4 liveness/coordination/emergent + anchor
verification + consolidation). The companion plan
[`comms-corpus-research-and-rotation-strategy.plan.md`](../../plans/agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md)
runs under the owner's ultracode multi-wave strategy.

**Session-boundary state (Gull spins Stratus / `9cf32d`, 2026-06-14 — WS7 execution OPENED, handed to a
successor).** WS7 is now mid-execution on `feat/comms-research` (solo for the remainder of the thread,
owner-confirmed). Landed + pushed: the deep WS7 DoD de-orphaned into the companion plan's §"WS7 Execution
Contract" (now the authoritative spec); the Phase-1 manifest carryover repointed (`e203791ad`); the Phase-2
provenance **pure core** (`9175acfeb`, test-expert sound, 10/10). Remaining: Phase-2 IO/scan layer +
`.agent/reference/comms-cited-events.md` digest + heartbeat-cadence artefact + the ~5,000-event class-tiered
archive-move; then Phase-3 (the atomic untrack + PDR-094/ADR-199/skills/README/.gitignore bundle); then
Phase-4 (land #208, owner-gated merge). Retention windows = DoD defaults (owner-confirmed). Owner directed a
fresh-budget successor at this clean boundary — **Serval mends Murmur** (owner-named 2026-06-14): pickup
record `handoffs/9cf32d-ws7-comms-rotation-handoff-to-serval-mends-murmur.md`; claim `907ff814` RETAINED
for Serval to pick up and active-acknowledge.

**Session-boundary state (Serval mends Murmur / `3e2619`, 2026-06-14 — WS7 Phase-2 Task-1 LANDED, handed to a
successor).** Picked up from Gull (claim `a67817ae`). Landed + pushed: the Phase-2 provenance IO/scan layer +
`comms-provenance-check` bin + the `.agent/reference/comms-cited-events.md` digest (`3a55b62e0`, 25 tests,
fail-closed, 12 cited events covered) on Gull's pure core; AND — owner-directed — a repo-wide
`@oaknational/no-throw-statement` ESLint rule at `warn` (`e36af1db0`, full gate green) front-loading the
Result-pattern standard agent-tools had been missing (owner: the throw-convention was an oversight). An
**adversarial sweep corrected the provenance scan scope to include governance docs (rules/directives)** per
PDR-094 Inv-3 — ADR-199 §4's "ADRs/PDRs/patterns" wording is amended in Phase 3; broaden-to-`reports/` resolved
NO (research-analysis citations). Remaining: Task 2b (heartbeat-cadence artefact) → Task 2c/3 (archive-move; run
`comms-provenance-check` first, 0 violations = safe) → Phase 3 (atomic untrack + ADR-199 §4 amendment) → Phase 4
(#208 merge, owner-gated). The throw→Result retrofit + rule promotion is a future lane
(`architecture-and-infrastructure/future/throw-to-result-migration.plan.md`). Owner-named successor **Galleon
calls Surf**: pickup record `handoffs/3e2619-ws7-comms-rotation-handoff-to-galleon-calls-surf.md`; claim
`a67817ae` RETAINED for Galleon to pick up + active-acknowledge.

**WS7 COMPLETE — merged to main 2026-06-14 (Whirlwind rides Ridge / `52e1cb`, repo-wide closeout owner).**
The full rotation arc is landed: Phase 2 (the class-tiered archive-move harness — classify → provenance-gate
→ plan → execute) by Galleon × Anvil (`815fc2f48` + `3b02ae3ef`); **Phase 3 atomic untrack** (`255117a43`)
— `.agent/state/collaboration/` coordination tier is now untracked-by-design, with the standing
comms-log curation obligation propagated atomically across ADR-199 + PDR-094 (Invariant 6) +
session-handoff + consolidate-docs SKILLs + the state README, `experiments/` relocated to the tracked
`.agent/collaboration/experiments/`, and the kept-tracked decision-provenance set (README +
`conversations/` + `escalations/` + `sidebars/` + `handoffs/README.md`); the **archive-move RUN**
(Brazier stirs Residue, Anvil's successor) — 2,390 heartbeats rotated `comms/`→`comms-archive/` as pure
disk hygiene (untrack-first → zero git diff), byte-preservation balanced (2959+2390==5349), 0 provenance
violations, verified first-hand both sides; and **Phase 4 — PR #208 MERGED to main** (`a6b14a8a3`,
2026-06-14T18:46:40Z; CI green). A release-readiness pass caught one real blocker pre-merge — the untrack
made `comms/` absent in fresh CI checkouts so `validate-collaboration-state` crashed ENOENT; fixed
(`356e76f59` + `7da12a82f`: `directorySurfaces`/`validateJsonSurface` tolerate an absent
untracked-by-design surface — comms/ + the two claim files — while tracked `conversations/`/`escalations/`
keep hard-fail). **Cast for the closeout:** Galleon calls Surf → Whirlwind rides Ridge (driver, claim
`7792944a` supersedes Galleon's `21132e1a`); Anvil spins Bronze → Brazier stirs Residue (archive lane,
claim `c6ba82c8`, relinquished at closeout). **Remaining (ongoing curator work, NOT this session):** the
**1,707 coordination events** past the 7d window stay LIVE in `comms/` — they are `awaiting curator
disposition`, never auto-moved (absorption gate: body-read required; the `3cc1fb93` falsifier protection;
37 of them are `body-read-required` long-bodied heartbeat-ends). The next archive-move RUN is the
coordination tier, post-body-read; verification recipe + the `comms-archive/.gitkeep` dir-anchor fact +
the git-independence of the move are conserved below (§"WS7 closeout — conserved findings"). The archived
2,390 live on-disk-only (gitignored) per ADR-199's archive-retained-never-tracked end state; their signal
is conserved in the 2b cadence aggregate `.agent/reference/comms-heartbeat-cadence.md`.

**WS4 outcome (Kayak + Geyser, mutual first-hand verification — itself a WS6 what-worked-well):**
12-lead liveness/coordination/emergent fan-out + 18 anchors (T7/CC4 + 16) verified; 8
FH-confirmed, corrections folded. Corrections (conserve-don't-narrow): S9 cured-in-live-code (→
what-worked, routing withdrawn); SC1 causal-root evidenced + sharpened (no authoring path records
linkage, incl. `comms reply`, event `2ff03ded`); T7 count 5→4 FH-enumerable (5th unlocated); the
**swap-9G→0 finding RETRACTED** (reboot confound — `kern.boottime` 10:52Z). WS3 REVIEW disposition:
0 new spine class (structure holds; tagged population a lower bound). PR #207 (merged) evidence
integration reviewed faithful — one post-merge follow-up: correct "commit-queue ×5" → "4 enumerable".
Evidence on origin (`48b9765b5`+): `ws4-find-verify-evidence.json`, `ws4-anchor-verify-evidence.json`,
`ws4-pending-fh-verification.md`, `ws4-bdm2-verification.md`, `ws4-review-disposition.md`,
`ws4-geyser-continuation.md`, `ws-critical-reassessment-kayak.md`. Full corpus committed + pushed
(`8d6e26f88`) — the 189-untracked deletion-safety gap is largely cured (now ~1 untracked).

Progress:

- **WS0 + WS2**: corpus surveyed (~5,120 events, 2026-05-20→06-13; 0 lifecycle-kind;
  heartbeats ~45%→74%; ~48% one-way reports; 16 questions / 10 escalations corpus-wide).
  Report: `reports/agentic-engineering/2026-06-12-ws2-corpus-survey.md` (+ scripts beside it).
  Corrected first-hand: event→event threading is rare by ANY mechanism (`in_response_to`=0;
  only 115 full-UUID tokens resolve to events), and the zero-lifecycle/low-tag findings have a
  CAUSAL root — the comms CLI exposed no `--tags`/lifecycle authoring path (events `1e2c83eb`,
  `ec86492e`).
- **WS1**: WS1 was DELEGATED to fresh-context blind readers after the executing seat's
  start-right contamination (disclosed `37523113`/`8cefbe36`; cured by the entry-point fence
  banner above + delegation). All 8 cold-read logs complete (`ws1-cold-reads/`) with all 8
  corroboration verdicts (`ws1-cold-reads/corroboration/`; R1 verifier 49/49 confirmed,
  independently corroborating the citation correction). R2/R3 redone on Opus 4.8 after a
  temporary Fable model outage.
- **WS3** (Myrtle): failure-mode taxonomy in progress
  (`reports/agentic-engineering/2026-06-13-ws3-failure-mode-taxonomy.md`), ~20 classes on a
  substrate/tooling/agent/process/meta axis; M2 (learning-loop-doesn't-fire) promoted to the
  spine.
- **Running notes** (owner-directed insight safeguard): the lab-notebook write-ahead log is
  `reports/agentic-engineering/2026-06-13-comms-corpus-research-notes.md` (both researchers
  append; capture-first).
- **ArcAngel** relocated to the tracked home `.agent/collaboration/rapid-comms/` (owner-directed
  early WS7 slice); the live peer channel is `rapid-comms/2026-06-13-katydid-myrtle.md`.

**WS5 RATIFIED by owner 2026-06-13** ("ratify as proposed"). WS5 + WS6 COMPLETE (Bluebell mends Mulch):
two-round-adversarially-reviewed rotation proposal
(`reports/agentic-engineering/2026-06-13-ws5-rotation-strategy-proposal.md`); comprehensive synthesis
(`2026-06-13-ws6-comms-corpus-synthesis.md`); §11 re-verify closed first-hand
(`2026-06-13-reverify-outcomes-bluebell.md`: 6 anchors PENDING-FH→FH, 4 stale figures corrected).

**CONSOLIDATION BODY DONE (2026-06-13, Juno mends Plasma). Next: WS7 engineering only.**
The dedicated consolidation session ran (owner-directed 2026-06-13; rationale: consolidating under a
long research+decision load would be a live instance of M2, so a fresh session did the
distil→graduate→enforce justice). What it landed:

1. **Consolidation (knowledge curation) — DONE.** Rotation decision homed as **PDR-094**
   (`coordination-event-rotation-is-class-tiered-archive-not-delete`, portable contract) + **ADR-199**
   (`comms-event-rotation-phenotype`, repo phenotype, with inline-quote provenance for its cited events
   `86e94e54` / `3cc1fb93` / `2ff03ded`). M2 + SC1 routed into the rightsizing keystone M4 (reconcile,
   not mint — `passive-guidance-loses-to-artefact-gravity` + `action-time-structural-interrupt` for M2;
   `closed-shape-design-optionality` for SC1). **First-hand routing correction:** the WS6 §5 table named
   `comms-event-write-integrity` as an SC1 consumer, but that plan is complete + scope-frozen and does
   NOT own the authoring-affordance surface — SC1's home is M4. §5 recommendations routed to PDR-078/
   liveness-floor, hang-hardening, storage-redesign, cost-of-collaboration, n-agent-experiments,
   commit-queue-multi-writer-cure. One PDR-089-evidence finding (the two-reader mutual-FH loop) buffered
   in pending-graduations. PDR + ADR indexes updated. `oak-consolidate-docs` run.
2. **WS7 engineering — STILL OPEN, owner-gated.** The code-bearing migration (5 schemas + `fixtures/` →
   agent-tools workspace; preserve `experiments/`; gitignore `.agent/state/` with the README anchor;
   archive-move events past the window; the pre-archive-move provenance guard script). **Steps 1–2
   (author the rotation ADR + capture cited-event provenance) are now SATISFIED** by the consolidation;
   the remaining steps (3 run the guard, 4 archive-move; plus schemas/fixtures relocation + untracking)
   need owner go AND coordination with the statusline/agent-tools lane (shared `agent-tools/`).

**Open items to carry**: (1) PR #207
"commit-queue ×5" → "4 enumerable" post-merge follow-up on `main`; (2) one-decision-home PR shape
awaits owner confirm; (3) `feat/comms-research` ~28 behind `origin/main` (PR back-links
dangle-until-merge); (4) 2 Dependabot vulns on `main` (1 high / 1 low, owner-flagged); (5) the
watcher host-resource cost is a HYPOTHESIS (the swap→0 evidence was reboot-confounded) — a
controlled watcher-RSS × dir-size measure would settle it. WS7 owner-gated. This record remains the
research-substrate home (hypothesis, themes, vectors, corpus facts). **Blind-pass note**: the WS1
cold read was kept blind via delegation; the executing seat's own contamination is disclosed and cured.

**Session-boundary state (Bluebell mends Mulch closeout, 2026-06-13).** The WS5/WS6/re-verify bundle is
committed (`f20680041`). The closeout captures — this thread record, `.agent/memory/active/napkin.md`,
the `pending-graduations.md` deep-consolidation candidate entry, and the `repo-continuity.md`
Active-threads row — are durable working-tree edits left UNCOMMITTED per the owner's git-state waiver;
the incoming session commits them with its work. `feat/comms-research` is a SHARED branch (Bilby hunts
Eventide, statusline lane): commit by EXPLICIT PATHSPEC under a singleton `git:index/head` window; the
staged registry residue (`active-claims` / `closed-claims` / `comms-seen`) is stale + pure-diff-excluded
— never commit it to the feature branch. **Conduct doctrine (load-bearing, carry it)**: corpus events
are input-to-verify, not truth (ground every load-bearing claim first-hand; first-hand means you, not a
sub-agent); conserve insight, never prematurely narrow; the two-reader mutual-first-hand-correction loop
is the lane's strongest reliability mechanism (run the adversarial shape on your own output) — full text
in the WS6 synthesis §1 and Kayak's handoff (`2026-06-13-comms-corpus-findings-and-handoff-kayak.md`) §1.

**Succession**: owner named **Kayak herds Ballast** as Katydid hunts Roost's eventual successor
on this lane (2026-06-13). Pickup surface for Kayak: this record + the running-notes lab
notebook (`reports/agentic-engineering/2026-06-13-comms-corpus-research-notes.md`) + the
committed substrate at `feat/comms-research` `9aaa6f710`. Katydid retains the research claim
and continues (WS4 liveness/coordination/emergent) until the handoff is triggered; Myrtle weaves
Thicket holds WS4 substrate-credibility + commit/concurrency + M2 in parallel.

## Origin

Created 2026-05-24 at the post-M1-Safe-Pause-merge boundary by Charcoal Brazing Kiln
(`claude / claude-opus-4-7 / 7c7327`) under owner direction. Verbatim:

> "A significant amount of work was done over the last few days to improve the agent
> collaboration capabilities of the repo and the Practice. Much of that is documented in ADRs
> and PDRs. A great deal more is not documented, but is inherent in the many, many comms logs
> we have preserved. Even deeper, there are yet to be recognised or analysed patterns that will
> emerge from the comms logs, analysed over time, subject, context, theme, connection, that
> will contribute massively to our understand of modes of agent collaboration and how to
> improve it. This is true original research. That research will require dedicated sessions by
> dedicated agents. It can't happen yet, but it must happen."

## The Research Vector

**Hypothesis**: the `.agent/state/collaboration/comms/` event archive — ~5 days of intensive
multi-agent collaboration leading into M1 Safe Pause, grown to **3,153 events (as of
2026-06-12T07:05Z; re-derive at use) spanning 2026-05-20 → live** — is **research substrate**
for understanding modes of agent collaboration. Since the original capture window the corpus
has gained whole new event classes: heartbeat-tagged liveness events (ADR-186),
`mid-cycle-handoff` directed events
(PDR-063 / ADR-182), live `failure-mode` / `behaviour-note` tag usage (ADR-183 / PDR-066),
and complete coordinated-team arcs (bootstrap → P1 diagnosis → merge sequencing → completion,
2026-06-11/12). Patterns exist in the corpus that:

- Have already been documented in ADRs / PDRs (the recorded substrate)
- Are visible to agents inside individual sessions but never extracted (operational-but-
  undocumented)
- Are **only visible across multiple events analysed together** by subject, context, theme, and
  connection (yet-to-be-recognised; true original research material)

The corpus is structured-enough to support automated pattern mining (each event has timestamp,
author tuple, recipient, kind, tags, body, optional `in_response_to`) and rich-enough that agent
qualitative analysis adds value beyond automated extraction.

## Preservation Boundary

The preserved `.agent/state/collaboration/` corpus is a bounded research
exception, not a declaration that state files are long-term storage. Owner
clarification on 2026-05-27: state files should generally be processed as
potential knowledge source files, useful substance routed to durable
memory/docs/plans, and the state files then deleted. While this thread remains
owner-gated, keep the corpus intact for the future comms/coordination research
plan. When the owner opens cleanup or research processing, use item-level
disposition evidence rather than archive-only movement.

Two facts sharpen the boundary as of 2026-06-12:

- **The hold now has an operational cost.** The 3,109-file flat directory degrades the live
  comms watcher: drain steps exceeded their 60 s (and later 300 s) deadlines twice on
  2026-06-11/12, killing the Director's watcher mid-session. Preservation-without-rotation is
  itself a recorded substrate-failure-mode instance (see new theme 13). The research unlock is
  therefore operationally urgent, not only intellectually valuable.
- **The corpus is git-heterogeneous.** Older events are committed; recent events (including the
  entire 2026-06-11/12 handover arc) are untracked working-tree files. Deleting an untracked
  event is unrecoverable loss. Any rotation mechanism must treat commit-or-absorb as the
  precondition for deletion of untracked events. **Corrected 2026-06-12 (Fern lifts Mulch,
  verified first-hand)**: commit `567bf0f1a` tracked the full corpus — all 4,978 events are
  now committed, zero untracked. The held corpus is git-recoverable; the commit-or-absorb
  invariant remains live for future events written after any untracking lands.

## Research Lenses (owner-named, 2026-06-12)

The research is explicitly not a find-and-fix-problems pass. Three lenses, with the third
weighted highest:

1. **Failure modes** — what went wrong, clustered with cure-shapes.
2. **What worked well** — successful practices and substrate behaviours, named so they can be
   protected and propagated rather than accidentally regressed.
3. **Surprising emergent behaviour** — behaviours nobody designed that the corpus reveals.
   These are steerable: the cure-shape vocabulary is **activation-enthalpy tuning** — nudges
   in comms tool design, defaults, affordances, and ceremony cost that make a desired emergent
   behaviour cheaper to do and an undesired one costlier, in preference to mandates or
   prohibitions. Encouraging, discouraging, or simply observing are all legitimate verdicts.

## Analysis Vectors (owner-named)

1. **Subject**: what was being discussed (marshal cycles, reviewer dispatch, owner direction,
   claim coordination, watcher behaviour, …)
2. **Context**: when in the session arc the event lands (session-open, mid-cycle, pre-pause,
   pre-compaction, post-merge, …)
3. **Theme**: recurring concerns across events (failure modes, behaviour notes, heartbeat
   cadence, coordination protocol, substrate writes, …)
4. **Connection**: cross-event linkages — citation references in bodies (the practical
   linkage substrate: the structured `in_response_to` field is unpopulated corpus-wide as of
   2026-06-12, so chains are reconstructed from body-text event-id citations, subject
   threading, and temporal adjacency), identity tuples appearing across multiple lanes,
   conceptual adjacency

## Candidate Themes (catalogue seeded from one session — 2026-05-24 Charcoal lens)

Not exhaustive; intended to give a future research-mode agent worked examples of what the
corpus contains and what counts as a pattern.

### 1. Substrate-pointer-pattern v2 (terminal-state vs running-state)

- **Shape**: agent A reads agent B's state from a SNAPSHOT (closeout broadcast, thread record,
  team-shape enumeration) and treats it as current truth. Agent B has since resumed; A acts on
  stale assumptions.
- **Worked instances**: ≥20 captured in one session window (Director Seaworthy's `f6eb4f51`
  team-shape broadcast listing two agents as closed-out 64s after both had resumed; Mistbound
  presume-ended broadcasts; multiple post-compaction misreads).
- **Existing substrate**: `.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md`
- **Research angles**: when does snapshot-vs-stream distinction matter most? Cure-shape across
  roles (Director, Marshal, Implementer, Curator). Failure-mode taxonomy. Near
  doctrine-graduation.

### 2. Marshal-seat watcher silent-failure mode

- **Shape**: watcher silently drops events; the affected agent doesn't surface the loss; only
  detected via cross-substrate analysis (napkin captures from peers).
- **Worked instances**: Mistbound missed Twilit's `ef315373` for 95m, Charcoal's `625fb072`
  for 75m, Director's `b2258cf5` for 85m on 2026-05-24. Discovered when Mistbound's
  compaction-4 brief read the prior session's napkin entries.
- **Cure candidates** (proposed in real-time, not yet structurally landed): watcher self-test
  loop, periodic comms-dir count audit, durable `last_heartbeat_at` field on active-claims with
  auto-rebalance.
- **Research angles**: this is a SUBSTRATE-FAILURE-MODE not an agent-failure-mode. How do we
  build observability INTO substrate primitives so they self-report failure? What's the
  taxonomy of substrate-failure-modes vs agent-failure-modes?

### 3. Owner-direction supremacy on OUTCOME not LITERAL form

- **Shape**: owner says "commit everything" / "push" / "pause". Different team-states demand
  different shapes of execution. The right interpretation honors the OUTCOME the owner wants
  (durable substrate in repo) not the LITERAL form (one commit).
- **Worked instances** (one session, same verb, different shapes): "commit everything" →
  3-commit-split for heterogeneous-tree state with in-flight peer cycles, AND single-bundle
  commit-all for cleared-queue state.
- **Research angles**: how do agents distinguish outcome from literal? Failure mode where
  literal-form interpretation forecloses better shapes. Owner-direction-verb taxonomy with
  shape-variation analysis.

### 4. Mid-cycle pause preserving reviewer convergence

- **Shape**: implementer pauses mid-claim after reviewer convergence is captured in
  transcripts. Substrate may be discarded during downstream branch-shift; convergence is
  preserved in transcript IDs cited in closeout broadcasts.
- **Worked instances**: Charcoal Cycle Beta on 2026-05-24 — reviewer convergence (code-expert
  `af7b0338079198b3e` + security-expert `ac025ad946e546bee`) preserved across pause +
  branch-shift + substrate-discard.
- **Research angles**: what's the value-preservation contract across forced-discard boundaries?
  What survives, what doesn't, what should?

### 5. Cross-platform marshal cycle protocol parity

- **Shape**: collaboration substrate (comms events + claims + marshal-request shape) is
  platform-agnostic. Codex peer runs identical DM-ACK-stage-husky-commit cycle as Claude peers.
- **Worked instances**: Estuarine codex marshal-cycle landed at `c697d18b` on 2026-05-24 with
  zero protocol modification.
- **Research angles**: what other protocols exhibit this property? Where would platform-specific
  divergence be inevitable vs avoidable?

### 6. Owner-authz exception architectural-honesty

- **Shape**: when an owner-authorized exception is technically redundant with existing
  structure, the right cure is to action the directed cure AND name the
  redundancy/architectural-truth inline at the change-site — not just in the routing event.
- **Worked instances**: Charcoal's sonar.cpd.exclusions edit on 2026-05-24 (`79c148e4`) — added
  entry that the existing `**/src/types/generated/**` glob already matched; preserved
  architectural truth in the inline policy comment.
- **Research angles**: where does architectural truth live? Change-site as canonical home vs
  distributed across routing events.

### 7. Watcher-as-team-state-shared-memory

- **Shape**: all-channels comms watcher gives post-compaction agents the substrate to
  reconstruct team state without explicit coordination. Watcher-stop happens at session-end;
  new session restarts watcher and replays via seen-file delta.
- **Research angles**: this is "substrate-as-shared-memory with replay semantics". Consistency
  model? When do compaction boundaries break observability? How does it compare to other
  shared-memory primitives in multi-process systems?

### 8. Heartbeat cron + cron-redundancy rule

- **Shape**: 4-min liveness cadence with skip-if-substantive-activity-within-window rule.
  Low-coordination + self-organizing.
- **Research angles**: false-positive/false-negative ratio of the cron-redundancy rule. When
  does it misfire? Is 4 min the right cadence?

### 9. PDR-064 Coordinator Handoff two-moments worked corpus

- **Shape**: pre-positioning (information transfer only) → active-acknowledgement (authority
  transfer). Conflating creates a coordinator-less window.
- **Worked instances**: multiple Director / Marshal transitions across the corpus.
- **Research angles**: how often does Moment 2 NOT happen after Moment 1? Coordinator-less-window
  cost analysis. Variations of the protocol that have emerged across the team.

### 10. 3-commit-split vs single-bundle commit-all

- **Shape**: both are valid responses to "commit everything"; the choice depends on tree-state
  heterogeneity vs owner-direction priority.
- **Research angles**: when does each shape work? Failure mode of choosing wrong? Decision-tree
  codification candidate.

### Meta-theme: the corpus as research substrate

- Each comms event carries structured metadata; aggregate has temporal patterns (silence
  windows, burst patterns, heartbeat cadence), subject clustering (lanes), theme clustering
  (tags).
- Structured-enough for automated pattern mining; rich-enough for qualitative analysis.

## Candidate Themes — second seeding (2026-06-12, Firefly seeks Temper / Director lens)

Captured from the 2026-06-11/12 handover-team arc, which the corpus now holds end to end
(two PDR-063 mid-cycle handovers, a P1 defect arc, Director merge sequencing, completion).
As with the first seeding: these are worked examples of what counts as a pattern, a floor and
never a fence — the owner's standing direction is that the corpus holds surprises not yet
recognised, and the research must protect open discovery from these priors (see the companion
plan's blind cold-read workstream and this record's Resume Contract exception).

### 11. Resumed-session temporal dislocation

- **Shape**: a session frozen mid-action resumes, completes the action on wake, and reports it
  as a past action at the remembered (pre-freeze) timestamp — directing peers to verify against
  an account that authoritative surfaces contradict.
- **Worked instance**: PR #192 "merged ~22:33Z" claim vs GitHub `mergedAt 06:24:45Z`; Director
  behaviour-note event `ac9a06af` carries the four-section capture and cure.
- **Research angles**: temporal sibling of theme 1 (snapshot-vs-stream). What session-state
  classes invalidate at freeze/resume boundaries (clock, branch, cwd, in-flight ledger)? Can
  the cure (re-derive + re-verify on resumed turns) be made structural rather than behavioural?

### 12. Identity era-provenance erasure (the split-brain arc)

- **Shape**: a cache channel records a *derived rendering* (the name) instead of the
  *derivation input* (the schema era); any later schema activation makes one seed render two
  live names, fracturing claim ownership, watcher self-exclusion, and roster-to-registry maps.
- **Worked instances**: Zephyr/Harrier dual rendering 2026-06-11; five tuples stamping
  `naming_schema_version: "override"`; diagnosis + ruling events `10cb3a10`, `46db87d0`;
  cure direction = era pinning (post-ADR-198 follow-on plan).
- **Research angles**: which other substrate fields cache derived values where inputs should be
  pinned? A general derive-at-use-time vs cache-at-mint-time taxonomy for identity-adjacent
  state.

### 13. Corpus growth degrades the live mechanism (reflexive substrate finding)

- **Shape**: the preservation hold that protects the research substrate grows the flat event
  directory until the watcher that depends on it starts dying (drain-step timeouts) — the
  corpus's value-preservation mechanism erodes the team's awareness mechanism.
- **Worked instances**: EIGHT watcher deaths across THREE sessions in one team window —
  Director (60 s + 300 s budgets), Cosmos turns Equinox (3 deaths across 60/180/300 s;
  failure-mode event 06:42:11Z: "raising budgets is not the cure"; deaths correlate with
  heavy parallel gate load), Moss weaves Blossom (2 deaths, corroboration event 06:42:42Z;
  then a third at 06:54:04Z). Between deaths the same directory drained in seconds.
- **Hypothesis revision in-flight (worth studying as a live falsification arc)**: the first
  diagnosis was load-starvation (slow-but-healthy drain killed by a fixed budget). Moss's
  eighth death falsified load-starvation-only: a 540 s budget died at MODERATE load on a
  stable 3,143-event dir — an intermittent BLOCKING wedge in the drain path. Operational
  inversion follows: keep budgets SHORT (fail fast + restart) because a long budget extends
  blindness without saving a wedged drain (behaviour-note event 06:54:04Z).
- **Research angles**: substrate scalability envelopes; what directory/storage shape decouples
  preservation volume from watch latency (joins `comms-watch-storage-redesign`); rotation as
  the structural cure (see §Non-Held Rotation Strategy below).

### 14. Heartbeat cadence under turn starvation

- **Shape**: heartbeat loops emit only when their session is scheduled; overnight turn
  starvation stretched a 4-minute cadence to 20–40+ minutes while sessions remained healthy.
  Observe-side thresholds (10-minute retirement) misread starved-but-fine sessions; the
  heartbeat measures *scheduling*, not *agent intent or health*.
- **Worked instances**: both implementer lanes overnight 2026-06-11→12; Director correctly
  withheld retirement-detection by cross-checking ground truth (PR/git state) first.
- **Research angles**: false-positive analysis for PDR-078 thresholds across operating modes
  (owner-attended vs unattended); should cadence contracts be scheduling-aware?

### 15. PDR-063 mid-cycle handover — first by-the-book worked pair

- **Shape**: freeze record → claim pointer → directed `mid-cycle-handoff` event → heartbeat-end
  → successor reads record end-to-end → pickup broadcast with first-hand state re-verification.
- **Worked instances**: Dusky→Cosmos (record `7fb69812-…`, pickup caught a push that never
  completed) and Zephyr→Moss (record `2a080642-…`, six sections) on 2026-06-11; zero work loss
  across both.
- **Research angles**: which record sections did successors actually consume? Cost of the
  protocol vs the loss it prevented; what the pickup re-verification catches in practice
  (stale push state, stale claims) as a class.

### 16. Cross-lane file collisions cured by merge sequencing

- **Shape**: an accidental broad-add sweep put one lane's artefacts on another lane's branch;
  the cure was Director-serialised merge ordering plus a named per-path resolution rule —
  coordination-by-ordering instead of conflict-resolution-by-reviewer.
- **Worked instance**: snagging plan + cursor-visibility write-up on both branches; ruling
  event `a774bacd` (#190 → #191 → #189, main-authoritative on the two paths).
- **Research angles**: when is ordering cheaper than ownership enforcement? Interaction with
  the pure-diff convention (registry state out of feature branches).

### 17. Declared-vs-actual drift in liveness substrate (stale heartbeat typed-args)

- **Shape**: heartbeat loops armed once at bootstrap keep broadcasting stale claim/cycle state
  after the lane moves on; the liveness stream silently diverges from registry truth.
- **Worked instances**: two stale-args windows on one lane 2026-06-11 (cured in under a minute
  per nudge, events `269714aa` + re-arms); contrast with the same lane's accurate substantive
  reporting.
- **Research angles**: should heartbeat args derive from the registry at emit time instead of
  being baked into the loop? Cheap consistency checks between heartbeat claims and
  `active-claims.json`.

## WS7 Closeout — Conserved Findings (2026-06-14, Whirlwind folding Brazier's loss-scan)

Conserved from Brazier stirs Residue's closeout handoff (which is itself untracked-by-design now —
`handoffs/` is gitignored — so its substance is folded HERE into the tracked record per the standing
curation obligation the untrack relies on; the live-instance lesson is exactly the point).

- **Research finding — the canonical stream under-represents coordination in this operating mode.**
  The canonical comms stream was silent ≈13:38Z→17:37Z (~4h) while the Galleon×Anvil pair did ALL
  harness-build design dialogue on the ArcAngel channel and ran no heartbeat crons (PDR-082 n=2
  owner-visible). A successor reading only the "source of truth" canonical stream would have been blind
  to the entire build. A concrete worked instance of *why* the ArcAngel-tail ⇄ canonical-watcher pairing
  is doctrine, not ceremony (extends theme 7 / liveness-coordination substrate; activation-enthalpy of
  the lightweight channel). Whirlwind hit the sibling at session-open: the quiet canonical stream read as
  "solo" until the process table revealed the live rotating cast — a live theme-1 (snapshot-vs-stream)
  instance, cured by grounding the live state first-hand.
- **What-worked — the 6-agents/day rotation did NOT become a live M2 instance** (M2 = the learning loop
  fails under load, this thread's central finding). What kept the loop firing under exactly that load,
  nameably: (a) by-the-book PDR-063 self-contained handoff records (each cold successor was productive in
  one grounding pass); (b) the constitutive all-channels watcher catching each retirement on arm; (c)
  two-reader cross-attestation across each retirement boundary (the successor verified the predecessor's
  landed work first-hand before folding). Evidence that PDR-063 + paired-watcher + mutual-FH are M2
  mitigations under rotation load (extends theme 15 + the what-worked lens).
- **Grounded knowledge for the next curator pass (the coordination tier).** The remaining work is the
  **1,707 coordination events** past the 7d window: `awaiting curator disposition`, never auto-moved
  (absorption gate — body-read required; 37 are `body-read-required` long-bodied heartbeat-ends).
  Verification recipe for any future `--execute`: pre-count `comms/*.json` + `comms-archive/*.json`; run;
  re-count and assert `count(comms)+count(comms-archive)==pre-move`; `git status` must show ZERO tracked
  diff (both dirs gitignored); spot-check one moved id present-in-archive/absent-in-comms; assert manifest
  row-count==moved-count (the bin's own POST-assert is fail-closed but verify independently). The move is
  **git-independent** (run at any quiet point post-untrack, no commit window); **pause the all-channels
  watcher during the move** (it tails `comms/`; a bulk removal thrashes it — theme-13) then re-arm with a
  gap-sweep. `comms-archive/.gitkeep` is tracked as the dir anchor (the bin's same-fs `rename` needs the
  dir to exist in a fresh clone) — do not remove it.

## Dedicated-Session Profile (research-mode agent)

What kind of agent should do this research?

- **Reflective profile, not execution profile** — disposition to step back, not push forward
- **Pattern-mining capability** — holds many events in working memory; finds connections
- **Boundary-aware** — knows when a pattern is doctrine-grade vs note-grade
- **Substrate-fluent** — understands PDR / ADR / napkin / pending-graduations / thread-record
  taxonomy
- **Capable of producing research outputs** — ADR-class artefacts, PDR-class artefacts, possibly
  new doctrine-class artefacts

## Possible Session Shapes

1. **Corpus survey session** — comprehensive read of comms archive across N days; emit a
   structured pattern taxonomy
2. **Theme-deep-dive session** — take one candidate theme; produce a research artefact with N
   worked instances + cure-shape recommendations
3. **Cross-PDR analysis session** — read all PDRs + comms events that informed each; identify
   which PDRs missed candidate patterns visible in retrospect
4. **Failure-mode taxonomy session** — read all `failure-mode`-tagged events; cluster by class;
   identify cure-shape patterns
5. **Owner-direction interpretation session** — read all owner-direction verbatim quotes in
   comms; analyze how each was interpreted vs how it could have been

## First-Move Discipline (when owner opens this thread for dispatch)

1. Read `.agent/state/collaboration/comms/**` end-to-end (or by date-window if doing
   theme-deep-dive); the comms event schema is at
   `.agent/state/collaboration/comms-event.schema.json` (a three-way `oneOf`:
   `narrative` / `directed` / `lifecycle` — partition by shape before aggregating). An agent
   executing the companion plan defers the Candidate Themes sections per the Resume Contract
   exception and the plan's WS1.
2. Cross-reference against existing PDRs / ADRs in `.agent/practice-core/decision-records/` and
   `docs/architecture/architectural-decisions/`.
3. Choose session shape from the menu above (or define a new one if a fresh angle surfaces).
4. Produce research output as PDR-class or ADR-class artefact (NOT a napkin note — research
   warrants permanent substrate).
5. Update this thread record with what was processed + what remains.

## Non-Held Rotation Strategy (to determine)

The current corpus state is **held**: the Preservation Boundary keeps every event intact for
research. That hold is bounded — once the research processing the companion plan defines has
absorbed the corpus's signal, the steady state needs a **non-held rotation strategy**: the
standing mechanism by which comms events flow from the live directory into durable homes and
out of existence, so the live directory stays small enough for the watcher while no
unprocessed signal is ever lost. This section frames the determination; the companion plan's
rotation workstream produces the ratification-ready proposal; **the owner ratifies the
strategy before any deletion executes**.

Invariants any candidate strategy must satisfy:

1. **No unprocessed signal is deleted.** Absorption (consolidation into napkin / distilled /
   patterns / PDR / ADR homes, or recorded item-level disposition) precedes removal — the
   owner's 2026-05-27 clarification, mechanised.
2. **Untracked events are committed or absorbed before deletion** (git-heterogeneity fact
   above; deletion of an untracked event is unrecoverable).
3. **Provenance survives rotation.** Identity tuples, `in_response_to` chains, and event ids
   cited in permanent docs must remain resolvable (or the citations updated) after rotation.
4. **The live directory has a bounded working set** sized to watcher drain health, not to a
   round number.
5. **Heartbeat events are a distinct class.** Highest volume, lowest per-event research value
   once aggregate cadence statistics are extracted; candidate for the shortest retention.

Candidate shapes to evaluate (not mutually exclusive; evidence from the research pass decides):

- **Absorb-then-delete on consolidation cadence** — comms-log-care (PDR-080 signal-driven
  absorption) extended with a deletion step after recorded disposition.
- **Date-window archival** — rotate events older than N days into a committed archive
  directory outside the watcher's drain path; delete only after research processing.
- **Class-tiered retention** — heartbeats aggregated-then-deleted on a short window;
  `failure-mode` / `behaviour-note` events retained until graduated; coordination narrative
  retained until thread closure.
- **Storage-shape change** — if `comms-watch-storage-redesign` lands a watermark/segment-store
  shape, rotation may become a storage concern rather than a directory-hygiene concern.

Open questions the determination must answer: who runs rotation (curator lane vs Director vs
hook); on what trigger (size, age, session close, consolidation); where archives live; how
PDR-080's bin-counter interacts; and what the ratified artefact is (PDR for the portable
contract + ADR for the repo phenotype is the default shape).

## Related Plans and Decision Records

The comms/coordination plan cluster is indexed at
[`agent-tooling/future/README.md` §Comms / coordination cluster](../../plans/agent-tooling/future/README.md#comms--coordination-cluster);
disposition of overlapping plans routes through the rightsizing keystone's M4, not per-plan.
Relevance to this research thread:

- [`comms-corpus-research-and-rotation-strategy.plan.md`](../../plans/agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md)
  — **the companion executable plan** (created 2026-06-12 under owner direction); dispatch
  vehicle for this record's research vector.
- [`collaboration-substrate-coordination-rightsizing.plan.md`](../../plans/agent-tooling/future/collaboration-substrate-coordination-rightsizing.plan.md)
  — cluster keystone; this research's mechanism findings feed its M4 cull/fold list, and its
  minimal-substrate re-derivation consumes the failure-mode taxonomy.
- [`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md)
  — owns cost-per-coordination-event; corpus-derived overhead/substance ratios are direct
  evidence for its P-ordered workstreams.
- [`comms-watch-storage-redesign.plan.md`](../../plans/agent-tooling/current/comms-watch-storage-redesign.plan.md)
  — watcher storage shape; theme 13 (corpus growth degrades drain) is its motivating evidence
  and the rotation strategy must compose with whatever it lands.
- [`pdr-080-comms-log-care-phenotype.plan.md`](../../plans/agent-tooling/current/pdr-080-comms-log-care-phenotype.plan.md)
  — signal-driven absorption phenotype; the rotation strategy's absorption precondition builds
  on it.
- [`n-agent-collaboration-experiments.plan.md`](../../plans/agent-tooling/current/n-agent-collaboration-experiments.plan.md)
  — hypothesis-validation during real work; corpus analysis can confirm/refute the same
  primitives retrospectively at scale.
- [`comms-event-write-integrity.plan.md`](../../plans/agent-tooling/current/comms-event-write-integrity.plan.md)
  — write-path integrity; rotation must not introduce new partial-write windows.
- [`comms-watch-liveness-floor.plan.md`](../../plans/agent-tooling/future/comms-watch-liveness-floor.plan.md)
  and
  [`claim-liveness-crash-reconciliation-and-session-forensics.plan.md`](../../plans/agent-tooling/future/claim-liveness-crash-reconciliation-and-session-forensics.plan.md)
  — liveness/forensics consumers of themes 14 and 17.
- Decision records: PDR-066 (comms events as failure-mode channel), PDR-078 (liveness
  contract), PDR-063 / ADR-182 (mid-cycle handoff), PDR-064 (coordinator two moments),
  PDR-080 (signal-driven absorption), ADR-183 (tag namespace), ADR-186 (heartbeat substrate).

## Opportunities Surfaced (2026-06-12 deep-dive)

- **Automated pre-pass before agent reading.** Event metadata supports cheap scripted
  clustering (counts by kind/tag/author/day; burst and silence windows; `in_response_to`
  chain extraction) so expensive qualitative reading is targeted, not exhaustive. No new
  machinery needed — `jq`/`node` one-liners recorded in the companion plan suffice.
- **Tag-adoption analytics.** Measure how often `failure-mode` / `behaviour-note` tags are
  used vs prose-only captures — direct falsifiability evidence for PDR-066's channel design.
- **Cross-substrate provenance joins.** Comms events ↔ napkin archive windows ↔
  closed-claims archive ↔ git commits (SHA-prefix discipline) form a joinable provenance
  graph; several themes (2, 13, 15) are only visible across the join.
- **Arc-level analysis.** The corpus now contains complete team arcs with known outcomes;
  analysing arcs (not just events) lets cure-shapes be scored against what actually happened
  next — e.g. the 2026-06-11/12 handover arc validates PDR-063 end to end.
- **Research-feeds-mechanism loop.** Each taxonomy output has a named consumer plan (cluster
  table above), so findings land as routed recommendations rather than orphaned reports.

## What this thread is NOT

- Not a plan (no implementation roadmap — that is the companion plan's job)
- Not a decision (no architectural commitment)
- Not autonomously dispatchable (dispatch routes through the companion plan once
  owner-ratified)
- Not source of doctrine until research outputs ratify (the corpus is signal, not yet
  pattern-extracted at scale)

## Participating Agent Identities

| Agent Name | Platform | Model | session_id_prefix | first_session | last_session | role |
|---|---|---|---|---|---|---|
| Charcoal Brazing Kiln | claude | claude-opus-4-7 | 7c7327 | 2026-05-24 | 2026-05-24 | thread-record-author-post-m1-merge |
| Solar Illuminating Dawn | codex | GPT-5 | 019e6a | 2026-05-27 | 2026-05-27 | state-file-lifecycle-boundary-clarification |
| Twilit Orbiting Satellite | claude | claude-opus-4-8 | 263042 | 2026-05-29 | 2026-05-29 | routing-legacy-fallback-sunset execution (Leafy claim `14b484d6` pickup) |
| Firefly seeks Temper | claude | Fable 5 | ce44ae | 2026-06-12 | 2026-06-12 | record deep-dive + second theme seeding + rotation-strategy framing + companion-plan creation (owner-directed, Director seat) |
| Fern lifts Mulch | claude-code | Fable 5 | 66f12b | 2026-06-12 | 2026-06-12 | planning session (owner-reshaped from research dispatch; claim 63d80264): WS6 synthesis-report + owner-gated WS7 end-state amendments, experiments/ preservation commit, continuation surfaces made execution-ready; blind-pass discipline honoured — Candidate Themes sections unread |
| Katydid hunts Roost | claude-code | Fable 5 | a4314f | 2026-06-12 | 2026-06-12 | research session (claim 8910ee5f): WS0 grounding + corpus facts re-derived (5,003 events, 2026-05-20→06-12, zero lifecycle-kind); successor-seat WS1 contamination disclosed (events 37523113/8cefbe36) and owner-cured — WS1 cold read delegated to multiple fresh-context Fable 5 blind readers; entry-point fence banner added |
| Geyser stirs Bronze | claude-code | Opus 4.8 | 3636b0 | 2026-06-13 | 2026-06-13 | forward lane (Myrtle PDR-063 handoff; claims eb88ee15→6603978f): B/D/M2 FH-verification, ~37 REVIEW disposition (0 new spine class), SC1 live-test sharpening, PR convergence with Flame; stood down on owner-directed consolidation to Kayak |
| Kayak herds Ballast | claude-code | Opus 4.8 | 328eee | 2026-06-13 | 2026-06-13 | successor + consolidated lane owner (claim b76045bb): critical re-assessment of WS0–WS3; crash-safety flush (full corpus committed+pushed); WS4 liveness/coordination/emergent fan-out + 18-anchor verification; corrections (S9-cured, SC1-sharpened, T7 5→4, swap-finding retracted); mutual-FH loop with Geyser; PR #207 post-merge faithfulness review; WS5/WS6 owner-sequenced-separately |
| Bluebell mends Mulch | claude-code | Opus 4.8 | c2ef19 | 2026-06-13 | 2026-06-13 | successor + sole lane owner (claim `agent-collaboration-research`): closed Kayak's §11 re-verify list first-hand (H1/L1/CC1/CC3/T5/S7-3-6s promoted PENDING-FH→FH; SC8 21→66, SC9 ~167→~181 + 7.0% miss, SC1 framing); authored WS5 rotation-strategy proposal (two-round adversarial review — invariant-3 resolvability cured via inline-quote-first + tracked cited-events digest + pre-archive-move guard; SC3 bulk-classification hole closed; invariant-4 honestly restated); authored WS6 synthesis; reconciled plan-todo drift; put WS5 to owner for ratification |
| Juno mends Plasma | claude-code | Opus 4.8 | 3cc9d5 | 2026-06-13 | 2026-06-13 | dedicated consolidation session (sole-contributor; WS5 ratified "as proposed"): authored PDR-094 (portable rotation contract) + ADR-199 (repo phenotype, inline-quote provenance for cited events) + both indexes; routed M2 + SC1 into rightsizing keystone M4 (reconcile-not-mint; first-hand-corrected the WS6 §5 SC1→write-integrity mis-route); routed the §5 recommendations to six consumer plans; buffered the two-reader mutual-FH-loop finding as PDR-089 evidence; satisfied WS7 steps 1–2; left WS7 code migration owner-gated + statusline-lane-coordination-gated |
| Cassiopeia holds Stillness | claude-code | Opus 4.8 | d6f04a | 2026-06-13 | 2026-06-13 | reconcile session (claim 40e003fe, closed): opened PR #208; reconciled origin/main into feat/comms-research as a careful best-of-both merge (70080844d, landed+pushed, gate-green) — restored main's clock-skew ARC guard + #206 two-line layout onto the branch's resolver, kept the fixed peer/solo glyphs; caught + removed a gate-surfaced resurrected superseded test (cli-claim-role.integration.test.ts); coordinated the (b) ArcAngel wing-fix to the WS7 owner; retired with a clean handoff (handoffs/d6f04a-comms-research-reconcile-handoff-to-rosemary.md) to successor Rosemary lifts Undergrowth |
| Clipper wakes Atoll | claude-code | Opus 4.8 | de1f79 | 2026-06-14 | 2026-06-14 | WS7 successor (PDR-063 handoff from Whippoorwill, record `handoffs/adc96c-ws7-comms-rotation-handoff-to-clipper.md`; claim 3b56cb4d). Landed owner-directed #7 comms-doc cures (`92bf05764`: ArcAngel home-fix experiments/→rapid-comms + watcher-pairing invariant in start-right-team + comms-all-channels-watcher + the full-display-name filename convention & roster-accretion wing-detection limitation; docs-adr-expert + onboarding-expert reviewed). Verified WS7 Phase-1 landed (`6d1e45f35`). Authored the deep WS7 definition-of-done + the **repo/instance content-tiering boundary principle** + the **atomic-propagation hard gate** (owner, 2026-06-14): untracking `.agent/state/` orphans comms-log knowledge unless curation is wired into the lifecycle skills, and the protocol change MUST land atomically across PDR-094 + ADR-199 + session-handoff + consolidate-docs + the Phase-3 README. Captured to `distilled.md` + `pending-graduations.md` (status DUE before WS7 Phase 3). NOTE: the full WS7 deep DoD lives only in the machine-local contract `~/.claude/plans/ah-very-good-in-quizzical-whisper.md` — route its substance into this companion plan before it is instance-tier-orphaned (a live worked instance of the boundary principle). |
| Gull spins Stratus | claude-code | Opus 4.8 | 9cf32d | 2026-06-14 | 2026-06-14 | WS7 execution-opener + successor-to-Clipper (PDR-063, record `handoffs/9cf32d-ws7-comms-rotation-handoff-to-serval-mends-murmur.md`; claim `907ff814` retained for successor **Serval mends Murmur**). Landed+pushed (`e203791ad`): de-orphaned the deep WS7 DoD into the companion plan §"WS7 Execution Contract" (now the authoritative spec); repointed the Phase-1 manifest carryover (`schema_or_parser` ×4 + `fixture_roots` + `comms-events/`→`comms/`). Landed+pushed (`9175acfeb`, test-expert sound, 10/10): Phase-2 provenance **pure core** (`cited-event-provenance.ts` — bounded-8-hex token extraction + `cited∩candidate−covered`). Retention windows owner-confirmed = DoD defaults. Three-instance metacognition (failure-mode event `aa238582`): cured to one lesson — ground the situational fact before applying a frame that presupposes it; the comms watcher is constitutive of a `start-right-team` session, never a value-judgment to skip. Handed the Phase-2-remainder → Phase-4 body to Serval mends Murmur (owner-directed, deep budget). |
| Serval mends Murmur | claude-code | Opus 4.8 | 3e2619 | 2026-06-14 | 2026-06-14 | WS7 successor-to-Gull (PDR-063, claim `a67817ae`, RETAINED for successor **Galleon calls Surf**, record `handoffs/3e2619-ws7-comms-rotation-handoff-to-galleon-calls-surf.md`). Landed+pushed (`3a55b62e0`): Phase-2 Task-1 provenance IO/scan layer (`provenance-scan.ts` Result-native orchestrator + injectable seam; `provenance-scan-node.ts` the one node:fs boundary; `comms-provenance-check` bin = ADR-199's "script in the curator pass") + the `.agent/reference/comms-cited-events.md` digest (12 cited events; fail-closed; 25 tests) on Gull's pure core. Landed+pushed (`e36af1db0`): owner-directed `@oaknational/no-throw-statement` ESLint rule at `warn` front-loading the Result standard agent-tools was missing (owner: throw-convention was an oversight; full gate green, 211 throws surfaced 0 errors). Adversarial sweep found + fixed a provenance scan-scope hole — governance docs (rules/directives) per PDR-094 Inv-3, missed by ADR-199 §4 (amended in Phase 3); broaden-to-reports resolved NO. agent-tools now depends on @oaknational/result. Throw→Result retrofit + rule `warn`→`error` promotion deferred to `architecture-and-infrastructure/future/throw-to-result-migration.plan.md`. |
| Galleon calls Surf | claude | Opus 4.8 | 314d41 | 2026-06-14 | 2026-06-14 | WS7 successor-to-Serval (PDR-063; driver + gatekeeper; claim `21132e1a` retained→superseded by Whirlwind's `7792944a`; record `handoffs/314d41-ws7-comms-rotation-handoff-to-whirlwind-rides-ridge.md`). Paired with Anvil spins Bronze (archive lane) across canonical comms + the WS7 ArcAngel channel. Reviewed (code-expert/type-expert/test-expert/wilma + first-hand) + gatekeeper-committed+pushed the WS7 archive-move harness: 2b heartbeat-cadence aggregate + slices 1-3 (`815fc2f48`) + slice-4 execute mechanism (`3b02ae3ef`) — caught the bare-`JSON.parse` crash-window that would have bricked the execute path. Decided untrack-FIRST on-channel with Anvil; authored ADR-199 amendments (order-swap + governance-doc scan-scope, uncommitted for atomic Phase-3 #13); created the 21-task WS7 todo list. Retired owner-directed → Whirlwind rides Ridge. |
| Anvil spins Bronze | claude-code | Opus 4.8 | 9cd858 | 2026-06-14 | 2026-06-14 | WS7 ARCHIVE lane (paired with Galleon driver; claim `79d47b7f` retained→Brazier stirs Residue, record `handoffs/9cd858-ws7-archive-move-handoff-to-brazier-stirs-residue.md`). Built the class-tiered archive-move harness slices 1-4 (classify→provenance-gate→plan→execute; Result-native, fail-closed, crash-resumable per-event manifest) under Galleon's multi-lens review; landed the slice-4 crash-resilience fix (pure `manifest.ts` parser). Retired owner-directed → Brazier stirs Residue. |
| Brazier stirs Residue | claude | Opus 4.8 | 1f7d72 | 2026-06-14 | 2026-06-14 | WS7 archive-move/execute successor (PDR-063 from Anvil spins Bronze, claim `79d47b7f`→`c6ba82c8`). Ran the Phase-2 archive-move `--execute` after Whirlwind's Phase-3 untrack (`255117a43`): 2390 heartbeats rotated `comms/`→`comms-archive/`, byte-preservation balanced (2959+2390==5349), 0 violations, 0 git diff; verified first-hand. Harness was complete+green at pickup (Anvil's build). Owner-directed full closeout (metacognition + step-6e.2 adversarial loss-scan, 5 items routed) → handoff to Whirlwind; claim relinquished at clean closeout. |
| Whirlwind rides Ridge | claude | Opus 4.8 | 52e1cb | 2026-06-14 | 2026-06-14 | WS7 DRIVER successor-to-Galleon + repo-wide closeout owner (PDR-063; claim `7792944a` supersedes Galleon's `21132e1a`). Drove WS7 to completion: **Phase 3 atomic untrack** (`255117a43` — `.agent/state/collaboration/` coordination tier untracked-by-design + standing-curation obligation propagated atomically across ADR-199/PDR-094/both lifecycle SKILLs/README, experiments relocated, selective keep-tracked boundary; reviewed docs-adr + architecture-fred); coordinated Brazier's archive-move RUN; **Phase 4 — #208 MERGED to main** (`a6b14a8a3`) after a release-readiness pass caught + I fixed the untrack's downstream CI blocker (`validate-collaboration-state` ENOENT on absent untracked surfaces — `356e76f59` + `7da12a82f`, TDD). Opened the Whirlwind×Brazier ArcAngel pair channel (owner-directed). Folded Brazier's closeout + this thread's WS7 completion. |

## 2026-05-29 — execution work touched this thread via a claim (not research)

The owner-gated research vector above remains untouched and undispatched. This
thread was *touched* only because Leafy Regrowing Petal filed the
routing-legacy-fallback-sunset claim (`14b484d6`) against it, and Twilit
Orbiting Satellite picked that claim up and completed the sunset on 2026-05-29
(commits `d9225d5b` + `d1525f55`; claim closed in the archive). That work is
**collaboration-substrate implementation**, not comms-corpus research — its
home is the agent-tooling plan cluster
([`future/README.md` §Comms / coordination cluster](../../plans/agent-tooling/future/README.md#comms--coordination-cluster)),
keystoned by the
[`collaboration-substrate-coordination-rightsizing`](../../plans/agent-tooling/future/collaboration-substrate-coordination-rightsizing.plan.md)
brief. Recorded here only for identity-row honesty; the research buffer's
dispatch contract is unchanged.

## Cross-References

- Comms archive: `.agent/state/collaboration/comms/` (5+ days of accumulated multi-agent events)
- ADR archive: `docs/architecture/architectural-decisions/` (substrate-phenotype decisions)
- PDR archive: `.agent/practice-core/decision-records/` (practice-doctrine decisions)
- Napkin captures: `.agent/memory/active/napkin.md` + archived windows under `archive/`
- Existing pattern files: `.agent/memory/active/patterns/`
- Pending-graduations register: `.agent/memory/operational/pending-graduations.md` (research-
  vector entry buffer)
- Heartbeat contract: `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0.5
- Comms-event tag namespace (ADR-183): includes `failure-mode`, `behaviour-note`, `heartbeat`
  for filterable corpus access

## Resume Contract

Owner directs resume. No autonomous dispatch. When dispatched, the receiving agent reads this
record end-to-end before any analysis pass — **with one deliberate exception**: an agent
executing the companion plan's open-discovery cold read (WS1) defers BOTH Candidate Themes
sections until its surprises log is recorded, so the seeded catalogue cannot anchor the cold
read. The catalogue is a floor for what counts as a pattern, never a fence around what may be
found; surprises outrank seeded-theme confirmation.

## Dispatch refinement (owner, 2026-06-12 evening)

The session runs as one half of a two-member team (the other lane: enhanced
statusline work). Scope re-affirmed as research and reporting only — zero or
minimal implementation. The goal is understanding and discovery, and
explicitly: **to make it safe to remove, and stop git-tracking, the
`.agent/state/` files.** The individual-scoped precedent landed 2026-06-12:
`.agent/state/onboarding/` is already gitignored (uniform classification —
individual-scoped state is untracked by design); this research owns the
repo-scoped remainder.
