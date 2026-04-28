---
name: "Collaboration-State Write Safety"
overview: "First executable slice for safe shared inter-agent state writes, promoted from the collaboration-state domain-model strategic brief."
todos:
  - id: phase-0-grounding
    content: "Phase 0: Re-check identity, active claims, and overlapping state/document paths before mutation."
    status: completed
  - id: phase-1-red
    content: "Phase 1: Add RED coverage for identity preflight, timestamp validation, event ordering, duplicate event ids, TTL archival, and stale write races."
    status: completed
  - id: phase-2-green
    content: "Phase 2: Implement the collaboration-state transaction helper, CLI, comms events, and commit-queue reuse."
    status: completed
  - id: phase-3-docs
    content: "Phase 3: Update start-right, collaboration rules, state docs, channel register, indexes, roadmap, and thread continuity records."
    status: completed
  - id: phase-4-validation
    content: "Phase 4: Run targeted gates, record residual parallel-agent risks, and apply /jc-consolidate-docs before closure."
    status: completed
---

# Collaboration-State Write Safety

**Last Updated**: 2026-04-28
**Status**: 🟡 IMPLEMENTED / CLOSURE PENDING FINAL ARCHIVE PASS
**Scope**: Make the hot shared inter-agent state write paths safe without
waiting for hook polish.

---

## Context

This plan promotes the urgent slice from
[`../future/collaboration-state-domain-model-and-comms-reliability.plan.md`](../future/collaboration-state-domain-model-and-comms-reliability.plan.md).
The owner correction is binding: hooks are only a later refinement. The
pressing next move is eliminating clashing writes across shared collaboration
state while defining only the domain boundaries needed to choose the right
write mechanism.

Current implementation preflight:

- This Codex session derives as `Woodland Creeping Petal` with
  `session_id_prefix` `019dd3` from `CODEX_THREAD_ID`.
- A separate Codex/unknown claim owns hook-test and health-probe paths. This
  plan does not edit those paths.
- Existing dirty work belongs to other agents unless this plan explicitly names
  the touched surface.

## Domain Boundaries

Use these minimal state-family boundaries for the first slice:

| Domain | Source of Truth | Write Mechanism |
| --- | --- | --- |
| Discovery narrative | generated `shared-comms-log.md` | render from immutable comms events |
| Live ownership | `active-claims.json` | transaction helper |
| Commit intent | `active-claims.json#commit_queue` | transaction helper via commit-queue implementation |
| Structured coordination | `conversations/*.json` | transaction helper append |
| Owner escalation | `escalations/*.json` | transaction helper full-record write |
| Closure archive | `closed-claims.archive.json` | transaction helper with active claims |
| Generated read model | `shared-comms-log.md` | atomic render output |

Non-goals:

- No binary database as the tracked source of truth.
- No hard authorial refusals or permanent locks; write-integrity mechanisms
  protect files, while coordination remains advisory.
- No hook dependency for correctness. TTL cleanup is the portable baseline.
- No broad domain-model redesign beyond boundaries needed for write safety.

## Public Interfaces

Add or preserve these interfaces:

```bash
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
pnpm agent-tools:collaboration-state -- comms append --events-dir <dir> --now <UTC> --created-at <UTC> --title <title> --body <body> --platform <platform> --model <model>
pnpm agent-tools:collaboration-state -- comms render --events-dir <dir> --output .agent/state/collaboration/shared-comms-log.md
pnpm agent-tools:collaboration-state -- claims open|heartbeat|close|archive-stale ...
pnpm agent-tools:collaboration-state -- conversation append --file <conversation.json> --entry-json '<json>'
pnpm agent-tools:collaboration-state -- escalation open|close --file <escalation.json> --body-json '<json>'
pnpm agent-tools:collaboration-state -- check --active .agent/state/collaboration/active-claims.json --closed .agent/state/collaboration/closed-claims.archive.json --events-dir .agent/state/collaboration/comms/events
```

Identity preflight must reject anonymous Codex writes when `CODEX_THREAD_ID`
exists. New Codex shared-state writes must carry a deterministic
`agent_name`, `platform`, `model`, and `session_id_prefix`.

The high-impact Codex-wide identity parity slice is complete in
[`../archive/completed/codex-session-identity-plumbing.plan.md`](../archive/completed/codex-session-identity-plumbing.plan.md).
Residual broader collaboration-state domain modelling remains in
[`../future/collaboration-state-domain-model-and-comms-reliability.plan.md`](../future/collaboration-state-domain-model-and-comms-reliability.plan.md).
This write-safety plan fixes the safe shared-state write path; the follow-up
owns thread-row defaults, legacy `Codex` / `unknown` reporting, and any
verified Codex title/statusline or hook integration.

## TTL Baseline

Use TTL cleanup as the portable default:

| State Type | TTL |
| --- | --- |
| Normal active claims | `14400s` |
| Commit/index transaction claims | `900s` |
| Sidebars / attention windows | `1800s` |
| Missed session-close grace | `600s` |

Stale/orphan cleanup moves records to closure history and must not mark work
successful.

## TDD Plan

### RED

Add failing tests for:

1. unknown Codex identity when `CODEX_THREAD_ID` exists;
2. malformed, local-looking, or future UTC timestamps;
3. duplicate immutable comms event ids;
4. out-of-order event rendering;
5. stale claim archival that does not imply success;
6. stale read/write races and concurrent JSON file mutation.

### GREEN

Implement:

1. collaboration identity preflight;
2. immutable comms event append and generated log rendering;
3. one JSON transaction helper used by claims, commit queue, conversations,
   escalations, and closed-claim archival;
4. type-specific TTL archive command;
5. `pnpm agent-tools:collaboration-state -- ...` package scripts.

### REFACTOR

Keep implementation small and portable:

1. split CLI parsing, handlers, state IO, parsers, and transaction logic;
2. preserve schema-first JSON validation without type shortcuts;
3. document the portable Practice contract separately from this repo's
   TypeScript phenotype.

## Validation Gates

Targeted first, then broader as the work stabilises:

```bash
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --dir agent-tools exec vitest run tests/collaboration-state/collaboration-state.unit.test.ts
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
pnpm agent-tools:test
pnpm agent-tools:test:e2e
pnpm markdownlint:root
pnpm portability:check
```

If broader gates fail in paths owned by another active claim, record the
failure and owner/path rather than repairing outside this plan.

### Consolidation Finding — 2026-04-28 Closeout Retry

The hot `shared-comms-log.md` was regenerated from immutable events during the
first real use of `comms append` / `comms render`. The legacy rendered history
has been preserved at
`.agent/state/collaboration/comms/archive/shared-comms-log-pre-events-2026-04-28.md`,
satisfying the migration-preservation requirement in acceptance criterion 3.

The later owner-requested deep consolidation pass routed the named hard
pressure in `principles.md`, `collaboration-state-conventions.md`, and
`repo-continuity.md` to structural homes. A brief final-handoff hard spike in
the active napkin was then rotated into
`.agent/memory/active/archive/napkin-2026-04-28-current-overflow.md`.
Fresh strict-hard evidence is soft-only; do not mark this plan complete until
the archive pass records that current evidence.

### Closeout Evidence — 2026-04-28

Implementation landed as `11f0320f`. A generated collaboration-state sweep
landed as `da21284d`. The Codex-wide identity follow-up plan landed as
`ddcfa19e`.

Owner-requested handoff and consolidation ran after those commits. Evidence:

- entry points are pointer-only (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`);
- no tactical track cards are active;
- `.remember/` scan did not add a thread-changing action;
- `pnpm agent-tools:collaboration-state -- check` passes;
- `pnpm practice:vocabulary` passes;
- `git diff --check` passes;
- the real pre-commit hook passed for `ddcfa19e`;
- the named hard findings in `principles.md`,
  `collaboration-state-conventions.md`, and `repo-continuity.md` were later
  structurally routed by the deep consolidation pass;
- current `pnpm practice:fitness:strict-hard` is soft-only after the active
  napkin overflow rotation.

Consolidation did not surface a new ADR/PDR promotion candidate. The Practice
governance remains homed in PDR-029 / PDR-035, while this repo's phenotype
boundary remains homed in ADR-165.

## Reviewer Scheduling

- **Pre-execution**: assumptions review of proportionality and hook deferral.
- **During**: test/type review of transaction helper, timestamp handling, and
  JSON parsing.
- **Post**: docs/ADR review for Practice propagation, plus release-readiness
  review once collaboration docs and indexes are updated.

## Acceptance Criteria

1. `Codex` / `unknown` cannot write new Codex collaboration state when
   `CODEX_THREAD_ID` is available.
2. Immutable comms events can be appended concurrently without rewriting the
   hot markdown log.
3. `shared-comms-log.md` is treated as a generated read model, with prior
   rendered history archived or explicitly preserved during migration.
4. Claims, commit queue, closed-claim archive, conversations, and escalations
   use the shared transaction helper for mutations.
5. TTL archival supports normal claims, commit/index windows, sidebars, and
   missed close grace semantics.
6. Start-right, collaboration rules, channel register, lifecycle docs,
   indexes, roadmap, and thread record point to this current plan and CLI.
7. `/jc-consolidate-docs` runs before closure or leaves an explicit
   no-closure rationale.

## Documentation Propagation

Before closure, update or record no-change rationale for:

- `.agent/memory/executive/agent-collaboration-channels.md`
- `.agent/memory/operational/collaboration-state-conventions.md`
- `.agent/memory/operational/collaboration-state-lifecycle.md`
- `.agent/rules/register-active-areas-at-session-open.md`
- `.agent/rules/register-identity-on-thread-join.md`
- `.agent/rules/use-agent-comms-log.md`
- `.agent/skills/start-right-quick/shared/start-right.md`
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
- `.agent/state/README.md`
- `agent-tools/README.md`
- `.agent/memory/operational/repo-continuity.md`
- `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md`

Apply `/jc-consolidate-docs` before moving this plan out of `current/`.
