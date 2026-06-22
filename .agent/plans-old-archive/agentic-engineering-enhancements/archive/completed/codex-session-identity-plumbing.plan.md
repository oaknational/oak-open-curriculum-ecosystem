---
name: "Codex Session Identity Plumbing"
overview: "Promote Codex identity parity from strategic follow-up to executable hook, audit, and documentation work."
todos:
  - id: phase-0-grounding
    content: "Re-check Codex docs, active claims, dirty work, and identity preflight before mutation."
    status: completed
  - id: phase-1-red
    content: "Add RED coverage for Codex SessionStart identity context and report-only anonymous identity audit."
    status: completed
  - id: phase-2-green
    content: "Implement pure hook planner, bin/shim/config wiring, and identity audit CLI."
    status: completed
  - id: phase-3-docs
    content: "Update start-right, identity rule, agent-tools docs, plan indexes, and roadmap."
    status: completed
  - id: phase-4-validation
    content: "Run targeted tests, agent-tools gates, identity preflight, audit smoke, portability, markdown, and diff checks."
    status: completed
  - id: phase-5-doctrine-continuity
    content: "Propagate the completed slice into continuation surfaces and ADR/PDR doctrine around agent coordination and platform-agnostic tooling."
    status: completed
isProject: false
---

# Codex Session Identity Plumbing

**Last Updated**: 2026-04-28  
**Status**: 🟢 IMPLEMENTED / VALIDATED  
**Scope**: First high-impact slice for Codex-wide deterministic Practice
identity.

---

## Source Strategy

Promoted from
[`../../future/codex-session-identity-plumbing.plan.md`](../../future/codex-session-identity-plumbing.plan.md)
after the owner asked to implement the high-impact slice and official Codex
documentation confirmed project-local `SessionStart` hooks, common
`session_id` input, and `hookSpecificOutput.additionalContext` output in
[Codex Hooks](https://developers.openai.com/codex/hooks).

The preceding write-safety slice already made this command the canonical full
PDR-027 identity interface for Codex shared-state writes:

```bash
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
```

This plan makes the same identity block visible at Codex session start and
uses it for thread registration guidance too.

## Domain Boundaries

In scope:

- Codex `SessionStart` context derived from Codex stdin `session_id`.
- Full PDR-027 identity block: `agent_name`, `platform`, `model`,
  `session_id_prefix`, and `seed_source`.
- Report-only audit for existing `Codex` / `unknown` records across active
  claims, closed claims, the touched thread record, and rendered shared log.
- Start-right and identity docs that make thread registration and shared-state
  writes use the same preflight path.

Out of scope:

- Blindly rewriting historical anonymous rows.
- Treating title/statusline text as correctness. Display surfaces are optional
  conveniences; the PDR-027 block is authoritative.
- Reopening the broader collaboration-state domain model or comms reliability
  design.

## Public Interfaces

Preserve:

```bash
pnpm agent-tools:agent-identity --format display
pnpm agent-tools:agent-identity --format json
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
```

Add:

```bash
pnpm agent-tools:collaboration-state -- identity audit --active .agent/state/collaboration/active-claims.json --closed .agent/state/collaboration/closed-claims.archive.json --thread-record .agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md --shared-log .agent/state/collaboration/shared-comms-log.md --now <UTC>
pnpm --filter @oaknational/agent-tools exec vitest run tests/codex/session-identity-hook.unit.test.ts
```

## TDD Plan

### RED

1. Codex `SessionStart` hook emits identity context from `session_id`.
2. Missing or malformed hook input exits soft-success with empty output.
3. Audit reports `Codex` / `unknown` records without mutating files.
4. Audit classifies fresh active entries differently from closed or historical
   entries.

### GREEN

1. Add `agent-tools/src/codex/session-identity-hook.ts` as a pure planner.
2. Add `agent-tools/src/bin/codex-session-identity-hook.ts` as the IO adapter.
3. Add `.codex/hooks/practice-session-identity.mjs` as the soft project shim.
4. Enable `features.codex_hooks` and a `startup|resume` `SessionStart`
   matcher in `.codex/config.toml`.
5. Add `collaboration-state identity audit` over explicit source files.

### REFACTOR

1. Keep JSON parsing at the boundary strict and local.
2. Keep markdown parsing report-only and evidence-preserving.
3. Keep Codex display/title/statusline guidance non-authoritative.

## Validation Gates

Run after implementation:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run tests/codex/session-identity-hook.unit.test.ts
pnpm --filter @oaknational/agent-tools exec vitest run tests/collaboration-state/identity-audit.unit.test.ts
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools test
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
pnpm agent-tools:collaboration-state -- identity audit --active .agent/state/collaboration/active-claims.json --closed .agent/state/collaboration/closed-claims.archive.json --thread-record .agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md --shared-log .agent/state/collaboration/shared-comms-log.md --now <UTC>
pnpm portability:check
pnpm markdownlint-check:root
git diff --check
```

If root-level gates fail in unrelated dirty planning or shared-state residue,
record the exact command and owning surface rather than widening this slice.

## Acceptance Criteria

1. Fresh Codex sessions receive deterministic Practice identity context at
   `SessionStart` when a `session_id` is provided.
2. Missing build artefacts or malformed hook input exit successfully with no
   additional context.
3. Codex thread registration docs and shared-state docs point to the same
   identity-preflight command.
4. Existing anonymous Codex rows are reported and classified, not silently
   rewritten.
5. Targeted hook and audit tests pass, and agent-tools type/lint/test gates are
   clean.

## Doctrine And Continuity Propagation

Completed after implementation so the slice is not stranded as plan-only
knowledge:

1. PDR-027 now names the full PDR-027 identity block as the shared contract for
   thread registration and shared-state writes. Codex `SessionStart` context is
   a convenience delivery path, not the authority.
2. PDR-029 now treats the report-only identity audit as valid Layer 3
   coverage for Class A.2 identity discipline and keeps platform hooks
   supplemental to the canonical rule and handoff gate.
3. PDR-035 and ADR-165 now classify session identity, claims, audits, hooks,
   and shared-state tooling as Practice-owned agent-work capabilities with
   host-local implementations.
4. ADR-125 now records Codex hook adapters as thin Layer 2 project adapters
   over canonical `.agent/` doctrine and `agent-tools` implementation.
5. PDR-024 and repo continuation surfaces now point at the implemented
   current plan and the canonical preflight/audit interfaces rather than a
   future-only follow-up.

## Closeout Evidence — 2026-04-28

Implementation completed in the working tree without staging because another
fresh `git:index/head` claim was active. Evidence:

- `pnpm --filter @oaknational/agent-tools exec vitest run tests/codex/session-identity-hook.unit.test.ts tests/collaboration-state/identity-audit.unit.test.ts`
  passed: 2 files, 5 tests.
- `pnpm --filter @oaknational/agent-tools type-check` passed.
- `pnpm --filter @oaknational/agent-tools lint` passed.
- `pnpm --filter @oaknational/agent-tools test` passed: 19 files, 109 tests.
- `pnpm agent-tools:build` passed.
- Direct Codex hook shim smoke passed with `hookSpecificOutput.additionalContext`.
- `pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5`
  passed and returned `Mossy Creeping Branch` / `019dd3`.
- `pnpm agent-tools:collaboration-state -- identity audit ...` passed and
  reported 49 historical-no-repair anonymous Codex records, with no live-risk
  or needs-evidence records in the checked surfaces.
- `pnpm portability:check` passed.
- `git diff --check` passed.
- Root `pnpm markdownlint-check:root` is blocked by an unrelated MD012 finding
  in `.agent/memory/operational/repo-continuity.md`, which belongs to the
  concurrent `.agent` sweep. Scoped markdownlint over this slice's edited docs
  passed.

## Consolidation Pass — 2026-04-28

Owner-requested `jc-consolidate-docs` plus a light docs-only sweep ran after
the ADR/PDR propagation.

- No new ADR or PDR candidate remained unhomed; the settled substance is now in
  ADR-125, ADR-165, PDR-024, PDR-027, PDR-029, and PDR-035.
- Thread-register and identity-audit checks found no live anonymous Codex risk;
  historical `Codex` / `unknown` rows remain evidence-preserving audit
  findings.
- Fitness is soft-only under `pnpm practice:fitness --strict-hard`; no hard or
  critical remediation is required for this slice.
- Archived to `archive/completed/` after the fresh peer `git:index/head` claim
  and queued commit that staged the current path cleared. Evidence: Glassy's
  commit landed as `7c589a0a`, and `active-claims.json` had no fresh
  `git:index/head` claim or queued intent naming this file.
