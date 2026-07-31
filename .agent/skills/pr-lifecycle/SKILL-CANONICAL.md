---
name: pr-lifecycle
classification: active
description: >-
  Open a pull request and shepherd it to merge-ready: reviewer-facing
  description, full-surface harvesting (GraphQL review threads, all comments,
  all checks, Sonar issues), root-cause-first triage, budgeted watching,
  re-fetch after every push, and an honest truly-green merge — all checks
  green, every thread resolved, normal non-admin merge. Use whenever a
  branch reaches PR closeout or an open PR needs driving to live.
---

# Pull Request Lifecycle

**Governance**: executes the first slice of the `pr-lifecycle-skill` strategic
plan (owner-requested). Operationalises
[`pr-comments-resolve-and-recheck`](../../rules/pr-comments-resolve-and-recheck.md),
composes with the [`commit` skill](../commit/SKILL-CANONICAL.md) (which owns
landing commits), [`worktree-hygiene`](../../rules/worktree-hygiene.md) (which
owns the branch/worktree lifecycle around the PR), and the
[`sonarqube-mcp-instructions`](../../rules/sonarqube-mcp-instructions.md)
per-finding discipline. Every gate constraint here inherits
`never-disable-checks` and `all quality gates blocking, always`.

The one-sentence contract: **a PR is done when it is live** — opened is not
done, green checks are not done, "ready for review" is not done; done is
merged with every finding genuinely settled. Standing down (closeout,
claim-close, monitor-stop) while the work is unmerged is the error: a
feature branch with an open PR is one cleanup away from gone, and a merge
gate — settled-state, or owner signoff where a surface reserves it — is a
gate, never a handoff of ownership.

Standing merge doctrine (owner verbatim, 2026-07-26/29): **a green and clean
PR — CI passing, no unresolved comments — merges without owner approval**,
and any resulting problem makes recurrence-prevention the immediate
priority. At genuinely-settled (all required checks green by name across
both check-runs AND commit statuses, zero unresolved threads), the seat
executes the merge itself under bot identity (REST merge-commit method,
never squash). Freeze-bound surfaces and anything a rule explicitly
reserves to the owner remain outside this grant. The dual discipline: a
gate nobody can NAME is an INVENTED gate — a reviewer listed on a Linear
issue is not a PR merge gate, and holding green work on an unnamed gate is
the inverse failure of merging past a real one (owner ruling, 2026-07-30);
a verdict that a gate exists carries its counter-consideration, and an
owner-constitutive reading goes to him as a card.

One stacked-PR mechanic that bites at open and at retarget: **a base
retarget fires no `synchronize` event, so required checks do not re-run**
and the PR can sit green-stale or pending forever. The cure is an empty
commit on the head branch (`git commit-tree` against the same tree, push),
touching no checkout.

## What a PR is (the intent under every phase below)

**A PR is the structured conversation through which a proposed change earns the
right to become shared truth — and the durable record of that earning.** `main`
is the only durable home; the PR is the airlock between one seat's view of the
system and everyone's system, and the review conversation is not friction on the
way through the airlock — it IS the airlock. Consequences the mechanics below
assume but cannot themselves supply (owner correction, 2026-07-08, worked
instance: a seat reported "MERGEABLE" as progress while threads sat unresolved,
then posted a disposition reply un-gated on its own verification — a false claim
into the permanent record):

- **Every comment is a claim entitled to full epistemics** — verify, adjudicate,
  integrate or refute with evidence. *Resolved* is the outcome of that
  treatment, never the goal; racing resolution inverts the artefact.
- **While a PR is open, the conversation IS the work.** A reviewer finding is a
  bug report against the proposal — session priority #1, ahead of new work. A
  push changes the proposal, so the entire review surface is stale the moment
  it lands: re-harvest and disposition before reporting anything.
- **The record outlives the merge.** Description + threads + dispositions are
  how future readers (and agents answering from PR history) recover *why* the
  change is what it is. A false disposition reply poisons that well permanently
  — gate every reply on its own verification, and VERIFY description edits
  actually stuck (bot summary re-appends can silently mask a failed edit).
- **"Mergeable" is a git-graph fact about ancestry, not readiness.** Readiness
  is a property of the conversation: every thread dispositioned with evidence,
  every check green, the description true of the *current* diff, the record
  coherent for a reader who was not there. Report in those terms.
- **The PR exists to structure shared attention** so nobody has to chase state;
  making the owner chase threads defeats the artefact even when the diff is
  perfect.

## Phase 1 — Before opening

1. **Divergence**: `git fetch origin main`; if behind, merge `origin/main`
   into the branch (never rebase-and-force-push an already-pushed branch).
   When the update touches agent memory/state files, author the union by hand
   per the `semantic-merge` skill — a git line-merge silently corrupts them.
   Tripwire: a conflict beyond trivial union-append on `.agent`
   continuity/state/memory files STOPS the merge and routes to the Director —
   resolving it solo is how approved versions get silently reverted.
2. **Tree and gates**: working tree clean; a successful push already ran the
   full pre-push gate suite, so a clean push IS the local-green proof — do not
   re-run gates just to re-confirm it.
3. **Worktree PRs**: a worktree's branch should have carried a draft PR from
   its first commit (`worktree-hygiene` §1); this skill takes it to ready.
4. **Scope the PR for review, not for tidiness**: an artefact that invites
   deep review in its own right (a forward-design plan, a doctrine rewrite)
   bundled into a closeout PR multiplies asynchronous bot-review rounds
   without bound (a worked instance ran 5+ rounds before the bundle was
   split); give such an artefact its own PR with its own review story.
   **Owner sizing bands (2026-07-27): ~5 files changed is the NORMAL
   shape; 10 is acceptable; 20 is a problem.** The bands exist to keep
   the complexity of reviewer comments minimal — one helpful convergence
   mechanism among several (the triage rule and the round predicate are
   the others), never a substitute for them. A changeset heading past 10
   files splits BEFORE opening, while splitting is cheap — not after the
   rounds prove the point.
5. **Changeset-health check** (PDR-132, the single source): a healthy
   changeset settles within the PDR's round budget; the budget value, the
   size smells, and the archival-class exemption all live in the PDR. A
   changeset crossing the PDR's warning thresholds is re-examined for
   hidden second stories NOW — at open, splitting is cheap; over budget,
   it is expensive. The general form of this check is the
   [`proportionality`](../proportionality/SKILL-CANONICAL.md) gate's SCOPE
   axis; run it here when the changeset's size is genuinely in question,
   and note that its LEVEL axis also applies at open — a question standing
   owner word already answers is not an escalation.

## Phase 2 — Open with a reviewer-facing description

Read `.github/pull_request_template.md` and fill it as a **communication
artefact for reviewers**, never a file list: what changed, why it matters,
what reviewers should focus on, what was deliberately left out, and what
evidence supports merge readiness. Update the description whenever the review
story materially changes (a reshaped scope, a new commit class).

**Copilot review policy (owner grants, 2026-07-26→29, standing).** Request a
Copilot review AT PR-OPEN for every source-touching PR; docs-only PRs stay
selective (important-or-risky only). Cadence is at-open plus
substance-triggered (a reshaped diff), never per cure push; Copilot's absence
never blocks a merge. Suppressed findings are Copilot's own low-confidence
bucket: the burden of proof is REPRODUCTION before cure — a non-reproducing
finding gets a reasoned decline with the falsifier recorded, never a
speculative cure or a silent skip. Two scope facts: the Copilot-review
ruleset does NOT bind `.design-sync/`, `.agent/plans/`, or
`packages/design` doc paths (confirmed on PR #536's timeline — zero review
fired), so absence there is configuration, not a skipped reviewer; and a
claude[bot] review SKIP is a spend-limit signature, not a blocker — an
organisation review-overage exhaustion is a capability ceiling to note,
never a gate to wait on.

### Title and description are CLAIMS about the diff — derive them from it

**A description cannot check the artefact it describes.** Both come out of the
same pass, so their errors correlate: re-reading your own summary confirms the
summary, never the change. Only a derivation from the diff, performed as a
separate act, catches a divergence — which is why these are caught from outside
the authoring context and never by the author re-reading.

So before opening, and again after any push that reshapes the diff, **derive
the change class mechanically and make the title name the most severe thing
actually present**:

- **Version changes** — compute the semver step per changed dependency from the
  diff, never from the intent you began with. **Any major bump belongs in the
  title.** A pin's trailing `# v1.2.3` is itself a claim: resolve pinned SHAs
  against the upstream tag rather than trusting the comment.
- **Scope** — files, workspaces, or surfaces the diff touches that the title's
  framing does not cover.
- **Removals** — anything the diff deletes that a reader of the title would not
  expect to lose.

Worked failure (2026-07-26, PR #557): a PR titled *"action pin bumps"* carried
`github/codeql-action` v3 → v4 and `slackapi/slack-github-action` v3 → v4 — two
majors, one on a required status check, one on an alert path `if: failure()`
that no CI run exercises. The diff was correct and the pins were genuine; the
title simply did not say what was in it, so two majors read as pin maintenance.
It surfaced only because a reviewer read the diff instead of the description.

**Reviewers inherit the duty inverted**: never take the title or description as
the statement of what changed. Derive the change class from the diff first, then
read the description as a claim to be checked against it. A description that
undersells its own diff is a finding to raise, not a formatting nit — it is how
an unreviewed major reaches `main` on everyone's assumption that someone else
had already looked.

## Phase 3 — Harvest EVERY feedback surface (the step most often botched)

Immediately after opening — and again after every push — pull all four
surfaces. Partial reads produce false "no problems" verdicts:

1. **Review threads (the authoritative comment surface)** — GraphQL
   `pullRequest.reviewThreads`, reading per thread `isResolved`, `path`, and
   the comments connection with each comment's body and its originating
   review's commit binding — i.e. the first comment's
   `pullRequestReview { commit { oid } }` — the field the review-round
   state machine's tally store (item 2) is built from.
   `reviewThreads(first: 100)` is the API MAXIMUM, not "all" — a PR past
   100 threads needs pagination or the harvest silently truncates. REST issue
   comments MISS inline bot threads (Copilot, Bugbot); a REST-only read is the
   canonical way to falsely conclude "no comments". Worked failure 2026-07-02:
   two REST comments were triaged as "noise" while four unresolved Copilot
   threads and a failed Sonar gate sat unread.
2. **Issue comments and reviews** — full bodies, never truncated skims, AND
   each review's own `commit.oid` retained alongside its body (the paged
   `reviews` connection carries both) — the binding the state machine's
   tally (item 2) buckets body findings by; a Sonar gate summary or a bot
   capability notice lives here. The dual of item 1's REST-only failure: a
   reviewThreads-ONLY harvest also structurally undercounts — Copilot's
   "suppressed low-confidence findings" live only in review submission
   bodies with no thread state, and those suppressed findings have run real
   at a striking rate. A thread never auto-outdates when its fix lands in a
   DIFFERENT file than the anchored line — reply with the actual fix
   location and resolve manually, or it reads unaddressed forever.
3. **All checks** — `gh pr checks`, including the external ones (SonarCloud,
   CodeQL, Vercel, Cursor Bugbot, Codex). A failed check's *first* failure is
   the root to chase: a 20-second `install` failure cascades into skipped
   builds and a failed deployment — fix the root, not the echoes. CodeQL
   alert reads are ref-scoped: the per-number GET returns `state=null` when
   no default-branch instance exists; the authoritative read passes
   `?ref=refs/pull/N/merge`, and any recorded verdict names the ref it was
   read against in the same sentence. GraphQL `statusCheckRollup` can show
   a STALE "Vercel pending" long after the deployment finished — the
   commit-status REST API is the ground truth for status-context checks.
4. **Sonar quality gate** — when it fails, pull the ACTUAL issues
   (`search_sonar_issues_in_projects` with `pullRequestId`, per the
   `sonarqube-mcp-instructions` rule) and read each flagged site. The gate
   summary names conditions; only the issue list names the work.

## Phase 4 — TRIAGE every comment; fix at source

- **The triage ruling** (owner, 2026-07-27, verbatim, a SEAT-LEVEL
  obligation applied at the moment each comment is read — never deferred to
  Director discretion): *"We do NOT have to address every comment, we have
  to TRIAGE every comment, if it is incorrect reject it, if it is correct,
  relevant and proportionate address it, if it is anything else raise a
  ticket, tell the Director, and close the comment."*
- The three-way test, exactly one terminal state per finding:
  1. **INCORRECT → reject**, with verified reasoning in the reply
     (`dispositions-need-verified-failure-scenarios`). Rejection is a
     first-class outcome, never a failure of nerve. Every disposition
     names its EVIDENCE CLASS: READ (reasoned from source, never
     executed) or RUN (exercised first-hand). A whole round dispositioned
     READ-NOT-RUN is sound as readings and is NOT test evidence — say so
     in the disposition, so downstream consumers never upgrade a reading
     into a proof (worked instance: #570, all findings READ-NOT-RUN).
  2. **CORRECT and relevant and proportionate → address**, fixed at source.
     ALL THREE conjuncts are required: individual validity is NOT
     sufficiency — a correct finding whose cure widens the PR beyond its
     ticket's story fails the proportionality conjunct and goes to state 3.
  3. **ANYTHING ELSE → ticket + tell the Director + CLOSE the comment.**
     Correct-but-elsewhere, correct-but-disproportionate, out-of-story
     hardening, adjacent design questions: raise a pointer ticket (never a
     spec), notify the Director, reply with the ticket reference, and
     RESOLVE the thread. The closure is deliberate doctrine — a ticketed
     finding left unresolved re-creates the divergent loop this rule ends.
- **Convergence is the test of the loop**, not only the correctness of each
  round: rounds should shrink; a cure not required by the ticket's story is
  a ticket, not a commit; unrequested hardening built mid-review has a
  measured high defect rate (worked instance, 2026-07-26/27: one PR reached
  ten rounds — one feat commit, twelve fix commits, four cures introducing
  new defects, three of those in hardening no ticket asked for — before
  this ruling landed). Underlying principles:
  `concept-exploration` §Loop Dynamics; sizing gate: `proportionality`.
- Order by blocking force and risk, not by tool order; root causes before
  echoes.
- Sonar findings keep their per-site channel: **owner-dispositioned with
  evidence** (per-site, e.g. a false-positive with rationale at that site)
  remains a terminal state alongside the three above. Triage routes
  findings; it never buries them — never dismissed by category, never
  gate-narrowed, never warning-downgraded, never suppressed.
- Fix the class, not the instance: a spelling finding on two lines gets a
  repo-wide sweep of the class; a stale literal gets checked against its
  source constant convention.
- **A cure is a claim: it gets the same verification tier as the finding it
  cures, and it carries its paired test.** Review-round cures are the next
  round's most likely defect surface (one round's Sonar failures were ALL
  inside the previous round's cures; a cache-correctness fix shipped its own
  unhashed input; a loud-failure alert was born with a silent-failure
  default). A cure without the test that would have caught the finding is
  half a cure — the atomic pair discipline applies to review cures exactly
  as to features. And after absorbing cures from MULTIPLE reviews, the
  COMPOSITION needs its own pass: two independent, individually-correct
  cures interacted to create a third defect (worked instance 2026-07-28).
- Disposition is content-based and binary — a comment's timestamp is
  irrelevant. "This predates my change" / "nothing new since T" is not
  addressed, and a fresh finding introduced by the fix commit itself is an
  open finding, never a side-tangent.
- Sonar reflects fixes only after the next pushed scan — verify fixes with
  local gates at source; never poll Sonar immediately after an edit.
- Diagnose a failed CI run from the failed **step name**
  (`gh run view <id> --json jobs -q '.jobs[].steps[] |
select(.conclusion=="failure")'`), never from the `--log-failed` tail — an
  `if: always()` advisory step that runs last can misattribute the real
  failure (observed 2026-06-24: the tail blamed a drift check; the failure
  was format-check).

## Phase 5 — Wait without burning budget: the SUPERVISED terminal-condition watch

- **Every PR-state read STARTS from the compound read — the review-round
  state machine's item 1, below — in ONE call.** This is a floor, not a
  ceiling: the Phase 3 harvest and the pr-watch poll are consumers and
  refinements of the same compound state — what is forbidden is reading any
  SINGLE field in isolation to answer a question, however narrow the
  prompting signal (owner correction, ~50th instance of the class, PR #329,
  2026-07-08: told "BEHIND", a seat read merge-state and checks and re-armed
  while two fresh unresolved threads were the actual blocker). Answering a
  named signal with just that signal's fields is the recurring generator;
  the cure is categorical, never vigilance. Read the composite AND the
  components: when `required_review_thread_resolution` is enabled on the
  base branch (verify it against the branch-rules API rather than assuming —
  true here when last verified, 2026-07-08), `mergeStateStatus: CLEAN` is
  GitHub's own conjunction of ITS OWN merge requirements — checks, threads,
  currency; NOT the state machine's round-owed leg, so CLEAN with an OWED
  reviewer leg is still not merge-ready — and a composite/component
  disagreement is itself a finding to chase, never noise.
- **CI can go SILENT, and silence reads as pending forever** (recorded on
  MCP-373, homed 2026-07-31): a PR in CONFLICTING mergeable-state silently
  stops `pull_request` workflow runs — no failure, no event, just absence.
  A settle watch therefore carries legs beyond checks-by-name: read
  `MERGEABLE`/mergeable-state alongside the checks, and confirm runs exist
  for the CURRENT head via `gh run list` filtered per-head — a checks-green
  read against a head with zero runs is reading the PREVIOUS head's truth.
- Run the repo's budgeted watcher in the background:
  `pnpm agent-tools:pr-watch <n> --watch --interval 60` — one line per state
  change, including new comments by author and the unresolved review-thread
  count moving in EITHER direction. KNOWN SUBSET: pr-watch currently reads
  PR-view fields, REST review comments, and thread counts — not review
  bodies or `latestReviews` — so a summary-only review does NOT change its
  snapshot. Treat its events as wake signals only, never as the state; the
  Phase 3 harvest is the authoritative read on every wake, and extending
  pr-watch to the full compound floor is tracked as the
  `ws6-pr-watch-compound-floor` item in
  [`pr-merge-readiness-discipline.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/pr-merge-readiness-discipline.plan.md).
  Passing checks alone are not green — an
  unresolved thread blocks merge-readiness just as hard. The Phase 3 GraphQL
  harvest remains the authoritative read for which threads and what they say.
- **Know the watcher's designed hole: it also ENDS on ALL-GREEN.** Comments
  post asynchronously up to ~10 minutes after a push, so an all-green exit
  opens an unguarded window exactly when a bot round may still be composing.
  **The mandated shape is a SUPERVISED watch**: a loop that re-arms pr-watch
  on EVERY exit and terminates ONLY on MERGED/CLOSED, recomputing the
  compound state at each re-arm (proven live end-to-end on PR #330,
  2026-07-08: the watch rode the full arc to MERGED and self-terminated on
  the recompute). MERGED/CLOSED is the only terminal claim — the only state
  no late comment can un-green. Two refinements to the re-arm loop, both
  worked instances: (a) **the loop SPINS when the PR is all-green but the
  merge waits on an authorisation gate** — pr-watch's all-green exit fires
  instantly on every re-arm and the cycle floods the notification surface
  until the platform kills the monitor (2026-07-15). On an all-green exit
  with the PR still OPEN, swap to a slow compound poll (~120s, one GraphQL
  compound read per tick, emit only on deviation or terminal state).
  (b) **The watch must emit on every state that means "stuck", not only
  failure and success**: an auto-merge/queue entry stalled at BEHIND or
  ejected from a merge group looks identical to "still waiting" unless the
  watch names those states in its alternation (2026-07-20 — a BEHIND stall
  sat silent through four update cycles). Silence is not success.
- **There is no push-event transport to wait on instead**: true push events
  are webhooks (they need a server); `gh api repos/…/events` is itself a poll
  with ~30–60s feed latency; `gh pr checks --watch` has the same
  exit-at-completion hole class. Polling the PR GraphQL at 60s (pr-watch,
  budget-aware) is the strongest available primitive. Never hand-roll tight
  `gh` polling loops (the shared 5,000/hr API budget; frictions F-110).
  Between events, continue other work or hold; the watcher wakes you.

## The review-round state machine (single definition)

Phases 5–7 drive one coupled loop over review rounds. The contract lives
here, once; the phases reference it. Amendments land in this section, never
as phase-local restatements.

1. **The compound read.** One GraphQL selection is the BASELINE compound
   state — it answers most PR-state questions, but two inputs come from
   elsewhere and are added on top of it: the reviewer-leg SATISFIED verdict
   (items 1 and 3: ANY Phase 3-harvested review binding the current tip —
   the per-author `latestReviews` pointer below can point BACKWARDS when an
   older-tip review job completes after a newer push) and the expected
   reviewer set (item 3: from repository configuration). The selection:
   `headRefOid` (the current tip every review binding is compared
   against) + `mergeStateStatus` + unresolved `reviewThreads` count +
   `statusCheckRollup` + `latestReviews(first:20){totalCount
   pageInfo{hasNextPage endCursor} nodes{author{login} commit{oid} state
   submittedAt body}}` — the per-author latest-review connection, verified
   live on PR #391, 2026-07-16 (the leg added 2026-07-16, PR #390). A
   bounded `reviews(last:20)` read is WRONG here: a long review history
   pushes an earlier bot's latest review out of the window (#390 exceeded
   20 review records), and omitting `body` makes a reviewer's skip marker
   unreadable. Treat `totalCount > 20` as truncation and page before
   concluding a reviewer is absent (re-query with
   `after: <pageInfo.endCursor>` until `hasNextPage` is false). `latestReviews` serves ONLY the
   reviewer-leg and settled checks (items 3–4, latest review per author);
   never the tally (item 2); it CANNOT
   reconstruct round history — rows vanish from the connection whenever a
   reviewer posts again.
2. **The tally store.** One row per settled round, `{round commit SHA,
   count of findings in reviews bound to that commit}`, PERSISTED in the
   shepherd's working notes and built from the Phase 3 full harvest — each
   review thread's originating review carries its commit binding
   (`comments.nodes[0].pullRequestReview.commit.oid`). Findings are counted
   from BOTH harvest surfaces: review threads AND review bodies bound to
   the tip — a summary-only review carrying findings in its body (a shape
   claude[bot] posts) otherwise never enters the round count, and "settled,
   zero new findings" can read true against a disagreeing body (pair
   observation, 2026-07-16). For this to be reproducible the Phase 3
   harvest RETAINS each review's own `commit.oid` alongside its body
   (Phase 3 surface 2), so body findings bucket by commit exactly as
   thread findings do. ONE LOGICAL FINDING COUNTS ONCE: a body finding
   that restates a finding already represented by an inline thread of the
   same review does not add to the tally — dedupe within the review by
   anchor and substance, recording the dedup in the working notes where
   exercised. Under SHARED CREDENTIALS, the agent's own disposition replies
   register as reviews by the credential owner — sign every bot-visible
   reply with the agent identity tuple, and EXCLUDE self-authored signed
   replies from the round tally and from quiet-window anchoring (drive
   precedent 2026-07-20; an unsigned self-reply reads back as owner round
   activity and falsely re-opens the round). A finding whose review binds to an ALREADY-SETTLED round's
   tip AMENDS that round's row (the tally records truth, not the order of
   discovery); the settled round does not reopen — the late finding is
   worked as current-round work — and the trigger arms evaluate the
   amended history only from the CURRENT round forward, never
   retroactively re-firing over past rounds. NEVER derive the
   tally from `latestReviews` (item 1: rows vanish), and NEVER bucket by
   arrival order: reviews bind to the tip they reviewed, and a review bound
   to an older tip can land after a newer push (round-2 correction,
   2026-07-16 — on #390 a review for `861bb8924` arrived after `783c567af`
   was pushed; arrival-order tallying charges findings to the wrong round
   and can falsely trigger, or mask, non-convergence). Convergence is the
   per-round count strictly decreasing. Born-sketch PLAN PRs carry an owner
convergence-cap ruling (2026-07-25): after round 4, further reviewer waves
DISPOSITION to named homes rather than editing plan text — unless a finding
shows an actual falsehood in the plan; merge at any settle-green tip whose
deltas are cap-dispositions or falsehood-cures; hard-stop only for new
owner parameters. **The step-back trigger is
   mechanical, with the exact predicate `c[n] >= c[n-1] AND
   c[n-1] >= c[n-2]` (two consecutive non-decreasing transitions across
   three settled counts) OR 4 total settled rounds in the epoch — and
   EITHER ARM FIRES ONLY WHILE the latest settled round's count is
   non-zero**: a zero-finding settled round is the terminal SUCCESS state
   and takes precedence (3→2→1→0 is convergence completing, not a
   step-back; without this precedence a fourth settled round could read
   merge-ready and step-back-mandatory at once) (owner correction,
   2026-07-16, PR #390: 8 rounds / ~38 findings ran
   unnoticed as non-convergence because nothing counted; predicate pinned
   2026-07-16 after one shepherd applied two different readings in one
   day). The class-fix
   push that answers a step-back OPENS A NEW CONVERGENCE EPOCH: the tally
   re-baselines at that push — round counting and both trigger arms restart
   within the epoch, and prior-epoch rounds stay recorded as history. A
   second step-back firing on the same PR is terminal for fix-pushing: do
   not attempt another class fix by default — split the PR along the
   finding corpus's class boundaries, or route the corpus to the owner with
   a verdict (round-6 correction, 2026-07-16: "4 total rounds" is
   monotonic — without the epoch reset the trigger stays true after the
   mandated class-fix push and the machine has no executable next
   transition). **Ahead of these failure arms sits the round-budget
   expectation (PDR-132, which owns the budget value)**: the transition
   fires when an over-budget round OPENS — the first review activity
   binding a tip after the budgeted number of rounds has settled, NOT
   when that round's tally row settles — recording budget-exceeded in the
   working notes and running the generator question before the round's
   findings are cured. The arms above stay the mechanical backstop, not
   the first alarm. **The arms fire on GENERATOR recurrence, not singleton
   noise**: before acting on a fired arm, classify the round's findings —
   a stream of distinct, unrelated mechanical singletons (each with a
   different generator) routes to a coverage-noise assessment rather than
   terminal escalation, while findings sharing one generator confirm the
   fire (worked instance 2026-07-20, one PR: five distinct mechanical
   singletons false-refired the count arm; the true guard fire came two
   rounds later — nine findings, one generator). The classification is
   recorded in the working notes; a real generator PRESENTING as
   singletons is the known residual risk, so the assessment must name the
   generator-absence evidence, not just assert it. **Reflexive loops may
   never go quiet — then the exit is a JUDGEMENT, capped on ROI and risk,
   never on round counts** (imported 2026-07-20 from a sibling estate's
   owner ruling; local worked instances the same day: nine rounds, eight
   real findings, risk mass falling each round). When each cure creates
   the surface the next round probes (gate-shaped code especially),
   validity is not the exit variable: triage each new finding on marginal
   expected value vs full cost (including permanent maintenance friction)
   AND a tail-risk veto that fixes any genuinely new severe class
   regardless of the curve, then exit by reasoned per-site disposition
   once findings restate a documented residual. Track findings-per-round
   and risk-mass trend as the crossing-point telemetry; record the round
   count as the observed crossing point, never as the rule.
   **Recovery for an over-scoped PR already in flight — the two-class
   disposition ruling (owner-ratified 2026-07-25, #529; precedent: the
   MCP-56 dispositions-only round):** a multi-story PR whose reviewers
   re-review the whole diff on every push cannot reach the zero-new-findings
   exit — the SURFACE, not diligence, generates the findings (#529 ran
   14→19 unresolved across nine push-per-cure pushes, three rounds, no
   convergence, checks green throughout). Batching one adjudicated round
   per push cures only the re-trigger half; the other half is
   dispositional. Classify every finding: **CLASS F** — the PR would LAND a
   false statement → cure in the PR; nothing false lands. **CLASS P** —
   true and valuable, but about how the named work is EXECUTED later →
   reply naming the owning ticket and resolve WITHOUT growing the diff. A
   Class P reply must name a real ticket — "later" with no home is
   ignoring, not dispositioning. The durable lesson sits upstream: a round
   budget is a SIZE constraint in disguise (PDR-132 binds it at authoring
   time; single-story PRs are the generator fix) — this ruling is the
   in-flight recovery, never a licence to open multi-story PRs.
3. **Reviewer-leg states**, computed per (reviewer, tip): **SATISFIED** —
   ANY harvested review by the reviewer binds to the current tip (the
   Phase 3 harvest is the source; the compound read's `latestReviews` alone
   can hide this when overlapping review jobs complete out of order — an
   older-tip review landing after a current-tip one makes the author's
   "latest" point backwards, leaving the leg falsely OWED and untouchable
   by the timeout). The quiet window anchors to the LATEST review matching
   the current tip, never to the author's globally latest review.
   **SKIPPED** — via a tip-scoped marker, or via the timeout. The MARKER
   leg: an explicit skip marker in a review body satisfies SKIPPED only
   when its review binds to the current tip, OR when its body declares a
   terminal / until-re-enabled scope. A reviewer QUOTA notice posted as a
   tip-bound review ("unable to review … quota limit") IS such a
   scope-declared marker (scope: quota restored) and NEVER counts as a
   zero-finding review — reading a bounce as settlement is the silent-wait
   class at the reviewer leg (worked instance 2026-07-21: quota bounces
   estate-wide were ruled SKIPPED by the owner and settled PRs merged on
   green checks + zero threads + dispositioned findings). A scope-declared marker is re-checked
   each round against OBSERVABLE state and holds until its stated condition
   ends (e.g. spend restored); each re-check RECORDS condition, observed
   state, and verdict in the shepherd's working record alongside the skip
   evidence below. A marker whose condition the shepherd CANNOT evaluate
   against observable state falls through to the timeout exactly as an
   unscoped marker does — an unevaluable scope re-checking to nothing each
   round would readmit the unmaintained-marker disease through the scope
   door (round-6 correction + pair fold, 2026-07-16: `latestReviews`
   retains each author's latest body, so an unscoped early marker would
   otherwise satisfy SKIPPED for every later tip forever). The TIMEOUT leg:
   no review bound to the tip after one full checks-green quiet window
   (>10 min from the tip's checks reaching green); record the skip with its
   evidence (reviewer, tip SHA, window bounds) in the shepherd's working
   notes (round-2 correction, 2026-07-16: without the timeout the gate goes
   permanently unsatisfiable the moment a reviewer stops reviewing — on
   #390, claude[bot] posted a spend-limit skip review on the first commit
   and nothing on any later tip, so every subsequent tip would read owed
   forever with no tip-specific marker obtainable). **OWED** — otherwise.
   The gate never waits more than one quiet window for any single reviewer.
   CRITICAL first-round rule: the EXPECTED reviewer set is not just "bots
   that previously reviewed this PR" — on a repo whose ruleset configures
   bot review on push (Copilot here), the first round is ALWAYS expected,
   so before any bot has reviewed, every configured bot is OWED until it
   posts or the checks-green quiet-window timeout fires. This closes the
   vacuous-predicate hole where an initial tip could read merge-ready
   before the first bot round ever lands. The expected set's SOURCE is explicit,
   never inferred from the compound read (`latestReviews` only names
   authors who have already reviewed — empty on an initial tip): the
   shepherd DECLARES it in the working notes at Phase 1, read from the
   repository's automatic-review configuration (the ruleset / review-app
   config that fires bot reviews on push), and that declaration is the
   state machine's input for every round.
4. **Round settled; merge-ready.** A round is SETTLED when every expected
   reviewer leg reads SATISFIED or SKIPPED for the current tip AND a quiet
   window LONGER than the async lag has elapsed since the latest review
   binding to the tip — never since the push (>10 min; 12 used on #330)
   (round-3 correction, 2026-07-16: without the skip clause a timed-out
   reviewer stays bound to an older commit and the settled state is
   unreachable). **The quiet window is a PROXY for review-run-boundary
   visibility, which agents lack; the owner sees run start/finish directly,
   so an owner settled-word — or an owner-executed merge — issued from that
   direct visibility supersedes the proxy and is never read as a process
   breach** (owner word 2026-07-25; #518 and #534 were owner-merged inside
   the window, correctly). Agents keep the proxy. On a tip where every leg settled via SKIPPED (no review
   ever bound to the tip), the quiet window anchors on the checks-green
   window from item 3. MERGE-READY is a settled round that landed zero new
   findings, plus every Phase 7 gate leg.
5. **The merge boundary.** Merging takes exactly two sanctioned shapes,
   both issued at a freshly RECOMPUTED full gate: the explicit
   `gh pr merge --merge` command, or ARMING auto-merge — permitted
   exactly and only **at settled-READY under a Director grant**
   (PDR-131, 2026-07-20; arming before settlement remains forbidden —
   the old flat prohibition was born when arming happened at PR-open,
   pre-settlement). The arm moment carries this same recomputed gate;
   an armed intent is a standing merge command, so it inherits every
   leg below — AND its validity is bound to the settled state it was
   armed at: GitHub enforces only checks and threads, never the
   round-owed or body-tally legs, so a NEW review, review comment, or
   harvested finding arriving after arming invalidates the arm. On any
   such signal the arming seat DISARMS (or re-verifies the full gate
   and re-arms) — an armed intent is never fire-and-forget, and a seat
   that arms owns watching for exactly this staleness until the merge
   fires. The recomputed full gate:
   the round reads SETTLED per item 4 for the current tip; zero unresolved
   threads;
   a finding count of ZERO on BOTH tally surfaces (threads AND review
   bodies, item 2 — zero unresolved threads alone can coexist with a
   non-zero body tally) AND zero NEWLY HARVESTED findings regardless of
   which round they bucket to (an out-of-order summary-only review bound
   to an older tip lands late: it buckets to its own prior round yet still
   blocks THIS merge moment); **every REQUIRED check from the base branch's
   ruleset PRESENT in the tip's check list BY NAME and green — an
   expected-but-never-created check is simply absent from `gh pr checks`,
   so an all-visible-terminal-green read looks settled while the merge
   405s** (worked instance #517, 2026-07-24: the CodeQL advanced-setup
   workflow landed on main after the PR opened, no `synchronize` event had
   fired since it existed, and its required aggregate was never created;
   any PR open across a required-workflow migration window inherits this
   state; cure — an empty-commit push fires `synchronize` and creates the
   missing run, and the 405 text itself names the missing check: read it);
   every Phase 7 gate leg green INCLUDING
   checks GitHub does not enforce; the Sonar gate passing. The command
   inherits Phase 7's merge-authorisation boundary unchanged.
   **In a coordinated drive, the settled-round predicate binds GRANTS,
   not just merges**: a routing seat (Director) grants MERGE-ELIGIBILITY
   — the predicate verdict, never a queue position (serial one-at-a-time
   slots and bump-gap waits retired 2026-07-20, PDR-131: merge concurrency
   between eligible PRs is free; quality binds at settled-READY, and the
   2026-07-20 cascade — eleven settled+green PRs landing in ~6 minutes,
   gate green, every Phase-8 clean — is the measured evidence) — only
   on the item-4 settled verdict — zero threads AND zero body-tally
   findings on the tip, every expected reviewer leg SATISFIED/SKIPPED,
   a full quiet window since the latest tip-bound review, checks green —
   because a grant is read downstream as authorisation-to-act-now, and
   "the executing seat will recompute" is hope, not a gate, under grant
   momentum. The executing seat STILL recomputes at the boundary
   (two layers, both live; worked instance 2026-07-20: one moment-read
   grant raced a composing bot round by 21 seconds and only an unrelated
   third mechanism stopped a premature merge; six post-predicate
   landings, zero races).
   **When the base branch runs a merge queue**, `gh pr merge --merge`
   ENQUEUES rather than merging: the queue owns currency and re-runs CI
   on the merge group, which subsumes the update-branch treadmill — but
   it does NOT cover the composing-round race (the queue enforces
   GitHub's own conjunction, which excludes the round-owed leg), so the
   settled-round predicate gates the ENQUEUE exactly as it gated the
   merge. Verify the live ruleset before relying on either mechanics; a
   merge-group ejection is a real finding to harvest, never a retry loop.
   Queue quirk (worked instance 2026-07-20): a `gh pr merge` that returns
   the queue's strategy notice with a NULL queue entry may still ARM a
   when-ready auto-enqueue intent that fires later (e.g. once a required
   check lands on a fresh head) — after any refused/odd enqueue attempt,
   re-read `mergeQueueEntry` before assuming nothing is armed, and treat
   an unexpectedly-queued PR as an armed intent, not a mystery.
   **Rule-removal disarms first** (PDR-131 §6; worked instance
   2026-07-20: eleven queue-era armed intents survived the merge-queue
   rule's removal and fired as plain auto-merges within ~6 minutes —
   benign that day only because every one was settled+green): armed
   merge intents survive queue/protection-rule removal and fire
   silently, so before removing any queue or protection rule, enumerate
   and disarm every armed intent.

### Read mechanics the settled verdict depends on (consolidated 2026-07-30)

- **Read STATUSES alongside check-runs.** Vercel is a required commit
  STATUS that publishes NO check-run — a check-runs-only read shows green
  with a required context pending or failed. Derive the required list from
  `/rules/branches/<base>` and read each name across BOTH
  `/commits/{sha}/check-runs` AND `/commits/{sha}/status`.
- **A review-request 201 is not a registration.** The REST
  `requested_reviewers` POST can return 201 and silently drop per-PR
  (reproduced on two PRs, two seats, ~5 minutes apart); the roster read is
  ambiguous in both directions (Copilot leaves it the moment it starts).
  Verify via the issue TIMELINE's `review_requested` events; the proven
  alternate path is the GitHub MCP `request_copilot_review` tool. Cap
  identical REST retries at two.
- **A review row is not a review.** Read the review BODY before counting
  it — a `COMMENTED` row on the exact head once contained only a
  spend-limit skip notice (the spend limit itself is never an agent
  concern; just do not count the notice as a review). And a review PRESENT
  on the PR is not a review OF the merge head — match its `commit_id` to
  the head at the merge moment.
- **Paginate reviews to exhaustion.** `/pulls/{n}/reviews` pages
  oldest-first (default 30): an unpaginated read on a busy PR is
  structurally guaranteed to hide the recent rows — the ones being asked
  about. Bot reviewers are visible only via the GraphQL `... on Bot`
  fragment; REST `requested_reviewers` and `gh pr view` omit them.
- **Run the merge-base deletion sweep before ANY merge**:
  `git diff "$(git merge-base origin/<base> HEAD)" -- <touched paths> |
  grep -E "^-" | grep -v "^---"` and read every printed line — each is an
  intended deletion or a silent revert. A stale whole-file capture
  produces a clean, conflict-free overwrite that every gate in the chain
  is structurally blind to (worked instance 2026-07-28: a green docs PR
  one command from silently deleting a landed security clause; the
  stale-capture-wins class with the consequence sharpened).

## Phase 6 — After EVERY push, re-fetch; resolve only what is settled

- Bots re-review each push asynchronously: **"0 unresolved" is a moment, not
  a state.** Re-fetch `reviewThreads` and checks after every push and again
  at the instant of any ready/merge-ready declaration — a finding can land
  seconds after your last look.
- Reply to each thread with the fix evidence (commit SHA + what changed),
  then resolve it. "Resolved" is a settled-concern state, never a button
  clicked to clear `mergeStateStatus`.
- **On an OWNER-AUTHORED branch, the author is the most likely concurrent
  writer** (two collisions in one lane, 2026-07-24, #515): re-fetch the
  branch tip immediately before opening the commit window, not just at
  grounding. On any non-fast-forward rejection, STOP external writes and
  read the incoming commits' AUTHORSHIP first — owner commits mean a carded
  owner-version-wins reconciliation (semantic union, named surviving
  deltas, history preserved via merge), never a mechanical merge-and-push.
  Hold thread replies until the push lands, so no external record ever
  cites a superseded commit — the held-replies discipline saved both
  rounds.
- **Silent-wait sweep after every push (PDR-132)**: verify the expected
  reviewer is REQUESTED on the new tip — a push does not re-request, and a
  tip with no requested reviewer and no tip-bound review waits forever
  looking healthy (two live instances, 2026-07-20). The same sweep names a
  shepherd for every open PR: threads with no owner are the same disease.
  The sweep's third leg is **review-RUN liveness**: `gh agent-task list`
  enumerates review runs (`--json id,name,createdAt,completedAt`;
  `completedAt` null = in flight) and `gh agent-task view <session-id>
  --json` maps a run to its PR (the list JSON carries no PR number; the
  PR-number positional is interactive-only — vendor shapes verified
  2026-07-21). Run-in-flight, run-never-started, and run-dead are now
  distinguishable states; a wait on a review whose run never started is
  the silent-wait class, not patience.
- **Own the convergence loop — never hand it to the owner** (owner
  corrections, 2026-07-07 #317 and 2026-07-08 #324 — two seats re-derived
  the same blind spot in one sitting; scheduled nap-probes FEEL like
  diligence while every sleep is a blind window and each "0 unresolved" read
  is a moment treated as a state). Bot rounds land findings minutes AFTER a
  push, so "zero unresolved verified now" expires on a clock you do not
  control. The canonical shape is the Phase 5 SUPERVISED terminal-condition
  watch, running from first push to MERGED/CLOSED, with an immediate full
  harvest on any event — awareness that cannot sleep through an arrival.
  Event monitors
  give awareness of arrivals, but awareness is not convergence ownership;
  without the supervised watch the human becomes the loop operator.
  **Declare a round settled, and merge-ready after it, only per the state
  machine's definitions (items 3–4)** — never from a "0 unresolved" moment.
  Bundle every finding from one round into
  ONE fix push (each push mints a fresh round; per-finding pushes multiply
  rounds without bound). **Keep the numeric round tally exactly as the
  state machine's item 2 defines it.** When item 2's mechanical step-back
  trigger fires: **STOP
  fix-pushing.** Step back and run concept exploration over the FULL finding
  corpus for the shared generator, paired with the
  [`proportionality`](../proportionality/SKILL-CANONICAL.md) gate over the PR
  itself — the exploration finds the generator, the gate asks whether the
  changeset, the review instrument, or the seat answering is the wrong size,
  which is the question a corpus read alone does not pose. Fix the CLASS in
  one pass, and consider
  splitting the PR (on #390 the generator was authored restatement of
  derivable state — instance-by-instance fixes added prose that spawned the
  next round). Severity decay remains the qualitative check; the tally is
  what makes its absence visible. **The tally is the trigger's only input:
  an unbuilt tally store means the trigger cannot fire, and a PR can run to
  ten rounds looking locally healthy at every one** (worked instance
  2026-07-26, #570 — ten rounds, twelve cure commits, four of which
  introduced new defects; nothing counted, so nothing fired).
  At owner-active tempo the discipline tightens: the owner may merge or push
  mid-arc, so EVERY binding moment recomputes the compound state (Phase 5) —
  a live watch beats any probe cadence.
- **Confirm the PR is still OPEN in the same re-fetch.** A push to a
  just-merged PR's branch SUCCEEDS but is not inclusion — the commit
  silently misses the base branch (worked instance 2026-07-06: a review
  fix landed on #310's branch minutes after the owner merged; rescued by
  cherry-pick). If the PR state is MERGED, verify tip ancestry
  (`git merge-base --is-ancestor <tip> origin/<base>`) before treating any
  post-merge work as landed; strand-rescue is a cherry-pick to a follow-up
  branch, never a branch delete.

## Phase 7 — Merge-ready is a declaration with a gate

Merge-ready means, re-verified at the declaration instant: all checks green
AND zero unresolved review threads AND the Sonar quality gate passing AND any
genuinely required review landed (the author-dependent leg below) AND **the
review round SETTLED for the current tip, no reviewer leg OWED, per the
review-round state machine, items 3–4** (owner
correction, 2026-07-16, PR #390: the merge raced a composing Copilot round,
which then posted five findings onto merged code). OWED = do not merge,
regardless of green checks and zero unresolved threads; the SKIPPED timeout
(state machine item 3) bounds the wait. **After any arming of an auto-merge
intent, verify the checks are green-or-progressing (PDR-132): an armed
intent behind a red check is invisible-stuck — nothing progresses it and
nothing alerts (live instance 2026-07-20: an armed docs PR sat ~2h behind a
two-line lint failure believed self-landing).** Holds on a merge-ready PR
are EVENT-released, never timer-released (adjudicated 2026-07-30): a
zero-cost hold (waiting on a named arrival, an obsolescence check, a cost
change) releases the moment its event fires — a hold that would release "in
a while" is an invented gate; and a hold placed for a composing review
covers only SUBSTANTIVE changes, never docs/comment-only deltas. Then:

- **`mergeable` means POSSIBLE to merge; it does NOT mean READY to merge**
  (owner, 2026-07-08). GitHub's `mergeable: MERGEABLE` asserts only
  conflict-freeness and reads TRUE on a PR with failing checks and open
  threads. The readiness field is **`mergeStateStatus`**: `CLEAN` = GitHub's
  conjunction of ITS OWN merge requirements satisfied — it does NOT include
  the state machine's round-owed leg, so a CLEAN read with an OWED reviewer
  leg is still not merge-ready; `BLOCKED`/`UNSTABLE`/`BEHIND` name what
  GitHub sees as unsatisfied. Every readiness read in this phase — the
  declaration-instant recompute, the "why isn't it merging" diagnosis — queries
  `mergeStateStatus`, never `mergeable`. Worked instance (2026-07-08,
  PR #325): a seat recomputed `mergeable: MERGEABLE` three times as its
  "truly-green gate" while never once reading `mergeStateStatus`, and could
  not explain the unmerged state to the owner.
- **Merge only through the state machine's merge boundary (item 5) —
  the explicit command, or auto-merge armed at settled-READY under a
  Director grant (PDR-131).** Item 5 holds the single definition of the boundary
  and its recomputed gate; Phase 7 adds only the residual-race truth it
  leaves open: the explicit `gh pr merge --merge` is a check-then-act step
  — review state can change between the recomputation and the command, and
  GitHub enforces neither the round-owed nor the body-finding leg — so the
  gate NARROWS the merge-race window without closing it, and that residual
  race is ACCEPTED and covered, never claimed away: Phase 8's post-merge
  harvest is its named recovery. The command inherits the
  merge-authorisation boundary below unchanged (on a SELF-AUTHORED,
  sub-agent-reviewed PR with no in-session owner grant, broadcast
  merge-READY and leave the mechanism to the owner). A PR sitting unmerged
  at truly-green because nobody issued the merge (where merging was
  authorised) is the shepherd's unfinished work (PR #325, 2026-07-08).
  If a merge attempt bundled with other actions is harness-denied, retry
  the bare `gh pr merge <n> --merge` alone before concluding the
  capability is gated — on #325 a denied composite was over-generalised to
  the command itself, and the permitted bare command later merged the PR.
  Know when a BLOCKED state can NEVER clear (worked instance PR #391,
  2026-07-16):
  a required status context that nothing posts any more (the SonarCloud
  Code Analysis context — verified absent from docs tips, code tips, AND
  main's own commits) leaves `mergeStateStatus: BLOCKED` permanently at
  green-everything — recognise it by a missing required context in the
  TIP'S statuses (not a failing one), verify against main's commits whether
  the context posts ANYWHERE before diagnosing further, and surface it to
  the owner: restoring the producer or amending the ruleset is repo
  governance, never the shepherd's bypass. The never-CREATED twin (#517,
  2026-07-24) is the same invisibility with the opposite tell and cure: a
  required workflow that landed on main AFTER the PR opened has no check row
  to show and no BLOCKED signal until the merge attempt 405s — the merge
  boundary's required-names-present leg (state machine item 5) catches it,
  and an empty-commit push (firing `synchronize`) creates the missing run.

- **The merge gate is merge-button-active-for-a-non-admin**: a truly-green
  PR — MERGE-READY per the state machine's item 4, plus every gate leg
  above — merges via a normal
  non-admin `gh pr merge`, SUBJECT to the merge-readiness boundary below (a
  self-authored, sub-agent-reviewed PR additionally needs an in-session
  owner grant or the owner's own merge — the gate opens the button, the
  boundary says who may press it). `--admin` is FORBIDDEN: it bypasses the
  gate instead of satisfying it. Proven twice 2026-07-06 (#306, #305 both merged cleanly
  once threads resolved). Notify the owner at this action moment (send the
  notification; never suppress it on inferred presence —
  `owner-attention-at-action-moments`).
- `BLOCKED` normally means the gate is genuinely unsatisfied — unresolved
  threads, a failing or pending check, or a genuinely required review that
  has not landed — with two known divergences from the full gate: the
  never-fires case above (PR #391: a required context nothing posts holds
  `BLOCKED` at green-everything) and the converse CLEAN-with-OWED-reviewer
  case (state machine item 3). It never means "any agent merge is
  prohibited". The required-review leg is author-dependent (verified
  2026-06-24): a
  bot-authored PR shows `BLOCKED` until the code-owner approval lands; a PR
  authored under the owner's own auth shows `CLEAN` and merges directly —
  GitHub auto-satisfies the code-owner requirement when the author IS the
  sole code owner, and forbids self-approval.
- **The truly-green gate authorises merge-READINESS, not every merge**
  (worked instance PR #323, 2026-07-08): a PR the agent AUTHORED in-session
  whose reviews are the agent's own sub-agents sits behind a second,
  harness-level boundary — the auto-mode classifier requires an in-session
  owner grant (or the owner's own click) before `gh pr merge` executes,
  independent of the gate. Broadcast "merge-READY at truly-green", never a
  promise to merge; surface the merge as an owner action moment unless a
  named in-session grant exists. (The #306/#305 precedent above is not a
  licence for self-authored, self-reviewed merges.)
- An owner grant of merge authority (for example to a team session's
  Director) is per-session, never standing (owner, 2026-06-29); absent a
  fresh grant, the truly-green gate above governs unchanged — the merge
  waits on whichever leg is genuinely unsatisfied.
- **Never run `gh pr merge --delete-branch` while the local checkout carries
  uncommitted changes**: the flag switches the local checkout to the base
  branch as cleanup, and with a dirty tree the local fast-forward aborts —
  the remote merge has already succeeded, leaving the local tree stranded
  mid-cleanup in a confusing half-switched state (edits preserved but
  displaced onto the base branch). Commit or relocate local work first, or
  merge without the flag and delete the branch separately.
- **A deferred or denied merge does not end shepherding.** "Truly green" has
  a shelf life: bots re-review every push asynchronously, so comment-clean
  verified at one instant expires at the next event. When the merge is handed
  to the owner (authorisation gate, harness denial, or explicit ask), the PR
  is still live surface — keep the harvest loop running and re-disposition
  new comments until the merge actually LANDS; hand over a state, never a
  standing claim (worked instance 2026-07-06: a "truly green" #312 handover
  accrued three unresolved bot threads while the agent stood down).
- When merging is authorised, prefer a **merge commit** (`--merge`), never
  squash (standing owner preference, 2026-06-28). Verify the allowed merge
  METHODS first — `gh api repos/<owner>/<repo> --jq '{allow_merge_commit,
allow_squash_merge, allow_rebase_merge}'`; `allow_merge_commit` has
  silently reverted before (2026-06-27). If merge commits are disabled,
  surface it to the owner; never fall back to squash.
- **`gh pr update-branch` is a server-side merge commit, not a local
  operation — it races the next local push.** For a PR reading `BEHIND`, it
  merges the base branch in server-side with no local gate to run first; the
  merge is provably clean via `git diff origin/main <merged-head> --stat`
  (only your intended files changed). Bitten twice: the next LOCAL push to
  the same branch is then rejected non-fast-forward until you pull the
  server-side merge back down first — always fetch/pull immediately after
  calling it, before pushing anything else to that branch. After the
  update lands and checks re-run, the merge remains the explicit command
  at the state machine's merge boundary (item 5), issued by hand at a
  freshly recomputed gate.
- **CI runs the test-merge with CURRENT main.** A mid-round main landing
  that moves a mirrored asset (a kit file vs a tracked copy under
  `public/`, or any tracked parity copy) can red a parity test on your
  round with no push of yours (two instances, 2026-07-20/23). Any lane
  carrying a tracked parity copy inherits this class; the cure is one
  push that folds main AND refreshes the copy byte-identically.
- **A bot re-review round binds ~5–10 minutes after the request.**
  Requesting re-review before the final push of a batch wastes the round
  — it binds to the pre-push tip (three instances, 2026-07-21). Push the
  complete batch first, then request.

## Phase 8 — After merge

**Every merge gets its own fleet broadcast, no exceptions** (obligation
recorded 2026-07-2x: a bot merge went unbroadcast for 40 minutes and left a
peer seat disposition-blocked on state it could not see). In a cascade of
merges, post-merge harvest custody is assigned PER PR — name who owns each
merged PR's Phase-8 harvest in the broadcast, and late findings route to
follow-up branches, never to merged ones.

**Merge auto-delete overrides recorded dispositions** (worked instance: a
merge auto-deleted a remote coordination branch despite a "branch lives on"
disposition, leaving the primary tracking a deleted ref). If a branch must
survive its PR's merge, re-push it immediately after — the disposition text
does not bind GitHub's delete-on-merge setting.

**One post-merge harvest before stand-down.** MERGED ends the merge-state
question, not the feedback stream: a bot round composing at merge time still
posts findings on the merged code up to ~10 minutes later. Apply the settled
quiet window ONCE after MERGED (one final full harvest after >10 quiet
minutes); route any real finding to a follow-up branch, never to the merged
PR's branch. The quiet window is a PROXY predicate — it exists only because
agents cannot see a bot review start or finish; the owner's settled word
from his own visibility supersedes it (owner ruling, 2026-07-2x): when he
says it is settled, it is settled, and the window is not re-imposed on him.

`worktree-hygiene` §3/§6 owns the cleanup: remove the worktree and delete the
branch (content-verified, owner-authorisation-gated for destructive ops);
update continuity surfaces; close claims.

## Failure modes this skill exists to prevent (all observed)

- REST-only comment reads declaring "no comments" over unresolved inline
  threads and a failed quality gate.
- Truncated comment skims triaged as "noise".
- Ready/merge-ready declared without re-fetching after the latest push.
- Findings dismissed by timestamp ("predates my change") instead of
  dispositioned on content.
- A failed check's downstream echoes debugged before its root cause.
- A Sonar gate treated as an opaque red badge instead of an issue list to fix
  at source.
- Tight `gh` polling loops in place of the budgeted watcher.
- A merge fired between "zero unresolved verified" and a composing bot
  round binding to the tip (PR #390, 2026-07-16) — NARROWED, not
  eliminated, by the state machine's reviewer-leg states and round-owed
  gate (items 3–4): the explicit merge stays a check-then-act step, so
  Phase 8's post-merge harvest remains an obligatory recovery, never
  optional.
- Eight fix-rounds shepherded one-by-one with no per-round tally, so
  non-convergence never surfaced as a signal (PR #390) — cured by the
  state machine's tally store + step-back trigger (item 2).
- An armed auto-merge waiting forever on a required status context that
  nothing posts any more, misread as a merge mystery (PR #391, 2026-07-16:
  the required SonarCloud context was absent from every commit including
  main's) — cured by the Phase 7 never-fires recognition: check main for
  the context, then surface the governance gap to the owner. (Arming was
  struck in that era and later RE-PERMITTED at settled-READY under a
  Director grant — PDR-131, 2026-07-20 — so this mode can recur; the
  never-fires recognition applies to any armed intent, alongside the
  item-5 arm-staleness disarm duty.)
