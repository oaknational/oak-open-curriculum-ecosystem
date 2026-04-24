---
fitness_line_target: 400
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and the most recent session summary"
---

# Repo Continuity

**Last refreshed**: 2026-04-24 (Codex / codex / GPT-5 — handoff for
the directive and fitness-pressure discussion. Next session resumes
the `agentic-engineering-enhancements` thread to implement AGENT
entrypoint content homing, then continues remaining hard-limit work.)

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
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Latest 2026-04-24 touches: Frodo (`claude-code`) landed `9a0f9ebc` + `a4e8facb` + `f5a009ab` (WS2 §2.1-§2.7 atomic collapse); Pippin (`cursor`) revised/audited the release-identifier plan with no code landed. Earlier identities remain in the thread record. |
| `agentic-engineering-enhancements` | Practice — documentation roles, continuity surfaces, and fitness-pressure remediation | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | `codex` / `GPT-5` / Codex / practice-docs-consolidation / 2026-04-24 |

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

This Codex session is a cross-cutting Practice consolidation pass,
distinct from the branch-primary observability lane. Outcome:

- make [`continuity-practice.md`](../../directives/continuity-practice.md)
  the stable strategy/rules/process surface;
- make this file the compact operational state register;
- clarify the knowledge-flow role model in PDR-014 and the patterns
  README;
- create
  [`agent-entrypoint-content-homing.plan.md`](../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md)
  and
  [`knowledge-role-documentation-restructure.plan.md`](../../plans/agentic-engineering-enhancements/current/knowledge-role-documentation-restructure.plan.md);
- preserve the pending-graduations register schema required by
  `jc-consolidate-docs`.

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

1. Read
   [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md)
   and
   [`agent-entrypoint-content-homing.plan.md`](../../plans/agentic-engineering-enhancements/current/agent-entrypoint-content-homing.plan.md).
2. Run Phase 0: build the source-to-target ledger for
   [`.agent/directives/AGENT.md`](../../directives/AGENT.md).
3. Home AGENT content into durable role surfaces, slim AGENT only after
   each concept has a target and discovery path, then validate fitness
   and links.
4. Move on to the remaining hard fitness excessions reported by
   `pnpm practice:fitness:informational`; known hard files at this
   handoff are `principles.md` and `testing-strategy.md` after AGENT is
   handled, plus any AGENT residue if the plan does not clear it.

If resuming the branch-primary observability lane:

1. Read
   [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md)
   and the release-identifier plan (WS3 sections).
2. Read
   [`napkin.md`](../active/napkin.md) §2026-04-24 entries and
   [`experience/2026-04-24-pippin-the-spiral-i-could-not-see.md`](../../experience/2026-04-24-pippin-the-spiral-i-could-not-see.md).
3. Run the WS3.0 pre-landing reviewer dispatch (docs-adr-reviewer
   on the draft §3.4 amendment text; assumptions-reviewer if scope
   warrants) before drafting the WS3 commit.
4. Land WS3 as the plan's next commit (relocation + rewrite +
   ADR-163 §10 second amendment).
5. Validate deterministically:

   ```bash
   pnpm --filter oak-curriculum-mcp-streamable-http test
   pnpm --filter @oaknational/build-metadata test
   pnpm depcruise
   ```

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

**Status (2026-04-24 Codex handoff)**: due but deliberately queued —
fitness pressure remains after this session, and the owner has set the
order: implement AGENT content homing first, then handle the remaining
hard limits. This closeout stops at capture because the next action is
already captured in the thread record and plan. Falsifiability: a fresh
`pnpm practice:fitness:informational` run next session should still show
the hard files until those plans are executed.

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
| 2026-04-23 | Thread record + napkin pattern instance for review-cascade spiral | PDR-015 amendment: assumption-challenge gate before absorbing architectural-review output into a plan body. | Trigger (i) met 2026-04-24; still needs gate-cost design or explicit owner direction. | pending |
| 2026-04-23 | Warning-toleration rule + archived observability repair plan | ADR-163 amendment covering release/version boundary, vendor-config passthrough, deploy-entry contract, and realistic production-build gate. | Owner wants the doctrine promoted into ADR-163. | pending |
| 2026-04-23 | `session-handoff` entry-point sweep + homing partial | PDR-014 amendment naming platform-specific entry points as a first-class homing substance class. | Second entry-point drift/homing instance, second platform-specific entry point, and explicit owner request. | pending |

Historical deep-consolidation findings and session-close summaries are
preserved in git history and
[`archive/repo-continuity-session-history-2026-04-22.md`](archive/repo-continuity-session-history-2026-04-22.md).
