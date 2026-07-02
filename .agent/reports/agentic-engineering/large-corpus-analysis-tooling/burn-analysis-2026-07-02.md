# Corpus-Analysis Run Burn Analysis — 2026-07-02

Ground truth computed by summing `message.usage` across every per-agent
transcript (`subagents/workflows/wf_*/agent-*.jsonl`) for the discovery-run
session. This is the method of record for burn accounting: the harness
display and the workflow `subagent_tokens` counter both under-report (see
§Counters), and the 5-hour quota meter tracks the RAW total including cache
reads at roughly full weight.

## Calibration constants (measured this session)

- **Quota meter**: ≈ 1M raw tokens (input + cache-write + cache-read +
  output) per meter point; one 5h window ≈ ~100M raw tokens. Measured twice
  against owner meter readings (0→72% under ~113M; 37→68% under ~30M).
- **API prices** (per MTok, 2026-07: input / cache-write / cache-read /
  output): Sonnet 5 $3 / $3.75 / $0.30 / $15 (intro $2/$10 to 2026-08-31);
  Opus 4.8 $5 / $6.25 / $0.50 / $25; Haiku 4.5 $1 / $1.25 / $0.10 / $5.
- **Quota overflow behaviour**: exceeding the 5h subscription window did NOT
  stop the run — subagents silently moved to API billing. Budget in dollars,
  not only meter points.

## Per-run burn (raw tokens = in + cache-write + cache-read + out)

| Run | Agents | Raw tokens | API $ | Raw/agent (median) | Turns |
|---|---:|---:|---:|---:|---:|
| map, 15 windows (Sonnet/low, Read tool) | 15 | 19,020,182 | $29.93 | 1,177,190 | 12 |
| map, earlier partial attempt | 12 | 9,726,169 | $16.54 | 784,274 | 11 |
| reduce (Opus/high, no tools needed) | 1 | 380,511 | $3.22 | 380,511 | 2 |
| validate, Opus free-tool (aborted at 206) | 206 | 68,529,096 | $196.90 | 359,278 | 8 |
| validate, Sonnet free-tool (30-voter test) | 32 | 26,068,964 | $22.75 | 669,024 | 14 |
| **validate, Sonnet locked (full 246 + test leg)** | **1,020** | **51,230,994** | **$173.77** | **47,870** | **2** |
| meta (Opus/high, locked Glob/Grep/Read) | 1 | 2,466,918 | $4.64 | 2,466,918 | 25 |
| echo/hard-abort/lockdown probes (5) | 5 | 648,321 | $3.49 | — | — |
| **Session total (workflows)** | | **177,690,644** | **$448.08** | | |

## Per-agent-type unit costs (the estimator table)

| Agent type | Regime | Raw tokens/agent | $/agent | Meter pts/agent |
|---|---|---:|---:|---:|
| corpus-voter, locked | Sonnet/high, no tools, 1 turn | ~48k median (56k mean, max 150k) | ~$0.17 | ~0.05 |
| voter, free-tool | Sonnet/high, ~7 tool calls | ~814k | ~$0.71 | ~0.8 |
| voter, free-tool | Opus/high, ~5 tool calls | ~359k | ~$0.96 | ~0.36 |
| corpus-mapper | Sonnet/low, Read × ~7 files | ~1.27M | ~$2.00 | ~1.3 |
| corpus-reducer | Opus/high, inlined input | ~380k | ~$3.22 | ~0.4 |
| corpus-meta, locked | Opus/high, Glob/Grep/Read | ~2.47M | ~$4.64 | ~2.5 |

The dominant cost driver everywhere is TURNS × CONTEXT (cache reads of the
agent's own growing context on every tool call), never judgment output
(~3–4k/agent). Locking the tool surface collapsed the voter from 8–14 turns
to 1 and cut per-voter cost 7–17×.

## Agent-count formulas (pre-declare before every run)

- map agents = W (windows). Observed: 15.
- reduce agents = 1.
- validate agents = C + T1 + 3E, where E = tier-2 escalations, T1 = clean
  tier-0 keeps. Bounds: min 2C (all clean keeps), **max 4C** (full
  escalation, zero tier-1). Observed 2026-07-02: exactly 4C (246 → 984
  voters; the skeptical prompt escalates everything).
- meta agents = 1.
- Full-pipeline worst case for C candidates over W windows:
  `W + 1 + 4C + 1` agents.

Worked estimate, this corpus, locked regimes end-to-end: 15 + 1 + 984 + 1
= 1,001 agents ≈ 73M raw ≈ 73 meter points ≈ $210 API. The completed session
spent 178M / ~$448 because two free-tool regimes ran before the lockdown
(their $220 bought the diagnosis, the paired-comparison corpus, and the
lockdown design).

## Counters and their biases (do not mix them)

- **Transcript raw sum** (this report): the number the quota meter tracks.
  Method of record.
- **Workflow `subagent_tokens` / completion usage**: excludes most cache
  reads; reported 23.1M for a leg whose raw total was ~47M. Use for relative
  progress only.
- **Live progress display (`↓ N tokens`)**: further under-reports (12.2M at
  32m for the same leg). Never use for budget decisions.
- **Owner status snapshot for cross-checks**: 14:20 BST `519/520 agents ·
  32m10s · ↓ 12.2m` — agent counter also differs from journal ground truth
  (984 result records); treat display counts as UI approximations.
