# Automatic upstream sync for the fork — concept exploration (2026-09-10)

**Trigger.** The owner's word at 09:0xZ: "I would like the engraph fork to make the upstream sync
automatic", with a draft workflow `upstream-sync-watch.yml` (compare this fork's `main` against
upstream's `main` by the REST compare endpoint; open a draft pull request from `oaknational:main`
into this fork's `main` when upstream is ahead; fail when the fork's `main` is ahead or diverged),
and the constraint that followed: "configurable and off by default, so that merging it back to
upstream does not cause any weirdness". Run by the Director seat under the concept-exploration
skill; sizing folded in from the proportionality gate.

## Movement 1 — the raw observations (first-hand, 09:1xZ–09:2xZ)

1. **The mirror holds today.** This fork's `main` and upstream's `main` are identical at
   SHA:6348cb7a2 (release 1.179.1, 2026-09-09 17:14Z). `main` carries no branch rules; the one
   active ruleset targets the default branch only. The default branch is `engraph`; the parent is
   `oaknational/oak-open-curriculum-ecosystem`.
2. **A carrier is due and none exists.** `engraph` against upstream `main` reads diverged:
   upstream 12 ahead (1.179.1 and pull request 970, the MCP-345 advertised-scopes change), the
   fork 610 ahead. No open sync pull request. The last carrier (#99, 1.179.0) landed 2026-09-09
   20:30Z, about 16 hours before this reading.
3. **The producer of the previous carriers is dark.** #90 and #99 were opened under the owner's
   credential by the owner's "OCE upstream sync" maintenance task (a Codex task; body marker
   `engraph-oce-upstream-sync`; a run receipt naming both repository ids, both tips, the
   exclusive counts and the merge base). Its recipe: fast-forward this fork's `main` to upstream
   without force, cut `automation/oce-upstream-sync-<upstream sha>` AT upstream's tip, open a
   draft pull request into `engraph` with the receipt, arm no merge. Codex is out of credit until
   about 2026-09-16 (owner fact, 08:3xZ). The 12 commits sit uncarried because the producer is a
   metered vendor seat.
4. **The draft workflow's scope and shape.** It covers the mirror only (upstream into this fork's
   `main`), never the carrier into `engraph`. It writes by pull request and deliberately grants
   `contents: read` only. It hard-codes both repository names and guards with
   `if: github.repository == 'EngraphCode/open-curriculum-ecosystem'`. It schedules six-hourly on
   weekdays and keeps manual dispatch.
5. **Platform facts, read from the vendor's documentation at 09:2xZ.** "Rebase and merge" on
   GitHub "always updates the committer information and creates new commit SHAs"; no merge
   method fast-forwards a base branch, every one creates commits the head did not carry.
   Scheduled workflows "run on the latest commit on the default branch" and fire "only if the
   workflow file exists on the default branch"; a public repository's scheduled workflows are
   disabled after 60 days without activity. When "Allow GitHub Actions to create and approve pull
   requests" is off, `GITHUB_TOKEN` cannot create a pull request; on this fork it IS off
   (`can_approve_pull_request_reviews: false`, default workflow permissions read). Events made
   with `GITHUB_TOKEN` "will not create a new workflow run"; the documented alternative is "a
   GitHub App installation access token", the app id and private key stored as secrets.
6. **The estate's instruments.** The bot app `el-graphael` exists (app id and slug in the
   per-checkout merge-bot config; its private key at a user-config path on the owner's machine,
   read by `merge-bot mint-token`). The fork holds zero Actions variables and zero secrets. The
   cross-fork-integration skill's step 1 reads a carrier receipt as "evidence at its own time
   only"; "a newer upstream tip queues as the NEXT carrier; a reviewed head is not moved"; "a
   second carrier for the same lineage is a defect". A head that is upstream's release commit runs
   no workflow (the host scans the whole head message for the CI-skip token); the seat's
   slot-word merge of the default branch into the carrier is what gives it a buildable head.
7. **Owner rulings that bind the shape.** Integration is a semantic event (2026-09-09): the
   premise sweep, the generators and the memory reconciliation happen on the carrier by a seat,
   never by a text merge. A #90-class integration merges on the owner's word. Estate identity
   lives below the tree (ratified): repository names and branch names are configuration, not
   tree content. Bot identity always for writes on third-party systems. The fork never writes
   to upstream.

**Inherited assumptions exposed (metacognition).** (a) "Sync" in the draft means the mirror;
"sync" in the estate means the carrier into `engraph` — the mirror is the by-product the receipt
compares against. (b) A pull request read as the least-privilege write: on this platform a pull
request cannot keep a mirror identical, because every merge method mints commits; the mirror
invariant the draft enforces is broken by the draft's own remedy on its first merge. (c) The
guard by hard-coded repository name is identity in the tree, the exact shape the ratified
identity node retired. (d) The fluent extension "automate the integration too" contradicts the
semantic-event ruling. (e) The previous producer was called automatic; it was a metered seat
under the owner's credential, and its outage is the observation that opened this task.

## Movement 2 — the problem, not a solution

**Kind.** An availability gap in a producer: the estate depends on one process to notice upstream
movement and to stage it for integration, and that process is a metered vendor seat.

**Gap.** Upstream movement is not turned into (1) an identical mirror on this fork's `main` and
(2) exactly one draft carrier into `engraph` at upstream's tip with a receipt, within hours, by a
producer that needs neither a vendor's credit nor the owner's hands.

**Who it harms.** The seats, who cannot see upstream movement except by a manual fetch; the
owner, whose attention the manual cut spends; the October merge-back, which grows harder with
every day a carrier waits (divergence compounds; the fork already carries 610 exclusive commits).

**Mechanism.** One producer, vendor-metered, owner-credentialed; credit exhausted; producer dark;
no second producer; no alarm — the gap was noticed by reading the compare endpoint, not by any
signal the estate emits.

**Constraints.** Off by default and configurable, so that the file inherited by upstream at the
merge-back does nothing; identities below the tree; writes as the bot; the fork never writes
upstream; one carrier at a time and a reviewed head never moved; a carrier head at the release
commit runs no CI, by platform design; the schedule fires only from the default branch, so the
file lives on `engraph`.

**Success.** Within one schedule slot of an upstream push: this fork's `main` equals upstream's
`main`; one open draft carrier exists at upstream's tip, bearing the receipt the skill's step 1
reads (or, when a carrier is already open, a notice naming how far upstream has moved past it);
the run fails loud when the fork's `main` is ahead; a copy of the file on any repository where it
is not enabled produces no push, no pull request and no failure; the owner's only act is the
one-time enablement below the tree.

## Movement 3 — the solution space reopened

- **Land the draft as it is.** Fails on three facts: the pull request cannot fast-forward `main`
  (observation 5); `GITHUB_TOKEN` cannot open the pull request on this fork (observation 5); the
  draft stages nothing for `engraph`, which is the need (observation 2).
- **Drop the mirror entirely.** The standing read-only fetch grant serves comparison, so
  `origin/main` is a convenience. It is also the receipt's baseline and the branch the merge-back
  compares against, and a fast-forward push costs one line. Keep it as the by-product, never the
  purpose.
- **Automate the integration as well.** No: steps 3 to 9 of the cross-fork skill are proofs a seat
  makes (the merge at the slot word, the generators, the premise sweep, the ancestry). The
  producer does step 1's fetch, compare and receipt, and the carrier cut. This is the same split
  the OCE task ran, and it preserves the semantic-event ruling.
- **Which instrument.** A GitHub Actions workflow is deterministic and vendor-free; a scheduled
  Claude routine reintroduces a metered vendor; the Codex task is dark. Actions for detection and
  the carrier; seats for the integration.
- **Which credential.** The bot app's installation token, minted in the run by the platform's
  own action from two secrets (app id, private key): it pushes, opens pull requests, triggers
  workflows, and is the estate's standing bot identity. The alternative — enable "Allow GitHub
  Actions to create and approve pull requests" and use `GITHUB_TOKEN` with `contents: write` —
  writes as a different bot, triggers no workflow on what it writes, and changes a repository
  setting that the merge-back would carry as a question. Verdict: the app token; the secrets are
  an owner custody decision (the private key today lives only on the owner's machine).
- **Off by default, configurable.** A job-level condition on a repository variable
  (`vars.UPSTREAM_SYNC_ENABLED == 'true'`); identities read from the repository service at run
  time (`parent.full_name`, both default branches) with variables as overrides; a repository with
  no parent exits zero with "not a fork". Upstream then inherits a file whose every scheduled run
  is a skipped job: visible in its Actions tab, zero minutes, no write. That skipped run is the
  residual weirdness. The only shape with zero runs upstream is dispatch-only in the tree with the
  schedule held in a second repository that dispatches into this one; it costs a repository and
  moves the schedule out of the file's reader's sight. Verdict: accept the skipped runs, name
  them for the owner at the merge-back, and keep the second-repository shape as the fallback if
  upstream objects.
- **The carrier head.** Cut at upstream's tip exactly, as the OCE task did; the seat's slot-word
  merge makes it buildable. The empty-commit shape stays what the skill says it is: the route
  when the release commit must land unchanged.
- **Duplicate guard.** One open pull request into the default branch whose head begins
  `automation/oce-upstream-sync-` means: notice only ("carrier open at X; upstream now N further
  ahead"), never a second carrier, never a moved head. The guard also covers a race with the OCE
  task should it wake with its credit.
- **Fail loud.** Fork `main` ahead or diverged fails the run, as the draft has it; the failure
  reaches the owner through the platform's own notifications, the estate's first upstream-sync
  alarm.

## Movement 4 — synthesis and proposals

**The frame.** The fork's upstream-sync producer must be vendor-free and inert by inheritance. It
produces two things — the mirror and the carrier with its receipt — and seats produce the
integration. The draft's mirror-by-pull-request cannot hold its own invariant, its token cannot
open the pull request here, and its scope stops short of the need; its detection, its failure
semantics, its duplicate guard and its off-by-default intent are right and carry over.

**Proposals** (each with a warrant and a falsifier):

1. **Build `upstream-sync-watch.yml` on `engraph`** as the producer: schedule and dispatch; the
   job gated on `vars.UPSTREAM_SYNC_ENABLED`; identities from the repository service with
   variable overrides; the bot app token from two secrets; steps — compare and write the receipt,
   fast-forward this fork's `main` (a push, `contents: write`, never force), fail on fork-ahead or
   diverged, cut the carrier at upstream's tip and open the draft pull request with the receipt and
   the marker, or notice when a carrier is open. Warrant: observations 3, 5, 6. Falsifier: after
   one enabled run, the fork's `main` differs from upstream, or no carrier exists, or a run on a
   repository with the variable unset writes anything.
2. **Owner items, below the tree:** set the variable on the fork; add the two secrets (the app id
   and the private key — a custody decision, the key leaving the owner's machine for the
   repository's secret store); confirm the app installation holds contents write and pull
   requests write on the fork. Falsifier: the token-minting step fails, or the push to `main` is
   refused.
3. **Prove before scheduling:** one manual dispatch with the variable set, read against the
   success predicate; only then rely on the schedule. Falsifier: the dispatched run's receipt
   disagrees with a first-hand compare.
4. **Re-true the cross-fork skill's step 1** to name the workflow as the carrier's producer and the
   receipt's fields, and retire the OCE task as producer (two producers are the duplicate-carrier
   defect the skill names). Falsifier: a second carrier appears for one upstream tip.
5. **Now, independent of the producer:** a seat cuts the 1.179.1 carrier (the twelve commits)
   under the cross-fork skill — the carrier is due and the workflow is not its blocker. Warrant:
   observation 2. Falsifier: `engraph` reads "identical" against upstream before the lane starts.

**Sizing (proportionality).** One workflow file of about 150 lines, one variable, two secrets, one
skill paragraph; a records line at the merge-back naming the skipped runs. Not an agent-tools
command; not an automated semantic merge; not a second repository unless upstream objects.

**Unresolved evidence that could change the synthesis.**

- Whether a scheduled workflow ADDED to an existing fork is `active` or `disabled_fork` (the
  documentation read names only the 60-day inactivity disablement; the state is read from the
  workflows endpoint after the file lands; dispatch works either way).
- Whether upstream reads six-hourly skipped runs as noise at the merge-back — the owner's call
  then; the fallback shape is named above.
- The app installation's permission set on the fork (contents write is the one the mirror push
  needs; the bot already pushes lane branches, which is the same permission).
- Whether the OCE task resumes with its credit and races the workflow (the guard makes the race
  harmless; the retirement removes it).

## Addendum — the owner's ruling (2026-09-10 12:5xZ, verbatim)

"on the auto sync with the upstream, we need two. One to automatically sync the upstream main
to our fork main, and one to create PRs from our main to our engraph."

**What changes in the synthesis.** Proposal 1's single producer becomes two workflows, each
with one job: the MIRROR (upstream `main` → this fork's `main`, a fast-forward push, failing loud
when the fork's `main` is ahead or diverged) and the CARRIER (this fork's `main` → a draft pull
request into `engraph`, cut at the mirror's tip under the `automation/oce-upstream-sync-<sha>`
name with the receipt, one at a time). The mirror is no longer a by-product; it is the carrier's
input, so the carrier reads the fork's own `main` and never touches upstream at all — which
narrows the carrier's permissions to this repository and makes the mirror the only workflow
that names the parent. Both stay off by default behind repository variables and read their
identities from the repository service. The two delivery nodes `upstream-mirror-workflow` and
`upstream-carrier-workflow` (sketch) carry the shape; the owner decisions in the report (the
bot app's key into the fork's secrets; the enable variables; retiring the Codex OCE task as
producer) are their gates.

## Addendum — proposal 5 discharged (2026-09-10 16:1xZ)

Observations 1 and 2 describe the morning's reading; by the afternoon the mirror had moved to
`216e64c15` (release 1.181.1, 33 non-merge upstream commits, 49 with merges, over four
releases) and the Director cut the
carrier by hand under the cross-fork skill (`sync/upstream-2026-09-10`), discharging proposal 5
at the larger snapshot. Proposals 1 to 4 stand, reshaped by the two-workflow ruling above; the
two delivery nodes now carry decision-complete designs, including one change of shape: the
mirror needs no secret, because a reference update with `force=false` fast-forwards the mirror
by the run's own token and can never mint a commit (the node's decision 5).

