---
fitness_line_target: 110
fitness_line_limit: 150
fitness_char_limit: 9000
fitness_line_length: 100
---

# Cloud Environment Routing

## Trigger

At the start of every session, before start-right or any package-manager,
build, test, hook or credential command, verify that the current directory is
the repository root and classify the host:

```bash
work_profile_status=0
bash .agent/setup/is-chatgpt-work-cloud.sh || work_profile_status=$?
case "$work_profile_status" in
  0) echo chatgpt-work-cloud ;;
  1) echo not-chatgpt-work-cloud ;;
  *) echo detector-error >&2; exit "$work_profile_status" ;;
esac
```

The detector identifies ChatGPT Work cloud only when `CODEX_CI=1` **and**
`CODEX_ENVIRONMENT_ID` is non-empty. Neither signal alone is sufficient. The
script is the shared reader for this fact; do not duplicate the expression in
skills or infer the profile from a scratch path, vendor name or missing binary.
Exit 1 means only “not this profile”; a missing script, wrong working directory
or any other exit code is a blocker, not permission to use the standard route.

## ChatGPT Work cloud profile

Owner ruling, 8 September 2026: a detected ChatGPT Work cloud host is a
**non-execution environment**. Use the following route for the whole session:

1. Do not run, install, upgrade or repair pnpm, Corepack, `node_modules`, build
   output, browsers or local test/gate tooling. A missing or mismatched tool is
   confirmation of the profile, not a setup task.
2. Perform read-only source inspection and non-executing static checks that use
   already-present host tools, including exact diff review, branch/base checks,
   `git diff --check`, link-target existence and deterministic text/count
   reconciliation. Never report these as runtime or full-gate evidence.
3. Use the configured default git/GitHub credential for task-scoped commits,
   non-force story-branch pushes, and the draft PR writes required to deliver
   the work. Do not mint, install, rewrite or repair a bot identity in this
   profile. If shell git has no configured transport credential, use the
   already-authenticated GitHub connector; do not create a credential
   workaround. This route never authorises merges, default-branch writes,
   protection bypasses, destructive/admin writes or work beyond the task.
4. Commit and push with `HUSKY=0` when invoking local git. A connector-created
   commit has no local hook process and is covered by the same owner routing.
   `--no-verify` and every other hook-skip spelling remain outside this ruling.
5. Before committing, verify the branch is not the repository's default branch,
   inspect the exact staged/content set and inspect the message manually against
   the live conventional-commit constraints. CI does not run the commit-message
   hook or prevent a local default-branch commit.
6. Open a draft pull request immediately. GitHub CI's `run-quality-gates` fan-in
   is the execution and tree-state verdict. Keep the PR draft and make no green
   claim until that check genuinely concludes; cancelled or absent is not green.
   After the first push, do not push another head while that required check is
   running. A cancelled or superseded head supplies no verdict. A failing
   verdict permits no second push without a named, diff-level cause read from
   the check's own output; when no such cause can be named, stop and surface
   the blocker — a red gate is never probed by pushing again.
7. Run the `gitleaks` binary over the outgoing commits when the host already
   carries it (`gitleaks detect` needs no package manager); only when it does
   not is the CI secret scan the first scan, after transfer. Either way,
   inspect the outgoing diff for credentials before the write and never place
   credentials in the worktree. The post-transfer case is the explicit
   residual trade-off of the owner-routed profile, not equivalence to a
   pre-transfer scan; it retires when the host carries the binary.

If the pull request cannot trigger the required CI, stop after local/static work
and surface the blocker. If CI coverage narrows relative to the repository's
canonical gates, this routing decision reopens.

## Other profiles

- A Claude cloud session uses the separately provisioned, setup-capable route in
  [the Claude cloud environment document](../claude-harness-integrations/cloud-environment.md).
- Every other environment follows the normal worktree, identity, hook and local
  execution procedures. A not-Work result does not imply Claude or any other
  cloud profile.

## Related surfaces

- [`AGENT.md`](./AGENT.md) — fires this classification before command guidance.
- [`set-up-worktree-lane`](../skills/set-up-worktree-lane/SKILL-CANONICAL.md) —
  applies the profile while creating a lane.
- [`commit`](../skills/change-custody/commit/SKILL-CANONICAL.md) — owns the
  profile's commit path and manual message check.
- [`no-verify-requires-fresh-authorisation`](../rules/no-verify-requires-fresh-authorisation.md)
  — records the exact standing `HUSKY=0` scope.
- [`bot-identity-on-third-party-systems`](../rules/bot-identity-on-third-party-systems.md)
  — records the configured-default-credential route.
- [`local-broken-code-never-leaves`](../rules/local-broken-code-never-leaves.md)
  — defines the bounded downstream-proof path.
- The quick and thorough start-right shared workflows — apply this route before
  any command-bearing grounding step.
