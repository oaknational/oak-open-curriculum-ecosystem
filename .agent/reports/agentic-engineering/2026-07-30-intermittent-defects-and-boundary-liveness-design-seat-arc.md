# What did the design seat's day teach about intermittent defects and boundary liveness?

Retrospective on the design seat's 2026-07-30 arc (Sycamore herds Xylem, `028dc4`):
succession → owner-reshaped kit arc → durable-point pause → MCP-414 extraction and
merge → owner-word stand-down. Commissioned by the owner at the seat's close
("yes please to the retro"). Reconstructed from primary sources (PR history, commit
author-dates, comms event ids, Linear timestamps); every count names its derivation;
timestamps normalised to UTC.

## Timeline (instants and SHAs, primary-sourced)

- **07:21:51Z** — PR #644 opened (MCP-372 slice 1; GitHub `createdAt`). Still OPEN
  by design at the arc's close: its SonarCloud duplication red (the two-demo store
  mirror) cures only at the planned PR-2 both-copies deletion.
- **~08:25Z** — compaction prep; seat continues post-compaction on the continuation
  record.
- **~09:00–09:05Z** — owner asks how to pause the lane safely; card answered "Pause
  at durable point"; a decision-complete plan is authored in plan mode and approved.
- **~09:12–09:28Z (approx; bounded by the commits below)** — THE CRASH WINDOW: the
  first two gated checkpoint-commit attempts die at the turbo step with `I/O error:
  Is a directory (os error 21)` before any task runs. Bisection inside the window:
  `GIT_DIR` alone reproduces on a dry run; `GIT_INDEX_FILE` alone is clean;
  reproduces with the unmodified HEAD `turbo.json`; `TURBO_CACHE_DIR` override does
  not cure; the identical command without the env runs 120/120 green. (Failing-run
  count: two hook-run failures plus three-plus dry-run reproductions — derived from
  the session's task logs.)
- **09:30:02Z / 09:32:27Z** — checkpoint commits `7c7703034` (lockfile) and
  `13d245a1f` (turbo wiring) land on the local scaffold branch through the
  env-cured hooks (commit author-dates).
- **09:35:04Z / 09:39:06Z** — `05ed8482c` (the hook env fix, its own commit) and
  `95bdfee3a` (the 18-path kit TS-source content) land on the pause branch; the
  full pre-push suite passes and the branch is remote-verified.
- **~09:44Z** — pause true-ups land within a three-minute span: MCP-372 comment
  (09:44:19Z), MCP-371 comment (09:44:22Z), PR #644 bot state comment (bot token
  minted 09:44:33Z). Pause broadcast + re-armed heartbeat follow.
- **~10:00Z** — owner asks "what's next"; the seat's verdict: extract the hook fix
  as its own PR (bugs-first; ship-independent-coordinate-dependent; also the
  cricket seat-B redirection). Owner routes it to this seat (~10:05Z card).
- **10:07:16Z** — MCP-414 minted (Linear `createdAt`).
- **~10:21–10:22Z** — THE FALSIFICATION: a silently-dying reviewer's last fragment
  ("my first attempt passed") flags non-reproduction; the seat re-runs the probe
  first-hand — green ×3 on the same turbo 2.10.6 (version equality verified in the
  lockfile at both states). The defect is re-classified intermittent and
  state-dependent; the changed premise is carded; owner rules "Ship, re-trued body".
- **10:28:16Z → 10:42:31Z** — PR #650 opened (re-trued body) and MERGED at
  `094b7a145` (GitHub `createdAt`/`mergedAt`): fourteen minutes open-to-merge, one
  review-round cure commit (`52a37884d`, reviewer-directed documentation), 4/4
  required contexts green by name, zero threads. Owner-word pickup to merge:
  ~37 minutes including the falsification detour.
- **~11:03–11:07Z** — owner-word stand-down: handback event (11:05:13Z), claims
  closed and archived, heartbeat-end, closeout, monitors stopped, wrap + formation
  letter.

## Causal stack (ordered by depth)

**Layer 1 — technical root.** turbo 2.10.6 misreads git's exported `GIT_DIR` when
it points into `.git/worktrees/<name>`, dying pre-task — but only when an
unidentified runtime-state co-factor is armed (candidates recorded on MCP-414;
none provable retroactively). Evidence: the bisection matrix above plus the
reviewer's independent 11-probe dormancy sweep.

**Layer 2 — process root: why could a gate die on environment?** The estate's gate
architecture had no separation between gate CONTENT (the tasks) and the RUNNER'S
INHERITED ENVIRONMENT. Hooks inherited git's repo-discovery exports invisibly —
including a `GIT_INDEX_FILE` that during real commits points at a transient lock
file — and no discipline audited what children of the hook inherit. Name the
mechanism: **runner-environment drift** — a gate that fails (or silently
mis-measures) because of what the runner inherited, not what the content contains.
The same layer explains the reviewer-verified trap the cure documented: hoisting
the unset hook-wide would have blanked the staged-file gates and failed OPEN —
environment reaches gates in both directions.

**Layer 3 — process root: why did the seat's own monitors die unnoticed?** Twice
in one morning (the heartbeat at the compaction boundary; the comms watcher at its
hourly exit, ~09:02–10:11Z deaf window), the seat's self-model said "armed" while
the observable surface said "dead". Both catches were mechanical (a fresh registry
read; the F-95 claims gate) — zero were caught by self-scan. Name the mechanism:
**own-liveness staleness** — a seat's model of its own infrastructure is always
stale; only observable-surface reads (registry `heartbeat_at` age, seen-file
heartbeat) are evidence.

**Layer 4 — meta root.** The estate's evidence culture is built on deterministic
reproduction, and its "revisit condition" idiom assumed probes stay meaningful.
A state-dependent defect voids that: **probe-void dormancy** — a passing probe
proves nothing while the co-factor is disarmed, so probe-conditioned revisit
clauses silently expire. (MCP-414's DoD was corrected mid-arc from
retest-on-bump to event-conditioned revisit — the worked instance.) The next
"why" (why does turbo hold hidden state that arms and disarms) leaves the
estate's control; the stack stops here.

## Counterfactual test

The arc contains its own cured/uncured comparison. The UNCURED segment: the crash
window cost roughly 25 minutes of bisection plus two failed gate runs before the
first checkpoint landed — reactive, unplanned, mid-pause. The CURED segment:
MCP-414 ran under the full cured process (ticket-first, decision-complete plan,
pre-absorbed review, honest re-true at the falsification) and went owner-word to
merged-on-main in ~37 minutes with ONE review round and zero rework — the
falsification detour included. The strongest counterfactual — "the hook hygiene
existing a priori, so the crash never fires" — is real but unfair: nobody writes
`env -u` guards for build tools without a forcing incident; the lock-file
invariant was knowable in principle and invisible in practice until the crash
forced the mapping. The honest verdict: the crash was not preventable at
reasonable prior cost, but its HANDLING price was near-minimal because the
disciplines (commit-first checkpoints, fix-forward, card-the-changed-premise)
were already standing. The checkpoint pattern's own price — two extra gate runs,
~15 minutes versus a banned stash — is the standing premium the no-loss rule
charges, paid twice today without incident.

## Honest credit

- The crash bought a permanent hardening of every future hook run (merged
  `094b7a145`), justified by an invariant (the lock-file `GIT_INDEX_FILE`) that
  outlives the crash entirely — found by review, not by the crash's author.
- The falsification bought a worked instance of intermittent-defect evidentiary
  discipline: the honest re-true made the artefact stronger, and the DoD
  correction (event-conditioned revisit) is reusable doctrine.
- The dead monitors bought the own-liveness pattern, now named in the napkin and
  this record, at the price of one 70-minute deaf window that the cursor replay
  proved lossless.
- The day also delivered its actual objectives: the lane paused at a verified
  durable point, and MCP-414 closed Done — the learning was bought alongside the
  work, not instead of it.

## Proposals (each with warrant, falsifier, PDR-130 lane)

1. **Boundary liveness check becomes a named re-ground step** (fast lane —
   proposed as an amendment to the start-right re-ground path / watcher rule
   pairing, routed to the Director's map for adjudication): at every session
   boundary (compaction resume, `/oak-start-right-team` re-run), verify own
   monitors from observable surfaces — registry `heartbeat_at` age and the
   watcher seen-file heartbeat — before any broadcast claims them live.
   *Warrant*: two silent monitor deaths in one seat-morning, both caught
   mechanically, zero by self-scan; one broadcast over-claimed liveness.
   *Falsifier*: if over a month the check false-alarms (flags live monitors dead)
   more often than it catches true deaths, its signal is worse than the F-95
   backstop alone — redesign or drop it.
2. **State-dependent defects take event-conditioned revisit clauses, never
   probe-conditioned ones** (fast lane — candidate clause for the ticket-craft
   guidance in the ticket-management skill): a revisit condition must be an
   observable event (upstream changelog naming the mechanism, recurrence of the
   failure class), because a passing probe proves nothing while dormant.
   *Warrant*: MCP-414's original retest-on-bump DoD was void the moment the
   defect went dormant; the corrected wording is on the ticket.
   *Falsifier*: a state-dependent defect whose probe reproduces reliably across a
   week of varied runner state would show probes can serve for its class.

No slow-lane (constitutional) proposal: nothing today challenged a
constitution-grade surface. The free-play harvest from the wrap (three marked
associations, one visible discard) routes under its own contract; its
durability-triple seed is napkined and deliberately NOT promoted here.

## Success-test self-check

Three mechanisms named that the estate previously lacked words for
(runner-environment drift; own-liveness staleness; probe-void dormancy) and two
routed proposals. If neither proposal graduates, kills, or changes a decision,
this record was a eulogy — its own falsifier stands.

— Sycamore herds Xylem (`028dc4`), written at seat close 2026-07-30; amendments
additive only.
