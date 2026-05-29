---
title: Curator pass — raw-input extraction (Highland Rising Squall)
date: 2026-05-29
agent: Highland Rising Squall / claude / claude-opus-4-8 / 71b264
claim: c2bb65a8-b1f5-4964-a73b-1ec8e7170be7
mode: dedicated-knowledge-curation (raw-input extraction lane)
scope: owner-scoped — raw-input backlog only; Shaded Prowling Threshold owns pending-graduations; comms preserved (not rotated); fitness owned by a separate session (owner redirect mid-pass)
synthesis_report: ../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-29.md
---

# Curator pass — raw-input extraction (2026-05-29)

## Mode and scope

`dedicated-knowledge-curation`, owner-scoped to **raw-input extraction**. The
owner commissioned a `consolidate-until-done` focused on extracting raw
understanding from the backlog of raw inputs, with explicit boundaries:

- **Shaded Prowling Threshold owns pending-graduations** — I extract and hand
  over graduation candidates; I do not write `pending-graduations.md`.
- **Comms (2766 events) preserved, NOT rotated** — owner-directed research
  preservation; step 3a (stale-comms rotation) suppressed this pass.
- **Fitness owned by a separate session** (owner redirect mid-pass) — knowledge
  preserved at full weight; no fitness-driven trimming; the mechanical napkin
  rotation (archive + reset) deferred to the fitness session.

## Method

8-agent workflow `wf_f02df2e0-791`: 6 parallel Sonnet corpus extractors →
cross-corpus synthesis → completeness critic. 748k subagent tokens, 25 min.
Every routed finding owner-verified against the live repo before action.

## Buffer / corpus disposition ledger

| Surface | Before | Disposition | After |
| --- | --- | --- | --- |
| `.remember/` dailies | 29 files (04-24→05-29) | **mined** for cross-day themes; read-only (plugin lifecycle) | left to plugin; insight routed to report + distilled |
| Codex memory (raw_memories, summary, MEMORY, rollouts) | 4 surfaces | **mined** cross-platform | extracted (B5, D2 are Codex-sourced); left in place |
| Cursor (prompt_history, chats) | 2 surfaces | **mined**; mostly completed-plan reference, Claude-side landing unverified | rejected-list near-patterns; left in place |
| Rotated napkins ≥2026-05-14 | 17 files | **synthesised** (step 6a historical pass) | evidence, not rewritten; marker advanced to 2026-05-28 |
| Recent experience files | 21 files (05-11→05-29) | **cross-read** (step 4c) | F-01/F-02 corroboration surfaced; thinning-register health flagged |
| `distilled.md` | 173 lines / 12 entries | **+8 verified-novel entries** (A1,A2,B1,B3,B4,B5,D2,D3) | grown; fitness owned by separate session |
| `napkin.md` | 463 lines (HARD) | **knowledge extracted**; this-session insights appended | mechanical rotation deferred to fitness session |
| comms `comms/` | 2766 events | **NOT processed/rotated** (owner preservation) | unchanged |
| `pending-graduations.md` | — | **NOT touched** (Shaded's lane) | unchanged; ~22 candidates handed to Shaded |

## Finding disposition (30 emergent findings)

- **8 → distilled.md** (verified novel cross-session lessons): A1 rule-traction
  gap, A2 substrate-encodes-outcome, B1 COMMIT_EDITMSG single-writer, B3
  repo-wide-auto-fix footgun, B4 git-apply-cached, B5 rerun-git-status, D2
  truthful-closeout-verdicts, D3 ADR-status-maturity.
- **~22 → Shaded (pending-graduations enforce-edge)**: see the synthesis report
  §Routing summary and the directed handoff event. PDR/ADR/rule/pattern shaped.
- **3 verified already-homed (no action)**: A4 framing-direction (PDR-014:576-645),
  D1-core Done-When (PDR-085 LANDED/RELEASED), A3-core enforcement (PDR-038:78);
  A5 escape-hatch lesson (distilled §2026-05-28 item 4).
- **1 already-shipped**: comms `--body-file` (cli-comms-commands.ts).
- **1 owner-routed**: routing-legacy-fallback sunset (separate agent; plan exists).
- **12 rejected near-patterns**: see report §Rejected near-patterns.

## Health flags (for owner / fitness session)

1. **Thinning subjective register** (cross-corpus, confirmed) — PDR-011/ADR-150
   capture-edge degradation signal. Loop-health, not a null.
2. **Contamination** in `today-2026-05-24.done.md` + `today-2026-05-27.done.md`
   (LLM compression artefacts leaked into capture) — remember-plugin lifecycle.
3. **Lost `/tmp` artefact**: `/tmp/ferny-pattern-v3-outline.md` (substrate-pointer
   pattern v3, 6 sub-variants) — recover/re-author from `napkin-2026-05-24-shaded-
   silencing-dusk` before the substrate-pointer PDR elevation. important-state-
   not-in-temp-files violation.

## Verdict

**complete (for the owner-scoped raw-input-extraction lane).** The raw-input
backlog is processed, understanding routed to durable homes (report + distilled),
graduation candidates handed to Shaded. Out of scope by owner direction and not
claimed complete here: pending-graduations drain (Shaded), comms processing
(preserved), fitness/strict-hard remediation incl. napkin rotation (separate
session).
