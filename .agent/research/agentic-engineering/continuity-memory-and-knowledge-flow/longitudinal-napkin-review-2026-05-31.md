---
title: Longitudinal napkin review - 2026-05-31
date: 2026-05-31
agent: Blooming Twining Grove
mode: dedicated-knowledge-curation
claim_id: 74d3d9ab-c14e-4a88-82b9-d4be2c55f99a
scope: current active napkin plus the twenty most recent archived napkins
---

# Longitudinal napkin review - 2026-05-31

## Completion Standard

This review follows the dedicated knowledge-curation boundary from
`codex-napkin-longitudinal-review.brief.md`: preserve substance, treat fitness
as routing evidence only, do not rewrite archives, and complete only by
item-level dispositions. The allowed dispositions used below are `graduated`,
`duplicate`, `owner-gated`, `stale-withdrawn`, and `rejected`.

No archive file was edited. Comms events were checked only for coordination; the
paused comms-rotation backlog was not processed as a curation source.

## Corpus

The corpus was recomputed with `rg --files ... | sort | tail -20` and matched
the brief's expected archive window. The review read the active napkin and the
twenty archived napkins listed here, using full-file indexing plus exact
line-number reads for cited evidence.

| Source | Lines | Status |
| --- | ---: | --- |
| `.agent/memory/active/napkin.md` | 78 | read |
| `.agent/memory/active/archive/napkin-2026-05-12b.md` | 1166 | read |
| `.agent/memory/active/archive/napkin-2026-05-13.md` | 605 | read |
| `.agent/memory/active/archive/napkin-2026-05-14.md` | 635 | read |
| `.agent/memory/active/archive/napkin-2026-05-17.md` | 669 | read |
| `.agent/memory/active/archive/napkin-2026-05-21.md` | 1797 | read |
| `.agent/memory/active/archive/napkin-2026-05-22-evening.md` | 598 | read |
| `.agent/memory/active/archive/napkin-2026-05-22.md` | 1327 | read |
| `.agent/memory/active/archive/napkin-2026-05-24-curator-fourth-rotation.md` | 36 | read |
| `.agent/memory/active/archive/napkin-2026-05-24-curator-third-rotation.md` | 234 | read |
| `.agent/memory/active/archive/napkin-2026-05-24-knowledge-curator-continuation.md` | 479 | read |
| `.agent/memory/active/archive/napkin-2026-05-24-pelagic-hard-napkin-window.md` | 453 | read |
| `.agent/memory/active/archive/napkin-2026-05-24-post-m1-cleanups-window.md` | 336 | read |
| `.agent/memory/active/archive/napkin-2026-05-24-shaded-silencing-dusk.md` | 2412 | read |
| `.agent/memory/active/archive/napkin-2026-05-25-breezy-critical-hard-curation.md` | 442 | read |
| `.agent/memory/active/archive/napkin-2026-05-25-misty-director-session.md` | 242 | read |
| `.agent/memory/active/archive/napkin-2026-05-26-feathered-hard-curation.md` | 451 | read |
| `.agent/memory/active/archive/napkin-2026-05-26-thermal-critical-curation.md` | 392 | read |
| `.agent/memory/active/archive/napkin-2026-05-27-hidden-dimming-threshold-curation.md` | 299 | read |
| `.agent/memory/active/archive/napkin-2026-05-28-sylvan-curation.md` | 408 | read |
| `.agent/memory/active/archive/napkin-2026-05-31-foamy-docs-consolidation.md` | 1037 | read |
| **Total** | **14096** |  |

## Prior Syntheses Read First

The 2026-05-09 synthesis already names fitness-as-trim, catalogue drift,
vaporware-cited deferral, generated read-model drift, and the long-arc
finish-line problem. The 2026-05-13 synthesis already names capture-does-not-cure,
coordinator amplification, overloaded completion language, single-writer commit
windows, thread-record drift, identity tuple insufficiency, and monitor freshness.
The 2026-05-29 synthesis already names rule-traction gaps, substrate alignment,
commit-message single-writer pressure, auto-fix peer-file risk, post-gate status
refresh, truthful closeout verdicts, ADR maturity, comms watcher filter/flood,
claims-helper minimum shape, and corpus-health concerns.

That means this pass did not treat every recurring observation as a new
candidate. A finding only routed forward when the current corpus added either a
new failure shape or proof that the old route had not changed action-time
behaviour.

## Findings and Dispositions

| ID | Finding | Missed-by-earlier-pass analysis | Disposition |
| --- | --- | --- | --- |
| F1 | Active-buffer replacement needs a pre-replacement proof check. | Earlier doctrine already says preservation outranks fitness, but the 2026-05-31 repair shows a sharper failure: an active source buffer was archived and replaced by a pointer before item-level disposition was trustworthy. The later repair only became valid after the active content was restored, checked against a ledger, and routed to live homes. The missed move is not "preserve archives"; it is "block active-buffer replacement until proof exists." | `owner-gated` |
| F2 | Shell-significant collaboration CLI arguments need structural affordance. | Prior passes captured `--body-file`, quoting reminders, and claim-helper friction. The current and recent napkins show recurrence anyway: markdown backticks in shell-quoted comms bodies, unquoted `**` claim patterns, unquoted active-claim globs, and the current session's repeated unquoted comms glob. Since the shell expands before the CLI can validate, prose reminders and generic duplicate labels are not enough. | `owner-gated` |
| F3 | Verification artefacts are claims to test. | This was not missed. The 2026-05-31 source-buffer repair adds a vivid instance, but the durable route already exists in `pending-graduations.md` under verification artefacts and withdrawal verdicts. | `duplicate` |
| F4 | Pass-forward surfaces drift after reshapes and repairs. | This was partly captured before as thread-record drift and supersession refresh. The newest corpus adds stale brief surfaces and correction-propagation misses, but those fit existing owner-gated routes: plan narrative drift, recorded verdicts as claims, and supersession refresh. | `duplicate` |
| F5 | Current compact active surfaces are proof of safe curation. | Rejected as a candidate. The compact active napkin and distilled surfaces are healthy only because the repair pass preserved source archives, wrote ledgers, and routed remaining items. Compactness alone is not proof, and promoting it would invert the preservation rule. | `rejected` |
| F6 | Source archives themselves should be curated or rewritten. | Rejected for this scope. Archives are evidence, not the work surface for this pass. The valid work is to cite them, route candidate substance, and leave the verbatim source untouched. | `rejected` |

## Owner-Gated Routes Added

Two entries were added to `pending-graduations.md` under
`2026-05-31 longitudinal napkin-review gates`:

- Active-buffer replacement needs a pre-replacement proof check.
- Shell-significant collaboration CLI arguments need structural affordance.

Both are explicitly owner-gated. They are not claimed as implemented doctrine;
their target homes require owner direction or a later narrow tooling/doctrine
pass.

## Duplicate Routes Kept Closed

These observations were left as duplicate rather than re-added:

- Verification artefacts as claims: already owner-gated in the 2026-05-31
  distilled final gates.
- Pass-forward surface drift: already covered by the 2026-05-31 source-buffer
  and distilled final gates.
- Claims-helper minimum shape: already covered by the older collaboration
  tooling friction register and the 2026-05-29 synthesis; F2 only reopens the
  narrower shell-expansion affordance because it recurred in this live session.

## Corpus Health

The active napkin is short and currently healthy, but this pass treats that as
an output state rather than proof. The source corpus still matters because the
active buffer has just been through a repair after invalid archive-only
replacement. Future curation should continue to prefer a restored-source plus
item-ledger proof over any archive pointer or soft-only fitness reading.

The 2026-05-29 warnings about thinning subjective register, imported-memory
contamination, and lost temporary artefacts remain valid corpus-health notes.
This review did not find new evidence strong enough to graduate those warnings;
they remain background risk rather than new entries.

## Completion Proof

- Identity preflight returned Blooming Twining Grove, codex, GPT-5, `019e7d`.
- Claim `74d3d9ab-c14e-4a88-82b9-d4be2c55f99a` was opened before edits.
- The archive list was recomputed and matched the brief's twenty-file window.
- Current active napkin plus all twenty archive files were processed.
- Prior longitudinal syntheses from 2026-05-09, 2026-05-13, and 2026-05-29 were
  read before routing candidates.
- `pnpm practice:fitness:strict-hard` passed before report writing with
  0 hard and 0 critical findings.
- Final validation is recorded in
  `.agent/memory/operational/curator-passes/2026-05-31-codex-napkin-longitudinal-review.md`.
