# Bot Identity on Third-Party Systems

**TRIGGER — read this line at EVERY write to a third-party system, not at
"merges":** the rule fires on ANY action — a comment, a review reply, a
thread resolution, a PR creation, a label edit — the moment before the call,
as a named credential-selection step: _whose name will this surface
display?_ Three seats in one session (2026-07-26) each filed this rule under
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
identity **except the action classes the owner has routed to the operator's own
credential** — enumerated exhaustively in the action map below, and nowhere
else. Reaching for the owner's personal credentials for any action outside that
map is **never permitted** — the unmapped fallback silently attributes agent
work to the owner on every surface the system displays (authorship, activity
feeds, contribution graphs, audit logs).

## Trigger

An agent is about to perform ANY action on a third-party system — creating,
commenting, reviewing, pushing, merging, editing — and a bot identity exists
for that system. The rule fires before the action, at credential-selection
time, not after. It fires on every action; the action map below decides which
credential the action takes.

## Action (GitHub — the worked mechanics)

Which credential each GitHub action class takes is settled by the action map
below; this section is the mechanics for its bot-credential rows.

The GitHub bot identity is `jimbot-oakington-iii[bot]`. Two different numbers
attach to it and **only one belongs in an email address**:

| Number      | What it is            | Where it is used                   |
| ----------- | --------------------- | ---------------------------------- |
| `4352989`   | the GitHub **App** id | app/installation API paths         |
| `307435217` | the **bot user** id   | the commit email, and nowhere else |

The noreply address takes the BOT USER id: `307435217+jimbot-oakington-iii[bot]@users.noreply.github.com`.
Worked instance 2026-08-04: the shared repo config was set with the app id, so
the address resolved to no GitHub user at all. It surfaced on Vercel's
deployment list as a three-warning cascade — "Invalid git email address" →
"GitHub User: No matching user" → "Vercel Account: Unavailable" — because
Vercel maps commit email → GitHub user → Vercel account and the chain broke at
the first hop. Confirm the id from the API, never from prose:
`gh api "users/jimbot-oakington-iii%5Bbot%5D" --jq .id`.

- **Commits — author and committer are DIFFERENT identities** (owner ruling
  2026-08-04). Git separates them precisely so a commit can say who
  _authorised_ the work and who _performed_ it, and collapsing both onto the
  agent throws the authority signal away:

  - **committer** = the acting agent, `jimbot-oakington-iii[bot] <307435217+…>`,
    from the clone's shared local `user.name` / `user.email` (below);
  - **author** = the human on whose authority the work was done, passed
    explicitly per commit:
    `git commit --author="Jim Cresswell <1314980+jimCresswell@users.noreply.github.com>" -F <file>`.

  The owner's framing: _"we are keeping the deploy as is… what we have here is
  a failure to communicate, we need to tell Vercel on whose authority this work
  was done."_ The default stays FAIL-SAFE: `user.*` remains the bot, so a
  forgotten `--author` yields a bot-authored commit (visible, honest, merely
  unattributed to its authority) and never silently credits the owner with
  agent work — the failure this rule exists to prevent. The `Co-Authored-By`
  model trailer stays, so the acting model is named in the message body too.

- **Identity config lives in the clone's shared local config** — `.git/config`,
  written once with a plain `git config user.name …` / `user.email …` (owner
  ruling 2026-08-04: _"keep the bot identity locally shared, not in version
  control"_). One clone, one copy: every worktree inherits it, a newly created
  worktree needs no identity step, and no per-worktree duplicate can survive a
  correction to the shared value. A plain `git config user.*` write reaches
  this scope even with `extensions.worktreeConfig` enabled, so the ordinary
  command is the correct one.

  Two scopes stay banned. **Version control** — never a tracked file, never an
  `include.path` reaching one; the identity is machine state, not repository
  content, and committing it would publish a per-machine value to every clone.
  **Global** — `--global` reaches the owner's every other repository.

  The consequence is deliberate: every commit made in this clone is
  _committed by_ the bot, the owner's own included. Authority is carried by
  `--author` above, not by the config — which is exactly why git keeps the two
  fields apart. Verify from any worktree with `git config user.email`; a
  `--worktree`-scoped `user.*` override is a second copy of a single fact and
  is removed with `git config --worktree --unset-all user.name` (likewise
  `user.email`). The `Co-Authored-By` model trailer stays.

- **Merges**: the front-door command, which mints its own least-privilege
  token and merges only at the settlement verdict:

  ```bash
  pnpm agent-tools merge-bot merge --pr <n> --expect <reviewer>
  ```

- **Pushes**: the front-door command, which mints its own token and hands
  the transfer to the git binary with the token in the child environment
  only (no force, no `--no-verify`, default-branch targets refused):

  ```bash
  pnpm agent-tools merge-bot push
  ```

- **PR creation, PR and issue comments, standalone inline review comments and
  thread replies, thread resolution** — every bot-credential row of the map: a
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

  Three tripwires close the residual paths the guard alone has missed
  (both instances first-hand, 2026-08-08 and 2026-08-13):

  1. **Pin the cwd before an identity-bearing write.** A persistent shell
     whose cwd has drifted into a worktree resolves the front door against
     an unbuilt `dist` — the mint exits 0 printing NOTHING, `$()` captures
     empty, and the fallback fires despite the guard reading only exit
     codes. Identity-bearing writes run from the primary root; `pwd` is one
     token.
  2. **Guard the token by LENGTH, not exit code** (`[ ${#token} -ge 20 ]`)
     — an empty read is a failure whatever the exit code.
  3. **Echo the author back in-band on every bot write** — request
     `.user.login` / `.user.type` in the same call and read it before
     proceeding. An empty `GH_TOKEN` is invisible at the call site; the
     echo-back is the only reliable detector, and it converts a silent
     misattribution into a same-call stop.

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

## The action map (owner ruling 2026-08-17) — general, not per-seat

Owner ruling, MG, 2026-08-17, verbatim:

> emgee-bot for commits/PR raises ... mantagen for reviews/approvals

Stated portably: **a pull-request review is performed under the operator's own
credential; commits, PR raises, and every other write are performed under the bot
identity.** It is not a per-seat grant, and no seat needs its own version of it.

**The discriminator is the endpoint, never the noun in the action's name.**
Anything submitted through the pull-request _reviews_ endpoint
(`POST /repos/<org>/<repo>/pulls/<n>/reviews`) is a review — whatever state it
carries, and whatever body or inline comments travel inside the same call. One
call, one credential: a review's body has no credential of its own, so an
approval that carries a body and a changes-requested review each have exactly one
path. Every other write on the system is an ordinary write.

The map below is exhaustive and its rows do not overlap. Read the row, not the
noun.

| Action | Credential | Why this row |
| --- | --- | --- |
| Review submitted as `APPROVE` | operator | only a human review supplies the approval a code-owner ruleset waits on |
| Review submitted as `REQUEST_CHANGES` | operator | same endpoint, same gate: a bot's changes-requested neither discharges the human review request nor registers with the ruleset |
| Review submitted as `COMMENT` state | operator | same endpoint; it discharges the review request assigned to the human |
| The **body** of any review, and any inline comment carried inside the same submission | operator, inseparably — it is one API call | see the discriminator above |
| A **standalone** inline review comment or thread reply (`POST …/pulls/<n>/comments`, `POST …/pulls/comments/<id>/replies`) | bot | not a review submission: it discharges no request and sets no review state |
| An ordinary PR or issue comment (`POST …/issues/<n>/comments`) | bot | as above — a comment is a write, not a review |
| Requesting or re-requesting a review **from a human** | bot | an ordinary mutating write: the `422` below is specific to the Copilot reviewer, and a human reviewer is accepted from the bot installation token |
| Requesting a review **from Copilot** | operator | mechanism, not preference: `requested_reviewers` rejects a bot/app token with `422` — dated grant below |
| Commits, pushes, PR creation, merges, thread resolutions, label and state edits, and every other `gh api -X POST/PATCH/DELETE` | bot | the closed default: nothing reaches the operator's credential except a row above |

The trigger is the **write**, at credential-selection time, never the tool
category.

**Why the review rows are a capability boundary rather than an inconsistency.**
Under a code-owner review ruleset, a review posted by a bot neither discharges a
review request assigned to a human nor supplies the approval the ruleset is
waiting on — so a bot-posted review leaves the pull request exactly as blocked as
before. The operator's credential is the only one that can clear that gate. The
split is forced by mechanism, not chosen for convenience.

**Which bot and which human is machine-local** and is deliberately not stated
here; it belongs in the operator profile
([`.agent/operator-local/README.md`](../operator-local/README.md)). This rule
owns the portable mapping, the profile owns the bindings. A rule that hard-coded
one person's accounts would be false on every other machine (`principles.md`
§Any User, Any Machine).

Three riders bind every operator-credential row:

- **The credential is licensed, never the judgement.** An agent reviews
  first-hand before approving. The grant permits posting a review, never
  posting one it has not earned.
- **Content written under a human credential must state that an agent wrote
  it**, and name the seat, per
  [`identify-as-agent-under-shared-credentials`](identify-as-agent-under-shared-credentials.md).
  The credential displays the human; the words must not let a reader conclude the
  human wrote them. The grant makes this requirement stronger, not weaker.
- **The author-cannot-review intersection applies.** GitHub forbids the author of
  a pull request from reviewing it in any state, so on a PR authored by the same
  human account the review would be posted under, no review row yields a usable
  path: the agent's review of record rides an ordinary PR **comment** (bot, per
  the map), and any `APPROVE` or `REQUEST_CHANGES` state needs a different
  non-author account. Route that case rather than working around it.

## Standing owner-granted exceptions (dated, narrow)

The two grants below **pre-date** the action map above and are now dated
instances of its rows rather than departures from it. The map states the scope;
each entry is retained because it records a mechanism finding the map does not
carry.

- **GitHub PR approvals (granted 2026-08-04)** — the first instance of the
  review rows. Owner word, verbatim: "I do not have to approve PRs, you can use
  my identity to do that, that is permitted." What it cured: the code-owner
  review ruleset (`require_code_owner_review: true`) means a PR authored by one
  code owner needs the _other_ code owner's approval, so every PR authored by
  the second code owner sat blocked on the owner personally — a standing
  bottleneck this user-instigated grant removed.

- **Copilot review requests (granted 2026-08-06)** — the warrant for the
  Copilot row. Owner word, verbatim:
  "there is standing permission to use my/user credentials for requesting
  reviews from copilot." Mechanics: the REST
  `requested_reviewers` endpoint accepts
  `copilot-pull-request-reviewer[bot]` only from a HUMAN user token — a
  bot/app token gets `422` (tooling-lane probe + first-hand human-token
  success, both 2026-08-06), so the owner's ambient `gh` keyring is the
  only working path. The worked command:

  ```bash
  gh api -X POST repos/<org>/<repo>/pulls/<n>/requested_reviewers \
    -f "reviewers[]=copilot-pull-request-reviewer[bot]"
  ```

  The surface displays the owner as the requester — the grant's accepted
  consequence. It licenses exactly the Copilot row and is never precedent for
  any other fallback.

## History and grandfathering

History pushed under owner credentials before the 2026-07-23 re-assertion
stands (rewriting pushed history is separately banned). Live visible surfaces
are cured by recreation, not rewrite — worked instance (2026-07-23): the
MCP-132 pull request, opened under owner credentials, was closed and
recreated under the bot identity on the same branch; the bot-authored commit
and bot-token push were verified end-to-end the same hour.

## Personal per-person ambient bots

The shared team bot is not the only sanctioned identity. An individual may run
their OWN GitHub App as a personal, machine-local ambient git identity for their
own agent sessions — worked instance: `emgeebot-oakenfold[bot]` (App 4482842),
wired on one maintainer's machine as the ambient commit-author and push
credential for the `oak-open-curriculum-ecosystem` tree via a machine-local
`includeIf` (2026-08-04). Its mechanics and key live only on that machine
(`~/.config/<slug>/`), never in this repo.

This does not weaken the shared-bot contract above; it refines the attribution
model:

- **Team surfaces use the shared bot.** Shared-repo PRs, doctrine changes,
  merges, and any action taken as the team use `jimbot-oakington-iii[bot]` per
  the mechanics above. A personal ambient bot is for an individual's own agent
  work, not for acting as the team.
- **A personal bot answers "whose agent did this".** The shared bot says "a
  team agent did this"; a personal ambient bot says "this maintainer's agent
  did this". Both keep agent work off the owner's personal identity — the
  failure class this rule exists to prevent.
- **Same guardrails, no exceptions.** A personal bot is machine-local (its key
  exists only where its owner put it), least-privilege (`pull-request-work`,
  repo-scoped installation tokens minted on demand), and MUST NEVER be added to
  any ruleset bypass list — the bypass prohibition binds every bot identity
  equally.
- **Not a team default.** A personal ambient bot is one maintainer's local
  configuration; it is never provisioned for, or assumed by, other machines or
  seats. Agents running off that machine cannot use it, and no seat may treat
  its absence as licence to fall back to owner credentials.

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
