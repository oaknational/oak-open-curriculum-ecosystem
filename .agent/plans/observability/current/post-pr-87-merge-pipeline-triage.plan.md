---
name: Post-PR-87 Merge — Release Pipeline Triage
overview: >
  Triage the two pipeline events on main after PR-87 was merged on 2026-04-28:
  the release workflow's two deprecation warnings and the Vercel deployment
  failure on the release commit. This plan separates verified facts from
  unverified assumptions from outright speculation made by the prior session,
  so the next agent can disentangle them before acting.
status: current
last_updated: 2026-04-28T18:30Z
created_by: Abyssal Cresting Compass / claude-code / claude-opus-4-7-1m / 6efc47
todos:
  - id: triage-fetch-build-log
    content: "Fetch the Vercel build log for dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6 (release commit 171a94fd) before any structural change. Three paths in §Next-agent actions; owner picks."
    status: pending
  - id: verify-create-github-app-token-migration
    content: "Read the actions/create-github-app-token v3 release notes / docs to verify what the app-id → client-id migration actually requires. Prior session ASSUMED a one-line rename; this is unverified."
    status: pending
  - id: diagnose-and-fix-build-failure
    content: "Diagnose the build failure from the log content; cure as a focused commit on a fresh branch from main."
    status: pending
  - id: land-create-github-app-token-fix
    content: "Land the verified migration to actions/create-github-app-token current input names; can be the same fresh-branch PR or a separate small PR."
    status: pending
---

# Post-PR-87 Merge — Release Pipeline Triage

## Context

PR-87 was merged to `main` on 2026-04-28. Two pipeline events warrant attention:

1. The release workflow run on `main` succeeded with **two deprecation warnings**.
2. The Vercel deployment on the **release commit** failed.

The prior session (this agent's predecessor — same session-id, this same author)
investigated and produced an analysis that the owner flagged as "badly flawed."
This plan reproduces the **verified facts** with sources, isolates the
**unverified assumptions**, and quarantines the **speculation** so the next
agent does not act on it.

## Verified facts (with source)

Each claim cites the command or artefact used to verify it. Anything not in
this section is **not yet verified**.

| # | Fact | Source |
|---|---|---|
| F1 | Main HEAD after merge is `171a94fd chore(release): 1.6.0 [skip ci]`; previous commit on main is `05f994c0 feat(observability): Sentry/OTel public-alpha foundations — esbuild-native build, rate limiting, Search CLI adoption, agent-memory taxonomy (#87)`. | `git log --oneline -3 origin/main` |
| F2 | The release workflow run is GitHub Actions run `25064635233` (`name: Release`, `conclusion: success`, `head_sha: 05f994c0`, `event: workflow_run`). | `gh api repos/oaknational/oak-open-curriculum-ecosystem/actions/runs/25064635233` |
| F3 | The `head_sha` of the release workflow run is `05f994c0` (the feature merge), NOT the release commit it produces (`171a94fd`). The release workflow runs ON the merge commit and creates the release commit as a side effect. | F2 |
| F4 | The release workflow has two annotation warnings, both on the `actions/create-github-app-token` step. Verbatim: `Input 'app-id' has been deprecated with message: Use 'client-id' instead.` Both annotations show the same message, attributed to the `Generate release token` step and its post-action cleanup. | Owner-supplied screenshot of the workflow run page |
| F5 | The workflow file at `.github/workflows/release.yml` (on `main`) pins the action to `actions/create-github-app-token@1b10c78c7865c340bc4f6099eb2f838309f1e8c3 # v3.1.1` and supplies `app-id: ${{ secrets.RELEASE_APP_ID }}` and `private-key: ${{ secrets.RELEASE_APP_PRIVATE_KEY }}`. | `git show origin/main:.github/workflows/release.yml` |
| F6 | The Vercel commit-status for the feature merge `05f994c0` is `success` with description `Canceled by Ignored Build Step`, target `https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/GzWJvwvkh9VCrrXNmVzuvg6oTSiZ`. | `gh api repos/oaknational/oak-open-curriculum-ecosystem/commits/05f994c0/status` |
| F7 | The Vercel commit-status for the release commit `171a94fd` is `failure` with description `Deployment has failed — run this Vercel CLI command: npx vercel inspect dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6 --logs`, target `https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/9CmqChJi9Y3KA8DmAHSX8XvEyTn6`. | `gh api repos/oaknational/oak-open-curriculum-ecosystem/commits/171a94fd/status` |
| F8 | The Vercel MCP token in this session does not have access to the `oak-national-academy` team scope. Attempting `get_deployment_build_logs` with team slug or with team id `team_5MdEwhWulpsOF31pm2UPqJOC` returns 403 `Not authorized`. The team id is leaked from the 403 response body. | `mcp__plugin_vercel_vercel__get_deployment_build_logs` (403 response captured this session) |
| F9 | A WebFetch on the Vercel inspector URL returns only the auth-walled page shell (section headers, no log content). | `WebFetch` this session |
| F10 | A Sentry MCP search for `error events from production environment in the last 1 hour, especially anything related to deployment, sourcemap upload, build, or Vercel` returned zero results. | `mcp__plugin_sentry_sentry__search_events` this session |
| F11 | The Vercel deployment `dpl_GzWJvwvkh9VCrrXNmVzuvg6oTSiZ` (feature merge) was cancelled by Vercel's "Ignored Build Step" mechanism. The repository has an ignore script at `apps/oak-curriculum-mcp-streamable-http/scripts/vercel-ignore-production-non-release-build.mjs` (or similarly named — verify path). The cancellation outcome is what the script is intended to produce on non-release commits. | F6 + repo file presence; the *attribution to our script specifically* is an inference, see A1 |
| F12 | The release commit `171a94fd` has commit message `chore(release): 1.6.0 [skip ci]`. The `[skip ci]` marker stops GitHub Actions from running on this commit, but Vercel does not honour `[skip ci]` (Vercel uses its own ignore mechanism). The release commit therefore did trigger a Vercel build attempt. | Commit message verbatim; Vercel doc behaviour. |

## Open unknowns

These are the questions the next agent must answer **before** proposing any
structural change. Each row names what would resolve it.

| # | Unknown | What would resolve it |
|---|---|---|
| U1 | Why did the build for `dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6` fail? What was the actual error message? | Read the build log content. Three paths listed in §Next-agent actions. |
| U2 | What does the `actions/create-github-app-token` v3 migration from `app-id` to `client-id` actually require — input rename only, secret-value change, both, or something else? | Read the action's release notes / README at <https://github.com/actions/create-github-app-token> (or its tagged release page) for v3.x. |
| U3 | Whether the same secret value (`RELEASE_APP_ID`) is valid as `client-id` after the rename. The two identifier shapes are not the same on the GitHub App settings page (numeric App ID vs. string Client ID); a rename of the input key alone may be insufficient if the secret stores the old App-ID format. | Read the GitHub App's settings page on github.com to compare what the current secret stores vs. what `client-id` expects. |
| U4 | Whether the previous release (1.5.0) Vercel deploy on `f0046db9 chore(release): 1.5.0 [skip ci]` succeeded or failed. If it succeeded, the failure is a regression introduced by PR-87's content. If it failed too, the failure is older than PR-87 and the diagnosis is different. | `gh api repos/oaknational/oak-open-curriculum-ecosystem/commits/f0046db9/status` |
| U5 | Whether any production Vercel env vars were added or required by PR-87 that aren't yet set in the production project. | Compare PR-87's env-var introductions against the production project's configured env vars. Requires Vercel scope access. |

## Explicit assumptions the prior session made (treat as untrusted)

These are statements the prior session made that were **not verified**. Each
needs to be falsified or confirmed by the next agent before it informs any
action.

| # | Assumption | Why it might be wrong |
|---|---|---|
| A1 | "Our `vercel-ignore-production-non-release-build.mjs` script produced the cancellation on `05f994c0`." | The Vercel commit-status only says "Canceled by Ignored Build Step" — that string identifies the *mechanism* (the project's Ignored Build Step setting ran), but does not name *which* script returned which value. The repo has the named script, and the cancellation is consistent with it returning the ignore signal, but proving the script was actually invoked requires the build log (which we don't have). The prior session over-attributed this. |
| A2 | "The deprecation fix is one line — rename `app-id:` to `client-id:`." | Unverified against the action's actual v3 docs. May require also changing the secret's value (if `RELEASE_APP_ID` stores the App ID and the new input expects a Client ID, those are different identifiers). |
| A3 | The 1,680-file / +167k-line diff statistic the prior session used (e.g. in the OAuth-fix commit body and in earlier reasoning about CodeQL stale-instance behaviour) was computed against `origin/main` *before* the merge. After the merge, that diff is the merge result on `main`; the size statistic still has meaning, but framing it as "PR-87 diff" is confusing now that PR-87 is closed. | Use post-merge `git log` and the PR's own metadata for any future reasoning, not the pre-merge `git diff` figure. |

## Speculation the prior session made (NOT for action)

The prior session's response also contained a list of "educated guesses"
about why the Vercel build failed:

- Sentry CLI sourcemap-upload step needing prod auth-token / org / project — possibly missing in production env vars
- esbuild config reworked, hitting a prod-only path
- Build-script command not found / wrong cwd
- A new env var added in PR-87 required at build time but not set in production

**These were speculation without evidence and must not be acted on.** The
build log will reveal the actual cause, which may be entirely different from
all four guesses. The next agent should read the log first, form a single
diagnosis grounded in its content, and only then propose a fix.

## Anti-patterns the prior session fell into (avoid)

- **Speculation framed as ranked diagnosis.** The "educated guesses" list
  read as a likelihood-ordered diagnostic; in fact it was unfounded. Treat
  any "likely cause" framing without log evidence as cargo-culted reasoning.
- **Conflating mechanism and agent.** "Canceled by Ignored Build Step" is the
  mechanism Vercel ran; "our vercel-ignore script returned ignore" is a
  specific attribution that wasn't proven from the available evidence (A1).
- **"One-line fix" without checking the action's docs.** A2 is a small but
  load-bearing assumption about the create-github-app-token migration that
  the prior session asserted without verification.

## Next-agent actions (in order)

The next agent SHOULD NOT skip ahead. Each step's output informs the next.

### Step 1 — Get the Vercel build log (resolves U1)

Three paths, owner picks:

a. **Owner pastes the log content** from the inspector URL → "Build Logs" tab
   into a chat message. Lowest friction. The next agent reads from chat.

b. **Owner grants the Vercel MCP token access to `oak-national-academy` /
   `team_5MdEwhWulpsOF31pm2UPqJOC`.** One-time setup; future sessions also
   benefit. The next agent then runs `mcp__plugin_vercel_vercel__get_deployment_build_logs`
   with `idOrUrl: dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6` and a working teamId.

c. **Owner runs `npx vercel inspect dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6 --logs > /tmp/vercel-build.log`
   themselves** (the commit-status's own suggestion) and the next agent reads
   `/tmp/vercel-build.log`. The repo has a no-Vercel-CLI memory; this is a
   one-off owner action under explicit owner authorisation, not the agent
   running it.

### Step 2 — Verify the create-github-app-token migration (resolves U2 + U3)

Read <https://github.com/actions/create-github-app-token> (or its v3 release
notes page) and the GitHub App's settings page. Determine **explicitly**:

- Whether `client-id` accepts the same secret value as `app-id` did, or
  whether the secret needs a different value.
- Whether any other input names also changed in v3.
- The current pinned SHA `1b10c78c7865c340bc4f6099eb2f838309f1e8c3` is v3.1.1;
  whether a newer v3.x deprecated more inputs since then.

Do not assume "one-line rename" until verified.

### Step 3 — Compare against the previous release (resolves U4)

Run `gh api repos/oaknational/oak-open-curriculum-ecosystem/commits/f0046db9/status`
and observe whether the 1.5.0 release-commit deploy succeeded. Two cases:

- **1.5.0 succeeded**: 1.6.0 failure is a regression introduced by PR-87's
  content. Diagnosis focuses on the diff between 1.5.0 and 1.6.0 build paths.
- **1.5.0 also failed**: failure pre-dates PR-87. Diagnosis focuses on the
  release-commit Vercel build path itself, independent of PR-87.

This single API call cuts the diagnosis tree in half.

### Step 4 — Diagnose and cure (resolves U1 in code)

After Steps 1-3, write a focused commit on a **fresh branch from main**.
Apply the plan-as-artefact-gravity lesson from the prior session
(`.agent/memory/active/distilled.md` §Process): one signal class per plan,
one-page table, structural cure or owner-authorised disposition per row.

Do not extend this plan to also cover the CodeQL alerts; that's a
separate plan at
`.agent/plans/observability/current/pr-87-codeql-alerts.plan.md`.

### Step 5 — Land the create-github-app-token migration

After Step 2 settles the form of the migration, land it. Likely the same
fresh-branch PR as the build-failure cure (both touch CI/release tooling
and are small), but it can be a separate PR if the owner prefers tight
PRs (per the new size-discipline direction).

## Out of scope

- **CodeQL alerts on PR-87.** Now that PR-87 is merged, those alerts
  carry to `main` if not already cleared. Tracked separately at
  `.agent/plans/observability/current/pr-87-codeql-alerts.plan.md`. Note
  that "PR-87 head" references in that plan now mean the closed PR
  reference, not a live HEAD.
- **Sonar quality gate failure on `main`.** Owner-authorised at merge
  time. Sonar work belongs to a separate plan after CodeQL closes.
- **The new PR-size/focus rules** the owner asked for. Independent of
  this triage; will be drafted as part of the fresh-branch work.

## Verification

Success looks like:

- The Vercel build log is in hand and the cause is named.
- A fresh commit on a fresh branch lands a verified cure.
- The next Vercel deploy on `main` (the next release commit, or a
  manual re-deploy of the failed deployment) succeeds.
- The release workflow runs without the deprecation annotation.

Failure looks like:

- Acting on speculation without the log content (recreates the
  prior session's anti-pattern).
- Bundling the build cure with unrelated cleanup work in one PR
  (recreates the artefact-gravity pattern).
- Marking todos `completed` without the success signal above.
