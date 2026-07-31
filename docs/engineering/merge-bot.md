# The merge bot — who needs one, and how to set one up

This repo's merges are protected by a ruleset (required checks, review-thread
resolution). Whether those protections physically bind you depends on your
credential:

- **Most contributors are not bypass-capable.** Your plain `gh pr merge` and
  the GitHub UI merge button are already blocked by red checks and open
  threads. **You do not need a merge bot.** Merge normally; arming auto-merge
  at a settled review (`gh pr merge <n> --auto --merge`) is always allowed
  and recommended.
- **Bypass-capable credentials (org admins, and any actor on the ruleset's
  bypass list) silently skip required checks on DIRECT merges** — no flag,
  no warning (a plain merge once landed behind a red Sonar gate this way).
  For these credentials the standing rules are: `--admin` is always banned;
  direct `--merge` is banned; land work by **arming auto-merge at a settled
  review** (the arm path never exercises bypass), or by **merging as the
  merge bot**, which every protection except the code-owner review gate
  physically binds (next section).

## How the bot works

A GitHub App (this repo's is named in [`.github/merge-bot.json`](../../.github/merge-bot.json))
is installed on the repository and is **deliberately absent from the
protections ruleset's bypass list** ("Protect default branch": required
checks, threads, code scanning, code quality, Copilot review) — GitHub
itself stops its token at any unmet requirement there. Its ONE bypass,
verified against the rulesets API 2026-07-31, is the separate
**"Code-owner review gate" ruleset (bot-exempt by owner ruling
2026-07-21)**: an approving review is not required for a bot merge, while
everything else still binds. (Trued 2026-07-31 — this doc previously
claimed the bot had no bypass at all, which contradicted the live ruleset
split and the standing no-approving-review practice.)

```bash
token=$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work) || exit 1
GH_TOKEN="$token" gh pr merge <n> --auto --merge
```

**Bot merges at settled run through the REST endpoint, not the `gh pr
merge` client.** Client-side `gh pr merge` refuses on a
BLOCKED/viewer-independent mergeability state, and GitHub auto-merge does
NOT apply ruleset bypass grants — yet the bot's code-owner-gate bypass IS
honoured at the REST layer. So at genuinely-settled the bot merges via
`PUT /repos/{owner}/{repo}/pulls/{n}/merge` (merge-commit method, never
squash), re-counting unresolved threads INSIDE the same command sequence —
after the head check, before the REST call — because a bot review can land
in the seconds between (caught twice in forty minutes, #570/#574).

**Assign the token first; never use the `GH_TOKEN=$(…) gh …` prefix form.** A
prefix substitution cannot fail fast: if the mint fails for any reason — a bad
`--scope`, an unreadable key, a `422` — the substitution yields an empty
string, and `gh` treats an empty `GH_TOKEN` as _unset_ and falls back to the
keyring. The command then runs as the signed-in human, who may be
bypass-capable, which is the owner-credential fallback
[`bot-identity-on-third-party-systems`](../../.agent/rules/bot-identity-on-third-party-systems.md)
bans outright. A separate assignment with `|| exit 1` stops there instead.

Each minted token is scoped at mint time to this repository and to exactly
the permissions of the `--scope` you name — least-privilege by construction,
even if the app is ever installed more widely, and a strict subset of
whatever the installation itself grants.

`--scope` is **required and has no default**. A token carries only the
permissions its mint requests, so a default would make the most privileged
scope the silent one — which is how a read-only need came to be served by a
three-write token (MCP-385). The scopes, and the evidence for each member,
are defined in `agent-tools/src/merge-bot/token-scopes.ts`:

| scope                  | permissions                                                   | for                                                                                  |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `pull-request-work`    | `pull_requests: write`, `contents: write`, `workflows: write` | merge, update-branch, push, PR create/edit, comment, review reply, thread resolution |
| `code-scanning-alerts` | `security_events: read`                                       | reading code-scanning alerts                                                         |

That table is a **mirror**, kept inline because a reader choosing a scope
needs the read/write levels in front of them. `token-scopes.ts` is
authoritative and wins on any disagreement; `merge-bot mint-token --help`
derives its list from the same source and is always current.

**False-green entry points.** `pnpm exec tsx agent-tools/src/merge-bot/cli.ts
mint-token` and its `pnpm --silent` variant exit 0 with EMPTY streams — the
module has no direct-run bootstrap, so nothing runs and nothing errors. Only
the built form above (`pnpm agent-tools merge-bot mint-token …`) actually
mints; an empty `$token` after an exit-0 mint is this failure, not a
permissions problem.

**Tokens can expire mid-chain.** A minted token can expire between the mint
and the final write of a long pre-push gate chain — the signature is a bare
`403` on the WRITE while reads still succeed. Mint, auth-probe, and push in
ONE shell; take proof of push from the transfer line plus a fresh
`ls-remote`, never the exit code; and the cure is re-mint-and-retry, not a
permissions investigation.

## Who executes the merge

- **A PR with a live implementer seat lands via that seat's own bot merge**
  (merge-commit method). A merge monitor's standing "merge at settled
  without re-asking" grant covers only orphaned or lane-retired PRs;
  freeze-bound surfaces need Director word regardless of executor.
- **Owner merge-word can arrive as chat approval** ("I approved the PR, that
  is signal enough"; "Merge now") — it is equivalent to the settled-read
  handshake. Where the owner is the PR author-of-record, GitHub blocks
  self-review, so the approval is recorded as an owner-directed APPROVE
  submitted via the bot.
- **Codex-seat bridge**: the Codex GitHub connector refuses merge actions
  without in-session owner authorisation, so at genuinely-settled a Codex
  lane routes the mechanical key-turn to the Director as proxy — judgment
  stays with the lane seat.

`pull-request-work` is wider than several of its listed uses need: the
conversation half (comments, review replies, PR edits) requires
`pull_requests: write` alone, while only merge, push and update-branch need
`contents`/`workflows`. Splitting it is MCP-391, gated on establishing what
the GraphQL thread-resolution mutation requires. Read the set as honest for
the span as named, not as minimal for each member.

**A `403` reading `Resource not accessible by integration` is a
wrong-`--scope` symptom, not a broken bot** (observed 2026-07-29 from a
contents write on a `code-scanning-alerts` token). An ungranted permission
fails the _mint_ with `HTTP 422`, so a mint that succeeded followed by that
403 means the token is scoped for different work. Other 403s are not scope
problems: a ruleset refusing a merge is this design working as intended, and
rate limits return 403 too.

`workflows: write` is needed only by `gh pr update-branch`, which writes the
merge commit onto the **head** branch; GitHub refuses that write when the
merge touches `.github/workflows/**` without it — which is why the setup
steps below treat Workflows as non-optional. Merging a pull request does not
need it; the observations behind that, and behind every other scope member,
live in `token-scopes.ts` beside the decisions they justify.

`.github/merge-bot.json` is the **single authority** for which app is this
repo's bot (`appSlug`, `appId`, `repo`); the private key lives outside every
repo at `~/.config/<appSlug>/private-key.pem`, derived from that config.
Command-line flags (`--app-id`, `--private-key-path`, `--repo`) are explicit
operator overrides for cross-repo use or testing — not a resolution tier.

## Setting up a bot (requires org-admin rights)

Creating and installing a GitHub App on an organisation repository requires
admin rights on the org — which is exactly why the bot is only _required_
for admin credentials, and optional for everyone else.

1. `https://github.com/organizations/<org>/settings/apps/new` — name it,
   untick **Webhook → Active**.
2. Repository permissions — grant nothing beyond these.

   Requested by a scope, so a missing one fails that scope's mint with `422`:
   **Pull requests: Read & write**, **Contents: Read & write**, **Workflows:
   Read & write**, **Code scanning alerts: Read-only**.

   Granted but requested by **no** scope, so no bot token can exercise them:
   **Checks: Read-only**, **Commit statuses: Read-only**. They are held
   against a future scope that needs them; a bot token cannot read checks
   today, and trying yields the wrong-scope 403 above. Reads may use any
   credential (see below), which is why nothing has needed them.

   **Workflows** is not optional: a token mint requests it explicitly, and
   GitHub rejects a token request for any permission the app was not
   granted. An app created without it fails **every** `pull-request-work`
   mint with `HTTP 422`, not merely the `update-branch` call that needs it.

   **Code scanning alerts** is likewise not optional for the
   `code-scanning-alerts` scope — without it, every such mint fails `422`.
   Note GitHub keeps three separate alert permissions: this one governs code
   scanning; secret-scanning alerts and Dependabot alerts are distinct
   permissions and are deliberately NOT granted.

   **Adding a permission to an existing app does not reach its installations
   by itself.** GitHub marks the new permission as requested, and an org
   owner must approve it on the installation before any mint can use it. On a
   bot that already exists, expect `422` until that approval lands. _(This is
   GitHub's documented behaviour for permission changes on existing
   installations; it was NOT observed here — this repo's App already held the
   Code-scanning-alerts grant, so the path was never exercised. Every other
   `422`/`403` claim on this page is first-hand.)_

3. "Only on this account" → **Create GitHub App**; note the **App ID**.
4. **Private keys → Generate a private key** (this never happens
   automatically) — the downloaded `.pem` is the bot's whole identity:

   ```bash
   mkdir -p ~/.config/<app-slug>
   mv ~/Downloads/<app-slug>.*.private-key.pem ~/.config/<app-slug>/private-key.pem
   chmod 600 ~/.config/<app-slug>/private-key.pem
   ```

5. **Install App** → your org → **Only select repositories** → this repo.
6. Update `.github/merge-bot.json` if this bot replaces the repo's bot, and
   **never add the app to the ruleset's bypass actors** — a bypass-capable
   bot is the disease this design cures.
7. Prove it: `pnpm agent-tools merge-bot mint-token --scope pull-request-work` exits 0 and prints a
   token; a merge attempt against a PR with a red required check must be
   REFUSED — that refusal is the feature.

The client ID / client secret on the app page belong to OAuth user flows
and are **not used** by this path; you never need to generate the secret.

## Agent actions run as the bot — attribution by identity

Any PR mutation performed **by an agent** runs under the bot token, so the
platform record itself says which actions were a human's and which were an
agent's: opening PRs, editing titles/descriptions, commenting, replying to
review threads, resolving threads, requesting reviewers, arming, merging.

```bash
token=$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work) || exit 1
GH_TOKEN="$token" gh pr edit <n> --body-file …
GH_TOKEN="$token" gh api …/comments/<id>/replies -f body=…
```

Reads may use any credential — attribution matters for writes. Agents keep
signing reply bodies with their agent tuple: the bot identity says "an
agent did this", the signature says which one. A maintainer acting from
their own hands uses their own credential — that contrast is the point.

## Key handling

The `.pem` grants the bot's full capability: keep it out of every repo,
never paste it into chat or logs, and rotate it from the app's Private-keys
section if exposure is ever suspected. The minting CLI prints the token to
stdout only (expiry to stderr) so command substitution never leaks extras.

`--json` is the exception: it bundles the token into the printed object, so
that output is as sensitive as the token itself and must not be pasted
anywhere the plain form would be safe.

Tokens belong in the environment, never in a URL. Pushes use a
credential-helper that reads `GH_TOKEN` (see
[`bot-identity-on-third-party-systems`](../../.agent/rules/bot-identity-on-third-party-systems.md)) —
a token baked into a remote URL is visible in the process list to anything
that can read it.
