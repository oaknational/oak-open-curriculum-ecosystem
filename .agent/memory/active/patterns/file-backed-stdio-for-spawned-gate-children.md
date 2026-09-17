---
name: "File-Backed Stdio for Spawned Gate-Running Children"
polarity: pattern
use_this_when: "Spawning git commit or any hook/gate-running child from Node and its output truncates or the chain dies silently mid-hook"
category: code
proven_in: "agent-tools/src/core/file-backed-child.ts"
proven_date: 2026-07-03
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Three sessions hit the same silent hook-chain death (F-112) because Node's child-stdio pipes are libuv socketpairs that poison shell hook chains"
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

When Node spawns a child that runs a shell hook or gate chain (`git commit`
with a husky pre-commit, any script whose descendants include shells and
other Node processes), give the child **file-backed stdio** — temp files
opened by the parent — and replay the conserved content to the parent's
streams on completion. Never `stdio: 'pipe'` on such a child.

## Why

Node's child-stdio "pipes" are **libuv socketpairs**, not FIFOs
(`fstat.isFIFO()` is false; `isSocket()` is true). Every process in the
child's tree shares that socket descriptor: git dups its stderr onto the
hook's stdout, the hook's own pnpm/node stages inherit it, and the mixed
tree's interaction with the socket left the hook shell taking **SIGPIPE on
its next echo** — which `set -e` converts into a silent exit 1 with the
output truncated at the point of death and no failing gate named (F-112:
three sessions, identical symptom, "dies at the depcruise→turbo handover").
Consuming the pipe diligently in the parent does NOT cure it: a
both-piped, fully-consumed topology failed identically. A pure-shell child
pushing 300KB through the same socketpair was fine — the poison needs the
hook's own Node children sharing the descriptor. Plain file descriptors
have no pipe/socket semantics to poison.

## Shape

1. `mkdtempSync` a capture dir; `openSync` one file per stream.
2. `spawn(cmd, args, { stdio: ['ignore', outFd, errFd] })`.
3. On `'close'`: read the files, replay each to the parent's stream (or an
   injected sink — makes replay assertable in tests and keeps runner logs
   clean), resolve `{ exitCode, signal, stderr }` with the signal carried
   distinctly (never collapse to a bare 128).
4. `closeSync` both fds and `rmSync` the capture dir in `finally`.
5. Guard the `'close'` handler with a `settled` flag — a failed spawn emits
   both `'error'` and `'close'`.

Regression guard that pins the mechanism (not the symptom): spawn a child
that exits non-zero if `fstat` of fd 1 or 2 reports FIFO **or socket**.

Trade-off accepted: output arrives on completion, not live. Conservation
plus faithful exit/signal reporting beats liveness for gate-running
children; document the replay behaviour where callers previously relied on
streaming.

## Evidence

The implementation is `runFileBackedChild` in
`agent-tools/src/core/file-backed-child.ts` (moved to its shared `core/`
home and renamed from `runInheritedProcess` 2026-08-07 when the third
consumer arrived — the old name collided with repo-check's genuinely
stdio-inheriting runner and contradicted the mechanism), pinned by the invariant
tests in `agent-tools/tests/core.file-backed-child.integration.test.ts`
(the no-pipes/no-sockets guard, high-volume stderr conservation,
mixed-stream fidelity, signal fidelity). The frictions register's F-112
entry carries the historical proof chain and closing commits. Proven
end-to-end by the repaired workflow landing the repo's own
previously-blocked commits; two mid-landing real gate failures (Prettier,
knip) surfaced with full output conserved — the exact class the truncation
used to swallow. Diagnostic method that pinned it: file-based trace
markers plus signal traps inside the hook (immune to stream loss) and a
probe triangle (no-git / both-piped / full-inherit).

Second worked instance (2026-08-07): `merge-bot push` spawned git with
pipe stdio — the pre-push chain's knip child died without a verdict, a
diagnosis line written to stderr was itself eaten by the poisoned stream,
and git's exit arrived null, while the identical hook chain run directly
passed green. Cured by consuming this pattern's runner at the push
executor (`agent-tools/src/merge-bot/git-executor.ts`). The instance adds
a corollary worth repeating: **diagnosis must never ride only the channel
whose failure it reports** — under this failure stderr is the casualty, so
crash-class diagnosis lines print to the surviving stream (see
`repo-check` knip-gate).
