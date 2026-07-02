# Every PR comment is addressed, and every push is re-checked for new comments

A pull request is not done — not mergeable, not ready, not to be reported as ready — until
**every** comment on it is either **fixed in code** or **explicitly rejected with a stated
rationale**, then **replied to and resolved**. No comment is ever left unaddressed. Green
checks alone are never sufficient: a PR is done only when it is mergeable AND every comment
is dispositioned.

"Every comment" spans every surface and every author — pull the full set first-hand, never
from memory of what you think was raised:

- inline review threads, **resolved and unresolved**;
- top-level reviews (Codex, Copilot, Cursor Bugbot, Claude, and human reviewers);
- issue-level comments;
- bots and humans alike.

Surfaces to query: GraphQL `reviewThreads` (with `isResolved`), REST `pulls/<n>/reviews` and
`pulls/<n>/comments`, and `issues/<n>/comments`.

## Re-checking for NEW comments after every push is ALWAYS required

Correcting the old comments is **never** enough. Each push routinely triggers a fresh bot
re-review that surfaces **new** comments on the changed lines — and a fix for one comment
frequently creates the condition for another. Never assume the previous round was the last.
The loop is:

1. Pull all comments (every surface above).
2. For each: fix in code, or reject explicitly; reply; resolve the thread.
3. Push.
4. **Re-fetch all comments.** If the push produced any new comment, or any thread is
   unresolved, return to step 2.
5. The PR is comment-clean only when a push yields **zero new comments and zero unresolved
   threads**.

Do not merge, and do not report the PR ready, until step 5 holds.

Re-verify zero-unresolved **at the ready/merge instant**, not only after your last
push. Bots (Cursor Bugbot, Copilot, Codex) post asynchronously — a fresh thread
routinely lands in the 30–60 seconds *between* your last check and your
"threads resolved / ready" declaration. This is a **structural race, not author
negligence**: it has caught many different agents on their own PRs, so the cure is
a re-check bound to the merge instant (the merging agent's responsibility), never
"I was diligent last push". Re-fetch all threads immediately before declaring
ready or merging; if any is unresolved, return to step 2.

Resolving a thread is **metadata, not a fix.** Marking threads resolved to clear
`mergeStateStatus` (or any merge-readiness signal) without settling the concern
the comment raised is the inverse of this rule: it makes the PR *look* ready
while the substance is untouched. A thread is resolved only *after* its comment
is fixed in code or explicitly rejected with rationale — never as a shortcut to a
green merge state.

Worked instance (2026-06-27, PR #244): fixing five review comments and pushing — twice — each
time spawned a fresh bot comment on the very change that resolved the prior one (a too-broad
lint ignore; then a plan over-generalisation; then a missing gitignore pairing). Assuming the
first correction was sufficient would have merged over an unaddressed comment each time.

Under shared gh credentials an agent's replies are attributed to the repo owner; identify as
the agent in the reply body (`identify-as-agent-under-shared-credentials`).
