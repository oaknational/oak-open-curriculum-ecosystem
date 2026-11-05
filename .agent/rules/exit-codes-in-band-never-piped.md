---
classification: core
description: A pipeline's exit status is the last stage's — capture a command's own exit in-band (redirect first, filter after; named EXIT markers for gated/backgrounded commands) and verify streamed side effects landed. Never read a filter's exit as the command's.
---

# Exit Codes In-Band, Never Piped

A pipeline's exit status is the LAST stage's, so any command whose exit
you need must never be piped into a filter before its status is
captured. `cmd 2>&1 | tail -6; echo "EXIT:$?"` reports `tail`'s exit —
a genuinely failing gate, push, send, or test suite reads as EXIT:0.

## Trigger

Composing any shell invocation whose success you will act on: gates,
`git push`/`git commit`, comms sends, CLI ceremonies, test runs,
backgrounded or gated commands — with NO size threshold. The falsely
green outcomes recur specifically in *small ceremony commands* where the
discipline held for expensive chains gets skipped.

## Action

- Capture the command's own status in-band, bound directly to it:

  ```bash
  rc=0; cmd > tmp/out 2>&1 || rc=$?; echo "CMD_EXIT:$rc"; cat tmp/out
  ```

  The `echo` must bind to the COMMAND's `$?` — redirect first, filter
  after. Never `cmd | filter; echo $?` (captures the filter's exit) and
  never `cmd | filter` alone.
- For backgrounded or gated commands, print a named in-band marker
  (`PUSH_EXIT:$?`, `SEND_EXIT:$?`, `WORKFLOW_EXIT:$?`) on its own line
  and READ it before claiming the effect happened.
- Chain an edit to its commit with `&&`, print a sentinel from the script,
  and read the task's output for `Traceback` before trusting it: a
  backgrounded edit script followed by a commit on `;` committed the
  unedited file when the script's assertion failed, and a grep for the
  push line alone missed it (2026-09-20). Every step after a push is gated
  on the push's exit with `&&`, and the remote is read against the local tip
  before any sentence says "pushed": one chained command ran the push, its
  echo, the thread replies and the push-done line while the push had exited
  1 (2026-10-02).
- For streamed-side-effect CLIs (comms sends, registry writes), also
  verify the effect landed (the event on the stream, the ref moved, the
  registry row changed) — a grep filter over a failed send returns empty
  and reads as quiet success, not as failure.
- A landing proof is a NEW commit on the remote beyond the head read
  before the commit; head equal to remote proves nothing (a pathspec commit
  refused whole over one untracked path left head equal to remote, and the
  chain pushed a no-op and posted a false push-done, 2026-10-02). On a
  shared branch a new commit beyond that head may be a peer's (a fold saw
  exactly that, 2026-10-02), so the proof is the EXPECTED commit, or its
  content, on the remote, read back by its hash. The tracked `merge-bot push`
  reports the push's exit status and reads nothing back; the read-back is
  the caller's own step after it, never assumed from a green push.
- **The false-silence twin, on WRITES: on any ambiguous outcome, READ THE
  STATE before retrying — a retry is itself a write.** A piped grep over a
  successful write can match nothing (the CLI emits prose, not the JSON the
  filter assumed), silence gets read as failure, and the retry mints a
  duplicate event/commit/row (worked instance 2026-07-24: a duplicated
  directed comms event from exactly this shape). Derive output parsing from
  observed output, never from memory of a schema.
- Capture the FULL output on the FIRST run of every check, gate, commit,
  push and validator — `tail -N` swallows the reason and forces a re-run
  that the first run had already answered (owner, 2026-07-08: "you ran the
  full expensive check, decided the tail didn't count, and ran it again";
  2026-08-13/14, generalised to every state-changing command after a
  `git push | tail -1` printed "Pre-push checks completed!" over a dropped
  SSH transfer and cost two blind reruns). The settled mechanism: redirect
  to one untracked scratch file, OVERWRITTEN each run (no timestamped
  variants, no historic accumulation), append the exit code inside it, then
  read or grep the file. Decide what the run must yield (exit code, first
  failure line, summary counts) before invoking it, and structure the one
  run to capture that.
- **No `tail` or `head` on command output, ever** (owner ruling 2026-09-03,
  verbatim: "I think we need to stop using tail, it causes this same issue
  over and over and over"; recurred 2026-10-14: a watcher-liveness assertion piped
  through `tail` with `|| rc=$?` read exit 0 on an unknown-flag failure, and the
  wrap said "asserted live"). Truncation is the pipe hazard's twin: it hides
  the line that names the failure even when the exit is captured
  correctly. Worked instances the same morning: `enqueue … 2>/dev/null |
  tail -1` swallowed a schema refusal and fed a pnpm error line to the
  commit step as the intent id; `| tail -N` on gate output hid the failing
  validator's line three times in one window. Capture to a file and print
  the file whole; when the output is genuinely large, read it in full from
  the file (read-diagnostic-artefacts-in-full) rather than trimming it at
  the pipe. The capture snippet above prints the whole file for this reason.
  Prediction (PDR-130): with this clause loaded, no landing step consumes a
  truncated verdict again within the review window; if a `tail`- or
  `head`-swallowed failure recurs, promote the clause to a hook policy on
  the pipe shape.
- **Propagate as well as print** when a wrapper (harness task, Monitor,
  background shell) will summarise the invocation:
  `cmd; rc=$?; echo "CMD_EXIT:$rc"; exit $rc`. The bare in-band echo
  makes the SHELL exit 0, so the harness notification reads
  "completed (exit 0)" over a failed command — the in-band discipline
  otherwise defeats the out-of-band failure summary (three instances in
  one session, 2026-07-29; the idiom held at two further seats the same
  night). The printed marker stays the primary truth; the propagated
  code makes the wrapper honest too. Note `$rc` propagates only when no
  later command replaces `$?` before the exit.
- **A background task's LAST command must BE the guarded command.**
  `git push …; echo "exit=$?"` reports the echo's exit, and the harness
  summarises the task as completed-0 over a remote-rejected push
  (2026-08-18; recreated at the same seat a day later despite the record
  — the cure that held is structural: the push is the final command of
  the task, nothing after it, so the task exit IS the push exit, and
  verification stays read-the-remote-tip).
- **Success markers bury failures too.** `X && echo OK` hides X's
  non-zero exit inside a block that simply prints nothing; run the check
  as its own command and print its exit explicitly (a commit-message
  pre-check failed silently inside an `&&` chain and the gate caught it a
  minute later, 2026-08-19). A check that prints its reading and does not
  gate is the same hole from the other side: a header-length check printed
  104 and the commit ran into the hook (2026-10-14); bind the act to the
  check's exit (`check && act`), never to its printed line.
- **API writes: a status code is not a write, and loop silence is not
  success.** A REST review-request call returned 201 twice and minted no
  `review_requested` event; a `curl -sf | jq` loop swallowed four
  review-dismissal failures with absence of output as the only signal
  (both 2026-08-18). Verify on the system's own proof surface — the
  timeline tail, the re-read state — after every batch write.

## Why

Six estate recurrences across five independent seats (2026-07-17 →
2026-07-20), each despite the lesson being held in per-user memory: a
backgrounded push gate, a test suite, a watcher-liveness assert, a
commit-message check, a comms send behind a grep filter, and a
`gh pr checks | tail` that hid failing rows. A false green at a landing
boundary converts silent failure into a false completion claim —
"commit landed", "pushed", "suite passed" — that peers and successors
then build on. Per-user memory does not reach other seats; this rule is
the estate-wide traction cure (PDR-098 recurrence-despite-home).

## Enforcement

Behavioural at command-composition time. The structural cure candidate —
a gate-runner helper that owns capture — is legitimate future tooling;
until it exists, the in-band capture shape above is mandatory.
