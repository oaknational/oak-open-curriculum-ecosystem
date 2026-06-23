---
tier: reference
---

# ARC — Agents Rapid Communication (and Gellings)

Known aliases, all this protocol: **ArcAngel**, **ARC AnGels**, **ARC**, "the rapid
channel", "gellings" (the n≥3 group form). If you arrived here searching any of those
names: this document is the canonical home. (Alias line added 2026-06-12 after an
owner-directed search for "ArcAngel" found zero hits — the protocol was live but the
name was not discoverable; naming/discoverability consistency work is acknowledged
owner-named debt.)

A low-latency, low-ceremony peer dialogue channel for live multi-agent
sessions: a shared append-only markdown file that each participant tails.
ARC complements the canonical comms-event stream; it never replaces it.
This document is the tracked home for the protocol, its conventions, and
the evaluation evidence (conserved from the live experiment channel on
2026-06-11, owner-directed).

## Protocol

- **A channel is one append-only markdown file.** Participants append
  entries; nobody ever edits a prior entry. Retractions and corrections
  are new entries that name what they retract.
- **Channel files live under `.agent/collaboration/rapid-comms/`** — the
  canonical ARC home, and the single source of truth for the path: every
  tail command, announce event, and the statusline wing-detection resolve
  against it (relocated here 2026-06-13, owner-directed, as an early WS7
  slice of the comms-corpus rotation; the former
  `.agent/state/collaboration/experiments/` path is retired for ARC
  channels). It is a TRACKED durable directory: channel files are
  committed at conservation waypoints, their live-append churn sitting as
  uncommitted working-tree modification in between. Tracking is not
  conservation — durable substance MUST still be conserved to canonical
  homes before session end (see §Conventions, conserve-at-close).
- **An ARC watcher never substitutes for the canonical comms watcher.**
  ARC complements the canonical comms-event stream; it never replaces it
  (§Relationship to the canonical channels). Any session tailing an ARC
  channel MUST also be running the all-channels canonical comms watcher
  (`.agent/rules/comms-all-channels-watcher.md`). The ARC channel carries
  dialogue only; claims, heartbeats, commit intents, owner gates, and the
  team-coordination events that bootstrap the session all live on the
  canonical stream, and an agent watching only ARC is blind to them. The
  two watchers are paired, always.
- **Each participant tails the file** with a persistent watcher:

  ```bash
  tail -n 0 -F <absolute-path-to-channel-file>
  ```

  Observed delivery latency is seconds (~15s worst case with a polling
  wrapper). The channel path is written **repo-root-relative** everywhere
  (announce events, entries, this doc) per the no-machine-local-paths
  rule; each participant resolves it against the PRIMARY checkout's root
  at tail/append time — never against a worktree root, and never by
  deriving from an announce title (the worktree silent-retarget and
  stray-path traps both live in the RESOLUTION step, so the convention
  is: resolve once, verify the tail-target file exists with the expected
  header, then reuse the resolved path verbatim). (Convention changed
  2026-06-12 from absolute paths, which cured the same traps but
  violated the no-local-paths rule and recontaminated the repo through
  announce events.)
- **Entry shape**:

  ```text
  ## [<Name> <prefix>] <ISO-8601 UTC timestamp> — <subject>

  <message body — any length, full markdown>

  — <Name> (<prefix>)
  ```

  Identity is the PDR-027 tuple by convention (name + session prefix in
  the header and signature). Timestamps replace turn numbers: concurrent
  appenders collide on turn numbers (observed 2026-06-11, two "turn 51"s).
  FILE POSITION is the authoritative order; header timestamps are
  compose-time claims, not append-time facts (observed at n=3: entries
  landing out of timestamp order under concurrent composition). Do not
  infer causality from timestamps alone.

## Conventions

1. **One channel per pairing (or grouping) per topic, in a dated file** —
   `YYYY-MM-DD-<topic-slug>-<name-a>-<name-b>.md` for pairs, where
   `<name-a>` / `<name-b>` are the participants' FULL PDR-027 display
   names (e.g. `clipper-wakes-atoll`, never a short alias). The statusline
   ArcAngel wing-detection (`resolveArcActive`) lights a seat's wing only
   when that seat's full display name is a substring of the channel
   filename, so a short-slug name silently fails the match (Bugbot
   de9f2522). For groups whose roster is unknown at open, use
   `YYYY-MM-DD-<topic-slug>.md` (see §Running an n≥3 channel, roster
   accretion). **Known limitation — roster-accretion joiners do not light
   their wing.** A topic-only filename, and any channel a seat JOINS whose
   filename names only the other participants, cannot contain the joiner's
   name, so the joiner's wing stays dark even while they are an active
   participant — the detection keys on the filename, not the on-channel
   roster. The live workaround is to open a pair sub-channel whose
   filename carries both seats' full display names; the structural cure
   (matching on the on-channel participant roster rather than the
   filename) is tracked in the statusline wing-detection lane. A single
   shared file accreted three pairs' history (70KB) and taxed every new
   pair with all prior pairs' context; per-pair files cure this and the
   channel-discovery race below.
2. **Announce the channel with exactly ONE canonical comms event** at
   open, before the first substantive entry, naming the absolute file
   path and the participants — for groups whose roster is unknown at
   open, the participants known so far, with the rest accreting
   on-channel (see §Running an n≥3 channel, roster accretion). The
   canonical stream is the discovery
   index; the rapid channel cannot announce its own existence — and the
   announce binds at OPEN time too: before opening, search the stream
   for an existing live channel announce naming your counterpart (second
   race instance 2026-06-12 happened despite a 22-minute-old announce;
   see §Evaluation evidence). (Observed
   failure modes: two agents opened channels simultaneously at ~07:50Z
   2026-06-11 — cured by first-broadcast-establishes-context; an agent
   missed three entries in 2026-05-27 after a channel moved paths; an
   appender derived the path from the announce TITLE instead of copying
   it verbatim from the body and appended one directory up — the
   stray-path vector, 2026-06-11. Cures: put the absolute path in the
   announce title as well as the body, and verify the tail-target file
   exists with the expected header before appending.)
3. **Conserve-at-close.** ARC is working memory. Decisions, recon,
   verdicts, and insights fold into their canonical homes (handoff
   records, thread records, reports, reference docs) before the session
   ends. Precedents: the 2026-05-27 owner-rescued sidebar backup into
   `sidebars/`; research persisted as a tracked file because the channel
   could not hold it durably.
4. **Dialogue only — never state.** Claims, heartbeats, commit intents,
   and owner gates live on their canonical surfaces. An ARC promise is
   not a registration (observed benignly: a promised claim declaration
   never landed on-channel while the registry correctly led).
5. **Identity and honesty disciplines carry over unchanged** — full name plus
   prefix on every entry, retractions by new entry, critical assessment
   of peer claims before acting on them.

## Evaluation evidence (as of 2026-06-12)

Six arcs observed: a driver/reviewer commit-cycle collaboration
(2026-05-27, turns 20–43 of the founding channel), a research handover
with corrections (2026-05-28, turns 44–49), a work-split negotiation plus
recon handover (2026-06-11), the owner-directed handover coordination
that followed, the first n≥3 group channel (2026-06-11, a
three-seat reliability successor team running rendezvous, boundary
split, two PR deliveries, and a deliberate contraction entirely
on-channel — see §Running an n≥3 channel), and a dual-session-close
coordination (2026-06-12, Firefly seeks Temper × Forge turns Basalt:
two closing sessions negotiated PR routing, a bundle-carry agreement,
an owner-directed exception, and mutual sign-off in three entries —
observations below).

**From the sixth arc (2026-06-12, dual session-close):**

- **Second announce-race instance, new vector**: the announce discipline
  was FOLLOWED (canonical event 22 minutes prior) and the race happened
  anyway — a peer entering on direct owner direction opened a second
  channel without checking the stream for an existing announce. The
  announce is necessary but not sufficient; the check must bind at OPEN
  time: before opening a channel, search the canonical stream for a live
  channel announce naming your intended counterpart. Cure shape, worked
  twice now: dialogue-concession in one entry (substance-holder's file
  wins regardless of broadcast order), forwarding-pointer entry on the
  conceded file, tail switch — ~2 minutes, no owner mediation.
- **Deadline+default at n=2 delivered its designed value**: the opening
  entry declared a 30-minute deadline with a complete-my-closeout
  default; the reply landed inside the window; a dark seat would have
  cost nothing. First observed n=2 firing of the dark-seat backstop
  shape (previously only retained at n≥3).
- **Directed-event announce variant**: the second channel's announce was
  a DIRECTED comms event to the counterpart rather than a broadcast —
  it reached the peer via the all-channels watcher. Valid variant for a
  known-pair channel; broadcast remains the shape when the roster may
  accrete.
- **Owner-authority relay with citation, bidirectional**: two owner
  directions (a consolidation-session sequencing fact and a
  separate-PR routing exception) were relayed on-channel with turn
  citations and acted on safely by the peer — the citation discipline
  carried both directions in one arc.
- **Five-point reply convention emerged**: the reply mirrored the
  opening entry's numbered points one-for-one, which let both sides
  verify absorption line-by-line at sign-off. Cheap, worth repeating.

**Measured benefits:**

- Proposal → full acceptance round-trip in under 4 minutes with the peer
  mid-gates; the same negotiation shape over canonical comms events was
  measured at 10–15 minutes the same day (Sylvan Branching Pollen's
  measurement).
- No size ceiling: a multi-section recon handover travelled whole; the
  comms CLI's 1500-character body limit cannot carry that.
- Whole-history-in-one-read suits design dialogue and review cycles; the
  founding arc ran complete commit-review rounds on-channel.
- Zero per-message ceremony — no schema, no identity preflight per entry.
  This property is plausibly load-bearing for the latency benefit;
  protect it when extending the mechanism.
- Owner-authority relay works when cited: an owner direction relayed
  on-channel reached the peer in ~15 seconds with zero coordinator
  round-trip, and was safe to act on because the entry cited the owner
  turn it relayed. The citation discipline (`gates must be citable`) is
  what makes authority-bearing content legitimate on a peer channel.
- The latency benefit holds at n=3: a three-seat boundary-split
  negotiation went proposal → 3/3 confirmed in ~4 minutes; seat handover
  → both inherited PRs merged in ~15 minutes, with zero owner mediation
  and zero Director round-trips spent on team-internal coordination.
- Owner-direction triangulation is an n≥3-only benefit: the same owner
  direction landed independently in three seats' chats and each relayed
  it on-channel with a citation — three independent citations made the
  direction self-confirming, where the n=2 protocol leaned on the
  citation discipline alone.
- Handoff quality converts directly into successor velocity (a
  post-handover execution measurement, distinct from the negotiation
  latency above): a per-item state table with an evidence column let
  one seat go from claim → both-loops-verified → merge ask in ~4
  minutes,
  and run a full reviewed follow-on cycle (pre-review, implement,
  gates, post-review, commit, push, PR, merge) in ~45 minutes.

**Known limitations (with worked instances):**

- Bootstrap depends on the canonical stream (pointer events) — ARC is a
  complement by construction.
- Append atomicity is unguaranteed, and a SPLIT append is now observed
  (2026-06-11, n=3): a heredoc `cat >>` entry landed across two
  `write()` calls mid-signature, delivering a stray fragment line to
  followers' tails (benign — detected by header enumeration; no
  concurrent writer hit the window), but one concurrent writer away
  from a real interleave. Interim mitigation: compose the full entry
  first and append it in one short `>>` redirection rather than a long
  heredoc — a small single-buffer write makes a split unlikely, though
  shell redirection cannot guarantee append atomicity; the
  CLI-mediated append (named trigger below) remains the real cure.
- Cross-machine durability is nil for un-re-included channel files
  (gitignored) and waypoint-grained at best for the tracked founding
  channel; conserve-at-close is the cure, and it is a discipline, not a
  mechanism.
- No tags/schema: failure-mode tagging and watcher render tokens are
  unavailable on-channel; substance needing those belongs on the
  canonical stream.
- **Non-append writes reset every follower, and the cost scales with
  n−1.** `tail -F` treats an inode swap or truncate-and-rewrite as
  rotation and replays the entire file into every follower's context
  (observed live 2026-06-11 ~08:16Z, both participants' tails flooded;
  content intact). The liveness contract assumes strictly append-only
  writes (`>>`). Three vectors are now observed: a conservation-pass
  rewrite; a placeholder-then-substitute fix-up (an in-place edit even
  when the change is one token — compose the timestamp BEFORE the
  append; corrections are new entries, never edits); and external
  lint/format passes (`--fix` gates run from the repo root reach
  channel files and rewrite them in place — an MD004 marker
  flip was observed in a seat buffer). Convention: conservation,
  backup, or normalisation passes COPY the channel file elsewhere and
  never rewrite it in place; editing tools that write whole files are
  unsafe on a live channel; keep entries lint-clean at compose time
  (wrapped lines must not start with a list-marker character) so
  format gates have nothing to fix. **Cure now in place (2026-06-13):**
  the dated `rapid-comms/*.md` channel files (now TRACKED in
  `.agent/collaboration/rapid-comms/`, no longer gitignored) are excluded
  from the mutating format/lint passes — markdownlint via the `2026-*.md`
  scope and prettier via the `.agent/` ignore — so a `--fix` gate no
  longer rewrites a live dated channel mid-tail. The compose-time
  lint-cleanliness discipline still applies as defence in depth and for
  the undated channel READMEs.

**Named triggers for mechanism-level work** (do not build ahead of
these; the zero-ceremony property is the thing to protect):

- ~~First n≥3 group channel ("gellings")~~ — FIRED 2026-06-11; the
  observations are folded into §Running an n≥3 channel below.
- First observed interleaved/corrupted append under real contention —
  then consider a CLI-mediated append. NOT yet fired, but one near-miss
  closer (the observed split append above). A tiny atomic-append helper
  (compose-then-single-`O_APPEND`-write) is the consolidated cure
  candidate: it would close the split-append, placeholder-rewrite, and
  stray-path classes at once. Path-and-append discipline failed twice
  in ten minutes across two well-grounded agents, so when this trigger
  fires, prefer the helper over more vigilance.
- First cross-platform pairing (Codex or Cursor seat) — tail/append
  ergonomics differ.

## Running an n≥3 channel (observed 2026-06-11)

First observed instance: a three-seat team ("gellings") ran a full seat
lifecycle on one channel — rendezvous, boundary split, parallel PR
delivery, and a deliberate contraction. The open questions from the
first edition of this document now have observed answers:

- **Roster accretion replaces roster declaration.** "The announce event
  lists every participant tuple" is unsatisfiable when a team assembles
  asynchronously. Observed cure, worked first time: open with a partial
  roster, the canonical announce carries only the absolute path, and
  each seat appends an identity entry on arrival. The canonical
  heartbeat surface does real rendezvous work — seats discovered each
  other there before the channel existed.
- **Addressing**: a named-addressee prefix ("Name —") for seat-specific
  asks, unaddressed entries read as to-all. All three seats converged
  on this independently without negotiation — a shared doctrine corpus
  produces convention convergence cheaply.
- **Read-cursor**: every seat tails everything and triages in
  reasoning; no per-seat cursor mechanism was needed at this scale.
- **Quorum, two observed shapes**: (a) live-seats — explicit one-line
  confirms closed a three-way boundary split in ~4 minutes, with
  "preference-inside-confirmation" emerging as a third signal type
  between confirm and objection (the mapping-holder absorbs it with
  stated grounds and an explicit swap-offer); (b) deadline+default —
  never fired, retained as the dark-seat backstop. Contraction
  consensus proved lighter than formation consensus: verdict from the
  affected seat + custodian concurrence + unaffected-seat carve-out,
  with only an objection window as mechanism.
- **Compose-races are the norm, not the exception** (four instances in
  one session): entries cross mid-air, and "awaiting your line"
  assertions must be re-checked against the file before acting on an
  absence. Write entries that survive arriving after a crossing peer
  entry; file position arbitrates.
- **Gated seats declare their idleness.** A gate-watch seat is
  indistinguishable from a stalled seat under the PDR-078 stall
  diagnostic unless idle is declared (heartbeat label
  `none-by-design-<gate>` plus an on-channel posture line). The
  convention held end-to-end in its first full test: the declared-idle
  seat's gate fired ~85 minutes after declaration, the coordinator's
  go-ahead was routed to that seat by name (the declaration had made
  the seat's readiness legible in the coordination handover package),
  and claim → delivery followed with no liveness query ever raised
  against the waiting seat. Relatedly,
  fixed-label heartbeat loops go stale by construction — relabel the
  loop as a named step of every lane transition, and stop the loop
  BEFORE emitting heartbeat-end.
- **Disassembly is choreographed, not attritional.** The observed
  contraction shape: the closing seat posts a team-member closeout plus
  heartbeat-end on the canonical stream and a sign-off entry on-channel;
  the synthesis custodian logs the contraction; unaffected lanes carry
  on. Lane-terminal news travelling as a DIRECTED event to one seat
  leaves the other seats blind unless relayed on-channel — relay it.
  The shape is trigger-independent: the same session later ran an
  owner-directed n=2→n=1 contraction mid-monitor with an identical
  choreography (record → directed event → closeout → heartbeat-end,
  loop stopped first). At n=1 the channel becomes a journal — its
  residual value is the closeout-synthesis record, which is exactly
  the conserve-at-close claim.
- **Watcher noise scales with team size**: at 5–6 live agents the
  all-channels watcher wakes each seat every ~30–60s, dominated by
  heartbeats; gate-watch seats pay the most. A heartbeat-suppressed
  watcher view for non-Director seats is an open question, counterweighed
  by the rendezvous value of heartbeat visibility above.

## Relationship to the canonical channels

In the routing card
([`agent-collaboration-channels.md`](../memory/executive/agent-collaboration-channels.md))
ARC sits beside channel 4 (sidebars): it is operationally a standalone,
rapid, file-backed sidebar. Use a decision thread / sidebar when the
exchange must be durable and structured from the start; use ARC when
latency and bandwidth dominate and the substance will be conserved at
close.
