# TSDoc and Documentation Hygiene

Operationalises [ADR-127 (Documentation as Foundational Infrastructure)](../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md)
and the **Misleading docs are blocking** principle in
[`.agent/directives/principles.md` § Code Quality](../directives/principles.md).

See [`.agent/directives/principles.md` § Document Everywhere](../directives/principles.md)
for canonical TSDoc syntax and style rules.

Two surfaces operationalised by this rule:

1. **TSDoc presence and quality** (per § Document Everywhere) —
   public functions, types, and modules carry TSDoc explaining
   intent, contract, and trade-offs.
2. **Misleading-doc detection** (per § Code Quality "Misleading
   docs are blocking") — when a code or doctrine change invalidates
   surrounding docs (TSDoc, READMEs, ADRs, PDRs, runbooks), the
   docs MUST be fixed in the same landing. Misleading docs cause
   more harm than missing docs (missing docs prompt verification;
   misleading docs are trusted and acted on). Composes with PDR-026
   §Landing target definition (the symmetric landing-time pair).
