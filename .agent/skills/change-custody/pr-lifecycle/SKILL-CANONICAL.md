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
[`pr-comments-resolve-and-recheck`](../../../rules/pr-comments-resolve-and-recheck.md),
composes with the [`commit` skill](../commit/SKILL-CANONICAL.md) (which owns
landing commits), [`worktree-hygiene`](../../../rules/worktree-hygiene.md) (which
owns the branch/worktree lifecycle around the PR), and the
[`review-feedback-defaults-to-triage`](../../../rules/review-feedback-defaults-to-triage.md)
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
touching no checkout. A second stacked-PR mechanic bites at the merge
boundary, after every review round is spent (measured first-hand
2026-08-11): on native GitHub stack members the synchronous REST merge
endpoint answers 403 ("use the asynchronous merge endpoint") even at a
settle-ready verdict, base edits answer 422, and the vendor's only
stack-merge instrument is a CLI cascade under ambient credentials — which
the bot-identity rule forbids. If PRs are stacked for review ergonomics,
plan the merge boundary from the start as stack dissolution plus sequential
bottom-up merges on the standard bot path; never discover the 403 at
settle.

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
  integrate or refute with evidence. _Resolved_ is the outcome of that
  treatment, never the goal; racing resolution inverts the artefact.
- **While a PR is open, the conversation IS the work.** A reviewer finding is a
  bug report against the proposal — session priority #1, ahead of new work. A
  push changes the proposal, so the entire review surface is stale the moment
  it lands: re-harvest and disposition before reporting anything.
- **The record outlives the merge.** Description + threads + dispositions are
  how future readers (and agents answering from PR history) recover _why_ the
  change is what it is. A false disposition reply poisons that well permanently
  — gate every reply on its own verification, and VERIFY description edits
  actually stuck (bot summary re-appends can silently mask a failed edit).
- **"Mergeable" is a git-graph fact about ancestry, not readiness.** Readiness
  is a property of the conversation: every thread dispositioned with evidence,
  every check green, the description true of the _current_ diff, the record
  coherent for a reader who was not there. Report in those terms.
- **The PR exists to structure shared attention** so nobody has to chase state;
  making the owner chase threads defeats the artefact even when the diff is
  perfect.
- **The open-PR count is a standing objective at zero, kept there by
  LANDING** (owner, 2026-09-03, verbatim: "a secondary but important goal is
  always to work to reduce the total number of PRs to zero"; sharpened
  2026-09-06: "this never prevents PRs from being created, but it does mean
  that landing work that is in a non-draft PR is a priority"; the first
  clause of the 2026-09-06 words is superseded by the work-in-progress
  limit, owner 2026-09-26: no PR other than a repository's coordination PR
  opens while the count is at the limit, by Phase 7's work-in-progress
  bullet; restated 2026-09-25, relayed verbatim by the Director: "shoot for
  zero open PRs for both repos via the proper quality and merge processes,
  use all appropriate skills", which the Director read as a direction and
  not a deadline, every door keeping its full process). A non-draft
  PR is its seat's landing priority over starting the next unit; drafts are
  inventory a seat may hold; the count is reported at every wrap and acted
  on at every boundary — merged when green and clean, closed with its
  reason, or owned with a named seat and a next step.
- **A review lane's deliverable is the review ON the PR, and a review of a PR
  lands on that PR's branch.** Post the first typed, first-hand-verified
  finding on the PR as soon as it exists and say what follows; the report,
  the node, the thread record and the panels are the record, never the gate
  (owner, 2026-09-06, after ninety minutes of plan, fleet design, census
  scripts and continuity artefacts: "there is not a single review on the PR
  from you so far"). A record about an open PR — a review report, its node,
  its rows — lands on that PR's branch, pushed as the bot under the PR's own
  review contract, never as a separate PR into the base (owner, 2026-09-07,
  after re-basing such a PR by hand: "I never wanted the review in a
  separate PR, that is of very little use, you should have added your work
  to 66 in the first place"); "never push to the reviewed PR's branch" was a
  seat's borrowed etiquette, never doctrine, and the owner's own act on their
  PR is authority. When the reviewed branch is behind the base, sync it in
  the same push. And the lane stays denominated in the review of the
  object's substance — chapters read, findings made — not in the apparatus
  built to review it (owner, 2026-09-07: "Your one job was to review PR 66,
  have you done that?").
- **A remote branch without a PR is not safe.** Closing a PR is never a
  preservation move (owner, 2026-09-04, verbatim: "a remote branch without a
  PR is NOT considered safe, the work will rot or be orphaned, if it is
  worthwhile then it stays open"). The PR is the visible index and the merge
  vehicle; a bare branch is invisible inventory that decays. Never present
  "close, branch preserved" as a disposition: judge the work's worth —
  worthwhile work stays open as an owned lane (sync, gates, first-hand review,
  settle, merge); worthless work closes with the reason and its branch goes.
  The earlier form of the same ruling (owner, 2026-07-26, on a "preservation
  draft" PR that went from frozen reference to conflicting to owner card in one
  day): "work sitting on a branch is not 'preserved', merged work is preserved,
  if it is valuable we find a way to merge it, if not we delete it." A branch
  is a decaying claim, not a home; "frozen for reference", "parked" and "kept
  for pickup" are not dispositions. At a seat's closeout a wrap-mandated
  tracked artefact reaches its safety floor as an open DRAFT PR (remote,
  discoverable, merge-vehicle attached) — never local preservation — and the
  draft still owes a merge-or-delete disposition afterwards.

## Phase 1 — Before opening

1. **Divergence**: fetch the default branch and, if behind, merge it into the
   branch (`git remote set-head origin --auto`, then `git fetch origin <default>`
   and merge `origin/<default>`, where `<default>` is what
   `git symbolic-ref --short refs/remotes/origin/HEAD` prints less its `origin/`
   prefix; never a hand-typed name, since the default branch differs between
   estates). Anything coming in from the default branch is merged,
   never rebased, pushed or not, whatever a handoff or plan line says (the
   owner, 2026-10-02: "anything coming in from main must always be merged, not
   rebased, we must maintain the shared history"; a rebase rewrites commits
   that carrier pull requests, the mirror branch and ancestry proofs depend
   on). The host's mergeability reading does not follow renames across the
   merge base, so a branch that renamed what the default branch edited reads
   CONFLICTING until the default branch is merged in; the cure is the merge
   (2026-10-03).
   When the update touches agent memory/state files, author the union by hand
   per the `semantic-merge` skill — a git line-merge silently corrupts them.
   Tripwire: a conflict beyond trivial union-append on `.agent`
   continuity/state/memory files STOPS the merge and routes to the Director —
   resolving it solo is how approved versions get silently reverted.
2. **Tree and gates**: working tree clean. A push whose pre-push hook ran has
   already run the full gate suite, so a clean push IS the local-green proof —
   do not re-run gates just to re-confirm it. A push made with `HUSKY=0` runs
   no local gate and proves nothing local: the ChatGPT Work cloud profile
   pushes that way (its routing directive names the static checks it reports
   instead), and so do Claude cloud sessions by the owner's 2026-08-31 ruling
   (`.agent/claude-harness-integrations/cloud-environment.md`, which relies on
   CI as the gate and names the in-session validation it keeps). The identity route for a push is
   `bot-identity-on-third-party-systems`, which evaluates the ChatGPT Work
   cloud profile first: a detected Work cloud session pushes as
   [`cloud-environment-routing.md`](../../../directives/cloud-environment-routing.md#chatgpt-work-cloud-profile)
   routes it (the configured credential, `HUSKY=0`, no pnpm and no bot
   minting). Every other push goes through
   `pnpm agent-tools merge-bot push --branch <name>`, never a plain
   `git push`, and the pre-push gate chain runs once per push invocation, so
   batch a branch's cures into one push rather than paying the ~3-minute
   suite once per cure.
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
   [`proportionality`](../../cognition/proportionality/SKILL-CANONICAL.md) gate's SCOPE
   axis; run it here when the changeset's size is genuinely in question,
   and note that its LEVEL axis also applies at open — a question standing
   owner word already answers is not an escalation.
6. **Records-class changesets state each invariant once on the FIRST push,
   with the cases as fixtures or worked instances, never as a case list.** A
   mechanism written as cases draws one finding per unhandled case per
   round, and the tail ends only when the invariant is stated (one push on
   #87, four rounds on #88, seven on #89, 2026-09-08); the review tail is the
   estate's own authoring-time check arriving late. The pre-push test: "does
   this paragraph enumerate what could be stated as a property?"
7. **Expert passes before opening remove findings from round one; they do not
   make round one empty.** Three instances (2026-09-27 to 2026-09-28): a
   pre-push pass found three edges and the pull request's later rounds found
   nothing; two expert findings were cured before another opened; a pre-open
   review of a doctrine commit found contradictions with two rules. One
   counter-instance (2026-10-01): three expert reviews passed a decision
   record's promotion and round one found the record's own unmet condition.
   The passes are worth their cost on code and rule text; a status change is
   also checked against every condition the record itself states.

**No draft waits for a ratification.** Work whose premise awaits the owner's word waits on
its ticket with no commit on a worktree branch; the branch, its first commit and its draft
open together at the moment of ratification (`worktree-hygiene` §1 fires at the first
commit, so a plan with no commit holds no draft and the two rules govern different moments).
A draft that cannot move holds a slot and ages its base (the owner retired a waiting draft;
from a handoff record).

## Phase 2 — Open with a reviewer-facing description

Where the repository's PR label ledger defines no fleet-authorship label, this
step has nothing to apply (this repository, 2026-09-24). Otherwise every PR
created under the owner's identity or the fleet bot carries the
repository's fleet-authorship label at creation (`--label` on the create
call, or the API equivalent; the label and its meaning are in the PR label
ledger under `docs/engineering/`). Owner standing word (2026-08-11): "PRs are
getting created without the jimbot label, if a PR is created with my identity
or the jimbot identity, it needs that label." The label is the filter that
separates this estate's PRs from other authors' on a shared repository; a
PR found without it is labelled at sight, and this open-step is the
generator cure so the convention never depends on per-seat vigilance.

Request no HUMAN reviewer at open or at any later round without the owner's
express word (owner standing rule, 2026-08-13: "don't request matt as a
reviewer, don't tag anyone in a Linear ticket without my express request").
Review requests and ticket mentions fire notifications at real people;
pulling in a colleague's attention is the owner's call, never an agent
default. Bot reviewers (Copilot, the Codex connector) are requested under the
review request policy below; an owner-named exception binds for that instance only.

Read `.github/pull_request_template.md` and fill it as a **communication
artefact for reviewers**, never a file list: what changed, why it matters,
what reviewers should focus on, what was deliberately left out, and what
evidence supports merge readiness. Update the description whenever the review
story materially changes (a reshaped scope, a new commit class).
**The description's §Scope is the review contract; on a prose- or records-class changeset
it carries the intake declaration** the state machine's §Response pricing block names as
the declaration's home. It is a step of OPENING, not of the first review round, because
reviewers read the body: a scope and a bar stated there bound what they propose. A pull
request PDR-140 governs that lacks it has no bounded loop until it exists (a code-class
pull request is bounded by the review-round transitions and declares no intake): the
2026-09-11 coordination fold (PR #135) opened with a narrative body and no scope or intake,
and ran five rounds and thirty-eight findings on records before the declaration was posted
late. A records changeset is also pushed at waypoints, never per event: records commit at
each state change, the push follows a landed merge or a shape change, and the review is
requested at most once per settlement push, and only for a stated reason (a pure sync
push requests nothing; the merge-bot
reference carries the rationing); on 2026-09-13 a records pull request pushed per event
drew five rounds, each finding the next stale line.
For a code-class changeset the writer's docblock states the CLOSED contract
before the first push (a worktree lane's draft PR is created by that push, so the
description cannot precede it) and the description copies it at PR-open — what a
target may be, what a flag may be — so reviewers read a contract rather than
discover it a case per round: on
2026-09-06 rounds two to four of a containment-writer review were one contract
specified case by case. A review OF a pull request lands its records on that
PR's branch, never as a separate PR into the base (on this fork every PR branch
is the bot's to push; for a PR whose head the reviewing seat cannot push, the
review lands as review comments and a signed premises comment on that PR); a
separate record PR only at the owner's word (owner, 2026-09-07,
verbatim: "I never wanted the review in a separate PR, that is of very little
use, you should have added your work to 66 in the first place").

**The docs-only class is decided per path, never per directory.** `.agent/`
holds executables beside its prose (hooks, scripts, skill scripts), and a change
to one of those is a code change whatever directory it sits in (a finding on a fold
merged on 2026-09-21).

**Review request policy (the owner's word of 2026-10-27, standing).** A
pull-request review — Copilot's, Codex's or any other vendor's on the pull
request — is requested only for a stated reason, never automatically;
verbatim: "only request co-pilot reviews or other agent reviews when you
have a good reason, don't do it automatically, they are expensive." The one
question, in the owner's words of 2026-10-28: "do we need a review in order
for this work to be safe and effective?" — if yes and no review has
occurred, request one; if no, none is requested, and a tool that requires
one regardless is a broken tool and is cured. The policy binds
pull-request reviewers only: the estate's own sub-agent reviewers
(`code-expert` and the roster the `invoke-code-experts` rule names) are a
different instrument under that rule's own terms (the owner, 2026-10-28:
"there is a difference between subagents and PR reviewers"). The repository's own
automatic review at open arrives unasked and is harvested like any other.
After that, a reason is a diff the seat cannot account for first-hand: a
vendor fact asserted unread, a boundary or parser the seat did not test
red-then-green, seat-written doctrine whose premises were not checked
first-hand (every vendor round on such doctrine found a true defect,
2026-10-02), a change whose shape the seat doubts — stated where the
request is made. An intermediate cure push, a pure sync, a push the seat
has read and tested, and the passing of a round are never reasons.
Copilot's absence never blocks a merge on a docs-only bot-authored pull
request (the owner's 2026-09-03 exception, §merge boundary item 5;
`merge-bot merge` reads the class from the diff and merges it at green, the
review harvested after the merge); on a code pull request the configured
Copilot leg reads UNOWED on a tip the configuration does not review and
nothing was requested on (state machine item 3), and the round settles on
it; the leg is OWED only while a review of that tip is due and has not
bound (§merge boundary). Suppressed findings are Copilot's own low-confidence
bucket: the burden of proof is REPRODUCTION before cure — a non-reproducing
finding gets a reasoned decline with the falsifier recorded, never a
speculative cure or a silent skip. **They hold the merge** (the owner's card
"block on any finding", item 78, 2026-09-14; the fourth measured-state
clause, `SUPPRESSED-FINDINGS-OPEN` in `agent-tools/src/pr-watch/states.ts`):
a tip-bound review body's suppressed count holds the bot's merge until each
finding carries a lifting disposition line in the §Disposition format below,
or a later review on a later tip carries none. The machine reads the
sentence's verb here and nowhere else (`dispositionLifts` in
`agent-tools/src/pr-watch/disposition-lines.ts`): `Cured in SHA:<sha>` and
`Rejected` lift a finding (the rejection's rationale is the convention a
reader checks; the machine reads the verb); `Routed to <home>` does not,
because a routed finding is still a finding the owner asked to block on,
while a rejection is a false positive the owner did not ask to block on
forever. A line lifts only from a comment whose author is the repository
owner or the pull request's author (the seat's dispositions are posted as
the bot that authored the pull request); the signature is a text convention,
so any other login's line is ignored. REVIEW: that joining of the ratified
format and the card is the Director's reading for the owner; the one
function is the place to change if the card reads the other way. Two scope facts: the Copilot-review
ruleset does NOT bind `.design-sync/`, `.agent/plans/`, or
`packages/design` doc paths (confirmed on PR #536's timeline — zero review
fired), so absence there is configuration, not a skipped reviewer; and a
claude[bot] review SKIP is a spend-limit signature, not a blocker — an
organisation review-overage exhaustion is a capability ceiling to note,
never a gate to wait on. Request mechanics: the REST
`requested_reviewers` endpoint's RESPONSE omits the Copilot handle, and
the request FIRES — the timeline shows `review_requested Copilot` within
seconds and the review follows (#108, #109, #110, #114, as the bot under
the pull-request-work token) — so the bare REST endpoint as the bot is the
request mechanism; verify on the timeline, never on the response or the
requested-reviewers list. A third scope
fact: Copilot has a changed-file ceiling and says so — on a sibling
repository it posted only that 544 files exceeded its review limit, naming
the limit itself (2026-08-08). Key the fallback to that explicit refusal on
the PR, never to a file count assumed in advance: a pull request Copilot
has refused for size gets a different verification story, because its
silence there is a capability ceiling, never a clean review.

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
- **Invariants and tool behaviour** — table each invariant the description
  states ("counted", "never", "only") and each tool behaviour it names against
  every code site that binds it (each arm, each consumer) and the assertion or
  predicate that holds it there; when an exclusion is added beside an existing
  one, the existing one's consumer list is the site list. A claim-bearing
  changeset (records, doctrine, a description stating invariants) also gets one
  context-free verification pass against its sources and code before it is
  published; the pass replaces post-push rounds and never adds to them, and a
  changeset with no stated claims skips it. Worked instances, 2026-09-16: #149's
  round one found a counted invariant unasserted in two arms and a regression in
  a consumer its own file enumerated, and pre-publication passes caught about
  eighteen claim errors in one wrap's records and seven in a retrospective's
  citations. Prediction: claim-class findings in round one become rare on
  changesets that ran the pass; falsifier: such a changeset still draws three or
  more rounds of claim-class findings, or the pass costs more than the rounds it
  replaced. **A text cure's sweep reads outward, not only at the cited line**: the
  corrected claim across the whole branch (in other words and in other files), the
  surviving sentences in the same file that teach the model the cure withdraws, and the
  governing texts of any act a new sentence prescribes. On the first run of this pass
  (#152, 2026-09-17: 31 claim errors before publication), round one still raised five
  over-bar findings, three of them this class — a new push instruction that skipped the
  Work-cloud route its identity rule evaluates first, a withdrawal banner above surviving
  instructions, and a cured tool claim repeated in a continuity record.
  The sweep binds an authored re-truing as much as a review cure: on #153 a re-truing
  written before this paragraph existed left five sentences in the same files teaching
  the model it withdrew, and they were five of the doctrine group's nine findings.
  Two further verifier lenses, from the classes the pass did not reach on #153 and #155
  (2026-09-17 to 2026-09-19): **an amendment's neighbours** (after amending a sentence in a
  record or a decision, grep the same file and its sister records for the old claim's nouns;
  nine of #155's fifteen pre-publication findings were unchanged siblings of text just
  amended), and **a mechanism claim is read against the code** (a sentence saying what a
  tool does is checked at the tool's source, not at its documentation). When one sentence
  is about to be amended a third time, stop and re-read the whole passage against the
  mechanism's source first: four of #155's eight review findings were on one sentence of
  one decision, each cure drawing the next.
  A changeset that lands a corrected direction (an owner ruling that renames a category,
  withdraws a shape or reverses a reading) opens its pass with the two-list sweep of
  [`no-tombstones-for-removed-ideas`](../../../rules/no-tombstones-for-removed-ideas.md)
  §Corrected Directions, run estate-wide by the OLD name before any verifier reads: every hit
  is residue to re-true or a fact to harvest, and the sweep's range is the whole estate.
  Worked instance, 2026-09-20: the no-IO test invariant's landing searched
  the eight files it changed and their citers; 22 of the fold's 34 review findings were
  residue in the next rings (a reviewer template, two ADR bodies, four docs, a rule), found one
  ring per round. Falsifier: a changeset that ran the sweep still draws two rounds of
  residue-class findings.
  A cure is a new claim and gets the same check at source as the text it replaces, before
  its commit runs: on the same fold three of the author's cure sentences were wrong when
  first written (a "Phase 4" that is step 8, "the existing smoke suites" that is one suite,
  and `request(app)` relabelled as an E2E check), each caught by that check or by a reviewer.

Worked failure (2026-07-26, PR #557): a PR titled _"action pin bumps"_ carried
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

**The scope a change causes is in scope, whatever the description declares.** A change that
makes a sibling site wrong has caused that defect, and curing it belongs to the pull request
even where the declared scope stops short of the site (2026-09-16: a reviewer called a
regression the change introduced "outside the declared scope"; three independent checks agreed
it was the pull request's to cure). Before review, take each "counted", "never" and "only" in
the description and find the assertion that holds it in the diff: a promise no test holds is
the next round's finding.

**A pull request authored in a cloud environment is marked ready by the owner**, or by a seat
only after the owner's stated acceptance (a Director's ruling, from a thread record).

## Phase 3 — Harvest EVERY feedback surface (the step most often botched)

Immediately after opening — and again after every push — pull all four
surfaces. Partial reads produce false "no problems" verdicts. Where the PR is
linked to a ticket, the ticket's comments are a fifth surface: a
collaborator's bots comment on Linear tickets instead of on PRs (owner,
2026-08-11: "start monitors watching for changes in Linear tickets, Matt's
bots are commenting on them instead of on PRs"), so a "settled" PR can carry
unharvested findings sitting on the ticket; fold ticket-borne commentary into
the round tally before any settle signal, with a change monitor on the lane's
live tickets where the platform is in use.

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
   each review's own `commit.oid` retained alongside its body (compare the
   FULL oid to the tip by prefix: GraphQL's `abbreviatedOid` is seven
   characters and a poll that waits on it can wait on nothing, 2026-09-2x;
   silence from a wait is never "no review") (the paged
   `reviews` connection carries both) — the binding the state machine's
   tally (item 2) buckets body findings by; a Sonar gate summary or a bot
   capability notice lives here. Read this surface UNFILTERED, every time
   (owner, 2026-08-12, verbatim: "never ever filter reviews, ever. That means
   accepting some noise about exhausted quotas, so be it, better that than
   missing feedback"): no login filter, no state filter, no tip filter on any
   review read at any point in a drive — a read selected on one bot's login
   left four changes-requested reviews under a colleague's identity invisible
   until the merge ruleset bounced the merge. A narrow read is lawful only
   AFTER an unfiltered read in the same breath has enumerated the full set.
   And the suppressed block is harvested as if it were the review body,
   every round: two suppressed findings left silent on one PR came back as a
   headline comment on the merged PR two weeks later and were raised again on
   its successor (2026-09-02). The dual of item 1's REST-only failure: a
   reviewThreads-ONLY harvest also structurally undercounts — Copilot's
   "suppressed low-confidence findings" live only in review submission
   bodies with no thread state, and those suppressed findings have run real
   at a striking rate. A thread never auto-outdates when its fix lands in a
   DIFFERENT file than the anchored line — reply with the actual fix
   location and resolve manually, or it reads unaddressed forever. Read
   the reviews surface unfiltered, every time (owner, 2026-08-12: "never
   ever filter reviews, ever"): no login, state or tip filter on any
   review read; a narrow read is lawful only after an unfiltered read in
   the same breath has enumerated the full set.
3. **All checks** — `gh pr checks`, including the external ones (SonarCloud,
   CodeQL, Vercel, Cursor Bugbot, Codex). A failed check's _first_ failure is
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
   summary names conditions; only the issue list names the work. Sonar on
   this repository is automatic analysis (server-side, fired by the push
   webhook; no CI scan step), so the required "SonarCloud Code Analysis"
   check can stay absent forever when the webhook drops: the ruleset shows
   it "expected", the merge endpoint refuses, and everything else is green
   (PR #465, 2026-07-21). Docs-only PRs are analysed too, so absence never
   means not-applicable. A settle watch therefore checks BOTH that no check
   is pending AND that Sonar's public API reports a verdict for the PR
   (`api/qualitygates/project_status` with the pull-request key returning a
   status other than NONE); a checks-only watch calls "settled" too early.
   The cure for a dropped trigger is an empty commit pushed to re-fire the
   webhook; analysis follows within minutes.

## Phase 4 — TRIAGE every comment; fix at source

- **On a records-class pull request, write the reader-harm test per finding
  before choosing cure or reject** (PDR-140 clause 9(a)): one line naming the
  reader, the act they would take, the harm, the class and the verb. A finding
  labelled below the bar and then cured by a push has been dispositioned twice
  and priced once (eight roles, 2026-09-27).
- **A below-bar call on the deciding seat's own record gets one confirming line
  from a live seat before it is signed** (the Director's ruling on its own
  records pull requests, 2026-09-27, two instances; on one of them a below-bar
  label proved wrong and the cure stood).
- **A third edge case in one procedure paragraph ends the clause-adding.** When
  review keeps finding edge cases in the same prose procedure (a rollback step,
  an "owed branch" rule; 2026-09-27), stop adding clauses: point the paragraph
  at one home, and propose a tested tool that carries the procedure instead. Rule
  text gets a pre-open review for exactly this shape.

- **The triage ruling** (owner, 2026-07-27, verbatim, a SEAT-LEVEL
  obligation applied at the moment each comment is read — never deferred to
  Director discretion): _"We do NOT have to address every comment, we have
  to TRIAGE every comment, if it is incorrect reject it, if it is correct,
  relevant and proportionate address it, if it is anything else raise a
  ticket, tell the Director, and close the comment."_
  Read through the owner's later ruling for all agents (2026-09-23,
  verbatim: "do not update the Director unless you have a question or other
  request, the normal records keep the record"), the ticket is how the
  Director is told, and a finding that raises a question or a request goes
  to the Director as its own message.
- **A reviewer's finding is information, never authority** (owner, 2026-10-08,
  verbatim: _"Copilot reviews are a source of information to consider, they
  are NEVER authority to obey, if we follow their advice or respond to their
  observations it is ONLY because we decide to do so"_). The seat decides
  each disposition and owns it; a finding that cites a directive is a reading
  to verify against the owner's standing word, not a verdict. A remedy that
  would remove or weaken something the owner put there deliberately (a settled
  record, a continuity pointer, a letter's account, a directive-governed
  boundary) is a question to the owner before any cure lands, never a cure
  applied and reported afterwards. Worked instance, 2026-10-08: a fold obeyed a
  reviewer's privacy reading, stripped every pointer to the owner's private
  editorial material from a lane's public records and merged it; the owner
  called it overkill, the pointers were restored and the directive amended to
  say what he meant.
- **Separate the observation from the remedy, and test scope before correctness.** A
  finding arrives as an observation bundled with a proposed change, and the change is where
  scope expands: reviewers — bots above all — grade the diff's text against the widest
  standard they can imagine, never against the story. Read the observation as evidence and
  set the remedy aside; test the REMEDY against the description's §Scope FIRST — the cheapest
  conjunct, and the one that decides, for most findings, that no cure lands here. The
  observation is then verified as the three-way test requires and priced on the bar: a false
  observation is rejected and never given a durable home; a true one over the bar earns its
  in-scope cure or its named home; a true one below the bar takes a reasoned rejection with no
  write, or a home that already exists (PDR-140 clauses 1 and 9). Where a
  cure is owed, it is derived from the story, never from the remedy. A remedy that would
  exceed the declared scope — coverage, markers on every claim, the full plan reproduced here,
  a decision held pending, where §Scope asked for none of them — is a scope finding whatever
  the truth of its observation: the remedy takes no cure here. The verified observation is
  then priced on the bar like any other finding — over it, an in-scope cure is derived from
  the story (a correction or a removal; PDR-140 clause 2 decides where a cure lands, never
  whether truth matters); below it, a named home in one line. Worked instances,
  2026-09-11/12: a true observation about
  nested fences became a container-aware parser nobody had asked for (five rounds, then
  deleted); a report's per-claim marker contract was cured by narrowing the claim, never by
  adding markers (one push). The scope test reads CAUSAL scope as well as declared scope:
  a regression the pull request's own change introduces is inside it whatever §Scope says,
  because declared scope is the author's promise to the reviewer and causal scope is the
  change's promise to the codebase (2026-09-16, #149: a reviewer filed a phantom OWED leg as
  "outside this PR's declared scope"; the change had caused it, and it was cured in the PR).
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
     On code, RELEVANT means exercised by a tested or recorded input of the
     pull request's specification (the state machine's item 2): a correct
     case no such input exercises fails this conjunct and goes to state 3
     as a fixture at pickup, never to state 2 (PR #139, 2026-09-12). Once
     the declared settlement-push budget is spent, every finding goes to
     state 3 whatever it exercises — the cost gate holds the push for seconds,
     before the check, until the seat has written its decision as one line
     in the local note `.agent/state/collaboration/review-rebudgets.md`
     (`<pull request> — <date> — <reason>`, one per push past the budget;
     the owner, 2026-10-24: the check makes the seat think, and costs no
     comment, no further push and never the owner's word), and the reviewer
     blocks read the same items as observations.
  3. **ANYTHING ELSE → ticket + tell the Director + CLOSE the comment.**
     Correct-but-elsewhere, correct-but-disproportionate, out-of-story
     hardening, adjacent design questions: raise a pointer ticket (never a
     spec), which tells the Director (the reading above), reply with the
     ticket reference, and RESOLVE the thread. The closure is deliberate
     doctrine — a ticketed finding left unresolved re-creates the divergent
     loop this rule ends.
- **Convergence is the test of the loop**, not only the correctness of each
  round: rounds should shrink; a cure not required by the ticket's story is
  a ticket, not a commit; unrequested hardening built mid-review has a
  measured high defect rate (worked instance, 2026-07-26/27: one PR reached
  ten rounds — one feat commit, twelve fix commits, four cures introducing
  new defects, three of those in hardening no ticket asked for — before
  this ruling landed). Underlying principles:
  `concept-exploration` §Loop Dynamics; sizing gate: `proportionality`.
- **A sampling finder has no fixed point — cure the CLASS, not the instance.**
  A bot reviewer over a large, dense diff _samples_ it differently each pass
  rather than converging: measured suppressed-finding counts across one arc ran
  5, 5, 2, 4, 3, 3, and round 10 flagged two surfaces that had been unchanged
  since round 1. Waiting for such a loop to reach zero is waiting on a process
  that has no zero. Two moves end it:
  - **The class-kill.** When a finder lands one instance per round of the same
    shape, stop curing instances and close the family in one move — a single
    exact-set assertion ended a presence-only family that had recurred for three
    consecutive rounds.
  - **Tally-then-step-back at ~4 settled rounds**, with the materiality line
    stated: cure correctness-class findings, disposition polish with a verified
    failure scenario, make every item visibly adjudicated on the PR, and give any
    routed residue a named carrier. Convergence then means _the loop closed
    honestly_, not _the finder went quiet_.
- **A growing round is a routing failure.** If the surface under review expands
  between rounds, the loop cannot converge by construction — freeze the text and
  route the additions, rather than reviewing a moving target (worked instance: a
  design plan whose three full-depth rounds ran 98 → 112 → 113 findings while the
  text doubled, because each cure added reviewable mass; the cure was partitioning
  by horizon, not more rounds).
- Order by blocking force and risk, not by tool order; root causes before
  echoes.
- Analyser findings, Sonar's and CodeQL's alike, have no per-site
  disposition channel: every finding is cured at source (the owner's
  2026-09-08 ruling, "we don't dismiss issues, we fix them"); the one
  excepted class is OCE's tracked CodeQL query exclusion of
  `js/missing-rate-limiting` (the owner's 2026-09-17 mechanism ruling,
  about that one issue; OCE's sonar disposition policy records it).
  Triage routes findings; it never buries them — never dismissed by
  category or per site, never gate-narrowed, never warning-downgraded,
  never suppressed.
- Fix the class, not the instance: a spelling finding on two lines gets a
  repo-wide sweep of the class; a stale literal gets checked against its
  source constant convention. The class sweep that ends a loop re-runs
  every COUNTED and every CLASSIFIED property after each cure and greps
  every other mention of a changed fact in the same commit — never only
  the phrasing the finding used (two of one round's four findings were
  stale mirrors of the previous round's own cure on a 1,500-line plan,
  2026-09-05), and it records the grep patterns and hit counts on the PR
  so the next round is dispositioned against them (the lead's steer on a
  PR whose rounds five to eight each cured one more surface of the same
  class, 2026-09-04).
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
- **Bot lanes on prose-class changesets read this phase through
  PDR-140** (the state machine's firing-gate block): state 2's
  "address, fixed at source" lands via the worthiness bar and batched
  settlement pushes, state 3's ticket leg carries the durable ledger
  write, and the timestamp clause composes with PDR-140's below-bar
  age-out (the finding is still triaged; only settlement accounting is
  untouched). Two distinct triage layers exist and both bind: this
  phase's three-way ruling (owner, 2026-07-27) decides each finding's
  terminal state; PDR-140 and `review-feedback-defaults-to-triage`
  decide when and how a state-2 cure lands. Human lanes are unchanged.
- Sonar reflects fixes only after the next pushed scan — verify fixes with
  local gates at source; never poll Sonar immediately after an edit.
- Diagnose a failed CI run from the failed **step name**
  (`gh run view <id> --json jobs -q '.jobs[].steps[] |
select(.conclusion=="failure")'`), never from the `--log-failed` tail — an
  `if: always()` advisory step that runs last can misattribute the real
  failure (observed 2026-06-24: the tail blamed a drift check; the failure
  was format-check).

**State the invariant, not an enumeration.** A recipe that lists cases invites a sampling
reviewer to list the rest, one a round: state the invariant and its check, and name the writes
once. A patch to one region is read against the untouched text and the sibling files before it
opens: five of one records pull request's eight rounds were contradictions with text the
patch had not touched. And where a cure is cheaper than the argument against it, cure; a
second raising by an independent reviewer tips any disposition to a cure (three lessons from
one handoff record). The working read is section by section through each touched file in
the merged tree (`git diff <default> <merge-tree> -- <paths>` with context, then each
section's other clauses), never the diff alone, which cannot show the clause the patch now
contradicts (2026-10-02).

## Phase 5 — Wait without burning budget: the SUPERVISED terminal-condition watch

- **A pull request with a merge conflict runs no `pull_request` workflows.**
  GitHub skips them, the rollup can still read green from an earlier tip, and
  a base branch that requires no status check hides it entirely. Read the
  tip's own run list (`gh run list --branch <head> --commit <sha>`) before
  reading any check as satisfied, and cure the conflict before requesting a
  review, since a review of an unmergeable tip is a round spent on nothing
  (2026-09-15).

- **Every PR-state read STARTS from the compound read — the review-round
  state machine's item 1, below — in ONE call.** This is a floor, not a
  ceiling: the Phase 3 harvest and the compound watch loop are consumers and
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
- Watch with a compound read that emits on change: a background loop under
  a Monitor that runs one compound GraphQL read of the pull request per
  60-second tick (state, merge state, head, the check rollup counted by state,
  unresolved threads, reviews bound to the head; a connection that reports
  truncation is paged within the tick, as item 1 requires) and prints one line only when that
  reading changes, ending only on MERGED or CLOSED. It also prints a heartbeat
  line at a fixed cadence (every tenth tick) and a line when it exits for any
  other reason, so a dead or hung watcher is told apart from a quiet pull
  request (F-164's expected shape); the heartbeat is liveness, never state. No tool provides that
  loop yet: the seat writes it, running the compound selection of the
  review-round state machine's item 1 at a 60-second interval (not the tight
  polling F-110 forbids), until the `ws6-pr-watch-compound-floor` item below
  gives it a tool form. For a single verdict,
  `pnpm agent-tools pr state <n> --expect <login> [--expect <login> ...]`,
  with one `--expect` per available configured reviewer as for the merge
  (the flag declares the whole expected set; `--expect none` declares it
  empty when the seat has judged the work needs no pull-request review to be
  safe and effective — the owner's one question, 2026-10-27), computes the front door's
  reading once and never merges. Do NOT use
  `pnpm agent-tools:pr-watch <n> --watch --interval 60` as the watch: run
  through the unified entrypoint, that path buffers every line until exit, so
  a Monitor on it reads silence; it was silent across head and check
  transitions at three seats and exited early on ALL-GREEN at a fourth
  (frictions F-164, five instances), so its silence cannot be told from its
  failure. Treat any watcher's events as wake signals only, never as the
  state; the Phase 3 harvest is the authoritative read on every wake, and
  extending pr-watch to the full compound floor is tracked as the
  `ws6-pr-watch-compound-floor` item in
  `pr-merge-readiness-discipline.plan.md`.
  Passing checks alone are not green — an
  unresolved thread blocks merge-readiness just as hard. The Phase 3 GraphQL
  harvest remains the authoritative read for which threads and what they say.
- **Know the designed hole of any watch that ends before MERGED/CLOSED.**
  pr-watch ends on ALL-GREEN and `gh pr checks --watch` ends when the checks
  complete, but comments post asynchronously up to ~10 minutes after a push,
  so such an exit opens an unguarded window exactly when a bot round may still
  be composing. **The mandated shape is a SUPERVISED watch**: one that
  terminates ONLY on MERGED/CLOSED — the compound loop above does so by
  construction; the earlier shape re-armed a shorter watch on EVERY exit and
  recomputed the compound state at each re-arm (proven live end-to-end on PR
  #330, 2026-07-08: the watch rode the full arc to MERGED and self-terminated
  on the recompute). MERGED/CLOSED is the only terminal claim — the only state
  no late comment can un-green. Two worked instances shaped the compound loop:
  (a) **a re-arm loop SPINS when the PR is all-green but the merge waits on an
  authorisation gate** — pr-watch's all-green exit fired instantly on every
  re-arm and the cycle flooded the notification surface until the platform
  killed the monitor (2026-07-15); the cure was a slow compound poll that
  emits only on change or terminal state, the shape the watch above takes
  from the start.
  (b) **The watch must emit on every state that means "stuck", not only
  failure and success**: an auto-merge/queue entry stalled at BEHIND or
  ejected from a merge group looks identical to "still waiting" unless the
  watch names those states in its alternation (2026-07-20 — a BEHIND stall
  sat silent through four update cycles). Silence is not success.
- **There is no push-event transport to wait on instead**: true push events
  are webhooks (they need a server); `gh api repos/…/events` is itself a poll
  with ~30–60s feed latency; `gh pr checks --watch` has the same
  exit-at-completion hole class. Polling the PR GraphQL at 60s (one compound
  read per tick) is the strongest available primitive. Never hand-roll tight
  `gh` polling loops (the shared 5,000/hr API budget; frictions F-110).
  Between events, continue other work or hold; the watcher wakes you.
- **The round in front of you is priority one over the next unit.**
  Pre-authoring the next lane while a round sits unanswered is the fluent
  frame that hides a late read (a round sat twenty-five minutes with checks
  green while its seat drafted the next PR, 2026-09-08).
- **Count gate-satisfying repetitions as you count rounds.** A monitor
  re-arm, a hook re-run and an empty-commit re-trigger each satisfy a gate
  without advancing the merge; before the fourth repetition of any of them,
  name the goal the gate serves and ask whether the move advanced it — a
  loop that sees only its own gates cannot see itself diverge (three seats,
  2026-09-03).
- **A red required check with an external cause is re-run after the cause
  settles, never answered with a push** — an apt mirror returning "Hash Sum
  mismatch" at the Playwright install step failed three runs in sixteen
  minutes (2026-09-09). The bot re-runs the failed job under its
  `workflow-dispatch` scope (the installation holds Actions write in each
  estate: OCE read it from the installations endpoint on 2026-09-11 and
  cites two bot re-runs of 2026-09-12; jimcresswell.net minted a
  `workflow-dispatch` run on 2026-09-25; `.agent/reference/merge-bot.md`
  records the host's evidence), so no push is made: an empty-commit
  re-trigger was the route only while the bot used a scope without that
  permission.

## The review-round state machine (single definition)

Phases 5–7 drive one coupled loop over review rounds. The contract lives
here, once; the phases reference it. Amendments land in this section, never
as phase-local restatements.

**Response pricing — the intake contract
([PDR-140](../../../practice-core/decision-records/PDR-140-review-response-pricing.md),
owner-ratified 2026-08-31; prose-class changesets).** Before the first
review wave, the pull request description's §Scope — the shepherd's
opening working notes in PDR-140 clause 3's sense, and the one surface
every reviewer reads — declares the intake contract:
artefact class, next verification point, the worthiness-bar reading
that follows from those two, and the settlement-push budget. Thereafter
triage per PDR-140 and
[`review-feedback-defaults-to-triage`](../../../rules/review-feedback-defaults-to-triage.md)
(on mixed changesets, the prose findings take this contract; code
findings keep the machine's existing behaviour):
disposition-and-route (with the durable ledger write) or
reject-with-rationale is the default, cures batch into settlement
pushes, and bot lanes batch while human reviewers keep this machine's
existing small/large ask dispositions. PDR-140 owns the clauses; this
block is the firing gate, and the tally (item 2) plus the declaration
are built at PR-open, never reconstructed mid-loop. **Tally semantics
under triage**: the tally keeps counting RAISED findings per settled
round (it measures the sampler); the step-back arms and the
terminal-success state (item 2) read the CURE-WORTHY count — findings
that cleared the bar; and the generator classification runs over each
settlement round's FULL raised set, dispositioned findings included —
an accumulated disposition set that jointly changes what gets built
escalates to a class assessment even at a cure-worthy count of zero.
The settlement clock is the countdown to the next batched settlement
push; pushes changing no reviewed content (a CI cure, a sync) sit
outside the budget and never carry cures. In-loop, this machine is
sufficient by design (PDR-140 clause 8): needing an out-of-band
cognitive-skill invocation to correct a running loop is a defect
against this skill — file it as one. Two mechanics of the gate that
prices this block (measured 2026-09-27): it reads the FIRST `budget — N`
match in the pull request body, the intake line, so a rebudget edits that
line and never appends a second; and it trips a round late, because GitHub
moves a comment's `commit_id` to the head, so rounds are attributed by
comment time, never by commit id.

**Disposition format — the recorded fields the tally reads (the
`pr-tally` node's todo 3, 2026-09-12).** Every reply or comment that
dispositions a finding is signed as `isSignedSelfReply` in
`agent-tools/src/pr-watch/reviewer-legs.ts` already defines, unchanged:
its final line begins with an em dash and ends with the seat's
`(<six lowercase hex>)` prefix or the token form
`(<six lowercase hex>-<three hex, either case>)`, nothing after it. It
OPENS with the bar marker: a bold span whose ENTIRE text matches,
case-insensitively, an optional scope prefix `In scope,` or
`Out of scope,`, then exactly `Over-bar` or `Below-bar`, then an optional
`on prong one` or `on prong two`, then an optional full stop — and
nothing else. `**Over-bar**`, `**In scope, over-bar**` and
`**Over-bar on prong two.**` read; `**Not over-bar**`,
`**Below-bar, not over-bar**` and any span with other words read as no
marker. The prong and the scope reading are stated where they apply, and
the reply states them BEFORE any cure is written: naming the generator
twice did not stop cure-reflex rounds at one seat, and stating the prong
did, at once (2026-09-12, #136 and #138; "a sentence that must be written is
a step"). The count does not read them. After the marker comes the disposition
sentence: `Cured in SHA:<sha>` (the `SHA:` prefix and seven to forty
lowercase hex characters, bare or inside a code span), `Routed to <home>`, or
`Rejected` with the rationale — the convention for a reader; the raised
count reads the marker only, so a disposition whose sentence lacks the verb
is still counted there. The suppressed-findings hold (§Copilot review policy
above) is the one reader of the verb: on a body-only line the sentence is
everything after the first ` — ` (space, em dash, space) following the item,
so an item is never read as a sentence; a line with no separator carries no
sentence and lifts nothing. A reply on a review thread inherits the thread's head and
anchor from the harvest. A finding that lives only in a review body (a
Copilot suppressed item, a Codex body item) has no thread, so its
disposition is an issue comment carrying ONE LINE PER FINDING: the marker,
then the reference `head SHA:<sha> · review <id> · <path>:<line> · <item>`
— the review's own id (two reviews by one reviewer can bind one head), the
body's anchor for the item, and an item key that survives two findings at
one anchor: a Codex item's bold heading, a Copilot suppressed item's
ordinal in its block (`item 3 of 6`), or `thread <id>` when the body item
restates an inline thread at that anchor and is counted once — then the
disposition sentence. The reference is the recorded field that binds the
line to its round and item; a body-only disposition without it, or a
comment that batches findings under prose headings, reads as "manual tally
required" for those items, exactly as an unmarked review body does — where
an unmarked body is one carrying finding prose without the reviewer's
markers (a sentence under a "Findings: None" heading that says conflicts
remain is a finding to test, never prose: an overview said so above three
true contradictions, and a watch counting threads alone fired READY under
a body listing "previously missed" findings, 2026-10-02); a reviewer's
no-finding boilerplate carries no item and raises zero,
never manual — and boilerplate is proven by the reviewer's own marker parse
yielding no item, never by a footer: Codex's ordinary summary has no
badge-and-heading item; a Copilot body counts as boilerplate only when its
suppressed-findings block is absent or empty, because its "Comments
generated: 0 new" footer coexists with suppressed items (two recorded
reviews say 0 new and carry fifteen and eight). The
cure-worthy count reads the marker and nothing else (a below-bar finding
and a build-changing one can both be routed to a home); signed replies and
comments are excluded from the raised count (item 2). The recorded corpus
that fixed this format is OCE's harvest of its pull request #135 (a fixture with a README in that
estate: that repository's review data, never carried); each estate's own
corpus is recorded at its first tallied pull request.

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
   `after: <pageInfo.endCursor>` until `hasNextPage` is false). The `pr view --json` projection is the
   state, never the evidence: a merge verdict reads the paginated connection
   (three truncation points: `latestReviews`, commits bounded at 100, the
   comments' edit flag; 2026-09-20). `latestReviews` serves ONLY the
   reviewer-leg and settled checks (items 3–4, latest review per author);
   never the tally (item 2); it CANNOT
   reconstruct round history — rows vanish from the connection whenever a
   reviewer posts again.
2. **The tally store.** One row per settled round, `{round commit SHA,
raised count, cure-worthy count}` — the raised count is every finding
   in reviews bound to that commit (the sampler record); the cure-worthy
   count is the subset that cleared the PDR-140 worthiness bar, and it
   is the count `c[n]`, the terminal-zero test, and both step-back arms
   read (a round can settle at raised > 0, cure-worthy = 0: that IS the
   terminal success state under triage). In lanes PDR-140 excludes
   (code-class changesets; human and code findings of mixed ones)
   PDR-140's prose pricing does not apply; the bar is the specification
   the pull request carries — its tests and recorded fixtures: a
   verified-correct finding that a tested or recorded input exercises is
   cure-worthy while the declared settlement-push budget lasts; a
   verified-correct case no such input exercises, and every finding once
   the budget is spent, is a fixture at pickup — Phase 4's state 3,
   dispositioned below-bar with the reason and routed as that state
   routes, never a mechanism edit (PR #139, 2026-09-12: reading "verified correct" as
   "cure-worthy by definition" on an instrument over an open input space
   ran seven settlement pushes against a declared budget of two and 98
   comments, every finding correct, none exercised by a recorded input,
   until the owner stopped the loop — the out-of-band correction this
   block names as a defect against the skill). Rows are PERSISTED in the
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
   reply with the agent identity tuple as the FINAL line, opening with an
   em-dash: `— <name> (<session_id_prefix>)`. The parenthesised field is
   the bare `session_id_prefix` (the join key), never the MCP-145
   visual-disambiguator display token — the detector tolerates a pasted
   token defensively, but the bare prefix is canonical. The auto-exclusion
   binds only for the standard six-lowercase-hex prefix shape; a seat
   whose prefix falls outside it (override values, a non-hex seed,
   `unknown`) still signs — its replies are not auto-excluded, costing at
   most a bounded settle delay. A leading `[Agent: …]` marker
   (identify-as-agent-under-shared-credentials) composes with, never
   replaces, the final signature line. EXCLUDE self-authored signed
   replies from the round tally (drive
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
   per-round count strictly decreasing (under PDR-140 triage, read on
   the cure-worthy count per the firing-gate block above). The
   born-sketch plan-PR convergence cap (owner ruling 2026-07-25) is
   subsumed by PDR-140's intake contract. The cap's terms — after round 4,
   disposition to named homes unless a finding shows an actual falsehood;
   merge at any settle-green tip whose deltas are cap-dispositions or
   falsehood-cures; hard-stop only for new owner parameters — now read
   through the bar: for plan-class artefacts the verification point is
   pickup, so a falsehood earns a cure only if it would mislead before
   pickup (PR #32, 2026-08-31: reading every technical falsehood as
   cure-worthy ran the loop to eleven waves; the bar reading is what lets
   the loop terminate). The cap's four-round full-engagement grace is
   deliberately gone — triage binds from wave one. **The step-back trigger is
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
   day). A CLASS FIX states, once, the invariant the findings were
   sampling and demotes the sampled cases to fixtures — a case the rounds
   did not name is then a fixture at pickup, never a mechanism edit; its
   sweep terms are the CHANGE's own before→after words, never the findings'
   vocabulary (a class fix that swept for the reviewers' words missed the
   word its own amendment had changed and cost a further round,
   2026-09-09); and before its push every surface carrying the changed
   vocabulary, order or bound — the touched files' siblings, the rules and
   skills they cite, the adapters and index rows — is read and cured in the
   same push (the read whose absence cost one records PR eight rounds,
   2026-09-08). The class-fix
   push that answers a step-back OPENS A NEW CONVERGENCE EPOCH: the tally
   re-baselines at that push — round counting and both trigger arms restart
   within the epoch, and prior-epoch rounds stay recorded as history. A
   second step-back firing on the same PR is terminal for fix-pushing: do
   not attempt another class fix by default — split the PR along the
   finding corpus's class boundaries, or route the corpus to the owner with
   a verdict (round-6 correction, 2026-07-16: "4 total rounds" is
   monotonic — without the epoch reset the trigger stays true after the
   mandated class-fix push and the machine has no executable next
   transition). The second step-back is an absolute binding, and its
   residue gets ONE named home before the next round arrives — otherwise
   every later finding re-opens the "is this one falsifiable" question
   (rounds eight and nine on one PR, eight findings dispositioned with
   falsifiers and homed as one bundle, 2026-09-05). **Ahead of these failure arms sits the round-budget
   expectation (PDR-132, which owns the budget value)**: the transition
   fires when an over-budget round OPENS — the first review activity
   binding a tip after the budgeted number of rounds has settled, NOT
   when that round's tally row settles — recording budget-exceeded in the
   working notes and running the generator question before the round's
   findings are cured. Past the budget, on a prose-class changeset or the
   prose findings of a mixed one (PDR-140 §Decision's scope), the ratchet
   binds: a finding earns a cure only over PDR-140's two-prong worthiness
   bar — it would mislead a consumer of the artefact before its next
   verification point, or it changes what gets built — evaluated on the
   surface where the defect lives; a broken link, a validator failure and
   a statement that would mislead a reader acting on the artefact are the
   common instances, never the whole test. A statement wrong under a rule
   today is NOT over-bar per se (PDR-140 clause 9, amended 2026-09-07: five
   records-class PRs ran seventeen rounds and fifty-three cures by reading
   every such statement as a mandatory cure and rebudgeting at every
   exhaustion, until the owner invoked `proportionality` and `pr-lifecycle`
   out of band with no words and the seat read the invocation as the
   clause-8 correction — the anti-pattern recurring). Under clause 9, on a RECORDS-CLASS PR
   (verification point merge; born-sketch plans and other prose classes
   keep clause 4 unchanged) the rebudget is granted ONCE, its push carries
   over-bar cures and queued ledger writes only, and a later over-bar
   finding still cures in a push carrying nothing beyond that cure and any
   queued ledger writes — the cure obligation survives every exhaustion;
   post-final-head route writes land together in at most one ledger push,
   and a later route's write goes to the seat's napkin (or a records PR of
   the lane already open), named in the reply — the reviewed PR never
   reopens for it;
   a routed residue's named home is an existing surface — a register row
   or a PR already open for its own story — never a PR opened to carry
   residue, and a residue PR that exists anyway is terminal: a settlement
   budget of one push, no rebudget, the late-cure path unchanged, no
   further residue PR. The terminal second step-back above and clause 9(b)
   compose rather than contradict: the terminal binding ends class fixes and
   rebudgets, and clause 9(b)'s late cure stays the one door — for an
   over-bar finding only, in a push carrying nothing else (Director ruling
   2026-09-08 when the two met on one tail). Everything below the bar is dispositioned without a diff (the
   lead's ratchet ruling on #961's round four and the owner's word on its
   wrap PR — "ignore bot comments … less than a P1 or equivalent" —
   2026-09-03). For broken code the owner's word holds whatever the budget
   (recorded in the Director's formation letter of 2026-09-17 as said the day
   before): "If you know there is broken code, fix it". On 2026-09-27 it
   carried one named fix push for a verified code defect past a spent round
   budget; it never means a pull request per true finding, a reading that fed
   twelve rounds on one pull request. A code-class finding is outside this prose pricing: a
   verified defect follows the code-review state machine's own transitions
   (PDR-132's round budget, the step-back arms above, and item 2's
   specification boundary), and its cures land inside the same declared
   settlement-push budget — a code loop with no cap ran seven pushes on
   PR #139 (2026-09-12). The budget is enforced at the push: the review
   cost gate (`agent-tools review-cost gate`, in the pre-push hook) prices
   every reviewed round and prints `warn` at half the declared budget and
   refuses the push past it (BUDGET-EXHAUSTED). `warn` is this machine's
   re-pricing checkpoint, answered once in the round's disposition
   comment with one of three moves — stop and reject the rest, split
   along the finding classes, or ask the owner for a rebudget recorded on
   the description; pushing anyway is not a move. The tip of the LAST budgeted settlement push — the
   declared budget (two by default, PDR-140 clause 4) plus any rebudget
   recorded when exhaustion left a mandatory cure pending — is the FINAL
   HEAD, named on the PR when that push lands. Read with the owner's ruling of
   2026-09-14, verbatim "I don't want the number of rounds of PRs to go up": the
   rebudget licenses the one settlement push that carries the pending mandatory
   cure and the dispositions, never a further cure round after it; past the round
   budget each later below-bar finding is a disposition riding the settlement,
   and a later over-bar finding takes PDR-140's late-cure push (clause 4; 9(b)
   on records-class). A prose-class pull request took two rebudget pushes
   under clause 4 before the ruling reached its seat (2026-09-24). A binding
   worth declaring names its exception in advance (a
   statement a rule falsifies, cured with a sweep) or is owner-gated from
   the start: a "no further cure push" declared before reading what the
   next round could hold broke one round later, and on a sibling PR a
   binding with an unnamed exception clause broke at round six while the
   absolute one held (2026-09-05). On a SKETCH-class PR a post-budget
   finding is pickup-shaped by construction — it describes work not yet
   done — and gets a falsifier row rather than a cure push, unless it
   clears the bar's second prong (it would change what gets built at
   pickup) or names a defect on an already-served surface, which cure
   where the bar says; a sketch's loop
   converges only when someone names the final head, because a reviewer's
   supply of next-site findings on undone work is unbounded (eight rounds
   on a one-file sketch, 2026-09-05). The arms above stay the mechanical backstop, not
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
   in-flight recovery, never a licence to open multi-story PRs. A cure
   that ADDS surface (a promoted module, a new file) is authoring, and
   the budget re-binds at that moment: budget the promotion as a new
   changeset, or expect the ratchet to run again over the new surface
   (2026-08-19: rounds 3–8 on one PR each found real holes in code born
   in round 3's cure).
3. **Reviewer-leg states**, computed per (reviewer, tip): **SATISFIED** —
   ANY harvested review by the reviewer binds to the current tip AND
   carries a SUBSTANTIVE body: non-empty after trimming, and not a skip
   marker (the
   Phase 3 harvest is the source; the compound read's `latestReviews` alone
   can hide this when overlapping review jobs complete out of order — an
   older-tip review landing after a current-tip one makes the author's
   "latest" point backwards, leaving the leg falsely OWED and untouchable
   by the timeout). A review BINDS the tip exactly (it names the tip
   commit) or by content: the commit it names carries the same patch as the
   tip against its merge base with the base branch as read now (`git
   patch-id --verbatim` of each commit's diff from GitHub's compare
   endpoint). A PURE SYNC is a merge of the base that leaves that patch
   unchanged; a clean merge is not always pure, since a base change inside
   a hunk's context lines changes the patch. `pr state` names the inference
   in the leg's evidence, and a commit whose content it cannot read binds
   exactly or not at all. A review bound only by content does not stand in
   for a round requested of its reviewer at or after it: a pending request,
   a review-request or ready-for-review event, or an `@codex review`
   comment (GitHub's pending requests never list a bot, so `pr state` reads
   the rounds from the pull request's history). The leg waits for that
   round. The door does not wait for an unrequested run, such as Codex's
   own review of a push: a result it lands after the merge is a post-merge
   finding, fixed forward. The limit is a decision: a base change outside
   the patch that alters what the pull request's code does still binds,
   and the synced head's checks cover it
   (OCE's `agent-tools/src/pr-watch/content-binding.ts`). An EMPTY body satisfies nothing: replying to a review
   thread through the API creates a review with an empty body under the
   REPLIER's identity, so a pull request whose author dispositioned
   findings carries tip-bound empty reviews of its own (seven on #142's
   tip 92018c1f1, 2026-09-12; seven on #147's tip 15de4bc69, 2026-09-15),
   and the declared set may name the seat's own posting identity under the
   vendor-outage ruling above — so the hole is reachable by design, not
   only by accident. The empties are COUNTED in the leg's detail, never
   dropped silently: a predicate over a filtered set says how many items
   it filtered and why, or an empty result set reads the same as a
   satisfied one. The leg's SATISFIED reads the LATEST LANDED review
   binding the current tip (exactly or by content) whose body is non-empty and unsigned — a skip
   marker still counts, because a vendor posting one is reviewer
   activity — never the author's globally latest review and never an
   empty-bodied one: the leg measures REVIEWER activity, not the seat's own
   dispositioning (2026-09-15, #147: the quiet-window proxy then in use
   anchored on the seat's own reply, seven minutes after the round's last
   real review; the signed-self-reply exclusion did not catch it, because an
   empty body carries no signature to detect). A reviewer's reported result has TWO
   transports, and the leg reads both: the review object, and a completion
   comment on the conversation — the Codex connector's transport for a
   zero-findings run ("Didn't find any major issues", naming the commit it
   read), which by the owner's ruling of 2026-09-16 is a positive result,
   not missing evidence (OCE's merge-door comment-evidence decision record of
   2026-09-16).
   The connector also keeps one summary comment per pull request, which it
   rewrites on every run; the completed Code Review row of its table names
   the commit a code review read, whatever it found (findings arrive as
   review objects and threads, which the leg reads first). Such a comment
   SATISFIES the leg when its author is an
   expected reviewer, it is unedited or last edited by its author (the
   author's rewrite is its report; an edit by any other account is not), and
   the commit prefix it names resolves to exactly one commit of the pull
   request, that commit binding the current tip (exactly or by content,
   above); the evidence names the
   transport. An expected reviewer's comment that fails a
   precondition, on a leg the tip does not otherwise satisfy, is never read
   as no comment: the verdict is `UNCLASSIFIED-EVIDENCE`, naming the
   precondition and quoting the comment (a near-miss that reads as silence
   puts the reader back where they started); the door refuses it by name,
   and the cure is a fresh result on the tip (an `@codex review` comment),
   never an edit; a summary whose Code Review row is still running is
   refused as such, and its cure is to run the door again when the row
   completes. The refusal decides the verdict when the round is
   otherwise settled or when it is the blocking reviewer's; a live run
   outranks it, and a refusal on another reviewer rides in the evidence
   beside the blocking leg's own state. A declared STAND-IN takes a vendor's
   place when it cannot review: `--unavailable <login>=<comment-url>` names
   the bot's own comment on the pull request, opening with
   `**<login> leg unavailable on head SHA:<40-hex>.**`, and it stands in for
   that vendor's review of the named head only on the pull request's own
   evidence (OCE's `pr-watch/declared-unavailable.ts`): the bot posted it and no
   other account edited it; the timeline shows the outage (an error review
   from the vendor on that head, or a round asked of it over sixty minutes
   ago with no review since; the ruling of 2026-09-28); and the vendor has not
   reviewed since. A declaration that fails, or names a head that does not
   bind the tip, is `UNCLASSIFIED-EVIDENCE` at once, before the checks ladder.
   **SKIPPED** — via a tip-scoped marker, or via the timeout. The MARKER
   leg: an explicit skip marker in a review body satisfies SKIPPED only
   when its review binds to the current tip, OR when its body declares a
   terminal / until-re-enabled scope. The skip phrase counts only outside
   quotation: inside a double-quoted or code span it is a reviewer quoting
   it, and the body is a review. A reviewer QUOTA notice posted as a
   tip-bound review ("unable to review … quota limit") IS such a
   scope-declared marker (scope: quota restored) and NEVER counts as a
   zero-finding review — reading a bounce as settlement is the silent-wait
   class at the reviewer leg (worked instance 2026-07-21: quota bounces
   estate-wide were ruled SKIPPED by the owner and settled PRs merged on
   green checks + zero threads + dispositioned findings). A vendor ERROR
   review (a body recorded in `pr-watch/vendor-error-reviews.ts`, such as
   Copilot's "encountered an error and was unable to review") is neither a
   review nor a marker: whatever its state it satisfies no leg, the leg's
   detail counts it, and its cure is a fresh request of that reviewer. A scope-declared marker is re-checked
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
   no review bound to the tip after the checks-green timeout
   (>10 min from the tip's checks reaching green, the one clock in the
   state machine; a request still outstanding past it on an OWED leg is the
   leg nobody served, and the timeout ends the watch; a re-request on a leg
   already SATISFIED by a tip-bound review is item 4's round in flight,
   never a skip); record the skip with its
   evidence (reviewer, tip SHA, timeout bounds) in the shepherd's working
   notes (round-2 correction, 2026-07-16: without the timeout the gate goes
   permanently unsatisfiable the moment a reviewer stops reviewing — on
   #390, claude[bot] posted a spend-limit skip review on the first commit
   and nothing on any later tip, so every subsequent tip would read owed
   forever with no tip-specific marker obtainable). **UNOWED** — the base
   branch's `copilot_code_review` rule reviews no later push (`review_on_push`
   false, read from the rules API with every reading), the vendor has reviewed
   an earlier tip of this pull request, and nothing is requested on this tip:
   the configuration owes this tip no review, the leg settles, and a request
   made by hand makes it OWED again (the owner's word of 2026-10-16: the tooling
   derives what is owed from the repository's review configuration, never from
   an assumed review on every push; binds Copilot's leg only, the rule is
   Copilot's). **OWED** — otherwise. The gate never waits more than one timeout
   for any single reviewer.
   CRITICAL first-round rule: the EXPECTED reviewer set is not just "bots
   that previously reviewed this PR" — on a repo whose ruleset configures
   bot review on push, the first round is ALWAYS expected, so before any
   bot has reviewed, every configured bot is OWED until it posts or the
   checks-green timeout fires. A leg is standing BY
   CONFIGURATION, never assumed by doctrine (owner, 2026-08-09: "route
   through the rules process, not assumed"): Phase 1 reads the set from
   the repository's live automatic-review configuration at each PR-open,
   and a dated example is not an input to the state machine — Copilot on
   push, and on one line the Codex connector (`chatgpt-codex-connector`),
   declared in every PDR-140 intake since 2026-09-06 (owner rating
   2026-08-09; graduated through the rules process 2026-09-07), were the
   configured set the day this was written; PDR-140's loop discipline
   governs each leg's rounds like any other's. How a configured leg binds
   a tip, first-hand on 2026-09-09/10 across nine landings: Copilot
   reviews the FIRST push and any tip the bot explicitly requests it on
   (below); the Codex connector's own text lists its triggers as open,
   ready-for-review and an `@codex review` comment — a push is not among
   them, and #147's integration head (pushed 2026-09-15 ~15:3xZ) drew no
   review in the fourteen minutes before an `@codex review` comment, though
   rounds on #105, #106, #108 and #110 had arrived after pushes — so
   a seat that needs Codex on a new tip requests it with an `@codex review`
   comment on that tip rather than waiting on a push, posted as the bot (a
   bot-posted `@codex review` drew the connector's reaction in thirteen seconds
   and a clean review three minutes later, 2026-09-24; the owner's account is
   not needed for it); while its account
   has no credit it posts "Codex usage limits have been reached for code reviews" on
   the pull request instead of a review (first on #116, four seconds after
   its creation on 2026-09-10 06:53Z; on #117 at ready-for-review) — the
   owner named the outage at 08:3xZ (out of credit until about
   2026-09-16). A reviewer's reported result has two transports, and the
   leg reads both: the review object, and a completion comment on the
   conversation. The Codex connector's completion comment for a
   zero-findings run ("Didn't find any major issues", naming the commit it
   read) is a positive result, not missing evidence (owner ruling,
   2026-09-16). **Review legs are desirable, never required; the front
   door declares the configured reviewers AVAILABLE, and a subagent
   review posted on the pull request stands as a leg** (owner ruling
   2026-09-10). Concretely: `--expect` once per available configured
   reviewer, or `--expect none` when the seat has answered the owner's one
   question (2026-10-27: "do we need a review in order for this work to be
   safe and effective?") with no — never the set that happened to bind the tip, never a
   reviewer declared unavailable, and a running door carries the set declared
   when it was armed (when the ruling an `--expect` set rests on changes
   mid-poll, stop the poll before any merge call, read the pull request
   first-hand and re-arm with the new set; one instance, 2026-09-28); a
   subagent review of any kind,
   adversarial included, posted on the pull request with every finding
   dispositioned and reported back to the seat is a review leg, BOUND TO
   THE SHA IT REVIEWED exactly as the vendor leg is bound per tip: the
   posted review names the head it read; the landing premises record that
   sha and every push since; and those pushes may carry only cures of the
   posted findings, the tip sync (a pure one; a sync that changes the pull
   request's own diff is other content) and landing-defect cures (a red required
   check) — a push carrying any other content needs a fresh leg on the new
   head (#117 and #113 landed that way on 2026-09-10, each with a posted
   Opus review and Copilot; #116's adversarial leg read 39e9cc36f and the
   four pushes after it were its cures, the sync and one landing defect). The tool verifies only the vendor legs declared to it
   (`computeReviewerLegs` reads the `--expect` logins; `parseMergeArgs`
   refuses an UNDECLARED set, and `--expect none` declares it empty), so the
   subagent leg is the MERGING SEAT's own
   recomputation — the posted review and its dispositions named on the
   landing premises, the same seat-side check item 5 names for the tally
   state — and with NO configured vendor available the seat answers the
   owner's one question (2026-10-27): a review the work needs for its safety
   or effectiveness is a subagent review posted on the pull request and
   recomputed by the seat; a review it does not need is `--expect none`,
   which the door reads as the declaration it is; a machine-checked
   subagent-leg input is the named
   follow-up on the agent-tools-watch-commands node. **A reviewer silent
   on EVERY pull request at once is that
   vendor's availability, never a pull-request shape**: read its own
   notice on the pull request or ask one question — did any pull request
   get that vendor's review after time T — then declare it once on the
   stream ("vendor unavailable, from, until") and shape nothing around it
   (the 2026-09-10 outage was on the board as the connector's own comment
   from 06:53Z; seats shaped pull requests around the silence until the
   owner named it at 08:3xZ). A fresh pull request, where one is opened
   for any reason, needs a NEW branch name because the platform refuses a
   second open pull request on a branch that already has one (`gh pr
create` on such a branch exits non-zero with "a pull request for branch …
   already exists" and the EXISTING pull request's address inside that error
   text, gh 2.97.0; a script that keeps the output and drops the exit status
   reads that address as a new pull request), and closes
   its predecessor with a pointer once it is open. The ruling's grounds,
   owner verbatim: "policy on PR reviews is that a codex or copilot or
   external claude review is desirable, and more vendors is better because
   that means more perspectives and more approaches, but sometimes those
   options are not available, and development still needs to happen. Note
   that you can always have a subagent perform any kind of review,
   including adversarial, and post findings both back to the calling agent
   and to the PR." A declared leg that never reviewed the tip settles by
   timeout to SETTLED-NO-REVIEW, which the tool refuses by name, and item
   5 below names that verdict's two exits. This closes the
   vacuous-predicate hole where an initial tip could read merge-ready
   before the first bot round ever lands. The expected set's SOURCE is explicit,
   never inferred from the compound read (`latestReviews` only names
   authors who have already reviewed — empty on an initial tip): the
   shepherd DECLARES it in the working notes at Phase 1, read from the
   repository's automatic-review configuration (the ruleset / review-app
   config that fires bot reviews on push), and that declaration is the
   state machine's input for every round.
4. **Round settled; merge-ready.** A round is SETTLED when every expected
   reviewer leg reads SATISFIED or SKIPPED for the current tip AND the
   round's boundary reads closed from MEASURED state: no expected reviewer
   has an outstanding review request, and no live review run mapped to the
   PR is observed. The run leg's contract, exactly: an OBSERVED live run
   mapped to the PR is a measured guard and blocks settlement; an
   unavailable or truncated run surface is named on the settled verdict and
   does not block. The asymmetry is measured: `gh agent-task` lists
   coding-agent sessions and never carried a review round, so the review
   round's own signal is the request, read on every compound read, and
   blocking on an optional gh extension being installed and readable (a CI
   host has none) would be the SETTLED-NO-REVIEW deadlock in another coat
   (Director's verdict on #65, 2026-09-14) (round-3 correction, 2026-07-16: without the skip clause a
   timed-out reviewer stays bound to an older commit and the settled state
   is unreachable). After a pure sync, a leg SATISFIED before it stays
   SATISFIED by content, and the synced tip settles at its first green once
   the round reads closed, by intent. A pure sync opens no round: the tally
   (item 2), the round budget and both step-back arms bucket a review by the
   commit it names, never by content binding, so its findings count once,
   in their own round. Until 2026-09-13 the boundary was a PROXY, a quiet
   window of more than ten minutes since the latest tip-bound review,
   because agents could not see a review round start or finish; the owner,
   who could, superseded it from that direct visibility (owner word
   2026-07-25; #518 and #534 were owner-merged inside the window,
   correctly). The proxy went on the owner's word ("nothing is happening on
   the PR ... the 'quiet window' could be replaced with measured state",
   2026-09-13, on #56): the platform clears the request when the review
   lands, the compound read brackets its thread read with a review harvest
   on each side that must agree, re-reading on a landing (so a review seen
   landed has its threads on the read, and one not yet landed shows as its
   request; a round opening after the bracket is the next poll's, or the
   post-merge harvest's), an OWED leg nobody serves is ended by item 3's
   timeout, the one clock that remains, and a re-request on a satisfied tip
   is bounded by the watcher's poll budget. MERGE-READY is a settled round with zero
   UNDISPOSITIONED findings and a cure-worthy count of zero (item 2's
   semantics under PDR-140: a round whose raised findings are all
   validly dispositioned-with-resolution is merge-ready without another
   push — the pre-triage "zero new findings" reading recreated the
   cycle PDR-140 retires), plus every Phase 7 gate leg.
5. **The merge boundary.** Merging takes exactly three sanctioned shapes,
   all issued at a freshly RECOMPUTED full gate. For BOT merges the front
   door is `pnpm agent-tools merge-bot merge --pr <n> --expect <reviewer>`
   (MCP-508): it recomputes the LEG-DRIVEN settlement verdict itself,
   merges only on SETTLE-READY with the verdicted tip's sha pinned, and
   refuses by verdict name. Since closure item 5a-vi (2026-09-14) it
   consumes the body tally and the disposition lines too: a tip-bound
   summary body declaring suppressed findings holds the round as
   SUPPRESSED-FINDINGS-OPEN until each is lifted by a signed Cured or
   Rejected line from a permitted author (`suppressed-hold.ts`), so the
   tool refuses a marked count that no such line has lifted. That is a
   floor, not the legs: the zero-undispositioned and cure-worthy-zero
   legs above stay the MERGING SEAT'S own recomputation at the boundary,
   because the tool reads the marker, the verb and the head binding and
   never the rejection's rationale, the cure SHA's presence on the branch,
   a thread resolved without a disposition, or prose findings a summary
   carries with no `Suppressed comments (N)` marker — including SETTLED-NO-REVIEW, the timeout-settled round
   this SKILL's item 4 anchor describes, which is watch-endable but NEVER
   merge-eligible — EXCEPT for the class the owner ruled on 2026-09-03
   ("Change the merge policy instead"): a bot-authored pull request that
   touches only documentation and Practice surfaces merges at checks green
   by name, zero unresolved threads, every finding dispositioned, with the
   Claude Code Review's standing verdict and NO Copilot leg expected; for
   that class a timeout-settled round IS merge-eligible. Grounds: the
   Claude review posts no review on a clean tip, so the leg never
   satisfies. The Copilot leg, when a review of the tip is wanted for a
   stated reason (Phase 2's review request policy; never by default), is
   obtained by a review request on the tip,
   `POST repos/{owner}/{repo}/pulls/{n}/requested_reviewers` with
   `reviewers[]=copilot-pull-request-reviewer[bot]`, under the credential
   that registers it in the estate (`.agent/reference/merge-bot.md` names
   it): in OCE the bot's own pull-request-work token returns 201 and the
   timeline shows `review_requested Copilot` within seconds (first-hand on
   #108, #109, #110, #114); in jimcresswell.net that call under the bot
   token registers nothing, and the owner's CLI credential registers the
   request on the timeline within a minute unless the previous request's
   review is still in flight (verified live 2026-09-13). Verify on the
   timeline or the GraphQL `reviewRequests` connection, since gh's
   requested-reviewers list never shows a Bot request, and never through
   the draft/ready toggle, which fires nothing on a pull request already
   undrafted once. After a push, read `pr state` on the new tip: a leg it
   reads SATISFIED, exactly or by content (state machine item 3), needs
   nothing; a leg it reads UNOWED (the configuration reviews no later push
   and nothing is requested) settles, and is requested only for a stated
   reason; a leg it reads OWED (a review of this tip is due and has not
   bound) waits for it. A CODE pull request lands only through the front
   door with every configured leg as the tool reads it on the tip —
   SATISFIED or UNOWED, or the posted subagent review where a vendor is
   unavailable and a review was wanted (item 3's owner ruling of
   2026-09-10) — never by the REST merge below. The exception stands for
   the docs-only bot-authored class on its own grounds, and the tool knows
   the class: `merge-bot merge` computes it from
   the pull request's changed files (every path documentation or Practice
   prose, decided per path as above; `change-class.ts`), merges at checks
   green BY NAME (the base branch's required contexts, read from its rules at
   run time; a pending check the rules do not require, the vendor's own
   review run among them, does not hold a records-class pull request, a
   failed check of any name does) with zero unresolved threads on the
   verdicts that differ from SETTLE-READY only by the vendor leg
   (`RECORDS_CLASS_MERGE_STATES`), and names the ground in
   its evidence; a
   vendor review requested on the tip is harvested after the merge under
   PDR-140 clause 9(e). The interim this clause carried until then ("until
   the tool learns that class, the merging seat recomputes that gate by name
   and lands the merge through the sanctioned REST endpoint as the bot")
   ended as its own PDR-130 prediction said it would: four jimcresswell.net
   folds waited on the leg between 2026-10-04 and 2026-10-10, and the tool
   learned the class there (the retrospective of 2026-10-10; the owner's
   decision on its proposal 1), carried to OCE at his word of 2026-10-14. The two
   non-bot shapes remain: the explicit
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
   zero UNDISPOSITIONED findings on BOTH tally surfaces (threads AND
   review bodies, item 2 — zero unresolved threads alone can coexist
   with an undispositioned body tally) and a cure-worthy count of ZERO
   (item 2's PDR-140 semantics: a finding validly
   dispositioned-with-resolution does not block the gate; an
   undispositioned or cure-worthy one always does) AND zero NEWLY
   HARVESTED undispositioned findings regardless of
   which round they bucket to (an out-of-order summary-only review bound
   to an older tip lands late: it buckets to its own prior round yet still
   blocks THIS merge moment until dispositioned); **every REQUIRED check from the base branch's
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
   inherits Phase 7's merge boundary unchanged: at settled-READY the seat
   merges as the bot and notifies the owner at the action moment; it never
   waits on the owner unless the owner has explicitly said to wait (owner
   ruling 2026-09-03, quoted in Phase 7).
   **In a coordinated drive, the settled-round predicate binds GRANTS,
   not just merges**: a routing seat (Director) grants MERGE-ELIGIBILITY
   — the predicate verdict, never a queue position (serial one-at-a-time
   slots and bump-gap waits retired 2026-07-20, PDR-131: merge concurrency
   between eligible PRs is free; quality binds at settled-READY, and the
   2026-07-20 cascade — eleven settled+green PRs landing in ~6 minutes,
   gate green, every Phase-8 clean — is the measured evidence; under a
   strict-currency ruleset the Phase 7 landing slot orders the syncs that
   policy forces, and the grant is still eligibility, never position) — only
   on the item-4 settled verdict — zero threads AND zero
   undispositioned body-tally findings on the tip with a cure-worthy
   count of zero (item 2's PDR-140 semantics), every expected reviewer
   leg SATISFIED/SKIPPED,
   no expected reviewer requested, no review run live, checks green —
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
  `requested_reviewers` POST's 201 response omits the Copilot handle and
  the roster read is ambiguous in both directions (Copilot leaves it the
  moment it starts). Verify via the issue TIMELINE's `review_requested`
  events, which fire within seconds of the call. Cap identical REST
  retries at two. Three mechanics of that read (2026-08-11/12): the
  review lands under `copilot-pull-request-reviewer[bot]`, so watch for
  landings by the observed-login SUBSTRING (`copilot`), never an exact
  login written from memory (an exact-match filter ran silent ten minutes
  past a landed review); the timeline WRITE can trail a read by up to a
  minute, so one short retry precedes any "dropped" verdict (a seat read
  "no fresh event" seconds after a fire, diagnosed a dead path and routed
  the leg away while the first fire had in fact bound); and re-requesting
  an already-pending reviewer is a silent no-op that mimics a drop, so
  check for a pending request before diagnosing one. There are no
  proven-requester seats and no seat-specific lore (owner, 2026-08-12:
  "it's a cli call, there is nothing special about you calling rather than
  someone else") — a fire with no timeline event gets an instance
  diagnosis, never a routed-away leg.
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
  seconds after your last look. Marking a draft READY is itself a
  reviewer-discovery boundary: reviewer assignment fires anew at the
  transition, so the timeline, requested reviewers, review rows, threads and
  checks are re-harvested immediately after it — "zero current threads"
  before readiness proves nothing about the reviewer set (a late review
  arrived after a ready-marking on a sibling repository, 2026-08-09).
- **Every push dismisses a standing approval** where the base ruleset carries
  `dismiss_stale_reviews_on_push: true` (read first-hand on 2026-09-02, PR #950: a
  doc-only push dismissed an approval given minutes earlier and the PR went back
  to waiting on that leg with no thread to show why). Where a surface reserves an
  approval to the owner, land the complete batch — disposition edits and
  description true-ups included — before asking for it; an approval that vanished
  after a push is this setting firing, never a reviewer's change of mind. Read the
  live ruleset for the current value; the observation is dated.
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
- **Silent-wait sweep after every push (PDR-132)**: read each expected
  reviewer's leg on the new tip. A leg `pr state` reads SATISFIED, exactly
  or by content after a pure sync (state machine item 3), needs no request;
  an OWED leg is one a review of the tip is due on and has not bound; a push
  does not re-request, and a request on the new tip is made only for a stated
  reason (Phase 2's review request policy, 2026-10-27), never to fill the
  leg; a leg `pr state` reads
  UNOWED (the configuration reviews no later push, item 3) needs no request
  and settles, so request it only when a review of that tip is wanted, and
  once a request is made the merge is not attempted until the request is read
  back on the `reviewRequests` surface: a request not yet registered reads as
  nothing asked, and the leg reads UNOWED in that minute. The request is
  CONDITIONAL on the tip the front door will verdict: Copilot reviews
  the first push and any tip it is requested on, so request it only
  when that tip's Copilot leg reads OWED — a request on an intermediate
  head that a held cure, or a sync that changes the pull request's own
  diff, will supersede is spent for nothing
  (first-hand 2026-09-10 on #108, #114 and #116). The same sweep names a
  shepherd for every open PR: threads with no owner are the same disease.
  The sweep's third leg is **review-round liveness**: the outstanding
  review request is the measured signal that a round is in flight. It is
  read from the GraphQL `reviewRequests` connection, the one surface that
  lists a Bot request (gh's `pr view --json reviewRequests` and the REST
  endpoint beneath it omit Bot requests, so a Copilot review in progress
  read as "nobody requested" until 2026-09-13, PR #60), and the platform
  clears it when the review lands. `gh agent-task list` enumerates
  coding-agent sessions (`--json id,name,createdAt,completedAt`;
  `completedAt` null = in flight) and `gh agent-task view <session-id>
  --json` maps a run to its PR (the list JSON carries no PR number; the
  PR-number positional is interactive-only — vendor shapes verified
  2026-07-21). Its contract is item 4's: an OBSERVED live session mapped
  to the PR is a measured guard and blocks settlement; a run's ABSENCE is
  never inferred from it (it never carried a review run), so an
  unavailable or truncated surface is named on the settled verdict and
  does not block. A request never served is ended by the checks-green
  timeout arm (item 3): a wait on a review nobody requested is the
  silent-wait class, not patience.
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
  [`proportionality`](../../cognition/proportionality/SKILL-CANONICAL.md) gate over the PR
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
covers only SUBSTANTIVE changes, never docs/comment-only deltas.
**Every premise the merge decision rests on must be ON THE PR RECORD before
the merge fires** — a review verdict, adjudication, or eligibility ground
that lives only in a session is invisible to the morning reader and to any
future audit; post it as a PR comment first (worked instance 2026-08-07:
a grant was withheld until the in-session code-expert adjudication was
posted, then fired within the minute — fully auditable). Then:

- **A PR the owner has named as the last carrier is not merge-at-green.**
  Before merging it, enumerate every in-flight output that needs the remote
  and hold the merge until each has ridden or been released by name (owner
  correction at the MCP-673 wrap, 2026-09-03: #961 merged at green while a
  wrap workflow's output was still owed, and a fourth PR had to be
  authorised).
- **A PR authored by a human colleague, or by that colleague's own agents, is
  reviewed and (where it earns it) approved — never merged by us.** The
  owner's standing word (2026-08-03/04, verbatim): "you can review PRs from
  Matt on my behalf, just make sure it is clear that it is an agent review,
  and surface if he insists on it actually being me who reviews" and "Don't
  merge Matt's PRs for him, ever, but do review and if appropriate approve."
  The agent review states in its body that it is an agent review on the
  owner's behalf at his standing word, under the identity the action map
  assigns; the merge is the author's own act, and an approved, green, clean
  PR of theirs needs nothing further from us. If the mechanical code-owner
  gate still demands the owner's personal approval, report that one click
  remains; if the author asks for the owner personally, stop and surface —
  never argue the grant at them. The bot-merges-at-settled practice below
  applies to OUR PRs only.
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
  harvest is its named recovery. The command inherits the merge boundary
  below unchanged. A PR sitting unmerged at truly-green because nobody
  issued the merge is the shepherd's unfinished work (PR #325, 2026-07-08)
  — a PR the seat authored itself included: settlement is the
  authorisation.
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
  non-admin `gh pr merge` (or the merge-bot front door), issued by the
  shepherding seat itself, a self-authored and sub-agent-reviewed PR
  included: the gate opens the button and the seat presses it (owner
  ruling 2026-09-03, below). `--admin` is FORBIDDEN: it bypasses the
  gate instead of satisfying it. Proven twice 2026-07-06 (#306, #305 both merged cleanly
  once threads resolved). The same class wears an API coat: a merge call
  (REST, or a GitHub connector's merge tool) issued under the owner's ADMIN
  credential against `mergeable_state: blocked` is not a probe of the refusal
  reason — under admin credentials there is no probe, it merges past the
  protections (worked instance 2026-08-31, a fork PR with a required review
  and fifteen unresolved threads; owner correction, verbatim: "I am an admin,
  you use my credentials, you bypassed the checks"). "Merge it now"
  authorises a merge THROUGH the protections, never past them; only fresh,
  explicit, per-instance owner authorisation naming the bypass is the
  exception. Notify the owner at this action moment (send the
  notification; never suppress it on inferred presence —
  `owner-attention-at-action-moments`).
- **A cancelled run is not a conclusion.** CI's concurrency group cancels the
  in-flight run on every push, so a rollup on a superseded head reading
  `failure` or `cancelled` is the superseding push's own cancellation, never a
  verdict to diagnose or report (check the head sha before reading any
  result); the merge-deciding evidence is the required check reaching a
  genuine conclusion on the CURRENT head, and no push lands on a branch whose
  merge-deciding run is in flight (owner-corrected 2026-08-31 after eight
  consecutive runs were cancelled inside one review loop).
- `BLOCKED` normally means the gate is genuinely unsatisfied — unresolved
  threads, a failing or pending check, or a genuinely required review that
  has not landed — with two known divergences from the full gate: the
  never-fires case above (PR #391: a required context nothing posts holds
  `BLOCKED` at green-everything) and the converse CLEAN-with-OWED-reviewer
  case (state machine item 3). It never means "any agent merge is
  prohibited". The required-review leg is author-dependent, and its live
  configuration is the RULESET, never a paragraph's memory of it: since the
  owner's 2026-07-21 ruling, ruleset 19395183 ("Code-owner review gate
  (bot-exempt by owner ruling 2026-07-21)") exempts bot-authored PRs from the
  code-owner review requirement, so a bot-authored PR waits on no owner
  approval click — the review legs that bind it are the settlement machine's
  own (a requested reviewer must bind the tip; merge-bot's
  `SILENT-WAIT-NO-REVIEWER` is that leg, not a missing approval). A PR
  authored under the owner's own auth shows `CLEAN` and merges directly —
  GitHub auto-satisfies the code-owner requirement when the author IS the
  sole code owner, and forbids self-approval. Read the live ruleset before
  asserting the gate to anyone: on 2026-09-02 two seats relayed a stale
  version of this leg to the owner as a live blocker, one from doctrine
  prose and one from an inherited lane record (owner correction, verbatim:
  "I think the bot is on the bypass list") — a rule's worked instance is
  never the current configuration (`query-the-value-never-the-lookalike`),
  and the ruleset's own title carried the fact.
- **Green, clean and sensible are the three landing requirements** (owner word
  2026-09-07, verbatim: "no prs are blocked on me, green and clean and sensible,
  those are the requirements"): green is the required checks by name; clean is
  zero unresolved threads and CLEAN; sensible is the landing seat's own
  first-hand read that the change is what it says, safe where it touches
  configuration, and belongs where it lands — one signed paragraph on the landing
  premises comment, never a gate for the owner (first instance PR 66, landed by
  the Director as the bot the same day).
- **A green and clean PR merges without waiting on the owner** (owner
  ruling 2026-09-03, verbatim: "green and clean PRs get merged, they don't
  wait on me unless I explicitly say so" — the 2026-07-26/29 standing
  doctrine at the head of this skill, restated). Truly-green and SETTLED
  per the state machine is the whole authorisation, for a PR the seat
  authored itself and whose reviews are its own sub-agents exactly as for
  any other. The seat merges as the bot and notifies the owner at the
  action moment (`owner-attention-at-action-moments`); it holds only when
  the owner has EXPLICITLY said to wait on a named PR, a freeze binds, or a
  rule reserves the surface to the owner. When two clauses of one doctrine
  file disagree, the later, owner-verbatim one governs and the file is cured
  at the site; the disagreement is never routed to the owner as a question.
- An owner grant of merge authority to a team seat (for example a Director,
  owner word 2026-06-29) is a routing grant inside a coordinated drive —
  per-session, never standing — not a precondition for merging green work;
  absent one, the truly-green gate above governs unchanged and the merge
  waits only on a leg that is genuinely unsatisfied.
- **Never run `gh pr merge --delete-branch` while the local checkout carries
  uncommitted changes**: the flag switches the local checkout to the base
  branch as cleanup, and with a dirty tree the local fast-forward aborts —
  the remote merge has already succeeded, leaving the local tree stranded
  mid-cleanup in a confusing half-switched state (edits preserved but
  displaced onto the base branch). Commit or relocate local work first, or
  merge without the flag and delete the branch separately. The separate
  delete is `merge-bot retire` (a proven-ancestor compare-and-swap through
  the API as the bot, with read-back), never `git push --delete`: a
  push-based delete runs the full pre-push gate on the shared host inside
  whoever holds the push slot (2026-09-15: a Director's branch delete ran
  the whole gate inside a lane's slot; the lane's API delete ran no hook).
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
- **The landing slot under a require-up-to-date ruleset** (Director routing
  2026-09-06, refined 2026-09-07 and 2026-09-26; moved here from a retired rule
  2026-09-08).
  When the default branch's ruleset requires branches to be up to date, every
  merge knocks every other open PR to BEHIND; each knocked PR must sync and
  push again, and every push except a pure sync opens a fresh review round (a
  pure sync opens none, state machine items 3–4; ADR-204 makes the re-sync one
  push). PDR-131 retires serial slots as DEFAULT mechanics —
  merge concurrency between settled-READY PRs is free where the ruleset does
  not require currency — and names the strict-currency ruleset policy as an
  owner-owned cost driver (its decision 5); this clause is that policy's cost
  made orderly while the owner keeps it (read the default branch's ruleset
  from the rules API before applying it), not a return of the retired machinery, and
  it lapses the day the policy is dropped. So ONE non-draft PR holds the landing slot at a time:
  the slot-holder syncs ONCE, pushes, settles and merges; every other seat
  may open its PR, gather reviews and disposition threads, but does NOT sync
  or merge until the slot-holder's merge-landed event, then takes the slot,
  syncs once and lands. "Sync once" means AT THE SLOT WORD, never at
  readiness: a merge of the default branch made while other PRs are still
  ahead is superseded by each of their landings and redone at the slot
  (four times on one carrier, 2026-09-09); a waiting PR keeps its own head
  and prepares everything that does not depend on the tip — dispositions,
  sweeps, the merge message. Slot order is the Director's call — among ready PRs
  the default is changed-file count, smallest first (the Director's ruling of
  2026-09-26, the order the owner landed by hand), each count read from the pull
  request at the ordering moment, since a count read before a sync goes stale,
  and the slot goes to a ready PR rather than being held empty. The slot
  follows readiness, never a list
  order written earlier: a draft is not on the ready list until its legs
  can bind, and a slot needs a named keeper, not just a next PR (two
  handovers thirty minutes apart left it unkept, 2026-09-24). A hold needs a
  named receiver as a slot needs a keeper: "a hold with a sensor and no seat
  to trigger it is a hold on nobody" (the Director, 2026-09-26, on two pull
  requests held behind a red check that needed only a re-run); a re-run is
  not a push, so it runs off the slot. Settle-ready
  needs a BINDING round: a dismissed round binds nothing and Copilot never
  approves, so the door's refusal on that is the system working, never a
  blocker to route around (2026-08-19). A holder that has synced and is
  waiting for a per-tip reviewer leg to bind is NOT an empty slot: nothing else
  lands meanwhile, because every landing knocks the holder BEHIND and voids the
  leg bound to its head, a livelock. A PR takes the slot when its legs are
  green and its remaining conditions need no push: its unresolved threads are
  zero or settled by signed lines. "Clean" in a slot ruling means green legs
  and zero unresolved threads, never GitHub's `mergeStateStatus`. A turn opens
  and closes on the coordination stream: "slot taken" with the PR's number,
  one sync push, the legs bound to the synced head, the merge-bot front door,
  "slot released", then the remote branch deleted as the bot with read-back;
  the seat then yields to the next ready PR. A holder leaves the slot in one
  of three ways: it lands and releases; it cannot land without a cure push (a
  red check), so it yields, rejoins the ready list, and its re-sync rides that
  cure push; with no other ready PR waiting, the yield costs nothing and the
  same PR retakes the slot after that push (2026-09-10: two PRs landed while
  the holder cured a red check, and an order to land one of them arrived
  twice while the holder waited on its leg, and was held); or its heartbeat
  and state lines stop for twenty
  minutes and a direct ping goes unanswered, which frees the slot. A heartbeat written by a
  loop proves the process, not the attention behind it: a holder about to go
  unattended hands the slot over first, or names on the stream the condition
  under which a peer takes it (2026-09-27: a ready pull request waited a night
  behind a holder whose loop kept beating). While the
  owner lands by hand, every seat holds its syncs until the owner says done.
  A coordination fold takes the slot at its time. Any auto-sync babysitter — a watcher running
  `gh pr update-branch` on OPEN and BEHIND auto-merge PRs — runs for the
  slot-holder only; a waiting PR is never auto-synced, because each sync is
  a push, and a sync that is not pure is a review round. Worked instance (2026-09-06): one
  PR was knocked BEHIND twice in one evening by other seats' merges, and its
  round five came from a sync push, not a cure.
- **The work-in-progress limit** (owner, 2026-09-26 and 2026-09-27; the
  operating steps under it are the Director's reading and this rule's review
  cures, reviewed at acceptance). The owner's words: "Each repo is allowed
  one coordination PR"; "The total number of allowed PRs not including
  coordination PRs is the number of implementer agents, in this case three",
  counted across the team's repositories together ("Three across both");
  external PRs "absolutely do count towards the WIP limit, and must
  automatically be taken on by the Director, analysed"; PRs from hosts that
  cannot run code "need to be checked out locally, evaluated, and then
  worked on as normal by the team"; for Dependabot, "Team lands green ones".
  The goal is "aiming for zero while useful value is still created and
  merged", because "a static zero means no useful work is happening". A seat
  the owner names alone is its own Director: it routes and it executes, and
  its limit is one open pull request across the repositories. The
  operating steps:
  - No PR that starts new work opens while the count is at the limit or over
    it, other than a repository's one coordination PR. The reservation comes
    first: the opener posts
    "WIP slot reserved: <owner>/<name> <branch>" on its repository's
    coordination stream, then reads the count first-hand from the forge for
    every repository (`gh pr list --repo <owner>/<name> --state open --limit
    1000` on GitHub: the target always named, and a limit above the default
    page of thirty), leaving out each repository's coordination PR, then reads
    every repository's stream for reservations posted before its own that
    had not lapsed when it read the count. It opens only while the count
    plus those earlier reservations is under the limit; otherwise it
    withdraws its reservation on the stream and waits for the next free
    slot. The streams' order is
    the serialiser, as for the landing slot, and a reservation is followed at
    once by its PR or its withdrawal. A reservation lapses when its PR opens,
    when its seat withdraws it, or thirty minutes after it was posted, so a
    seat that stops mid-opening holds no slot for long; a seat still gating
    at thirty minutes posts a fresh reservation and reads the count again. A
    coordination PR takes no reservation.
  - A branch's first push that carries a commit is followed at once by its
    PR, never left standing: a pushed branch with no PR is unfinished work
    outside review. A wanted branch found with no PR is an arrival of the
    external-PR class: its draft PR opens at once at the assessment, it
    counts toward the limit as an external PR does, and the Director routes
    it into the slot order to a named seat ahead of any new opening; the
    opening is posted on the stream like any other.
  - The Director routes each external PR into the slot order to a named seat.
    A green dependency bump lands at its size turn; a red one is assessed,
    then cured, or closed with a card to the owner.
  - A PR from a non-executing host is gated locally on its head; its own
    list of what remains for an execution-capable host becomes its todo, its
    content is evaluated as a peer's PR, and its ready-mark is the owner's or
    follows the owner's stated acceptance.
  - The limit counts OPEN pull requests (the owner's word, 2026-10-02:
    "work is not safe until merged into the default branch. That is one of
    the reasons for maintaining strict WIP limits, and strict PR limits.
    With two Implementers the limits are one coordination and one
    in-progress feature/fix PR per estate"). While the count is full a seat
    prepares its next slice as local commits on an unpublished branch, so
    the work is git-durable, and opens no pull request until a slot is free
    (the reading that forbade local commits left 66 applied lessons
    uncommitted in two working trees for seven hours, 2026-10-02); its
    landing turns and any cure that frees the count come first. This reading
    supersedes, as of 2026-10-02 and with the same dated clause in each, the
    absolute of `worktree-hygiene` §1 (a committed worktree with no pull
    request) and the first-push timing of `no-parallel-long-lived-branches`:
    the first PUSH still opens the draft at once, and the push waits for the
    slot. The owner's word of 2026-09-29,
    relayed verbatim by the Director: "the entire team is supposed to have
    been instructed NOT to create new PRs while waiting for old ones, that is
    how WIP is managed... if you move on while the older work is still pending
    you create an ever growing tail" and "We are aiming for trend to zero open
    PRs". So an ordered "then" means after the earlier pull request lands, a
    seat with an open PR opens its next pull request after that PR merges, and
    a seat holding two opens nothing until both land (the Director's readings
    that day). It recurred with this bullet loaded: a seat PUSHED its next
    branch while its PR waited (2026-09-29), and the consolidation seat cut
    and pushed two branches while its PR was open (2026-10-01); the recurrence
    is the push and the second pull request, never the local commit. The cure
    is a check at the first push, in the frictions register, and not this
    sentence. A pull request held at its door for the owner's reading is a
    review surface, not work in progress: it leaves the estate's one
    in-progress slot free and the next lane opens beside it (the Director's
    ruling of 2026-10-02 under the owner's delegation, on the parity ledger's
    twin pull requests). A guard encodes a reading of a rule and is re-read
    against the current ruling before a seat waits on it.
  - **The owner lands small green pull requests by hand, in changed-file
    order** (owner, 2026-09-26: "I can make judgements that allow me to merge
    small PRs many, many times faster than Practice agents"). Never hold a
    small green PR for the owner; keep a ready list with links, ordered by
    changed-file count, and while the owner is landing hold every sync push
    until the owner says done. The owner weighed the breakage the same day,
    to the Director: "I recognise my rapid merging may have caused issues, but
    I still think that identifying and fixing them will take much, much less
    effort than would have been required to merge those PRs". What a hand
    landing breaks is cured forward, and a red run on the last owner-landed
    tip is the first cure lane (the Director's ruling of that hour).
  - **Review rounds per pull request never go up** (owner, 2026-09-14): after
    round two every remaining finding is dispositioned in the last push's slot
    turn, cured or rejected with its reason, and the pull request settles;
    about eight claims per slice is the size that settles in two rounds.
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

The seat's own review and its pre-merge checks run before the ready declaration and before the door:
Zephyr guards Leeward found that "four correction signals this afternoon shared one generator (own
review and pre-merge checks run after the drive to land)" and that "the cure is to run them before
ready and before the door" (the seat's lesson of 2026-09-21, event a68de270).

The yield in the landing slot is a throughput rule: Altair spins Umbra measured that "the yielding
rule is throughput, not courtesy (two landings inside the window this lane would have held)" (the
seat's reading of 2026-09-10, event 2a55fd9a).

**No merge rests on an authority the pull request's own diff grants.** Where the diff edits
the rule that would permit its merge, the merge waits for the authority the unedited rule
names. And no approval is given without re-reading the open threads first (a decision from a
handoff record).

## Phase 8 — After merge

**Every merge gets its own fleet broadcast, no exceptions** (obligation
recorded 2026-07-2x: a bot merge went unbroadcast for 40 minutes and left a
peer seat disposition-blocked on state it could not see). In a cascade of
merges, post-merge harvest custody is assigned PER PR — name who owns each
merged PR's Phase-8 harvest in the broadcast, and late findings route to
follow-up branches, never to merged ones.

**Merge auto-delete overrides recorded dispositions** (worked instance: a
merge auto-deleted a remote coordination branch despite a "branch lives on"
disposition, leaving the primary tracking a deleted ref). A branch never
survives its PR's merge: work that continues goes on a new branch with its
own PR (a coordination branch's successor is cut at the fold), and no
disposition text binds GitHub's delete-on-merge setting.

**One post-merge harvest before stand-down.** MERGED ends the merge-state
question, not the feedback stream: a bot round composing at merge time still
posts findings on the merged code minutes later. Apply item 4's measured
predicate ONCE after MERGED (one final full harvest once no expected
reviewer has an outstanding request and no live run is observed, any
unavailable run surface named; the owner's credential request registered on
the owner never holds it); route any real finding to a follow-up
branch, never to the merged PR's branch. The owner's settled word from his
own visibility supersedes the read (owner ruling, 2026-07-2x): when he says
it is settled, it is settled.

`worktree-hygiene` §3/§6 owns the cleanup: remove the worktree and delete the
branch (content-verified, owner-authorisation-gated for destructive ops);
update continuity surfaces; close claims.

**A follow-up pointer named at lane close is mirrored into a TRACKED home
before the lane closes** — the owning plan node's dispositions table, or the
thread record the pickup seat reads — and the lane-closed comms event points
at that home rather than carrying the pointer alone. Comms events are
untracked by design and rotate (ADR-199, PDR-094); fourteen pointers from
three lanes (2026-09-04/05) lived only on lane-closed events until the
consolidation of 2026-09-06 recovered them. The Director applies this to its
own closes from 2026-09-06.

**A superseded pull request closes only when every surviving delta has a successor.** Each
change it carried is either in a merged successor or has an evidenced supersession. Matching
commit ids are not the test: a squash merge changes them.

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
