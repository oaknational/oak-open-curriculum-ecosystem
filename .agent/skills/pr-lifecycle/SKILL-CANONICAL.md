---
name: pr-lifecycle
classification: active
description: >-
  Open a pull request and shepherd it to merge-ready: reviewer-facing
  description, full-surface harvesting (GraphQL review threads, all comments,
  all checks, Sonar issues), root-cause-first triage, budgeted watching,
  re-fetch after every push, and an honest merge-ready declaration at the
  code-owner gate. Use whenever a branch reaches PR closeout or an open PR
  needs driving to live.
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
merged with every finding genuinely settled
(memory: `feedback_pr_not_done_until_live`).

## Phase 1 — Before opening

1. **Divergence**: `git fetch origin main`; if behind, merge `origin/main`
   into the branch (never rebase-and-force-push an already-pushed branch).
   When the update touches agent memory/state files, author the union by hand
   per the `semantic-merge` skill — a git line-merge silently corrupts them.
2. **Tree and gates**: working tree clean; a successful push already ran the
   full pre-push gate suite, so a clean push IS the local-green proof — do not
   re-run gates just to re-confirm it.
3. **Worktree PRs**: a worktree's branch should have carried a draft PR from
   its first commit (`worktree-hygiene` §1); this skill takes it to ready.

## Phase 2 — Open with a reviewer-facing description

Read `.github/pull_request_template.md` and fill it as a **communication
artefact for reviewers**, never a file list: what changed, why it matters,
what reviewers should focus on, what was deliberately left out, and what
evidence supports merge readiness. Update the description whenever the review
story materially changes (a reshaped scope, a new commit class).

## Phase 3 — Harvest EVERY feedback surface (the step most often botched)

Immediately after opening — and again after every push — pull all four
surfaces. Partial reads produce false "no problems" verdicts:

1. **Review threads (the authoritative comment surface)** — GraphQL
   `pullRequest.reviewThreads { isResolved, path, comments }`. REST issue
   comments MISS inline bot threads (Copilot, Bugbot); a REST-only read is the
   canonical way to falsely conclude "no comments". Worked failure 2026-07-02:
   two REST comments were triaged as "noise" while four unresolved Copilot
   threads and a failed Sonar gate sat unread.
2. **Issue comments and reviews** — full bodies, never truncated skims; a
   Sonar gate summary or a bot capability notice lives here.
3. **All checks** — `gh pr checks`, including the external ones (SonarCloud,
   CodeQL, Vercel, Cursor Bugbot, Codex). A failed check's *first* failure is
   the root to chase: a 20-second `install` failure cascades into skipped
   builds and a failed deployment — fix the root, not the echoes.
4. **Sonar quality gate** — when it fails, pull the ACTUAL issues
   (`search_sonar_issues_in_projects` with `pullRequestId`, per the
   `sonarqube-mcp-instructions` rule) and read each flagged site. The gate
   summary names conditions; only the issue list names the work.

## Phase 4 — Triage by blocking force; fix at source

- Order by blocking force and risk, not by tool order; root causes before
  echoes.
- Every finding ends in exactly one state: **fixed at source**,
  **owner-dispositioned with evidence** (per-site, e.g. a Sonar
  false-positive with rationale at that site), or **proven irrelevant at the
  specific site**. Never dismissed by category, never gate-narrowed, never
  warning-downgraded, never suppressed.
- Fix the class, not the instance: a spelling finding on two lines gets a
  repo-wide sweep of the class; a stale literal gets checked against its
  source constant convention.
- Sonar reflects fixes only after the next pushed scan — verify fixes with
  local gates at source; never poll Sonar immediately after an edit.

## Phase 5 — Wait without burning budget

Run the repo's budgeted watcher in the background:
`pnpm agent-tools:pr-watch <n> --watch --interval 60` — one line per state
change, including new comments by author. Never hand-roll tight `gh` polling
loops (the shared 5,000/hr API budget; frictions F-110). Between events,
continue other work or hold; the watcher wakes you.

## Phase 6 — After EVERY push, re-fetch; resolve only what is settled

- Bots re-review each push asynchronously: **"0 unresolved" is a moment, not
  a state.** Re-fetch `reviewThreads` and checks after every push and again
  at the instant of any ready/merge-ready declaration — a finding can land
  seconds after your last look.
- Reply to each thread with the fix evidence (commit SHA + what changed),
  then resolve it. "Resolved" is a settled-concern state, never a button
  clicked to clear `mergeStateStatus`.

## Phase 7 — Merge-ready is a declaration with a gate, then the owner

Merge-ready means, re-verified at the declaration instant: all checks green
AND zero unresolved review threads AND the Sonar quality gate passing. Then:

- **The merge itself is the code-owner gate** (`main` requires code-owner
  approval; a clean agent merge is prohibited; `--admin` is forbidden).
  Notify the owner at this action moment (send the notification; never
  suppress it on inferred presence — `owner-attention-at-action-moments`).
- When merging is authorised, prefer a **merge commit** (`--merge`), never
  squash (standing owner preference, 2026-06-28).

## Phase 8 — After merge

`worktree-hygiene` §3/§6 owns the cleanup: remove the worktree and delete the
branch (content-verified, owner-authorisation-gated for destructive ops);
update continuity surfaces; close claims.

## Failure modes this skill exists to prevent (all observed)

- REST-only comment reads declaring "no comments" over unresolved inline
  threads and a failed quality gate.
- Truncated comment skims triaged as "noise".
- Ready/merge-ready declared without re-fetching after the latest push.
- A failed check's downstream echoes debugged before its root cause.
- A Sonar gate treated as an opaque red badge instead of an issue list to fix
  at source.
- Tight `gh` polling loops in place of the budgeted watcher.
