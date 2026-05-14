# Practice Context Cost Baseline

**Captured**: 2026-05-05
**Purpose**: Initial baseline of context-window consumption from Practice
artefacts, gathered by passive harvest of existing session telemetry rather
than active instrumentation. Frozen snapshot — not maintained as a
current-state document.

This baseline supplies the empirical evidence named at
[memetic-immune-system-and-progressive-disclosure.plan.md][plan-progressive]
§Success Signals — *"A baseline measurement of session-open context cost
exists"* — which gates Workstream 4 (triggered rule loading / progressive
disclosure) for promotion.

## Method

Two complementary measurement surfaces, both **Claude Code-only at this
stage** (cross-platform extension is named in §Refinement Targets):

### 1. Passive harvest of session JSONLs

Existing Claude Code session JSONL files at
`~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/`
record every turn. Lines where
`.message.content[].type == "tool_use"` and `.name == "Read"` carry a
`.input.file_path` recording the file the agent loaded. Per-file token
cost is approximated by `chars / 4` (the standard rule of thumb for
English-prose markdown, ~10–15% accuracy; punctuation-dense or
code-heavy content closer to `chars / 3`).

For repeatable fileset measurements, use
`pnpm agent-tools context-cost --glob '<pattern>'`; for example,
`pnpm agent-tools context-cost --glob '.agent/rules/*.md'` reproduces
the canonical rule-tier measurement surface without re-deriving the
manual shell pipeline.

A worked extraction command:

```bash
SESSION=~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/<session-id>.jsonl
jq -r 'select(.type == "assistant") | .message.content[]?
  | select(.type == "tool_use" and .name == "Read") | .input.file_path' \
  < "$SESSION" | sort | uniq -c | sort -rn
```

### 2. Claude Code `/context` summary

The Claude Code `/context` slash command produces an authoritative
running summary of context-window consumption inside an active session:
the harness's hard-injected always-on tier, system prompt, tool
definitions, all messages, and current cumulative token usage. Where
the JSONL harvest measures *what files were read*, `/context` measures
*the cumulative context budget that resulted*.

Combine the two surfaces for triangulation:

- `/context` answers *"how much budget has this session consumed?"*
  with platform-authoritative tokens, including content invisible to
  the harvest (system-reminder injections, tool-result content,
  hard-injected adapter tier).
- JSONL harvest answers *"which Practice artefacts drove that
  consumption?"* by attributing per-file Read activity.

For chars/4 calibration, the Anthropic
`/v1/messages/count_tokens` endpoint can produce authoritative figures
for a single file when the approximation error matters.

### Limitations of this baseline

Owner-directed first pass — deliberately rough. The following are
known gaps:

- **Claude Code only at this stage**: the JSONL harvest depends on
  Claude Code's session-log shape; the `/context` command is a Claude
  Code slash command. Cursor (`~/.cursor/chats/`) and Codex
  (`~/.codex/history.jsonl`) have analogous surfaces that future
  passes must extend the methodology to cover (see §Refinement
  Targets).
- **Read tool only**: Bash output (cat, head, grep results), tool-result
  blocks, transcript carry-over, and system-reminder injections are NOT
  captured by the harvest. Practice-injected always-on adapter content
  (loaded by the Claude Code harness from `.claude/rules/`) is
  excluded from the harvest figure but IS reflected in `/context`.
- **Full-read assumption**: a Read with `offset`/`limit` is counted at
  the file's full size rather than the bounded slice. Upper bound.
- **No sub-agent reads**: each spawned sub-agent has its own JSONL
  under `subagents/agent-<id>.jsonl`; not aggregated here.
- **Single-session sample for the journey baseline**: illustrative,
  not statistically meaningful.

These limitations are deliberate scope for the first pass; refinement
targets are listed at §Refinement Targets.

## Always-On Rule Tier (frozen at 2026-05-05)

Two surfaces compose the always-applied rule tier:

| Surface | Files | Total chars | Estimated tokens |
| --- | ---: | ---: | ---: |
| `.agent/rules/*.md` (canonical) | 52 | 168,500 | ~42,125 |
| `.claude/rules/*.md` (Claude adapter) | 50 | 3,606 | ~900 |

The Claude Code harness injects only the adapters at session-open
(~900 tokens of `Read and follow .agent/rules/X.md` pointers, plus the
CLAUDE.md preamble). The canonical content (~42K tokens) is
**soft-loaded** — only consumed when the agent obeys the read
instruction. This distinction matters for the progressive-disclosure
question: hard-injected always-on is small; the cost expansion sits at
the soft-load step.

Per-file size distribution: the canonical tier is dominated by
`register-active-areas-at-session-open.md` (11,356 chars) and
`register-identity-on-thread-join.md` (9,169 chars). A long tail of
small rules (sub-3K chars each) covers most of the count.

## Entry-Point Graph + Memory Surface (frozen at 2026-05-05)

Files transitively loaded through `start-right-quick`:

| File | Chars | Estimated tokens |
| --- | ---: | ---: |
| `CLAUDE.md` | 57 | ~14 |
| `.agent/directives/AGENT.md` | 7,966 | ~1,991 |
| `.agent/directives/principles.md` | 24,704 | ~6,176 |
| `.agent/directives/orientation.md` | 5,332 | ~1,333 |
| `.agent/directives/user-collaboration.md` | 7,126 | ~1,781 |
| `.agent/directives/agent-collaboration.md` | 13,387 | ~3,346 |
| `.agent/directives/testing-strategy.md` | 20,823 | ~5,205 |
| `.agent/directives/tdd-as-design.md` | 8,652 | ~2,163 |
| `.agent/directives/schema-first-execution.md` | 4,097 | ~1,024 |
| `.agent/directives/metacognition.md` | 764 | ~191 |
| **Subtotal: directives** | **92,908** | **~23,227** |
| `.agent/skills/start-right-quick/shared/start-right.md` | 11,711 | ~2,927 |
| `.agent/memory/active/distilled.md` | 15,973 | ~3,993 |
| `.agent/memory/active/napkin.md` | 13,882 | ~3,470 |
| `.agent/memory/operational/repo-continuity.md` | 137,442 | ~34,360 |
| `.agent/memory/operational/threads/README.md` | 8,380 | ~2,095 |
| **Subtotal: start-right + memory** | **187,388** | **~46,847** |

Combined entry-point + memory surface: **~70,000 tokens** if every
file is fully consumed.

`repo-continuity.md` (137K chars / ~34K tokens) is the single largest
file in this graph; it dominates the start-right surface by a factor
of ~9× over the next-largest file.

## Illustrative Session Journey

**Sample**: session `dd239f96-9bf5-43b3-8b12-463a3e70e58d` (Lacustrine
Navigating Rudder, 2026-05-04 evening, *Step 3 no-speed-pressure rule
integration*). 750 turn records, 34 Read tool calls, 22 unique files.

| Reads | Chars (single-read) | Total tokens (reads × chars / 4) | File |
| ---: | ---: | ---: | --- |
| 5 | 171,296 | ~214,120 | `.agent/memory/operational/threads/observability-sentry-otel.next-session.md` |
| 5 | 57,587 | ~71,980 | `.agent/plans/observability/current/feat-eef-exploration-completion.plan.md` |
| 1 | 137,442 | ~34,360 | `.agent/memory/operational/repo-continuity.md` |
| 2 | 15,973 | ~7,986 | `.agent/memory/active/distilled.md` |
| 1 | 24,704 | ~6,176 | `.agent/directives/principles.md` |
| 1 | 21,378 | ~5,344 | `.agent/skills/commit/SKILL.md` |
| 2 | 9,069 | ~4,534 | `~/.claude/projects/.../memory/MEMORY.md` |
| 1 | 13,882 | ~3,470 | `.agent/memory/active/napkin.md` |
| 2 | 6,000 | ~3,000 | `.agent/state/collaboration/active-claims.json` |
| 1 | 11,711 | ~2,927 | `.agent/skills/start-right-quick/shared/start-right.md` |
| 1 | 8,847 | ~2,211 | `.agent/rules/respect-active-agent-claims.md` |
| 2 | 2,703 | ~1,350 | `.github/workflows/ci.yml` |
| 1 | 4,882 | ~1,220 | `agent-tools/src/collaboration-state/cli-claim-commands.ts` |
| 1 | 3,862 | ~965 | `RULES_INDEX.md` |
| 2 | 1,772 | ~886 | `agent-tools/src/collaboration-state/cli-options.ts` |
| 1 | 3,012 | ~753 | `.agent/rules/no-speed-pressure.md` |
| 1 | 2,125 | ~531 | `.husky/pre-push` |
| 1 | 1,603 | ~400 | `~/.claude/projects/.../memory/feedback_extensive_reviewers.md` |
| 1 | 299 | ~74 | `.cursor/rules/no-speed-pressure.mdc` |
| 1 | 136 | ~34 | `.agent/commands/start-right-quick.md` |
| 1 | 53 | ~13 | `.claude/rules/no-speed-pressure.md` |
| 1 | 53 | ~13 | `.agents/rules/no-speed-pressure.md` |
| **34** | — | **~362,347** | — |

**Total Read-only token cost for this session: ~362,000 tokens.**

## Headline Findings

1. **Two files dominated 79% of the journey**: the active thread
   record (~214K tokens, 5 reads) and the active plan (~72K tokens,
   5 reads). Re-reading the same long file is the largest single
   contributor to journey cost — implying that *change-detection*
   and *delta-only loading* would be high-leverage refinements.
2. **`repo-continuity.md` is a 34K-token single-read fixed cost**
   every session that follows the start-right protocol — the
   largest single-file fixed cost in the entry-point graph by a wide
   margin. Splitting or layering it would directly compress the
   start-right tier.
3. **The hard-injected always-on tier is small (~900 tokens of
   adapters)**; the canonical rule content (~42K tokens) is
   soft-loaded. Progressive-disclosure leverage applies to the
   soft-load step, not the harness injection — the harness is
   already minimal.
4. **Plain markdown is consistent with the chars/4 rule of thumb**;
   figures here are upper bounds because Read-with-offset/limit is
   counted at full size. Tool-result content (Bash outputs, etc.)
   is not counted at all and may be a comparable contributor;
   refinement should add it.
5. **The journey total (~362K tokens for one ~3-hour session) is a
   single sample; multi-session distribution is required before
   architectural conclusions**. This baseline establishes the
   harvest methodology, not a population statistic.

## Refinement Targets

Future passive-harvest passes should iterate on:

- **Multi-session aggregation**: harvest N≥10 sessions across multiple
  threads; compute median + tail distribution. Single-session sampling
  is illustrative only.
- **Read-with-offset accounting**: parse `input.offset` and
  `input.limit` to count actual bytes read rather than full file size.
- **Tool-result content**: aggregate Bash, Grep, Glob output sizes
  (subject to truncation by the harness — figure may be a lower bound).
- **Sub-agent journey roll-up**: walk `subagents/agent-<id>.jsonl`
  for each spawned sub-agent and aggregate per-thread totals.
- **System-injected context**: figure out the size of the harness's
  always-on injection (CLAUDE.md preamble + adapter files + skill
  registry + tool registry). This is currently invisible to the
  harvest.
- **Cross-platform extension**: the JSONL harvest and `/context`
  surface are Claude Code-only at this stage. Cursor
  (`~/.cursor/chats/`) and Codex (`~/.codex/history.jsonl`) require
  parser equivalents; per-platform context-summary commands need to
  be identified or built. Methodology (passive-only, no instrumentation
  observer effect) carries across platforms.
- **`/context` snapshot capture**: capture authoritative `/context`
  output at start, mid-session, and end-of-session for representative
  sessions. Compare cumulative budget against the JSONL-derived
  per-file attribution to triangulate hidden cost (tool results,
  system-injected content). Currently Claude Code-only.
- **Authoritative tokeniser**: spot-check the chars/4 estimate
  against the Anthropic `/v1/messages/count_tokens` endpoint for the
  heavy files, to calibrate the approximation error.

The agent-tools CLI named in
[memetic-immune-system-and-progressive-disclosure.plan.md][plan-progressive]
§Scope Expansion Register would naturally wrap the harvest logic into
a reusable command.

## References

- [memetic-immune-system-and-progressive-disclosure.plan.md][plan-progressive]
  — strategic plan whose Workstream 4 names this baseline as a
  promotion prerequisite.
- [PDR-044 — Memetic Immune System][pdr-044]
- [PDR-038 §2026-05-04 amendment — doctrine without enforcement at
  maturity][pdr-038]

[plan-progressive]: ../plans/agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md
[pdr-044]: ../practice-core/decision-records/PDR-044-memetic-immune-system.md
[pdr-038]: ../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md
