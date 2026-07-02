---
name: "Session Context Usage CLI"
plan_id: session-context-usage-cli
collection: agent-tooling
lane: current
status: "DRAFT — fresh-session READINESS REVIEW REQUIRED before execution (authored 2026-06-28 by Pegasus guards Dawn at ~53% context / post-peak; the PROPOSED decisions below are NOT ratified — ws0 is the gate)"
created: 2026-06-28
owner_thread: agentic-engineering-enhancements
programmes: [agent-systems-awareness]
overview: >-
  A vendor-routed agent-tools subcommand that, given a vendor/platform and a session id,
  reads the session's recorded context usage from that vendor's transcript and returns
  structured {window, used, remaining} tokens + percentages — so an agent can MEASURE its
  own (or a peer's) context occupancy instead of confabulating a felt "I'm spent" level.
  The mechanism is reading the vendor's already-counted usage (Claude: message.usage =
  input + cache_creation + cache_read on the latest turn), NOT estimating tokens.
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agent-tooling / agent-experience (self-awareness primitives)
  derives_from:
    - ".agent/plans/agent-tooling/current/context-cost-cli.plan.md (the IMPLEMENTED sibling that deferred 'session JSONL harvest / cross-platform session-log adapters' as an explicit out-of-scope follow-up — this plan is that follow-up; the harvest use case has now promoted)"
    - "PDR-063 mid-cycle-retirement trigger calibration (owner-taught 2026-06-28: handover decision rides the non-linear effectiveness curve, ~50% start; this tool is the SENSOR that makes that trigger actionable rather than felt — comms f3e4158e)"
todos:
  - id: ws0-readiness-review
    content: "Fresh-session readiness review GATE (blocks all build WS). Critically review this whole plan in a genuinely fresh seat: ratify or revise every PROPOSED decision (D1-D7), settle the open questions (Q1-Q4 — esp. window-variant resolution and sibling-command-vs-fold-into-context-cost), and confirm the mechanism (read recorded usage, not estimate). Dispatch assumptions-expert + type-expert + architecture-expert. Do NOT rubber-stamp: this was drafted from a post-peak seat."
    status: pending
  - id: ws1-window-registry
    content: "WS1: pure model->window registry + variant resolution. resolveWindow(modelId) returns {window_tokens, source} or an explicit 'ambiguous'/'unknown' result; the 200k-vs-1M [1m] variant is the critical correctness case. One commit, tree green."
    status: pending
    depends_on: [ws0-readiness-review]
  - id: ws2-vendor-adapter
    content: "WS2: vendor adapter interface + Claude JSONL adapter. Locate transcript by session_id; read the LATEST assistant turn's model + usage (input + cache_creation + cache_read = current occupancy); injectable fs seam (mirror context-cost's ContextCostFileSystem); skip-not-throw on malformed lines. One commit, tree green."
    status: pending
    depends_on: [ws0-readiness-review]
  - id: ws3-core-compute
    content: "WS3: pure core. computeUsage({used, window}) -> {used, remaining, pct_used, pct_remaining} + the structured output object; honest fields for freshness (one-turn lag) and window_source. One commit, tree green."
    status: pending
    depends_on: [ws1-window-registry]
  - id: ws4-cli-parser
    content: "WS4: pure CLI option parser. parseArgs(argv) -> discriminated union over --vendor (required), --session-id (required), --json, --help; missing/unknown handled. One commit, tree green."
    status: pending
    depends_on: [ws0-readiness-review]
  - id: ws5-cli-integration
    content: "WS5: CLI integration. Register the topic in the agent-tools binary; wire the Claude adapter; integration test against a fixture JSONL (text + JSON output, ambiguous-window refusal, missing-session error). One commit, tree green."
    status: pending
    depends_on: [ws2-vendor-adapter, ws3-core-compute, ws4-cli-parser]
  - id: ws6-docs-and-followons
    content: "WS6: docs slice. agent-tools/README entry; crosswalk back-link in context-cost-cli.plan.md (names this as the landed harvest follow-up); record the firing-gate hook + non-Claude adapters as named future scope. One commit, no behaviour change."
    status: pending
    depends_on: [ws5-cli-integration]
isProject: false
---

# Session Context Usage CLI

**Status**: DRAFT — **fresh-session readiness review REQUIRED before execution** (see §Readiness Gate).
**Authored**: 2026-06-28 by Pegasus guards Dawn (`41fd72`) at ~53% context (post-peak on the effectiveness curve). The PROPOSED decisions below are the author's best design, **not ratified** — ws0 must critically review them in a fresh seat.

## Crosswalk (why this is NOT a duplicate)

[`context-cost-cli.plan.md`](context-cost-cli.plan.md) is **IMPLEMENTED** and answers *"what is the token cost of these **files**?"* by **estimating** (chars/4) over a glob set. It explicitly lists as a non-goal: *"Session JSONL passive harvest as an input mode… Cross-platform session-log adapters (Claude/Cursor/Codex history)… Add as a follow-up plan if the harvest use case promotes."* **This plan is that follow-up.** Distinct input (a session id, not globs), distinct mechanism (**read the vendor's already-counted `message.usage`**, not estimate), distinct output (a session's window/used/remaining, not a fileset's cost). The fresh-session review (Q2) must still decide sibling-command vs a `--session` mode on `context-cost`.

## Problem

- **Gap**: an agent has no introspective context gauge. The only way to know "how full am I?" today is an ad-hoc transcript parse (done manually this session) or a confabulated felt level.
- **Who it harms**: every agent making a continue / handover / fresh-seat decision; the team, when handovers are mistimed into the degraded zone.
- **Mechanism (causal hypothesis)**: the authoritative number already exists — each vendor records per-turn usage in its session transcript (Claude: `message.usage`). A thin, vendor-routed, read-only reader over the *latest* turn surfaces current occupancy as structured output.
- **Worked motivation (this session)**: I asserted "context-deep / spent" repeatedly, then measured ~528k/1M = ~53% from the transcript — past peak, but nowhere near "spent". The felt level was wrong; measurement corrected it. Owner doctrine: handover timing rides a **non-linear effectiveness curve** (peak ~40–45%, start handover ~50%, rising risk ~65%, degraded ~80%). That doctrine is unactionable without this sensor.
- **What success looks like**: `pnpm agent-tools context-usage --vendor claude --session-id <id>` returns `{window_tokens, used_tokens, remaining_tokens, pct_used, pct_remaining, model, freshness, window_source}` an agent can act on.

## End goal · Mechanism · Means

- **End goal**: any agent can mechanically read its own (or a peer's) session context occupancy and percentage in one command.
- **Mechanism**: vendor adapter locates the transcript and reads the latest turn's recorded usage + model; a pure core divides by a model→window registry value; structured output with honest freshness/denominator metadata.
- **Means**: a model→window registry (WS1), a vendor adapter interface + Claude adapter (WS2), a pure compute core (WS3), a CLI parser (WS4), CLI integration with a fixture-JSONL integration test (WS5), docs + future-scope notes (WS6). Reuse context-cost's proven pure-core/IO-at-the-edge shape and injectable-fs seam.

## Readiness Gate (ws0 — blocks all build work)

This plan does not execute until a **fresh session** has critically reviewed it. The author was post-peak; treat the PROPOSED decisions as input-to-verify, not settled.

- Dispatch `assumptions-expert` (proportionality / is the sibling-command scope right / is the firing-gate correctly deferred), `type-expert` (the registry + adapter + output types), `architecture-expert-*` (vendor-adapter boundary; reuse vs duplication against context-cost).
- Ratify or revise D1–D7 and answer Q1–Q4.
- Re-run the discoverable-unknown check at execution time (a third context-measurement surface may have landed since).

### ws0 input — quota-vs-occupancy scope finding (Perseus wakes Oblivion, 2026-07-02)

Live use this session exposed a second consumer and a scope gap, both
input-to-verify at ws0:

- **The drafted sensor answers "how full is my context?" (latest-turn
  occupancy); the question that actually recurred was "how much 5h QUOTA has
  this session consumed?"** — which needs usage SUMMED over a time window
  across the session's transcript AND all its subagent/workflow transcripts
  (`<session>/subagents/**/agent-*.jsonl`), not the latest turn of one file.
  The ad-hoc harvest ran twice this session (voter forensics + quota
  verification); the method and calibration (~1M raw tokens/meter point;
  which counters exclude cache reads) are recorded in
  `reports/agentic-engineering/large-corpus-analysis-tooling/burn-analysis-2026-07-02.md`,
  and the redesign plan's ws3 wants the same summing as a permanent
  accounting command — ws0 should decide whether occupancy and window-summed
  quota are one command with two modes or siblings.
- **The account-level meter is unreachable from records**: the harness
  delivers `rate_limits.five_hour/seven_day` only to the statusline stdin,
  per-render, unpersisted — so no agent can self-serve the authoritative
  percentage and the owner hand-relays it. A small statusline tee of the
  last `rate_limits` frame to a per-session state file would close this;
  candidate scope for this plan or a sibling.

### ws0 input — superseding findings (Sirius ws0 recon, 2026-06-29)

These findings are **input-to-verify** that materially supersede the PROPOSED
decisions; ws0 must reconcile them first-hand (re-confirm against a real
transcript and the live statusline stdin) before ratifying D1 or the non-goals:

- **The harness already delivers `context_window.used_percentage` on the
  statusline stdin.** The "if the harness exposes context% directly… that
  supersedes this" line under §Non-goals is therefore not hypothetical — that
  surface exists now. ws0 must decide whether the sensor reads the statusline
  stdin rather than (or before) parsing the transcript.
- **The genuinely-missing primitive is session-keyed PERSISTENCE of that
  percentage** (the statusline value is transient per-render). The build's centre
  of gravity may be persistence, not the transcript read.
- **`message.model` never records the `[1m]` variant marker.** D1's variant
  resolution keys off the transcript's `message.model`; if that field cannot
  carry `[1m]`, D1's primary source is broken and the `session-env` fallback
  becomes the *only* variant source — which changes the D1/Q1 design, not just a
  fallback note.

## PROPOSED decisions (ratify at ws0 — NOT yet settled)

- **D1 — model→window registry + variant resolution (THE critical correctness case).** `claude-opus-4-8` runs at **200k or 1M** by variant; the wrong denominator makes every percentage meaningless (the exact 200k-vs-1M error this tool exists to prevent). The registry keys on the **full** model id incl. variant marker (`[1m]`). The adapter must source the variant robustly: the transcript's recorded `message.model`, falling back to the per-user `session-env` surface under the platform config home (carries the env model id incl. `[1m]`). If neither disambiguates → return `window_source: "ambiguous"` with both candidates and **refuse to emit a single percentage**. A confident wrong denominator is worse than an honest refusal.
- **D2 — vendor adapter interface.** `interface SessionUsageAdapter { locate(sessionId): path|absent; readLatestUsage(path): {model, used_tokens, measured_at} }`. Claude adapter: transcript under the per-user platform projects home at `<project-slug>/<session-id>.jsonl` (tilde/`$HOME`-relative, never a machine-local absolute path); `used_tokens` = latest assistant turn's `input_tokens + cache_creation_input_tokens + cache_read_input_tokens` (current occupancy, NOT cumulative). Skip malformed lines (no-throw, ADR-088). Injectable fs seam mirrors context-cost's `ContextCostFileSystem` — unit-testable with fixtures, real IO only in the production adapter.
- **D3 — pure compute core.** `computeUsage({used, window})` → `{used_tokens, remaining_tokens: max(0, window-used), pct_used, pct_remaining}` (one-decimal percentages). Pure; no IO.
- **D4 — output schema (structured for the calling agent).** `{vendor, model, session_id, window_tokens, used_tokens, remaining_tokens, pct_used, pct_remaining, measured_at, freshness, window_source}`. `freshness` names the one-turn lag (the current turn is not yet on disk; the reading is the last *completed* turn). Two modes: text + `--json` (match the workspace `--json` convention).
- **D5 — CLI parser.** `--vendor <id>` (required), `--session-id <id>` (required), `--json`, `--help`. Pure discriminated-union return (mirror context-cost D5). Note: vendor + session_id is sufficient because the transcript self-reports the model — no model arg needed.
- **D6 — vendor routing.** `--vendor` selects the adapter (Claude first). Unknown vendor → typed error. Non-Claude adapters (Codex/Cursor) are future scope (their JSONL/usage shapes differ).
- **D7 — denominator honesty.** `window_tokens` is the model's raw window. If the harness later exposes a usable/compaction ceiling, add an `effective_ceiling` field; until then, document that "remaining" is to the hard wall, and that the **effectiveness** curve (not raw capacity) is what gates handover.

## Open questions for ws0

- **Q1**: variant resolution when the transcript records only `claude-opus-4-8` without `[1m]` — is the `session-env` surface reliable on every host? If not, what is the refusal/heuristic? (Blocks D1.)
- **Q2**: sibling `context-usage` command vs a `--session` mode on the existing `context-cost` topic. Sibling is cleaner (different input/mechanism); fold reduces surface. Architecture-reviewer call.
- **Q3**: should the output carry an `effectiveness_zone` verdict (peak / handover-start / rising-risk / degraded) mapping % onto the owner curve? Powerful, but couples the tool to an approximate, evolving curve — keep the curve in a separate owner-tunable registry the tool *references*, not hard-codes.
- **Q4**: the **firing gate** (a session-open/periodic hook that calls this and interrupts at ~50/65%) is what actually changes behaviour — the CLI is only the sensor. In-scope as WS6 future-note, or its own plan? (Recommend: own plan; this plan ships the sensor.)

## Workstreams (TDD cycles — one commit each, tree green)

Each cycle: failing test first, then product code, then refactor — landing together. Reuse context-cost's per-cycle gate shape (`pnpm --dir agent-tools exec vitest run <file>`, then workspace `test`/`type-check`/`lint`). Mid-cycle reviewers per cycle (type-expert for the typed boundaries; test-expert for TDD shape; architecture-expert at WS5 for the adapter boundary).

- **WS1 — window registry** (`agent-tools/src/<topic>/window-registry.ts` + unit test). Tests: known variant → window; `[1m]` vs base → 1M vs 200k; unknown model → `unknown`; ambiguous (base id, no variant signal) → `ambiguous` with candidates.
- **WS2 — vendor adapter + Claude adapter** (`session-usage-adapter.ts` interface, `claude-adapter.ts`, injectable fs, unit tests against a fixture JSONL string). Tests: latest-turn occupancy = input+cc+cr; cumulative is NOT used; malformed line skipped; absent transcript → `absent`; model read from latest turn.
- **WS3 — compute core** (`compute-usage.ts` + unit test). Tests: used/remaining/pct arithmetic; remaining floored at 0; one-decimal percentages.
- **WS4 — CLI parser** (`cli-options.ts` + unit test). Tests: required `--vendor`/`--session-id`; `--json`; `--help`; missing/unknown → typed error.
- **WS5 — CLI integration** (`cli.ts`, production fs adapter, topic registration, `cli.integration.test.ts`). Tests: text + JSON output against a fixture transcript; ambiguous-window refusal; unknown-vendor + missing-session errors; topic-registration smoke. Byte-exact output assertion (no silent format drift).
- **WS6 — docs + future notes**. README entry; crosswalk back-link in `context-cost-cli.plan.md`; record the firing-gate (Q4) and non-Claude adapters as named future scope.

## Non-goals (YAGNI)

- **Tokenization / estimation** — this tool READS recorded usage; it never estimates (that is context-cost's job). No `Tokenizer`.
- **Non-Claude adapters** beyond the interface seam — Codex/Cursor are future scope (different transcript + usage shapes).
- **The firing-gate hook** (the active interrupt at ~50/65%) — the behaviour-changing layer, but a separate concern (Q4); this plan ships the sensor only.
- **Real-time harness integration** — reading the on-disk transcript is the portable mechanism; if the harness exposes context% directly to the agent, that supersedes this and is the architectural ideal (note, don't build).
- **Telemetry** — local read-only command; no Sentry/OTel.
- **Mutating anything** — strictly read-only.

## Risks

| Risk | Mitigation |
|---|---|
| **Wrong window denominator (200k vs 1M)** — the headline risk; makes every % meaningless. | D1: key registry on full variant id; source variant from transcript + the per-user `session-env`; **refuse with `ambiguous`** rather than guess. ws0 must stress this. |
| Transcript doesn't record the variant marker. | Q1 / `session-env` fallback; explicit `ambiguous` result. |
| One-turn lag misread as exact. | `freshness` field names it explicitly. |
| Raw window read as usable runway. | D7 denominator honesty; document handover rides the effectiveness curve, not raw capacity. |
| Duplication with context-cost. | Crosswalk + ws0 architecture review (Q2 sibling-vs-fold). |
| Vendor transcript path/format drift. | Adapter isolates it; fixture-JSONL tests pin the shape; plan-body first-principles vendor-literal check at execution. |

## Foundation alignment

- **principles.md** — pure core / IO at the edge (registry, compute, parser pure; only the production adapter touches fs); First Question applied (sensor only, firing-gate deferred).
- **testing-strategy.md** — every cycle a test+product pair, tree green per commit; unit + integration levels distinct; TDD test-first.
- **schema-first-execution.md** — the output object is a typed/validated boundary; the adapter's parse of `message.usage` is validated, not `unknown`-cast.

## Lifecycle triggers · Consolidation

- Start-right, active-claim on the new topic's file scope, decision-thread only on deviation from ratified decisions, session-handoff per landed cycle, `/oak-consolidate-docs` after WS6. Reference [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).
- On completion, evaluate whether the pure-core/IO-edge + vendor-adapter shape has crossed the consolidate-at-second-consumer threshold against context-cost and the spawn-flow runner-seam (pattern candidate).

## Plan-body first-principles check

Evaluate at execution time per [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md): (1) **Shape** — tests assert Oak-authored behaviour (window resolution, occupancy read, percentage compute, refusal), never "JSONL parsing works". (2) **Landing-path** — new tests under the topic dir, auto-included by the vitest base config; topic registration follows the existing dispatch shape (verify at edit time). (3) **Vendor-literal** — the Claude transcript location (per-user platform projects home, `<project-slug>/<session-id>.jsonl`, tilde/`$HOME`-relative — never a machine-local absolute path) and the `message.usage` field shape are the vendor literals; verify against a real transcript at execution time (this plan was authored against one), and re-confirm before authoring the adapter.
