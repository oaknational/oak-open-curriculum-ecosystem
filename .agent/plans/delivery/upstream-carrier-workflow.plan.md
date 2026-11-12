---
id: upstream-carrier-workflow
node_type: delivery
name: "Upstream carrier workflow — a draft pull request from the fork's main into the default branch whenever main moves"
overview: "A GitHub Actions workflow on the default branch, off by default behind one repository variable, that opens exactly one draft carrier pull request into the default branch at the mirror branch's tip whenever the mirror carries commits the default branch lacks and no carrier is open, with the receipt the cross-fork skill's step 1 reads; it opens as the bot app so the pull request is a first-class pull request on the platform."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-09-11
ratified_where: "Owner card answer of 2026-09-11 09:2xZ in the Director session (Nettle guards Pistil, 2de368): \"Ratify both\"; recorded on the seat record §COMPACTION BOUNDARY 5 and the estate-coordination thread record"
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: upstream-mirror-workflow
    kind: beneficial
owner_gates: []
last_updated: 2026-10-02
---

# Upstream carrier workflow

## Goal

Upstream movement is staged for integration without a seat noticing it: whenever the fork's
`main` (the mirror) carries commits the default branch lacks, one draft carrier pull request
exists at `main`'s tip carrying the receipt, and seats run the cross-fork skill's semantic
integration on it. The carrier is never merged, moved or duplicated by the workflow. On
2026-09-10 forty-nine upstream commits sat uncarried for a day because the previous producer (a
Codex task) was dark; a seat cut that carrier by hand.

Under the owner's standing rule (2026-09-10: upstream history is never rewritten; the
merge-back is a fast-forward of upstream's commits with the fork's added on top), the carrier
head is upstream's tip exactly, and the seat's integration is a two-parent merge.

## User groups and value

- **Seats**: the carrier arrives with its receipt (repository ids, both tips, exclusive counts,
  the merge base) — the skill's step 1 evidence — instead of a manual fetch and cut.
- **The owner**: the merge-back grows no harder while nobody is watching; every upstream
  release is on the board within a slot.

Minimum shippable shape without the mirror workflow (the `beneficial` dependency): the carrier
reads whatever the mirror branch holds, however it got there — a hand-moved `main` produces a
carrier just the same.

## Decisions (decision-complete, 2026-09-10)

| # | Decision | Verdict and warrant |
| --- | --- | --- |
| 1 | Where the file lives | `.github/workflows/upstream-carrier.yml` on the default branch, for the same `schedule` reason as the mirror. |
| 2 | Off by default | Job-level `if: vars.UPSTREAM_CARRIER_ENABLED == 'true'`. An unset variable evaluates to the empty string, so a copy inherited by upstream at the merge-back runs a skipped job per slot: zero minutes, no write, no notification, the token step never executed. The residual is the skipped-run row in upstream's Actions tab, named for the owner at the merge-back with the mirror's. |
| 3 | No identity in the tree | The default branch from `GET /repos/{owner}/{repo}` (`default_branch`); the mirror branch derived from the same record as `parent.default_branch` (the mirror is by construction the fork's branch of that name; no variable, per the mirror node's decision 3); a repository with `fork=false` exits zero with a notice. The parent's name is read from the same record for the receipt only. The carrier prefix is `automation/upstream-carrier-` and the marker is `<!-- upstream-carrier -->`: neither names an organisation or a product (the previous producer's `engraph-oce-upstream-sync` marker and `automation/oce-upstream-sync-` prefix carried estate identity, ADR-231). |
| 4 | The compare | `GET /repos/{owner}/{repo}/compare/{default}...{mirror}` (both branches of this repository; verified live 2026-09-10: `diverged`, `ahead_by 49`, `behind_by 698` with the default branch 698 ahead and the mirror 49 ahead). A carrier is due when `ahead_by > 0` — status `ahead` or `diverged`; `identical` or `behind` means the mirror is already integrated. The merge base is `.merge_base_commit.sha`; the default tip `.base_commit.sha`; the mirror tip from `GET /repos/{owner}/{repo}/branches/{mirror}` → `.commit.sha`. |
| 5 | The duplicate guard | `GET /repos/{owner}/{repo}/pulls?state=open&base={default}&per_page=100`, every page (`--paginate --slurp`, piped to `jq` because `gh api` refuses `--slurp` beside `--jq`, the filter applied across the flattened pages; amended 2026-09-20), filtered to heads in THIS repository (`.head.repo.full_name == env.GITHUB_REPOSITORY`, read from the runner environment inside the jq program because `gh api` carries no `--arg` flag, so a fork-of-the-fork's branch cannot suppress the carrier) matching `^automation/.*upstream` — which also matches the previous producer's prefix, so a race with the Codex task (should it wake with its credit) is harmless. One match → a `::notice` naming it and how far the mirror has moved since, exit 0; never a second carrier, never a moved head. Amended 2026-09-20: more than one match fails the run by number and writes nothing; one match whose head is behind the mirror's tip is reported in the notice and left for the seat that takes it up (§Amendment below). |
| 6 | The writes | Two, both as the bot app: `POST /repos/{owner}/{repo}/git/refs` with `ref=refs/heads/automation/upstream-carrier-{mirrorTip}` and `sha={mirrorTip}` (docs read 2026-09-10; 201, 422 on a name already taken); then `POST /repos/{owner}/{repo}/pulls` with `title`, `head`, `base`, `body`, `draft=true` (the owner's draft's call). |
| 7 | The token | The bot app's installation token minted in the run by `actions/create-github-app-token` pinned at `1b10c78c7865c340bc4f6099eb2f838309f1e8c3` (v3.1.1; inputs `client-id`, `private-key`; output `token`) — the same action, pin and input shape as the estate's `release.yml`, verified in-tree 2026-09-10. Not `GITHUB_TOKEN`: on the fork "Allow GitHub Actions to create and approve pull requests" is off (exploration record observation 5), and a pull request opened by the app is authored by the estate's bot identity, which the merge tooling already recognises. Secrets: `UPSTREAM_CARRIER_APP_CLIENT_ID`, `UPSTREAM_CARRIER_APP_PRIVATE_KEY` (the owner's gate). The app already holds `contents: write` and `pull-requests: write` on the fork — it pushes lane branches and opens pull requests today. Amended 2026-09-20: the mint also names `permission-contents: write` and `permission-pull-requests: write`, so the run's token holds only what the run writes with. |
| 8 | The head and its checks | The carrier head is the mirror's tip exactly; a release tip carries the CI-skip token, so no check runs on it until the seat's slot-word merge gives it a buildable head (the skill's step 3). The workflow does no merge and requests no review: both belong to the seat's integration round. |
| 9 | The receipt (the body) | Marker line; the parent's full name and the mirror branch at its tip; the default branch at its tip; the merge base; `mirror_ahead_by` and `default_ahead_by`; the workflow run URL; the instruction that the head is upstream's snapshot and the seat's merge lands on top. The title is `chore(upstream): carry the mirror at <sha7> into <default>`. Built with `printf`, never a heredoc (a heredoc inside a YAML block scalar carries the file's indentation into the body). |
| 9a | Failure semantics | Nothing to carry → one log line, exit 0. A carrier open → the notice, exit 0. The ref step is idempotent: `GET git/ref/heads/{branch}` → reuse when it already sits at the mirror's tip (an earlier run's pull-request step failed after the ref was created), `::error` and exit 1 when it sits elsewhere (a hand-moved branch: a human decides), create otherwise. Any API refusal under `set -euo pipefail` fails the run; the failure is the notification, and the next slot retries from the reuse path, so a one-off refusal never wedges the producer. |
| 10 | Schedule and concurrency | `30 0,6,12,18 * * 1-5` — thirty minutes after the mirror's slots, so a mirror move in the same slot is carried in the same slot; `workflow_dispatch` retained; concurrency group `upstream-carrier`, `cancel-in-progress: false`. |
| 11 | Formatting and validators | As the mirror: Prettier formats the file; `validate-check-ci-parity` is unaffected. |

### The file (authored verbatim by todo 1)

```yaml
name: Upstream carrier

# Opens one draft carrier pull request into this repository's default branch
# at the mirror branch's tip whenever the mirror carries commits the default
# branch lacks and no carrier is open. It never merges, moves or duplicates a
# carrier: the integration is a seat's work on the carrier, and so is replacing
# a carrier the mirror has moved past (the cross-fork skill's step 1: the seat
# taking it up closes it on its record and dispatches this workflow). This
# workflow closes and deletes nothing, so it can never act on a carrier a seat
# is taking up. Off by default:
# the job runs only where the repository variable UPSTREAM_CARRIER_ENABLED is
# the string 'true', so a copy inherited by the parent at a merge-back is
# inert there. No repository, organisation or branch is named here: the
# default branch and the mirror branch (this repository's branch of the
# parent's default name) are read from the API at run time.
#
# The compare reports from the HEAD side (the mirror): `ahead` or `diverged`
# with ahead_by > 0 means the mirror carries commits the default branch lacks.

on:
  schedule:
    # Thirty minutes after the mirror workflow's slots, UTC, Monday to Friday.
    - cron: '30 0,6,12,18 * * 1-5'
  workflow_dispatch:

concurrency:
  group: upstream-carrier
  cancel-in-progress: false

permissions: {}

jobs:
  carrier:
    name: Open one draft carrier from the mirror branch into the default branch
    if: vars.UPSTREAM_CARRIER_ENABLED == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    env:
      CARRIER_PREFIX: automation/upstream-carrier-
      CARRIER_MARKER: '<!-- upstream-carrier -->'
    steps:
      # The bot app's installation token: the run's own token cannot open a
      # pull request here, and a pull request opened by the app is authored
      # by the estate's bot identity.
      - name: Mint the bot app token
        id: app-token
        uses: actions/create-github-app-token@1b10c78c7865c340bc4f6099eb2f838309f1e8c3 # v3.1.1
        with:
          client-id: ${{ secrets.UPSTREAM_CARRIER_APP_CLIENT_ID }}
          private-key: ${{ secrets.UPSTREAM_CARRIER_APP_PRIVATE_KEY }}
          # Only what this run writes with: a reference (contents) and a pull
          # request with its comment (pull-requests). The installation may hold
          # more; the token does not.
          permission-contents: write
          permission-pull-requests: write

      - name: Compare the default branch with the mirror branch
        id: compare
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
        run: |
          set -euo pipefail
          repo="$(gh api "repos/${GITHUB_REPOSITORY}")"
          if [ "$(jq -r '.fork' <<<"$repo")" != "true" ]; then
            echo "::notice title=Not a fork::${GITHUB_REPOSITORY} has no parent; nothing to carry."
            echo "mirror_ahead_by=0" >>"$GITHUB_OUTPUT"
            exit 0
          fi
          default_branch="$(jq -r '.default_branch' <<<"$repo")"
          parent="$(jq -r '.parent.full_name' <<<"$repo")"
          # The mirror is this repository's branch of the parent's default name.
          MIRROR_BRANCH="$(jq -r '.parent.default_branch' <<<"$repo")"
          comparison="$(gh api "repos/${GITHUB_REPOSITORY}/compare/${default_branch}...${MIRROR_BRANCH}")"
          mirror_tip="$(gh api "repos/${GITHUB_REPOSITORY}/branches/${MIRROR_BRANCH}" --jq '.commit.sha')"
          {
            echo "default_branch=${default_branch}"
            echo "mirror_branch=${MIRROR_BRANCH}"
            echo "parent=${parent}"
            echo "status=$(jq -r '.status' <<<"$comparison")"
            echo "mirror_ahead_by=$(jq -r '.ahead_by' <<<"$comparison")"
            echo "default_ahead_by=$(jq -r '.behind_by' <<<"$comparison")"
            echo "merge_base=$(jq -r '.merge_base_commit.sha' <<<"$comparison")"
            echo "default_tip=$(jq -r '.base_commit.sha' <<<"$comparison")"
            echo "mirror_tip=${mirror_tip}"
          } >>"$GITHUB_OUTPUT"
          echo "compare ${default_branch}...${MIRROR_BRANCH} => $(jq -r '.status' <<<"$comparison") (mirror ahead by $(jq -r '.ahead_by' <<<"$comparison"))"

      - name: Report when the mirror is already integrated
        if: steps.compare.outputs.mirror_ahead_by == '0'
        env:
          MIRROR_BRANCH: ${{ steps.compare.outputs.mirror_branch }}
        run: |
          echo "Nothing to carry: ${MIRROR_BRANCH} holds no commit the default branch lacks."

      - name: Find an open carrier
        id: existing
        if: steps.compare.outputs.mirror_ahead_by != '0'
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
          DEFAULT_BRANCH: ${{ steps.compare.outputs.default_branch }}
          MIRROR_AHEAD_BY: ${{ steps.compare.outputs.mirror_ahead_by }}
          MIRROR_TIP: ${{ steps.compare.outputs.mirror_tip }}
        run: |
          set -euo pipefail
          # Every page: --paginate alone would run a --jq program once per page,
          # and gh refuses --slurp beside --jq, so the pages are gathered into one
          # array and the filter runs in jq over them flat.
          carriers="$(gh api --paginate --slurp "repos/${GITHUB_REPOSITORY}/pulls?state=open&base=${DEFAULT_BRANCH}&per_page=100" \
            | jq '[.[][] | select(.head.repo.full_name == env.GITHUB_REPOSITORY and (.head.ref | test("^automation/.*upstream"))) | {number, head_sha: .head.sha}]')"
          count="$(jq 'length' <<<"$carriers")"
          if [ "$count" = "0" ]; then
            echo "number=" >>"$GITHUB_OUTPUT"
            exit 0
          fi
          if [ "$count" != "1" ]; then
            echo "::error title=More than one open carrier::$(jq -r '[.[].number] | map("#" + tostring) | join(", ")' <<<"$carriers") are all open carriers; the skill calls a second carrier a defect to close on the record. Nothing is written."
            exit 1
          fi
          number="$(jq -r '.[0].number' <<<"$carriers")"
          head_sha="$(jq -r '.[0].head_sha' <<<"$carriers")"
          echo "number=${number}" >>"$GITHUB_OUTPUT"
          # Reported, never acted on, and never judged: a head that differs
          # from the mirror's tip is a stale unworked carrier or a seat's own
          # commits, and only the seat reading the carrier can tell which.
          if [ "$head_sha" = "$MIRROR_TIP" ]; then
            echo "::notice title=Carrier already open::PR #${number} is the open carrier at the mirror's tip ${MIRROR_TIP:0:7}; the mirror is ${MIRROR_AHEAD_BY} commit(s) ahead of the default branch."
          else
            echo "::notice title=Carrier already open::PR #${number} is the open carrier with head ${head_sha:0:7}; the mirror's tip is now ${MIRROR_TIP:0:7}, ${MIRROR_AHEAD_BY} commit(s) ahead of the default branch. This workflow leaves it either way: a seat's commits move the head too, and only an unworked carrier is ever replaced, by the seat that takes it up (cross-fork skill, step 1)."
          fi

      - name: Cut the carrier branch and open the draft pull request
        if: >-
          steps.compare.outputs.mirror_ahead_by != '0'
          && steps.existing.outputs.number == ''
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
          DEFAULT_BRANCH: ${{ steps.compare.outputs.default_branch }}
          MIRROR_BRANCH: ${{ steps.compare.outputs.mirror_branch }}
          DEFAULT_TIP: ${{ steps.compare.outputs.default_tip }}
          MIRROR_TIP: ${{ steps.compare.outputs.mirror_tip }}
          MERGE_BASE: ${{ steps.compare.outputs.merge_base }}
          MIRROR_AHEAD_BY: ${{ steps.compare.outputs.mirror_ahead_by }}
          DEFAULT_AHEAD_BY: ${{ steps.compare.outputs.default_ahead_by }}
          PARENT: ${{ steps.compare.outputs.parent }}
        run: |
          set -euo pipefail
          branch="${CARRIER_PREFIX}${MIRROR_TIP}"
          # Idempotent: a branch left by an earlier run whose pull-request step
          # failed is reused, so the workflow self-heals instead of answering
          # 422 on the same name at every later slot.
          if existing_sha="$(gh api "repos/${GITHUB_REPOSITORY}/git/ref/heads/${branch}" --jq '.object.sha' 2>/dev/null)"; then
            if [ "$existing_sha" != "$MIRROR_TIP" ]; then
              echo "::error title=Carrier branch at the wrong commit::${branch} exists at ${existing_sha}, not ${MIRROR_TIP}. Delete or move it by hand; this run writes nothing."
              exit 1
            fi
            echo "Reusing ${branch} at ${MIRROR_TIP}."
          else
            gh api --method POST "repos/${GITHUB_REPOSITORY}/git/refs" \
              -f "ref=refs/heads/${branch}" -f "sha=${MIRROR_TIP}" --jq '.ref'
          fi

          body="$(printf '%s\n' \
            "${CARRIER_MARKER}" \
            "" \
            "## Receipt" \
            "" \
            "- Parent: ${PARENT}" \
            "- Mirror: \`${MIRROR_BRANCH}\` at \`${MIRROR_TIP}\`" \
            "- Default branch: \`${DEFAULT_BRANCH}\` at \`${DEFAULT_TIP}\`" \
            "- Merge base: \`${MERGE_BASE}\`" \
            "- Exclusive counts: mirror ahead by ${MIRROR_AHEAD_BY}, default branch ahead by ${DEFAULT_AHEAD_BY}" \
            "- Producer: ${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}" \
            "" \
            "The head is the mirror's tip exactly, upstream's snapshot. A seat integrates it under the" \
            "cross-fork-integration skill: a two-parent merge of the default branch into this branch at" \
            "the slot word, the generated surfaces regenerated, the premise sweep recorded here, then the" \
            "review round and the front door. Merge by merge commit only; never squash or rebase, so the" \
            "snapshot stays in the default branch's ancestry. At pickup, read the mirror's tip: where it has" \
            "moved past this head and no seat has worked this carrier, the seat replaces it by the skill's" \
            "step 1. This workflow opens the carrier and does nothing else: it never merges, moves," \
            "closes or duplicates it.")"

          number="$(gh api --method POST "repos/${GITHUB_REPOSITORY}/pulls" \
            -f "title=chore(upstream): carry the mirror at ${MIRROR_TIP:0:7} into ${DEFAULT_BRANCH}" \
            -f "head=${branch}" -f "base=${DEFAULT_BRANCH}" -f "body=${body}" -F draft=true --jq '.number')"
          echo "::notice title=Draft carrier opened::PR #${number} at ${branch} (mirror ahead by ${MIRROR_AHEAD_BY})."
```

## Acceptance criteria (each with a proof)

1. With the mirror ahead and no carrier open, one dispatched run opens exactly one draft at the
   mirror's tip with the receipt. Proof `repo-safe`: `gh pr list --head automation/upstream-carrier-<sha>`
   returns one draft; its body carries every receipt field of decision 9; its author is the bot.
2. With a carrier open, a run opens nothing, closes nothing, and posts the notice, which names
   the mirror's tip where the carrier's head is behind it (amended 2026-09-20). Proof
   `repo-safe`: the run log and the unchanged open set.
3. A run with the variable unset performs nothing. Proof `repo-safe`: the job skipped.
4. A run with nothing to carry (`mirror_ahead_by` 0) writes nothing. Proof `repo-safe`: the
   "Nothing to carry" line and no ref created.
5. The Codex OCE task and this workflow never both produce a carrier for one tip. Proof
   DISCHARGED 2026-09-11: the owner retired the task ahead of this workflow landing (card
   answer, "I have already retired the Codex task"), so no interval exists in which two
   producers are live and this workflow is the only producer from its first run. The guard's
   prefix match, which also matches the retired producer's prefix, is now belt and braces
   rather than the interval's cover.

6. With the mirror ahead and more than one carrier open, a run fails naming each and writes
   nothing (added 2026-09-20). With nothing to carry the guard does not run, as no step after
   the compare does: duplicates then block nothing, and the next due run names them. Proof `repo-safe`: the run log; unexercised until the state next occurs, since
   no workflow test harness exists.

### Amendment 2026-09-20 — a stale carrier is replaced by the seat that takes it up

The carrier at release 1.181.4 sat open through four more upstream releases and was replaced by
hand 76 commits later (2026-09-17). Automating that replacement inside this workflow was built,
reviewed twice, and withdrawn at the owner's word (2026-09-20, card answer "Seat supersedes at
pickup"). The warrant: replacing a carrier writes two platform resources, the branch reference
and the pull request's state, and the platform offers no transaction over both; a seat taking
the carrier up writes the same two. Each ordering of the workflow's writes (comment, close,
delete; then leased delete, close, comment) left an interleaving in which a seat's first push
landed on a pull request the run then closed, and each cure shrank the interval without
removing it, which `principles.md` §No timing dependence names as the defect. The cure is the
one that principle prescribes: remove the second writer. This workflow closes and deletes
nothing, so it can never act on a carrier a seat is taking up; the seat that takes up a stale,
unworked carrier replaces it under the cross-fork skill's step 1, holding the claim on the
carrier branch pattern, so exactly one actor writes. The cost accepted: a stale draft can sit
on the board until a seat wants it, and the run's notice says how far the mirror has moved.

Two hardenings from the same reviews stand on their own and landed with this amendment. The
token mint names `permission-contents: write` and `permission-pull-requests: write`, so the run
holds what it writes with and nothing else the installation may hold (decision 7). More than
one open carrier fails the run by number, where the guard's `.[0]` used to pick the newest
silently (decision 5, criterion 6).

## Out of scope

The semantic integration (steps 3–9 of the cross-fork skill are a seat's); merging anything;
requesting reviews; the mirror itself.

## Todos

Gate cleared 2026-09-11: `UPSTREAM_CARRIER_APP_CLIENT_ID` (the app's public client id) and
`UPSTREAM_CARRIER_APP_PRIVATE_KEY` are in the fork's Actions secrets and `UPSTREAM_CARRIER_ENABLED=true`
is set, all through the owner's `gh` at the owner's word (the bot's token scopes carry no secrets
or variables permission). The workflow is inert until the file lands.

1. Author `.github/workflows/upstream-carrier.yml` with the file above; format with Prettier;
   land it on the default branch through the ordinary lane.
2. After the file lands, read the workflow state as the mirror node's todo 2 does, then one
   dispatch against the live board (criteria 1, 2 and 4 as the board allows). Nothing here waits
   on the owner: the gate above is already cleared.
3. Re-true the cross-fork skill's step 1 (the carrier's producer, the new prefix and marker, the
   receipt's fields) and the pr-lifecycle references to the previous producer's marker.

## Review dispositions

Assumptions-expert subagent review, 2026-09-10 (verdict at review time NOT YET, with a shortest path of three items; every item applied below, so the node is decision-complete on the review's own terms; read-only):

| Finding | Disposition |
| --- | --- |
| No failure-semantics decision; the ref/pull-request pair was not idempotent (an orphan branch would wedge every later run at that tip) | Cured: decision 9a and the reuse-or-create ref step; a branch at the wrong commit fails loud for a human. |
| An expression interpolated into a `run:` string in the "Find an open carrier" step | Cured: moved to that step's `env:` (the estate's own convention; CodeQL's remedy shape). |
| `UPSTREAM_MIRROR_BRANCH` with no second instance | Cured: derived from `parent.default_branch`; a non-fork exits zero with a notice. |
| The duplicate guard matched `head.ref` only, so a fork-of-the-fork's branch name could suppress the carrier | Cured: the guard also requires `.head.repo.full_name == $repo`. |
| Decision 2 said less than the mirror's about the merge-back residual | Cured: the same sentence. |
| The gate (the private key's custody) | Confirmed legitimate; unchanged. |

Authoring-time validation, 2026-09-11 (the successor seat at todo 1, as for the mirror node):

| Finding | Disposition |
| --- | --- |
| The "Report when the mirror is already integrated" step's single-line `run:` value is a plain YAML scalar carrying a colon-space (`echo "Nothing to carry: ...`). The file does not parse. | Cured in §The file: a `run: \|` block scalar, matching every other step. The shell command is byte-identical. Same evidence as the mirror node's row. |
| The "Find an open carrier" step passes `--arg repo` to `gh api`. `--arg` is a jq flag and `gh api` has no such flag, so under `set -euo pipefail` the step fails and no carrier is ever opened. The flag entered with the disposition above that added the `.head.repo.full_name` guard. | Cured in §The file and decision 5: the repository is read inside the jq program as `env.GITHUB_REPOSITORY` (then a `--jq` program; since 2026-09-20 a piped `jq`, see the pagination row), which the runner always sets. The guard is preserved exactly. Evidence: `gh` 2.97.0 answers `unknown flag: --arg`; the cured call was run read-only against this fork and returned empty, with a control query proving the repository filter matches this fork's one open head and the `^automation/.*upstream` test correctly excludes it. |

Codex review on PR #130, 2026-09-11, carried to the owner rather than actioned:

| Finding | Disposition |
| --- | --- |
| The duplicate guard requests `per_page=100` without `--paginate`, so on a repository with more than one hundred open pull requests targeting the default branch an open carrier outside the first page is invisible and the run opens a second one, against decision 5's promise of exactly one carrier. Unreachable on this repository (a handful of open pull requests); reachable in the deployment context this node designs for, since the file is written to be inherited by the parent at the merge-back. | Carried to the owner with a recommended shape rather than cured, because the node is ratified and this is a design choice, not a transcription defect with one correct form. The shape: `--paginate --slurp` with the filter applied across the flattened pages, since `--paginate` alone applies the `--jq` program per page and would emit one result per page. Cured 2026-09-20 in the shape recommended, as item 8 of section D in the 1.185.0 integration's findings ledger, in the lane order the owner set that day: `--paginate --slurp` piped to `jq` (the vendor refuses `--slurp` beside `--jq`, measured 2026-09-20 on gh 2.97.0), the filter over `.[][]`. |
| The same step's `--arg` flag | Cured at authoring time; see the row above. Codex reached this defect independently of the seat's own parser pass, on the same day. |

Review round on PR #131, 2026-09-11, at the workflow files' landing. Both configured reviewers
bound the tip. Cured: nothing in the file — see the authoring-time table above for the three
defects cured before the first push. Carried to the owner:

| Finding | Disposition |
| --- | --- |
| The comparison and the mirror tip are two separate authenticated requests, so a mirror move between them yields a carrier cut at the new tip whose receipt (merge base, exclusive counts) describes the old one. The mirror and carrier workflows hold separate concurrency groups, so a delayed or manual run can interleave. (Codex, P2) | Carried, not cured: the receipt is wrong only in a race whose window is the gap between two calls seconds apart, and the fix changes which commit the carrier is cut at, which is a behaviour change on ratified text. Recommended shape, verified read-only on 2026-09-11: read `mirror_tip` FIRST, then compare `{default}...{mirror_tip}` — the compare endpoint accepts an immutable sha on the head side (proven against this repository), so both reads describe one snapshot and the second call disappears. There is no field on the compare response that carries the head tip: `commits` is paginated and capped, so `.commits[-1]` is not it. |
| The duplicate guard reads one page of one hundred open pull requests. (Copilot at this tip, and Codex on PR #130 — two independent reviewers, which is why this row now names both) | Carried, not cured, with the recommended shape `--paginate --slurp` and the filter applied across the flattened pages, since `--paginate` alone applies the `--jq` program per page and emits one result per page. Cured 2026-09-20: see the row on the same finding in the table above headed "Codex review on PR #130, 2026-09-11" (piped to `jq`, because gh refuses `--slurp` beside `--jq`), and decision 5. |

Owner's card answer, 2026-09-11 (Director session, Nettle guards Pistil): "Cure all four in one
lane." The four carried findings (the two-request race in each node, the duplicate-guard
pagination cured 2026-09-20, and the mirror provenance) are one lane. Only the provenance route
(the carrier's parent-check remedy, or a protected mirror branch) waits on the owner.

The two findings compound: a carrier opened in either failure mode is a draft a seat reads before
integrating, so neither can merge anything by itself. That bounds the cost of carrying them to
the owner rather than diverging further from the ratified text in one landing.

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

Second review round on PR #131, 2026-09-11. Carried to the owner:

| Finding | Disposition |
| --- | --- |
| The carrier never checks the mirror against the parent. A commit on the mirror that did not come from upstream still counts toward `mirror_ahead_by`, so the carrier is cut at it and the receipt calls it "upstream's snapshot" — a false statement in the artefact the integrating seat trusts. (Copilot; the reviewer called it mandatory) | Carried, not cured, and the strongest finding this lane carried. Bounded by two facts: the mirror workflow's only write is a `force=false` fast-forward to the parent's tip, so it cannot itself create the condition, and when the condition exists the mirror workflow already fails loud with the compare link, so the estate detects it. What is missing is a gate on the carrier, not the detection. Recommended shape, the reviewer's own: compare the mirror with the parent before comparing it with the default branch, and fail unless the mirror is identical to or behind the parent, an older valid snapshot being acceptable. |

Pre-commit reviews on the lane `fix/upstream-carrier-supersede-unworked-stale`, 2026-09-17
(subagent reviews commissioned by the integrating seat, Dynamo turns Temper 2a4c8a, before any
commit; recorded here because a subagent transcript is not a destination — owner, 2026-09-17):

| Finding | Disposition |
| --- | --- |
| **security-expert** (verdict: approve with changes). Item 1: the deletion's safety proof was a naming convention (`head_sha == ${head_ref##*-}`), not a history check — a write-collaborator's draft on a sha-suffixed `automation/…upstream…` branch, or a hand-rewound mirror, would be closed and deleted; `HEAD_REF` entered the DELETE URL unencoded (`#`/`%` in a ref name). Loss bounded by `refs/pull/<n>/head`, but the proof must be mechanical. Recommended three guards: the exact `${CARRIER_PREFIX}${HEAD_SHA}` name; the compare `head...mirror` reading `ahead` with `behind_by` 0 else error; the PR author equal to `${{ steps.app-token.outputs.app-slug }}[bot]` (the pinned action exposes `app-slug`; verified in its `action.yml`). | Cured: `unmoved` computed as the exact-name equality in the `existing` step and tested in the `if:`; the author test in the `if:` via `format('{0}[bot]', app-slug)`; the ancestry check before any write with `::error` and exit 1 on anything but `ahead 0`. `app-slug` confirmed declared at the pinned sha (read 2026-09-17). |
| security-expert item 2: read-then-act with no precondition — a seat that labels, undrafts or pushes between the read and the close/delete is closed and deleted under (`principles.md` §No timing dependence). Fix: lease the deletion with `git push --force-with-lease=<ref>:<sha>` over HTTPS with the token in a header, keep comment → close → leased delete, and re-read draft/labels/head immediately before the close. | Cured: a pre-close re-read of state, draft, head sha and label that aborts with `::error` on any difference; the branch deleted by `git push --force-with-lease` from a temporary repository with the token in an `AUTHORIZATION` header, never the URL. |
| security-expert item 3: the skill's step 1 had no label step, so a seat working locally between step 1 and its first push was unprotected. | Cured: the sentence landed in step 1 in this lane (the fold's only edit to that file is its round-tally paragraph). |
| security-expert hardening (low): no `permission-*` inputs on the token mint, so the run held the App's full installation set; `.[0]` inspects only the newest match, so a second open carrier would survive a supersession; the label is a courtesy signal (a repository-level label deletion clears it silently) — the author and head-sha tests are load-bearing. Verification: outsider input excluded server-side plus the head-repo equality (a null head repo also excluded); all PR-derived values enter via `env:`; the App is in no bypass list and the default branch has an active `deletion` rule; every write is under the bot token; failure order bounded (comment-fail → nothing; close-fail → duplicate comment next slot; delete-fail → a new carrier is cut and the stale branch persists as an orphan nothing sweeps); the cut step has no `if: always()`. Closing verdict: approve with the three guards, the leased delete with pre-close re-read, and the skill sentence. | Cured: `permission-contents: write` and `permission-pull-requests: write` on the mint; more than one open carrier fails the run loudly by name; the label's courtesy status is stated in this node's amendment. |
| **code-expert** (verdict: changes requested, then cleared on the shell; records owed). Shell and expressions verified: `.[0] // empty` precedence; `${head_ref##*-}` on a 40-hex sha and its safe failure on the retired producer's names; the folded `if:` scalars; single-line outputs; the exact-match label test; cut-step idempotency after a same-run supersession; the comment POST needs `issues: write`, which the installation holds. Important: the receipt still told the seat "does nothing else"; the skill's step 1 lacked the protocol; decisions 5, 6 (its row "The writes", which said two and is now five) and the frontmatter overview ("no carrier is open") read the old contract; decision 9a's self-heal ladder and the accepted orphan ref; the `name_sha` derivation should be an exact-shape `unmoved` output; an emitted `author` output went unconsumed. Evidence: no workflow test harness exists; today's board makes the first run after landing a no-op (#154 labelled, head == mirror tip), so criterion 6's proof is owed at the next unworked-carrier release. Suggestions: `any(.labels[]; …)` reads as intended; the two-open-carriers gap; "(evaluating whether it is unworked)" on the notice. | Cured: the receipt carries the label rule; step 1 carries it; decision 5 annotated; `unmoved` replaces `name_sha`; `author` consumed in the `if:`; the notice reads "(evaluating…)"; two open carriers now fail loudly. The design these cures served was withdrawn on 2026-09-20 (rows below); the token inputs and the two-carriers failure are what stands. |

Review rounds on the lane's pull request, 2026-09-19 to 2026-09-20:

| Finding | Disposition |
| --- | --- |
| Round one, **Codex (P1) and Copilot, same finding**: a seat that labels, undrafts or pushes after the pre-close re-read is still closed, and a push then fails the delete after the close, leaving the seat's work on a closed pull request. | True at source. First cure (one settlement push): the leased delete made the first write. Superseded by round two. |
| Round one, **Copilot**: the author test in the step's `if:` skipped an unworked carrier by another author silently, against the description's "fails loudly". | True at source. Cured in the same push by moving the proof into the shell; moot once the step was removed. |
| Round two, **Codex (P1) and Copilot, same finding**: a lease holds the reference's old value at the instant of deletion and reserves nothing afterwards, so a seat's ordinary first push recreates the branch between the delete and the close, and the run closes the pull request over it. | True at source, and the second cure of one mechanism: the step-back fired. No ordering of two writes to two resources is atomic. Put to the owner with a verdict; the owner chose the seat-at-pickup shape. The supersede step, the pickup label and their prose were removed (second and last settlement push). |
| Round two, **Copilot**: the supersession comment said the run deleted the branch even on the recovery path where it had skipped the delete. | True at source; moot, the comment no longer exists. |
| Round three, **Codex (P1)**: the seat's replacement procedure in the skill dispatched the mirror and then the carrier with no wait, so the carrier run could read the old mirror tip. | True at source. Cured: the seat waits for the mirror run's success and re-reads the tip before dispatching the carrier. |
| Round four, **Copilot and Codex (P2), two findings on one ordering defect**: the procedure closed the stale carrier before updating the mirror, so a scheduled carrier run in the gap could open a carrier at the old tip (Copilot), and a failed mirror run left nothing to take up (Codex). | True at source. Cured by order, resting on a property of the workflow (it opens nothing while any carrier is open): the mirror first, then the close, then the dispatch; a carrier a scheduled run opened first is accepted. |
| Round five, **Codex (P2), two**: the multiple-carrier guard is skipped when nothing is due, against criterion 6's unconditional wording; and the notice told operators a carrier whose head differs from the mirror's tip "is replaced", though a seat's own commits move the head too. | Both true at source. Criterion 6 narrowed to what the workflow does, with why (nothing after the compare runs when nothing is due, and duplicates then block nothing). The notice made neutral: it reports both shas, says a seat's commits also move the head, and that only an unworked carrier is ever replaced. |
| Round six, **Copilot**: the procedure's test for an unworked carrier did not read the pull request's author, so another author's draft on the carrier pattern could be closed under the bot credential. | True at source. Cured: only a carrier the workflow's bot app opened is replaceable; any other author's is raised to the owner. Pushed under a settlement budget the owner raised for that one push after the review-cost gate refused it. |
| Routed, not built: a seat's first carrier push leased on the sha in the branch name would give a two-sided compare-and-swap on the one reference (Copilot, round two). | Not needed under the adopted shape, where no automation deletes a carrier branch. Recorded so the idea is findable if automated replacement is ever reopened. |
