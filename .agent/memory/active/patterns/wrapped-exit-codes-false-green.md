---
name: "Wrapped Exit Codes False-Green"
polarity: anti-pattern
use_this_when: "Reading success from any piped, redirected, background-wrapped, or hook-bannered invocation — especially git push, aggregate gate runs, and collaboration-CLI writes."
category: process
layer: general
proven_in: "Worked instances 2026-06-08 → 2026-06-12: piped pnpm check, piped/redirected/bare git push triplet (PR #176), background-task wrapper over red hooks, collaboration-CLI proof-line destinations"
proven_date: 2026-06-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Trusting an exit code, hook banner, or wrapper result that does not belong to the operation being verified — shipping unpushed work, reporting failed gates as green, and writing state to the wrong destination behind a true-looking success line."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This is a failure mode to avoid: the
> exit code you read belongs to the wrapper, the pipe, or the hook —
> not to the operation you care about.

## The failure shape

A command's success is read from a surface that cannot carry its
verdict. Worked variants, each observed live:

- `cmd 2>&1 | tail` reports the LAST pipeline stage's exit — a failed
  `pnpm check` once reported "exit 0".
- A piped `git push` printed ONLY the pre-push hook banner; the
  transfer never happened. An UNPIPED push redirected to a file died
  SIGPIPE (exit 141) after a fully-green hook with ZERO transfer. Only
  a bare push transferred — and only `git ls-remote` distinguished the
  three attempts.
- A background-task wrapper reported exit 0 while the commit+push
  inside ran both hooks red — the wrapper's exit covers only the
  wrapper.
- A collaboration-CLI write printed a true-but-misleading proof line:
  the relative path from a worktree cwd wrote to the WRONG registry.
- `tail -3` on a failed gate run destroyed the failure surface — the
  failing task's name was gone and the cause became unknowable.
- **The harness's own task notification** reported `completed (exit code
  0)` over a `knip:gate` that exited `1`, and again over a failed commit
  — the compound command's status was the trailing statement's. Only the
  in-band echo caught it, and `git log` confirmed `HEAD` had not moved
  (2026-07-28, twice in one session). The platform's summary of your
  command is itself a wrapper.
- **Exit zero AND SILENT — the vacuous run.** `pnpm --filter <pkg> exec
  knip` exited `0` and printed nothing. It was not clean: no config
  resolved, so the tool analysed *nothing*. This is the most dangerous
  variant in the family, because emptiness reads as **absence of
  problems** when it is **absence of analysis** — and unlike a red gate,
  nothing about it demands attention (2026-07-28).

## The cure

The proof is the operation's own success artefact, never the exit code
of anything wrapping it:

- **Push**: the transfer line (`* [new branch]` / fast-forward) PLUS a
  fresh `git ls-remote origin <branch>` showing the expected SHA. The
  hook banner is never the proof. Run pushes bare.
- **CLI write**: the explicit success token (`wrote comms event <id>`,
  a commit SHA) — its absence means the write failed; and READ the
  token's destination path, not just its presence. Invoke
  collaboration CLIs with absolute paths from any non-root cwd.
- **Gate run**: capture the complete output AND the real exit into a
  variable (`cmd > log 2>&1; rc=$?`), then read `$rc` and triage from the
  log — never the compound command's own exit, which is the trailing
  statement's, not the gate's (the masking bullet below). Use `PIPESTATUS`
  or avoid the pipe. Never triage an expensive
  gate through a `tail`/`head` (it discards the verdict), and **never
  re-run a multi-minute gate merely to recover output or an exit code
  you failed to capture** (owner-flagged, costs real money). The harness
  auto-persists oversized tool output to `tool-results/<id>.txt` — read
  that before re-running.
- **Trailing `echo` / advisory step masks the verdict**: a
  `cmd > log 2>&1; echo "EXIT=$?"` (especially backgrounded) can surface
  the *echo's* exit (0), masking a RED gate; and
  `gh run view --log-failed | tail` can show a later `if: always()`
  advisory step's output, not the failing step. Read the gate's own
  summary — the turbo `Failed:` line, the per-step `conclusion` / step
  name — never the wrapper exit or the log tail.
- Grep patterns beginning with `-` (e.g. `->`) need `-e <pattern>` or
  `--` — the pattern is otherwise consumed as an option.
- **Exit zero with EMPTY output earns MORE scrutiny than a non-zero
  exit, not less.** Before reading silence as clean, confirm the tool
  actually analysed something: a resolved config, a file/module count, an
  "N files checked" line. A red gate announces itself; a vacuous one
  never will. Corollary: **a tool's own report about itself is not
  evidence about itself** — that includes the harness's task-completion
  summary.

## Recurrence is the argument for a mechanical cure

This pattern is documented, and the class kept firing anyway: **seven
instances across two sessions** on 2026-07-27/28, hitting two different
seats, including seats that had already internalised the child rule and
were echoing exit codes in-band correctly. The generalisation the seats
converged on independently is worth stating once, because it is what the
enumerated variants have in common:

> **A proxy for a state was read instead of the state.** Some artefact
> stands between the seat and the fact — a pipeline's exit status, a
> filter's output, a batch's commit, a partial API view, a harness's
> summary — and the artefact is cheap, to hand, and *not the fact*. The
> tell is that the wrong reading is always the comfortable one: the proxy
> says green.

The operational form: **read the state at its own source, and when you
can only read a proxy, say so and name what it does not cover.**

Enumerating further variants has diminishing returns — the surface where
it next appears is by definition one nobody has listed. Recurrence
despite a documented home is precisely the PDR-098 signal, and this class
carries a literal surface signature, so the cure belongs in the PDR-044
innate hook layer rather than in more prose here.
