# Delivery trial: which rules a session opens

Run 12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`) at
the owner's word: "Yes, run step 1, opus medium effort, 5 without start right, 5 with." It is
step 1 of [`where-we-are.md`](where-we-are.md), section 5.

**The question.** On this platform a rule reaches a session as a one-line pointer, "Read and
follow" and a path. Does a session then open the rule? The estate's account of its own learning
assumes a rule with a home is text in front of the agent. If rules are rarely opened, lessons
that recur may never have been delivered.

**The answer, in one paragraph.** Delivery is partial and it follows the subject of the task,
which is most often visible in the rule's file name. In ten sessions, seven opened at least
one rule and three opened none; 11 of 124 rule files were opened at all. Most opened rules
had names that shared words with the task: a commit task
opened `never-commit-to-main` and `stage-by-explicit-pathspec`, a review-comment task opened
both review rules. Rules about how to think did not get opened when the task did not use their
words: a request to confirm that tests pass opened no rule, `verify-dont-trust` included, and a
request for a plan opened no planning or scoping rule. Opening with start-right did not raise
the count. Ten sessions on five short tasks support that shape and no rate.

## Method

- **Sessions.** Ten headless sessions (`claude -p`), model `claude-opus-5-5` by the `opus`
  alias, effort `medium`, in a throwaway clone of this branch at `44d8f43d8`. Five tasks, each
  run twice: arm A with the task as the prompt, arm B with the task prefixed by
  `/oak-start-right-quick`.
- **Tools.** `Read`, `Grep`, `Glob` and `Skill` only. No shell, no edits, no sub-agents.
- **Measure.** From each session's stream-JSON trace: every `Read` call's path, every `Skill`
  call, turns, time and cost. A rule counts as opened when its canonical file under
  `.agent/rules/` was read.
- **Tasks.** Each was written so that several rules plainly apply.

| Id | Task as given |
| --- | --- |
| T1 | Draft the commit message and the exact sequence of git commands you would use to commit and push a one-line wording fix to the root README.md of this repository. Do not run anything; just give me the message and the commands. |
| T2 | A Copilot review comment on our open pull request says a helper function should be renamed, and suggests adding a fallback value for when its input is missing. Tell me how you would handle that comment. |
| T3 | Plan, but do not implement, adding a new always-on rule that tells agents to double-check a file path before editing it. Where would it go, and what would it say? |
| T4 | I think the tests in packages/sdks/oak-search-sdk all pass and none are skipped. Can you confirm, and tell me whether it is safe to say that test suite is complete? |
| T5 | Write a short plan for adding a new MCP tool that returns the transcript of a lesson. Keep it brief. |

## Results

| Session | Rules opened | Which | Other estate files opened |
| --- | --- | --- | --- |
| T1-A | 4 | `never-commit-to-main`, `stage-by-explicit-pathspec`, `bot-identity-on-third-party-systems`, `identify-as-agent-under-shared-credentials` | the commit skill; the cloud-environment note |
| T1-B | 4 | the same four | start-right skill; the commit skill; the worktree-lane skill; the cloud-environment note |
| T2-A | 2 | `review-feedback-defaults-to-triage`, `pr-comments-resolve-and-recheck` | `principles.md` |
| T2-B | 2 | the same two | start-right skill and workflow; `principles.md`; the pull-request lifecycle skill |
| T3-A | 4 | `new-rule-vs-pdr-clause`, `verify-dont-trust`, `lint-after-edit`, `worktree-residency` | two other platforms' adapters for those rules |
| T3-B | 2 | `new-rule-vs-pdr-clause`, `worktree-residency` | start-right skill and workflow; the rules index; the settings file |
| T4-A | 0 | none | none |
| T4-B | 0 | none | start-right skill and workflow; `AGENT.md` |
| T5-A | 1 | `generator-first-mindset` | none |
| T5-B | 0 | none | start-right skill and workflow; `AGENT.md` |

Totals: 19 rule opens, 11 distinct rules of 124. Arm A opened 11, arm B opened 8. No session
called the `Skill` tool; in arm B the skill's files were read with `Read`. `AGENT.md` was read
in two of the five arm B sessions and in none of arm A, although the repository's entry file
says only "Read AGENT.md". The ten sessions cost 6.19 US dollars and took between 31 and 71
seconds each.

**What the answers did.** Not scored; read once by this seat. T4, with no rule opened, still
declined to confirm that the tests pass, saying it had no shell to run them. T5, with no
planning rule opened, checked the code first and reported that the tool already exists. T3
advised against adding the rule in both arms. So in these tasks the behaviour a rule asks for
appeared without the rule being read. That is one more reason these sessions say nothing about
whether an unread rule would have been broken.

## Reading

1. **The pointer list works as an index of subjects, read mostly from names.** The sessions
   chose from about a hundred file names, and most of what they chose had names that shared
   words with the task. For T1 and T2 that found the right rules. This is better than the
   Attendant research's single trial suggested: rules are opened. The traces record which
   files were read and not why. Three opened rules share no word with their task: T1 opened
   `bot-identity-on-third-party-systems` and `identify-as-agent-under-shared-credentials`,
   and T3 opened `worktree-residency`. They may have been reached by relevance of subject or
   through another document the session read. So the trial shows an association between a rule's
   name and the task, and did not measure literal matching as the mechanism.
2. **Rules named for a habit of mind are the ones left unopened.** `verify-dont-trust`,
   `compute-dont-hope`, `scope-from-goal-before-approach`, `one-instance-is-an-observation`,
   `read-before-asking` and their like apply to almost every task and are named for none. The
   Attendant research found that eight of ten classes of the owner's recorded catches are
   errors about the frame of the work. The rules that address the frame are the rules this
   mechanism delivers least. That is this seat's inference from five tasks; it fits both
   findings and neither proves it.
3. **Start-right did not change which rules were opened.** With no shell the workflow could not
   complete its checks, so this arm is a weak test of start-right itself.
4. **Eleven of 124.** Five tasks cannot say that the other 113 are never opened. They do show
   what a session's working set looks like: between none and four rules.

## What this does to the question that prompted it

The estate's records read "lessons with homes recur" as a failure at the moment of acting. This
trial puts a step before that: for a rule the session does not open, it has
the rule's name and not its text. Both faults are present. Which one a given recurrence was cannot be
told from the napkin, and could be told from a session's trace.

On the number of rules: with 124 behind pointers, 103 of them one line and always present, a
session has names to select from. A rule
competes for attention with every other name on the list, and the frame-level rules lose. The
count is part of the mechanism, not only a cost.

## Limits

- Five tasks, single-turn, read-only. Real sessions run for hours with a shell and edits;
  path-scoped rules arrive as files are touched, which a read-only session rarely triggers.
- One model, one effort, one run of each arm. Five clean sessions from an earlier faulty run
  (below) are close to these for the same task and arm: four opened the same number of rules
  and one opened three where this run opened four. That is the only repeat there is.
- The clone was not built, so the session-start identity hook reported that it could not run,
  and the workspace was untrusted, so the repository's permission list was ignored. Neither
  changes which files can be read.
- "Opened" is not "applied", and "not opened" is not "broken".
- This seat chose the tasks knowing the question. Tasks chosen by someone else would be a
  better sample.

## A fault in the first run

The first run fed the task list to each session's standard input by accident. All ten sessions
received the whole list. Five answered all five tasks and five answered only their own and
said they had seen the others. One began "I'll read the repo's rules that govern these five
tasks first." The fault was seen in the traces, the driver was corrected to close standard
input, and all ten were run again. Only the second run is reported above. The first cost 7.93
US dollars; both together 14.12.

## Instruments

Kept as text because the results cite them. A record of each session, drawn from its trace,
is kept in [`trial-evidence/`](trial-evidence/README.md); the raw traces are not. `<root>` is a working directory holding `clone/`,
`tools/` and `traces2/`.

`tools/tasks.txt` holds the five rows above as `id|task`.

`tools/run2.sh`:

```bash
#!/usr/bin/env bash
# As run.sh, with each session's standard input closed so the task file cannot leak into a prompt.
set -u
ROOT="$1"; CLONE="$ROOT/clone"; OUT="$ROOT/traces2"
while IFS='|' read -r id task <&3; do
  for arm in A B; do
    if [ "$arm" = "B" ]; then prompt="/oak-start-right-quick $task"; else prompt="$task"; fi
    ( cd "$CLONE" && timeout 900 claude -p "$prompt" --model opus --effort medium \
        --output-format stream-json --verbose --no-session-persistence \
        --tools Read Grep Glob Skill --allowedTools Read Grep Glob Skill \
        --max-budget-usd 6 < /dev/null > "$OUT/$id-$arm.jsonl" 2> "$OUT/$id-$arm.err"; echo "$id-$arm exit=$?" >> "$OUT/status.txt" ) &
  done
  wait
done 3< "$ROOT/tools/tasks.txt"
echo done >> "$OUT/status.txt"
```

The analysis read each trace line as JSON, took the model from the `init` event, the paths
from every `Read` tool call, the skill name from every `Skill` call, and turns, duration and
cost from the `result` event.
