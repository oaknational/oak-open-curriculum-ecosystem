---
classification: core
description: Unattended seats never prompt — the tracked settings carry no ask rules (asks become denies, which route to the Director); one plain command per Bash call; no git outside the estate's registered worktrees; never rm -rf. The Director's deadline-and-default is the other half of the cure.
---

# Unattended Seats Never Prompt

Operationalises the PDR-044 trip-list contract carried by the Bash guard in `.agent/hooks/policy.json` (the Bash guard's
teaching deny list, which this rule extends with the filesystem-destruction
concept) and PDR-009's tracked platform-settings model; the directing
decisions are the owner's words of 2026-09-08 and 2026-09-09 quoted below.

A permission prompt is a hold. A seat cannot see that it is held — from
inside, the call simply has not returned — and nobody is at the terminal
to answer for most of a seat's life. Three seats were held this way in
three days (2026-09-07 to 2026-09-09: nine hours at an `EnterWorktree`
to a sibling path; four hours and then three and a half at a scratch
`git init`/`add`/`commit` in a throwaway directory, the second with the
lesson already written in memory; an hour at a nested `$(gh api …)`
substitution). The owner's words: "stop doing things that need approval,
I am not here, you will get yourself stuck and do no useful work for ten
hours" (2026-09-08) and "I need things like this to stop happening, it is
preventing useful work from happening" (2026-09-09). And on 2026-09-25,
relayed verbatim by the Director: "I absolutely need all seats to be able to
push without me"; that evening the Director withheld a path-scoped
owner-review ruleset because it would have put the owner on every `.husky/`
change.

## The rule

1. **The tracked harness settings carry no `ask` rules.** An `ask` is a
   prompt by construction; every one of them is either an `allow` (the
   action is safe and reviewable in the PR that carries it) or a `deny`
   (the action is never wanted, and a deny returns to the seat as an error
   the seat can route — see
   [`route-blocks-and-questions-to-director`](route-blocks-and-questions-to-director.md)).
   A harness's automatic approval review is the same class: on 2026-09-25 a
   Codex seat's push of evidence derived from a private local capture was
   refused twice as unauthorised egress, and the Director ruled that no peer
   grants in the owner's place what the harness refused (one instance, OCE
   pull request 211).
   The destructive git operations and `rm -rf` are denies; the hook policy
   in `.agent/hooks/policy.json` denies the same shapes with a reappraisal,
   so the refusal teaches. Every command that leaves the ask list is
   CLASSIFIED, not merely unlisted: its forward-going forms (a stash
   recovered or inspected) are allows, and its work-discarding forms (a
   stash dropped or cleared) are denies — nothing is left to the host's
   classifier, which prompts in the default mode. A command whose safety
   turns on its ARGUMENTS stays denied whole: the settings match by
   prefix, so a cage of targeted denies around `git reset` and `git
   revert` leaks through every accepted option abbreviation (`--h` is
   `--hard`) and every mode flag placed after the revision; their
   forward-going forms (a pathspec unstage, a revert) become allows only
   under an argument-aware matcher, which is its own lane.
2. **One plain command per Bash call.** No `;`-chained scripts, no
   command substitution at the tool boundary, no heredocs that write
   files. A ceremony with several moves is several calls, each readable on
   its own. An experiment or a dry run is a script FILE in the session
   scratchpad, run by one plain `bash <file>` call. The boundary is the
   tool call, not the repository's text: a recipe that a rule, skill or
   directive authors as a fenced block (the cloud-environment classifier,
   the substrate-seeding block, a lifecycle's chained build) stays as
   written and runs as a script file by one plain call; a seat never
   pastes it into the call as a compound command.
3. **No git outside the estate's registered worktrees.** A scratch
   repository (`git init` in a throwaway directory) is exactly the shape
   the classifier cannot allow. A recipe about git is proven by file copy
   and plain shell, or in a registered worktree cut for the purpose.
4. **Never `rm -rf`.** Scratch directories are session-local and need no
   force; the estate removes worktrees by `git worktree remove` without
   `--force` (its dirty-refusal is a safety net) and never removes work
   with git or the shell
   ([`never-use-git-to-remove-work`](never-use-git-to-remove-work.md),
   [`worktree-hygiene`](worktree-hygiene.md)).

## The other side of the cure

A held seat is invisible from inside and indistinguishable from a working
seat on the stream for a while. The Director reads silence against the
seat's own cadence (a claim heartbeat past its refresh; nothing on the
stream for a cadence) and declares a **deadline and a default** on the
stream: the time, the default action, and that the lane stays the seat's.
The default is applied without touching the seat's worktree, branch or
claim (a temporary branch cut from the lane's remote ref, pushed to the
lane branch by name). On 2026-09-09 this landed a cure at 11:45Z and the
PR at 12:14Z while the seat was held; the seat's return found nothing to
undo ([`silence-is-never-liveness`](silence-is-never-liveness.md)).

## Enforcement

Structural at the harness: the `deny` list in `.claude/settings.json`
(no `ask` entries) and the Bash guard's blocked patterns in
`.agent/hooks/policy.json`, both tracked. Behavioural for the rest: this
rule loads in every seat; a seat that catches itself composing a compound
call rewrites it as calls, and a seat that needs a destructive operation
routes it to the Director as a directed event with the exact invocation.
