---
pattern_name: cross-lane-commit-blocking
status: graduated
graduated_at: 2026-05-26
graduated_from: pending-graduations/2026-05-26-feathered-torrid-n2-cycle-1-candidates.md
instances: 2
related_directive: ../../directives/agent-collaboration.md
related_rule: ../../rules/stage-by-explicit-pathspec.md
---

# Cross-Lane Commit Blocking

## Failure Shape

A parallel agent's lane can block a commit even when your own intended hunk is
ready. Full-tree gates, shared files, and inherited uncommitted WIP can make a
routine commit or clean-up action depend on someone else's unfinished work.

The dangerous response is to make the tree look clean by taking ownership of the
foreign lane implicitly: staging the whole file, restoring the whole file,
stashing another agent's WIP, or committing a repair without attribution. Those
actions can destroy work, bundle false authorship into your commit, or hide the
coordination event that the next agent needs.

## Recorded Instances

| Date | Agents | What blocked | Ownership-preserving cure |
| --- | --- | --- | --- |
| 2026-05-05 | Asteroid -> Fronded | Asteroid hit lint failures in Fronded's collaboration-cli-gaps lane during a takeover-bundle commit attempt. | Asteroid made the minimal repair, did not stage it, and posted heads-up event `c9dff8f1` so Fronded could absorb. |
| 2026-05-26 | Prismatic -> Feathered/Torrid | Prismatic's practice-fitness WIP was complete but uncommitted; the zoneGlyph knip cure needed a one-line change in the same file. | Torrid staged only the one-line export drop with `git apply --cached` against HEAD context, leaving Prismatic's WIP intact until owner commit `bfbc39f3`. |

## Discipline

When a cross-lane blocker appears:

1. **Name the ownership boundary first.** Identify which hunks are yours,
   which hunks belong to another agent, and which gate or commit action couples
   them.
2. **Prefer communication over surgery.** If the owning agent is live, ping
   them and let them commit, absorb, or explicitly hand off the lane.
3. **Do not restore or stash another agent's work as a clean-up shortcut.**
   Destructive index or working-tree operations require explicit owner
   authorisation and a recorded rationale.
4. **Choose the narrowest ownership-preserving cure.**
   - If you repaired the foreign lane for the owner to absorb, leave the repair
     unstaged and broadcast the heads-up.
   - If you are authorised to commit your own tiny hunk through a dirty shared
     file, stage just that hunk in the index. For a hunk that can be expressed
     against HEAD, `git apply --cached <patch>` is the stable primitive.
5. **Verify both sides.** Inspect `git diff --cached` to prove the commit
   contains only the authorised hunk, and inspect `git diff` to prove the
   foreign WIP remains in the working tree.
6. **Leave provenance.** Record the event in comms, the claim closeout, or the
   thread record so the owning agent knows what changed and why.

## `git apply --cached` Primitive

Use this only when the target hunk is small, fully understood, and expressible
against HEAD context. The patch is written against the committed file state, not
the working tree state. Applying it with `--cached` updates the index only:

```bash
git apply --cached path/to/surgical.patch
git diff --cached -- path/to/file
git diff -- path/to/file
```

The first diff proves what will commit. The second proves the other agent's WIP
is still present. If either diff contains surprise substance, stop and
coordinate rather than trying to trim the patch into shape.

## Non-Goals

- This pattern does not weaken full-tree gates. The gates are intentionally
  load-bearing; the cure is ownership-preserving coordination.
- This pattern does not authorise unilateral takeover of another agent's lane.
  Takeover still needs owner direction, stale-claim evidence, or the relevant
  team protocol.
- This pattern does not replace the commit skill. Before staging or committing,
  follow the commit-window and queue discipline in the commit workflow.

## Related Surfaces

- [`parallel-track-pre-commit-gate-coupling.md`](parallel-track-pre-commit-gate-coupling.md)
  names the broader full-tree gate coupling pattern.
- [`stage-by-explicit-pathspec.md`](../../rules/stage-by-explicit-pathspec.md)
  forbids broad staging and reinforces the explicit ownership boundary.
- [`commit/SKILL-CANONICAL.md`](../../skills/commit/SKILL-CANONICAL.md)
  owns commit-window, queue, staged-bundle, and message discipline.
