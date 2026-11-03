---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose is archived under [`archive/`](archive/): the whole file as it stood before
the 2026-09-19 graduate-then-archive pass is
`archive/repo-continuity-2026-09-19.md` (byte-identical to blob `3ff37a091`), and
the earlier snapshot is
`repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`.
Detailed lane histories live in thread records, curator reports, completed
plans, and prior continuity archives; this file should stay a compact pickup
surface.

**Director handoff:** the next Director's single pick-up point — role procedure,
the readiness self-check before claiming authority, current state, and the live
todo list — is [`director-handoff.md`](director-handoff.md).

## Current State

Compact live state only. Finished-session narrative is conserved in its homes
(commits, ADRs, PDRs, patterns, thread records) and in git history, then drained
from here per `continuity-practice.md` §Disposition; only live lanes and live
forward-asks remain.

- **2026-10-19T10:0xZ: the two local-only branches proven of no use at the owner's word; deletion denied by
  the policy** (Walrus seeks Maelstrom, 9585cc, reviewer, the owner-interface directly). His word: "Analyse
  the two branches, if they are useful put them in a draft PR, if they are not useful, delete them". The
  content proof and verdict are §Next Safe Steps item 5: `docs/consolidation-2s-skills` wholly on `engraph`
  (pull request 341); `docs/consolidation-2-routed-cures` on `engraph` in fuller words or superseded by the
  reviewed PDR-075 landing. No draft pull request opened. `git branch -D` was denied by the Bash permission
  policy; the refs stay local for the owner's own command. The estate-coordination thread record's holding
  line is re-trued.

- **2026-10-19T09:4xZ: the owner's word on safe and complete work; this session a named exception for the
  merge** (Walrus seeks Maelstrom, 9585cc, reviewer, the owner-interface directly). Verbatim: "All work is only
  considered safely recorded once it is pushed and in a PR, work is only considered complete once it is
  merged. Work in all worktrees and branches must be either made safe or, if it is of no use, deleted." Then:
  "That is the rule. This session remains a named exception because I don't want to spend time on a merge
  right now." Recorded as the 2026-10-19 paragraph of the rule `worktree-hygiene` (beside his words of
  2026-09-24, the same rule in its earlier form) and as a row of the Director rulings ledger. This session's
  work is safely recorded (pushed, in draft pull request 360) and not complete (not merged), by his named
  exception. The two local-only branches of §Next Safe Steps item 5 fall under the rule's third sentence; not
  acted on by this seat, reported to him.

- **2026-10-19T09:3xZ: the owner's word on the fold cadence** (Walrus seeks Maelstrom, 9585cc, reviewer,
  the owner-interface directly). Verbatim, after the seat's wrap report that "the 24-hour fold rule
  stands": "the 24 hours is a rough guide, but obviously the actual need varies with how much work is
  happening, there would be no point in folding every 24 hours if that was the only thing happeneing".
  Recorded as the 2026-10-19 amendment of the rule `coordination-branch-24h-lifetime` (the clock is the
  guide, the work on the branch decides whether a fold is due; the seat's reading for the DUE check is
  flagged there as the seat's) and as a row of the Director rulings ledger. Of the two owner words that
  pull request 360's body relays, "folds when useful, never by the clock alone" is now covered by his direct
  word above; "all work must be deleted or pushed and in a PR, no exceptions" is covered by his direct word of 09:4xZ, the bullet above.

- **2026-10-19T08:2xZ: the 356 lane wrapped at the owner's word; his sequencing of what follows** (Walrus
  seeks Maelstrom, 9585cc, reviewer, the owner-interface directly). His word, verbatim: "The architecture
  work for decoupling the thin Oak apps is the next feature priority, we should deal with partial plans and
  fixes and graduations before that. Work related to [the curriculum infrastructure consumer] will need
  careful attention from me, we do not have enough information to make plans complete, but we should leave
  them in a stable state, that is not for this session" (the label replaces the name at his word of
  2026-10-17). The seat's reading, not his: the three are the architecture session's inputs, made true
  before the decision. Measured on `engraph` at `SHA:493951ad7`: 51 plan nodes at `status: sketch` (the
  programme's fifteen `oce-*` nodes and its strategic node among them), 3 superseded, 78 ratified; two nodes
  carrying expired owner gates (`semantic-search-showcase`, `warranted-means-in-the-operating-environment`;
  the extraction plan's two went with its supersession, so the session-open alert reads four here only
  until this branch takes engraph's merge); the plans index and the 2026-09-06 archive move still disagree
  on a superseded node's place (§Next Safe Steps). The fixes with a home: the merge tool's Copilot leg per
  pull request (the register; pull request 358, the records-class door and the fold clock, open); the commit
  queue's `complete` accepting a refused intent (F-297); the plan-schema owner gates under PDR-100 (the
  register). The graduations: the register's six entries, every one due. The surfaces touching the
  curriculum infrastructure consumer, his to plan and left as merged with the validators green: the
  strategic node, `oce-curriculum-contracts`, `oce-domain-service-contracts`,
  `oce-framework-lifecycle-contracts`, `docs/architecture/oce-integrity-and-castr.md`,
  `docs/architecture/oce-wider-capabilities.md`, the programme's README and source-dispositions report. The
  seven points of the ADR-233 analysis are now in the thread record from the transcript, point 5 (no
  verbatim owner word in ADR-233) found undispositioned and listed beside 1, 2, 3 and 7 for the session. The
  records ride this coordination branch's draft at the owner's word of 2026-10-17 that every pushed branch
  rides a pull request; the fold is at his word, not this wrap's. The napkin's rotation by proof is
  unblocked (the reviewer seat's block was committed on 2026-10-17); the consolidation gate reads due and
  unbounded for this close, a curator seat's after the partial plans by his ordering.

- **2026-10-17T15:0xZ: pull request 356, the retained-framework rearchitecting programme (ADR-233),
  merged by the door at SETTLE-READY as `SHA:493951ad7`; adoption held, merge never held** (Walrus
  seeks Maelstrom, 9585cc, reviewer, the owner-interface directly). At the owner's word of 2026-10-17
  the seat's four local commits were dropped before any push and the corrections re-landed from the
  pull request's own head: the OpenAPI pipeline page back to the directive's wording (the owner:
  "strict, everywhere, all the time", "never disable checks, never disable safeguards", no
  special cases) with its consumer data boundary restored and sourced; the two exploratory projects
  under neutral labels on every surface, not named yet; the hold stated as adoption, not merge,
  the owner quoted; the public-packages node trued to its own amendment; ADR-233's status word, its
  place in both indexes, a dated line in the strategy index. Three review threads answered and
  resolved; the body restated. Standing rulings of the day, each on the graduation register with its
  target: a clean and green pull request merges by the door, never at the owner's word; an ADR
  numbering clash is settled by Oak's numbering (Oak at ADR-229 today; Engraph's 230 to 233 move
  when Oak reaches them); a merge tool coupled to a third party's review configuration carries a
  design bug (the door read Copilot OWED on 356's tip under `review_on_push: false`, GitHub CLEAN;
  the seat ran the door with the configured set the tip had, the Codex connector). Forward asks, none
  this lane's: a dedicated architecture session with the owner on points 1, 2, 3 and 7 of the
  ADR-233 analysis (configuration-only against ADR-227 ruling 11 and ADR-154; the named product
  repository and the junior-developer requirement undispositioned; decision 6 and invariant I07
  against ADR-029/030; the two soft tests) before any adoption; the merge tool's owed-ness fix in
  both estates; the plan-schema owner gates under PDR-100. Two local refs on this machine for the
  owner's word: `archive/pr356-seat-work-2026-10-17` and the retired
  `coordination/2026-10-05-efe69f` at `SHA:93363641a` (its content is on the successor branch).

- **2026-10-17T14:1xZ: the J2 docs-validators worktree retired with zero loss, its question dissolved by
  fact; the owner's rulings on this estate's open items; say OCE** (Flint guards Vapor, 9b835d, at the
  owner's closing word). The validators staged since 2026-09-29 in `oce-wt-j2-docs-validators` landed on
  this default branch on 2026-10-05 in pull request 354 (the practice code landing) with review fixes
  the same day; the staged draft was an older copy of the same source that never compiled here. At the
  owner's word ("if you are sure, then delete it") the worktree was retired by the standing grant for
  proven paths (`never-use-git-to-remove-work`; `worktree-hygiene` item 6): fresh fetch; 23 of 23 paths
  proven (8 byte-identical, 15 landed and since revised, 126 draft-only lines each read against the
  decision that superseded them); 103 ignored entries dispositioned in the removal command (`.env.local`
  identical to the primary's, husky's shims, the pinned shellcheck re-installed by its setup script, the
  mcp app's fetched design assets, build output by name); the staged additions dropped from the index
  and moved to the session scratchpad, the two modified files forward-written from HEAD, porcelain
  empty, the tip an ancestor, `git worktree remove` without force, the branch deleted plain. This bullet
  is the capture the removal rule requires in this estate (the napkin on the primary is the reviewer
  seat's uncommitted file). The decision put to the owner on 2026-10-02 and carried by four seats was
  moot from 2026-10-05: no seat listed the default branch. His rulings of this date on the items above:
  the merge-tool work is needed in both repositories, in parallel, the defect being a design coupled to
  one GitHub configuration; the missing suppressed-findings hold is a consistency choice for the seat
  doing that work, since "if they are low confidence findings then ignoring them is a valid approach";
  the bot's 403 refusals are "either a token freshness or a working directory issue" (the seat's
  reading: the token was minted from a shell the harness had reset to the other estate's primary, so
  re-mint from inside this checkout before any claim about permissions); Copilot's silence at open for
  bot-authored pull requests is "possibly expected" since the subscription is his, so the agent requests
  a review "ONLY once the agent is confident that the PR is ready, not simply because code was pushed";
  the profanity tooling is jimcresswell.net's only for now, deliberately, so the parity item is closed.
  His cost word: "half an hour is TOO LONG FOR A PR, ten minutes is reasonable"; this estate's
  ten-minute quiet window after checks green waits for a review the configuration says never comes, and
  its removal is part of the tool work. His naming word: say OCE, never "the sibling". Walrus seeks
  Maelstrom is active in this estate on their branch; their uncommitted files are theirs. The
  cross-estate thread record in jimcresswell.net carries the full list and the inherited-premise cure.
- **2026-10-16T16:0xZ: the merge tool derives what a tip is owed from this repository's review
  configuration; pull request 359 merged by this estate's bot at the UNOWED leg** (Flint guards Vapor, 9b835d, the owner's routing of
  2026-10-16: the tooling was over-coupled to Copilot reviewing every push; the `engraph` ruleset's
  `copilot_code_review` rule reviews no later push, the same configuration as the sibling estate,
  whose pull request 339 landed the same change this afternoon and was merged by its bot at the
  UNOWED leg with no hand-made request). What the port does here: `pr state` reads the base branch's
  rule with every reading; Copilot's leg reads UNOWED on a tip the vendor is not asked about once it
  has reviewed an earlier tip and no Copilot body binds the tip; this estate's pending-request
  surface never lists a bot, so the leg honours the rounds asked in the pull request's history
  (`round-requests.ts`), the finding both vendors made and the cure; an unread or absent
  configuration keeps every leg owed, named in the evidence; the lifecycle skill and the merge-bot
  reference carry the same passages as the sibling's. Written against this estate's own `pr-watch`
  shape rather than carried as bytes; the gh payloads the integration suites share moved to a test
  helper at their second consumer. Parity items from the port, each with its home here: this estate
  carries no suppressed-findings hold, so the sibling's cure for the hold on an unreviewed head
  (Copilot's finding on 339) has no counterpart, and the hold itself is a parity gap; the sibling's
  `pr tally` divergence (its own owed-ness without the configuration) is recorded on its thread
  record and applies here if `pr tally` is carried. Observations of the day, one or two instances
  each: the bot's `pull-request-work` token was refused 403 on the branch delete, the review
  request, the thread reply and the thread resolution (pull request creation works), where the
  lifecycle skill's item 5 records 201 for the request; the operator credential did each; Copilot's
  rule registered no review at open for this bot-authored pull request and for 355 at ready-mark,
  both first requests made by hand. Unchanged: the J2 worktree (put to the owner 2026-10-02, exact
  on the sibling's thread record), the profanity tooling parity, the primary checkout's re-homing to
  the successor when the reviewer seat commits.

- **2026-10-14T11:2xZ: the third dedicated two-estate consolidation's sibling stage landed on lane
  `docs/consolidation-3`** (Flint guards Vapor, 9b835d, guest curator under the join ceremony; the
  curator claim of 2026-10-11 adopted in place). Pending graduations here 1, down from 16: the
  operator-profile half of the Oak GitHub read ruling, a write to the owner's own profile at his
  word. The sibling estate's register reaches 0 with this stage, its last entry being the carry into
  this estate's wrap skill. What landed: twenty-two shared files took the sibling's graduation hunks
  as bytes; seven shared-doctrine files are the same bytes as the sibling's settled copies
  (owner-signal-interpretation, the cross-estate rule, downstream-checkout, consolidate-until-done,
  wrap, PDR-117, the shell gotchas less one bullet about a gate unverified here); five
  host-flavoured files took their shared passages only; five directive homes took the eight shared
  texts the owner agreed on 2026-10-14. Left divergent with the reason named: the fold doctrine of
  2026-10-10 in coordination-fold and pr-lifecycle, which names the sibling's merge-bot class
  detection and fold clock that this estate's tooling lacks (this estate's door doctrine stands
  until its tool learns the class, as its own prediction says); the sibling's harness-integrations
  bullet about its own write hook; the two build-system documents. The lane is unpushed at the
  owner's standing word; the live seat's three uncommitted files on the primary checkout are
  untouched. Next here at the owner's word: the six slow-lane rows, this record's own disposition
  (it stands over its limit), and the napkin's rotation once the live seat's uncommitted block is
  committed. The slow lane was decided the same day at the owner's word: two rows promoted as carried by doctrine that now exists, four standing to their dates with the day's evidence logged in the register. The owner's word of the same day, verbatim: "There is ONE Practice with local instances, if OCE needs an update, it needs an update", so the fold passages of 2026-10-10 are not left divergent: the code lane `fix/merge-bot-records-class-and-fold-clock` is open here, cut from the default branch in a linked worktree, to bring this estate's merge tool the records-class detection and the fold clock (the sibling's pull request 328 as the change set; eight merge-bot files and the fold clock's eleven to carry, forty-one shared merge-bot files differing, this estate's own thirty-five watch files kept), its tests green in this estate's gate, after which the fold and lifecycle passages land as the same bytes; one pull request at the owner's push word. Done the same afternoon, three commits on that lane: the fold clock (sixteen files, its directory's tests green), the records-class door (twenty-six files: the eight merge-bot files, the two divergent modules ported by hand, the pull request's author carried through the view schema and the reading, the records merge set derived from this estate's own ladder as seven reviewer-leg states with UNCLASSIFIED-EVIDENCE excluded, the records-class execution tests in their own file with a shared input builder), and the five fold and lifecycle passages as the same bytes as the sibling's, riding with the tool they describe. Gates on the lane: type check, eslint, prettier, the full agent-tools suite (679 files, 8,030 tests), the dependency cruiser, and knip once the env-resolution package was built in the worktree (a fresh linked worktree has no package dist and knip's config loader fails on the smoke config; this records lane fails the same way; the host, not the lane). The two lanes touch no file in common and merge clean in simulation, and in the merged tree both skills are byte-identical to the sibling's; the shared-path divergence measure falls from 39 files and 3,410 lines to 37 and 3,306.

- **2026-10-13T13:0xZ: the review lane for pull request #356 (the retained-framework rearchitecting
  programme, ADR-233) opened at the owner's word; the seat at its compaction boundary** (Walrus
  seeks Maelstrom, 9585cc, n=1). The owner's rulings of the day: merge is not blocked on the
  Education corpus, adoption is; read-only access to Oak GitHub is always permitted, writes stay
  forbidden until he says otherwise. The discovery, the reviewer findings on the head and the resume
  order are in the thread record `oce-rearchitecting-programme`. The consolidation's handoff state
  of 2026-10-11 below stands; its claim is untouched and the fold stays suspended.

- **This line's direction — owner words 2026-09-05, verbatim.** (1) "I want to explore
  creating a set of skills around not what to teach but how to teach, pedagogy skills,
  and the EEF work seemed like a good place to start." (2) "For now this is specific to
  the Engraph fork." (3) "Splitting out the Oak apps is the top priority in the Oak
  fork, not necessarily in this fork." The shape that landed 2026-09-06: the pedagogy
  product lives in its own repository (`EngraphCode/pedagogy-library`, the first
  ecosystem visitor, checked out under a gitignored `visitors/` directory — runbook
  [`ecosystem-visitor-checkout`](../../plans/runbooks/ecosystem-visitor-checkout.plan.md));
  this tree gains only the org-neutral EEF corpus markdown projection (delivery node
  [`eef-corpus-markdown-projection`](../../plans/delivery/eef-corpus-markdown-projection.plan.md),
  #58 merged 2026-09-07). The extraction's priority is the Oak line's, not this line's.
- **The Oak line's 2026-09-02 fold and split-plan arc is finished** (#915 `777e9131c`, then
  MCP-661 as #954, then MCP-673): its narrative, the owner's objective and the five split-plan
  rulings live in the estate-coordination thread record §2026-09-02 FOLD LANDED and the
  2026-09-03 handoff block after it.
- **MCP APP FIRST MAJOR RELEASE — THE PRIMARY LIVE EFFORT (2026-07-21→).**
  Canonical state lives in the first-major-release strategic plan (the
  owner-authored decisions register) on `main`, the Linear project, and
  [`director-handoff.md`](director-handoff.md) §CURRENT HANDOFF STATE — never
  this file. Unless its own line says otherwise, every other lane below is
  dormant or buffered behind this effort.

- **OPEN-SURFACE ZERO — the Oak line's owner-PR merge drive (2026-08-11→).** The fork-line integration landing is complete (#945 merged 2026-09-02 as
  `bf8db3a8e`, after the MCP-655 sign-in fix #946 `55f7a457c`; releases 1.175.3 and
  1.176.0). The remainder is the older slice: resume at #805, then the owner-authored
  custodial pair #818/#819. Exact custody, owner directions, instruments and failure
  learnings live in the tracked thread record
  [`threads/open-surface-zero.next-session.md`](threads/open-surface-zero.next-session.md)
  §Lanes. The consolidation that bullet called due ran 2026-09-02 (the napkin-only pass
  on #951) and since.

- **TYPESCRIPT ESTATE CONSOLIDATION REVIEW — PAUSED 2026-09-06 (no fork lane).** Design
  ratified 2026-08-19 on the Oak line; the measurement-foundation tranche's state
  (Revision 2.6, the `typescript-estate-review-019fc3` worktree, the known red
  boundaries) lives in the
  [thread record](threads/paused/typescript-estate-consolidation-review.next-session.md);
  reactivation is owner-directed.
- **RESTATEMENT REMEDIATION and the PLAN-CORPUS / STRATEGY ESTATE — PAUSED 2026-09-06
  (no fork lane).** The gated lane and its plan
  ([`restatement-remediation.plan.md`](../../plans-backlog-2026-07/product-development-governance/active/restatement-remediation.plan.md)),
  the 2026-07-21/22 corpus reshaping (owner-ruled an unratified sketch; ADR-216 the
  doctrine home; decisions register D23) and the superseded-pending-adjudication
  machinery live in the
  [thread record](threads/paused/strategy-and-plan-estate-holistic-review.next-session.md)
  and the decisions register; read them first, this row is a pointer.
- **CRICKET CONSCIENCE-CHECK SUBSTRATE — live, owner-mandated, platform panels.**
  Every active agent invokes its platform panel twice at real cycle boundaries:
  STANCE normal and adversarial; between owner interactions the cadence is
  event-driven, not a bare timer (owner answer 2026-07-30). The cricket skill
  (`.agent/skills/cognition/cricket/`) owns the live roster, invocation contract
  and on-demand triggers; the historical model-labelled tallies are in the
  operating record
  ([`cricket-quartet-tally-2026-07-29.md`](../../reports/agentic-engineering/cricket-quartet-tally-2026-07-29.md)).
  Rule portability and PDR-127 alignment remain metagovernance candidates.
- **Architectural fitness + mutation testing — decision-ready, reports landed
  (2026-07-15); owner ratification pending.** Report-only validator direction
  (counts are not limits) + the mutation dry-run contract; reports:
  [architectural fitness](../../reports/architectural-fitness-functions-concept-exploration-2026-07-15.md),
  [mutation testing](../../reports/mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md).
- **MCP agent-facing content — PAUSED 2026-09-06 (fork ruling).** The 716-item registry
  (#337/#338; MCP-103 delta-refresh #476) and the owner-gated research execution live
  in the [thread record](threads/paused/mcp-agent-facing-content.next-session.md).
- **Inter-Practice exchange — live next: the WS0+WS4 authoring session**
  (portable protocol PDR in both estates + join-ceremony skill; opener
  written) — the
  [AEE thread record](threads/agentic-engineering-enhancements.next-session.md).
  Standing: the untwinned PDR-063/064/125 truings re-twin at the next exchange
  window; frictions F-120 (`git merge` stale-dist guard-brick) structural cure
  unbuilt. The Practice Box was cleared on 2026-09-17 at the owner's word; the
  bundle's carries (castr-bound items for the next window; the four design-shape
  offers for the owner-scoped cross-estate integration session) live in the AEE
  thread record's "Offered by resonance on 2026-07-08" block.
- **Curriculum Hub — PAUSED 2026-09-06 (no fork lane).** Merged 2026-07-06; the remainder
  (§J deploy, the fidelity-register judgments, follow-ups, the ESLint 10 defect) lives
  in the [thread record](threads/paused/curriculum-hub-demo.next-session.md).
- **Upstream API alignment — PAUSED 2026-09-06 (fork ruling).** The RED-gate note, the
  `bulk-types-schema-derivation` future plan, the MCP pagination-header P1 and the
  MCP-130 cached-schema state live in the
  [thread record](threads/paused/upstream-api-alignment.next-session.md).
- **Team-tooling — live next: the SYNTHESIS PHASE** (worktree-per-agent /
  PDR-117 verdict; do-first the F-44 freshness≠liveness defect in
  `active-agents.ts`). Plan:
  [`team-tooling-session-2026-06-28.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/team-tooling-session-2026-06-28.plan.md).
- **Claims model + agent-work-state (LIVE, owner-gated).** The corrected claims model — a claim is an
  optional, advisory, AREA-scoped signal (NOT files; presence/liveness/work-state/seat re-home to
  facets) — is live in `agent-collaboration.md` §Identity vs Liveness (topology-independent area
  identity; absolute-path refusal; claim-is-not-the-seat). **Owner-gated, flagged not edited:**
  PDR-118 (claim-as-anchor superseded by launch-in-worktree, OQ2 amendment); the schema `role` field
  (the one genuine claim-as-seat marker, in tension with "claim is not the seat"); the
  `director-handoff.md` succession liveness gate (safety-critical). **Remaining integration (gated on
  OQ5 composed-liveness):** `collaboration-state-conventions.md` (silent that freshness ≠ liveness); the
  code consumers (`active-agents.ts`, the watcher-gate, the TUI).
- **Spawn-flow tool — ready to build (LIVE pickup).** Launch a session in its worktree → the binding is
  *derived* from cwd; the assert-primitive / registry path is dissolved (PDR-118 OQ2). Owner-approved
  plan with a Pitfalls section:
  [`agent-spawn-flow-tool.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-spawn-flow-tool.plan.md). The
  substrate ([`future/knowledge-distribution-substrate.plan.md`](../../plans-backlog-2026-07/agent-tooling/future/knowledge-distribution-substrate.plan.md))
  is recorded-future, not a prerequisite. Next agent: read it + the `feedback_*` memories it names,
  confirm the cwd fact once, build friction-sliced.
- **Sonar AI-profile → zero — dormant-live.** Phases 1–3 + 5A/5B landed; next
  batches doctrine-first (S7763/S7785/S6594/S7786, then Phase 4 design-MAJORs).
  Thread: `main-sonar-ai-profile-to-zero`.
- **Corpus generalisation — paused at the Phase 0 stable point (owner-directed,
  2026-07-06).** Restart = revision queue + atomic landing set on a NEW branch;
  the self-contained restart brief is the AEE thread record §PHASE 0 + the
  [design record](../../reports/agentic-engineering/large-corpus-analysis-tooling/corpus-generalisation-phase0-design-record-2026-07-05.md).
  Standing forensic items ride with it: **(owner attention)** the
  ~1,707-event untracked-tier removal (unexplained; intact in git at
  `255117a43^` — re-materialise before any pass; P0 weighs a tracked
  watermark manifest), and the single-model-voter measurement.
- **CI / security follow-ons (LIVE forward-asks).** From the CI-hardening landings (#236 dep-review
  gate, #239 CI parallelisation): report the #229 Tier-2/3 security-roadmap items; reconcile the
  widget/a11y pre-push ≠ CI parity gap (ADR-121 matrix, from #230); and the Codex #239 follow-ups to
  investigate against the merged code — (P2) `ci.yml` main-run concurrency may drop an intermediate
  main CI run + its Release `workflow_run` (consider a per-SHA group for non-PR runs); (P3) align the
  ADR-121 Playwright cache-key changelog row with the impl. **DATA-SOURCES governance** (owner-gated)
  gates the under-the-hood/explain user-exposure surface.
- **OWNER ROADMAP (2026-06-12, sequenced "not all at once") — the forward agenda:** (1) comms-research
  follow-ons; (2) naming v3 (DECISION-COMPLETE plan; Phase-1 era-pinning cure first — §Next Safe Steps);
  (3) Sentry production-issue protocols/skills; (4) the Sentry logging improvements those surface;
  (5) refine the PostHog plan; (6) integrate the oak-api repo into this ecosystem; (7) EEF
  data-surfacing follow-ons; (8) high-impact graphs latent in the bulk data; (9) apply the graph-tool
  capabilities to the `oak-curriculum-ontology` sibling repo; (10) the user-facing hybrid-search
  experience (gates the 08-experience-surfaces cluster + the `mcp-app-extension-migration` WS3 rebuild);
  (11) keep the plan-discovery surfaces current and retire `plans/notes/`; (12) the path-sweep
  code-class follow-on (TDD cycles, never a sweep sed). **Open action:**
  `docs/graph-team-direction-2026-06-10` carries two unmerged commits (`ae5372e2c`, `c9ff6bb49`);
  merging it is an open owner/Director action (reconcile the napkin/eef-record content on merge).
- **MCP product analytics — PAUSED 2026-09-06 (fork ruling).** The submission-blocking
  PostHog sink and `@posthog/mcp` integration proceed from the ratified MCP-63 plan (PR #568,
  merge `ccd1c410f`, 2026-07-26) under the owner's PR1-settled → PR2-settled → PR3 order;
  the PR state, the succession and the causal record live in the
  [thread record][mcp-analytics] and the
  [permanent dated record](../../reports/mcp-63-succession-notification-and-focused-delivery-2026-07-26.md).
  MCP-173 separately gates October public-beta enablement.
- **Other decision-complete plans awaiting execution routing.** MCP output
  contracts: owned since 2026-08-19 by the `mcp-output-contracts` strategic
  node + `mcp-served-surface-truth` / `mcp-output-contracts-implementation`
  delivery plans (`.agent/plans/`; the single-envelope
  `composeEnvelopeSchema(payloadSchema)` doctrine was falsified against the
  served wire — three envelope shapes; prior plans archived); the MCP
  test estate + observability-sinks plans (§Next Safe Steps). OAK-PROD MCP
  snagging — next: S0 non-Cursor probe, then S1 to owner.
- **no-throw remediation — RESHAPED, READY (survey-first), PAUSED for the strategy thread.** Controlling
  plan [`no-throw-remediation.plan.md`](../../plans-backlog-2026-07/architecture-and-infrastructure/current/no-throw-remediation.plan.md);
  the ~1000-warning count is an indiscriminate-rule artefact (~6 cause-classes). Investigation-first
  WS0→WS4; 4 conversions landed. Resume from WS0 after the strategy work. **Owner ruling
  2026-09-08** on the 1,227 warnings across 16 packages: "Turn the rule off for now, we can't fix it
  without creating incredible churn, so that needs to wait until the Engraph fork is merged back into
  the upstream. However, in any workspace with no current warnings and in any new workspace, leave it
  on as an error." The rule is binary: off where the debt lives, error everywhere else and for every
  new workspace; the migration lane waits for the merge-back. The merge-back is planned for October
  2026 and has no plan node by the owner's word the same day ("do not worry about the October
  re-integration, I have some thoughts, but we do not need a plan yet, and we should not let the
  intention overly influence the decisions we make now"); Oak-line delivery sketches not pending on
  the fork are left as they are until then. The same cards ratified six of 25 delivery sketches
  (consolidation-induction, consolidation-ledger, consolidation-signal,
  director-continuity-surface-redesign, commit-queue-local-ephemera,
  code-quality-binding-per-checkout) and held the other nineteen until October, the Director's
  recommended `codex-app-server-idle-wake` among them: route fresh seats under the ratified set and
  do not re-raise the Codex wake before October.
- **Practice↔IDE integration plane** — feasibility report landed; **owner decisions pending** (§Open
  Owner-Decision Items); a HARD deep-docs-read prerequisite before any build.
- **Onboarding-improvement arc** — PR #199 merged; follow-ons open (B2/B3 risk-register seeding; the
  ask-the-repo search decision — B1 awaits owner cost bands, B6 at the M2 gate). **2026-07-28: the
  dev-facing guide LANDED** — `docs/engineering/working-with-this-repo-for-devs.md` (owner-authored)
  plus discoverability wiring via #603, and the wrap-closes-every-session doctrine re-truing via
  #604 (ADR-150/PDR-011 amended; follow-ons MCP-310/311/312); detail in the
  `orientation-skills-family` and `agentic-engineering-enhancements` thread records.
- **Evals pickup — QUEUED, owner-directed**
  ([`skill-evals-pilot-start-right-quick.plan.md`](../../plans-backlog-2026-07/agentic-engineering-enhancements/current/skill-evals-pilot-start-right-quick.plan.md));
  the assurance regime is homed in `principles.md` §Agentic Quality + `validation-strategy.md`.
- **AX first-class** — PDR-111 + the `agent-experience-review-lens` rule landed; the live home is
  [`agent-experience-improvement.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-experience-improvement.plan.md)
  (next: WS-1 CLI-ergonomics conformance guard — §Next Safe Steps; WS-4 is the structural drain-fix).
- **Fitness-system doctrine (agentic lane)** — the Closure & Role-Routing findings record + backbone
  plan landed (`547d889c9`); next is the plan's WS0 (PDR-106 + ADR-144 amendment) and the §11
  comparison. Detail in
  `.agent/plans-backlog-2026-07/agentic-engineering-enhancements/current/fitness-system-closure-and-role-routing.findings.md`
  and the `.plan.md` beside it.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal sources, not long-term
  documentation. **Live tooling gap**: 1,346
  coordination-class events await a curator-disposition INPUT CHANNEL in the
  mover (their knowledge is absorbed; the recording mechanism doesn't exist
  yet) — routed with the comms-watch-storage-redesign lane, which also owns
  the rotation-vs-live-watcher cursor-floor mitigation. **Standing residual:**
  the git-history coordination-tier corpus at `255117a43^` (see the corpus
  bullet above) — re-materialise before any pass over it.

The state entries from 2026-09-29 to 2026-10-05 that stood here are archived byte-identical in
`archive/repo-continuity-current-state-2026-09-29-to-2026-10-05.md`.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `oce-rearchitecting-programme` | The review, correction and merge of pull request #356 (the retained-framework rearchitecting programme, ADR-233) and the integration of that planning body with the estate's nodes, architecture documents and directives; opened 2026-10-13 at the owner's word. The owner's rulings, the discovery and the resume order live in the record. | [record](threads/oce-rearchitecting-programme.next-session.md) | claude-code / claude-fable-5-1 / Walrus seeks Maelstrom (9585cc) / reviewer at n=1, the lane closed and wrapped / 2026-10-19 |
| `estate-coordination` | The Director lane's thread record (founded 2026-08-13): journal, board, seat chain; `director-handoff.md` keeps the Brief and the live snapshot. Live state, the boundaries since 2026-09-03 (the Engraph fork; lead/support split) and the owner's standing open-PR-count goal live in the record. | [record](threads/estate-coordination.next-session.md) | claude-code / claude-fable-5-1 / Crucible binds Slag (7b999c) / the Director across both estates, paused at the owner's compaction word / 2026-10-03, claude-code / claude-opus-5-5 / Marten mends Shadow (74fc02) / this estate's exchange seat, stopped at rest at the owner's word / 2026-09-25, claude-code / claude-opus-5 then claude-fable-5-1, then claude-opus-5-5 from 2026-09-23 / Zephyr guards Leeward (281e44) / curator, sole operator until 2026-09-17 15:31Z, then at n = 2 with Dynamo turns Temper (2a4c8a, the Oak integration lane) — #145 landed, the 2026-09-14 branch folded, #147 landed on premises (`0bd321131`), #149 landed (`514bfc06a`), the deep retrospective landed (`940c019a6`), the 2026-09-15 branch folded as #150 (`a07940ac9`), the 2026-09-16 branch as #152 (`cd847a2b3`) and the 2026-09-17 branch as #153 (`SHA:b5b0e70cd`), its successor as #155 (`SHA:65a929d9a`) and the 2026-09-19 branch as #156 (`SHA:44729c98c`) inside the owner-directed consolidation, then the 2026-09-20 branch as #159 (`SHA:efb2942e9`) and the three 2026-09-21 branches as #169, #170 and #171 (the live branch is named once, in Next Safe Steps below, never in this row); from 2026-09-21 09:2xZ at n = 2 with the guest exchange seat Brazier spins Temper (c70341) for the three-estate Practice exchange / 2026-09-21 ← claude-code / claude-fable-5-1 / Flounder turns Estuary (c5cc2c) / lead at n=2 with Buzzard lifts Eyrie (326bcb) in support from ~19:3xZ; earlier solo implementer — owner rulings landed (merge-bot config per-checkout; green-and-clean merges without waiting) / 2026-09-03 ← claude-code / claude-fable-5-1 / Chinook seeks Cloud (661556) / lead at n=2 with Vesta rides Solstice (9e26e6), then solo for the wrap / 2026-09-03 |
| `open-surface-zero` | Oldest-first disposition and merging of Jim-owned open PRs; every feedback surface harvested, all checks green, then immediate merge. 2026-09-01: the fork-line integration landing (#943 → rehomed as #945) runs on this thread | [record](threads/open-surface-zero.next-session.md) | claude-code / claude-fable-5 / Luna seeks Twilight (5c0ddc) / driver — #943 Sonar-gate cure landed via the fork, rehomed as #945 at owner word, driving to the bot merge / 2026-09-01 (prior: codex / GPT-5 / Smith holds Temper (019fef) — #745/#746/#852 merged / 2026-08-11) |
| `design-system-integration` | AIP-137: the Claude-Design-exported design system as a first-class integrated system (ADR-213 — repo home + studio seat, bidirectional sync); kit landing, contrast gate, hub migration, studio sync-back. Lane state, owner rulings and the fidelity register live in the record. | [record](threads/design-system-integration.next-session.md) | claude-code / claude-fable-5-1 / Flounder turns Estuary (c5cc2c) / lead seat — PR #41 (MCP-613 records-truth pass) landed SHA:8b2b5ee03; the seven-item records residue is on the thread record §2026-09-05; claim b627b5af closed; the lane's next pickup (T1a-ii, or the residue) opens from a fresh claim / 2026-09-05 (seat chain: thread record) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation — the multi-lane doctrine/consolidation thread; this row is the index pointer only. Lane history, the identity table and the latest lane (the 2026-09-02 napkin-only dedicated consolidation and its step-6a synthesis, Kiln holds Slag) live in the record. | [record][agentic] | claude-code / claude-fable-5-1 / Kiln holds Slag (1447f4) / curator — napkin-only dedicated consolidation and the step-6a synthesis / 2026-09-02 (prior lanes: thread record) |
| `oak-slack-assistants` | Internal agentic Slack assistants over Oak's MCPs (Ask Oisín M1; future Ask Oak). 🟢 DECISION-COMPLETE, plan merged 2026-07-08; next: execute (WS-E1 first). Detail: [logging design record](../../research/outreach/slack-assistant-logging-observability-design.md) + the record. | [record](threads/oak-slack-assistants.next-session.md) | claude-code / claude-fable-5 / Salamander weaves Warmth (`4960fe`) / deep review — decision-complete rework / 2026-07-08 (chain: thread record) |
| `continuity-memory-and-knowledge-flow` | Memory/context substrate (PDR-124 landed; the 2026-07-05 per-user buffer drain complete, plan archived; the second dedicated drain complete 2026-09-14 — 495 Claude buffer entries dispositioned, graduation commit `0e4173b43`, 488 retired, the operator profile seeded). PDR-141 (Accepted, owner-ratified 2026-09-14) moves the operator profile to `~/.practice/profile/`; the seeded profile is ratified. The register's twelve directive-bound entries graduated on 2026-09-19 and the four drainable buffers read empty; the graduate-then-archive pass over the large memory files is complete (nineteen curated with dated archives, twenty read whole and left live; on engraph as #159 and #169); what remains is the owner-held decisions the record lists and the directive-tier candidates held below 30 % context; buffer lifecycle continues under `per-user-memory-is-a-buffer` | [record](threads/continuity-memory-and-knowledge-flow.next-session.md) | claude-code / claude-opus-5 then claude-fable-5-1 / Zephyr guards Leeward (281e44) / curator — the dedicated consolidation's second half folded as #153 (`SHA:b5b0e70cd`); its successor folded as #155 (`SHA:65a929d9a`); the buffers drained to empty and that drain folded as #156 (`SHA:44729c98c`); the memory-file pass folded as #159 (`SHA:efb2942e9`) and the consolidation's close as #169 (`SHA:72cab5667`) / 2026-09-21 ← the same seat / curator — second dedicated drain complete / 2026-09-14 |
| `codex-dialogues` | Codex as an invocable second opinion: the Codex dialogues rebound onto `codex exec` and `codex exec resume` under the node `the-codex-dialogues-exec-binding` (slices 0 to 1b-iii landed, #184 to #196), then the lane's Codex-membership pull requests (the record's Current Continuation). At the 2026-09-27 close: PR 261 (the command-record reader, with the Bash guard's shell segmenter consolidated) landed 14:30Z as `5a9a854ef` through the merge door with both legs satisfied on its tip, the door seat Nova turns Penumbra (8a94ba) adopting claim `f7d8f0de` at the Director's routing. Distinct from first-class Codex support in the Practice, the Director track | [record](threads/codex-dialogues.next-session.md) | claude-code / claude-fable-5-1 / Swallow holds Drift (516619) / lane owner, closed out 2026-09-27; PR 261 landed after the closeout through Nova's door ← claude-code / claude-opus-5-5 / Blazar lifts Corona (b65a9a) / lane owner / 2026-09-24 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools; moved from Active 2026-07-30 (no identity touch since 2026-06-08); reactivation is owner-directed via §Next Safe Steps. | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior identities: thread record) |
| `eslint-no-throw-result-migration` | Migrate every throw to Result (ADR-088) and drive the warnings to zero; RESHAPED survey-first (four conversions landed) and paused for the strategy thread (moved from Active 2026-07-30); the agent-tools warning residue belongs here. | [record](threads/eslint-no-throw-result-migration.next-session.md) | claude / Opus 4.8 (1M) / Siren mends Rudder / execution — observability+graph-core+logger landed (`93beffcfe`,`304b68f8d`,`61bdbc3e4`) / 2026-06-19 (prior: Merlin spins Cirrus `1556b9191`; Vanilla weaves Undergrowth, plan-author) |
| `codex-to-codex-hook-review-experiment` | **RETIRED at owner ruling (2026-08-02).** Fresh-process hook lane RED on configured latency; PR #403 closed unmerged with its state preserved, preservation PR #705 closed, the branch deleted; the record holds the frozen evidence and negative results. | [record](threads/paused/codex-to-codex-hook-review-experiment.next-session.md) | codex / GPT-5 / Lupin herds Bark / closeout owner — full pause handoff, mixed-index state and failed attachment captured / 2026-07-16 ← Zephyr turns Crosswind / terminal handoff / 2026-07-16 |
| `itf-knowledge-graph-spike` | The Inclusive Teaching Framework (Ambition Institute 2026) as a knowledge graph in the graph-corpus design grammar — a candidate data source. Spike COMPLETE, preserved on draft [PR #401](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/401) (HOLD: the owner's TS-promotion gate); knowledge surfaces conserved on main 2026-07-17. | [record](threads/paused/itf-knowledge-graph-spike.next-session.md) | claude-code / claude-fable-5 / Fern spins Taproot / implementer (solo) — spike landed, full preservation set + closeout / 2026-07-07 |
| `eef` | EEF graph-tooling rebuild — D0–D7 delivered & shipped (v1.16.0); D7 proof dropped as overkill (paused 2026-06-19) | [record][eef] | claude / Fable 5 / Thyme wakes Canopy / record-condensation / 2026-06-12 (prior identities, 30+ seats: thread record) |
| `data-sources-governance` | Author `docs/governance/DATA-SOURCES.md` (suitability / last-reviewed / removal criteria) — **owner-gated**: new governance policy, an owner decision, not agent-resolvable; gates the under-the-hood/explain user-exposure surface | [record](threads/data-sources-governance.next-session.md) | claude / Opus 4.8 / Ferret weaves Nightfall / thread-opener-brief-only / 2026-06-25 |
| `school-data-search` | Oak School Data Search service (POC MVP): deep review complete, build-ready (paused 2026-06-19) | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior identities: thread record) |
| `semantic-search` | Search data foundations plus paused source-portable curriculum-exploration evidence and planning | [record][semantic-search] | codex / GPT-5 / Codex / reusable-curriculum-architecture search synthesis and closeout / 2026-07-15 |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work via a deep review of the Oak Curriculum Ontology repo (opened, not started; paused 2026-06-19) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 |
| `connecting-oak-resources` | Oak resource graph substrate plus queued source-integration workspaces and paused reusable-curriculum-architecture evidence | [record][connecting] | codex / GPT-5 / Leopard tracks Dewdrop / source-integration concept exploration, plan, and closeout / 2026-07-15 |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | claude-code / Fable 5 / Forge turns Basalt / dfe-data-sdk-seed-authoring / 2026-06-12 (prior: Squally / cursor / 2026-04-30) |
| `architectural-budget-system` | Cross-scale budgets; proposed report-only directory-concentration validator direction awaits owner ratification | [record][budget] | codex / GPT-5 / Spark seeks Pumice / concept exploration and handoff / 2026-07-15 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |
| `mcp-submission-drive` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. Formerly the Oak line's live priority thread: Oak's MCP app to public beta (publicised 2026-09-06), the Anthropic connector submission of 2026-08-07, landing target MCP-597. Detail in the record. | [record](threads/paused/mcp-submission-drive.next-session.md) | claude / claude-opus-5[1m] / Dormouse turns Footfall (a54547) / director — seated 2026-08-17 LATE evening at owner word, after Skunk stirs Cavern (db8b9b) stood down 17:42Z; resumed 2026-08-18; PR #903/#902 CHANGES_REQUESTED blockers under cure / 2026-08-18 (seat chain: thread record) |
| `workspace-config-isolation` | PAUSED 2026-09-06 — no fork lane; identity row stale. Config-boundary cure lane (the workspace-config package, depcruise boundary rules under three owner rulings, the de-hatch arc, census todos); #836/#865 merged; the de-hatch and census todos are the pickup. | [record](threads/paused/workspace-config-isolation.next-session.md) | claude-code / claude-fable-5 / Wren calls Downdraft (6b29b5) / implementer — #865 closed out, seat closed at owner word / 2026-08-13 |
| `typescript-estate-consolidation-review` | PAUSED 2026-09-06 — no fork lane; identity row stale. Repo-architecture lane whose design was ratified 2026-08-19 on the Oak line (strategic node `toolkit-re-architecture`; the Toolkit Atlas five-change set); execution is not a lane on this line. | [record](threads/paused/typescript-estate-consolidation-review.next-session.md) | claude-code / claude-fable-5 / Poppy lifts Bark (d427b6) / repo-architecture lane — change set + strategic node ratified at owner cards 2026-08-19; claim closed at wrap, fresh pickup next / 2026-08-19 |
| `mcp-product-analytics` | PAUSED 2026-09-06 — fork ruling 2026-09-06: no Oak-surface access. Submission-blocking PostHog sink and MCP analytics integration; October public-beta governance is a separate gate | [record][mcp-analytics] | Cutter hunts Lagoon / codex / GPT-5 / active implementation custody ← Kite seeks Crosswind / handoff complete and retired / 2026-07-26 |
| `first-class-copilot-cli-practice` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. GitHub Copilot CLI as an equal first-class citizen of the Practice (identity, team join, hook policy, projections, comms and lifecycle, live proof); the CLI-only strategic and four delivery nodes owner-ratified; runtime gated on their replacement record. | [record](threads/paused/first-class-copilot-cli-practice.next-session.md) | codex / GPT-5 / Thistle holds Blossom (019f94) / replacement-plan implementer / 2026-07-24 ← copilot / gpt-5.6-sol / Thistle rides Canopy (494337) / design authority and live evidence author / 2026-07-24 |
| `mcp-agent-facing-content` | PAUSED 2026-09-06 — fork ruling 2026-09-06: no Oak-surface access. Audit + classified registry of repo-controlled content reaching MCP consumers (the effective agent prompt); distinct from `data-sources-governance` (DATA sources). Deliverables + lane history: thread record | [record](threads/paused/mcp-agent-facing-content.next-session.md) | codex / GPT-5 / Smelter rides Temper (019f9f) / implementer — MCP-103 phases (b)/(c), PR #582 shepherd / 2026-07-27 (chain: thread record) |
| `upstream-api-alignment` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. Realign SDK/MCP and bulk export to the evolving upstream Oak API by a repeatable observable process; the programmes-family instance on PR #291; the process graduated to a permanent runbook. | [record](threads/paused/upstream-api-alignment.next-session.md) | claude-code / claude-fable-5 / Birch holds Seedling (e48fe2) / implementer — the 2026-08-03 upstream update lane (MCP-462/463/464) / 2026-08-03 (chain: thread record) |
| `statusline-enhancements` | PAUSED 2026-09-06 — no fork lane; identity row stale. Claude Code statusline: Oak-mark, session-shape indicators, location rows and rate-limit gauges DELIVERED (2026-06-29, `708cd57fc`); the logo lane paused by the owner; future lanes and the branch state in the record. | [record][statusline] | claude / claude-fable-5 / Magma mends Sulphur / curator — record hygiene at the 2026-07-23 consolidation / 2026-07-23 ← Wyvern seeks Clinker / footer-PR-badge diagnostic / 2026-07-06 (earlier identities: thread record) |
| `agent-naming` | PAUSED 2026-09-06 — no fork lane; identity row stale. PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued; v3 plan now cross-linked to the knowledge-distribution-substrate direction) | [record][agent-naming] | claude-code / claude-fable-5 / Moss calls Loam (79b433) / identity-lane implementer — MCP-457 + the MCP-145 visual-disambiguator slices all MERGED, both plans archived, LANE COMPLETE / 2026-08-02 (prior identities: thread record) |
| `agent-operability` | PAUSED 2026-09-06 — no fork lane; identity row stale. Agents operable in their own worktrees (launch-in-worktree as the identity→worktree→branch binding, worktree lifecycle, seat-in-the-brief); controlling plan owner-approved 2026-06-28; next: the cwd-confirmation smoke test, then Phase 1A. | [record][agent-operability] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / thread-record orphan-fix + branch reconcile (no build) / 2026-07-01 |
| `strategy-and-plan-estate-holistic-review` | PAUSED 2026-09-06 — no fork lane; identity row stale. Planning-estate rewrite on a living idea-graph (ADR-200/201) with the plan-corpus REFOUNDING inserted first; gated on the restatement-remediation effort. The arc, Director chain, rulings and pickup state live in the record — read it FIRST. | [record](threads/paused/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / claude-fable-5 / Petrel calls Aether (d4f4b7) / AIP-126 implementer — full closeout / 2026-07-18 (full seat chain: thread record identity table) |
| `orientation-skills-family` | PAUSED 2026-09-06 — fork ruling 2026-09-06: no Oak-surface access. Teaching-surface family: a portable agentic-AI primer (lead-in) plus the **one** repo-bound orientation lens (`/oak-under-the-hood`) across the PDR-112 portability seam | [record][orientation] | claude-code / claude-fable-5 / Juniper holds Tendril (3dfd3b) / implementer — dev-facing guide arc, PRs #603 + #604 owner-merged / 2026-07-28 ← claude-code / Opus 4.8 (1M) / Clover mends Hedgerow / **reframe `/oak-explain`→`/oak-under-the-hood` + MCP pointer projection MERGED via PR #243 (`a0a85f60c`, 2026-06-27); ADR-202 + ADR-205. `oak-under-the-hood.plan.md` DONE→archive; MCP-surfaced discoverability follow-on owned by `current/mcp-tool-taxonomy-and-orientation.plan.md` (decision-incomplete, WS0 not started)** / 2026-06-28 (prior: Zenith lifts Firmament — unification `ca40d98ce`; Swordfish/Seal — reframe build; Skipper tracks Reef, Orbit rides Horizon, Bora lifts Downdraft) |
| `main-sonar-ai-profile-to-zero` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. Drive `main`'s Sonar AI quality-profile backlog to zero under the owner-ratified disposition bar (fix at source by default); Phases 1–3 + 5A merged, Phase 5B on PR #308; the next batches doctrine-first. Detail in the record. | [record][main-sonar-zero] | claude-code / claude-fable-5 / Katydid seeks Moonbeam / implementer — Phase 5B + the ADR-153 guard arc; PR #308 at the code-owner gate / 2026-07-06; Zenith wakes Perigee (8897eb) / curator — drift-guard follow-on noted in the record / 2026-07-06 (prior: Alder tracks Topsoil #242, Gull tracks Eyrie #246/#249, Junk tracks Moorings #223, Thyme lifts Compost, Aspen tracks Root) |
| `curriculum-hub-demo` | PAUSED 2026-09-06 — no fork lane; identity row stale. Reproduce the Oak Curriculum Hub from the Claude Design canonical export (DoD §A–J); build complete, MERGED 2026-07-06; the live remainder in §Current State and the record. | [record](threads/paused/curriculum-hub-demo.next-session.md) | claude-code / claude-fable-5 / Thyme weaves Hedgerow (762020) / MCP-372 hub-conformance carrier / 2026-07-30 (lane state on the design-system-integration record; prior cast: thread record) |
| `skills-estate-organisation` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. The standing agentic-skills-and-mechanisms lane; the skills-estate plan (WS0 reflection R1-adopted, rules reclassification ratified and landed); resume from the WS0 working record's last entry. | [record](threads/paused/skills-estate-organisation.next-session.md) | claude-code / claude-fable-5 / Skylark hunts Nimbus (e856d5) / skills-lane implementer — WS0 opened and ruled; #726 merged, #731 generator pair merged after the wrap (`1356579ca`) / 2026-08-03 |

## Next Safe Steps

STATE, 2026-10-13T13:0xZ (Walrus seeks Maelstrom, 9585cc, the reviewer seat at n=1, at its compaction
boundary at the owner's word): the review lane for pull request #356 is open under claim `b13d5c39`;
the discovery is reported. Next safe steps for that seat, in order, from the thread record
`oce-rearchitecting-programme`: verify the task list and re-arm the watcher only if absent; read Oak
pull request 1000 read-only (the owner's word of the day permits every Oak GitHub read; writes stay
forbidden); reflect on the integration of the planning body and report; plan the review with the
owner; correct; merge. Merge is not blocked on the Education corpus; adoption is. The consolidation's
state below stands untouched, and the coordination branch's fold stays suspended.

STATE, 2026-10-14T12:1xZ (Flint guards Vapor, 9b835d, the third dedicated two-estate consolidation's seat,
working this estate non-resident from jimcresswell.net on lane docs/consolidation-3 in a linked worktree): the
consolidation's own pickup is the sibling estate's thread record `two-estate-consolidation.next-session.md`,
newest block first, on its lane worktree; this estate's §Current State entry of 2026-10-14 carries the stage. The
state blocks of 2026-09-21 to 2026-10-11 that stood here are archived byte-identical in
`archive/repo-continuity-next-safe-steps-2026-09-21-to-2026-10-11.md`; the work they still held, compacted, each
at the owner's routing:

1. The consolidation's remainder here: the register's one entry (the operator-profile half of the Oak GitHub
   read ruling: one line in the owner's profile scope file for this repository line, written on his word
   only, due since 2026-10-13); the napkin's rotation by proof once the reviewer seat commits its block;
   the close (the curator claim closed, the watcher stood down with its end event, the closeout event).
2. The merge-tool code lane `fix/merge-bot-records-class-and-fold-clock`, done to its gate on 2026-10-14: one
   pull request against the default branch at the owner's push word; it and this records lane touch no file
   in common and merge in either order.
3. Carried from the 2026-10-05 states: `--fail-if-no-match` on every filtered alias in the family manifest
   with a validator case, the same bytes in both estates; the 23 `.css` knip hints this estate reads as
   errors and the sibling as information, one reading in both; `authored-surfaces`'s POSIX joins owed to
   this estate; the merge-bot's merge side and `pr-watch` to one shape in both estates (the code lane
   carried the records-class door; forty-one shared merge-bot files still differ); the two Copilot
   observations on one-body modules (the cluster signature's `|` join, the review-cost base-merge
   exemption).
4. The J2 docs-validators port: the worktree `oce-wt-j2-docs-validators` on `feat/exchange-j2-docs-validators`
   stands beside the primary, 346 commits behind the default branch, with 23 uncommitted entries (the
   2026-10-03 state's ledger row C27 and owner row O4); its disposition is the owner's.
5. The coordination branch `coordination/2026-10-05-efe69f` is DUE to fold (day nine); the owner ranked the
   consolidation above the fold on 2026-10-13.

STATE, 2026-10-15T09:5xZ (Flint guards Vapor, 9b835d, the consolidation's finish at the owner's one-hour word):
the owner's word of 14 October on swearing is a section of the rule `records-are-technical-not-emotional`, the
same bytes in both estates (no swearing in tracked files of the Practice or the key documentation; records
censored with The Good Place's words; rules and decision records elided with the omission marked; content never
read; history unrewritten). This estate's Practice is censored: nineteen matches in fourteen records, the three
rules and two decision records elided as in the sibling, one finding left and named (a truncated word inside an
API-path capture in a report), a zip not read. The replacement ran with the sibling estate's tool from there,
because this estate's agent-tools carries neither the profanity topic, the staged-files repo-check command nor
the pre-commit hook: a parity item for this estate's implementer beside item 3 above, a code lane with its own
pull request. The merge-tool code lane (item 2) is pushed to the remote and its pull request opened against the
default branch; the merge-bot settles it. This records lane lands on the coordination branch by fast-forward
push; the branch is DUE to fold at day ten (item 5). Item 1's rotation still waits on the reviewer seat's
uncommitted block; the register's one entry is the operator-profile scope line named in item 1, written on his
word only.

STATE, 2026-10-15T11:1xZ (Flint guards Vapor, 9b835d, amendment at the owner's word): the `.agent/experience/`
register is excluded from the censoring; the three experience records the pass above had censored are written
back to their captured bytes in a forward commit on this lane; the research notes and probe data stay censored at
his word; the rule's section carries the exclusion, the same bytes in both estates. The parity item's hook, when
built here, honours the exclusion.

STATE, 2026-10-16T10:3xZ (Flint guards Vapor, 9b835d, amendment at the owner's correction): "owner-gated" was
abolished by PDR-100 and "at the owner" names no item, so work behind either phrase is lost; the two phrases this
seat wrote above are corrected in place. The decisions put to him, exact: (1) the operator-profile scope line for
this repository line, whose standing text says every Oak surface beyond `git fetch upstream` needs permission, to
carry his word of 2026-10-13 (every read of Oak GitHub permitted, every write forbidden until he lifts it);
written on his word only; the register's one entry graduates on the write. (2) The J2 worktree
(`feat/exchange-j2-docs-validators`): twenty-one added and two modified files, validators for cited paths, cited
scripts, markdown links and lineage names, uncommitted since 2026-09-29, no commit ahead of its base, 346 behind
the default branch; commit and push to its branch, or drop. Work needing a seat, not him: this coordination
branch at day eleven, over its lifetime; the four bot review comments on the merge-tool pull request (item 2
above); the profanity tooling parity (item 3 above, the hook honouring the experience-register exclusion).

STATE, 2026-10-19T08:2xZ (Walrus seeks Maelstrom, 9585cc, the reviewer seat at n=1, the wrap at the owner's
word; the lane of pull request 356 is closed and nothing of this seat runs). The owner's ordering of what
follows, in his words of this date (§Current State): partial plans, fixes and graduations, then "the
architecture work for decoupling the thin Oak apps" as the next feature priority; the surfaces touching the
curriculum infrastructure consumer are his to plan and are left stable. Next safe steps for the next seat,
each with its measure:

1. The partial plans. The programme's fifteen `oce-*` sketches and its strategic node (every one
   `status: sketch`, `last_updated: 2026-10-10`) read against the merged ADR-233 and the seven points in the
   thread record `oce-rearchitecting-programme`; the two nodes with expired owner gates
   (`semantic-search-showcase`, `warranted-means-in-the-operating-environment`) decided under PDR-100 with
   the register's owner-gate entry; the three superseded nodes placed as the plans index says (§"Plans
   estate — superseded-node placement to re-true" below); the other thirty-five sketches read for a
   supersession or a stamp, not planned. This coordination branch takes engraph's merge first: the
   programme's files are on engraph since 2026-10-17 and not on this branch.
2. The fixes. The merge tool's Copilot leg per pull request (the register entry's standard: one Copilot
   review per non-trivial pull request satisfies the leg; pull request 358 is open with the records-class
   door and the fold clock, another seat's lane); `commit-queue complete` refusing an intent that never
   reached a commit (F-297); the carries in the 2026-10-16 state above (the bot token's 403 refusals, the
   profanity tooling parity, the `--fail-if-no-match` aliases).
3. The graduations. The register's six due entries, each with its target named; the napkin's rotation by
   proof, unblocked since 2026-10-17; the consolidation gate reads due (a lane closed; the napkin at
   critical) and is a curator seat's, bounded to its own session.
4. Then the dedicated architecture session with the owner on points 1, 2, 3 and 7 of the ADR-233 analysis,
   point 5 beside them, before any adoption; the session's result lands as his words in ADR-233 and the
   nodes it ratifies. The seat test for every sentence stands: his word, the pull request's word or the
   directive's word.
5. Two local branches, each one commit that no remote carries, proven of no use by content on
   2026-10-19T10:0xZ at the owner's word ("Analyse the two branches, if they are useful put them in a draft
   PR, if they are not useful, delete them"): `docs/consolidation-2-routed-cures` (`SHA:f9f0a2ca6`) and
   `docs/consolidation-2s-skills` (`SHA:78547cb3f`). The proof, against `engraph` at `SHA:493951ad7`: every
   added line of the skills commit is in the same ten files, rewrapped (its content landed as
   `SHA:53f06c866` in pull request 341, merged 2026-10-02); of the routed-cures commit's 345 added lines, 329
   are present and the 16 others are on the default branch in fuller words (the archive clause in the
   continuity directive and consolidate-docs step 6b, the friction F-219 entry, the commit skill's header
   check) or superseded by a reviewed landing (PDR-075 "Accepted" with its changelog and index rows; the
   record is Proposed by its own 2026-10-01 review, so adopting the branch would revert it). The holding
   condition in the estate-coordination thread record (the directive clause, todo 7) is discharged by that
   proof. The deletion command was denied by the Bash permission policy at 10:0xZ; the two refs stay local
   until the owner runs `git branch -D` on them himself. Of the owner's words that pull request 360's body
   relays, both are now his direct words of 2026-10-19 (the fold-lifetime rule's amendment; the
   `worktree-hygiene` paragraph).

### Reliable Atoms workspace class — owner rulings recorded (2026-09-14; left uncommitted, then committed in `f24683337` the same day)

**Owner, 2026-09-17, verbatim:** "Reliable Atoms as a concept will be completely removed, this has
not happened yet, but it will, we have a replacement concept that is far more effective and
useful". Read what follows as the concept's standing record until that removal lands; do not
build on it, and do not name or infer the replacement concept from here.

The 2026-09-14 rulings (an owner-directed docs-only session) were committed the same day in
`f24683337`; the surfaces they touched are listed in the paused [budget thread
record][budget] §2026-09-14. Still open from that note: deleting the
unregistered `max-files-per-dir` ESLint rule is the delivery node's first slice, a source
change with gates, not a docs sweep; and no existing core workspace is a reference for the
class.

### Plans estate — superseded-node placement to re-true (2026-09-06)

A 2026-09-06 review round moved a superseded delivery node from `delivery/` into
`delivery/archive/` (commit `0058c2654`); the plans index (`.agent/plans/README.md`
§Layout, amended in `7e7dce9fa`) states the opposite placement — a superseded node keeps
its place and names its successor — and the node schema keeps `superseded` and
`archived` as distinct transitions. One of the two surfaces is re-trued at the next
plans-estate pass; until then the index is the stated authority.

### The operating model (owner-set 2026-07-17) — standing; pickup authority is `director-handoff.md`

The 2026-07-17 cold-pickup queue that lived here is re-owned through the
Director records (its still-live items: the AIP-128/129/130 enforcement
tranche — owner rulings ride the tickets; the compressed v2 cycle,
owner-named critical path — inputs `pr-review-corpus-analysis-2026-07-16.md`
and the F8 report under `.agent/reports/restatement-audit/`; the refounding
restart at its gate; the cricket tally toward the flip). The dedicated
consolidation it queued ran 2026-07-23 (§0a below). The operating-model
paragraph below stays the standing doctrine reference it was.

**The operating model (owner-set 2026-07-17):** the primary checkout lives ON
`coordination/estate-2026-07` with ZERO dirty files; live fleet surfaces
(napkin, continuity, registers, ARC channels) are tracked and committed there;
canary keys stay gitignored (never-in-history); `.agent/state/collaboration/`
runtime incl. `handoffs/*` is gitignored (handoff records are MACHINE-LOCAL).
All PRs target `main`; after every merge, merge `origin/main` back into the
coordination branch and push. Estate roll-ups to main go via SHORT-LIVED
branches cut from the coordination tip (never a PR from the rolling branch —
the merged-PR bot-review treadmill; PR #405 109 threads vs cut-branch #408 at
5), deleted at merge; roll-up trigger is session close or owner word. Ordinary
ticket branches cut from `origin/main` in a worktree (the ticket's
`gitBranchName`), never from the coordination tip. Every push pays the full
pre-push gate (~4–6 min): batch cures, one push per adjudicated round.
Capture-branch hazard: marker-probe captured files against current main before
any merge (stale-capture-wins — see `distilled.md` 2026-07-17).

### Source integration workspaces — ready, sequenced after the P0 audit (2026-07-15)

Evidence: the [`oak-integrations` report family](../../reports/oak-integrations/README.md).
Executable owner: the
[source integration workspaces plan](../../plans-backlog-2026-07/architecture-and-infrastructure/current/oak-source-integration-workspaces.plan.md)
(optional pinned source checkouts for OpenAPI/Castr/Ontology/Database-Tools;
public-root path complete when submodules absent). `ready-for-execution`,
sequenced after the P0 workspace layer-separation audit; the executor runs the
plan's blocking preflight first (source visibility, branch policy, npm scope,
vendor call shapes).

### Reusable curriculum architecture — evidence complete; promotion owner-directed (2026-07-15)

The [three-report family](../../reports/oak-reusable-curriculum-architecture/README.md)
and the future
[planning brief](../../plans-backlog-2026-07/connecting-oak-resources/reusable-curriculum-architecture/future/reusable-curriculum-architecture-planning.plan.md)
are the durable homes. `connecting-oak-resources` + `semantic-search` stay
paused; no implementation authorised — the next action is the brief's
owner-directed promotion trigger only.

### agent-tools architecture — plan authored; commit + standard deferred (2026-06-29)

`check-encoding` (the permanent UTF-8/encoding scanner) is landed and wired into `pnpm check`
and pre-push. The deferred architectural excellence is a strategic brief —
[`agent-tools-architecture-standard.plan.md`](../../plans-backlog-2026-07/agent-tooling/future/agent-tools-architecture-standard.plan.md)
(WS0 the execution-model fork → ADR + enforcement + encoding-engine→`packages/core` + the
where-supported Write/Edit hook + convergence) — with the analysis at
[`reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md`](../../reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md)
and Callisto's handoff at
[`reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md`](../../reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md).
Owner direction 2026-06-29: **working now, excellence later** — the standard is a dedicated future
session (promotion runs the plan's WS0 decision pass first). State trued
2026-07-23: the scanner is LANDED and wired (`pnpm encoding:check` in root
scripts; `corpus-analysis/` is committed code, the old WIP hold is gone); the
architectural standard remains the future brief.

### Agent Naming (v3 + era-pinning cure)

Thread [`agent-naming`][agent-naming]; controlling plan
[`agent-naming-schema-v3.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-naming-schema-v3.plan.md)
(DECISION-COMPLETE / QUEUED, `current/`). v2 merged (PR #189). **Next safe
step**: execute **Phase 1 (WS1, era-pinning cure)** off a fresh branch from
`main` — the P1 single-valued-identity fix (hooks pin the era
`OAK_AGENT_NAMING_SCHEMA_ID`, not the rendered name). It ships independently and
is the owner-ordered prerequisite for v3 activation. Phases 2 (C wordlist
curation, owner taste review BLOCKING) and 3 (v3 registry entry + activation)
follow. Orientation: read the thread record, then the plan, then re-grep the
`OAK_AGENT_IDENTITY_OVERRIDE` consumer set (plan-body first-principles check).

### Agent Experience (AX) Improvement — WS-3 F-41 LANDED; next highest-impact item

Umbrella plan
[`agent-experience-improvement.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-experience-improvement.plan.md)
(`current/`), evidence
[report](../../reports/agent-experience-cause-class-analysis-2026-06-21.md), doctrine PDR-111.
**WS-3 (F-41 path-safety) is DONE** (`b5408291d`+`c90150ffa`+`4fd640089`): `resolveCoordinationHome`
resolves the **primary checkout** via `git worktree list`, so any worktree seat shares one coordination
home. **Next safe step (owner-chosen 2026-06-22): WS-1 — the CLI-ergonomics conformance guard.** Execute
[`agent-tools-cli-ergonomics.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
from **Phase 0** (the convention-audit + scope-ratification gate) → WS6 (the PDR-055 cl.10 conformance
guard); retires the largest cause-class (~19 frictions, Class A). Subsequent AX items: **WS-4** (the
`frictions-register` drain validator that recomputes integrity against fs/git → **WS-6** disposition
ledger — the systemic spine); **WS-2** (watcher liveness + canonicalisation); **WS-3 B2** (the deferred
F-41 CLI tail).

### Agentic Mechanisms Discovery

1. Treat the parent plan
   [`agentic-mechanisms-discovery.plan.md`](../../plans-backlog-2026-07/discovery/future/agentic-mechanisms-discovery.plan.md)
   as the layer map for skills, MCP Server Cards, MCP runtime discovery, A2A,
   registry metadata, and generic AI discovery proposals.
2. Resume executable work from
   [`agent-readiness-discovery-hub.plan.md`](../../plans-backlog-2026-07/discovery/current/agent-readiness-discovery-hub.plan.md),
   starting with `ar1-refresh-standards-and-live-estate`.
3. Keep Web Bot Auth in Phase 1 as a decision-ledger and security-evidence
   bridge; the future child plan owns any later enabled-control rollout.
4. Do not implement gated `future/` endpoints or metadata until the owner
   explicitly promotes the relevant child plan.

### Agentic-Engineering Curation

0. Corpus generalisation: Phase 0 paused at a stable point (2026-07-05/06). The
   self-contained restart brief, with the branch-and-merge sequencing, is the AEE thread
   record §CORPUS GENERALISATION (its PHASE 0 block).
0a. **Deep-consolidation carried work (the only part a next curator needs).** The
   ordinary triggers govern when the next pass fires; there is no inherited debt
   beyond these named items:
   - **Comms-event rotation (`consolidate-docs` step 3a)** ran on the primary
     checkout on 2026-09-07 under the recorded 2026-08-14T06:16:28Z watermark
     and the provenance gate (heartbeats past 48 h by the harness; substantive
     events at or before the watermark by hand). Moves are facts about the
     checkout that ran them (PDR-094): recompute the live and archive counts
     before trusting them elsewhere. The 2026-08-14 → 2026-09-07 window's
     absorption sweep is not yet declared, so no newer watermark exists. Events
     younger than their class window are the live coordination stream and are
     never moved. The curator-disposition input-channel tooling gap rides the
     comms-watch-storage-redesign lane.
   - **`director-handoff.md` live-file curation LANDED 2026-09-08** (the
     Director's 2026-09-07 ruling): the live file keeps the Brief, the fold block
     and a live snapshot; every prior `CURRENT HANDOFF STATE` block is verbatim in
     `.agent/memory/operational/archive/director-handoff-current-handoff-state-2026-09-08.md`,
     so no binding owner word was drained. What remains is a bounded sitting over
     THAT archive: the ~42 numbered owner rulings its blocks mark binding each need
     a homed-or-not check (ruling by ruling against the rule, PDR or skill that
     should carry it); a successor sizes it by checking rulings 1–42 against their
     homes, and the archive stays as the literal record either way.
   - **The tiered-sight / multi-machine PDR candidate** (machine-local vs
     repo-bound state classes; the nothing-load-bearing-on-one-machine invariant;
     the standing pipeline replacing one-off rescue) is a doctrine seed on the
     Director's map, reconciling with PDR-094 / ADR-199 rather than duplicating
     them. Its substance is the comms-corpus discovery report §Tiered sight.

2. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
2a. `agent-collaboration.md` is hard-over on lines (380/360) after the injected-asymmetry doctrine
   and the ws1b sidebar-preference clause landed (justified substance; the file was already at
   359). The named remediation is its own `split_strategy`: create
   `agent-collaboration-channels.md` and extract the per-channel protocol detail — a focused
   future extraction, not a trim.
2b. **Post-ws1b hard-fitness remediation lane (2026-07-03).** The ws1b graduations pushed four
   further surfaces marginally past hard — `testing-strategy.md` (459/450 lines),
   `docs/engineering/testing-patterns.md` (232/200), `docs/governance/development-practice.md`
   (286/280), `collaboration-state-conventions.md` (12045/12000 chars) — each from
   correctly-placed substance, never to be trimmed. Structural responses per each file's own
   `split_strategy` at the next natural boundary (testing-patterns' gotcha lists are the natural
   extraction; development-practice's markdown-authoring bullets likewise). Acceptance: the
   substance survives verbatim in a home at least as read-proximate, and the source returns
   within hard. `principles.md` and this file's char pressure pre-date the pass.
3. Comms-event rotation is the retention-gated curator-pass (ADR-199 / PDR-094): archive-move events past
   their class window, gated on absorption + provenance. Analysis is never gated; fitness is routing
   evidence only — never archive, split, shard, or rename unprocessed content to improve scores.
4. **Practice Box dispositioned 2026-07-23 (owner card)** — see the
   §Current State inter-Practice bullet for the disposition. Still queued,
   owner-scoped: the dedicated cross-estate integration session for the
   resonance bundle's four design-shape offers (carried since 2026-09-17 in the
   AEE thread record's "Offered by resonance on 2026-07-08" block; proof-ladder claim-typing,
   refusals-list, posture-selection procedure, obligation-family) plus the
   earlier-noted recomputable-plan-state / worker-class / protocol-PDR
   candidates; a further PDR-117 host-indirection tightening landed
   2026-07-23 (the literal path removed from the portable body).

0d. **`~/.claude/plans` (machine-local, per-user) was triaged in full on 2026-08-14**:
   all 26 files then present were read and classified — 18 landed or superseded (homes
   verified at file:line), 7 foreign-estate (left in place; deletion is an owner call),
   1 valuable-unlanded whose two residues landed at `35d9bca74`. The per-file verdicts
   are conserved at the 2026-08-14 ~07:3xZ entry of
   `.agent/memory/active/archive/napkin-2026-09-02.md`. A later pass reads only files
   dated after 2026-08-14.

### Connecting-Oak / PR History

The [thread record][connecting] holds the lane's standing decisions and grounding. Before
resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

### MCP Test Estate + Observability Sinks (both DECISION-COMPLETE 2026-06-06)

Both plans are `🟢 DECISION-COMPLETE`, execution owner-scheduled. Neither has a
dedicated thread record yet — the session-level home is the § Current State entry +
this section; create a thread record when execution is scheduled.

1. **Test estate** —
   [`unified-mcp-server-test-harness.plan.md`](../../plans-backlog-2026-07/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md):
   WS0 (built-server smoke harness) + WS3 (network-free e2e rebalance) are
   EEF-independent and executable now; WS1 (= EEF D7) is gated on EEF D6 landing.
   Cross-plan: sequence WS3's live-executor consolidation BEFORE the MCP slice of
   `no-io-test-boundary-and-di-recovery.plan.md` (collision risk, per the plan's
   §Cross-Plan Coordination).
2. **Observability sinks** —
   [`observability-sinks-decoupling.plan.md`](../../plans-backlog-2026-07/observability/current/observability-sinks-decoupling.plan.md):
   C1+C2 (atomic: forcing-function test + standalone OTel `NodeTracerProvider`, adds
   `@opentelemetry/sdk-trace-node` + amends ADR-171) → C2b (build the `SENTRY_MODE`
   bridge in env-resolution + reconcile the sink-enum) → C3 (migrate consumers) → C4
   (renames) → C5 (close). Execution gated on the relevant feature branch(es) merging.

The retired sections Codex-to-Codex hook review (2026-08-02) and Comms-Corpus Research (2026-06-14) that
stood here are archived byte-identical in `archive/repo-continuity-retired-sections-2026-06-14-and-2026-08-02.md`.

## Open Owner-Decision Items

None. The ten items this section carried until 2026-10-02 were re-trued against the estate on
2026-10-02 14:2xZ (each read first-hand at its paths) and retired the same day under the owner's
rulings of 17:0xZ and 17:1xZ ("NOTHING is blocked on me"; nothing is worked on without completion
criteria, a size and a ratified-value line; all of it bounded and finished soon), by the Director's
routing to the consolidation seat. Each took one verb of the owner's triage taxonomy:

1. MCP product analytics: DELETE as overtaken. PR #568 merged 2026-07-26, the public beta was
   publicised 2026-09-06, the implementation thread is paused under the fork ruling, and MCP-173's
   evidence is not in this estate; the October-enablement question has no criteria, size or value
   line here and reopens only as a node carrying all three.
2. Monorepo workspace topology: DELETE as overtaken. ADR-227 (Accepted 2026-09-03) and the
   ratified census and config-isolation plans cover the parked ADR's scope; a supersession note,
   if wanted, is a one-line edit on the parked plan, not a decision.
3. MCP launch-readiness ladder: DELETE as overtaken. `first-major-release` is ratified and the
   beta is live; no live document cites the stub, which stays `future` by its own status.
4. External-facing capability corpus: DELETE as overtaken. A plugin shipped (PR #999,
   2026-10-01); the corpus map's two questions were answered by what shipped, and the next
   tranche is a node with criteria, size and value when one is wanted.
5. Native-MCP-auth build-vs-buy: DELETE. The spike is a strategic brief of 2026-06-16 with no
   criteria, size or value line on record; it reopens only as a node carrying all three.
6. Upstream and SDK forks: DELETE as decided. Q-010 was owner-ratified 2026-06-15 and executed
   2026-07-03; the cross-refs half has no owner, criteria or value line on record and is not
   work.
7. Curriculum graph estate, single-team proposal: DELETE as outside this line. The addressee is
   outside this fork under the fork ruling of 2026-09-06; the synthesis report stands complete as
   a report; the brief stays out of version control.
8. Corpus-generalisation Phase 0 scheduling: DELETE as decided and run (2026-07-05). The restart
   and the PDR-122 landing set carry no criteria, size or value line and reopen only as a node.
9. Comms forensics depth and live-event path posture: DELETE. The removal's forensics has no
   criteria or value line, and the recovery point (the parent of SHA:255117a43) resolves and is
   named in this record; the path-bearing events are untracked, and the validator and the write
   hook forbid new ones, so the tracked estate has no exposure and nothing to decide.
10. Markdown→graph inversion ADR timing: DELETE. A sequencing note on an unauthored ADR is not a
    decision; ADR-221 (Accepted 2026-07-31) is the current refinement of ADR-200, and a
    surface-class ADR, if wanted, is a node with criteria, size and value.

The re-truing's evidence paths are in this record's history at the commit before this rewrite; the
fork ruling (2026-09-06: no upstream-organisation surface is reached from this line) stands in
§Repo-Wide Invariants.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not the
authority.

- No compatibility layers; replace, do not bridge.
- Distinct architectural layers live in distinct workspaces.
- TDD at all levels; tests prove product behaviour, not file presence.
- Owner word 2026-09-03, in force until 2026-10-06: internal Oak systems are not accessed
  from this checkout ("we should not access any INTERNAL Oak systems, we will still access
  public services such as the curriculum api/downloads etc"). Private Oak GitHub
  repositories are internal systems under that word — a read of `oaknational/oak-skills`
  on 2026-09-05 was recorded as a mistake. The public upstream repository was the one
  permitted Oak repository read under that word until the owner's 2026-09-06 ruling
  (verbatim in `downstream-checkout-never-writes-upstream-surfaces`, which replaced the
  retired pr-target-is-engraph rule on 2026-09-08: "do not access the Oak repo without
  permission"),
  under which a read of the public upstream also needs owner permission first; the
  2026-09-06 ruling governs. The disconnection mechanics stay checkout-local.
  Owner word 2026-10-13, verbatim: "You are always permitted read-only access to Oak github,
  write access is forbidden for now, that will change at a later date." Under it a read of any
  Oak GitHub surface needs no permission; every write stays forbidden until he lifts it; the
  2026-09-06 ruling's read half is superseded and its write half stands.
- Strict validation happens only at boundaries.
- No `process.env` read/write in test files or setup files.
- `--no-verify` requires fresh per-invocation owner authorisation.
- No warning toleration.
- Owner direction beats plan.
- Curriculum data in this monorepo comes through the published Oak Open
  Curriculum HTTP API and generated SDK.
- Knowledge preservation is absolute; fitness warnings route work, not deletion.
- Shared memory/state files are always writable and commit-includable when dirty.
- No machine-local paths anywhere in the repo, ever (PII) — enforced by the
  `validate-no-machine-local-paths` repo-validator + the `machine-local-path`
  write-hook (shapes: `docs/governance/safety-and-security.md`
  §Machine-local paths).

[main-sonar-zero]: threads/paused/main-sonar-ai-profile-to-zero.next-session.md
[mcp-analytics]: threads/paused/mcp-product-analytics.next-session.md
[observability]: threads/paused/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/paused/connecting-oak-resources.next-session.md
[oer]: threads/paused/exploring-open-education-resources.next-session.md
[budget]: threads/paused/architectural-budget-system.next-session.md
[cloudflare]: threads/paused/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/paused/sector-engagement.next-session.md
[eef]: threads/paused/eef.next-session.md
[oak-kg-ontology]: threads/paused/oak-kg-ontology-planning-review.next-session.md
[school-data-search]: threads/paused/school-data-search.next-session.md
[semantic-search]: threads/paused/semantic-search.next-session.md
[agentic-mechanisms-discovery]: threads/agentic-mechanisms-discovery.next-session.md
[branch-fitness]: threads/paused/branch-fitness-and-push-cadence.next-session.md
[statusline]: threads/paused/statusline-enhancements.next-session.md
[agent-naming]: threads/paused/agent-naming.next-session.md
[agent-operability]: threads/paused/agent-operability.next-session.md
[orientation]: threads/paused/orientation-skills-family.next-session.md
