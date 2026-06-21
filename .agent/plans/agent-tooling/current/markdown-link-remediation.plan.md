---
plan_id: markdown-link-remediation
title: 'Markdown internal-link remediation — clear the live broken-link backlog, then make the gate blocking'
type: quality-fix
status: current
lifecycle: current
thread: agent-tooling
last_updated: 2026-06-21
related:
  - ./README.md
  - ../../../rules/documentation-hygiene.md
---

# Markdown internal-link remediation

> **Executable plan (`current/`), queued for a dedicated session.** Authored 2026-06-21 alongside
> the `validate-markdown-links` repo-validator. The validator finds and reports the backlog
> (non-blocking); **this plan clears it and then flips the gate to blocking.** Do not run it in the
> same session that builds the validator — the owner directed remediation as a separate session.

## End goal, mechanism, and means

- **End goal.** Every internal markdown link in the **live (non-archive)** estate resolves, so
  readers and agents never follow a dead link, and the `validate-markdown-links` gate can run
  **blocking** — turning link-correctness from a thing checked by hand into an enforced invariant.
- **Mechanism.** A standing validator already finds every broken link and, where the only error is
  relative-path depth, computes the correct path. Remediation is therefore mostly mechanical
  (apply the computed fixes) plus a bounded manual tail (renames/deletes/archived targets), after
  which the gate enforces the invariant so the backlog cannot silently re-accumulate.
- **Means.** Run the validator → apply its auto-fix suggestions → manually triage the residue →
  flip the gate to blocking. See todos.

## Prerequisite

- **`validate-markdown-links` validator landed** — `blocking`. This plan consumes its report
  (the work-list) and its auto-fix suggestions. Without it there is no deterministic work-list.

## Todos

```yaml
todos:
  - id: baseline
    content: 'Run validate-markdown-links; capture the current broken/auto-fixable/manual counts as the baseline work-list'
    status: pending
  - id: apply-auto-fixes
    content: 'Apply the validator-suggested corrections (the unique-basename / ../-depth cases) by explicit pathspec; re-run to confirm each resolves'
    status: pending
  - id: triage-manual
    content: 'Manually triage the residue (renames, deletions, archived targets): repoint to the moved file, delete the dead reference, or reduce to plain historical text per archive discipline'
    status: pending
  - id: flip-gate-blocking
    content: 'Flip validate-markdown-links to blocking (BLOCKING=true) and add it to the blocking repo-validators chain; confirm pnpm repo-validators:check fails on a planted broken link and passes clean'
    status: pending
```

## Acceptance criteria

- `validate-markdown-links` reports **0 broken** internal links across the live (non-archive)
  estate.
- Every applied auto-fix and every manual repoint is staged by explicit pathspec with a recorded
  reason; no archive file is edited (archives are excluded by design).
- The gate is **blocking**: a planted broken link fails `pnpm repo-validators:check`; a clean tree
  passes. (Deterministic validation: plant-and-revert a known-bad link.)
- No content is lost: a dead reference is repointed or reduced to plain text, never silently
  deleted along with its surrounding meaning.

## Non-goals

- **No archive edits** — `**/archive/**` and `*.original.md` are excluded from the scan and from
  remediation.
- **No cross-file fragment validation** — out of scope for this round (a later validator
  enhancement); this plan is file-existence remediation only.
- **Not building the validator** — that landed separately; this plan only consumes it.

## Risks

| Risk | Mitigation |
| --- | --- |
| An auto-fix repoints to the wrong file (basename collision the validator thought unique) | The validator suggests only on a *unique* non-archive basename match; spot-check a sample; re-run after applying |
| Flipping to blocking strands a peer's in-flight broken link | Flip only after a clean run; announce before the gate change |
| Manual triage silently deletes meaning | Acceptance requires repoint-or-reduce-to-text, never bare deletion |

## Foundation alignment

`documentation-hygiene` (link integrity); `never-disable-checks` / `all-gates-blocking` (the gate
flips to blocking, the end state of new-rules-start-at-warn); `stage-by-explicit-pathspec`.
