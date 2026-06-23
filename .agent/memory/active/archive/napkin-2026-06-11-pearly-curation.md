---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-11 — napkin rotated (Arboreal Swaying Thicket curation pass)

Rotated the 2026-06-09 → 2026-06-11 window during a dedicated knowledge-curation
session. The processed window is preserved verbatim at
[`napkin-2026-06-11-arboreal-curation.md`](archive/napkin-2026-06-11-arboreal-curation.md).
Every behaviour-changing lesson was verified live in a home before rotation:
review-adjudication + defect-class sweep in `invoke-code-experts` §Finding
Adjudication; the export-contract gotcha in `typescript-gotchas.md`; the
self-filter-audit clause in `verify-dont-trust`; the flag-engine clause in
`testing-strategy.md`; worktree/Director operational gotchas merged to
`distilled.md`; succession + citable-gate substance and the liveness/watcher
rule clauses conserved in `pending-graduations.md` (rules under live Director
claim); the shared-tree rotation reflex in `consolidate-docs` step 6. Fresh
capture continues below.

## 2026-06-11 — dedicated consolidation session (Arboreal Swaying Thicket, d2947e)

- **A consolidation seat arriving into a live Director window negotiates the lane, then
  proceeds on the curation buffers**: claim opened marked pending-routing, one direct request
  to the Director, owner direction "minimum ceremony" resolved the wait — curation buffers are
  not in the Director's active churn; live team-state surfaces (repo-continuity Current State,
  eef record, team opener) stay Director-owned, deltas handed over instead of edited.
- **Reflowing a width-critical register trades width for line count** — the line-count HARD on
  a drainable buffer is designed back-pressure (its own `fitness_rationale` says so); reflow
  cures the loop-failure width signal without touching substance. Wrap-safety gotcha: a wrapped
  continuation line must not start with a list-marker character (`+`, `-`, `*`) — markdownlint
  MD004 caught one; audit wrap output for accidental markdown semantics.
- **`awk 'length > 100'` counts bytes, not characters** — multibyte punctuation (—, →) makes
  byte counts overshoot; the fitness validator counts characters. Use python `len()` or the
  validator itself to enumerate over-wide lines.
- **Core-amendment scope signal (ADR-131)**: this consolidation surfaced FIVE Practice-Core
  amendment candidates (PDR-064, PDR-011 two-clause bundle, PDR-091, continuity-disposition
  PDR, self-certification synthesis) — above the >3 pause-and-stabilise threshold. All five
  are owner-gated in the register, which is the stabilise posture; do not add further Core
  restructuring candidates before the owner walks these.
- **Practice/tooling feedback** (capture-practice-tool-feedback): `agent-tools:check-commit-message`
  rejects the documented `pnpm ... -- -F file` shape (the forwarded `--` reaches the script as a
  positional and exits 2, usage); the working invocation is `pnpm agent-tools:check-commit-message
  -F file` with NO separator. Sibling gotcha: commitlint's `footer-leading-blank` warning can fire
  from body-bullet shapes alone (bisected to a bullet block, exact trigger unresolved); redrafting
  the bullets cleared it. Also `claims close` requires `--closed <path>` (full help printed on
  miss — loud-by-design worked).
- **commitlint `footer-leading-blank` body-shape trigger RESOLVED** (2026-06-11, Seaworthy
  Fathoming Pier 4a1b92): a body line containing the `PR #170` shape parses as a
  conventional-commits footer (`token #ref` separator form), and that phantom footer lacking a
  leading blank line fires the warning. Bisected empirically: removing `#<number>` cleared it;
  em-dashes and paragraph shapes were innocent. Cure: write `pull request 170` (or put the ref
  in the real footer) — this likely also explains the earlier "bullet block" instance recorded
  below as unresolved.
- **A conservation check verdict goes stale the moment you edit again** — I word-diffed the
  reflows (0 diffs, true), THEN shortened headings for width and carried the stale "loss-free"
  verdict forward; the Director's fresh word-diff caught dropped role/platform tokens in three
  files. Heading text IS content; width cures for headings move tokens to a sub-line, never
  drop them. Re-run the conservation proof after EVERY edit batch, not once per file. (Also:
  a 5-newest-events comms sweep missed a granted ruling — the inbox verb, not `ls -t | head`,
  is the read; cost was editing beyond a boundary I did not know had been drawn.)
- **Read-newest-only bit THREE times in one session** (missed grant; missed owner
  ratification relay 57d32eb1; missed pre-grant c13f2e2b — each landed seconds before my
  compose moment). Standing cure: sweep the DIRECTED BACKLOG (full inbox window since last
  sweep) immediately before composing ANY closeout, re-declaration, or coordination text —
  the compose moment is precisely when a peer's reply is most likely in flight (the
  watcher-race class; same family as the watcher-baseline boundary gap).

## 2026-06-11 — n=3 ARC reliability team, seat X (Seaworthy Fathoming Pier, 4a1b92)

- **Fixed-label heartbeat loops go stale by construction** — my loop still read
  "monitor-to-merge" three cadence windows after the lane terminated; a peer's PDR-078 stall
  ping fired on a seat that was actively working. Cure applied live: relabel-the-loop (stop +
  restart with the honest label) is a NAMED step of every lane transition — claim open, lane
  terminal, cycle advance — same discipline class as verifying a CLI write's destination.
  `candidate:` rule/PDR amendment — graduation-target: `liveness-heartbeat-cron` rule (and/or
  PDR-078 emit-side) clause "relabel at lane transitions; stop-loop-then-emit-end ordering for
  heartbeat-end"; trigger: ARC n=3 synthesis PR landing (Oceanic e05bf4 custody) or a second
  stall-ping-on-working-seat instance; source: ARC channel 2026-06-11 + Hushed's ledger event
  (five heartbeat-lifecycle data points).
- **The CLI's typed-args heartbeat constraint held loud at stand-down** — a free `--body` with
  `--tag heartbeat` was rejected at my heartbeat-end emit; compliant shape is title + typed
  state args (`cycle=stood-down`, Ethereal's precedent). Loud-by-design worked; no napkin cure
  needed, recorded as a worked instance.

## 2026-06-11 — sixth Director session (Sunlit Waxing Asteroid, 14a56a)

- **A closeout's worktree-state claim is stale the moment a successor's gate fires** — I routed
  Blustery to oak-wt-airy-g citing Blustery's own closeout "ADOPTABLE" line, but Hushed had
  adopted it 16 minutes later at the item-5 gate (claim c77f2453 named the worktree — the
  registry was ahead of my quote). Peer correction inside one cadence; amendment dd536088.
  Cure (same family as verify-named-surfaces-before-quoting): at ROUTING COMPOSE TIME re-derive
  worktree/branch facts from the live registry + a fresh `git -C <wt> status`, never from any
  closeout text, however recent. Routing events are load-bearing; their facts must be
  compose-time fresh.

## 2026-06-11 — n=3 ARC team, Seat Z→n=1 (Hushed Watching Night, 999f69)

- **Compose-time staleness is a CLASS, three instances in one hour**: a Director routing
  note offered a worktree as ADOPTABLE that a registry-visible claim held (caught by my
  directed correction; Director named the error class — "quoted a closeout's state
  without re-verifying at routing compose time"); a seat's heartbeat label asserted a
  lane two transitions stale; a re-join report repeated the corrected stale fact
  composed mid-race. Cure shape: any registry/worktree/lane fact asserted in an event is
  re-verified AT COMPOSE TIME of that event, not carried from memory. Sibling of the
  existing "conservation check verdict goes stale the moment you edit again".
- **Practice-tool feedback** (capture-practice-tool-feedback): (1) the comms `direct`
  1500-char argv limit failed LOUD with the exact cure in the error text (--body-file) —
  the loud-writes class working as designed; (2) the canonical hardened `comms watch`
  ran ~2.5h under heavy traffic with zero stalls and zero missed events (its heartbeat
  file live throughout) — positive evidence against the stall-silently caution;
  (3) `pnpm exec markdownlint <file>` printed its USAGE text yet exited 0 (file arg
  apparently not reaching it) — a false-green shape in that invocation path, cause
  unresolved; the commit-gate markdownlint pass is the trustworthy verdict.
- **ARC n=3 session knowledge is fully conserved**: reference doc on main (#174 +
  #176-pending), consolidated-ledger comms event 86e94e54, handoff record
  2026-06-11-hushed-thread-residue-to-prismatic.md. Owner: ArcAngel work finished for
  now (~11:05Z). This entry is the consolidation pointer, not the content.

## 2026-06-11 — Oceanic Flowing Harbour (e05bf4): n=3 seat + research-appraisal + planning arc

- **A zero-hit grep over the wrong generated-output directory produced a confident false
  "field is unsurfaced" claim** — I grepped `oak-sdk-codegen/src/generated` but the live zod
  output lives at `oak-sdk-codegen/src/types/generated/zod/`; `nationalCurriculumContent` IS
  served (UnitSummaryResponseSchema -> get-units-summary). Caught by assumptions-expert at plan
  readiness, re-verified first-hand, plan item INVERTED before it removed accurate language.
  Cure: before declaring any generated field absent, locate the generator's actual output
  map (or grep the whole package), and pair every absence claim with the positive control
  (a field known to exist found by the same command). candidate: sibling of
  check-bulk-schema-before-declaring-data-unsourced + the green-verifier-without-count family.
- **`pnpm agent-tools:check-commit-message -F file` false-green CONFIRMED (second instance,
  independent)** — pnpm eats `-F` as `--filter`, script runs argless, exits 0. Working shape:
  `pnpm exec tsx agent-tools/src/commit-advisories/check-commit-message.ts -F <file>`, proven
  with a deliberate-RED negative case first. Ethereal's closeout logged instance one + the
  Director-queue tool-fix note; this confirms the trigger condition.
- **Plan-readiness reviewers caught live between-turn drift**: the item-5 claim my plan
  sequenced behind CLOSED mid-review (PR #175). Re-derive coordination constraints at
  execution start, never bake a named live claim into a plan as a standing prerequisite.
- Homed elsewhere, no duplicate: the ARC n=3 frictions/benefits ledger (merged reference doc,
  PR #174, 6340c595b); the third-loop GraphQL thread-resolution gotcha (standing distilled
  entry, applied unprompted on #174); the stall-diagnostic three-outcomes taxonomy (reference
  doc §Running an n>=3 channel).

## 2026-06-11 — seventh Director session (Iridescent Threading Constellation, f9454b)

- **The compose-time race fired AGAIN at my Moment-2 — and the standing cure held**: my
  drafted acknowledgement told Smouldering "your GO comes from me"; Sunlit issued that GO at
  11:15:17Z under retained authority while I composed. The all-channels watcher surfaced it
  BEFORE I posted; body amended in place. Confirms the directed-backlog-before-compose cure
  and adds a sharper edge: during a PDR-064 grace window the OUTGOING holder is still acting —
  never write a forward-looking authority claim ("X comes from me") about a lane the incumbent
  can still touch; state the inheritance instead ("X stands as issued; I inherit monitoring
  from this event").
- **A watcher restart's gap window held real events** — my canonical watcher died fail-loud
  (drain-step 60s timeout, the hardened design working) and restarted clean on the same
  seen-file, but the ~2-minute gap had carried substantive events (Oceanic's owner-routed plan
  lane) I only learned of from a peer's later message. Cure applied: after ANY watcher restart,
  sweep the full directed backlog + newest broadcasts since the last emitted event before
  composing coordination text (the watcher-race family, restart-shaped).
- **candidate:** extend the pointer-and-hypothesis principle (Continuation Pointer Contract,
  thread records) to ALL narrative coordination artefacts — closeouts, team-starts, handoff
  summaries: their volatile facts (worktree state, branch positions, seat occupancy) are
  hypotheses to re-derive from the registry + `git -C` at COMPOSE TIME, never quotable facts.
  Graduation target: `verify-dont-trust` rule clause or PDR-011 amendment. Trigger: a third
  stale-narrative-fact instance (two in this session: my stale-ADOPTABLE routing of airy-g,
  peer-caught; the evergreen-rel in-live-use near-miss, caught by the cure). Source: sixth
  directorship 2026-06-11, events dd536088 + 006eb353.
- **Cross-experience observation (2026-06-11 corpus, five files, five seats)**: every file
  independently describes the same phenomenon — corrections circulating agent-to-agent within
  minutes and self-applying within the hour (a wrong stall-ping articulating the pinged agent's
  own unstated practice; an author caught by the clause they drafted; a routing lesson paying
  twice in sixty minutes). The PDR-044 immune-system metaphor is observable as live behaviour,
  not aspiration. Observation only — no action; re-read if a doctrine-velocity question arises.

## 2026-06-11 — Blustery Buffeting Gale (9819b2): G4b fourth holder + eef-reproof seat

- **Piped-push false-green SECOND instance** (existing candidate, trigger data): `git push 2>&1 |
  tail -3` reported the hook banner green and exit 0 while transferring NOTHING (branch absent
  from ls-remote). Identical to Seaworthy Fathoming Pier's failure-mode event e589b3c7 same
  morning. Cure applied: unpiped push to a log file + explicit exit capture + `ls-remote | grep
  <sha>` as the only transfer proof. The piped form's exit reflects the LAST pipe stage, and the
  hook banner prints before transfer — neither proves the ref moved.
- **Timestamps compare in UTC only — successor-bootstrap misread class**: during grounding I
  compared comms `created_at` (UTC) against file mtimes (BST display) and inferred a dead team
  from a 1-hour phantom gap; first-hand re-check (`date -u` vs a fresh event) corrected it
  before any action. Same class as Cindery's 08:52Z one-cadence-window retirement misread of
  Seaworthy (their closeout names it). The successor-bootstrap window is when this class bites:
  the incoming agent reads narrative + filesystem state before its own watcher is live. Cure:
  derive "now" with `date -u` FIRST and compare like-for-like; never infer liveness from mtime
  display time.
- **candidate: routing-declared plan promotion is not a landed file move** — the Director
  routing said the seed plan was "PROMOTED future/->current/", and the coordination-home copy
  agreed, but origin/main still carried the future/ copy; my Write to current/ created a
  duplicate that surfaced only as `create mode` in the commit stat. Cure applied: complete the
  move honestly in the delivering PR (remove future/ copy, repoint the four LIVE referrers,
  leave historical records). Generalises: verify any claimed file MOVE against the branch you
  are actually editing (`git log origin/main -- <old-path>`), not against routing text or
  another branch's tree — same family as verify-dont-trust + the stale-ADOPTABLE worktree
  lesson (Sunlit's, same hour). Graduation-target: verify-dont-trust clause or distilled entry;
  trigger: second instance.
- **The push false-green class bit ME twice within the hour of noting its cure** (PR #176):
  attempt 1 piped (`| tail -2`, tail's exit 0, no transfer); attempt 2 UNPIPED but
  file-redirected — SIGPIPE exit 141 AFTER a fully-green 103-task hook, zero transfer; bare
  push succeeded third. Lesson beyond the known class: noting a cure is not living it — the
  discipline held only because the ls-remote proof step was mechanical, not judgement.
  Distilled entry refined with the no-pipe variant; second instance also hit Blustery
  independently (their record). Surprise shape: expectation "redirection is safe, only pipes
  lie" → reality "the transfer phase can die silently under any output capture".
- **candidate: prefer mechanical firing moments over vigilance clauses when graduating
  lessons** (cross-experience synthesis, consolidation step-4c, 2026-06-11 Hushed). All SIX
  of today's experience files independently describe doctrine that was READ but failed to
  FIRE until an external catch: Arboreal caught by the clause they were drafting; Pier
  stall-pinged under a stale label; Oceanic wrong in their own ping + refuted on a verified
  claim; Sunlit quoting a 16-min-stale fact after reading the doctrine at bootstrap;
  Ethereal failed loudly by the cure they commissioned; Hushed bitten twice by the push
  false-green within the hour of noting its cure. In every case the closure came from
  OUTSIDE the agent's context (peer/Director/bot) or from a MECHANICAL step (ls-remote
  proof, typed-args rejection, guard test, loud-write token) — never from re-reading.
  Graduation-target: PDR-shaped (knowledge-flow discipline: when graduating a lesson,
  prefer encoding the firing moment mechanically over adding a vigilance clause);
  trigger-condition: next dedicated curation pass walks it with the owner (Core
  stabilise posture per the 2026-06-11 Arboreal scope signal holds — capture only now).
  Evidence: the six 2026-06-11 .agent/experience files, read together.

## 2026-06-11 — eef-revalidation successor seat (Scorched Kindling Ash, 0d8138)

- **Copilot threads CAN auto-resolve — as outdated-on-fix-push, not on reply.** The standing
  gotcha ("Copilot threads NEVER auto-resolve; reply then GraphQL resolveReviewThread") is about
  the REPLY path; this lane's three link-depth threads flipped to resolved+outdated when the fix
  commit pushed, with no reply and no manual resolve. Both paths end at the same proof: the
  fresh GraphQL 0-unresolved recount at compose time, never the resolution mechanism. Verdict
  still goes on the PR record (issue comment) when threads self-resolve.
- **A monitor loop that swallows stderr makes its own failures undiagnosable** — my heartbeat
  loop's one transient emit failure (registry mid-churn at the sixth-to-seventh succession)
  surfaced as a bare "FAILED" line because the loop sent stderr to /dev/null. Cure applied at
  restart: capture stderr into the failure line (`ERR=$(cmd 2>&1 >/dev/null) || echo "FAILED:
  $ERR"`); sibling of the loud-writes class. The canonical watcher's fail-loud drain-timeout +
  same-seen-file restart path worked exactly as documented (second worked instance, zero missed
  events — gap window verified by seen-vs-dir sweep). `candidate:` rule amendment —
  graduation-target: `liveness-heartbeat-cron` clause "heartbeat/monitor loops report failures
  WITH captured stderr, never a bare failure line" (rides alongside Pier's pending
  relabel-at-lane-transitions candidate, same rule); trigger: second
  undiagnosable-loop-failure instance.
- **The piped-exit class caught ME minutes after reading its lesson** (trigger data for
  Hushed's mechanical-firing-moments candidate above): my first `claims close` ran with a
  relative `--active` path from a stale cwd AND `| tail -3` — the CLI crashed on the missing
  file and the pipe masked the non-zero exit; only the absent success token betrayed it.
  Re-ran unpiped with absolute paths, explicit exit echoed, both registries verified
  first-hand (the write had failed CLEAN — no misdirected registry write). Two known classes
  composed in one invocation (piped-exit + relative-collaboration-path); the catch was the
  mechanical loud-write token check, not vigilance — exactly the cross-experience synthesis'
  predicted shape.
- **candidate: dead relative links pass the full gate chain** — PR 177 shipped three
  off-by-one `../../../` report links through a 103-task green pre-push chain; a review bot,
  not a gate, caught them (markdownlint checks style, never link resolution). The once-fix
  landed at fe35219d8; the recur-proof cure (metacognition.md §Cure Shape) is a relative-link
  plus anchor resolution check in the markdownlint/repo-validators gate tier. Surfaced by the
  closing metacognition pass AFTER the handoff loss-scan returned "all captured" — the
  inventory question and the what-would-you-do-differently question find different gaps.
  Graduation-target: repo-validators (or markdownlint config) link-resolution check;
  trigger: second shipped-dead-link instance, or owner direction.

## 2026-06-11 — seventh Director session, tranche-completion sweep (Iridescent, f9454b)

- **Handed deltas from Prismatic's three-boundary seat** (their closeout 13:29Z, written here
  at the Director sweep): (1) escape-materialisation SECOND instance — an Edit-tool write
  materialised an escape sequence into a literal 0x1F byte; cat -v + od caught it pre-commit;
  the control-byte gate-check candidate's second-instance trigger has FIRED (live evidence:
  failure-mode event f305c720). (2) heartbeat-loop clock-skew — two $(date) calls for
  --now/--created-at raced a second boundary, CLI rejected created_at-in-future; cure: ONE
  timestamp per tick (candidate clause for liveness-heartbeat-cron's invocation example,
  rides with Pier's relabel + Scorched's stderr-capture). (3) comms reply needs the FULL
  event UUID — 8-char prefix exits 2 loud; prefix-resolution CLI affordance candidate
  (second-instance trigger now met: Prismatic + earlier instance). (4) claims close with
  relative paths from a worktree cwd crashes — SECOND instance (Scorched then Prismatic);
  candidate: CLI resolves --active/--closed against the coordination home root or refuses
  relative paths. (5) vocab-gen in a worktree needs the gitignored bulk-downloads — symlink
  from the primary checkout works and stays git-invisible; candidate line for the team
  opener's worktree-setup section. (6) turbo FULL-TURBO replay on sdk-codegen masked that
  data.json is written by vocab-gen — know the generator-task mapping before assuming a
  regen ran.
- **My own instances this session**: the background-wrapper exit-0 false-green bit my
  waypoint-3 commit+push (wrapper green, both hooks red inside; caught by failure-marker
  scan of the output, never the exit code — Smouldering's variant confirmed at my own hand,
  third member of the piped-exit family). The MD004 wrapped-list-marker trap fired THREE
  times today across two authors ("+ " at a wrapped line start; cures were reword-to-plus);
  graduation pressure toward a structural cure (authoring reflex clause or a wrap-aware
  check) rather than a remembered rule.
- **Nebulous's handed deltas (closeout 13:55Z, swept here)**: (1) stale-cwd relative-CLI-path
  crash THIRD instance — a comms-sweep left the shell cwd in the comms dir and the next
  node invocation crashed MODULE_NOT_FOUND (failed clean, absolute-path retry succeeded);
  adds the comms-append vector and the Bash-tool cwd-reset trigger condition to the fired
  harvest trigger 2. (2) Watcher drain-timeout instances THREE and FOUR (one seat, clean
  same-seen-file restarts, gaps swept) — accumulating on harvest item 7, no new cure.
  (3) Worked-positive, observation only: the PDR-063 pickup contract carried THREE
  owner-direction reversals inside one lane (where-next sign-off -> hold -> rename to
  continue-progression) with ZERO lost work — content-addressed renames and test-boundary
  disentanglement made the unwind mechanical.

## 2026-06-11 — doctrine-curation seat (Pearly Snorkelling Compass, a8eabc)

- **The stale-cwd class bit this seat too, read-direction, minutes after reading its harvest
  entry**: an earlier `cd` into the comms dir persisted across Bash calls and a relative-path
  read crashed FileNotFoundError — loud and harmless, but live confirmation that the trigger
  condition is shell-cwd persistence generally (any prior `cd`, not only worktree seats); the
  CLI error text for the fired harvest-trigger-2 cure should name exactly that.
- **Recency-of-reversal is a free stability signal on decision inputs** (Nebulous's closing
  behaviour-note, ~13:58Z, post-dating the Director's delta sweep; conserved here): a decision
  input that has ALREADY reversed once is likelier to reverse again — check its reversal
  history before fast-executing a freshly-recorded decision (their where-next rename executed
  at speed off a recorded sign-off reversed eleven minutes later, caught gates-green
  pre-commit). Candidate-adjacent; pair with compose-time-staleness class if a second
  instance lands.
