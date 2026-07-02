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
drift (they hash different inputs). Citing a cached run as evidence of current
state is the same class as trusting a wrapper's exit code —
[`wrapped-exit-codes-false-green.md`](wrapped-exit-codes-false-green.md) is the
sibling at the process-wrapper surface; this is the cache-replay surface.

## The cure

When a gate result is load-bearing (a discrepancy diagnosis, a completion
claim, a "was this ever run?" question), re-run the task with `--force` or via
the authoritative hook, never from cache. Cache-input correctness lives in
`docs/engineering/build-system.md`; the operator quick list is
`docs/operations/troubleshooting.md` §Cache false-greens.
