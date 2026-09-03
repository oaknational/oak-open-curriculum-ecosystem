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
  status=0; cmd > tmp/out 2>&1 || status=$?; echo "CMD_EXIT:$status"; tail -20 tmp/out
  ```

  The `echo` must bind to the COMMAND's `$?` — redirect first, filter
  after. Never `cmd | filter; echo $?` (captures the filter's exit) and
  never `cmd | filter` alone.
- For backgrounded or gated commands, print a named in-band marker
  (`PUSH_EXIT:$?`, `SEND_EXIT:$?`, `WORKFLOW_EXIT:$?`) on its own line
  and READ it before claiming the effect happened.
- For streamed-side-effect CLIs (comms sends, registry writes), also
  verify the effect landed (the event on the stream, the ref moved, the
  registry row changed) — a grep filter over a failed send returns empty
  and reads as quiet success, not as failure.
- **The false-silence twin, on WRITES: on any ambiguous outcome, READ THE
  STATE before retrying — a retry is itself a write.** A piped grep over a
  successful write can match nothing (the CLI emits prose, not the JSON the
  filter assumed), silence gets read as failure, and the retry mints a
  duplicate event/commit/row (worked instance 2026-07-24: a duplicated
  directed comms event from exactly this shape). Derive output parsing from
  observed output, never from memory of a schema.
- When a command fails, capture the FULL output on that first run —
  `tail -N` on a failure swallows the reason and forces a re-run
  (sibling discipline: capture-expensive-command-output-first-run).
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
  minute later, 2026-08-19).
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
