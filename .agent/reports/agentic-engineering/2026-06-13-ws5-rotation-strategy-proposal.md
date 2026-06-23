# WS5 — Non-held comms rotation strategy (ratification-ready proposal)

**Author:** Bluebell mends Mulch (claude-code / Opus 4.8 / `c2ef19`), comms-corpus research lane.
**Date:** 2026-06-13. **Workstream:** WS5 of `comms-corpus-research-and-rotation-strategy.plan.md`.
**Status:** proposal put to the owner as a decision. **No deletion or movement executes in WS5** —
this names the decision; the owner makes it; WS7 executes the ratified shape.

This proposal evaluates the thread record's candidate rotation shapes against the WS1–WS4 evidence and
the five invariants, and proposes a single mechanism. It is structured as the **portable contract**
(PDR-class — the rules any repo would keep) followed by the **repo phenotype outline** (ADR-class —
the concrete paths and procedure for this repo).

## 1. The decision being put to the owner

> **Adopt a class-tiered, age-triggered, archive-not-delete rotation of the comms event stream,
> run as a curator-lane pass on a consolidation / session-close cadence, with absorption recorded
> before any event leaves the live directory — and ratify it as a PDR (portable contract) plus an
> ADR (repo phenotype).**

Everything below substantiates that one sentence and surfaces the sub-choices the owner may want to
steer (retention window, archive location, who triggers).

## 2. What the evidence actually licenses (and what it does not)

The rotation strategy must be honest about its own motivating evidence — this research's strongest
discipline was catching convenient claims.

- **The watcher does wedge and die** (S1 stall, S2 drain-death) — FH-confirmed instances.
- **BUT the "corpus size kills the watcher" link is a HYPOTHESIS, not corpus-proven.** The WS3 refuter
  correction on S2 is explicit: *"corpus-growth wedge — HYPOTHESIS ONLY; zero events attribute a death
  to corpus size independent of load."* The dramatic swap→0 evidence that once supported it was
  **RETRACTED** (reboot-confounded — `kern.boottime`). The evidenced drain-death mechanisms are
  load-starvation and intermittent fs-contention blocking stalls.
- **Therefore rotation is justified as hygiene and as the owner's stated operational goal (shrink the
  live directory), NOT as a proven cure for watcher health.** The proven cure path for drain health is
  the watcher hardening (S1 cure: interval polling, fail-loud) and the `comms-watch-storage-redesign`
  (watermark / segment store). Rotation *composes with* those; it does not replace them. A proposal
  that sold rotation as "this fixes the watcher" would repeat the exact convenient-claim failure mode
  this corpus documents.
- **Heartbeats are ~50% of the corpus** and are the **lowest per-event research value once aggregate
  cadence statistics are extracted** — the value is in the aggregate, not the individual beat. The
  heartbeat family at corpus close (5,188 events, 2026-06-13) is 2,399 `heartbeat`-tagged + 181 untagged
  `Heartbeat:` emissions + 35 untagged `Heartbeat-end:` closeouts ≈ 2,615 events (50.4%). This is the
  single strongest, best-evidenced argument for class-tiering, and it is what makes rotation worthwhile
  regardless of the watcher question: ~half the live directory is low-value once summarised.
- **The research-precious class is `failure-mode`-tagged (41) plus the genuine-signal subset of
  `behaviour-note`-tagged events** — NOT all of them. At corpus close there are 305 behaviour-note
  events, but the WS3 disposition ledger establishes first-hand that the bulk are routine
  team-starts / closeouts / curator-pass / marshal-landing records (coordination-narrative tier, not
  research-precious). The tagged failure population is a **lower bound** (untagged failures-in-prose
  exist). The research-precious subset gets the longest retention and an absorb-before-archive gate.
- **Event→event threading is dead** (SC1: `in_response_to` = 0 corpus-wide; only 115 of ~1,842 full-UUID
  body tokens resolve to events — Geyser re-derivation at 5,150 events, 2026-06-13T08:42Z; the WS2
  survey's ~1,812 at an earlier snapshot is consistent). So invariant 3's "preserve `in_response_to`
  chains" is moot — there are none. Provenance to preserve = **event ids cited in permanent docs**
  (ADRs / PDRs / patterns) and identity tuples; see §4.1 invariant 3 for how those stay resolvable in a
  clean checkout, which the raw archive alone does NOT guarantee.

## 3. Candidate shapes evaluated (thread record §Non-Held Rotation Strategy)

| Candidate | Verdict | Why |
| --- | --- | --- |
| Absorb-then-delete on consolidation cadence | **Adopt the cadence + absorption; replace "delete" with "archive-move"** | Owner direction 2026-06-13: archive not delete while Fable is unavailable, to preserve later-research. Archive-move makes the step reversible, which dissolves invariant 2's unrecoverable-loss risk. |
| Date-window archival | **Adopt as the primary trigger** | Age is the only honest primary trigger — the size→health link is unproven, so a size trigger would encode a hypothesis as a mechanism. Owner default window: 7 days. |
| Class-tiered retention | **Adopt** | The evidence argues for it strongly (heartbeats ~50%, lowest value; failure-mode/behaviour-note precious). Owner permits class-tiering where evidence argues it. |
| Storage-shape change | **Compose with, do not block on** | If `comms-watch-storage-redesign` lands a watermark/segment store, rotation becomes segment retirement. The proposal is shippable today as directory-level archive-move and maps cleanly onto segments later. |

The candidates are **not mutually exclusive**; the proposed mechanism is age-trigger + class-tiers +
archive-move on the consolidation cadence, with the storage-shape composition stated.

## 4. Portable contract (PDR-class)

These are the rules any repo running a multi-agent comms stream would keep. They are deliberately
free of repo paths.

### 4.1 The five invariants and how this mechanism satisfies each

1. **No unprocessed signal is deleted.** Nothing leaves the live directory until its signal is
   absorbed into a durable home **or** an item-level disposition is recorded. (Strengthened below: with
   archive-move, "leaves the live directory" never means "lost".)
2. **No unrecoverable loss.** Satisfied structurally by **archive-move, not delete** — the raw event
   bytes are retained on disk in the archive. The original git-heterogeneity hazard (deleting an
   untracked event is unrecoverable) is dissolved: the move does not destroy. Absorption is now about
   *research-signal capture* (so future readers know what the archive holds), not loss-prevention.
   **Standing constraint (the held corpus is safe; future events are not automatically):** archive-move
   to an untracked directory is loss-safe only for events already git-tracked. The held corpus is fully
   committed (`567bf0f1a`, 2026-06-13). For steady-state operation, future untracked events must be
   committed to git before archive-move, **or** the archive directory must itself be made recoverable
   (periodic backup), since an untracked archive is not protected against an accidental `rm` or disk
   loss.
3. **Provenance survives rotation — inline-quote-first, tracked digest as fallback, guarded.** The raw
   archive is gitignored and untracked (owner direction), so an ADR/PDR that cites an 8-hex event id
   would dangle in any clean checkout if the citation depended on the archive. Only event ids actually
   cited in permanent docs need to remain resolvable, and the mechanism has three parts:
   - **Inline-quote-first (preferred default for evidence anchors).** A permanent-doc citation should
     carry a verbatim body excerpt sufficient to verify the claim it anchors, co-located with the
     claim. This is self-contained, needs no separate file, and is the robust common case.
   - **Tracked cited-events digest (fallback for long bodies / multi-doc citations)** at the concrete
     tracked path **`.agent/reference/comms-cited-events.md`** (tracked, non-gitignored, outside
     `.agent/state/`), capturing per cited event its id, author tuple, `created_at`, and the excerpt.
   - **A mandatory pre-archive-move provenance check** in the rotation procedure (a simple script, not
     a new hook or coordination CLI — part of the rotation mechanism itself): scan all permanent docs
     (ADRs / PDRs / patterns) for 8-hex event-id tokens; for each, require an inline excerpt or a digest
     entry; **refuse to archive-move any event whose id appears in a permanent doc without coverage.**
     This converts the discipline from prose-only to enforced exactly at the moment it is hardest to
     trust.

   **Identity tuples** (the third provenance element the thread record names): the cited-events digest
   and inline excerpts preserve the author tuple for every *cited* event; uncited events' tuples remain
   in the untracked manifest (navigable on disk). Identity-tuple resolvability in a clean checkout is
   therefore scoped to cited events — the same boundary as event-id provenance, deliberately. The
   untracked archive + manifest remain the *full* navigable record on disk for later research.
   (`in_response_to` chains: none exist — SC1, so nothing to preserve there.) This satisfies invariant
   3's "remain resolvable" for the only citations that matter without tracking the whole corpus.
4. **The live directory has a bounded working set — spirit satisfied, letter pending evidence.** The
   bound is set as a hygiene target (a round-number age window) because the quantitative
   size→drain-health link is **unproven** (S2 refuter; the swap evidence was retracted). This satisfies
   the *spirit* of invariant 4 — the directory does not grow unboundedly — but NOT its *letter* as
   written in the thread record ("sized to watcher drain health, not to a round number"): 7 d / 48 h are
   owner-default round numbers, not drain-health-derived. The bound must be revisited against a
   controlled watcher-RSS × dir-size measurement (the open item carried from Kayak's handoff) before it
   can be claimed evidence-based. Heartbeat removal alone roughly halves the working set regardless.
5. **Heartbeat events are a distinct, shortest-retention class.** Aggregate cadence statistics are
   extracted once into a durable artefact; the raw beats then archive-move on the shortest window.

### 4.2 Class tiers (retention by research value, not by volume alone)

| Tier | Events | Retention before archive-move | Absorption gate |
| --- | --- | --- | --- |
| Heartbeat | `heartbeat`-tagged + untagged `Heartbeat:` emissions + untagged `Heartbeat-end:` closeouts | Shortest (proposed 48 h, owner-tunable) | Aggregate cadence stats extracted once to a durable artefact. Body-content is well-characterised by tag+title, so bulk archive is safe here. |
| Diagnostic / test / noise | SC3 / SC6 class (test probes, "delete me" bodies) | Immediate-eligible | A one-line quarantine note — **but a body read first** (see SC3 below): a test-titled event may carry real signal. |
| Coordination narrative + directed | team-starts, closeouts, rulings, handoffs, status | Retention window (owner default 7 d) | Per the operative gate in §4.3 — routine classification is allowed but only behind the body-sample safeguard, never on title genre alone. |
| Research-precious | `failure-mode`-tagged (41) + the genuine-signal subset of `behaviour-note`-tagged (per the WS3 disposition ledger; the routine bulk routes to the coordination tier above) | Until graduated (PDR-080 absorption) | Absorbed into napkin / distilled / pattern / PDR / ADR home **before** archive-move |

### 4.3 Absorption precondition (builds on PDR-080)

PDR-080 (signal-driven absorption / comms-log-care) is the absorption engine; rotation adds the
**archive-move step after recorded disposition**. This is the **single operative absorption gate** for
the whole proposal (it supersedes the looser phrasings elsewhere): *rotation never archive-moves an
event whose disposition is not recorded, where a recorded disposition is one of — (a) absorbed into a
durable home, (b) classified routine, or (c) quarantined.* The PDR-080 bin-counter signals when a class
has accumulated enough to warrant an absorption pass. The two compose: PDR-080 absorbs; rotation
archives the absorbed.

**The bulk-classification safeguard (closes the SC3 hole).** Routine classification (branch b) and
quarantine (branch c) may be applied in bulk to a candidate set, but **title genre alone is never
sufficient** — every bulk pass must include a body read of a sample plus every event whose body length
exceeds a routine threshold, before any of the set is archive-moved. The standing falsifier is SC3
event `3cc1fb93`: titled "reproducer-test…" but its body is a real load-bearing three-way
session-split proposal carrying a live claim id. A title-genre sweep would have archived it as noise
with its signal unabsorbed. Any rotation pass that cannot show a body check on its bulk-classified set
has not satisfied invariant 1, regardless of how confident the title genre looked.

### 4.4 Activation-enthalpy framing (the ArcAngel input)

The steady state is not only "rotate the heavy stream faster" — it is **"which substrate for which
coordination shape."** The ArcAngel channel (one append-only file, `tail -F`, zero ceremony) handled
n=3 coordination at ~4-min proposal→confirm versus 10–15 min on the event stream (`86e94e54`).
Lowering the activation enthalpy of a lightweight ephemeral channel reduces how many low-value events
hit the heavy auditable stream in the first place — rotation by *prevention* as well as by *removal*.
This is a steering recommendation, not a mandate, and routes to the rightsizing keystone.

## 5. Repo phenotype outline (ADR-class)

The concrete shape for this repository. This is an **outline for the ADR**, not the executed change
(WS7 executes on ratification).

- **Trigger / who runs it:** a **curator-lane pass** (PDR-081 curator owns substrate-care), invoked on
  the consolidation / session-close cadence — a deterministic, owner-or-agent-initiated procedure, not
  an autonomous hook or daemon. This respects the plan's "no new coordination machinery" non-goal and
  keeps the owner-ratifies-before-execution gate intact. (Rejected alternatives: a hook risks moving
  events mid-research and adds machinery; a Director-only duty over-centralises a hygiene task.)
- **Owner role (after ratification):** ratify the strategy once; steer the §7 sub-choices at
  ratification time; optionally trigger individual rotation passes alongside the curator. **No per-pass
  owner approval is required once ratified** — the curator runs passes on cadence within the ratified
  contract.
- **Schemas + fixtures relocation (WS7 step a):** accept the plan's default — the five `*.schema.json`
  files (`active-claims`, `closed-claims`, `comms-event`, `conversation`, `escalation`, consumed by six
  agent-tools source modules) and the `fixtures/` tree relocate **into the agent-tools workspace** with
  consumers updated and gates green. The research surfaced no evidence for a different home, so the
  default stands; this is the position the ADR should record.
- **Archive home:** an untracked, gitignored directory off the watcher's live drain path — proposed
  `.agent/state/collaboration/comms-archive/` with the watcher configured to scan only `comms/` (an
  existing `--comms-dir` CLI parameter, not new machinery). Since WS7 makes all of `.agent/state/`
  untracked-by-design (the **tracked `README.md` anchor for `.agent/state/` remains in git**, per WS7
  step c and End goal #3), the archive is retained on disk but never tracked; the bytes survive, the
  watcher never reads them.
- **Manifest (untracked, full record):** `comms-archive/manifest.jsonl` — one row per archived event
  (`event_id`, `created_at`, `kind`, `tags`, `archived_at`, `disposition`) so the archive is navigable
  on disk without re-reading every file.
- **Provenance survivor (git-tracked):** resolvability of permanent-doc citations does NOT rest on the
  untracked manifest. Inline-quote excerpts are the preferred default; the fallback is a git-tracked
  digest at **`.agent/reference/comms-cited-events.md`** (concrete, tracked, outside `.agent/state/`).
  A **pre-archive-move provenance check** (a simple script in the curator pass) refuses to archive-move
  any event whose 8-hex id appears in an ADR / PDR / pattern without inline or digest coverage (§4.1
  invariant 3).
- **WS7 step ordering constraint (closes the report→ADR scope gap):** WS7 must run in this order — (1)
  author the rotation ADR (bringing the proposal's event citations, e.g. `86e94e54`, `3cc1fb93`, into a
  permanent doc); (2) populate inline excerpts / the digest for every event id appearing in the new
  ADR; (3) run the pre-archive-move provenance check; **only then** execute archive-moves. The events
  cited as evidence must not be archive-moved before the ADR that cites them has its provenance
  captured.
- **Heartbeat aggregate artefact:** a durable cadence-statistics summary (per-agent beat counts,
  inter-beat distributions, gap windows) written once before heartbeat beats are archive-moved.
- **Derived artefacts are not preservation targets** (owner, PR 201): the 7.1 MB `shared-comms-log.md`
  is a rendering rebuilt from the event stream — it goes untracked with no relocation and no disposition
  ledger entry. Invariant 3 attaches to the events, never to the rendered log.
- **Composition with `comms-watch-storage-redesign`:** if that plan lands a watermark/segment store,
  the curator pass becomes "retire segments older than the window"; the class-tiers and absorption gate
  are unchanged. If it does not land, the directory-level archive-move ships standalone today.
- **Migration path for the held corpus (item-level disposition):** see §6.

## 6. Migration path for the current held corpus

The held corpus at ratification (≈5,188 events, live-growing) is migrated once, by class, before the
steady-state cadence takes over:

1. **Heartbeat class (~2,615 events, ~50.4%):** extract the cadence-statistics artefact (this research
   already has most of it), record it, then archive-move all heartbeat-family beats older than the
   window. This is the single largest live-directory reduction.
2. **Diagnostic / test / noise (SC3/SC6):** body-read first (SC3 falsifier — a test-titled event may
   carry real signal), then quarantine-note and archive-move.
3. **Research-precious (`failure-mode`-tagged, 41, + the genuine-signal behaviour-note subset):** these
   are already largely absorbed by WS1–WS4 (this thread's reports + the taxonomy + the re-verify
   outcomes). Per the §4.3 operative gate, confirm each has a recorded disposition (durable home,
   classified-routine, or quarantined) before archive-move.
4. **Coordination narrative + directed older than the window (incl. the routine bulk of the 305
   behaviour-notes):** classify routine via the §4.3 safeguard — body-sample read plus a per-event read
   of any event exceeding the routine body-length threshold; **never title genre alone** — then
   archive-move. The WS4 review-disposition method is the candidate-routing step; the body check is the
   gate.
5. **Within-window events stay live.** The live directory converges to roughly the retention window's
   worth of events plus any not-yet-absorbed research-precious events.

Every step is archive-move (reversible); no step deletes; nothing under `experiments/` is touched
(owner: never purged — it relocates to a tracked home in WS7 step b).

## 7. Sub-choices the owner may want to steer

1. **Retention window** — proposed 7 d (owner default) for coordination narrative; 48 h for heartbeats.
   Tunable.
2. **Archive location** — proposed `.agent/state/collaboration/comms-archive/` (gitignored, off drain
   path). Alternative: a sibling outside `.agent/state/` entirely.
3. **Trigger cadence** — proposed consolidation / session-close curator pass. Alternative: a periodic
   scheduled sweep.
4. **Ratified artefact shape** — proposed PDR (portable contract §4) + ADR (phenotype §5). The owner may
   prefer a single ADR if the portability surface is judged thin.

## 8. What this proposal explicitly does NOT do

- It does not delete anything (owner direction 2026-06-13: archive while Fable is unavailable).
- It does not execute — WS7 executes on ratification; if the owner declines or reshapes, the plan
  closes at WS6 with the decline recorded (or WS7 executes the reshaped ratification).
- It does not claim to fix the watcher — that is the hardening + storage-redesign plans' job.
- It does not add a hook, daemon, or new CLI — the curator pass is a procedure over existing tooling.

## 9. Recommendation

Ratify §1 as written, with the §7 sub-choices defaulted as proposed unless the owner steers them. The
mechanism is evidence-grounded, honest about the unproven size→health link, satisfies all five
invariants (invariant 2 structurally via archive-move; invariant 3 via the git-tracked cited-events
digest; invariant 4 in spirit with the letter explicitly deferred to a controlled measurement),
composes with the storage redesign either way, and reduces the live working set by ~50% on the
heartbeat class alone — the part of the value that holds regardless of the watcher question.

## 10. Adversarial review record (the mutual-first-hand discipline applied to this proposal)

This proposal was adversarially reviewed across four independent lenses (workflow `wf_6c2b00fa-2b8`,
2026-06-13) before being put to the owner — the §11-method-note discipline Kayak's handoff mandates.
The review returned `holds: false` on the invariant-satisfaction lens; every finding was folded
first-hand:

- **CRITICAL (invariant 3 resolvability)** — a gitignored archive + untracked manifest strands
  permanent-doc event-id citations in a clean checkout. **Folded:** added the git-tracked cited-events
  digest (§4.1 inv. 3, §5) as the provenance survivor.
- **IMPORTANT (invariant 1 bulk-classification)** — title-genre bulk sweep bypasses the absorption gate
  (SC3 `3cc1fb93` falsifier). **Folded:** the §4.3 body-read safeguard now gates every bulk class.
- **IMPORTANT (invariant 4 honesty)** — a round-number bound does not satisfy the "sized to drain
  health" letter. **Folded:** §4.1 inv. 4 now states spirit-satisfied / letter-deferred-to-measurement.
- **IMPORTANT (absorption-gate inconsistency)** — three non-equivalent gate statements; "all 344
  research-precious" over-broad. **Folded:** §4.3 is the single operative gate; research-precious
  narrowed to failure-mode + genuine-signal behaviour-notes (§2, §4.2).
- **Minor** — figure anchoring (behaviour-note 303→305 at corpus close; ~1,842 token snapshot;
  Heartbeat-end exclusion stated as 35 — my first-hand re-count corrected the reviewer's 29), the
  §5 schemas/fixtures + README-anchor omissions, the consolidated owner-role line, and the invariant-2
  future-untracked-events constraint were all folded.

The two-reader loop ran in both directions: the reviewer caught the critical invariant-3 gap I missed;
my first-hand re-count corrected the reviewer's undercount of untagged `Heartbeat-end:` events
(29 → 35).

**Confirmation round** (workflow `wf_ee4fbb8e-bbc`, 2026-06-13) — a holistic re-check plus a dedicated
skeptic on the newly-introduced cited-events digest. The holistic check returned `holds: true` (one
minor: close the identity-tuple sub-case in prose — folded into §4.1 inv. 3). The digest-skeptic
returned `holds: false` with three sound `important` findings, all folded: the digest path was an
unresolved placeholder → resolved to `.agent/reference/comms-cited-events.md`; the discipline was
prose-only → added a mandatory pre-archive-move provenance check; the report→ADR scope gap → added the
explicit WS7 step-ordering constraint; and inline-quoting is now the preferred default with the digest
as fallback. The mechanism is materially stronger for a second adversarial pass having run — the
owner's "do it again if in doubt" rule made structural. The folded proposal is what is put to the owner.
