---
title: First napkin Discovery pass (large-corpus-analysis proving run)
date: 2026-06-29
agent: Wren stirs Rainbow
platform: claude
model: claude-opus-4-8[1m]
session_id_prefix: "093458"
mode: corpus-analysis-invocation (Discovery lens)
report: .agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/napkin-discovery-pass-1-2026-06-29.md
---

# Curator Pass — First Napkin Discovery Run

Metadata-only record (per `curator-passes/README.md`). Substance lives in the
research report named in `report:` above and in the durable homes it points at. This
file records the structural facts of the run.

## Boundary

The first Discovery pass of the large-corpus-analysis method (design report:
`large-corpus-analysis-runbook-design-2026-06-29.md`), run as the method's proving
instance over the napkin corpus. Read-only over the corpus (PDR-046 preserve-first);
the durable outputs are the research report + this record + the v2 design.

## Run facts

| Check | Result |
| --- | --- |
| Corpus re-derived at run | 100 files, 2026-02-16 → 2026-06-29, ~1.0M tok |
| Partition | 14 token-balanced time-contiguous windows; full coverage; 0 dropped; 0 unreadable |
| Map | 14 Sonnet agents; 414 raw signals |
| Calibrate-baseline | 18 patterns enumerated — 4 claims-doctrine / 9 collaboration-protocol / 5 validation-TDD (phantom comms-research arc correctly excluded) |
| Reduce | 20 emergent candidates + 5 negative-space findings (temporal + structural arms) |
| Validate (adversary) | 19 of 20 adjudicated; 1 (C06) unadjudicated on a StructuredOutput retry-cap |
| Keep / kill | 10 kept / 9 killed / 0 rerouted; both JS consistency tripwires empty |
| Recall (recomputed first-hand) | 0.28 strict, 0.56 lenient (the run's self-reported 0.72 was wrong) — below the 0.85 threshold |
| Cost | ~4.4M tokens first attempt (effort omitted → xhigh inherited on all 14 maps); rate-limit-truncated mid-validate, recovered by resume |

## Verdict

**Refine-and-rerun** (not graduate, not discontinue). Machinery sound + apophenia gate
functioning; recall below threshold but diagnostic (all 8 misses are single-window
defects, out of a Discovery-via-emergence pass's remit). Runbook graduation (PDR-120
reference runbook + adopting PDR per PDR-035) stays gated on a passing v2 rerun.

## Owner decisions captured

| Decision | Verdict |
| --- | --- |
| First-run shape | Full-corpus, straight through (2026-06-29) |
| Recovery after rate-limit | Resume now; quota is owner's concern (2026-06-29) |
| v2 adversary rigour | Full Tier 0+1+2 ensemble (owner overrode the minimum-tier recommendation) |
| v2 sequencing | Conserve now; implement v2 as a scoped TDD cycle |

## Carry-forward

- v2 design: `../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md`.
- v2 implementation plan: `../../plans/agentic-engineering-enhancements/current/large-corpus-analysis-v2-implementation.plan.md`.
- Reusable design-team protocol surfaced this run:
  `../../reports/agentic-engineering/agentic-design-panel-protocol-2026-06-29.md`.
