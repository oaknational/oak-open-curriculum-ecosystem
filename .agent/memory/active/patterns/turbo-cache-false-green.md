---
name: "Turbo / Pre-Commit Cache False-Green"
polarity: anti-pattern
use_this_when: "A gate result disagrees with observed behaviour, a hook finds drift a task reported clean, or you are about to cite a cached gate run as evidence."
category: build-system
proven_in: "v2 large-corpus-analysis kept candidate C23 (2026-06-30): recurring class — cached results masking real failures and broken tests, remote-cache poisoning replaying stale errors, cached format:root reporting clean while the pre-commit hook found drift."
proven_date: 2026-06-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Trusting a cached gate replay as evidence of current state — green over a broken tree, or stale red over a fixed one."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** A cached gate result is a replay of a past
> run, not an observation of the present tree.

## The failure mode

Turbo and pre-commit caching replay past results: a cached green masks a
now-broken task; remote-cache poisoning replays a stale error a fix already
cured; a cached `format:root` reports clean while the authoritative hook finds
drift (they hash different inputs). A fourth face (2026-07-25, deps lane):
**the cache key can exclude the very input a change altered** — after an
eslint-plugin major bump, `turbo run lint` returned FULL TURBO 47/47 cached in
three seconds, executing zero rules against the new plugin (resolved plugin
versions were not in the hash). The tell is the RUNTIME (a seconds-fast pass
over a change that should cost minutes); the cure is a forced uncached run
for any gate whose inputs a dependency change may have altered. Citing a
cached run as evidence of current
state is the same class as trusting a wrapper's exit code —
[`wrapped-exit-codes-false-green.md`](wrapped-exit-codes-false-green.md) is the
sibling at the process-wrapper surface; this is the cache-replay surface.

## The cure

When a gate result is load-bearing (a discrepancy diagnosis, a completion
claim, a "was this ever run?" question), re-run the task with `--force` or via
the authoritative hook, never from cache. Cache-input correctness lives in
`docs/engineering/build-system.md`; the operator quick list is
`docs/operations/troubleshooting.md` §Cache false-greens.

## Recurrence, 2026-08-13 — this pattern did not fire, and that is the finding

A Director seat ran `pnpm install && pnpm build` at the repo root in a fresh
worktree, read **exit 0**, and reported the worktree fixed. A *direct* build of
the failing package then failed. Turbo cache had satisfied the task without
executing it: the root build's success was a replay, exactly as this pattern
says.

The seat had not read this file. It went on to describe the incident to the
owner as a newly-discovered class.

**Why the recurrence matters more than the instance.** This pattern is stable,
well-scoped, and names the exact trap. It still did not reach the moment of use,
because a `patterns/` file is passive guidance and loses to whatever the agent is
already doing (`passive-guidance-loses-to-artefact-gravity` — which also did not
fire). Recurrence despite a correct home is evidence about the *mechanism*, not
about the lesson: the lesson is fine, the delivery is not.

Routed as recurrence evidence to the doctrine-traction lane (PDR-098's empty
quadrant) rather than being silently absorbed, because deleting the duplicate
discards the one signal that forces the mechanism decision.

**The sharpened operational form, for whoever does reach this file:** a cached
success is a claim about a past tree. To make it evidence about the present one,
run the task directly, or compare against a control that must fail. `exit 0` from
an aggregate runner says nothing about which member tasks actually executed.
