---
name: "Peer-Commit Absorption — Third Direction Failure Mode"
polarity: antipattern
category: agent
status: proven
discovered: 2026-05-11
proven_in: "R1.b session 2026-05-11. Mistbound Watching Lantern's commit 67885e3f (subject: docs(graph): absorb review findings into MVP arc) used non-pathspec staging (git add . or equivalent) and swept six of Soaring Darting Kite's session-lifecycle working-tree files into Mistbound's commit. Files absorbed: primary-agent-tooling-enhancements.plan.md (B-01 fix), active-claims.json (session-open claim), closed-claims.archive.json (R1.b claim closure), shared-comms-log.md (session-open + sidebar + close narratives), comms-events/2e1a886f (sidebar to Fronded), comms-events/c09300be (B-10 orphan sidebar). Mistbound's queue intent declared one file (graph-mvp-arc.plan.md); their actual staged set was seven. Verify-staged would have caught the divergence if invoked. Working evidence at comms event e0a17465-fd5a-4c7d-979d-89696247de0a."
---

> **POLARITY: ANTIPATTERN.** This entry names a *failure mode to
> prevent*, not a shape to repeat.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Peer-Commit Absorption — Third Direction Failure Mode

Foreign-stage absorption at the `git commit` boundary has three
structurally distinct directions. Two are named already by
PDR-054 (pre-hook foreign-stage absorption from peers into my
commit) and PDR-059 (post-hook regenerator/auto-fix output
absorbed by the husky chain). The third direction — **my
working-tree files absorbed into a peer's commit via the peer's
non-pathspec staging** — is structurally new, has the same root
cause, and admits the same cure. It is named here so the
classification doctrine can carry all three directions, not just
the two that PDR-054 and PDR-059 already cover.

## The three directions

| Direction | Who stages | What is absorbed | Who is harmed | Named where |
|---|---|---|---|---|
| **Pre-hook foreign-stage** | I do | Peer's pre-staged files become part of my commit | I land work that is not mine | PDR-054 |
| **Post-hook husky-chain** | The husky chain (formatter / linter / codegen) | Files the hook touched and `git add`-ed | I land Class C absorbed files into my commit | PDR-059 + ADR-177 amendment |
| **Peer-commit absorption** | The peer does | My working-tree files become part of the peer's commit | The peer lands work that is not theirs; my attribution drifts | This pattern (named 2026-05-11) |

The first two are about *my commit* absorbing files I did not
queue. The third is about a *peer's commit* absorbing files
**I** did not queue (and they did not queue either; their
non-pathspec stage swept them in).

## Same root cause

All three modes share one root cause: **a `git add` invocation
without an explicit pathspec, on a working tree that contains
peer working-state**. Non-pathspec stages — `git add .`,
`git add -A`, `git add --update` — sweep the entire tree's
modified-and-untracked content into the index. The pathspec
contract is what bounds the staged set to the operator's
intent; without it, the staged set is whatever the working tree
happened to contain.

## Same cure

The unified cure is **mechanical pathspec enforcement at the
commit boundary**, regardless of which agent invokes commit and
regardless of which direction the absorption would flow. The
commit-queue's `verify-staged` already supports the check —
compare the post-hook staged set against the queued-intent file
list, abort on divergence — but the husky `pre-commit` hook
does not call it. Until the hook calls verify-staged with hard
refusal on divergence, all three directions remain open.

## Mitigations available today

Until the structural cure lands:

- **Explicit pathspec staging always.** `git add <file>...` not
  `git add .`. Pathspec at commit time too:
  `git commit -- <file>...`. The discipline is documented and
  visible in the commit-skill canonical and rule
  `stage-by-explicit-pathspec.md`.
- **Commit-queue lifecycle every commit.** Enqueue intent first;
  verify-staged before commit; complete the entry on success.
  Today this is operator discipline; tomorrow (Wave 3 of the
  collaboration-protocol-hardening tail plan) it will be
  mechanical at the husky boundary.
- **Inter-agent sidebars between known peers** (the companion
  pattern). Two known agents can coordinate via sidebar; this
  pattern's failure mode happens when a *third* agent enters
  shared-state mid-session without sidebar awareness.
- **Eyeball the post-hook staged set** before commit — PDR-059
  Class C check by hand. Five seconds of `git diff --cached
  --name-only` rules out the failure mode for the commit being
  authored.

## Cost when it fires

Work is **preserved** (the absorbed files land in the peer's
commit) but **attribution drifts**: the originating author's
authorship is now in the peer's commit message and SHA. The
session-lifecycle audit trail is fragmented across commits with
different subjects. The queue intent of the affected session
becomes stale (files no longer in working tree) and must be
abandoned; the session-lifecycle claim must close with an
absorption summary instead of a clean closure.

## Routing

This pattern is candidate evidence for an amendment to PDR-054
or PDR-059 naming the third direction, OR a new PDR naming the
unified three-direction model. The pending-graduations register
carries the candidate at `2026-05-11 — Peer-commit absorption
(third-direction failure mode)`. The Wave 3 commit-queue UX +
R4-new pre-commit hook in the collaboration-protocol-hardening
tail plan implements the cure; this pattern's withdrawal
trigger is "Wave 3 landed and Wilma four-probe matrix passes."

## See also

- [`patterns/inter-agent-sidebar-with-default-action.md`](inter-agent-sidebar-with-default-action.md)
  — companion pattern; sidebars handle the inter-agent-coordination
  case; this pattern names what sidebars **cannot** prevent.
- `.agent/practice-core/decision-records/PDR-054-asymmetric-cure-discipline.md`
  — pre-hook direction.
- `.agent/practice-core/decision-records/PDR-059-regenerator-output-classification.md`
  — post-hook husky-chain direction.
- `docs/architecture/architectural-decisions/177-asymmetric-cure-enforcement-in-staging.md`
  — host-repo cure implementation, deferred; Wave 3 of the
  collaboration-protocol-hardening tail plan completes it.
