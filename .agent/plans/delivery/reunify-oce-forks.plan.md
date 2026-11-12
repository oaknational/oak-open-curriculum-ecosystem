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
    clears_when: "The owner ends the exploratory status of oaknational#1023, so it is marked ready; the owner alone executes the merge (owner, 2026-11-11), never a seat, the door or any automation"
    expires: 2026-11-30
  - awaiting: external-input
    clears_when: "The Ignore Issues on Multiple Criteria entry (typescript:S4036 on agent-tools/**/*, the disposition policy's second exception; saved by the owner on both SonarCloud projects 2026-11-11) is in place and the next analysis of the pull request raises no S4036 issue"
    expires: 2026-11-30
last_updated: 2026-11-12
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
3. The S4036 criterion for `agent-tools/`, which covers all 30 sites of the first run, is saved on
   both SonarCloud projects (the owner, 2026-11-11), and a push to `reunify-oce-forks` re-runs the
   analysis (the second gate).
4. The owner ends the exploratory status (the first gate). The description gains one upgrade note:
   each Oak checkout recreates `.github/merge-bot.json` from `.github/merge-bot.json.example`, and
   Oak's CI reaches the Turbo cache through the `TURBO_TEAM` variable and its OIDC policy, not a
   `TURBO_TOKEN` secret. The seat reports it ready; the owner alone executes the merge (owner,
   2026-11-11), never a seat, the door or any automation.
5. Watch Oak's release and the deployed service.
6. Return the fork to a mirror, in this order. Each step is the owner's or a seat's at the owner's
   word; the fork's settings were read through the API on 2026-11-12.
   1. Prove `engraph`'s tip is an ancestor of Oak's `main` (criterion 1) and that the mirror
      workflow has fast-forwarded the fork's `main` to Oak's `main`.
   2. Stop the carrier first. Delete the fork's `UPSTREAM_CARRIER_ENABLED` variable, or set it to
      `false`, wait for any carrier run already started to finish (the variable is read only when
      a run starts), then close every open carrier pull request and delete every
      `automation/upstream-carrier-*` branch, with or without a pull request.
      `UPSTREAM_MIRROR_ENABLED` stays `true`.
   3. Retarget the fork's ruleset "integration branches" from the default branch to
      `refs/heads/engraph`. It follows the default branch and requires a pull request, so if the
      default moved first it would land on `main` and block the mirror workflow's direct
      fast-forward. The ruleset "mirror branch: fast-forward only" already covers `main`.
   4. Switch the fork's default branch to `main`.
   5. Once no open pull request has `engraph` as its base (deleting a base branch closes its pull
      requests), delete the "integration branches" ruleset, then `engraph` on the fork. The
      ruleset restricts deletion of the branch it covers, so the branch cannot go first.
   6. One Oak pull request, as Oak's bot, drops `engraph` from the triggers in `ci.yml`,
      `codeql.yml` and `dependency-review.yml`. The carrier and mirror workflows stay in the tree:
      each job is gated on its variable and exits on a repository that is not a fork.
   7. Each local checkout is re-pointed on the owner's word: its remotes, its default branch and
      the commit identity it uses. Those bindings belong in the operator profile.

## Out of scope

- Moving `gitleaks` and the smokes' shell to by-name calls: ordinary Oak work after the merge.
- The no-throw remediation the owner deferred until this merge: its own lane afterwards.
- Oak's open pull requests by other authors: they merge `main` in afterwards.
