---
classification: core
description: "Bot identity on third-party systems. Owner ruling — wherever a bot identity exists to represent us (on GitHub, the bot the clone's merge-bot config names; a Linear agent actor; ...), every agent WRITE on that system MUST use it: PR creation, PR and issue comments, standalone inline review comments and replies, merges, thread resolutions, label and state edits. Commits and pushes follow the estate's identity contract, which a tracked host surface records (the lane set-up skill's identity step). The rule's action map (owner ruling 2026-08-17) carries the only exceptions, exhaustively: in a detected ChatGPT Work cloud, the configured default credential for the task's delivery writes; a pull-request review submitted through the reviews endpoint or the GraphQL review mutations — APPROVE, REQUEST_CHANGES or COMMENT state, including its body and any inline comments in the same call — under the operator's own credential, because only a human credential discharges a code-owner review gate; and a Copilot review request under the operator's credential where the host's merge-bot reference records that the bot's request does not register. Every other fallback to owner credentials without user-instigated permission is never permitted; a bot capability gap is a blocker to surface, never a licence."
---

# Bot Identity on Third-Party Systems

**TRIGGER — read this line at EVERY write to a third-party system, not at
"merges":** the rule fires on ANY action — a comment, a review reply, a
thread resolution, a PR creation, a label edit — the moment before the call,
as a named credential-selection step: _whose name will this surface
display?_ Three seats in one session (2026-07-26) each filed this rule under
the noun in its tooling's name ("merge-bot") and posted under the owner's
identity at non-merge writes; a fourth (2026-07-31) opened a roll-up PR with
bare `gh pr create` and caught it only at the pre-merge compliance read,
paying a close/recreate and a full checks re-run; the trigger is the WRITE,
never the tool category.

Owner ruling (agreed ~2026-07-21; re-asserted verbatim 2026-07-23): "if we
have a bot identity created to represent us on that system, then we MUST
always use that identity, exceptions are by user permission only and
generally must only be instigated by the user."

On any third-party system where a bot identity exists to represent this
team's agents, every agent-driven action on that system carries the bot
identity **except the action classes the owner has routed to the operator's own
credential, and the commit and push identity each estate's identity contract
names** — enumerated exhaustively in the action map below, and nowhere else.
Reaching for the owner's personal credentials for any action outside that map
is **never permitted** — the unmapped fallback silently attributes agent
work to the owner on every surface the system displays (authorship, activity
feeds, contribution graphs, audit logs).

## Trigger

An agent is about to perform ANY action on a third-party system — creating,
commenting, reviewing, pushing, merging, editing — and a bot identity exists
for that system. The rule fires before the action, at credential-selection
time, not after. It fires on every action; the action map below decides which
credential the action takes.

### ChatGPT Work cloud routing — evaluated first

When the tri-state classifier in
[`cloud-environment-routing.md`](../directives/cloud-environment-routing.md)
selects ChatGPT Work, task-scoped commits, non-force story-branch pushes and
the draft-PR creation/edit/comment writes needed to deliver the task use the
configured default credential — the host's own GitHub credential, which
displays as the owner's identity. Read it first — the TRANSPORT credential, which
is what the remote write displays (`gh auth status` for `gh`; the credential
helper or SSH key for `git push`; the connector's authenticated account for the
connector), never `git config user.email`, which names only the commit author —
so the name the surface will display is known before the write; do not mint,
install, rewrite or repair a bot identity
in this non-execution profile. If shell git has no configured transport
credential, use the already-authenticated GitHub connector. The displayed
operator identity is the accepted consequence of the owner's 8 September 2026
ruling. This row is evaluated before the general map, but it
does not authorise reviews, merges, default-branch writes, protection bypasses,
destructive/admin writes or work beyond the user's task. Content written under
a displayed human credential still identifies itself as agent-authored under
[`identify-as-agent-under-shared-credentials`](./identify-as-agent-under-shared-credentials.md).

## Action (GitHub — the worked mechanics)

Which credential each GitHub action class takes is settled by the action map
below; this section is the mechanics for its bot-credential rows.

Identity values are DERIVED at time of use from an observable source — a
prior bot-authored commit (`git log --format='%an <%ae>'` on a known bot
commit), the repository's shared config, or the owner's word — and never
recalled from memory or filled in with a plausible value. Owner, 2026-07-25,
categorical: "do NOT make up identities." The instance: after a compaction
the summary carried the identity MECHANISM (env-scoped author and committer
variables) but not the values, and a seat confabulated a plausible-looking
bot email that does not exist and pushed three commits under it; the owner
ruled forward-correction only, no mailmap, the fabricated strings standing on
the record. A remembered identity — including any value a record carries — is a
candidate to verify, never a value to use; the smoother the value arrives,
the harder the check.

The bot's login and App id are bindings, not doctrine: the clone's merge-bot
config (`.github/merge-bot.json`, per-checkout and never tracked) holds them,
and the bot-user id is read from the API at the moment of use. Two different
numbers attach to a GitHub App bot and **only one belongs in an email
address**:

| Number          | What it is            | Where it is used                   |
| --------------- | --------------------- | ---------------------------------- |
| the App id      | the GitHub **App** id | app/installation API paths         |
| the bot-user id | the **bot user** id   | the commit email, and nowhere else |

The noreply address takes the BOT USER id:
`<bot-user id>+<bot login>[bot]@users.noreply.github.com`. Worked instance 2026-08-04: the shared repo config was set with the app id, so
the address resolved to no GitHub user at all. It surfaced on Vercel's
deployment list as a three-warning cascade — "Invalid git email address" →
"GitHub User: No matching user" → "Vercel Account: Unavailable" — because
Vercel maps commit email → GitHub user → Vercel account and the chain broke at
the first hop. Confirm the id from the API, never from prose:
`gh api "users/<bot login>%5Bbot%5D" --jq .id`.

- **Commits follow the estate's identity contract**, which a tracked host
  surface records: the lane set-up skill's identity step
  (`set-up-worktree-lane`, step 2), where each estate cites the owner's word
  that set it. The operator profile holds values only and yields to that
  surface
  ([PDR-141](../practice-core/decision-records/PDR-141-operator-profile-in-the-home-directory.md)
  decisions 4 and 5). Where the contract makes the bot the committer, **author and committer are DIFFERENT identities** (owner
  ruling 2026-08-04). Git separates them precisely so a commit can say who
  _authorised_ the work and who _performed_ it, and collapsing both onto the
  agent throws the authority signal away:

  - **committer** = the acting agent, the bot identity the merge-bot config
    names, from the clone's shared local `user.name` / `user.email` (below);
  - **author** = the human on whose authority the work was done, passed
    explicitly per commit:
    `git commit --author="<name> <noreply address>" -F <file>`.

  The owner's framing: _"we are keeping the deploy as is… what we have here is
  a failure to communicate, we need to tell Vercel on whose authority this work
  was done."_ The default stays FAIL-SAFE: `user.*` remains the bot, so a
  forgotten `--author` yields a bot-authored commit (visible, honest, merely
  unattributed to its authority) and never silently credits the owner with
  agent work — the failure this rule exists to prevent. The `Co-Authored-By`
  model trailer stays, so the acting model is named in the message body too.
  Where the contract makes the operator's shared identity author and
  committer, the same trailer names the acting model, and a push is
  attributed by its commits.

- **Where the bot commits, its identity config lives in the clone's shared
  local config** — `.git/config`,
  written once with a plain `git config user.name …` / `user.email …` (owner
  ruling 2026-08-04: _"keep the bot identity locally shared, not in version
  control"_). One clone, one copy: every worktree inherits it, a newly created
  worktree needs no identity step, and no per-worktree duplicate can survive a
  correction to the shared value. A plain `git config user.*` write reaches
  this scope even with `extensions.worktreeConfig` enabled, so the ordinary
  command is the correct one.

  The shared config is written once, at the clone's primary checkout, from the
  derivation below; a worktree only checks that it inherited the result (the
  `set-up-worktree-lane` skill, step 2):

  ```bash
  # The merge-bot config is per-checkout and never tracked, so it lives only at
  # the clone's primary checkout; a linked worktree holds no copy of it. Every
  # derivation is checked before the shared identity is written: an empty slug
  # or id would otherwise land as "[bot]" while the block exits clean.
  PRIMARY="$(git worktree list --porcelain | head -1 | sed 's/^worktree //')"
  CONFIG="$PRIMARY/.github/merge-bot.json"
  [ -n "$PRIMARY" ] && [ -f "$CONFIG" ] \
    || { echo "no per-checkout config at $CONFIG (copy .github/merge-bot.json.example there)"; exit 1; }
  BOT_SLUG=$(jq -r .appSlug "$CONFIG")
  [ -n "$BOT_SLUG" ] && [ "$BOT_SLUG" != null ] \
    || { echo "appSlug missing from $CONFIG"; exit 1; }
  BOT_ID=$(gh api "users/${BOT_SLUG}%5Bbot%5D" --jq .id)
  [ -n "$BOT_ID" ] && [ "$BOT_ID" != null ] \
    || { echo "no bot user id for ${BOT_SLUG}[bot] from the GitHub API"; exit 1; }

  git config user.name  "${BOT_SLUG}[bot]"
  git config user.email "${BOT_ID}+${BOT_SLUG}[bot]@users.noreply.github.com"
  ```

  Derive the id, never transcribe it — the address embeds the **bot user id**,
  not the app id, the two sit near each other in the docs, and the wrong one
  produces an address that resolves to no GitHub user at all. A literal id
  copied into a document is a second copy of a fact that already lives
  somewhere authoritative, and the copy is the one that goes stale: the
  identity produced by this sequence is correct by construction, one
  transcribed by hand was wrong for days. Because there is exactly one copy,
  fixing it cures every worktree at once.

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

- **Pushes** go through the transport the estate's identity contract names.
  Where that is the bot, the front-door command, which mints its own token
  and hands the transfer to the git binary (no force, no `--no-verify`,
  default-branch targets refused):

  ```bash
  pnpm agent-tools merge-bot push
  ```

  A plain `git push` over the machine's SSH key or stored credential
  displays that credential's owner: the transport is the identity that
  displays on the push. Where the contract names the bot as the transport,
  that push is the owner-credential fallback this rule bans, even when every
  commit is bot-authored (self-caught 2026-08-19 after two
  coordination-branch pushes; every push from that seat went through the
  front door thereafter). Run the front door with the primary's built
  binary from the target worktree.

- **PR creation, PR comments, thread replies, thread resolution, marking a
  draft ready, closing** — the typed front door, which mints the token itself
  and refuses by type (`pnpm agent-tools merge-bot pull-request <verb>`;
  `.agent/reference/merge-bot.md` §Writing on a pull request's conversation).
  **Every other bot-credential row of the map** (editing a title or body, a
  standalone inline review comment, update-branch): a minted installation
  token exported as `GH_TOKEN` for the `gh` invocation. **Assign it first and
  stop if the mint fails** — never the `GH_TOKEN=$(…) gh …` prefix form:

  ```bash
  token=$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work) || exit 1
  [ ${#token} -ge 20 ] || exit 1
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
     codes. Identity-bearing writes run from a checkout with a built
     `dist`, as one plain command (a scratch wrapper where a worktree guard
     refuses `$(…)`); `pwd` is one token.
  2. **Guard the token by LENGTH, not exit code** (`[ ${#token} -ge 20 ]`)
     — an empty read is a failure whatever the exit code.
  3. **Prove the credential before the first write** — a read-only
     status read, then a stop unless it is the installation's answer:

     ```bash
     out=$(GH_TOKEN="$token" gh api -i user 2>/dev/null || true)
     code=$(printf '%s\n' "$out" | awk 'NR==1{print $2}')
     [ "$code" = 403 ] || exit 1
     printf '%s' "$out" | grep -q 'Resource not accessible by integration' || exit 1
     ```

     An installation token answers 403 with "Resource not accessible by
     integration" in its body. A human credential answers 200 with its
     login, and an empty token falls back to the stored login and answers
     200 the same way; a broken token answers 401 or nothing. A human
     credential can also answer 403, on a rate limit, so the body decides,
     not the code alone. The call exits 0 only on a 200, so its exit code
     cannot tell the installation's 403 from a 401 or a rate-limited 403,
     and the capture's `|| true` keeps an expected non-zero exit from
     stopping the block under errexit (the installation's 403, the empty
     token's 200 and a broken token's 401 verified 2026-09-26). The
     variable is never `status`, which zsh reserves: the assignment fails
     there as `read-only variable: status`. An empty `GH_TOKEN` is invisible at the
     call site; the preflight turns a silent misattribution into a stop
     before anything is written. A read of the author after the write
     detects and cures nothing: a PR created under the ambient owner
     credential was caught by an echo that ran AFTER the write, and the
     cure was close-and-recreate under the bot (2026-08-18). After a
     write, the timeline actor confirms it (2026-09-01).

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

Before surfacing a blocker, check where the bot App is installed against
the pull request's BASE repository and where its head lives. Bot and
reviewer tooling act on the repository the App is installed on: a seat's
OWN work whose head sits on a repository the App does not cover refuses
three ways at once — the bot with no access to that head, the
review-request tool with a 403, the REST reviewer endpoint silently
dropping the handle — and the cure for that case is re-homing the head
onto a branch of the repository the tooling acts on, after which every
instrument works unchanged (under an hour, 2026-09-01). Three failures
with one cause are a topology fact, never three blockers. An external
contributor's fork head is the normal shape and is never re-homed: the
workflows run a cross-repository head with a read-only token and no
secrets by design, and moving such a head into the shared repository
would hand it the shared repository's secrets — the blocker there, if any,
is surfaced, not cured by relocation.

## The action map (owner ruling 2026-08-17) — general, not per-seat

Owner ruling, 2026-08-17, verbatim, its accounts given as roles:

> [the team bot] for commits/PR raises ... [the maintainer's own account] for
> reviews/approvals

Stated portably: **a pull-request review is performed under the operator's own
credential; commits, PR raises, and every other write are performed under the
bot identity.** An estate's identity contract may route commits and pushes to
the operator's shared identity instead, and the map's commit row follows it.
It is not a per-seat grant, and no seat needs its own version of it.

**The discriminator is the review-submission operation, never the noun in the
action's name.** Anything submitted as a pull-request review — the REST reviews
endpoint (`POST /repos/<org>/<repo>/pulls/<n>/reviews`) or the GraphQL
`addPullRequestReview` and `submitPullRequestReview` mutations — is a review,
whatever state it carries, and whatever body or inline comments travel inside
the same call. One
call, one credential: a review's body has no credential of its own, so an
approval that carries a body and a changes-requested review each have exactly one
path. Every other write on the system is an ordinary write.

The map below is exhaustive and its rows do not overlap. Read the row, not the
noun.

| Action | Credential | Why this row |
| --- | --- | --- |
| Task-scoped story-branch and draft-PR delivery writes in detected ChatGPT Work cloud | configured default (the host's own GitHub credential, displayed as the owner's identity; read before the write) | first-priority non-execution route; excludes reviews, merges, bypasses and destructive/admin writes |
| Review submitted as `APPROVE` | operator | only a human review supplies the approval a code-owner ruleset waits on |
| Review submitted as `REQUEST_CHANGES` | operator | same operation, same gate: a bot's changes-requested neither discharges the human review request nor registers with the ruleset |
| Review submitted as `COMMENT` state | operator | same operation; it discharges the review request assigned to the human |
| The **body** of any review, and any inline comment carried inside the same submission | operator, inseparably — it is one API call | see the discriminator above |
| A **standalone** inline review comment or thread reply (`POST …/pulls/<n>/comments`, `POST …/pulls/comments/<id>/replies`) | bot | not a review submission: it discharges no request and sets no review state |
| An ordinary PR or issue comment (`POST …/issues/<n>/comments`) | bot | as above — a comment is a write, not a review |
| Requesting or re-requesting a review **from a human** | bot | an ordinary mutating write, accepted from the bot installation token |
| Requesting a review **from Copilot** | the bot where the host's merge-bot reference records its request registering, else the operator's credential | the endpoint accepts `copilot-pull-request-reviewer[bot]` from the app's pull-request-work token (201), and whether the request then registers differs by installation; the host's reference records which holds, and the timeline's `review_requested` event proves each request (the requested-reviewers list never shows the bot reviewer); where the bot's request does not register, the operator's credential makes it under the 2026-08-06 grant below |
| Commits and pushes | the estate's identity contract, which a tracked host surface records (the lane set-up skill's identity step) | where the contract names the bot, the mechanics above; where it names the operator's shared identity, the model trailer carries the attribution |
| PR creation, merges, thread resolutions, label and state edits, and every other `gh api -X POST/PATCH/DELETE` | bot | the closed default: nothing reaches the operator's credential except a row above |

The trigger is the **write**, at credential-selection time, never the tool
category.

**Why the review rows are a capability boundary rather than an inconsistency.**
Under a code-owner review ruleset, a review posted by a bot neither discharges a
review request assigned to a human nor supplies the approval the ruleset is
waiting on — so a bot-posted review leaves the pull request exactly as blocked as
before. The operator's credential is the only one that can clear that gate. The
split is forced by mechanism, not chosen for convenience.

**Which bot and which human** are deliberately not stated here. The bot is
the clone's merge-bot config; the human is the operator, whom the operator
profile in the home directory describes
([PDR-141](../practice-core/decision-records/PDR-141-operator-profile-in-the-home-directory.md):
`~/.practice/profile/index.md` and the repository's scope file). This rule
owns the portable mapping; the config and the profile own the bindings. A rule that hard-coded
one person's accounts would be false on every other machine (`principles.md`
§Any User, Any Machine).

Three riders bind the operator-credential rows. The first and third bind the review
rows; the second binds every write under a human credential, save a commit, whose
`Co-Authored-By` model trailer is its marker:

- **The credential is licensed, never the judgement.** An agent reviews
  first-hand before approving. The grant permits posting a review, never
  posting one it has not earned.
- **Content written under a human credential must state that an agent wrote
  it**, and name the seat, per
  [`identify-as-agent-under-shared-credentials`](identify-as-agent-under-shared-credentials.md).
  The credential displays the human; the words must not let a reader conclude the
  human wrote them. The grant makes this requirement stronger, not weaker.
- **The author-cannot-review intersection applies.** GitHub forbids the author of
  a pull request from approving it or requesting changes on it; a `COMMENT`
  review stays open to the author. So on a PR authored by the same human
  account the review would be posted under, the `APPROVE` and
  `REQUEST_CHANGES` rows yield no usable path: the agent's review of record
  rides a `COMMENT` review (operator, per its row) or an ordinary PR
  **comment** (bot, per the map), and any `APPROVE` or `REQUEST_CHANGES` state
  needs a different non-author account. Route that case rather than working
  around it.

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

- **Copilot review requests (granted 2026-08-06)** — the owner's word,
  verbatim, stays on record: "there is standing permission to use my/user
  credentials for requesting reviews from copilot." Where the bot's own
  request registers, the grant has nothing to license: the bot requests
  Copilot AS ITSELF with the REST `requested_reviewers` endpoint under the
  app's pull-request-work token (201; `review_requested Copilot` fires on
  the timeline, and the requested-reviewers list never shows the bot
  reviewer). Where the host's merge-bot reference records that an
  installation's request does not register, this grant is the route, and the
  operator's credential makes the same call. The worked commands, each
  bound to its credential (a bare `gh api` would take whatever the keyring
  holds):

  ```bash
  # As the bot, after tripwire 3's preflight on $token:
  GH_TOKEN="$token" gh api -X POST repos/<org>/<repo>/pulls/<n>/requested_reviewers \
    -f "reviewers[]=copilot-pull-request-reviewer[bot]"
  # Under the grant, where the host's merge-bot reference records that the
  # bot's request does not register. `gh auth token` prints an exported
  # GH_TOKEN, and without --user the active account's token, so the
  # operator's stored token is read by the operator's login (the operator
  # profile names it) with both token variables removed from its environment:
  op=$(env -u GH_TOKEN -u GITHUB_TOKEN gh auth token --user "<operator-login>") || exit 1
  [ ${#op} -ge 20 ] || exit 1
  GH_TOKEN="$op" gh api -X POST repos/<org>/<repo>/pulls/<n>/requested_reviewers \
    -f "reviewers[]=copilot-pull-request-reviewer[bot]"
  ```

  The grant was never precedent for any other fallback.

## History and grandfathering

History pushed under owner credentials before the 2026-07-23 re-assertion
stands (rewriting pushed history is separately banned). Live visible surfaces
are cured by recreation, not rewrite — worked instance (2026-07-23): a pull
request opened under owner credentials was closed and recreated under the
bot identity on the same branch; the bot-authored commit
and bot-token push were verified end-to-end the same hour.

## Personal per-person ambient bots

The shared team bot is not the only sanctioned identity. An individual may run
their OWN GitHub App as a personal, machine-local ambient git identity for their
own agent sessions — worked instance (2026-08-04): one maintainer's own App,
wired on that maintainer's machine as the ambient commit-author and push
credential for one repository through a machine-local `includeIf`. Its
mechanics and key live only on that machine (`~/.config/<slug>/`), never in a
repository, and the operator profile names it.

The reverse reading matters too: a maintainer's own GitHub identity is a
person, often driven by that maintainer's bots (the owner's word of
2026-09-01, of one such account). Nothing on the surface distinguishes a
review the maintainer wrote from one their agents wrote, so never describe the
account as "a bot" — say "a review under that maintainer's identity" — and
treat its findings on the merits like any reviewer round (harvest, verify,
cure or refute), never as a human gate to wait on: on one PR three
changes-requested reviews under that identity were the maintainer's agents'
and confused, and the owner merged over them; on another both rounds were
correct. When a changes-requested review under that identity blocks a
ruleset merge, the owner-sanctioned path (2026-08-17, conditional) is "if
you can honestly say that the requested changes are made then dismiss the
comment" — the honesty condition binds PER ROUND: read every standing round
in full first, and a newer round with unmet asks blocks the dismissal until
cured. That identity's bots do not necessarily re-review on demand (owner,
2026-08-18: "Copilot should re-assess on demand"); when a prompt
re-assessment of a cured head is wanted, fire a Copilot re-request and watch
for both.

This does not weaken the shared-bot contract above; it refines the attribution
model:

- **Team surfaces use the shared bot.** Shared-repo PRs, doctrine changes,
  merges, and any action taken as the team use the shared bot the clone's
  merge-bot config names, per the mechanics above. A personal ambient bot is
  for an individual's own agent work, not for acting as the team.
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
  exceptional cases, for the operator rows of an estate's identity contract,
  and for seat-level attribution (the bot identity is shared by all seats, so
  content still names the acting agent per PDR-027).
- [`rules-have-no-exceptions`](./rules-have-no-exceptions.md) — the exception
  path here is the owner's word, not agent judgment.
