# Invoke Specialist Experts

Operationalises [ADR-114 (Layered Sub-agent Prompt Composition)](../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

After non-trivial changes, invoke specialist experts. `code-expert`
remains the current gateway reviewer: triage what changed, choose the
specialists and review depth needed, capture findings explicitly, and act on
them before considering the work complete.

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy.
