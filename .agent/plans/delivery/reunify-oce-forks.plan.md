---
id: reunify-oce-forks
node_type: delivery
name: Reunify the OCE forks
overview: Merge the Engraph fork's default branch into Oak's main by one merge commit, then return the fork to a plain mirror of Oak.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
  - served-surface
tickets: []
depends_on: []
owner_gates:
  - awaiting: owner-decision
    clears_when: "The owner ends the exploratory status of oaknational#1023, so it is marked ready and merged through the door once clean and green"
    expires: 2026-11-30
  - awaiting: external-input
    clears_when: "An account with access to Oak's SonarCloud project marks the pull request's S4036 by-name sites false positive under the disposition policy's S4036 section"
    expires: 2026-11-30
last_updated: 2026-11-09
---

# Reunify the OCE forks

## Goal

Oak's `main` holds all the work done on the Engraph fork, by one merge commit, and the fork goes
back to being a plain mirror of Oak: one line of development again.

## User groups and value

- **People using Oak's MCP service**: the fork's fixes reach production at Oak's next release.
- **Oak's contributors and agents**: one tree, carrying the fork's tooling, Windows support and
  fixes, with nothing left to reconcile.
- **The owner**: one line to run, with no carriers or syncs.

## Mechanism

- **One merge commit** of `engraph` into Oak's `main`, through one pull request
  (oaknational#1023, branch `reunify-oce-forks`). Oak's `main` is an ancestor of `engraph`, so the
  merge has no conflicts and its tree is `engraph`'s tree; a newer Oak release goes into `engraph`
  first, through the cross-fork integration skill. Merge commits only: no squash, no rebase, and no
  staged slices, which would give the same tree with more CI runs and releases.
- **The head branch lives in Oak's repository**, pushed by Oak's bot, because a pull request from a
  fork gets no secrets and two of Oak's required checks (SonarCloud and Vercel) need them.
- **Oak's checks on the draft are the preparation list.** Fixes land on `engraph` and reach the
  draft by merging `engraph` into its branch.
- **After the merge** the fork's default branch becomes its mirror of Oak's `main`, the carrier
  workflow's variable is unset, and the mirror workflow keeps it current. That workflow stays in the
  tree: scheduled workflows run only from the default branch, and on Oak its job is skipped.
  `engraph` is retired once it is an ancestor of Oak's `main`, and Oak's workflow triggers drop
  their `engraph` entries.

## Acceptance criteria

1. `engraph`'s tip at the switch is an ancestor of Oak's `main`. Proof: `repo-safe`,
   `git merge-base --is-ancestor`, recorded on the pull request.
2. Oak's required checks (CodeQL, SonarCloud Code Analysis, run-quality-gates, Vercel) pass on the
   pull request. Proof: `repo-safe`, the checks.
3. Oak's release after the merge deploys the MCP service and it stays healthy. Proof:
   `owner-held`, the deployment and its error reports, read by a seat at the owner's word and
   recorded in the thread record.
4. The fork's default branch is its mirror, equal to Oak's `main`, with the carrier off. Proof:
   `owner-held`, the fork's settings and variables read through the API by a seat at the owner's
   word and recorded in the thread record.

## Todos

1. One `engraph` pull request clears what Oak's first checks named and re-trues the doctrine:
   - a default case in `refuse-commit-on-main.sh`, the two Critical shell findings;
   - the schema-drift commit status no longer carries upstream text, which removes CodeQL's
     network-to-file finding (the disposition policy fixes rather than dismisses it);
   - the Turbo team leaves `turbo.json` for each checkout's own setting;
   - the three parity-measure scripts close the files they open;
   - the downstream-writes rule and the identity node match the owner's words of 2026-11-02 and
     2026-11-09.
2. Merge `engraph` into `reunify-oce-forks`; Oak's checks run again.
3. Oak's SonarCloud project marks the S4036 by-name sites false positive (30 on the first run), by
   an account with access to it (the second gate).
4. The owner ends the exploratory status (the first gate). The description gains one upgrade note:
   each Oak checkout recreates `.github/merge-bot.json` from `.github/merge-bot.json.example`, and
   Oak's CI reaches the Turbo cache through the `TURBO_TEAM` variable and its OIDC policy, not a
   `TURBO_TOKEN` secret. The door merges it.
5. Watch Oak's release and the deployed service.
6. Return the fork to a mirror, as the mechanism's last item says.

## Out of scope

- Moving `gitleaks` and the smokes' shell to by-name calls: ordinary Oak work after the merge.
- The no-throw remediation the owner deferred until this merge: its own lane afterwards.
- Oak's open pull requests by other authors: they merge `main` in afterwards.
