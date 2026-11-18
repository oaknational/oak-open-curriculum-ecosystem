---
tier: reference
---

# ARC — Agents Rapid Communication (and Gellings)

Known aliases, all this protocol: **ArcAngel**, **ARC AnGels**, **ARC**, "the rapid
channel", "gellings" (the n≥3 group form). If you arrived here searching any of those
names: this document is the canonical home. (Alias line added 2026-06-12 to cure real
search misses — the protocol must be discoverable under every name it is called by.)

A low-latency, low-ceremony peer dialogue channel for live multi-agent
sessions: a shared append-only markdown file that each participant tails.
ARC is standing Practice infrastructure (owner word, 2026-08-03: it is used
all the time and is no longer evaluation-gated). ARC complements the
canonical comms-event stream; it never replaces it. This document is the
tracked home for the protocol, its conventions, its operating constraints,
and its standing maintenance clauses. The closed evaluation evidence that
earned the graduation — six observed arcs, measured benefits, and the
worked-instance histories behind the constraints below — is conserved in
the dated record
of 2026-08-03 in OCE, which did not travel with the transplant.

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
- **Where both seats can use native session messaging (s2s), that is the
  dialogue channel** (owner-directed 2026-09-13; the `comms-channels` skill).
  ARC keeps its place for a pair s2s cannot reach and for a dialogue whose
  transcript is itself the record; the conservation clause and the mirroring
  obligation apply on both.
- **Each participant tails the file** with a persistent watcher:

  ```bash
  tail -n 0 -F <absolute-path-to-channel-file>
  ```

  Observed delivery latency is seconds (~15s worst case with a polling
  wrapper). The channel path is written **repo-root-relative** everywhere
  (announce events, entries, this doc) per the no-machine-local-paths
  principle (`.agent/directives/principles.md` §No machine-local
  paths); each participant resolves it against the PRIMARY checkout's root
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
   open, before the first substantive entry, naming the channel file
   path (repo-root-relative, per §Protocol) and the participants — for
   groups whose roster is unknown at
   open, the participants known so far, with the rest accreting
   on-channel (see §Running an n≥3 channel, roster accretion). The
   canonical stream is the discovery
   index; the rapid channel cannot announce its own existence — and the
   announce binds at OPEN time too: before opening, search the stream
   for an existing live channel announce naming your counterpart (a
   second race instance happened despite a 22-minute-old announce; the
   race histories are conserved in the evaluation record). (Observed
   failure modes: two agents opened channels simultaneously at ~07:50Z
   2026-06-11 — cured by first-broadcast-establishes-context; an agent
   missed three entries in 2026-05-27 after a channel moved paths; an
   appender derived the path from the announce TITLE instead of copying
   it verbatim from the body and appended one directory up — the
   stray-path vector, 2026-06-11. Cures: put the channel path in the
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

## Operating constraints (standing)

The constraints below are load-bearing operating facts of the mechanism,
not open evaluation questions. The worked-instance histories behind each
are conserved in the evaluation record.

- **Bootstrap depends on the canonical stream** (pointer events) — ARC is
  a complement by construction; it cannot announce its own existence.
- **Append atomicity is unguaranteed.** Compose the full entry first and
  append it in one short `>>` redirection rather than a long heredoc — a
  small single-buffer write makes a split unlikely, though shell
  redirection cannot guarantee append atomicity. The mechanical cure
  gates on the §Maintenance clause below.
- **Non-append writes reset every follower, and the cost scales with
  n−1.** `tail -F` treats an inode swap or truncate-and-rewrite as
  rotation and replays the entire file into every follower's context.
  The liveness contract assumes strictly append-only writes (`>>`).
  Conservation, backup, or normalisation passes COPY the channel file
  elsewhere and never rewrite it in place; editing tools that write
  whole files are unsafe on a live channel; corrections are new entries,
  never edits (compose the timestamp BEFORE the append, built from `date -u`
  inside the append command itself, so no typed time reaches the file: a
  hand-typed header ran three minutes ahead of the clock, 2026-09-25); a
  channel is opened by appending too, never by a whole-file write, whenever a
  partner is live and may open it in the same seconds (one seat's write
  replaced its partner's header, 2026-09-25); an append re-reads the
  channel's last heading in the same breath as the write, and a claim of
  absence names the moment of its read (a wrap appended nineteen seconds
  after a peer's entry, without a re-read, 2026-09-23); keep entries
  lint-clean at compose time (wrapped lines must not start with a
  list-marker character) so format gates have nothing to fix. The dated
  `rapid-comms/*.md` channel files are excluded from the mutating
  format/lint passes (markdownlint via the `2026-*.md` scope, prettier
  via the `.agent/` ignore) so a `--fix` gate cannot rewrite a live
  dated channel mid-tail; compose-time lint-cleanliness still applies as
  defence in depth and for the undated channel READMEs.
- **Tracking is waypoint-grained, not conservation.** Channel files are
  tracked and committed at conservation waypoints, with live-append
  churn uncommitted in between; a machine loss between waypoints loses
  the churn. Conserve-at-close (§Conventions item 3) is the durability
  discipline that closes the gap — which is why it is a convention, not
  advice.
- **No tags/schema on-channel.** Failure-mode tagging and watcher render
  tokens are unavailable; substance needing those belongs on the
  canonical stream.
- **An open channel pins the primary working copy to the branch carrying
  its file.** The channel file is tracked, so a branch switch in the
  primary checkout to a branch without it removes the file from disk and
  the switch back restores it; every `tail -F` follower reads that as a
  rotation and replays the file, and a partner's append in the window
  blocks the switch (2026-09-13: a channel committed on the records
  branch vanished on a switch to a branch cut from `main` and replayed
  on the return). While a channel is open, the primary stays on the
  branch that carries it and other branches' work runs in worktrees.

## Maintenance clauses (standing)

- **Atomic-append helper — build at trigger, not before.** A tiny
  compose-then-single-`O_APPEND`-write helper is the consolidated cure
  candidate for the split-append, placeholder-rewrite, and stray-path
  classes at once. Build it at the FIRST observed interleaved or
  corrupted append under real contention, or at owner word — standing
  infrastructure does not suspend YAGNI (graduation decision, recorded
  at ws-b0 of the ARC-colour statusline delivery plan). One near-miss
  split append is on record; when the trigger fires, prefer the helper
  over more vigilance — path-and-append discipline has already failed
  twice in ten minutes across two well-grounded agents (evaluation
  record, §Known-limitation worked instances).
- **Cross-platform pairing — ergonomics record outstanding.** The first
  cross-platform pairing has already occurred: a Codex seat (Zephyr
  turns Crosswind, Codex / GPT-5) joined and tailed a live channel on
  2026-07-16
  (`.agent/collaboration/rapid-comms/2026-07-16-codex-hook-experiment-lupin-herds-bark-and-zephyr-turns-crosswind.md`),
  but the tail/append ergonomics review that pairing was meant to
  trigger was never recorded. The outstanding follow-up: at the next
  cross-platform pairing — or by harvesting the 2026-07-16 channel —
  record the resolved per-platform tail/append ergonomics shape here.
- **Zero per-message ceremony is load-bearing.** No schema, no identity
  preflight per entry. This property is plausibly the source of the
  measured latency benefit (evaluation record, §Measured benefits);
  protect it when extending the mechanism.

## Running an n≥3 channel

Group channels ("gellings") run the same protocol with these standing
conventions (derived from the first full n≥3 lifecycle, 2026-06-11 — the
observational record is conserved in the evaluation record):

- **Roster accretion replaces roster declaration.** A team assembling
  asynchronously cannot enumerate its roster at open: open with a
  partial roster, let the canonical announce carry the channel path
  (repo-root-relative, per §Protocol) and the participants known so
  far, and each seat appends an identity entry on arrival. The
  canonical heartbeat surface does real rendezvous work — seats discover
  each other there before the channel exists.
- **Addressing**: a named-addressee prefix ("Name —") for seat-specific
  asks; unaddressed entries read as to-all.
- **Read-cursor**: every seat tails everything and triages in reasoning;
  no per-seat cursor mechanism is needed at observed scales.
- **Quorum, two shapes**: (a) live-seats — explicit one-line confirms,
  with "preference-inside-confirmation" as a third signal type between
  confirm and objection (the mapping-holder absorbs it with stated
  grounds and an explicit swap-offer); (b) deadline+default — the
  dark-seat backstop: declare a deadline and a default action, act on
  the default if the window closes dark. Contraction consensus is
  lighter than formation consensus: verdict from the affected seat +
  custodian concurrence + unaffected-seat carve-out, with only an
  objection window as mechanism.
- **Compose-races are the norm, not the exception.** Entries cross
  mid-air; "awaiting your line" assertions must be re-checked against
  the file before acting on an absence. Write entries that survive
  arriving after a crossing peer entry; file position arbitrates.
- **Gated seats declare their idleness.** A gate-watch seat is
  indistinguishable from a stalled seat under the PDR-078 stall
  diagnostic unless idle is declared (heartbeat label
  `none-by-design-<gate>` plus an on-channel posture line); the
  declaration makes the seat's readiness legible to coordination
  handovers. Relatedly, fixed-label heartbeat loops go stale by
  construction — relabel the loop as a named step of every lane
  transition, and stop the loop BEFORE emitting heartbeat-end.
- **Disassembly is choreographed, not attritional.** The contraction
  shape: the closing seat posts a team-member closeout plus
  heartbeat-end on the canonical stream and a sign-off entry on-channel;
  the synthesis custodian logs the contraction; unaffected lanes carry
  on. Lane-terminal news travelling as a DIRECTED event to one seat
  leaves the other seats blind unless relayed on-channel — relay it.
  The shape is trigger-independent (the same choreography served an
  owner-directed n=2→n=1 contraction mid-monitor). At n=1 the channel
  becomes a journal — its residual value is the closeout-synthesis
  record, which is exactly the conserve-at-close claim.
- **Watcher noise scales with team size.** At 5–6 live agents the
  all-channels watcher wakes each seat every ~30–60s, dominated by
  heartbeats; gate-watch seats pay the most. The sanctioned relief is
  the `--exclude-tag heartbeat` watcher narrowing MANDATORILY paired
  with the peer-liveness poll
  (`.agent/rules/comms-all-channels-watcher.md` §Sanctioned tag
  exclusion) — never a hand-rolled filter.

## Relationship to the canonical channels

In the routing card
([`agent-collaboration-channels.md`](../memory/executive/agent-collaboration-channels.md))
ARC sits beside channel 4 (sidebars): it is operationally a standalone,
rapid, file-backed sidebar. Use a decision thread / sidebar when the
exchange must be durable and structured from the start; use ARC when
s2s cannot reach both seats or when the transcript is itself the record.
Either way the substance is conserved at close, and ARC's rapid
file-backed shape is what such an exchange needs when latency and
bandwidth dominate.
