---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and the most recent session summary"
---

# Repo Continuity

**Last refreshed**: 2026-04-24 (Codex / codex / GPT-5 — session
handoff after AGENT entrypoint homing, hard-fitness clearance, and
focused MCP local startup/release-boundary planning.)

This file carries the repo-level active state needed to resume work.
It is not a doctrine store, historical log, or plan substitute.

## Current State

- Branch: `feat/otel_sentry_enhancements`.
- Branch-level success criterion: the full repo-root gate sequence in
  [`.agent/commands/gates.md`](../../commands/gates.md).
- Branch-primary product thread:
  `observability-sentry-otel`.
- Completed repo-owned observability repair lane:
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).
- Owner-handled validation stages remain external to repo-plan work:
  manual preview `/healthz`, preview-release, preview-traffic,
  Sentry evidence collection, monitor creation, and uptime validation.
- Broader runtime simplification remains separate future work:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md).

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane
state live in each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | `claude-code` / `claude-opus-4-7-1m` / Frodo / release-identifier-implementation / 2026-04-24; `cursor` / `claude-opus-4-7` / Pippin / release-identifier-plan-review / 2026-04-24; `codex` / `GPT-5` / Codex / startup-boundary-plan-author / 2026-04-24 |
| `agentic-engineering-enhancements` | Practice — documentation roles, continuity surfaces, and fitness-pressure remediation | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | `codex` / `GPT-5` / Codex / practice-docs-consolidation / 2026-04-24; latest touch cleared AGENT/principles/testing hard fitness |

The `memory-feedback` thread is archived as of 2026-04-22 Session 8.
If doctrine-consolidation work resumes, start a new thread or revive
that one with a fresh next-session record.

## Branch-Primary Lane State

The branch-primary lane state lives in
[`threads/observability-sentry-otel.next-session.md § Lane state`](threads/observability-sentry-otel.next-session.md).

Current branch-primary objective:

- WS2 §2.1-§2.7 **landed** as `f5a009ab` (unified `resolveRelease`,
  sentry-node thin adapter, atomic old-shape replacement, validator
  alignment, composition-root snapshot-env);
- next observability work is **WS3** of
  [`sentry-release-identifier-single-source-of-truth.plan.md`](../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md):
  cancellation-script rewrite + relocation into the consuming app
  workspace + ADR-163 §10 second amendment, as a separate commit
  boundary;
- read the plan's WS3.0 pre-landing reviewer dispatch step before
  drafting the WS3 commit.

## Current Session Focus

The latest Codex practice pass is distinct from the branch-primary
observability lane. Current outcome:

- [`agent-entrypoint-content-homing.plan.md`](../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md)
  is implemented in the worktree;
- AGENT is now an entrypoint/index and points to durable homes for reviewer,
  agent-tool, artefact, command, commit, and topology detail;
- `principles.md` and `testing-strategy.md` are no longer hard;
- [`testing-tdd-recipes.md`](../../../docs/engineering/testing-tdd-recipes.md)
  is the new recipe home for worked Red/Green/Refactor examples;
- sub-agent review follow-through restored valid lost information and corrected
  broken links, stale anchors, command drift, platform-entrypoint layering, and
  process-env doctrine;
- `pnpm check` was attempted and failed only in streamable-http
  `smoke:dev:stub`, `test:a11y`, and `test:ui` because
  `VERCEL_GIT_COMMIT_SHA` is missing for Sentry release resolution;
- [`mcp-local-startup-release-boundary.plan.md`](../../plans/observability/current/mcp-local-startup-release-boundary.plan.md)
  now captures the focused follow-up for that failure;
- the arbitrary observability plan-density limit was removed from
  [`observability/README.md`](../../plans/observability/README.md);
- the pending-graduations register schema required by `jc-consolidate-docs`
  remains below.

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs.
This operational file repeats only the constraints needed to resume
the current branch safely:

- no compatibility layers; replace, don't bridge;
- TDD at all levels;
- tests prove product behaviour, not configuration or file presence;
- strict boundary validation only;
- no `process.env` read/write in tests;
- `--no-verify` requires fresh per-invocation owner authorisation;
- no warning toleration;
- owner direction beats plan.

Current branch non-goals:

- do not start a new repo-owned workstream unless owner-run
  validation surfaces a fresh defect;
- do not reopen broader canonicalisation work opportunistically;
- do not recreate a repo monitoring lane or treat monitor setup as
  in-repo acceptance work;
- do not invent a replacement follow-through cycle now that the
  bounded corrective lane is archived complete;
- do not guess the Vercel import contract before checking primary
  evidence.

## Next Safe Step

Expected next session, per owner direction:

1. Read both touched thread records:
   [`agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md)
   and
   [`observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md).
2. Inspect and preserve the current working-tree diff. The AGENT
   hard-fitness work and the new observability boundary plan are
   uncommitted working-tree artefacts.
3. If continuing the latest owner focus, implement
   [`mcp-local-startup-release-boundary.plan.md`](../../plans/observability/current/mcp-local-startup-release-boundary.plan.md)
   from Phase 0. This is the focused route to clearing the
   `pnpm check` blocker in streamable-http `smoke:dev:stub`,
   `test:a11y`, and `test:ui`.
4. If explicitly returning to the branch-primary release-identifier
   lane instead, resume WS3 from
   [`sentry-release-identifier-single-source-of-truth.plan.md`](../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
   and run its WS3.0 pre-landing reviewer dispatch first.
5. Do not continue into soft-fitness work by default. Soft pressure is a
   signal for deliberate role routing, not opportunistic trimming.

## Open Owner-Decision Items

These are visible owner-appetite items, not blockers for
`observability-sentry-otel`:

1. `prog-frame/agentic-engineering-practice.md` disposition —
   recorded in [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` promotion proposal under PDR-032 —
   recorded in `.agent/reference/README.md` and the archived
   reference/notes rehoming plan.
3. `boundary-enforcement-with-eslint.md` promotion proposal under
   PDR-032 — same destination set as above.

## Deep Consolidation Status

**Status (2026-04-24 Codex handoff)**: due — `napkin.md` is above the
rotation threshold (`wc -l` reports 796 lines), the AGENT homing plan has
closed as working-tree artefacts, and this session added a governance
candidate about arbitrary plan-count limits. Not run in this handoff because
the owner explicitly closed the session and requested the lightweight
handoff workflow; falsifiability: the next agent can re-run `wc -l
.agent/memory/active/napkin.md`, inspect the uncommitted diff, and decide
whether to run `jc-consolidate-docs` before further documentation churn.

Live classification decisions from this session:

- `continuity-practice.md` carries stable strategy, rules, and
  process;
- `repo-continuity.md` carries active operational state and the
  pending-graduations register;
- historical closeout prose is not active state and should remain in
  archives or git history unless it still drives a current decision.

### Pending-Graduations Register

The register schema is: `captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, `status`. `consolidate-docs`
step 7 uses this section as its primary queue.

| captured-date | source-surface | graduation-target | trigger-condition | status |
| --- | --- | --- | --- | --- |
| 2026-04-24 | Napkin + owner correction during Practice closeout | Fitness-compression discipline: fitness warnings must be analysed and routed, not answered by opportunistic trimming. Candidate home: ADR-144 amendment, `consolidate-docs` step 9 clarification, or Practice-verification note. | Explicit owner direction, or a second instance of opportunistic trimming after a fitness warning. | pending |
| 2026-04-24 | Napkin + owner direct-answer feedback memory | Practice-governance rule or PDR amendment for direct-answer discipline on verification questions. | Second cross-session observation of the same evasion shape, or explicit owner direction; enforcement cost must be proportionate. | pending |
| 2026-04-24 | Napkin + `.remember/` wiring commits | PDR-011 amendment naming plugin-managed ephemeral capture surfaces as a first-class category distinct from napkin and platform memory. | Second plugin-managed in-repo capture surface, or explicit owner direction. | pending |
| 2026-04-24 | Napkin + `sonarjs-activation-and-sonarcloud-backlog.plan.md` | Pattern candidate: gate-off, fix, gate-on for quality-tool activation with an existing backlog. | Second ecosystem instance, or explicit owner direction to promote first instance. | pending |
| 2026-04-24 | Owner correction during observability plan placement | Practice-planning governance: plan placement should follow ownership and actionability, not arbitrary plan-count/density limits. Candidate home: `plan.md`, plan templates, or a PDR amendment if the rule generalises. | Second instance of a numeric plan cap steering work away from its owner, or explicit owner direction to generalise beyond observability. | pending |
| 2026-04-23 | Thread record + napkin pattern instance for review-cascade spiral | PDR-015 amendment: assumption-challenge gate before absorbing architectural-review output into a plan body. | Trigger (i) met 2026-04-24; still needs gate-cost design or explicit owner direction. | pending |
| 2026-04-23 | Warning-toleration rule + archived observability repair plan | ADR-163 amendment covering release/version boundary, vendor-config passthrough, deploy-entry contract, and realistic production-build gate. | Owner wants the doctrine promoted into ADR-163. | pending |
| 2026-04-23 | `session-handoff` entry-point sweep + homing partial | PDR-014 amendment naming platform-specific entry points as a first-class homing substance class. | Second entry-point drift/homing instance, second platform-specific entry point, and explicit owner request. | pending |

Historical deep-consolidation findings and session-close summaries are
preserved in git history and
[`archive/repo-continuity-session-history-2026-04-22.md`](archive/repo-continuity-session-history-2026-04-22.md).
