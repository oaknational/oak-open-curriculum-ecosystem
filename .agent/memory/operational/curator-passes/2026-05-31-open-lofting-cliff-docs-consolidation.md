---
title: Curator pass - dedicated docs consolidation
date: 2026-05-31
agent: Open Lofting Cliff / codex / GPT-5 / 019e7d
claims: 74ded4c9-4379-4e8c-b65b-81a52b653c26; 33630ddc-be97-42bd-9a56-9f12b2ec3310
mode: dedicated-knowledge-curation
scope: owner-scoped docs consolidation; draft ADRs and PDRs first, pending graduations second, distilled third
---

# Curator pass - dedicated docs consolidation (2026-05-31)

## Mode and scope

`dedicated-knowledge-curation`, scoped by owner direction to documentation and
reference surfaces. This pass preserves insight and routes knowledge; it does
not fitness-chase.

Owner order for this pass:

1. Draft ADRs and PDRs.
2. Pending graduations.
3. Distilled.

Explicit boundary: source capture surfaces such as napkin, platform memories,
comms events, and comms event history are owned by a separate session. Comms-log
rotation is paused pending a dedicated comms research plan.

Continuation note: after the first slice closed, the owner reopened the goal as
`oak-consolidate-until-done` with the same boundary: Eclipsed Stealing Raven
processed source files; Open Lofting Cliff processed non-source documentation,
governance, and register surfaces.

## Draft ADR / PDR inventory

Inventory command:

```bash
node -e "<decision-record status inventory script>"
```

Current non-accepted decision-record inventory after the PDR-089 owner verdict:

| Surface | Count | Entries |
| --- | ---: | --- |
| PDR Proposed | 11 | PDR-063, PDR-064, PDR-065, PDR-066, PDR-067, PDR-068, PDR-071, PDR-072, PDR-073, PDR-081, PDR-082 |
| PDR Draft | 2 | PDR-069, PDR-070 |
| PDR Candidate | 2 | PDR-074, PDR-075 |
| ADR Proposed | 6 | ADR-104, ADR-157, ADR-162, ADR-182, ADR-184, ADR-185 |

## Draft ADR / PDR dispositions

| Item | Disposition | Evidence |
| --- | --- | --- |
| PDR-075 | `graduated` to index coverage | Record existed but was missing from the PDR index; added the README row. |
| PDR-078 | `duplicate / stale-index corrected` | Record status is Accepted, but the PDR index and Practice bridge still said Candidate; corrected both. |
| PDR-089 | `graduated` | Owner accepted PDR-089 on 2026-05-31; record status and PDR index now say Accepted. |
| PDR-063, PDR-064, PDR-065, PDR-066, PDR-067, PDR-068, PDR-069, PDR-070, PDR-071, PDR-072, PDR-073, PDR-074, PDR-081, PDR-082 | `carried-forward` | Existing statuses remain live; this pass found no owner-ratified acceptance trigger in the read surfaces. |
| ADR-104, ADR-157, ADR-162, ADR-182, ADR-184, ADR-185 | `carried-forward` | Existing Proposed statuses remain live; no owner-ratified acceptance trigger found in this pass. |

## Pending-graduations dispositions

| Register section | Disposition | Evidence / next trigger |
| --- | --- | --- |
| 2026-05-31 conservation-reflex doctrine | `graduated` | Owner accepted PDR-089 on 2026-05-31; removed the live pending-graduations item and retained this ledger as disposition evidence. |
| 2026-05-28 EEF graph-tool category + graph-delivery doctrine | `carried-forward` | Trigger is live EEF D3/D4 contract ratification; current continuity says D0 is complete and D1/D2 are next. |
| 2026-05-28 self-correcting measurable deliverables | `carried-forward` | Trigger is plan D5; D5 has not fired. |
| 2026-05-28 Definition-of-Delivery refinement | `carried-forward` | Trigger is plan D5 / owner direction; not fired in current surfaces. |
| 2026-05-28 Working with graphs skill(s) | `carried-forward` | Trigger is plan D5 from the real built tool / contract; not fired. |
| 2026-05-28 proportionate exploration | `carried-forward` | Trigger is second instance or owner direction; this pass found no second instance in selected surfaces. |
| 2026-05-31 source-buffer gates | `owner-gated` | Eclipsed source pass routed active napkin/distilled source items into `pending-graduations.md` with item-level triggers; non-source pass verified the ledger exists and did not promote owner-gated doctrine. |
| Owner-Gated Pending Graduations section | `already owner-gated` | The section already carries item-level owner gates. This pass did not reopen the 56-item owner-decision packet. |

## Distilled dispositions

| Distilled entry | Disposition | Evidence / next trigger |
| --- | --- | --- |
| 2026-05-31 reshaped-decision propagation | `graduated via PDR-089` | PDR-089 is Accepted and carries the propagation doctrine. |
| 2026-05-30 default-replace in remediation | `graduated via PDR-089` | PDR-089 is Accepted and carries the default-replace remediation doctrine. |
| Previous active distilled register | `invalid archive-only move repaired` | Active `distilled.md` content was restored after owner correction; the failed 2026-05-31 archive copy was deleted. |

## Repair processing batch

| Item | Disposition | Evidence |
| --- | --- | --- |
| Distilled 2026-05-31 propagation entry | `graduated` | Removed from active `distilled.md` because PDR-089 is Accepted and covers corrected-decision propagation in its Decision section. |
| Distilled 2026-05-30 default-replace entry | `graduated` | Removed from active `distilled.md` because PDR-089 is Accepted and covers default-replace remediation in its Decision section. |
| Distilled 2026-05-28 Cursor statusline entry | `duplicate` | Removed from active `distilled.md`; the live platform wrapper table in `agent-tools/docs/agent-identity.md` records Cursor sessionStart/statusline wiring, delegate-to-Claude adapter path, and `pnpm agent-tools:install-cursor-statusline`. |
| Distilled 2026-05-28 EEF wrong-shape episode | `owner-gated` | Removed from active `distilled.md`; canonical pending-graduations holds the graph-tool category, self-correcting deliverables, Definition-of-Delivery refinement, working-with-graphs skill, and proportionate-exploration follow-ons with D3/D4/D5, second-instance, or owner-direction triggers. |
| Distilled 2026-05-27 generated-adapters entry | `duplicate` | Removed from active `distilled.md`; ADR-125 and `.agent/README.md` now state that adapters are generated from canonical `.agent/` content via `agent-tools:skills-adapter-generate` and manual adapter edits are forbidden. |
| Distilled 2026-05-29 flag-gated feature entry | `owner-gated` | Removed from active `distilled.md`; canonical pending-graduations now holds the full dark-launch surface-enumeration candidate under `Feature flags must gate every naming surface through the real env path`, with trigger `second flag-gated feature or owner direction`. |
| Distilled 2026-05-29 fixed canonical data entry | `owner-gated` | Removed from active `distilled.md`; canonical pending-graduations now holds the fixed-corpus derive-never-verify candidate and the read-primary-artefact sibling under `Fixed canonical data is authority` / `Read the primary artefact before machinery or reviewers`, gated on EEF D3/D4 contract ratification, second instance, or owner direction. |

## Open-questions disposition

| Item | Disposition | Evidence |
| --- | --- | --- |
| Q-001 gate-1a EEF tool narrowing question | `stale-withdrawn, still live pending real cleanup` | The entry was already withdrawn because gate-1a/1b framing was superseded by the EEF rebuild. Open Lofting Cliff briefly moved it to an archive, which was an invalid archive-only cure; the entry is restored to `open-questions.md` until a future pass performs an acceptable lifecycle cleanup. |

## Repo-continuity disposition

| Item | Disposition | Evidence |
| --- | --- | --- |
| 2026-05-28 to 2026-05-30 handoff-gate history | `invalid archive-only move repaired` | Open Lofting Cliff moved this history to a fresh archive to improve the fitness report. That violated `consolidate-until-done`; the prose is restored to `repo-continuity.md`, and the fresh archive sidecar was removed. These items remain unprocessed until a future pass gives item-level dispositions. |

## Foamy continuation batch - distilled dispositions

Current-session continuation claim:
`bb4343ba-c403-4bea-8629-654e39481a24`.

Strict-hard before this batch: CRITICAL overall with `napkin.md` CRITICAL,
`repo-continuity.md` CRITICAL, and `distilled.md` HARD. The changes below are
item dispositions, not fitness-score work.

| Distilled entry | Disposition | Evidence |
| --- | --- | --- |
| 2026-05-28 forced conclusion / deference can be a hedge | `duplicate` | Removed from active `distilled.md`; `.agent/rules/present-verdicts-not-menus.md` carries the forced-verdict and responsibility-passback doctrine with PDR-057/PDR-058 anchors. |
| 2026-05-14..28 declarative capture / rule-traction gap | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the action-time structural-interrupt candidate with an owner/Core-pass trigger. |
| 2026-05-25..26 substrate encodes outcome | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the substrate-alignment-as-Practice-design candidate. |
| 2026-05-25 repo-wide auto-fix footgun | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the multi-agent autofix peer-file-check candidate. |
| 2026-05-26 `git apply --cached` surgical staging | `duplicate` | Removed from active `distilled.md`; `.agent/memory/collaboration/cross-lane-commit-blocking.md` carries the worked pattern and the `git apply --cached` primitive. |
| 2026-05-27 post-long-gate git status refresh | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the post-long-gate status-refresh candidate. |
| 2026-05-25 ADR status maturity mismatch | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the ADR-status-matches-maturity candidate. |

Counts for this batch: `distilled.md` entries processed: 7; duplicate: 2;
owner-gated: 5; graduated: 0; stale-withdrawn: 0.

Strict-hard after this batch: `distilled.md` moved from HARD to SOFT; overall
fitness remains CRITICAL because `napkin.md` and `repo-continuity.md` still need
real item-level processing.

## Foamy continuation batch 2 - distilled dispositions

| Distilled entry | Disposition | Evidence |
| --- | --- | --- |
| 2026-05-29 recorded verdict / frame to test | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the evaluator-grounding candidate with a second-instance or owner-direction trigger. |
| 2026-05-28 verify the auditor | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the curation-discipline amendment candidate, with Sunlit/Tempestuous evidence named. |
| 2026-05-28 `tail -F \| grep` rewrite re-emits history | `duplicate` | Removed from active `distilled.md`; canonical `pending-graduations.md` already holds the watcher verification and filter-loss failures candidate for the dedicated comms research plan. |
| 2026-05-27 merge/divergence risk from content | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the content-derived merge-risk candidate. |
| 2026-05-27 session-opener fitness stale | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the rerun-fitness-before-acting candidate. |
| 2026-05-27 collaboration state source, not storage | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the state-as-source candidate for collaboration lifecycle research. |
| 2026-05-27 supersession refresh continuity chain | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the supersession-continuity candidate. |
| 2026-05-27 production reachability / deployed registration | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the deployed-registration candidate. |
| 2026-05-27 delegate by judgment-load | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the judgment-load delegation candidate. |
| 2026-05-22..25 `COMMIT_EDITMSG` single-writer | `duplicate` | Removed from active `distilled.md`; `commit-queue-multi-writer-cure.plan.md` carries Tranche C native intent-scoped commit message storage and names `.git/COMMIT_EDITMSG` as shared single-writer state. |
| 2026-05-27 closeout verdicts / live acceptance evidence | `owner-gated` | Removed from active `distilled.md`; canonical `pending-graduations.md` now holds the truthful-closeout-language candidate. |

Counts for this batch: `distilled.md` entries processed: 11; duplicate: 2;
owner-gated: 9; graduated: 0; stale-withdrawn: 0.

## Foamy source-buffer and continuity dispositions

| Surface | Disposition | Evidence |
| --- | --- | --- |
| `napkin.md` restored source buffer | `rotated after item disposition` | Verbatim source preserved at `active/archive/napkin-2026-05-31-foamy-docs-consolidation.md`; active napkin now points to the Eclipsed source-buffer ledger, this continuation ledger, and the canonical pending-graduations owner gates. |
| `repo-continuity.md` restored historical prose | `compacted to operational index after disposition` | Verbatim pre-compaction state preserved at `operational/archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`; active repo-continuity now carries only current pickup state, active/paused thread index, next safe steps, invariants, and a pending consolidation verdict. |

These archives are not substitute completion evidence. They preserve source text
after the disposition ledger names the active homes and remaining owner gates.

## Doctrine drift corrected

The owner-stated comms-retention correction from the Codex brief was applied to
the live consolidation doctrine:

- `consolidate-docs` no longer treats comms-event age as a routine trigger.
- `consolidate-docs` step 3a now states comms-event rotation is paused pending a
  dedicated comms research plan.
- `collaboration-state-conventions.md` now matches that paused-lifecycle
  posture.
- `repo-continuity.md` retains the invariant as a resume aid.

## Current verdict

**failed pass repaired.** The original archive-only moves were invalid; this
continuation repaired them by restoring source material, recording item-level
dispositions, preserving verbatim archives only after disposition, and compacting
the active surfaces back to their intended roles.

Validation after the Foamy continuation:

- targeted markdownlint: pass;
- `git diff --check`: pass;
- `practice:vocabulary`: pass;
- `practice:fitness:strict-hard`: pass with SOFT only, `18 soft`, `28 healthy`,
  `0 hard`, `0 critical`.

This is a repaired consolidation pass, not proof that every owner-gated doctrine
is promoted. Owner-gated items remain in `pending-graduations.md` until their
named trigger fires.
