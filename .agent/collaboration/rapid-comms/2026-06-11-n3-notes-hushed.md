# ARC n=3 evaluation notes — Hushed Watching Night (999f69), 2026-06-11

Personal observation buffer for the owner-mandated n=3 ("gellings") evaluation.
Conserve-at-close target: the §n>=3 section and evaluation evidence of
.agent/reference/arc-rapid-communication.md, via the ARC synthesis duty travelling
with the reliability seat. (This paragraph originally wrapped a line onto a leading
"+", which a later external lint --fix pass took as the file's list style — see the
lint-rewrite friction entry below. Repaired without content change.)

## Rendezvous phase (08:50–08:55Z)

+ [works-well] Assembly was race-free: Oceanic broadcast first (08:50:04Z), opened the
  channel, announced with ONE canonical event; both later seats joined rather than
  opening competing channels. The n=2 friction-#1 (channel-open race) did NOT recur at
  n=3 — first-broadcast-establishes-context + announce-as-discovery-index held.
+ [insight] Roster-unknown-at-open: the reference doc's "announce event lists every
  participant tuple" is unsatisfiable when a team assembles asynchronously. Oceanic's
  cure (partial roster + append-identity-on-arrival; canonical announce carries only
  the path) worked first time. Candidate amendment to the reference doc's n>=3 section.
+ [friction] Header timestamps are COMPOSE-time, not append-time: my entry (stamped
  08:52:20Z) sits AFTER Seaworthy Fathoming Pier's (stamped 08:53:30Z) in file order.
  At n=2 this never bit (strict turn alternation); at n=3 concurrent composition makes
  it visible. Verdict: file position is the authoritative order; timestamps are
  approximate metadata — do not infer causality from them. The reference doc's "file
  position plus timestamp orders entries unambiguously" needs this sharpening.
+ [insight] Convergent convention formation: all three seats independently proposed
  the same addressing convention (named addressee for seat-specific asks; unaddressed
  = whole group) within minutes, without negotiation. Shared doctrine corpus appears
  to produce convention convergence cheaply at n=3 — a genuine gelling observation.
+ [benefit] Owner-direction triangulation, unique to n>=3: the same owner direction
  ("pause until Evergreen signals when and how to start") landed independently in all
  three seats' chats and was relayed on-channel with citations by each. Three
  independent citations made the direction self-confirming — no single-relay trust
  question (the n=2 protocol needed the citation discipline to carry this alone).
+ [observation] Cross-surface identity accretion: seats became visible to each other
  via canonical heartbeats BEFORE the channel existed; the channel then inherited a
  known roster. The canonical stream and ARC are complements at bootstrap, exactly as
  the reference doc claims — but at n=3 the heartbeat surface did real rendezvous work.
+ [open-question] Quorum-on-deadline (proposals with deadline+default at n=3: does
  silence of ONE seat or BOTH seats trigger the default?) — unobserved so far; expect
  it to surface at boundary-split time.

## Cross-lane observation (08:53–08:54Z, G4b seat — not ARC, but takeover-relevant)

+ [takeover-lesson] Cindery Forging Volcano inferred Seaworthy Surfing Compass's
  retirement from a single 4-min cadence gap (last tick 08:47, read at ~08:51) and
  opened a continuation claim on a live seat; Seaworthy was alive mid-c2 and the
  Director had to interpose a liveness gate. The PDR-078 thresholds (4–10 min =
  transient, ≥10 min = retired) exist precisely to prevent this. Direct relevance to
  our team: Evergreen Budding Sapling is live and heartbeating — our takeover fires
  ONLY at their explicit signal (owner direction makes this even stricter for us than
  PDR-063's natural-boundary default). Successor enthusiasm is the hazard class.
+ [observation] Heartbeat labels are restart-bound and lag posture changes by up to one
  cadence: Cindery's 08:55:23Z tick still read "executing / cycle=g4b-c2-view" 29s after
  their stand-down ACK promised a standby relabel (loop not yet restarted). Same
  mechanics on my side — relabelling required TaskStop + new monitor. A peer reading
  only heartbeats can see a posture up to ~4 min stale; the canonical narrative/directed
  events are the authoritative posture surface, heartbeats are liveness only.

## Handover + boundary-split phase (09:05–09:12Z)

+ [benefit] Handover speed: Evergreen's START broadcast (09:06:29Z) → record read by all
  three seats → split proposed → mapped → 3/3 confirmed → all three seats executing under
  claims/declared postures by ~09:11Z. A 3-seat boundary negotiation closed in under five
  minutes on the channel; the canonical stream carried only the state artefacts (pickup,
  claims, heartbeats). Clean division of labour between the two surfaces.
+ [friction-n3-1] Stray-path append (Evergreen): start signal first landed one directory up —
  title-derived path instead of body-verbatim path. Cure candidates: absolute path in the
  announce TITLE too; verify tail-target header before appending.
+ [friction-n3-2] Non-append write recurred, new vector: TS_PLACEHOLDER-then-substitute
  (Oceanic) = in-place edit on a live channel; every follower replayed (taxes n-1 followers —
  the cost SCALES with n). Cure: compose the timestamp before the single >> write; corrections
  are new entries, never edits.
+ [insight] Compose-race is the dominant n=3 artefact: three instances in one session (my
  entry vs Seaworthy-Pier's at rendezvous; my Z-confirm vs Oceanic's quorum ask; Seaworthy-
  Pier's 09:08:40 entry landing after Evergreen's 09:09 entry). File position is truth;
  timestamps are claims; every "awaiting your line" assertion must be re-checked against
  the file before acting on its absence.
+ [insight] Quorum shapes, both observed: (a) live-seats shape — explicit confirms, ~4 min,
  with "preference-inside-confirmation" emerging as a third signal type between confirm and
  objection (absorbed by the mapping-holder with stated grounds + swap-offer, saving two
  round-trips); (b) deadline+default — never fired, retained as the dark-seat backstop.
+ [insight] Seat-Z legibility: a gate-watch seat is indistinguishable from a stalled seat
  unless idle is DECLARED (heartbeat label + on-channel posture line). Candidate convention
  for the reference doc: gated seats carry claim=none-by-design-<gate> labels.
+ [observation] Heartbeat lifecycle raggedness, three data points today: cadence-window
  misread (Cindery/Seaworthy-Compass), label lag (restart-bound), and a post-heartbeat-end
  stale tick (Evergreen 09:08:16Z, six seconds after their 09:08:10Z heartbeat-end). The
  heartbeat-end → loop-stop ordering should be: stop loop FIRST, then emit the end event.
+ [observation] First observed SPLIT append (Oceanic 09:17:04Z entry — heredoc append split
  across two write() calls mid-signature; benign, no concurrent writer in the window). The
  reference doc's atomicity caveat is now observed, not theoretical. Precision for the
  synthesis: the doc's named mechanism-trigger ("first observed interleaved/corrupted append
  under real contention → consider a CLI-mediated append") has NOT yet fired — that needs an
  actual interleave. We are one concurrent writer away from it. Cheap interim mitigation for
  all seats: compose the full entry first and append with a single buffered write (small
  entries; one >> redirection of one printf/cat invocation), rather than long heredocs.
+ [insight] PR-#169 hold revealed a THIRD settlement loop (Oceanic's naming): gate checks,
  comment adjudication, and thread-RESOLUTION state (Copilot threads never auto-resolve on
  reply; GraphQL-only visibility). "Both loops settled" undercounts at this repo.
+ [adopted-for-z] Pier's push false-green (event 09:49:50Z): piped `git push` reported the
  hook banner + exit 0 twice while NO transfer occurred (no remote ref). Proof of a push is
  the `* [new branch]`/fast-forward transfer line PLUS fresh `git ls-remote origin <branch>`
  showing the expected SHA — the hook banner proves only the hook. Adopting for the item-5
  PR push at my gate: unpiped push, then ls-remote verification.

## Completeness flush (09:55–10:00Z, owner-directed full-recording pass)

Items observed in-session that had not yet reached this buffer:

+ [friction-n3-3] External lint --fix passes rewrite gitignored ARC surfaces in place.
  Physical evidence: this buffer's `-` bullets (verifiable from my command history) now
  read `+` — an MD004 consistency fix anchored by my own accidental `+`-leading wrapped
  line (the napkin's known wrap-safety gotcha, recurring here). Ethereal's closeout
  independently named their lint-repair commit "racing live appends to the n=3 ARC
  channel files at the pre-push markdownlint gate". The live channel file itself was NOT
  marker-rewritten this time (verified: consistent `-` style, 22 entries, my 4 intact),
  but the mechanism is proven: repo-level markdownlint/format gates run from the
  coordination home reach gitignored live channels and buffers, colliding with the
  append-only contract (follower replay) and with author-content fidelity. Cure
  candidates for the synthesis: exclude `experiments/**` from lint/format globs, OR
  accept lint pressure and keep channel entries lint-clean at compose time (wrapped
  lines never start with a list marker).
+ [observation] Heartbeat lifecycle data points 4 and 5 (extending the earlier three):
  (4) momentary dual "holder" labels during the Director succession (Ethereal "fifth" +
  Sunlit "sixth" heartbeating simultaneously post-Moment-2 — label lag, not a real
  dual-authority window; Ethereal's exit later showed the correct ordering: stop loop
  first, then emit heartbeat-end with an honest stood-down label); (5) Seat X read as
  stalled by a peer's PDR-078 diagnostic while actually heads-down mid-execution.
  Structural diagnosis (Pier's, ratified by all five data points): fixed-label heartbeat
  loops go stale by construction; cure candidate = relabel-the-loop as a NAMED step of
  every lane transition (claim open, lane terminal, cycle advance).
+ [observation] Watcher-noise scaling (my seat's own datum): with 5–6 live agents the
  all-channels watcher wakes a seat roughly every 30–60s, overwhelmingly heartbeats.
  Triage-in-reasoning absorbs it, but the context cost grows linearly with team size and
  the gate-watch seat pays it most visibly (waking for traffic it can never act on).
  Open question for the synthesis: a heartbeat-suppressed watcher view for non-Director
  seats (the Director needs the liveness surface; implementer seats may not) — sits
  adjacent to PDR-082's value-contingency reasoning. Counter-consideration: heartbeat
  visibility is how seats discovered each other at rendezvous (cross-surface accretion).
+ [insight] Queue-routed items survive coordinator succession: my follow-on (c) routing
  (directed to Ethereal, 09:10Z) was absorbed into the Moment-1 package and re-appeared
  in Sunlit's Moment-2 absorbed-queue verbatim. Routing to the ROLE's queue (not the
  person) plus the two-moments package is what carried it. Validates route-to-queue as
  the succession-safe shape.
+ [observation] Cross-seat delivery gap (Oceanic's, mirrored here as synthesis input): a
  Director merge-confirmation travelling as a DIRECTED event to one seat leaves other
  seats' monitors blind unless relayed on-channel. Open addressing question: lane-
  terminal events may warrant broadcast kind, or an on-channel relay convention.
+ [benefit] Relay-chain genre observation: three consecutive full seat handovers today
  (Sylvan → Evergreen → n=3 team) each with zero retained claims, each producing
  immediate successor velocity (X: claim → both-loops-verified → merge ask in ~4 min;
  follow-on (a) full cycle ~45 min including two specialist dispatches). The per-item
  state table with evidence column is the load-bearing artefact of the genre.
+ [observation] Conservation-loop closure: the ARC protocol manual (PR #169) merged to
  main mid-experiment, shepherded over the very protocol it documents — the channel
  coordinated the conservation of its own governing doc. The synthesis follow-on PR
  (Oceanic's custody) now has a tracked home to extend.
+ [resolved-question] The commitlint footer-leading-blank napkin mystery is CLOSED by
  Seat X's root cause: a `PR #<n>` body line parses as a phantom `token #ref` footer.
  Bigger than the ARC synthesis — Oceanic routed it toward doctrine surfaces.

## Durability manifest (where every finding lives, as of this flush)

+ This buffer (gitignored, working-copy durable): the complete Z-seat ledger.
+ Team channel 2026-06-11-reliability-stream-n3.md (gitignored): all shared
  [friction]/[benefit]/[n3-note] entries from all three seats; Oceanic holds synthesis
  custody and sweeps it at the team boundary.
+ Canonical comms stream (git-durable via Director continuity commits): failure-mode
  events (gate-inverting hook effea526; piped-push false-green; 0x1F Write-tool class),
  the team pickup a7c5281b, follow-on (c) routing cadbc911, and the consolidated-ledger
  broadcast posted alongside this flush.
+ Tracked final home: .agent/reference/arc-rapid-communication.md (on main since
  e0f6e5de) — receives the synthesis via Oceanic's follow-on PR at the team boundary.
