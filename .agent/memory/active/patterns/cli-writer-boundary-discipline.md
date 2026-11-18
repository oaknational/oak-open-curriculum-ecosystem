---
name: CLI Writer Boundary Discipline
polarity: pattern
use_this_when: A command-line tool or hook is about to write a file whose path, name or content comes from a caller, a flag, an environment variable or another process — apply the three cells before the first pull request, not after review finds them
category: code
layer: general
proven_in: "agent-tools: the atomic write in the collaboration-state writer (PR #55 round four, 2026-09-13); the link refusal in core/flag-path-resolve.ts; the two are not yet joined in one writer"
proven_date: 2026-09-13
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A file writer under a caller-supplied name ships with a truncating write that destroys the file it was meant to update on a crash, or follows a symbolic link the caller planted and writes through it, and each is found one review round at a time"
  stable: true
---

## Principle

A writer that puts caller-supplied bytes at a caller-influenced path sits on a trust boundary,
and three properties are decided there or never: the name is validated at the boundary, the
write is atomic, and no link is followed. Each was found separately in review (PR #55, rounds
four and five, 2026-09-13), so the pattern states them together for the next writer to carry in
its first pull request.

## The three cells

1. **Validate names at the boundary.** A path segment from a flag, an event body or an
   environment variable is checked against a closed grammar before it joins a path: no
   separators, no traversal, no empty segment, a bounded character class. The refusal names the
   rejected value. (The `security-expert` and `code-expert` templates already carry this cell.)
2. **Write atomically.** Compose the whole content, write it to a sibling temporary file in the
   same directory, `fsync`, then rename over the target. A truncating `writeFile` on the target
   leaves an empty or half-written file when the process dies mid-write, which broke
   resumability of a state file once (round four).
3. **Never follow links.** Before writing, `lstat` the target and refuse a symbolic link (and
   refuse to create through a linked parent); an `O_NOFOLLOW`-shaped seam in the writer is the
   test-injectable form. A planted link makes a benign writer a write-through to any path the
   process can reach (round five).

## Shape in agent-tools

- The cells live in separate modules, read on 2026-10-01 in both estates and checked by
  `security-expert`. The atomic write is `collaboration-state/atomic-file.ts`: a synced sibling
  temporary file opened exclusively, then a rename (a hard link for an exclusive create), then a
  directory sync on POSIX, behind an injectable file-system seam so the behaviour is proved in
  process without real IO (`tests-prove-behaviour-no-io-no-spawn`). That module holds no
  `lstat`. On POSIX its rename replaces a link planted at the target and does not write through
  it, and its exclusive create refuses one; it follows a link in any parent directory.
- The link refusal for a caller-supplied write path is `resolveWriteTargetWithinRepo` in
  `core/flag-path-resolve.ts`: a dangling link at the target is refused, and so is a target or
  an existing ancestor that resolves outside the repository. `resolveReadPathWithinRepo` in the
  same module is the read side. `core/no-follow-read.ts` is a different thing: the no-follow
  open of a single file that the hook and adapter reads use.
- A CLI that hands a caller-supplied path to the atomic writer without that resolver has the
  atomic write only. The collaboration-state CLIs do this with `--active`, `--closed`,
  `--comms-dir`, `--output` and `--file`; the gap is in the frictions register.
- A new CLI that writes files under a caller-supplied name cites this pattern in its TSDoc and
  ships the three cells in its first pull request; the reviewer templates check for them.
- Before writing a seam that reads or writes the tree, search the estate for its precedents
  (`protocol-conformance.ts`, `carriage-fs.ts`): on JC.net's PR #55 the reviewer found two defects
  those files had already named, an environment variable taking precedence over the tree and a write
  through a symbolic link (2026-09-13).
- Outside review goes first to every `--fix` or write path and every path-resolution call. The
  three defect classes outside eyes caught in that lane were a parser re-implemented where one
  existed, an IO failure branch read as an empty result, and tree binding (2026-09-13).
- Widening where a write fires multiplies any latent defect in the write. When a config removal
  that fired on one decision was made to fire on an absent decision too, the write itself was
  re-read before the change (2026-09-28).
- After a call that cannot be undone (a durable write, a send, a merge), every answer that does
  not confirm it is indeterminate, not a failure: read the state back before a retry or a
  refusal message. Each failure arm added after a mutation is audited for reporting a completed
  write as failed (a comms send that exits 1 after its durable write, September 2026).

## Relationship

- `security-expert` §Input handling and injection risk and `code-expert` §Security: the
  boundary-validation cell, already stated there; this pattern adds the two write-time cells.
- `important-state-not-in-temp-files`: what the writer protects is state that matters.
- `exit-codes-in-band-never-piped`: the writer's refusal is an exit code the caller reads.
