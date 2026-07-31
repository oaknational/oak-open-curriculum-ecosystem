# Bot Identity on Third-Party Systems

**TRIGGER — read this line at EVERY write to a third-party system, not at
"merges":** the rule fires on ANY action — a comment, a review reply, a
thread resolution, a PR creation, a label edit — the moment before the call,
as a named credential-selection step: *whose name will this surface
display?* Three seats in one session (2026-07-26) each filed this rule under
the noun in its tooling's name ("merge-bot") and posted under the owner's
identity at non-merge writes; a fourth (2026-07-31) opened a roll-up PR with
bare `gh pr create` and caught it only at the pre-merge compliance read,
paying a close/recreate and a full checks re-run (PRs 661→662); the trigger
is the WRITE, never the tool category.

Owner ruling (agreed ~2026-07-21; re-asserted verbatim 2026-07-23): "if we
have a bot identity created to represent us on that system, then we MUST
always use that identity, exceptions are by user permission only and
generally must only be instigated by the user."

On any third-party system where a bot identity exists to represent this
team's agents, every agent-driven action on that system carries the bot
identity. Falling back to the owner's personal credentials without explicit,
user-instigated permission is **never permitted** — the fallback silently
attributes agent work to the owner on every surface the system displays
(authorship, activity feeds, contribution graphs, audit logs).

## Trigger

An agent is about to perform ANY action on a third-party system — creating,
commenting, pushing, merging, editing — and a bot identity exists for that
system. The rule fires before the action, at credential-selection time, not
after.

## Action (GitHub — the worked mechanics)

The GitHub bot identity is `jimbot-oakington-iii[bot]` (app 4352989).

- **Commits** (author AND committer):
  `jimbot-oakington-iii[bot] <307435217+jimbot-oakington-iii[bot]@users.noreply.github.com>`,
  set via **worktree-scoped** git config only
  (`git config extensions.worktreeConfig true` once, then
  `git config --worktree user.name …` / `user.email …`). NEVER the shared
  repo or global config — that flips the owner's own commits in the primary
  checkout: with `extensions.worktreeConfig` enabled, a PLAIN `git config
  user.*` write from a worktree still targets the SHARED local scope
  (worked near-miss 2026-07-24 — the primary read the bot for ~1 min).
  Before any worktree commit, verify both surfaces:
  `git -C <primary> config user.name` still resolves the human AND the
  worktree's own config resolves the bot. The `Co-Authored-By` model
  trailer stays.
- **PR creation, comments, review replies, thread resolution, merges**: a
  minted installation token exported as `GH_TOKEN` for the `gh` invocation.
  **Assign it first and stop if the mint fails** — never the
  `GH_TOKEN=$(…) gh …` prefix form:

  ```bash
  token=$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work) || exit 1
  GH_TOKEN="$token" gh pr edit <n> --body-file …
  ```

  A prefix substitution cannot fail fast. When the mint fails — a bad
  `--scope`, an unreadable key, a `422` — `GH_TOKEN` becomes the empty
  string, `gh` treats empty as UNSET, and it falls back to the keyring,
  running as the signed-in human who may be bypass-capable. That is the
  owner-credential fallback this rule bans, reached silently. Verified
  first-hand 2026-07-29: `GH_TOKEN="" gh auth status` reports the human
  account with `repo` and `workflow` scopes, and a failing mint captures zero
  bytes through the direct entry point.
- **Pushes**: bot-token transport — a credential-helper that reads the token
  from the environment, e.g.
  `git -c credential.helper= -c "credential.helper=!f() { echo username=x-access-token; echo password=$GH_TOKEN; }; f" push https://github.com/<org>/<repo>.git HEAD:<branch>`.
  Never bake the token into a remote URL or any config file.

## Action (all other systems)

Where a bot/agent identity exists (e.g. a Linear agent actor), agent actions
use it. Where the only available credential is the owner's (e.g. an MCP
plugin OAuth'd as the owner), that is a **standing surfaced gap**: name it to
the Director for cure at the integration level, mark agent-authored content
per
[`identify-as-agent-under-shared-credentials`](./identify-as-agent-under-shared-credentials.md),
and never treat the gap as licence — the cure is always moving the surface to
a bot identity, not normalising the fallback.

## The blocker clause

If the bot identity cannot perform the action (missing permission, missing
capability, expired token), that is a **blocker to surface** — through the
Director, or to the owner at an action moment — never a licence to fall back
to owner credentials. The fallback happens only when the owner explicitly
permits it, and the owner generally instigates it.

## History and grandfathering

History pushed under owner credentials before the 2026-07-23 re-assertion
stands (rewriting pushed history is separately banned). Live visible surfaces
are cured by recreation, not rewrite — worked instance (2026-07-23): the
MCP-132 pull request, opened under owner credentials, was closed and
recreated under the bot identity on the same branch; the bot-authored commit
and bot-token push were verified end-to-end the same hour.

## Why

This agreement existed from ~2026-07-21 but lived only in conversation — it
never graduated into a rule, so rotating seats kept inheriting the ambient
owner credentials and the owner found agent PRs authored as himself. The
failure class is **silent identity fallback**: a default credential is not
neutral; it is an attribution decision made by omission. This rule is the
graduate step that was missed.

## Related Surfaces

- [`identify-as-agent-under-shared-credentials`](./identify-as-agent-under-shared-credentials.md)
  — the content-marker discipline: now defence-in-depth for the permitted
  exceptional cases and for seat-level attribution (the bot identity is
  shared by all seats, so content still names the acting agent per PDR-027).
- [`rules-have-no-exceptions`](./rules-have-no-exceptions.md) — the exception
  path here is the owner's word, not agent judgment.
