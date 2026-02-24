# Security and Privacy Roadmap

**Status**: 📋 Phase 0 ready to start
**Last Updated**: 2026-02-24
**Session Entry**: [start-right.prompt.md](../../prompts/start-right.prompt.md)

---

## Purpose

This roadmap is the strategic phase sequence for the
`security-and-privacy` collection.

Execution detail lives in `active/` plans with atomic tasks and deterministic
validation.

Authoritative active execution sources:

1. [phase-0-foundation-and-baseline.md](active/phase-0-foundation-and-baseline.md)
2. [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
3. [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
4. [phase-3-protocol-auth-and-tool-governance-baseline.md](active/phase-3-protocol-auth-and-tool-governance-baseline.md)

Authoritative phase artefacts:

1. [phase-0-control-mapping.md](phase-0-control-mapping.md)
2. [phase-1-security-claim-contract.md](phase-1-security-claim-contract.md)
3. [phase-2-evidence-merge-readiness-rules.md](phase-2-evidence-merge-readiness-rules.md)
4. [phase-3-baseline-control-cut-list.md](phase-3-baseline-control-cut-list.md)
5. [deferred-controls-register.md](deferred-controls-register.md)

---

## Documentation Synchronisation Requirement

No phase can be marked complete until documentation updates have been handled
for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/directives/practice.md`
3. `.agent/reference-docs/prog-frame/agentic-engineering-practice.md`
4. any additionally impacted ADRs, `/docs/` pages, or README files

Each phase must either:

- update impacted documents directly, or
- record an explicit no-change rationale in
  [documentation-sync-log.md](documentation-sync-log.md)

Before phase closure, apply the
[`jc-consolidate-docs` workflow](../../../.cursor/commands/jc-consolidate-docs.md).

---

## Milestone Context

This roadmap aligns to:

- **Milestone 1**: establish security confidence for public-alpha operations.
- **Milestone 2**: harden and extend controls based on observed risks.

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

---

## Cross-Collection Dependencies

This collection depends on global guardrail work in:

- [agentic-engineering-enhancements/roadmap.md](../agentic-engineering-enhancements/roadmap.md)
- [phase-1-hallucination-guarding-execution.md](../agentic-engineering-enhancements/active/phase-1-hallucination-guarding-execution.md)
- [phase-2-evidence-based-claims-execution.md](../agentic-engineering-enhancements/active/phase-2-evidence-based-claims-execution.md)

Security-and-privacy phases must align to those outputs rather than create a
competing global policy layer.

---

## Current State

- Security hardening research baseline complete:
  [developing-secure-mcp-servers.research.md](developing-secure-mcp-servers.research.md)
- Collection scaffolding now present (roadmap, active plans, evidence template,
  documentation sync log).
- No non-planning security hardening implementation has started yet.

---

## Execution Order

```text
Phase 0: Foundation and baseline alignment          📋 PLANNED
Phase 1: Hallucination guarding rollout             📋 PLANNED
Phase 2: Evidence-based claims rollout              📋 PLANNED
Phase 3: Protocol/auth/tool-governance baseline     📋 PLANNED
```

---

## Phase Details

### Phase 0 — Foundation and Baseline Alignment

- Active plan:
  [phase-0-foundation-and-baseline.md](active/phase-0-foundation-and-baseline.md)
- Done when:
  - baseline control inventory is mapped from research to executable tasks
  - [phase-0-control-mapping.md](phase-0-control-mapping.md) is complete
  - [deferred-controls-register.md](deferred-controls-register.md) is initialised
  - phase priority contract is explicit and agreed in the collection docs
  - documentation sync log records updates/no-change rationale for Phase 0
- Dependencies: none

### Phase 1 — Hallucination Guarding Rollout

- Active plan:
  [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
- Done when:
  - non-trivial security claim classes and verification states are explicit
  - [phase-1-security-claim-contract.md](phase-1-security-claim-contract.md)
    is complete and aligned with global guardrails
  - security-relevant prompts/reviewer surfaces require support for such claims
  - pilot baseline evidence exists and calibration is recorded
- Dependencies: Phase 0 complete

### Phase 2 — Evidence-Based Claims Rollout

- Active plan:
  [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
- Done when:
  - evidence bundle usage is standardised for security hardening claims
  - [phase-2-evidence-merge-readiness-rules.md](phase-2-evidence-merge-readiness-rules.md)
    is complete
  - merge-readiness checks reject unsupported non-trivial claims
  - documentation sync log records updates/no-change rationale for Phase 2
- Dependencies: Phase 1 complete

### Phase 3 — Protocol/Auth/Tool Governance Baseline

- Active plan:
  [phase-3-protocol-auth-and-tool-governance-baseline.md](active/phase-3-protocol-auth-and-tool-governance-baseline.md)
- Done when:
  - executable baseline for protocol/auth/tool-governance controls is defined
  - [phase-3-baseline-control-cut-list.md](phase-3-baseline-control-cut-list.md)
    is complete
  - deterministic validation commands are mapped per control class
  - implementation cut list is ready for non-planning execution work
- Dependencies: Phase 2 complete

---

## Deferred Safety Work (Not in current phase sequence)

- Expanded sandboxing rollout (beyond baseline notes)
- Prompt-injection red-team automation

These remain intentionally deferred until hallucination and evidence controls
have been operationalised.

---

## Quality Gates

Run from repo root, one at a time:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```
