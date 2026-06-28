# GitHub-Surface Agent Identity

**Status**: 🧭 EXPLORATORY NOTE — for other agents to explore and expand on  
**Domain**: Agent Tooling (identity plumbing)  
**Parents / siblings**:
[`identify-as-agent-under-shared-credentials.md`](../../../rules/identify-as-agent-under-shared-credentials.md)
(the rule this note proposes to demote);
[`register-identity-on-thread-join.md`](../../../rules/register-identity-on-thread-join.md);
[`PDR-027`](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md);
[`agent-identity.md`](../../../../agent-tools/docs/agent-identity.md);
[`codex-session-identity-plumbing.plan.md`](codex-session-identity-plumbing.plan.md)

This is a note, not a build plan. Execution decisions are finalised only if it
is promoted to `current/` or `active/`.

## Problem

Agents act on GitHub through the owner's shared `gh` credentials, so GitHub
stamps every agent comment, review, and PR with the owner's login and avatar.
The current cure — `identify-as-agent-under-shared-credentials` — is a
**content-layer** marker (a trailer inside the comment body). It patches the
wrong layer: even when present, the avatar, the `"jimCresswell commented"`
header, the notifications, and the audit trail still attribute the action to
the human, and it depends on per-comment agent discipline with no write-time
enforcement.

"Who authored this" is decided at the **identity layer** — the credential
GitHub authenticates. A body trailer cannot fix an attribution GitHub stamps
from the credential. The fix has to move to the identity layer.

## Proposal: give agents their own GitHub identity

Two routes, both real fixes. The right end-state is **two layers**: a distinct
GitHub identity (the automatic, unspoofable "a non-human did this") plus the
content marker demoted to carry the PDR-027 "which named agent + model" detail
the single bot identity cannot.

### Route A — Dedicated machine-user account (pragmatic)

Create a second GitHub account (e.g. `oak-agent-bot`), add it as a
collaborator, mint a fine-grained PAT, point the agent shell at it. Comments
render as `oak-agent-bot` with its own avatar.

- **Pro**: no infra; works with `gh` today; identity-switching is **native**
  (`gh auth login` the second account, then `gh auth switch` / the `--user`
  flag, or a per-shell `GH_CONFIG_DIR`).
- **Con**: long-lived PAT to rotate; one machine user (GitHub ToS permits one,
  discourages many); a seat on a paid org.

### Route B — GitHub App `oak-agent[bot]` (gold standard)

Register an App, install it on the repos, have agents authenticate with a
short-lived installation token. Comments render as `oak-agent[bot]`.

- **Pro**: cleanest attribution; scoped permissions; ephemeral tokens; can
  never be mistaken for a human.
- **Con**: an App **cannot be a stored `gh` login** and `gh auth switch` only
  moves between *user* accounts. Identity is selected by **environment**, not
  by `gh auth`.

## How `gh` selects identity (both routes)

`gh` resolves credentials in this order:

1. `GH_TOKEN` / `GITHUB_TOKEN` environment variable (wins if set);
2. otherwise the stored login from `gh auth login`.

So the "sometimes the bot, sometimes me" switch is **presence/absence of the
env var, per process**:

- the owner's interactive shell leaves `GH_TOKEN` unset → stored login → posts
  as the human;
- the agent's shell sets `GH_TOKEN=<token>` → posts as the bot.

For **Route B**, the App has no password: the token is a short-lived
(~1 hour) **installation access token** minted from the App ID + installation
ID + PEM private key (build a short-lived RS256 JWT with `iss = app id`, then
`POST /app/installations/{installation_id}/access_tokens`). Use a helper
(`octokit`'s `createAppAuth`, or a vetted minting extension — verify the
specific tool before adopting) rather than hand-rolling, mint per agent
session, and re-mint on a 401.

```bash
#!/usr/bin/env bash
# agent-gh — gh as the App identity, scoped to THIS process only
export GH_TOKEN="$(mint-installation-token)"   # JWT(APP_ID, PRIVATE_KEY) -> POST .../access_tokens
exec gh "$@"
```

**Never** `export GH_TOKEN` in a shell rc file — that hijacks the owner's own
interactive `gh`. Inject it only in the agent launcher / wrapper / spawned
shell env. (Agents here are launched via `claude` in the IDE terminals; the
concrete injection point is that launch path.)

## Demote, don't delete, the content marker

With a bot identity the two layers are complementary:

- **identity layer** (bot account / App): "a non-human agent did this" —
  automatic, unspoofable, visible at a glance;
- **content marker**: "*which* named agent + model" — the PDR-027 detail the
  single bot identity cannot carry.

The marker also stops being discipline-dependent: add the write-time hook the
rule itself notes is missing (lint `gh pr comment` / `gh issue comment` /
`gh api .../comments` invocations to require the marker). It becomes a backstop
on the detail layer, not the primary mechanism.

## Gotcha to weigh before extending beyond comments

Owner-authored PRs currently **auto-satisfy** the `* @jimCresswell` CODEOWNERS
gate, and self-approval is blocked — a calculus tied to the author identity
(see the merge-gate memory and recent napkin entries). Commenting/reviewing as
a bot is low-risk. But if agents also **author PRs** as the bot, "author ==
sole code owner" auto-satisfaction disappears and bot-authored PRs would need a
real code-owner review they currently bypass. Roll the bot identity out to
**comments and reviews first**; decide PR authorship separately with the
merge-gate effect in view.

## Open questions for a successor to expand

- Route A vs B decision: does the owner want the `[bot]` badge + ephemeral
  tokens (B), or the native `gh auth switch` ergonomics + zero infra (A)?
- Token storage/rotation: where does the PAT (A) or PEM private key (B) live on
  the machine, and how is it kept out of the repo and out of logs?
- One shared bot identity vs the content marker carrying which-agent — is that
  division sufficient, or is a per-agent GitHub identity ever wanted?
- The enforcement hook: which layer (`.agent/hooks/`) and what pattern set,
  reusing the existing hook-policy substrate.
- Cross-surface scope: the same env-var mechanism applies to any non-GitHub
  outward surface reached through human credentials.
