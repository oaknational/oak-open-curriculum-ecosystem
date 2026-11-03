---
id: upstream-mirror-workflow
node_type: delivery
name: "Upstream mirror workflow — the fork's main kept identical to upstream main, automatically"
overview: "A GitHub Actions workflow on the default branch, off by default behind one repository variable, that compares this fork's mirror branch with its parent's default branch and fast-forwards the mirror by a reference update that can never mint a commit, failing loud when the mirror is ahead or diverged."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-09-11
ratified_where: "Owner card answer of 2026-09-11 09:2xZ in the Director session (Nettle guards Pistil, 2de368): \"Ratify both\"; recorded on the seat record §COMPACTION BOUNDARY 5 and the estate-coordination thread record"
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-02
---

# Upstream mirror workflow

## Goal

When upstream moves, this fork's `main` follows within one schedule slot with no seat and no
owner action: `main` is a byte-identical mirror of the parent's default branch, and any state
where the fork's `main` carries a commit upstream lacks is reported as a failure the owner sees.
Until this lands the mirror is kept by hand or by a metered vendor task under the owner's
credential (dark since 2026-09-10 with a credit outage) — see the concept exploration record of
2026-09-10 and the owner's ruling that the producer is two workflows, this one and
`upstream-carrier-workflow`.

The owner's standing rule for the whole line (2026-09-10): upstream history is never rewritten;
every integration is a two-parent merge, so the merge-back to upstream is a fast-forward of
upstream's commits with the fork's commits added on top. The mirror is the first link: it moves
a reference and never creates a commit.

## User groups and value

- **The owner**: the fork's relationship to upstream is observable in the Actions tab and never
  depends on a vendor's credit or on the owner's hands.
- **Seats**: `origin/main` is a trustworthy upstream reference for the cross-fork skill's step 1
  and for comparison, without a per-seat fetch of the parent.
- **The carrier workflow**: reads the fork's own `main`, so it never names or touches upstream.

## Decisions (decision-complete, 2026-09-10)

Every execution-time decision is settled here; the todo authors the file below verbatim and
proves it. Each vendor shape names where it was verified at author time.

| # | Decision | Verdict and warrant |
| --- | --- | --- |
| 1 | Where the file lives | `.github/workflows/upstream-mirror.yml` on the default branch. `schedule` fires only from the default branch (verified: the owner's draft's header note and the exploration record, 2026-09-10). Committing it to `main` would itself put the mirror ahead of upstream. |
| 2 | Off by default | Job-level `if: vars.UPSTREAM_MIRROR_ENABLED == 'true'`. An unset variable evaluates to the empty string, so a copy inherited by upstream at the merge-back runs a skipped job per slot: zero minutes, no write, no notification. The residual is the skipped-run row in upstream's Actions tab, named for the owner at the merge-back; the fallback if upstream objects is a second repository that dispatches into this one (exploration record, Movement 3). |
| 3 | No identity in the tree | No repository, organisation or branch literal at all. The parent and its default branch are read from `GET /repos/{owner}/{repo}` (`fork`, `parent.full_name`, `parent.default_branch`, verified live 2026-09-10 on the fork: `fork=true`, `parent=<the parent>`, `parent_default=main`), and the mirror branch IS the fork's copy of the parent's default branch by construction, so its name is derived from the same record rather than configured (ADR-231's ladder: derive first; `closed-shape-design-optionality`: a variable with no nameable second instance is not a design). A repository with `fork=false` exits zero with a notice. |
| 4 | The compare | `GET /repos/{owner}/{repo}/compare/{mirror}...{parentOwner}:{parentRepo}:{parentBranch}` — the owner's draft's call, verified live 2026-09-10 (`identical`, `ahead_by 0`, `behind_by 0` with the mirror current). Direction convention: `status`, `ahead_by`, `behind_by` are reported from the head side, so `ahead` means the PARENT is ahead and `behind` means the MIRROR is ahead. |
| 5 | The write | `PATCH /repos/{owner}/{repo}/git/refs/heads/{mirror}` with `sha` = the parent's tip and `force=false` ("make sure the update is a fast-forward update", REST docs read 2026-09-10). Not `POST …/merge-upstream`: that endpoint returns `merge_type: merge` and MINTS A MERGE COMMIT when the branches have diverged, which is the one state a mirror must never reach by automation (docs read 2026-09-10; `merge_type` enum `merge, fast-forward, none`). The reference update either fast-forwards to exactly the parent's tip or answers 422, so a race between the compare and the write can never create a commit. |
| 6 | The parent's tip | `GET /repos/{parent}/branches/{parentBranch}` → `.commit.sha`, a public read of the parent. A parent-only commit is writable through the fork's own API, verified by a repo-safe probe on 2026-09-10 (the probe refs deleted after): `POST git/refs` on the fork at a sha present only on the parent answered 201; `PATCH …/git/refs/heads/<probe>` with `force=false` from that sha to a later parent-only sha answered 200 (a genuine fast-forward between two parent-only commits); the same update back to the older sha answered 422 `Update is not a fast forward`. Todo 2's first dispatch is the drift detector for the platform keeping this behaviour. |
| 7 | The token | The run's own `GITHUB_TOKEN` with job `permissions: contents: write`. `main` is unprotected on the fork (verified 2026-09-10: branch protection 404; no ruleset applies to `main`, the one active ruleset targets the default branch), so the token can move it. A reference moved by `GITHUB_TOKEN` triggers no workflow (platform rule, exploration record observation 6), which is the wanted behaviour: the fork's `main` needs no fork-side CI (upstream's CI proved the tip) and the fork's `Release` workflow, which fails on the fork for want of the release app's secrets whenever a non-release tip lands on `main` (run history 2026-08-26), never fires. Consequence: NO secret and no app is needed for the mirror; the owner's only act is the variable. |
| 8 | Failure semantics | `behind` or `diverged` (the mirror carries commits the parent lacks) → `::error` with the compare link and `exit 1`; the run failure is the notification. `identical` → one log line, exit 0. `ahead` → the reference update. The run never pushes on failure. |
| 8a | The parent is public | The two parent reads (the cross-repository compare and `branches/{branch}`) use the run's own token and work because the parent is public; a private parent is outside this mechanism, stated in the file's header for the any-organisation reader. |
| 9 | Schedule and concurrency | `0 0,6,12,18 * * 1-5` (UTC, the owner's draft), `workflow_dispatch` retained, concurrency group `upstream-mirror` with `cancel-in-progress: false`. |
| 10 | Workflow state on the fork | What was verified on 2026-09-10 is that every INHERITED workflow on the fork reads `active` from `GET /repos/{owner}/{repo}/actions/workflows`, so the fork-time disablement of scheduled workflows has been lifted here; the platform documents nothing about a file added to a fork later. Decided handling, not a deferral: todo 2 reads the new workflow's `state` from that endpoint immediately after the file lands, and if it is anything but `active` runs `gh workflow enable upstream-mirror.yml` before the dispatch; either reading is recorded on the thread record as the fact for the carrier workflow to inherit. |
| 11 | Formatting and validators | Prettier formats `.github/workflows/*.yml` (root `format-check:root`); no actionlint in the estate. `validate-check-ci-parity` parses workflow files for the root `check` legs only, so a workflow with no check leg passes it. |

### The file (authored verbatim by todo 1)

```yaml
name: Upstream mirror

# Keeps this repository's mirror branch identical to its parent's default
# branch by moving one reference; it never creates a commit. Off by default:
# the job runs only where the repository variable UPSTREAM_MIRROR_ENABLED is
# the string 'true', so a copy of this file that reaches the parent by a
# merge-back is inert there (a skipped job per slot, zero minutes, no write).
# No repository, organisation or branch is named here: the parent and its
# default branch are read from the API at run time, and the mirror branch is
# by construction this repository's branch of the same name. The parent reads
# use the run's own token, which works because the parent is public.
#
#   identical         — one log line, exit 0.
#   ahead             — the parent is ahead: fast-forward the mirror by a
#                       reference update with force=false (never a merge).
#   behind / diverged — the mirror carries commits the parent lacks: the run
#                       fails; nothing is written.
#
# The compare endpoint reports status, ahead_by and behind_by from the HEAD
# side, so `ahead` means the PARENT is ahead and `behind` means THIS mirror
# is ahead.
#
# A dispatched run's own token is capped at the permissions of the token that
# dispatched it, in addition to the job's own `permissions:` block: a dispatch
# under a token carrying `actions: write` alone ran the compare and then
# failed the reference update with 403 (run 35240876819, 2026-09-17), while
# the same step succeeds on every scheduled run. Dispatch with a token that
# also carries `contents: write` (in this estate, the bot's
# `upstream-mirror-dispatch` scope, named for this act).

on:
  schedule:
    # Every six hours, Monday to Friday, UTC.
    - cron: '0 0,6,12,18 * * 1-5'
  workflow_dispatch:

concurrency:
  group: upstream-mirror
  cancel-in-progress: false

permissions: {}

jobs:
  mirror:
    name: Fast-forward the mirror branch to the parent's default branch
    if: vars.UPSTREAM_MIRROR_ENABLED == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: write
    env:
      GH_TOKEN: ${{ github.token }}
    steps:
      - name: Read the parent and compare the mirror branch with its default branch
        id: compare
        run: |
          set -euo pipefail
          repo="$(gh api "repos/${GITHUB_REPOSITORY}")"
          if [ "$(jq -r '.fork' <<<"$repo")" != "true" ]; then
            echo "::notice title=Not a fork::${GITHUB_REPOSITORY} has no parent; nothing to mirror."
            echo "status=not-a-fork" >>"$GITHUB_OUTPUT"
            exit 0
          fi
          parent="$(jq -r '.parent.full_name' <<<"$repo")"
          parent_branch="$(jq -r '.parent.default_branch' <<<"$repo")"
          # The mirror is this repository's branch of the parent's default name.
          MIRROR_BRANCH="$parent_branch"
          comparison="$(gh api \
            "repos/${GITHUB_REPOSITORY}/compare/${MIRROR_BRANCH}...${parent%%/*}:${parent##*/}:${parent_branch}")"
          status="$(jq -r '.status' <<<"$comparison")"
          parent_tip="$(gh api "repos/${parent}/branches/${parent_branch}" --jq '.commit.sha')"
          {
            echo "status=${status}"
            echo "mirror_branch=${MIRROR_BRANCH}"
            echo "parent=${parent}"
            echo "parent_branch=${parent_branch}"
            echo "parent_tip=${parent_tip}"
            echo "parent_ahead_by=$(jq -r '.ahead_by' <<<"$comparison")"
            echo "mirror_ahead_by=$(jq -r '.behind_by' <<<"$comparison")"
          } >>"$GITHUB_OUTPUT"
          echo "compare ${MIRROR_BRANCH}...${parent}:${parent_branch} => ${status}"

      - name: Fail when the mirror branch carries commits the parent lacks
        if: steps.compare.outputs.status == 'behind' || steps.compare.outputs.status == 'diverged'
        env:
          MIRROR_BRANCH: ${{ steps.compare.outputs.mirror_branch }}
          PARENT: ${{ steps.compare.outputs.parent }}
          PARENT_BRANCH: ${{ steps.compare.outputs.parent_branch }}
          MIRROR_AHEAD_BY: ${{ steps.compare.outputs.mirror_ahead_by }}
        run: |
          set -euo pipefail
          echo "::error title=Mirror branch is ahead of the parent::${MIRROR_AHEAD_BY} commit(s) on ${GITHUB_REPOSITORY}@${MIRROR_BRANCH} are not on ${PARENT}@${PARENT_BRANCH}. The mirror branch follows the parent and carries no work of its own. Compare: https://github.com/${PARENT}/compare/${PARENT_BRANCH}...${GITHUB_REPOSITORY_OWNER}:${GITHUB_REPOSITORY#*/}:${MIRROR_BRANCH}"
          exit 1

      - name: Fast-forward the mirror branch to the parent's tip
        if: steps.compare.outputs.status == 'ahead'
        env:
          MIRROR_BRANCH: ${{ steps.compare.outputs.mirror_branch }}
          PARENT_TIP: ${{ steps.compare.outputs.parent_tip }}
          PARENT_AHEAD_BY: ${{ steps.compare.outputs.parent_ahead_by }}
        run: |
          set -euo pipefail
          # force=false makes the platform refuse anything but a fast-forward,
          # so a commit landing on the mirror between the compare and this
          # update answers 422 and nothing is written.
          moved="$(gh api --method PATCH "repos/${GITHUB_REPOSITORY}/git/refs/heads/${MIRROR_BRANCH}" \
            -f "sha=${PARENT_TIP}" -F force=false --jq '.object.sha')"
          echo "::notice title=Mirror fast-forwarded::${MIRROR_BRANCH} moved to ${moved} (${PARENT_AHEAD_BY} commit(s))."

      - name: Report in sync
        if: steps.compare.outputs.status == 'identical'
        env:
          MIRROR_BRANCH: ${{ steps.compare.outputs.mirror_branch }}
        run: |
          echo "In sync: ${MIRROR_BRANCH} equals the parent's default branch. No action taken."
```

## Acceptance criteria (each with a proof)

1. A dispatched run with the parent ahead leaves the mirror equal to the parent's tip. Proof
   `repo-safe`: the run's notice names the moved sha; the next run's compare step logs
   `identical`; `git ls-remote` of both repositories agrees.
2. A run on a repository without the variable set performs no write. Proof `repo-safe`: the
   job reads "skipped" in the run's summary.
3. A run on a repository with no parent exits zero with the "Not a fork" notice. Proof
   `repo-safe`: the step's output on a dispatch against a non-fork copy, or the step's shell
   run with a stubbed repository record whose `fork` is `false`.
4. A mirror-ahead state fails the run loud and writes nothing. Proof `owner-held`: the owner
   sees the failure notification at the first occurrence; recorded on the thread record.
5. The write can never mint a commit. Proof `repo-safe`: the only write is the reference update
   with `force=false` (decision 5); a reviewer reads the file for any other write.

## Out of scope

The carrier into the default branch (`upstream-carrier-workflow`); any semantic integration;
the retirement of the Codex OCE task (an owner decision named in the exploration record); any
change to the fork's `Release` or `CI` workflows (mirror pushes by the run's token trigger
neither, decision 7).

## Todos

Gate cleared 2026-09-11: `UPSTREAM_MIRROR_ENABLED=true` is set on the fork (by the owner's hand
through the owner's `gh`, since the bot's token scopes carry no variables permission). The
workflow is inert until the file lands.

1. Author `.github/workflows/upstream-mirror.yml` with the file above; format with Prettier;
   land it on the default branch through the ordinary lane (bot identity, legs, front door).
2. After the file lands, read the workflow state (decision 10) and `gh workflow enable` it if it
   is anything but `active`; then one dispatch, read against criterion 1, before relying on the
   schedule. Nothing here waits on the owner: the gate above is already cleared.
3. Re-true the cross-fork skill's step 1 to name this workflow as the mirror's producer, and
   the thread record's continuity line.

## Review dispositions

Assumptions-expert subagent review, 2026-09-10 (verdict at review time NOT YET, with a shortest path of three items; every item applied below, so the node is decision-complete on the review's own terms; read-only, against the platform's documentation
read the same day and the in-tree workflows):

| Finding | Disposition |
| --- | --- |
| Decision 6 stated a write capability verified only by a read | Cured: a repo-safe probe (create at a parent-only sha, `force=false` update to a later parent-only sha → 200, the reverse → 422 "Update is not a fast forward", both probe refs deleted) is now the warrant. |
| Decision 10 over-claimed: only inherited workflows were observed `active` | Cured: the warrant states what was observed; the decided handling (read the state after landing, enable if needed) stands. |
| `UPSTREAM_MIRROR_BRANCH` was a configurable surface with no second instance | Cured: the mirror branch is derived from `parent.default_branch` in the run; the variable is gone from both nodes. |
| The mirror's gate could be a seat act on the 12:5xZ ruling | Held as an owner act: the bot app cannot read or write repository variables (403, 2026-09-10); the gate now names the ruling and the residue. |
| "zero rulesets" contradicted the exploration record | Cured: "no ruleset applies to `main`". |
| The parent reads assume a public parent | Cured: stated in the file's header and as decision 8a. |
| The five load-bearing platform assertions (unset `vars.X`, `GITHUB_TOKEN` triggers no run, `client-id`, skipped job upstream, `-F` booleans) | Confirmed against the documentation read 2026-09-10; no change. |

Authoring-time validation, 2026-09-11 (the successor seat at todo 1, running the ratified text
through a parser before landing it; the defect was in this node's own text, so the cure lands in
the same pull request as the file):

| Finding | Disposition |
| --- | --- |
| The "Report in sync" step's single-line `run:` value is a plain YAML scalar carrying a colon-space (`echo "In sync: ...`), which YAML reads as a second key. The file does not parse, so Actions cannot load the workflow at all and no acceptance criterion could ever be met. | Cured in §The file: a `run: \|` block scalar, the form every other step in both nodes already uses. The shell command is byte-identical and no decision changes. Evidence: `yaml@2.9.0` and Prettier each refuse the pre-cure text at that line and accept the cured text, with `.github/workflows/ci.yml` as a parsing control; the landed file is re-extracted from this fence, so file and node cannot drift. |

Codex review on PR #130, 2026-09-11, carried to the owner rather than actioned (the node is
ratified; this is a choice, not a defect that stops the file running):

| Finding | Disposition |
| --- | --- |
| The enable variable is already `true`, so the first scheduled slot after the file lands can act before todo 2's workflow-state check and controlled first dispatch. The reviewer's shape is to leave the variable false until after landing and the state check, then enable it immediately before the smoke dispatch. | Carried to the owner, with the landing sequenced to make the window moot: the slots are 00/06/12/18 UTC, the lane lands and dispatches inside a slot gap, and both workflows are no-ops today (mirror compare `identical`, carrier `mirror_ahead_by` 0, both exercised read-only on 2026-09-11). Were upstream to move in that window, a fast-forward of the mirror by a `force=false` reference update is the ratified behaviour. The seat cannot flip the variable in either direction: the bot's token scopes carry no variables permission, so every flip is an owner act, and the owner set all four deliberately ahead of the landing. The standing question for the owner is whether an enable variable should sit false until a first dispatch has proven its workflow. |

Landed 2026-09-11 via PR #131 (merge SHA:ad64f3cd5). Facts established at the landing, recorded
here so the next reader does not re-derive them:

- Both workflows read `state: active` from `GET /repos/{owner}/{repo}/actions/workflows`
  immediately after the file landed, so no `gh workflow enable` was needed. That answers the
  mirror node's decision 10 for a workflow added to a fork AFTER the fork was created, which the
  platform documents nowhere: it behaves like an inherited one.
- **Both workflows were dispatched by the BOT and ran green on 2026-09-11.** Mirror run
  34614449174 logged `compare main...oaknational/oak-open-curriculum-ecosystem:main => identical`
  then `In sync: main equals the parent's default branch. No action taken.`; carrier run
  34614457898 logged `compare engraph...main => behind (mirror ahead by 0)` then `Nothing to
  carry: main holds no commit the default branch lacks.` Those are the two lines that carried the
  parse defects cured at authoring time, so the platform loading and running the cured files is
  proven end to end.
- **A correction worth keeping.** The first attempt to dispatch answered 403 `Resource not
  accessible by integration`, and this node briefly recorded the first dispatch as an owner-only
  act on the strength of it. That was wrong. The installation holds `actions: write` (read from
  `GET /orgs/{org}/installations`); the 403 was the CLI's token-scope table having no scope that
  REQUESTS it, and the table's own header says an ungranted permission fails the mint with 422, so
  a 403 is always a wrong-scope symptom. A `workflow-dispatch` scope now exists and the bot
  dispatches under it. Verify a capability against the grant, never against one token's refusal.
- **The dispatched run inherits the dispatching token's ceiling (measured 2026-09-17).** The
  2026-09-11 dispatches proved the workflow loads and runs, but both found the mirror `identical`,
  so no bot-dispatched run had reached the reference update until 2026-09-17. That day the mirror
  was 19 commits behind after the scheduled run at 10:47Z; run 35240876819, dispatched by the bot
  under the `workflow-dispatch` scope as it then was (`actions: write` alone), ran the compare and
  failed the `PATCH git/refs` step with 403 `Resource not accessible by integration`, while every
  scheduled run of the same step succeeds (run 35212280055 moved 57 commits that morning). `main`
  carries no ruleset and no branch protection, and the job declares `contents: write`, so the
  cap came from the dispatch: a dispatched run's own `GITHUB_TOKEN` is limited to the permissions
  the dispatching token carried. Cured in the CLI's scope table, not in this workflow: a scope
  named for this act, `upstream-mirror-dispatch`, carries `actions: write` and `contents: write`
  (the general `workflow-dispatch` scope stays actions-only for the carrier dispatch and job
  re-runs, which write nothing — the security review's split), and run 35241924531, dispatched
  at 15:41:57Z under the lane's first shape (the general scope widened to that same permission
  set, before the review split it), fast-forwarded `main` by 19 commits to the parent's tip.
  Decision 7 stands (the run's own token, so a moved reference triggers no workflow); its
  precondition is now stated in the file's header, which the fence above carries too: whoever
  dispatches must hold what the run writes with.

Review round on PR #131, 2026-09-11. Carried to the owner:

| Finding | Disposition |
| --- | --- |
| The compare on the parent and the `parent_tip` read are separate authenticated requests. A parent move between them leaves a stale `identical`, the fast-forward never fires, and the mirror stays behind until the next slot — which across a Friday evening slot means a weekend, since the schedule is Monday to Friday. (Codex, P2) | Carried, not cured: nothing wrong is written and the next slot self-heals, so the cost is latency rather than correctness, while the fix changes the workflow's read order in text the owner ratified. Recommended shape, verified read-only on 2026-09-11: read `parent_tip` FIRST and compare the mirror against that immutable sha, which the compare endpoint accepts on the head side. One decision settles this and the carrier node's matching row. |

Owner's card answer, 2026-09-11 (Director session, Nettle guards Pistil): "Cure all four in one
lane." The four carried findings (the two-request race in each node, the duplicate-guard
pagination cured 2026-09-20, and the mirror provenance) are one lane. Only the provenance route
(the carrier's parent-check remedy, or a protected mirror branch) waits on the owner.

Pre-commit reviews on the lane `fix/upstream-mirror-dispatch-token-scope`, 2026-09-17 (subagent
reviews commissioned by the integrating seat, Dynamo turns Temper 2a4c8a, before any commit;
recorded here because a subagent transcript is not a destination — owner, 2026-09-17):

| Finding | Disposition |
| --- | --- |
| **security-expert** (verdict: approve with changes). Item 1: one scope now serves three acts (mirror dispatch, carrier dispatch, job re-run) and only the first writes; every carrier dispatch and re-run would hold a push-capable token for an hour. Split: keep `workflow-dispatch: {actions}`; add a scope named for the act that writes. Verified first-hand: runs 35212280055 (schedule, success), 35240876819 (dispatch, failure), 35241924531 (dispatch, success); `main` has no protection and no ruleset; the App is in no bypass list of ruleset 21202096; the mint body is single-repo and exact-set; bot re-runs 34748348080 and 34748348052 on 2026-09-12 prove the third consumer. | Cured: `workflow-dispatch` reverted to `{actions: write}`; new `upstream-mirror-dispatch: {actions: write, contents: write}` carrying the 2026-09-17 provenance; two literal tests. |
| security-expert item 2: `merge-bot.md` "re-running a failed job has not been exercised" is false (the two 2026-09-12 re-runs). | Cured: the paragraph cites both runs. |
| security-expert item 3: the "Setting up a bot" grant list omits Actions: Read & write, so a bot built from it fails every dispatch mint with 422. | Cured: Actions: Read & write added, naming the two scopes that request it. |
| security-expert item 4: "the two sync workflows write through the run's own token" is false for the carrier (App token). | Cured: the mirror writes through the run's own token; the carrier through its App token; the paragraph moved onto the new scope. |
| security-expert hardening (low): a dispatch recipe should end by revoking the token (`DELETE /installation/token`); a ruleset on `main` with `deletion` + `non_fast_forward` only; a validator coupling a dispatchable job's `permissions:` to its scope; the test's "fixed externally by GitHub" over-claims for `contents` (fixed by the mirror job's own block); "whatever the job asks for" reads as replacement, the mechanism is an intersection; the cap claim must not be widened to re-runs (they keep the original run's context; `actions/checkout` ran under `actions` alone). Blast radius of the widened token: single-repo, exact-set, one hour; cannot write `engraph`; can push other branches including force-moving `main`; the fork holds no secrets beyond the carrier App pair. | Carried to the findings ledger (D5) and, for the owner, the mirror-branch ruleset; the test comment names its fixer; "in addition to the job's own `permissions:` block" in the header and docstring; the re-run bound stated in the docstring. |
| **code-expert** (verdict: changes requested, then cleared). Critical: the new `merge-bot.md` paragraph stated a falsehood about re-runs (as above). Important: the 2026-09-11 separation rationale contradicted the row it introduced; "two sync workflows" contradicted the carrier sentence; the node's verbatim fence no longer matched the file while line 232 claims file and node cannot drift; the grant list omits Actions; the test's "both members fixed externally by GitHub" over-claims; the header names fork tooling in a file decision 3 keeps identity-free; "after the 10:47Z scheduled slot" reads oddly against the cron; cite GitHub's documentation of the cap or say the measurement is the warrant; under the split, `workflow-dispatch`'s docstring must say "not for the mirror" or the 403 recurs for the next seat; the measurement paragraph must say run 35241924531 ran under the pre-split widened `workflow-dispatch`. Live verification: the three runs' events and actors match the prose; the fence matched the file byte-for-byte at HEAD. Specialists named: security-expert (commissioned), docs-adr-expert (focused, optional), test-expert (optional); architecture lenses and config-expert not warranted. | All cured: the fence re-spliced from the file (diff empty); the header's scope name marked "in this estate"; "the scheduled run at 10:47Z"; the docstring says GitHub's token documentation, read 2026-09-17, states no such rule and the measurement is the warrant; the "not for the mirror" pointer with the 403 run; the measurement paragraph names the pre-split shape. The optional docs and test passes were not commissioned (freeze at the owner's word, 2026-09-17). |
