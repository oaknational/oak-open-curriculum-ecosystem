---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-11 — napkin rotated (Pearly Snorkelling Compass doctrine-curation pass)

Second rotation of 2026-06-11, closing the post-Arboreal capture window during the
owner-named doctrine-curation session (naming event 211a1794; lane grant c8432d36). The
processed window is preserved verbatim at
[`napkin-2026-06-11-pearly-curation.md`](archive/napkin-2026-06-11-pearly-curation.md).
Every item left with a disposition before rotation: the four fired harvest triggers and
nine accumulating candidates are registered in `pending-graduations.md` (two new 2026-06-11
sections) with first-hand-verified instance counts; the liveness-heartbeat-cron loop-hygiene
amendment was drafted and ACCEPTED by the Director (events ca24c8d8 → adjudication 14:04Z);
behavioural lessons graduated to `distilled.md` (control-byte write-direction vector,
background-wrapper exit-0 family member, directed-backlog-before-compose, UTC-only
comparisons, commit-message drafting gotchas); the repo-continuity condensation and the
team-opener vocab-gen symlink line were handed as Director deltas (event a3279acf, received
14:08Z). Carried-forward live items below; fresh capture continues after them.

## Carried forward (live, not residue)

- **Core-amendment scope signal (ADR-131) — posture RESOLVED by the 2026-06-11 owner walk**:
  the owner walked all five Practice-Core amendment candidates (PDR-064, PDR-011 two-clause
  bundle, PDR-091, continuity-disposition PDR, self-certification synthesis → PDR-089) plus
  the PDR-078 emit-side facet and the mechanical-firing-moments PDR at the dedicated
  consolidation session, approving every one for authoring (per-item statuses in the
  register). The pause-and-stabilise posture lifts when those approved amendments land;
  still do not add NEW Core restructuring candidates while the approved set is in flight.
- **Tool feedback RESOLVED 2026-06-12 (Forge turns Basalt, root cause found first-hand)**:
  `pnpm exec markdownlint <file>` printing USAGE yet exiting 0 (Hushed, 2026-06-11, cause
  then unresolved) is markdownlint-cli's **dot-directory exclusion** — without `--dot`, any
  path under `.agent/` (or any dot dir) matches ZERO files, so the CLI prints usage and
  exits 0: a structural false-green, not a flake. Proven by paired controls: a root-level
  bad file fires without `--dot`; the same bad file under `.agent/` fires ONLY with `--dot`.
  Cure: targeted markdownlint on dot-dir paths always passes `--dot` (the root script
  `markdownlint --dot .` already does), and any targeted run is trusted only after an
  in-repo dot-dir negative control proves detection. Sting in the tail: every targeted
  "markdownlint OK" this seat ran on `.agent/**` paths before the discovery was void
  (zero files linted); the re-run with `--dot` over all ten session-touched files is
  genuinely green, and prettier checks were real throughout.

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
  pre-commit). Candidate-adjacent; pair with the compose-time-staleness class if a second
  instance lands.
- **Three late Director instances (post-tranche window, my own hand)**: (1) rebuilt a combined
  PR monitor WITHOUT comment detection — the EXACT 2026-06-10 watcher-rewrite class the
  opener's cadence section warns about; caught by the owner pointedly selecting that clause;
  rebuilt with state+checks+comments+unresolved and an explicit all-terminal exit. (2)+(3)
  TWO worktree-singleton interleaves: switched the worktree's branch while a background gate
  chain was still running in it (the trailing HEAD reads re-pointed mid-task; pushes were
  transfer-proven unaffected). Cure: ONE gate chain at a time per worktree — the
  check-singleton-per-window discipline applies to a worktree's whole commit/push window, not
  just pnpm check. All three are same-day further evidence for the session report's central
  finding (the author of the report performed its thesis while writing it).
- **Fourth same-day self-instance: granted-window-then-own-commit collision** — I cleared
  Pearly's final micro window, then started my own waypoint commit into the same checkout;
  git add hit THEIR index.lock (failed clean, foreign lock respected, no rm). The grantor of
  a commit window must treat the grant as exclusive until the grantee's PUSH closes it — the
  window spans the gate chain, not just the staging moment. Cure applied: bounded ls-remote
  wait for the grantee's transfer before opening my own window.
- **Background-process audit (owner-directed) found the drain-timeout exit is NOT an exit** —
  the watcher emits the fail-loud WATCHER ERROR line but the node process LINGERS: both of my
  "dead" watchers were still running hours later, sharing my seen-file + heartbeat-file with
  the live one (three writers, one file), and two orphan watchers survived a stood-down
  session entirely. Probable feedback loop: zombie drains add I/O load on the same comms dir,
  worsening the drain times that kill watchers. Cure shape for the routed agent-tools lane:
  the timeout path must process.exit AND the supervisor must kill the process tree; restart
  guidance should include a stale-process census (ps for prior watchers on the same
  seen-file). Cleanup: TaskStop killed mine cleanly; orphans killed by pid.
- **Forename-keyed /tmp filenames collide across same-forename agents** (curation seat, at
  handoff): my closeout draft Write to `<scratch>/pearly-closeout.md` hit yesterday's Pearly
  Snorkelling DOCK file at the same default path — caught by the Write tool's
  read-before-overwrite guard (mechanical, again). Cure applied: identity-qualified temp
  names (`pearly-compass-<purpose>-<date>`). The PDR-027 full-name+prefix discipline,
  /tmp-shaped.
- **candidate: PDR-081 curator-ledger clause vs `permanent-doc-is-the-consolidation-record`
  rule — apparent contradiction** (curation seat, first-hand read of both surfaces): the team
  SKILL §3 (citing PDR-081) names "the per-pass metadata file under the operational-memory
  curator-passes directory" as the curator's traceability surface, while the newer canonical
  rule forbids disposition ledgers (the commit and the permanent home are the record). This
  pass followed the RULE — no ledger written; commits + register + comms are the record.
  Graduation-target: reconcile at the next curation-doctrine touch (PDR-081 amendment retiring
  the ledger clause, or a pass-metadata vs disposition-ledger scope clarification). Trigger:
  next curator-pass invocation or owner direction.

## 2026-06-11 — dedicated consolidation seat (Thermal Circling Updraft, f42c24)

- **Director-became-implementer is a missing-autonomy-primitive signal** (handed delta,
  Iridescent event e17324ff, conserved verbatim in substance): the seventh directorship
  started as pure coordination (routing up to 7 live implementers) and ended as solo
  implementation — the Director personally authored the host-load rule + its two-wave
  matcher fix, the operations report, and the team-opener generalisation plan, with no
  implementer pool left to route to. Legitimate under the degenerate-team exception
  (owner directing the Director at named deliverables), BUT the pattern is load-bearing
  evidence: the human-pasted opener and the human-in-the-loop Director exist for the same
  reason — the collaboration infrastructure cannot yet carry a long-running team
  autonomously. The session's manual toil (hand-rolled PR monitors, manual merge
  serialisation, six continuity waypoints by hand) is exactly what the generalisation
  plan proposes to systematize. Candidate framing for the doctrine pipeline: "a Director
  doing sustained implementer work is a missing-autonomy-primitive signal" (sibling of
  feedback_owner_action_is_not_a_cure). No graduation proposed; conserve for the owner
  walk on the generalisation plan.
- **The 15-of-18 withdrawal failure REPRODUCED at this seat — 14 of 18, different agent,
  fortnight later, same mechanism.** My backlog triage proposed 18 withdrawals with
  named coverage homes; the owner confirmed them on my claims; a 25-agent adversarial
  refutation pass (owner-directed workflow fan-out) then refuted 14 — the same two
  conflations as the 2026-05-29 precedent: (a) "the instance/reference has a home" read
  as "the pattern-candidate substance has a home"; (b) absence-of-recurrence read as
  permission to drop an unhomed signal. Several refuted rationales had ALREADY been
  refuted verbatim by the Tempestuous pass, which I had read that morning — read-doctrine
  did not fire; the mechanical refutation stage did. A THIRD conflation shape surfaced in
  the fold refutations: inventing a fold target by synthesis-convenience, overriding the
  item's own recorded `target:` field (four of seven folds misrouted this way — the
  verifiers caught it by reading the field I had written past). Net: only 4 withdrawals
  stood (two with corrected rationales). Lessons banked: (1) adversarial-verify-before-
  withdrawal is now twice-proven as the mechanism for this exact failure (graduated
  same-session as PDR-089 Decision 8); (2) an owner confirmation obtained on my unverified
  claims is not authority once the claims fall — surface the revision, do not hide behind
  the confirm (PDR-091's interpretation clause, lived); (3) an item's recorded target
  field outranks the consolidator's synthesis convenience.
- **Workflow-tool args delivery gotcha**: a `Workflow` launch with a JSON-object `args`
  failed instantly (`pipeline() expects an array`, zero agents ran) — `args.items` did not
  resolve to an array inside the script. Cure that worked: a defensive guard at script top
  (`typeof args === 'string' ? JSON.parse(args) : args`, then accept either the array or
  `.items`, throw loud if empty) + relaunch with `resumeFromRunId` — the journal replay ran
  clean. Future workflow scripts in this repo should carry the guard by default.
- **Dash-leading grep patterns are an argv hazard — and my own piped-push lived instance**:
  `git push 2>&1 | grep -E "->|..."` failed twice over — ugrep consumed the `->`-leading
  pattern as an option, AND the pipe meant the push never transferred (ls-remote showed the
  old SHA; the bare re-run transferred). Confirms the distilled unconditional push-proof
  doctrine end-to-end at this seat; sharp new detail: any pattern beginning with `-` needs
  `-e <pattern>` or `--`. Cure applied and held: pushes bare, proof = transfer line + fresh
  ls-remote.
- **Adding a skill is a two-gate, possibly owner-keyed operation**: the pre-push
  portability validator requires a `Skill(<name>)` + `Skill(<name>:*)` pair in
  `.claude/settings.json` permissions.allow for every Claude adapter, and the harness
  classifier may block the agent's own settings.json edit as self-modification — by
  design; the cure is an explicit owner authorisation moment (worked instance this
  session, owner-keyed in-chat within a minute). Expect the two-step when landing any
  new skill: canonical + generated adapters, THEN the owner-visible settings entry.

## 2026-06-11 — solo-window staged-bundle lesson (Swift Gliding Zephyr, aba87a)

Authored inside the 2026-06-10 team-shape section on the naming branch after main's
Arboreal rotation archived that section, so main's archive copy lacks it; carried
forward verbatim at the naming-lane semantic merge:

- **"Solo window" is a point-in-time observation, not a session property** (Swift Gliding
  Zephyr, 2026-06-11): claims registry empty at session open + at WS1.1 → skipped the
  commit-queue ceremony as solo-window lean path; by WS1.2 a peer had staged a 4-file
  bundle (plan, report, lane README, closed-claims archive) and my `git commit` absorbed
  it — `git add` is pathspec-scoped but commit takes the whole index. Cure adopted
  mid-session: `git diff --cached --name-only` verified against the intended bundle
  IMMEDIATELY before every `git commit`, halt on any foreign entry. The queue ceremony's
  verify-staged step is collision protection, not ceremony, even when the registry reads
  empty.

## 2026-06-11 evening — oak-prod snagging wave 2 (Dawnlit Glimmering Orbit, 50c2d1, cursor)

NOTE: wave-1 captures (Cursor drops structuredContent-only tool results; schema-skip instance;
session-env recovery via `.cursor/oak-composer-session.local.json`; Cursor-Shell pre-push turbo
SIGABRT + file-redirect cure; piped-exit false-RED wrinkle) are napkin'd on branch
`docs/graph-team-direction-2026-06-10` (`ae5372e2c` + `c9ff6bb49`) — reconcile on merge. This
branch's additions:

- **The shared checkout's BRANCH moved under a paused session** — between my turns a peer
  session checked out `docs/…` → `main` → `feat/better_agent_naming`; my next file-read
  "lost" a committed report (it lives on the other branch). Cure that worked: on ANY
  resumed turn in a shared checkout, re-derive branch + HEAD (`git rev-parse
  --abbrev-ref HEAD; git log -1`) BEFORE interpreting file state; `git reflog` names what
  happened. Same family as the stale-cwd class: session-persistent state (cwd, branch) is
  a peer-mutable input, never a memory.
- **Whole-tree pre-commit gates bind you to a live peer's WIP**: my docs-only commit failed
  on 3 red agent-tools tests belonging to the peer's mid-TDD working tree (same checkout);
  no bypass — surfaced to owner, waited; their next commit landed the tests green (997
  pass) and the collision dissolved. Corollary of check-singleton-per-window: a commit's
  gate chain is a whole-checkout event.
- **A peer's broad `git add` swept my staged bundle into their feat commit** (`3de15f01a`
  carries my five doc files + their identity work) — content conserved (set-membership
  verified), but the commit-subject-to-content attribution is now mixed. The
  stage-by-explicit-pathspec discipline protects against sweeping OTHERS' work; being
  swept BY a peer is the mirror exposure — the cure is the same discipline adopted by all
  writers, plus not leaving bundles staged-but-uncommitted in a shared checkout longer
  than necessary (mine sat staged through a blocked-gate window).
- **candidate: client-visibility check belongs in MCP tool-shape ratification** — a
  spec-valid response shape (`content: []` + structuredContent-only) was ratified without
  evidence of how real agent clients render it; the live exercise falsified the implicit
  "clients surface structuredContent" assumption for Cursor (decoration-key fingerprint
  proof in the cursor-visibility write-up). Graduation shape: a clause in the
  output-schemas plan / ADR-195 family requiring a client-population rendering check
  before ratifying any non-default response shape. Trigger: S1 decision on the snag
  register, or a second client found dropping structuredContent (S0 probe).

## 2026-06-11 — snagging deep-analysis + plan phase (Dusky Passing Mist, 2c0c4b)

- **In-repo research that names a defect does not flow into sibling decision threads by
  itself.** `mcp-client-tool-result-consumption-2026-05-28.md` concluded "only both is
  robust" and recommended revising structuredContent-only — ten days before EEF D6 shipped
  structuredContent-only (ratified 2026-06-06/07 in the EEF thread, scoped to graph tools'
  rebuild). The 2026-06-11 Cursor live exercise rediscovered it in prod. Cure direction:
  a research output whose conclusion contradicts a pending/ratified decision in ANOTHER
  thread needs an explicit cross-thread surfacing step, not just a filed report.
  Distilled candidate.
- **My own verification grep carried a single-line assumption** — `rg "z\.number\(\)"`
  missed the multi-line Zod chain at `aggregated-keyword-graph.ts:67-72`, and I briefly
  held the explorer's correct citation as suspect. Second instance of the
  audit-my-own-filters lesson (sibling: the `-v .test.ts` exclusion, 2026-06-09). Use
  `rg -U` (multiline) or structural reads when sweeping fluent/chained API patterns.
- **A workflow explorer's summary can contradict its own findings** — the S2 agent's
  answer said "upstream bulk-data conflation" while its findings proved upstream carries
  per-placement descriptions and OUR extractor collapses them (first-occurrence-wins,
  `keyword-extractor.ts:101-105,152-186`). Read the findings, not just the synthesis,
  before acting. Instance of validate-specialist-findings.
- **An adversarial reviewer can invent calendar gates** — wilma's "metric must run live
  ≥3 days before the EEF fix merges" failed the gates-must-be-citable screen; the
  before/after delta is measurable deterministically (instrumented server, both builds,
  local). Rejected with reasoning in the approved plan; sequencing kept (metric PR first).
- **Live two-client probe beats speculation**: Cursor surfaces only `content` blocks;
  Claude Code (probed from this session against oak-prod) surfaces only `structuredContent`
  — opposite halves. Worth keeping as the canonical client-matrix example alongside the
  2026-05-28 research.

## 2026-06-11 — owner catch: conditional in a test (Dusky Passing Mist, execution phase)

- **I wrote `if (shape ok) { expect(...) }` in a test; owner challenged "what happens if
  it is not met?"** Answer: nothing — the guarded assertions silently skip and the test
  PASSES. It proves only that the unguarded path ran; it is unfalsifiable for exactly the
  case it guards, while READING as proof. I had part-caught it pre-challenge (swapped to
  throw-guards, the house fail-loud narrowing), but the deeper diagnosis per
  testing-strategy stands: the conditional existed because I erased types myself (loose
  recording fake capturing a registered handler), then clawed the shape back at use — a
  complex mock fighting the real seam (the McpServer overload type error was the tell).
  Cure that worked: DELETE the capture test; prove the behaviour at the level where it is
  real (e2e through HTTP→SDK→SSE reading the app's own logger; Zod `.parse` as the
  fail-loud record check; deterministic enumeration; zero conditionals). Numeric edge
  semantics stay in unit tests. Irony worth keeping: the vacuous-pass shape is the same
  disease the token metric exists to cure — what you don't measure (assert) can vanish
  silently. Siblings: [[feedback_tests_no_global_state]], testing-strategy §No conditional
  tests, the EEF unit test's throw-guard precedent.

## 2026-06-11 — naming-lane pickup tranche (Moss weaves Blossom, 10438c)

- **An inherited handoff-record recipe is a hypothesis — verify each reference's REFERENT
  before bulk-renaming.** The record's ADR 195→198 enumeration swept the napkin in, but the
  napkin's "ADR-195 family" line is Dawnlit's reference to MAIN's ADR-195 (graph-tools,
  response-shape context), not the naming ADR; renaming it would have pointed a snagging
  lesson at the wrong ADR. Same-number-different-referent is exactly what a renumber-collision
  window produces. Sibling of the inherited-Step-0-recommendation lesson (2026-06-09).
- **A pre-push "branch failure" can be a TREE failure: root format/markdownlint gates inspect
  the working tree, not the pushed commits.** Zephyr's push of 6056d48b2 failed in the window
  where their aborted origin/main merge attempt had conflict markers in the primary checkout's
  napkin; the same chain runs green (103/103) on the same content in a clean worktree.
  Diagnose pre-push failures by separating tree state from branch content before treating the
  gate as red. Corollary of "whole-tree pre-commit gates bind you to a live peer's WIP"
  (2026-06-11 wave-2); the per-session-worktree team shape removes the exposure.

## 2026-06-11 late — snagging-lane successor session (Cosmos turns Equinox, 1bc763)

Mid-cycle pickup per PDR-063 (from Dusky Passing Mist) ran clean end-to-end: record read
before any source edit; E3 + amendments + PR-3 landed; #190 merged. Captures:

- **`tail -3` on a failed gate run destroyed the failure surface.** The PR-1 doc-fix push
  failed pre-push; my pipe kept three lines and the failing task's name was gone — a clean
  re-run (full log to file) came back green, so the original cause is unknowable. Instance
  of read-diagnostic-artefacts-in-full: gate output goes to a file FIRST (`> log 2>&1`),
  triage from the file; never triage through a tail.
- **Transient pre-push failures on BOTH lanes in one window** (mine on the PR-1 doc fix;
  Moss weaves Blossom's on the naming branch) — neither reproduces on a clean re-run.
  Suspect: shared-worktree turbo cache under concurrent gate runs across worktrees.
  Cure that worked: full-log capture + one clean re-run before treating a pre-push red as
  content-rooted. If a third lane hits it, it stops being weather → candidate for a
  build-system investigation.
- **zsh does not word-split unquoted `$VAR`; `set -- $CYCLE` passed empty args** in my
  heartbeat monitor loop (CLI rejected the typed heartbeat). Cure: one value per state
  file (or `${=VAR}` if splitting is genuinely wanted). Same family as the zsh array
  1-indexing gotcha.
- **cwd is a peer-of-mine-mutable session variable too**: a `cd` in an earlier compound
  command left me in the MAIN checkout (the Director's coordination home), where my next
  `git switch` correctly refused on their dirty coordination state — the dirty files were
  legitimate live registry/comms churn, not anomaly. Instance of the existing
  stale-cwd/branch class: re-derive `pwd` + branch before ANY git-state operation in a
  multi-checkout session.
- **A wording test surfaced a real taxonomy fact**: EEF `answerType` is the COVERAGE axis —
  explicit-id selection is `strand-lookup` at ANY cardinality (30 ids → strand-lookup);
  `context-subset` is axis-selector-only. My test assumed cardinality semantics and went
  red against correct code; the corrected test now encodes the fact. Writing the
  describe-shaped test is what flushed the wrong mental model — TDD as discovery.

## 2026-06-12 morning — resumed-session captures (Cosmos turns Equinox, 1bc763)

- **I reported a frozen in-flight action as a remembered completion** (the Director's
  temporal-dislocation behaviour-note names the class; this is my first-person instance).
  The #192 merge I initiated before an overnight freeze actually EXECUTED at 06:24Z on my
  wake; I reported it as "executed ~22:33Z" and told the Director their (correct) ground
  truth was stale. Cure adopted: on any resumed turn, `date -u` first, then re-verify every
  claimed-done external action against its authoritative surface (gh/git/comms dir), citing
  the surface's own timestamps. Temporal sibling of the stale-cwd/branch class.
- **A serverless export entry exits 0 silently when run directly** — `dist/server.js` is
  the Vercel export, `dist/index.js` the Node listener (and `.env.local` resolves from the
  app cwd). Forty minutes of "why is the log empty" for what one `cat scripts/start-server.sh`
  answered. Reflex: when a server "starts" with no output and no port, check WHICH entry the
  repo's own start script execs before debugging env. Homed: the write-up's replay recipe is
  corrected (PR #193).
- **comms watcher drain-deadline does not converge under load** (3 deaths in one session at
  60s/180s/300s budgets; ~3,060-event dir; deaths correlate with parallel turbo gate runs).
  Raising the budget is symptom-treatment; cure direction (batched/incremental drain off the
  deadline path) is with the watcher's owner — full diagnosis in failure-mode comms event
  4e35c31c. Supersedes the "raise drain budget" arm of the existing cure memory when the
  third strike hits.

### Closing addendum (Moss weaves Blossom, 2026-06-12 session close)

- **Watcher drain budgets: invert, don't raise.** Six drain-timeout deaths across two
  sessions killed 60s/180s/300s/540s budgets alike; the 540s death hit at moderate load on a
  stable 3,143-event dir (9-minute wedge — intermittent blocking stall, not load-starvation).
  Operational cure until the batched-drain fix is built: keep `--step-timeout-ms` SHORT
  (~120s) so wedges die cheap and the seen-file gap-drain recovers fast. Evidence + cure
  direction in comms events ~2026-06-12T06:42Z (Cosmos + mine).
- Lane disposition at close: PR #189 merged (289b3e036), plan archived (PR #194, 9a74eefd1);
  era-pinning cure plan is the lane's next work (repo-continuity carries the block); the
  owner's v3 shape exploration is open with four sample sheets + Zephyr's allocation maths.

## 2026-06-12 — Director closeout captures (Firefly seeks Temper, ce44ae)

- **I ratified a peer's framing of their own defect** ("two era projections, cure deferred")
  by analogising ADR-186's migration-window dual-shape tolerance onto IDENTITY — the one
  substrate where duality is categorically disallowed. Owner caught it; supersession 10cb3a10
  within the objection window. Cure: a reporting agent's self-classification is input to
  adjudicate, never a verdict to ratify; identity anomalies during handover are P1, never
  deferred-notes. Doctrine-by-analogy is the failure shape (metacognition §retrospective).
- **I nudged a peer for stale heartbeat typed-args while my own loop emitted a stale branch
  name for hours** (feat/better_agent_naming after I had cut the coordination branch). Cure
  applied at re-arm; class: loop args derive from registry state at emit time, never baked at
  arm time — same as theme 17, first-person instance.
- **The innate-immunity trip-list fired on my own roadmap prose** (the p-word for the
  08-cluster intent) and the reappraisal was REAL: the owner had just converted that intent's
  state from indefinite to gated — the block forced the prose to record the gate. The
  mechanism worked exactly as designed on the agent who merged its precursor arc.
- **Worked well**: blind-pass design for the research plan survived adversarial review with
  its core intact (reviewer added a leak fence, didn't weaken the structure); the
  readiness-review-then-amend loop on a same-day plan cost one background dispatch and
  materially improved three artefacts.
- **Loss-scan find — heartbeat value-contingency evidence (PDR-082 second-instance path)**: my
  Director heartbeat cron ran the whole session with ZERO observed consumers — the owner was
  present throughout and every stall/retirement judgement I made used ground-truth reads (git,
  gh, registry), never peers' heartbeats; meanwhile BOTH implementer lanes ran sessions without
  heartbeat crons (solo-opened) and their closeouts were clean. Evidence FOR generalising
  PDR-082's owner-visible scope-reduction beyond n=2. candidate: PDR-082 amendment when its
  named second instance is evaluated.

## 2026-06-12 — EEF gap research + DfE SDK seed session (Forge turns Basalt, c4b882)

- **Owner correction: I framed a complementary data source as a replacement.** The DfE EES
  seed said "authoritative replacement for the EEF corpus's hard-coded uk_context" — owner:
  the DfE API is ALWAYS complementary to the EEF corpus; the repo pulls multiple sources to
  maximise MCP-app value. Root cause (retrospective metacognition): doctrine-by-analogy — the
  derive-don't-bridge / replace-don't-soften reflexes govern surfaces DERIVED from data we
  serve, not product SOURCE STRATEGY, which is owner-shaped. candidate: sibling of
  feedback_feature_shaping_is_owner_decision ("source-strategy forks are owner decisions, not
  derivable from data-hygiene rules"); promote on a second instance.
- **Workflow verify stages must tolerate partial verifier loss**: 3 of 15 adversarial
  verifiers died mid-workflow on an Anthropic session limit ("session limit · resets
  12:30pm") — the workflow completed and returned, but those claims arrived unverified; cure
  applied was first-hand re-adjudication of the orphaned claims. Design forward: treat
  verifier results as `.filter(Boolean)`-sparse and route unverified claims to the main agent
  explicitly rather than assuming full coverage. (capture-practice-tool-feedback.)
- **markdownlint-cli rejects absolute paths outside the repo** (`RangeError: path should be a
  path.relative()d string` from its ignore module) — a /tmp negative-control file cannot
  prove the runner; put lint negative-controls INSIDE the repo (and delete after). The
  control-then-real pattern itself worked: control fired MD040 + exit 1, real files green.
- Two same-day instances of documented classes, confirming the cures: (1) shared-checkout
  state moved mid-session (the in-progress merge resolved AND my uncommitted report/README
  were committed verbatim by the Director seat in `32bcd9d1b`) — caught by the re-derive-
  before-acting discipline, set-membership content check confirmed conservation; (2)
  `repo-continuity.md` changed between my read and my handoff write (Edit staleness guard
  fired) — re-read, re-applied; the directed-backlog-before-compose lesson held.
- **ARC simultaneous-open race, worked instance 2** (2026-06-12, Firefly × Forge): my announce
  08:52Z, Forge's independent open 09:14Z without seeing it — even WITH the canonical announce
  discipline, a peer acting on direct owner direction can race the discovery index. Cured by
  dialogue-concession in one entry (their file won on substance; pointer left on mine).
  Feed to the reference doc's announce-race section at the next ARC consistency pass
  (owner-named naming/discoverability debt; "ArcAngel" alias line already landed).
- **I performed the documented ARC timestamp failure mode at my own sign-off addendum**: composed
  the entry header with a guessed-ahead timestamp (09:38Z claimed, 09:23Z actual) instead of
  deriving `date -u` BEFORE composing — the exact "compose the timestamp before the append"
  class the ARC reference doc records. Caught immediately (the same call's `date -u` output
  contradicted my header); cured by an on-channel correction entry with a derived timestamp.
  Reading the doctrine that morning did not stop the hands; instance for the
  read-doctrine-does-not-fire family.
- **Work note (owner-directed 2026-06-12): `mcp-expert` sub-agent template needs a deep
  review + update in a future session.** Evidence from a light review: 628 lines, ONE
  mention of elicitation/sampling combined, no spec-revision pins; body knowledge predates
  the 2025-11-25 revision (URL-mode elicitation is new there; sampling.tools; prompt
  icons; completion context.arguments). Its fetch-live-spec discipline is sound — the gap
  is the worked knowledge and review checklists. Fold in the snagging arc's
  client-visibility lessons (rendering evidence before shape ratification). Belongs to the
  standing owner-directed specialist-agent design overhaul; mcp-expert is now its first
  named target.
- **Sweep-execution captures (path-sweep, 2026-06-12)**: (1) BSD `sed -i ''` creates
  transient `.!nnnnn!file` siblings that RACE live directory watchers (observed: comms-drain
  ENOENT mid-sweep) — pause or expect-noise on watchers before in-place sweeps over watched
  dirs. (2) An OS-temp commit-message file evaporated between two commit attempts DURING the
  no-OS-temp-paths sweep itself — poetic worked confirmation of both the temp-files rule and
  the commit skill's `.git/COMMIT_EDITMSG` recommendation; deviate from the skill, get bitten.
  (3) The eef identity-row char-pressure cure that worked: verify every name in the row's
  prior-tail exists in the thread record's identity table (set-membership, scripted), THEN
  replace the tail with a pointer — dedup-with-proof, zero loss, ~1.8k chars freed.

## 2026-06-12 — Statusline redesign session (Starling wakes Wind, b34fdb)

- **The /statusline subagent edited the wrong surface**: statusline-setup rewrote the
  user-global `~/.claude/statusline-command.sh` while this repo's live statusline is
  repo-carried (`.claude/settings.json` → `.claude/scripts/statusline-identity.mjs` →
  `agent-tools` built adapter; project settings override user settings). Owner caught it.
  Cure applied: redo in `agent-tools/src/claude/statusline-render.ts` + tests. Lesson:
  locate the live config surface (project settings first) before editing harness config —
  and before delegating such edits to a platform subagent that only knows user scope.
- **Shared-checkout state moved mid-session, confirming instance**: the checked-out branch
  switched under the session (`docs/wider-ecosystem-options-summary` →
  `coordination/director-final-handoff-2026-06-12`) with peer/owner doc WIP in the tree;
  my statusline edits ride along as working-tree edits. Caught by re-running git state
  before reporting (verify-dont-trust on my own banner); owner routed commit responsibility
  to a future agent. Same class as the 2026-06-12 Forge instance — re-derive-before-acting
  held.
- **Tool feedback (Read/Write + ANSI)**: Read renders the ESC control byte invisibly, so a
  Write composed from read context carries REAL ESC bytes into string literals — tests then
  pass (bytes match) but the file diverges from the repo idiom of textual `\u001b` escapes.
  Worked cure: `perl -pe 's/\x1b\[/\\u001b[/'` over the constant block, verify with
  `grep | cat -v`. Check idiom with `cat -v` whenever editing files whose literals encode
  control characters.

## 2026-06-12 — Team-onboarding guide session (Altair rides Gloom, 0920d8)

- **Owner direction (session-scoped) shaping onboarding content: don't prescribe workflow.**
  I proposed candidate team tips (rename ritual, no-Vercel-CLI, …); the owner ratified only
  the two session bookends — a start-right skill at open, session-handoff at close — and
  explicitly declined more: "other than that I don't want to prescribe how they should work".
  Shape that landed: usage stats stay descriptive; prescriptive content names only
  owner-ratified norms and states the list as deliberately complete, so a walkthrough agent
  reading the guide cannot invent a "team workflow" narrative on top of it.
- **Vendor skill templates can mandate falsifiable assertions**: /team-onboarding's close
  template demands the exact line "Saved to `ONBOARDING.md`" — falsified here by the owner's
  redirect of the artefact into `.agent/plans/developer-experience/`. Adapted the canned line
  to the real path; template fidelity never outranks faithful reporting (verify-dont-trust on
  my own banner, applied to a vendor template's words rather than my own).
- **The ESC-byte Edit-anchor class fired on this very file**: my napkin append anchored on the
  prior entry's ANSI line and failed — the Read-rendered text hid a real ESC byte, exactly as
  that entry warns. Cure applied: re-anchor on adjacent lines that carry no control bytes.

## 2026-06-12 — Onboarding review + report-mining session (Vanilla lifts Chlorophyll, 8dca0d)

- **I relaxed input-to-verify because the owner handed me the input.** Mining the
  /team-onboarding report I verified the MCP-checklist coverage first-hand but folded the
  oak-skills repo facts on memory-corroboration alone, wrote "proven prototype shape" for a
  walkthrough no newcomer has run, and extrapolated one contributor's stats into "multi-agent
  coordination is the common case" — the exact extrapolation the report's own instruction
  block forbids. Owner caught it mid-fold. Cures applied: gh API verification (repo,
  visibility, `.claude-plugin/` dir), attribution-precise rewording, overclaim removed.
  Lesson: owner-TRIGGERED generation is not owner-VERIFIED content; the input-to-verify
  posture is unconditional on provenance.
- **A closed peer session's artefacts can land in the tree asynchronously, mid-my-session**
  (Altair rides Gloom's closeout napkin/continuity writes + the report file appeared between
  my commits). Re-derive-before-acting held: `git status` before each commit surfaced the
  foreign diffs; investigation identified a peer closeout, not anomaly. Their continuity
  entry carried a stale next-step ("commit the report") and a misattribution (my commit
  credited to the owner) — both resolved with a same-bullet RESOLVED addendum, the
  established continuity pattern. A peer's recorded next-step is a hypothesis, superseded
  here by later owner direction.
- **"Defer commit control to you" is not a summons for the marshal apparatus.** One relayed
  sentence about a peer's commit posture and I armed a persistent registry Monitor — the exact
  machinery the standing comms-ceremony-minimal direction forbids. Owner corrected within
  minutes ("lanes should be largely independent"). The arrangement's real shape was: do your
  lane; fresh `git status` + pathspec-scoped commits already cover collision safety. Cure:
  Monitor killed; reflex updated — coordination machinery scales with demonstrated need,
  never with role vocabulary ("gatekeeper", "marshal") pattern-matched from past sessions.
