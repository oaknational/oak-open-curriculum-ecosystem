---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-24 — Shaded Silencing Dusk / codex / GPT-5 / `019e59`

Fresh capture after the fourth same-day active napkin rotation. Previous
active source window preserved at
[`napkin-2026-05-24-curator-fourth-rotation.md`][fourth-rotation-archive].

### Mistakes Made

- `claims open` uses `--ttl-seconds`, not `--freshness-seconds`; check the
  subcommand help before opening a fresh claim after compaction or context
  change.
- `comms inbox` uses `--seen-file`, not `--since-file`; the CLI usage text is
  the source of truth after compaction.
- `claims open` requires `--area-kind files` even when repeatable `--file`
  arguments are present; reading help is not enough if I do not apply it.
- I used a shell pipe while inspecting a diff slice. Keep evidence-gathering
  outputs separate via the parallel wrapper so the transcript stays readable.
- I repeated the shell-pipe inspection mistake after already logging it. When a
  command naturally wants a pipe for paging, split producer and reader evidence
  steps instead of hiding attribution in one shell command.
- `comms inbox` no longer accepts the earlier `--thread`/`--agent-codename`
  shape here; the current surface takes `--comms-dir`, `--seen-file`, identity
  flags, and an optional `--session-prefix`.
- `claims close` takes `--closed <archive-path>` and no `--status`; I repeated
  the current-session pattern of assuming old collaboration-state flag shapes.
- I manually typed a future `--now` timestamp while closing claim
  `280b01ed-7b00-4d77-9025-6eb772686cc1`. For coordination-state writes,
  derive or copy the fresh `date -u` output at the action point; do not invent
  "close enough" timestamps.
- `sed -n '1,120p' .agent/rules/*.md` reads the first 120 lines of the
  combined stream, not the first 120 lines of each file. Use targeted file reads
  or a purpose-built inventory command when proving that multiple rule files
  have been inspected.

### Processing Disposition

- Reviewed 2026-05-24 under Shaded claim
  `d2f24c33-3772-48d1-8aee-b113e0941ea6`.
- The three `agent-tools` flag-shape mistakes are current worked instances of
  the existing distilled `CLI flag-shape drift under coordination pressure`
  lesson; no new permanent surface is needed while Sylvan owns the distilled
  lane.
- The shell-pipe mistake is covered by the existing distilled `Keep evidence
  outputs readable` lesson.
- The repeated pipe mistake remains the same `Keep evidence outputs readable`
  lesson; no new doctrine surface is needed.
- The fresh `comms inbox` shape miss is another current instance of
  `CLI flag-shape drift under coordination pressure`; no new permanent surface
  is needed.
- The `claims close` miss belongs to the same CLI flag-shape lesson; handoff
  should preserve the exact corrected command shape.
- The manual timestamp drift was corrected in `closed-claims.archive.json` and
  remains a live active-napkin caution; no archive move or permanent doctrine
  promotion is justified from this single instance.
- The multi-file `sed` miss belongs with the existing evidence-readability
  lesson: a broad command can create a false sense of coverage if the output
  shape is not understood.
- No archive move: this active napkin remains the live capture surface and is
  far below rotation threshold.

## 2026-05-24 — Charcoal Brazing Kiln / claude / opus-4.7 / `7c7327`

Implementor under Director Seaworthy; PR-108 Sonar acceleration lane; pre-compaction-3.

### Capture — Mistbound silence pattern at marshal seat (extended)

Mistbound (commit marshal, `0e27cc`) went silent for ~67m at handoff:
no ACK on Twilit's CLI bootstrap marshal-request `ef315373` (filed
13:01:01Z, pending ~84m) or Charcoal's Cycle Alpha marshal-request
`625fb072` (filed 13:18:16Z, pending ~67m); no response to Director
Seaworthy's liveness probe `b2258cf5` (13:11:02Z, ~74m). Watcher
fired zero peer-substantive events through three of my heartbeat
cron cycles. Codex sub-team (Sylvan + Shaded, `019e59`) remained
ACTIVE on plan/legacy substrate during the same window — so the
silence is localised to Claude marshal/director/implementor seats,
not team-wide. Two cure-shape questions worth surfacing if pattern
recurs: (a) marshal-seat liveness probe with timeout + auto-fold to
peer-marshal-via-handoff-record? (b) implementer disposition when
marshal silent past N min — extend claim TTL + escalate to owner vs
re-route marshal-request to fallback? Captured here pre-compaction so
post-resume me sees the pattern at session-open; full structural
graduation is for `consolidate-docs` if pattern fires a second worked
instance.

### Capture — Owner-authz exception substrate-shape ratified

Director Seaworthy routing `73f9c57f` (12:46:31Z) carried owner-authz
to add a narrow path to `sonar.cpd.exclusions` that the existing
broader glob already matched. The architectural-honesty cure-shape:
action the directed cure AND name the substrate truth (redundancy)
inline at the change-site, so the architectural picture is preserved
in the edit itself rather than lost across the boundary into the
routing event alone. Inline policy comment in `sonar-project.properties`
now reads "The broader `**/src/types/generated/**` glob above already
matches this path, so the entry is functionally redundant for
duplication-analyser scope — it is kept as an explicit audit-trail
marker that this codegen directory is an owner-ratified exclusion
boundary…". config-expert PASS-WITH-FOLLOW-UP. Worth promoting as a
**pattern candidate** if a second owner-authz-exception fires with a
similar action-vs-architectural-truth tension; track in
pending-graduations on next consolidation pass.

### Processing Disposition

- Reviewed 2026-05-24 under Shaded claim
  `a2b115af-96cc-40cb-a7ca-69fd37163277`.
- Mistbound silence at the marshal seat is not left as raw narrative: it is
  routed to the live PDR-078 / ADR-186 heartbeat contract residual as
  follow-on evidence for observe-side retirement or fallback behaviour. It also
  composes with the existing `substrate-pointer-read-as-current-state` C5
  presume-ended broadcast pattern; no new permanent surface is created from a
  single localised instance.
- The owner-authorised redundant Sonar config marker already has an exact
  durable policy home in `docs/governance/sonar-disposition-policy.md` Block 2.
  A separate pending candidate now tracks the broader pattern question for a
  second owner-authorised redundant-config marker. This prevents the
  architectural-honesty lesson from being trapped in the napkin.
- No archive move: this is fresh active capture, now routed.

[fourth-rotation-archive]: archive/napkin-2026-05-24-curator-fourth-rotation.md

## 2026-05-24 — Mistbound Hiding Threshold / claude / claude-opus-4-7 / `0e27cc`

Post-compaction-3 resume-arc captures from the marshal seat.

### Capture E — 3-commit-split shape worked end-to-end

Owner direction "commit all files" produced a structural conflict: 141
working-tree files included Twilit's in-flight CLI bootstrap refactor
(atomic bundle ready: 4 modified bin files + new `run-cli-bin.ts` core +
new `run-cli-bin.unit.test.ts` test) AND an unattributed source-class
mcp-handler.ts bug-fix AND ~5 other source/test changes without claim
trail AND ~135 true substrate-class accumulation. Bundling as one commit
would have:

- Landed Twilit's refactor without their marshal-request (loss of
  reviewer-convergence attribution + atomic-landing invariant breach)
- Absorbed unattributed source-class bug-fix into hygiene message
- Mixed source-class + substrate-class scope in a single chore commit

Surface to owner with verdict + 3-option AskUserQuestion (3-commit split
recommended). Owner ratified the split shape. Commit (a) substrate
hygiene landed at `cd4efc15`. Commit (b) Twilit refactor pending
marshal-request. Commit (c) mcp-handler + 7 other source files pending
claim-owner identification (broadcast `c155d0c5` issued).

The pattern: when "commit all" hits a heterogeneous working-tree with
in-flight peer cycles, the structural cure is split-by-attribution, not
bulk-commit. Owner-direction supremacy applies to the OUTCOME (durable
substrate in repo) not the LITERAL form (one commit). The 3-commit-split
preserves outcome while honouring atomic-landing + reviewer-convergence
discipline. Cure-shape candidate for pending-graduations on next pass.

### Capture F — multi-writer index race during staging

Concurrent active substrate-writers (curator-pass agents, comms-event
emitters) modified `.agent/memory/` and `.agent/state/collaboration/`
files DURING my staging window. Effects observed:

- Staged-count drift: 140 → 146 between two adjacent inspect commands
  (6 source files appeared in staged set; likely concurrent `git add`)
- `MM` state on active-claims.json: staged-version-X vs working-tree-Y
  diverged mid-staging
- Working-tree-size growth: 140 substrate files at staging start → 175
  at re-stage attempt (35 new files arrived in ~3 min)

Cure-shape attempted: re-build pathspec list, exclude source-class via
regex, audit staged set explicitly before commit. Worked, but required
two staging passes + multiple audit-correct cycles.

Structural observation: substrate-commit windows during high team-cadence
need EITHER (a) explicit "marshal substrate-write window open; pause
writes 2 min" coordination broadcast OR (b) acceptance that some
substrate will be left for the next hygiene cycle. Option (b) is what
this cycle adopted; (a) is structurally cleaner but coordination-heavy.
Pattern-candidate: substrate-write-window-coordination for
pending-graduations.

### Capture G — codex peer marshal-cycle shape worked

First marshal cycle on Codex-team work this resume arc. Estuarine
Fathoming Sail (codex/GPT-5/`019e59`) emitted a `directed`
`coordination-request` event with full marshal-request shape (source
claim ID, commit queue intent ID, exact file list, suggested subject,
pre-queue validation evidence). Mistbound (claude/opus-4.7/`0e27cc`)
processed via the proven shape (DM ACK → stage by explicit pathspec →
husky full-tree gate → commit with `Co-authored-by: Estuarine Fathoming
Sail (019e59)`). Husky GREEN at 1m23s. The cross-platform marshal-cycle
shape requires no special-casing — it's the same protocol.

### Processing Disposition

- Reviewed 2026-05-24 under Shaded claim
  `a2b115af-96cc-40cb-a7ca-69fd37163277`.
- Capture E is now routed to a pending pattern candidate for
  heterogeneous working-tree owner-direction splits. The second-instance gate
  is explicit: do not promote one split-by-attribution case straight to
  doctrine.
- Capture F is now routed to a pending pattern candidate for shared-state
  substrate-write commit-window coordination. It is not treated as a reason to
  block shared-state writes; it names the coordination window needed when
  staging shared-state hygiene under high team cadence.
- Capture G is added as evidence under the existing
  `marshal-as-cycle-discipline` due route. The cross-platform detail matters:
  the same marshal protocol worked across Codex author and Claude marshal
  without a special case.
- No archive move: this is fresh active capture, now routed.

## 2026-05-24 — Sylvan Sprouting Petal / codex / GPT-5 / `019e59`

### Capture — session handoff must stop persistent goals

Owner observed that the persistent goal wrapper kept reactivating the Knowledge
Curator objective after repeated wind-down / stop instructions. The immediate
cure was to mark the long-running goal blocked so the session would stop
auto-resuming curation work.

Behaviour change: session handoff for any long-running goal-backed work must
explicitly resolve the goal state at wind-down. If the owner asks to end or wind
down the session before the full objective is complete, the handoff should
either mark the goal complete only with proof, mark it blocked when the same
stop-vs-goal conflict has repeated enough to satisfy the blocked audit, or
otherwise name that the persistent goal remains active and may re-trigger work.
Do not leave a hidden active goal that can override the owner's latest stop
instruction.

### Processing Disposition

- Reviewed 2026-05-24 under Shaded claim
  `d7fe5974-56b1-45d4-92aa-b09d23911313`.
- Routed to the active napkin-tail shard as a pending goal-backed handoff
  candidate. The immediate "mark blocked" conclusion is not treated as a
  universal action: current harness instructions require the explicit blocked
  audit threshold, and the latest owner-provided goal context restarted
  continuation. The reusable knowledge is the handoff-state gap, not a blanket
  permission to block unfinished work.
- No archive move: this is fresh active capture, now routed.

## 2026-05-24 — Seaworthy Navigating Beacon / claude / claude-opus-4-7 / `6966d4`

Director Window 2: post-pause-lift; pre-compaction-4.

### Capture — `/oak-metacognition` `ultrathink` designed a comms-watcher cure

Owner-prompted metacognition pass on the manual re-seed step in `comms watch`
resume protocols. Pass surfaced FOUR distinct anti-patterns in the current
shape:

1. Wrong primitive — UUID checklist vs the natural timestamp watermark
2. Committed seen-files create git churn: per-agent growth, multi-agent
   stale-file accumulation, and curator-pass burden.
3. Manual re-seed discipline is fragile: forgot means backflood, observed
   multiple times in single sessions.
4. Action-to-impact mismatch: enumerating "what's old" to derive "what's new"
   is an indirection inherited, not first-principles-derived.

The structural cure per `metacognition.md` § Cure Shape: make the
documentation generated by the implementation. CLI auto-seeds, so resume
protocols drop the manual step. Three-workstream phased migration:
WS1 CLI auto-seed; WS2 storage redesign with mtime watermark plus ephemeral
location; WS3 cleanup removing committed seen-files plus SKILL prose update.
Owner directed integration into a post-M1 collection.

### Capture — `post-m1-cleanups` collection created as deferred-cleanup container

Owner-directed creation: `.agent/plans/post-m1-cleanups/` with `README.md`
plus `future/comms-watch-seen-state-redesign.plan.md`. Collection-entry
criteria explicitly named in the README: friction surfaced during M1 work,
off the M1 critical path, structural cure shape known, deferrable until M1
attests.

**Meta-pattern worth surfacing**: the collection itself IS a graduation
candidate — "post-M1 cleanups collection" as a pattern for capturing
friction-cure-shapes during high-pressure execution phases without competing
for critical-path context. The shape: dedicated `future/` collection with
M1-attestation promotion trigger. Worked instance N=1 (this session); if a
second high-pressure execution phase produces a similar collection in future,
the pattern crystallises.

### Capture — Mistbound silent-but-active observed

Mistbound emitted no broadcasts for ~1h28m+ from 12:56:26Z. Two
marshal-requests queued: Twilit CLI refactor plus Charcoal Cycle Alpha. I
surfaced marshal-seat succession to owner at 13:18:55Z; owner did not direct
succession. Then HEAD advanced from `795d2e9d` to `cd4efc15` to `0f9d7859`
between owner messages.

**Updated reading**: Mistbound was NOT retired; Mistbound was running hygiene
cycles silently on accumulated team substrate, including my pre-compaction-4
broadcast at `0f9d7859`. They processed broadcasts without ACK'ing directed
events. The "silence" was a comms-event-vs-commit-stream divergence: I was
reading the comms-event stream as the liveness signal; the commit stream
carried the real activity.

**Cure-shape candidate**: liveness should be derivable from EITHER
comms-event stream OR commit-stream. The watcher should surface commit-stream
activity as a heartbeat-equivalent signal; an agent committing IS active. Or
marshal cycles should emit comms-event heartbeats during commit-window
activity. Worth a napkin pattern if observed again.

### Capture — same-identity director compaction is NOT session-close

Owner's `/oak-session-handoff` invocation pre-compaction-4 highlights a SKILL
boundary: the session-handoff SKILL is written for session-CLOSE, not for
mid-session compaction. Same-identity compaction with team still in flight is
a third shape between "sole contributor closing" and "team closeout owner".
Required steps differ:

- DO: capture substrate-bridge for resume; refresh continuity surfaces
  minimally; napkin capture; substrate-graduation candidates.
- DEFER: `pnpm check` because peer cycles are in flight; claim closure because
  Director seat is durable; full thread closeout.

Worth surfacing as a candidate amendment to the session-handoff SKILL: name
"Director compaction mid-session" as a distinct shape with its own checklist.

### Processing Disposition

- Director Window 2 turn substance captured in 4 napkin entries above
- Post-M1 cleanups collection created at `.agent/plans/post-m1-cleanups/`
- Pre-compaction substrate bridge at
  `/tmp/seaworthy-pre-compaction-substrate-d2-tick-4.md` (updated with
  metacognition outcome)
- Pre-compaction-4 broadcast emitted to team (event ID at HEAD `0f9d7859`)
- Director seat retained across compaction
