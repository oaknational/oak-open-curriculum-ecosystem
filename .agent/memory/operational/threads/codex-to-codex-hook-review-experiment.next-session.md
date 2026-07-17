---
fitness_line_target: 180
fitness_line_limit: 300
fitness_char_limit: 24000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete'
merge_class: index-narrative-tables
---

# Next-Session Record — `codex-to-codex-hook-review-experiment`

## Current State

- The bounded Codex hook prototype is preserved on branch `fix/claude-hook-hardening` at
  `SHA:c4fae0b83d7450772c0be0fec13cad980a54cccd` in draft PR #403.
- The feature worktree was clean and equal to its upstream when this record was written.
- The prototype is **not active and has not been discovered by Codex**. In a fresh Codex session
  opened in the feature worktree, `/hooks` reported `PreToolUse` installed `0` and active `0`.
- Project-local config parsing, handler unit behaviour, and a valid fail-open response do not prove
  hook discovery. The runtime observation above is the governing result.
- PR #403 remains a preservation PR. It must not be represented as a working hook integration.

## Goal and Boundary

The goal is a rapid, automatic review of an agent's intent or tool-call result while controlling
the mechanisms that consume context so review latency stays low. “No tools, no rules, one skill”
was an exploratory mechanism, not the goal.

The next implementation step is deliberately smaller than the preserved prototype:

1. Merge or otherwise disposition PR #403 without claiming activation.
2. Start a normal fresh branch from current `main`.
3. Follow the official Codex hook configuration shape exactly and prove one deterministic
   `PreToolUse` command is listed by `/hooks` in a fresh trusted session.
4. Prove one controlled `apply_patch` invocation reaches that command.
5. Only after discovery and invocation work, add semantic review, Gitleaks, latency measurement,
   or a vendor-neutral adapter layer one increment at a time.

The proof order is discovery → invocation → deterministic behaviour → model review → latency.
Passing setup tests or parsing configuration is not a substitute for observing the hook in the
running client.

## Evidence and Negative Knowledge

- The fresh `/hooks` output is direct runtime evidence that the tracked project definition was not
  installed by Codex 0.144.5.
- The earlier disposable two-case trial proved that a manually-invoked review pairing could allow
  a clean case and deny a concern case. It did not prove Codex hook discovery, production policy,
  reliability, or acceptable latency.
- The fresh-process synchronous reviewer exceeded the run-configured experience thresholds. Those
  thresholds are configuration and may change for later labelled runs; they are not invariants.
- Do not infer that a vendor-agnostic framework is ready to extract. A general payload schema,
  vendor adapters, reciprocal Claude/Codex pairings, and official-source schema-drift detection
  remain future intent until at least two real adapters expose stable seams.
- PR #404 was closed unmerged after the recovered JSON files were identified as unsealed audit
  canary keys. Its remote branch was deleted, and those versions are compromised for audit use.
  Fresh keys must be authored and sealed before any later canary run.

## Durable Sources

- Draft implementation and historical experiment material: PR #403.
- Observed feasibility evidence and scope limits:
  `.agent/research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md`.
- Historical plan:
  `.agent/plans-old-archive/agent-tooling/archive/completed/codex-to-codex-synchronous-hook-review-experiment.plan.md`.
- Official mechanics: <https://learn.chatgpt.com/docs/hooks>.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Lupin herds Bark | codex | GPT-5 | 019f67 | implementer and closeout owner | 2026-07-16 | 2026-07-17 |
| Zephyr turns Crosswind | codex | GPT-5 | 019f6a | compound peer and reviewer | 2026-07-16 | 2026-07-16 |

## Session Disposition

The preservation slice is committed and pushed in draft PR #403. Runtime attachment remains
unproven and the fresh discovery check is negative. The next session starts from the smallest
official configuration proof on a fresh branch; it does not resume the prototype by assumption.
