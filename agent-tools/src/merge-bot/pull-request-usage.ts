/**
 * The usage text of `merge-bot pull-request`. Split from
 * `pull-request-args.ts` at the size gate, the seam `merge-args.ts` records
 * for the merge action: the grammar is data (`pull-request-request.ts`) and
 * a parser, what it says to a reader is this file.
 */

export const PULL_REQUEST_USAGE = `merge-bot pull-request <verb> [flags] [--json]
  The bot's writes on a pull request's conversation, and its workflow
  dispatch, each as the BOT under one installation token minted for the
  invocation at the scope that verb needs: the platform record itself says
  an agent did this, never the signed-in human. Replaces the
  token=$(mint) && GH_TOKEN=$token gh … shell idiom, which a worktree's Bash
  guard refuses and which cannot fail fast. Every body or reason file is
  read from disk and sent verbatim; an empty file refuses. The repository is
  the bot identity's (.github/merge-bot.json at the clone's primary
  checkout).

  open --branch <name> --title <text> --body-file <path> --wip-limit <n>
    Opens a DRAFT pull request from <branch> into the repository's default
    branch. Refuses (exit 3) when the remote does not hold the branch, when
    an open pull request already has that head, or when this clone's own
    open lanes are at or above --wip-limit. A lane is an open pull request
    whose head is not a coordination/ branch and whose author is in
    laneAuthors of the clone's .github/merge-bot.json, or, with none
    stated, is git's user.name or the clone's own bot (<appSlug>[bot]).
    Other people's pull requests are not counted. All four flags are
    REQUIRED: the limit is the seat's to state, so it has no default.
    --branch is a git branch name in ASCII letters, digits and . _ / -.
    The done line prints how many lanes were already open, so a count of
    zero where work is open shows a login that matches nobody; the
    refusal names the authors counted. After the open it adds the labels
    this clone states in pullRequestLabels of its .github/merge-bot.json,
    if it states any, and only then prints the new number, the URL and
    the labels now on the pull request. If the labelling fails the pull
    request still exists: nothing is printed to stdout, exit is 1, and
    stderr names it.
  comment --pr <n> --body-file <path>
    Posts the file as an issue comment on the pull request's conversation.
  reply --pr <n> --comment <id> --body-file <path>
    Posts the file as a reply on the review thread the review comment <id>
    (a positive integer) belongs to.
  resolve --pr <n> --thread <node-id>
    Resolves the review thread with that GraphQL node id. Refuses when the
    thread is not on that pull request, or is already resolved.
  ready --pr <n>
    Marks the draft pull request ready for review. Refuses when it is not a
    draft, or is not open.
  request-review --pr <n>
    Asks GitHub's Copilot reviewer for a review of the pull request, so the
    request stands under the bot and not under a person's sign-in. Copilot
    is the only reviewer it asks. Refuses (exit 3) when a Copilot review is
    already pending, or when GitHub declines the request (GitHub's reason
    is printed).
  close --pr <n> --reason-file <path>
    Posts the file as an issue comment, then closes the pull request.
    Refuses before either write when it is not open.
  dispatch-workflow --workflow <file-name>
    Dispatches the workflow at .github/workflows/<file-name> on the
    repository's default branch, under a token minted at the
    workflow-dispatch scope (open mints pull-request-work; comment, reply,
    resolve, ready, request-review and close mint
    pull-request-conversation).
    Refuses (exit 3) a name that is not a plain *.yml or *.yaml basename.

  --pr is a positive integer in every verb that takes it.
  --json puts EXACTLY the outcome object on stdout; diagnostics go to stderr.
  Exit map: 0 done, 1 operational failure (GitHub answered a status other
  than the one expected, the status and its message in the error; or the
  mint, a file read or the network failed), 2 usage, 3 typed refusal.

  Example:
    pnpm agent-tools merge-bot pull-request comment --pr 42 --body-file ./reply.md
`;
