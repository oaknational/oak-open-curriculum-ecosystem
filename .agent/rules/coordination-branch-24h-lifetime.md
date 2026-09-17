# Coordination Branch 24-Hour Lifetime

Owner-ruled (2026-07-28, in-chat, verbatim intent): coordination branches
last no more than 24 hours. A coordination branch is cut, carries the
fleet's shared state for at most one day, converges (merge main in, land
the branch via its PR), and a fresh branch is cut. The lifetime is a
bound on divergence, not a deadline on work: rotating daily keeps the
convergence merge small enough to be routine.

## Trigger

Cutting a coordination branch; or opening a session whose primary
checkout sits on a coordination branch. This rule fires at the cut (to
stamp the lifetime) and at session-open (to check it).

## Action

1. **Stamp the cut date in the branch name**:
   `coordination/<YYYY-MM-DD>-<sha6>`, minted by the
   [cut-coordination-branch skill](../skills/cut-coordination-branch/SKILL-CANONICAL.md)'s
   tool (`agent-tools coordination successor-name`) — never
   hand-transcribed. The date segment is the observable clock — no
   side-channel state needed (agent-state-observable); the sha6 segment
   carries the base-tip lineage (the skill states its exact guarantee).
2. **At session-open on a coordination branch**, read the stamp — the
   `<YYYY-MM-DD>` segment between `coordination/` and the trailing
   `-<sha6>` (older branches may carry legacy forms such as
   `coordination/estate-<YYYY-MM-DD>`; their date segment is still the
   stamp). The check is UTC-date rollover: a branch whose stamp date is before the
   current UTC date is DUE — the stricter reading of "at most 24 hours"
   (a branch cut late in the day rotates sooner, never later; a
   date-only stamp cannot express hours, so the day boundary is the
   clock). When cut-time precision genuinely matters, the branch's
   first own commit records it. On a DUE branch, surface convergence to
   the Director (or, at n=1, act on it) before staking new work onto
   the branch. An overdue coordination branch is a defect to route, not
   a home to build on.
3. **Converge-and-rotate shape** (the worked shape from the founding
   instance): merge `origin/main` into the coordination branch, push,
   land the branch through its PR at full condition, then cut the fresh
   day-stamped branch tree-preservingly (`git switch -c`) from the merged
   tip and push it. Broadcast the rotation on the comms stream so every
   seat re-homes. **The fold PR body and the seated block each carry
   one product-gravity line** — `moved for teachers: … / moved for the
   Practice: …` — naming what the fold's window delivered on each
   strand. No quota and no judgment in the line itself; it exists so
   drift toward Practice-internal work is glanceable in the record
   rather than caught by owner vigilance (owner-agreed step-back,
   2026-08-01).
4. **Keep the branch rotatable**: only genuine shared coordination-home
   state (fleet state, doctrine, memory surfaces) rides the coordination
   branch. Work products — source lanes, plans under active edit —
   start in worktrees on their own branches per
   [`worktree-hygiene`](worktree-hygiene.md) and the owner's standing
   word (2026-07-28: work in worktrees where reasonable). A coordination
   branch that accumulates work products cannot converge in a day.

## Why This Rule Exists (Worked Instance)

`coordination/estate-2026-07` lived nearly a month. By convergence night
(2026-07-28) it carried hundreds of commits, had accidentally swept in a
326-file design-studio export (whose CodeQL/Sonar alerts masked the
branch's true check state for days), and its convergence required a
dedicated owner-directed lane (MCP-333): a multi-PR merge sequence, an
un-track operation that surfaced a tooling defect (MCP-334), and a
commit-then-merge-resolve dance around files main had moved. Every cost
scaled with the branch's age. A 24-hour lifetime keeps each of those
costs near zero: the merge window is small, sweeps are caught the next
day, and the branch's checks stay meaningful.

The companion evidence (Starling, 2026-07-28): the worktree-hygiene
rule's broad coordination-class exemption allowed a tracked plan edit to
ride the shared primary and collide with the convergence lane (the F-83
shape). The cure — work products to worktrees, coordination branch for
shared state only — is what makes a daily rotation cheap enough to be
routine.

## Related Surfaces

- [`no-parallel-long-lived-branches`](no-parallel-long-lived-branches.md)
  — the sibling discipline for work branches; this rule bounds the ONE
  sanctioned long-running-shape branch the fleet shares.
- [`worktree-hygiene`](worktree-hygiene.md) — where work products start;
  the exemption class that founding-instance evidence showed must stay
  narrow (genuine shared coordination-home state only).
- The primary checkout's branch never moves outside this rotation (fleet
  doctrine: new work starts in worktrees); the tree-preserving cut at the
  convergence moment is the one sanctioned movement.
- [`continuity-surface-commits-as-orphans`](continuity-surface-commits-as-orphans.md)
  — continuity mechanics across the rotation boundary.
- [`design-work-for-small-prs`](design-work-for-small-prs.md) — the same
  small-surface economics, applied to the coordination estate.

## Enforcement

Behavioural at the cut and at session-open (the branch name IS the
check input: stamp date vs now). The practice fitness check is the
natural future home for a mechanical overdue-branch warning; adding it
is deliberate follow-on work, not part of this rule's landing.
