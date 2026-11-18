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

A GitHub App (this clone's is named in its per-checkout `.github/merge-bot.json`,
created from [`.github/merge-bot.json.example`](../../.github/merge-bot.json.example))
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

**The sanctioned bot-merge path is the front-door command** (MCP-508):

```bash
pnpm agent-tools merge-bot merge --pr <n> --expect <reviewer>
```

It mints its own least-privilege token (`pull-request-merge`), reads the
settlement verdict, and merges ONLY on SETTLE-READY — merge-commit method
always, the VERDICTED tip's sha pinned in the call (a moved tip answers
409), refusing by verdict name on everything else with exit 3. `--expect`
is required (`--expect none` declares the set EMPTY: the seat has judged, by
the owner's one question of 2026-10-27 — "do we need a review in order for
this work to be safe and effective?" — that the work needs no pull-request
review, and the merge evidence names the declaration); otherwise source it
from the repository's automatic-review
configuration, declaring the reviewers AVAILABLE — a vendor declared
unavailable on the stream (an outage, such as the Codex connector's
2026-09-10 usage-limit notice) is not declared, and a subagent review
posted on the pull request stands as its leg, bound to the sha it reviewed
as the vendor leg is bound per tip — the premises record that sha and the
pushes since, which carry only cures of its findings, the tip sync and
landing-defect cures, else a fresh leg on the new head (owner ruling
2026-09-10; pr-lifecycle §review-round state machine item 3); a defaulted
set never merges. The tool verifies only the vendor legs declared to it and refuses
an empty set: the availability rule and the posted subagent leg are the
merging seat's own recomputation, recorded on the landing premises (a
machine-checked subagent-leg input is the named follow-up on the
agent-tools-watch-commands node). `merge-bot merge --help` carries the
tool's own contract — the declared vendor set and the verdict names.

**Why the REST endpoint, not the `gh pr merge` client** (the command does
this for you): client-side `gh pr merge` refuses on a
BLOCKED/viewer-independent mergeability state, and GitHub auto-merge does
NOT apply ruleset bypass grants — yet the bot's code-owner-gate bypass IS
honoured at the REST layer. So at genuinely-settled the command merges via
`PUT /repos/{owner}/{repo}/pulls/{n}/merge` (merge-commit method, never
squash), recomputing the whole settlement verdict — checks, threads,
suppressed body findings (a tip-bound review body's suppressed count holds
the merge until each finding is cured or rejected by a signed disposition
line from the repository owner or the pull request's author, or a later
review on a later tip carries none; the fourth
measured-state clause, `SUPPRESSED-FINDINGS-OPEN`, owner card item 78,
2026-09-14; the hold lifts on ONE signed comment posted after the latest
tip-bound review, carrying one line per finding in the ratified format, the
marker, the finding's reference, "item N of M" and the verb, followed by a
bot poll and no push, since a push would move the tip and start a new
round), per-reviewer legs, outstanding requests, live runs — inside the same invocation, because a
bot review can land in the seconds between (caught twice in forty
minutes, #570/#574).

The bot's writes on a pull request's conversation are one typed command,
`merge-bot pull-request` (§Writing on a pull request's conversation below):
opening a draft, commenting, replying on a review thread, resolving a
thread, marking a draft ready, closing with a reason. Pushes where the
estate's identity contract names the bot as the transport are
`merge-bot push`. For the bot writes no typed command carries yet (editing a
title or body, update-branch, a reviewer request), mint a token and use it:

```bash
token=$(pnpm --silent agent-tools merge-bot mint-token --scope pull-request-work) || exit 1
[ ${#token} -ge 20 ] || exit 1
```

**Assign the token first; never use the `GH_TOKEN=$(…) gh …` prefix form.**
[`bot-identity-on-third-party-systems`](../rules/bot-identity-on-third-party-systems.md)
§Action holds why (an empty `GH_TOKEN` falls back to the keyring and runs as
the signed-in human) and the three tripwires that close the residual paths.

Each minted token is scoped at mint time to this repository and to exactly
the permissions of the `--scope` you name — least-privilege by construction,
even if the app is ever installed more widely, and a strict subset of
whatever the installation itself grants.

`--scope` is **required and has no default**. A token carries only the
permissions its mint requests, so a default would make the most privileged
scope the silent one — which is how a read-only need came to be served by a
three-write token (MCP-385). The scopes, and the evidence for each member,
are defined in `agent-tools/src/merge-bot/token-scopes.ts`:

| scope                  | permissions                                                   | for                                                                           |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `pull-request-work`    | `pull_requests: write`, `contents: write`, `workflows: write` | update-branch, push, PR create/edit (what `merge-bot pull-request open` mints) |
| `pull-request-conversation` | `pull_requests: write` | comment, review reply, thread resolution, the ready mark, the close (what `merge-bot pull-request` mints for those verbs) |
| `pull-request-merge`   | `pull_requests: write`, `contents: write`                     | the merge act alone (what `merge-bot merge` mints itself)                     |
| `code-scanning-alerts` | `security_events: read`                                       | reading code-scanning alerts                                                  |
| `workflow-dispatch`    | `actions: write`                                              | dispatching a workflow; re-running a failed job                               |
| `branch-retire`        | `contents: write`                                             | deleting a merged branch ref (what `merge-bot retire` mints itself)           |
| `branch-read`          | `contents: read`                                              | reading a repository's default branch and a branch ref; no write of any kind  |

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
`403` on the WRITE while reads still succeed; on the REST API the same expiry is a
`401` mid-batch (2026-09-05: merges, thread resolutions and comment writes past the
hour, reads still succeeding) — mint again and repeat the batch from the failed call. Mint, auth-probe, and push in
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
  self-approval, so the owner's word is recorded as an ordinary PR comment from
  the bot that quotes it and names the seat (the rule's author-cannot-review
  rider); an `APPROVE` state needs a non-author account.
- **Codex-seat bridge**: the Codex GitHub connector refuses merge actions
  without in-session owner authorisation, so at genuinely-settled a Codex
  lane routes the mechanical key-turn to the Director as proxy — judgment
  stays with the lane seat.

`pull-request-work` is wider than PR create/edit needs: only merge, push and
update-branch need `contents`/`workflows`. The conversation writes (comments,
review replies, thread resolution, the ready mark, the close) are
`pull-request-conversation`, `pull_requests: write` alone, since 2026-10-29:
the MCP-391 split, made at the review of `merge-bot pull-request` and proved
on that command's own pull request, the GraphQL mutations included. Read
`pull-request-work` as honest for the span as named.

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
clone's bot (`appSlug`, `appId`, `repo`). It is **per-checkout and never
tracked** (owner ruling 2026-09-03): each clone names its own app, so the file
is gitignored and the tracked surface is the template
`.github/merge-bot.json.example`, copied and filled in once per clone. The
tools read it at the clone's **primary checkout** — a linked worktree holds no
copy of an untracked file, so resolving there is what lets every worktree
share the one copy, the same way the collaboration home resolves. The private
key lives outside every repo at `~/.config/<appSlug>/private-key.pem`, derived
from that config. The `mint-token` flags (`--app-id`, `--private-key-path`,
`--repo`) are explicit operator overrides for cross-repo use or testing — not
a resolution tier; `merge` and `push` take no identity flags.

The file is machine state, not a secret: it holds only the app's public
identity, and the schema is strict (`appSlug` is a lowercase slug, so it can
only ever name a directory under `~/.config/`). Because it is untracked, a
clone's copy is not diffable or restorable from history — recreate it from
the template.

**Clones that predate the untracking** (the file used to be tracked): the
merge that removed it from version control also removes the working-tree
copy on the next fast-forward, and the ignore rule then hides its absence, so
the very next `merge-bot` command exits 2 with the config-not-readable
message. Recreate the file at the primary checkout from the template, naming
the app that clone used, before the next merge or push.
The installation holds `actions: write`, and the `workflow-dispatch` scope requests it, so a bot
token can dispatch a workflow and re-run a failed job. The mint is the proof: an ungranted
permission fails it with 422, and a `workflow-dispatch` mint succeeded on 2026-09-25. When a
required check failed on the runner side rather than in the change (2026-09-06), the only cure
taken was a new push, and that push re-opened the review round. Whether a re-run should be a
routine bot act travels with the MCP-391 scope split.

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
6. Create this clone's `.github/merge-bot.json` from
   `.github/merge-bot.json.example`, naming the app (the file is per-checkout
   and never tracked; a clone whose bot changes edits its own copy), and
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
The conversation writes are the typed command, which mints the token itself:

```bash
pnpm agent-tools merge-bot pull-request open --branch <name> --title <text> --body-file <path> --wip-limit <n>
pnpm agent-tools merge-bot pull-request reply --pr <n> --comment <id> --body-file <path>
pnpm agent-tools merge-bot pull-request resolve --pr <n> --thread <node-id>
```

Reads may use any credential — attribution matters for writes. Agents keep
signing reply bodies with their agent tuple: the bot identity says "an
agent did this", the signature says which one. A maintainer acting from
their own hands uses their own credential — that contrast is the point.

**Requesting the Copilot reviewer is the one write the bot cannot make
here.** A `requested_reviewers` POST for `copilot-pull-request-reviewer`
under the bot token registers nothing on the pull request; the owner's own
CLI credential registers it on the timeline within a minute
(`gh pr edit <n> --add-reviewer @copilot` as the operator), unless the
previous request's review is still in flight, when it registers nothing
either (both verified live, 2026-09-13; the operator form re-verified
2026-09-27). Where an API call names the reviewer, its login is
`copilot-pull-request-reviewer[bot]`; omitting the `[bot]` suffix returns
422 (2026-08-12). Read the timeline after any request: silence from the
request call is not a registered request. The request, once registered, is
what the settlement reads as the round in flight: it is visible only on
the GraphQL `reviewRequests` connection (gh's `pr view --json
reviewRequests` and the REST endpoint omit Bot requests), which is why
`pr state` reads requests there and why an expected reviewer with an
outstanding request reads `WAITING-REVIEW-RUN-LIVE` until the review lands
or the checks-green timeout arm ends the leg.

**At most one review request per settlement push, and only for a stated reason.** A review round is spent by a
request, and on a repository without an on-push review ruleset every
request is the seat's own act under the operator's credential: PR #62 took
twenty-one explicit Copilot requests in four hours, one every ten to twelve
minutes, while PDR-140 sat in the estate unapplied (2026-09-15). Request
the review at most once per push that settles a round (a cure, a shape change), and
only for a stated reason; a pure sync push (main merged in, a rebase with no content change) requests
nothing, and the declared intake on the pull request body bounds the loop.

**What is owed is read from the repository's review configuration.** `pr
state` reads the base branch's rules (`GET
/repos/{owner}/{repo}/rules/branches/{base}`, the `copilot_code_review` rule;
Metadata read suffices) with every reading and names the result in its
evidence. Where the rule reviews no later push (`review_on_push` false, the
owner's setting of 2026-10-15), a tip nothing is requested on, once the vendor
has reviewed an earlier tip of the pull request, reads `UNOWED` and settles; a
round whose threads are all resolved then merges with no request made. A
request by hand makes the leg owed again, so the round stays the seat's to
spend. An unread or absent configuration keeps every expected leg owed, named
as such in the evidence (the owner's word of 2026-10-16: derive what is owed
from the configuration, never from an assumed review on every push).

## Verifying the bot's signatures locally

GitHub verifies the bot's SSH-signed commits against the key registered on
the bot account, so a local `git log --show-signature` reports
`No signature` or an unknown key whenever the checkout has no
`gpg.ssh.allowedSignersFile` configured; that readout is about the local
configuration, not the commit. Before classing a bot commit unsigned, either
verify it through GitHub (`gh api repos/<owner>/<repo>/commits/<sha>
--jq .commit.verification`) or configure an allowed-signers file, one line
per identity (`<committer-email> <key-type> <public-key>`) at a path named by
`git config gpg.ssh.allowedSignersFile`, and read the log again
(2026-08-12: commits GitHub verified read as unsigned locally for exactly
this reason).

## Key handling

The `.pem` grants the bot's full capability: keep it out of every repo,
never paste it into chat or logs, and rotate it from the app's Private-keys
section if exposure is ever suspected. The minting CLI prints the token to
stdout only (expiry to stderr) so command substitution never leaks extras.

`--json` is the exception: it bundles the token into the printed object, so
that output is as sensitive as the token itself and must not be pasted
anywhere the plain form would be safe.

Tokens never ride a URL or argv — both are visible in the process list to
anything that can read it — and the push keeps them out of the child
environment too: git exports that environment to the whole pre-push hook
chain, and an env dump there must never print a live token. The
front-door push carries this discipline as behaviour:

```bash
pnpm agent-tools merge-bot push
```

It mints its own token, resolves the current branch from git itself,
writes the token to a private file in a private directory that lives
exactly as long as the transfer (owner-only per the platform-qualified
statement in `agent-tools/src/merge-bot/push-token-file.ts` — 0600 applies
on POSIX), and hands the transfer to the git binary with a
static credential helper reading that file — the child environment names
only the file's path. Never argv, no force flags, no `--no-verify`, and
the push writes exactly one ref, the full `refs/heads/<branch>`: no tag
or submodule ref follows it. Pushes to the default branch refuse, in any
case: `main` and `master` by name, then whatever branch
`refs/remotes/origin/HEAD` names, read only when `origin` has one URL and
it is the repository the push goes to, over `https` or ssh (an origin read
over plain `http` is not trusted). That read is a snapshot a fetch
does not move, so after the repository's default branch changes, run
`git remote set-head origin --auto`. Where the configured repository's
ruleset on the default branch binds the bot, as this repository's does,
GitHub refuses a direct push either way. An unreadable default branch,
or an `origin` that is not that one repository, fails the push (exit 1)
rather than guessing. So does a checkout that changes branch while the
target is settled: the branch and the commit are one snapshot of HEAD (see
[`bot-identity-on-third-party-systems`](../rules/bot-identity-on-third-party-systems.md)).
With `--branch`, the branch named must be the one HEAD is on: the push
writes HEAD's commit under the name given, so another name is a typed
refusal (exit 3) and nothing is minted or pushed. On 2026-10-28 a push named
the coordination branch from a lane's worktree, and the coordination
branch's remote tip became that lane's commits; the refusal is the cure.

GitHub has refused a freshly minted token's push at its first request,
before git runs the pre-push hook. The transcript is these two lines and
nothing else:

```text
remote: Permission to <repo> denied to <bot>.
fatal: unable to access '<url>': The requested URL returned error: 403
```

GitHub refuses a fresh installation token until it has replicated to every
one of its edge caches, and advises retrying at increasing intervals
(GitHub Support, as quoted in aws-amplify/amplify-hosting#4080). The push
therefore mints one token and tries the transfer again with that same token
after each wait in `PUSH_RETRY_WAITS_MS` (`agent-tools/src/merge-bot/push-attempts.ts`),
naming each retry on stderr. A fresher token would only start the wait
again. Every attempt pushes the same commit, settled from HEAD before the
mint, so a commit made during the waits is never pushed in its place. When
the waits run out, it reports an operational failure with every refusal
shown. Any other failure is final at once, including a 403 after the hook
ran: trying that again would run the whole gate again. The refusal check
keeps a bounded copy of the push's output (`REFUSAL_TRANSCRIPT_BOUND`, same
file); the output itself reaches stderr in full.

Two things are checked before each attempt, the first included
(`agent-tools/src/merge-bot/push-attempt-guards.ts`); either stops the push
as an operational failure:

- The token's own stated expiry leaves five minutes to start in. One token
  serves every attempt, so the waits count against it. A gate that runs
  longer than the token has left still meets the expiry: GitHub's refusal
  then comes after the hook ran, and is final.
- HEAD still names the settled commit. The pre-push hook validates the
  checkout, never the commit git is handed, so an attempt made after HEAD
  moved would land a commit the gate did not run on.

## Retiring a merged branch

`merge-bot retire` deletes every name a merged branch has: the local
branch, its cached `origin` tracking ref and the remote branch. It deletes
them only once each is proven an ancestor of the remote default branch's tip:

```bash
pnpm agent-tools merge-bot retire --branch <name>
```

- Every proof runs before any delete. No read writes a ref the command may
  delete: a remote branch's objects arrive by an objects-only fetch.
- Every read and write of the branch's names and commits runs with
  replacement refs and grafts off (`GIT_NO_REPLACE_OBJECTS=1`,
  `GIT_GRAFT_FILE=/dev/null`). Either can give a commit parents it does not
  have, and a planted one would make an unmerged tip read as merged. The two
  git reads before those, the `--branch` check's ref-format oracle and the
  primary-checkout lookup, read no commit.
- The remote branch goes first, as the bot, through GraphQL `updateRefs`
  with the proven sha as `beforeOid`. That is a compare-and-swap on the
  server, so a push landing after the proof is kept. The token is minted
  only when a remote delete is due, with the `branch-retire` scope.
- At the mint, GitHub must read the branch tip, and the default branch's
  name and tip, in the bot's repository exactly as they were proven. This
  binds the proofs to the repository the delete lands in, even when git's
  traffic to `origin` is rewritten (`insteadOf`).
- The remote delete's outcome is read back through GitHub, never taken from
  GitHub's answer to the delete. The local names are deleted by
  compare-and-swap (`update-ref --no-deref`) only once the remote reads back
  absent, so a failure part-way leaves a state a re-run finishes. The
  branch's config section goes once the branch has no local ref, as
  `git branch -d` removes it; a section a failed removal left goes on the
  re-run. The local name is read again just before the removal, once and
  raw (`show-ref --exists`, so a dangling symbolic name counts), and a name
  made since the proof keeps its section. The window between that read and
  the removal is git's own: `git branch -d` has it too, since git keeps refs
  and config in two stores with no joint write.
- The outcome reports each name as proven and as this run's own writes left
  it. A name another writer makes after the proof is not in it: "absent"
  means the name did not exist at the proof and this run deleted nothing
  there.
- It refuses (exit 3, nothing deleted):
  - a default branch;
  - a tip that is not on the default;
  - a branch in use in any worktree (checked out, or named by a rebase or
    bisect), read at the proof and read again just before the local
    deletes; a worktree that takes the branch between that last read and
    the delete is a race git itself has, since `git branch -d` also checks
    before it deletes;
  - a local or tracking ref that is symbolic;
  - a name another ref matches when case is ignored;
  - an `origin` that is not the bot identity's repository;
  - a remote, or a default branch, that GitHub reads at the mint as moved
    after its proof.
- A failure (exit 1) after a delete may have happened reports every name:
  deleted, absent, kept (it moved, or was re-created, at the sha it holds),
  failed (the delete did not take), unknown, or not reached. A delete GitHub
  does not accept, whose read-back finds the branch at another sha, is such a
  failure, never a refusal: GitHub's error cannot say whether a delete
  happened first. A worktree that
  cannot be asked for its rebase and bisect state, a prunable one included,
  fails the run until it is repaired or pruned. The origin URL itself is
  never printed, only the repository parsed from it.
- Whether a branch is wanted is the caller's judgement; the command checks
  no pull request.

## Writing on a pull request's conversation

`merge-bot pull-request <verb>` makes the bot's writes on a pull request's
conversation, and its workflow dispatch, each invocation under one
installation token it mints itself at the scope that verb needs. It replaces
the `token=$(mint)` and `GH_TOKEN="$token" gh …` shell lines for these
writes, which a worktree's Bash guard refuses as a compound command and
which cannot fail fast:

```bash
pnpm agent-tools merge-bot pull-request open --branch <name> --title <text> --body-file <path> --wip-limit <n>
pnpm agent-tools merge-bot pull-request comment --pr <n> --body-file <path>
pnpm agent-tools merge-bot pull-request reply --pr <n> --comment <id> --body-file <path>
pnpm agent-tools merge-bot pull-request resolve --pr <n> --thread <node-id>
pnpm agent-tools merge-bot pull-request ready --pr <n>
pnpm agent-tools merge-bot pull-request close --pr <n> --reason-file <path>
pnpm agent-tools merge-bot pull-request dispatch-workflow --workflow <file-name>
```

- The verb set is closed, and so is each verb's flag set: an unknown verb or
  flag, a missing or repeated flag, a `--pr` that is not a positive integer,
  each is a usage refusal (exit 2) naming what was expected, with the usage
  text. `merge-bot pull-request --help` is the contract.
- Every body or reason file is read from disk and sent verbatim; an empty
  file refuses (exit 3) before anything is minted.
- `open` writes a DRAFT from the branch into the repository's default
  branch, read from GitHub. It refuses (exit 3, writing nothing) when the
  remote does not hold the branch, when an open pull request already has
  that head, or when the open lanes number at or above `--wip-limit`: a lane
  is an open pull request whose head is not a `coordination/` branch and
  whose author is not Dependabot (neither is a lane under the
  work-in-progress limit; every other author's counts). The limit is
  REQUIRED: it is the seat's to state, so it has no default.
- `resolve` reads the thread first and refuses one that is not on that pull
  request or is already resolved; `ready` refuses a pull request that is not
  an open draft; `close` posts the reason as an issue comment, then closes,
  and refuses before either write when the pull request is not open.
- Each verb mints the scope it needs and no wider (`token-scopes.ts`):
  `open` the `pull-request-work` span (its branch read needs `contents`);
  `comment`, `reply`, `resolve`, `ready` and `close` the
  `pull-request-conversation` scope, `pull_requests: write` alone.
- `dispatch-workflow` dispatches `.github/workflows/<file-name>` on the
  repository's default branch, read from GitHub, under a token minted at the
  `workflow-dispatch` scope, since a dispatch needs `actions: write` alone
  and the scopes stay apart. It refuses (exit 3) a name that is not a plain
  `*.yml` or `*.yaml` basename, and answers a status other than 204 as an
  operational failure naming it. The cross-fork-integration skill's carrier
  dispatch is its first consumer.
- Exit map: 0 done, 1 operational failure (GitHub answered a status other
  than the one expected, named with GitHub's message; or the mint, a file
  read or the network failed), 2 usage, 3 typed refusal. `--json` puts
  exactly the outcome object on stdout.
- The repository is the bot identity's, from `.github/merge-bot.json` at the
  clone's primary checkout. Identity resolution and the mint are the ones
  `merge-bot push` and `merge-bot retire` use.
